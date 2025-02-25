import ToggleButtons from "./ToggleButton";
import ListItems from "./ListItem";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import {
    FaChartBar,
    FaLayerGroup,
    FaRegClock,
    FaRedoAlt,
    FaStepBackward,
    FaCrosshairs
  } from "react-icons/fa";
  import { BsFilterSquareFill } from "react-icons/bs";
  import { ImCogs } from "react-icons/im";
  import { useSelector, useDispatch } from 'react-redux';
  import { useCallback } from "react";
  import { resetBorderState, undo } from "../redux/borderSlice";
  import { switchAnalytics, switchLayers, switchLegend, switchSliders, switchViews } from "../redux/pageStateSlice";
  import { INITIAL_VIEW_STATE, resetViewState, undoViewState, viewLevels, viewLevelFps } from "../redux/viewStateSlice";
  import { useMap } from "react-map-gl";
  import { undoData, resetSummaryState } from "../redux/summarySlice";
  import { resetPageState } from "../redux/pageStateSlice";
  import { resetLayerState } from "../redux/layerSlice";
  import { resetDataFilterState } from "../redux/dataFilterSlice";
  import { resetPointDetailState } from "../redux/pointDetailSlice";
  import { resetTimeState } from "../redux/temporalSlice";
  import { getPointsAsync } from "../redux/pointJsonSlice";


  
const MenuArea = () => {
  const {current: myMap} = useMap();
  const dispatch = useDispatch();
  const flyTo = useSelector((state) => state.borders.flyTo);
  const viewLevel = useSelector((state) => state.viewState.viewLevel);
  const viewType = useSelector((state) => state.viewState.viewType);
  const prevViewLevel = viewLevels.indexOf(viewLevel)-1;
  const prevFid = useSelector((state) => state.viewState.pastFid);
  const pointData = useSelector((state) => state.pointJsonState.data);
  const dataFilters = useSelector((state) => state.dataFilterState)
  const prevViewLevelFp = viewLevelFps[prevViewLevel-1];
  
  
  const reCenter = useCallback(() => {
    
    
      if (flyTo.length === 0) {
        myMap.easeTo({
          center:[INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
          zoom: INITIAL_VIEW_STATE.zoom,
          pitch: 0,
          bearing: 0
        })
      } else {
        myMap.fitBounds(flyTo, {bearing:0, pitch:0,linear: false,padding: 30, duration: 1000})      
      }
  })

  const reload = useCallback(() => {
    dispatch(getPointsAsync());
    dispatch(resetBorderState());
    dispatch(resetViewState());
    dispatch(resetDataFilterState())
    
  }, [dispatch])
  

  const goBack = useCallback(() => {

    if (viewLevels.indexOf(viewLevel) === 0) {
      alert("Already at highest drill level.")
    } else {
      dispatch(undo());
      dispatch(undoViewState());
      dispatch(undoData({
        viewLevelFp: prevViewLevelFp, 
        fid: prevFid.slice(-1)[0],
        data: pointData,
        trueKeys: dataFilters.trueKeys
      })
      );
    }
    
  },[dispatch, viewLevel, viewType, prevFid])

  
  const stateAnalytics = useCallback(() => {
    dispatch(switchAnalytics());
  },[dispatch])
  const stateLayers = useCallback(() => {
    dispatch(switchLayers());
  },[dispatch])
  const stateLegend = useCallback(() => {
    dispatch(switchLegend());
  },[dispatch])
  const stateViews = useCallback(() => {
    dispatch(switchViews());
  },[dispatch])
  const stateSliders = useCallback(() => {
    dispatch(switchSliders());
  },[dispatch])


  return (
        <div className={"MenuArea"}>
        <List
          sx={{
            bgcolor: "#575959",
            height: "100vh",
            boxShadow: 1,
            
          }}
        >
          <CssBaseline />
          <List key="Menu" sx={{ height: "44.4%" }}>
          
            <ListItems
              key={"Analytics"}
              title={"Analytics"}
              myIcon={<FaChartBar />}
              onClick={stateAnalytics}
              height="20%"
            />
            <ListItems
              key={"Layers"}
              title={"Layers"}
              myIcon={<FaLayerGroup />}
              onClick={stateLayers}
              height="20%"
            />
        
            <ListItems
              myKey={"View Legend and Filter"}
              title={"View Legend and Filter"}
              myIcon={<BsFilterSquareFill />}
              onClick={stateLegend}
              height="20%"
            />
            <ListItems
              key={"Configure View"}
              title={"Configure View"}
              myIcon={<ImCogs />}
              onClick={stateViews}
              height="20%"
            />
            <ListItems
              key={"TimeSliders"}
              title={"Temporal Layer Adjusters and Slider"}
              myIcon={<FaRegClock />}
              onClick={stateSliders}
              height="20%"
            />
          </List>
        
          <Divider />
          <List key="BaseMap" sx={{ height: "33.3%" }}>
            <ToggleButtons

            />
          </List>
          <Divider />
          <List sx={{ height: "22.2%" }} key="Download">
            
          <ListItems
              key={"Recenter"}
              title={"Recenter"}
              myIcon={<FaCrosshairs />}
              onClick={reCenter}
              height="33.3%"
            />
        
             <ListItems
              key={"Back to Previous Level"}
              title={"Back to Previous Level"}
              myIcon={<FaStepBackward />}
              onClick={goBack}
              height="33.3%"
            />
                        <ListItems
              key={"Reload Initial View"}
              title={"Reload Initial View"}
              myIcon={<FaRedoAlt />}
              onClick={reload}
              height="33.3%"
            />
            
                        
          </List>
        </List>
        
        </div>)
}

export default MenuArea