import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Airport } from "./services/autocomplete";
import { AutocompletInput } from "./components/AutocompleteInput";
import { calcCrow, middlePoint } from "./helpers/distanceCalc";
import { Map } from "./components/Map";
import { Typography } from "@mui/material";

export const emptyAirport = {
  name: "",
  city: "",
  iata: "",
  country: { name: "", iso: "" },
  state: { name: "", abbr: "" },
  latitude: "",
  longitude: "",
};

const App = () => {
  const [from, setFrom] = useState<Airport | null>(emptyAirport);
  const [to, setTo] = useState<Airport | null>(emptyAirport);
  const [distance, setDistance] = useState<Number>(0);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    if (from && from.name !== "") {
      const locationFrom = {
        latitude: parseFloat(from.latitude),
        longitude: parseFloat(from.longitude),
      };

      if (to && to.name !== "") {
        const locationTo = {
          latitude: parseFloat(to.latitude),
          longitude: parseFloat(to.longitude),
        };
        const result = calcCrow(locationFrom, locationTo);
        setDistance(result);
        const center = middlePoint(locationFrom, locationTo);
        setCenter(center);
      } else {
        setCenter({ lat: locationFrom.latitude, lng: locationFrom.longitude });
        setDistance(0);
      }
    }
  }, [from, to]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10px",
        justifyContent: "center",
      }}
    >
      <Typography variant="h5">Airport Distance Calculator</Typography>
      <Box
        sx={{
          minWidth: 500,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginY: "20px",
        }}
      >
        <Typography variant="body2" sx={{ marginBottom: "3px" }}>
          Type at least 3 characters to search
        </Typography>
        <AutocompletInput airport={from} setAirport={setFrom} label="From" />
        {from && from.name !== "" && (
          <AutocompletInput airport={to} setAirport={setTo} label="To" />
        )}
      </Box>

      {distance !== 0 && (
        <Box sx={{ maxWidth: 300 }}>
          <Typography sx={{ flexWrap: "wrap" }}>
            {`The distance between the two airports is: ${distance.toFixed(
              2
            )} miles.`}
          </Typography>
        </Box>
      )}

      {from && from.name !== "" && to && to.name !== "" && (
        <Map
          locationFrom={{
            latitude: parseFloat(from.latitude),
            longitude: parseFloat(from.longitude),
            name: from.name,
          }}
          locationTo={{
            latitude: parseFloat(to.latitude),
            longitude: parseFloat(to.longitude),
            name: to.name,
          }}
          center={center}
        />
      )}
    </Box>
  );
};

export default App;
