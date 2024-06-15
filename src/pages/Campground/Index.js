import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import CampgroundsIndex from "./CampgroundsIndex";
import ClusterMap from "../../maps/ClusterMap";
import useNotifications from "../../hooks/notificationsHook";

const AllCampgrounds = () => {
    const [campgrounds, setCampgrounds] = useState([]);
    const {notificationError} = useNotifications()
    useEffect(() => {
        axios.get('http://localhost:3000/campgrounds')
            .then(response => {
                setCampgrounds(response.data.campgrounds);
                // console.log(response.data.campgrounds);
            })
            .catch(error => {
                notificationError('Error fetching campgrounds')
                console.error('Error fetching campgrounds:', error);
            });

    }, []);

    return (<div className="container mt-5">
        <ClusterMap data={campgrounds}/>
        <h1>All Campgrounds</h1>
        <Link to="/campgrounds/new" className="btn btn-outline-info mb-3">
            Create A New Campground
        </Link>
        {campgrounds.map((campground) => (<CampgroundsIndex key={campground._id} campground={campground}/>))}
    </div>);
};

export default AllCampgrounds;
