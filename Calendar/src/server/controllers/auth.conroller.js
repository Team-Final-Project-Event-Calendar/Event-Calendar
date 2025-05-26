import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ msg: "User already exists" });

    const newUser = new User({
      username,
      email,
      password,
      firstName,
      lastName,
    });
    await newUser.save();

    return res.status(201).json({ msg: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Server error" });
  }
};
