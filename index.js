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


const Drone = require('./Classes/Drone.js');
const Location = require('./Classes/Location.js');
const Route = require('./Classes/Route.js');
//mock data generator
var casual = require('casual');



let drones = [];
let locations = [];
let droneAmount = 0;
let packagesWithoutDrones = 0;


//as opposed to receiving an input file, the program generates random data every time it's run.
//I'm considering the requirement "The client should be able to run the project and have the results displayed" when making
//this specific decision.
//This is something I would check with a product owner or client before deciding for myself, of course.
generateTestData();

//generatest a list of routes and prints it
generateRoutes()
printRoutes();



function generateTestData(){
    droneAmount = casual.integer(10, 100);
                                    //tested with up to 10000 locations
    let locationAmount = casual.integer(200, 500);
    
    console.log('generating drone data for ', droneAmount, ' drones.');
    for (var i=0;  i <= droneAmount; i++){
        drones.push(
            new Drone(casual.username, casual.integer(300, 1000))
        );
    }
    console.log('generating location data for ',locationAmount, ' places.' );
    for (var j = 0; j<= locationAmount; j++){
        locations.push(
            new Location(casual.city, casual.integer(1, 700))
        );
    }
    
    //The FFD algorithm works as follows.
    //Order the items from largest to smallest.
    locations.sort((a, b) => {
        if ( a.packageWeight < b.packageWeight ){
            return 1;
        }
        if ( a.packageWeight > b.packageWeight ){
            return -1;
        }
        return 0;
    })

    //my addition, sorts the drones from highest to lowest capacity
    drones.sort((a, b) => {
        if ( a.weightCapacity < b.weightCapacity ){
            return 1;
        }
        if ( a.weightCapacity > b.weightCapacity ){
            return -1;
        }
        return 0;
    })
}

function generateRoutes(){

    locations.forEach((location) => {
        //ordered by largest, therefore the strongest drone we have
        if (location.weight > drones[0].weightCapacity){
            packagesWithoutDrones.push(location);
        } 
        else
        {
            let itFits = false;
            drones.every((drone)=>{
                drone.routes.every(route => {
                    if (location.packageWeight <= (drone.weightCapacity - route.currentWeight)){
                        route.currentWeight += location.packageWeight;
                        route.arrayOfLocations.push(location);
                        itFits = true;
                        return false;
                    }
                    //haven't yet found a fit in the routes list
                    return !itFits;
                })
                //haven't yet found a fit in the drones list
                return !itFits;
            })

            //haven't found a fit in ANY of them!
            if (!itFits){

                //if we are to refill any drone, we should refill the strongest drone only
                //since time to deliver is not relevant here.
                //as we know the package is not larger than the drone can carry, we can just push it as a first item.
                
                drones[0].routes.push(new Route([location], location.packageWeight));
            }
        }
    })
}

function printRoutes (){
    
    drones.forEach((drone) => {
        console.log('Drone name: ', drone.name)
        console.log('Drone capacity: ', drone.weightCapacity)
        drone.routes.forEach((route, index) => {
            let placesToPrint = []
            console.log('Trip #',index+1)
            console.log('Trip Weight:', route.currentWeight)
            route.arrayOfLocations.forEach((location) => {
                placesToPrint.push(location.name)
            })
            
            console.log(placesToPrint.join(", "))
            console.log('\n')
        })
    })
}