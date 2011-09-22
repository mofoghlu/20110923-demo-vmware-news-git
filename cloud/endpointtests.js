var main = require("./main.js");
var log = require("./lib/log/log.js");
var xmlMapper = require("./lib/soap/xmlmapper.js");

//
// Authentication Endpoint Test
//
//var authReq = {
//    "request" : {
//        "head" : {
//            "id" : "1231231231231231"
//        },
//        "payload" : {
//            "login" : {
//                "userId" : "jim.hahn@astronics.com",
//                "password" : "test123"
//            }
//        }
//    }
//};
//
//log.info("Endpoint Request: " + JSON.stringify(authReq));
//jsonResult = main.authenticateAction(authReq, function(err, jsonResult) {
//    log.info("Endpoint Response:" + JSON.stringify(jsonResult));
//});

//
// Logout Endpoint Test
//
//var logoutReq = {
//        "request" : {
//            "head" : {
//                "id" : "1231231231231231",
//                "sessionId" : "12312312312312"
//            },
//            "payload" : {
//                "logout" : {}
//            }
//        }
//};
//
//log.info("Endpoint Request: " + JSON.stringify(logoutReq));
//jsonResult = main.logoutAction(logoutReq, function(err, jsonResult) {
//    log.info("Endpoint Response:" + JSON.stringify(jsonResult));
//});

//
// User Profile Request
//
//var userProfileReq = {
//        "request" : {
//            "head" : {
//                "id" : "1231231231231231"
//            },
//            "payload" : {
//                "profile" : {}
//            }
//        }
//};
//
//log.info("User Profile Endpoint Request: " + JSON.stringify(userProfileReq));
//jsonResult = main.userProfileAction(userProfileReq, function(err, jsonResult) {
//    log.info("User Profile Endpoint Response: " + JSON.stringify(jsonResult));
//});

//
// Get Entitlement Account Details
//
//var eaDetailsReq = {
//        "request" : {
//            "head" : {
//                "id" : "1231231231231231",
//                "sessionId" : "123123123121231"
//            },
//            "payload" : {
//                "eaccts" : ["90051"]
//            }
//        }
//};
//
//log.info("EA Details Endpoint Request: " + JSON.stringify(eaDetailsReq));
//jsonResult = main.entitlementAccountDetailsAction(eaDetailsReq, function(err, jsonResult) {
//    log.info("EA Details Endpoint Response: " + JSON.stringify(jsonResult));
//});

//
// Folders and User Access Details
//
//var userAccessDetailsReq = {
//        "request" : {
//            "head" : {
//                "id" : "1231231231231231"
//            },
//            "payload" : {
//                "eaccts" : ["90051"]
//            }
//        }
//};
//
//log.info("User Access Details Endpoint Request: " + JSON.stringify(userAccessDetailsReq));
//jsonResult = main.userAccessDetailsAction(userAccessDetailsReq, function(err, jsonResult) {
//    log.info("User Access Details Endpoint Response: " + JSON.stringify(jsonResult));
//});

//
// Set Permissions
//
//var setPermissionsReq = {
//        "request": {
//            "head": {
//                "id": "1231231231231231",
//                "sessionId": "123fde12323423423423d98230"
//            }
//"payload": {
//    "accessDetails": {
//        "eAcctId": "123123123",
//        "folders": [f123, f124, f125],
//        "users": [u123, u124, u125],
//        "permissions": {
//            "permission01": {
//                "isSet": true
//            },
//            "permission02": {
//                "isSet": true
//            },
//            "permission03": {
//                "isSet": true
//            }
//        }
//    }
//}
//        }
//};
//
//log.info("User Access Details Endpoint Request: " + JSON.stringify(setPermissionsReq));
//jsonResult = main.setPermissionAction(setPermissionsReq, function(err, jsonResult) {
//    log.info("User Access Details Endpoint Response: " + JSON.stringify(jsonResult));
//});

