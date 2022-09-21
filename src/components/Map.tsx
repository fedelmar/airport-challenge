import React, { ReactElement, useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { Location } from "../helpers/distanceCalc";
import { Box } from "@mui/material";

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_KEY;

const MapComponent = ({
  center,
  zoom,
  locationFrom,
  locationTo,
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
  locationFrom?: Location;
  locationTo?: Location;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [middlePoint, setMiddlePoint] = useState<google.maps.LatLngLiteral>(
    center
  );
  const [markerFrom, setMarkerFrom] = useState<google.maps.Marker>();
  const [markerTo, setMarkerTo] = useState<google.maps.Marker>();
  const [line, setLine] = useState<google.maps.Polyline>();

  useEffect(() => {
    // Iniciate map
    if (ref.current) {
      const map = new window.google.maps.Map(ref.current, {
        center: middlePoint,
        zoom,
      });
      setMap(map);
    }
  }, []);

  useEffect(() => {
    if (map) {
      if (locationFrom) {
        // Add airport from marker
        const marker = new window.google.maps.Marker({
          position: locationFrom,
          map,
        });
        if (markerFrom) {
          markerFrom.setMap(null);
        }
        setMarkerFrom(marker);
        map.setCenter(center);
      } else {
        if (markerFrom) {
          markerFrom.setMap(null);
          setMarkerFrom(undefined);
        }
      }

      if (locationTo) {
        // Add airport from marker
        const marker = new window.google.maps.Marker({
          position: locationTo,
          map,
        });
        if (markerTo) {
          markerTo.setMap(null);
        }
        setMarkerTo(marker);
        map.setCenter(center);
      } else {
        if (markerTo) {
          markerTo.setMap(null);
          setMarkerTo(undefined);
        }
      }
    }
  }, [locationFrom, locationTo]);

  useEffect(() => {
    if (map) {
      // Set bounds
      if (markerFrom && markerTo) {
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(markerFrom.getPosition()!);
        bounds.extend(markerTo.getPosition()!);
        map.fitBounds(bounds);

        // Add line
        const drawLine = new window.google.maps.Polyline({
          path: [markerFrom.getPosition()!, markerTo.getPosition()!],
          geodesic: true,
          strokeColor: "#0000FF",
          strokeOpacity: 0.8,
          strokeWeight: 3,
        });
        if (line) {
          line.setMap(null);
        }
        drawLine.setMap(map);
        setLine(drawLine);
      } else {
        if (line) {
          line.setMap(null);
        }
      }
    }
  }, [markerFrom, markerTo]);

  return (
    <Box
      ref={ref}
      id="map"
      sx={{
        height: "25em",
        width: { xs: 300, sm: 550, md: 700, lg: 700, xl: 700 },
      }}
    />
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
