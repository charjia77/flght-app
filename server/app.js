// Requiring express in our server
const express = require("express");
const app = express();

// Example flight data. We get these from Database in real world.
const flights = [
  {
    source: "SYD",
    destination: "BNE",
    price: 220,
  },
  {
    source: "BNE",
    destination: "DAR",
    price: 315,
  },
  {
    source: "BNE",
    destination: "MEL",
    price: 320,
  },
  {
    source: "MEL",
    destination: "SYD",
    price: 115,
  },
  {
    source: "SYD",
    destination: "PER",
    price: 217,
  },
  {
    source: "DAR",
    destination: "PER",
    price: 150,
  },
  {
    source: "PER",
    destination: "ALC",
    price: 58,
  },
  {
    source: "ALC",
    destination: "SYD",
    price: 986,
  },
  {
    source: "ALC",
    destination: "MEL",
    price: 228,
  },
];

// Find all paths from a source todestination.
let v;

let adjList;

let allPaths = [];

// A directed graph using
// adjacency list representation
function Graph(vertices) {
  // initialise vertex count
  v = vertices;

  // initialise adjacency list
  initAdjList();
}

// utility method to initialise
// adjacency list
function initAdjList() {
  adjList = new Array(v);

  for (let i = 0; i < v; i++) {
    adjList[i] = [];
  }
}

// add edge from u to v
function addEdge(u, v) {
  // Add v to u's list.
  adjList[u].push(v);
}

// Prints all paths from
// 's' to 'd'
function printAllPaths(s, d) {
  let isVisited = new Array(v);
  for (let i = 0; i < v; i++) isVisited[i] = false;
  let pathList = [];

  // add source to path[]
  pathList.push(s);

  // Call recursive utility
  printAllPathsUtil(s, d, isVisited, pathList);
}

// A recursive function to print
// all paths from 'u' to 'd'.
// isVisited[] keeps track of
// vertices in current path.
// localPathList<> stores actual
// vertices in the current path
function printAllPathsUtil(u, d, isVisited, localPathList) {
  if (u == d) {
    allPaths.push(localPathList.slice());

    // if match found then no need to
    // traverse more till depth
    return;
  }

  // Mark the current node
  isVisited[u] = true;

  // Recur for all the vertices
  // adjacent to current vertex
  for (let i = 0; i < adjList[u].length; i++) {
    if (!isVisited[adjList[u][i]]) {
      // store current node
      // in path[]
      localPathList.push(adjList[u][i]);
      printAllPathsUtil(adjList[u][i], d, isVisited, localPathList);

      // remove current node
      // in path[]
      localPathList.splice(localPathList.indexOf(adjList[u][i]), 1);
    }
  }

  // Mark the current node
  isVisited[u] = false;
}

// Driver program
// Create a flight map graph
// TODO: Create this map from flights data
const cities = ["SYD", "BNE", "DAR", "MEL", "PER", "ALC"];

Graph(6);
addEdge(0, 1); // SYD -> BNE
addEdge(1, 2); // BNE -> DAR
addEdge(1, 3); // BNE -> MEL
addEdge(3, 0); // MEL -> SYD
addEdge(0, 4); // SYD -> PER
addEdge(2, 4); // DAR -> PER
addEdge(4, 5); // PER -> ALC
addEdge(5, 0); // ALC -> SYD
addEdge(5, 3); // ALC -> SYD

// Defining get request at '/flights' route
app.get("/flights", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.send(JSON.stringify(flights));
});

// Get all available flight plans under the conditions in request
app.get("/flights/:sourceCity/:destinationCity/:maxStops", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  let cheapestPlan = [];
  // const allPaths = printAllPaths(cities.indexOf(req.params.sourceCity), cities.indexOf(req.params.destinationCity));
  printAllPaths(5, 0);
  const pathsUnderMaxStops = allPaths.filter(
    (item) => item.length <= req.params.maxStops + 2
  );
  allPaths = [];
  let cheapestPrice = 99999999;
  pathsUnderMaxStops.forEach((item) => {
    let tmpTotalPrice = 0;
    let tmpFlightList = [];
    for (let i = 0; i < item.length - 1; i++) {
      const tmpFlight = flights.find(
        (flight) =>
          flight.source === cities[item[i]] &&
          flight.destination === cities[item[i + 1]]
      );
      tmpTotalPrice = tmpTotalPrice + tmpFlight.price;
      tmpFlightList.push(tmpFlight);
    }
    if (tmpTotalPrice < cheapestPrice) {
      cheapestPlan = tmpFlightList.slice();
      cheapestPrice = tmpTotalPrice;
    }
  });
  res.send(JSON.stringify(cheapestPlan));
});

// Setting the server to listen at port 8080
app.listen(8080, function (req, res) {
  console.log("Server is running at port 8080");
});
