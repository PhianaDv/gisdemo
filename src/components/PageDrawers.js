import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import Drawers from './Drawer';
import { switchAnalytics, switchLayers, switchLegend, switchSliders, switchViews } from "../redux/pageStateSlice";
import { alpha } from "@mui/material";
import RadioSwitch from './RadioSwitch';
import Legend from './Legend';
import { useEffect, useState } from 'react';
import { changeLayerVisibilty, permitLayerToggle, allPermitLayersToggle, toggleBuildings, changeLayerAutohighlight } from '../redux/layerSlice';
import { useCallback } from 'react';
import TemporalControl from './TemporalControl';
import AnalyticsCharts from './AnalyticsCharts';

const PageDrawers = () => {
    const pageState = useSelector((state) => state.pageState);
    const layerStateLayers = useSelector((state) => state.layerState.Layers);
    const layerStateData = useSelector((state) => state.layerState.data); 
    const chartData = useSelector((state) => state.summaryState.chartData)
    const [buttonList, setButtonList] = useState({});
    const [permitLayerSwitch, setPermitLayerSwitch]= useState({});
    const dispatch = useDispatch()

    useEffect(() => {
      let IdsVis = {};
      Object.entries(layerStateLayers).map((el) => {
        if(!el[1].id.match(/^Permit|TimeLayer.*$/)) {
          IdsVis[el[1].id] = [el[1].visible,el[1].autoHighlight]
        }
      });
      var sortedList = {};
      
      Object.keys(IdsVis)
        .sort()
        .forEach((a) => (sortedList[a] = IdsVis[a]));
      setButtonList(sortedList);
      let IdsSwitch = {};
  
      Object.entries(layerStateLayers).map((el) => {
        if(el[1].id.match(/^Permit.*$/)) {
          IdsSwitch[el[1].id] = {visible: el[1].visible, enabled:el[1].enabled}
        }
      });
      
     var sortedSList = {};
  
     Object.keys(IdsSwitch)
        .sort()
        .forEach((a) => (sortedSList[a] = IdsSwitch[a]));
     setPermitLayerSwitch(sortedSList)
     
    },[layerStateLayers]);

    const layersToggle = useCallback((e) => {
      dispatch(changeLayerVisibilty(e.currentTarget.id))
    });

    const highlightToggle = useCallback((e) => {
      dispatch(changeLayerAutohighlight(e.target.id))
    });

    const permitLayersToggle = useCallback((e) => {
      dispatch(permitLayerToggle(e.target.value))
    });

    const permitVisibleToggle = useCallback(() => {
      dispatch(allPermitLayersToggle())
    });
    

    
  return (
    <div>
       <Drawers
        myKey={"Analytics"}
        padding={0}
        overflow={"hidden"}
        height={"87.5%"}
        marginBottom={"0%"}
        marginLeft={"50%"}
        width={"50%"}
        anchor={"bottom"}
        open={pageState.openAnalytics}
        backgroundColor={alpha("#575959", 0.3)}
        onClick={()=> dispatch(switchAnalytics())}
        Charts={!chartData? (<></>):(<AnalyticsCharts />)}
      ></Drawers>

<Drawers
        myKey={"Legend"}
        overflow={"auto"}
        height={"75%"}
        marginTop={"25%"}
        marginLeft={"35%"}
        //width={"15%"}
        anchor={"bottom"}
        open={pageState.openLegend}
        backgroundColor={alpha("#575959", 0.3)}
        onClick={() => dispatch(switchLegend())}
        Charts={<Legend/>}
      />
  
  
      <Drawers
        myKey={"Layers"}
        overflow={"hidden"}
        height={"12.5%"}
        marginTop={"0%"}
        marginLeft={"8%"}
        width={"87%"}
        anchor={"top"}
        open={pageState.openLayers}
        backgroundColor={alpha("#575959", 0.3)}
        onClick={() => dispatch(switchLayers())}
        ButtonList={buttonList}
        ButtonClick={layersToggle}
        ToggleList={permitLayerSwitch}
        onClickToggle={permitLayersToggle}
        currentPermitStyle={layerStateData.currentLayerStyle}
        permitsVisible={layerStateData.permitsVisible}
        TogglePermits={permitVisibleToggle}
        //toggleButtonEnabled={}
        checkboxData={layerStateData.building}
        handleBuildings={() => dispatch(toggleBuildings())}
        handleHighlight={highlightToggle}
      />

      <Drawers
        myKey={"SwitchViews"}
        overflow={"hidden"}
        marginTop={"10%"}
        height={"45%"}
        marginLeft={"8%"}
        width={"20%"}
        anchor={"left"}
        open={pageState.openViews}
        backgroundColor={alpha("#575959", 0.3)}
        onClick={() => dispatch(switchViews())}
        Charts={<RadioSwitch/>} 
      />

<Drawers
        myKey={"SwitchSliders"}
        overflow={"hidden"}
        marginTop={"7%"}
        height={"65%"}
        marginLeft={"8%"}
        width={"30%"}
        anchor={"left"}
        open={pageState.openSliders}
        backgroundColor={alpha("#575959", 0.3)}
        onClick={() => dispatch(switchSliders())}
        Charts={<TemporalControl/>} 
      />
    </div>
  )
}

export default PageDrawers
