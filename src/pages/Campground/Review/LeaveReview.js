import {useParams} from "react-router-dom";
import styles from './LeaveReview.module.css';
import ShowPageMap from "../../../Maps/ShowPageMap";

const LeaveReview = (props) => {
    const params = useParams()
    let addReviewForm
    if (props.currentUser) {
        addReviewForm = (<>
            <h2>Leave a Review</h2>
            <form action="/campgrounds/<%= campground._id %>/reviews" method="post" className="mb-3 validated-form"
                  noValidate>
                <div className="mb-3">
                    <fieldset className={styles[["starability-basic"]]}>
                        <input type="radio" id="no-rate" className="input-no-rate" name="review[rating]" value="1"
                               checked
                               aria-label="No rating."/>
                        <input type="radio" id="second-rate1" name="review[rating]" value="1"/>
                        <label htmlFor="second-rate1" title="Terrible">1 star</label>
                        <input type="radio" id="second-rate2" name="review[rating]" value="2"/>
                        <label htmlFor="second-rate2" title="Not good">2 stars</label>
                        <input type="radio" id="second-rate3" name="review[rating]" value="3"/>
                        <label htmlFor="second-rate3" title="Average">3 stars</label>
                        <input type="radio" id="second-rate4" name="review[rating]" value="4"/>
                        <label htmlFor="second-rate4" title="Very good">4 stars</label>
                        <input type="radio" id="second-rate5" name="review[rating]" value="5"/>
                        <label htmlFor="second-rate5" title="Amazing">5 stars</label>
                    </fieldset>
                </div>
                <div className="mb-3">
                    <label htmlFor="" className="form-label">Review</label>
                    <textarea className='form-control' name="review[body]" id="body" cols="30" rows="3"
                              required></textarea>
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
                {props.currentUser && review.author._id && (
                    <form action={`/campgrounds/${params.campgroundId}/reviews/${review._id}?_method=DELETE`}
                          method="post">
                        <button className="btn btn-danger">Delete</button>
                    </form>)}
            </div>
        </div>))}

    </>)


}

export default LeaveReview;