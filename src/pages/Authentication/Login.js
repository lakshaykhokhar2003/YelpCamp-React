import {useState, useEffect} from 'react';
import axios from 'axios';
import {useLocation, useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {authActions} from '../../store/auth';
import useNotifications from "../../hooks/notificationsHook";
import {Form, Button} from "react-bootstrap";

const Login = () => {
    const {isAuthenticated, notificationSuccess} = useNotifications();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [prevUrl, setPrevUrl] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/campgrounds');
        }
        setPrevUrl(location.state?.prevUrl || '');
    }, [location, isAuthenticated, navigate]);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const [validated, setValidated] = useState(false);
    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            try {
                const data = {username, password};
                const response = await axios.post('http://localhost:3000/login', data);
                if (response.status === 200) {
                    dispatch(authActions.login(response.data.data));
                    notificationSuccess(response.data.message);
                    navigate(prevUrl || '/campgrounds');
                }
            } catch (e) {
                console.log(e);
            }
        }

        setValidated(true);
    };
    return (<div className="container d-flex justify-content-center align-items-center mt-5">
        <div className="row">
            <div className="col-md-6 offset-md-3 col-xl-4 offset-xl-4">
                <div className="card shadow">
                    <img
                        src="https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80"
                        alt=""
                        className="card-img-top"
                        crossOrigin=""
                    />
                    <div className="card-body">
                        <h5 className="card-title">Login</h5>
                        <Form onSubmit={handleSubmit} className="validated-form" noValidate validated={validated}>
                            <Form.Group className="mb-3" controlId="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    autoFocus
                                    required
                                    value={username}
                                    onChange={handleUsernameChange}
                                />
                                <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    required
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                                <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                            </Form.Group>

                            <Button className="btn btn-success btn-block" type="submit">
                                Login
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    </div>);
};

export default Login;
