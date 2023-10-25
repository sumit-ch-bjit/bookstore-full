import React, { useEffect, useState } from "react";
import axios from "axios";
import apiInstance from "../../api/apiInstance";
import LoadingSpinner from "../../components/spinner/spinner.component";

const AllUser = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch all users from the server
    apiInstance
      .get("/users/all-user")
      .then((response) => {
        console.log(response);
        setUsers(response.data.users);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []); // Empty dependency array ensures the effect runs only once after initial render

  return (
    <div>
      <h2>User List</h2>
      {users.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              <strong>User ID:</strong> {user._id}
              <br />
              <strong>Name:</strong> {`${user.firstName} ${user.lastName}`}
              <br />
              <strong>Email:</strong> {user.email}
              {/* Add additional user data as needed */}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllUser;
