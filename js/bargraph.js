//this file is for making the bar graph. It uses the d3.js library from d3js.org
function drawBarGraph(command) {

var data = JSON.parse(localStorage.getItem("itemList"));
var bargraphData = data.map(function(d) {
    return { name: d.name, currentrating: d.rating[0] };
});

bargraphData.sort(function(a,b) {
    return a.currentrating - b.currentrating;
});

//set colors
var colors = d3.scale.category10();
colors.domain(data.map(function (d) { return d.name; }));

//create canvas
var vis = d3.select("#bargraph"),
    WIDTH = 1000,
    HEIGHT = 500,
    MARGINS = {
        top: 20,
        right: 60,
        bottom: 20,
        left: 70
    }, 
    
    //define scales
    xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right])
                .domain([
                    d3.min(bargraphData.map(function(d) {
                                return d.currentrating; 
                            })) - 20,
                    d3.max(bargraphData.map(function(d) {
                                return d.currentrating; 
                            }))
                        ]),
    yScale = d3.scale.ordinal().rangePoints([HEIGHT - MARGINS.top, MARGINS.bottom])
                .domain(bargraphData.map(function(d) { return d.name; })),
                
    //define axes
    xAxis = d3.svg.axis().scale(xScale),
    yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

//first time generating the graph components when command == "new"
if (command == "new") {   
    
    //draw the Y axis
    vis.append("svg:g")
    .attr("class", "axis")
    .attr("transform", "translate(" + (MARGINS.left) + ",0)")
    .call(yAxis);
    
    //draw the bars by creating svg rectangles of size and coordinates based on the dataset
    bargraphData.forEach(function(d, i) {
        vis.append("rect")
        .attr("id", d.name)
        .style("fill", colors(d.name))
        .attr("y", yScale(d.name) - 10)
        .attr("x", 80)
        .attr("height", 20)
        //this sets the size of the svg "rect"
        .attr("width", (xScale(d.currentrating) - 15)/2);
    });

    //creates the rating labels, which are svg text objects given coordinates in the canvas
    bargraphData.forEach(function(d, i) {
        vis.append("text")
        //the text svg objects need an ID, because when they are
        .attr("id", "ratingtext" + d.name)
        //this sets the x-coordinate of the label (relative to the canvas)
        .attr("transform", "translate(" + ((xScale(d.currentrating) + 10)/2) + "," + yScale(d.name) + ")")
        .attr("x", 3)
        .attr("dy", ".35em")
        .attr("fill", "white")
        .text(d.currentrating);
    })
    
//redraw the graph after every click of Choice 1 or Choice 2 buttons
//add transition animation with .transition()
} else if (command == "update") {
    
    d3.select(".axis")
    .transition()
    .call(yAxis);
    
    //Find the svg objects we created when the graph was created, and alter their attributes to the new values from
    //Do this each time one of the buttons is pressed.
    bargraphData.forEach(function(d,i) {
        d3.select("#bargraph")
        .select("#" + d.name)
        .attr("width", xScale(d.currentrating) - 15)
        .attr("y", yScale(d.name) - 10)
        .attr("x", 80)        
        .transition();
    
        d3.select("#bargraph")
        .select("#ratingtext" + d.name)
        .transition()
        .text(d.currentrating)
        .attr("transform", "translate(" + (xScale(d.currentrating) + 10) + "," + yScale(d.name) + ")")
        ;
    });    
}


}