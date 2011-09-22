//Setup our namespace 
//App not app. Android webview may use var app
Ext.ns('App', 'App.login', 'App.tabs', 'App.profile', 'App.licences', 'App.users', 'App.news', 'App.timeout', 'App.prefrences'); 
App.stores = []; // eventually push all the below into this maybe?
App.users.stores = [];
App.licences.stores = [];
App.profile.stores = [];
App.news.stores = [];
var ea;

$fh.ready(function() {
 // TODO: Detect android (pad/phones/both?) and if so, config.animation = false
});