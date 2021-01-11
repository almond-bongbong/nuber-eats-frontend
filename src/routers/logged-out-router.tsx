import React from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { UnpackNestedValue } from 'react-hook-form/dist/types/form';

interface FormFields {
  email: string;
  password: string;
}

function LoggedOutRouter() {
  const { register, handleSubmit, errors } = useForm<FormFields>();

  const onLogin = (data: UnpackNestedValue<FormFields>) => {
    console.log('heloo', data);
  };

  const onInvalid = (errors: FieldErrors) => {
    console.log(errors);
  };

  return (
    <form onSubmit={handleSubmit(onLogin, onInvalid)}>
      <h1>Logged out</h1>
      <div>
        <input
          type="text"
          name="email"
          ref={register({
            required: 'This is required',
            pattern: /^[A-Za-z0-9._%+-]+@gmail.com$/,
          })}
        />
        {errors.email && (
          <strong>
            {errors.email.message}
            {errors.email.type === 'pattern' && 'Only gmail allowed'}
          </strong>
        )}
      </div>
      <div>
        <input
          type="password"
          name="password"
          ref={register({
            required: 'This is required',
          })}
        />
        {errors.password && <strong>{errors.password.message}</strong>}
      </div>

      <button>Login</button>
    </form>
  );
}

export default LoggedOutRouter;
