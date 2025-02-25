import { configureStore } from "@reduxjs/toolkit";
import borderReducer from "./borderSlice";
import viewStateReducer from "./viewStateSlice";
import pageStateReducer from "./pageStateSlice";
import dataFilterReducer from "./dataFilterSlice";
import layerStateReducer from "./layerSlice";
import pointJsonReducer from "./pointJsonSlice";
import pointDetailReducer from "./pointDetailSlice";
import summaryReducer from './summarySlice';
import temporalReducer from './temporalSlice';
import thunk from "redux-thunk";


export default configureStore({
    reducer: {
       summaryState: summaryReducer,
       borders: borderReducer,
       viewState: viewStateReducer,
       pageState: pageStateReducer,
       dataFilterState: dataFilterReducer,
       layerState: layerStateReducer,
       pointJsonState: pointJsonReducer,
       pointDetailState: pointDetailReducer,
       temporalState: temporalReducer,
    },
    middleware: [thunk]
});
