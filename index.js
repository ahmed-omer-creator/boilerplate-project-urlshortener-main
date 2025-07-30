require('dotenv').config();
const express = require('express');
const dns = require("dns")
const cors = require('cors');
const app = express();
app.use(express.urlencoded({extended:false}))
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

let base = [];
let counter = 1;

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
let original_url = req.body.url

let hostname;
try {
  hostname = new URL(original_url).hostname;
} catch (e) {
  return res.json({error:"invalid url"})
}

dns.lookup(hostname,(err,addres) => {
  if (err) {
    return res.json({error:"invalid url"})
  }
  let shorturl = counter++;

  base.push({
    original_url,
    shorturl
  });
    res.json({original_url,shorturl})
  });
});

app.get("/api/shorturl/:id", (req,res) => {
  let id = Number(req.params.id)
  let entery = base.find(item => item.shorturl === id)
  if (!entery) {
    return res.status(404).json({error:"No short URL found for given input"})
  }
  
  res.redirect(entery.original_url)
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
