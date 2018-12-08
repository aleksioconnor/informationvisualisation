//----------------------------
// Global variables
//----------------------------
var currentDate = "2013-01";
var newDate = '2013-01'

// slider margin
var margin = {
    top: 20,
    right: 30,
    bottom: 20,
    left: 40
};

var highlighted = {
    type: '',
    value: ''
};


const selectedDistricts = new Set([]);
var mainProvinces = ["Dara", "Damascus", "Aleppo", "Deir-ez-Zor", "Rural Damascus", "Homs", "Idleb", "Ar-Raqqa", "Hama"];
var otherProvinces = ["Tartous", "Al-Hasakeh", "Quneitra", "Lattakia", "As-Sweida", "Rif Dimashq"]
var allProvinces = [...mainProvinces, "Other"]
var otherSelected = false;


//calculate screen width
var sliderHeight = 60;
var windowHeight = $(window).height() - sliderHeight - margin.top - margin.bottom;
var windowWidth = $(window).width() - margin.left - margin.right;
//----------------------------
// Color generator
//----------------------------

var color = d3
    .scaleQuantize()
    .domain([1, 10])
    .range(d3.schemeOranges[9]);

// COLOR SCHEME
var light = "#bfbfbf", // (191,191,191)
    semiLigth = "#838383", //(131,131,131)
    dark = "#1a1a1a", // (26,26,26)
    blood = "#4d1414", //(77,20,20)
    red = "#b40d0d" // (180,13,13)


var colorScheme = d3.schemeReds[9];
const test = d3.interpolateReds(1);

// colorScheme.unshift("#eee");
var colorScale = d3
    .scaleThreshold()
    // .domain([1, 10, 50, 100, 200, 500])
    .domain([1, 50, 100, 300, 500, 800, 1000, 1200, 1400])
    .range(colorScheme);


var moveSlider = null;
var makeInteractive = null;
// console.log(test, colorScheme, colorScale)