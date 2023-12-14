import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {Form, Button} from "react-bootstrap";
import useNotifications from "../../hooks/notificationsHook";

const EditCampground = () => {
    const navigate = useNavigate();
    const loc = useLocation();
    const params = useParams()
    const {user, authToken, isAuthenticated} = useNotifications()

    const [buttonText, setButtonText] = useState('Edit Campground');
    const [campground, setCampground] = useState(null)

    const [title, setTitle] = useState();
    const [location, setLocation] = useState();
    const [price, setPrice] = useState();
    const [description, setDescription] = useState();
    const [checkedImages, setCheckedImages] = useState({});
    const [images, setImages] = useState([]);

    const [validated, setValidated] = useState(false);

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


    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            setButtonText('Editing ...')
            event.preventDefault();
            const formData = new FormData();
            formData.append('title', title);
            formData.append('location', location);
            formData.append('price', price);
            formData.append('description', description);
            formData.append('author', user);
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
                        'Content-Type': 'multipart/form-data', Authorization: `Bearer ${authToken}`
                    }
                });

                if (response.status === 200) {
                    setButtonText('Edit Campground')
                    navigate(`/campgrounds/${params.campgroundId}`);
                }
            } catch (err) {
                console.log('Error ', err.message);
            }
        }
        setValidated(true)
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
            <Form onSubmit={handleSubmit} noValidate className="validated-form" encType="multipart/form-data"
                  validated={validated}>
                <Form.Group className="mb-3" controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="campground[title]"
                        value={title}
                        onChange={handleTitleChange}
                        required
                    />
                    <Form.Control.Feedback type="valid">Looks Good</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="location">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                        type="text"
                        name="campground[location]"
                        value={location}
                        onChange={handleLocationChange}
                        required
                    />
                    <Form.Control.Feedback type="valid">Looks Good</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="price">
                    <Form.Label>Price</Form.Label>
                    <div className="input-group">
                        <span className="input-group-text" id="basic-addon1">$</span>
                        <Form.Control
                            type="number"
                            min="0"
                            className="form-control"
                            name="campground[price]"
                            value={price}
                            onChange={handlePriceChange}
                            required
                        />
                        <Form.Control.Feedback type="valid">Looks Good</Form.Control.Feedback>
                    </div>
                </Form.Group>

                <Form.Group className="mb-3" controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        name="campground[description]"
                        value={description}
                        onChange={handleDescriptionChange}
                        required
                    />
                    <Form.Control.Feedback type="valid">Looks Good</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3 custom-file" controlId="formFileMultiple">
                    <Form.Label>Add Images</Form.Label>
                    <Form.Control
                        type="file"
                        name="image"
                        multiple
                        onChange={handleImageChange}
                    />
                </Form.Group>

                <div className="mb-3 d-flex align-items-center justify-content-center">
                    {imagesMap}
                </div>

                <div className="mt-3">
                    <Button className="btn btn-info" type="submit">
                        {buttonText}
                    </Button>
                </div>
            </Form>
            <Link to={`/campgrounds/${campground._id}`} className="btn btn-danger mt-3">
                Cancel
            </Link>
        </div>
    </div>;
};

export default EditCampground;