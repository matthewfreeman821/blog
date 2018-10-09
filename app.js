var bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    expressSanitizer = require('express-sanitizer'),
    mongoose = require('mongoose'),
    express = require('express'),
    app = express();

//App Config
mongoose.connect('mongodb://localhost/bloggyblog');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//Mongoose/Model Config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model('Blog', blogSchema);

// Blog.create({
//     title: 'Test blog',
//     image: 'https://farm5.staticflickr.com/4045/4234417469_ce298ae056.jpg',
//     body: 'Hello! This is a blog post!'
// });

//Restful Routes
app.get('/', function(req, res){
    res.redirect('/blogs');
})

// INDEX ROUTE
app.get('/blogs', function(req, res){
    Blog.find({}, function(err, blogs) {
        if(err) {
            console.log(err);
        } else {
            res.render('index', {blogs: blogs});
        }
    });
});

// NEW ROUTE
app.get('/blogs/new', function(req, res){
    res.render('new');
});

// CREATE ROUTE
app.post('/blogs', function(req, res){
    //create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render('new');
        } else {
            res.redirect('/blogs');
        }
    });
    //redirect to the index
});

// SHOW ROUTE
app.get('/blogs/:id', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            res.redirect('/blogs');
        } else {
            res.render('show', {blog: foundBlog});
        }
    });
});

//EDIT ROUTE
app.get('/blogs/:id/edit', function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            res.redirect('/blogs');
        } else {
            res.render('edit', {blog: foundBlog});
        }
    })
})

//UPDATE ROUTE
app.put('/blogs/:id', function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findOneAndUpdate(req.param.id, req.body.blog, function(err, updatedBlog) {
        if(err) {
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    });
})

// DELETE ROUTE
app.delete('/blogs/:id', function(req, res) {
    //Destroy the blog
    Blog.findOneAndDelete(req.params.id, function(err) {
        if(err) {
            console.log(err);
            res.redirect('/blogs');
        } else {
            //redirect somewhere
            res.redirect('/blogs');
        }
    });
});

app.listen(4000, function(){
    console.log('Server running on localhost 4000')
});