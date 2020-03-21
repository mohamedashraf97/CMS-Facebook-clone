const express = require('express');
const path = require('path')
const exphs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const methodOverride = require('method-override');
const Upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const { mongoDbUrl } = require('./config/database');
const passport = require('passport');

const app = express();


mongoose.connect(mongoDbUrl, { useNewUrlParser: true }).then((db) => {

    console.log('MONGO connected')

}).catch(error => console.log(error));


app.use(express.static(path.join(__dirname, 'public')));


//set view engine
const { select, generateTime } = require('./helpers/handlebars-helpers');


app.engine('handlebars', exphs({ defaultLayout: 'home', helpers: { select: select, generateTime: generateTime } }));
app.set('view engine', 'handlebars')

//uploading middle ware

app.use(Upload());

//body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Method Override

app.use(methodOverride('_method'));

app.use(session({
    secret: 'Ramoza',
    resave: true,
    saveUninitialized: true,
}));

app.use(flash());

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());
//local variables using middleware

app.use((req, res, next) => {

    res.locals.user = req.user || null
    res.locals.success_message = req.flash('success_message')
    res.locals.error_message = req.flash('error_message')
    res.locals.form_errors = req.flash('form_errors')
    res.locals.error = req.flash('error')

    next();
})


//loading routes
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');
const comments = require('./routes/admin/comments');



//using routes
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);
app.use('/admin/comments', comments);



port = 4500 || process.env.PORT;

app.listen(port, () => {

    console.log('listening at port 4500')



});