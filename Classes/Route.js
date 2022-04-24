const Drone = require("./Drone");
const Location = require("./Location");

module.exports = class Route {
    constructor(arrayOfLocations, currentWeight){
        this.arrayOfLocations = arrayOfLocations || [];
        this.currentWeight = currentWeight || 0;
    }
}