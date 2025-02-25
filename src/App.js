import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import './App.css';
import './Loader.css';
import PageDrawers from "./components/PageDrawers";
import MapArea from "./components/MapArea";
import LoaderSub from "./components/LoaderSub";
import PointTip from "./components/PointTip";



function App() {

  const dispatch = useDispatch();
  const iLoading = useSelector((state) => state.pointJsonState.initialLoading);
  const loading = useSelector((state) => state.pointJsonState.loading);
  const timeDataLoading = useSelector((state) => state.temporalState.loading);
  const cursor = !timeDataLoading? 'default' : 'wait';

  return (
    
    <div className="App" style={{cursor:`${cursor}`}}>
      <PointTip/>
      {!iLoading && !loading ? (<></>) : <LoaderSub openSub={loading} openPage={iLoading}/>}
      <MapArea/>
      <PageDrawers />
    </div>
    
  );
}

export default App;
