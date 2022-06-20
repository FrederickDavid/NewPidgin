const mongoose = require("mongoose");

const ratingModel = mongoose.Schema(
	{
		rate: {
			type: Number,
		},

		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
		},

		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "posts",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("ratings", ratingModel);
