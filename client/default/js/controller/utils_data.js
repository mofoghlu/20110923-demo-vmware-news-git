App.ea = "90051"; // our default EA - TODO: hardcoded for now, eventually will come from profile?
var demo = false;


/*
 * Fetch & populate all component stores from the cloud after logging in.  
 * All async. TODO: Push loadings, pop when done. Only clear busy when busyStack==0;
 */
function getDataAfterLogin(){
  loadPrefs();
  attachActivityTimeout();
  
  if (demo){
    loadDemoData();
    return;
  }
  getUserProfile(); // CALL1: Get profile data store
  loadPreferencesListDataStore(); // CALL2: Get preferences list
  //TODO Use this again getDataByEA(App.ea); // CALL3 - really 2 calls, getEAData
}



/*
 * Iterate over each part of the UI's .stores[], killing. 
 * TODO: Eventually should be iterating over just an App.data..
 */
function killDataAfterLogout(){
  for (var i=0; i<App.licences.stores.length; i++){
    killStore(App.licences.stores[i]);
  }
  for (var i=0; i<App.users.stores.length; i++){
    killStore(App.users.stores[i]);
  }
  for (var i=0; i<App.profile.stores.length; i++){
    //killStore(App.profile.stores[i]);
  }
}

/*
 * Sencha Store doesn't have a public removeAll() method - this is it for now. 
 */
function killStore(store){
  var items = [];
  store.each(function(rec){
      items.push(rec);
  });
  store.remove(items);
  store.update();
  //if (store.snapshot) store.snapshot.clear();
}

function switchEA(dom, val, ev){
  getDataByEA(val);
}

function getDataByEA(ea){
  // TODO: Wait until both these requests finish then iterate over our stores calling load(). At the moment hardcoded loads, maybe this is OK? 
  loadEntAccountDataStore(ea); // View Licences data store
  loadUsersAccessDataStore(ea) // Users & Access data store
}








