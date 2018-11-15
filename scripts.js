var focus; // hacky global var 

// Initialize slider
function initSlider() {
    var formatDateIntoYear = d3.timeFormat("%b"); // set %Y to display year instead of months below slider
    var formatDate = d3.timeFormat("%b %Y"); // year and month

    var startDate = new Date("2013-01-01"),
        endDate = new Date("2017-12-01");

    var margin = {
            top: 0,
            right: 50,
            bottom: 0,
            left: 50
        },
        width = 960 - margin.left - margin.right,
        height = 100 - margin.top - margin.bottom;

    var svg = d3.select("#slider")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height)
        .attr("style", "margin: 0 auto; display: block"); // could be included in stylesheet, centering slider

    var x = d3.scaleTime()
        .domain([startDate, endDate])
        .range([0, width])
        .clamp(true);

    var slider = svg.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + margin.left + "," + height / 2 + ")");

    slider.append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
        .select(function () {
            return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "track-inset")
        .select(function () {
            return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "track-overlay")
        .call(d3.drag()
            .on("start.interrupt", function () {
                slider.interrupt();
            })
            .on("start drag", function () {
                moveSlider(x.invert(d3.event.x));
            }));

    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
        .selectAll("text")
        .data(x.ticks(10))
        .enter()
        .append("text")
        .attr("x", x)
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .text(function (d) {
            return formatDateIntoYear(d);
        });

    var label = slider.append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .text(formatDate(startDate))
        .attr("transform", "translate(0," + (-25) + ")")

    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9);

    // What happens when you move the slider should be defined in here
    function moveSlider(h) {
        handle.attr("cx", x(h));
        label
            .attr("x", x(h))
            .text(formatDate(h));
    }
}

// Initialize line chart


function lineChartInit() {
    // set the dimensions and margins of the graph
    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // parse the date / time
    var parseTime = d3.timeParse("%Y-%m");

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the line
    var valueline = d3.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d["Sugar (kg, SYP)"]); // need this format to acces json key with spaces
        });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    focus = svg.append("g") // define focus boy
        .style("display", "none");

    // Load the data 
    d3.json("data/foodPrices.json").then(function (data) {
        data.foodPrices.forEach(function (d) {
            d.date = parseTime(d.date);
            d["Sugar (kg, SYP)"] = +d["Sugar (kg, SYP)"];
        })
        x.domain(d3.extent(data.foodPrices, function (d) {
            return d.date;
        }));
        y.domain([0, d3.max(data.foodPrices, function (d) {
            return Math.max(d["Sugar (kg, SYP)"]);
        })])

        // Load the intersection circle thing
        focus.append("circle")
            .attr("class", "y")
            .style("fill", "none")
            .style("stroke", "blue")
            .attr("r", 4)

        svg.append("path")
            .data([data.foodPrices])
            .attr("class", "line")
            .attr("d", valueline)

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));
    })
}

function europeMapInit() {
    var w = 800;
    var h = 600;

    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    console.log('test');

    var projection = d3
        .geoMercator()
        .center([13, 52])
        .translate([w / 2, h / 2])
        .scale([w / 1.5]);

    var path = d3
        .geoPath()
        .projection(projection);

    var svg = d3
        .select("#map")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    //Load in GeoJSON data
    d3.json("data/europe.json").then(function (json) {

        //Bind data and create one path per GeoJSON feature
        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke", "rgba(8, 81, 156, 0.2)")
            // .attr("stroke", "rgba(255, 255, 255, 1)")
            // .attr("fill", "rgba(8, 81, 156, 0.6)");
            // .attr("fill", "rgba(255, 255, 255, 1)")
            .attr("fill", "none")


    });
}

function barChart_init() {
    var w = 800;
    var h = 600;

    var svg = d3.select("#the_chart")
                .append("svg")
                .attr("width",w)
                .attr("height",h);

    // Load the data
    d3.json("allDeaths.json").then(function (data) {
        deathsDataset = data;
    });

    // parse the date / time
    var parseTime = d3.timeParse("%Y-%m");
    deathsDataset.Date = parseTime(deathsDataset.Date);

    var padding = 30;
    var bar_w = 15;

    var hscale = d3.scaleLinear()
                         .domain([10,0])
                         .range([padding,h-padding]);

    var xscale = d3.scaleLinear()
                         .domain([0,deathsDataset.length])
                         .range([padding,w-padding]);


    var yaxis = d3.axisLeft()
                  .scale(hscale);

    var xaxis = d3.axisBottom()
              .scale(d3.scaleLinear()
              .domain([deathsDataset[0].deathsDataset.Date,deathsDataset[deathsDataset.length-1].deathsDataset.Date])
              .range([padding+bar_w/2,w-padding-bar_w/2]))
              .tickFormat(d3.format("d"))
              .ticks(deathsDataset.length/4);

    svg.append("g")
   	.attr("transform","translate(30,0)")
	.attr("class","y axis")
	.call(yaxis);

    svg.append("g")
   	.attr("transform","translate(0," + (h-padding) + ")")
  .call(xaxis);
  
    svg.selectAll("rect")
    .data(deathsDataset)
    .enter().append("rect")
    .attr("width",Math.floor((w-padding*2)/dataset.length)-1)
    .attr("height",function(d) {
                          return h-padding-hscale(deathsDataset.totalDeathcount);
                   })
     .attr("fill","purple")
     .attr("x",function(d, i) {
                          return xscale(i);
                   })
     .attr("y",function(d) {
                   return hscale(deathsDataset.totalDeathcount);
                   });

}

// Window onload
window.onload = function () {

    console.log("c1")
    initSlider();

    console.log("c2")
    europeMapInit();
    lineChartInit();
    barChart_init();
};