export type Location = {
  lat: number;
  lng: number;
  name?: string;
};

const toRad = (value: number) => {
  return (value * Math.PI) / 180;
};

const toDeg = (value: number) => {
  return (value * 180) / Math.PI;
};

export const calcCrow = (locationFrom: Location, locationTo: Location) => {
  let R = 6371; // km
  let diferenceLat = toRad(locationTo.lat - locationFrom.lat);
  let diferenceLong = toRad(locationTo.lng - locationFrom.lng);
  let fromLatitudeRaius = toRad(locationFrom.lat);
  let toLatitudeRadius = toRad(locationTo.lat);

  let a =
    Math.sin(diferenceLat / 2) * Math.sin(diferenceLat / 2) +
    Math.sin(diferenceLong / 2) *
      Math.sin(diferenceLong / 2) *
      Math.cos(fromLatitudeRaius) *
      Math.cos(toLatitudeRadius);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c;
  return (d / 1.852);
};

export const middlePoint = (locationFrom: Location, locationTo: Location) => {
  let diferenceLong = toRad(locationTo.lng - locationFrom.lng);

  locationFrom.lat = toRad(locationFrom.lat);
  locationTo.lat = toRad(locationTo.lat);
  locationFrom.lng = toRad(locationFrom.lng);

  let bX = Math.cos(locationTo.lat) * Math.cos(diferenceLong);
  let bY = Math.cos(locationTo.lat) * Math.sin(diferenceLong);
  let lat3 = Math.atan2(
    Math.sin(locationFrom.lat) + Math.sin(locationTo.lat),
    Math.sqrt(
      (Math.cos(locationFrom.lat) + bX) *
        (Math.cos(locationFrom.lat) + bX) +
        bY * bY
    )
  );
  let lng3 =
    locationFrom.lng +
    Math.atan2(bY, Math.cos(locationFrom.lat) + bX);

  return { lat: toDeg(lat3), lng: toDeg(lng3) };
};
