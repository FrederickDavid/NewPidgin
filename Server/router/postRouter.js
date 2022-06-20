const express = require("express");
const {
	getAllPost,
	getPost,
	createPost,
	deletePost,
} = require("../controller/postController");
const router = express.Router();

router.route("/posts").get(getAllPost);
router.route("/:id/createPosts").post(createPost);

router.route("/:id/:postid").get(getPost).delete(deletePost);

module.exports = router;
