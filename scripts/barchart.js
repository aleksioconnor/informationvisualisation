//----------------------------
// Barchart idiom
//----------------------------

var previousHeight = {};

function barChartInit() {

    // set the dimensions and margins of the chart
    var margin = {
            top: 20,
            right: 60,
            bottom: 60,
            left: 75
        },

        width = 660 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var sortBarChart = true;

    // define the scales and axes
    var xScale = d3
        .scaleBand()
        .rangeRound([0, width])
        .padding(0.03);

    var yScale = d3
        .scaleLinear()
        .range([height, 0]);

    var xAxis = d3
        .axisBottom(xScale);

    var yAxis = d3
        .axisLeft(yScale);

    // define the SVG
    var barChartSVG = d3
        .select("#bar_chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("style", "margin: 0 auto; display: block; ")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //----------------------------
    // Decide what clicking the buttons does
    //----------------------------

    //change button colors onClick
    $('#province-button').click(function () {
        if (!$(this).hasClass('barsblue')) {
            $(this).toggleClass('barsblue')
        }
        $('#actor').removeClass("barsblue")
        $('#cause').removeClass("barsblue")
    });


    $('#actor').click(function () {
        if (!$(this).hasClass('barsblue')) {
            $(this).toggleClass('barsblue')
        }
        $('#province-button').removeClass("barsblue")
        $('#cause').removeClass("barsblue")
    });

    $('#cause').click(function () {
        if (!$(this).hasClass('barsblue')) {
            $(this).toggleClass('barsblue')
        }
        $('#actor').removeClass("barsblue")
        $('#province-button').removeClass("barsblue")
    });

    $('#sort').click(function () {
        sortBarChart = document.getElementById("sort").className !== "button barsblue";

        $(this).toggleClass('barsblue')

        sortBarChart ?
            document.getElementById("sort").textContent = "Sorted" :
            document.getElementById("sort").textContent = "Sort";

        updateBarchart()
    });


    d3.selectAll("#province-button")
        .on("click", function () {
            barChartType = "province"
            updateBarchart()
        });

    d3.selectAll("#actor")
        .on("click", function () {
            barChartType = "actor"
            updateBarchart()
        });

    d3.selectAll("#cause")
        .on("click", function () {
            barChartType = "cause"
            updateBarchart()
        });

    //----------------------------
    // Draw barchart
    //----------------------------

    updateBarchart = function () {

        d3.json(`data/${barChartType}.json`).then(function (data) {

            var dataCurrentDate = data[currentDate]

            dataCurrentDate.sort((a, b) =>
                sortBarChart ?
                b.quantity - a.quantity :
                a.province.localeCompare(b.province)
            )



            //----------------------------
            // Define x and y-scale
            //----------------------------

            yScale.domain([0, d3.max(dataCurrentDate, function (d) {
                return d.quantity + 350;
            })]);
            //yScale.domain([0, 1500])

            xScale
                .domain(
                    dataCurrentDate
                    .filter(d => {
                        return selectedDistricts.has(d.province) || selectedActors.has(d.actor) || selectedCause.has(d.cause)
                    })
                    .map(function (d) {
                        if (selectedDistricts.has(d[barChartType])) {
                            return d[barChartType]
                        }

                        if (selectedActors.has(d[barChartType])) {
                            return d[barChartType]
                        }

                        if (selectedCause.has(d[barChartType])) {
                            return d[barChartType]
                        }
                    }));

            //----------------------------
            // Refresh view
            //----------------------------

            barChartSVG
                .selectAll('text')
                .remove()

            barChartSVG
                .selectAll("rect")
                .remove()

            barChartSVG
                .selectAll('g')
                .remove()

            // barChartSVG.selectAll("g.y.axis")
            //     .call(yAxis);

            // barChartSVG.selectAll("g.x.axis")
            //     .call(xAxis);

            //----------------------------
            // Draw bars
            //----------------------------


            barChartSVG
                .attr("class", "bar")
                .selectAll(".bar")
                .data(dataCurrentDate)
                .enter()
                .filter(function (d) {
                    return selectedDistricts.has(d.province) || selectedActors.has(d.actor) || selectedCause.has(d.cause)
                })
                .append("rect")
                .attr("x", function (d) {
                    if (selectedDistricts.has(d[barChartType])) {
                        return xScale(d[barChartType]);
                    }
                    if (selectedActors.has(d[barChartType])) {
                        return xScale(d[barChartType]);
                    }
                    if (selectedCause.has(d[barChartType])) {
                        return xScale(d[barChartType]);
                    }
                })
                .attr("width", xScale.bandwidth())
                .attr("y", function (d) {
                    return yScale(previousHeight[Object.values(d)[0]] || 0);
                })
                .attr("height", function (d) {
                    return height - yScale(previousHeight[Object.values(d)[0]] || 0);
                })
                .transition()
                .attr("y", function (d) {
                    previousHeight[Object.values(d)[0]] = Object.values(d)[1]

                    return yScale(d.quantity);
                })
                .attr("height", function (d) {
                    return height - yScale(d.quantity);
                })
                .attr("fill", (d) => {
                    if (barChartType === "province")
                        return colorScale(d.quantity)

                    if (barChartType === "actor")
                        return greenColorScale(d.quantity)

                    if (barChartType === "cause")
                        return bluesColorScale(d.quantity)

                })
                .attr("opacity", (d) => {

                    if (highlighted.value === Object.values(d)[0]) {
                        return "0.4"
                    }

                    return "1.0"
                })

            //----------------------------
            // Define interactivity
            //----------------------------

            barChartSVG.selectAll("rect")
                .on('mouseenter', function (actual, i) {


                    highlighted = {
                        type: Object.keys(actual)[0],
                        value: actual[Object.keys(actual)[0]]
                    }

                    rerenderSyriaMap()
                    rerenderNode()

                    // change opacity of the bars on mouseenter
                    // d3.selectAll('.value')
                    //     .attr('opacity', 0)

                    d3.select(this)
                        .transition()
                        .duration(500)
                        .attr("opacity", 0.6)
                        .attr('x', (a) => xScale(a[barChartType]) - 5)
                        .attr('width', xScale.bandwidth() + 10)

                    if (document.getElementById("play").className !== "button barsblue") {
                        // draw text showing relative percentages
                        barChartSVG
                            .selectAll()
                            .data(dataCurrentDate)
                            .enter()
                            .filter(function (d) {
                                return selectedDistricts.has(d.province) || selectedActors.has(d.actor) || selectedCause.has(d.cause)
                            })
                            .append('text')
                            .attr('class', 'divergence')
                            .attr('x', (a) => {
                                return xScale(a[barChartType]) + xScale.bandwidth() / 2
                            })
                            .attr('y', (a) => yScale(a.quantity) - 30)
                            .attr('fill', 'white')
                            .attr('text-anchor', 'middle')
                            .text("test")
                            .text((a, idx) => {
                                const divergence = (a.quantity - actual.quantity).toFixed(1)

                                let text = ''
                                if (divergence > 0) text += '+'
                                text += `${divergence}%`

                                return idx !== i ? text : '';
                            })

                        // draw line on top of bar
                        const y = yScale(actual.quantity)

                        line = barChartSVG
                            .append('line')
                            .attr('id', 'limit')
                            .attr('x1', 0)
                            .attr('y1', y)
                            .attr('x2', width)
                            .attr('y2', y)

                    }
                })
                .on("mouseleave", function () {
                    // d3.selectAll('.value')
                    //     .attr('opacity', 1)

                    // change opacity and bar width back to normal
                    d3.select(this)
                        .transition()
                        .duration(300)
                        .attr('opacity', 1)
                        .attr("x", function (d) {
                            return xScale(d[barChartType]);
                        })
                        .attr('width', xScale.bandwidth())

                    // remove the line and additional text showing percentages
                    barChartSVG.selectAll('#limit').remove()
                    barChartSVG.selectAll('.divergence').remove()
                })
                .on("mousemove", function (d) {

                    const type = Object.keys(d)[0];

                    d3.selectAll('.deaths')
                        .text(d.quantity)

                    d3.selectAll('.date')
                        .text(currentDate || "");

                    d3.selectAll('.datetype')
                        .text("on");

                    var w = window.innerWidth;

                    if (w / 3 * 2 < d3.event.pageX) {
                        d3.select("#tooltip")
                            .style("top", (d3.event.pageY) + 20 + "px")
                            .style("left", (d3.event.pageX) - 240 + "px")
                    } else {
                        d3.select("#tooltip")
                            .style("top", (d3.event.pageY) + 20 + "px")
                            .style("left", (d3.event.pageX) + 20 + "px")
                    }

                    if (type === "province") {
                        d3.select('#province')
                            .text(d[Object.keys(d)[0]]);

                        d3.select("#syriaTooltip").classed("hidden", false);
                    } else {
                        d3.select('#actorData')
                            .text(d[Object.keys(d)[0]]);

                        d3.select("#barChartTooltip").classed("hidden", false);
                    }

                    d3.select("#tooltip").classed("hidden", false);
                })
                .on("mouseout", function (d) {
                    d3.select("#tooltip").classed("hidden", true);
                    d3.select("#syriaTooltip").classed("hidden", true);
                    d3.select("#barChartTooltip").classed("hidden", true);
                })

            //----------------------------
            // Draw x-axis, y-axes, and grid
            //----------------------------

            barChartSVG.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (height) + ")")
                .call(xAxis)
                .selectAll("text")
                .attr("y", 0)
                .attr("x", 9)
                .attr("dy", ".35em")
                .attr("transform", "rotate(45)")
                .style("text-anchor", "start");

            barChartSVG.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6).attr("dy", ".71em")

            barChartSVG.append('g')
                .attr('class', 'grid')
                .call(d3.axisLeft()
                    .scale(yScale)
                    .tickSize(-width, 0, 0)
                    .tickFormat(''))

            // //----------------------------
            // // Draw title and x and y-axes labels
            // //----------------------------

            // numbers on top of the bars
            barChartSVG.selectAll()
                .data(dataCurrentDate)
                .enter()
                .filter(function (d) {
                    return selectedDistricts.has(d.province) || selectedActors.has(d.actor) || selectedCause.has(d.cause)
                })
                .append('text')
                .attr('class', 'value')
                .attr('x', (a) => xScale(a[barChartType]) + xScale.bandwidth() / 2)
                .attr('y', (a) => yScale(previousHeight[Object.values(a)[0]] || 0) + -5)
                .transition()
                .attr('y', (a) => yScale(a.quantity) + -5)
                .attr('text-anchor', 'middle')
                .text((a) => `${a.quantity}`)

            // y-axis label
            barChartSVG.append('text')
                .attr('class', 'label')
                .attr('x', -height / 2)
                .attr('y', -50)
                .attr('transform', 'rotate(-90)')
                .attr('text-anchor', 'middle')
                .text('Number of casualties')

            // x-axis label
            barChartSVG.append('text')
                .attr('class', 'label')
                .attr('x', 500)
                .attr('y', 480)
                .attr('text-anchor', 'middle')
                .text(barChartType)

            // title
            barChartSVG.append('text')
                .attr('class', 'title')
                .attr('x', width / 2 + 60)
                .attr('y', -20)
                .attr('text-anchor', 'middle')







            // .text('Number of deaths caused by the war')

            // source
            // barChartSVG.append('text')
            //     .attr('class', 'source')
            //     .attr('x', 900)
            //     .attr('y', 360)
            //     .attr('text-anchor', 'start')
            //     .text('Source: ...')

        });

    }




    updateBarchart()

}