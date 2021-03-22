import { waitFor } from '@testing-library/react';
import NotFound from '../404';
import { render } from '../../utils/test-utils';

describe('<NotFound />', () => {
  it('should render OK', async () => {
    render(<NotFound />);

    await waitFor(() => {
      expect(document.title).toBe('Not Found | Nuber Eats');
    });
  });
});
