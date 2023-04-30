const express = require('express');
const bodyParser = require("body-parser");
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB")
    .then(() => console.log('Connected to MongoDB!'));

const articleSchema = {
    title: String,
    content: String
}
const Article = mongoose.model("Article", articleSchema);


// ######### Request Targeting all articles #########
app.route("/articles")

    .get(async (req, res) => {
        try {
            const foundArticles = await Article.find();
            // console.log(foundArticles);
            res.send(foundArticles);
        } catch (err) {
            // console.log(err);
            res.send(err);
        }
    })

    .post(async function (req, res) {
        try {
            const newArticle = new Article({
                title: req.body.title,
                content: req.body.content
            });
            await newArticle.save();
            res.send("Successfully added a new article.");
        } catch (error) {
            res.send(error);
        }
    })

    .delete(async function (req, res) {
        try {
            await Article.deleteMany({});
            res.send("Successfully deleted all articles.");
        } catch (error) {
            res.send(error);
        }
    })

    .put(async function (req, res) {
        try {
            console.log("a");
        } catch (err) {
            console.log(err);
        }
    });

// ######### Request Targeting a specific articles #########
app.route("/articles/:articlesTitle")

    .get(async function (req, res) {
        try {
            const foundArticles = Article.findOne({ title: req.params.articlesTitle });
            if (foundArticles) {
                res.send(foundArticles);
            } else {
                res.send("No articles mathing that title was found.");
            }
        } catch (err) {
            console.log(err);
            res.status(400).json({
                message: "Something went wrong",
            })
        }
    });


app.listen(PORT, function () {
    console.log(`Server started on port ${PORT}`);
});