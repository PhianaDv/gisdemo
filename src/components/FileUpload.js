import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaFileUpload, FaDropbox } from "react-icons/fa";
import { receiveData } from "../redux/temporalSlice";
import { Tooltip, IconButton } from "@mui/material";
import Button from "@mui/material/Button";


const FileUpload = () => {
    const inputRef = useRef();
    const dispatch = useDispatch();
    const timeData = useSelector((state) => state.temporalState);
    const [file, setFile] = useState(false)
    const onInputClick = () => {
        inputRef.current.click();
    }

    const loadFile = (e) => {
        e.preventDefault();
        const dataFile = file

        if (dataFile) {
            const dataFileUrl = URL.createObjectURL(dataFile);
            dispatch(receiveData({ url: dataFileUrl, type: file.type, name: file.name }));
            setFile(true)
        }
    }

    const handleChange = (e) => {
        if (e.target.files[0].size > 1048576 * 10) {
            alert("File must be less than 10MB")
        } else {
            setFile(e.target.files[0])
        }
    }


    return (

        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "baseline"

            }}>
            <form>
                <input
                    type="file"
                    id='file'
                    ref={inputRef}
                    style={{ display: 'none' }}
                    accept="application/json,.csv,.geojson"
                    onChange={handleChange}
                    onSubmit={handleChange}
                />
            </form>
            <div style={{ alignSelf: "center", width: "15%" }}>
                <Tooltip title="Upload Temporal Data" placement="right-end">
                    <IconButton onClick={onInputClick}><FaFileUpload size="22px" color="white" /></IconButton>
                </Tooltip>
            </div>
            <div style={{ alignSelf: "center", width: "60%", wordWrap: "break-word", marginTop: 2 }}>
                {!file ? (<i>Please upload data in CSV/Json/GeoJson format.</i>)
                    : (<i>{file.name} {(file.size / 1048576).toFixed(2)} MB</i>)}
            </div>
            <div style={{ width: "15%", alignSelf: "flex-end" }}>
                {!timeData.loading ? (<Button variant="contained" color="success" sx={{ textTransform: 'none' }} disabled={!file ? true : false} onClick={(e) => loadFile(e)}>Upload</Button>) :
                    (<Button sx={{ textTransform: 'none' }} variant="outlined" color="primary">Loading</Button>)
                }
            </div>


        </div>

    )
}

export default FileUpload
