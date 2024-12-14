import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  addNote,
  deleteNote,
  editNote,
  getAllNotes,
  searchNote,
  updatePin,
} from "../controllers/note.js";

const router = express.Router();
router.post("/add", verifyToken, addNote);
router.post("/edit/:noteId", verifyToken, editNote);
router.get("/all", verifyToken, getAllNotes);
router.delete("/delete/:noteId", verifyToken, deleteNote);
router.put("/update-pin/:noteId", verifyToken, updatePin);
router.get("/search", verifyToken, searchNote);

export default router;
