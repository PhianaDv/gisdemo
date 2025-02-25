import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { alpha } from "@mui/material";
import { mapStyle } from "../redux/viewStateSlice";
import { changeMapStyle } from "../redux/viewStateSlice";
import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from "react";

export default function ToggleButtons() {
  
    const dispatch =  useDispatch();
    const style = useSelector((state) => state.viewState.mapStyle);
    const updateStyle = useCallback((value) => {
        dispatch(changeMapStyle(value));
    })
  const btnStyle = {
    display: "flex",
    fontFamily: "sans-serif",
    fontSize: 12,
    textTransform: "capitalize",
    height: "33.3%",
    borderRadius: 0,
    border: 0,
    boxSizing: "border-box",
    color: "white",

    "&:hover": {
      color: "white",
      backgroundColor: "#B7BBBA",
      opacity: 0.7
    },
    "&.Mui-selected": {
      color: "white",
      backgroundColor: alpha("#363838", 0.8),
      borderBottom: 2,
      borderColor: "#232424",
      boxSizing: "border-box"
    }
  };
  return (
    <ToggleButtonGroup
      value={style}
      exclusive
      onClick={(e) => updateStyle(e.target.value)}
      orientation={"vertical"}
      sx={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box"
      }}
    >
      <ToggleButton value={mapStyle.Dark} sx={btnStyle}>
        Dark
      </ToggleButton>
      <ToggleButton value={mapStyle.Light} sx={btnStyle}>
        Light
      </ToggleButton>
      <ToggleButton value={mapStyle.Hybrid} sx={btnStyle}>
        Hybrid
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
