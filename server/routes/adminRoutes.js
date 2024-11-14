const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/userModel');
const bcrypt = require('bcrypt');
const auth = require('../MiddleWare/authMiddleware');

// Middleware to check if user is an admin
const checkAdmin = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user || user.role !== 'admin') {
    return res.status(403).send('Access denied. Admins only.');
  }
  next();
};

// Create organization Account
router.post('/create-organization', auth, checkAdmin, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('organization already registered.');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashedPassword,
    role: 'organization',
  });

  await user.save();
  res.send(user);
});

// Delete organization Account
router.delete('/delete-organization/:id', auth, checkAdmin, async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user) return res.status(404).send('User not found.');
  res.send(user);
});

// Create organization Account with hashed password
router.post('/add-organization', auth, checkAdmin, async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      role: 'organization',
    });

    await user.save();
    res.status(201).send(user);
  } catch (error) {
    console.error('Error adding organization:', error);
    res.status(500).send('Error adding organization');
  }
});


module.exports = router;
