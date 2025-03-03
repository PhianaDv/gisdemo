import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { colorSuppliersHEX } from '../assets/MyColors';
import { d3FormatNumber } from "../redux/summarySlice";
import { tempSlicerValueFilter } from "../redux/dataFilterSlice";
import { useDispatch, useSelector } from "react-redux";
import { slicerValues } from "../redux/dataFilterSlice";
import { attrShorthands } from "../redux/viewStateSlice";



const processDoughnutData = (data, slicer, sumBy) => {
  if (!data) return [];

  const aggregatedData = d3.rollups(
    data,
    v => sumBy === "count" 
      ? v.length // Count occurrences
      : d3.sum(v, d => d.properties[sumBy] || 0), // Sum numeric values
    d => d.properties[slicer]
  );

  return aggregatedData.map(([key, value]) => ({ key, value }));
};

const DoughnutChart = ({ data, slicer, sumBy }) => {
  const dispatch = useDispatch();
  const svgRef = useRef();
  const tooltipRef = useRef();
  const processedData = processDoughnutData(data, slicer, sumBy);
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 400, height: 300 });
  const [attr, setAttr] = useState(slicerValues.find(item => item.shorthand === slicer))
  const sliceby = useSelector((state) => state.viewState.slicer)
console.log(attr)
  useEffect(() => {
    setAttr(slicerValues.find(item => item.shorthand === slicer))


  },[slicer])

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
    if (!processedData.length) return;
  
    const { width, height } = dimensions;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const radius = Math.min(chartWidth, chartHeight) / 2;
    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${chartWidth} ${chartHeight}`);
  
    const pieData = d3.pie()
      .startAngle(0)
      .value(d => d.value)(processedData);
    const arcGenerator = d3.arc().innerRadius(radius * 0.5).outerRadius(radius);
    const totalSum = d3.sum(processedData, d => d.value);
  
    const tooltip = d3.select(tooltipRef.current)
      .style("position", "fixed")
      .style("display", "none")
      .style("background", "#29323c")
      .style("color", "#fff")
      .style("border-radius", "4px")
      .style("padding", "5px")
      .style("font-size", "12px");
  
    const container = svg.select('g')
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight / 2})`);
  
    const arc = container.selectAll('path')
      .data(pieData);
  
    arc.enter()
      .append("path")
      .merge(arc)
      .attr("d", arcGenerator)
      .attr('fill', d => colorSuppliersHEX(attr.value.find(item => item.value === d.data.key)?.key || '#ccc'))
      .style('fill-opacity', 0.8)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        tooltip.style("display", "block")
          .html(`<strong>${attr.value.find(item => item.value === d.data.key)?.key
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase())}</strong>: ${d3FormatNumber(d.data.value)}`);
  
        d3.select(this)
          .transition()
          .duration(100)
          .style('fill-opacity', 0.6); // Reduce opacity on hover
      })
      .on("mousemove", function(event) {
        tooltip.style("top", `${event.pageY - 30}px`)
          .style("left", `${event.pageX + 10}px`);
  
        d3.select(this)
          .transition()
          .duration(100)
          .style('fill-opacity', 0.6);
      })
      .on("mouseout", function() {
        tooltip.style("display", "none");
  
        d3.select(this)
          .transition()
          .duration(100)
          .style('fill-opacity', 0.8); // Reset opacity when mouse leaves
      })
      .on("click", function (event, d) {
          dispatch(tempSlicerValueFilter({
            attribute: slicer,
            value: d.data.key
          }));
      });
  
    arc.exit().remove();
    svg.select("g").selectAll("circle").remove();
    svg.select("g").selectAll("text").remove();
  
    // Add grey circle in the center of the doughnut
    svg.select("g")
      .append("circle")
      .attr("r", radius * 0.5)  // Radius of the circle
      .attr("fill", "#575959")  
      .style("fill-opacity",0.8)    // Grey fill color
      //.attr("transform", `translate(${width / 2}, ${height / 2})`);
      //.attr("cx", width / 2)     // Center the circle horizontally
      //.attr("cy", height / 2);   // Center the circle vertically
  
    // Add Total in Center
    svg.select("g")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", "15px")
      .attr("font-weight", "bold")
      .text(d3FormatNumber(totalSum))
      .style("fill", "white");
  
  }, [data, slicer, sumBy, attr, sliceby]);

  return (
    <div ref={containerRef}>
      
      <svg ref={svgRef} width="100%" height="95%">
      <g></g>
      </svg>
      <div ref={tooltipRef}></div>
    </div>
  );
};

export default DoughnutChart;
