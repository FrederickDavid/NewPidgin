const userModel = require("../model/userModel");
const likeModel = require("../model/likeModel");
const definitionModel = require("../model/definitionModel");
const mongoose = require("mongoose");

const createMyLike = async (req, res) => {
	try {
		const user = await likeModel.findById(req.params.id);

		if (user) {
			res.status(201).json({
				message: "user have Already liked Before",
			});
		} else {
			const createPost = await definitionModel.findById(req.params.definition);
			const newDefinition = new likeModel({ _id: req.params.id });

			newDefinition.definition = createPost;
			newDefinition.save();

			createPost.like.push(mongoose.Types.ObjectId(newDefinition._id));
			createPost.save();

			res.status(201).json({
				message: "Like has been Added",
				data: newDefinition,
			});
		}
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const getMyLike = async (req, res) => {
	try {
		const post = await definitionModel
			.findById(req.params.definition)
			.populate("like");

		res.status(200).json({
			message: "gotten Post",
			data: post,
		});
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const deleteMyLike = async (req, res) => {
	try {
		const getPost = await definitionModel.findById(req.params.definition);
		const remove = await likeModel.findByIdAndRemove(req.params.like);

		getPost.like.pull(remove);
		getPost.save();

		res.status(201).json({
			message: "deleted",
		});
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};

// const createDefinition = async(req, res)=>{
//     try {

//     } catch (error) {
//         res.status(404).json({
//             message: error.message,
//         })
//     }
// }

module.exports = {
	getMyLike,
	createMyLike,
	deleteMyLike,
};
