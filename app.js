require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const qrcode = require("qrcode");
const User = require("./model/user");
const { default: mongoose } = require("mongoose");

const app = express();
app.use(express.json());

app.post("/register", async (req, res) => {
	
	try {
		
		const { first_name, last_name, email, password } = req.body;
		
		if (!(first_name && last_name && email && password)) {
			res.status(400).send("Fill the required inputs!");
		}

		const oldUser = await User.findOne({ email });
		
		if (oldUser) {
			return res.status(409).send("This account already exists. Please Login..");
		}

		encryptPass = await bcrypt.hash(password, 10);
		const user = await User.create({
			first_name,
			last_name,
			email: email.toLowerCase(),
			password: encryptPass,
		});
		
		const token = jwt.sign(
			{ user_id: user._id, email },
			process.env.TOKEN_KEY,
			{
				expiresIn: "2h",
			}
		);

		res.status(201).json({ token });
	}
	catch (err) {
		console.log(err);
	}
});

app.post("/login", async (req, res) => {
	
	try {
		const { email, password } = req.body;

		if (!(email && password)) {
			res.status(400).send("Fill the required inputs");
		}

		const user = await User.findOne({ email });

		if (user && (await bcrypt.compare(password, user.password))) {
			const token = jwt.sign(
				{ user_id: user._id, email },
				process.env.TOKEN_KEY,
				{
					expiresIn: "2h",
				}
			);
			
			user.token = token;	
			return res.status(200).json({ token });
		}
		return res.status(400).send("User not found!");
	} catch (err) {
		console.log(err);
	}
});



module.exports = app;