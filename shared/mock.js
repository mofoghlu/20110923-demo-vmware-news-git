var services = {};

services["EntitlementAccountService"] = {
    create : function(requestingUserDetails, entitlementAccountDetails){
		var entitlementAccountDetails = "";
		return entitlementAccountDetails;
	},
	update : function(){
	
	},
	validate : function(){
	
	},
	getList : function(requestingUserDetails, parentEntitlementAccountNumber){
	  var ret = {
	  	"requestingUserDetails" : requestingUserDetails,
		"parentEntitlementAccountNumber" : parentEntitlementAccountNumber
	  }
	  return ret;
	}
}

services["AccountService"] = {
    create : function(requestingUserDetails, entitlementAccountDetails){
	  var entitlementAccountDetails = "";
  	  return entitlementAccountDetails;
   },
   getList : function(requestingUserDetails, parentEntitlementAccountNumber){
	  var ret = {
	  	"account" : requestingUserDetails,
		"id" : parentEntitlementAccountNumber
	  }
	  return ret;
	}
}