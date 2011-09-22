/**
 * Public REST API Endpoints exposed to client devices. - All input parameters
 * must be passed in a single JSON object. - The return 'callback' method
 * signature is 'callback (error, data)', where 'data' is a JSON object.
 * 
 * TODO: Service URLs and ports should come from the configuration and not
 * hardcoded.
 */

// Dependencies
var utils = require('./utils');
var authenticationEndpoint = require("./endpoints/authentication.js");
var userProfileEndpoint = require("./endpoints/userProfile.js");
var entitlementAccountDetailsEndpoint = require("./endpoints/entitlementAccountDetails.js");
var setPermissionEndpoint = require("./endpoints/userAccessPermissionsSet.js");
var userAccessDetailsEndpoint = require("./endpoints/userAccessDetails.js");
var log = require("./lib/log/log.js");

// Publicly exposed Endpoint APIs, for the client devices
exports.authenticateAction = authenticateAction;
exports.logoutAction = logoutAction;
exports.userProfileAction = userProfileAction;
exports.entitlementAccountDetailsAction = entitlementAccountDetailsAction;
exports.userAccessDetailsAction = userAccessDetailsAction;
exports.setPermissionAction = setPermissionAction;

// Catch-all handler for anything that goes bad. Inserted here to avoid Uncaught
// exceptions from hitting the event loop of NodeJS.
process.on('uncaughtException', function(err) {
    console.log(err);
});


/**
 * Authentication endpoint.
 */
function authenticateAction(params, callback) {
    log.info("__________________________________________________________________________________");
    // Delegate this to the authentication service.
    authenticationEndpoint.authenticateUser(params, function(respData) {
        callback(null, respData);
    });

}

/**
 * Logout Endpoint API
 */
function logoutAction(params, callback) {

    // TODO: Call to destroy the session.
    var responseJson = utils.constructResponseJson(params);
    responseJson.response.payload.logout = {
        "status" : 1,
        "msg" : "User logged out"
    };
    callback(null, responseJson);
}

/**
 * Endpoint fetches user profile, list of EAs of this user and user preferences.
 * 
 * @param params
 * @param callback
 */
function userProfileAction(params, callback) {

    // TODO: Validate if the session is active? If not, throw auth failure.
    // TODO: Get user's email address from the session. Hardcoded for now.
    var email = "JIM.HAHN@ASTRONICS.COM";
    
    // Delegate this to the user profile service.
    userProfileEndpoint.getUserProfile(params, email, function(respData) {
        callback(null, respData);
    });
}

/**
 * Endpoint returns details about folders, products, licenses under an EA.
 * 
 * @param params
 * @param callback
 */
function entitlementAccountDetailsAction(params, callback) {

    // TODO: Validate if the session is active? If not, throw auth failure.

    // TODO: Get user's customer number from the session. Hardcoded for now.
    var customerNumber = "1810500054";

    entitlementAccountDetailsEndpoint.getEntitlementAccountDetails(params, customerNumber, function(respData) {
        callback(null, respData);
    });

}

/**
 * Endpoint return details about folders and per-user permissions for folders.
 * 
 * @param params
 * @param callback
 */
function userAccessDetailsAction(params, callback) {

    userAccessDetailsEndpoint.getUserAccessPermissions(params, function(respData) {
        callback(null, respData);
    });

}

/**
 * Endpoint to set permissions of the specified users and folders.
 * 
 * @param params
 * @param callback
 */
function setPermissionAction(params, callback) {

    setPermissionEndpoint.setUserAccessPermission(params, function(respData) {
        callback(null, respData);
    });

}

exports.cacheCall = function(params, callback) {
  if (params == undefined) params = {};
  var expireTime = (params.expire != undefined && params.expire != "") ? params.expire: 10000;
  var bypass = params.bypass != undefined ? params.bypass : false;
  
  $fhserver.cache({act:'load', key: 'time'}, function (err, cachedTime) {
    if (err) return callback(err, null);    
    var currentTime = Date.now();
    console.log("cachedTime: " + cachedTime);

    if (bypass || cachedTime == null || cachedTime == undefined || (parseInt(cachedTime) + expireTime) < currentTime) {
      $fhserver.cache({act: 'save', key: 'time', value: JSON.stringify(currentTime)}, function (err) {          
        var d = new Date(parseInt(currentTime));
        return callback(err, {data: {time: d, cached: false}});
      });
    }else {
      var d = new Date(parseInt(cachedTime));
      return callback(null, {data: {time: d, cached: true}});
    }
  });
};


