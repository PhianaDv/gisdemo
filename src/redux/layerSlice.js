import { createSlice } from "@reduxjs/toolkit";

export const material = {
    ambient: 0.64,
    diffuse: 0.6,
    shininess: 90,
    specularColor: [51,51,51]
};

export const colorRange = [
    [1,152,189],
    [73,227,206],
    [254,237,177],
    [254,173,84],
    [209,55,78]
];


const heatmapLayer = {
    id: "Permit Heatmap",
    visible: false,
    enabled: true
}

const pointLayer = {
    id: "Permit Points",
    visible: true,
    enabled: true,
};

const boundaryLayer = {
    id: "Boundaries",
    visible: true,
    autoHighlight: true,
    enabled: true,
};

const gridLayer = {
    id: "Grid Layer",
    visible: false,
    autoHighlight: true,
};

const iconsLayer = {
    id: "Icons",
    visible: false
};

const temporalLayer = {
    id: "TimeLayer",
    visible: false,
    enabled: true,
};

const totalsLayer = {
    id: "Permit Totals",
    visible: false,
    enabled: true,
}

const initialState = {
    Layers: {
        heatmapLayer,
        pointLayer,
        boundaryLayer,
        gridLayer,
        //iconsLayer,
        temporalLayer,
        totalsLayer
    },
    data: {
        currentLayerStyle: "Permit Totals",
        permitsVisible: true,
        building: {"building" : false},
    }
};

const layerStateSlice = createSlice({
    name: "layerState",
    initialState: initialState,
    reducers: {
        resetLayerState: () => {
            return initialState
        },
        changeLayerVisibilty: (state, action) => {
            let name
            Object.entries(state.Layers).map(function(obj) {
                if (obj[1].id===action.payload) {
                    name =  obj[0]
                    return null
                }
                return null
            });
                     
            state.Layers[name].visible = !state.Layers[name].visible
        },
        changeLayerAutohighlight: (state, action) => {
            let name
            Object.entries(state.Layers).map(function(obj) {
                if (obj[1].id===action.payload) {
                    name =  obj[0]
                    return null
                }
                return null
            });
                     
            state.Layers[name].autoHighlight = !state.Layers[name].autoHighlight
        },
        permitLayerToggle: (state, action) => {
            let hide = []
            Object.entries(state.Layers).map(function(obj) {
                if (obj[1].id.match(/^Permit.*$/) && obj[1].id !== action.payload) {
                    hide.push(obj[0])
                    return null
                }
                return null
            });

            let show
            Object.entries(state.Layers).map(function(obj) {
                if (obj[1].id === action.payload) {
                    show = obj[0]
                    return null
                }
                return null
            });
            
            state.Layers[show].visible = true;
            hide.forEach((name) => {
                state.Layers[name].visible = false
            });
            state.data.currentLayerStyle = action.payload;
        },
        allPermitLayersToggle: (state, action) => {
            let all = []
            
            Object.entries(state.Layers).map(function(obj) {
                if (obj[1].id.match(/^Permit.*$/) && obj[1].id !== action.payload) {
                    all.push(obj[0])
                    return null
                }
                return null
            });

            let name
            Object.entries(state.Layers).map(function(obj) {
                if (obj[1].id===state.data.currentLayerStyle) {
                    name =  obj[0]
                    return null
                }
                return null
            });
            
            if (!state.data.permitsVisible) {
                all.forEach((item) => {
                    state.Layers[item].visible = false
                });
                state.Layers[name].visible = true;
                state.data.permitsVisible = true;
            } else {
                all.forEach((item) => {
                    state.Layers[item].visible = false
                });
                state.data.permitsVisible=false;
            }
        },
        totalsLayerToggle: (state, action) => {
        
            //permitsVisible: true
            if (state.data.currentLayerStyle == "Permit Totals") {
                
                state.data.currentLayerStyle = null
                state.Layers.totalsLayer.visible = false
                state.Layers.totalsLayer.enabled = false
                state.Layers.pointLayer.visible = !state.data.permitsVisible?false:true
                state.data.currentLayerStyle = "Permit Points"
            } else {
                state.Layers.totalsLayer.enabled = !state.Layers.totalsLayer.enabled
            }
            
            
        },
        toggleBuildings: (state, action) => {
            state.data.building.building = !state.data.building.building
        },
              
    },
});

export const { 
    resetLayerState,
    changeLayerVisibilty,
    permitLayerToggle,
    allPermitLayersToggle,
    toggleBuildings,
    changeLayerAutohighlight,
    totalsLayerToggle,
} = layerStateSlice.actions;
export default layerStateSlice.reducer;