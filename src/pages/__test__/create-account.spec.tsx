import CreateAccount, { CREATE_ACCOUNT_MUTATION } from '../create-account';
import { ApolloProvider } from '@apollo/client';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import { render } from '../../utils/test-utils';
import { RenderResult, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserRole } from '../../__generated__/globalTypes';

const mockPushImplementation = jest.fn();

jest.mock('react-router-dom', () => {
  const realModule = jest.requireActual('react-router-dom');

  return {
    ...realModule,
    useHistory: () => ({
      push: mockPushImplementation,
    }),
  };
});

describe('<CreateAccount />', () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;

  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <CreateAccount />
        </ApolloProvider>
      );
    });
  });

  it('should render ok', async () => {
    await waitFor(() =>
      expect(document.title).toBe('Create Account | Nuber eats')
    );
  });

  it('should render validation errors', async () => {
    const { getByText, getByRole, getByPlaceholderText } = renderResult;
    const inputEmail = getByPlaceholderText('Email');
    const submitButton = getByText('Create Account');

    await waitFor(() => {
      userEvent.type(inputEmail, 'wont@work');
    });
    expect(getByRole('alert')).toHaveTextContent('Please enter a valid email');

    await waitFor(() => {
      userEvent.clear(inputEmail);
    });
    expect(getByRole('alert')).toHaveTextContent('Email is required');

    await waitFor(() => {
      userEvent.type(inputEmail, 'working@email.com');
      userEvent.click(submitButton);
    });
    expect(getByRole('alert')).toHaveTextContent('Password is required');
  });

  it('should submit mutation with form values', async () => {
    const { getByText, getByRole, getByPlaceholderText } = renderResult;
    const inputEmail = getByPlaceholderText('Email');
    const inputPassword = getByPlaceholderText('Password');
    const submitButton = getByText('Create Account');
    const formData = {
      email: 'working@email.com',
      password: '12345',
      role: UserRole.CLIENT,
    };

    const mockedLoginMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: 'mutation-error',
        },
      },
    });

    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedLoginMutationResponse
    );

    await waitFor(() => {
      userEvent.type(inputEmail, formData.email);
      userEvent.type(inputPassword, formData.password);
      userEvent.click(submitButton);
    });

    expect(mockedLoginMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedLoginMutationResponse).toHaveBeenCalledWith({
      input: {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      },
    });
    expect(getByRole('alert')).toHaveTextContent('mutation-error');
    expect(mockPushImplementation).toHaveBeenCalledWith('/');
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
