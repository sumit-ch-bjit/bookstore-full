const cron = require('node-cron');
const Book = require('../models/bookModel'); // Import your Book model

// Define a function to apply discounts
async function applyDiscounts() {
    try {
        const currentDate = new Date();

        // Find books with an active discount within the specified time range
        const booksToUpdate = await Book.find({
            discountStartDate: { $lte: currentDate },
            discountEndDate: { $gte: currentDate },
        });

        // console.log(booksToUpdate);

        // Update the prices for each book based on the discount percentage
        for (const book of booksToUpdate) {
            // Check if the book has a valid discount percentage
            if (book.discountPercentage > 0) {
                // Calculate the discounted price
                const discountedPrice = book.price - (book.price * (book.discountPercentage / 100));

                // Update the book's price with the discounted price
                book.discountedPrice = discountedPrice;
                await book.save();
            }
        }

        console.log(`Updated prices for ${booksToUpdate.length} books.`);
    } catch (error) {
        console.error(error);
    }
}

// Call the applyDiscounts function to apply discounts
// applyDiscounts();


// Schedule the applyDiscounts function to run every day at a specific time (adjust as needed)
// cron.schedule('* * * * *', () => {
//     console.log('Running discount update task...');
//     applyDiscounts();
// });

cron.schedule('*/15 * * * *', () => {
    console.log('Running discount update task every 15 minutes...');
    applyDiscounts();
});

module.exports = applyDiscounts;
