//----------------------------
// Linechart idiom
//----------------------------

var lineChart = null

// Initialize line chart
function lineChartInit() {

    // set the dimensions and margins of the graph
    var margin = {
        top: 20,
        right: 100,
        bottom: 60,
        left: 60
    };

    var size = {
        width: window.innerWidth || document.body.clientWidth,
        height: window.innerHeight || document.body.clientHeight
    }

    var width = size.width - margin.left - margin.right;
    var height = 300 - margin.top - margin.bottom;


    var startDate = new Date("2013-01-01"),
        endDate = new Date("2017-12-01");

    var currentSliderValue = 0,
        timer

    // parse the date / time
    var parseTime = d3
        .timeParse("%Y-%m");

    // set the ranges
    // var x = d3
    //     .scaleTime()
    //     .range([0, width]);
    var x = d3
        .scaleTime()
        .domain([startDate, endDate])
        .range([0, (width)])
        .clamp(true);

    var y = d3
        .scaleLinear()
        .range([height, 0]);










    // define the svg
    lineChart = d3
        .select("#linechart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("style", "margin: 0 auto; display: block;")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    // .attr("class", "track")
    // .attr("x1", x.range()[0])
    // .attr("x2", x.range()[1])
    // .select(function () {
    //     return this.parentNode.appendChild(this.cloneNode(true));
    // })
    // .attr("class", "track-inset")
    // .select(function () {
    //     return this.parentNode.appendChild(this.cloneNode(true));
    // })
    // .attr("class", "track-overlay")
    // .call(
    //     d3
    //     .drag()
    //     .on("start.interrupt", function () {
    //         lineChart.interrupt();
    //     })
    //     .on("start drag", function () {
    //         currentSliderValue = d3.event.x;
    //         console.log(currentSliderValue)
    //         // moveSlider(x.invert(d3.event.x));
    //     })
    // )




    // focus = lineChart.append("g") // define focus body
    //     .style("display", "none");

    //----------------------------
    // Load the values for each category
    //----------------------------

    var valueLines = {
        "Sugar (kg, SYP)": d3.line().x(function (d) {
                return x(parseTime(d.date));
            })
            .y(function (d) {

                return y(d["Sugar (kg, SYP)"])
            }),
        "Bread (SYP)": d3.line().x(function (d) {
                return x(parseTime(d.date));
            })
            .y(function (d) {

                return y(d["Bread (SYP)"])
            }),
        "Rice (kg, SYP)": d3.line().x(function (d) {
                return x(parseTime(d.date));
            })
            .y(function (d) {

                return y(d["Rice (kg, SYP)"])
            }),
        "Fuel (diesel, liter, SYP)": d3.line().x(function (d) {
                return x(parseTime(d.date));
            })
            .y(function (d) {

                return y(d["Fuel (diesel, liter, SYP)"])
            }),
    }

    //----------------------------
    // Decide what clicking the buttons does
    //----------------------------

    // change button colors onClick
    jQuery('#bread').click(function () {
        $(this).toggleClass('bread');
    });

    jQuery('#sugar').click(function () {
        $(this).toggleClass('sugar');
    });

    jQuery('#rice').click(function () {
        $(this).toggleClass('rice');
    });

    jQuery('#fuel').click(function () {
        $(this).toggleClass('fuel');
    });

    var bBread = Boolean(false);
    var bSugar = Boolean(false);
    var bRice = Boolean(false);
    var bFuel = Boolean(false);

    d3.selectAll("#bread")
        .on("click", function () {

            bBread = !bBread;
            updateLineChart()

        });

    d3.selectAll("#sugar")
        .on("click", function () {

            bSugar = !bSugar;
            updateLineChart()

        });

    d3.selectAll("#rice")
        .on("click", function () {

            bRice = !bRice;
            updateLineChart()

        });

    d3.selectAll("#fuel")
        .on("click", function () {

            bFuel = !bFuel;
            updateLineChart()

        });


    //----------------------------
    // Draw linechart
    //----------------------------

    updateLineChart = function () {

        // Load the data
        d3.json("data/foodPrices2.json").then(function (data) {

            const foodPricesBig = Object.values(data)
            const currentDateIndex = foodPricesBig.findIndex(item => item.date === currentDate)
            // const foodPrices = foodPricesBig.slice(0, currentDateIndex)
            const foodPrices = foodPricesBig

            x.domain(d3.extent(Object.keys(data), function (d) {
                return parseTime(d);
            }));
            y.domain([0, 600])

            //----------------------------
            // Refresh view
            //----------------------------

            lineChart
                .selectAll('text')
                .remove()

            lineChart
                .selectAll("path")
                .remove()

            lineChart
                .selectAll('g')
                .remove()

            //----------------------------
            // Draw lines
            //----------------------------

            if (bBread == true) {
                var sBread = "Bread (SYP)"
                var color = "#DB4437"
                var line = lineChart.append("path")
                    .data([foodPrices])
                    .attr("class", "line")
                    .style("stroke", color)
                    .attr("d", valueLines[sBread])


                makeInteractive(foodPrices, color, null)

            }

            if (bSugar == true) {
                var sSugar = "Sugar (kg, SYP)"
                var color = "#4285F4"
                var line = lineChart.append("path")
                    .data([foodPrices])
                    .attr("class", "line")
                    .style("stroke", color)
                    .attr("d", valueLines[sSugar])
                // .on("click", function (d) {
                //     console.log("test5", d)
                // })

                // makeInteractive(foodPrices, color)

            }

            if (bRice == true) {
                var sRice = "Rice (kg, SYP)"
                var color = "#F4B400"
                var line = lineChart.append("path")
                    .data([foodPrices])
                    .attr("class", "line")
                    .style("stroke", color)
                    .attr("d", valueLines[sRice]);

                // makeInteractive(foodPrices, color)

            }

            if (bFuel == true) {
                var sFuel = "Fuel (diesel, liter, SYP)"
                var color = "#0F9D58"
                var line = lineChart.append("path")
                    .data([foodPrices])
                    .attr("class", "line")
                    .style("stroke", color)
                    .attr("d", valueLines[sFuel]);

                // makeInteractive(foodPrices, color)

            }

            //----------------------------
            // Draw x-axis, y-axes, and grid
            //----------------------------

            xAxis = lineChart.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            yAxis = lineChart.append("g")
                .attr("id", "yaxis")
                .call(d3.axisLeft(y));

            // grid = lineChart.append('g')
            //     .attr('class', 'grid')
            //     .call(d3.axisLeft()
            //         .scale(y)
            //         .tickSize(-width, 0, 0)
            //         .tickFormat(''))

            //----------------------------
            // Draw labels
            //----------------------------

            // y-axis label
            lineChart.append('text')
                .attr('class', 'label')
                .attr('x', -height / 2)
                .attr('y', -45)
                .attr('transform', 'rotate(-90)')
                .attr('text-anchor', 'middle')
                .text('Value')

            // x-axis label
            lineChart.append('text')
                .attr('class', 'label')
                .attr('x', 500)
                .attr('y', 480)
                .attr('text-anchor', 'middle')
                .text("Date")


            // lineChart
            //     .on("mousemove", function (d) {
            //         console.log(d)
            //     })
        });
    }

    //----------------------------
    // Define interactivity
    //----------------------------

    makeInteractive = function (foodPrices, color, h) {

        console.log("in make interactive", h)

        d3.select(".mouse-line")
            .attr("d", function () {

                // if (h)
                //     console.log(h)


                // var d = "M" + mouse[0] + "," + height;
                // d += " " + mouse[0] + "," + 0;

                // console.log("?", d, mouse[0], x.invert(mouse[0]), x(x.invert(mouse[0])))
                console.log("invoke", h)

                var d = "M" + x(h) + "," + height;
                d += " " + x(h) + "," + 0;

                return d;
            });



        var mouseG = lineChart
            // .enter()
            .append("g")
        // .attr("class", "mouse-over-effects");

        // trying to append a line on click
        mouseG
            // .attr("d", )
            .on("click", function (d) {
                console.log("test", d3.event.x, x.invert(d3.event.x))
                currentDate = x.invert(d3.event.x)
                console.log("->", currentDate)
                moveSlider(currentDate)
                // lineChart
                //     .data([foodPrices])
                //     .enter()
                //     .append("g")
                //     .attr("class", "path")
                //     .style("stroke", "black")
                //     .style("stroke-width", "1px")
                //     .attr("x", function (d) {
                //         console.log("test2", d)
                //         return parseTime(d.date)
                //     })

            })

        mouseG.append("path") // this is the black vertical line to follow mouse
            .attr("class", "mouse-line")
            .style("stroke", "black")
            .style("stroke-width", "1px")
            .style("opacity", "0");

        var lines = document.getElementsByClassName('line');

        var mousePerLine = mouseG.selectAll('.mouse-per-line')
            .data([foodPrices])
            .enter()
            .append("g")
            .attr("class", "mouse-per-line");

        mousePerLine
            .append("circle")
            .attr("r", 7)
            .style("stroke", color)
            .style("fill", "none")
            .style("stroke-width", "1px")
            .style("opacity", "1");

        mousePerLine
            .append("text")
            .attr('class', 'label')
            .attr("transform", "translate(10,3)");

        mouseG
            .append('svg:rect') // append a rect to catch mouse movements on canvas
            .attr('width', width) // can't catch mouse events on a g element
            .attr('height', height)
            .attr('fill', 'none')
            .attr('pointer-events', 'all')
            // .on('mouseout', function () { // on mouse out hide line, circles and text
            //     d3.select(".mouse-line")
            //         .style("opacity", "0");
            //     d3.selectAll(".mouse-per-line circle")
            //         .style("opacity", "0");
            //     d3.selectAll(".mouse-per-line text")
            //         .style("opacity", "0");
            // })

            .on('mouseover', function () { // on mouse in show line, circles and text
                d3.select(".mouse-line")
                    .style("opacity", "1");
                d3.selectAll(".mouse-per-line circle")
                    .style("opacity", "1");
                d3.selectAll(".mouse-per-line text")
                    .style("opacity", "1");
            })

            .on('mousemove', function () { // mouse moving over canvas
                var mouse = d3.mouse(this);

                d3.select(".mouse-line")
                    .attr("d", function () {

                        // if (h)
                        //     console.log(h)


                        var d = "M" + mouse[0] + "," + height;
                        d += " " + mouse[0] + "," + 0;

                        // console.log("?", d, mouse[0], x.invert(mouse[0]), x(x.invert(mouse[0])))
                        console.log(d)

                        return d;
                    });

                // d3.selectAll(".mouse-per-line")
                //     .attr("transform", function (d, i) {
                //         //console.log(width/mouse[0])
                //         var xDate = x.invert(mouse[0]),
                //             bisect = d3.bisector(function (d) {
                //                 return d.date;
                //             }).right;
                //         idx = bisect(d.values, xDate);

                //         var beginning = 0,
                //             end = lines[i].getTotalLength(),
                //             target = null;

                //         while (true) {
                //             target = Math.floor((beginning + end) / 2);
                //             pos = lines[i].getPointAtLength(target);

                //             if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                //                 break;
                //             }

                //             if (pos.x > mouse[0]) end = target;

                //             else if (pos.x < mouse[0]) beginning = target;

                //             else break; //position found
                //         }

                //         d3.select(this).select('text')
                //             .text(y.invert(pos.y).toFixed(2));

                //         return "translate(" + mouse[0] + "," + pos.y + ")";

                //     });

            })

    }

    updateLineChart()

}