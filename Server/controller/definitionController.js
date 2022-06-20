const userModel = require("../model/userModel");
const postModel = require("../model/postModel");
const definitionModel = require("../model/definitionModel");
const mongoose = require("mongoose");

const createDefinition = async (req, res) => {
	try {
		const { useCase, meaning } = req.body;

		const definitions = await definitionModel.findById(req.params.id);

		if (definitions) {
			const newDefinition = await definitionModel.findByIdAndUpdate(
				definitions._id,
				{
					useCase,
					meaning,
				},
				{ new: true }
			);

			res.status(201).json({
				message: "update done",
				data: newDefinition,
			});
		} else {
			const createPost = await postModel.findById(req.params.post);
			const newDefinition = new definitionModel({
				useCase,
				meaning,
				_id: req.params.id,
			});

			newDefinition.post = createPost;
			newDefinition.save();

			createPost.definition.push(mongoose.Types.ObjectId(newDefinition._id));
			createPost.save();

			res.status(201).json({
				message: "definition created",
				data: newDefinition,
			});
		}
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const getDefinition = async (req, res) => {
	try {
		const post = await postModel
			.findById(req.params.post)
			.populate("definition");

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

const deleteDefinition = async (req, res) => {
	try {
		const getPost = await postModel.findById(req.params.post);
		const remove = await definitionModel.findByIdAndRemove(
			req.params.definition
		);

		getPost.definition.pull(remove);
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
	deleteDefinition,
	createDefinition,
	getDefinition,
};
