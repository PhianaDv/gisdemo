import { useSelector, useDispatch } from 'react-redux';
import { MVTLayer, ScatterplotLayer, HeatmapLayer, GridLayer, GeoJsonLayer } from 'deck.gl';
import { DataFilterExtension } from '@deck.gl/extensions';
import { useCallback } from 'react';
import { colorSuppliersRGB } from '../assets/MyColors';
import { filterDataAsync } from '../redux/summarySlice';
import { drilldown, getBbox, testBorders } from '../redux/borderSlice';
import { viewLevels, changeViewLevel, viewLevelFps } from '../redux/viewStateSlice';
import { getPointDetailAsync } from '../redux/pointDetailSlice';
import { pointOpen } from '../redux/pointDetailSlice';
import { scaleLinear, interpolateRgb, interpolateHsl } from 'd3';
import { setTempFilterFp } from '../redux/dataFilterSlice';





const Layers = () => {
    const timeData = useSelector((state) => state.temporalState);
    const timeWeight = useSelector((state) => state.summaryState.timeWeightRange)
    const dataFilters = useSelector((state) => state.dataFilterState);
    const slicer = useSelector((state) => state.viewState.slicer);
    const viewType = useSelector((state) => state.viewState.viewType);
    const viewLevel = useSelector((state) => state.viewState.viewLevel);
    const viewLevelFp = useSelector((state) => state.viewState.viewLevelFp);
    const currentFid = useSelector((state) => state.viewState.fid);
    const layerState = useSelector((state) => state.layerState.Layers);
    const pointData = useSelector((state) => 
        state.summaryState.tempFilteredFeatures.length > 0 
          ? state.summaryState.tempFilteredFeatures 
          : state.summaryState.filteredFeatures
      );
    const boundaryData = useSelector((state) => state.borders.current);
    const totalsData = useSelector((state) => state.summaryState);
    const sumBy = useSelector((state) => state.viewState.sumBy)
    const nextViewLevel = viewLevels.indexOf(viewLevel)+1;
    const dispatch = useDispatch();
    const highlightFp = useSelector((state) => state.dataFilterState.tempHighlightFp);
    const colorTimeLayer = useCallback((d) => {
      if (!d || timeWeight.length === 0) {
          return [49, 96, 235]; // Default color as RGB array [R, G, B]
      }
  
      const colorScale = scaleLinear()
          .domain(timeWeight)
          .range([
              timeData.colorRange.lowRangeColor.value,
              timeData.colorRange.midRangeColor.value,
              timeData.colorRange.highRangeColor.value
          ])
          .interpolate(interpolateRgb.gamma(2.2));
  
      const color = colorScale(d);
  
      if (!color || typeof color !== "string") {
          return [49, 96, 235]; // Fallback color
      }
  
      const match = color.match(/\((.*)\)/);
      if (!match || !match[1]) {
          return [49, 96, 235]; // Fallback color if match fails
      }
  
      return match[1].split(",").map(i => Number(i));
  });

  const beforeId = "water_name_line"

    const colorTotalsLayer = useCallback((d) => {
      const color = scaleLinear()
      .domain(totalsData.totalsWeights)
      .range(["#3160eb", "#3160eb" ,"#f7f72f", "#e64c19"])
      .interpolate(interpolateHsl)(d)
      
      //.interpolate(d3.interpolateRgb.gamma(2.2))
      const array = [...color.matchAll(/\((.*)\)/g)]
      
      return array[0][1].split(",").map(i=>Number(i))
      })

    const filterValues = (d) => {
      let result = 0
             if (Object.keys(dataFilters.trueKeys).length===0) {
               result = result
             } else {
               const keys = dataFilters.trueKeys
          
               for (const [key,value] of Object.entries(keys)) {
                 if(value.includes(d.properties[key])) {
                   result = result+1;
                 };
             };   
            };

            let result2 = 1
            if (currentFid.length === 0) {
              result2 = result2
            } else if (d.properties[viewLevelFps[nextViewLevel-2]] === currentFid) {
              result2 = result2
            } else {
              result2 = 0
            }
            
                return [result,result2,d.properties.permit_creation_timestamp]  

    };

    return [
      new ScatterplotLayer({
        id:layerState.pointLayer.id,
        beforeId: beforeId,
        visible: layerState.pointLayer.visible,
        data: pointData,
        getPosition: (d) => d.geometry.coordinates, 
        getFillColor: (d) => colorSuppliersRGB(d.properties[slicer]),
        getPointRadius: d => 1,
        radiusScale: 5,
        radiusMinPixels: 1,
        extensions: [new DataFilterExtension({filterSize: 3})],
        filterRange: [[Object.keys(dataFilters.trueKeys).length, Object.keys(dataFilters.trueKeys).length], [1, 1], timeData.filterRange],
        getFilterValue: (d) => filterValues(d),
        updateTriggers: {
          getFillColor: [pointData, slicer],
          getFilterValue: [dataFilters, viewLevelFp, timeData],
          },
        onClick: (o) => {
          dispatch(getPointDetailAsync({
          viewType: viewType,
          id: o.object.id,
          x:o.x,
          y:o.y
          }));
          dispatch(pointOpen(true))
        },
        autoHighlight: true,
        pickable: true
      }),
      new MVTLayer({
        id:layerState.boundaryLayer.id,
        beforeId: beforeId,
        visible: layerState.boundaryLayer.visible,
        autoHighlight: layerState.boundaryLayer.autoHighlight,
        data: boundaryData, 
        getFillColor: (d) => d.properties.id === highlightFp ? [255, 0, 0, 150] : [190, 190, 190, 0],
        getLineColor: (d) => d.properties.id === highlightFp ? [255, 0, 0, 255] : [0, 25, 190],
        getLineWidth: (d) => d.properties.id === highlightFp ? 3 : 1,
        maxZoom: 18,
        extent: [-123.18692607464052, 37.56967190947691, -122.06063972249444, 38.06732963686173],
        onClick: (o) => {
          
          if (viewLevels.indexOf(viewLevel)+1 === viewLevels.length) {
            alert("Already at lowest drill level.")
          } else if (viewLevels.indexOf(viewLevel)+1 !== viewLevels.length) {
            
            testBorders(viewLevels[nextViewLevel],o.object.properties.id).then(
            function (r) {
              if (r===1) {
                dispatch(drilldown({upperfid:o.object.properties.id, viewLevel: viewLevels[nextViewLevel]}));
                dispatch(changeViewLevel({viewLevel:viewLevels[nextViewLevel], fid:o.object.properties.id}));
                dispatch(getBbox({fid:o.object.properties.id, viewLevel: viewLevels[nextViewLevel-1]}));
                dispatch(filterDataAsync({fid:o.object.properties.id, viewLevelFp: viewLevelFps[nextViewLevel-1]}));
              }
             else {
                alert("There is no further drilling data available.")
              }
            }
            )
          }
          console.log(o.object.properties.id )
        },
        extensions: [new DataFilterExtension({filterSize: 1})],
        filterRange: [1, 1],
        getFilterValue: (d) => viewLevelFp === "tractfp" ? 1 : d.properties.id.startsWith(currentFid) ? 1 : 0,
        updateTriggers: {
          getFilterValue: [currentFid],
          getFillColor: [highlightFp],
          getLineColor: [highlightFp],
          getLineWidth: [highlightFp]
        },
        stroked: true,
        filled: true,
        lineWidthScale: 5,
        lineWidthMinPixels: 1,
        lineWidthMaxPixels: 10,
        pickable: true,
        uniqueIdProperty: "id",
      }),
      new HeatmapLayer({
        id:layerState.heatmapLayer.id,
        beforeId: beforeId,
        visible: layerState.heatmapLayer.visible,
        data: pointData,
        getPosition: (d) => d.geometry.coordinates, 
        aggregation: 'SUM',
        getWeight: d => sumBy==="count"?2:sumBy==="estimated_cost"?Math.sqrt(Math.sqrt(d.properties[sumBy])**1.5):Math.sqrt(d.properties[sumBy]*15),
        radiusPixels: 25,
        extensions: [new DataFilterExtension({filterSize: 3})],
        filterRange: [[Object.keys(dataFilters.trueKeys).length, Object.keys(dataFilters.trueKeys).length], [1, 1], timeData.filterRange],
        getFilterValue: (d) => filterValues(d),
        updateTriggers: {
          getWeight: sumBy,
          getFilterValue: [dataFilters, viewLevelFp, timeData],
          }
      }),
      new GeoJsonLayer({
        id: layerState.totalsLayer.id,
        beforeId: beforeId,
        visible: layerState.totalsLayer.visible,
        data: totalsData.totalsData,
        stroked: false,
        filled: true,
        pointType: 'circle',
        getPosition: d => d.geometry.coordinates,
        getFillColor: d => colorTotalsLayer(d.properties.totalCount),
        getRadius: d => sumBy==="count"?Math.sqrt(d.properties.totalCount)**1.6:sumBy==="estimated_cost"?Math.sqrt(Math.sqrt(d.properties.totalCount))**1.2:Math.sqrt(d.properties.totalCount)**1.09,
        pointRadiusMinPixels: 7,
        pointRadiusMaxPixels: 35,
        updateTriggers: {
          getFillColor: [totalsData.totalsWeights, sumBy],
          getRadius: [totalsData.totalsWeights, sumBy],
        },
        pickable: true,
        autoHighlight: true,
        onClick: (o) => {dispatch(setTempFilterFp(o.object.id))},
        //pointBillboard: true,
    }),
    new ScatterplotLayer({
      id: layerState.temporalLayer.id,
      beforeId: beforeId,
      visible: layerState.temporalLayer.visible,
      data: pointData,
      radiusMinPixels: 1,
      radiusMaxPixels: 35,
      getPosition: d => d.geometry.coordinates,
      getRadius: d => sumBy==="count"?1*timeData.radiusScale:sumBy==="estimated_cost"?Math.sqrt(Math.sqrt(d.properties[sumBy]))*timeData.radiusScale*0.1:Math.sqrt(d.properties[sumBy])*timeData.radiusScale*0.5,
      getFillColor: d => sumBy==="count"?colorTimeLayer(1):colorTimeLayer(d.properties[sumBy]),
      extensions: [new DataFilterExtension({filterSize: 3})],
        filterRange: [[Object.keys(dataFilters.trueKeys).length, Object.keys(dataFilters.trueKeys).length], [1, 1], timeData.filterRange],
        getFilterValue: (d) => filterValues(d),
      updateTriggers: {
          getPosition: pointData,
          getRadius: [timeData.radiusScale, sumBy],
          getFillColor: [timeData.colorRange, sumBy],
          getFilterValue: [timeData, dataFilters, viewLevelFp],
      },
      pickable: true,
      //billboard: true

  }),
  new GridLayer({
    id: layerState.gridLayer.id,
    beforeId: beforeId,
    visible: layerState.gridLayer.visible,
    data: pointData,
    extruded: true,
    getPosition: (d) => d.geometry.coordinates,
    getColorWeight: (d) => sumBy==="estimated_cost"? d.properties[sumBy]*0.0001:d.properties[sumBy],
    getElevationWeight: (d) => sumBy==="estimated_cost"? d.properties[sumBy]*0.0001:d.properties[sumBy],
    elevationScale: 1,
    cellSize: 200,
      updateTriggers: {
        getPosition: [totalsData.filteredFeatures, dataFilters],
        getColorWeight: [sumBy, totalsData.filteredFeatures, dataFilters],
        getElevationWeight: [sumBy, totalsData.filteredFeatures, dataFilters],
      },
    pickable: true,
    autoHighlight: layerState.gridLayer.autoHighlight
  })
    ]
};

export default Layers;


