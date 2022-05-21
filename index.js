//Author: Ricardo Rodrigues Malosso
//Date: 2022-04-24
//This project calculates a list of routes for drones to deliver
//packages, based on a list of drones and locations input by the user.

//Given the time constraints,
//and given that the original problem is considered NP-Hard,
//a a Naive algorithm was chosen, and it should return
//an approximately-optimal list of Routes.

//algorithm used was adapted from:
//https://en.wikipedia.org/wiki/First-fit-decreasing_bin_packing
//more information on Variable Size Bin Packing Problems:
//https://epubs.siam.org/doi/10.1137/0215016

const Drone = require("./Classes/Drone.js");
const Location = require("./Classes/Location.js");
const Route = require("./Classes/Route.js");
//mock data generator
var casual = require("casual");

let droneAmount = 0;
let undeliveredPackages = 0;

//as opposed to receiving an input file, the program generates random data
// every time it's run.
//I'm considering the requirement "The client should be able to run the project
// and have the results displayed" when making
//this specific decision.
//This is something I would check with a product owner or client before deciding for myself, of course.

main();

function main() {
  const { locations, drones } = generateTestData();
  const sortedLocations = sortPackagesDesc(locations); //important for First Fit
  const sortedDrones = sortDronesDesc(drones);
  const biggestDrone = sortedDrones[0]; //only uses the largest

  //generatest a list of routes and prints it
  const generatedRoutes = generateRoutesForDrone(sortedLocations, biggestDrone);
  printRoutes(generatedRoutes);
}

function generateTestData() {
  const drones = [];
  const locations = [];
  droneAmount = casual.integer(1, 2);
  //tested with up to 10000 locations
  let locationAmount = casual.integer(5, 25);

  console.log("generating drone data for ", droneAmount, " drones.");
  for (var i = 0; i <= droneAmount; i++) {
    drones.push(new Drone(casual.username, casual.integer(300, 1000)));
  }
  console.log("generating location data for ", locationAmount, " places.");
  for (var j = 0; j <= locationAmount; j++) {
    locations.push(new Location(casual.city, casual.integer(1, 700)));
  }
  return { locations, drones };
}

function sortPackagesDesc(locations) {
  const tmpLocations = [...locations];
  tmpLocations.sort((a, b) => {
    if (a.packageWeight < b.packageWeight) {
      return 1;
    }
    if (a.packageWeight > b.packageWeight) {
      return -1;
    }
    return 0;
  });

  return tmpLocations;
}
function sortDronesDesc(drones) {
  const dronesToSort = [...drones];
  //my addition, sorts the drones from highest to lowest capacity
  dronesToSort.sort((a, b) => {
    if (a.weightCapacity < b.weightCapacity) {
      return 1;
    }
    if (a.weightCapacity > b.weightCapacity) {
      return -1;
    }
    return 0;
  });
  return dronesToSort;
}

function generateRoutesForDrone(sortedLocations, drone) {
  const generatedRoutes = [new Route(drone)];

  for (const location of sortedLocations) {
    //checks if package is larger than drone capacity
    if (location.packageWeight > drone.weightCapacity) {
      undeliveredPackages++;
      break;
    }
    let hasFit = false;
    //tries to find a trip/route that has space for our package
    for (const route of generatedRoutes) {
      hasFit = route.addLocation(location);
      if (hasFit) {
        break;
      }
    }
    //if haven't find space in any routes, add new route
    if (!hasFit) {
      generatedRoutes.push(new Route(drone, [location]));
    }
  }

  return generatedRoutes;
}

function printRoutes(routes) {
  const routesByDrone = {};
  routes.forEach((route) => {
    routesByDrone[route.drone.name] = routesByDrone[route.drone.name] || [];
    routesByDrone[route.drone.name].push(route);
  });

  console.log(JSON.stringify(routesByDrone, null, 2));
}
