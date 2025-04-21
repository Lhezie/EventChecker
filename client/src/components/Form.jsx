import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Form = ({ onUserAdded }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log("API:", process.env.REACT_APP_API_URL);
      await axios.post(`${process.env.REACT_APP_API_URL}/add-user`, data);
      reset();
      toast.success("User Added Successfully!");
      onUserAdded(); // Trigger refresh in Table
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.error ||
        "Unable to add user!";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <label>Username</label>
        <input
          {...register("username", { required: "Username is required" })}
          placeholder="Enter name"
        />
        {errors.username && (
          <span className="error">{errors.username.message}</span>
        )}

        <label>Email</label>
        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email format",
            },
          })}
          placeholder="Enter email"
        />
        {errors.email && (
          <span className="error">{errors.email.message}</span>
        )}

        <label>Date of Birth</label>
        <input
          type="date"
          {...register("dob", { required: "Date of Birth is required" })}
        />
        {errors.dob && <span className="error">{errors.dob.message}</span>}

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </>
  );
};

export default Form;
