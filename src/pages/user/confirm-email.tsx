import React, { ReactElement, useEffect } from 'react';
import { gql, useApolloClient, useMutation } from '@apollo/client';
import { useHistory, useLocation } from 'react-router-dom';
import {
  VerifyEmailMutation,
  VerifyEmailMutationVariables,
} from '../../__generated__/VerifyEmailMutation';
import useMe from '../../hooks/useMe';

const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmailMutation($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

function ConfirmEmail(): ReactElement {
  const { search } = useLocation();
  const history = useHistory();
  const client = useApolloClient();
  const [, code] = search.split('code=');
  const { data: userData } = useMe();
  const [verifyEmailMutation] = useMutation<
    VerifyEmailMutation,
    VerifyEmailMutationVariables
  >(VERIFY_EMAIL_MUTATION, {
    onCompleted: (data) => {
      if (userData?.me.id && data.verifyEmail.ok) {
        client.writeFragment({
          id: `User:${userData.me.id}`,
          fragment: gql`
            fragment VerifiedEmail on User {
              verified
            }
          `,
          data: {
            verified: true,
          },
        });
        history.push('/');
      }
    },
  });

  useEffect(() => {
    verifyEmailMutation({
      variables: {
        input: { code },
      },
    });
  }, [verifyEmailMutation, code]);

  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <h2 className="text-lg mb-1 font-medium">Confirming email...</h2>
      <h4 className="text-gray-700 text-sm">
        Please wait, don't close this page...
      </h4>
    </div>
  );
}

export default ConfirmEmail;
