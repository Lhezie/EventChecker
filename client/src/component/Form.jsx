import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const Form = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();


  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:3020/add-user", data);
      reset();
      alert("User added successfully");
    } catch {
      alert("Error adding user");
    }
  };

  return (
    <>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <label>Username</label>
        <input {...register("username", { required: true })} placeholder="Enter name" />

        <label>Email</label>
        <input {...register("email", { required: true })} placeholder="Enter email" />

        <label>Date of Birth</label>
        <input type="date" {...register("dob", { required: true })} />

        <div className="form-footer">
          <button type="submit">Submit</button>

         
        </div>
      </form>
    </>
  );
};

export default Form;
