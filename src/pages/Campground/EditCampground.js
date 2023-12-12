import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import axios from "axios";


const EditCampground = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const navigate = useNavigate();
    const loc = useLocation();
    const params = useParams()

    const [buttonText, setButtonText] = useState('Edit Campground');
    const [campground, setCampground] = useState(null)

    const [title, setTitle] = useState();
    const [location, setLocation] = useState();
    const [price, setPrice] = useState();
    const [description, setDescription] = useState();
    const [checkedImages, setCheckedImages] = useState({});
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', {state: {prevUrl: loc.pathname}});
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
    }, [isAuthenticated, navigate, params.campgroundId, loc]);

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
    const handleCheckboxChange = (filename) => {
        setCheckedImages(prevState => ({
            ...prevState, [filename]: !prevState[filename]
        }));
    };

    const handleImageChange = (e) => {
        setImages(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        setButtonText('Editing ...')
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('location', location);
        formData.append('price', price);
        formData.append('description', description);

        for (let i = 0; i < images.length; i++) {
            formData.append('image', images[i]);
        }

        const imagesToDelete = Object.keys(checkedImages).filter(filename => checkedImages[filename]);
        for (let i = 0; i < imagesToDelete.length; i++) {
            formData.append('deleteImages[]', imagesToDelete[i]);
        }

        try {
            const response = await axios.post(`http://localhost:3000/campgrounds/${params.campgroundId}/edit`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                setButtonText('Edit Campground')
                navigate(`/campgrounds/${params.campgroundId}`);
            }
        } catch (err) {
            console.log('Error ', err.message);
        }
    };
    let imagesMap
    const imagesWithFilename = campground.images.filter(image => image.filename && image.filename.length > 0);
    for (let filename of campground.images) {
        if (filename.filename.length > 0) {
            imagesMap = imagesWithFilename.map(filename => (<div key={filename._id} className="col-md-4">
                <div className="card mh-100">
                    <img src={filename.url} className="card-img-top border-bottom" alt="..."/>
                    <div className="card-body">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={`image-${filename._id}`}
                                checked={checkedImages[filename.filename] || false}
                                onChange={() => handleCheckboxChange(filename.filename)}
                            />
                            <label className="form-check-label" htmlFor={`image-${filename._id}`}>
                                Remove
                            </label>
                        </div>
                    </div>
                </div>
            </div>))
        }
    }


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
                <div className="mb-3 d-flex align-items-center justify-content-center">
                    {imagesMap}
                </div>
                <div className="mt-3">
                    <button className="btn btn-info" type="submit">
                        {buttonText}
                    </button>
                </div>
            </form>
            <Link to={`/campgrounds/${campground._id}`} className="btn btn-danger mt-3">
                Cancel
            </Link>
        </div>
    </div>;
};

export default EditCampground;