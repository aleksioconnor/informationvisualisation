//----------------------------
// Global variables
//----------------------------
var currentDate = "2013-01";

var margin = {
    top: 0,
    right: 50,
    bottom: 0,
    left: 50
};

//----------------------------
// Color generator
//----------------------------

var color = d3
    .scaleQuantize()
    .domain([1, 10])
    .range(d3.schemeOranges[9]);
