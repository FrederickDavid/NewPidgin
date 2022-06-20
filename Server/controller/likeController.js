const userModel = require("../model/userModel");
const postModel = require("../model/postModel");
const likeModel = require("../model/likeModel");
const definitionModel = require("../model/likeModel");
const mongoose = require("mongoose");

const createLike = async (req, res) => {
	try {
		const user = await userModel.findById(req.params.id);

		// if (user) {
		// 	res.status(201).json({
		// 		message: "Already Liked",
		// 	});
		// } else {
		const createDefinition = await definitionModel.findById(
			req.params.definition
		);
		const createLike = await new likeModel({ user: req.params.id });

		createLike.definition = createDefinition;
		createLike.save();

		createDefinition.like.push(mongoose.Types.ObjectId(createLike._id));
		createDefinition.save();

		res.status(201).json({
			message: "Like Added",
			data: createLike,
		});
		// }
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const deleteLike = async (req, res) => {
	try {
		const post = await postModel.findById(req.params.post);
		const remove = await likeModel.findByIdAndRemove(req.params.like);

		post.like.pull(remove);
		post.save();

		res.status(200).json({
			message: "Deleted successfully",
		});
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const getLikes = async (req, res) => {
	try {
		const getLikes = await likeModel.find();
		res.status(200).json({
			message: "like successfully",
			data: getLikes,
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
	createLike,
	deleteLike,
	getLikes,
};
