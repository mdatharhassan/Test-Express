import express from "express";
import Cabin from "../model/cabinModel.js";
import userAuth from "../middleware/auth.js";
import { imageUpload } from "../config/cloudinary.js";
// import multer from "multer";
// const upload = multer({ dest: "uploads/" });

const cabinRouter = express.Router();

cabinRouter.get("/", userAuth, async (req, res) => {
  try {
    const cabins = await Cabin.find();
    res.status(200).json(cabins);
  } catch (error) {
    res.status(500).json({ message: "No cabins found", error: error.message });
  }
});

cabinRouter.post("/", userAuth, upload.single("image"), async (req, res) => {
  try {
    const cabinData = req.body; // text fields
    const file = req.file; // uploaded image file
    // console.log(file);

    // let imagePath = cabinData.image;
    // console.log("image" + imagePath);

    // if (file) {
    //   imagePath = `/uploads/${file.filename}`;
    // }
    const imageUrl = await imageUpload(file.path);

    const newCabin = await Cabin.create({ ...cabinData, image: imageUrl });
    res.status(201).json(newCabin);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Cabin could not be created", error: error.message });
  }
});

cabinRouter.put("/:id", userAuth, upload.single("image"), async (req, res) => {
  try {
    const id = req.params.id; // "/cabins/:id"
    const cabinData = req.body; // text fields
    const file = req.file; // uploaded image file

    let imagePath = cabinData.image || "";

    // If a new image was uploaded
    if (file) {
      imagePath = `/uploads/${file.filename}`;
    }

    // CREATE
    if (!id) {
      const newCabin = await Cabin.create({ ...cabinData, image: imagePath });
      return res.status(201).json(newCabin);
    }

    // UPDATE
    const updated = await Cabin.findByIdAndUpdate(
      id,
      { ...cabinData, image: imagePath },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Cabin not found" });

    return res.json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Cabin could not be created", error: error.message });
  }
});

cabinRouter.delete("/:id", userAuth, async (req, res) => {
  try {
    const deletedCabin = await Cabin.findByIdAndDelete(req.params.id);
    if (!deletedCabin) {
      return res.status(404).json({ message: "Cabin not found" });
    }
    res.status(200).json({ message: "Cabin deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Cabin could not be deleted", error: error.message });
  }
});

export default cabinRouter;