//var input = '<?xml version="1.0" encoding="UTF-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Header><head:RequestHeader xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:head="http://www.vmware.com/middleware/common/2010/04/HeaderData" xmlns:user="http://www.vmware.com/it/mw/entitlement/UserManagement" xmlns:ent="http://www.vmware.com/it/mw/entitlement/EntitlementUser"><head:TransactionInfo><head:TransactionID/></head:TransactionInfo></head:RequestHeader></soapenv:Header><soap-env:Body xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/"><ent:GetPermissionsResponse xmlns:ent="http://www.vmware.com/it/mw/entitlement/EntitlementUser"><ent:folderUserPermissionList xmlns:ns2="http://www.vmware.com/it/mw/entitlement/EntitlementManagement" xmlns:ns3="http://www.vmware.com/it/mw/entitlement/UserManagement"><ent:folderUserPermission><ent:folder id="80541"><ns2:name>HOME: 90051</ns2:name><ns2:fullFolderPath>HOME: 90051</ns2:fullFolderPath><ns2:status>ACTIVE</ns2:status></ent:folder><ent:userPermissionList><ent:userPermission><ent:entitlementUser><ent:user id="84849"><ns3:name><ns3:firstName>JIM</ns3:firstName><ns3:lastName>HAHN</ns3:lastName></ns3:name><ns3:email>JIM.HAHN@ASTRONICS.COM</ns3:email><ns3:customerNumber>1810500054</ns3:customerNumber></ent:user><ent:roleList><ns3:role><ns3:code>SU</ns3:code><ns3:description>IT SUPER USER</ns3:description></ns3:role><ns3:role><ns3:code>PU</ns3:code><ns3:description>PROCUREMENT SUPER USER</ns3:description></ns3:role></ent:roleList></ent:entitlementUser><ent:permissionList inherited="false"><ns3:permission><ns3:code>PERMISSION01</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION02</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION03</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION04</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION05</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION06</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION07</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION08</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION09</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION10</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION11</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION12</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION13</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION14</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION15</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission></ent:permissionList><ent:permissionList inherited="true"><ns3:permission><ns3:code>PERMISSION01</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION02</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION03</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION04</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION05</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION06</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION07</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION08</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION09</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION10</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION11</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION12</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION13</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION14</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION15</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission></ent:permissionList></ent:userPermission></ent:userPermissionList></ent:folderUserPermission><ent:folderUserPermission><ent:folder id="80542"><ns2:name>JIM.HAHN@ASTRONICS.COM</ns2:name><ns2:fullFolderPath>HOME: 90051\JIM.HAHN@ASTRONICS.COM</ns2:fullFolderPath><ns2:parentFolderID>80541</ns2:parentFolderID><ns2:rootFolderId>80541</ns2:rootFolderId><ns2:status>ACTIVE</ns2:status></ent:folder><ent:userPermissionList><ent:userPermission><ent:entitlementUser><ent:user id="84849"><ns3:name><ns3:firstName>JIM</ns3:firstName><ns3:lastName>HAHN</ns3:lastName></ns3:name><ns3:email>JIM.HAHN@ASTRONICS.COM</ns3:email><ns3:customerNumber>1810500054</ns3:customerNumber></ent:user><ent:roleList><ns3:role><ns3:code>SU</ns3:code><ns3:description>IT SUPER USER</ns3:description></ns3:role><ns3:role><ns3:code>PU</ns3:code><ns3:description>PROCUREMENT SUPER USER</ns3:description></ns3:role></ent:roleList></ent:entitlementUser><ent:permissionList inherited="false"><ns3:permission><ns3:code>PERMISSION01</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION02</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION03</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION04</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION05</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION06</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION07</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION08</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION09</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION10</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION11</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION12</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION13</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION14</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION15</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission></ent:permissionList><ent:permissionList inherited="true"><ns3:permission><ns3:code>PERMISSION01</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION02</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION03</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION04</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION05</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION06</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION07</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION08</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION09</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION10</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION11</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION12</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION13</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION14</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION15</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission></ent:permissionList></ent:userPermission><ent:userPermission><ent:entitlementUser><ent:user id="282551"><ns3:name><ns3:firstName>John</ns3:firstName><ns3:lastName>Mussell</ns3:lastName></ns3:name><ns3:email>JOHN.MUSSELL@ASTRONICS.COM</ns3:email><ns3:customerNumber>5275681923</ns3:customerNumber></ent:user><ent:roleList/></ent:entitlementUser><ent:permissionList inherited="false"><ns3:permission><ns3:code>PERMISSION01</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION02</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION03</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION04</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION05</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION06</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION07</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION08</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION09</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION10</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION11</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION12</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION13</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION14</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION15</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission></ent:permissionList><ent:permissionList/></ent:userPermission></ent:userPermissionList></ent:folderUserPermission><ent:folderUserPermission><ent:folder id="80543"><ns2:name>JOHN.MUSSELL@ASTRONICS.COM</ns2:name><ns2:fullFolderPath>HOME: 90051\JOHN.MUSSELL@ASTRONICS.COM</ns2:fullFolderPath><ns2:parentFolderID>80541</ns2:parentFolderID><ns2:rootFolderId>80541</ns2:rootFolderId><ns2:status>ACTIVE</ns2:status></ent:folder><ent:userPermissionList><ent:userPermission><ent:entitlementUser><ent:user id="84849"><ns3:name><ns3:firstName>JIM</ns3:firstName><ns3:lastName>HAHN</ns3:lastName></ns3:name><ns3:email>JIM.HAHN@ASTRONICS.COM</ns3:email><ns3:customerNumber>1810500054</ns3:customerNumber></ent:user><ent:roleList><ns3:role><ns3:code>SU</ns3:code><ns3:description>IT SUPER USER</ns3:description></ns3:role><ns3:role><ns3:code>PU</ns3:code><ns3:description>PROCUREMENT SUPER USER</ns3:description></ns3:role></ent:roleList></ent:entitlementUser><ent:permissionList inherited="false"><ns3:permission><ns3:code>PERMISSION01</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION02</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION03</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION04</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION05</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION06</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION07</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION08</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION09</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION10</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION11</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION12</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION13</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION14</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION15</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission></ent:permissionList><ent:permissionList inherited="true"><ns3:permission><ns3:code>PERMISSION01</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION02</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION03</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION04</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION05</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION06</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION07</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION08</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION09</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION10</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION11</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION12</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION13</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION14</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION15</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission></ent:permissionList></ent:userPermission><ent:userPermission><ent:entitlementUser><ent:user id="282551"><ns3:name><ns3:firstName>John</ns3:firstName><ns3:lastName>Mussell</ns3:lastName></ns3:name><ns3:email>JOHN.MUSSELL@ASTRONICS.COM</ns3:email><ns3:customerNumber>5275681923</ns3:customerNumber></ent:user><ent:roleList/></ent:entitlementUser><ent:permissionList inherited="false"><ns3:permission><ns3:code>PERMISSION01</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION02</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION03</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION04</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION05</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION06</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION07</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION08</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION09</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION10</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION11</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION12</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION13</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION14</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION15</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission></ent:permissionList><ent:permissionList/></ent:userPermission><ent:userPermission><ent:entitlementUser><ent:user id="1046634"><ns3:name><ns3:firstName>Nate</ns3:firstName><ns3:lastName>Roy</ns3:lastName></ns3:name><ns3:email>NATE.ROY@ASTRONICS.COM</ns3:email><ns3:customerNumber>2514421806</ns3:customerNumber></ent:user><ent:roleList/></ent:entitlementUser><ent:permissionList inherited="false"><ns3:permission><ns3:code>PERMISSION01</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION02</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION03</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION04</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION05</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION06</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION07</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION08</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION09</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION10</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION11</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION12</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION13</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION14</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION15</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission></ent:permissionList><ent:permissionList/></ent:userPermission></ent:userPermissionList></ent:folderUserPermission><ent:folderUserPermission><ent:folder id="80580"><ns2:name>NO SC FOLDER</ns2:name><ns2:fullFolderPath>HOME: 90051\NO SC FOLDER</ns2:fullFolderPath><ns2:parentFolderID>80541</ns2:parentFolderID><ns2:rootFolderId>80541</ns2:rootFolderId><ns2:status>ACTIVE</ns2:status></ent:folder><ent:userPermissionList><ent:userPermission><ent:entitlementUser><ent:user id="84849"><ns3:name><ns3:firstName>JIM</ns3:firstName><ns3:lastName>HAHN</ns3:lastName></ns3:name><ns3:email>JIM.HAHN@ASTRONICS.COM</ns3:email><ns3:customerNumber>1810500054</ns3:customerNumber></ent:user><ent:roleList><ns3:role><ns3:code>SU</ns3:code><ns3:description>IT SUPER USER</ns3:description></ns3:role><ns3:role><ns3:code>PU</ns3:code><ns3:description>PROCUREMENT SUPER USER</ns3:description></ns3:role></ent:roleList></ent:entitlementUser><ent:permissionList/><ent:permissionList inherited="true"><ns3:permission><ns3:code>PERMISSION01</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION02</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION03</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION04</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION05</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION06</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION07</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION08</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION09</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION10</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION11</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION12</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION13</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION14</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION15</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission></ent:permissionList></ent:userPermission></ent:userPermissionList></ent:folderUserPermission><ent:folderUserPermission><ent:folder id="1000000246"><ns2:name>Production</ns2:name><ns2:fullFolderPath>HOME: 90051\JIM.HAHN@ASTRONICS.COM\Production</ns2:fullFolderPath><ns2:parentFolderID>80542</ns2:parentFolderID><ns2:status>ACTIVE</ns2:status></ent:folder><ent:userPermissionList><ent:userPermission><ent:entitlementUser><ent:user id="84849"><ns3:name><ns3:firstName>JIM</ns3:firstName><ns3:lastName>HAHN</ns3:lastName></ns3:name><ns3:email>JIM.HAHN@ASTRONICS.COM</ns3:email><ns3:customerNumber>1810500054</ns3:customerNumber></ent:user><ent:roleList><ns3:role><ns3:code>SU</ns3:code><ns3:description>IT SUPER USER</ns3:description></ns3:role><ns3:role><ns3:code>PU</ns3:code><ns3:description>PROCUREMENT SUPER USER</ns3:description></ns3:role></ent:roleList></ent:entitlementUser><ent:permissionList/><ent:permissionList inherited="true"><ns3:permission><ns3:code>PERMISSION01</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION02</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION03</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION04</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION05</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION06</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION07</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION08</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION09</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION10</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION11</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION12</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION13</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION14</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION15</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission></ent:permissionList></ent:userPermission><ent:userPermission><ent:entitlementUser><ent:user id="282551"><ns3:name><ns3:firstName>John</ns3:firstName><ns3:lastName>Mussell</ns3:lastName></ns3:name><ns3:email>JOHN.MUSSELL@ASTRONICS.COM</ns3:email><ns3:customerNumber>5275681923</ns3:customerNumber></ent:user><ent:roleList/></ent:entitlementUser><ent:permissionList/><ent:permissionList inherited="true"><ns3:permission><ns3:code>PERMISSION01</ns3:code><ns3:isSet>true</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION02</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION03</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION04</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION05</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION06</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION07</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION08</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION09</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION10</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION11</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION12</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION13</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION14</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission><ns3:permission><ns3:code>PERMISSION15</ns3:code><ns3:isSet>false</ns3:isSet></ns3:permission></ent:permissionList></ent:userPermission></ent:userPermissionList></ent:folderUserPermission></ent:folderUserPermissionList><ent:readTime>123123</ent:readTime></ent:GetPermissionsResponse></soap-env:Body></soapenv:Envelope>';
//console.log(input);
//var output = xmlMapper.xmlToJson(input);
//console.log(JSON.stringify(output));