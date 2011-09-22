App.news.container = undefined;

App.news.initTabs = function () {
  var iconClasses = {
    'General': 'newsIcon',
    'Knowledge': 'licencesIcon',
    'Digest': 'profileIcon'
  };
  for (var i = 0; i < App.news.categories.length; i++) {
    var name = App.news.categories[i].name.split(' ');
    name = name[0];
    var panel = new Ext.Panel({
      title: name,
      iconCls: iconClasses[name],
      height: '100%',
      layout: 'card',
      activeItem: 0,
      id: 'panel_' + name,
      items: [{
        xtype: 'panel',
        items: [{
          xtype: 'toolbar',
          cls: 'subToolbar',
          dock: 'top',
          title: App.news.categories[i].name
        },
        new Ext.List({
          title: 'News',
          height: '100%',
          cls: 'news_list',
          store: App.news.newsStore,
          listeners: {
            //itemtap: App.licences.showLicenceDetails,
            selectionChange: function (list, records) {
              list.deselect(records[0], true); // immediately deselect the current item
            },
            itemtap: function (id) {
              return function (list, index, item, ev) {
                // Get the record.
                var p = Ext.getCmp('panel_' + id);
                var record = list.store.getAt(index);
                var name = record.get('title');
                var article = record.get('description'); // Non-ideal, this - can't .get() an array
                //Ext.getCmp('newsItemToolbar').setTitle(name);
                Ext.getCmp('newsItemBody_' + id).update(article);
                var animation = (config.animation) ? {
                  type: 'slide',
                  direction: 'left'
                } : false;
                p.setActiveItem(1, animation);
              }
            }(name)
          },
          itemTpl: '<div class="newsItem"><h1>{title}</h1>' + '<p>{summary}</p></div>'
        })]
      },
      new Ext.Panel({
        xtype: 'panel',
        height: '100%',
        items: [{
          xtype: 'panel',
          height: '100%',
          items: [{
            xtype: 'toolbar',
            id: 'newsItemToolbar_' + name,
            cls: 'bodyToolbar',
            dock: 'top',
            title: '',
            items: [{
              xtype: 'button',
              ui: 'back',
              text: 'Back',
              handler: function (com) {
                return function () {
                  Ext.getCmp('panel_' + com).setActiveItem(0, {
                    type: 'slide',
                    direction: 'right'
                  });
                }

              }(name)
            }, {
              xtype: 'spacer'
            }]
          }, {
            xtype: 'panel',
            scroll: 'both',
            id: 'newsItemBody_' + name,
            cls: 'newsItemBody',
            html: 'No article to display',
            height: '100%' // FIXME: should this be the height less the toolbar height?
          }]
        }]
      })],

      listeners: {
        beforeactivate: function (com) {
          var title = com.items.items[0].items.items[0].title;
          App.news.newsStore.filterBy(function (record) {
            var curItemCat = record.get('category');
            if (curItemCat === title) {
              return true;
            }
            return false;
          })
        }
      }
    });
    App.tabPanel.add(panel);
  }
  App.tabPanel.doLayout();
}