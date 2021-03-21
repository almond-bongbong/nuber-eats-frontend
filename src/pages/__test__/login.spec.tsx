import { render, RenderResult, waitFor } from '@testing-library/react';
import Login, { LOGIN_MUTATION } from '../login';
import { ApolloProvider } from '@apollo/client';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

describe('<Login />', () => {
  let renderResult: RenderResult;
  let mockedClient: MockApolloClient;

  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();

      renderResult = render(
        <HelmetProvider>
          <BrowserRouter>
            <ApolloProvider client={mockedClient}>
              <Login />
            </ApolloProvider>
          </BrowserRouter>
        </HelmetProvider>
      );
    });
  });

  it('should render OK', async () => {
    await waitFor(() => {
      expect(document.title).toBe('Login | Nuber eats');
    });
  });

  it('should display email validation errors', async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const inputEmail = getByPlaceholderText(/email/i);

    await waitFor(() => userEvent.type(inputEmail, 'aaa'));
    expect(getByRole('alert')).toHaveTextContent('Please enter a valid email');

    await waitFor(() => userEvent.clear(inputEmail));
    expect(getByRole('alert')).toHaveTextContent('Email is required');
  });

  it('should display password validation errors', async () => {
    const { getByPlaceholderText, getByRole, getByText } = renderResult;
    const inputEmail = getByPlaceholderText('Email');
    const inputPassword = getByPlaceholderText('Password');
    const submitButton = getByText('Log in');

    await waitFor(() => {
      userEvent.type(inputEmail, 'admin@email.com');
      userEvent.click(submitButton);
    });

    expect(getByRole('alert')).toHaveTextContent('Password is required');

    await waitFor(() => {
      userEvent.type(inputPassword, '123');
    });

    expect(getByRole('alert')).toHaveTextContent(
      'Password must be more than 5 chars.'
    );
  });

  it('should submits form and calls mutation', async () => {
    const { getByPlaceholderText, getByText, getByRole } = renderResult;
    const inputEmail = getByPlaceholderText('Email');
    const inputPassword = getByPlaceholderText('Password');
    const submitButton = getByText('Log in');

    const formData = {
      email: 'user@test.com',
      password: '12345',
    };

    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          token: 'XXX',
          error: 'mutation-error',
        },
      },
    });
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
    jest.spyOn(Storage.prototype, 'setItem');

    await waitFor(() => {
      userEvent.type(inputEmail, formData.email);
      userEvent.type(inputPassword, formData.password);
      userEvent.click(submitButton);
    });
    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      input: {
        email: formData.email,
        password: formData.password,
      },
    });

    const errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent('mutation-error');
    expect(localStorage.setItem).toHaveBeenCalledWith('nuber-token', 'XXX');
  });
});
