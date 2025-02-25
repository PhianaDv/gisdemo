import { useCallback, useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
import { changeRadiusScale,
        changeHeightScale,
        changeTimeLapse, 
        timeLapse,
        changeAnimationMultiplier,
        heightMarks,
        radiusMarks,
        animationMarks, 
        changeColor,
        changeLoadSlider } from "../redux/temporalSlice";
import { Button, Slider, alpha, Tooltip, IconButton, FormControl, RadioGroup, FormControlLabel, Radio, Box, Typography, Stack, Divider } from "@mui/material";
import { FaEye, FaEyeSlash, FaCheck, FaTimes, FaFilter } from "react-icons/fa";
import { changeLayerVisibilty, totalsLayerToggle } from "../redux/layerSlice";
import { ChromePicker } from "react-color";
import { sliderSetTempTimeFilter, clearTempTimeFilter } from "../redux/dataFilterSlice";
import { changeFilterRange } from "../redux/temporalSlice";






const TemporalAdjusters = () => {
    const dispatch = useDispatch();
    const timeData = useSelector((state) => state.temporalState);
    const timeLayer = useSelector((state) => state.layerState.Layers.temporalLayer);
    const [openColor, setOpenColor] = useState(false);
    const [position, setPosition] = useState({x:0,y:0});
    const [key, setKey] = useState();
    const [color, setColor] = useState();
    const path = process.env.PUBLIC_URL;
    const image = "/stopwatch.png";
    const imageUrl = `url(${path + image})`;
    const initialTimeFilter = useSelector((state) => state.pointJsonState.timeRange)
    
    const layersToggle = useCallback((e) => {
        dispatch(changeLayerVisibilty(e.currentTarget.id))
      });

    const sliderToggle = useCallback((e) => {
        dispatch(changeLoadSlider(e.currentTarget.id))
        dispatch(totalsLayerToggle())
        
    });

    const valuetext = useCallback((value) => {
        return `${value}`;
      });

    const positioning = useCallback((e, key) => {
        setKey(key)
        setOpenColor(true)
        const newRight = window.innerWidth-e.pageX;
        const newBottom = window.innerHeight - e.pageY;

        setPosition({x:newRight,y:newBottom})

    })

    useEffect(() => {
        if (!key) {
            return
        };
        setColor(timeData.colorRange[key].value)
        
    },[key])

    const colorChange = useCallback(() => {
        dispatch(changeColor({key: key, value: color}));
        setOpenColor(false)

    });

    const cancelColor = useCallback(() => {
        setOpenColor(false)
    })
  return (
    <div style={{display: "flex", flexDirection: "column"}}>
        <div style={{
            display:"flex", 
            flexDirection:"row", 
            width: "100%",
            alignSelf:"flex-start",
            borderTop: `1px solid ${alpha("#575959", 0.7)}`,
            borderBottom: `1px solid ${alpha("#575959", 0.7)}`,
            padding: 4
            }}>
            <div style={{padding: 4}}>Show Time Slider (This will disable cluster Layer)</div>
            <Tooltip
                key={"tt" + "timeSliderVisible"}
                title={!timeData.loadSlider ? "Show" : "Hide"}
                placement="bottom"
              >
                <IconButton size="small" id={timeLayer.id}>
                  {!timeData.loadSlider ? (
                    <FaEyeSlash size="20px" color="white" onClick={(e) => {sliderToggle(e)}} />
                  ) : (
                    <FaEye size="20px" color="white" onClick={(e) => {sliderToggle(e)}}/>
                  )}
                </IconButton>
              </Tooltip>
    </div>
         <div style={{
                    display: "flex",
                    flexDirection: "row",
                    marginLeft: "2%",
                    marginTop: "0.5%",
                }}>
                <div style={{width: "100%", alignSelf: "center"}}>Select time slider type:
                    <FormControl fullWidth={true}>
                        <RadioGroup
                            row={true}
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={timeData.timeLapse}
                            onChange={(e) => {dispatch(changeTimeLapse(e.currentTarget.value))}}>
                            {Object.entries(timeLapse).map(([key, value]) => (
                                <div id={key}
                                    key={key}
                                    style={{width:`${100/Object.entries(timeLapse).length}%`}}
                                >
                                    <FormControlLabel
                                        value={key}
                                        key={"rb" + key}
                                        control={<Radio size="small" sx={{
                                            color: "white",
                                            "&.Mui-checked": {
                                                color: "white"
                                            }
                                        }} />}
                                        label={<Box component="div" fontSize={14}>
                                            {value}
                                        </Box>}
                                        sx={{ color: "white" }}>

                                    </FormControlLabel>
                                </div>
                            ))}
                        </RadioGroup>
                    </FormControl>
                    
                </div>
                
                </div>
        <div style={{
            display:"flex", 
            flexDirection:"row", 
            width: "100%",
            alignSelf:"flex-start",
            borderTop: `1px solid ${alpha("#575959", 0.7)}`,
            borderBottom: `1px solid ${alpha("#575959", 0.7)}`,
            padding: 4
            }}>
            <div style={{padding: 4}}>Time Layer Visibility</div>
            <Tooltip
                key={"tt" + "timeLayerVisible"}
                title={timeLayer.visible === false ? "Show" : "Hide"}
                placement="bottom"
              >
                <IconButton size="small" id={timeLayer.id} onClick={layersToggle} disabled={!timeData.loadSlider}
                sx={{
                  color: "white", 
                  "&.Mui-disabled": {
                    color: "gray", 
                    opacity: 0.5,
                  }
                }}>
                  {timeLayer.visible === false ? (
                    <FaEyeSlash size="20px"/>
                  ) : (
                    <FaEye size="20px"/>
                  )}
                </IconButton>
              </Tooltip>
    </div>
    <div style={{paddingBottom: 15, borderBottom: `1px solid ${alpha("#575959", 0.7)}`}}>
    <Stack padding={1} spacing={2} direction={"row"} alignItems="center">
    <Typography alignSelf="center" fontSize={14} width={"32%"}>Radius</Typography>
      <Slider
        key={"radiusScale"}
        size="small"
        min={1}
        max={100}
        value={timeData.radiusScale}
        onChange={(event, newValue) => dispatch(changeRadiusScale(newValue))}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        sx={{
            marginRight: '4%', 
            color:"white", 
            '& .MuiSlider-markLabel' : {
                color: "lightgray",
                fontSize: 10
            }
        }}
        marks={radiusMarks}
      />
    </Stack>
    <Stack padding={1} spacing={2} direction={"row"} alignItems="center">
    <Typography alignSelf="center" fontSize={14} width={"32%"}>Height</Typography>
      <Slider
        key={"heightScale"}
        size="small"
        min={0}
        max={100}
        value={timeData.heightScale}
        onChange={(event, newValue) => dispatch(changeHeightScale(newValue))}
        valueLabelDisplay="auto"
        sx={{
            marginRight: '4%', 
            color:"white", 
            '& .MuiSlider-markLabel' : {
                color: "lightgray",
                fontSize: 10
            }
        }}
        marks={heightMarks}
      />
    </Stack>
    <Stack padding={1} spacing={2} direction={"row"} alignItems="center">
    <Typography alignSelf="center" fontSize={14} width={"32%"}>Speed</Typography>
      <Slider
        key={"animationMultiplier"}
        size="small"
        track={false}
        min={0.25}
        max={2.00}
        value={timeData.animationMultiplier}
        onChange={(event, newValue) => dispatch(changeAnimationMultiplier(newValue))}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        sx={{
            marginRight: '4%', 
            color:"white", 
            '& .MuiSlider-markLabel' : {
                color: "lightgray",
                fontSize: 10
            },
            '& .MuiSlider-thumb': {
                width: 20,
                height: 20,
                backgroundImage: `${imageUrl}`,
                backgroundSize: "100%",
            },
        }}
        marks={animationMarks}
        step={0.25}
        
      />
    </Stack>
    </div>
    <div style={{marginTop:2, marginLeft:"2%"}}>
    {Object.entries(timeData.colorRange).map(([key,value]) => (
        <Stack padding={0.5} spacing={2} direction={"row"} alignItems="center">
            <Typography alignSelf="center" fontSize={12} width={"50%"}>{value.label}</Typography>
            <Button 
                onClick={(e) => {positioning(e, key)}}
                sx={{ 
                    width: "40%", 
                    height: "80%", 
                    backgroundColor: `${value.value}`,
                    '&:hover': {
                        backgroundColor: `${value.value}`,
                        opacity: 0.8
                        }
                }}
                />
        </Stack>
    ))}
    </div>
    {!openColor ? (<></>) : (
        <div style={{
            boxShadow: "0px 0px 0px 5px rgb(15, 86, 68,0.6)",
            zIndex: 1, 
            bottom: `${position.y}px`, 
            right: `${position.x}px` , 
            position: "fixed"}}>
        <Button 
            variant="contained" 
            fullWidth={true}
            onClick={cancelColor}
            color="error"
            sx={{
                textTransform: 'none', 
                borderRadius: 0,
                }}>
                <FaTimes style={{marginRight: 5}}/>Cancel</Button>
        <ChromePicker  
            color={color} 
            onChange={(e) => setColor(e.hex)}
           />
        <Button 
            variant="contained" 
            fullWidth={true}
            onClick={colorChange}
            sx={{
                textTransform: 'none', 
                backgroundColor: `${color}`,
                borderRadius: 0,
                '&:hover': {
                    backgroundColor: `${color}`,
                    opacity: 0.8
                    }
                }}>
                <FaCheck style={{marginRight: 5}}/>Done</Button>
        
        
        </div>
    )}
    <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
    <Tooltip title="Apply selected time filters to all data">
        <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(sliderSetTempTimeFilter(timeData.filterRange))}
            startIcon={<FaFilter />}
            sx={{ marginRight: "10px", textTransform: 'none' }}
        >
            Apply Filter
        </Button>
    </Tooltip>
    <Tooltip title="Clear all time filters">
        <Button
            variant="contained"
            color="primary"
            onClick={() => {dispatch(clearTempTimeFilter()); dispatch(changeFilterRange(initialTimeFilter))}}
            startIcon={<FaTimes />}
            sx={{ textTransform: 'none' }}
        >
            Clear Filter
        </Button>
    </Tooltip>
</div></div>
  )
}

export default TemporalAdjusters
