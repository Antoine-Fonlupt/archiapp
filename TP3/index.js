var express = require('express');
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static('public'));

// ── 2.1 Test route ────────────────────────────────────────────────────────────
app.get('/test/*', function(req, res) {
  var parts = req.url.split('/');
  var something = parts.slice(2).join('/');
  res.json({ msg: something });
});

// ── 2.3 Counter micro-service ─────────────────────────────────────────────────
var counter = 0;

app.get('/cpt/query', function(req, res) {
  res.json({ counter: counter });
});

app.get('/cpt/inc', function(req, res) {
  if (req.query.v !== undefined) {
    if (req.query.v.match(/^-?[0-9]+$/)) {
      counter += parseInt(req.query.v);
      res.json({ code: 0 });
    } else {
      res.json({ code: -1 });
    }
  } else {
    counter += 1;
    res.json({ code: 0 });
  }
});

// ── 2.4 Message board micro-service ──────────────────────────────────────────
var allMsgs = [
  { text: "Hello World",           author: "Alice", date: new Date().toISOString() },
  { text: "foobar",                author: "Bob",   date: new Date().toISOString() },
  { text: "CentraleSupelec Forever", author: "Admin", date: new Date().toISOString() }
];

// Get number of messages
app.get('/msg/nber', function(req, res) {
  res.json({ nber: allMsgs.length });
});

// Get all messages
app.get('/msg/getAll', function(req, res) {
  res.json(allMsgs);
});

// Get a message by index
app.get('/msg/get/*', function(req, res) {
  var parts = req.url.split('/');
  var idx = parseInt(parts[parts.length - 1]);
  if (isNaN(idx) || idx < 0 || idx >= allMsgs.length) {
    res.json({ code: 0 });
  } else {
    res.json({ code: 1, msg: allMsgs[idx] });
  }
});

// Post a new message  (/msg/post/[message]?author=xxx)
app.get('/msg/post/*', function(req, res) {
  var parts = req.url.split('?')[0].split('/');
  var text = unescape(parts.slice(3).join('/'));
  var author = req.query.author ? unescape(req.query.author) : 'Anonymous';
  var newMsg = { text: text, author: author, date: new Date().toISOString() };
  allMsgs.push(newMsg);
  res.json({ code: 1, index: allMsgs.length - 1 });
});

// Delete a message by index
app.get('/msg/del/*', function(req, res) {
  var parts = req.url.split('/');
  var idx = parseInt(parts[parts.length - 1]);
  if (isNaN(idx) || idx < 0 || idx >= allMsgs.length) {
    res.json({ code: 0 });
  } else {
    allMsgs.splice(idx, 1);
    res.json({ code: 1 });
  }
});

app.listen(5000);
console.log("App listening on port 5000...");
