import { render, waitFor } from '@testing-library/react';
import NotFound from '../404';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

describe('<NotFound />', () => {
  it('should render OK', async () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <NotFound />
        </BrowserRouter>
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(document.title).toBe('Not Found | Nuber Eats');
    });
  });
});
