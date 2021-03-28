import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { CreateRestaurantInput } from '../../__generated__/globalTypes';
import { CreateRestaurantMutationVariables } from '../../__generated__/CreateRestaurantMutation';
import { useForm } from 'react-hook-form';
import Button from '../../components/button';
import { Helmet } from 'react-helmet-async';

const CREATE_RESTAURANT_MUTATION = gql`
  mutation CreateRestaurantMutation($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
    }
  }
`;

interface CreateRestaurantForm {
  name: string;
  address: string;
  categoryName: string;
}

function AddRestaurant() {
  const [createRestaurantMutation, { loading, data }] = useMutation<
    CreateRestaurantInput,
    CreateRestaurantMutationVariables
  >(CREATE_RESTAURANT_MUTATION);
  const { register, getValues, formState, errors, handleSubmit } = useForm<
    CreateRestaurantForm
  >({ mode: 'onChange' });

  const onSubmit = () => {
    console.log(getValues());
  };

  return (
    <div className="container">
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>

      <h1>Add Restaurant</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="input"
          ref={register({ required: 'Name is required.' })}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          className="input"
          ref={register({ required: 'Address is required.' })}
        />
        <input
          type="text"
          name="categoryName"
          placeholder="Category Name"
          className="input"
          ref={register({ required: 'Category Name is required.' })}
        />
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText="Create Restaurant"
        />
      </form>
    </div>
  );
}

export default AddRestaurant;
