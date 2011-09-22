/**
l * NodeJS Module for XML to JSON (and reverse) mappings.
 * 
 * @author Roshan
 * @author Ankur
 */

// Dependencies
var libxmljs = require("libxmljs");
var log = require("../log/log.js");

// JSON Keys which have special meaning.
var KEY_NAMESPACES = "_namespaces";
var KEY_XML = "_xml";
var KEY_ATTRS = "_attrs";
var KEY_VALUE = "_value";
var KEY_NS = "_ns";

/**
 * Class encapsulates the conversion logic between XML and JSON mapping.
 * 
 * @author Roshan
 * @author Ankur
 */
var XmlJsonMapper = function() {

    // Public Methods. (All other methods get a private scope).
    this.xmlToJson = xmlToJson;
    this.jsonToXml = jsonToXml;

    //
    // XML to JSON Conversion
    //

    /**
     * Transform the given xmlStr into an equivalent JSON object and return the
     * JSON object.
     */
    function xmlToJson(xmlStr) {

        // TODO: Trap any parsing exceptions and rethrow exception for this.
        var doc = libxmljs.parseXmlString(xmlStr);

        var jsonRoot = {};
        var nsMap = {};
        var jsonPayload = {};

        // Recursively traverse the XML root and map it into the jsonParent
        // object.
        processXmlToJson(doc.root(), jsonPayload, nsMap);

        // Construct the payload wrapper JSON.
        var outerJsonPayload = {};
        var rootJsonKey = getQualifiedElemName(doc.root(), nsMap);
        outerJsonPayload[rootJsonKey] = jsonPayload;

        // Wrap the namespaces and jsonpayload into a final json obj.
        jsonRoot[KEY_NAMESPACES] = nsMap;
        jsonRoot[KEY_XML] = outerJsonPayload;
        return jsonRoot;

    };

    /**
     * Recursively process the input XML tree to transform it into an equivalent
     * JSON. This is the key function which drives the entire mapping.
     */
    function processXmlToJson(xmlElem, jsonParent, nsMap) {

        //
        // Extract and process the namespace of this xmlElem
        //
        var xmlNs = xmlElem.namespace();
        if (xmlNs != null) {
            namespaceManager(xmlNs.prefix(), xmlNs.href(), nsMap);
        }

        //
        // Process all attributes of this xmlElem
        //
        if (xmlElem.attrs().length > 0) {
            jsonParent[KEY_ATTRS] = processAttributes(xmlElem, nsMap);
        }

        //
        // Process all child nodes of this element. Iterate thru all child
        // nodes.
        // If the tree is nested, then invoke recursive calls further down.
        // Note: Some of the child nodes could be text elements (not nested
        // tags).
        //
        var xmlChildNodes = xmlElem.childNodes();
        for (var j in xmlChildNodes) {

            var xmlChildElem = xmlChildNodes[j];
            var xmlChildType = xmlChildElem.type();

            if (xmlChildType === "text") {
                                
                // This is a text element (not a child tag).
                if (xmlChildElem.text() && xmlChildElem.text().trim().length > 0) {
                    jsonParent[KEY_VALUE] = xmlChildElem.text().trim();
                }
                
            } else {
                
                // This is a XML child tag. Create a new JSON child element and
                // recursively process the xmlChildElem.
                var jsonChild = {};
                processXmlToJson(xmlChildElem, jsonChild, nsMap);

                // Add jsonChild under jsonParent.
                var qXmlChildName = getQualifiedElemName(xmlChildElem, nsMap);
                appendToParent(jsonParent, qXmlChildName, jsonChild);
            }

        }

    };

    /**
     * Compute a new as-of-yet unused prefix. Generate a unique prefix that has
     * not yet been used in the nsMap.
     * 
     * @param nsMap
     * @returns {String}
     */
    function generateNewNSPrefix(nsMap) {

        // Search for an unused prefix in the nsMap
        var prefix = "";
        for (i = 0; i < 10000; i++) {
            prefix = "ns" + i;
            if (nsMap[prefix] == null) {
                // Found a non-colliding prefix. Use it!
                break;
            }
        }
        return prefix;

    } // generateNewNSPrefix()

    /**
     * Manage the pool of Namespace definitions contained in nsMap. - If
     * specified href exists in the map, return its corresponding prefix. - If
     * specified href does not exist in the map, add it to the map and return
     * the corresponding prefix back.
     */
    function namespaceManager(prefix, href, nsMap) {

        // Check if this href is already in the map?
        for (var p in nsMap) {

            // Skip any prototype properties that occur.
            if (!nsMap.hasOwnProperty(p)) {
                continue;
            }

            var h = nsMap[p];
            if (h === href) {
                // This namespace already exists in the Map
                log.debug(prefix + ":" + href + "| Namespace found: " + p + ":" + h);
                return p;
            }

        }

        // Reached here means, HREF was not found in the map. Time to add it.

        // If prefix was not specified. Create our own non-colliding prefix.
        if (prefix == null) {
            np = generateNewNSPrefix(nsMap);
            nsMap[np] = href;
            return np;
        }

        // Prefix was specified. If no collision, use that. Else, create our own
        // non-colliding prefix.
        if (!nsMap.hasOwnProperty(prefix)) {
            // No collision.
            nsMap[prefix] = href;
            log.debug(prefix + ":" + href + " | Namespace created: " + prefix + ":" + href);
            return prefix;
        } else {
            // Prefix collision occured. Means a prefix was "redefined" in XML
            // at this point.
            // However since we don't have a notion of prefix redefinition in
            // our JSON, we simply generate our own non-colliding prefix.
            np = generateNewNSPrefix(nsMap);
            nsMap[np] = href;
            log.debug(prefix + ":" + href + " | Namespace created: " + np + ":" + href);
            return np;
        }

    } // namespaceManager()

    /**
     * Extract all attributes of the given xmlElem and translate those into a
     * JSON Object. Return that JSON object. Also, if attributes have namespace
     * definitions, add those to the nsMap.
     */
    function processAttributes(xmlElem, nsMap) {

        // Json object container for attribute name-value pairs.
        var jsonAttrsObj = {};

        var xmlAttrArray = xmlElem.attrs();
        for ( var i in xmlAttrArray) {

            var xmlAttr = xmlAttrArray[i];
            var xmlAttrNs = xmlAttr.namespace();

            var jsonAttrQName = xmlAttr.name();
            var jsonAttrVal = xmlAttr.value();

            // If attribute has a namespace.
            if (xmlAttrNs != null) {
                var prefix = namespaceManager(xmlAttrNs.prefix(), xmlAttrNs.href(), nsMap);
                jsonAttrQName = prefix + ":" + xmlAttr.name();
            }

            jsonAttrsObj[jsonAttrQName] = jsonAttrVal;

        }

        return jsonAttrsObj;

    };

    /**
     * Append the given jsonChildObj under the jsonParent.
     */
    function appendToParent(jsonParent, jsonChildName, jsonChildObj) {

        // Check if we need a simple object or an array.
        if (jsonParent[jsonChildName] == null) {

            // Simple Object
            jsonParent[jsonChildName] = jsonChildObj;

        } else if (jsonParent[jsonChildName] instanceof Array) {

            // Append to an existing child array.
            var childArr = jsonParent[jsonChildName];
            childArr.push(jsonChildObj);

        } else {

            // Create a new child array and put the old and new elements in it.
            var oldChild = jsonParent[jsonChildName];
            var childArr = [];
            childArr.push(oldChild);
            childArr.push(jsonChildObj);
            jsonParent[jsonChildName] = childArr;

        }

    };

    /**
     * From the given xmlElem extract the qualified string name of this element.
     */
    function getQualifiedElemName(xmlElem, nsMap) {

        var xmlElemName = xmlElem.name();
        var xmlNs = xmlElem.namespace();

        if(xmlNs == null) {            
            return xmlElemName;            
        } else {            
            var prefix = namespaceManager(xmlNs.prefix(), xmlNs.href(), nsMap);
            return prefix + ":" + xmlElemName;            
        }

    };

    /**
     * Return the trimmed version of the given string.
     */
    function trim(string) {
        return string.replace(/^\s*|\s*$/, '');
    };

    //
    // JSON to XML Conversion
    //

    /**
     * Translate the given JSON Object Tree into equivalent XML.
     */
    function jsonToXml(jsonRoot) {

        // Top-level JSON properties
        var namespaces = jsonRoot[KEY_NAMESPACES];
        var xmlPayload = jsonRoot[KEY_XML];

        // Extract the root element of the XML.
        for ( var rootKey in xmlPayload) {
            // Skip any properties that have come from the prototype inhertance.
            if (!xmlPayload.hasOwnProperty(root)) {
                continue;
            }

            // Stop at the first element, since we consider that as our XML root
            // element.
            break;
        }

        // Split root key to check for namespace prefix
        var keyElems = rootKey.split(":");
        if (keyElems.length == 1) {
            var rootName = keyElems[0];
        } else if (keyElems.length == 2) {
            var rootNsAlias = keyElems[0];
            var rootName = keyElems[1];
        }

        // Construct XML document and root element.
        var xmlDoc = new libxmljs.Document();
        var xmlRootElement = new libxmljs.Element(xmlDoc, rootName);
        xmlDoc.root(xmlRootElement);

        // Add all namespace definitions to the XML root element.
        for ( var prefix in namespaces) {
            // Skip any inhertied prototype properties.
            if (!namespaces.hasOwnProperty(prefix)) {
                continue;
            }
            uri = namespaces[prefix];
            var xmlNs = new libxmljs.Namespace(xmlRootElement, prefix, uri);
        }

        // Does root have a namespace alias? If so, define it.
        if (rootNsAlias != null) {
            // Does our namespaceMap have this alias?
            if (namespaces[rootNsAlias]) {
                // Lookup the namespace object in our namespace set.
                var href = namespaces[rootNsAlias];
                xmlRootElement.namespace(href);
            } else {
                log.debug("Bad namespace prefix: " + rootNsAlias);
            }
        }

        // Recursively traverse the JSON tree to construct XML.
        jsonRootVal = xmlPayload[rootKey];
        processJsonToXml(jsonRootVal, xmlRootElement, namespaces);

        // Logging the generated XML.
        return xmlDoc;

    };

    /*
     * Recurively traverse thru the JSON Object tree and construct a
     * corresponding XML. This function is recursive.
     */
    function processJsonToXml(jsonParent, xmlParent, namespaceMap) {

        // Iterate over all child keys.
        for ( var childKey in jsonParent) {

            // Don't pick properties from the Object.prototype chain. Just pick
            // direct properties.
            if (!jsonParent.hasOwnProperty(childKey)) {
                continue;
            }

            var childVal = jsonParent[childKey];

            //
            // Property name is "_attrs"? childVal is expected to be a JSON
            // object of attr name-value pairs.
            // Process attributes if any.
            //
            if (childKey == KEY_ATTRS) {
                mapAttributes(xmlParent, childVal, namespaceMap);
                continue;
            }

            //
            // Process text value of the node if any.
            //
            if (childKey == KEY_VALUE) {
                mapValue(xmlParent, childVal);
                continue;
            }

            //
            // All other property names, are treated as nested child elements of
            // the xmlParent.
            // Process nested child elements of the node.
            //

            // Extract the Tag Name and NS Alias of the child tag from the JSON
            // key.
            var childName = getNodeName(childKey);
            var href = getNodeNsHref(childKey, namespaceMap);

            // Does this element have multiplicity?
            if (childVal instanceof Array) {

                // This element has multiplicity.
                for (child in childVal) {

                    // Create the child element.
                    var newChild = new libxmljs.Element(xmlParent.doc(), childName);
                    xmlParent.addChild(newChild);

                    // This element has a namespace alias.
                    if (href != null) {
                        newChild.namespace(href);
                    }

                    // TODO: Handle other kinds of scalar children such as
                    // integer and date.
                    childObj = childVal[child];
                    if (typeof childObj === 'string') {
                        // Scalar child.
                        newChild.text(childObj);
                    } else if (typeof childObj === 'object') {
                        // Child has nested elements beneath. Recurse to the next level.
                        processJsonToXml(childObj, newChild, namespaceMap);
                    }

                }

            } else {

                // This element has a single instance.

                // Create the child element.
                var newChild = new libxmljs.Element(xmlParent.doc(), childName);
                xmlParent.addChild(newChild);

                // This element has a namespace alias.
                if (href != null) {
                    newChild.namespace(href);
                }

                // TODO: Handle other kinds of scalar children such as integer
                // and date.
                if (typeof childVal === 'string') {
                    // Scalar child.
                    newChild.text(childVal);
                } else if (typeof childVal === 'object') {
                    // Child having nested elements beneath. Recurse to the next
                    // level.
                    processJsonToXml(childVal, newChild, namespaceMap);
                }

            }

        }
    };

    /**
     * Convert a JSON Object (key-value pairs) into a set of XML attributes.
     * These attributes get attached to the given xmlNode.
     * 
     * @param xmlNode
     *            XMLElement
     * @param jsonAttribsObj
     *            JSON Object which contains the (name,value) pairs representing
     *            the attributes.
     * @param namespaceMap
     *            Map of (aliases,href) of the various namespaces. This map can
     *            be looked-up if attributes have namespace aliases.
     * 
     */
    function mapAttributes(xmlNode, jsonAttribsObj, namespaceMap) {

        // Validate input
        if (xmlNode == null) {
            log.error('Bad parameter passed for xmlNode. Skipping.');
            return;
        }

        if (jsonAttribsObj == null || !typeof jsonAttribsObj === 'object') {
            log.error('Bad parameter passed for mapping attributes. Skipping.');
            return;
        }

        // Iterate thru all attributes and map to XML
        for ( var attribKey in jsonAttribsObj) {

            // Get name, namespace href and the value of attribute. The alias
            // prefix is optional.
            var attribName = getNodeName(attribKey);
            var attribNsHref = getNodeNsHref(attribKey, namespaceMap);
            var attribVal = jsonAttribsObj[attribKey];

            // Construct the XML DOM Attribute attached to xmlNode.
            var xmlAttr = new libxmljs.Attribute(xmlNode, attribName, attribVal);

            // Attach namespace to the attribute if needed.
            if (attribNsHref != null) {
                xmlAttr.namespace(attribNsHref);
            }

        }

    };

    /**
     * Map the scalar value under a tag.
     */
    function mapValue(xmlNode, jsonVal) {

        if (jsonVal != null && typeof jsonVal === 'string') {
            xmlNode.text(jsonVal);
        } else {
            // TODO Also handle other types of scalar values.
            log.warn("Ignoring scalar value:" + jsonVal);
        }

    };

    /*
     * Extract the node name from the given string. The input string can be
     * "ns1:employee" (qualified with a namespace alias) or "employee" (without
     * namespace alias). In either cases, the token "employee" will be returned
     * by this function.
     * 
     * @param key A qualified or unqualified name of an XML Element or
     * Attribute.
     */
    function getNodeName(key) {

        var keyElems = key.split(":");
        if (keyElems.length == 1) {
            return keyElems[0];
        } else if (keyElems.length == 2) {
            return keyElems[1];
        }

    };

    /**
     * Extract the node namespace alias from the given string. The input string
     * can be "ns1:employee" (qualified with a namespace alias) or "employee"
     * (without namespace alias). In the first case, "ns1" is returned. In the
     * second case, null is returned.
     * 
     * @param key
     *            A qualified or unqualified name of an XML Element or
     *            Attribute.
     */
    function getNodeNsAlias(key) {

        // Extract the Tag Name and NS Alias of the child tag from the JSON key.
        var keyElems = key.split(":");
        if (keyElems.length == 1) {
            return null;
        } else if (keyElems.length == 2) {
            return keyElems[0];
        }

    };

    /**
     * First, extract the namespace alias from the key. Then map this alias to
     * an actual namespace href by a lookup in the namespaceMap.
     * 
     * @param key
     *            A qualified or unqualified name of an XML Element or
     *            Attribute.
     * @param namespaceMap
     *            A map containing namespace aliases mapped to namespace URL.
     */
    function getNodeNsHref(key, namespaceMap) {

        // Input Validations
        if (key == null) {
            log.warn('Bad parameter for key provided. Skipping.');
        }

        if (namespaceMap == null || !typeof namespaceMap === 'object') {
            log.warn('Bad parameter for namespaceMap provided. Skipping.');
            return;
        }

        // Extract the Tag Name and NS Alias of the child tag from the JSON key.
        var childNsAlias = getNodeNsAlias(key);

        // This element has a namespace alias, get the namespace href from the
        // alias.
        if (childNsAlias != null) {
            // Does our namespaceMap have this alias?
            if (namespaceMap[childNsAlias]) {
                return namespaceMap[childNsAlias];
            } else {
                log.error("Bad namespace prefix. Definition not found: " + childNsAlias);
                return null;
            }
        }

    };

}; // XmlJsonMapper

// Export this module.
module.exports = new XmlJsonMapper();
