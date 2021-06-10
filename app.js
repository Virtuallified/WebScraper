var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

// Reading the file json data
const rawdata = fs.readFileSync('./output.json');

app.get('/scrape', function(req, res){

  url = 'https://bengali.oneindia.com/topic/west-bengal';

  request(url, function(error, response, html){
    // console.log(error)
      if(!error){
          var $ = cheerio.load(html);
  
      var title, publish;
      var result = {};
      // var news = { news : json};
  
      $('.cityblock-title').filter(function(key, value){
          var data = $(this);
          // title = data.children().first().text();            
          title = data.text(); 
          var context= { "Caption": "", "Date": "" }; 
          context.Caption=title.trim();;
          result[key]=context;

      })

      $('.cityblock-time').filter(function(key, value){
          var data = $(this);
          publish = data.text();
          result[key].Date=publish.trim();;
      })
    }
    
    // To write to the system we will use the built in 'fs' library.
    // In this example we will pass 3 parameters to the writeFile function
    // Parameter 1 :  output.json - this is what the created filename will be called
    // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
    // Parameter 3 :  callback function - a callback function to let us know the status of our function
    
    fs.writeFile('output.json', JSON.stringify(result, null, 4), function(err){
      console.log('File successfully written! - Check your project directory for the output.json file');
    })
    /* fs.appendFile('output.json', JSON.stringify(result, null, 4), function(err){
      console.log('File successfully written! - Check your project directory for the output.json file');
    }) */
  
    // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(JSON.parse(rawdata), null, 4));
  }) ;

})

app.listen('3000')

console.log('Server Running Successfully!');

exports = module.exports = app;