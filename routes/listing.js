const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const {
    isLoggedIn,
    isOwner,
    validateListing
} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

// ==================== Index and Create ROUTES ====================
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'), wrapAsync(listingController.createListing));

// ==================== NEW ROUTE ====================

router.get("/new", isLoggedIn, listingController.renderNewForm);


//===================== SHOW, UPDATE, DELETE ROUTES ====================

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        wrapAsync(listingController.updateListing)
)   .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// ==================== EDIT ROUTE ====================

router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;