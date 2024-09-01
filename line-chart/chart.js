import * as d3 from "d3";

async function drawLineChart() {
    // Load the data from a JSON file
    const data = await d3.json("./data/my_weather_data.json")

    // Accessor functions to get the necessary data fields
    const yAccessor = d => d.temperatureMax
    const dateParser = d3.timeParse("%Y-%m-%d")
    const xAccessor = d => dateParser(d.date)

    // Define the dimensions of the chart
    let dimensions = {
        width: window.innerWidth * 0.9,
        height: 400,
        margin: {
            top: 15,
            right: 15,
            bottom: 40,
            left: 60,
        },
    }

    // Calculate the bounded width and height
    dimensions.boundedWidth = dimensions.width
        - dimensions.margin.left
        - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height
        - dimensions.margin.top
        - dimensions.margin.bottom

    // Create the SVG container
    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)

    // Create a group element for margins
    const bounds = wrapper.append("g")
        .style("transform", `translate(${
            dimensions.margin.left
        }px, ${
            dimensions.margin.top
        }px)`)

// Create a linear scale for the y-axis
const yScale = d3.scaleLinear()
    // Set the domain to the extent (min and max) of the data values
    .domain(d3.extent(data, yAccessor))
    // Set the range to map data values to pixel values, from bottom to top
    .range([dimensions.boundedHeight, 0])

    // Add a rectangle for freezing temperatures
    const freezingTemperaturePlacement = yScale(32)
    bounds.append("rect")
        .attr("x", 0)
        .attr("width", dimensions.boundedWidth)
        .attr("y", freezingTemperaturePlacement)
        .attr("height", dimensions.boundedHeight - freezingTemperaturePlacement)
        .attr("fill", "#e0f3f3")

    // Create a time scale for the x-axis
    const xScale = d3.scaleTime()
        .domain(d3.extent(data, xAccessor))
        .range([0, dimensions.boundedWidth])

    // Create a line generator function
    const lineGenerator = d3.line()
            .x(d => xScale(xAccessor(d)))
            .y(d => yScale(yAccessor(d)))

    // Append the line path to the bounds
    const line = bounds.append("path")
        .attr("d", lineGenerator(data))
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("stroke-width", 2)

    // Create and append the y-axis
    const yAxisGenerator = d3.axisLeft()
        .scale(yScale)

    const yAxis = bounds.append("g")
        .call(yAxisGenerator)

    // Create and append the x-axis
    const xAxisGenerator = d3.axisBottom()
        .scale(xScale)

    const xAxis = bounds.append("g")
        .call(xAxisGenerator)
        .style("transform", `translateY(${
            dimensions.boundedHeight
        }px)`)
}

// Call the function to draw the chart
drawLineChart()