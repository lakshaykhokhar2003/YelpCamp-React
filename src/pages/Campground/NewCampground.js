import {useDispatch, useSelector} from "react-redux";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {msgActions} from "../../store/message";
const NewCampground = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const user = useSelector(state => state.auth.user);

    const [buttonText, setButtonText] = useState('Add A Campground');
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', {state: {prevUrl: location.pathname}});
        }
    }, [isAuthenticated, navigate, location]);

    const [campground, setCampground] = useState({
        title: '', location: '', price: '', description: '',
    });
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setCampground({...campground, [name]: value});
    };

    const [images, setImages] = useState([]);


    const handleImageChange = (e) => {
        setImages(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonText('Adding...');
        const formData = new FormData();
        formData.append('title', campground.title);
        formData.append('location', campground.location);
        formData.append('price', campground.price);
        formData.append('description', campground.description);
        formData.append('author', user);
        for (let i = 0; i < images.length; i++) {
            formData.append('image', images[i]);
        }

        try {
            const response = await axios.post('http://localhost:3000/campgrounds/new', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                dispatch(msgActions.success(response.data.message))
                setButtonText('Add A Campground');
                navigate('/campgrounds');
            } else {
                dispatch(msgActions.error(response.data.message))
                setButtonText('Add A Campground');
            }
        } catch (err) {
            console.log("Error: ", err.message);
        }
    };

    return (<div className="row">
        <h1 className="text-center">New Campground</h1>
        <div className="col-md-6 offset-md-3">
            <div className="card shadow">
                <div className="card-body">
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="mb-3">
                            <label className="form-label" htmlFor="title">
                                Title
                            </label>
                            <input
                                className="form-control"
                                id="title"
                                name="title"
                                value={campground.title}
                                onChange={handleInputChange}
                                required
                            />
                            <div className="valid-feedback">Looks Good</div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="location">
                                Location
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                id="location"
                                name="location"
                                value={campground.location}
                                onChange={handleInputChange}
                                required
                            />
                            <div className="valid-feedback">Looks Good</div>
                        </div>
                        <div className="mb-3 custom-file">
                            <label htmlFor="formFileMultiple" className="form-label custom-file-label">
                                Add Images
                            </label>
                            <input
                                className="form-control"
                                type="file"
                                id="formFileMultiple"
                                name="image"
                                multiple
                                onChange={handleImageChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="price">
                                Price
                            </label>
                            <div className="input-group ">
                                <span className="input-group-text" id="basic-addon1">$</span>
                                <input
                                    type="number"
                                    min="0"
                                    className="form-control"
                                    id="price"
                                    name="price"
                                    value={campground.price}
                                    onChange={handleInputChange}
                                    required
                                />
                                <div className="valid-feedback">Looks Good</div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="description">
                                Description
                            </label>
                            <textarea
                                cols="30"
                                rows="4"
                                className="form-control"
                                id="description"
                                name="description"
                                value={campground.description}
                                onChange={handleInputChange}
                                required
                            />
                            <div className="valid-feedback">Looks Good</div>
                        </div>
                        <div className="mt-3">
                            <button type="submit" className="btn btn-success">
                                {buttonText}
                            </button>
                        </div>
                    </form>
                    <Link to="/campgrounds" className="btn btn-danger mt-3">
                        Cancel
                    </Link>
                </div>
            </div>
        </div>
    </div>);
};

export default NewCampground;
