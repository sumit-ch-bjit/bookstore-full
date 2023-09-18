// priceUpdater.js

const cron = require('node-cron');
const Book = require('../models/bookModel'); // Import your Book model

// Define a function to apply discounts
async function applyDiscounts() {
    try {
        const currentDate = new Date()

        // Find books with an active discount within the specified time range
        const booksToUpdate = await Book.find({
            discountStartDate: { $lte: currentDate },
            discountEndDate: { $gte: currentDate },
        });

        console.log(booksToUpdate)

        // Update the discounts for each book (e.g., set a fixed discount percentage)
        const discountPercentage = 10; // Example: 10% discount
        for (const book of booksToUpdate) {
            book.discountPercentage = discountPercentage;
            await book.save();
        }

        console.log(`Applied discounts to ${booksToUpdate.length} books.`);
    } catch (error) {
        console.error(error);
    }
}

// Schedule the applyDiscounts function to run every day at a specific time (adjust as needed)
cron.schedule('* * * * *', () => {
    console.log('Running discount update task...');
    applyDiscounts();
});

module.exports = applyDiscounts;
