/**
 * NodeJS module: Encapsulates the logic for the User Profile Endpoint.
 * 
 * @author Roshan
 */

// Dependencies
var utils = require('../utils');
var getCustomersService = require("../services/getCustomers.js");
var entitlementAccountService = require("../services/entitlementAccount.js");
var log = require("../lib/log/log.js");

/**
 * User Profile Endpoint.
 * 
 * @returns
 */
var UserProfileEndpoint = function() {

    // Exposed operations
    this.getUserProfile = getUserProfile;

    /**
     * Fetch User Profile Endpoint API
     */
    function getUserProfile(params, email, callback) {

        log.info("Get User Profile Request:" + JSON.stringify(params));

        //
        // Series of service calls to fetch and massage the data.
        // 

        // Final response object.
        var endpointRespJson = utils.constructResponseJson();
        
        // Error response object.
        var endpointErrRespJson = utils.constructResponseJson();
        endpointErrRespJson.response.payload.error = {
            "status" : -1,
            "message" : "Internal server error invoking Web Service"
        };

        // Invoke the GetCustomers:process Service
        getCustomersService.getCustomer(email, function(wsRespJson) {
            processGetCustomersServiceResponse(wsRespJson, endpointRespJson);

            // Invoke the EntitlementAccount:getList Service
           entitlementAccountService.getEntitlementAccountList(email, function(wsRespJson) {
                processGetEntitlementAccountListServiceResponse(wsRespJson, endpointRespJson);

                // TODO: Invoke service for User Preferences
                processUserPreferencesServiceResponse(null, endpointRespJson);
              
                // Finally return to the caller of this endpoint.
                callback(endpointRespJson);
                
            }, function(errorObj) {

                // Error
                callback(endpointErrRespJson);

            });
           
       }, function(errorObj) {

           // Error
           callback(endpointErrRespJson);

       });

    } // getUserProfile()

    /**
     * Process response of the GetCustomers Service.
     * 
     * @param serviceResponse
     * @param respJson
     */
    function processGetCustomersServiceResponse(serviceResponse, respJson) {

        // TODO: Validate if we got a correct response. Throw exceptions
        // otherwise.

        var nsMap = serviceResponse._namespaces;
        var payload = serviceResponse._xml;

        // Namespace prefixes
        var nspC = utils.getNsPrefix(nsMap, getCustomersService.NS_CUSTOMER);
        var nspGC = utils.getNsPrefix(nsMap, getCustomersService.NS_GETCUSTOMERS);

        // Extract required elements from the response.
        var account = payload[nspGC + "GetCustomersResponse"][nspGC + "Customers"][nspC + "Customer"][nspC + "Account"];
        var custNum = account[nspC + "AECustomerNumber"]["_value"];
        var fName = account[nspC + "FirstName"]["_value"];
        var sName = account[nspC + "LastName"]["_value"];
        var email = account[nspC + "EmailAddress"]["_value"];

        var profile = {
            "custNum" : custNum,
            "fName" : fName,
            "sName" : sName,
            "email" : email,
            "pphone" : "",
            "ophone" : ""
        };

        // Set this at the correct position within the payload.
        respJson.response.payload.profile = profile;

    } // processGetCustomersServiceResponse()

    /**
     * Process response of the Get Entitlement Account List Service
     * 
     * @param serviceResponse
     * @param respJson
     */
    function processGetEntitlementAccountListServiceResponse(serviceResponse, respJson) {

        // TODO: Validate if serviceResponse is positive or something failed.
        var nsMap = serviceResponse._namespaces;
        var payload = serviceResponse._xml;

        // Namespace prefixes
        var nspEA = utils.getNsPrefix(nsMap, entitlementAccountService.NS_EA);
        var nspUSER = utils.getNsPrefix(nsMap, entitlementAccountService.NS_USER);

        // Get array of EAs from the response
        var eaListParent = payload[nspEA + "GetListResponse"][nspEA + "entitlementAccountUserRoleAssociationList"];
        var eaList = utils.enforceArray(eaListParent, nspEA + "entitlementAccountUserRoleAssociation");

        // Iterate over all EAs in the response
        var eAccts = [];
        for (i in eaList) {

            var ea = eaList[i];
            eAccts.push({
                "id" : ea[nspEA + "entitlementAccountNumber"]["_value"],
                "name" : ea[nspEA + "entitlementAccountName"]["_value"]
            });

        }

        respJson.response.payload.eAccts = eAccts;

    } // processGetEntitlementAccountListServiceResponse()

    /**
     * Process response from the User Profile Service.
     * 
     * @param serviceResponse
     * @param respJson
     */
    function processUserPreferencesServiceResponse(serviceResponse, respJson) {

        // TODO: This is a hardcoded response for now.
        var preferences = {
            "code1" : {
                "title" : "Manage Entitlement Accounts",
                "isSet" : true,
                "desc" : "Some description, may be help text"
            },
            "code2" : {
                "title" : "Manage Folders",
                "isSet" : true,
                "desc" : "Some description, may be help text"
            },
            "code3" : {
                "title" : "Manage User Access",
                "isSet" : false,
                "desc" : "Some description or help text"
            }
        };
        
        respJson.response.payload.preferences = preferences;
        
    }

}; // UserProfileEndpoint

// Export Module
module.exports = new UserProfileEndpoint();