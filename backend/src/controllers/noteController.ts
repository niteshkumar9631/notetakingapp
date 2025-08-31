import { Response } from "express";
import { AuthedRequest } from "../middleware/authMiddleware";
import { Note } from "../models/Note";

export const getNotes = async (req: AuthedRequest, res: Response) => {
  try {
    const notes = await Note.find({ user: req.user!.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createNote = async (req: AuthedRequest, res: Response) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Title required" });

  try {
    const note = await Note.create({ user: req.user!.id, title });
    res.status(201).json(note);
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteNote = async (req: AuthedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const note = await Note.findOneAndDelete({ _id: id, user: req.user!.id });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
