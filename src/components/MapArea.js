
import Map, { Marker, Source, Layer } from "react-map-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useCallback, useRef } from "react";
import { INITIAL_VIEW_STATE, setViewState, viewLevelFps } from "../redux/viewStateSlice";
import Controls from "./Controls";
import Layers from "./Layers";
import { getTimeRange } from "../redux/pointJsonSlice";
import { getPointsAsync } from "../redux/pointJsonSlice";
import MenuArea from "./MenuArea";
import { filterDataAsync, totalDataAsync, getTimeWeightRange, tempFilter } from "../redux/summarySlice";
import { slicers } from "../redux/viewStateSlice";
import { getAttributesAsync, setTrueKeys } from '../redux/dataFilterSlice';
import { getFilterRangeInitial } from "../redux/temporalSlice";
import TimeSlider from "./TimeSlider";

const MapArea = () => {
  
  const mapRef = useRef();
  const dispatch = useDispatch();
  const [backgroundColor, setBackGroundColor] = useState('#BBD6DC');
  const [mapLoaded, setMapLoaded] = useState(false);
  let isHovering = false;
  const viewState = useSelector((state) => state.viewState.viewState);
  const viewStateDetails = useSelector((state) => state.viewState);
  const initViewState = INITIAL_VIEW_STATE;
  const mapStyle = useSelector((state) => state.viewState.mapStyle);
  const slicer = useSelector((state) => state.viewState.slicer);
  const dataFilters = useSelector((state) => state.dataFilterState);
  const layerState = useSelector((state) => state.layerState);
  const summaryState = useSelector((state) => state.summaryState);
  const pointState = useSelector((state) => state.pointJsonState)
  const flyTo = useSelector((state) => state.borders.flyTo);
  const selectedValue = useSelector((state) => (state.viewState.viewType));
  const mainSliceValues = slicers[selectedValue];
  const sumBy = useSelector((state) => state.viewState.sumBy);
  const viewType = useSelector((state) => state.viewState.viewType);
  const loadSlider = useSelector((state) => state.temporalState.loadSlider);
  const timeData = useSelector((state) => state.temporalState);
  const prevViewLevel = viewLevelFps[viewLevelFps.indexOf(viewStateDetails.viewLevelFp)-1];
  



  useEffect(() => {
    dispatch(getAttributesAsync(viewType))
    
    },[viewType]);

    useEffect(() => {
      if (dataFilters.loading === true) {
        return
      }
      else if (dataFilters.slicerValues.length === 0) {
        return
      }
      else {
        dispatch(setTrueKeys())
      }
      
    },[dataFilters.slicerValues]);


  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return
    }
    
    if (flyTo == undefined || flyTo.length === 0) {
      map.easeTo({
        center:[INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
        zoom: INITIAL_VIEW_STATE.zoom,
        pitch: 0,
        bearing: 0
      })
    } else {
      map.fitBounds(flyTo, { bearing: 0, pitch: 0, linear: false, padding: 30, duration: 1000 })
    }
    
  }, [flyTo]);

  useEffect(() => {
    if (!viewStateDetails) {
      return
    } else {
      //dispatch(getSummaryAsync({ viewType: viewStateDetails.viewType, viewLevel: viewStateDetails.viewLevel}))
      dispatch(getPointsAsync())
    }
    
  }, []);

useEffect (() => {
    if (pointState.loading && !pointState.data.features) {
      return
    }
  //dispatch(getInitialFeatures(pointState.data.features))
  dispatch(getTimeRange());

},[pointState.loading]);

