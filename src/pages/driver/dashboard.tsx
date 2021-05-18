import React, { ReactElement } from 'react';
import GoogleMapReact from 'google-map-react';

function Dashboard(): ReactElement {
  return (
    <div>
      <div
        className="bg-gray-800"
        style={{ width: window.innerWidth, height: '95vh' }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyD4Y-S7J_T1TV91_iDhVowyzkzvw3kWpwE' }}
          defaultZoom={11}
          defaultCenter={{
            lat: 59.95,
            lng: 30.33,
          }}
        >
          <h1>hello</h1>
        </GoogleMapReact>
      </div>
    </div>
  );
}

export default Dashboard;
