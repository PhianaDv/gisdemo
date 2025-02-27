import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const excludePropName = {
  Permits: "primary_address_flag",
  Customers: "zeroindicator"
};

export const slicerValues = [
  {
    "attribute": "permit_type_definition",
    "value": [
      {"key": "additions alterations or repairs", "value": 1, "checked": true},
      {"key": "sign - erect", "value": 2, "checked": true},
      {"key": "otc alterations permit", "value": 3, "checked": true},
      {"key": "wall or painted sign", "value": 4, "checked": true},
      {"key": "demolitions", "value": 5, "checked": true},
      {"key": "grade or quarry or fill or excavate", "value": 6, "checked": true},
      {"key": "new construction wood frame", "value": 7, "checked": true},
      {"key": "new construction", "value": 8, "checked": true}
    ]
  },
  {
    "attribute": "proposed_units_tier",
    "value": [
      {"key": "51-100", "value": 1, "checked": true},
      {"key": "1", "value": 2, "checked": true},
      {"key": "11-50", "value": 3, "checked": true},
      {"key": "0", "value": 4, "checked": true},
      {"key": "101-500", "value": 5, "checked": true},
      {"key": "2-10", "value": 6, "checked": true},
      {"key": "501-1000", "value": 7, "checked": true},
      {"key": ">1000", "value": 8, "checked": true}
    ]
  },
  {
    "attribute": "proposed_use",
    "value": [
      {"key": "mortuary", "value": 1, "checked": true},
      {"key": "hospital", "value": 2, "checked": true},
      {"key": "health studios & gym", "value": 3, "checked": true},
      {"key": "jail", "value": 4, "checked": true},
      {"key": "museum", "value": 5, "checked": true},
      {"key": "residential hotel", "value": 6, "checked": true},
      {"key": "prkng garage/private", "value": 7, "checked": true},
      {"key": "prson'l svc tutor", "value": 8, "checked": true},
      {"key": "warehouse, furniture", "value": 9, "checked": true},
      {"key": "massage parlor", "value": 10, "checked": true},
      {"key": "office", "value": 11, "checked": true},
      {"key": "moving & storage", "value": 12, "checked": true},
      {"key": "workshop residential", "value": 13, "checked": true},
      {"key": "theater", "value": 14, "checked": true},
      {"key": "prkng garage/public", "value": 15, "checked": true},
      {"key": "retail sales", "value": 16, "checked": true},
      {"key": "clinics-medic/dental", "value": 17, "checked": true},
      {"key": "tourist hotel/motel", "value": 18, "checked": true},
      {"key": "tower", "value": 19, "checked": true},
      {"key": "child care", "value": 20, "checked": true},
      {"key": "muni driver restroom", "value": 21, "checked": true},
      {"key": "public assmbly other", "value": 22, "checked": true},
      {"key": "day care home gt 12", "value": 23, "checked": true},
      {"key": "muni carbarn", "value": 24, "checked": true},
      {"key": "food/beverage hndlng", "value": 25, "checked": true},
      {"key": "chemical processing", "value": 26, "checked": true},
      {"key": "power plant", "value": 27, "checked": true},
      {"key": "dairies/dairy equip.", "value": 28, "checked": true},
      {"key": "storage shed", "value": 29, "checked": true},
      {"key": "phone xchnge/equip", "value": 30, "checked": true},
      {"key": "filling/service stn", "value": 31, "checked": true},
      {"key": "animal sale or care", "value": 32, "checked": true},
      {"key": "nursing home non amb", "value": 33, "checked": true},
      {"key": "misc group residns.", "value": 34, "checked": true},
      {"key": "dry cleaners", "value": 35, "checked": true},
      {"key": "recreation bldg", "value": 36, "checked": true},
      {"key": "day care center", "value": 37, "checked": true},
      {"key": "meat/produce marts", "value": 38, "checked": true},
      {"key": "lending institution", "value": 39, "checked": true},
      {"key": "barber/beauty salon", "value": 40, "checked": true},
      {"key": "ambulance service", "value": 41, "checked": true},
      {"key": "dance hall", "value": 42, "checked": true},
      {"key": "warehouse,no frnitur", "value": 43, "checked": true},
      {"key": "nite club", "value": 44, "checked": true},
      {"key": "sfpd or sffd station", "value": 45, "checked": true},
      {"key": "church", "value": 46, "checked": true},
      {"key": "swimming pool", "value": 47, "checked": true},
      {"key": "storage tanks", "value": 48, "checked": true},
      {"key": "club", "value": 49, "checked": true},
      {"key": "nursing home gt 6", "value": 50, "checked": true},
      {"key": "nursery(floral)", "value": 51, "checked": true},
      {"key": "manufacturing", "value": 52, "checked": true},
      {"key": "temple", "value": 53, "checked": true},
      {"key": "not applicable", "value": 54, "checked": true},
      {"key": "building materials", "value": 55, "checked": true},
      {"key": "parking lot", "value": 56, "checked": true},
      {"key": "automobile sales", "value": 57, "checked": true},
      {"key": "nursing home lte 6", "value": 58, "checked": true},
      {"key": "christmas tree lot", "value": 59, "checked": true},
      {"key": "day care home 7 - 12", "value": 60, "checked": true},
      {"key": "r-3(dwg) nursing", "value": 61, "checked": true},
      {"key": "greenhouse", "value": 62, "checked": true},
      {"key": "2 family dwelling", "value": 63, "checked": true},
      {"key": "accessory cottage", "value": 64, "checked": true},
      {"key": "sign", "value": 65, "checked": true},
      {"key": "convalescent home", "value": 66, "checked": true},
      {"key": "laundry/laundromat", "value": 67, "checked": true},
      {"key": "antenna", "value": 68, "checked": true},
      {"key": "explosives handling", "value": 69, "checked": true},
      {"key": "artist live/work", "value": 70, "checked": true},
      {"key": "auto repairs", "value": 71, "checked": true},
      {"key": "stadium", "value": 72, "checked": true},
      {"key": "radio & tv stations", "value": 73, "checked": true},
      {"key": "adult entertainment", "value": 74, "checked": true},
      {"key": "day care home lt 7", "value": 75, "checked": true},
      {"key": "printing plant", "value": 76, "checked": true},
      {"key": "sewage plant", "value": 77, "checked": true},
      {"key": "library", "value": 78, "checked": true},
      {"key": "unknown", "value": 79, "checked": true},
      {"key": "consulate", "value": 80, "checked": true},
      {"key": "wholesale sales", "value": 81, "checked": true},
      {"key": "apartments", "value": 82, "checked": true},
      {"key": "sound studio", "value": 83, "checked": true},
      {"key": "garment shops", "value": 84, "checked": true},
      {"key": "1 family dwelling", "value": 85, "checked": true},
      {"key": "social care facility", "value": 86, "checked": true},
      {"key": "day care, non-res", "value": 87, "checked": true},
      {"key": "car wash", "value": 88, "checked": true},
      {"key": "vacant lot", "value": 89, "checked": true},
      {"key": "school", "value": 90, "checked": true},
      {"key": "fence/retaining wall", "value": 91, "checked": true},
      {"key": "workshop commercial", "value": 92, "checked": true},
      {"key": "bath house", "value": 93, "checked": true},
      {"key": "amusement center", "value": 94, "checked": true}
    ]
  },
  {
    "attribute": "status",
    "value": [
      {"key": "cancelled", "value": 1, "checked": true},
      {"key": "appeal", "value": 2, "checked": true},
      {"key": "issued", "value": 3, "checked": true},
      {"key": "revoked", "value": 4, "checked": true},
      {"key": "withdrawn", "value": 5, "checked": true},
      {"key": "reinstated", "value": 6, "checked": true},
      {"key": "denied", "value": 7, "checked": true},
      {"key": "approved", "value": 8, "checked": true},
      {"key": "expired", "value": 9, "checked": true},
      {"key": "unknown", "value": 10, "checked": true},
      {"key": "suspend", "value": 11, "checked": true},
      {"key": "complete", "value": 12, "checked": true}
    ]
  }
]

