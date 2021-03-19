import { render, waitFor } from '@testing-library/react';
import Header from '../header';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import { ME_QUERY } from '../../hooks/useMe';

describe('<Header />', () => {
  it('should render verify banner', async () => {
    await waitFor(async () => {
      const { getByText } = render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: ME_QUERY,
              },
              result: {
                data: {
                  me: {
                    id: '1',
                    email: '',
                    role: '',
                    verified: false,
                  },
                },
              },
            },
          ]}
        >
          <BrowserRouter>
            <Header />
          </BrowserRouter>
        </MockedProvider>
      );

      await new Promise((resolve) => setTimeout(resolve, 0));
      getByText('Please verify your email.');
    });
  });

  it('should render without verify banner', async () => {
    await waitFor(async () => {
      const { queryByText } = render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: ME_QUERY,
              },
              result: {
                data: {
                  me: {
                    id: '1',
                    email: '',
                    role: '',
                    verified: true,
                  },
                },
              },
            },
          ]}
        >
          <BrowserRouter>
            <Header />
          </BrowserRouter>
        </MockedProvider>
      );

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(queryByText('Please verify your email.')).toBeNull();
    });
  });
});
