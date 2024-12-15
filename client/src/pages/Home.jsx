import React, { useEffect, useState } from "react";
import NoteCard from "../components/NoteCard.jsx";
import { MdAdd, MdNavigateBefore } from "react-icons/md";
import Modal from "react-modal";
import AddEditNotes from "../components/AddEditNotes.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import Empty from "../components/Empty.jsx";
import imgsrc from "../assets/imgsrc.png";
import { useDispatch } from "react-redux";

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [isSearch, setIsSearch] = useState(false);


 
useEffect(() => {
    const jwtToken = document.cookie.split("; ").find((row) =>
      row.startsWith("access_token=")
    );

    if (!jwtToken) {
      // Token is missing in cookies; reset currentUser to null
      dispatch(signOutSuccess()); // Reset currentUser to null in Redux store
      navigate("/login"); // Redirect to login page
    } else {
      // Token exists, validate it (or proceed to fetch user data)
      if (currentUser === null) {
        navigate("/login"); // Ensure user is authenticated if currentUser is null
      } else {
        setUserInfo(currentUser?.other); // Set user info from Redux store
        getAllNotes(); // Fetch notes if authenticated
      }
    }
  }, [currentUser, navigate, dispatch]); 
 

  //get all notes
  const getAllNotes = async () => {
    try {
      const res = await axios.get("https://notes-app-backend-ur7v.onrender.com/api/note/all", {
        withCredentials: true,
      });
      if (res.data.success === false) {
        console.log(res.data);
        return;
      }
      setAllNotes(res.data.notes);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (note) => {
    setOpenModal({ isShown: true, data: note, type: "edit" });
  };

  const handleDelete = async (note) => {
    const noteId = note.id;
    try {
      const res = await axios.delete(
        `https://notes-app-backend-ur7v.onrender.com/api/note/delete/${noteId}`,
        { withCredentials: true }
      );
      if (res.data.success === false) {
        toast.error(res.data.message);
        return;
      }
      toast.success(res.data.message);
      getAllNotes();
    } catch (err) {
      toast(err.response.data);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  const onSearchNote = async (query) => {
    try {
      const res = await axios.get("https://notes-app-backend-ur7v.onrender.com/api/note/search", {
        params: { query },
        withCredentials: true,
      });

      if (res.data.success === false) {
        toast.error(res.data.message);
        return;
      }
      setIsSearch(true);
      setAllNotes(res.data.notes);
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const handlePin = async (note) => {
    const noteId = note.id;
    const newPinStatus = !note.is_pinned;

    try {
      const res = await axios.put(
        `https://notes-app-backend-ur7v.onrender.com/api/note/update-pin/${noteId}`,
        { is_pinned: newPinStatus },
        { withCredentials: true }
      );
      if (res.data.success === false) {
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      getAllNotes();
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />
      <div className="container mx-auto my-auto">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6 m-6 max-md:m-5">
            {allNotes.map((note) => (
              <NoteCard
                key={note.id}
                title={note.title}
                date={note.created_at}
                content={note.content}
                isPinned={note.is_pinned}
                handlePin={() => {
                  handlePin(note);
                }}
                handleEdit={() => {
                  handleEdit(note);
                }}
                handleDelete={() => {
                  handleDelete(note);
                }}
              />
            ))}
          </div>
        ) : (
          <Empty
            imgSrc={
              isSearch
                ? "https://static.thenounproject.com/png/2099077-200.png"
                : imgsrc
            }
            message={
              isSearch
                ? "Ooops ! No notes found matching your ideas."
                : "The page is empty, but your ideas aren’t. Start writing!"
            }
          />
        )}
      </div>
      <button
        onClick={() => {
          setOpenModal({
            isShown: true,
            type: "add",
            data: null,
          });
        }}
        className="w-16 h-16 flex items-center justify-center rounded-full bg-[#2B85FF]  hover:bg-blue-600 absolute right-10 bottom-10"
      >
        <MdAdd className="text-[30px] text-white" />
      </button>

      <Modal
        isOpen={openModal.isShown}
        onRequestClose={() => {}}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)" } }}
        contentLabel=" "
        className="w-[40%] max-md:w-[60%] max-sm:w-[70%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          hanldeCloseModal={() =>
            setOpenModal({
              isShown: false,
              type: "add",
              data: null,
            })
          }
          noteData={openModal.data}
          type={openModal.type}
          getAllNotes={getAllNotes}
        />
      </Modal>
    </>
  );
};

export default Home;
