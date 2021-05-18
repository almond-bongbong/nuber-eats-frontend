import React, { ReactElement, useCallback, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';

function Dashboard(): ReactElement {
  const onSuccess: PositionCallback = useCallback((position) => {
    console.log(position);
  }, []);

  const onError: PositionErrorCallback = useCallback((error) => {
    console.error(error);
  }, []);

  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    });
  }, [onSuccess, onError]);

  return (
    <div>
      <div
        className="bg-gray-800"
        style={{ width: window.innerWidth, height: '95vh' }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{
            key: process.env.REACT_APP_GOOGLE_MAP_API_KEY || '',
          }}
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
