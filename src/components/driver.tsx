import { ReactElement } from 'react';

interface Props {
  lat: number;
  lng: number;
  $hover?: any;
}

function Driver({ lat, lng, $hover }: Props): ReactElement {
  return <div className="text-lg">🚖</div>;
}

export default Driver;
