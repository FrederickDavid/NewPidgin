const mongoose = require("mongoose");

const definitionModel = mongoose.Schema(
	{
		meaning: {
			type: String,
		},

		useCase: {
			type: String,
		},

		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
		},

		like: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "likes",
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("definitions", definitionModel);
