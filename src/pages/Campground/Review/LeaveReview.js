import styles from './LeaveReview.module.css';
import ShowPageMap from "../../../maps/ShowPageMap";
import {useState} from "react";
import axios from "axios";
import useNotifications from "../../../hooks/notificationsHook";
import ReviewForm from "./ReviewForm";

const LeaveReview = (props) => {
    const {authToken} = useNotifications()
    const {notificationSuccess, notificationError} = useNotifications()

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
                notificationSuccess(response.data.message)
                setReview(review.filter(review => review._id !== reviewId))
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
        addReviewForm = <ReviewForm campground={props.campground} currentUser={props.currentUser}/>
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