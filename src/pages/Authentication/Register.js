import {useNavigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";
import {authActions} from "../../store";
import {useDispatch} from "react-redux";

const Register = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const data = {username, email, password};
            const response = await axios.post("http://localhost:3000/register", data)
            console.log(response.data.registerData)
            if (response.status === 200) {
                dispatch(authActions.registerSuccess(response.data.registerData))
                navigate('/campgrounds')
            }
        } catch (e) {
            console.log("Error in Register: ", e)
        }

    }
    return (<div className="container d-flex justify-content-center align-items-center mt-5">
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
                        <form method="POST" className="validated-form" noValidate
                              onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="username">
                                    Username
                                </label>
                                <input className="form-control" type="text" id="username" name="username" required
                                       onChange={handleUsernameChange}
                                       autoFocus/>
                                <div className="valid-feedback">Looks good!</div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="email">
                                    Email
                                </label>
                                <input className="form-control" type="email" id="email" name="email" required
                                       onChange={handleEmailChange}/>
                                <div className="valid-feedback">Looks good!</div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="password">
                                    Password
                                </label>
                                <input className="form-control" type="password" id="password" name="password"
                                       onChange={handlePasswordChange}
                                       required/>
                                <div className="valid-feedback">Looks good!</div>
                            </div>
                            <button className="btn btn-success btn-block">Register</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>);
};

export default Register;
