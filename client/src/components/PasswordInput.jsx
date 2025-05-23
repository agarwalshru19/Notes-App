import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const PasswordInput = ({ value, handleChange }) => {
  const [isShowPass, setIsShowPass] = useState(false);
  const toggleShowPass = () => {
    setIsShowPass(!isShowPass);
  };
  return (
    <div className="flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3">
      <input
        type={isShowPass ? "text" : "password"}
        placeholder="Password"
        name="password"
        value={value}
        className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"
        onChange={handleChange}
      />
      {isShowPass ? (
        <FaRegEye
          size={22}
          className="text-[#2B85FF] cursor-pointer"
          onClick={toggleShowPass}
        />
      ) : (
        <FaRegEyeSlash
          size={22}
          className="text-slate-400 cursor-pointer"
          onClick={toggleShowPass}
        />
      )}
    </div>
  );
};

export default PasswordInput;
