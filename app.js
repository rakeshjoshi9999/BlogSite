var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

//APP Config
mongoose.connect("mongodb://localhost/Blogs_app",{useMongoClient: true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//mongoose Config
var blogSchema = new mongoose.Schema({
  title:String,
  image:String,
  body:String,
  created:{
    type:Date,
    default:Date.now()
  }
});
var Blog = mongoose.model("Blog",blogSchema);



//RESTFUL routes
app.get("/",function (req,res) {
  res.redirect("/blogs");
});

//Index route
app.get("/blogs",function (req,res) {
  Blog.find({},function (err,blogs) {
    if(err){
      console.log(err);
    }
    else{
        res.render("index",{blogs:blogs});
    }
  })
});

//new Route

app.get("/blogs/new",function (req,res) {
    res.render("new");
});

//Create Route
app.post("/blogs",function (req,res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog,function (err,newBlogdata) {
      if (err) {
        console.log("Error in Create Route:"+err);
        res.render("new");
      }else {
        res.redirect("/blogs");
      }
  });
});

//show Route
app.get("/blogs/:id",function (req,res) {
  Blog.findById(req.params.id,function (err,foundBlog) {
    if(err){
      console.log("Error in show route:"+err);
      res.redirect("/blogs");
    }else {
        res.render("show",{foundBlog:foundBlog});
    }
  });
});

//edit post route
app.get("/blogs/:id/edit",function(req,res){
  Blog.findById(req.params.id,function (err,foundBlog) {
    if(err){
      console.log("Error in Edit Route:"+err);
    }else {
      res.render("edit",{blog:foundBlog});
    }
  });
});

//update route
app.put("/blogs/:id",function (req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog) {
    if(err){
      console.log("Error in Edit Route:"+err);
      res.redirect("/blogs");
    }else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

// Delete route

app.delete("/blogs/:id",function (req,res) {
  Blog.findByIdAndRemove(req.params.id,function (err,foundBlog) {
    if(err){
      console.log("Error in the delete route"+err);
      res.redirect("/blogs");
    }else {
      res.redirect("/blogs");
    }
  });
});

//listen
app.listen(3000,function () {
  console.log("Server running on Port 3000");
});
