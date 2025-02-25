import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { alpha, Divider } from "@mui/material";
import { Checkbox, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { slicers, 
         sumByValues, 
         changeViewType, 
         changeInclusionState, 
         changeSlicer,
         changeSumBy } from '../redux/viewStateSlice';



const btnStyle = {
    display: "flex",
    fontFamily: "sans-serif",
    fontSize: 12,
    color: "white",
    "&:hover": {
        color: "white",
        opacity: 0.8
    },
    "&.Mui-selected": {
        color: "white"
    }
};

const RadioSwitch = (props) => {
    const viewType = useSelector((state) => (state.viewState.viewType));
    const radioList = useSelector((state) => (state.viewState.inclusionState));
    const mainSliceValues = slicers[viewType];
    const selectedSlicer = useSelector((state) => (state.viewState.slicer));
    const sumBy = sumByValues[viewType];
    const selectedSumBy = useSelector((state) => (state.viewState.sumBy));
    const fid = useSelector((state) => state.viewState.fid);
    const viewLevel = useSelector((state) => state.viewState.viewLevel);
    const dispatch = useDispatch();

    return (
        !radioList ? (
            <></>
        ) : (
            <div style={{
                marginLeft: "5%",
                marginTop: "5%",
                width: "95%",
                height: "98%"
            }}>
                
                <Divider sx={{borderBottom: `1px solid ${alpha("#575959", 0.7)}`}}/>
                <Box 
                    component="div"
                    fontSize={15}
                >Slice by:</Box>
                <FormControl
                    fullWidth={true}
                >
                    <RadioGroup
                        row={true}
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={selectedSlicer}
                        onChange={(e) => dispatch(changeSlicer(e.currentTarget.value))}
                    >
                        {Object.entries(mainSliceValues).map(([key,value]) => (
                            <FormControlLabel
                                value={key}
                                key={"rb"+key}
                                control={<Radio size='small' sx={{
                                    color: "white",
                                    "&.Mui-checked": {
                                        color: "white"
                                    }
                                }}/>}
                                label={<Box component="div" fontSize={12}>
                                    {value}
                                </Box>}
                                sx={{color:"white"}}
                            ></FormControlLabel>
                        ))}
                    </RadioGroup>
                </FormControl>
                <Divider sx={{ borderBottom: `1px solid ${alpha("#575959", 0.7)}`}}/>
                <Box component="div" fontSize={15}>
                    Sum/Count by:
                </Box>
                <FormControl fullWidth={true}>
                    <RadioGroup
                        row={true}
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={selectedSumBy}
                        onChange={(e) => dispatch(changeSumBy(e.currentTarget.value))}
                    >
                        {Object.entries(sumBy).map(([key, value]) => (
                            <FormControlLabel
                                value={key}
                                key={"rb"+key}
                                control={<Radio size="small" sx={{
                                    color: "white",
                                    "&.Mui-checked": {
                                        color: "white"
                                    }
                                }}/>}
                                label={<Box component={"div"} fontSize={12}>
                                    {value}
                                </Box>}
                                sx={{color: "white"}}
                            ></FormControlLabel>
                        ))}
                    </RadioGroup>
                </FormControl>
            </div>
        )
    )

};

export default RadioSwitch;