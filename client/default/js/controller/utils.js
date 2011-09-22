/*
 * A collection of utility functions for login, clearing alerts etc
 * Should this be App.util?
 */
App.mask = new Ext.LoadMask(Ext.getBody(), {msg: "Logging in"});

function clearAlerts(){
  //FIXME: Is destructive at present..
  Ext.select('.alert').update(' ');
}

function showBusy(string, panel){
  if (!panel) panel = Ext.getBody(); // TODO: Not working - for now, just apply to body..
  panel = Ext.getBody();
  clearBusy();
  App.mask = new Ext.LoadMask(panel, {msg: string});
  App.mask.show();
}
function clearBusy(){
  if (App.mask && App.mask.el) {
    App.mask.hide();
  }
}

function doCache(hash, data) {
  var obj = {
    "hash": hash,
    "data": data,
    "cached": true
  };
  /*$fh.cache({
    "act": "save",
    "key": "_cache",
    "val": obj,
    "expire": CACHE_TIME
  });*/
}

function readCache() {
  var ret = $fh.cache({
    "act": "load",
    "key": "_cache"
  });
  return ret.val;
}

function generateEASwitch(defaultInteraction){
  return new Ext.form.Select({
    name: (defaultInteraction) ? 'defaultEA' : 'easwitch',
    store: App.profile.entAccountsStore,
    cls:  (defaultInteraction) ? '' : 'eaSelector',
    label: (defaultInteraction) ? 'Default EA' : 'EA: ',
    displayField: 'accKey',
    valueField: 'id',
    listeners:{ 
      change: (defaultInteraction) ? switchEA : switchEA
      }
  });
}

/*
 * Return a new sencha object of a news summary widget
 */
function generateNewsWidget(id){
  
  return new Ext.Panel ({
    dock: 'bottom',
    cls: 'newsPanel expanded',
    id: id,
    items: [
            { xtype: 'toolbar',
              dock: 'top',
              width: '100%',
              cls: 'newsPanelToolbar leftToolbar',
              title: 'VMware News',
              pack: 'left',
              items: [
                      {
                        xtype: 'panel',
                        html: '<img src="images/news_icon.png" alt="news" />'
                      },{
                        xtype: 'spacer'
                      },
                      {
                        xtype: 'panel',
                        html: '',
                        cls: 'profile_arrow',
                        height: 16,
                        width: 16
                      }
                      ],
                      listeners: {
              click: {    // FIXME: Expand / collapse code here
              element: 'el',
              fn: toggleNews
            }
            }  
            },
            {
              xtype: 'panel',
              cls: 'newsPanelBody expanded',
              items: [
                      {
                        xtype: 'list',
                        store: App.news.newsStore,
                        height: 175,
                        listeners:{ 
                          // itemtap: App.licences.showLicenceDetails,
                          selectionChange: function(list, records){
                            list.deselect(records[0], true); // immediately deselect the current item
                          },
                          itemtap: function(a, b, c, d){
                            App.tabPanel.setActiveItem(3);
                            App.news.showNewsItem(a, b, c, d);
                          }
                        },
                        scroll: 'vertical',
                        itemTpl: '<div class="newsSumary"><h2>{title}</h2><p>{summary}</p></div>'
                      },
                      {
                        xtype: 'toolbar',
                        cls: 'leftToolbar',
                        pack: 'right',
                        items: [
                                {
                                  xtype: 'spacer'
                                },
                                {
                                  xtype: 'button',
                                  width: '70px',
                                  cls: 'more',
                                  text: 'More...',
                                  handler: function(){
                                    
                                    App.tabPanel.setActiveItem(3);
                                  }
                                }
                                ]
                      }
                      ]
            }
            ]
  });
}

/*
 * A search field that works as a typeahead. Wrapped as a util as this huge chunk of code is reusable
 */
