require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const qrcode = require("qrcode");
const User = require("./model/user");

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.get("/", function (req, res) {
	res.render('register', {
	title: 'Registration Page',
	first_name: '',
	last_name: '',
	email: '',
	password: ''    
	})
});

app.engine('ejs', require('ejs').__express);

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

app.post("/login", (req, res) => {
	//login logic here
});



module.exports = app;