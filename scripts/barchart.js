//----------------------------
// Barchart idiom
//----------------------------

function barChartInit() {
    var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    };

    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

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

    var barChartSVG = d3
        .select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   

    //----------------------------
    // Draw barchart
    //----------------------------

    updateBarchart = function(){
        // for now the only type is province
        var barChartType = "province"
        
        d3.json(`data/${barChartType}.json`).then(function (data) {
         
            var dataCurrentDate = data[currentDate]
            console.log(dataCurrentDate)

            xScale.domain(dataCurrentDate.map(function (d) {
                return d.province;

            }));
            yScale.domain([0, d3.max(dataCurrentDate, function (d) {
                return d.quantity;
            })]);

            // if (currentDate !== "2013-01") {
            //     barChartSVG
            //         .data(dataCurrentDate)
            //         .attr("x", function (d) {
            //             // barChartType cannot be used here?
            //             return xScale(dataCurrentDate.province);
            //         })
            //         .attr("y", function (d) {
            //             return yScale(dataCurrentDate.quantity);
            //         })
            //         .attr("height", function (d) {
            //             return height - yScale(dataCurrentDate.quantity);
            //         });    
            // }
            // else{
                barChartSVG.selectAll(".bar")
                    .data(dataCurrentDate)
                    .enter()
                    .append("rect")
                    .attr("class", "bar")
                    .attr("x", function (d) {
                        // barChartType cannot be used here?
                        return xScale(d.province);
                    })
                    .attr("width", xScale.bandwidth())
                    .attr("y", function (d) {
                        return yScale(d.quantity);
                    })
                    .attr("height", function (d) {
                        return height - yScale(d.quantity);
                    });
                
                barChartSVG.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + (height) + ")")
                    .call(xAxis)
                    .selectAll("text");
                
                barChartSVG.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6).attr("dy", ".71em")
            // }
        
        });

    }

    updateBarchart()
   
}