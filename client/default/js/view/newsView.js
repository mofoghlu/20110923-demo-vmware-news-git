App.news.filterNewsByCategory = function(model, selection){
  if (selection.length==0){
    App.news.newsStore.filterBy(function(record){
      return true;
    });
    return;
  }
  App.news.newsStore.filterBy(function(record){
    var curItemCat = record.get('category');
    for (var i=0; i<selection.length; i++){
      var selectionCat = selection[i].get('name');
      if (curItemCat==selectionCat){
        return true;
      }
    }
    return false;
  });
  
}

App.news.categoryList = new Ext.List({
  title: 'News Categories',
  store: App.news.categoryStore,
  listeners:{ 
    selectionChange: App.news.filterNewsByCategory
  },
  itemTpl: '<div class="category"><strong>{name}</strong></div>'
});

App.news.showNewsItem = function(list, index, item, ev){
  // Get the record.
  var record = list.store.getAt(index);
  var name = record.get('title');
  var article = record.get('description'); // Non-ideal, this - can't .get() an array
 
  //Ext.getCmp('newsItemToolbar').setTitle(name);
  Ext.getCmp('newsItemBody').update(article);
  var animation = (config.animation) ? {type:'slide', direction:'left'} : false;
  App.news.news_right.setActiveItem(1, animation);
}

App.news.newsList = new Ext.List({
  title: 'News',
  height: '90%',
  cls: 'news_list',
  store: App.news.newsStore,
  listeners:{ 
    //itemtap: App.licences.showLicenceDetails,
    selectionChange: function(list, records){
      list.deselect(records[0], true); // immediately deselect the current item
    },
    itemtap: App.news.showNewsItem
  },
  itemTpl: '<div class="newsItem"><h1>{title}</h1>' + 
  '<p>{summary}</p></div>'
})

App.news.news_left = new Ext.Panel({
  cls: 'panel_left',
  dock: 'left',
  width: '30%',
  height: '100%',
  items: [
          {
            xtype: 'panel',
            items: [
              { xtype: 'toolbar',
                cls: 'subToolbar',
                dock: 'top',
                title: 'News'
              },App.news.categoryList
            ]
          }
         ]
});

App.news.news_right = new Ext.Panel({
  cls: 'panel_right',
   html: 'Tab Panel Right<br /><h1>Test</h1>',
   height: '100%',
   layout: {
     type: 'card',
     align: 'right',
   },
   items: [
           {
             xtype: 'panel',
             items: [
               {
                 xtype: 'toolbar',
                 cls: 'subToolbar',
                 dock: 'top',
                 title: 'News Category 1'
               }, App.news.newsList
             ]
           }
   ]
});

App.news.container = new Ext.Panel({
    title: 'VMware News',
    iconCls: 'newsIcon',
    dockedItems: [App.news.news_left],
    items: [App.news.news_right]
});


App.news.news_details = new Ext.Panel({   
  xtype: 'panel',
  height: '100%',
  items: [
          {
            xtype: 'panel',
            height: '100%',
            items: [
              {
                xtype: 'toolbar',
                id: 'newsItemToolbar',
                cls: 'bodyToolbar',
                dock: 'top',
                title: '',
                items: [
                 { 
                   xtype: 'button',
                   ui: 'back',
                   text: 'Back to News',
                   handler: function(){
                   App.news.news_right.setActiveItem(0, {type:'slide', direction:'right'});
                   }
                 },
                 {
                   xtype: 'spacer'
                 }
                ]
              }, 
              {
                xtype: 'panel',
                scroll: 'vertical',
                id: 'newsItemBody',
                cls: 'newsItemBody',
                html: 'No article to display',
                height: '80%' // FIXME: should this be the height less the toolbar height?
              }
            ]
          }
  ]
});

App.news.news_right.add(App.news.news_details);



