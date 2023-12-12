import {useRef} from 'react';
import {Map, Source, Layer, NavigationControl, FullscreenControl} from 'react-map-gl';


const token = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN; // Set your Mapbox token here

const ClusterMap = (props) => {
    // const [campgrounds, setCampgrounds] = useState({});

    const mapRef = useRef(null);
    const clusterLayer = {
        id: 'clusters', type: 'circle', source: 'earthquakes', filter: ['has', 'point_count'], paint: {
            'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
            'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
        }
    };

    const clusterCountLayer = {
        id: 'cluster-count', type: 'symbol', source: 'earthquakes', filter: ['has', 'point_count'], layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    };

    const unclusteredPointLayer = {
        id: 'unclustered-point', type: 'circle', source: 'earthquakes', filter: ['!', ['has', 'point_count']], paint: {
            'circle-color': '#11b4da', 'circle-radius': 4, 'circle-stroke-width': 1, 'circle-stroke-color': '#fff'
        }
    };


    const convertToGeoJSON = (campgrounds) => {
        return {
            type: "FeatureCollection", features: campgrounds.map(campground => ({
                type: "Feature", geometry: campground.geometry, properties: {
                    id: campground._id, title: campground.title,
                }
            }))
        };
    };
    const geoData = convertToGeoJSON(props.data);

    return (<div id="cluster-map">
        <Map
            initialViewState={{
                latitude: 28.644800, longitude: 77.216721, zoom: 3
            }}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            mapboxApiAccessToken={token}
            interactiveLayerIds={[clusterLayer.id]}
            ref={mapRef}
        >
            <Source
                id="earthquakes"
                type="geojson"
                data={geoData}
                cluster={true}
                clusterMaxZoom={14}
                clusterRadius={50}
            >
                <Layer {...clusterLayer} />
                <Layer {...clusterCountLayer} />
                <Layer {...unclusteredPointLayer} />
            </Source>
            <NavigationControl position="bottom-right"/>
            <FullscreenControl/>
        </Map>
    </div>);
}

export default ClusterMap;