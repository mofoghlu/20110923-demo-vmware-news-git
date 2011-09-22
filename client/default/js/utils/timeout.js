function attachActivityTimeout(){
  console.log('attached');
  startActivityTimeout();
  App.timeout.f = function() {
    console.log('click');
    clearActivityTimeout();
    startActivityTimeout();
  }; 
  Ext.getBody().on('click', App.timeout.f); 
}

function removeActivityTimer(){
  console.log('removed');
  Ext.getBody().removeListener('click', App.timeout.f);
}

function startActivityTimeout(){
  //timeout = (config.lockTimeout * 1000) - 6000; // minus 6 seconds as that's the length our timeout panel shows for
  timeout = (14 * 1000) - 6000; // minus 6 seconds as that's the length our timeout panel shows for
  App.timeout.t1 = setTimeout(function(){
    
    App.popup = this.popup = new Ext.Panel({
      id: 'panel_timeout',
      floating: true,
      modal: true,
      centered: true,
      width: 300,
      height: 100,
      styleHtmlContent: true,
      scroll: false,
      items: [
        {
          xtype: 'panel',
          html: 'You are due to be logged out due to inactivity<br />'
        },
        
        
        {
          xtype: 'panel',
          layout: {
            type: 'hbox',
            pack: 'justify',
            align: 'stretch'
          },
          items: [
                {
                  xtype: 'button',
                  ui: 'decline',
                  width: '40%',
                  text: 'Log Out',
                  id: 'cancelPrefs',
                  handler: function() {
                    App.popup.hide(); 
                    App.login.logout();
                    removeActivityTimer();
                }  
                },
                {
                  xtype: 'spacer'
                },
                {
                  xtype: 'button',
                  ui: 'confirm',
                  text: 'Continue?',
                  handler: function() {
                    App.popup.hide();
                    clearActivityTimeout();
                    startActivityTimeout();
                  }
                }
          ]
        }
        
      ]
    });
    App.popup.show();
    
    App.timeout.t2 = setTimeout(function(){
      App.popup.hide();
      App.login.logout();
      removeActivityTimer();
    }, 6000); // Log out in 6 seconds
    
  }, timeout);
}

function clearActivityTimeout(){
  
  if (App.timeout.t1) clearTimeout(App.timeout.t1);
  if (App.timeout.t2) clearTimeout(App.timeout.t2);
  
  if (App.timeout.t1) console.log('t1 cleared');
  if (App.timeout.t2) console.log('t2 cleared');
  
}
