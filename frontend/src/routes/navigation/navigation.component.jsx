import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import avatar from "../../assets/avatar.jpg";
import CartDropdown from "../../components/cart-dropdown/cart-dropdown.component";
import CartIcon from "../../components/cart-icon/cart-icon.component";
import {
  addCurrentUser,
  removeCurrentUser,
} from "../../store/user/user.reducer";
import {
  selectCurrentUser,
  selectCurrentUserRole,
} from "../../store/user/user.selector";

import { resetCart } from "../../store/cart/cart.reducer";
import { selectIsCartOpen } from "../../store/cart/cart.selector";
import StoreLogo from "../../assets/bookstore.svg?react";
// import StoreLogo from "../../assets/bookstore.svg";
// import StoreLogo from "../../assets/book.png";
import { useNavigate } from "react-router-dom";

import {
  NavigationContainer,
  NavLinks,
  NavLink,
  LogoContainer,
} from "./navigation.styles";

const Navigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const userRole = useSelector(selectCurrentUserRole);
  const isCartOpen = useSelector(selectIsCartOpen);

  const signOutHandler = () => {
    dispatch(removeCurrentUser());
    dispatch(resetCart());
    navigate("/");
  };

  console.log(currentUser, "this is the currentuser");
  // console.log(userRole);

  const userProfileHandler = () => {
    navigate("/user-profile");
  };

  return (
    <Fragment>
      <NavigationContainer>
        <LogoContainer to="/">
          <StoreLogo className="logo" />
        </LogoContainer>
        <NavLinks>
          {userRole === "admin" ? (
            <NavLink to="/all-transactions">Transactions</NavLink>
          ) : null}
          {userRole === "admin" ? (
            <NavLink to="/all-user">All Users</NavLink>
          ) : null}
          {userRole !== "admin" ? (
            <NavLink to="/shop">SHOP</NavLink>
          ) : (
            <>
              <NavLink to="/add-book">Add Book</NavLink>
            </>
          )}

          {currentUser ? (
            <NavLink as="span">
              <span onClick={signOutHandler}>SIGN OUT</span>
            </NavLink>
          ) : (
            <NavLink to="/auth">SIGN IN</NavLink>
          )}
          {currentUser ? (
            <img
              style={{ width: "40px", cursor: "pointer" }}
              src={avatar}
              alt=""
              onClick={userProfileHandler}
            />
          ) : null}

          {userRole === "user" ? <CartIcon /> : null}
        </NavLinks>
        {isCartOpen && <CartDropdown />}
      </NavigationContainer>
      <Outlet />
    </Fragment>
  );
};

export default Navigation;
