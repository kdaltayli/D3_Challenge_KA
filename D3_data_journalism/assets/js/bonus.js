//Define SVG area dimensions
var svgWidth =960;
var svgHeight= 500;

//Define the chart's margins as an object
var margin={
    top:20,
    right:40,
    bottom:90,
    left:100
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

// Initial PArams
var chosenXAxis= "poverty";

// function used for updating x-scale var upon click on axis label

function xScale(povertyData , chosenXAxis) {
    // create Scales
    var xLinearScale= d3.scaleLinear()
    .domain([d3.min(povertyData, d => d[chosenXAxis])*0.8,d3.max(povertyData, d => d[chosenXAxis])*1.2])
    .range([0,chartWidth]);

    return xLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

    return xAxis;
}

// function used for updating circles group with a transition to new circles

function renderCircles(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}
function renderLabels(circleLabels, newXScale, chosenXAxis) {
    circleLabels.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]));

    return circleLabels;
}

// function used for updating circles group with new tooltip

function updateToolTip(chosenXAxis, circlesGroup) {
    var label;

    if (chosenXAxis === "poverty") {
        label = " POVERTY (%)";
    }
    else {
        label= "AGE AVERAGE";
    }

    var toolTip =d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d){ 
            return (`<strong> State: ${d.state}</strong><br> <strong> ${label}: ${d[chosenXAxis]}</strong><br><strong>Health Care: ${d.healthcare}</strong>`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data,this);
    })
    //onmouseout event
    .on("mouseout",function(data,index){
        toolTip.hide(data);
    });

    return circlesGroup;
}

//Retrieve data from the CSV file and execute everything below
d3.csv("./assets/data/data.csv").then(function(povertyData,err){
    if (err) throw err;

    //parse data
    povertyData.forEach(function(data){
        data.healthcare=+data.healthcare;
        data.poverty=+data.poverty;
        data.age =+data.age;
});
//xLinearScale function above csv import

var xLinearScale= xScale(povertyData, chosenXAxis);

//create y scale function
var yLinearScale= d3.scaleLinear()
    .domain([0,d3.max(povertyData, d => d.healthcare)])
    .range([chartHeight,0]);

//create initials axis functions
var bottomAxis= d3.axisBottom(xLinearScale);
var leftAxis= d3.axisLeft(yLinearScale);

//append x axis
var xAxis= chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);
        
//append y axis
chartGroup.append("g")
    .call(leftAxis);

//append initial Circles

var circlesGroup = chartGroup.selectAll("circle")
    .data(povertyData)
    .enter()
    .append("circle")
    .attr("cx", d=>xLinearScale(d[chosenXAxis]))
    .attr("cy", d=>yLinearScale(d.healthcare))
    .attr("r",16)
    .attr("fill", "purple")
    .attr("opacity",".5");

    //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
var circleLabels = chartGroup.selectAll(null)
    .data(povertyData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d.healthcare))
    .text(d =>d.abbr)
    .attr("fill", "blue" )
    .attr("text-anchor","middle")
    .attr("font-size", "12px");


//create group for two x-axis labels
var labelsGroup = chartGroup.append("g")
            .attr("transform",`translate(${chartWidth/2}, ${chartHeight+15})`);

var povertyLabel = labelsGroup.append("text")
                    .attr("x",0)
                    .attr("y", 28)
                    .attr("value","poverty")
                    .classed("active", true)
                    .text("POVERTY(%)");

var ageLabel = labelsGroup.append("text")
                    .attr("x",0)
                    .attr("y", 50)
                    .attr("value","age")
                    .classed("inactive", true)
                    .text("AVERAGE AGE(%)");

//append y axis
chartGroup.append("text")
    .attr("transform","rotate(-90)")
    .attr("y", 25-margin.left)
    .attr("x",0-(chartHeight/2))
    .attr("dy","1em")
    .classed("axis-text", true)
    .text("HEALTHCARE(%)"); 

//updateToolTip function above csv import
var circlesGroup=updateToolTip(chosenXAxis, circlesGroup);

//x axis labels even listener
labelsGroup.selectAll("text")
    .on("click", function() {

        //get value of selection
        var value= d3.select(this).attr("value");

        if (value!== chosenXAxis) {

            //replace chosenXaxis with value
            chosenXAxis= value;

            //function here found above csv import updates x scale for new data
            xLinearScale= xScale(povertyData,chosenXAxis);

            //update x axis with transtiion 
            xAxis= renderAxes(xLinearScale, xAxis);

            //updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

            circleLabels= renderLabels(circleLabels, xLinearScale, chosenXAxis);
            
            //update tooltips with new info
            circlesGroup= updateToolTip(chosenXAxis, circlesGroup);

            //changes classes to change bold text

            if (chosenXAxis === "age"){
                ageLabel.classed("active", true)
                        .classed("inactive", false);

                povertyLabel.classed("active", false)
                            .classed("inactive", true);
            }
            else {
                ageLabel.classed("active", false)
                        .classed("inactive", true);

                povertyLabel.classed("active", true)
                            .classed("inactive", false);
            }
        }
    });
}).catch(function(error){
    console.log(error);
});