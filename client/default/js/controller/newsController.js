function loadNewsDataStore(cb){
  
  $fh.act(
      {
        act: 'getNews'
      },
      function(res) {
        res = JSON.parse(res.body);
        
        // FIXME: This should not be clientside.
        res = res.list;
        var newsItems = [];
        var catList = [];
        var catHash = {};
        

        for (var i=0; i<res.length; i++){
          var curNewsItem = res[i].fields;
          var desc = curNewsItem.description;
          var summary = desc.replace(/(\<)(?!br(\s|\/|\>))(.*?\>)/g, ''); // Strip all HTML but line breaks
          
          if (summary.length>480){
            curNewsItem.summary = summary.substring(0, 480).trim() + '...'  
          }else{
            curNewsItem.summary = summary;
          }
          
          
          var cat = (curNewsItem.category.trim()=="") ? "General News" : curNewsItem.category;
          curNewsItem.category = cat;
          if (!catHash[cat]) {
            catList.push({"name" : cat});
            catHash[cat] = true;
          }
          newsItems.push(curNewsItem);
        }
        App.news.data = newsItems;
        App.news.categories = catList;
        App.news.newsStore.load();
        App.news.categoryStore.load();
        if(cb && typeof cb === 'function'){
        	cb();
        }
      },
      function(code,errorprops,params) {
        if (console && console.log) console.log('An error occured: ' + code + ' : ' + errorprops);
      }
  );  
}


