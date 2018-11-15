var focus; // hacky global var 
var margin = {
    top: 0,
    right: 50,
    bottom: 0,
    left: 50
};

// Initialize slider
function initSlider() {
    var formatDateIntoYear = d3.timeFormat("%b"); // set %Y to display year instead of months below slider
    var formatDate = d3.timeFormat("%b %Y"); // year and month

    var startDate = new Date("2013-01-01"),
        endDate = new Date("2017-12-01");


    var width = 700 - margin.left - margin.right,
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

var color = d3.scaleQuantize()
    .domain([1, 10])
    .range(d3.schemeBlues[9])

function europeMapInit() {
    var margin = {
        top: 0,
        right: 50,
        bottom: 0,
        left: 50
    };

    var w = 700 - margin.left - margin.right;
    var h = 600 - margin.top - margin.bottom;





    var projection = d3
        .geoMercator()
        .center([13, 52])
        .translate([w / 2, h / 2])
        .scale([w / 0.8]);

    var path = d3
        .geoPath()
        .projection(projection);

    var svg = d3
        .select("#map")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("style", "margin: 0 auto; display: block;  border: 3px solid black;");

    console.log('test');

    //Load in GeoJSON data
    d3.json("data/europe.json").then(function (json) {

        //Bind data and create one path per GeoJSON feature
        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke", "rgba(8, 81, 156, 0.4)")
            .attr("fill", "none")
        // .attr("class", function (d) {
        //     console.log('d', d.properties.name);
        //     return "country " + d.properties.name;
        // })

    });


    // d3.json("data/foodPrices.json").



    // var data = d3.json("data/refugees.json").then((data) => {

    //     const test = data.refugees[0];
    //     // console.log('data', test);

    //     // let t = new Map(test)
    //     // .map(d => [d.id, d.rate])); data.title = "Unemployment rate (%)";
    //     // console.log('t', t);
    //     return test
    // })



    // console.log('data', data);
    // .map(d => [d.id, d.rate]));
    // data.title = "Unemployment rate (%)";
    // return data;


    const x = d3.scaleLinear()
        .domain(d3.extent(color.domain()))
        .rangeRound([600, 860]);

    const g = svg.append("g")
        .attr("transform", "translate("+(-w+40)+","+(h-40)+")")
        // .attr("width", 100)
        // .attr("height", 100)


    // var svg = d3
    //     .select("#map")
    //     .append("svg")

    g.selectAll("rect")
        .data(color.range().map(d => color.invertExtent(d)))
        .enter().append("rect")
        .attr("height", 8)
        .attr("x", d => x(d[0]))
        .attr("width", d => x(d[1]) - x(d[0]))
        .attr("fill", d => color(d[0]));

    g.append("text")
        .attr("class", "caption")
        .attr("x", x.range()[0])
        .attr("y", -6)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("Refugees in europe");

    g.call(d3.axisBottom(x)
            .tickSize(13)
            .tickFormat(d3.format(""))
            .tickValues(color.range().slice(1).map(d => color.invertExtent(d)[0])))
        .select(".domain")
        .remove();

    // var eu = d3.json("data/europe.json")

    // console.log('data', data);
    // console.log(eu)

    // svg.append("g")
    //     .selectAll("path")
    //     .data(topojson.feature(eu, us.objects.counties).features)
    //     .enter().append("path")
    //     .attr("fill", d => color(data.get(d.id)))
    //     .attr("d", path)
    //     .append("title")
    //     .text(d => format(data.get(d.id)));

}

// Window onload
window.onload = function () {

    console.log("c1")
    initSlider();

    console.log("c2")
    europeMapInit();
    lineChartInit();
};