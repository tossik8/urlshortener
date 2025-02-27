require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require("dns");
const app = express();
const bodyParser = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

let number = 1;
const urls = new Map();

app.post("/api/shorturl", (req, res) => {
  let { url } = req.body;
  url = url.replace("https://", "");
  const domainName = url.replace(/\/.*/, "");
  dns.lookup(domainName, (err) => {
    if(err) res.json({"error": "invalid url"});
    else{
      sendData(url, req, res);
    }
  });

});
app.get("/api/shorturl/:number", (req, res) => {
  res.redirect("https://"+urls.get(+req.params.number));
});
function sendData(url, req, res){
  const key = isPresent(url);
  if(key !== -1){
    res.json({"original_url": req.body.url, "short_url": key});
  }
  else{
    urls.set(number++, url);
    res.json({"original_url": req.body.url, "short_url": number-1});
  }
}
function isPresent(url){
  for(let [k, value] of urls){
    if(value === url){
      return k;
    }
  }
  return -1;
}
