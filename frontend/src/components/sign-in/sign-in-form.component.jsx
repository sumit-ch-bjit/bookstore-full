import { useEffect, useState } from "react";
import FormInput from "../form-input/form-input.component";
import Button, { BUTTON_TYPE_CLASSES } from "../button/button.component";
import {
  SignInContainer,
  ButtonsContainer,
  ForgotPasswordContainer,
} from "./sign-in-form.styles";
import { Controller, useForm } from "react-hook-form";
import apiInstance from "../../api/apiInstance";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCurrentUser } from "../../store/user/user.reducer";
import decodeJwt from "../../utils/decodeJWT";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultFormFields = {
  email: "",
  password: "",
};

const SignInForm = () => {
  const signInSuccessToast = () => toast.success("Sign in successfully!");

  const [signInSuccess, setSignInSuccess] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: defaultFormFields,
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    // console.log(data);
    const res = await apiInstance.post("/auth/login", data);
    console.log(res.data);
    if (res.data.success) {
      //decode the token
      localStorage.setItem("token", res.data.token);
      reset(defaultFormFields);
      setSignInSuccess("true");
      const { token } = res.data;
      const user = decodeJwt(token);
      dispatch(addCurrentUser(user));
      navigate("/");
    } else {
      setSignInSuccess("false");
    }
    //// authentication
    /// alert if the credential is wrong
  };

  const handleForgetPassword = () => {
    navigate("/reset-password");
  };

  return (
    <>
      <SignInContainer>
        <h2>Already have an account?</h2>
        <span>Sign in with your email and password</span>
        {signInSuccess === "false" ? (
          <p style={{ color: "red" }}>Incorrect ID or password</p>
        ) : null}
        <form onSubmit={handleSubmit(onSubmit)}>
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
            defaultValue=""
            render={({ field }) => (
              <FormInput
                label="Email"
                type="email"
                // required
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
            defaultValue=""
            render={({ field }) => (
              <FormInput
                label="Password"
                type="password"
                // required
                onChange={field.onChange}
                name="password"
                value={field.value}
              />
            )}
          />
          {errors.password && (
            <h5 style={{ color: "red" }}>{errors.password.message}</h5>
          )}
          <ButtonsContainer>
            <Button type="submit">Sign In</Button>
          </ButtonsContainer>
        </form>

        <ForgotPasswordContainer>
          <Button onClick={handleForgetPassword}>Forgot password?</Button>
        </ForgotPasswordContainer>
      </SignInContainer>
    </>
  );
};

export default SignInForm;
