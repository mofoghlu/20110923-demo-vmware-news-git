/**
 * NodeJS module encapsulating the EntitlementAccountService client.
 */
var utils = require('../utils');
var log = require("../lib/log/log.js");
var soapClient = require("../lib/soap/soap.js");
var serviceConfig = require("./serviceConfig.js");


/*
 * EntitlementAccount Service client class
 */
var EntitlementAccountService = function() {

    // Exposed operations
    this.getEntitlementAccountList = getEntitlementAccountList;
    this.getEntitlementAccountDetails = getEntitlementAccountDetails;

    // Namespaces
    this.NS_HEAD = "http://www.vmware.com/middleware/common/2010/04/HeaderData";
    this.NS_EA = "http://www.vmware.com/it/mw/entitlement/EntitlementAccount";
    this.NS_USER = "http://www.vmware.com/it/mw/entitlement/UserManagement";

    // Service parameters.
    var SERVICE_HOST = serviceConfig.host;
    var SERVICE_PORT = serviceConfig.port;
    var SERVICE_SECURE = serviceConfig.secure;
    var SERVICE_URI = "/services/EntitlementAccountService";

    /**
     * Fetch Entitlement Account list.
     */
    function getEntitlementAccountList(email, successCallback, errorCallback) {

        // Hardcoded input parameters for the service call
        var serviceInput = {
            "_namespaces" : {
                "head" : this.NS_HEAD,
                "ent" : this.NS_EA,
                "user" : this.NS_USER
            },
            "_header" : {
                "head:RequestHeader" : {
                    "head:TransactionInfo" : {
                        "head:TransactionID" : {}
                    }
                }
            },
            "_body" : {
                "ent:GetListRequest" : {
                    "ent:user" : {
                        "user:email" : {
                            "_value" : email
                        }
                    }
                }
            }
        };

        // Service parameters
        var serviceParams = {
            host : SERVICE_HOST,
            port : SERVICE_PORT,
            secure : SERVICE_SECURE,
            uri : SERVICE_URI,
            action : "getList",
            soapVersion : soapClient.SOAPv11
        };

        // Invoke Fetch EntAccountdetail list Web Service
        soapClient.soapRequest(serviceInput, serviceParams, function(wsRespJson) {
            log.info("EA List Web Service Response: " + JSON.stringify(wsRespJson));
            successCallback(wsRespJson);
        }, function(errObj) {
            errorCallback(errObj);
        });

    } // getEntitlementAccountList()

    /**
     * Fetch EntitlementAccount Details
     */
    function getEntitlementAccountDetails(eaNumber, successCallback, errorCallback) {

        // Service Input
        var serviceInput = {
            "_namespaces" : {
                "head" : NS_HEAD,
                "ent" : NS_EA
            },
            "_header" : {
                "head:RequestHeader" : {
                    "head:TransactionInfo" : {
                        "head:TransactionID" : {}
                    }
                }
            },
            "_body" : {
                "ent:GetDetailsRequest" : {
                    "ent:entitlementAccountNumber" : {
                        "_value" : eaNumber
                    }
                }
            }
        };

        // Service parameters
        var serviceParams = {
            host : SERVICE_HOST,
            port : SERVICE_PORT,
            secure : SERVICE_SECURE,
            uri : "/services/EntitlementAccountService",
            action : "getDetails",
            soapVersion : soapClient.SOAPv11
        };

        // Invoke EntitlementAccount Details Web Service
        soapClient.soapRequest(serviceInput, serviceParams, function(wsRespJson) {
            log.info("EA Details Web Service Response: " + JSON.stringify(wsRespJson));
            successCallback(wsRespJson);
        }, function(errObj) {
            errorCallback(errObj);
        });

    } // getEntitlementAccountDetails()

}; // EntitlementAccountService

// Export Module
module.exports = new EntitlementAccountService();