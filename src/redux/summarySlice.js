import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as d3Array from 'd3-array';
import { timeFormat, format } from "d3";

const formatTimestamp = timeFormat("%y-%b");
export const d3FormatNumber = format(".2s")

const initialState = { 
    initialLoading: true,
    loading: true,
    data: {},
    chartData: {
        geoData: {
        type:"FeatureCollection",
                    features: [{
                        type: "Feature",
                        id: 1,
                        geometry:{
                            type: "Point",
                            coordinates: [0, 0]
                        },
                        properties: {
                            status:"Status",
                            proposed_use:"Proposed Use",
                            permit_type_definition:"Permit Type",
                            proposed_construction_type:"Proposed Construction Type",
                            proposed_units_tier:"Proposed Units Tier",
                            stories_tier:"Proposed Stories Tier",
                            primary_address_flag: 1,
                        },
                        description: "",
                        total: ""
                    }]

                    }
                },
    total: false,
    error: '',
    filteredFeatures: [],
    tempFilteredFeatures: [],
    totalsData: {},
    totalsWeights: [],
};

  export const filterDataAsync = createAsyncThunk(
    "summary/filterDataAsync",
    async (payload, { getState }) => {
     
        const state = getState().summaryState;
        let pointData = getState().pointJsonState.data
        let filteredFeatures = [];
  
        if (payload.fid && payload.viewLevelFp && !payload.trueKeys) {
            console.log(1)
            filteredFeatures = state.filteredFeatures.filter(
            (item) => item.properties.blockfp.slice(0,payload.viewLevelFp) === payload.fid
          );
        } else if (payload.fid && payload.viewLevelFp && payload.trueKeys) {
            console.log(payload)
            let newArray = []
            pointData = pointData.features;
            pointData = pointData.filter((item) => 
                item.properties.blockfp.slice(0,payload.viewLevelFp) === payload.fid);
            
            const testArray = Object.keys(payload.trueKeys);
            const dataProperties = Object.keys(pointData[0].properties);
            const contains = testArray.every((r) => dataProperties.indexOf(r) > -1);
            
            if (pointData.length > 0 && contains === true) {
                for (let i = 0; i < pointData.length; i++) {
                let result = 0;
                for (const [key, value] of Object.entries(payload.trueKeys)) { {
                        
                    }
                    const check =
                    pointData[i].properties[key] == null
                        ? null
                        : pointData[i].properties[key].toString();
                    if (value.includes(check)) {
                    result += 1;
                    }
                }
                if (result === Object.keys(payload.trueKeys).length) {
                    newArray.push(pointData[i])
                }
                }

            }
            console.log(newArray)
            filteredFeatures = newArray
        } else {


            const testArray = Object.keys(payload.trueKeys);
            const dataProperties = Object.keys(pointData.features[0].properties);
            const contains = testArray.every((r) => dataProperties.indexOf(r) > -1);
    
            if (Object.keys(pointData).length > 0 && contains === true) {
                for (let i = 0; i < pointData.features.length; i++) {
                let result = 0;
                for (const [key, value] of Object.entries(payload.trueKeys)) { {
                        
                    }
                    const check =
                    pointData.features[i].properties[key] == null
                        ? null
                        : pointData.features[i].properties[key].toString();
                    if (value.includes(check)) {
                    result += 1;
                    }
                }
                if (result === Object.keys(payload.trueKeys).length) {
                    filteredFeatures.push(pointData.features[i]);
                }
                }
            }}
        return filteredFeatures; // Return the filtered data
    }
  );

  export const applyTimeFilterAsync = createAsyncThunk(
    "summary/applyTimeFilterAsync",
    async (payload, { getState }) => {
     
        const state = getState().summaryState;
        
        const filteredFeatures = state.filteredFeatures.filter(
            (item) => item.properties.permit_creation_timestamp >= payload[0] && 
            item.properties.permit_creation_timestamp <= payload[1]);

            return filteredFeatures;

        }
  );

  export const totalDataAsync = createAsyncThunk(
    "slice/totalDataAsync",
    async (payload, { getState }) => {
        
            const { filteredFeatures, tempFilteredFeatures } = getState().summaryState;
            const data = 
                tempFilteredFeatures.length > 0 
                  ? tempFilteredFeatures 
                  : filteredFeatures
              ; 
        
    
            // Step 1: Compute total count per first-level group
            const firstLevelCounts = d3Array.rollup(
                data,
                v => payload.sumBy === "count" 
                      ? v.length // Count occurrences
                      : d3Array.sum(v, d => d.properties[payload.sumBy] || 0), // Count features in each first-level group
                d => d.properties.blockfp.slice(0,payload.viewLevelFp)
            );
            
            // Step 2: Group data by first-level and second-level properties
            const groupedData = d3Array.group(
                data,
                d => d.properties.blockfp.slice(0,payload.viewLevelFp), // First-level group
                d => d.properties[payload.slicer]       // Second-level group
            );
            
            // Step 3: Convert grouped data into GeoJSON FeatureCollection
            const geoJson = {
                type: "FeatureCollection",
                features: Array.from(groupedData, ([firstLevelKey, subGroups]) => {
                // Extract coordinates for centroid calculation
                const coordinates = [...subGroups.values()].flat().map(f => f.geometry.coordinates);
                const centroid = calculateCentroid(coordinates);
            
                return {
                    type: "FeatureCollection",
                    id: firstLevelKey,
                    geometry: {
                    type: "Point",
                    coordinates: centroid
                    },
                    properties: {
                    totalCount: firstLevelCounts.get(firstLevelKey),
                    subGroups: Array.from(subGroups, ([secondLevelKey, features]) => ({
                        [secondLevelKey]: features.length
                    }))
                    }
                };
                })
            };
    
        // Calculate cluster weights/range
          const totalRange = (() => {
          const total = geoJson.features.map(d => Number(d.properties.totalCount));
          
    
          // Sort the totals to calculate percentiles
          total.sort((a, b) => a - b);
    
          const min = total[0];
          const max = total[total.length - 1];
    
          // Helper to calculate a percentile
          const getPercentile = (arr, percentile) => {
            const index = (percentile / 100) * (arr.length - 1);
            const lower = Math.floor(index);
            const upper = Math.ceil(index);
            const weight = index - lower;
            return arr[lower] * (1 - weight) + arr[upper] * weight;
          };
    
          const Q1 = getPercentile(total, 25); // 25th percentile (first quartile)
          const median = getPercentile(total, 50); // Median (50th percentile)
    
          return [min, Q1, median, max];
        });
        
        return {
          totals: geoJson,
          totalsWeights: totalRange(),
        };
      }
    );



  export const calculateCentroid = (coords) => {
    const sum = coords.reduce(
      (acc, [lng, lat]) => {
        acc[0] += lng;
        acc[1] += lat;
        return acc;
      },
      [0, 0]
    );
    return [sum[0] / coords.length, sum[1] / coords.length];
  }
  

