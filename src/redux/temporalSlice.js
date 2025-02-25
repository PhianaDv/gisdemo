import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { csvParse } from "d3";

export const radiusMarks = [
    {
      value: 1,
      label: '1',
    },
    {
        value: 25,
        label: '25',
    },
    {
      value: 50,
      label: '50',
    },
    {
      value: 75,
      label: '75',
    },
    {
        value: 100,
        label: '100',
    },
];

export const heightMarks = [
{
  value: 0,
  label: '0',
},
{
  value: 50,
  label: '50',
},
{
  value: 100,
  label: '100',
},
];

export const animationMarks = [
    {
      value: 0.25,
      label: 'x0.25',
    },
    {
      value: 0.50,
      label: 'x0.5',
    },
    {
        value: 0.75,
        label: 'x0.75',
      },
    {
      value: 1.00,
      label: 'x1',
    },
    {
        value: 1.25,
        label: 'x1.25',
    },
    {
        value: 1.50,
        label: 'x1.5',
    },
    {
        value: 1.75,
        label: 'x1.75',
    },
    {
        value: 2.00,
        label: 'x2',
    },
];

export const timeLapse = {
    RunningTotal : "Running Total",
    TimeRange: "Time Range"
}

const initialState = {
    loading: false,
    error: "",
    dataFilter: [],
    timeLapse: "TimeRange",
    notReady: true,
    timeRange: [],
    filterRange: [0, 0],
    weightRange: [],
    loadSlider: false,
    radiusScale: 1,
    heightScale: 0,
    animationMultiplier: 1.00,
    colorRange: {
        lowRangeColor : {label: "Low Range Color", value:'#13eb42'},
        midRangeColor : {label: "Mid Range Color", value:'#E9F842'},
        highRangeColor: {label: "High Range Color", value:'#eb3e13'}
    }
};


const temporalSlice = createSlice({
    name: "temporal",
    initialState: initialState,
    reducers: {
        resetTimeState: () => {
            return initialState
        },
        changeLoadSlider: (state, action) => {
            state.loadSlider = !state.loadSlider
        },
        changeTimeLapse: (state, action) => {
            state.timeLapse = action.payload
        },
        changeAnimationMultiplier: (state, action) => {
            state.animationMultiplier = action.payload           
        },
        getFilterRangeInitial : (state, action) => {
              state.filterRange = action.payload
        },
        getWeightRange : (state, action) => {
            if (!action.payload.data) {
                return null;
              }
              console.log(action.payload.data)
              const weightRange = action.payload.data.reduce(
                (range, d) => {
                  const t = Number(d[action.payload.field]).toFixed(2);
                  range[0] = Math.min(range[0], t);
                  range[1] = Math.min(range[0], t) + ((Math.max(range[1], t)-Math.min(range[0], t))/2);
                  range[2] = Math.max(range[1], t);
                  return range
                },
                [Infinity, -Infinity]
              );
              state.weightRange = weightRange
             
        },
        changeColor : (state, action) => {
            state.colorRange[action.payload.key].value = action.payload.value 
        },
        changeFilterRange : (state, action) => {
            state.filterRange = action.payload
        },
        changeRadiusScale : (state, action) => {
            state.radiusScale = action.payload
        },
        changeHeightScale : (state, action) => {
            state.heightScale = action.payload
        },
        setField: (state, action) => {
            state.fields[action.payload.fieldName] = action.payload.value

            let count = 0
            for (let i in state.fields) {
               
                if (state.fields[i].length>0) {
                    count ++
                }
            }

            if (count === Object.keys(state.fields).length) {
                console.log('ready')
                state.notReady = false
            }
        },
    },
});
export const { 
    resetTimeState, 
    changeTimeLapse,
    setField,
    getFilterRangeInitial,
    getWeightRange,
    loadSlider,
    changeFilterRange,
    changeRadiusScale,
    changeHeightScale,
    changeAnimationMultiplier,
    changeColor,
    changeLoadSlider
} = temporalSlice.actions;
export default temporalSlice.reducer;