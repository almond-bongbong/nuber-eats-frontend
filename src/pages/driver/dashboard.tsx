import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';

interface Coords {
  lat: number;
  lng: number;
}

function Dashboard(): ReactElement {
  const [driverCoords, setDriverCoords] = useState<Coords>({ lat: 0, lng: 0 });

  const onSuccess: PositionCallback = useCallback((position) => {
    const { latitude, longitude } = position.coords;
    setDriverCoords({ lat: latitude, lng: longitude });
  }, []);

  const onError: PositionErrorCallback = useCallback((error) => {
    console.error(error);
  }, []);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [onSuccess, onError]);

  const onApiLoaded = ({
    map,
    maps,
  }: {
    map: google.maps.Map;
    maps: {
      LatLng: {
        new (
          latOrLatLngLiteral: number | google.maps.LatLngLiteral,
          lngOrNoWrap?: number | boolean | null,
          noWrap?: boolean
        ): google.maps.LatLng;
      };
    };
    ref: Element | null;
  }) => {
    setTimeout(() => {
      map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
    }, 2000);
  };

  return (
    <div>
      <div
        className="bg-gray-800"
        style={{ width: window.innerWidth, height: '95vh' }}
      >
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          bootstrapURLKeys={{
            key: process.env.REACT_APP_GOOGLE_MAP_API_KEY || '',
          }}
          defaultZoom={15}
          defaultCenter={{
            lat: 36.58,
            lng: 125.95,
          }}
        />
      </div>
    </div>
  );
}

export default Dashboard;
