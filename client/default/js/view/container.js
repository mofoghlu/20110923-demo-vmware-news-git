/*
 * Main application container.
 * TODO: Rename me to tabs or something
 * TODO: Needs to be in a function so all other code executed in correct order. 
 */

function renderUi(){
  
  
  App.toolbar = new Ext.Panel({  
    items: [
            {
              xtype: 'toolbar',
              height: 46,
              dock: 'top',
              pack: 'left',
              title: "",
              cls: 'mainToolbar',
              items: [  
                {
                  xtype: 'panel',
                  html: '<img id="emslogo" src="images/toolbar_logo.png" alt="VMware EMS Logo" />'
                },
                {xtype: 'spacer'}

              ]
            },
            {
              xtype: 'panel',
              cls: 'ribbon',
              height: 10
            } 
          ]
  });
  
  



  App.tabBar = new Ext.TabBar({
    dock: 'bottom',
    layout: {
      pack: 'center'
    },
    height: 60
  });

  App.tabPanel = new Ext.TabPanel({
    title: "Test",
    id: 'app_ui',
    tabBar: App.tabBar,
    fullscreen: true,
    cardSwitchAnimation: (config.animation) ? false : false,
    items: App.news.container ? [App.news.container] : [],
    dockedItems: [App.toolbar]
  });
  
  return App.tabPanel;
}