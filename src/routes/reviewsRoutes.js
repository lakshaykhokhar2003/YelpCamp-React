const express = require('express')
const Campgrounds = require("../models/campgroundModel");
const Review = require("../models/reviewModel");
const router = express.Router({mergeParams: true})

router.route('/')
    .post(async (req, res) => {
        try {
            const campground = await Campgrounds.findById(req.params.id)
            const review = new Review(req.body);
            review.author = req.body.user
            campground.reviews.push(review);
            await review.save();
            await campground.save();
            return res.status(200).json({message: 'Created a new review', review});
        } catch (err) {
            console.log("Error in reviewsRoutes: ", err.message)
            res.status(500).json({error: err.message});
        }
    })

router.route('/:reviewId')
    .delete(async (req, res) => {
        try {
            const {id, reviewId} = req.params
            await Campgrounds.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
            await Review.findByIdAndDelete(reviewId);
            return res.status(200).json({message: 'Successfully deleted review'});
        } catch (err) {
            console.log("Error in reviewsRoutes: ", err.message)
            res.status(500).json({error: err.message});
        }
    })

module.exports = router;
