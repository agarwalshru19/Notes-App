import db from "../db.js";
import bcrypt from "bcryptjs"; // Add bcrypt import
import { jwtGenerator } from "../jwtGenerator.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check for existing user
    const q = "SELECT * FROM users WHERE email = $1";
    const { rows } = await db.query(q, [email]);

    if (rows.length > 0) {
      return res.status(409).json("User already exists");
    }

    // Hash password and create user
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const qr =
      "INSERT INTO users(username, email, password) VALUES($1, $2, $3)";
    const values = [username, email, hash];

    await db.query(qr, values);

    return res
      .status(200)
      .json({ success: true, message: "User has been created" });
  } catch (err) {
    console.error("Error during registration:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    //check user
    const q = "SELECT * FROM users WHERE email = $1";
    const { rows } = await db.query(q, [email]);

    if (rows.length === 0) {
      return res.status(404).json("User not found!");
    }
    //if exist, check password
    const isPassCorrect = await bcrypt.compare(password, rows[0].password);
    if (!isPassCorrect) {
      return res.status(400).json("Wrong Credentials");
    }

    //generate token
    const token = jwtGenerator(rows[0].id);
    // console.log("token :", token);
    // Exclude the password from the response
    const { password: dbPass, ...other } = rows[0];

    // Send token in an HTTP-only cookie and user data in response
   res.cookie("access_token", token, {
  httpOnly: true,
  secure: true, // Enable in production
  sameSite: "None", // Required for cross-origin cookies
  maxAge: 7 * 24 * 60 * 60 * 1000,
})

      .status(200)
      .json({
        success: true,
        message: "Login Successful !",
        other,
      }); // Send user data excluding the password
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("access_token");

    res
      .status(200)
      .json({ success: true, message: "User logged out successfully!" });
  } catch (err) {
    console.error("Error while logging out:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
