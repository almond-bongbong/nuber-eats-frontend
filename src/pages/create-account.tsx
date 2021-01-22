import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import FormError from '../components/form-error';
import { gql, useMutation } from '@apollo/client';
import nuberLogo from '../images/logo.svg';
import Button from '../components/button';
import { Helmet } from 'react-helmet-async';
import {
  CreateAccountMutation,
  CreateAccountMutationVariables,
} from '../__generated__/CreateAccountMutation';
import { UserRole } from '../__generated__/globalTypes';
import { emailRegexp } from '../utils/regexp';

interface CreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

const CREATE_ACCOUNT_MUTATION = gql`
  mutation CreateAccountMutation($input: CreateAccountInput!) {
    createAccount(input: $input) {
      ok
      error
    }
  }
`;

export const CreateAccount = () => {
  const history = useHistory();
  const { register, getValues, errors, handleSubmit, formState } = useForm<
    CreateAccountForm
  >({
    mode: 'onChange',
    defaultValues: {
      role: UserRole.CLIENT,
    },
  });
  const [createAccountMutation, { data, loading }] = useMutation<
    CreateAccountMutation,
    CreateAccountMutationVariables
  >(CREATE_ACCOUNT_MUTATION);

  const onSubmit = async () => {
    if (loading) return;

    const { email, password, role } = getValues();
    const { data: createAccountMutationResult } = await createAccountMutation({
      variables: {
        input: {
          email,
          password,
          role,
        },
      },
    });

    if (createAccountMutationResult?.createAccount.ok) {
      history.push('/');
    }
  };

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Create Account | Nuber eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={nuberLogo} className="w-52 mb-10" alt="uber eats" />
        <h4 className="w-full font-medium text-left text-3xl mb-5">
          Let's get started
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
          <select
            name="role"
            ref={register({ required: true })}
            className="input"
          >
            {Object.keys(UserRole).map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText={'Create Account'}
          />
          {data?.createAccount.error && (
            <FormError errorMessage={data.createAccount.error} />
          )}
        </form>
        <div>
          Already have an account?{' '}
          <Link to="/" className="text-lime-600 hover:underline">
            Log in now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
