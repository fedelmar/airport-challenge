import React, {
  Children,
  cloneElement,
  FC,
  isValidElement,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { Location } from "../helpers/distanceCalc";

const Marker: FC<google.maps.MarkerOptions> = (options) => {
  const [marker, setMarker] = useState<google.maps.Marker>();

  useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
    }

    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  return null;
};

const MapComponent = ({
  center,
  zoom,
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, { center, zoom }));
    }
  }, [ref, map]);

  return (
    <>
      <div ref={ref} id="map" style={{ height: "400px", width: "350px" }} />
    </>
  );
};

const render = (status: Status): ReactElement => {
  if (status === Status.FAILURE) return <p>Error</p>;
  return <p>Loading map...</p>;
};

interface MapProps {
  locationFrom?: Location;
  locationTo?: Location;
  center: google.maps.LatLngLiteral;
}

export const Map = ({
  locationFrom,
  locationTo: Location,
  center,
}: MapProps) => (
  <Wrapper apiKey={"AIzaSyDouWZzaEKdZPINy0ZoybA1Uh3ccQ7jNLI"} render={render}>
    <MapComponent center={center} zoom={4}></MapComponent>
  </Wrapper>
);
