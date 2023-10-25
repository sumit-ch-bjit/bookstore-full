import BookItem from "../bookItem/bookItem.component";
import { Fragment } from "react";
import { useEffect, useState } from "react";
import { DirectoryContainer, Title } from "./directory.styles";
import Pagination from "../pagination/pagination.component";
import LoadingSpinner from "../spinner/spinner.component";
import apiInstance from "../../api/apiInstance";
import { ToastContainer, toast } from "react-toastify";

const Directory = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const showToast = (message) => toast.success(message);

  const pageSize = 10;

  useEffect(() => {
    apiInstance
      .get(`/books?page=${currentPage}&pageSize=${pageSize}`)
      .then((res) => res.data)
      .then((data) => data.results)
      .then((books) => setBooks(books))
      .catch((error) => console.log(error));
    // const result = res();
    // console.log(result);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDelete = async (book) => {
    console.log(book._id);
    const res = await apiInstance.delete(`books/delete/${book._id}`);

    console.log(res);
    if (res.data.success) {
      const updatedBooks = books.filter((bookItem) => {
        return bookItem._id !== book._id;
      });
      setBooks(updatedBooks);
      toast.success("book deleted successfully");
    } else {
      toast.error("could not delete book");
    }
  };

  return (
    <>
      {books?.length !== 0 ? (
        <Fragment>
          <Title>Featured Books</Title>
          <DirectoryContainer>
            {books &&
              books.map((book) => (
                <BookItem
                  key={book._id}
                  book={book}
                  onDelete={handleDelete}
                  showToast={showToast}
                />
              ))}
          </DirectoryContainer>
        </Fragment>
      ) : (
        <LoadingSpinner />
      )}
      <Pagination
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        books={books}
        pageSize={pageSize}
      />
      <ToastContainer />
    </>
  );
};

export default Directory;
