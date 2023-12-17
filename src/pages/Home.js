import {Link, useLocation} from "react-router-dom";
import styles from './Home.module.css';
import useNotifications from "../hooks/notificationsHook";


const Home = () => {
    const {logoutHandler, useNotificationEffect, isAuthenticated} = useNotifications()
    useNotificationEffect();

    const location = useLocation()


    return (<div
        className={`${styles.backgroundImage} d-flex text-center text-white bg-dark flex-column pt-3 align-items-center `}>
        <header
            className='align-self-center d-inline-flex justify-content-around w-100 position-relative top-0'>
            <h3 className="float-md-left mb-0">YelpCamp</h3>
            <nav className="nav nav-masthead justify-content-center float-md-right">
                <Link className={`${styles[['nav-link']]} ${styles.active}`} aria-current="page" href="#"
                      to='/'>Home</Link>
                <Link className={styles[['nav-link']]} to='/campgrounds'>Campgrounds</Link>
                {!isAuthenticated && (<>
                    <Link className={styles[['nav-link']]} state={{prevUrl: location.pathname}} to='/login'>Login</Link>
                    <Link className={styles[['nav-link']]} to='/register'>Register</Link>
                </>)}
                {isAuthenticated && <Link onClick={logoutHandler} className={styles[['nav-link']]} to="#">Logout</Link>}
            </nav>
        </header>
        <div
            className={`${styles[["cover-container"]]} d-flex w-100 h-100 p-3`}>
            <main className="px-3">
                <h1>YelpCamp</h1>
                <p className="lead"> Welcome to YelpCamp! <br/> Jump right in and explore our many campgrounds. <br/>
                    Feel free to share some of your own and comment on others!</p>
                <Link to="/campgrounds"
                      className={`btn btn-lg ${styles[["btn-secondary"]]} font-weight-bold border-white bg-white `}>View
                    Campgrounds</Link>
            </main>
        </div>
        <footer className="mt-auto text-white-50">
            <p>&copy; 2022 YelpCamp </p>
        </footer>
    </div>);
};

export default Home;
