import {Link, useParams} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";
import LeaveReview from "./Review/LeaveReview";
import {useSelector} from "react-redux";

const Campground = () => {
    const params = useParams();
    const [campground, setCampground] = useState(null);
    const user = useSelector(state => state.auth.user);
    useEffect(() => {
        axios.get(`http://localhost:3000/campgrounds/${params.campgroundId}`)
            .then(response => {
                setCampground(response.data.campgrounds)
                // console.log(response.data.campgrounds)
            })
            .catch(error => {
                console.error('Error fetching campgrounds:', error);
            });

    }, [params.campgroundId]);


    if (!campground) {
        return <div>Loading...</div>;
    }

    let carouselButtons
    if (campground.images.length > 1) {
        carouselButtons = (<>
            <button className="carousel-control-prev" type="button" data-bs-target="#campgroundCarousel"
                    data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#campgroundCarousel"
                    data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </>)
    }

    let campgroundEditDeleteButtons
    if (user && campground.author._id === user) {
        campgroundEditDeleteButtons = (<div className="card-body d-flex gap-1">
            <Link to={`/campgrounds/${campground._id}/edit`} className="btn btn-info">Edit</Link>
            <form className="d-inline" method="POST">
                <button className="btn btn-danger">Delete</button>
            </form>
        </div>)
    }

    let campgroundImages
    if (campground.images.length === 0) {
        campgroundImages = <div className="carousel-item active">
            <img
                src="https://source.unsplash.com/collection/483251/640"
                className="d-block w-100" alt="..."/>
        </div>
    } else {
        campgroundImages = campground.images.map((image, index) => (
            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                <img
                    src={image.url}
                    className="d-block w-100" alt="..."/>
            </div>))
    }

    return (<div className="container mt-5">
        <div className="row mb-3">
            <div className="col-6 ">
                <div id="campgroundCarousel" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        {campgroundImages}
                    </div>
                    {carouselButtons}
                </div>
                <div className="card">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">{campground.title}
                            </h5>
                            <p className="card-text">
                                {campground.description}
                            </p>

                        </div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item text-muted">
                                {campground.location}
                            </li>
                            <li className="list-group-item ">Submited By {campground.author.username}</li>
                            <li className="list-group-item">$
                                {campground.price} Per Night
                            </li>
                        </ul>
                        {campgroundEditDeleteButtons}
                        <div className="card-footer">
                            <Link to="/campgrounds" className="btn btn-primary">Back To Campgrounds</Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-6">
                <LeaveReview currentUser={user} campground={campground}/>
            </div>
        </div>
    </div>)
};

export default Campground;