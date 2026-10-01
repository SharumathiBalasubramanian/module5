const bcrypt = require("bcryptjs");
const User = require("../models/user");

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, password } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (name) user.name = name.trim();
    if (phone) user.phone = phone.trim();

    if (address) {
      user.address = {
        street: address.street ?? user.address?.street,
        city: address.city ?? user.address?.city,
        state: address.state ?? user.address?.state,
        zip: address.zip ?? user.address?.zip,
        country: address.country ?? user.address?.country,
      };
    }

    if (password && password.trim().length >= 6) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    await user.deleteOne();
    res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, getAllUsers, deleteUser };