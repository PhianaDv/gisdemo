import { Checkbox, Box, TextField, Tooltip } from "@mui/material";
import { FormControlLabel } from '@mui/material';
import * as d3Select from 'd3-selection';
import { useEffect, useRef, useState } from "react";
import * as d3Shape from 'd3-shape';
import { colorSuppliersHEX } from "../assets/MyColors";
import { useSelector, useDispatch } from "react-redux";
import { changeSlicerCheckedValue, clearAllAttribute, selectAllAttribute } from "../redux/dataFilterSlice";
import { slicers } from "../redux/viewStateSlice";
import { alpha } from "@mui/material";

export const Legend = () => {
    const legendData = useSelector((state) => state.dataFilterState);
    const checkBoxRef = useRef(null);
    const selectedValue = useSelector((state) => (state.viewState.viewType));
    const chartSelected = useSelector((state) => state.dataFilterState.tempSlicerValue);
    const mainSliceValues = slicers[selectedValue];
    const [borderHeight, setBorderHeight] = useState("1000%");
    const [searchQuery, setSearchQuery] = useState("");
    const dispatch = useDispatch();

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    useEffect(() => {
        let lArray = [];
        legendData.slicerValues.map(el => {
            lArray.push(JSON.parse(el.value).length * 56);
        });
        setBorderHeight(Math.max(...lArray));

    }, [legendData.slicerValues]);

    return (
        !legendData.slicerValues ? (<></>) : (<div style={{ display: "flex", flexDirection: "column", padding: "10px" }}>
            <div style={{ paddingBottom: "10px" }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={handleSearchChange}
                    size="small"
                    sx={{
                        '& .MuiInputLabel-root': {
                            color: 'white',
                        },
                        '& .MuiOutlinedInput-root': {
                            color: 'white',
                            '& fieldset': {
                                borderColor: 'white',
                            },
                            '&:hover fieldset': {
                                borderColor: 'white',
                            },
                        },
                    }}
                />
            </div>
        
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: `repeat(${legendData.slicerValues.length}, 1fr)`, 
                gap: "10px" ,
                width: "100%"
            }}>
                {legendData.slicerValues.map(
                    el => (
                        <div style={{
                            padding: 4,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            borderRight: `1px solid ${alpha("#575959", 0.7)}`,
                            
                        }}
                            key={el.attribute}>
                            <div style={{
                                height: "60px",
                                backgroundColor: `${alpha("#575959", 1)}`,
                                zIndex: 10000,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <Box component="div" fontSize={14} padding={1}>
                                    {mainSliceValues[el.attribute]}
                                </Box>
        
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: "10px" }}>
                                    <button 
                                        disabled={el.attribute === chartSelected.attribute} 
                                        variant="contained" 
                                        onClick={(e) => dispatch(selectAllAttribute(el.attribute))}>
                                        Select All
                                    </button>
                                    <button 
                                        disabled={el.attribute === chartSelected.attribute} 
                                        variant="contained" 
                                        onClick={(e) => dispatch(clearAllAttribute(el.attribute))}>
                                        Clear All
                                    </button>
                                </div>
                            </div>
        
                            <div style={{
                                marginTop: "2px",
                                marginLeft: "2.5%",
                                display: "flex",
                                flexDirection: "column",
                                overflowY: "auto",
                                
                            }}>
                                {JSON.parse(el.value)
                                    .filter(obj => obj.key && obj.key.toLowerCase().includes(searchQuery.toLowerCase()))
                                    .map(obj => (
                                        <FormControlLabel
                                            key={obj.key}
                                            sx={{ marginTop: 1 }}
                                            control={
                                                <Tooltip title={el.attribute === chartSelected.attribute ? "Unfilter from your charts in Analytics to enable" : ""}>
                                                    <span>
                                                        <Checkbox
                                                            ref={checkBoxRef}
                                                            id={obj.key}
                                                            size={"medium"}
                                                            checked={el.attribute === chartSelected.attribute && obj.key !== chartSelected.value ? false : obj.checked}
                                                            padding={1}
                                                            onClick={() => dispatch(changeSlicerCheckedValue({
                                                                attribute: el.attribute,
                                                                value: obj.key
                                                            }))}
                                                            sx={{
                                                                color: colorSuppliersHEX(obj.key),
                                                                '&.Mui-checked': {
                                                                    color: `${colorSuppliersHEX(obj.key)}`
                                                                },
                                                                '&:hover': {
                                                                    opacity: 0.8
                                                                }
                                                            }}
                                                            disabled={el.attribute === chartSelected.attribute}
                                                        />
                                                    </span>
                                                </Tooltip>
                                            }
                                            label={
                                                <Box component="div" fontSize={12}>
                                                    {obj.key
                                                        .toLowerCase()
                                                        .replace(/\b\w/g, (char) => char.toUpperCase())
                                                        }
                                                </Box>
                                            }
                                        />
                                    ))}
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
        
        )
    );
};

export default Legend;
