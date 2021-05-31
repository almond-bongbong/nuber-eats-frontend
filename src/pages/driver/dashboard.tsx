import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import Driver from '../../components/driver';
import { gql } from '@apollo/client/core';
import { FULL_ORDER_FRAGMENT } from '../../fragments';
import { useMutation, useSubscription } from '@apollo/client';
import { CookedOrderSubscription } from '../../__generated__/CookedOrderSubscription';
import {
  TakeOrderMutation,
  TakeOrderMutationVariables,
} from '../../__generated__/TakeOrderMutation';
import { useHistory } from 'react-router-dom';

interface Coords {
  lat: number;
  lng: number;
}

const COOKED_ORDER_SUBSCRIPTION = gql`
  subscription CookedOrderSubscription {
    cookedOrder {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const TAKE_ORDER_MUTATION = gql`
  mutation TakeOrderMutation($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`;

function Dashboard(): ReactElement {
  const history = useHistory();
  const [driverCoords, setDriverCoords] = useState<Coords>({ lat: 0, lng: 0 });
  const [map, setMap] = useState<google.maps.Map>();
  const [
    takeOrderMutation,
    { loading: loadingTakeOrderMutation },
  ] = useMutation<TakeOrderMutation, TakeOrderMutationVariables>(
    TAKE_ORDER_MUTATION
  );

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

  const makeRoute = useCallback(() => {
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);
      directionsService.route(
        {
          origin: {
            location: new google.maps.LatLng(
              driverCoords.lat,
              driverCoords.lng
            ),
          },
          destination: {
            location: new google.maps.LatLng(
              driverCoords.lat + 0.05,
              driverCoords.lng + 0.05
            ),
          },
          travelMode: google.maps.TravelMode.TRANSIT,
        },
        (result, status) => {
          directionsRenderer.setDirections(result);
        }
      );
    }
  }, [map, driverCoords.lat, driverCoords.lng]);

  const { data: cookedOrderData } = useSubscription<CookedOrderSubscription>(
    COOKED_ORDER_SUBSCRIPTION
  );

  useEffect(() => {
    if (cookedOrderData?.cookedOrder.id) {
      makeRoute();
    }
  }, [cookedOrderData, makeRoute]);

  const handleTakeOrder = async (orderId: string) => {
    const { data: takeOrderData } = await takeOrderMutation({
      variables: {
        input: {
          id: orderId,
        },
      },
    });

    if (takeOrderData?.takeOrder.ok) {
      history.push(`/orders/${orderId}`);
    } else {
      alert(takeOrderData?.takeOrder.error);
    }
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

      <div className="max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
        {cookedOrderData?.cookedOrder ? (
          <>
            <h1 className="text-center text-3xl font-medium">
              New Cooked Order
            </h1>
            <h4 className="text-center my-3 text-2xl font-medium">
              Pick it up soon @ {cookedOrderData?.cookedOrder.restaurant.name}
            </h4>
            <button
              type="button"
              onClick={() => handleTakeOrder(cookedOrderData?.cookedOrder.id)}
              className="btn w-full mt-5"
            >
              Accept Challenge &rarr;
            </button>
          </>
        ) : (
          <h1 className="text-center text-3xl font-medium">No orders yet...</h1>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
