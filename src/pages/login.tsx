import React from 'react';
import { useForm } from 'react-hook-form';
import FormError from '../components/form-error';
import { gql, useMutation } from '@apollo/client';
import {
  LoginMutation,
  LoginMutationVariables,
} from '../__generated__/LoginMutation';

interface LoginForm {
  email?: string;
  password?: string;
}

const LOGIN_MUTATION = gql`
  mutation LoginMutation($input: LoginInput!) {
    login(input: $input) {
      ok
      error
      token
    }
  }
`;

export const Login = () => {
  const { register, getValues, errors, handleSubmit } = useForm<LoginForm>();
  const [loginMutation] = useMutation<LoginMutation, LoginMutationVariables>(
    LOGIN_MUTATION
  );

  const onSubmit = () => {
    console.log(getValues());
  };
  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg pt-10 pb-7 rounded-lg text-center">
        <h3 className="text-2xl text-gray-800">Log In</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 px-5"
        >
          <input
            ref={register({ required: 'Email is required' })}
            name="email"
            required
            type="email"
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email.message} />
          )}
          <input
            ref={register({ required: 'Password is required', minLength: 10 })}
            required
            name="password"
            type="password"
            placeholder="Password"
            className="input"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password.message} />
          )}
          {errors.password?.type === 'minLength' && (
            <FormError errorMessage="Password must be more than 10 chars." />
          )}
          <button className="mt-3 btn">Log In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
