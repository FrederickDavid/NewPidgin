const userModel = require("../model/userModel");
const postModel = require("../model/postModel");
const mongoose = require("mongoose");

const getAllPost = async (req, res) => {
	try {
		const post = await postModel.find().sort({ word: "asc" });

		res.status(200).json({
			status: "Success",
			data: post,
		});
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};
const getPost = async (req, res) => {
	try {
		const post = await postModel.findById(req.params.postid);

		res.status(200).json({
			status: "Success",
			data: post,
		});
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};
const deletePost = async (req, res) => {
	try {
		const post = await postModel.findByIdAndDelete(req.params.id);

		res.status(200).json({
			message: "Deleted successfully",
		});
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};
const createPost = async (req, res) => {
	try {
		const { word } = req.body;
		const getUser = await userModel.findById(req.params.id);
		const postContent = new postModel({
			word,
		});

		postContent.user = getUser;
		postContent.save();

		getUser.post.push(mongoose.Types.ObjectId(postContent._id));
		getUser.save();

		res.status(201).json({
			status: "Success",
			data: postContent,
		});
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};

// const updatePost = async(req, res)=>{
//     try {

//     } catch (error) {
//         res.status(404).json({
//             message: error.message,
//         })
//     }
// }

module.exports = {
	getAllPost,
	getPost,
	createPost,
	deletePost,
};
