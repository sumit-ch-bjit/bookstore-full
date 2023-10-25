import React, { useEffect, useState } from "react";
import apiInstance from "../../api/apiInstance";
import TransactionList from "./transaction-list.component";
const AllTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    apiInstance
      .get(`/transaction/all-transactions`)
      .then((res) => res.data)
      .then((data) => setTransactions(data.transactions));

    // setTransaction(getTransactions());
  }, []);
  return (
    <div>
      <TransactionList transactions={transactions} />
    </div>
  );
};

export default AllTransactions;
