import {Outlet} from "react-router-dom";
import HomeNavBar from "./HomeNavBar";
import {useEffect} from "react";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useNotifications from "../hooks/notificationsHook";

const RootLayout = () => {
    const {notificationClear, isSuccess, error, message} = useNotifications()

    useEffect(() => {
        if (isSuccess) {
            toast.success(message, {autoClose: 3000, theme: "dark"});
            notificationClear();
        }
        if (error) {
            toast.error(message, {autoClose: 3000});
            notificationClear();
        }
    }, [isSuccess, error, message, notificationClear])

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

