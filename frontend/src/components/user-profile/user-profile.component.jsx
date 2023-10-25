import React, { useEffect, useState } from "react";
import "./user-profile.styles.scss";
import avatar from "../../assets/avatar.jpg";
import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectCurrentUserId,
  selectCurrentUserRole,
} from "../../store/user/user.selector";
import DepositComponent from "../deposit/deposit.component";
import apiInstance from "../../api/apiInstance";
import { ToastContainer, toast } from "react-toastify";
// import FileUploadForm from "../file-upload-form/file-upload-form.component";
import ProfilePicture from "../user-profile-pic/user-profile-pic.component";

const UserProfile = () => {
  const userId = useSelector(selectCurrentUserId);
  const userObj = useSelector(selectCurrentUser);
  // console.log(userId);
  const { firstName, lastName, email } = userObj.user;
  const [userBalance, setUserBalance] = useState(0);
  const [message, setMessage] = useState("");
  const [picture, setPicture] = useState(avatar);
  const [file, setFile] = useState(null);
  // const userId = useSelector(selectCurrentUserId);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    getBalance();
  }, []);

  // useEffect(() => {
  //   apiInstance
  //     .get(`/file/get/${userId}.png`)
  //     .then((res) => {
  //       // console.log(filepath);
  //       setPicture(`http://localhost:3001/api/file/get/${userId}.png`);
  //     })
  //     .catch((error) => {
  //       setPicture(avatar);
  //     });
  // }, [picture]);

  const getBalance = async () => {
    try {
      const res = await apiInstance.get(`/users/wallet/balance/${userId}`);

      const { balance, transactions } = res.data;

      setUserBalance(balance);
    } catch (error) {
      console.log(error);
    }
  };

  const depositBalance = async (amount) => {
    apiInstance
      .post(`/users/wallet/deposit/${userId}`, { amount: amount })
      .then((res) => console.log(res))
      .catch((error) => console.log(error));
  };

  const handleDeposit = async (amount) => {
    await depositBalance(amount);
    // depositSuccess;
    getBalance();
    toast.success("Fund Deposit Successfull");
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();

      formData.append("file", file);

      console.log(userId);

      // Replace 'http://example.com/upload' with your backend API endpoint for file upload
      const response = await apiInstance.post(
        `file/upload-file/${userId}`,
        formData
      );

      // const path = response.data.data.path.split("/")[2];

      // console.log(response.data.data.path.split("/")[2]);

      setMessage(response.data.message);
      // setPicture(`http://localhost:3001/api/file/get/${userId}.png`);
      setPicture(null);
    } catch (error) {
      console.error("Error uploading file:", error.message);
      setMessage("File upload failed.");
    }
  };

  return (
    <div className="user-profile">
      <div>
        {/* <ProfilePicture avatar={picture} /> */}
        {/* <div className="file-upload-form">
          <h2 className="form-header">Change Profile Picture</h2>
          <label className="file-input-label">
            Select File
            <input type="file" onChange={handleFileChange} />
          </label>
          <button className="upload-button" onClick={handleUpload}>
            Upload File
          </button>
          {message && <p className="message">{message}</p>}
        </div> */}
      </div>
      <div className="user-info">
        <h2>{`${firstName} ${lastName}`}</h2>
        <p>Email: {email}</p>
        <h5>User Balance: {userBalance.toFixed(2)}</h5>
      </div>
      <DepositComponent user={firstName} onDeposit={handleDeposit} />
    </div>
  );
};

export default UserProfile;
