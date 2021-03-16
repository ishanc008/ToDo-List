const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const getDate = require(__dirname+"/date.js");
const _ = require("lodash");

const app = express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://admin-ishan:1234@cluster0.kqhih.mongodb.net/todolistDB",{useNewUrlParser:true});
const itemSchema = {
    name : String
};

const item = mongoose.model("item",itemSchema);

const listSchema = {
    name:String,
    items:[itemSchema]
}

const list = mongoose.model("list",listSchema);

const item1 = new item({
    name:"Welcome to your TO-DO-LIST"
})

const item2 = new item({
    name:"Hit the + button to add elements to your TO-DO-LIST"
})

const defaultItems = [item1,item2];

app.get("/",function(req,res){
    const date = getDate.getDate();
    item.find({},function(err,items){
        if(err){
            console.log("error");
        }else{
            if(items.length===0)
            {
                item.insertMany(defaultItems,function(err){
                    if(err){
                        console.log("error");
                    }else{
                        console.log("Successfully added");
                    }
                });
                res.redirect("/");
            }
            else{
                res.render("list",{
                    listTitle:date,
                    itemsArray:items
                });
            }
        }
    })
})

app.get("/:pageName",function(req,res){
    const listName = _.capitalize(req.params.pageName);
    list.findOne({name:listName},function(err,foundList){
        if(!err)
        {
            if(!foundList){
                console.log("doesnt exist");
                const newList = new list({
                    name: listName,
                    items:defaultItems
                })
                newList.save();
                res.redirect("/"+listName);
            }
            else{
                //console.log("exist");
                res.render("list",{
                    listTitle:foundList.name,
                    itemsArray:foundList.items
                });
            }
        } 
    })
})

app.post("/",function(req,res){
    const newItem = req.body.newItem;
    const item_new = new item({
        name: newItem
    })
    const listName = req.body.button;
    //console.log(listName);
    if(listName===getDate.getDate())
    {
       item_new.save();
       res.redirect("/");
    }
    else{
        defaultItems.push(item_new);
        list.findOne({name:listName},function(err,foundList){
            foundList.items.push(item_new);
            foundList.save();
            res.redirect("/"+listName);
        })
    }
})

app.post("/delete",function(req,res){
    const itemDelete = req.body.checked;
    if(itemDelete==="604b2e31cf19de3d1463f847" || itemDelete==="604b2d7bda88053be8e5a0c5")
    {
        res.redirect("/");
    }
    else{
        const listName = req.body.listName;
        if(listName===getDate.getDate())
        {
            item.deleteOne({_id:itemDelete},function(err){
                if(err){
                    console.log("error");
                }else{
                    console.log("Successfully deleted");
                }
            })
            res.redirect("/");
        }
        else{
            list.findOneAndUpdate(
                {name : listName},
                {$pull:{items:{_id:itemDelete}}},
                function(err,foundList){
                    if(!err)
                    {
                        res.redirect("/"+listName);
                    }
                }
            )
        }
    } 
})

app.listen(3000,function(){
    console.log("server is running on port 3000");
});