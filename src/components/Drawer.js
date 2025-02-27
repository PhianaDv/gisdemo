import Drawer from "@mui/material/Drawer";
import { FaRegTimesCircle, FaEyeSlash, FaEye } from "react-icons/fa";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { alpha, Divider } from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';
import { Checkbox, Box } from '@mui/material';

const btnStyle = {
  display: "flex",
  fontFamily: "sans-serif",
  fontSize: 12,
  color:"white",
  textTransform: "capitalize",
  height: "33.3%",
  borderRadius: 0,
  border: 0,
  boxSizing: "border-box",

  "&:hover": {
    color: "white",
    backgroundColor: alpha("#575959", 0.7),
    opacity: 1
  },
  "&.Mui-selected": {
    color: "white",
    backgroundColor: alpha("#575959", 0.9),
    borderBottom: 2,
    borderColor: "#3C3D3D",
    boxSizing: "border-box"
  }
};


const DrawerItems = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row", // Default flex direction for desktop
  width: "fit-content",
  height: "fit-content",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column", // Change to column layout on mobile
  },
}));
const DrawerClose = styled("div")(({ theme }) => ({
  width: "6",
  position: "fixed",
  alignSelf: "flex-end"
}));

const ButtonDescription = styled("div")(({ theme }) => ({
  padding: 5,
  fontFamily: "sans-serif",
  fontSize: 14,
  alignSelf: "center"
}));

export default function Drawers(props) {
  const {
    marginTop,
    marginLeft,
    marginBottom,
    myKey,
    height,
    width,
    anchor,
    open,
    onClick,
    ButtonList,
    ToggleList,
    onClickToggle,
    currentPermitStyle,
    permitsVisible,
    TogglePermits,
    Charts,
    ButtonClick,
    backgroundColor,
    overflow,
    checkboxData,
    handleBuildings,
    padding,
    handleHighlight,
    toggleButtonEnabled
  } = props;

  return (
    <Drawer
      key={myKey}
      className="drawers"
      sx={{
        height: "fit-content",
        width: "fit-content",
        marginLeft: { marginLeft },
        marginTop: { marginTop },
        marginBottom: {marginBottom},
        overflow: {overflow},
        display: "flex",
        flexDirection: "column",
        float: "left",
        "& .MuiDrawer-paper": {
          height: "fit-content",
          width: "fit-content",
          padding: { padding },
          marginLeft: { marginLeft },
          marginBottom: {marginBottom},
          marginTop: { marginTop },
          overflow: { overflow },
          display: "flex",
          flexDirection: "column",
          float: "left",
          backgroundColor: { backgroundColor },
          color: "white",
        }
      }}
      variant="persistent"
      anchor={anchor}
      open={open}
    >
      <DrawerItems key="DrawerItems">
       {!ToggleList ? (
          <></>
        ) : (
          <div className="layerDrawerItem"
                style={{
                  display: "flex", 
                  flexDirection:"row", 
                  width:"fit-content",
                  height: "fit-content",
                  backgroundColor:alpha("#575959", 0.4),
                  borderRight: "1px solid rgba(87, 89, 89, 0.7)",
                  borderBottom: "1px solid rgba(87, 89, 89, 0.7)"
                }}>
            <ButtonDescription className="buttonLayer" key={"PermitGroups"} sx={{alignSelf:"center", paddingLeft:1}}>Permit
            <Tooltip
                key={"ttPermitLayer"}
                title={permitsVisible === false ? "Show" : "Hide"}
                placement="bottom"
              >
                <IconButton id="PermitLayerSwitch" onClick={TogglePermits} style={{marginLeft:10, marginTop:-1}}>
                  {permitsVisible === false ? (
                    <FaEyeSlash size="22px" color="white" />
                  ) : (
                    <FaEye size="22px" color="white" />
                  )}
                </IconButton>
              </Tooltip>
            </ButtonDescription>
            
             <ToggleButtonGroup
            key="tgPermitLayer"
            value={currentPermitStyle}
            exclusive
            orientation={"vertical"}
            sx={{
              width: "37.5%",
              height: "100%",
              boxSizing: "border-box",
               }}
            disabled={!permitsVisible}
          >
          {Object.entries(ToggleList).map(([key, value]) => (
            <ToggleButton key={"tb" + key} value={key} sx={btnStyle}  disabled={!value.enabled} onClick={(e) => {
              if (!value.enabled) return;
              onClickToggle(e);
            }}>
              {key.split(' ').pop()}
              
            </ToggleButton>
            
          ))}
          </ToggleButtonGroup>
         

          
          <Divider orientation="vertical"/>
         
          </div>
        )}
        
        {!ButtonList ? (
          <></>
        ) : (
          Object.entries(ButtonList).map(([key, value]) => (
            <div layerDrawerItem
              style={{ borderRight: "1px solid rgba(87, 89, 89, 0.7)",
                borderBottom: "1px solid rgba(87, 89, 89, 0.7)",
              display: "flex", 
              flexDirection: "column",
              paddingLeft:4}}>
            <ButtonDescription key={"bd" + key} className="buttonLayer" sx={{alignSelf:"center"}}>
              {key}
              <Tooltip
                key={"tt" + key}
                title={value[0] === false ? "Show" : "Hide"}
                placement="bottom"
              >
                <IconButton size="small" id={key} onClick={ButtonClick} style={{marginLeft:10, marginTop:-1}}>
                  {value[0] === false ? (
                    <FaEyeSlash size="20px" color="white"/>
                  ) : (
                    <FaEye size="20px" color="white" />
                  )}
                </IconButton>
              </Tooltip>
            </ButtonDescription>
            {value[1] == undefined ? (<></>) :
            <FormControlLabel
              sx={{
                height:"fit-content"
              }}
              control={
              <Checkbox 
                  id={`${key}`} 
                  size={"medium"}
                  disabled={value[0]===false?true:false}
                  checked={value[1]}
                  padding={1}
                  onClick={handleHighlight}
                  sx={{
                    color: "white",
                    
                    '&.Mui-checked': {
                      color: "white",
                    },
                    '&:hover': {
                      opacity:0.8
                        
                    },
                    '&.Mui-disabled': {
                      color: "gray",
                    },
                   }}
              />
            }
              label={
              <Box component="div" fontSize={12} sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                 Autohighlight
              </Box>
            }/>
          }
            </div>
          ))
        )}
      
        {Charts}
        {!checkboxData ? (
          <></>
        ) : (
          Object.entries(checkboxData).map(([key,value]) => 
        <FormControlLabel key={"cbBuildings"} sx={{overflowWrap:"anywhere", width: "12%", padding: 1}} control={
              <Checkbox 
                  id={key} 
                  size={"medium"}
                  checked={value}
                  padding={1}
                  onClick={handleBuildings}
                  sx={{
                    color: "white",
                    
                    '&.Mui-checked': {
                      color: "white",
                    },
                    '&:hover': {
                      opacity:0.8
                        
                    },
          
                   }}
                  //style={{accentColor:colorSuppliers(key)}}
                  />}
                  label={
                    <Box component="div" fontSize={12} sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                       Show Buildings
                     </Box>
               }
             />))}
      </DrawerItems>

      <DrawerClose key="DrawerClose">
        <IconButton key="close" onClick={onClick}>
          <FaRegTimesCircle size="17px" color="white" />
        </IconButton>
      </DrawerClose>
    </Drawer>
  );
}
