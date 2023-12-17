import {Button, Form} from "react-bootstrap";
import {useState} from "react";
import axios from "axios";
import useNotifications from "../../../hooks/notificationsHook";
import {useNavigate} from "react-router-dom";

const NewCampgroundForm = () => {
    const {user, authToken, notificationError, notificationPromiseHandler} = useNotifications()
    const navigate = useNavigate();
    const [buttonText, setButtonText] = useState('Add A Campground');

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
            const postReq = async () => {
                const response = await axios.post('http://localhost:3000/campgrounds/new', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data', Authorization: `Bearer ${authToken}`
                    }
                });
                response.status === 200 ? navigate('/campgrounds') : notificationError(response.data.message)
            }
            try {
                await notificationPromiseHandler(postReq, 'add')
            } catch (error) {
                notificationError("Error Adding In Campground")
                console.error('Error:', error.message);
            }
        }
        setButtonText('Add A Campground');
        setValidated(true);
    };
    return (<Form onSubmit={handleSubmit} encType="multipart/form-data" noValidate validated={validated}>
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
    </Form>)
}

export default NewCampgroundForm;