import React from 'react';
import { useForm } from 'react-hook-form';
import FormError from '../components/form-error';
import { gql, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import nuberLogo from '../images/logo.svg';
import { LoginMutation, LoginMutationVariables, } from '../__generated__/LoginMutation';
import Button from '../components/button';
import { Helmet } from 'react-helmet-async';
import { emailRegexp } from '../utils/regexp';
import { authTokenVar, isLoggedInVar } from '../apollo';
import { LOCALSTORAGE_TOKEN_KEY } from '../constants';

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

    const { ok, token } = loginMutationResult?.login || {};
    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, token);
      isLoggedInVar(true);
      authTokenVar(token);
    }
  };

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Login | Nuber eats</title>
      </Helmet>
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
            ref={register({
              required: 'Email is required',
              pattern: emailRegexp,
            })}
            name="email"
            required
            type="email"
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email.message} />
          )}
          {errors.email?.type === 'pattern' && (
            <FormError errorMessage="Please enter a valid email" />
          )}
          <input
            ref={register({ required: 'Password is required', minLength: 5 })}
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
            <FormError errorMessage="Password must be more than 5 chars." />
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
