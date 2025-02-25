
import { alpha } from "@mui/material";
import TemporalAdjusters from "./TemporalAdjusters";


const TemporalControl = () => {

  

    return (
        <div style={{
            borderRight: `1px solid ${alpha("#575959", 0.7)}`,
            width:"98%",
            height: "100%",
            padding: 5
            }}>
            <TemporalAdjusters />  
        </div>
    )
}

export default TemporalControl
