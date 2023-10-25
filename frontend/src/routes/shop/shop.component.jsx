import React, { useState, useEffect } from "react";
import BookItem from "../../components/bookItem/bookItem.component";
import FormInput from "../../components/form-input/form-input.component";
import { FilterBarContainer } from "./shop.styles";
import apiInstance from "../../api/apiInstance";
import LoadingSpinner from "../../components/spinner/spinner.component";
import BookFilterForm from "../../components/filter-form/filter-form.component";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
`;

const FilterContainer = styled.div`
  width: 250px; /* Set a fixed width for the filter form */
`;

const ShopContainer = styled.div`
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 20px;
  padding: 20px;
`;

const Shop = () => {
  const [bookData, setBookData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);

  const showToast = (message) => toast.success(message);

  const handleFilter = async (filterData) => {
    try {
      const queryParams = new URLSearchParams();

      Object.entries(filterData).forEach(([key, value]) => {
        if (value !== "") {
          queryParams.append(key, value);
        }
      });

      console.log(queryParams.toString());
      const apiUrl = `books?${queryParams.toString()}`;

      const response = await apiInstance.get(apiUrl);
      const data = response.data;

      console.log(data);

      // Assuming the API response has a 'results' property containing the filtered books
      setBookData(data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getBooks = () => {
    apiInstance
      .get(`/books`)
      .then((res) => res.data)
      .then((data) => data.results)
      .then((books) => setBookData(books));
  };

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <>
      <h1 style={{ display: "flex", justifyContent: "center" }}>Shop Page</h1>
      <Container>
        <FilterContainer>
          <BookFilterForm onFilter={handleFilter} />
        </FilterContainer>
        {bookData?.length !== 0 ? (
          <ShopContainer>
            {bookData.map((book) => (
              <BookItem key={book._id} book={book} showToast={showToast} />
            ))}
          </ShopContainer>
        ) : (
          <span style={{ position: "fixed", left: "50vw", top: "20vh" }}>
            <LoadingSpinner />
          </span>
        )}
      </Container>
    </>
  );
};

export default Shop;
