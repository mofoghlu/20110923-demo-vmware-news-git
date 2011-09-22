/**
 * NodeJS module: Encapsulates the logic for the User Profile Endpoint.
 * 
 * @author Roshan
 */

// Dependencies
var utils = require('../utils');
var async = require('../lib/async/async');
var entitlementService = require("../services/entitlement.js");
var log = require("../lib/log/log.js");

var EntitlementAccountDetailsEndpoint = function () {

    // Exposed operations
    this.getEntitlementAccountDetails = getEntitlementAccountDetails;    
   
    /**
     * Invoke the getFolderKeyList operation in the EntitlementAccount.
     */
    function getEntitlementAccountDetails(params, custNumber, callback) {
        
        // TODO: Validate input
        
        // Final response from this endpoint.
        var endpointRespJson = utils.constructResponseJson();          
        endpointRespJson.response.payload.eaccts = {};
        
        // Iterate over all the requested EAs
        var eaList = params.request.payload.eaccts;
        async.forEachSeries(eaList, function(eaNumber, forCb) {

            // Add key for this EA
            endpointRespJson.response.payload.eaccts[eaNumber] = {};

            // Invoke the Entitlement Web Service
            entitlementService.getEntitlementFolderKeyList(eaNumber, custNumber, function(wsRespData) {
                
                // Success
                processGetFolderKeyListResponse(eaNumber, wsRespData, endpointRespJson);
                forCb();
                
            }, function(errObj) {
                
                // Error
                var endpointErrRespJson = utils.constructResponseJson();
                endpointErrRespJson.response.payload.error = {
                        "status": -1,
                        "message": "Internal server error invoking Web Service"
                };
                
                forCb(endpointErrRespJson);
                
            });
            
        },
        function(errObj) {            
            if(errObj == null) {
                // For loop completed successfully.
                callback(endpointRespJson);                
            } else {
                // This callback invoked preemptively with an error object.
                callback(errObj);
            }
        });
        
    }
  
    
    /**
     * Mapping of the service response into the JSON required for the endpoint
     * output.
     */
    function processGetFolderKeyListResponse(eaNumber, serviceResponse, endpointRespJson) {
    
        // TODO: Validate if correct response. Throw exceptions otherwise.
        var nsMap = serviceResponse._namespaces;
        var payload = serviceResponse._xml;

        // Namespace prefixes
        var nspENT = utils.getNsPrefix(nsMap, entitlementService.NS_ENT);
        var nspUSER = utils.getNsPrefix(nsMap, entitlementService.NS_USER);
        var nspEM = utils.getNsPrefix(nsMap, entitlementService.NS_EM);        
        
        var folderKeyListParent = payload[nspENT + "GetEntitlementFolderKeyListResponse"][nspENT + "folderKeysList"];
        var folderKeyList = utils.enforceArray(folderKeyListParent, nspENT + "folderKeys");

        var eFolders = {};
        var eProducts = {};
        var eLicenses = {};
        
        // Iterate over every folder.
        for(var i in folderKeyList) {
            
            var folderKey = folderKeyList[i];
            var folder = folderKey[nspENT + "folder"];
            var folderId = folder._attrs.id;
            var folderName = folder[nspEM + "name"]["_value"];
            var folderPath = folder[nspEM + "fullFolderPath"]["_value"];

            eFolders[folderId] = {
                    "name": folderName,
                    "path": folderPath,
                    "parent": null,
            }

            // Product Group details
            var keyProductGroupListParent = folderKey[nspENT + "keyProductGroupList"];
            var keyProductGroupList =  utils.enforceArray(keyProductGroupListParent, nspENT + "keyProductGroup");
            
            // Iterate over every ProductGroup item.
            for(var j in keyProductGroupList) {
                
                var keyProductGroup = keyProductGroupList[j];
                
                // Process the Product Group details
                var productGroup = keyProductGroup[nspENT + "productGroup"];                
                var productGroupCode = productGroup[nspEM + "groupCode"]["_value"];
                var primaryDescription = productGroup[nspEM + "primaryDescription"]["_value"];
                var secondaryDescription = productGroup[nspEM + "secondaryDescription"]["_value"];
                var unitOfMeasure = productGroup[nspEM + "unitOfMeasure"][nspEM + "code"]["_value"];

                // If this product is not already in the products set, add it.
                if(!eProducts.hasOwnProperty(productGroupCode)) {
                    eProducts[productGroupCode] = {
                            "primaryDescription": primaryDescription,
                            "secondaryDescription": secondaryDescription,
                            "unitOfMeasure": unitOfMeasure,
                            "licenses": []
                        }                    
                }

                // Process the key details
                var key = keyProductGroup[nspENT + "key"];
                var keyId = key._attrs.id;
                var keyValue = key[nspEM + "value"]["_value"];
                var keyQuantity = key[nspEM + "quantity"]["_value"];
                var expirationDate = (key[nspEM + "expirationDate"] != null)? key[nspEM + "expirationDate"]["_value"]: "";
                
                // Add this license key under the corresponding product too.
                eProducts[productGroupCode].licenses.push(keyId);
                
                // Add this license key to the set of license keys
                var eLicenseKey = {
                        "key": keyValue,
                        "productId": productGroupCode,
                        "folderId": folderId,
                        "quantity": keyQuantity,
                  // TODO:ANKUR:REMOVE THE BELOW LINE AFTER ACTUAL SERVICE TO GET OTHER LICENSE DETAILS IS IN PLACE.
                         "expirationDate": "2011-10-20",
                         "cpuMetric": 5,
                         "notes": "License Notes",
                         "supportLevel": "Subscription",
                         "contractNum": "123123123",
                         "orderNum": "23768728",
                         "orderDt": "2011-06-06",
                         "poNum": "9754467"
                };                
                eLicenses[keyId] = eLicenseKey;
                
            }
            
        }

        // Finally, phew! Insert into the response DTO.
        endpointRespJson.response.payload.eaccts[eaNumber] = {
                "folders": eFolders,
                "products": eProducts,
                "licenses": eLicenses
        };
        
    } // functionProcessGetFolderKeyListResponse()

    
    /**
     * Hardcoded response from the service. Not being invoked in the mainline
     * code. This function exists if we need to generate any dummy responses.
     */
    /*
    function getFolder(serviceResponse,respJson) {
        var eaccts = {

                "123123123123121": {
                    "name": "Acme1Corp",
                    "folders": {
                        "1": {
                            "name": "FolderOne",
                            "parent": null,
                            "children": [
                                         2,
                                         3
                                         ]
                        },
                        "2": {
                            "name": "ChildOne",
                            "parent": 1,
                            "children": null
                        },
                        "3": {
                            "name": "ChildTwo",
                            "parent": 1,
                            "children": null
                        }
                    },
                    "products": {
                        "11": {
                            "folderId": 2,
                            "name": "Fusion3",
                            "note": "Somesecondarynotehere",
                            "licenses": [
                                         789,
                                         788,
                                         787
                                         ]
                        },
                        "12": {
                            "folderId": 3,
                            "name": "vSphere4",
                            "note": "Somesecondarynotehere",
                            "licenses": [
                                         889,
                                         888,
                                         887
                                         ]
                        }
                    },
                    "licenses": {
                        "L22": {
                            "key": "123123-12312312-12312312",
                            "productId": "11",
                            "folderId": "2",
                            "cpuMetric": 5,
                            "notes": "FooBarNotes",
                            "supportLevel": "SUBS",
                            "expires": "2011-06-06",
                            "qty": 1,
                            "contractNum": "123123123",
                            "orderNum": "123123123",
                            "orderDt": "2011-06-06",
                            "poNum": "123123123"
                        }
                    }
                },
        };
        respJson.response.payload.eaccts = eaccts;
    }*/
    
};

// Export Module
module.exports = new EntitlementAccountDetailsEndpoint();
