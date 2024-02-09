const express = require("express"); // Import express
const router = express.Router(); // Create a router object
const userModel = require("../model/user.js"); // Import user.js
const bcrypt = require("bcrypt"); // Import bcrypt
const jwt = require('jsonwebtoken');


//Creat a new user
router.post("/signup", async (req, res) => {
  const saltRounds = 10; // Number of salt rounds, higher is more secure
  const plainPassword = req.body.password; // Replace with the actual user's password
  try {

    // Hash the password
    salt = bcrypt.genSaltSync(saltRounds)
    hashedPassword = bcrypt.hashSync(plainPassword, salt)
      
    // Create a new user
    const user = await userModel.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
  
    const token = jwt.sign({ username: user.username, id: user._id }, '01001101', { expiresIn: '1h' });

    // Send the response
    res.status(201).json({
      status: 201,
      message: "Signup Successful",
      token: token,
      id: user._id,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
})

//login a user
router.post("/login", async (req, res) => {
  const { username, password, email } = req.body;
  // console.log(req.body);
  try {
    // Find the user by username or email
    const user = await userModel.findOne({
      $or: [{ username: username }, { email: username }],
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Authentication failed, User Not Found." });
    }

    // Compare the user's password with the hashed password
    let passwordMatch;

      await bcrypt.compare(password, user.password).then(
      (result) => {
        console.log("login status:"+ result);
        passwordMatch = result;
      },
      (err) => {
        console.log(err);
        passwordMatch = false;
      }
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Authentication failed, invalid username or passwrod",
      });
    } else {

      // User is authenticated, you can generate a token or set a session here
      const token = jwt.sign({ username: user.username, id: user._id }, '01001101', { expiresIn: '1h' });

      return res.status(200).json({
        status: 200,
        username: user.username,
        message: "Login successful",
        token: token,
        id: user._id,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});


// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).json({
      status: 200,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

module.exports = router; // Export router object
