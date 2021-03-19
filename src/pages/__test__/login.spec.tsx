import { render, RenderResult, waitFor } from '@testing-library/react';
import Login from '../login';
import { ApolloProvider } from '@apollo/client';
import { createMockClient } from 'mock-apollo-client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

describe('<Login />', () => {
  let renderResult: RenderResult;

  beforeEach(async () => {
    await waitFor(() => {
      const mockedClient = createMockClient();

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
});
