var bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    express = require('express'),
    app = express();

//App Config
mongoose.connect('mongodb://localhost/bloggyblog');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

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

app.get('/blogs', function(req, res){
    Blog.find({}, function(err, blogs) {
        if(err) {
            console.log(err);
        } else {
            res.render('index', {blogs: blogs});
        }
    });
});

app.listen(4000, function(){
    console.log('Server running on localhost 4000')
});