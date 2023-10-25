import styled from "styled-components";

export const BookCardContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 350px;
  padding: 20px;
  align-items: center;
  position: relative;

  img {
    width: 100%;
    height: 95%;
    object-fit: cover;
    margin-bottom: 5px;
  }

  &:hover {
    img {
      opacity: 0.8;
    }

    button {
      opacity: 0.85;
      display: flex;
    }
  }
`;

export const Footer = styled.div`
  width: 100%;
  height: 5%;
  display: flex;
  justify-content: space-around;
  font-size: 18px;
`;

export const Name = styled.span`
  width: 50%;
  margin-bottom: 15px;
`;

export const Price = styled.span`
  width: 10%;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
`;

export const Button = styled.button`
  /* Add your button styling here */
  padding: 8px 12px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
`;
