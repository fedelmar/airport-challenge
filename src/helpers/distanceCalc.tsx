export type Location = {
  latitude: number;
  longitude: number;
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
  let diferenceLat = toRad(locationTo.latitude - locationFrom.latitude);
  let diferenceLong = toRad(locationTo.longitude - locationFrom.longitude);
  let fromLatitudeRaius = toRad(locationFrom.latitude);
  let toLatitudeRadius = toRad(locationTo.latitude);

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
  let diferenceLong = toRad(locationTo.longitude - locationFrom.longitude);

  locationFrom.latitude = toRad(locationFrom.latitude);
  locationTo.latitude = toRad(locationTo.latitude);
  locationFrom.longitude = toRad(locationFrom.longitude);

  let bX = Math.cos(locationTo.latitude) * Math.cos(diferenceLong);
  let bY = Math.cos(locationTo.latitude) * Math.sin(diferenceLong);
  let lat3 = Math.atan2(
    Math.sin(locationFrom.latitude) + Math.sin(locationTo.latitude),
    Math.sqrt(
      (Math.cos(locationFrom.latitude) + bX) *
        (Math.cos(locationFrom.latitude) + bX) +
        bY * bY
    )
  );
  let lng3 =
    locationFrom.longitude +
    Math.atan2(bY, Math.cos(locationFrom.latitude) + bX);

  return { lat: toDeg(lat3), lng: toDeg(lng3) };
};
