//----------------------------
// Barchart idiom
//----------------------------

function barChartInit() {

    // set the dimensions and margins of the chart
    var margin = {
        top: 20,
        right: 60,
        bottom: 60,
        left: 75
    },

    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

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

    // change button colors onClick
    jQuery('#province').click(function() {
        $(this).toggleClass('barsblue')
        $('#actor').removeClass("barsblue")
        $('#cause').removeClass("barsblue")
    });

    jQuery('#actor').click(function() {
        $(this).toggleClass('barsblue')
        $('#province').removeClass("barsblue")
        $('#cause').removeClass("barsblue")
    });

    jQuery('#cause').click(function() {
        $(this).toggleClass('barsblue')
        $('#actor').removeClass("barsblue")
        $('#province').removeClass("barsblue")
    });

    var barChartType = "province";

    d3.selectAll("#province")
        .on("click", function() {
        barChartType = "province"
        updateBarchart()
    });

    d3.selectAll("#actor")
        .on("click", function() {
        barChartType = "actor"
        updateBarchart()
    });

    d3.selectAll("#cause")
        .on("click", function() {
        barChartType = "cause"
        updateBarchart()
    });

    //----------------------------
    // Draw barchart
    //----------------------------

    updateBarchart = function () {
      
        d3.json(`data/${barChartType}.json`).then(function (data) {

            // get the right data
            var dataCurrentDate = data[currentDate]

            //----------------------------
            // Define x and y-scale
            //----------------------------

            yScale.domain([0, d3.max(dataCurrentDate, function (d) {
                 return d.quantity + 350;
            })]);
            //yScale.domain([0, 1500])

            xScale.domain(dataCurrentDate.map(function (d) {
                return d[barChartType];
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
                .append("rect")
                .attr("x", function (d) {
                    return xScale(d[barChartType]);
                })
                .attr("width", xScale.bandwidth())
                .attr("y", function (d) {
                    return yScale(d.quantity);
                })
                .attr("height", function (d) {
                    return height - yScale(d.quantity);
                })

            //----------------------------
            // Define interactivity
            //----------------------------

            barChartSVG.selectAll("rect")
                .on('mouseenter', function (actual, i) {

                    // change opacity of the bars on mouseenter
                    // d3.selectAll('.value')
                    //     .attr('opacity', 0)

                    d3.select(this)
                        .transition()
                        .duration(500)
                        .attr("opacity", 0.6)
                        .attr('x', (a) => xScale(a[barChartType]) - 5)
                        .attr('width', xScale.bandwidth() + 10)
                        
                    // draw text showing relative percentages
                    barChartSVG.selectAll()
                        .data(dataCurrentDate)
                        .enter()
                        .append('text')
                        .attr('class', 'divergence')
                        .attr('x', (a) => xScale(a[barChartType]) + xScale.bandwidth() / 2)
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

            //----------------------------
            // Draw title and x and y-axes labels
            //----------------------------

            // numbers on top of the bars
            barChartSVG.selectAll()
                .data(dataCurrentDate)
                .enter()
                .append('text')
                .attr('class', 'value')
                .attr('x', (a) => xScale(a[barChartType]) + xScale.bandwidth() / 2)
                .attr('y', (a) => yScale(a.quantity) + -5)
                .attr('text-anchor', 'middle')
                .text((a) => `${a.quantity}`)

            // y-axis label
            barChartSVG.append('text')
                .attr('class', 'label')
                .attr('x', -height/2)
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