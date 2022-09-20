import React, { ReactElement, useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { Location } from "../helpers/distanceCalc";

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_KEY;

const MapComponent = ({
  center,
  zoom,
  locationFrom,
  locationTo,
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
  locationFrom: Location;
  locationTo: Location;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [middlePoint, setMiddlePoint] = useState<google.maps.LatLngLiteral>(
    center
  );

  const positionFrom: google.maps.LatLngLiteral = {
    lat: locationFrom.latitude,
    lng: locationFrom.longitude,
  };

  const positionTo: google.maps.LatLngLiteral = {
    lat: locationTo.latitude,
    lng: locationTo.longitude,
  };

  useEffect(() => {
    if (ref.current && !map) {
      // Iniciate map
      const map = new window.google.maps.Map(ref.current, {
        center: middlePoint,
        zoom,
      });

      // Set bounds
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(positionFrom);
      bounds.extend(positionTo);
      map.fitBounds(bounds);

      // Add airport from marker
      new window.google.maps.Marker({
        position: positionFrom,
        map,
        title: locationFrom.name,
      });

      // Add ariport to marker
      new window.google.maps.Marker({
        position: positionTo,
        map,
        title: locationTo.name,
      });

      // Add line
      const line = new window.google.maps.Polyline({
        path: [positionFrom, positionTo],
        geodesic: true,
        strokeColor: "#0000FF",
        strokeOpacity: 0.8,
        strokeWeight: 3,
      });

      line.setMap(map);

      setMap(map);
    }
  }, [ref, map]);

  return <div ref={ref} id="map" style={{ height: "400px", width: "350px" }} />;
};

const render = (status: Status): ReactElement => {
  if (status === Status.FAILURE) return <p>Error</p>;
  return <p>Loading map...</p>;
};

interface MapProps {
  locationFrom: Location;
  locationTo: Location;
  center: google.maps.LatLngLiteral;
}

export const Map = ({ locationFrom, locationTo, center }: MapProps) => (
  <Wrapper apiKey={API_KEY as string} render={render}>
    <MapComponent
      center={center}
      zoom={4}
      locationFrom={locationFrom}
      locationTo={locationTo}
    />
  </Wrapper>
);
