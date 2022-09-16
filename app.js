require("dotenv").config();
require("./config/database").connect();
const ejs = require("ejs");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const qrcode = require("qrcode");
const User = require("./model/user");
const passport = require("passport"),
const bodyParser = require("body-parser"),
const LocalStrategy = require("passport-local"),
const passportLocalMongoose = require("passport-local-mongoose");
const { default: mongoose } = require("mongoose");
mongoose.set('userNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('userCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/auth_demo_app");

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.get("/register", (req, res) => {
	res.render('register', {
	title: 'Registration Page',
	first_name: '',
	last_name: '',
	email: '',
	password: ''    
	})
	res.json()
});

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