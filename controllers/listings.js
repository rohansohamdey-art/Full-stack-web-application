const mongoose = require("mongoose");

const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });

// ==================== INDEX ROUTE ====================
module.exports.index= async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });

};

// ==================== NEW ROUTE ====================
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

// ==================== SHOW ROUTE ====================
module.exports.showListing = async (req, res, next) => {

    const { id } = req.params;

    // Check valid ObjectId
    if (!mongoose.isValidObjectId(id)) {
        return next(
            new ExpressError(
                404,
                "Listing Not Found!"
            )
        );
    }
    const listing = await Listing
        .findById(id)
        .populate({path:"reviews",
            populate:{
                path:"author",
                // model:"User"
            },
        })
        .populate("owner");

    if (!listing) {
        return next(
            new ExpressError(
                404,
                "Listing Not Found!"
            )
        );
    }

    // if(!listing){
    //     req.flash("error", "Does not exist!");
    //     res.redirect("/listings");
    // };

    console.log(listing);
    res.render("listings/show.ejs", { listing });

};

// ==================== CREATE ROUTE ====================
module.exports.createListing = async (req, res, next) => {

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location
    })
    .send()

    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    // Cloudinary image
    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New listing created!");
    return res.redirect(`/listings/${newListing._id}`);
};

// ==================== EDIT ROUTE ====================
module.exports.renderEditForm = async (req, res, next) => {

    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return next(
            new ExpressError(
                404,
                "Listing Not Found!"
            )
        );
    }

    const listing = await Listing.findById(id);

    if (!listing) {
        return next(
            new ExpressError(
                404,
                "Listing Not Found!"
            )
        );
    }

    if(!listing){
        req.flash("error", "Does not exist!");
        res.redirect("/listings");
    };

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload/", "/upload/w_300,h_200,c_fill/");
    res.render("listings/edit.ejs", { listing, originalImageUrl });

};

// ==================== UPDATE ROUTE ====================
module.exports.updateListing = async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return next(new ExpressError(404, "Listing Not Found!"));
    }

    const listing = await Listing.findById(id);

    if (!listing) {
        return next(new ExpressError(404, "Listing Not Found!"));
    }

    // Update normal listing information
    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.location = req.body.listing.location;
    listing.country = req.body.listing.country;

    // If a new image is uploaded
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await listing.save();
    req.flash("success", "Listing Updated!");
    return res.redirect(`/listings/${listing._id}`);
};

// ==================== DELETE ROUTE ====================

module.exports.deleteListing = async (req, res, next) => {

    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return next(
            new ExpressError(
                404,
                "Listing Not Found!"
            )
        );
    }
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");

};