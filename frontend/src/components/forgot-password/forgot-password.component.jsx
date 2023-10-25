import React, { useState } from "react";
import "./forgot-password.styles.scss";
import apiInstance from "../../api/apiInstance";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const postEmail = async (email) => {
    try {
      const res = await apiInstance.post("/auth/forgot-password", {
        email: email,
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    // Add your logic for handling the form submission (e.g., sending a password reset email)
    console.log("Email submitted:", email);

    const data = await postEmail(email);

    console.log(data);

    if (await data.success) {
      setSuccessMessage("check your email for password reset instructions");
    } else {
      console.log("an error occured");
    }

    // Clear the error message
    setError("");
    setEmail("");
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
