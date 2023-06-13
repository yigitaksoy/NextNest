const mongoose = require("mongoose");
const Listing = require("./listing");

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  userSearch: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  userListings: {
    type: [Listing.schema],
    default: [],
  },
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
