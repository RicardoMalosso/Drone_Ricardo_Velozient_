const Route = require("./Route");

module.exports = class Drone{
    constructor(name, weightCapacity){
        this.name = name;
        this.weightCapacity = weightCapacity;
        this.routes = [new Route()];
    }
}