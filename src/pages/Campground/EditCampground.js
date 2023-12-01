import {useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {useEffect} from "react";

const EditCampground = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);
    const params = useParams()
    return (<div>
        <h1>Edit Campground for {params.campgroundId}</h1>
    </div>)
}
export default EditCampground;