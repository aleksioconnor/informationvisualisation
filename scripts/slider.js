// Initialize slider
function initSlider() {
    var formatDateIntoYear = d3.timeFormat("%b"); // set %Y to display year instead of months below slider
    var formatDate = d3.timeFormat("%b %Y"); // year and month
    var commonDateFormat = d3.timeFormat("%Y-%m");

    var startDate = new Date("2013-01-01"),
        endDate = new Date("2017-12-01");

    var width = windowWidth - 200,
        height = sliderHeight;

    var currentSliderValue = 0,
        timer

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

    var sliderSVG = slider
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
                currentSliderValue = d3.event.x;
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
        .insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9);


    // What happens when you move the slider should be defined in here
    function moveSlider(h) {
        handle.attr("cx", x(h));

        newDate = commonDateFormat(h);

        if (newDate !== currentDate) {
            if (newDate.substring(0, 4) !== currentDate.substring(0, 4)) {
                updateSankey();
            }
            currentDate = newDate;
            rerenderMap()
            rerenderSyriaMap()
            // drawScale()
            updateLineChart()
            updateBarchart()
            updateLine();

        }

        label.attr("x", x(h)).text(formatDate(h));
    }


    $('#play').click(function () {
        const isSelected = document.getElementById("play").className === "button barsblue";

        $(this).toggleClass('barsblue')

        if (isSelected) {
            clearInterval(timer)
            document.getElementById("play").textContent = "Play"
        } else {
            timer = window.setInterval(function () {
                moveSlider(x.invert(currentSliderValue + 1));
                currentSliderValue += 1;
            }, 30);
            document.getElementById("play").textContent = "Stop"
        }
    });

    $("#help").click(function(){
        // Get the modal
        var modal = document.getElementById('myModal');
        modal.style.display = "block";

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
        modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
        }
    });
}