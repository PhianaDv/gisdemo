import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { d3FormatNumber } from "../redux/summarySlice";
import { useDispatch } from "react-redux";
import { setTempTimeFilter } from "../redux/dataFilterSlice";

function getMonthTimestamps(yyyyMM) {
  const [year, month] = yyyyMM.split('-').map(Number);
  
  const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const startTimestamp = startDate.getTime();

  const endDate = new Date(year, month, 0, 23, 59, 59, 999);
  const endTimestamp = endDate.getTime();

  return [startTimestamp, endTimestamp];
}

const processLineChartData = (data, sumBy, mode) => {
  if (!data) return [];

  const parseDate = !mode ? d3.timeFormat("%Y-%m") : d3.timeFormat("%Y-%m-%d");

  
  const aggregatedData = d3.rollups(
    data,
    v => sumBy === "count" 
      ? v.length 
      : d3.sum(v, d => d.properties[sumBy] || 0), 
    d => parseDate(new Date(d.properties.pct))
  );

  return aggregatedData
    .map(([key, value]) => ({ date: key, sum: value }))
    .sort((a, b) => new Date(a.date) - new Date(b.date)); 
};

const LineChart = ({ data, sumBy }) => {
  const dispatch = useDispatch();
  const svgRef = useRef();
  const tooltipRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 100, height: 100 });
  const [dailyMode, setDailyMode] = useState(false);
  const processedData = processLineChartData(data, sumBy, dailyMode);

  useEffect(() => {
     
      const updateSize = () => {
        if (containerRef.current) {
          const { width, height } = containerRef.current.getBoundingClientRect();
          setDimensions({
            width: width,
            height: height || 300, 
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
    const margin = { top: 0, right: 30, bottom: 30, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    
    const x = d3.scaleTime()
      .domain(d3.extent(processedData, d => new Date(d.date)))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(processedData, d => d.sum)]).nice()
      .range([height - margin.bottom, margin.top]);

    
    const line = d3.line()
      .x(d => x(new Date(d.date)))
      .y(d => y(d.sum))
      .curve(d3.curveMonotoneX); 

    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("overflow", "visible");

    svg.selectAll("*").remove(); 

    
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(!dailyMode? d3.timeFormat("%Y-%m"): d3.timeFormat("%Y-%m-%d"))
      .ticks(8))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickFormat(d3FormatNumber));


    svg.append("path")
      .datum(processedData)
      .attr("fill", "none")
      .attr("stroke", "#34ebde")
      .attr("stroke-width", 2)
      .attr("d", line);


    const tooltip = d3.select(tooltipRef.current)
      .style("position", "fixed")
      .style("display", "none")
      .style("background", "#29323c")
      .style("border-radius", "4px")
      .style("padding", "5px")
      .style("font-size", "12px");


    svg.selectAll(".dot")
      .data(processedData)
      .enter().append("circle")
      .attr("cx", d => x(new Date(d.date)))
      .attr("cy", d => y(d.sum))
      .attr("r", 4)
      .attr("fill", "#34ebde")
      .attr("stroke", "#34ebde")
      .attr("stroke-width", 1)
      .style('fill-opacity', 0.8)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        tooltip.style("display", "block")
               .html(`<strong>${d.date}</strong>: ${d3FormatNumber(d.sum)}`)
               .style("top", `${event.pageY - 30}px`)
               .style("left", `${event.pageX + 10}px`);

        d3.select(this)  
          .transition()
          .duration(100)
          .attr("stroke-width", 2.5)
          .style('fill-opacity', 0.6);
      })
      .on("mousemove", function(event) {
        tooltip.style("top", `${event.pageY - 30}px`)
               .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", function() {
        tooltip.style("display", "none");
        d3.select(this)  
          .transition()
          .duration(100)
          .attr("stroke-width", 1)
          .style('fill-opacity', 0.8);
      })
      .on("click", function (event, d) {
        dispatch(setTempTimeFilter(getMonthTimestamps(d.date)))
        setDailyMode(!dailyMode)
      });

      const avgValue = d3.mean(processedData, d => d.sum);

    svg.append("line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", y(avgValue))
      .attr("y2", y(avgValue))
      .attr("stroke", "#e0c163")
      .attr("stroke-dasharray", "4")
      .attr("stroke-width", 2);


    svg.append("text")
      .attr("x", width - margin.right - 10)
      .attr("y", y(avgValue) - 5)
      .attr("text-anchor", "end")
      .style("fill", "#e0c163")
      .style("font-size", "14px")
      .text(`Avg: ${d3FormatNumber(avgValue)}`);

  }, [data, sumBy]);

  return (
    <div ref={containerRef} style={{ marginTop: 20}}>
      
      <svg ref={svgRef}></svg>
      <div ref={tooltipRef}></div>
    </div>
  );
};

export default LineChart;
