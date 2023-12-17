import {Outlet} from "react-router-dom";
import HomeNavBar from "./HomeNavBar";
import "react-toastify/dist/ReactToastify.css";
import useNotifications from "../hooks/notificationsHook";

const RootLayout = () => {
    const {useNotificationEffect} = useNotifications()
    useNotificationEffect();

    return (<>
        <header>
            <HomeNavBar/>
        </header>
        <main className="container mt-5">
            <Outlet/>
        </main>
        <footer className="footer bg-dark py-3 w-100 mt-auto text-white text-center">
            <p>&#169; 2022 YelpCamp</p>
        </footer>
    </>);
};

export default RootLayout;

