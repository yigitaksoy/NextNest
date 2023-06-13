const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  image: String,
  title: String,
  url: String,
  price: String,
  details: [String],
});

const Listing = mongoose.model("Listing", listingSchema, "listings");

module.exports = Listing;
