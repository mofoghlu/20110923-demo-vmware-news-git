/*
 * Instantiate Ext and all our components 
 */

Ext.setup({
  tabletStartupScreen: 'images/pad_splash.png',
  phoneStartupScreen: 'images/phone_splash.png',
  icon: 'icon.png',
  glossOnIcon: false,
  onReady: function() {
    if(Ext.is.Android){
      Ext.get("deviceStylesheet").dom.href = "css/android.css";
    } else if(Ext.is.iOS){
      Ext.get("deviceStylesheet").dom.href = "css/apple.css";
    } else if (Ext.is.Blackberry){
      Ext.get("deviceStylesheet").dom.href = "css/bb6.css";
    }
    // Hardcode the apple stylesheet in for now
    Ext.get("deviceStylesheet").dom.href = "css/apple.css";

    var u = renderUi();
    loadNewsDataStore(function(){
     if(typeof App.news.initTabs === 'function'){
     	App.news.initTabs();
     }	
    });
    App.container = new Ext.Container({
      id: 'app_container',
      cardSwitchAnimation: (config.animation) ? 'flip' : false,
      layout:{
        type: 'card'
      }, 
      items: [u]
    });
   
    Ext.EventManager.onWindowResize(setActivePanel);

}
});

function setActivePanel(){
  App.container.setOrientation( Ext.getOrientation() , window.innerWidth , window.innerHeight );
  App.container.setSize(window.innerWidth , window.innerHeight);
  App.container.doLayout();
  };