import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    openAnalytics: false,
    openLayers: false,
    openLegend: false,
    openViews: false,
    openSliders: false,
    building: true,
    openLoading: true,
    openPieTooltip: false
};

const pageStateSlice = createSlice({
    name: "pageStateSlice",
    initialState: initialState,
    reducers: {
        resetPageState: () => {
            return initialState
        },
        switchAnalytics: (state) => {
            state.openAnalytics = !state.openAnalytics
        },
        switchLayers: (state) => {
            state.openLayers = !state.openLayers
        },
        switchLegend: (state) => {
            state.openLegend = !state.openLegend
        },
        switchViews: (state) => {
            state.openViews = !state.openViews
        },
        switchSliders: (state) => {
            state.openSliders = !state.openSliders
        },
        switchBuilding: (state) => {
            state.openSliders = !state.openSliders
        },
        switchLoading: (state) => {
            state.openLoading = !state.openSliders
        },
        switchPieTooltip: (state) => {
            state.openPieTooltip = !state.openPieTooltip
        },

    }
})

export const { 
    resetPageState,
    switchAnalytics, 
    switchLayers, 
    switchLegend, 
    switchViews, 
    switchSliders,
    switchBuilding,
    switchLoading,
    switchPieTooltip
} = pageStateSlice.actions;
export default pageStateSlice.reducer