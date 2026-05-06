import exp from "express";
import multer from "multer";
import { verifyToken } from "../middlewares/verifyToken.js";

export const fileTransferApp = exp.Router();

// storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// upload API
fileTransferApp.post("/", verifyToken, upload.single("file"), (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = `http://localhost:3000/uploads/${file.filename}`;

    res.status(200).json({
      message: "File uploaded successfully",
      url: fileUrl,
      fileName: file.originalname,
      type: file.mimetype
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});