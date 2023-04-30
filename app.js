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


app.listen(PORT, function () {
    console.log(`Server started on port ${PORT}`);
});