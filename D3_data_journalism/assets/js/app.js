//Define SVG area dimensions
var svgWidth =960;
var svgHeight= 660;

//Define the chart's margins as an object
var margin={
    top:30,
    right:30,
    bottom:30,
    left:30
};

//Define dimensions of the chart area
var chartWidth = svgWidth -margin.left -margin.right;
var chartHeight = svgHeight- margin.top - margin.bottom;

//Select body, append SVG area to it, and set its dimensions

var svg = d3.select("#scatter").append("svg")
            .attr("width",svgWidth)
            .attr("height", svgHeight);

//Append a group area, then set its margins
var chartGroup= svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Load data from data.csv
//`Healthcare vs. Poverty`
d3.csv("./assets/data/data.csv").then(function(povertyData){
    //Print the povertyData
    console.log(povertyData);

    povertyData.forEach(function(data){
        data.healthcare=+data.healthcare;
        data.age=+data.poverty;
    });

//Create a scale for x coordinates
var xScale = d3.scaleLinear()
            .domain(d3.extent(povertyData, d => d.poverty))
            .range([0,svgWidth]);

//Create a scale for y coordinates
var yScale = d3.scaleLinear()
            .domain(d3.extent(povertyData, d => d.healthcare))
            .range([svgHeight,0]);

//Create a line generator function and store as a variable
//use the scale funcitons for x and y data

var bottomAxis = d3.axisBottom(xScale);
var leftAxis = d3.axisLeft(yScale);

//Append x and y axis
chartGroup.append("g")
        .classed("axis",true)
        .call(leftAxis);

chartGroup.append("g")
        .classed("axis",true)
        .attr("transform",`translate(0, ${chartHeight})`)
        .call(bottomAxis);

//create circles
chartGroup.append("text")
        .attr("transform",`translate(${chartWidth/2}, ${chartHeight+margin.top+20})`)
        // .classed("dow-text text", true)
        .text("POVERT");

}).catch(function(error){
    console.log(error);
})
