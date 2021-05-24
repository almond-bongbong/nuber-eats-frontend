import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import Driver from '../../components/driver';

interface Coords {
  lat: number;
  lng: number;
}

function Dashboard(): ReactElement {
  const [driverCoords, setDriverCoords] = useState<Coords>({ lat: 0, lng: 0 });
  const [map, setMap] = useState<google.maps.Map>();

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

  useEffect(() => {
    if (map && google.maps) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));

      // const geocoder = new google.maps.Geocoder();
      // geocoder.geocode(
      //   {
      //     location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
      //   },
      //   (results, status) => {
      //     console.log(results, status);
      //   }
      // );
    }
  }, [map, driverCoords.lat, driverCoords.lng]);

  const onApiLoaded = ({
    map,
  }: {
    map: google.maps.Map;
    ref: Element | null;
  }) => {
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
  };

  return (
    <div>
      <div
        className="bg-gray-800"
        style={{ width: window.innerWidth, height: '50vh' }}
      >
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          bootstrapURLKeys={{
            key: process.env.REACT_APP_GOOGLE_MAP_API_KEY || '',
          }}
          defaultZoom={16}
          defaultCenter={{
            lat: 36.58,
            lng: 125.95,
          }}
        >
          <Driver lat={driverCoords.lat} lng={driverCoords.lng} />
        </GoogleMapReact>
      </div>
    </div>
  );
}

export default Dashboard;
