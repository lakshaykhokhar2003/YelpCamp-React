import './App.css';
import Home from "./pages/Home";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import RootLayout from "./components/Root";
import AllCampgrounds from "./pages/Campground/Index";
import NewCampground from "./pages/Campground/NewCampground";
import Campground from "./pages/Campground/Campground";
import Error from "./pages/Error";
import EditCampground from "./pages/Campground/EditCampground";
import Login from "./pages/Authentication/Login";
import Register from "./pages/Authentication/Register";
import {Provider} from "react-redux";
import store from "./store/index.js"
import {Flip, ToastContainer} from "react-toastify";


const router = createBrowserRouter([{
    path: "/", element: <Home/>, errorElement: <Error/>
}, {
    path: "/", element: <RootLayout/>, errorElement: <Error/>, children: [{
        path: "campgrounds",
        children: [{index: true, element: <AllCampgrounds/>}, {path: "new", element: <NewCampground/>}, {
            path: ":campgroundId",
            children: [{index: true, element: <Campground/>}, {path: "edit", element: <EditCampground/>}]
        }]
    }, {path: 'login', element: <Login/>}, {path: "register", element: <Register/>}, {path: "*", element: <Error/>}]
}]);

function App() {
    return <Provider store={store}>
        <>
            <RouterProvider router={router}/>
            <ToastContainer transition={Flip} position="top-center"/>
        </>
    </Provider>;
}

export default App;
