import { styled } from "@mui/material/styles";

const LoaderSub = (props) => {
    const { openPage, openSub } = props;
    const DrawerItems = styled("div")(({ theme }) => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    }));

    const path = process.env.PUBLIC_URL;
    const image = "/name.png";
    const image2 = "/earth3.jpg";
    const loading = !openPage ? `` : `url(${path + image2})`
    const skcolors = !openPage? `linear-gradient(180deg,#57C300, #EF3D48, #EF018D)` : `linear-gradient(180deg, #fff9b1af, #0e007ca4)`



    return (
        <div
            className="loaderFull"
            style={{
                display: `!${openSub}?"None":"block"`,
                backgroundImage: `${loading}`,
                backgroundSize: "cover", // Ensure the image stretches to cover the entire div
                backgroundRepeat: "no-repeat", // Prevent the image from repeating
                backgroundPosition: "center", // Center the image (optional)

            }}>
            {!openPage ? (<></>) : (<div className="attrText">
                Photo by <a href="https://unsplash.com/@nasa?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">NASA</a> on <a href="https://unsplash.com/photos/Q1p7bh3SHj8?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

            </div>)}
           
            <DrawerItems key="DrawerItems">
                {openPage ?
                    (<div style={{textAlign: "center"}} className="loaderPageText">Loading Demo GIS Analytics</div>)
                    : (<div className="loaderText">Loading</div>)}
                <div className="loader">
                    <div className="sk-chase-dot" style={{'--background':`${skcolors}`}}></div>
                    <div className="sk-chase-dot" style={{'--background':`${skcolors}`}}></div>
                    <div className="sk-chase-dot" style={{'--background':`${skcolors}`}}></div>
                    <div className="sk-chase-dot" style={{'--background':`${skcolors}`}}></div>
                    <div className="sk-chase-dot" style={{'--background':`${skcolors}`}}></div>
                    <div className="sk-chase-dot" style={{'--background':`${skcolors}`}}></div>
                </div>
            </DrawerItems>
        </div>
    )
}

export default LoaderSub
