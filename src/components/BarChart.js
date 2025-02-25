import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { d3FormatNumber } from "../redux/summarySlice";
import { useDispatch } from "react-redux";
import { setTempHighlightFp, setTempFilterFp } from "../redux/dataFilterSlice";



const processBarChartData = (data, sumBy, viewLevelFp) => {
  if (!data) return [];

  const aggregatedData = d3.rollups(
    data,
    v => sumBy === "count" ? v.length : d3.sum(v, d => d.properties[sumBy] || 0),
    d => d.properties[viewLevelFp]
  );

  return aggregatedData
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // Top 10
};

const BarChart = ({ data, viewLevelFp, sumBy, viewLevel }) => {
    const dispatch = useDispatch();
  const svgRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 100, height: 100 });

  useEffect(() => {
    // Function to update size dynamically
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: width,
          height: height || 300, // Fallback height if not detected
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const { width, height } = dimensions;
    const margin = { top: 15, right: 10, bottom: 10, left: 15 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const processedData = processBarChartData(data, sumBy, viewLevelFp);
    const x = d3.scaleBand()
      .domain(processedData.map(d => d.key))
      .range([0, chartWidth])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(processedData, d => d.value)]).nice()
      .range([chartHeight, 0]);

    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("overflow", "visible");

    svg.selectAll("*").remove(); // Clear previous render

    const container = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X Axis
    container.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // Y Axis
    container.append("g")
      .call(d3.axisLeft(y).tickFormat(d3FormatNumber));

    // Bars
    container.selectAll(".bar")
      .data(processedData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.key))
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => chartHeight - y(d.value))
      .attr("fill", "#9bbd66")
      .style("cursor", "pointer")
      .on("mouseenter", function (event, d) {
        dispatch(setTempHighlightFp(d.key));
        d3.select(this).transition().duration(100).style("fill-opacity", 0.6);
        d3.select("#bar-tooltip").style("display", "block")
          .html(`<strong>${d.key}</strong>: ${d3FormatNumber(d.value)}`)
          .style("top", `${event.pageY - 30}px`)
          .style("left", `${event.pageX + 10}px`);
      })
    //   .on("mouseover", function(event, d) {
        
        
    //   })
      .on("mousemove", event => {
        d3.select("#bar-tooltip").style("top", `${event.pageY - 30}px`).style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", function() {
        d3.select(this).transition().duration(100).style("fill-opacity", 1);
        d3.select("#bar-tooltip").style("display", "none");
        dispatch(setTempHighlightFp(0))
      })
      .on("click",function(event, d) {
        dispatch(setTempFilterFp(d.key))
      });

  }, [data, viewLevelFp, sumBy, dimensions]);

  return (
    <div ref={containerRef}>

        
      <svg ref={svgRef}></svg>
      <div id="bar-tooltip" 
           style={{
             position: "fixed", 
             display: "none", 
             background: "#29323c", 
             color: "#fff", 
             borderRadius: "4px", 
             padding: "5px", 
             fontSize: "12px"
           }}></div>
    </div>
  );
};

export default BarChart;
