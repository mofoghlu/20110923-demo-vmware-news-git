/**
 * Module to invoke the EntitlementUser SOAP service client.
 * 
 * @author roshan
 * @author ankur
 */
var utils = require('../utils');
var log = require("../lib/log/log.js");
var soapClient = require("../lib/soap/soap.js");
var serviceConfig = require("./serviceConfig.js");

var EntitlementUserService = function() {

    // Exposed operations
    this.getList = getList;
    this.getPermissions = getPermissions; 
    this.setPermissions = setPermissions;
    
    // Namespaces
    this.NS_HEAD = "http://www.vmware.com/middleware/common/2010/04/HeaderData";
    this.NS_EM = "http://www.vmware.com/it/mw/entitlement/EntitlementManagement";
    this.NS_EU = "http://www.vmware.com/it/mw/entitlement/EntitlementUser";
    this.NS_USER = "http://www.vmware.com/it/mw/entitlement/UserManagement";

    // Service parameters.
    var SERVICE_HOST = serviceConfig.host;
    var SERVICE_PORT = serviceConfig.port;
    var SERVICE_SECURE = serviceConfig.secure;
    var SERVICE_URI = "/services/EntitlementUserService";

    /**
     * Invoke the getList operation from the EntitlementUser Web Service.
     */
    function getList(eaNumber, successCallback, errorCallback) {
        
        // TODO: Add validation for the input parameter before invoking the
        // service.

        // Service Input
        var serviceInput = {

                "_namespaces" : {
                    "head" : this.NS_HEAD,
                    "ent" : this.NS_EU,
                    "user": this.NS_USER, 
                },                
                "_header" : {            
                    "head:RequestHeader": {
                        "head:TransactionInfo": {
                            "head:TransactionID": {}
                        }
                    }
                },
                "_body" : {
                    "ent:GetListRequest" : {
                        "ent:entitlementAccountNumber" : {
                            "_value" : eaNumber
                        }
                    }
                }
        };

        // Service parameters
        var serviceParams = {
                host: SERVICE_HOST,
                port: SERVICE_PORT,
                uri: SERVICE_URI,
                secure : SERVICE_SECURE,
                action: "getList",
                soapVersion: soapClient.SOAPv11
        };

        // Invoke Get Permissions Web Service
        soapClient.soapRequest(serviceInput, serviceParams, function(wsRespJson) {
            log.info("Get User List Web Service Response: " + JSON.stringify(wsRespJson));
            successCallback(wsRespJson);
        }, function(errObj) {
            errorCallback(errObj);
        });
        
    } // getList()

    
    /**
     * Invoke the getPermissions operation from the EntitlementUser Web Service.
     */
    function getPermissions(eaNumber, successCallback, errorCallback) {

        // TODO: Add validation for the input parameter before invoking the
        // service.

        // Service Input
        var serviceInput = {

                "_namespaces" : {
                    "head" : this.NS_HEAD,
                    "ent" : this.NS_EU,
                    "user": this.NS_USER, 
                },
                "_header" : {            
                    "head:RequestHeader": {
                        "head:TransactionInfo": {
                            "head:TransactionID": {}
                        }
                    }
                },
                "_body" : {
                    "ent:GetPermissionsRequest" : {
                        "ent:entitlmentAccountNumber" : {
                            "_value" : eaNumber
                        }
                    }
                }
        };

        // Service parameters
        var serviceParams = {
                host: SERVICE_HOST,
                port: SERVICE_PORT,
                uri: SERVICE_URI,
                secure : SERVICE_SECURE, 
                action: "getPermissions",
                soapVersion: soapClient.SOAPv11
        };

        // Invoke Get Permissions Web Service
        soapClient.soapRequest(serviceInput, serviceParams, function(wsRespJson) {
            log.info("Get Permissions Web Service Response: " + JSON.stringify(wsRespJson));
            successCallback(wsRespJson);
        }, function(errObj) {
            errorCallback(errObj);
        });
        
    } // getPermissions()

    
    /**
     * Invoke the getPermissions operation from the EntitlementUser Web Service.
     * 
     * @param params
     * @param callback
     * @returns
     */
    function setPermissions(serviceReq, successCallback, errorCallback) {
        
        // var eaNumber = "1000000025";
        var serviceInput = {

                "_namespaces" : {
                    "head" : this.NS_HEAD,
                    "ent" : this.NS_EU,
                    "em" : this.NS_EM,
                    "user": this.NS_USER, 
                },                
                "_header" : {            
                    "head:RequestHeader": {
                        "head:TransactionInfo": {
                            "head:TransactionID": {}
                        }
                    }
                },
                "_body" : {
                  "ent:SetPermissionsRequest" : {
                    "user:user" : {
                      "user:email" : "PKOHLI@VMWARE.COM",
                      "user:customerNumber" : "5440696116"
                    },
                    "ent:folderUserPermissionList" : serviceReq["ent:folderUserPermissionList"]
                  }
                }
        };

        log.info("Set Permissions WS Request: " + JSON.stringify(serviceInput));
        var serviceParams = {
                host : SERVICE_HOST,
                port : SERVICE_PORT,
                uri : SERVICE_URI,
                secure : SERVICE_SECURE,
                action : "setPermissions",
                soapVersion : soapClient.SOAPv11
        };
        
        // Invoke Set Permissions Web Service
        soapClient.soapRequest(serviceInput, serviceParams, function(wsRespJson) {
            log.info("Set Permissions Web Service Response: " + JSON.stringify(wsRespJson));
            successCallback(wsRespJson);
        }, function(errObj) {
            errorCallback(errObj);
        });
        
    } // setPermission()

}; // EntitlementUserService

// Export Module
module.exports = new EntitlementUserService();
