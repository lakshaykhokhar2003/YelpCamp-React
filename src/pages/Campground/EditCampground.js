import {useParams} from "react-router-dom";

const EditCampground = () => {
    const params = useParams()
    return (<div>
        <h1>Edit Campground for {params.campgroundId}</h1>
    </div>)
}
export default EditCampground;