import React from 'react';
import { useForm } from 'react-hook-form';
import FormError from '../components/form-error';
import { gql, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import nuberLogo from '../images/logo.svg';
import {
  LoginMutation,
  LoginMutationVariables,
} from '../__generated__/LoginMutation';
import Button from '../components/button';

interface LoginForm {
  email: string;
  password: string;
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
  const { register, getValues, errors, handleSubmit, formState } = useForm<
    LoginForm
  >({
    mode: 'onChange',
  });
  const [loginMutation, { data, loading }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION);

  const onSubmit = async () => {
    if (loading) return;

    const { email, password } = getValues();
    const { data: loginMutationResult } = await loginMutation({
      variables: {
        input: {
          email,
          password,
        },
      },
    });

    if (loginMutationResult?.login.ok) {
      console.log(loginMutationResult.login.token);
    }
  };

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={nuberLogo} className="w-52 mb-10" alt="uber eats" />
        <h4 className="w-full font-medium text-left text-3xl mb-5">
          Welcome back
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 w-full mb-5"
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
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText={'Log in'}
          />
          {data?.login.error && <FormError errorMessage={data.login.error} />}
        </form>
        <div>
          New to Nuber?{' '}
          <Link to="/create-account" className="text-lime-600 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
