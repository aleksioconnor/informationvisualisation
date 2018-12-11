//----------------------------
// Linechart idiom
//----------------------------

var lineChart = null
var mousePos = 'M0,220 0,0';

// Initialize line chart
function lineChartInit() {

    // set the dimensions and margins of the graph
    var margin = {
            top: 20,
            right: 60,
            bottom: 60,
            left: 60
        },

        width = 650 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

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
        .attr("style", "margin: 0 auto; display: block;")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    focus = lineChart.append("g") // define focus body
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
        $('#bread-value').toggleClass('low-opacity')
    });

    jQuery('#sugar').click(function () {
        $(this).toggleClass('sugar');
        $('#sugar-value').toggleClass('low-opacity')

    });

    jQuery('#rice').click(function () {
        $(this).toggleClass('rice');
        $('#rice-value').toggleClass('low-opacity')

    });

    jQuery('#fuel').click(function () {
        $(this).toggleClass('fuel');
        $('#fuel-value').toggleClass('low-opacity')

    });

    var bBread = Boolean(true);
    var bSugar = Boolean(true);
    var bRice = Boolean(true);
    var bFuel = Boolean(true);

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

            const foodPrices = Object.values(data)
            const currentDateIndex = foodPrices.findIndex(item => item.date === currentDate)
            //const foodPrices = foodPricesBig.slice(0, currentDateIndex)

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
                    .attr("d", valueLines[sBread]);

                makeInteractive(foodPrices, color)

            }

            if (bSugar == true) {
                var sSugar = "Sugar (kg, SYP)"
                var color = "#4285F4"
                var line = lineChart.append("path")
                    .data([foodPrices])
                    .attr("class", "line")
                    .style("stroke", color)
                    .attr("d", valueLines[sSugar]);

                makeInteractive(foodPrices, color)

            }

            if (bRice == true) {
                var sRice = "Rice (kg, SYP)"
                var color = "#F4B400"
                var line = lineChart.append("path")
                    .data([foodPrices])
                    .attr("class", "line")
                    .style("stroke", color)
                    .attr("d", valueLines[sRice]);

                makeInteractive(foodPrices, color)

            }

            if (bFuel == true) {
                var sFuel = "Fuel (diesel, liter, SYP)"
                var color = "#0F9D58"
                var line = lineChart.append("path")
                    .data([foodPrices])
                    .attr("class", "line")
                    .style("stroke", color)
                    .attr("d", valueLines[sFuel]);

                makeInteractive(foodPrices, color)

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

            // title
            // lineChart.append('text')
            //     .attr('class', 'title')
            //     .attr('x', width / 2 + 60)
            //     .attr('y', -20)
            //     .attr('text-anchor', 'middle')
            //     .text('Prices of commodities during the war')

            // x-axis label
            lineChart.append('text')
                .attr('class', 'label')
                .attr('x', 500)
                .attr('y', 480)
                .attr('text-anchor', 'middle')
                .text("Date")

            // source
            // lineChart.append('text')
            //     .attr('class', 'source')
            //     .attr('x', 900)
            //     .attr('y', 360)
            //     .attr('text-anchor', 'start')
            //     .text('Source: ...')                

        });
    }

    //----------------------------
    // Line that follows the timeline
    //----------------------------

    updateLine = function () {
        var dateObj = new Date(currentDate.split('-')[0], currentDate.split('-')[1]);
        dateObj.setDate(dateObj.getDate() - 31); // awful hack
        var xDate = x(dateObj);

        d3.select(".time-line")
            .style("opacity", "1")
            .attr("d", function () {
                var d = 'M' + xDate + ',220 ' + xDate + ',0';
                return d;
            });
        
        // appends circles and text to the line
        d3.selectAll(".time-circles-text")
            .style("opacity", "1")
        updatePosition(".time-circles-text", xDate)

    }

    //----------------------------
    // Define interactivity with the mouse
    //----------------------------

    function makeInteractive(foodPrices, color) {

        // initialize group mouse-over-effects
        var mouseG = lineChart.append("g")
            .attr("class", "mouse-over-effects");

        //----------------------------
        // Functions to create a vertical line, circles, and text 
        //----------------------------

        function newVerticalLine(className){
            verticalLine = mouseG.append("path") 
            .attr("class", className)
            .style("stroke", "black")
            .style("stroke-width", "1px");

            return verticalLine;

        }

        function newCirclesText(selection, className){
            var circlesText = mouseG.selectAll(selection) 
                .data([foodPrices])
                .enter()
                .append("g")
                .attr("class", className);

            circlesText.append("circle")
                .attr("r", 7)
                .style("stroke", color)
                .style("fill", "none")
                .style("stroke-width", "1px");

            circlesText.append("text") 
                .attr('class', 'label')
                .attr("transform", "translate(10,3)");

            return circlesText;

        }

        // the vertical line, text and circles to move along with the timeline
        timeLine = newVerticalLine("time-line");
        timeLineCirclesText = newCirclesText('.time-circles-text', "time-circles-text");
        d3.selectAll(".time-circles-text")
            .style("opacity", "0");
            
        // make sure these visuals do not dissapear on time line changed
        updateLine();

        // vertical line, circles, and text that appear on mouse-over
        movingLine = newVerticalLine("mouse-line")
            .attr("d", mousePos)
            .style("opacity", "0");
        mousePerLine = newCirclesText(".mouse-per-line", "mouse-per-line");
        d3.selectAll(".mouse-per-line")
             .style("opacity", "0");
                
        // vertical line, circles, and text that can be set fixed to compare
        fixedLine = newVerticalLine("fixed-line")
            .style("opacity", "0");
        fixedCirclesText = newCirclesText(".fixed-circles-text", "fixed-circles-text");
        d3.selectAll(".fixed-circles-text")
            .style("opacity", "0");

        // hacky fix to displaying correct data on the buttons on the linechart
        // lets hope this doesnt have to be changed 
        const colorMapping = {
            '#DB4437': 'bread info',
            '#4285F4': 'sugar info',
            '#F4B400': 'rice info',
            '#0F9D58': 'fuel info'
        }

        // the labels showing the values at that point
        movingText = mousePerLine.append("text")
            .attr('class', 'label')
            .attr('class', function () {
                return colorMapping[color]
            })
            .attr("transform", "translate(10,3)");

        fixedText = mousePerLine.append("text")
            .attr('class', 'label')
            .attr("transform", "translate(10,3)");

        //----------------------------
        // On mouse out, over, click, and move
        //----------------------------

        catchMouse = mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
            .attr('width', width) // can't catch mouse events on a g element
            .attr('height', height)
            .attr('fill', 'none')
            .attr('pointer-events', 'all')

            .on('mouseout', function () { // on mouse out hide line, circles and text
                d3.select(".mouse-line")
                    .style("opacity", "0");
                d3.selectAll(".mouse-per-line")
                .style("opacity", "0");
            })

            .on('mouseover', function () { // on mouse in show line, circles and text
                d3.select(".mouse-line")
                    .style("opacity", "1");
                d3.selectAll(".mouse-per-line")
                .style("opacity", "1");
            })

            .on("click", function(){ // on clicking                        
                var mouse = d3.mouse(this);   
                fixedLine
                    .style("opacity", "1")
                    .attr("d", function () {
                        var d = "M" + mouse[0] + "," + height;
                        d += " " + mouse[0] + "," + 0;
                        return d;
                    });

                d3.selectAll(".fixed-circles-text")
                    .style("opacity", "1");
                updatePosition(".fixed-circles-text", mouse[0]);
      
            })

            .on('mousemove', function () { // mouse moving over canvas
                var mouse = d3.mouse(this);
                d3.select(".mouse-line")
                    .attr("d", function () {
                        var d = "M" + mouse[0] + "," + height;
                        d += " " + mouse[0] + "," + 0;
                        return d;
                    });

                updatePosition((".mouse-per-line"), mouse[0]);
                
            });

    }

    //----------------------------
    // Defines the position of the circles and text
    //----------------------------

    function updatePosition(selection, thisDate){
        d3.selectAll(selection)
            .attr("transform", function (d, i) {
         
                var lines = document.getElementsByClassName('line');

                var xDate = thisDate,
                    bisect = d3.bisector(function (d) { return d.date; }).right;
                idx = bisect(d.values, xDate);

                var beginning = 0,
                    end = lines[i].getTotalLength(),
                    target = null;

                while (true) {
                    target = Math.floor((beginning + end) / 2);
                    pos = lines[i].getPointAtLength(target);

                    if ((target === end || target === beginning) && pos.x !== xDate) {
                        break;
                    }

                    if (pos.x > xDate) end = target;

                    else if (pos.x < xDate) beginning = target;

                    else break; //position found
                }

                d3.select(this).select('text')
                    .text(y.invert(pos.y).toFixed(2));

                if(selection == ".mouse-per-line" || selection == ".time-line"){
                        const classToBind = ($(this).find('.info').attr('class').split(' '));
                        $('#'+classToBind[0]+'-value').html(d3.select(this).text() + " &#163;S");
                }

                return "translate(" + xDate + "," + pos.y + ")";

            });

    }

    updateLineChart()

}