exports.getNews = function(params, callback) {
  

  $fh.cache(
      {
         act: 'load',
         key: 'news'
      },function (err, cachedTime) {
        if (cachedTime) console.log('retrieved cached news');
        if (err) return callback(err, null);    
        if (cachedTime) return callback(null, cachedTime);
  
        // No news data in cache. Load anew
        var feedParams = {
            'link': 'http://feeds.vmware.com/f/100003s2n11q001gsbf.rss',
            'list-max' : 100
        };

        $fh.feed(feedParams, function(err, news) {
           $fhserver.cache({act: 'save', key: 'news', value: JSON.stringify(news)}, function (err) {
            return callback(err, null);
          });
          if (!err) console.log('news cached');
          return callback(err, news);
        });
      }
  ); 
};


function getEAData(params, callback) {
    return callback(
            null,
            {
                "response" : {
                    "head" : {
                        "id1" : "1231231231231231",
                        "sessionId" : "123fde12323423423423d98230"
                    },
                    "payload" : {
                        "eaccts" : {
                            "123123123123121" : {
                                "name" : "Acme1Corp",
                                "folders" : {
                                    "1" : {
                                        "name" : "Licences Folder 1",
                                        "products" : [1, 2, 3]
                                    },
                                    "2" : {
                                        "name" : "Licences Folder 2",
                                        "children" : [182, 493],
                                        "products" : [3, 4]
                                    },
                                    "182" : {
                                        "name" : "Sub 1",
                                        "parent" : "2",
                                        "products" : [4, 5]
                                    },
                                    "493" : {
                                        "name" : "Sub 2",
                                        "parent" : "2",
                                        "products" : [5, 6]
                                    },
                                    "3" : {
                                        "name" : "Licences Folder 3",
                                        "products" : [1, 2, 3, 4, 5, 6]
                                    }
                                },
                                "products" : {
                                    "1" : {
                                        "folderId" : 2,
                                        "name" : "Fusion3",
                                        "note" : "Somesecondarynotehere",
                                        "licenses" : [889]
                                    },
                                    "2" : {
                                        "folderId" : 3,
                                        "name" : "vSphere4",
                                        "note" : "Somesecondarynotehere",
                                        "licenses" : [888]
                                    },
                                    "3" : {
                                        "folderId" : 3,
                                        "name" : "vSphere9",
                                        "note" : "Somesecondarynotehere",
                                        "licenses" : [887]
                                    },
                                    "4" : {
                                        "folderId" : 3,
                                        "name" : "vSphere8",
                                        "note" : "Somesecondarynotehere",
                                        "licenses" : [889, 888, 887]
                                    },
                                    "5" : {
                                        "folderId" : 3,
                                        "name" : "vSphere7",
                                        "note" : "Somesecondarynotehere",
                                        "licenses" : [889, 888, 887]
                                    },
                                    "6" : {
                                        "folderId" : 3,
                                        "name" : "vSphere6",
                                        "note" : "Somesecondarynotehere",
                                        "licenses" : [889, 888, 887]
                                    },
                                    "7" : {
                                        "folderId" : 3,
                                        "name" : "vSphere5",
                                        "note" : "Somesecondarynotehere",
                                        "licenses" : [889, 888, 887]
                                    }
                                },
                                "licenses" : {
                                    "889" : {
                                        "key" : "123123-12312312-12312312",
                                        "productId" : "11",
                                        "folderId" : "2",
                                        "cpuMetric" : 5,
                                        "notes" : "FooBarNotes",
                                        "supportLevel" : "SUBS",
                                        "expires" : "2011-06-06",
                                        "qty" : 1,
                                        "contractNum" : "123123123",
                                        "orderNum" : "123123123",
                                        "orderDt" : "2011-06-06",
                                        "poNum" : "123123123"
                                    },
                                    "888" : {
                                        "key" : "123123-12312312-12312312",
                                        "productId" : "11",
                                        "folderId" : "2",
                                        "cpuMetric" : 5,
                                        "notes" : "FooBarNotes FooBarNotes FooBarNotes FooBarNotes FooBarNotes FooBarNotes FooBarNotes v FooBarNotes FooBarNotes FooBarNotes FooBarNotes FooBarNotes FooBarNotes FooBarNotes FooBarNotes",
                                        "supportLevel" : "SUBS",
                                        "expires" : "2011-06-06",
                                        "qty" : 1,
                                        "contractNum" : "123123123",
                                        "orderNum" : "123123123",
                                        "orderDt" : "2011-06-06",
                                        "poNum" : "123123123"
                                    },
                                    "887" : {
                                        "key" : "123123-12312312-12312312",
                                        "productId" : "11",
                                        "folderId" : "2",
                                        "cpuMetric" : 5,
                                        "notes" : "FooBarNotes",
                                        "supportLevel" : "SUBS",
                                        "expires" : "2011-06-06",
                                        "qty" : 1,
                                        "contractNum" : "123123123",
                                        "orderNum" : "123123123",
                                        "orderDt" : "2011-06-06",
                                        "poNum" : "123123123"
                                    }

                                }
                            },
                            "12312312312312" : {},
                            "12312312312313" : {}
                        }
                    }
                }
            });

}
