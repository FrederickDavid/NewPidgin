const express = require("express");
const {
	deleteDefinition,
	createDefinition,
	getDefinition,
} = require("../controller/definitionController");

const router = express.Router();

router.route("/:id/:post/").post(createDefinition);
router.route("/:id/:post/").get(getDefinition);

router.route("/:id/:post/:definition").delete(deleteDefinition);

module.exports = router;
