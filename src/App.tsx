import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Airport } from "./services/autocomplete";
import { AutocompletInput } from "./components/AutocompleteInput";
import { calcCrow, middlePoint } from "./helpers/distanceCalc";
import { Map } from "./components/Map";
import { Typography } from "@mui/material";
import AirlinesIcon from "@mui/icons-material/Airlines";
import FlightIcon from "@mui/icons-material/Flight";

const middleUsaPoint = {
  lat: 39.8097343,
  lng: -98.5556199,
};

const emptyPoint = {
  lat: 0,
  lng: 0,
};

const App = () => {
  const [from, setFrom] = useState<Airport | null>(null);
  const [to, setTo] = useState<Airport | null>(null);
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
          flexDirection: { xs: "column", sm: "row", md: "column" },
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          border: "1px  solid  black",
          borderRadius: "5px",
          boxShadow: "5px 2px 2px grey",
          width: {
            xs: 300,
            sm: 650,
            md: 700,
          },
          height: {
            xs: 600,
            sm: 330,
            md: 650,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", sm: "start", md: "center" },
            marginRight: { xs: 0, sm: 3, md: 0 },
            width: {
              xs: 300,
              sm: 300,
              md: 700,
            },
            height: "auto",
          }}
        >
          <Typography
            fontWeight="bold"
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: { xs: 2, sm: 3, md: 5 },
              fontSize: { xs: 20, sm: 20, md: 25 },
            }}
          >
            Airport Distance Calculator
            <AirlinesIcon sx={{ marginLeft: 1 }} fontSize="large" />
          </Typography>

          <Box
            sx={{
              width: {
                xs: 300,
                sm: 300,
                md: 700,
              },
              display: "flex",
              flexDirection: "column",
              alignItems: { sx: "center", sm: "start", md: "center" },
              marginBottom: 3,
            }}
          >
            <AutocompletInput
              airport={from}
              setAirport={setFrom}
              label="From"
            />
            <AutocompletInput airport={to} setAirport={setTo} label="To" />
          </Box>

          {distance !== 0 && (
            <Box
              sx={{ display: "flex", marginBottom: 3, alignItems: "center" }}
            >
              <FlightIcon sx={{ transform: "rotate(45deg)", marginRight: 1 }} />
              <Typography
                sx={{ marginRight: 1, maxWidth: { xs: 160, sm: 160, md: 300 } }}
              >
                The distance between the two airports is:
              </Typography>
              <Typography fontWeight="bold">
                {distance.toFixed(2)} nmi.
              </Typography>
            </Box>
          )}
        </Box>

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
