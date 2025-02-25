import { useDispatch, useSelector } from "react-redux";
import { useRef, useEffect, useCallback, useState } from "react";
import { pointOpen } from "../redux/pointDetailSlice";
import * as d3Select from 'd3-selection';


const PointTip = (props) => {
    
    const pointRef = useRef(null)
    const pointDetail = useSelector((state) => state.pointDetailState.data);
    const openPoint = useSelector((state) => state.pointDetailState.open);
    const viewType = useSelector((state) => state.viewState.viewType)
    const dispatch = useDispatch()
    const [heading, setHeading] = useState(null)
    

    useEffect(() => {
    
        if (pointDetail.length===0) {
            return
        }
        content();
        pointRef.current.style.left = pointDetail.x + "px";
        pointRef.current.style.top = pointDetail.y + "px";

        const data = viewType == 'Permits'
            ? `Permit Number: ${pointDetail.pointDetail[0].permit_number}` 
            : `${pointDetail.accountId} | Estimated Cost: $${Number(pointDetail.estimated_cost).toFixed(2)}`;
        setHeading(data)
    },[pointDetail])

    const open = !openPoint? 'none' : 'block';
    
    const content = useCallback(() => {

        if (viewType==="Customers" && pointDetail.pointDetail.length===0) {
            d3Select.select(pointRef.current)
            .select('table')
            .remove();
        
            d3Select.select(pointRef.current)
            .selectAll('.dataLines')
            .remove();

            d3Select.select(pointRef.current)
            .selectAll('.NoProducts')
            .remove();  

            d3Select.select(pointRef.current)
            .append('p')
            .attr('class', 'NoProducts')
            .text('No products')
        } else if (viewType==="Customers" && pointDetail.pointDetail.length!==0) {
        
        d3Select.select(pointRef.current)
        .select('table')
        .remove();
        
        d3Select.select(pointRef.current)
        .selectAll('.dataLines')
        .remove();

        d3Select.select(pointRef.current)
        .selectAll('.NoProducts')
        .remove();  

        const table = d3Select.select(pointRef.current)
        .append('table')
        .style('border', '1px solid')
        .style('border-color',"white")
        
        const thead = table.append('thead')
        .style('color','white')
             
        const tbody = table.append('tbody')
        .style('color','white');

        const columns = Object.keys(pointDetail.pointDetail[0])
      
        thead.append('tr')
        .selectAll('th')
        .data(columns).enter()
        .append('th')
        .style('border', '1px solid')
        .style('border-color',"white")
        .text(function (column) { return column; });
      
        const rows = tbody.selectAll('tr')
        .data(pointDetail.pointDetail)
        .enter()
        .append('tr');
      
        const cells = rows.selectAll('td')
        .data(function (row) {
                return columns.map(function (column) {
                return {column: column, value: row[column]};
                });
             })
        .enter()
        .append('td')
        .style('border', '1px solid')
        .style('border-color',"white")
        .text(function (d) { return d.value; });
        } else {
              
        d3Select.select(pointRef.current)
        .select('table')
        .remove();
        
        d3Select.select(pointRef.current)
        .selectAll('.dataLines')
        .remove();
      
        const table = d3Select.select(pointRef.current)
        .append('p')
        .attr("class", "dataLines")
        .style('color',"white")
        .text(`Primary Address: ${pointDetail.pointDetail[0].primary_address_flag===0?"Yes":"No"}`)
        .append('p')
        .attr("class", "dataLines")
        .style('color',"white")
        .text(`Existing Use: ${pointDetail.pointDetail[0].existing_use}`)
        .append('p')
        .attr("class", "dataLines")
        .style('color',"white")
        .text(`Proposed Use: ${pointDetail.pointDetail[0].proposed_use}`)
        .append('p')
        .attr("class", "dataLines")
        .style('color',"white")
        .text(`Status: ${pointDetail.pointDetail[0].status}`)
        .append('p')
        .attr("class", "dataLines")
        .style('color',"white")
        .text(`Permit Creation Date: ${pointDetail.pointDetail[0].permit_creation_date}`)
        .append('p')
        .attr("class", "dataLines")
        .style('color',"white")
        .text(`Issued Date: ${pointDetail.pointDetail[0].issued_date}`)
        .append('p')
        .attr("class", "dataLines")
        .style('color',"white")
        .text(`Completed Date: ${pointDetail.pointDetail[0].completed_date}`)
        .append('p')
        .attr("class", "dataLines")
        .style('color',"white")
        .text(`Permit Type: ${pointDetail.pointDetail[0].permit_type_definition}`)
        .append('p')
        .attr("class", "dataLines")
        .style('color',"white")
        .text(`Proposed Construction Type: ${pointDetail.pointDetail[0].proposed_construction_type}`)
        .append('p')
        .attr("class", "dataLines")
        .style('color',"white")
        .text(`Stories Tier: ${pointDetail.pointDetail[0].stories_tier}`)
        .append('p')
        .attr("class", "dataLines")
        .style('color',"white")
        .text(`Proposed Stories: ${pointDetail.pointDetail[0].number_of_proposed_stories}`)
        .append('p')
        .attr("class", "dataLines")
        .style('color',"white")
        .text(`Units Tier: ${pointDetail.pointDetail[0].proposed_units_tier}`)
        .append('p')
        .attr("class", "dataLines")
        .style('color',"white")
        .text(`Proposed Units: ${pointDetail.pointDetail[0].proposed_units}`)
        .append('p')
        .attr("class", "dataLines")
        .style('color',"white")
        .text(`Proposed Occupancy: ${pointDetail.pointDetail[0].proposed_occupancy}`)
        .append('p')
        .attr("class", "dataLines")
        .style('color',"white")
        .text(`Estimated Cost: $${Number(pointDetail.pointDetail[0].estimated_cost).toFixed(2)}`)
        .append('p')
        .attr("class", "dataLines")
        .style('color',"white")
        .text(`Revised Cost: $${Number(pointDetail.pointDetail[0].revised_cost).toFixed(2)}`)
        .append('p')
        .attr("class", "dataLines")
        .style('color',"white")
        .text(`Description: ${pointDetail.pointDetail[0].description}`)
        }
      },)
      
  return (
    <div 
        ref={pointRef} 
        id="pointtooltip" 
        style={{left:"0px", top:"0px", display:`${open}`}}>
        <button 
            onClick={() => dispatch(pointOpen(false))} 
            style={{float:"right"}}
        >Close</button>

        <p id="heading">
            <strong>{heading}</strong>
        </p>
        </div>
  )
}

export default PointTip
