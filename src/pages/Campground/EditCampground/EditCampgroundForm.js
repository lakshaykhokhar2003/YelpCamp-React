import {Button, Form} from "react-bootstrap";
import axios from "axios";
import {useState} from "react";
import useNotifications from "../../../hooks/notificationsHook";
import {useNavigate, useParams} from "react-router-dom";

const EditCampgroundForm = (props) => {
    const {user, authToken, notificationError, notificationPromiseHandler} = useNotifications()
    const navigate = useNavigate();
    const params = useParams()
    const [buttonText, setButtonText] = useState('Edit Campground');

    const [checkedImages, setCheckedImages] = useState({});
    const [images, setImages] = useState([]);

    const campground = props.campground;
    const [title, setTitle] = useState(campground.title);
    const [location, setLocation] = useState(campground.location);
    const [price, setPrice] = useState(campground.price);
    const [description, setDescription] = useState(campground.description);

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


    const [validated, setValidated] = useState(false);

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
            const postReq = async () => {
                const response = await axios.post(`http://localhost:3000/campgrounds/${params.campgroundId}/edit?user=${user}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data', Authorization: `Bearer ${authToken}`
                    }
                })
                response.status === 200 ? navigate(`/campgrounds/${params.campgroundId}`) : notificationError(response.data.message)
            }
            try {
                await notificationPromiseHandler(postReq, 'edit')
            } catch (err) {
                notificationError("Error Editing In Campground")
                setButtonText('Edit Campground')
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

    return (<Form onSubmit={handleSubmit} noValidate className="validated-form" encType="multipart/form-data"
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

        <div className="mb-3 d-flex align-items-center overflow-x-scroll overflow-auto">
            {imagesMap}
        </div>

        <div className="mt-3">
            <Button className="btn btn-info" type="submit">
                {buttonText}
            </Button>
        </div>
    </Form>)
}
export default EditCampgroundForm;
