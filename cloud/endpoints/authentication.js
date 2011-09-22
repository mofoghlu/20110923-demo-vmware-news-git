/**
 * NodeJS module: Encapsulates the logic for the Authentication endpoint.
 */

// Dependencies
var utils = require('../utils');
var authenticationService = require("../services/authentication.js");
var log = require("../lib/log/log.js");

/**
 * Authentication Endpoint.
 * 
 * @returns
 */
var AuthenticationEndpoint = function() {

    // Exposed operations
    this.authenticateUser = authenticateUser;

    /**
     * Authentication Endpoint API.
     */
    function authenticateUser(params, callback) {

        log.info("Authentication Endpoint Request: " + JSON.stringify(params));

        // Validate request parameters
        if (!validateAuthenticationRequest(params)) {
            var respJson = utils.constructResponseJson();
            respJson.response.payload.login = {
                "status" : -1,
                "msg" : "Username or Password not specified."
            };
            callback(respJson);
        }

        // Request parameters
        var userId = params.request.payload.login.userId;
        var passwd = params.request.payload.login.password;

        // Invoke Authentication Web Service
        authenticationService.authenticateUser(userId, passwd, function(wsRespJson) {

            // Process Web Service response
            var loginSuccessResponse = handleAuthenticationResponse(wsRespJson);
            log.info("Authentication Endpoint Response: " + JSON.stringify(loginSuccessResponse));
            callback(loginSuccessResponse);

        }, function(errorObj) {

            // Error
            var endpointErrRespJson = utils.constructResponseJson();
            endpointErrRespJson.response.payload.error = {
                    "status": -1,
                    "message": "Internal server error invoking Web Service"
            };
            
            callback(endpointErrRespJson);

        });

    } // authenticateUser()

    /**
     * Validate request parameters for the login request.
     * 
     * @return Boolean
     */
    function validateAuthenticationRequest(params) {

        if (!params || !params.request.payload.login.userId || !params.request.payload.login.password) {
            return false;
        } else if (!utils.isBlank(params.request.payload.login.userId)
                && !utils.isBlank(params.request.payload.login.password)) {
            return true;
        } else {
            return false;
        }

    } // validateLoginRequest()

    /**
     * Check if the web service response includes the cookie or not. Generate
     * appropriate JSON response message for the client device.
     */
    function handleAuthenticationResponse(respJson) {

        // Fetch the cookie value from the response.
        var ns = utils.getNsPrefix(respJson._namespaces, authenticationService.NS_AUTH);
        var returnVal = respJson._xml[ns + "getObSSOCookieResponseElement"][ns + "result"][ns + "retValue"];

        var respJson = utils.constructResponseJson();
        if (!returnVal || utils.isBlank(returnVal['_value'])) {
            respJson.response.payload.login = {
                "status" : -1,
                "msg" : "Authentication failed."
            };
        } else {
            // TODO: Include session id.
            respJson.response.payload.login = {
                "status" : 1,
                "msg" : "Authentication successful."
            };
        }

        // TODO: Piggyback more data with this?
        return respJson;
        
    } // handleAuthenticationResponse()

}; // AuthenticationEndpoint

// Export Module
module.exports = new AuthenticationEndpoint();