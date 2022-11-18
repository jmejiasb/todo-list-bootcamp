const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();
var items = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB")

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to the To Do List!"
});

const defaultItems = [item1]

app.get("/", function(req, res) {
  Item.find({}, function(err, foundItems){
    if(foundItems.lenght === 0){
      Item.insertMany(defaultItems, function(err){
        if (err){
          console.log(err);
        } else {
          console.log("Successfully added default Items");
        };
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "To Do List", items: foundItems});
    };
  });
});

app.post("/", function(req, res){
  const itemName = req.body.newItem;

  const item = new Item({name: itemName});

  item.save();

  res.redirect("/");

});

app.post("/delete", function(req, res){

  const checkedItem = req.body.checkbox

  Item.findByIdAndDelete(checkedItem, function(err){
    if(!err){
      console.log("Successfully deleted checked Item")
      res.redirect("/");
    };

  });

});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is up");
});
