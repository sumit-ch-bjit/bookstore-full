import apiInstance from "./apiInstance";

const bookApi = async () => {

    const getBook = async (currentPage, itemsPerPage) => {
        try {
            const response = await apiInstance.get(`/books?page=${currentPage}&pageSize=${itemsPerPage}`)

            return response.data.results
        } catch (error) {
            console.log(error)
        }
    }

    const postBook = async (bookData) => {
        try {
            const response = await apiInstance.post('/books', bookData);

            const data = response.data;
            return data;
        } catch (error) {
            console.log(error)
        }
    };

    const deleteBook = async (bookId) => {
        try {
            const response = await apiInstance.delete(`/books/delete/${bookId}`)

            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    const updateBook = async (bookId) => {
        try {
            const response = await apiInstance.patch(`/books/update/${bookId}`)

            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    return {
        getBook,
        postBook,
        deleteBook,
        updateBook
    };
};

export default bookApi;