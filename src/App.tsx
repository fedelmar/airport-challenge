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

const middleUsaPoint = {
  lat: 39.8097343,
  lng: -98.5556199,
};

const emptyPoint = {
  lat: 0,
  lng: 0,
};

const App = () => {
  const [from, setFrom] = useState<Airport | null>(emptyAirport);
  const [to, setTo] = useState<Airport | null>(emptyAirport);
  const [distance, setDistance] = useState<Number>(0);
  const [locationFrom, setLocationFrom] = useState<google.maps.LatLngLiteral>();
  const [locationTo, setLocationTo] = useState<google.maps.LatLngLiteral>();
  const [center, setCenter] = useState<google.maps.LatLngLiteral>(
    middleUsaPoint
  );

  useEffect(() => {
    let locationFrom = emptyPoint;
    let locationTo = emptyPoint;
    if (from && from.name !== "") {
      locationFrom = {
        lat: parseFloat(from.latitude),
        lng: parseFloat(from.longitude),
      };
      setLocationFrom(locationFrom);
    } else {
      setLocationFrom(undefined);
    }

    if (to && to.name !== "") {
      locationTo = {
        lat: parseFloat(to.latitude),
        lng: parseFloat(to.longitude),
      };
      setLocationTo(locationTo);
    } else {
      setLocationTo(undefined);
    }

    if (from && from.name !== "" && to && to.name !== "") {
      const result = calcCrow(locationFrom, locationTo);
      setDistance(result);
      const center = middlePoint({ ...locationFrom }, { ...locationTo });
      setCenter(center);
    } else if (from && from.name !== "") {
      setCenter({ lat: locationFrom.lat, lng: locationFrom.lng });
      setDistance(0);
    } else if (to && to.name !== "") {
      setCenter({ lat: locationTo.lat, lng: locationTo.lng });
      setDistance(0);
    }
  }, [from, to]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        component="span"
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          border: "1px  solid  black",
          borderRadius: "3%",
          boxShadow: "5px 2px 2px grey",
          width: {
            xs: 300,
            sm: 550,
            md: 700,
            lg: 700,
            xl: 700,
          },
          height: {
            xs: 500,
            sm: 600,
            md: 700,
            lg: 700,
            xl: 700,
          },
        }}
      >
        <Typography variant="h5"  sx={{ marginBottom: 5, textDecoration: "underline" }}>Airport Distance Calculator</Typography>
        <Box
          sx={{
            width: {
              xs: 300,
              sm: 550,
              md: 700,
              lg: 700,
              xl: 700,
            },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 3 
          }}
        >
          <Typography  variant="body2"  sx={{ marginBottom: 1 }}>
            Type at least 3 characters to search
          </Typography>
          <AutocompletInput airport={from} setAirport={setFrom} label="From" />
          <AutocompletInput airport={to} setAirport={setTo} label="To" />
        </Box>

        {distance !== 0 && (
          <Box sx={{ maxWidth: 300 , marginBottom: 3 }}>
            <Typography sx={{ flexWrap: "wrap" }}>
              {`The distance between the two airports is: ${distance.toFixed(
                2
              )} miles.`}
            </Typography>
          </Box>
        )}


        <Map
          locationFrom={
            locationFrom && {
              lat: locationFrom.lat,
              lng: locationFrom.lng,
            }
          }
          locationTo={
            locationTo && {
              lat: locationTo.lat,
              lng: locationTo.lng,
            }
          }
          center={center}
        />
      </Box>
    </Box>
  );
};

export default App;
