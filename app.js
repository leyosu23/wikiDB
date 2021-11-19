//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
  title: String,
  contecnt: String
};

const Article = mongoose.model("Article", articleSchema);

// chained Route Handlers

// request for all articles
app.route("/articles")

.get(function(req, res){
  Article.find(function(err, foundArticle){
    if(!err){
      res.send(foundArticle);
    }
    else{
      res.send(err);
    }
  })
})

.post(function(req, res){
  console.log(req.body.title);
  console.log(req.body.content);

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
    if (!err){
      res.send("Successfully added a new article");
    } else {
      req.send(err);
    }
  });
})

.delete(function(req,res){
  Article.deleteMany(function(err){
    if (!err){
      res.send("Successfully deleted all articles")
    } else {
      res.send(err);
    }
  });
})

// request for a specific article

app.route("/articles/:articleTitle")

.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No matching article was found");
    }
  })
})

// put request is like replacing a broken bicycle with a complete brand-new one, 
// completely wipe out the resources, for example, if only content is given for the update,
// it will wipe out title for collection and no longer exists
.put(function(req, res) {
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content:req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated an article")
      }
    }
  )
})

// patch request tell mongo db to only update the fields we have provided 

.patch(function(req, res) {
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated an article")
      }
    }
  )
})

.delete(function(req, res){
  Article.deleteOne({title: req.params.articleTitle}, function(err){
    if (!err) {
      res.send("Successfullyl deleted");
    } else {
      res.send("No matching article was found");
    }
  })
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});