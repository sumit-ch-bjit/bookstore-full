import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { selectCurrentUserRole } from "../../store/user/user.selector";
import NotFound from "../../routes/not-found/not-found.component";

const AuthenticateUser = () => {
  const userRole = useSelector(selectCurrentUserRole);
  return <div>{userRole === "user" ? <Outlet /> : <NotFound />}</div>;
};

export default AuthenticateUser;
