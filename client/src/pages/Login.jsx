import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { validEmail } from "../utils/helper.js";
import PasswordInput from "../components/PasswordInput.jsx";
import { useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/userSlice.js";
import { toast } from "react-toastify";

const Login = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validEmail(inputs.email)) {
      setErr("Please enter a valid email");
      return;
    }
    if (!inputs.password) {
      setErr("Please enter the password");
      return;
    }
    setErr("");

    //login api

    try {
      dispatch(signInStart());
      const res = await axios.post(
        "https://notes-app-backend-puy9.onrender.com/api/auth/login",
        { email: inputs.email, password: inputs.password },
        { withCredentials: true }
      );

      if (res.data.success === false) {
        console.log(res.data);
        toast.error(res.data.message);
        dispatch(signInFailure(res.data.message));
      }
      toast.success(res.data.message);
      dispatch(signInSuccess(res.data));
      navigate("/");
    } catch (err) {
      toast.error(err.response.data);
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <div className="flex items-center justify-center mt-28">
      <div className="w-96 border rounded bg-white px-7 py-10">
        <form onSubmit={handleSubmit}>
          <h1 className="text-2xl mb-7">Login</h1>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={inputs.email}
            className="input-box"
            onChange={handleChange}
          />

          <PasswordInput value={inputs.password} handleChange={handleChange} />

          <button type="submit" className="btn-primary">
            Login
          </button>
          {err && (
            <p className="text-sm text-center text-red-600 py-2">{err}</p>
          )}
          <span className="text-sm text-center mt-11">
            Don't have an account?{" "}
            <Link
              to={"/register"}
              className="font-medium text-teal-600 cursor-pointer underline"
            >
              Register
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
