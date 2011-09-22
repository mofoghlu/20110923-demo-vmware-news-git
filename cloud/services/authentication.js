/**
 * NodeJS module: Encapsulates the logic for the Authentication SOAP service
 * client.
 */

// Dependencies
var utils = require('../utils');
var log = require("../lib/log/log.js");
var soapClient = require("../lib/soap/soap.js");
var serviceConfig = require("./serviceConfig.js");

/**
 * Authentication Service client class.
 */
var AuthenticationService = function() {

    // Exposed operations
    this.authenticateUser = authenticateUser;

    // Namespaces
    this.NS_AUTH = "http://Authenticationservice/";

    // Service parameters.
    var SERVICE_HOST = serviceConfig.host;
    var SERVICE_PORT = serviceConfig.port;
    var SERVICE_SECURE = serviceConfig.secure;
    var SERVICE_URI = "/AuthenticationService/AuthenticationServiceSoap12HttpPort";

    /**
     * Invoke the Authentication service API.
     */
    function authenticateUser(userId, password, successCallback, errorCallback) {

        // Request payload for the web service call.
        var serviceInput = {
            "_namespaces" : {
                "aut" : "http://Authenticationservice/"
            },
            "_header" : {},
            "_body" : {
                "aut:getObSSOCookieElement" : {
                    "aut:userId" : {
                        "_value" : userId
                    },
                    "aut:Pwd" : {
                        "_value" : password
                    },
                    "aut:URL" : {
                        "_value" : "dr-qaiwebsvc-vip.vmware.com/vmdrws/rum/login"
                    }
                }
            }
        };

        // Authentication service parameters
        var serviceParams = {
            host : SERVICE_HOST,
            port : SERVICE_PORT,
            secure : SERVICE_SECURE,
            uri : SERVICE_URI,
            action : "http://Authenticationservice//getObSSOCookie",
            soapVersion : soapClient.SOAPv12
        };

        // Invoke Authentication Web Service
        soapClient.soapRequest(serviceInput, serviceParams, function(wsRespJson) {
            log.info("Login Web Service Response: " + JSON.stringify(wsRespJson));
            successCallback(wsRespJson);
        }, function(errObj) {
            errorCallback(errObj);
        });

    } // authenticateUser()

}; // AuthenticationService class ends

// Export Module
module.exports = new AuthenticationService();