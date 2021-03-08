import React from 'react';
import { render } from '@testing-library/react';
import Button from '../button';

describe('<Button />', () => {
  it('should render OK with props', () => {
    const { getByText } = render(
      <Button canClick={true} loading={false} actionText="test" />
    );
    getByText('test');
  });

  it('should display loading', () => {
    const { getByText } = render(
      <Button canClick={true} loading={true} actionText="test" />
    );
    getByText('Loading...');
  });

  it('should display canClick=false style', () => {
    const { container } = render(<Button canClick={false} loading={true} actionText="test" />);
    expect(container.firstChild).toHaveClass('pointer-events-none');
  });
});
