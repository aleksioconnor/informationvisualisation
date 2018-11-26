//----------------------------
// Global variables
//----------------------------
var currentDate = "2013-01";

var margin = {
    top: 20,
    right: 30,
    bottom: 0,
    left: 30
};

//calculate screen width

var windowHeight = $(window).height();
var windowWidth = $(window).width();
//----------------------------
// Color generator
//----------------------------

var color = d3
    .scaleQuantize()
    .domain([1, 10])
    .range(d3.schemeOranges[9]);
