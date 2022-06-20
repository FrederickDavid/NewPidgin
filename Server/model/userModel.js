const mongoose = require("mongoose");

const userModel = mongoose.Schema(
	{
		fullName: {
			type: String,
		},
		email: {
			type: String,
			unique: true,
		},
		password: {
			type: String,
		},
		gender: {
			type: String,
		},
		bio: {
			type: String,
		},
		avatar: {
			type: String,
		},
		avatarID: {
			type: String,
		},
		verifiedToken: {
			type: String,
		},
		isVerified: {
			type: Boolean,
		},
		post: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "posts",
			},
		],
		saved: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "saves",
			},
		],
		definition: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "definitions",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("users", userModel);
