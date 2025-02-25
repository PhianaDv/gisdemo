import './Tooltip.css';
import {
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    CartesianGrid, 
    ResponsiveContainer, 
    Cell, 
    Text, 
    Legend, 
    LineChart, 
    Line, 
    ScatterChart, 
    Scatter, 
    Label, 
    CartesianAxis
} from 'recharts';
import * as d3 from 'd3'; 
import { useCallback } from 'react';
import { colorSuppliersHEX } from '../assets/MyColors';

const TooltipChart = (props) => {
    const {data} = props
/* eslint-disable */
    const CustomTooltip = useCallback(({ active, payload }) => {
        if (active && payload && payload.length) {
      
            return (
              <div style={{
              backgroundColor:"white", 
              borderRadius:"3px", 
              paddingBottom: "1px", 
              paddingTop: "1px",
              paddingLeft: "2px", 
              paddingRight: "2px"}} className="custom-tooltip">
                <p style={{color:"black", fontSize:"12px"}}  className="label">{`${payload[0].payload.key} : ${payload[0].payload.data}`}</p>
                
              </div>
            );
          }
        
          return null;
    })
    const CustomXAxisTick = useCallback(({ x, y, payload }) => {
        if (payload && payload.value) {
            return (
                <Text
                    fontSize={"12px"}
                    style={{fill:"none"}}
                    //width={"12px"}
                    x={x} 
                    y={y} 
                    textAnchor="middle" 
                    verticalAnchor="start"
                    //scaleToFit={true}
                    angle={270}
                >{payload.value}</Text>
              );
        }
        return null
    })
const verticalPoints = useCallback((countx) => {
    const chartWidth = 200;     
    const xAxisLeftMargin = 15;  
    const xAxisRightMargin = 5;
    const xPadding = 0;          // padding set on both sides of xAxis
    const yAxisWidth = 50;      // total widths of all yAxes
    const leftX = 0 + yAxisWidth + xAxisLeftMargin + xPadding;
    const rightX = chartWidth - xPadding - xAxisRightMargin;
    const xScale = d3.scaleLinear().domain([0,countx]).range([leftX, rightX]);
    let vertPoints = []
    for (let i=0;i<=countx;i++) {
        vertPoints.push(xScale(i))
    }
    return vertPoints

})

const horizontalPoints = useCallback((countx) => {
    const chartWidth = 200;      // width set on our chart object
    const yAxisBottomMargin = -50;  // margins set on our chart object
    const yAxisTopMargin = 70;
    const xPadding = 0;          // padding set on both sides of xAxis
    const yAxisWidth = 50;      // total widths of all yAxes
    const bottomY = 0 + yAxisWidth + yAxisBottomMargin + xPadding;
    const topY = chartWidth - xPadding - yAxisTopMargin;
    //note that rightX assumes there are no axes on the right hand side
    const xScale = d3.scaleLinear().domain([0,countx]).range([5, 115]);
    let points = []
    for (let i=0;i<5;i++) {
        const point=countx/4*i
        points.push(xScale(point))
    };
    return points;

})

  return (
    !data? (<></>) : (
        <div width={400} height={300} style={{display: "grid", gridTemplateColumns:"auto auto"}}>
            {Object.entries(data).map(([key, value],index) => (
                index%2? (
                    <ResponsiveContainer width={200} height={150}>
                            <BarChart height={"150"} width={"200"} data={value}>
                                    <XAxis angle={90} tickSize={0} dataKey="key" stroke="white" tick={<CustomXAxisTick/>}>
                                        <Label value={key} offset={0} position="inside" style={{fill:"white"}}/>
                                    </XAxis>
                                    <YAxis allowDataOverflow={true} stroke="white"/>
                                    <Tooltip content={<CustomTooltip />}/>
                                    <CartesianGrid
                                        verticalPoints={verticalPoints(Object.keys(value).length)} 
                                        stroke="white" 
                                        strokeDasharray="2 2" 
                                        strokeWidth={0.2}
                                        horizontalPoints={horizontalPoints(Math.max(...value.map(o => o.data)))}
                                    />
                                    <Bar dataKey="data" fill="#8884d8" barSize={30}>
                                        {
                                            Object.entries(value).map(([key,value]) => (
                                                <Cell key={`cell-${key}`} fill={colorSuppliersHEX(value.key)} />
                                            ))
                                        }
                                    </Bar>
                            </BarChart>
                    </ResponsiveContainer>
                ): (
                    <ResponsiveContainer width={200} height={150}>
                        <ScatterChart Chartheight={"150"} width={"200"} data={value}>
                            <XAxis angle={90} tickSize={0} dataKey="key" stroke="white" tick={<CustomXAxisTick/>}>
                                <Label value={key} offset={0} position="inside" style={{fill:"white"}}/>
                            </XAxis>
                            <YAxis stroke="white"/>
                            <Tooltip content={<CustomTooltip />}/>
                            <CartesianGrid 
                                verticalPoints={verticalPoints(Object.keys(value).length)} 
                                stroke="white" 
                                strokeDasharray="2 2" 
                                strokeWidth={0.2}
                                horizontalPoints={horizontalPoints(Math.max(...value.map(o => o.data)))}
                            />
                            <Scatter dataKey="data" fill="#8884d8" barSize={30}>
                                {
                                    Object.entries(value).map(([key,value]) => (
                                        <Cell key={`cell-${key}`} fill={colorSuppliersHEX(value.key)} />
                                    ))
                                }
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                )
            ))}
        </div>
        )
    )
/* eslint-disable */}

export default TooltipChart
