import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validEmail } from "../utils/helper.js";
import PasswordInput from "../components/PasswordInput.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [err, setErr] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputs.username) {
      setErr("Please enter the username");
      return;
    }

    if (!validEmail(inputs.email)) {
      setErr("Please enter a valid email");
      return;
    }

    if (!inputs.password) {
      setErr("Please enter the password");
      return;
    }
    setErr("");

    //register api
    try {
      const res = await axios.post(
        "https://notes-app-backendd-09i7.onrender.com/api/auth/register",
        {
          username: inputs.username,
          email: inputs.email,
          password: inputs.password,
        },
        {
          withCredentials: true,
        }
      );
      if (res.data.success === false) {
        toast.error(res.data.message);
        setErr(res.data.message);
        return;
      }
      toast.success(res.data.message);
      setErr("");
      navigate("/login");
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  return (
    <div className="flex items-center justify-center mt-28">
      <div className="w-96 border rounded bg-white px-7 py-10">
        <form onSubmit={handleSubmit}>
          <h1 className="text-2xl mb-7">Register</h1>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={inputs.username}
            className="input-box"
            onChange={handleChange}
          />
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
            Register
          </button>
          {err && (
            <p className="text-sm text-center text-red-600 py-2">{err}</p>
          )}
          <span className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="font-medium text-teal-600 cursor-pointer underline"
            >
              Login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Register;
