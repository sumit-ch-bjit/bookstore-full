import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation } from "react-router-dom";
import FormInput from "../form-input/form-input.component";
import Button from "../button/button.component";
import { UpdateBookContainer } from "./update-book-form.styles";
import "./update-book-form.styles.scss";
import apiInstance from "../../api/apiInstance";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateBookForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const notify = () => toast("Book Updated");

  const isNumeric = (value) => !isNaN(value);

  const validateNumber = (value) => {
    return isNumeric(value) ? true : "Please enter a valid number.";
  };

  // console.log(location.state);
  const { _id, title, author, description, price, stock, genre } =
    location.state.book;

  console.log(title, author, description, price, stock, genre);

  // console.log(title);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: title,
      author: author,
      description: description,
      price: price,
      stock: stock,
      genre: genre,
    },
    mode: "onChange",
  });

  const updateBook = async (data) => {
    await apiInstance.patch(`/books/edit/${_id}`, data);
  };

  const onSubmit = async (data) => {
    await updateBook(data);
    notify();
  };

  return (
    <UpdateBookContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Controller
            name="title"
            control={control}
            rules={{
              required: "Book name is required",
            }}
            render={({ field }) => (
              <FormInput
                label="Title"
                type="text"
                // required
                onChange={field.onChange}
                name="title"
                value={field.value}
              />
            )}
          />
        </div>
        <div>
          <Controller
            name="author"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <FormInput
                label="Author"
                type="text"
                // required
                onChange={field.onChange}
                name="Author"
                value={field.value}
              />
            )}
          />
        </div>
        <div>
          <Controller
            name="description"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <FormInput
                label="Description"
                type="text"
                // required
                onChange={field.onChange}
                name="Description"
                value={field.value}
              />
            )}
          />
        </div>
        <div>
          <label htmlFor="">Price: </label>
          <Controller
            label="Price"
            name="price"
            control={control}
            rules={{
              required: true,
              validate: validateNumber,
            }}
            render={({ field }) => (
              // <input {...field} /
              <input className="input-box" {...field} />
            )}
          />
          {errors.price && (
            <h5 style={{ color: "red" }}>{errors.price.message}</h5>
          )}
        </div>

        <div>
          <label htmlFor="stock">Stock: </label>
          <Controller
            name="stock"
            control={control}
            rules={{ required: true, validate: validateNumber }}
            render={({ field }) => (
              // <input {...field} />
              <input className="input-box" {...field} />
            )}
          />
          {errors.stock && (
            <h5 style={{ color: "red" }}>{errors.stock.message}</h5>
          )}
        </div>

        <Button type="submit">Update Book</Button>
      </form>
      <ToastContainer />
    </UpdateBookContainer>
  );
};

export default UpdateBookForm;
