const express = require("express");
const {
	getMyLike,
	createMyLike,
	deleteMyLike,
} = require("../controller/newLikeController");
const router = express.Router();

// router.route("/likes").get(getAllPost);
router.route("/:id/:post/:definition/like").post(createMyLike);
router.route("/:id/:post/:definition/like").get(getMyLike);

router.route("/:id/:post/:definition/like/:like").delete(deleteMyLike);

module.exports = router;