const initialState = {     
    excludeRange: ["0", "0"],
    sizeBy: "estimated_cost",
    sliceBy: "status",
    slicerValues: slicerValues,
    trueKeys: {},
    loading: true,
    error: '',
    tempSlicerValue: {},
    tempTimeFilter: [],
    tempFilterFp: 0,
    tempHighlightFp: 0
};



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
        state.slicerValues[i].value = state.slicerValues[i].value.map(
          (obj) => {
           return {...obj, checked: true}
          }
       )
      };
        
      },
      setTrueKeys : (state, action) => {
        state.trueKeys = {};
        let myData = {}
        for (let i=0;i<state.slicerValues.length;i++) {
          myData[state.slicerValues[i].attribute]= state.slicerValues[i].value.filter((d) => {return d.checked === true}).map((a) => a.value)
        };
        state.trueKeys = myData
      },
      changeSlicerCheckedValue: (state, action) => {
        
        const i = state.slicerValues.map(function(e) {return e.attribute}).indexOf(action.payload.attribute)
        
        const n = state.slicerValues[i].value.map(
          (obj) => { 
            if (obj.key===action.payload.value) {
              return {...obj, checked: !obj.checked}
            }
            
            return obj;             
            
          }
       )
       state.slicerValues[i].value = n
      
      },
      selectAllAttribute: (state, action) => {
        const i = state.slicerValues.map(function(e) {return e.attribute}).indexOf(action.payload)
        
        state.slicerValues[i].value = state.slicerValues[i].value.map(
           (obj) => {
            return {...obj, checked: true}
           }
        )
      },
      clearAllAttribute: (state, action) => {
        const i = state.slicerValues.map(function(e) {return e.attribute}).indexOf(action.payload)
        
        state.slicerValues[i].value = state.slicerValues[i].value.map(
           (obj) => {
            return {...obj, checked: false}
           }
        )
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