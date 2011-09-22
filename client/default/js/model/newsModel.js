


var news = {
  "1" : [
    {
      header: "News Item 1",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi faucibus magna non libero lacinia vel lacinia quam eleifend. Maecenas vel arcu quis nulla ultrices dictum. Sed id sapien eu ipsum aliquet eleifend. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum porta consectetur iaculis. Praesent suscipit imperdiet leo, id tempus ante laoreet vitae",
      image: "images/newsItem.png"
    },
    {
      header: "News item 2",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi faucibus magna non libero lacinia vel lacinia quam eleifend. Maecenas vel arcu quis nulla ultrices dictum. Sed id sapien eu ipsum aliquet eleifend. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum porta consectetur iaculis. Praesent suscipit imperdiet leo, id tempus ante laoreet vitae",
      image: "images/newsItem.png"
    }
  ],
  "2" : [
    {
      header: "News Item 3",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi faucibus magna non libero lacinia vel lacinia quam eleifend. Maecenas vel arcu quis nulla ultrices dictum. Sed id sapien eu ipsum aliquet eleifend. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum porta consectetur iaculis. Praesent suscipit imperdiet leo, id tempus ante laoreet vitae",
      image: "images/newsItem.png"
    },
    {
      header: "News item 4",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi faucibus magna non libero lacinia vel lacinia quam eleifend. Maecenas vel arcu quis nulla ultrices dictum. Sed id sapien eu ipsum aliquet eleifend. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum porta consectetur iaculis. Praesent suscipit imperdiet leo, id tempus ante laoreet vitae",
      image: "images/newsItem.png"
    }
  ]
};

var categories = [
                  {id: '1', title: 'News Category 1'},
                  {id: '2', title: 'News Category 2'},
                  {id: '3', title: 'News Category 3'}
                  ];




Ext.regModel('categoryList', {
  fields: ['name']
});

App.news.categoryStore = new Ext.data.Store({
  model: 'categoryList',
  sorters: 'title',
  getGroupString : function(record) {
      return record.get('name')[0];
  },
  proxy: {
      type: 'stackback',
      reader: {
          type: 'json',
          root: function() {
              // Process the data so sencha can make this into a list. 
              // convert json from "id" : { object } to
              // { id: 
              return App.news.categories;
              
              

          }
      }
  }
});


Ext.regModel('newsModel', {
  fields: ['title', 'description', 'summary', 'category']
});


App.news.newsStore = new Ext.data.Store({
  model: 'newsModel',
  sorters: 'title',
  getGroupString : function(record) {
      return record.get('title')[0];
  },
  proxy: {
      type: 'stackback',
      reader: {
          type: 'json',
          root: function() {
              // Process the data so sencha can make this into a list. 
              // convert json from "id" : { object } to
              // { id: 
              return App.news.data;
              
              

          }
      }
  }
});

/*App.news.store = new Ext.data.Store({
  model: 'newsList',
  sorters: 'header',
  getGroupString : function(record) {
      return record.get('header')[0];
  },
  data: news['1']
});
*/