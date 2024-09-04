import * as d3 from "d3";

async function drawScatter() {

    // 1. Access data
    let data = await d3.tsv("./data/penguins.tsv")
    data = data.filter(d => d.body_mass_g !== "NA" && d.flipper_length_mm !== "NA" && d.sex !== "NA");

    console.log(data)
    const xAccessor = d => d.body_mass_g
    const yAccessor = d => d.flipper_length_mm
    const colorAccessor = d => d.sex

    console.log(xAccessor(data[0]))

    const width = d3.min([
        window.innerWidth * 0.9,
        window.innerHeight * 0.9,
    ])

    const dimensions = {
        width: width,
        height: width,
        margin: {
            top: 10,
            right: 10,
            bottom: 50,
            left: 50,
        },
    }

    dimensions.boundedWidth = dimensions.width
        - dimensions.margin.left
        - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height
        - dimensions.margin.top
        - dimensions.margin.bottom

    const wrapper = d3.select("#penguins")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)

    const bounds = wrapper.append("g")
        .style("transform", `translate(${
            dimensions.margin.left
        }px, ${
            dimensions.margin.top
        }px)`)

    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, xAccessor))
        .range([0, dimensions.boundedWidth])
        .nice()
    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, yAccessor))
        .range([dimensions.boundedHeight, 0])
        .nice()


    const dots = bounds.selectAll("circle")
        .data(data)

    dots.join("circle")
        .attr("cx", d => xScale(xAccessor(d)))
        .attr("cy", d => yScale(yAccessor(d)))
        .attr("r", 5)
        .attr("fill", d => colorAccessor(d) === "male" ? "skyblue" : "lightpink")

    const xAxisGenerator = d3.axisBottom()
        .scale(xScale)

    const xAxis = bounds.append("g")
        .call(xAxisGenerator)
        .style("transform", `translateY(${
            dimensions.boundedHeight
        }px`)

    const xAxisLabel = xAxis.append("text")
        .attr("x", dimensions.boundedWidth / 2)
        .attr("y", dimensions.margin.bottom - 10)
        .attr("fill", "currentColor")
        .style("font-size", "1.4em")
        .text("Body mass (g)")

    const yAxisGenerator = d3.axisLeft()
        .scale(yScale)
        .ticks(4)

    const yAxis = bounds.append("g")
        .call(yAxisGenerator)

    const yAxisLabel = yAxis.append("text")
        .attr("x", -dimensions.boundedHeight / 2)
        .attr("y", -dimensions.margin.left + 10)
        .style("fill", "currentColor")
        .text("Flipper length (mm)")
        .style("transform", "rotate(-90deg)")
        .style("font-size", "1.4em")


}

drawScatter()