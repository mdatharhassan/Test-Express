import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

const userAuth = async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  console.log(token);

  const jwtSecret = process.env.JWT_SECRET;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    console.table([{ decodedPayload: decoded.user.id }]);

    req.user = await User.findById(decoded.user.id);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default userAuth;
