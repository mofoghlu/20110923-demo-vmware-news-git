/**
 * NodeJS module: Encapsulates the logic for the User Profile Endpoint.
 * 
 * @author Roshan
 */

// Dependencies
var utils = require('../utils');
var entitlementUser = require("../services/entitlementUser.js");
var log = require("../lib/log/log.js");

var SetPermissionEndpoint = function() {

    // Exposed operations
    this.setUserAccessPermission = setUserAccessPermission;

    /**
     * Fetch setUserAccess Permission Endpoint Endpoint API
     */
    function setUserAccessPermission(params, callback) {

        // Request JSON
        var serviceReq = createServiceRequest(params);

        // Response JSON
        var respJson = utils.constructResponseJson();

        entitlementUser.setPermissions(serviceReq, function(respData) {

            // Success
            processSetPermissionServiceResponse(respData, respJson);
            callback(respJson);

        }, function(errorObj) {

            // Error
            var endpointErrRespJson = utils.constructResponseJson();
            endpointErrRespJson.response.payload.error = {
                "status" : -1,
                "message" : "Internal server error invoking Web Service"
            };

            callback(endpointErrRespJson);

        });

    }

    
    /**
     * Process the response from the setPermissions call.
     * 
     * @param serviceResponse
     * @param respJson
     */
    function processSetPermissionServiceResponse(serviceResponse, respJson) {

        var nsMap = serviceResponse._namespaces;
        var payload = serviceResponse._xml;

        // Namespace prefixes
        var nspEU = utils.getNsPrefix(nsMap, entitlementUser.NS_EU);

        var status = payload[nspEU + "SetPermissionsResponse"][nspEU + "status"];
        var setPermissionResp = {
            "status" : 1,
            "msg" : "Permissions successfully set."
        };

        if (status != 1) {
            setPermissionResp = {
                "status" : status,
                "msg" : "Error Setting Permissions."
            };
        }

        respJson.response.payload = setPermissionResp;
    }

    function createServiceRequest(params) {

        var serviceReqBody = {};

        var folderIdList = params.request.payload.accessDetails.folders;
        var userIdList = params.request.payload.accessDetails.users;
        var reqPermissions = params.request.payload.accessDetails.permissions;

        var folderUserPermissionList = [];

        // for loop level 1
        for ( var i = 0; i < folderIdList.length; i++) {
            var folderUserPermission = {};
            var folderId = folderIdList[i];
            folderUserPermission = {
                "ent:folder" : {
                    "_attrs" : {
                        "id" : folderId
                    }
                }
            };

            var userPermissionList = [];
            // for loop level 2
            for ( var j = 0; j < userIdList.length; j++) {
                var userId = userIdList[j];
                var userPermission = {
                    "ent:entitlementUser" : {
                        "ent:user" : {
                            "_attrs" : {
                                "id" : userId
                            }
                        }
                    }
                };
                // create permissions List
                var permissionList = [];
                permissionList[0] = {
                    "_attrs" : {
                        "inherited" : true
                    }
                };

                // inner permission list that holds actual permissions details
                var innerPermList = [];
                var innerPermListIndex = 0;
                // for loop level 3
                for (key in reqPermissions) {
                    var innerPerm = {
                        "user:code" : {
                            "_value" : key
                        },
                        "user:isSet" : {
                            "_value" : reqPermissions[key]["isSet"]
                        }
                    };

                    innerPermList[innerPermListIndex] = innerPerm;
                    innerPermListIndex++;
                } // for loop level 3 ends
                permissionList[0]["user:permission"] = innerPermList;

                userPermission["ent:permissionList"] = permissionList;
                userPermissionList[j] = {
                    "ent:userPermission" : userPermission
                };
            } // for loop level 2 ends

            folderUserPermission["ent:userPermissionList"] = userPermissionList;
            folderUserPermissionList[i] = {
                "ent:folderUserPermission" : folderUserPermission
            };
        } // for loop level 1 ends
        var serviceReqBody = {
            "ent:folderUserPermissionList" : folderUserPermissionList
        };

        return serviceReqBody;
    }
};
// Export Module
module.exports = new SetPermissionEndpoint();
