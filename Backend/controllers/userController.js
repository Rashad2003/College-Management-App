import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

export const registerUser = async (req, res) => {
  const { name, email, password, phone, dob, address, gender, role } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a Valid Email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a Strong Password" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name, email, phone, dob, address, password: hashedPassword, gender, role
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listUser = async (req,res) => {
  try {
    const user = await User.find();
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch students" });
  }
}

export const updateUser = async (req, res) => {
  const { id } = req.params;
  let { name, phone, dob, email, address, password, gender, role } = req.body;

  try {
    if (password) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
    } else {
      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      password = existingUser.password;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, phone, dob, email, address, password, gender, role },
      { new: true }
    );

    res.json({ success: true, message: "User updated", User: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error updating user" });
  }
};


export const deleteUser = async (req,res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting User" });
  }
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, user, message: "Login successful" });
    console.log(res.data);

  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};
