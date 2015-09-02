function drawBarGraph(command) {
//this file is for making the bar graph 

var data = JSON.parse(localStorage.getItem("itemList"));
var bargraphData = data.map(function(d) {
    return { name: d.name, currentrating: d.rating[0] };
});

bargraphData.sort(function(a,b) {
    return a.currentrating - b.currentrating;
});

var colors = d3.scale.category10();
colors.domain(data.map(function (d) { return d.name; }));

var vis = d3.select("#bargraph"),
    WIDTH = 1000,
    HEIGHT = 500,
    MARGINS = {
        top: 20,
        right: 60,
        bottom: 20,
        left: 70
    }, 
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
    xAxis = d3.svg.axis().scale(xScale),
    yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");


if (command == "new") {    
    vis.append("svg:g")
    .attr("class", "axis")
    .attr("transform", "translate(" + (MARGINS.left) + ",0)")
    .call(yAxis);
    
    bargraphData.forEach(function(d, i) {
        vis.append('rect')
        .attr("id", d.name)
        .style('fill', colors(d.name))
        .attr("y", yScale(d.name) - 10)
        .attr("x", 80)
        .attr("height", 20)
        .attr("width", (xScale(d.currentrating) - 15)/2);
    });

    bargraphData.forEach(function(d, i) {
        vis.append('text')
        .attr("id", "ratingtext" + d.name)
        .attr("transform", "translate(" + ((xScale(d.currentrating) + 10)/2) + "," + yScale(d.name) + ")")
        .attr("x", 3)
        .attr("dy", ".35em")
        .attr("fill", "white")
        .text(d.currentrating);
    })
} else if (command == "update") {
    
    d3.select('.axis')
    .transition()
    .call(yAxis);
    
    bargraphData.forEach(function(d,i) {
        d3.select('#bargraph')
        .select("#" + d.name)
        .attr("width", xScale(d.currentrating) - 15)
        .attr("y", yScale(d.name) - 10)
        .attr("x", 80)        
        .transition();
    
        d3.select('#bargraph')
        .select("#ratingtext" + d.name)
        .transition()
        .text(d.currentrating)
        .attr("transform", "translate(" + (xScale(d.currentrating) + 10) + "," + yScale(d.name) + ")")
        ;
    });    
}




}