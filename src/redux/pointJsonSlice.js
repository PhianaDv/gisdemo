import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const pointData = `https://raw.githubusercontent.com/PhianaDv/data/refs/heads/main/sf_building_permits.json`

const initialState = {
    initialLoading: true,
    loading: true,
    pastDataLinks: [],
    data: {},
    error: '',
    timeRange: []
    }


export const getPointsAsync = createAsyncThunk(
    "slice/getPointsAsync",
    async (payload) => {
      const response = await fetch(pointData);
      
      if (response.ok) {
        const pointData = await response.json();
        return pointData
        }
      }
    
  );

  
const pointJsonSlice = createSlice({
    name: "pointJsonSlice",
    initialState: initialState,
    reducers: {
        resetPointJsonState: (state) => {
            state.initialLoading = true
            state.loading = true
        },
        resetPointJsonStateFinish: (state) => {
            state.initialLoading = false
            state.loading = false
        },
        getTimeRange : (state, action) => {
            if (state.loading || !state.data || !state.data.features) {
                return;
              }

              
                const times = state.data.features.map(d => d.properties.permit_creation_timestamp);
                // Sort the totals to calculate percentiles
                times.sort((a, b) => a - b);
          
                const min = times[0]
                const max = times[times.length - 1];
                state.timeRange = [min, max]
    
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getPointsAsync.pending, (state) => {
            state.loading=true

        })
        builder.addCase(getPointsAsync.fulfilled, (state, action) => {
            state.data=action.payload
            state.loading=false
            state.initialLoading=false
            
        })
        builder.addCase(getPointsAsync.rejected, (state, action) => {
            state.loading=false
            state.error=action.error.message
        })
    },
  
});

export const {
    getTimeRange,
    resetPointJsonState,
    resetPointJsonStateFinish
} = pointJsonSlice.actions
export default pointJsonSlice.reducer;