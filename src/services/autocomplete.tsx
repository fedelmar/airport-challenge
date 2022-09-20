import axios from "axios";

const API_KEY = process.env.API_KEY || "d37b002dfd";
const URI = "https://www.air-port-codes.com/api/v1/";
const COUNTRY = "us";

export type Airport = {
  name: string;
  city: string;
  iata: string;
  country: {
    name: string;
    iso: string;
  };
  state: {
    name: string;
    abbr: string;
  };
  latitude: string;
  longitude: string;
};

interface GetAirportsResponse {
  airports: Airport[];
}

export const getAirports = async (searchTerm: string) => {
  try {
    const { data } = await axios.get<GetAirportsResponse>(
      `${URI}?term=${searchTerm}&countries=${COUNTRY}&type=a`,
      {
        headers: {
          Accept: "application/json",
          "APC-Auth": API_KEY,
        },
      }
    );
    return data.airports;
  } catch (error) {
    console.log(error);
  }
};
