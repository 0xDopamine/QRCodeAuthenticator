require("dotenv").config();
require("./config/database").connect();

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const QR = require("qrcode");
const User = require("./model/user");
const { default: mongoose } = require("mongoose");
const QRCode = require("./model/qrCode");
const ConnectedDevice = require("./model/connectedDevice");
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

app.post("/qr/generate", async (req, res) => {
	try {
		const { userId } = req.body;

		if (!userId) {
			res.status(400).send("User Id is required");
		}
		const user = await User.findById(userId);

		if (!user) {
			res.status(400).send("User not found");
		}

		const qrExist = await QRCode.findOne({ userId });

		if (!qrExist) {
			await QRCode.create({ userId });
		}
		else {
			await QRCode.findOneAndUpdate( { userId }, {$set: { disabled: true }});
			await QRCode.create({ userId });
		}

		const encryptedData = jwt.sign(
			{ userId: user._id },
			process.env.TOKEN_KEY,
			{
				expiresIn: "1d",
			}
		);

		const dataImage = await QR.toDataURL(encryptedData);

		return res.status(200).json({ dataImage });
	} catch (err) {
		console.log(err);
	}
});
 
app.post("/qr/scan", async (req, res) => {
	try {
		const { token, deviceInformation } = req.body;

		if (!token && !deviceInformation) {
			res.status(400).send("Token and device information are required!");
		}

		const decoded = jwt.verify(token, process.env.TOKEN_KEY);

		const qrCode = await QRCode.findOne({
			userId: decoded.userId,
			disabled: false,
		});

		if (!qrCode) {
			res.status(400).send("QRCode not found!");
		}

		const connectedDeviceData = {
			userId: decoded.userId,
			qrCodeId: qrCode._id,
			deviceName: deviceInformation.deviceName,
			deviceModel: deviceInformation.deviceModel,
			deviceOS: deviceInformation.deviceOS,
			deviceVersion: deviceInformation.deviceVersion,
		};

		const connectedDevice = await ConnectedDevice.create(connectedDeviceData);

		await QRCode.findOneAndUpdate(
			{ _id: qrCode._id },
			{
				isActive: true,
				connectedDeviceId: connectedDevice._id,
				lastUsedDate: new Date(),
			}
		);

		const user = await User.findById(decoded.userId);

		const authToken = jwt.sign({ user_id: user._id }, process.env.TOKEN_KEY, {
			expiresIn: "2h",
		});
		console.log("Successfully logged in!");
		return res.status(200).json({ token: authToken });
	} catch (err) {
		console.log(err);
	}
});


module.exports = app;