import React, { useEffect, useState } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { getAirports, Airport } from "../services/autocomplete";

interface AutocompletInputProps {
  airport: Airport | null;
  setAirport: (airport: Airport | null) => void;
  label: string;
}

export const AutocompletInput = ({
  airport,
  setAirport,
  label,
}: AutocompletInputProps) => {
  const [options, setOptions] = useState<readonly Airport[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (inputValue.length > 2) {
        const airports = await getAirports(inputValue);
        if (airports) {
          setOptions(airports);
        } else {
          setOptions([]);
        }
      }
      setLoading(false);
    })();
  }, [inputValue]);

  return (
    <Autocomplete
      id="airport-autocomplete"
      sx={{ width: "100%", marginY: "5px" }}
      onInputChange={(event, newInputValue, reason) => {
        if (reason === "clear") {
          setAirport(null);
          setOptions([]);
        }
        setInputValue(newInputValue);
      }}
      onChange={(event: any, newValue: Airport | null) => {
        setOptions([]);
        setAirport(newValue);
        setInputValue("");
      }}
      value={airport}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      getOptionLabel={(option) => `${option.iata} - ${option.name}`}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
};
