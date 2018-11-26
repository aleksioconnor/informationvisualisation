function barChartInit() {
    // var margin = {
    //     top: 0,
    //     right: 0,
    //     bottom: 20,
    //     left: 34
    // };

    var padding = 30;

    var w = (windowWidth) - margin.left - margin.right;
    var h = (windowHeight / 2);

    // parse the date / time
    var parseTime = d3.timeParse("%Y-%m");

    // var svg = d3.select("#bar_chart")
    //     .append("svg")
    //     .attr("width", w + margin.left + margin.right)
    //     .attr("height", h + margin.top + margin.bottom)
    //     .attr("transform",
    //         "translate(" + margin.left + "," + margin.top + ")");

    var svg = d3.select("#bar_chart").append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + 0 + ")");

    var xScale = d3.scaleBand().rangeRound([0, w]).padding(0.03);
    var yScale = d3.scaleLinear()
        .range([h, 0]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // Load the data
    d3.json("data/allDeaths.json").then(function (data) {
        console.log(data[0].provinceDeathcount)
        data.forEach(function (d) {
            d.date = parseTime(d.date);

        })
        var tempdata = []
        for (var property in data[0].provinceDeathcount) {
            var obj = {
                "province": property,
                "quantity": data[0].provinceDeathcount[property]
            }
            tempdata.push(obj)
        }
        console.log(tempdata)




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


        drawBars = function () {



            if (currentDate !== "2013-01") {
                mapSVG
                    .attr("fill", function (d) {
                        return colorScale(data[currentDate][d.properties.name] || 0);
                    })
            } else {
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
            }
        }

        drawBars()


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