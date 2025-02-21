import axios from "axios";
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";

const AddEditNotes = ({ hanldeCloseModal, noteData, type, getAllNotes }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [err, setErr] = useState(null);

  //edit note
  const editNote = async () => {
    const noteId = noteData.id;
    console.log("noteId", noteId);
    try {
      const res = await axios.post(
        `https://notes-app-backendd-09i7.onrender.com/api/note/edit/${noteId}`,
        { title, content },
        { withCredentials: true }
      );

      if (res.data.success === false) {
        setErr(res.data.message);
        toast.error(res.data.message);
        return;
      }
      toast.success(res.data.message);
      getAllNotes();
      hanldeCloseModal();
    } catch (err) {
      console.log(err.message);
      setErr(err.message);
      toast.error(err.message);
    }
  };

  //add note
  const addNewNote = async () => {
    try {
      const res = await axios.post(
        "https://notes-app-backendd-09i7.onrender.com/api/note/add",
        { title, content },
        { withCredentials: true }
      );

      if (res.data.success == false) {
        setErr(res.data.message);
        toast.error(res.data.message);
        return;
      }
      toast.success(res.data.message);
      getAllNotes();
      hanldeCloseModal();
    } catch (err) {
      console.log(err.message);
      setErr(err.message);
      toast.error(err.message);
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setErr("Please enter the title");
      return;
    }
    if (!content) {
      setErr("Please enter the content");
      return;
    }

    if (
      type === "edit" &&
      title === noteData.title &&
      content === noteData.content
    ) {
      setErr("No changes detected");
      return;
    }

    setErr("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };
  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={hanldeCloseModal}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-2 ">
        <label className="input-label text-red-400 uppercase">Title</label>
        <input
          type="text"
          className="text-xl text-slate-950 outline-none"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label text-red-400 uppercase">Content</label>
        <textarea
          type="text"
          className="text-sm text-slate-950 bg-slate-50 outline-none p-2 rounded"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      {err && <p className="text-red-500 text-xs pt-4">{err}</p>}
      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleAddNote}
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;
