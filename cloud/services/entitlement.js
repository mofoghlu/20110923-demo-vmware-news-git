/**
 * Module to invoke the Entitlement SOAP service client.
 * 
 * @author roshan
 * @author ankur
 */

// Dependencies
var utils = require('../utils');
var log = require("../lib/log/log.js");
var soapClient = require("../lib/soap/soap.js");
var serviceConfig = require("./serviceConfig.js");

/*
 * EntitlementService client class.
 */
var EntitlementService = function() {

    // Exposed operations
    this.getEntitlementFolderKeyList = getEntitlementFolderKeyList;
    // this.getSupportList = getSupportList;

    // Namespaces
    this.NS_HEAD = "http://www.vmware.com/middleware/common/2010/04/HeaderData";
    this.NS_ENT = "http://www.vmware.com/it/mw/entitlement/Entitlement";
    this.NS_USER = "http://www.vmware.com/it/mw/entitlement/UserManagement";
    this.NS_EM = "http://www.vmware.com/it/mw/entitlement/EntitlementManagement";

    // Service parameters.
    var SERVICE_HOST = serviceConfig.host;
    var SERVICE_PORT = serviceConfig.port;
    var SERVICE_SECURE = serviceConfig.secure;
    var SERVICE_URI = "/services/EntitlementService";

    /**
     * Fetch userProfile ent Account getList
     */
    function getEntitlementFolderKeyList(eaNumber, custNumber, successCallback, errorCallback) {

        // Service Input
        var serviceInput = {

            "_namespaces" : {
                "head" : this.NS_HEAD,
                "ent" : this.NS_ENT,
                "user" : this.NS_USER
            },

            "_header" : {
                "head:RequestHeader" : {
                    "head:TransactionInfo" : {
                        "head:TransactionID" : {
                            "_value" : "321421342314"
                        }
                    }
                }
            },

            "_body" : {
                "ent:GetEntitlementFolderKeyListRequest" : {
                    "ent:requestingUserDetails" : {
                        "user:requestingUser" : {
                            "user:customerNumber" : {
                                "_value" : custNumber
                            }
                        },
                        "user:impersonatingUser" : {
                            "user:customerNumber" : {
                                "_value" : custNumber
                            }
                        }
                    },
                    "ent:entitlementAccountNumber" : {
                        "_value" : eaNumber
                    },
                    "ent:activeKeyOnly" : {
                        "_value" : "Y"
                    }
                }
            }
        };

        var serviceParams = {
            host : SERVICE_HOST,
            port : SERVICE_PORT,
            uri : SERVICE_URI,
            secure : SERVICE_SECURE,
            action : "getEntitlementFolderKeyList",
            soapVersion : soapClient.SOAPv11
        };

        soapClient.soapRequest(serviceInput, serviceParams, function(wsRespJson) {            
            log.info("GetFolderKeyList Web Service Response: " + JSON.stringify(wsRespJson));
            successCallback(wsRespJson);
        }, function(errObj) {
            errorCallback(errObj);
        });

    } // End of getEntitlementFolderKeyList

    // fetch getSupportList
    // function getSupportList(params, callback) {
    //
    // var eaNumber = "1000000041";
    // var serviceInput = {
    // "_namespaces" : {
    // "head" : "http://www.vmware.com/middleware/common/2010/04/HeaderData",
    // "ent" : "http://www.vmware.com/it/mw/entitlement/Entitlement",
    // "user" : "http://www.vmware.com/it/mw/entitlement/UserManagement"
    // },
    // "_header" : {
    // "head:RequestHeader" : {
    // "head:TransactionInfo" : {
    // "head:TransactionID" : {
    // "_value" : "321421342314"
    // }
    // }
    // }
    // },
    // "_body" : {
    // "ent:GetSupportListRequest" : {
    // "ent:entitlementAccountNumber" : {
    // "_value" : eaNumber
    // }
    // }
    // }
    // };
    //
    // var serviceParams = {
    // host : "ext-osb-wdcqai.vmware.com",
    // port : 443,
    // secure : true,
    // uri : "/services/EntitlementService",
    // action : "getSupportList",
    // soapVersion : soapClient.SOAPv11
    // };
    //
    // soapClient.soapRequest(serviceInput, serviceParams, function(respJson) {
    // // Call to Response handlers
    // callback(respJson);
    // });
    //
    // } // End of getSupportList

};// End EntitlementService class

// Export Module
module.exports = new EntitlementService();
