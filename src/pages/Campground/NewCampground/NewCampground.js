import {Link, useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import useNotifications from "../../../hooks/notificationsHook";
import NewCampgroundForm from "./NewCampgroudForm";

const NewCampground = () => {
    const {isAuthenticated} = useNotifications()
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', {state: {prevUrl: location.pathname}});
        }
    }, [isAuthenticated, navigate, location]);


    return (<div className="row">
        <h1 className="text-center">New Campground</h1>
        <div className="col-md-6 offset-md-3">
            <div className="card shadow">
                <div className="card-body">
                    <NewCampgroundForm/>
                    <Link to="/campgrounds" className="btn btn-danger mt-3">
                        Cancel
                    </Link>
                </div>
            </div>
        </div>
    </div>);
};

export default NewCampground;
