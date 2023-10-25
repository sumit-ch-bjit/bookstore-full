import React, { useEffect, useState } from "react";

const ProfilePicture = ({ avatar }) => {
  return (
    <div>
      <img
        style={{ width: "200px", borderRadius: "50%" }}
        src={avatar}
        alt=""
      />
    </div>
  );
};

export default ProfilePicture;
