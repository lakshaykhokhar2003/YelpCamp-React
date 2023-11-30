import {Outlet} from "react-router-dom";
import HomeNavBar from "./HomeNavBar";

const RootLayout = () => {
    return (<>
        <header>
            <HomeNavBar/>
        </header>
        <main>
            <Outlet/>
        </main>
        <footer
            className="footer bg-dark py-3 w-100 mt-auto text-white text-center">
            <p> &#169; 2022 YelpCamp </p></footer>
    </>)
}

export default RootLayout;
