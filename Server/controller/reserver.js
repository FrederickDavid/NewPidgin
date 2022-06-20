const getAllPost = async (req, res) => {
	try {
		const post = await postModel.find();

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
