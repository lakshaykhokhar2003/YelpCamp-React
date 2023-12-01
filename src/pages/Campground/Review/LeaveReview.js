import {useNavigate} from "react-router-dom";
import styles from './LeaveReview.module.css';
import ShowPageMap from "../../../Maps/ShowPageMap";
import {useRef, useState} from "react";
import axios from "axios";

const LeaveReview = (props) => {
    const [rating, setRating] = useState(0);
    const navigate = useNavigate()
    const handleRatingChange = (event) => {
        setRating(parseInt(event.target.value));
    };
    const commentRef = useRef()
    let addReviewForm
    // console.log(props.campground)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const body = commentRef.current.value
        const user = props.currentUser
        const review = {body, rating, user}
        // console.log(review)
        try {
            const response = await axios.post(`http://localhost:3000/campgrounds/${props.campground._id}/reviews`, review)
            // console.log(response.data)
            if (response.status === 200) {
                navigate(`/campgrounds`)
            }
        } catch (e) {
            console.log("Error in LeaveReview: ", e)
        }
    }

    const deleteReview = async (e, reviewId) => {
        e.preventDefault()
        try {
            const response = await axios.post(`http://localhost:3000/campgrounds/${props.campground._id}/reviews/${reviewId}`)
            if (response.status === 200) {
                navigate(`/campgrounds`)
            }
        } catch (e) {
            console.log("Error in LeaveReview: ", e)
        }
    }
    if (props.currentUser) {
        addReviewForm = (<>
            <h2>Leave a Review</h2>
            <form className="mb-3 validated-form" onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                    <fieldset className={styles['starability-basic']}>
                        <input
                            type="radio"
                            id="no-rate"
                            className="input-no-rate"
                            name="review[rating]"
                            value="1"
                            checked={rating === 0}
                            onChange={handleRatingChange}
                            aria-label="No rating."
                        />
                        <input
                            type="radio"
                            id="second-rate1"
                            name="review[rating]"
                            value="1"
                            checked={rating === 1}
                            onChange={handleRatingChange}
                        />
                        <label htmlFor="second-rate1" title="Terrible">
                            1 star
                        </label>
                        <input
                            type="radio"
                            id="third-rate1"
                            name="review[rating]"
                            value="2"
                            checked={rating === 2}
                            onChange={handleRatingChange}
                        />
                        <label htmlFor="third-rate1" title="Not good">
                            2 stars
                        </label>
                        <input
                            type="radio"
                            id="fourth-rate1"
                            name="review[rating]"
                            value="3"
                            checked={rating === 3}
                            onChange={handleRatingChange}
                        />
                        <label htmlFor="fourth-rate1" title="Average">
                            3 stars
                        </label>
                        <input
                            type="radio"
                            id="fifth-rate1"
                            name="review[rating]"
                            value="4"
                            checked={rating === 4}
                            onChange={handleRatingChange}
                        />
                        <label htmlFor="fifth-rate1" title="Very good">
                            4 stars
                        </label>
                        <input
                            type="radio"
                            id="sixth-rate1"
                            name="review[rating]"
                            value="5"
                            checked={rating === 5}
                            onChange={handleRatingChange}
                        />
                        <label htmlFor="sixth-rate1" title="Amazing">
                            5 stars
                        </label>

                    </fieldset>
                </div>
                <div className="mb-3">
                    <label htmlFor="" className="form-label">Review</label>
                    <textarea className='form-control' name="review[body]" id="body" cols="30" rows="3"
                              required ref={commentRef}></textarea>
                    <div className="valid-feedback">
                        Looks Good
                    </div>
                </div>
                <button className="btn btn-success">Submit</button>
            </form>
        </>)
    }

    return (<>
        <ShowPageMap coordinates={props.campground.geometry.coordinates}/>
        {addReviewForm}
        {props.campground.reviews.map((review, index) => (<div key={index} className="card mb-3">
            <div className="card-body">
                <h5 className="card-title">By {review.author.username}</h5>
                <p className={styles[["starability-result"]]} data-rating={review.rating}>
                    Rated: {review.rating} stars
                </p>
                <p className="card-text">Review: {review.body}</p>
                {props.currentUser && review.author._id === props.currentUser && (
                    <form onSubmit={(e) => deleteReview(e, review._id)}>
                        <button className="btn btn-danger">Delete</button>
                    </form>)}
            </div>
        </div>))}

    </>)


}

export default LeaveReview;