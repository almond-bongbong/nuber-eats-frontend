import React, { ReactElement } from 'react';
import Button from '../../components/button';
import { useForm } from 'react-hook-form';
import useMe from '../../hooks/useMe';
import { gql, useApolloClient, useMutation } from '@apollo/client';
import {
  EditProfileMutation,
  EditProfileMutationVariables,
} from '../../__generated__/EditProfileMutation';
import { emailRegexp } from '../../utils/regexp';

interface EditProfileForm {
  email?: string;
  password: string;
}

const EDIT_PROFILE_MUTATION = gql`
  mutation EditProfileMutation($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

function EditProfile(): ReactElement {
  const client = useApolloClient();
  const { data: userData } = useMe();
  const { register, handleSubmit, getValues, formState } = useForm<
    EditProfileForm
  >({
    mode: 'onChange',
    defaultValues: {
      email: userData?.me.email || '',
      password: '',
    },
  });
  const [editProfileMutation, { loading }] = useMutation<
    EditProfileMutation,
    EditProfileMutationVariables
  >(EDIT_PROFILE_MUTATION, {
    onCompleted: (data) => {
      if (data.editProfile.ok && userData?.me) {
        const prevEmail = userData.me.email;
        const newEmail = getValues().email;
        if (prevEmail !== newEmail) {
          client.writeFragment({
            id: `User:${userData.me.id}`,
            fragment: gql`
              fragment EditedUser on User {
                email
                verified
              }
            `,
            data: {
              email: newEmail,
              verified: false,
            },
          });
        }
      }
    },
  });

  const onSubmit = () => {
    const { email, password } = getValues();
    editProfileMutation({
      variables: {
        input: {
          email,
          ...(password && { password }),
        },
      },
    });
  };

  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
      <form
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          ref={register({
            required: true,
            pattern: emailRegexp,
          })}
          name="email"
          className="input"
          type="email"
          placeholder="Email"
        />
        <input
          ref={register}
          name="password"
          className="input"
          type="password"
          placeholder="Password"
        />
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText="Save Profile"
        />
      </form>
    </div>
  );
}

export default EditProfile;
