const userModel = require("../model/userModel");
const cloudinary = require("../utils/cloudinary");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const transport = require("../utils/email");

const getAllUsers = async (req, res) => {
	try {
		const user = await userModel.find();
		res.status(200).json({
			message: "success",
			data: user,
		});
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const getUser = async (req, res) => {
	try {
		const user = await userModel.findById(req.params.id);
		res.status(200).json({
			message: "success",
			data: user,
		});
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const deleteUser = async (req, res) => {
	try {
		const user = await userModel.findByIdAndRemove(req.params.id);
		res.status(200).json({
			message: "deleted",
		});
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const updateUser = async (req, res) => {
	try {
		const { fullName, bio, gender } = req.body;
		const user = await userModel.findById(req.params.id);
		if (user) {
			await cloudinary.uploader.destroy(user.avatarID);
			const image = await cloudinary.uploader.upload(req.file.path);

			const newUser = await userModel.findByIdAndUpdate(
				req.params.id,
				{
					fullName,
					bio,
					gender,
					avatar: image.secure_url,
					avatarID: image.public_id,
				},
				{ new: true }
			);

			res.status(200).json({
				message: "success",
				data: newUser,
			});
		}
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const createUser = async (req, res) => {
	try {
		const { fullName, email, password } = req.body;

		const salt = await bcrypt.genSalt(10);
		const hashed = await bcrypt.hash(password, salt);
		const image = await cloudinary.uploader.upload(req.file.path);

		const fakeToken = crypto.randomBytes(64).toString("hex");

		const token = jwt.sign({ fakeToken }, process.env.SECRET, {
			expiresIn: process.env.EXPIRES,
		});

		const user = await userModel.create({
			fullName,
			email,
			password: hashed,
			avatar: image.secure_url,
			avatarID: image.public_id,
			verifiedToken: token,
		});

		const url = `http://localhost:2332/api/user/${user._id}/${token}`;

		const mailOptions = {
			from: "no-reply@gmail.com",
			to: email,
			subject: "Account verification",
			html: `<h3>
            This is for account verification, use this <a
            href="${url}"
            >Link to countinue</a>
            </h3>`,
		};

		transport.sendMail(mailOptions, (err, info) => {
			if (err) {
				console.log(err.message);
			} else {
				console.log("Success", info.response);
			}
		});

		res.status(200).json({
			message: "An email has been sent to you",
		});
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const verifyUser = async (req, res) => {
	try {
		const user = await userModel.findById(req.params.id);
		if (user) {
			if (user.verifiedToken === req.params.token) {
				await userModel.findByIdAndUpdate(
					req.params.id,
					{
						verifiedToken: "",
						isVerified: true,
					},
					{ new: true }
				);
				res.status(200).json({
					message: "Account is now Verify, please signin now!",
				});
			} else {
				res.status(201).json({
					message: "You can't do this",
				});
			}
		} else {
			res.status(201).json({
				message: "user isn't in our db",
			});
		}
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const signinUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await userModel.findOne({ email });
		if (user) {
			const check = await bcrypt.compare(password, user.password);

			if (check) {
				if (user.isVerified && user.verifiedToken !== "") {
					const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
						expiresIn: process.env.EXPIRES2,
					});

					const { password, ...info } = user._doc;

					res.status(200).json({
						message: `welcome back ${user.fullName}`,
						data: { token, ...info },
					});
				} else {
					const fakeToken = crypto.randomBytes(64).toString("hex");

					const token = jwt.sign({ fakeToken }, process.env.SECRET, {
						expiresIn: process.env.EXPIRES,
					});

					const url = `http://localhost:2332/api/user/${user._id}/${token}`;

					const mailOptions = {
						from: "no-reply@gmail.com",
						to: email,
						subject: "Account verification",
						html: `<h3>
            This is for account verification, use this <a
            href="${url}"
            >Link to countinue</a>
            </h3>`,
					};

					transport.sendMail(mailOptions, (err, info) => {
						if (err) {
							console.log(err.message);
						} else {
							console.log("Success", info.response);
						}
					});

					res.status(200).json({
						message: "An email has been sent to you",
					});
				}
			} else {
				res.status(404).json({
					message: "password is incorrect",
				});
			}
		} else {
			res.status(404).json({
				message: "user isn't found",
			});
		}
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const resetUser = async (req, res) => {
	try {
		const { email } = req.body;

		const user = await userModel.findOne({ email });

		if (user) {
			if (user.isVerified) {
				const fakeToken = crypto.randomBytes(64).toString("hex");

				const token = jwt.sign({ fakeToken }, process.env.SECRET, {
					expiresIn: process.env.EXPIRES,
				});

				const url = `http://localhost:2332/api/user/reset/${user._id}/${token}`;

				const mailOptions = {
					from: "no-reply@gmail.com",
					to: email,
					subject: "Request for Password Reset",
					html: `<h3>
            This is a request for Password reset, use this <a
            href="${url}"
            >Link to countinue</a>
            </h3>`,
				};

				transport.sendMail(mailOptions, (err, info) => {
					if (err) {
						console.log(err.message);
					} else {
						console.log("Success", info.response);
					}
				});

				res.status(200).json({
					message: "An email has been sent to you",
				});
			} else {
				res.status(200).json({
					message: "Please go sign in first",
				});
			}
		} else {
			res.status(200).json({
				message: "user isn't in our db",
			});
		}
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const newPassword = async (req, res) => {
	try {
		const { password } = req.body;

		const user = await userModel.findById(req.params.id);
		if (user) {
			if (user.isVerified && user.verifiedToken === req.params.token) {
				const salt = await bcrypt.genSalt(10);
				const hashed = await bcrypt.hash(password, salt);
				await userModel.findByIdAndUpdate(
					user._id,
					{
						password: hashed,
					},
					{ new: true }
				);
			} else {
				res.status(200).json({
					message: "You are not authorised for this!",
				});
			}
		} else {
			res.status(200).json({
				message: "You are not authorised for this!",
			});
		}
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};

// const getAllUsers = async (req, res) => {
// 	try {
// 		const user = await userModel.find();
// 		res.status(200).json({
// 			message: "success",
// 			data: user,
// 		});
// 	} catch (error) {
// 		res.status(404).json({
// 			message: error.message,
// 		});
// 	}
// };

module.exports = {
	createUser,
	getAllUsers,
	getUser,
	resetUser,
	updateUser,
	deleteUser,
	newPassword,
	verifyUser,
	signinUser,
};
