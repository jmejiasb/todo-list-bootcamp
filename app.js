const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();
var items = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const listsSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listsSchema);

const item1 = new Item({
  name: "Welcome to the To Do List!"
});

const item2 = new Item({
  name: "Have a great day!"
});


const defaultItems = [item1, item2];

app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems){
    console.log(foundItems);
    if (foundItems.lenght === 0){
      Item.insertMany(defaultItems, function(err){
        if (err){
          console.log(err);
        } else {
          console.log("Successfully added default Items");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "To Do List", items: foundItems});
    }
  });
});

app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const listName = req.body.list

  const item = new Item({name: itemName});

  if (listName === "To Do List"){
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }


});

app.get("/list/:customList", function(req, res){

  const customListName = req.params.customList;

  List.findOne({name: customListName}, function(err, foundList){
    if (!err){
      if(!foundList){
        // Create a new List
        const list = new List({
          name: customListName,
          items: defaultItems
        });

        list.save();
        res.redirect("/" + customListName);
      } else {
        //Show an existing list
        res.render("list", {listTitle: foundList.name, items: foundList.items});
      }
    }
  });

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
