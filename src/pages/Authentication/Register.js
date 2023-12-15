import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {authActions} from "../../store/auth";
import {useDispatch} from "react-redux";
import useNotifications from "../../hooks/notificationsHook";
import {Form, Button} from "react-bootstrap";

const Register = () => {
    const {notificationSuccess, notificationError, isAuthenticated} = useNotifications()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/campgrounds');
        }
    }, [isAuthenticated, navigate]);
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const [validated, setValidated] = useState(false);
    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            try {
                const data = {username, email, password};
                const response = await axios.post("http://localhost:3000/register", data)
                if (response.status === 200) {
                    dispatch(authActions.registerSuccess(response.data.registerData))
                    notificationSuccess(response.data.message)
                    navigate('/campgrounds')
                } else {
                    notificationError(response.data.message)
                }
            } catch (e) {
                notificationError("Error registering")
                console.log("Error in Register: ", e)
            }

        }
        setValidated(true);
    }
    return (<div className="container mt-5">
        <div className="row">
            <div className="col-md-6 offset-md-3 col-xl-4 offset-xl-4">
                <div className="card shadow">
                    <img
                        src="https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80"
                        alt=""
                        className="card-img-top"
                    />
                    <div className="card-body">
                        <h5 className="card-title">Register</h5>
                        <Form className="validated-form" noValidate onSubmit={handleSubmit}
                              validated={validated}>
                            <Form.Group className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="username"
                                    name="username"
                                    required
                                    onChange={handleUsernameChange}
                                    autoFocus
                                />
                                <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    onChange={handleEmailChange}
                                />
                                <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    id="password"
                                    name="password"
                                    onChange={handlePasswordChange}
                                    required
                                />
                                <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                            </Form.Group>

                            <Button className="btn btn-success btn-block" type="submit">
                                Register
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    </div>);
};

export default Register;
