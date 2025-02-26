import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    loading: true,
    data: [],
    error: '',
    open: false
}
export const getPointDetailAsync = createAsyncThunk(
    "slice/getPointDetailAsync",
    async (payload) => {
        let response
        switch (payload.viewType) {
            case 'Permits': response = await fetch('https://data.sfgov.org/resource/i98e-djp9.json?permit_number='+payload.id);
                break;  
            default: response = await fetch('https://data.sfgov.org/resource/i98e-djp9.json?permit_number='+payload.id);
                break;
        };
      
      if (response.ok) {

        const pointDetail = await response.json();
        console.log(pointDetail)
        const result = payload.viewType == 'Permits' 
            ? {
                x:payload.x,
                y:payload.y,
                pointDetail
            }
            : {
            x: payload.x,
            y: payload.y,
            pointDetail
            }
        return result;
      }
    }
  );
  

const pointDetailSlice = createSlice({
    name: "pointDetail",
    initialState: initialState,
    reducers: {
        resetPointDetailState: () => {
            return initialState
        },
        pointOpen: (state, action) => {
            state.open=action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getPointDetailAsync.pending, (state) => {
            console.log("loading")
            state.loading=true
        })
        builder.addCase(getPointDetailAsync.fulfilled, (state, action) => {
            console.log("loaded")
            state.loading=false
            state.data=action.payload
        })
        builder.addCase(getPointDetailAsync.rejected, (state, action) => {
            console.log("error")
            state.loading=false
            state.error=action.error.message
        })
    },
  
});

export const {pointOpen, resetPointDetailState } = pointDetailSlice.actions;
export default pointDetailSlice.reducer;