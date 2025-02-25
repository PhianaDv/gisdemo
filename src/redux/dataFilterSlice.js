import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const excludePropName = {
  Permits: "primary_address_flag",
  Customers: "zeroindicator"
};

const initialState = {     
    excludeRange: ["0", "0"],
    sizeBy: "estimated_cost",
    sliceBy: "status",
    slicerValues: [],
    trueKeys: {},
    loading: true,
    error: '',
    tempSlicerValue: {},
    tempTimeFilter: [],
    tempFilterFp: 0,
    tempHighlightFp: 0
};

function getAttributesUrl (payload) {
  
  switch (payload) {
      case "Permits": return "https://raw.githubusercontent.com/PhianaDv/data/refs/heads/main/permit_attributes.json";
  }
  
};


export const getAttributesAsync = createAsyncThunk(
    "slice/getAttributesAsync",
    async (payload) => {
      const response = await fetch(getAttributesUrl(payload));
      
      if (response.ok) {
        const attributes = await response.json();
        return attributes;
      }
    }
  );


const dataFilterSlice = createSlice({
    name: "dataFilters",
    initialState: initialState,
    reducers: {
      resetDataFilterState: (state) => {
        state.excludeRange= ["0", "0"]
        state.sizeBy= "estimated_cost"
        state.sliceBy= "status"
        state.tempSlicerValue= {}
        state.tempTimeFilter= []
        state.tempFilterFp=0
        state.tempHighlightFp=0
        
        for (let i=0;i<state.slicerValues.length;i++) {
        state.slicerValues[i].value = JSON.stringify(JSON.parse(state.slicerValues[i].value).map(
          (obj) => {
           return {...obj, checked: true}
          }
       ))
      };
        
      },
      setTrueKeys : (state, action) => {
        state.trueKeys = {};
        let myData = {}
        for (let i=0;i<state.slicerValues.length;i++) {
          myData[state.slicerValues[i].attribute]= JSON.parse(state.slicerValues[i].value).filter((d) => {return d.checked === true}).map((a) => a.key)
        };
        state.trueKeys = myData
      },
      changeSlicerCheckedValue: (state, action) => {
        
        const i = state.slicerValues.map(function(e) {return e.attribute}).indexOf(action.payload.attribute)
        
        const n = JSON.stringify(JSON.parse(state.slicerValues[i].value).map(
          (obj) => { 
            if (obj.key===action.payload.value) {
              return {...obj, checked: !obj.checked}
            }
            
            return obj;             
            
          }
       ))
       state.slicerValues[i].value = n
      
      },
      selectAllAttribute: (state, action) => {
        const i = state.slicerValues.map(function(e) {return e.attribute}).indexOf(action.payload)
        
        state.slicerValues[i].value = JSON.stringify(JSON.parse(state.slicerValues[i].value).map(
           (obj) => {
            return {...obj, checked: true}
           }
        ))
      },
      clearAllAttribute: (state, action) => {
        const i = state.slicerValues.map(function(e) {return e.attribute}).indexOf(action.payload)
        
        state.slicerValues[i].value = JSON.stringify(JSON.parse(state.slicerValues[i].value).map(
           (obj) => {
            return {...obj, checked: false}
           }
        ))
      },
      tempSlicerValueFilter: (state, action) => {
        let newValue = {};
        if(Object.keys(state.tempSlicerValue).length === 0) {
          newValue = action.payload
        } 
        state.tempSlicerValue = newValue;
      },
      singleSlicerValue : (state, action) => {
        
      },
      setTempTimeFilter: (state, action) => {
        let newValue = []
        if (state.tempTimeFilter.length === 0) {
          newValue = action.payload
        } 
        state.tempTimeFilter = newValue;
        console.log(newValue)
        console.log(action.payload)
      },
      sliderSetTempTimeFilter: (state, action) => {
        state.tempTimeFilter = action.payload
      },
      clearTempTimeFilter: (state, action) => {
        state.tempTimeFilter = []
      },
      setTempFilterFp: (state, action) => {
        let newValue = 0
        if (state.tempFilterFp === 0) {
          newValue = action.payload
        } else if (state.tempFilterFp === action.payload) {
          newValue = 0
        } else {
          newValue = action.payload
        }
        
        state.tempFilterFp = newValue;
      },
      setTempHighlightFp: (state, action) => {
        state.tempHighlightFp = action.payload
        
      }

    },
    extraReducers: (builder) => {
        builder.addCase(getAttributesAsync.pending, (state) => {
            state.loading=true
        })
        builder.addCase(getAttributesAsync.fulfilled, (state, action) => {
            state.loading=false
            state.slicerValues=action.payload
        })
        builder.addCase(getAttributesAsync.rejected, (state, action) => {
            state.loading=false
            state.error=action.error.message
        })
    },
  
});

export const { 
  resetDataFilterState,
  setTrueKeys,
  changeSlicerCheckedValue,
  selectAllAttribute,
  clearAllAttribute,
  tempSlicerValueFilter,
  setTempFilterFp,
  setTempTimeFilter,
  setTempHighlightFp,
  sliderSetTempTimeFilter,
  clearTempTimeFilter
  } = dataFilterSlice.actions;
export default dataFilterSlice.reducer;