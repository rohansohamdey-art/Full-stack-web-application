
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");

const { listingSchema, reviewSchema } = require("./schema.js");

// LOGIN CHECK
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;

        req.flash(
            "error",
            "You must be logged in to perform this action!"
        );

        return res.redirect("/login");
    }

    next();
};

// SAVE REDIRECT URL
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
};

// OWNER CHECK
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        return next(new ExpressError(404, "Listing Not Found!"));
    }

    if (
        !req.user ||
        !listing.owner ||
        !listing.owner.equals(req.user._id)
    ) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

// LISTING VALIDATION
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body.listing);

    if (error) {
        const msg = error.details
            .map(el => el.message)
            .join(",");

        return next(new ExpressError(400, msg));
    }

    next();
};

// REVIEW VALIDATION
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const msg = error.details
            .map(el => el.message)
            .join(",");

        return next(new ExpressError(400, msg));
    }

    next();
};

// REVIEW OWNER CHECK
module.exports.isReviewOwner = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
        return next(new ExpressError(404, "Review Not Found!"));
    }

    if (
        !req.user ||
        !review.author ||
        !review.author.equals(req.user._id)
    ) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
