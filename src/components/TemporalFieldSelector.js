import * as React from 'react';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { alpha, Typography } from '@mui/material';
import { setField } from '../redux/temporalSlice';


const TemporalFieldSelector = (props) => {
    const { open, closeClick, openClick } = props;
    const [value, setValue] = useState();
    const [currentKey, setCurrentKey] = useState("");
    const timeData = useSelector((state) => state.temporalState);
    const radioGroupRef = useRef(null);
    const wid = 100 / Object.keys(timeData.fields).length;
    const dispatch = useDispatch()

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    const handleOkay = (e) => {
        dispatch(setField({fieldName:currentKey, value: value}))
    }

    
    return (
        <div>
            <List component={"div"} role='group' orientation='horizontal' sx={{padding: 1}}>Select corresponding field values:
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                }}>
                    {Object.entries(timeData.fields).map(([key, data]) => (
                        <ListItem key={key} sx={{borderRight: `1px solid ${alpha("#575959", 0.7)}`, width:`${100/Object.entries(timeData.fields).length}%`}} button onClick={() => {openClick();setCurrentKey(key); setValue(data)}}>
                            <ListItemText secondary={<Typography fontSize={10} style={{ color: '#c7c7c5', wordWrap:"break-word" }}>{data}</Typography>}>{key}<span style={{color:"red"}}>*</span></ListItemText>
                        </ListItem>
                    ))
                    }
                </div>
            </List>
            <Dialog open={open} >
                <DialogTitle>Select {currentKey} field</DialogTitle>
                <DialogContent dividers>
                    <RadioGroup
                        ref={radioGroupRef}
                        key={currentKey}
                        value={value}
                        onChange={(e) => handleChange(e)}
                    >
                        {Object.keys(timeData.data[0]).map((dataKey) => (
                            <FormControlLabel
                                value={dataKey}
                                key={dataKey}
                                control={<Radio />}
                                label={dataKey}
                            />
                        ))}
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button sx={{ textTransform: 'none' }} autoFocus onClick={() => closeClick()}>Cancel</Button>
                    <Button sx={{ textTransform: 'none' }} onClick={(e) => {handleOkay(e); closeClick()}}>Ok</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default TemporalFieldSelector
