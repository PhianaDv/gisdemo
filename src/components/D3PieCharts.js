import * as d3Shape from 'd3-shape';
import * as d3 from 'd3'; 
import * as d3Select from 'd3-selection';
import * as d3Collect from 'd3-collection';
import * as d3Array from 'd3-array';
import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState, useCallback, useEffect } from 'react';
import { colorSuppliersHEX } from '../assets/MyColors';
import TooltipChart from './TooltipChart';


const D3PieCharts = (props) => {
    const {
        id,
        description,
        data,
        slicer,
        total
    } = props;
    const mapItemRef = useRef(null); 
    const circleRef = useRef(null); 
    const circleTextRef = useRef(null); 
    const tooltipRef = useRef(null);
    const [chartData, setChartData] = useState([])
    const [chartHeading, setChartHeading] = useState([]);
    const [filteredData, setFilteredData] = useState(false);
    const dispatch = useDispatch();
    const rmax = useSelector((state) => state.viewState.rmax);
    const textSize = useSelector((state) => state.viewState.textSize);
    const scale = useSelector((state) => state.viewState.scale);
    
    
    
    function r (t) {
        return rmax-(t<10000?16:t<100000?9:t<1000000?2:0);
    };

    const outerArc = d3Shape.arc()
                            .innerRadius(r(total))
                            .outerRadius(r(total) * 1.5);
    
    const arcGenerator = d3Shape.arc()
                                .innerRadius(r(total)*0.5)
                                .outerRadius(r(total));

    useEffect(() => {
        if (!data[slicer]) {
            return
        }
        drawChart(data[slicer])
      }, [data, slicer])

    
    const drawChart = useCallback((arcData) => {
        const pieData = d3Shape.pie()
                               .startAngle(0)
                               .value(d => d.data)(arcData);
        
        const svg = d3Select.select(mapItemRef.current);

        const container = svg.select('g')

        container.selectAll('rect, .description').remove();

        const arc = container.selectAll('path')
                             .data(pieData);
            
        arc.enter()
           .append('path')
           .merge(arc)
           .attr('d', arcGenerator)
           .attr('class', 'pieArc')
           .attr('id', (d) => ((((description+d.data.key.replaceAll(' ', '')).replaceAll("|","")).replaceAll("-","")).replaceAll("/","")).replaceAll("&",""))
           .style('fill', (d) => colorSuppliersHEX(d.data.key))
           .style('fill-opacity', 0.8)
           .style("cursor", "pointer")
           .on('mouseover', function(e, d) {
            const thisTotal = d.data.data
            
            d3Select.select(this)
                    .transition()
                    .duration(200)
                    .style('fill-opacity', 0.6)
            
            d3Select.select(circleTextRef.current)
                    .transition()
                    .duration(500)
                    .text(Number(thisTotal/1000).toFixed(2)+'K')
           
            setChartData(d.data.chartData)
            setChartHeading(`${d.data.key}: ${d.data.data}`)
           })
           .on('mouseout', function() {
            d3Select.select(this)
                    .transition()
                    .duration(500)
                    .style('fill-opacity', 0.8)
            
            d3Select.select(circleTextRef.current)
                    .transition()
                    .duration(200)
                    .text(Number(total/1000).toFixed(1)+'K')
           })
           .on('click', function(e,d) {
            const displaySetting = d3Select.select(tooltipRef.current)
                                           .style('display')
            
            const newDisplay = displaySetting === 'block'? 'none':'block'
            d3Select.select(tooltipRef.current)
                    .style('left', e.offsetX + 'px')
                    .style('top', e.offsetY + 'px')
                    .style('display', newDisplay)
           })
           .transition()
           .duration(400)
        //    .attrTween('d', function(d) {
        //     const i = d3.interpolate(d.startAngle+0.1, d.endAngle)
        //     return function(t) {
        //         d.endAngle = i(t)
        //         return arcGenerator(d)
        //     }
        //    })

        arc.append('title')
           .text((d) => d.data.key+": Click for more details")

        arc.exit()
           .remove()

        container.append('rect')
                 .attr('y', -r(total) -27)
                 .attr('x', -description.length*4.5)
                 .attr("width", description.length*9)
                 .attr("height", 25)
                 .attr("rx", 5)
                 .attr("ry", 5)
                 .attr("opacity", 0.8)
                 .style('fill',"#29323c")
                 .on('mouseover', function(e){
                    d3Select.select(this)
                            .transition()
                            .duration(200)
                            .attr("fill-opacity", 0.7)
                            .style("cursor","pointer")
                    setChartData(data)
                    setChartHeading(`${description}: ${total}`)
                 })
                 .on('mouseleave', function() {
                    d3Select.select(this)
                            .transition()
                            .duration(200)
                            .attr("fill-opacity", 1)
                            .style("cursor","inherit")
                 })
                 .on('click', function(e,d) {
                    const displaysetting = d3Select.select(tooltipRef.current).style('display')
                    const newdisplay = displaysetting=='block'?'none':'block'
                    d3Select.select(tooltipRef.current)
                            .style("left", e.offsetX + "px")
                            .style("top", e.offsetY + "px")
                            .style('display',newdisplay)
                 })
                 .append('title')
                 .text(description+": Click for more details")
        container.append('text')
                .attr("class","description")
                .attr("y", -r(total) - 11)
                .text(function() { return description })
                .style('fill',"white")
                .style('text-anchor','middle')
                .on('mouseover', function() {
                    setChartData(data)
                    setChartHeading(`${description}: ${total}`)
                    d3Select.select(this)
                            .attr("fill-opacity", 0.7)
                            .style("cursor","pointer")
                })
                .on('mouseleave', function() {
                    d3Select.select(this)
                            .attr("fill-opacity", 1)
                            .style("cursor","inherit")
                })
                .on('click', function(e,d) {
                    const displaysetting = d3Select.select(tooltipRef.current).style('display')
                    const newdisplay = displaysetting=='block'?'none':'block'

                    d3Select.select(tooltipRef.current)
                            .style("left", e.offsetX + "px")
                            .style("top", e.offsetY + "px")
                            .style('display',newdisplay)
                })
                .append('title')
                .text(description+": Click for more details")
    })

    const closeTool = useCallback(() => {
        d3Select.select(tooltipRef.current)
                .style("display","none")
    })

    return (
        !total? (<></>) : (
            <div id={id} key={id} className={'markerChart'}>
                <svg
                    ref={mapItemRef}
                    transform={`scale(${scale})`}
                    overflow="visible" 
                    height={scale*80} 
                    width={scale*80}>
                        <circle
                            ref={circleRef}
                            fill="grey"
                            r={r(total)*0.55} 
                            transform={`translate(${scale*40}, ${scale*40})`}
                            >
                        </circle>
                        <text
                            ref={circleTextRef}
                            style={{fill:"white"}} 
                            textAnchor="middle" 
                            dy={".3em"} 
                            transform={`translate(${scale*40}, ${scale*40})`}
                            fontSize={textSize}>
                                {total===0?0:Number(total/1000).toFixed(1)+"K"}
                        </text>
                        <circle
                            className="tempCircle"
                            fill="grey"
                            r={r(total)*0.55} 
                            transform={`translate(${scale*40}, ${scale*40})`}
                            fillOpacity={0}
                            >
                        </circle>
                        <text
                            className="tempCircleText"
                            style={{fill:"white", fillOpacity:0}} 
                            textAnchor="middle" dy={".3em"} 
                            transform={`translate(${scale*40}, ${scale*40})`}
                            fontSize={13}
                            >
                                {total===0?0:Number(total/1000).toFixed(1)+"K"}
                        </text>
                        <g transform={`translate(${scale*40}, ${scale*40})`}/>
                    </svg>
                    <div ref={tooltipRef} id="tooltip" style={{left:"0px", top:"0px"}}>
                        <button onClick={closeTool} style={{float:"right"}}>Close</button>
                        <p id="heading"><strong>{chartHeading}</strong></p>
                        <TooltipChart key={description} id="chart" data={chartData}></TooltipChart>
                    </div>
   </div>
        )
    )
};

export default D3PieCharts;