function loadDemoData(){
  App.profile.userDetailStoreLeft.loadData(
      [{userKey:'First Name',userValue: 'Jim'},
       {userKey:'Second Name', userValue: 'Hahn'},
       {userKey:'Customer No.', userValue: '18105000054'}
       ], false);

  // storing data for right list
  App.profile.userDetailStoreRight.loadData(
      [{userKey:'Email',userValue: 'jim.hahn@astronics.com'},
       {userKey:'Telphone',userValue: '019394824'},
       {userKey:'Other',userValue: 'na'}
       ], false);
  
  var storeArr = [
    {
      id: '123',  
      accKey:'Astronics',
      accValue: 'Set as Default'
    },
    {
      id: '124',  
      accKey:'Bionics',
      accValue: 'Set as Default'
    }    
    ];
  App.profile.entAccountsStore.loadData(storeArr, false);
  App.profile.permissionDataStore.loadData([{permKey:'Manage Account',permValue: true,imgName :"tick1"}], false);
  App.profile.permissionDataStore.loadData([{permKey:'Manage Folders, Users & Access',permValue: false,imgName :"cross"}], false);
  App.profile.permissionDataStore.loadData([{permKey:'View Orders & Contracts',permValue: true,imgName :"tick1"}], false);
  
  
  App.profile.data = {"eAccts":[{"id":"90051","name":"ASTRONICS"}],"preferences":{"code1":{"desc":"Some description, may be help text","isSet":true,"title":"Manage Entitlement Accounts"},"code2":{"desc":"Some description, may be help text","isSet":true,"title":"Manage Folders"},"code3":{"desc":"Some description or help text","isSet":false,"title":"Manage User Access"}},"profile":{"custNum":"1810500054","email":"jim.hahn@astronics.com","fName":"JIM","ophone":"","pphone":"","sName":"HAHN"}};
  App.licences.data = {"eaccts":{"90051":{"folders":{"80541":{"name":"HOME: 90051","parent":null,"path":"HOME: 90051"},"80542":{"name":"JIM.HAHN@ASTRONICS.COM","parent":null,"path":"HOME: 90051\\JIM.HAHN@ASTRONICS.COM"},"1000000246":{"name":"Production","parent":null,"path":"HOME: 90051\\JIM.HAHN@ASTRONICS.COM\\Production"}},"licenses":{"21763":{"contractNum":"65433123","cpuMetric":5,"expirationDate":"2011-10-20","folderId":"80542","key":"1H036-6VJ4J-48032-082RH-CDQ7K","notes":"License Notes","orderDt":"2010-10-19","orderNum":"23768728","poNum":"9754467","productId":"24","quantity":"1","supportLevel":"Gold"},"21764":{"contractNum":"65433123","cpuMetric":5,"expirationDate":"2011-10-20","folderId":"80542","key":"5448J-4D312-18VQ2-A2202-9WM1J","notes":"License Notes","orderDt":"2010-10-19","orderNum":"23768728","poNum":"9754467","productId":"37","quantity":"1","supportLevel":"Gold"},"21765":{"contractNum":"65433123","cpuMetric":5,"expirationDate":"2011-10-20","folderId":"80542","key":"C540L-0E290-58LQD-AH3R2-C9F0J","notes":"License Notes","orderDt":"2010-10-19","orderNum":"23768728","poNum":"9754467","productId":"36","quantity":"50","supportLevel":"Gold"}},"products":{"24":{"licenses":["21763"],"primaryDescription":"Workstation 7","unitOfMeasure":"COMPUTER(s)"},"36":{"licenses":["21765"],"primaryDescription":"ThinApp 4 Client","unitOfMeasure":"CLIENT(s)"},"37":{"licenses":["21764"],"primaryDescription":"ThinApp 4 Virtualization Packager","unitOfMeasure":"INSTANCE(s)"}}}}};
  App.users.data = {"eaccts":{"90051":{"folders":{"80541":{"folderName":"HOME: 90051","folderPath":"HOME: 90051","access":{"84849":{"PERMISSION01":{"isSet":"true"},"PERMISSION02":{"isSet":"true"},"PERMISSION03":{"isSet":"true"},"PERMISSION04":{"isSet":"true"},"PERMISSION05":{"isSet":"true"},"PERMISSION06":{"isSet":"true"},"PERMISSION07":{"isSet":"true"},"PERMISSION08":{"isSet":"true"},"PERMISSION09":{"isSet":"true"},"PERMISSION10":{"isSet":"false"},"PERMISSION11":{"isSet":"false"},"PERMISSION12":{"isSet":"false"},"PERMISSION13":{"isSet":"false"},"PERMISSION14":{"isSet":"false"},"PERMISSION15":{"isSet":"false"}}}},"80542":{"folderName":"JIM.HAHN@ASTRONICS.COM","folderPath":"HOME: 90051\\JIM.HAHN@ASTRONICS.COM","access":{"84849":{"PERMISSION01":{"isSet":"true"},"PERMISSION02":{"isSet":"false"},"PERMISSION03":{"isSet":"false"},"PERMISSION04":{"isSet":"false"},"PERMISSION05":{"isSet":"false"},"PERMISSION06":{"isSet":"true"},"PERMISSION07":{"isSet":"false"},"PERMISSION08":{"isSet":"false"},"PERMISSION09":{"isSet":"false"},"PERMISSION10":{"isSet":"false"},"PERMISSION11":{"isSet":"false"},"PERMISSION12":{"isSet":"false"},"PERMISSION13":{"isSet":"false"},"PERMISSION14":{"isSet":"false"},"PERMISSION15":{"isSet":"false"}},"282551":{}}},"80543":{"folderName":"JOHN.MUSSELL@ASTRONICS.COM","folderPath":"HOME: 90051\\JOHN.MUSSELL@ASTRONICS.COM","access":{"84849":{"PERMISSION01":{"isSet":"true"},"PERMISSION02":{"isSet":"false"},"PERMISSION03":{"isSet":"false"},"PERMISSION04":{"isSet":"false"},"PERMISSION05":{"isSet":"false"},"PERMISSION06":{"isSet":"true"},"PERMISSION07":{"isSet":"false"},"PERMISSION08":{"isSet":"false"},"PERMISSION09":{"isSet":"false"},"PERMISSION10":{"isSet":"false"},"PERMISSION11":{"isSet":"false"},"PERMISSION12":{"isSet":"false"},"PERMISSION13":{"isSet":"false"},"PERMISSION14":{"isSet":"false"},"PERMISSION15":{"isSet":"false"}},"282551":{},"1046634":{}}},"80580":{"folderName":"NO SC FOLDER","folderPath":"HOME: 90051\\NO SC FOLDER","access":{"84849":{"PERMISSION01":{"isSet":"true"},"PERMISSION02":{"isSet":"false"},"PERMISSION03":{"isSet":"false"},"PERMISSION04":{"isSet":"false"},"PERMISSION05":{"isSet":"false"},"PERMISSION06":{"isSet":"true"},"PERMISSION07":{"isSet":"false"},"PERMISSION08":{"isSet":"false"},"PERMISSION09":{"isSet":"false"},"PERMISSION10":{"isSet":"false"},"PERMISSION11":{"isSet":"false"},"PERMISSION12":{"isSet":"false"},"PERMISSION13":{"isSet":"false"},"PERMISSION14":{"isSet":"false"},"PERMISSION15":{"isSet":"false"}}}},"1000000246":{"folderName":"Production","folderPath":"HOME: 90051\\JIM.HAHN@ASTRONICS.COM\\Production","access":{"84849":{"PERMISSION01":{"isSet":"true"},"PERMISSION02":{"isSet":"true"},"PERMISSION03":{"isSet":"true"},"PERMISSION04":{"isSet":"true"},"PERMISSION05":{"isSet":"true"},"PERMISSION06":{"isSet":"true"},"PERMISSION07":{"isSet":"true"},"PERMISSION08":{"isSet":"true"},"PERMISSION09":{"isSet":"true"},"PERMISSION10":{"isSet":"false"},"PERMISSION11":{"isSet":"false"},"PERMISSION12":{"isSet":"false"},"PERMISSION13":{"isSet":"false"},"PERMISSION14":{"isSet":"false"},"PERMISSION15":{"isSet":"false"}},"282551":{"PERMISSION01":{"isSet":"true"},"PERMISSION02":{"isSet":"false"},"PERMISSION03":{"isSet":"false"},"PERMISSION04":{"isSet":"false"},"PERMISSION05":{"isSet":"false"},"PERMISSION06":{"isSet":"false"},"PERMISSION07":{"isSet":"false"},"PERMISSION08":{"isSet":"false"},"PERMISSION09":{"isSet":"false"},"PERMISSION10":{"isSet":"false"},"PERMISSION11":{"isSet":"false"},"PERMISSION12":{"isSet":"false"},"PERMISSION13":{"isSet":"false"},"PERMISSION14":{"isSet":"false"},"PERMISSION15":{"isSet":"false"}}}}},"users":{"84849":{"firstName":"JIM","lastName":"HAHN","email":"JIM.HAHN@ASTRONICS.COM","customerNumber":"1810500054","folders":["80541","80542","80543","80580","1000000246"]},"282551":{"firstName":"John","lastName":"Mussell","email":"JOHN.MUSSELL@ASTRONICS.COM","customerNumber":"5275681923","folders":["80542","80543","1000000246"]},"1046634":{"firstName":"Nate","lastName":"Roy","email":"NATE.ROY@ASTRONICS.COM","customerNumber":"2514421806","folders":["80543"]}}}}};
  
  //FIXME: This does NOT represent what comes back from endpoint.
  App.users.data.eaccts[App.ea].perms = 
  {
      "code1": {
          "title": "ManageEntitlementAccounts",
          "isSet": true,
          "desc": "Somedescription maybehelptext"
      },
      "code2": {
          "title": "ManageFolders",
          "isSet": true,
          "desc": "Somedescription, maybehelptext"
      },
      "code3": {
          "title": "ManageUserAccess",
          "isSet": false,
          "desc": "Somedescriptionorhelptext"
      }
  };
  loadNewsDataStore();
  
  for (var i=0; i<App.licences.stores.length; i++){
    App.licences.stores[i].load();
  }
  for (var i=0; i<App.users.stores.length; i++){
    App.users.stores[i].load();
  }
  //TODO: Make this a store - setOptions doesn't work dynamically
  /*App.users.easwitch.setOptions({text: 'Astronics EA',  value: '1234'}, true);
  App.licences.easwitch.setOptions({text: 'Astronics EA',  value: '1234'}, true);*/
  
}
