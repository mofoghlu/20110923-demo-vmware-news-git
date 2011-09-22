/**
 * Class conataining utility
 */

var Utils = function() {

  // Expose all the utility functions here
  this.constructResponseJson = constructResponseJson;
  this.isBlank = isBlank;
  this.getNsPrefix = getNsPrefix;
  this.enforceArray = enforceArray;
  
  /**
   * Construct a placeholder template for the Response JSON message.
   */
  function constructResponseJson() {
    return response = {
      "response" : {
        "head" : {
          "id" : "123123"
        },
        "payload" : {}
      }
    };
  }

  // TODO: Move this to common utils.
  function isBlank(field) {
    if (!field || field.trim().length <= 0)
      return true;
    else
      return false;
  }

  /**
   * Fetch the NS Prefix for the specified Href from the given namespace map.
   *
   * @param nsMap
   * @param href
   * @returns {String}
   */
  function getNsPrefix(nsMap, href) {
    for (key in nsMap) {
      if (!nsMap.hasOwnProperty(key)) {
        continue;
      }
      if (nsMap[key] === href) {
        return key + ":";
        break;
      }
    }
  }
          
  /**
   * When converting XML to JSON, we are not able to infer if something was
   * meant to be a single object or an array (since we don't refer to the
   * schema at that time). This method is invoked to enforce an array
   * structure around a single element. That can make subsequent processing
   * simpler and consistent.
   * 
   * @param jsonObj
   * @param key
   * @returns
   */
  function enforceArray(jsonObj, key) {

      var elem = jsonObj[key];
      
      if(elem == null)
          return [];

      // Is this an array of a single instance?
      if (elem instanceof Array) {
          return jsonObj[key];;
      } else {
          jsonObj[key] = [jsonObj[key]];
          return jsonObj[key];;
      }

  }  
  
}; // End Class Utils

// Export Module
module.exports = new Utils();