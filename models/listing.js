const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js'); // Import the Review model

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    image: {
        url: {
            type: String,
            required: true
        },
        filename: {
            type: String,
            required: true
        }
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
    },
    category: {
        type: String,
        enum: [
            'Trending',
            'Rooms',
            'Iconic Cities',
            'Mountains',
            'Castles',
            'Amazing Pools',
            'Camping',
            'Farms',
            'Domes',
            'Arctic',
            'Boats'
        ],
            required: true
    }
});

listingSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;