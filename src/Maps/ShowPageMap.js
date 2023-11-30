import Map, {Marker, NavigationControl, GeolocateControl, FullscreenControl} from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

const token = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
const ShowPageMap = (props) => {
    const latitude = props.coordinates[1];
    const longitude = props.coordinates[0];
    return (<div id="map">
        <Map
            initialViewState={{latitude, longitude, zoom: 10}}
            width="100%"
            height="100%"
            mapboxApiAccessToken={token}
            mapStyle={"mapbox://styles/mapbox/streets-v12"}
        >
            <Marker longitude={longitude} latitude={latitude}/>
            <NavigationControl position="bottom-right"/>
            <FullscreenControl/>
            <GeolocateControl/>
        </Map>
    </div>)
}
export default ShowPageMap;