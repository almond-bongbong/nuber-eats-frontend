import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import {
  CreateDishMutation,
  CreateDishMutationVariables,
} from '../../__generated__/CreateDishMutation';
import { Helmet } from 'react-helmet-async';
import { useFieldArray, useForm } from 'react-hook-form';
import Button from '../../components/button';
import { MY_RESTAURANTS_QUERY } from './my-restaurants';

interface Params {
  id: string;
}

interface Form {
  name: string;
  price: string;
  description: string;
  options: {
    name: string;
    extra: string;
  }[];
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
  const { register, handleSubmit, formState, getValues, control } = useForm<
    Form
  >({
    mode: 'onChange',
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const onSubmit = async () => {
    const { name, price, description, options } = getValues();
    await createDishMutation({
      variables: {
        input: {
          restaurantId,
          name,
          price: Number(price),
          description,
          options: options.map((o) => ({
            name: o.name,
            extra: Number(o.extra),
          })),
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
        <div className="my-10">
          <h4 className="font-medium  mb-3 text-lg">Dish Options</h4>
          <span
            onClick={append}
            className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5 bg-"
          >
            Add Dish Option
          </span>
          {fields.map((f, i) => (
            <div key={f.id} className="mt-5">
              <input
                className="py-2 px-4 focus:outline-none mr-3 focus:border-gray-600 border-2"
                type="text"
                placeholder="Option Name"
                ref={register}
                name={`options.${i}.name`}
                defaultValue={f.name}
              />
              <input
                className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2"
                type="number"
                min={0}
                placeholder="Option Extra"
                ref={register}
                name={`options.${i}.extra`}
                defaultValue="0"
              />
              <span
                className="cursor-pointer text-white bg-red-500 ml-3 py-3 px-4 mt-5 bg-"
                onClick={() => remove(i)}
              >
                Delete Option
              </span>
            </div>
          ))}
        </div>
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
