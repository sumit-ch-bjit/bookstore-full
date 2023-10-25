import { Routes, Route } from "react-router-dom";
import Home from "./routes/home/home.component";
import Navigation from "./routes/navigation/navigation.component";
import Authentication from "./routes/authentication/authentication.component";
import Shop from "./routes/shop/shop.component";
import AddBook from "./routes/add-book/add-book.component";
import Checkout from "./routes/checkout/checkout.component";
import UpdateBookForm from "./components/update-book-form/update-book-form.components";
import BookDetails from "./components/book-details/book-details.component";
import NotFound from "./routes/not-found/not-found.component";
import AuthenticateAdmin from "./components/authenticate/authenticate-admin.component";
import UserProfile from "./components/user-profile/user-profile.component";
import AuthenticateUser from "./components/authenticate/authenticate-user.component";
import AllTransactions from "./routes/transactions/all-transactions.component";
import AllUser from "./routes/all-user/all-user.component";
import ForgotPasswordForm from "./components/forgot-password/forgot-password.component";
import ResetPasswordForm from "./components/reset-password/reset-password.component";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route index element={<Home />} />
        <Route
          path="reset-password/:resetToken/:authId"
          element={<ResetPasswordForm />}
        />
        <Route path="shop" element={<Shop />} />
        <Route path="auth" element={<Authentication />} />
        <Route element={<AuthenticateAdmin />}>
          <Route path="add-book" element={<AddBook />} />
          <Route path="update-book" element={<UpdateBookForm />} />
          <Route path="all-transactions" element={<AllTransactions />} />
          <Route path="all-user" element={<AllUser />} />
        </Route>
        <Route element={<AuthenticateUser />}>
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>
        <Route path="book" element={<BookDetails />} />
        <Route path="reset-password" element={<ForgotPasswordForm />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
