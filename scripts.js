//----------------------------
// Global variables
//----------------------------

var focus; // hacky global var
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

//----------------------------
// Map component
//----------------------------

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

    var path = d3.geoPath().projection(projection);

    var svg = d3
        .select("#map")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("style", "margin: 0 auto; display: block;  border: 3px solid black;");


    //----------------------------
    // Data and color scale
    //----------------------------

    var data = d3.map();
    var colorScheme = d3.schemeReds[6];
    colorScheme.unshift("#eee");
    var colorScale = d3
        .scaleThreshold()
        .domain([1, 1000, 5000, 10000, 20000, 100000])
        .range(colorScheme);

    //----------------------------
    // Draw map
    //----------------------------

    rerenderMap = function () {
        d3.json("data/refugees3.json").then(data => {
            d3.json("data/europe.json").then(function (json) {

                var mapSVG = svg
                    .attr("class", "countries")
                    .selectAll("path")

                // todo: fix condition
                if (currentDate !== "2013-01") {
                    mapSVG
                        .attr("fill", function (d) {
                            return colorScale(data[currentDate][d.properties.name] || 0);
                        })
                } else {
                    // First draw map and fill it with colour
                    mapSVG
                        .data(json.features)
                        .enter()
                        .append("path")
                        .attr("fill", function (d) {
                            return colorScale(data[currentDate][d.properties.name] || 0);
                        })
                        .attr("d", path)
                        .attr("stroke", "rgba(8, 81, 156, 0.4)");
                }

            });
        });
    }

    rerenderMap()

    //----------------------------
    // Draw scale
    //----------------------------

    const x = d3
        .scaleLinear()
        .domain(d3.extent(color.domain()))
        .rangeRound([600, 860]);

    const g = svg
        .append("g")
        .attr("transform", "translate(" + (-w + 40) + "," + (h - 40) + ")");

    g.selectAll("rect")
        .data(color.range().map(d => color.invertExtent(d)))
        .enter()
        .append("rect")
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

    g.call(
            d3
            .axisBottom(x)
            .tickSize(13)
            .tickFormat(d3.format(""))
            .tickValues(
                color
                .range()
                .slice(1)
                .map(d => color.invertExtent(d)[0])
            )
        )
        .select(".domain")
        .remove();
}

// Initialize slider
function initSlider() {
    var formatDateIntoYear = d3.timeFormat("%b"); // set %Y to display year instead of months below slider
    var formatDate = d3.timeFormat("%b %Y"); // year and month
    var commonDateFormat = d3.timeFormat("%Y-%m");

    var startDate = new Date("2013-01-01"),
        endDate = new Date("2017-12-01");

    var width = 700 - margin.left - margin.right,
        height = 100 - margin.top - margin.bottom;

    var svg = d3
        .select("#slider")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height)
        .attr("style", "margin: 0 auto; display: block"); // could be included in stylesheet, centering slider

    var x = d3
        .scaleTime()
        .domain([startDate, endDate])
        .range([0, width])
        .clamp(true);

    var slider = svg
        .append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + margin.left + "," + height / 2 + ")");

    slider
        .append("line")
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
        .call(
            d3
            .drag()
            .on("start.interrupt", function () {
                slider.interrupt();
            })
            .on("start drag", function () {
                moveSlider(x.invert(d3.event.x));
            })
        );

    slider
        .insert("g", ".track-overlay")
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

    var label = slider
        .append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .text(formatDate(startDate))
        .attr("transform", "translate(0," + -25 + ")");

    var handle = slider
        .insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9);

    // What happens when you move the slider should be defined in here
    function moveSlider(h) {
        handle.attr("cx", x(h));

        var newDate = commonDateFormat(h);

        if (newDate !== currentDate) {
            currentDate = newDate;
            rerenderMap()
        }

        label.attr("x", x(h)).text(formatDate(h));
    }
}

