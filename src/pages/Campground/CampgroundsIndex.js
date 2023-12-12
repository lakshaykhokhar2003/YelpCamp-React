import {Link} from "react-router-dom";

const CampgroundsIndex = (props) => {
    return (<div className="card mb-3" key={props.campground._id}>
        <div className="row g-0">
            <div className="col-md-4">
                <img
                    src={(props.campground.images[1] && props.campground.images[1].url) || (props.campground.images[0] && props.campground.images[0].url) || "https://source.unsplash.com/collection/483251/640"}
                    className="img-fluid rounded-start"
                    alt=""
                />

            </div>
            <div className="col-md-8">
                <div className="card-body">
                    <h5 className="card-title">{props.campground.title}</h5>
                    <p className="card-text">
                        <small>Location: {props.campground.location}</small>
                    </p>
                    <p className="card-text">{props.campground.description}</p>
                    <p className="card-text">
                        <small className="text-muted">Last updated 3 mins ago</small>
                    </p>
                    <Link to={`/campgrounds/${props.campground._id}`}
                          className="btn btn-primary">View {props.campground.title}</Link>
                </div>
            </div>
        </div>
    </div>)
}

export default CampgroundsIndex;