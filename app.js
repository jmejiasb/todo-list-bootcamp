const express = require("express");
const bodyParser = require("body-parser");

const app = express();
var items = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {

  var today = new Date();
  var currentDay = today.getDay();
  var options ={
    weekday: "long",
    day:"numeric",
    month: "long"
  };

  var day = today.toLocaleDateString("en-EN", options);

  res.render("list", {day: day, items: items});
});

app.post("/", function(req, res){
  let item = req.body.newItem;

  items.push(item);

  res.redirect("/");

});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is up");
});
