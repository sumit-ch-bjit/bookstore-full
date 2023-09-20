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

    1. Sign up for system

        2. View books in cart

        3. View transactions
        4. Add books to cart individually
        5. Remove books from cart individually6. Add rating for books
        7. Remove rating for books
        8. Add reviews for books
        9. Edit reviews for books
        10. Remove reviews for books
        11. Avail discounted price for books if discount time is valid
        12. Add transaction by checking out using cart
        13. Book stock must be reduced after a successful checkout

        14. Every user will have a balance, that will be deducted from

        once a transaction (checkout) successfully takes place

        15. Balance can be updated by user when its too low

        16. Prevent transaction from taking place if user does not have sufficient balance

- Admin

1. Cart, transaction is not required for admin
2. View transactions of all users
3. View all user data
4. Edit selected existing user data
5. Delete user
6. Edit book data individually
7. Add new books
8. Delete existing books
9. Add discounts for books, which will be available for certain
products only for a limited amount of time
10. Update discounts for books
