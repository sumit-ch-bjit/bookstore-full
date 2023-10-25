import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import FormInput from "../form-input/form-input.component";
import Button from "../button/button.component";

import "./sign-up-form.styles.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import apiInstance from "../../api/apiInstance";
import { ToastContainer, toast } from "react-toastify";

const defaultFormFields = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUpForm = () => {
  // const [formFields, setFormFields] = useState(defaultFormFields);
  // const { displayName, email, password, confirmPassword } = formFields;
  // const navigate = useNavigate();
  // const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: defaultFormFields,
    mode: "onChange",
  });

  // const resetFormFields = () => {
  //   setFormFields(defaultFormFields);
  // };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   if (password !== confirmPassword) {
  //     alert("passwords do not match");
  //     return;
  //   }

  //   console.log(email, password);
  // };

  // const handleChange = (event) => {
  //   const { name, value } = event.target;

  //   setFormFields({ ...formFields, [name]: value });
  // };

  const onSubmit = async (data) => {
    const res = await apiInstance.post("/auth/register", data);
    if (await res.data.succeess) {
      reset(defaultFormFields);
      toast.success(res.data.message);
    } else {
      console.log(res.data);
      toast.error(res.data.message);
    }
  };

  return (
    <div className="sign-up-container">
      <h2>Don't have an account?</h2>
      <span>Sign up with your email and password</span>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="firstName"
          control={control}
          rules={{
            required: "First name is required",
            minLength: {
              value: 2,
              message: "First name must be at least 2 characters",
            },
            //validate if the displayname is not numeric
            validate: (value) =>
              !/\d/.test(value) || "First name cannot contain numbers",
          }}
          render={({ field }) => (
            <FormInput
              label="First Name"
              type="text"
              required
              onChange={field.onChange}
              name="firstName"
              value={field.value}
            />
          )}
        />
        {errors.firstName && (
          <h5 style={{ color: "red" }}>{errors.firstName.message}</h5>
        )}
        <Controller
          name="lastName"
          control={control}
          rules={{
            required: "Last name is required",
            minLength: {
              value: 2,
              message: "Last name must be at least 2 characters",
            },
            //validate if the displayname is not numeric
            validate: (value) =>
              !/\d/.test(value) || "Last name cannot contain numbers",
          }}
          render={({ field }) => (
            <FormInput
              label="Last Name"
              type="text"
              required
              onChange={field.onChange}
              name="lastName"
              value={field.value}
            />
          )}
        />
        {errors.lastName && (
          <h5 style={{ color: "red" }}>{errors.lastName.message}</h5>
        )}

        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
          render={({ field }) => (
            <FormInput
              label="Email"
              type="email"
              required
              onChange={field.onChange}
              name="email"
              value={field.value}
            />
          )}
        />
        {errors.email && (
          <h5 style={{ color: "red" }}>{errors.email.message}</h5>
        )}
        <Controller
          name="password"
          control={control}
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
          render={({ field }) => (
            <FormInput
              label="Password"
              type="password"
              required
              onChange={field.onChange}
              name="password"
              value={field.value}
            />
          )}
        />
        {errors.password && (
          <h5 style={{ color: "red" }}>{errors.password.message}</h5>
        )}

        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: "Confirm password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          }}
          render={({ field }) => (
            <FormInput
              label="Confirm Password"
              type="password"
              required
              onChange={field.onChange}
              name="confirmPassword"
              value={field.value}
            />
          )}
        />
        {errors.confirmPassword && (
          <h5 style={{ color: "red" }}>{errors.confirmPassword.message}</h5>
        )}
        <Button type="submit">Sign Up</Button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SignUpForm;