function generateSearchField(store, placeholderText, recordTester){
  return {
      xtype      : 'searchfield', //searchfield
      placeHolder: placeholderText,
      autoCorrect: false,
      listeners  : {
          scope: this,
          keyup: function(field) {
              var value = field.getValue();
              
              if (!value) {
                  store.filterBy(function() {
                      return true;
                  });
              } else {
                  var searches = value.split(' '),
                      regexps  = [],
                      i;
                  
                  for (i = 0; i < searches.length; i++) {
                      if (!searches[i]) return;
                      regexps.push(new RegExp(searches[i], 'i'));
                  };
                  
                  
                  store.filterBy(function(record) {
                      var matched = [];
                      for (i = 0; i < regexps.length; i++) {
                          var search = regexps[i];
                          var recordTestResult = recordTester(record, search);
                          matched.push(recordTestResult); // Pass the record into our callback funciton, then push it's return value
                      };
                      if (regexps.length > 1 && matched.indexOf(false) != -1) {
                          return false;
                      } else {
                          return matched[0];
                      }
                  });
              }
          }
      }
  };
}

function generateSearchField2(store, placeholderText, recordTester){
  return {
      xtype      : 'searchfield', //searchfield
      placeHolder: placeholderText,
      autoCorrect: false,
      listeners  : {
          scope: this,
          keyup: function(field) {
              var value = field.getValue();
              
              if (!value) {
                  store.filterBy(function() {
                      return true;
                  });
              } else {
                  var searches = value.split(' '),
                      regexps  = [],
                      i;
                  
                  for (i = 0; i < searches.length; i++) {
                      if (!searches[i]) return;
                      regexps.push(new RegExp(searches[i], 'i'));
                  };
                  
                  
                  store.filterBy(function(record) {
                      var matched = [];
                      for (i = 0; i < regexps.length; i++) {
                          var search = regexps[i];
                          var recordTestResult = true; // Assume the record is true unless we see otherwise
                          if (recordTester instanceof Object){ // if array
                            for (f in recordTester){
                              if (recordTester.hasOwnProperty(f)){
                                func = recordTester[f];
                                recordTestResult = recordTestResult && func(record, search);
                              }
                            }
                          }else{ // otherwise just one tester function
                            recordTestResult = recordTester(record, search);
                          }
                          matched.push(recordTestResult); // Pass the record into our callback funciton, then push it's return value
                      };
                      if (regexps.length > 1 && matched.indexOf(false) != -1) {
                          return false;
                      } else {
                          return matched[0];
                      }
                  });
              }
          }
      }
  };
}

function toggleChildren(store, childlist){
  
  var alreadyExpanded = false;
  if (childlist){
    var r = store.findRecord("id", childlist); // Get the parent node
    var rChildren = r.get('children');
    var rExpanded = r.get('expanded');
    if (rChildren) { // If the record doesn't have children, we're not interested.
      if (rExpanded == true) {
        // Record has a child list and expanded is set, this child list is already expanded. We're toggling back off.
        alreadyExpanded = true;
        r.set('expanded', false);
      }
      else {
        // Otherwise, we're toggling on. Set expanded flag on the parent.
        r.set('expanded', true);
      }
    }
  }

  store.filterBy(function(record) {
    var parent = record.get('parent');
    if (!parent) return true;
    if ((parent==childlist) && !alreadyExpanded) return true;
    return false;
  });
}


function processFolderJson(json){
  var newobjArr = [];
  for (key in json){
    if (json.hasOwnProperty(key)){
      
      var value = json[key];
      if (value.parent){ 
        continue;
      }
      
      var newobj = {};
      newobj.id = key;
      for (itemkey in value){
        if (value.hasOwnProperty(itemkey)){
          newobj[itemkey] = value[itemkey];
        }
      }
      
      newobjArr.push(newobj);
      
      // Now we need to check if the current object has child folders
      // and push them in order.
      if (newobj.children){
        var childlist = newobj.children;
        for (child in childlist ){
          if (childlist.hasOwnProperty(child)){
            var id = childlist[child];
            var curChild = json[id];
            curChild.id = id;
            newobjArr.push(curChild);
          }
        }
      }
    
    
    } 
  }
  // Done adding new child folders
  
  return newobjArr;
}

function scrollListToTop(el, ev){
  if (el.scroller){
    el.scroller.scrollTo({
      x: 0,
      y: 0
    });
  }
}

