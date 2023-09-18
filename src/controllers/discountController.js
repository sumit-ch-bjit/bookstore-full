const Book = require('../models/bookModel')

const addDiscount = async (req, res) => {
    try {
        const { bookId } = req.params
        const { discountPercentage, discountStartDate, discountEndDate } = req.body

        console.log(bookId)
        console.log(discountPercentage)
        // Find the book by its ID
        const book = await Book.findById(bookId);

        console.log(book)

        if (!book) {
            throw new Error('Book not found');
        }

        // Update the book's discount details
        book.discountPercentage = discountPercentage;
        book.discountStartDate = discountStartDate;
        book.discountEndDate = discountEndDate;

        // Save the updated book to the database
        await book.save();

        return { success: true, message: 'Discount added to the book' };
    } catch (error) {
        console.error('Error adding discount to book:', error);
        return { success: false, message: 'Failed to add discount to the book' };
    }
}


module.exports = { addDiscount }