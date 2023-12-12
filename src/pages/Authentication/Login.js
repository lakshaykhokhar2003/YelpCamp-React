import {useState, useEffect} from 'react';
import axios from 'axios';
import {useLocation, useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {authActions} from '../../store';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [prevUrl, setPrevUrl] = useState('');

    useEffect(() => {
        setPrevUrl(location.state?.prevUrl || '');
    }, [location]);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const data = {username, password};
            const response = await axios.post('http://localhost:3000/login', data);
            if (response.status === 200) {
                dispatch(authActions.login(response.data.data));
                navigate(prevUrl || '/campgrounds');
            }
        } catch (e) {
            console.log(e);
        }
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
                        <form onSubmit={handleSubmit} className="validated-form" noValidate>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="username">
                                    Username
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="username"
                                    name="username"
                                    autoFocus
                                    required
                                    value={username}
                                    onChange={handleUsernameChange}
                                />
                                <div className="valid-feedback">Looks good!</div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    className="form-control"
                                    type="password"
                                    id="password"
                                    name="password"
                                    required
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                                <div className="valid-feedback">Looks good!</div>
                            </div>
                            <button className="btn btn-success btn-block">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>);
};

export default Login;
