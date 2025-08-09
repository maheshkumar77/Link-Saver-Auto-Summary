// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Signup
// router.post('/signup', async (req, res) => {
//   try {
//     const { name, email, password, confirmPassword } = req.body;

//     // 1️⃣ Check all fields
//     if (!name || !email || !password || !confirmPassword) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }

//     // 2️⃣ Email format validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ error: 'Invalid email format' });
//     }

//     // 3️⃣ Password length check
//     if (password.length < 6) {
//       return res.status(400).json({ error: 'Password must be at least 6 characters long' });
//     }

//     // 4️⃣ Confirm password match
//     if (password !== confirmPassword) {
//       return res.status(400).json({ error: 'Passwords do not match' });
//     }

//     // 5️⃣ Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'Email already registered' });
//     }

//     // 6️⃣ Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 7️⃣ Save new user
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword
//     });

//     await newUser.save();
//     res.status(201).json({ msg: 'User registered successfully' });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });
router.post('/signup', async (req, res) => {
  try {
    const { name,email, phonenumber,gender,password}=req.body;
    const { authProvider= "local"}=req.body;

    // Validate input
    if (!name || !email || !phonenumber || !gender || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Additional validation for email/password registration
    if (authProvider === 'local' && !password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne( { email } );
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password if provided
    let hashedPassword = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      phonenumber,
      gender,
      password: hashedPassword, // Store hashed password or null for Google auth
      authProvider:"local",
      createdAt: new Date()
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phonenumber: newUser.phonenumber,
        gender: newUser.gender,
        authProvider: newUser.authProvider
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});


// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check all fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // 2️⃣ Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Wrong password' });

    // 4️⃣ Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'default_secret', // fallback for development
      { expiresIn: '1d' }
    );

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;
