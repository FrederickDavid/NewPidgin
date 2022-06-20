const mongoose = require("mongoose");

const postModel = mongoose.Schema(
	{
		word: {
			type: String,
		},

		useCase: {
			type: String,
		},

		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
		},

		definition: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "definitions",
			},
		],

		rating: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "ratings",
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("posts", postModel);
