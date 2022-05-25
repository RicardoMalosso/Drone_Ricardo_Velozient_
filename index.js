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
const fs = require("fs");
let droneAmount = 0;
let undeliveredPackages = 0;

main();

function main() {
  const { locations, drones } = parseFileData("input1.txt");
  const sortedLocations = sortPackagesDesc(locations); //important for First Fit
  const sortedDrones = sortDronesDesc(drones);
  const biggestDrone = sortedDrones[0]; //only uses the largest

  //generatest a list of routes and prints it
  const generatedRoutes = generateRoutesForDrone(sortedLocations, biggestDrone);
  printRoutes(generatedRoutes, drones, "output1.txt");
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
    //if haven't found space in any routes, add new route
    if (!hasFit) {
      generatedRoutes.push(new Route(drone, [location]));
    }
  }

  return generatedRoutes;
}

function printRoutes(routes, drones, outputFilePath) {
  let formattedDroneOutput = "";
  const routesByDrone = {};

  routes.forEach((route) => {
    routesByDrone[route.drone.name] = routesByDrone[route.drone.name] || [];
    routesByDrone[route.drone.name].push(route);
  });

  drones.forEach((drone) => {
    formattedDroneOutput = formattedDroneOutput + "[" + drone.name + "]\n";

    if (routesByDrone[drone.name.trim()])
      routesByDrone[drone.name.trim()].forEach((route, index) => {
        let tmpLocationsString = [];
        formattedDroneOutput += "Trip #" + (index + 1) + "\n";
        route.locations.forEach((routeLocation) => {
          tmpLocationsString.push("[" + routeLocation.name + "]");
        });
        formattedDroneOutput += tmpLocationsString.join(", ");
        formattedDroneOutput += "\n";
      });
  });

  //formattedDroneOutput = JSON.stringify(routesByDrone, null, 2);
  fs.writeFileSync(outputFilePath, formattedDroneOutput);
}

function readTextFile(path) {
  return fs
    .readFileSync(path, { encoding: "utf8", flag: "r" })
    .replace(new RegExp("[\\[\\]]", "g"), "") //regex to remove brackets
    .replace(new RegExp("[\r]", "g"), "") //remove carriage return
    .split("\n");
}

function parseTestData(data) {
  const drones = [];
  const locations = [];

  const droneData = data[0].split(",");
  //parses the first line containing drone data
  for (let i = 0; i < droneData.length; i++) {
    if (i % 2 == 1) {
      drones.push(
        new Drone(
          droneData[i - 1].trim(), //drone name
          parseInt(droneData[i].trim())
        ) //drone weight limit
      );
    }
  }

  //parses the rest of the data, containing drone information
  for (let i = 1; i < data.length; i++) {
    let locationInformation = data[i].split(",");
    locations.push(
      new Location(
        locationInformation[0].trim(), //location name
        parseInt(locationInformation[1].trim()) //location package weight
      )
    );
  }
  return { locations, drones };
}

function parseFileData(path) {
  return parseTestData(readTextFile(path));
}
