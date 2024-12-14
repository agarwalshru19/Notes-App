import db from "../db.js";

export const addNote = async (req, res) => {
  const { title, content } = req.body;
  const id = req.user;
  // console.log("User ID:", id);

  if (!title) {
    return res.status(400).json("Title is required");
  }
  if (!content) {
    return res.status(400).json("Content is required");
  }
  // console.log("Adding note with data:", { title, content, userId: id });

  try {
    // SQL query to insert a new note
    const q =
      "INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING *";
    const { rows } = await db.query(q, [title, content, id]);

    return res.status(201).json({
      success: true,
      message: "Note added successfully!",
      note: rows[0], // Return the inserted note
    });
  } catch (err) {
    console.error("Error while adding note:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const editNote = async (req, res) => {
  const noteId = req.params.noteId;
  const userId = req.user;
  const { title, content } = req.body;

  const q = "SELECT * FROM notes WHERE id = $1";
  const { rows } = await db.query(q, [noteId]);
  if (rows.length === 0) {
    return res.status(404).json({ message: "Note not found" });
  }

  const note = rows[0];
  if (note.user_id !== userId) {
    return res.status(403).json("You are not authorized to edit this note");
  }

  try {
    const q = `
    UPDATE notes
    SET title = $1, content = $2
    WHERE id = $3
    RETURNING *;
  `;

    // Execute the update query
    const updateResult = await db.query(q, [title, content, noteId]);

    return res.status(200).json({
      success: true,
      message: "Note updated successfully!",
      note: updateResult.rows[0], // Return the updated note
    });
  } catch (err) {
    console.log("Error while ediing note:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getAllNotes = async (req, res) => {
  const userId = req.user;

  try {
    const q =
      "SELECT * FROM notes WHERE user_id = $1 ORDER BY is_pinned DESC, created_at DESC";
    const { rows } = await db.query(q, [userId]);

    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      notes: rows,
    });
  } catch (err) {
    console.log("Error while getting notes:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const deleteNote = async (req, res) => {
  const noteId = req.params.noteId;
  const userId = req.user;
  const q = "SELECT * FROM notes WHERE id = $1 AND user_id = $2";
  const { rows } = await db.query(q, [noteId, userId]);
  if (rows.length === 0) {
    return res.status(404).json("Note not found");
  }

  try {
    const deleteQuery = "DELETE FROM notes WHERE id = $1 AND user_id = $2";
    await db.query(deleteQuery, [noteId, userId]);
    res
      .status(200)
      .json({ success: true, message: "Note deleted successfully!" });
  } catch (err) {
    console.log("Error while deleting note:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updatePin = async (req, res) => {
  const noteId = req.params.noteId;
  const userId = req.user;
  const { is_pinned } = req.body;
  try {
    const q = "SELECT * FROM notes WHERE id = $1 AND user_id = $2";
    const { rows } = await db.query(q, [noteId, userId]);

    if (rows.length === 0) {
      return res.status(404).json("Note not found!");
    }

    const updateQuery =
      "UPDATE notes SET is_pinned = $1 WHERE id = $2 AND user_id = $3 RETURNING *";
    const { rows: updatedRows } = await db.query(updateQuery, [
      is_pinned,
      noteId,
      userId,
    ]);

    // Step 3: Check if the update was successful
    if (updatedRows.length === 0) {
      return res.status(400).json("Failed to update the note.");
    }

    // Step 4: Return success response with updated note
    return res.status(200).json({
      message: "Note updated successfully",
      note: updatedRows[0], // Return the updated note data
    });
  } catch (err) {
    console.log("Error while pin status:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const searchNote = async (req, res) => {
  const { query } = req.query;
  const userId = req.user;
  if (!query) {
    return res
      .status(400)
      .json({ success: false, message: "Search query is required" });
  }
  try {
    const searchQuery = `
      SELECT * FROM notes 
      WHERE user_id = $1 
      AND (title ILIKE $2 OR content ILIKE $2)
      ORDER BY is_pinned DESC, created_at DESC
    `;

    const { rows } = await db.query(searchQuery, [userId, `%${query}%`]);

    return res.status(200).json({
      success: true,
      message: "Notes matching the search query retrieved successfully",
      notes: rows,
    });
  } catch (err) {
    console.log("Error while searching notes:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
