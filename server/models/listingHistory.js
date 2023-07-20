const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StatusUpdateSchema = new Schema({
  date: { type: Date, required: true },
  status: { type: String, required: true },
});

const ListingHistorySchema = new Schema({
  listing: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
  updates: [StatusUpdateSchema],
});

module.exports = mongoose.model(
  "ListingHistory",
  ListingHistorySchema,
  "listingHistory"
);
