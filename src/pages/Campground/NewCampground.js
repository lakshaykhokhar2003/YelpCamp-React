import {Link, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import useNotifications from "../../hooks/notificationsHook";
import {Button, Form} from "react-bootstrap";

const NewCampground = () => {
    const {notificationSuccess, notificationError, authToken, user, isAuthenticated} = useNotifications()

    const navigate = useNavigate();
    const location = useLocation();

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

    const [validated, setValidated] = useState(false);
    const handleSubmit = async (e) => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        } else {
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
                        'Content-Type': 'multipart/form-data', Authorization: `Bearer ${authToken}`
                    },
                });
                if (response.status === 200) {
                    notificationSuccess(response.data.message)
                    setButtonText('Add A Campground');
                    navigate('/campgrounds');
                } else {
                    notificationError(response.data.message)
                    setButtonText('Add A Campground');
                }
            } catch (err) {
                console.log("Error: ", err.message);
            }
        }
        setValidated(true);
    };

    return (<div className="row">
        <h1 className="text-center">New Campground</h1>
        <div className="col-md-6 offset-md-3">
            <div className="card shadow">
                <div className="card-body">
                    <Form onSubmit={handleSubmit} encType="multipart/form-data" noValidate validated={validated}>
                        <Form.Group className="mb-3" controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={campground.title}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="location">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                type="text"
                                name="location"
                                value={campground.location}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="image">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                name="image"
                                onChange={handleImageChange}
                                multiple
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="price">
                            <Form.Label>Price</Form.Label>
                            <div className="input-group">
                                <span className="input-group-text">$</span>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    name="price"
                                    value={campground.price}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="description"
                                value={campground.description}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Button variant="success" type="submit">
                            {buttonText}
                        </Button>
                    </Form>
                    <Link to="/campgrounds" className="btn btn-danger mt-3">
                        Cancel
                    </Link>
                </div>
            </div>
        </div>
    </div>);
};

export default NewCampground;
