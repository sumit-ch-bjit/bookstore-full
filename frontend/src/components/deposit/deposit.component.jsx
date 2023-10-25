import React, { useState } from "react";
import "./deposit.styles.scss";

const DepositComponent = ({ user, onDeposit }) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleDeposit = async () => {
    // Validate the amount
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }

    // Clear previous errors
    setError("");

    // Perform the deposit
    await onDeposit(parsedAmount);

    // Clear the amount input
    setAmount("");
  };

  return (
    <div className="deposit-component">
      <h2>Deposit Money</h2>
      <p>User: {user}</p>
      <div>
        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleDeposit}>Deposit</button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default DepositComponent;
