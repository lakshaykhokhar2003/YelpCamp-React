const mongoose = require('mongoose');
const express = require('express')
const app = express();
const cors = require('cors');
const session = require('express-session')
const MongoDBStore = require('connect-mongo');
const {MongoClient, ServerApiVersion} = require('mongodb');
const passport = require("passport");
const LocalStrategy = require('passport-local')
const jwt = require('jsonwebtoken');
const Campgrounds = require('../src/models/campgroundModel')
const uri = "mongodb://localhost:27017/yelp-camp";

const User = require('./models/userModel')
const Review = require('./models/reviewModel')


const secret = process.env.REACT_APP_SECRET || 'thisshouldbeabettersecret!';

const store = new MongoDBStore({
    mongoUrl: uri, secret, touchAfter: 24 * 60 * 60
})
store.on("error", function (e) {
    console.log("Session Store Error", e)
})

// const sessionConfig = {
//     store, name: 'session', secret, resave: false, saveUninitialized: true, cookie: {
//         httpOnly: true, // secure: true,
//         expires: Date.now() + 1000 * 60 * 60 * 24 * 7, maxAge: 1000 * 60 * 60 * 24 * 7
//     }
// }
app.use(express.json());
app.use(session({secret, resave: false, saveUninitialized: true}))
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Add other headers if needed
}));

mongoose.connect('mongodb://localhost:27017/yelp-camp').then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1, strict: true, deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        await client.close();
    }
}

run().catch(console.dir);

app.get('/campgrounds', async (req, res) => {
    try {
        const campgrounds = await Campgrounds.find({});
        res.json({campgrounds});
        // console.log(campgrounds)
    } catch (err) {
        console.log("Error: ", err.message)
        res.status(500).json({error: err.message});
    }
});

app.get('/campgrounds/:id', async (req, res) => {
    try {
        const campgrounds = await Campgrounds.findById(req.params.id).populate({
            path: 'reviews', populate: {
                path: 'author'
            }
        }).populate('author')
        // console.log(campgrounds)
        res.json({campgrounds})
    } catch (err) {
        console.log("Error: ", err.message)
        res.status(500).json({error: err.message});
    }
})

app.post('/campgrounds/:id/reviews', async (req, res) => {
    try {
        const campground = await Campgrounds.findById(req.params.id)
        const review = new Review(req.body);
        review.author = req.body.user
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        console.log(review)
        return res.status(200).json({message: 'Created a new review', review});
    } catch (err) {
        console.log("Error: ", err.message)
        res.status(500).json({error: err.message});
    }
})


app.post('/register', async (req, res) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        const token = jwt.sign({userId: registeredUser._id}, secret, {expiresIn: '1h'});
        const data = {user: registeredUser._id, token}
        return res.status(200).json({message: 'Registration successful', registerData: data});
    } catch (err) {
        console.log(`Error: ${err.message}`);
        return res.status(500).json({error: err.message});
    }
});


app.post('/login', passport.authenticate('local', {
    failureFlash: true, failureRedirect: '/login', keepSessionInfo: true
}), (req, res) => {
    try {
        const token = jwt.sign({userId: req.user._id}, secret, {expiresIn: '1h'});
        const data = {user: req.user._id, token}
        return res.status(200).json({message: 'Logged In', data});
    } catch (err) {
        console.log(`Error: ${err.message}`);
        return res.status(500).json({error: err.message});
    }
});


app.listen(3000, () => {
    console.log('Serving on port 3000')
})

