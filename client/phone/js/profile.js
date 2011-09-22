/*
 * 
 */
Ext.regModel('newsSummary', {
  fields: ['title', 'summary']
});

App.profile.newsSummaryStore = new Ext.data.Store({
    model: 'newsSummary',
    sorters: 'firstName',
    getGroupString : function(record) {
        return record.get('firstName')[0];
    },
    data: [
        {title: 'VMWare Forum 2011', summary: 'Register today for a free day learning from virtualization and cloud computing experts.'},
        {title: 'ESXi Migration', summary: 'Plan your migration to VMware ESXi. Improve security and simplify hypervisor managment.'}
    ]
});

App.profile.newsSummaryList = new Ext.List({
  store: App.profile.newsSummaryStore,
  cls: 'news_summary',
  itemTpl: '<div class="newsSumary"><h2>{title}</h2><p>{summary}</p></div>'
})

App.profile.profile_left = new Ext.Panel({
  cls: 'panel_left profile',
  height: '100%',
  items: [
          {
            xtype: 'panel',
            cls: 'my_profile',
            items: [
                    { xtype: 'toolbar',
                      cls: 'subToolbar',
                     
                      title: 'Profiles'
                    },
                    {
                      xtype: 'toolbar',
                      cls: 'leftToolbar',
                      
                      title: 'My Profile'
                    },
                    {
                      xtype: 'panel',
                      html: '<strong>My Profile</strong><br />' + 
                      'Customer Support: <br />' +
                      'Tel: 01 3834874<br />' + 
                      'Email: support@vmware.com<br />'
                    }
                    ]
          },
          {
            xtype: 'panel',
            dock: 'bottom',
            cls: 'newsPanel expanded',
            items: [
                    { xtype: 'toolbar',
                      dock: 'top',
                      cls: 'newsPanelToolbar leftToolbar',
                      title: 'VMware News & Updates',
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
                              App.profile.newsSummaryList,
                              {
                                xtype: 'toolbar',
                                cls: 'leftToolbar',
                                items: [
                                        {
                                          xtype: 'button',
                                          ui: 'forward',
                                          width: '50%',
                                          text: 'more'
                                        }
                                        ]
                              }
                              ]
                    }
                    ]
          }
          ]
          
});

App.profile.profile_right = new Ext.Panel({
  height: '100%',
items: [
        {
          xtype: 'panel',
          items: [
                  {
                    xtype: 'toolbar',
                   
                    cls: 'subToolbar',
                    title: 'My Profile Details'
                  },
                  {
                    xtype: 'panel',
                    items: [

                            {
                              xtype: 'panel',
                              id: 'panel_profile_details',
                              html: '<div id="profile_info_left">' +
                              '<strong>First Name: </strong> Joe<br />' + //TODO: Make this load some mock data from cloud.
                              '<strong>Second Name: :</strong> Bloggs<br />' +
                              '<strong>Custmer #:</strong> 29393823<br />' +
                              '</div>' +
                              '<div id="profile_info_right">' +
                              '<strong>Email Address:</strong> joe.bloggs@vmware.com<br />' +
                              '<strong>Telephone:</strong> 0809348272<br />' +
                              '<strong>Other:</strong> 012039221' + 
                              '</div>'
                            },
                            {
                              xtype: 'form',
                              items: [{
                                xtype: 'fieldset',
                                title: 'Entitlement Accounts',
                                items: [{
                                  xtype: 'textfield',
                                  name: 'name',
                                  label: 'EA 1',
                                  placeHolder: 'Some Account Details',
                                  autoCapitalize : true,
                                  required: false,
                                  useClearIcon: true
                                },
                                {
                                  xtype: 'textfield',
                                  name: 'name',
                                  label: 'Feedhenry Entitlements',
                                  placeHolder: 'Some Account Details',
                                  autoCapitalize : true,
                                  required: false,
                                  useClearIcon: true
                                }]
                              },
                              {
                                xtype: 'fieldset',
                                id : 'profile_permissions_summary',
                                title: 'Your Permissions',
                                items: [{
                                  xtype: 'togglefield',
                                  label: 'Manage Account',
                                  value: true
                                },
                                {
                                  xtype: 'togglefield',
                                  label: 'Manage Folders, Users & Access',
                                  value: true
                                },
                                {
                                  xtype: 'togglefield',
                                  label: 'View Orders & Contracts',
                                  value: false
                                },
                                {
                                  xtype: 'togglefield',
                                  label: 'Superuser',
                                  value: false
                                }]
                              }]
                            }
                            ]
                  }

                  ]
        }
        ]
});

App.profile.container =  new Ext.Panel({
  title: 'My Profile',
  iconCls: 'profileIcon',
  cls: 'profile',
  scroll: 'vertical',
  items: [App.profile.profile_left, App.profile.profile_right]
});

function toggleNews(ev, el){
  // FIXME: Not updating. Need to do some sort of repaint/doLayout..?
  var el = Ext.select('.newsPanelBody').item(0); 
  var expanded = el.hasCls('expanded'); // Is our folder expanded or not?
  // Set up our class names so next time fctn is invoked we know if we're expanded/collapsed
  if (expanded) {
    el.addCls('collapsed');
    el.removeCls('expanded');
    el.hide(true);
  }else{
    el.addCls('expanded');
    el.removeCls('collapsed');
    el.show(true);
  }

  /*
  var el = Ext.select('.newsPanel').item(0); // FIXME should be reference to the el param passed in as this
  var expanded = el.hasCls('expanded'); // Is our folder expanded or not?
  // Set up our class names so next time fctn is invoked we know if we're expanded/collapsed
  if (expanded) {
    el.addCls('collapsed');
    el.removeCls('expanded');
  }else{
    el.addCls('expanded');
    el.removeCls('collapsed');
  }

  var toolbar = Ext.select('.newsPanelToolbar').item(0); // FIXME should be reference to the el param passed in as this
  var toolbarHeight = toolbar.getHeight();
  var changeHeight = (expanded) ? toolbarHeight : 175;

  el.setHeight(parseInt(changeHeight), { // parseInt as a defensive pseudo-cast here
    easing: 'easeIn',
    duration:.9
    });
   */
}