function processGenericJson(json, appendQuantity){
  var newobjArr = [];
  for (key in json){
    if (json.hasOwnProperty(key)){
      
      var value = json[key];
      
      var newobj = {};
      newobj.id = key;
      for (itemkey in value){
        if (value.hasOwnProperty(itemkey)){
          newobj[itemkey] = value[itemkey];
        }
      }
      
      //FIXME: Remove this. 
      if (appendQuantity) newobj['quantity'] = (value.licenses && value.licenses.length) ? parseInt(value.licenses.length) : "0";
      newobjArr.push(newobj);
    
    } 
  }

  
  return newobjArr;
}

function scrollListToTop(el, ev){
  if (el.scroller){
    el.scroller.scrollTo({
      x: 0,
      y: 0
    });
  }
}


function filterProductsByFolder(model, selection){
  if (selection.length==0){
    App.licences.productStore.filterBy(function(record){
      return true;
    });
    App.licences.licencesDetailStore.filterBy(function(record){
      return true;
    });
    return;
  }
  
  var products = [];
  var foldersHash = [];
  for (var i=0; i<selection.length; i++){
    var curFolder = selection[i].get('id'); // should be selection[i].get('products'); but returns "" rather than []
    foldersHash[curFolder] = true; 
  }
  
  var licenceIdsShowingHash = []; // We'll later use this when filtering products
  
  App.licences.licencesDetailStore.filterBy(function(record){
    var folderId = record.get('folderId');
    var id = record.get('id');
    if (foldersHash[folderId]){
      licenceIdsShowingHash[id] = true;
      return true;
    }
    return false;
  });
  
  App.licences.productStore.filterBy(function(record){
    var curProductLicenses = record.raw.licenses;
    for (var i=0; i<curProductLicenses.length; i++){
      var l = curProductLicenses[i];
      if (licenceIdsShowingHash[l]){
        return true;
      }
    }
    return false;
  });
  
};

function filterFoldersByUsers(model, selection){
  if (selection.length==0){
    App.users.userFolderStore.each(function(record){
      record.set('member','');
    });
    return;
  }
  
  var usersHash = [];
  for (var i=0; i<selection.length; i++){
    var id = selection[i].raw.id;
    usersHash[id] = true;  
  }
  
  App.users.userFolderStore.each(function(record){
    var access = record.raw.access;
    for (var i in access){
      if (access.hasOwnProperty(i)){
        var key = i; // access is a list of permissions. The key is what we need to lookup!
        if (usersHash[key]){
          record.set('member','member');
        }else{
          record.set('member','');  
        } 
      }
    }

  });
}

function filterUsersByFolders(model, selection){
  if (selection.length==0){
    App.users.userStore.each(function(record){
      record.set('access','');
    });
    return;  
  }
  
  var foldersHash = [];
  for (var i=0; i<selection.length; i++){
    var curFolder = selection[i].raw.id; 
    foldersHash[curFolder] = true; 
  }
  
  App.users.userStore.each(function(record){
    var folders = record.raw.folders;
    for (var i=0; i<folders.length; i++){
      if (foldersHash[folders[i]]){
        record.set('access','member');
      }else{
        record.set('access','');
      }
    }
    
  });
}


function toggleNews(ev, el){
  var a = Ext.getCmp('profileNewsPanelBody');
  var b = Ext.getCmp('licencesNewsPanelBody');
  
  // FIXME: Not updating. Need to do some sort of repaint/doLayout..?
  //TODO: Don't lcose every el, just pass by reference.
  
  Ext.select('.newsPanelBody').each(function(np){
    var expanded = np.hasCls('expanded'); // Is our folder expanded or not?
    // Set up our class names so next time fctn is invoked we know if we're expanded/collapsed
    if (expanded) {
      np.addCls('collapsed');
      a.addCls('collapsed');
      np.removeCls('expanded');
      a.removeCls('expanded');
    np.hide(true);
    }else{
      np.addCls('expanded');
      a.addCls('expanded');
      np.removeCls('collapsed');
      a.removeCls('collapsed');
    np.show(true);
    }
    

  });
  a.doComponentLayout();
  b.doComponentLayout();
  
  
}