const summarySlice = createSlice({
    name: "summarySlice",
    initialState: initialState,
    reducers: {
        resetSummaryState: () => {
            return initialState
        },
        getTimeWeightRange : (state, action) => {
            if (state.filteredFeatures.length === 0) {
                return null;
              }

              const data = 
              state.tempFilteredFeatures.length > 0 
                ? state.tempFilteredFeatures 
                : state.filteredFeatures
            ; 
              
              const weightRange = data.reduce(
                (range, d) => {
                  const t = Number(action.payload==="count"?1:d.properties[action.payload]).toFixed(2);
                  range[0] = Math.min(range[0], t);
                  range[1] = Math.min(range[0], t) + ((Math.max(range[1], t)-Math.min(range[0], t))/2);
                  range[2] = Math.max(range[1], t);
                  return range
                },
                [Infinity, -Infinity]
              );
              state.timeWeightRange = weightRange
             
        },
        undoData: (state, action) => {
                state.loading=true
                const testArray = Object.keys(action.payload.trueKeys)
                const dataProperties = Object.keys(action.payload.data.features[0].properties)
                const contains = testArray.every(r=>dataProperties.indexOf(r)>-1)
                
                state.filteredFeatures = []
                
                let data = []
                if(Object.keys(action.payload.data).length>0 && contains == true) {
                    
                    for (let i = 0; i<action.payload.data.features.length; i++) {
                        let result = 0
                        for (const [key, value] of Object.entries(action.payload.trueKeys)) {
                            
                            const check = action.payload.data.features[i].properties[key] == null ? "" : action.payload.data.features[i].properties[key].toString();
                            value.includes(check)? result = result+1: result = result
                        }
                        if (result === Object.keys(action.payload.trueKeys).length) {
                            data.push(action.payload.data.features[i])
                        }
                    }
                }
                
                if (action.payload.fid.length === 0) {
                    state.filteredFeatures = data
                    state.loading = false
                } else {
                    const filtered = data.filter((item) => item.properties.blockfp.slice(0,action.payload.viewLevelFp) === action.payload.fid);
                    state.filteredFeatures = filtered;
                    state.loading = false
                }
        },
        tempFilter: (state, action) => {
            let temp = [];
            if (!action.payload) {
                temp = temp
            } else if (action.payload.attributeFilter && action.payload.fpFilter && action.payload.timeFilter) {
                   
                let data = state.filteredFeatures
                data = data.filter((feature) => feature.properties[action.payload.attributeFilter.attribute] === action.payload.attributeFilter.value);
                data = action.payload.fpFilter.fp === 0 ? data : data.filter((feature) => feature.properties.blockfp.slice(0,action.payload.fpFilter.viewLevelFp) === action.payload.fpFilter.fp);
                data = data.filter((item) => item.properties.permit_creation_timestamp >= action.payload.timeFilter[0] && item.properties.permit_creation_timestamp <= action.payload.timeFilter[1])
                temp = data;
            } else if (!action.payload.attributeFilter && action.payload.fpFilter && action.payload.timeFilter) {
                let data = state.filteredFeatures
                data = action.payload.fpFilter.fp === 0 ? data : data.filter((feature) => feature.properties.blockfp.slice(0,action.payload.fpFilter.viewLevelFp) === action.payload.fpFilter.fp);
                data = data.filter((item) => item.properties.permit_creation_timestamp >= action.payload.timeFilter[0] && item.properties.permit_creation_timestamp <= action.payload.timeFilter[1]);
                temp = data;
            } else if (!action.payload.attributeFilter && action.payload.fpFilter && !action.payload.timeFilter) {
                let data = state.filteredFeatures
                data = action.payload.fpFilter.fp === 0 ? data : data.filter((feature) => feature.properties.blockfp.slice(0,action.payload.fpFilter.viewLevelFp) === action.payload.fpFilter.fp);
                temp = data
            } else if (!action.payload.attributeFilter && !action.payload.fpFilter && action.payload.timeFilter) {
                let data = state.filteredFeatures
                data = data.filter((item) => item.properties.permit_creation_timestamp >= action.payload.timeFilter[0] && item.properties.permit_creation_timestamp <= action.payload.timeFilter[1]);
                temp = data
            } else if (action.payload.attributeFilter && action.payload.fpFilter && !action.payload.timeFilter) {
                let data = state.filteredFeatures
                data = action.payload.fpFilter.fp === 0 ? data : data.filter((feature) => feature.properties.blockfp.slice(0,action.payload.fpFilter.viewLevelFp) === action.payload.fpFilter.fp);
                data = data.filter((feature) => feature.properties[action.payload.attributeFilter.attribute] === action.payload.attributeFilter.value);
                temp = data;
            } else if (action.payload.attributeFilter && !action.payload.fpFilter && action.payload.timeFilter) {
                let data = state.filteredFeatures
                data = data.filter((item) => item.properties.permit_creation_timestamp >= action.payload.timeFilter[0] && item.properties.permit_creation_timestamp <= action.payload.timeFilter[1]);
                data = data.filter((feature) => feature.properties[action.payload.attributeFilter.attribute] === action.payload.attributeFilter.value);
                temp = data
            } else {
                const data = state.filteredFeatures
                temp = data.filter((feature) => feature.properties[action.payload.attributeFilter.attribute] === action.payload.attributeFilter.value);
            }
            
            state.tempFilteredFeatures = temp;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(totalDataAsync.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(totalDataAsync.fulfilled, (state, action) => {
            const { totals, totalsWeights } = action.payload;
            state.totalsData = totals;
            state.totalsWeights = totalsWeights;
            state.loading = false;
            state.initialLoading = false;
        })
        builder.addCase(totalDataAsync.rejected, (state, action) => {
            state.loading = false;
            state.error = `Clustering failed: ${action.error.message}`;
        })
        builder.addCase(filterDataAsync.fulfilled, (state, action) => {
            
            state.filteredFeatures = action.payload;
        })
        builder.addCase(filterDataAsync.rejected, (state, action) => {
            state.error = `Filtering failed: ${action.error.message}`;
        })
        builder.addCase(applyTimeFilterAsync.fulfilled, (state, action) => {
            state.timeFilteredFeatures = action.payload;
        });
        builder.addCase(applyTimeFilterAsync.rejected, (state, action) => {
            state.error = `Time Filtering failed: ${action.error.message}`;
        });
    },
  
});

export const {
    resetSummaryState,
    summarizeData,
    drillDownSummary,
    undoData,
    getTimeWeightRange,
    tempFilter,
} = summarySlice.actions
export default summarySlice.reducer;