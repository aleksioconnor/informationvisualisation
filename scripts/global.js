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


const selectedDistricts = new Set([]);
var mainProvinces = ["Dara", "Damascus", "Aleppo", "Deir-ez-Zor", "Rural Damascus", "Homs", "Idleb", "Ar-Raqqa", "Hama"];
var otherProvinces = ["Tartous", "Al-Hasakeh", "Quneitra", "Lattakia", "As-Sweida", "Rif Dimashq"]
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