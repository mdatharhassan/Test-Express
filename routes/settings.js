import express from "express";
import Setting from "../model/settingModel.js";
import userAuth from "../middleware/auth.js";

const settingRouter = express.Router();

settingRouter.get("/", userAuth, async (req, res) => {
  try {
    const settings = await Setting.findOne();
    res.status(200).json(settings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Settings could not be loaded", error: error.message });
  }
});

settingRouter.put("/", userAuth, async (req, res) => {
  try {
    const obj = req.body;

    const updatedSetting = await Setting.findOneAndUpdate(
      {}, // there is only one settings document
      obj,
      { new: true, runValidators: true } // return updated doc
    );
    if (!updatedSetting) {
      throw new Error("Settings could not be updated");
    }
    return res.status(200).json(updatedSetting);
  } catch (error) {
    console.error(error);
    throw new Error("Settings could not be updated");
  }
});

export default settingRouter;
