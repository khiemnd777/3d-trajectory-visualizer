// js/calculations.js

import { surveyPoints } from './survey-points.js';

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function calculateDL(azimuth1, azimuth2, inclination1, inclination2) {
  const deltaAzimuth = toRadians(azimuth2 - azimuth1);
  const deltaInclination = toRadians(inclination2 - inclination1);
  return Math.sqrt(deltaAzimuth * deltaAzimuth + deltaInclination * deltaInclination);
}

function calculateRF(dl) {
  return dl === 0 ? 1 : 2 * (Math.sin(dl / 2) / dl);
}

function parseValue(value) {
  return parseFloat(value.toString().replace(/,/g, ''));
}

function calculateCoordinates(point1, point2, initialCoordinates) {
  const depth1 = parseValue(point1.measuredDepth);
  const depth2 = parseValue(point2.measuredDepth);
  const azimuth1 = parseValue(point1.azimuth);
  const azimuth2 = parseValue(point2.azimuth);
  const inclination1 = parseValue(point1.inclination);
  const inclination2 = parseValue(point2.inclination);
  const deltaMD = depth2 - depth1;

  if (deltaMD === 0) {
    console.warn('Delta MD is zero, skipping calculation');
    return initialCoordinates;
  }

  const dl = calculateDL(azimuth1, azimuth2, inclination1, inclination2);
  if (isNaN(dl)) {
    console.error('DL calculation resulted in NaN', { point1, point2, dl });
    return initialCoordinates;
  }

  const rf = calculateRF(dl);
  if (isNaN(rf)) {
    console.error('RF calculation resulted in NaN', { dl, rf });
    return initialCoordinates;
  }

  const incl1 = toRadians(inclination1);
  const incl2 = toRadians(inclination2);
  const azm1 = toRadians(azimuth1);
  const azm2 = toRadians(azimuth2);

  const north = initialCoordinates.north + (deltaMD / 2) * (Math.sin(incl1) * Math.cos(azm1) + Math.sin(incl2) * Math.cos(azm2)) * rf;
  const east = initialCoordinates.east + (deltaMD / 2) * (Math.sin(incl1) * Math.sin(azm1) + Math.sin(incl2) * Math.sin(azm2)) * rf;
  const tvd = initialCoordinates.tvd + (deltaMD / 2) * (Math.cos(incl1) + Math.cos(incl2)) * rf;

  if (isNaN(north) || isNaN(east) || isNaN(tvd)) {
    console.error('Coordinate calculation resulted in NaN', { north, east, tvd, point1, point2, initialCoordinates });
    return initialCoordinates;
  }

  return { north, east, tvd };
}

const initialCoordinates = { north: 0, east: 0, tvd: 0 };
const coordinates = [initialCoordinates];
for (let i = 1; i < surveyPoints.length; i++) {
  const newCoordinates = calculateCoordinates(surveyPoints[i - 1], surveyPoints[i], coordinates[i - 1]);
  coordinates.push(newCoordinates);
}
console.log(coordinates);

export { coordinates }; // Export coordinates for use in main.js
