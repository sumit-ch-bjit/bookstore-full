import React from "react";
import styled from "styled-components";

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 5%;
`;

const PaginationButton = styled.button`
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  outline: none;

  &:hover {
    background-color: #f0f0f0;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const Pagination = ({ currentPage, handlePageChange, books, pageSize }) => {
  return (
    <PaginationContainer>
      <PaginationButton
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous Page
      </PaginationButton>
      <span> Page {currentPage} </span>
      <PaginationButton
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={books && books.length < pageSize}
      >
        Next Page
      </PaginationButton>
    </PaginationContainer>
  );
};

export default Pagination;
