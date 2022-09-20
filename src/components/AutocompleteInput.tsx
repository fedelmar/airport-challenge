import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { getAirports, Airport } from "../services/autocomplete";
import { emptyAirport } from "../App";

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
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly Airport[]>([]);
  const [inputValue, setInputValue] = useState("");
  const loading = open && options.length === 0;

  useEffect(() => {
    let active = true;
    if (!loading) {
      return undefined;
    }

    (async () => {
      const airports = await getAirports(inputValue);

      if (active) {
        setOptions([...(airports || [])]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading, inputValue]);

  useEffect(() => {
    if (!open || inputValue.length < 3) {
      setOptions([]);
    }
  }, [open, inputValue]);

  return (
    <Autocomplete
      id="from-autocomplete"
      sx={{ width: 300, marginY: "5px" }}
      open={open && inputValue.length > 2}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setInputValue("");
        setOpen(false);
      }}
      onInputChange={(event, newInputValue, reason) => {
        if (reason === "clear") {
          setAirport(emptyAirport);
          setOptions([]);
        }
        setInputValue(newInputValue);
      }}
      onChange={(event: any, newValue: Airport | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setAirport(newValue);
      }}
      value={airport}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      getOptionLabel={(option) => `${option.name} - ${option.iata}`}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
          }}
        />
      )}
    />
  );
};
