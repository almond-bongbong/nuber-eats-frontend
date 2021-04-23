import React, { useState } from 'react';
import { gql, useApolloClient, useMutation } from '@apollo/client';
import {
  CreateRestaurantMutation,
  CreateRestaurantMutationVariables,
} from '../../__generated__/CreateRestaurantMutation';
import { useForm } from 'react-hook-form';
import Button from '../../components/button';
import { Helmet } from 'react-helmet-async';
import FormError from '../../components/form-error';
import { MyRestaurantsQuery } from '../../__generated__/MyRestaurantsQuery';
import { MY_RESTAURANTS_QUERY } from './my-restaurants';
import { useHistory } from 'react-router-dom';

const CREATE_RESTAURANT_MUTATION = gql`
  mutation CreateRestaurantMutation($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
      restaurantId
    }
  }
`;

interface CreateRestaurantForm {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

function AddRestaurant() {
  const apolloClient = useApolloClient();
  const history = useHistory();
  const [uploading, setUploading] = useState(false);
  const [createRestaurantMutation, { data }] = useMutation<
    CreateRestaurantMutation,
    CreateRestaurantMutationVariables
  >(CREATE_RESTAURANT_MUTATION);
  const { register, getValues, formState, handleSubmit } = useForm<
    CreateRestaurantForm
  >({ mode: 'onChange' });

  const onSubmit = async () => {
    const { name, categoryName, address, file } = getValues();
    const actualFile = file[0];
    const body = new FormData();
    body.append('file', actualFile);

    try {
      setUploading(true);
      const { url } = await fetch('http://localhost:4001/uploads', {
        method: 'POST',
        body,
      }).then((res) => res.json());

      const { data } = await createRestaurantMutation({
        variables: {
          input: {
            name,
            categoryName,
            address,
            coverImage: url,
          },
        },
      });

      const result = apolloClient.readQuery<MyRestaurantsQuery>({
        query: MY_RESTAURANTS_QUERY,
      });
      apolloClient.writeQuery({
        query: MY_RESTAURANTS_QUERY,
        data: {
          myRestaurants: {
            ...result?.myRestaurants,
            restaurants: [
              ...(result?.myRestaurants?.restaurants || []),
              {
                __typename: 'Restaurant',
                id: data?.createRestaurant.restaurantId,
                name,
                address,
                category: { __typename: 'Category', name: categoryName },
                coverImage: url,
                isPromoted: false,
              },
            ],
          },
        },
      });
      history.push('/');
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>

      <h4 className="font-semibold text-2xl mb-3">Add Restaurant</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
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
        <div>
          <input
            type="file"
            name="file"
            accept="image/*"
            ref={register({ required: true })}
          />
        </div>
        <Button
          loading={uploading}
          canClick={formState.isValid}
          actionText="Create Restaurant"
        />
        {data?.createRestaurant.error && (
          <FormError errorMessage={data.createRestaurant.error} />
        )}
      </form>
    </div>
  );
}

export default AddRestaurant;
