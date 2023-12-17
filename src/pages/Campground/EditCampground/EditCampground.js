import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import useNotifications from "../../../hooks/notificationsHook";
import EditCampgroundForm from "./EditCampgroundForm";

const EditCampground = () => {
    const navigate = useNavigate();
    const params = useParams()
    const loc = useLocation();
    const {isAuthenticated, notificationError} = useNotifications()

    const [campground, setCampground] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', {state: {prevUrl: loc.pathname}});
        }
        const fetchCampground = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/campgrounds/${params.campgroundId}/edit`);
                setCampground(response.data.campground);
            } catch (err) {
                notificationError("Error Fetching Campground");
                console.log("Error: ", err.message);
            }
        };
        fetchCampground();
    });

    if (!campground) {
        return <div>Loading...</div>;
    }


    return <div className="row">
        <h1 className="text-center">Edit Campground</h1>
        <div className="col-md-6 offset-md-3">
            <EditCampgroundForm campground={campground}/>
            <Link to={`/campgrounds/${campground._id}`} className="btn btn-danger mt-3">
                Cancel
            </Link>
        </div>
    </div>;
};

export default EditCampground;