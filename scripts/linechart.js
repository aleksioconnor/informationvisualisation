//----------------------------
// Linechart idiom
//----------------------------

var lineChart = null

// Initialize line chart
function lineChartInit() {

    // set the dimensions and margins of the graph
    var margin = {
        top: 60,
        right: 20,
        bottom: 60,
        left: 75
    },
    
    width = (windowWidth / 2) - margin.left - margin.right,
    height = (windowHeight / 2) - margin.top - margin.bottom;

    // parse the date / time
    var parseTime = d3
        .timeParse("%Y-%m");

    // set the ranges
    var x = d3
        .scaleTime()
        .range([0, width]);

    var y = d3
        .scaleLinear()
        .range([height, 0]);

    // define the svg
    lineChart = d3
        .select("#linechart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("style", "margin: 0 auto; display: block;  border: 3px solid black;")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    focus = lineChart.append("g") // define focus boy
        .style("display", "none");

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
        "USD to SYP": d3.line().x(function (d) {
            return x(parseTime(d.date));
        })
        .y(function (d) {
            
            return y(d["USD to SYP"])
        }),
        "Rice (kg, SYP)": d3.line().x(function (d) {
            return x(parseTime(d.date));
        })
        .y(function (d) {
            
            return y(d["Rice (kg, SYP)"])
        }),
    }

    //----------------------------
    // Decide what clicking the buttons does
    //----------------------------

    // change button colors onClick
    jQuery('#USDtoSYP').click(function() {
        $(this).toggleClass('darkblue');
    });

    jQuery('#sugar').click(function() {
        $(this).toggleClass('steelblue');
    });

      jQuery('#rice').click(function() {
        $(this).toggleClass('blue');
    });

    var USDtoSYP = Boolean(false);
    var sugar = Boolean(false);
    var rice = Boolean(false);

    d3.selectAll("#USDtoSYP")
        .on("click", function() {
              
        USDtoSYP = !USDtoSYP;
        drawLineChart()
       
    });

    d3.selectAll("#sugar")
        .on("click", function() {
       
        sugar = !sugar;
        drawLineChart()
        
    });

    d3.selectAll("#rice")
        .on("click", function() {
        
        rice = !rice;
        drawLineChart()
      
    });

    //----------------------------
    // Draw linechart
    //----------------------------

    drawLineChart = function () {

        // Load the data
        d3.json("data/foodPrices2.json").then(function (data) {

            const foodPricesBig = Object.values(data)
            const currentDateIndex = foodPricesBig.findIndex(item => item.date === currentDate)
            const foodPrices = foodPricesBig.slice(0, currentDateIndex)

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

            if(USDtoSYP == true){
                USDtoSYPLine = lineChart
                    .append("path")
                    .data([foodPrices])
                    .attr("class", "line")
                    .style("stroke", "darkblue")
                    .attr("d", valueLines["USD to SYP"]);
            }

            if(sugar == true){
                sugarLine = lineChart
                    .append("path")
                    .data([foodPrices])
                    .attr("class", "line")
                    .attr("d", valueLines["Sugar (kg, SYP)"]);
            }
            
            if(rice == true){
                riceLine = lineChart
                    .append("path")
                    .data([foodPrices])
                    .attr("class", "line")
                    .style("stroke", "lightblue")
                    .attr("d", valueLines["Rice (kg, SYP)"]);
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

            grid = lineChart.append('g')
                .attr('class', 'grid')
                .call(d3.axisLeft()
                .scale(y)
                .tickSize(-width, 0, 0)
                .tickFormat(''))

            //----------------------------
            // Draw title and x and y-axes labels
            //----------------------------

            lineChart.append('text')
                .attr('class', 'label')
                .attr('x', -100)
                .attr('y', -50)
                .attr('transform', 'rotate(-90)')
                .attr('text-anchor', 'middle')
                .text('Value')
            
            lineChart.append('text')
                .attr('class', 'title')
                .attr('x', width / 2 + 60)
                .attr('y', -20)
                .attr('text-anchor', 'middle')
                .text('Prices of commodities during the war')

        });
    }

    drawLineChart()
}