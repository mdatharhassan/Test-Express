import multer from "multer";
import fs from "fs";
import path from "path";

// Ensure uploads folder exists
const uploadPath = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
  console.log("📁 Created uploads folder");
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath); // full absolute path
  },

  filename: function (req, file, cb) {
    // Remove spaces + ensure unique name
    const cleanName = file.originalname.replace(/\s+/g, "");
    const finalName = `${Date.now()}-${cleanName}`;
    cb(null, finalName);
  },
});

// Initialize multer
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // optional: 5MB limit
});

export default upload;

// import multer from "multer";

// const storage = multer.diskStorage({
//   destination: function (_req, _file, cb) {
//     cb(null, "uploads/"); // create /uploads folder at root
//   },
//   filename: function (_req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, ""));
//   },
// });

// const upload = multer({ storage});
// export default upload;
