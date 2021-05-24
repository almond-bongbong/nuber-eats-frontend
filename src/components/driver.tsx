import { ReactElement } from 'react';

interface Props {
  lat: number;
  lng: number;
  $hover?: any;
}

function Driver({}: Props): ReactElement {
  return <div className="text-lg">🚖</div>;
}

export default Driver;
