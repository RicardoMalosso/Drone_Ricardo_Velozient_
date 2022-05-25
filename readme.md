# Coding Challenge, Drone Delivery Service

## _by Ricardo Malosso_

This solution utilizes an adaptation of the [First-fit bin packing algorithm][fbp] to generate a list of routes for drones to deliver packages.

## Algorithm

The algorithm used in this solution first orders the packages and drones by weight and space from largest to smallest, then triest to fit the package in the first drone that it can. If it is unable to find any drones with remaining space, it then assigns a new trip to an avabilable drone, and schedules the package to be delivered then.

However since in our problem time to deliver and distance don't matter, and since fueling drones costs the same independent of the drone capcity and cargo size, it makes sense to only use the largest drone for delieveres. Thus, a large part of the problem is removed (variable bin-size) and distributing the packages amongst different trips for the largest drone is done using first-fit.

## Approach

At first I spent a lot of time trying to "translate" the problem at hand to a solved one, such as bin-packing problems, traveling salesman, and other such known optimization problems. Having found the apparent best fit, that being the ["Variable size bin packing problem"][vsbpp], I read up on it, and found that while that would work, a specific adaptation of the problem (given that time to deliver and distance are irrelevant) was easier to implement, maintain and understand.

After choosing the algorithm, I focused on writing readable, maintainable code keeping separation of concerns and single responsibility principle in mind.

## Technical Dependencies and Libraries

The project is implemented in node.js, using plain javascript. I wrote it in VS Code, and ran it in node v16.14.2.

The only external library used during development was [Casual][cas], a library used for generating mock data to facilitate stress-testing my algorithm with up to 10000 locations. The final version doesn't use the library.

## Installation

This project requires requires [Node.js](https://nodejs.org/) v16+ to run.

Install the dependencies and start the server.

```sh
cd Drone_Ricardo_Velozient
npm i
node index
```

[//]: # "These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax"
[fbp]: https://en.wikipedia.org/wiki/First-fit_bin_packing#:~:text=First%2Dfit%20(FF)%20is,is%20at%20most%20the%20capacity.
[vsbpp]: https://www.sciencedirect.com/science/article/abs/pii/S0305054806002747.
[cas]: https://www.npmjs.com/package/casual
