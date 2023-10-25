import React, { useState } from "react";
import styled from "styled-components";
import Button from "../button/button.component";

const FormContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h1`
  font-size: 1.5em;
  margin-bottom: 20px;
`;

const FormGroup = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;

  span {
    margin-bottom: 5px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
`;

// const Button = styled.button`
//   background-color: #007bff;
//   color: #fff;
//   padding: 10px;
//   cursor: pointer;
//   border: none;
//   border-radius: 4px;
// `;

const BookFilterForm = ({ onFilter }) => {
  const [filterData, setFilterData] = useState({
    genre: "",
    minPrice: "",
    maxPrice: "",
    sortField: "title",
    sortOrder: "asc",
    searchTerm: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilterData({ ...filterData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filterData);
  };

  return (
    <FormContainer>
      <FormTitle>Book Filter</FormTitle>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <span>Genre:</span>
          <Input
            type="text"
            name="genre"
            value={filterData.genre}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <span>Min Price:</span>
          <Input
            type="number"
            name="minPrice"
            value={filterData.minPrice}
            onChange={handleChange}
            step="0.01"
          />
        </FormGroup>

        <FormGroup>
          <span>Max Price:</span>
          <Input
            type="number"
            name="maxPrice"
            value={filterData.maxPrice}
            onChange={handleChange}
            step="0.01"
          />
        </FormGroup>

        <FormGroup>
          <span>Sort Field:</span>
          <Select
            name="sortField"
            value={filterData.sortField}
            onChange={handleChange}
          >
            <option value="title">Title</option>
            <option value="price">Price</option>
            {/* Add other fields you want to support */}
          </Select>
        </FormGroup>

        <FormGroup>
          <span>Sort Order:</span>
          <Select
            name="sortOrder"
            value={filterData.sortOrder}
            onChange={handleChange}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <span>Search Term:</span>
          <Input
            type="text"
            name="searchTerm"
            value={filterData.searchTerm}
            onChange={handleChange}
          />
        </FormGroup>

        {/* <FormGroup>
          <span>Page:</span>
          <Input
            type="number"
            name="page"
            value={filterData.page}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <span>Page Size:</span>
          <Input
            type="number"
            name="pageSize"
            value={filterData.pageSize}
            onChange={handleChange}
          />
        </FormGroup> */}

        <Button type="submit">Filter</Button>
      </form>
    </FormContainer>
  );
};

export default BookFilterForm;
