//----------------------------
// Global variables
//----------------------------
var currentDate = "2013-01";

var margin = {
    top: 20,
    right: 30,
    bottom: 20,
    left: 30
};


//calculate screen width
var sliderHeight = 70;
var windowHeight = $(window).height() - sliderHeight - margin.top - margin.bottom;
var windowWidth = $(window).width() - margin.left - margin.right;
//----------------------------
// Color generator
//----------------------------

var color = d3
    .scaleQuantize()
    .domain([1, 10])
    .range(d3.schemeOranges[9]);
