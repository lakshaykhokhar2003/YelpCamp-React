import {Outlet} from "react-router-dom";
import HomeNavBar from "./HomeNavBar";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {msgActions} from "../store/message";

const RootLayout = () => {
    const isSuccess = useSelector(state => state.msg.success);
    const error = useSelector(state => state.msg.error);
    const message = useSelector(state => state.msg.message);
    const dispatch = useDispatch()

    useEffect(() => {
        setTimeout(() => {
            dispatch(msgActions.clear())
        }, 3000)
    }, [isSuccess, error, message, dispatch])
    return (<>
        <header>
            <HomeNavBar/>
        </header>
        <main className="container mt-5">
            {isSuccess && (<div className="alert alert-success alert-dismissible fade show" role="alert">
                {message}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>)}
            {error && (<div className="alert alert-danger alert-dismissible fade show" role="alert">
                {message}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>)}
            <Outlet/>
        </main>
        <footer className="footer bg-dark py-3 w-100 mt-auto text-white text-center">
            <p>&#169; 2022 YelpCamp</p>
        </footer>
    </>);
};

export default RootLayout;

