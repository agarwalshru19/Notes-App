import React from "react";
import { useState } from "react";
import SearchBar from "./SearchBar.jsx";
import ProfileInfo from "./ProfileInfo.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  signOutFailure,
  signOutStart,
  signOutSuccess,
} from "../redux/userSlice.js";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const [searchValue, setSearchValue] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    if (searchValue) {
      onSearchNote(searchValue);
    }
  };

  const onClearSearch = () => {
    setSearchValue("");
    handleClearSearch();
  };

  const handleLogout = async () => {
    try {
      dispatch(signOutStart());
      const res = await axios.get("https://notes-app-backendd-09i7.onrender.com/api/auth/logout", {
        withCredentials: true,
      });
      console.log(res.data);

      if (res.data.success === false) {
        dispatch(signOutFailure(res.data.message));
        toast.error(res.data.message);
      }
      toast.success(res.data.message);
      dispatch(signOutSuccess());
      navigate("/login");
    } catch (err) {
      dispatch(signOutFailure(err.message));
      toast.error(err.message);
    }
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow-md">
      <Link to="/">
        <h2 className="text-xl font-medium text-black py-2">
          <span className="text-slate-500">Anywhere</span>
          <span className="text-slate-900">Notes</span>
        </h2>
      </Link>

      <SearchBar
        value={searchValue}
        handleChange={handleChange}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />
      <ProfileInfo handleLogout={handleLogout} userInfo={userInfo} />
    </div>
  );
};

export default Navbar;
