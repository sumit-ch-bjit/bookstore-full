# Bookstore Api

### Tools used

- express
- mongodb
- mongoose
- express-validator
- json web token

> a bookstrore api for managing a bookstore. It has two user roles, user who can buy and checkout, add balance to wallet. Additionally, the prices of the book will vary based on the discount that are provided.

> the administrator will be able to add, remove and update book data and can also manipulate user data.

#### Functionalities

- Common Functionalities
  - login
  - view all the books
  - view with search, filter and pagination
  - log management of server
- User

  - Sign up for system
  - View books in cart
  - View transactions
  - Add books to cart individually
  - Remove books from cart individually6. Add rating for books
  - Remove rating for books
  - Add reviews for books
  - Edit reviews for books
  - Remove reviews for books
  - Avail discounted price for books if discount time is valid
  - Add transaction by checking out using cart
  - Book stock must be reduced after a successful check-
  - Every user will have a balance, that will be deducted from once a transaction checkout successfully takes place
  - Balance can be updated by user when its too low
  - Prevent transaction from taking place if user does not have sufficient balance

- Admin
  - Cart, transaction is not required for admin
  - View transactions of all users
  - View all user data
  - Edit selected existing user data
  - Delete user
  - Edit book data individually
  - Add new books
  - Delete existing books
  - Add discounts for books, which will be available for certain products only for a limited amount of time
  - Update discounts for books
