const Drone = require("./Drone");
const Location = require("./Location");

module.exports = class Route {
  constructor(drone, locations) {
    this.locations = [];

    this.drone = drone;
    this.currentWeight = 0;
    if (locations) {
      locations.forEach((location) => {
        this.addLocation(location);
      });
    }
  }

  canAddLocation(location) {
    return (
      location.packageWeight < this.drone.weightCapacity - this.currentWeight
    );
  }

  addLocation(location) {
    if (this.canAddLocation(location)) {
      this.locations.push(location);
      this.currentWeight += location.packageWeight;
      return true;
    }
    return false;
  }

  getRemainingCapacity() {
    return this.drone.weightCapacity - this.currentWeight;
  }
};
