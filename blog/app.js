// @ts-check 
const port=3000||process.env.PORT;
const bodyParser=require("body-parser");
const methodOverride=require("method-override");
const expressSanitizer=require("express-sanitizer");
const mongoose=require("mongoose");
const express=require("express");
const app=express();

// app config
mongoose.connect("mongodb://localhost:27017/blog_app", {useNewUrlParser: true});
mongoose.set("useFindAndModify", false);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// mongoose/model config
var blogSchema= new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type:Date, default: Date.now}
});
var Blog=mongoose.model("Blog", blogSchema);

// RESTFUL ROUTES

app.get("/", function(req, res){
	res.redirect("/blogs");
});

// index route
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("ERror");
		}else{
			res.render("index", {blogs: blogs});
		}
	});
});

// new route
app.get("/blogs/new", function(req, res){
	res.render("new");
});
// create route
app.post("/blogs", function(req, res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
    // create blog
    console.log(req.body);//show data on console
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            //then, redirect to the index
            res.redirect("/blogs");
        }
    });
});
// show route
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show", {blog: foundBlog});
		}
	});
});
// edit route
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit", {blog: foundBlog});
		}
	});
});
// update route
app.put("/blogs/:id", function(req, res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	console.log(req.body);//show data on console
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});
// delete route
app.delete("/blogs/:id", function(req, res){
	//destroy blog
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	});
	//redirect somewhere
});

app.listen(port, function(){
	console.log("Server is running on port "+port);
});