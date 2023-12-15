import styles from './LeaveReview.module.css';
import ShowPageMap from "../../../maps/ShowPageMap";
import {useRef, useState} from "react";
import axios from "axios";
import useNotifications from "../../../hooks/notificationsHook";
import {Button, Form} from "react-bootstrap";

const LeaveReview = (props) => {
    const {authToken} = useNotifications()
    const {notificationSuccess, notificationError} = useNotifications()
    const [rating, setRating] = useState(0);
    const handleRatingChange = (event) => {
        setRating(parseInt(event.target.value));
    };
    const commentRef = useRef()

    const [validated, setValidated] = useState(false);
    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault()
            const body = commentRef.current.value
            const user = props.currentUser
            let review
            if (rating === 0) {
                review = {body, rating: 1, user}
            } else {
                review = {body, rating, user}
            }

            try {
                const response = await axios.post(`http://localhost:3000/campgrounds/${props.campground._id}/reviews`, review, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                })
                if (response.status === 200) {
                    notificationSuccess(response.data.message)
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000)
                } else {
                    notificationError(response.data.me)
                }
            } catch (e) {
                notificationError("Error Adding Review")
                console.log("Error in LeaveReview: ", e)
            }
        }
        setValidated(true);
    }
    const [review, setReview] = useState(props.campground.reviews)
    const deleteReview = async (e, reviewId) => {
        e.preventDefault()
        const user = props.currentUser
        try {
            const response = await axios.delete(`http://localhost:3000/campgrounds/${props.campground._id}/reviews/${reviewId}?user=${user}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })
            if (response.status === 200) {
                setReview(review.filter(review => review._id !== reviewId))
                notificationSuccess(response.data.message)
            } else {
                notificationError(response.data.message)
            }
        } catch (e) {
            notificationError("Error Deleting Review")
            console.log("Error in LeaveReview: ", e)
        }
    }
    let addReviewForm
    if (props.currentUser) {
        addReviewForm = (<>
            <h2>Leave a Review</h2>
            <Form className="mb-3 validated-form" onSubmit={handleSubmit} noValidate validated={validated}>
                <Form.Group className="mb-3">
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
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Review</Form.Label>
                    <Form.Control
                        as="textarea"
                        className="form-control"
                        name="review[body]"
                        id="body"
                        cols="30"
                        rows="3"
                        required
                        ref={commentRef}
                    />
                    <Form.Control.Feedback type="valid">Looks Good</Form.Control.Feedback>
                </Form.Group>

                <Button className="btn btn-success" type="submit">
                    Submit
                </Button>
            </Form>
        </>)
    }

    return (<>
        <ShowPageMap coordinates={props.campground.geometry.coordinates}/>
        {addReviewForm}
        {review.map((review, index) => (<div key={index} className="card mb-3">
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