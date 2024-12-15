import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const verifyToken = async (req, res, next) => {
  try {
    const jwtToken = req.cookies.access_token;
    if (!jwtToken) {
      // Look for the persisted user data in request headers (sent from frontend)
      const userDataFromStorage = req.headers['x-user-data'];

      if (userDataFromStorage) {
        const user = JSON.parse(userDataFromStorage); // Parse the persisted user data
        req.user = user.currentUser.other.id; // Use the user info from persisted state
        return next();  // Allow the request to continue
      }

      return res.status(403).json("Unauthorized");
    }
    const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
    // console.log("Decoded Payload: ", payload);
    req.user = payload.id; // Attach user ID to request object
    // console.log("req.user:", req.user);
    next(); // Call next middleware or route handler
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(403).json("Forbidden");
  }
};

export default verifyToken;
