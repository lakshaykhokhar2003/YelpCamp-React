const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});

const mongoose = require('mongoose');
const express = require('express')
const app = express();
const cors = require('cors');
const session = require('express-session')
const {MongoClient, ServerApiVersion} = require('mongodb');
const passport = require("passport");
const LocalStrategy = require('passport-local')
const uri = "mongodb://localhost:27017/yelp-camp";

const User = require('./models/userModel')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')


const secret = process.env.REACT_APP_SECRET || 'thisshouldbeabettersecret!';

app.use(express.json());
app.use(session({secret, resave: false, saveUninitialized: true}))
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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

app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/', userRoutes)

app.listen(3000, () => {
    console.log('Serving on port 3000')
})

