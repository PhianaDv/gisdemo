import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bbox from "@turf/bbox";




const initialState= {
    current: `https://raw.githubusercontent.com/PhianaDv/data/refs/heads/main/docs/sf/sf_tracts_tiles/{z}/{x}/{y}.pbf`,
    past: [],
    flyTo: [],
    previousFlyTo: [],
}

export const flyToPolygon = (fid) => ({
    Tract: `https://tigerweb.geo.census.gov/arcgis/rest/services/Census2020/Tracts_Blocks/MapServer/8/query?outFields=*&f=geojson&where=GEOID='${fid}'`,
    BlockGroup: `https://tigerweb.geo.census.gov/arcgis/rest/services/Census2020/Tracts_Blocks/MapServer/9/query?outFields=*&f=geojson&where=GEOID='${fid}'`,
    Block: `https://tigerweb.geo.census.gov/arcgis/rest/services/Census2020/Tracts_Blocks/MapServer/10/query?outFields=*&f=geojson&where=GEOID='${fid}'`
});

export const getBbox = createAsyncThunk(
    "slice/getBbox",
    async (payload) => {
    
      const response = await fetch(flyToPolygon(payload.fid)[payload.viewLevel]);
      if (response.ok) {
          const polygon = await response.json()
        const [minLng, minLat, maxLng, maxLat] = bbox(polygon)  
        return {
            flyTo: [[minLng, minLat], [maxLng, maxLat]],
        }
      }
    }
  );

export async function testBorders (viewLevel,upperfid) {
let f
    if (viewLevel === "Tract") {
        f = 1
    } else {
        const response =  await fetch(tBorders(viewLevel, upperfid))

        if (response.ok) {
            const j = await response.json()
            const n = j.features.length>0?1:0
            f = n
        }
    }
return f
}

function tBorders (viewLevel, upperfid) {
    
    switch (viewLevel) {
        case "Tract": return 1;
        case "BlockGroup": return `https://tigerweb.geo.census.gov/arcgis/rest/services/Census2020/Tracts_Blocks/MapServer/9/query?where=GEOID+LIKE+%27${upperfid}%25%27&resultRecordCount=1&outFields=*&f=pjson`        ;
        case "Block": return `https://tigerweb.geo.census.gov/arcgis/rest/services/Census2020/Tracts_Blocks/MapServer/10/query?where=GEOID+LIKE+%27${upperfid}%25%27&resultRecordCount=1&outFields=*&f=pjson`
        ;
        default: return 1;
    }
}

function getBorders (upperfid, viewLevel) {
    switch (viewLevel) {
        case "Tract": return `https://raw.githubusercontent.com/PhianaDv/data/refs/heads/main/docs/sf/sf_tracts_tiles/{z}/{x}/{y}.pbf`;
        case "BlockGroup": return `https://raw.githubusercontent.com/PhianaDv/data/refs/heads/main/docs/sf/sf_blockgrps_tiles/{z}/{x}/{y}.pbf`;
        case "Block": return `https://raw.githubusercontent.com/PhianaDv/data/refs/heads/main/docs/sf/sf_blocks_tiles/{z}/{x}/{y}.pbf`;
       
        default: return "https://raw.githubusercontent.com/PhianaDv/data/refs/heads/main/docs/sf/sf_tracts_tiles/{z}/{x}/{y}.pbf";
    }
};


const borderSlice = createSlice({
    name: "borders",
    initialState: initialState,
    reducers: {
        resetBorderState: () => {return initialState},
        drilldown: (state,action) => {
            const currentBorder = state.current;
            return {
                ...state,
                current: getBorders(action.payload.upperfid, action.payload.viewLevel),
                past: [...state.past,currentBorder]
            }
        },  
        undo: (state, action) => {
            const previous = state.past[state.past.length - 1]
            const newPast = state.past.slice(0, state.past.length - 1)
            const newFlyTo = state.previousFlyTo[state.previousFlyTo.length - 1] == undefined? [] :
            state.previousFlyTo[state.previousFlyTo.length - 1];
            const previousFlyTo = state.previousFlyTo.slice(0, state.previousFlyTo.length - 1)
            

            return {
              past: newPast,
              current: previous,
              previousFlyTo: previousFlyTo,
              flyTo: newFlyTo
            }
        },
        setPreviousFlyTo: (state, action) => {
            const oldFlyTo = state.flyTo
            if (state.previousFlyTo.length === 0 && oldFlyTo === 0) {
                return
            }
            if (state.previousFlyTo.length === 0) {
                state.previousFlyTo = [oldFlyTo]
            } else {
                state.previousFlyTo = [...state.previousFlyTo,oldFlyTo]
            }
        }
    },
    extraReducers:(builder) => {
        builder.addCase(getBbox.fulfilled, (state, action) => {
            let arr = []
            const currentFlyTo = () => {
                if (state.flyTo.length === 0) {
                    return arr
                }
            return state.flyTo
            }
            return {
                ...state,
                flyTo : action.payload.flyTo,
                previousFlyTo : [...state.previousFlyTo, currentFlyTo()]
            }
            
            
        })
    },
    
});
export const { resetBorderState, undo, drilldown, setPreviousFlyTo } = borderSlice.actions;
export default borderSlice.reducer;