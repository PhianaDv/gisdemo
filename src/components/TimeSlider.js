import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import { changeFilterRange } from "../redux/temporalSlice";
import { Slider, Button, styled, alpha } from "@mui/material";
import { FaPlay, FaPause } from "react-icons/fa";





const PositionContainer = styled('div')({
    position: 'absolute',
    zIndex: 1,
    bottom: '20px',
    width: '70%',
    marginLeft: '18.5%',
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: `${alpha("#575959", 0.7)}`,
    borderRadius: '10px'

  });
  
const TimeSlider = () => {
    const dispatch = useDispatch();
    const timeData = useSelector((state) => state.temporalState);
    const timeRange = useSelector((state) => 
      state.dataFilterState.tempTimeFilter.length > 0 
        ? state.dataFilterState.tempTimeFilter
        : state.pointJsonState.timeRange
    );
    const [isPlaying, setIsPlaying] = useState(false);
    const [animation] = useState({});
    const MS_PER_DAY = 8.64e7;
    const animationSpeed = (MS_PER_DAY * 20) * timeData.animationMultiplier;

    const formatLabel = useCallback((t) => {
        const date = new Date(t);
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDay()}`;
    });

    const isButtonEnabled = timeData.filterRange[0] > timeRange[0] || timeData.filterRange[1] < timeRange[1];

    useEffect(() => {
        return () => animation.id && cancelAnimationFrame(animation.id);
    }, [animation]);

    if (isPlaying && !animation.id && timeData.timeLapse == 'TimeRange') {
        const span = timeData.filterRange[1] - timeData.filterRange[0];
        let nextValueMin = timeData.filterRange[0] + animationSpeed;
        if (nextValueMin + span >= timeRange[1]) {
          nextValueMin = timeRange[0];
          setIsPlaying(false)
        }
        animation.id = requestAnimationFrame(() => {
          animation.id = 0;
          dispatch(changeFilterRange([nextValueMin, nextValueMin + span]));
          //dispatch(applyTimeFilter([nextValueMin, nextValueMin + span]))
          
        });
    }

    if (isPlaying && !animation.id && timeData.timeLapse == 'RunningTotal') {
      const span = timeData.filterRange[1] - timeData.filterRange[0];
      let nextValueMax = timeData.filterRange[0] + animationSpeed;
      if (nextValueMax + span >= timeRange[1]) {
          
          setIsPlaying(false)
      }
      animation.id = requestAnimationFrame(() => {
        animation.id = 0;
        dispatch(changeFilterRange([timeData.filterRange[0], nextValueMax + span]));
        //dispatch(applyTimeFilter([timeData.filterRange[0], nextValueMax + span]))
        
      });
    };

    // const applyFilter = useCallback(() => {
    //   dispatch(applyTimeFilter({timeRangeFilter:timeData.filterRange}))
    // })

    
  return (
    <PositionContainer>
      <Button color="primary" disabled={!isButtonEnabled} onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? <FaPause color="white" title="Stop" /> : <FaPlay color="white" title="Animate" />}
      </Button>
      <Slider
        disableSwap={true}
        size="small"
        min={timeRange[0]}
        max={timeRange[1]}
        value={timeData.filterRange}
        onChange={(event, newValue) => dispatch(changeFilterRange(newValue))}
        valueLabelDisplay={isPlaying?"on":"auto"}
        valueLabelFormat={formatLabel}
        sx={{marginRight: '4%', color:"white"}}
      />
    </PositionContainer>
  )
}

export default TimeSlider
