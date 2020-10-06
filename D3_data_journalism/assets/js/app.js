//Define SVG area dimensions
var svgWidth =960;
var svgHeight= 660;

//Define the chart's margins as an object
var margin={
    top:30,
    right:30,
    bottom:60,
    left:60
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
        data.poverty=+data.poverty;
    });

//Create a scale for x coordinates
var xScale = d3.scaleLinear()
            .domain([d3.min(povertyData, d => d.poverty)-1,d3.max(povertyData, d => d.poverty)+2])
            .range([0,chartWidth]);

//Create a scale for y coordinates
var yScale = d3.scaleLinear()
            .domain([d3.min(povertyData, d => d.healthcare)-2,d3.max(povertyData, d => d.healthcare)])
            .range([chartHeight,0]);

//Create a line generator function and store as a variable
//use the scale funcitons for x and y data

var bottomAxis = d3.axisBottom(xScale);
var leftAxis = d3.axisLeft(yScale);

//Append x and y axis
chartGroup.append("g")
        // .classed("axis",true)
        .call(leftAxis);

chartGroup.append("g")
        // .classed("axis",true)
        .attr("transform",`translate(0, ${chartHeight})`)
        .call(bottomAxis);

/* Initialize tooltip */
var tip = d3.tip().attr("class","d3-tip").html(function(d) { return `States:${d.state} Poverty: ${d.poverty} HealthCare: ${d.healthcare}`;
 });
svg.call(tip);

//Append circles to data points
var circlesGroup= chartGroup.selectAll("circle")
            .data(povertyData)
            .enter()
            .append("circle")
            .attr("cx",d => xScale(d.poverty))
            .attr("cy",d => yScale(d.healthcare))
            .attr("r","18")
            .attr("stroke","gray")
            .attr("stroke-width","4")
            .attr("fill","lightblue")
            .on('mouseover',function(d){
                tip.show(d,this)})
            .on('mouseout',function(d){
                tip.hide(d)});   
                
 //Label the x and y axis

chartGroup.append("text")
        .attr("transform",`translate(${chartWidth/2}, ${chartHeight+margin.top+10})`)
        // .classed("dow-text text", true)
        .text("POVERTY(%)");     

chartGroup.append("text")
    .attr("transform",`translate(${-40}, ${chartHeight/2})rotate(-90)`)
    // .classed("dow-text text", true)
    .text("HEALTHCARE(%)");    
    
//Text inside the Circles
var textSelection = chartGroup.selectAll('.text')
    console.log(textSelection);

textSelection.data(povertyData)
        .enter()
        .append("text")
        .classed('text', true)
        .attr("x", d => xScale(d.poverty))
        .attr("y", d => yScale(d.healthcare))
        .attr("transform", `translate(-11, 6)`)
        .text(d => {
            return d.abbr
        })
        .style("fill", "red" )

}).catch(function(error){
    console.log(error);
})
