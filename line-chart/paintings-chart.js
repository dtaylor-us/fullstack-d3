import * as d3 from "d3";

async function drawLineChart() {
    // Load the data from a JSON file
    const data = await d3.csv("./data/paintings.csv");

    // Accessor functions to get the necessary data fields
    const seasonAccessor = d => d.season;
    const episodeAccessor = d => d.episode;
    const numColorsAccessor = d => d.num_colors;

    // Group data by season and episode
    const groupedData = d3.group(data, d => seasonAccessor(d), d => episodeAccessor(d));

    // Aggregate data to find the total number of colors used over time
    const aggregatedData = [];
    groupedData.forEach((episodes, season) => {
        episodes.forEach((paintings, episode) => {
            const totalColors = d3.sum(paintings, numColorsAccessor);
            aggregatedData.push({season, episode, totalColors});
        });
    });


    // Define the dimensions of the chart
    const dimensions = {
        width: window.innerWidth * 0.9,
        height: 400,
        margin: {top: 15, right: 15, bottom: 40, left: 60},
    };
    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;


    // Create the SVG container
    const wrapper = d3.select("#painting-wrapper")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)

    // Create a group element for margins
    const bounds = wrapper.append("g")
        .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`);

    // Create scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(aggregatedData, d => d.season + d.episode / 100))
        .range([0, dimensions.boundedWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(aggregatedData, d => d.totalColors)])
        .range([dimensions.boundedHeight, 0]);

    // Create a line generator function
    const lineGenerator = d3.line()
        .x(d => xScale(d.season + d.episode / 100))
        .y(d => yScale(d.totalColors));

    // Append the line path to the bounds
    bounds.append("path")
        .datum(aggregatedData)
        .attr("d", lineGenerator)
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("stroke-width", 2);

    // Create and append the y-axis
    const yAxisGenerator = d3.axisLeft().scale(yScale);
    bounds.append("g").call(yAxisGenerator);

    // Create and append the x-axis
    const xAxisGenerator = d3.axisBottom().scale(xScale);
    bounds.append("g")
        .call(xAxisGenerator)
        .style("transform", `translateY(${dimensions.boundedHeight}px)`);
}

// Call the function to draw the chart
drawLineChart()