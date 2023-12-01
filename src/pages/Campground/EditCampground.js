import {Link, useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import axios from "axios";


const EditCampground = () => {
    const fileInputRef = useRef(null);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const navigate = useNavigate();
    const params = useParams()

    const [campground, setCampground] = useState(null)

    const [title, setTitle] = useState();
    const [location, setLocation] = useState();
    const [price, setPrice] = useState();
    const [description, setDescription] = useState();
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
        const fetchCampground = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/campgrounds/${params.campgroundId}/edit`)
                setCampground(response.data.campground)
                setTitle(response.data.campground.title)
                setLocation(response.data.campground.location)
                setPrice(response.data.campground.price)
                setDescription(response.data.campground.description)
            } catch (err) {
                console.log("Error: ", err.message)
                // res.status(500).json({error: err.message});
            }
        }
        fetchCampground()
    }, [isAuthenticated, navigate, params.campgroundId]);

    if (!campground) {
        return <div>Loading...</div>;
    }
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleLocationChange = (e) => {
        setLocation(e.target.value);
    };

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let images = [];
        for (let i = 0; i < fileInputRef.current.files.length; i++) {
            images.push(fileInputRef.current.files[i])
        }
        const data = {title: title, location: location, price: price, description: description};
        console.log(data)
        try {
            const response = await axios.post(`http://localhost:3000/campgrounds/${params.campgroundId}/edit`, data)
            if (response.status === 200) {
                navigate(`/campgrounds/${params.campgroundId}`)
            }

        } catch (err) {
            console.log("Error ", err.message)

        }

    };

    return <div className="row">
        <h1 className="text-center">Edit Campground</h1>
        <div className="col-md-6 offset-md-3">
            <form onSubmit={handleSubmit} noValidate className="validated-form" encType="multipart/form-data">
                <div className="mb-3">
                    <label className="form-label" htmlFor="title">
                        Title
                    </label>
                    <input
                        className="form-control"
                        id="title"
                        name="campground[title]"
                        value={title}
                        onChange={handleTitleChange}
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
                        id="location"
                        name="campground[location]"
                        value={location}
                        onChange={handleLocationChange}
                        required
                    />
                    <div className="valid-feedback">Looks Good</div>
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
                            name="campground[price]"
                            value={price}
                            onChange={handlePriceChange}
                            required
                        />
                        <div className="valid-feedback">Looks Good</div>
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="description">
                        Description
                    </label>
                    <input
                        className="form-control"
                        id="description"
                        name="campground[description]"
                        value={description}
                        onChange={handleDescriptionChange}
                        required
                    />
                    <div className="valid-feedback">Looks Good</div>
                </div>
                <div className="mb-3 custom-file">
                    <label htmlFor="formFileMultiple" className="form-label custom-file-label">
                        Add More Images
                    </label>
                    <input ref={fileInputRef} className="form-control" type="file" id="formFileMultiple" name="image"
                           multiple/>
                </div>
                <div className="mb-3 d-flex align-items-center justify-content-center">
                    {campground.images.map((img, i) => (<div key={i}>
                        {/*<img src={img.thumbnail} alt="" className="img-thumbnail h-25 w-25"/>*/}
                        <div className="form-check-inline d-flex flex-column">
                            <img src={img.url} alt="" className="img-thumbnail w-25"/>
                            <div>
                                <input
                                    type="checkbox"
                                    id={`image-${i}`}
                                    name="deleteImages[]"
                                    value={img.filename}
                                    className="form-check-input"
                                />
                                <label htmlFor={`image-${i}`} className="form-check-label">
                                    Delete?
                                </label>
                            </div>
                        </div>
                    </div>))}
                </div>
                <div className="mt-3">
                    <button className="btn btn-info" type="submit">
                        Update Campground
                    </button>
                </div>
            </form>
            <Link to={`/campgrounds/${campground._id}`} className="btn btn-danger">
                Cancel
            </Link>
        </div>
    </div>;
};

export default EditCampground;