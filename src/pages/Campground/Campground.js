import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";
import LeaveReview from "./Review/LeaveReview";

import useNotifications from "../../hooks/notificationsHook";
import Post from "../../assests/post.jpg";

const Campground = () => {
    const {user, authToken, notificationError, notificationSuccess} = useNotifications();
    const params = useParams();
    const navigate = useNavigate();
    const [campground, setCampground] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3000/campgrounds/${params.campgroundId}`)
            .then(response => {
                setCampground(response.data.campgrounds)
            })
            .catch(error => {
                notificationError('Error fetching campgrounds')
                console.error('Error fetching campgrounds:', error);
            });

    }, [params.campgroundId]);

    const deleteCampground = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.delete(`http://localhost:3000/campgrounds/${params.campgroundId}?user=${user}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })
            if (response.status === 200) {
                notificationSuccess(response.data.message)
                navigate('/campgrounds');
            } else {
                notificationError(response.data.message)
            }
        } catch (err) {
            notificationError("Error deleting campground")
            console.log("Error: ", err.message)
        }
    }

    if (!campground) {
        return <div>Loading...</div>;
    }

    let carouselButtons
    if (campground.images.length > 1) {
        carouselButtons = (<>
            <button className="carousel-control-prev carousel-dark" type="button" data-bs-target="#campgroundCarousel"
                    data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next carousel-dark" type="button" data-bs-target="#campgroundCarousel"
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
            <form className="d-inline" onSubmit={deleteCampground}>
                <button className="btn btn-danger">Delete</button>
            </form>
        </div>)
    }

    let campgroundImages = null;
    let imagesWithFilename = []
    let imagesWithoutFilename = []
    if (campground.images.length === 0) {
        campgroundImages = (<div className={`carousel-item active`}>
            <img
                src="https://source.unsplash.com/collection/483251/640"
                className="d-block w-100 img-fluid"
                alt="Post"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = Post
                }}
            />
        </div>)
    } else {
        imagesWithFilename = campground.images.filter(image => image.filename && image.filename.length > 0);
        imagesWithoutFilename = campground.images.filter(image => !image.filename || image.filename.length === 0);

    }

    if (imagesWithFilename.length > 0) {
        if (imagesWithFilename.length === 1) {
            carouselButtons = null
        }
        campgroundImages = imagesWithFilename.map((image, index) => (
            <div key={image._id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                <img
                    src={image.url}
                    className="d-block w-100 img-fluid"
                    alt="https://source.unsplash.com/collection/483251/640"
                />
            </div>));
    } else if (imagesWithoutFilename.length > 0) {
        campgroundImages = imagesWithoutFilename.map((image, index) => (
            <div key={image._id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                <img
                    src={image.url}
                    className="d-block w-100 img-fluid"
                    alt="https://source.unsplash.com/collection/483251/640"
                />
            </div>));
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
                            <li className="list-group-item ">Submitted By {campground.author.username}</li>
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