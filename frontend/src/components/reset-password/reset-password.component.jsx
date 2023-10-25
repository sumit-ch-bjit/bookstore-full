import React, { useEffect, useState } from "react";
import "./reset-password.styles.scss";
import apiInstance from "../../api/apiInstance";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [valid, setValid] = useState(false);
  const navigate = useNavigate();

  const { resetToken, authId } = useParams();

  useEffect(() => {
    const validateResetRequest = async () => {
      try {
        const res = await apiInstance.post("/auth/validate-password-reset", {
          token: resetToken,
          userId: authId,
        });

        console.log(res);

        // If validation fails, show an error message and disable the form
        if (res.data.success) {
          setValid(true);
        }
      } catch (error) {
        // Handle any other errors, e.g., network issues
        console.error("Error during password reset validation:", error);
        setError("Reset password link is not valid anymore");
      }
    };
    validateResetRequest();
  }, [resetToken, authId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password
    if (!password.trim() || !confirmPassword.trim()) {
      setError("Both password fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await apiInstance.post("/auth/reset-password", {
        token: resetToken,
        userId: authId,
        password: password,
      });

      console.log(res);
      setSuccessMessage("Password reset successfully.");
      navigate("/auth");
      toast.success("password reset successfull");
    } catch (error) {
      console.error(error.response.data.message);
      setError(error.response.data.message);
    }

    // Clear the form and error message
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      {!valid ? (
        <h1>{error}</h1>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <p className="error-message">{error}</p>}
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}

          <button type="submit">Reset Password</button>
        </form>
      )}
      <ToastContainer />
    </div>
  );
};

export default ResetPasswordForm;
