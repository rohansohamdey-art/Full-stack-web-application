const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");


// ==================== CREATE REVIEW ====================

module.exports.createReview = async (req, res, next) => {

    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        return next(
            new ExpressError(404, "Listing Not Found!")
        );
    }

    // Create review
    const review = new Review(req.body.review);

    // Add logged-in user as author
    review.author = req.user._id;

    // Connect review with listing
    review.listing = listing._id;

    await review.save();

    // Add review to listing
    listing.reviews.push(review._id);

    await listing.save();

    req.flash("success", "New Review created!");

    return res.redirect(`/listings/${listing._id}`);
};


// ==================== DELETE REVIEW ====================

module.exports.deleteReview = async (req, res) => {

    const { id, reviewId } = req.params;

    await Review.findByIdAndDelete(reviewId);

    await Listing.findByIdAndUpdate(
        id,
        {
            $pull: {
                reviews: reviewId
            }
        }
    );

    req.flash("success", "Review Deleted!");

    return res.redirect(`/listings/${id}`);
};