// Initialize line chart
function lineChartInit() {
    // hacky fix
    var mapping = {
        "sugar": "Sugar (kg, SYP)",
        "bread": "Bread (SYP)",
        "fuel": "Fuel (diesel, liter, SYP)",
        "rice": "Rice (kg, SYP)",
        "tea": "Tea (kg, SYP)"
    }
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

    var valuelines = {
        "sugar": d3.line().x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d["Sugar (kg, SYP)"])
            }),
        "bread": d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d["Bread (SYP)"]);
            }),
        "fuel": d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d["Fuel (diesel, liter, SYP)"]);
            }),
        "rice": d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d["Rice (kg, SYP)"]);
            }),
        "tea": d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d["Tea (kg, SYP)"]);
            })
    }
    // define the line
    // var valueline = d3.line()
    //     .x(function (d) {
    //         return x(d.date);
    //     })
    //     .y(function (d) {
    //         return y(d["Sugar (kg, SYP)"]);
    //     });

    // var valueline2 = d3.line()
    //     .x(function (d) {
    //         return x(d.date);
    //     })
    //     .y(function (d) {
    //         return y(d["Bread (SYP)"]);
    //     });

    // var valueline3 = d3.line()
    //     .x(function (d) {
    //         return x(d.date);
    //     })
    //     .y(function (d) {
    //         return y(d["Fuel (diesel, liter, SYP)"]);
    //     });


    // var valueline4 = d3.line()
    //     .x(function (d) {
    //         return x(d.date);
    //     })
    //     .y(function (d) {
    //         return y(d["Rice (kg, SYP)"]);
    //     });

    // var valueline5 = d3.line()
    //     .x(function (d) {
    //         return x(d.date);
    //     })
    //     .y(function (d) {
    //         return y(d["Tea (kg, SYP)"]);
    //     });
    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin

    var svg = d3.select("#linechart").append("svg")
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
            d["Bread (SYP)"] = +d["Bread (SYP)"];
            d["Fuel (diesel, liter, SYP)"] = +d["Fuel (diesel, liter, SYP)"];
            d["Rice (kg, SYP)"] = +d["Rice (kg, SYP)"];
            d["Tea (kg, SYP)"] = +d["Tea (kg, SYP)"];
        });
        x.domain(d3.extent(data.foodPrices, function (d) {
            return d.date;
        }));
        y.domain([0, d3.max(data.foodPrices, function (d) {
            return Math.max(d["Sugar (kg, SYP)"]);
        })])

        // Load the intersection circle thing
        // focus.append("circle")
        //     .attr("class", "y")
        //     .style("fill", "none")
        //     .style("stroke", "blue")
        //     .attr("r", 4)

        var previouslySelected = "sugar";

        // svg.append("path")
        //     .data([data.foodPrices])
        //     .attr("class", "line")
        //     .attr("id", "sugar")
        //     .attr("d", valueline)

        svg.append("path")
            .data([data.foodPrices])
            .attr("class", "line")
            .attr("id", "sugar")
            .attr("d", valuelines.sugar);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        var yAxis = svg.append("g")
            .attr("id", "yaxis")
            .call(d3.axisLeft(y));

        var dropdown = d3.select("#line-chart-dropdown")
            .attr("class", "test")
            .on("change", function (d) {
                var selected = d3.select("#line-chart-dropdown").node().value;
                d3.select("path#" + previouslySelected).remove();

                previouslySelected = selected;
                y.domain([0, d3.max(data.foodPrices, function (d) {
                    return Math.max(d[mapping[selected]]);
                })])
                d3.select("#yaxis")
                    .call(d3.axisLeft(y));

                svg.append("path")
                    .data([data.foodPrices])
                    .attr("class", "line")
                    .attr("id", selected)
                    .attr("d", valuelines[selected]);

                // d3.select("path#" + selected)
                //     .classed("hidden", false)
                //     .attr("class", "line")
            });

    });
}

function barChart_init() {
    var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    };

    var padding = 30;

    w = 960 - margin.left - margin.right,
        h = 500 - margin.top - margin.bottom;

    // parse the date / time
    var parseTime = d3.timeParse("%Y-%m");

    // value is based on the tab navigator
    var barChartType = "Province"

    // Files we will need:
    // allDeathsProvince, allDeathsGender, allDeathsCause, allDeathsActor, allDeathsCivilian

    const templateJSON = {
        "2013-01": [
            {
                // "province" is example, script should take an argument called barChartType with string 
                // that we will use
                // i.e. "gender", "Province", "civilian status"
                province: "Damascus",
                quantity: 123
            },
            {
                province: "ABCD",
                quantity: 1111
            }
        ],

        "2016-07": [
            {
                province: "Damascus",
                quantity: 11
            },
            {
                province: "ABCD",
                quantity: 156
            }
        ], 

    }


    // Load the data
    // resuklt string - data/allDeathsCity.json
    d3.json(`data/allDeaths${barChartType}.json`).then(function (data) {
       
        console.log(data[0].provinceDeathcount)

        const dataForGivenMonth = data[currentDate]



        // --------------------
        // --------------------

        data.forEach(function (d) {
            d.date = parseTime(d.date);

        })
        var tempdata = []
        for (var property in data[0].provinceDeathcount) {
            var obj = {
                [barChartType]: property,
                "quantity": data[0].provinceDeathcount[property]
            }
            tempdata.push(obj)
        }
        console.log(tempdata)


        // var svg = d3.select("#bar_chart")
        //     .append("svg")
        //     .attr("width", w + margin.left + margin.right)
        //     .attr("height", h + margin.top + margin.bottom)
        //     .attr("transform",
        //         "translate(" + margin.left + "," + margin.top + ")");

        var svg = d3.select("body").append("svg")
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var xScale = d3.scaleBand().rangeRound([0, w]).padding(0.03);

        var yScale = d3.scaleLinear()
            .range([h, 0]);

        var xAxis = d3.axisBottom(xScale);


        var yAxis = d3.axisLeft(yScale);

        xScale.domain(tempdata.map(function (d) {
            return d.province;
        }));
        yScale.domain([0, d3.max(tempdata, function (d) {
            return d.quantity;
        })]);

        svg.append("g")
            .attr('transform', 'translate(0,' + h + ')')
            .call(xAxis);

        var yAxis_g = svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6).attr("dy", ".71em")
        //.style("text-anchor", "end").text("Number of Applicatons"); 

        svg.selectAll(".bar")
            .data(tempdata)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                return xScale(d.province);
            })
            .attr("width", xScale.bandwidth())
            .attr("y", function (d) {
                return yScale(d.quantity);
            })
            .attr("height", function (d) {
                return h - yScale(d.quantity);
            });

        //svg.selectAll("rect")
        //  .data(tempdata)
        //.enter().append("rect")
        //.attr("fill", "darkblue")
        //.attr("y", (tempdata) => yScale(tempdata.quantity))
        //.attr("x", (tempdata) => xScale(tempdata.province))
        //.attr("width", xScale.bandwidth())
        //.attr("height", (tempdata) => h - yScale(tempdata.quantity));
    });


}



// Window onload
window.onload = function () {
    initSlider();
    europeMapInit();
    lineChartInit();
    barChart_init();
};