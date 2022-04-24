//this represents a package to be delivered to a location, and thus
//has the properties of the above

module.exports = class Location{
    constructor(name, packageWeight){
        this.name = name;
        this.packageWeight = packageWeight;
    }
}