import { useSelector } from "react-redux";
import LineChart from "./LineChart";
import DoughnutChart from "./DoughnutChart";
import BarChart from "./BarChart";
import { Divider } from "@mui/material";
import { slicers } from "../redux/viewStateSlice";
import { sumByValues } from "../redux/viewStateSlice";
import React, { useEffect } from "react";


const AnalyticsCharts = () => {
  const data = useSelector((state) => 
    state.summaryState.tempFilteredFeatures.length > 0 
      ? state.summaryState.tempFilteredFeatures 
      : state.summaryState.filteredFeatures
  );
  const slicer = useSelector((state) => state.viewState.slicer);
  const sumBy = useSelector((state) => state.viewState.sumBy);
  const viewLevelFp = useSelector((state) => state.viewState.viewLevelFp);
  const viewLevel = useSelector((state) => state.viewState.viewLevel);
  const tempAttributeFilter = useSelector((state) => state.dataFilterState.tempSlicerValue);
  const slicerName = slicers.Permits[slicer];
  const sumByName = sumByValues.Permits[sumBy]; 

  return (
    <div
     className="analyticsCharts"
      style={{
        display: "grid",
        gridTemplateRows: "35vh auto", 
        gridTemplateColumns: "1fr",
        gap: "10px",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        padding: "10px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 2fr", 
          height: "100%",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", padding: "10px" , alignSelf: "center"}}>
          <div style={{ textAlign: "center", fontWeight: "bold" }}>
            {slicerName} Distribution
            <Divider style={{width: "100%"}}/>
          </div>
          <DoughnutChart data={data} slicer={slicer} sumBy={sumBy} />
        </div>

        
        <Divider orientation="vertical" flexItem/>

        <div style={{ display: "flex", flexDirection: "column", padding: "10px" }}>
          <div style={{ textAlign: "center", fontWeight: "bold" }}>
            Top {viewLevel}s
            <Divider style={{width: "100%"}}/>
          </div>
          <BarChart data={data} viewLevelFp={viewLevelFp} sumBy={sumBy} viewLevel={viewLevel} />
        </div>
      </div>


      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "10px",
          height: "100%", 
          minHeight: "0px",
          flexGrow: 1,
          overflow: "hidden", 
          marginTop: 25
        }}
      >
        <div style={{ textAlign: "center", fontWeight: "bold" }}>
          <Divider /> Trends over Time <Divider />
        </div>
        <LineChart data={data} sumBy={sumBy} />
      </div>
      <div style={{ textAlign: "center", fontWeight: "bold" }}>
      <Divider /> Aggregated value of {sumByName} <Divider />
      </div>
    </div>
  );
};

export default AnalyticsCharts;
