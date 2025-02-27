import { createSlice } from "@reduxjs/toolkit";


export const mapStyle = {
    Dark:
    "https://api.maptiler.com/maps/62ab0c0b-09b1-4c58-b0c4-2e82ca1cf5ed/style.json?key=YbCPLULzWdf1NplssEIc",
    Light:
    "https://api.maptiler.com/maps/streets/style.json?key=YbCPLULzWdf1NplssEIc",
    Hybrid:
    "https://api.maptiler.com/maps/9794dbc1-8802-47ca-b19c-f73988a09fda/style.json?key=YbCPLULzWdf1NplssEIc"
};

export const INITIAL_VIEW_STATE = {
    longitude: -122.4413,
    latitude: 37.7685,
    zoom: 11.61,
    maxZoom: 22,
    pitch: 0,
    bearing: 0,
    maxPitch: 85
  };
  

export const viewTypes = {
    "Permits":{"Include Non-Primary Addresses": false},
};

export const sumByValues = {
    Permits:{
        ec: "Estimated Cost",
        pu: "Proposed Units",
        count: "Permit Count",
      },
};

export const slicers = {
    Permits:{
        "s":"Status",
        "pu":"Proposed Use",
        "pt":"Permit Type",
        "put":"Proposed Units Tier",
    },
};

export const attrShorthands = {
        "status":"s",
        "proposed_use":"pu",
        "permit_type_definition":"pt",
        "proposed_units_tier":"put",
        "estimated_cost": "ec",
        "proposed_units": "pu",
        "permit_creation_timestamp": "pct",
        "permit_number": "pn"

}

export const viewLevels = [
    "Tract","BlockGroup","Block"
];

export const viewLevelFps = [
11,12,15
]

export const viewLevelGeom = [
    "centroidtract","centroidblkgrp","centroidblockfp"
]
  
const initialState = {
    viewState: INITIAL_VIEW_STATE,
    viewLevel: "Tract",
    viewLevelFp: 11,
    viewLevelGeoField: "centroidtract",
    viewType: "Permits",
    fid: [],
    pastFid: [],
    slicer: "pu",
    sumBy:  "ec",
    mapStyle: "https://api.maptiler.com/maps/62ab0c0b-09b1-4c58-b0c4-2e82ca1cf5ed/style.json?key=YbCPLULzWdf1NplssEIc",
    inclusionState: viewTypes,
    rmax: 10,
    scale: Math.sqrt((INITIAL_VIEW_STATE.zoom/5)**2),
    textSize: 5,
};

const viewStateSlice = createSlice({
    name: "viewstate",
    initialState: initialState,
    reducers: {
        resetViewState: (state, action) => {
            return initialState
        },
        undoViewState: (state, action) => {
            const previous = state.pastFid[state.pastFid.length - 1]
            const newPast = state.pastFid.slice(0, state.pastFid.length - 1)
            const newLevel = viewLevels.indexOf(state.viewLevel)-1
            
            return {
                ...state,
                pastFid: newPast,
                fid: previous,
                viewLevel: viewLevels[newLevel],
                viewLevelFp: viewLevelFps[newLevel],
                viewLevelGeoField: viewLevelGeom[newLevel]
            }
        },
        changeViewLevel: (state, action) => {
            const currentFid = state.fid;
            const newLevel = viewLevels.indexOf(action.payload.viewLevel)
            
            return {
                ...state,
                viewLevel : action.payload.viewLevel,
                viewLevelFp : viewLevelFps[newLevel], 
                viewLevelGeoField: viewLevelGeom[newLevel],
                fid : action.payload.fid,
                pastFid: [...state.pastFid,currentFid]
            }
            
        },
        changeViewType: (state, action) => {
            state.viewType = action.payload
        },
        changeSlicer: (state, action) => {
            state.slicer = action.payload
        },
        changeSumBy: (state, action) => {
            state.sumBy = action.payload
        },
        changeMapStyle: (state, action) => {
            state.mapStyle = action.payload
        },
        setViewState: (state, action) => {
            state.viewState=action.payload
        },
        changeInclusionState: (state, action) => {
           
            state.inclusionState[action.payload.viewType][action.payload.fieldName] = !state.inclusionState[action.payload.viewType][action.payload.fieldName];
        },
        changeRmax: (state, action) => {
            switch (action.payload) {
                case "Tract": state.rmax = 10; break;
                case "BlockGroup": state.rmax = 28; break;
                case "Block": state.rmax = 28 ; break;
                default: state.rmax = 10
              }
        },
        changeScale: (state, action) => {
            if (action.payload<4.7) {
                state.scale = Math.sqrt((action.payload/5)**5);
                state.textSize = 12;
                } else {
                state.scale = Math.sqrt((action.payload/5)**0.5);
                state.textSize = 9;
                };
        },

    }

});

export const { 
    resetViewState,
    undoViewState,
    changeViewLevel, 
    changeViewType, 
    changeSlicer, 
    changeSumBy, 
    changeMapStyle, 
    setViewState,
    changeInclusionState,
    changeScale,
    changeRmax,
} = viewStateSlice.actions;
export default viewStateSlice.reducer;