import { render } from '@testing-library/react';
import Restaurant from '../restaurant';
import { BrowserRouter } from 'react-router-dom';

describe('<Restaurant />', () => {
  it('should render OK with props', () => {
    const restaurantProps = {
      id: '1',
      name: 'name',
      coverImage: 'lala',
      categoryName: 'categoryName',
    };
    const { getByText, container } = render(
      <BrowserRouter>
        <Restaurant {...restaurantProps} />
      </BrowserRouter>
    );

    getByText(restaurantProps.name);
    getByText(restaurantProps.categoryName);
    expect(container.firstChild).toHaveAttribute(
      'href',
      `/restaurant/${restaurantProps.id}`
    );
  });
});
