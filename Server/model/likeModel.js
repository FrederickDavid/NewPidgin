const mongoose = require("mongoose");

const likeModel = mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
		},

		like: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "likes",
		},

		definition: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "definitions",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("likes", likeModel);
