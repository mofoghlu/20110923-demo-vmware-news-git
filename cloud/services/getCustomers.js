/**
 * NodeJS module: Encapsulates the logic to invoke the Get Customer service
 * client.
 */

// Dependencies
var utils = require('../utils');
var log = require("../lib/log/log.js");
var soapClient = require("../lib/soap/soap.js");
var serviceConfig = require("./serviceConfig.js");

/**
 * GetCustomers Service client class.
 * 
 * @returns
 */
var GetCustomersService = function() {

    // Exposed operations
    this.getCustomer = getCustomer;

    // Namespaces
    this.NS_GETCUSTOMERS = "http://www.vmware.com/middleware/services/Customer/2010/04/GetCustomers";
    this.NS_CUSTOMER = "http://www.vmware.com/middleware/mdm/schema/2010/04/Customer";

    // Service parameters.
    var SERVICE_HOST = serviceConfig.host;
    var SERVICE_PORT = serviceConfig.port;
    var SERVICE_SECURE = serviceConfig.secure;
    var SERVICE_URI = "/services/GetCustomers";

    /**
     * Fetch User Profile Endpoint API
     */
    function getCustomer(email, successCallback, errorCallback) {

        log.info("Get Customer Request:" + email);

        //
        // Invoke the GetCustomers Service
        //

        // Service Input
        var serviceInput = {
            '_namespaces' : {
                "get" : this.NS_GETCUSTOMERS,
                "cus" : this.NS_CUSTOMER
            },

            '_header' : {},

            '_body' : {
                "get:GetCustomersRequest" : {
                    "get:customerQuery" : {
                        "cus:CustomerKey" : {
                            "cus:EmailAddress" : {
                                "_value" : email
                            }
                        }
                    },
                    "get:PromoteCustomer" : "false"
                }
            }
        };

        // Service parameters.
        var serviceParams = {
            host : SERVICE_HOST,
            port : SERVICE_PORT,
            uri : SERVICE_URI,
            secure : SERVICE_SECURE,
            action : "process",
            soapVersion : soapClient.SOAPv11
        };

        // Invoke service.
        soapClient.soapRequest(serviceInput, serviceParams, function(wsRespJson) {
            log.info("Get Customers Web Service Response: " + JSON.stringify(wsRespJson));
            successCallback(wsRespJson);
        }, function(errObj) {
            errorCallback(errObj);
        });
    }

}; // GetCustomersService

// Export Module
module.exports = new GetCustomersService();