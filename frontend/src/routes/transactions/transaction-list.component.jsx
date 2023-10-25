// TransactionList.js

import React from "react";
import "./transaction-list.styles.scss";
import LoadingSpinner from "../../components/spinner/spinner.component";

const TransactionList = ({ transactions }) => {
  return (
    <div className="transaction-list">
      <h2>Transaction List</h2>
      <ul>
        {transactions.length === 0 ? (
          <LoadingSpinner />
        ) : (
          transactions.map((transaction) => (
            <li key={transaction._id}>
              <strong>Type:</strong> {transaction.type}
              <br />
              <strong>Amount:</strong> {transaction.amount}
              <br />
              <strong>Timestamp:</strong> {transaction.timestamp}
              <br />
              <strong>User:</strong> {transaction.user.firstName}{" "}
              {transaction.user.lastName} ({transaction.user.email})
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TransactionList;
