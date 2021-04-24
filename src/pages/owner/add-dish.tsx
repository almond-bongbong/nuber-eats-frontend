import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import {
  CreateDishMutation,
  CreateDishMutationVariables,
} from '../../__generated__/CreateDishMutation';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import Button from '../../components/button';
import { MY_RESTAURANTS_QUERY } from './my-restaurants';

interface Params {
  id: string;
}

interface Form {
  name: string;
  price: string;
  description: string;
}

const CREATE_DISH_MUTATION = gql`
  mutation CreateDishMutation($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

function AddDish() {
  const history = useHistory();
  const { id: restaurantId } = useParams<Params>();
  const [createDishMutation, { loading }] = useMutation<
    CreateDishMutation,
    CreateDishMutationVariables
  >(CREATE_DISH_MUTATION, {
    refetchQueries: [
      {
        query: MY_RESTAURANTS_QUERY,
        variables: {
          input: {
            id: restaurantId,
          },
        },
      },
    ],
  });
  const { register, handleSubmit, formState, getValues } = useForm<Form>({
    mode: 'onChange',
  });
  const onSubmit = async () => {
    const { name, price, description } = getValues();
    await createDishMutation({
      variables: {
        input: {
          name,
          price: Number(price),
          description,
          restaurantId,
        },
      },
    });
    history.goBack();
  };

  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Dish | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Add Dish</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <input
          className="input"
          type="text"
          name="name"
          placeholder="Name"
          ref={register({ required: 'Name is required.' })}
        />
        <input
          className="input"
          type="number"
          name="price"
          min={0}
          placeholder="Price"
          ref={register({ required: 'Price is required.' })}
        />
        <input
          className="input"
          type="text"
          name="description"
          placeholder="Description"
          ref={register({ required: 'Description is required.' })}
        />
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText="Create Dish"
        />
      </form>
    </div>
  );
}

export default AddDish;
