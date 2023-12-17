import {Link, useLocation} from "react-router-dom";
import classes from "./HomeNavBar.module.css";
import useNotifications from "../hooks/notificationsHook";

const MainNavbar = () => {
    const {isAuthenticated, logoutHandler} = useNotifications()
    const location = useLocation()


    return (<nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-dark">
        <div className={`container-fluid ${classes.navLinks} d-lg-flex flex-lg-row`}>
            <Link className="navbar-brand  text-white p-2" to="#">Yelp Camp</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/campgrounds" className="nav-link">Campgrounds</Link>
                <Link to="/campgrounds/new" className="nav-link">New Campgrounds</Link>
            </div>
            <div className="navbar-nav ml-auto">
                {!isAuthenticated && (<>
                    <Link to="/login" className="nav-link" state={{prevUrl: location.pathname}}>Login</Link>
                    <Link to="/register" className="nav-link">Register</Link>
                </>)}
                {isAuthenticated && <Link onClick={logoutHandler} to='/campgrounds'>Logout</Link>}
            </div>
        </div>
    </nav>);
};

export default MainNavbar;