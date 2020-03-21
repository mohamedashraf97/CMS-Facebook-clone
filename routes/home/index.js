const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.all('/*', (req, res, next) => {

    req.app.locals.layout = 'home';
    next();
})

router.get('/', (req, res) => {
    Post.find({}).then(posts => {
        Category.find({}).then(categories => {

            res.render('home/index', { posts: posts, categories: categories });
        })
    })
})

router.get('/about', (req, res) => {
    res.render('home/about');
})

router.get('/register', (req, res) => {
    res.render('home/register');
})

router.post('/register', (req, res) => {



    let errors = [];
    if (!req.body.firstName) {

        errors.push({ message: '7ot esm bellah 3lek' });

    }

    if (!req.body.lastName) {

        errors.push({ message: '7ot tany esm bellah 3lek' });

    }
    if (!req.body.password) {

        errors.push({ message: '7ot  password bellah 3lek' });

    }
    if (req.body.password !== req.body.passwordConfirm) {

        errors.push({ message: '7ot  password hea hea bellah 3lek' });

    }

    if (!req.body.email) {

        errors.push({ message: '7ot emailbellah 3lek' });

    }

    if (errors.length > 0) {

        res.render('home/register', {

            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,
            email: req.body.email
        })

    } else {

        User.findOne({ email: req.body.email }).then(user => {

            if (!user) {

                const newUser = new User({

                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    password: req.body.password,
                    email: req.body.email

                });

                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, function(err, hash) {

                        newUser.password = hash;
                        newUser.save().then(savedUser => {
                            req.flash('success_message', 'You are now registered')
                            res.redirect('/login');

                        });
                    });
                });

            } else {

                req.flash('error_message', 'Email mwgod y3m !');
                res.redirect('/login');
            };
        });
    };

});

router.get('/login', (req, res) => {
    res.render('home/login');
})


passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {

    User.findOne({ email: email }).then(user => {


        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }

        bcrypt.compare(password, user.password, (err, matched) => {

            if (err) return err;
            if (matched) {

                return done(null, user)
            } else {
                return done(null, false, { message: 'Incorrect password.' });

            }

        })

    })


}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/login', (req, res, next) => {

    passport.authenticate('local', {

        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true

    })(req, res, next)

})

router.get('/logout', (req, res) => {

    req.logOut();
    res.redirect('/login');


})


router.get('/post/:slug', (req, res) => {

    Post.findOne({ slug: req.params.slug })
        .then(post => {
            Category.find({}).then(categories => {

                res.render('home/post', { post: post, categories: categories });
            })
        });


})



module.exports = router;