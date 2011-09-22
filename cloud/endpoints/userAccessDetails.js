/**
 * NodeJS module: Encapsulates the logic for the User Access Details Endpoint.
 * 
 * @author Roshan
 */

// Dependencies
var utils = require('../utils');
var async = require('../lib/async/async');
var entitlementUserService = require("../services/entitlementUser");
var log = require("../lib/log/log.js");

var UserAccessDetailsEndpoint = function() {

    // Exposed operations
    this.getUserAccessPermissions = getUserAccessPermissions;

    // Final response object from this endpoint.
    var respJson = utils.constructResponseJson();

    /**
     * Fetch User Access Details Permission Endpoint Endpoint API
     */
    function getUserAccessPermissions(params, callback) {

        // Final response object.
        var endpointRespJson = utils.constructResponseJson();

        // Loop this for each EA
        // Using a async for loop structure in-line with the NodeJS style of things.
        endpointRespJson.response.payload.eaccts = {};        
        var eaList = params.request.payload.eaccts;      
        async.forEachSeries(eaList, function(eaNumber, forCb) {

            // Add key for this EA
            endpointRespJson.response.payload.eaccts[eaNumber] = {};

            // Invoke the EntitlementUser:getPermissions Service
            entitlementUserService.getPermissions(eaNumber, function(wsRespData) {
                processGetPermissionResponse(eaNumber, wsRespData, endpointRespJson);

                // Invoke the EntitlementUser:getList Service
                entitlementUserService.getList(eaNumber, function(wsRespData) {
                    processGetListResponse(eaNumber, wsRespData, endpointRespJson);
                    forCb();
                }, function(errObj) {
                    
                    // Error
                    var endpointErrRespJson = utils.constructResponseJson();
                    endpointErrRespJson.response.payload.error = {
                            "status": -1,
                            "message": "Internal server error invoking Web Service"
                    };                    
                    forCb(endpointErrRespJson);
                    
                })
                
            }, function(errObj) {
                
                // Error
                var endpointErrRespJson = utils.constructResponseJson();
                endpointErrRespJson.response.payload.error = {
                        "status": -1,
                        "message": "Internal server error invoking Web Service"
                };                
                forCb(endpointErrRespJson);
                
            });

        }, function(errObj) {            
            if(errObj == null) {
                // For loop completed successfully.
                callback(endpointRespJson);                
            } else {
                // This callback invoked preemptively with an error object.
                callback(errObj);
            }
        });
        

    } // getUserAccessPermissions()

    /**
     * Mapping the response of the GetList service to the required JSON output.
     * 
     * @param serviceResponse
     * @param respJson
     */
    function processGetListResponse(eaNumber, serviceResponse, endpointRespJson) {

        var nsMap = serviceResponse._namespaces;
        var payload = serviceResponse._xml;

        // Namespace prefixes
        var nspEU = utils.getNsPrefix(nsMap, entitlementUserService.NS_EU);
        var nspUSER = utils.getNsPrefix(nsMap, entitlementUserService.NS_USER);

        var userListParent = payload[nspEU + "GetListResponse"][nspEU + "userList"];
        var userList = utils.enforceArray(userListParent, nspEU + "entitlementUser");

        var eUsers = {};
        for (i in userList) {

            var entitlementUser = userList[i];
            var user = entitlementUser[nspEU + "user"];

            // Extract the user properties that we need.
            var userId = user._attrs.id;
            var name = user[nspUSER + "name"]
            var firstName = name[nspUSER + "firstName"]["_value"];
            var lastName = name[nspUSER + "lastName"]["_value"];
            var email = user[nspUSER + "email"]["_value"];
            var customerNumber = user[nspUSER + "customerNumber"]["_value"];

            // Determine list of folders that this user has access to.
            var eFolderAccessList = [];
            var folderList = endpointRespJson.response.payload.eaccts[eaNumber].folders;
            for (folderId in folderList) {
                var folder = folderList[folderId];
                var accessList = folder.access;
                if (accessList[userId] != null) {
                    // Ok this user, has access to folderId
                    eFolderAccessList.push(folderId);
                }
            }

            // Thats our user object in the final response.
            eUsers[userId] = {
                "firstName" : firstName,
                "lastName" : lastName,
                "email" : email,
                "customerNumber" : customerNumber,
                "folders" : eFolderAccessList
            };

        }

        // Finally, phew! Insert into the response dto.
        endpointRespJson.response.payload.eaccts[eaNumber].users = eUsers;

    } // processGetListServiceResponse()

    /**
     * Mapping the response of the GetPermissions service to the required JSON
     * output.
     * 
     * @param serviceResponse
     * @param respJson
     */
    function processGetPermissionResponse(eaNumber, serviceResponse, endpointRespJson) {

        var nsMap = serviceResponse._namespaces;
        var payload = serviceResponse._xml;

        // Namespace prefixes
        var nspEM = utils.getNsPrefix(nsMap, entitlementUserService.NS_EM);
        var nspEU = utils.getNsPrefix(nsMap, entitlementUserService.NS_EU);
        var nspUSER = utils.getNsPrefix(nsMap, entitlementUserService.NS_USER);

        var folderUserPermissionListP = payload[nspEU + "GetPermissionsResponse"][nspEU + "folderUserPermissionList"];
        var folderUserPermissionList = utils.enforceArray(folderUserPermissionListP, nspEU + "folderUserPermission");

        // Iterate over every item in this list.
        var eFolders = {};
        for (i in folderUserPermissionList) {

            var folderUserPermission = folderUserPermissionList[i];
            var folder = folderUserPermission[nspEU + "folder"];
            var folderId = folder._attrs.id;
            var folderName = folder[nspEM + "name"]["_value"];
            var folderPath = folder[nspEM + "fullFolderPath"]["_value"];

            var eFolder = {
                "folderName" : folderName,
                "folderPath" : folderPath
            };

            // User permissions within the folder.
            var userPermissionListParent = folderUserPermission[nspEU + "userPermissionList"];
            var userPermissionList = utils.enforceArray(userPermissionListParent, nspEU + "userPermission");

            // Iterate over all userPermission objects of this folder.
            var eAccess = {};
            for (j in userPermissionList) {

                var userPermission = userPermissionList[j];
                var user = userPermission[nspEU + "entitlementUser"][nspEU + "user"];
                var userId = user._attrs.id;

                // In the XSD there is a cardinality of 2 for this. Not sure
                // why?
                var permissionListParents = userPermission[nspEU + "permissionList"];
                var permissionListParent1 = permissionListParents[1];
                var permissionList = utils.enforceArray(permissionListParent1, nspUSER + "permission");

              // Finally, now iterate thru each permissions object.
                var eUser = {};
                for (k in permissionList) {
                    var permission = permissionList[k];
                    var code = permission[nspUSER + "code"]["_value"];
                    var isSet = permission[nspUSER + "isSet"]["_value"];
                    eUser[code] = {
                        "isSet" : isSet
                    };
                }
                eAccess[userId] = eUser;

            }

            eFolder["access"] = eAccess;
            eFolders[folderId] = eFolder;

        }

        // Finally, phew! Insert into the response dto.
        var eacct = endpointRespJson.response.payload.eaccts[eaNumber];
        eacct.folders = eFolders;

    } // processGetPermissionServiceResponse()

    /**
     * This hardcoded response method is offered only as a backup. Not invoking
     * this in the mainline code anymore.
     */
    /*
    function constructDummyResponse(endpointRespJson) {

        var eaccts = {
            "123123123123121" : {
                "name" : "Acme 1 Corp",
                "folders" : {
                    "f1" : {
                        "name" : "FolderOne",
                        "parent" : null,
                        "children" : [2, 3],
                        "access" : {
                            "u123" : {
                                "access" : true,
                                "perm1" : true,
                                "perm2" : false,
                                "perm3" : true
                            },
                            "u124" : {
                                "access" : false
                            },
                            "u125" : {
                                "access" : true,
                                "perm1" : false,
                                "perm2" : false,
                                "perm3" : true
                            }
                        }
                    },
                    "f2" : {
                        "name" : "ChildOne",
                        "parent" : 1,
                        "children" : null
                    },
                    "f3" : {
                        "name" : "ChildTwo",
                        "parent" : 1,
                        "children" : null,
                        "access" : {
                            "u126" : {
                                "access" : true,
                                "perm1" : false,
                                "perm2" : true,
                                "perm3" : false
                            }
                        }
                    },
                    "users" : {
                        "u123" : {
                            "name" : "JohnDoe",
                            "email" : "johndoe@vmware.com",
                            "folders" : ["f1", "f2"]
                        },
                        "u124" : {
                            "name" : "JaneDoe",
                            "email" : "janedoe@vmware.com",
                            "folders" : ["f1", "f2", "f3"]
                        }
                    }
                }
            }
        };

        // Finally, phew! Insert into the response dto.
        endpointRespJson.response.payload.eaccts = eaccts;

    } // constructDummyResponse()
    */
  
}; // UserAccessDetailsEndpoint

// Export Module
module.exports = new UserAccessDetailsEndpoint();
