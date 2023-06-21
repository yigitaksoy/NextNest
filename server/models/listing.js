const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  image: String,
  title: String,
  url: String,
  price: String,
  neighbourhood: String,
  listingType: String,
  details: {
    price_per_m2: String,
    listed_since: String,
    status: String,
    type_apartment: String,
    living_area: String,
    number_of_rooms: String,
    located_at: String,
  },
});

const Listing = mongoose.model("Listing", listingSchema, "listings");

module.exports = Listing;
