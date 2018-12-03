// Initialize slider
function initSlider() {
    var formatDateIntoYear = d3.timeFormat("%b"); // set %Y to display year instead of months below slider
    var formatDate = d3.timeFormat("%b %Y"); // year and month
    var commonDateFormat = d3.timeFormat("%Y-%m");

    var dragging = false;

    var startDate = new Date("2013-01-01"),
        endDate = new Date("2017-12-01");

    var width = windowWidth - 200,
        height = sliderHeight;

    var svg = d3
        .select("#slider")
        .append("svg")
        .attr("width", width + 200)
        .attr("height", height)
        .attr("style", "margin: 0 auto; display: block;"); // could be included in stylesheet, centering slider

    var x = d3
        .scaleTime()
        .domain([startDate, endDate])
        .range([0, (width)])
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
                
                dragging = false;
                console.log("stop")
            })
            .on("start drag", function (p) {
                // console.log('d3.event.x)', d3.event.x);

                if (dragging) {
                    return;
                }

                console.log("START DRAG")
                dragging = true


                const dragX = d3.event.x

                // console.log("p", p)
                const t1 = slider.select("rect")["_groups"][0];
                const t2 = t1[0].attributes
                const width = parseInt(t2.width.value)
                const x = t2.x && parseInt(t2.x.value) || 0

                const x1 = x - width
                const x2 = x + width
                console.log('test', x1, x2, dragX);

                if (x1 + 2 >= dragX && dragX >= x1 - 2) {
                    console.log("move left slider", x1 + 2, dragX, x1 - 2)
                    resizeLeft()

                } else if (x2 + 2 >= dragX && dragX >= x2 - 2) {
                    console.log("move right slider")

                    // console.log("x.invert(d3.event.x)", x.invert(d3.event.x))

                    resizeRight(width, x, d3.event.x)

                } else if ((t2.x + (width / 2)) >= dragX && dragX >= (t2.x - (width / 2))) {
                    console.log("move slider")
                    moveSlider(x.invert(d3.event.x));
                }

                // d3.select(this.parentNode).attr("transform")).translate
            })
            // .on("stop drag", function () {
            //     dragging = false;
            //     console.log("stop")
            // })
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
        .attr("y", 5)
        .attr("text-anchor", "middle")
        .text(function (d) {
            return formatDateIntoYear(d);
        })

    var label = slider
        .append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .text(formatDate(startDate))
        .attr("transform", "translate(0," + -20 + ")")

    var handle = slider
        .insert("rect", ".track-overlay")
        .attr("class", "handle")
        .attr("width", 10)
        .attr("height", 20)
        .attr("y", -10)
        .attr("x", 0)



    function resizeRight(width, x, pos) {

        // debugger
        slider
            .select("rect")
            .attr("width", width + (pos - x) * 2)
            .attr("x", (pos - x))

        console.log("zrobione")
    }

    // What happens when you move the slider should be defined in here
    function moveSlider(h) {
        handle.attr("x", x(h));

        var newDate = commonDateFormat(h);

        if (newDate !== currentDate) {
            currentDate = newDate;
            rerenderMap()
            rerenderSyriaMap()
            // drawScale()

            updateLineChart()

            updateBarchart()
        }

        label.attr("x", x(h)).text(formatDate(h));
    }
}