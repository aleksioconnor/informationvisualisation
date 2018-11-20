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

//calculate screen width

var windowHeight = $(window).height();
var windowWidth = $(window).width();
console.log(windowHeight);
console.log(windowWidth);
//----------------------------
// Color generator
//----------------------------

var color = d3
    .scaleQuantize()
    .domain([1, 10])
    .range(d3.schemeOranges[9]);
