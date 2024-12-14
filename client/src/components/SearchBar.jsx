import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, handleChange, handleSearch, onClearSearch }) => {
  const handleKeyDown = (e) => {
    // Check if the pressed key is "Enter"
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-40 sm:w-60 md:w-80 flex items-center bg-slate-100 px-4 rounded-md">
      <input
        type="text"
        placeholder="Search Notes"
        className="w-full text-sm bg-transparent py-[10px] outline-none"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      {/* if value show cross sign */}
      {value && (
        <IoMdClose
          className="text-slate-500 text-xl cursor-pointer hover:text-black mr-3 "
          onClick={onClearSearch}
        />
      )}
      <FaMagnifyingGlass
        className="text-slate-500 text-xl cursor-pointer hover:text-black mr-3 "
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