useEffect(() => {
  if (pointState.timeRange.length === 0) {
    return
  }
  dispatch(getFilterRangeInitial(pointState.timeRange));


  },[pointState.timeRange])

  useEffect(() => {
       
    if (Object.entries(dataFilters.trueKeys).length === 0 || pointState.loading) {
      return
    } else if (viewStateDetails.fid.length === 0) {
      dispatch(filterDataAsync({
        trueKeys: {...dataFilters.trueKeys},
      }))
    } else {
      dispatch(filterDataAsync({
        trueKeys: {...dataFilters.trueKeys},
        fid: viewStateDetails.fid, 
        viewLevelFp: prevViewLevel
      }))
    }
      
    
    
  },[dataFilters.trueKeys, pointState.loading]);
 
  useEffect(() => {
    if (summaryState.filteredFeatures.length === 0) {
      return
    }
      dispatch(totalDataAsync({viewLevelFp: viewStateDetails.viewLevelFp, slicer: slicer, sumBy: sumBy}));
      dispatch(getTimeWeightRange(sumBy))
  }, [summaryState.filteredFeatures, sumBy, slicer, summaryState.tempFilteredFeatures]);

  useEffect(() => {

    if (Object.keys(dataFilters.tempSlicerValue).length === 0 && dataFilters.tempFilterFp === 0 && dataFilters.tempTimeFilter.length === 0) {
      dispatch(tempFilter())
    } else if (Object.keys(dataFilters.tempSlicerValue).length === 0 && dataFilters.tempFilterFp !== 0 && dataFilters.tempTimeFilter.length === 0) {
      dispatch(tempFilter({fpFilter: {viewLevelFp: viewStateDetails.viewLevelFp, fp: dataFilters.tempFilterFp}}))
    } else if (Object.keys(dataFilters.tempSlicerValue).length > 0 && dataFilters.tempFilterFp !== 0 && dataFilters.tempTimeFilter.length === 0) {
      dispatch(tempFilter({attributeFilter: dataFilters.tempSlicerValue, fpFilter: {viewLevelFp: viewStateDetails.viewLevelFp, fp: dataFilters.tempFilterFp}}))
    } else if (Object.keys(dataFilters.tempSlicerValue).length > 0 && dataFilters.tempFilterFp !== 0 && dataFilters.tempTimeFilter.length !== 0) {
      dispatch(tempFilter({attributeFilter: dataFilters.tempSlicerValue, fpFilter: {viewLevelFp: viewStateDetails.viewLevelFp, fp: dataFilters.tempFilterFp}, timeFilter: dataFilters.tempTimeFilter}))
    } else if (Object.keys(dataFilters.tempSlicerValue).length === 0 && dataFilters.tempFilterFp !== 0 && dataFilters.tempTimeFilter.length !== 0) {
      dispatch(tempFilter({fpFilter: {viewLevelFp: viewStateDetails.viewLevelFp, fp: dataFilters.tempFilterFp}, timeFilter: dataFilters.tempTimeFilter}))
    } else if (Object.keys(dataFilters.tempSlicerValue).length > 0 && dataFilters.tempFilterFp === 0 && dataFilters.tempTimeFilter.length !== 0) {
      dispatch(tempFilter({attributeFilter: dataFilters.tempSlicerValue, timeFilter: dataFilters.tempTimeFilter}))
    } else if (Object.keys(dataFilters.tempSlicerValue).length === 0 && dataFilters.tempFilterFp === 0 && dataFilters.tempTimeFilter.length !== 0) {
      dispatch(tempFilter({timeFilter: dataFilters.tempTimeFilter}))
    } else {
      dispatch(tempFilter({attributeFilter: dataFilters.tempSlicerValue}))
    }
  }, [dataFilters.tempSlicerValue, summaryState.filteredFeatures, dataFilters.tempFilterFp, dataFilters.tempTimeFilter]);




  const DeckGL = new MapboxOverlay({
    layers: Layers(),
    interleaved: true,
    onHover: ({ object }) => (isHovering = Boolean(object)),
    getCursor: ({ isDragging }) =>
      isDragging ? "inherit" : isHovering ? "pointer" : "inherit"
  });

  const layers = Layers();

  useEffect(() => {
    if (!mapLoaded) {
      return;
    }
  
    const map = mapRef.current.getMap();
    
    if (layers && layers.length > 0 && !summaryState.loading) {
      map.__deck.setProps({ layers });
      
    } else {
      return
    }
  }, [mapLoaded, layers, slicer, dataFilters, layerState.Layers, flyTo, timeData, summaryState.loading]);
  
  
  useEffect(() => {
    
    if (!mapLoaded) {
      return
    }
    
    const map = mapRef.current.getMap();
    switch (layerState.data.building.building) {
      case false: map.setLayoutProperty("building-3d", 'visibility', 'none'); break;
      case true: map.setLayoutProperty("building-3d", 'visibility', 'visible'); break;
    };
  }, [layerState.data.building.building, mapLoaded])

  useEffect(() => {

    mapStyle ===
      "https://api.maptiler.com/maps/streets/style.json?key=YbCPLULzWdf1NplssEIc"
      ? setBackGroundColor("#BBD6DC")
      : mapStyle ===
        "https://api.maptiler.com/maps/hybrid/style.json?key=YbCPLULzWdf1NplssEIc#0.8/-14.45028/20.54042"
        ? setBackGroundColor("#6BD1EA")
        : setBackGroundColor("#1F4E71")
  }, [mapStyle]);
  
  
  const onMapLoad = useCallback(() => {
    const map = mapRef.current.getMap();
    if (!map) {
      return;
    }
    
    map.addControl(DeckGL)
    // const layers = map.getStyle().layers;
    setMapLoaded(true)
  }, []);



  return (
    <div className={"MapArea"}>
      <Map
        id="myMap"
        onClick={e => console.log(e.lngLat)}
        mapLib={maplibregl}
        ref={mapRef}
        mapStyle={mapStyle}
        hash={true}
        maxPitch={85}
        onLoad={onMapLoad}
        initialViewState={initViewState}
        {...viewState}
        onMove={e => dispatch(setViewState(e.viewState))}
        style={{ backgroundColor: `${backgroundColor}` }}
        
      >
         
        
        <MenuArea />
        <Controls />
      {!loadSlider ?(<></>) : (<TimeSlider />)}
      </Map>
    </div>
  )
}

export default MapArea
