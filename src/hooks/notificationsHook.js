import {msgActions} from "../store/message";
import {useDispatch, useSelector} from "react-redux";

const useNotifications = () => {
    const dispatch = useDispatch();
    const isSuccess = useSelector(state => state.msg.success);
    const error = useSelector(state => state.msg.error);
    const message = useSelector(state => state.msg.message);

    const user = useSelector(state => state.auth.user);
    const authToken = useSelector(state => state.auth.token);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    const notificationSuccess = (message) => {
        dispatch(msgActions.success(message))
    }
    const notificationError = (message) => {
        dispatch(msgActions.error(message))
    }
    const notificationClear = () => {
        dispatch(msgActions.clear())
    }

    return {
        notificationSuccess,
        notificationError,
        notificationClear,
        isSuccess,
        error,
        message,
        user,
        authToken,
        isAuthenticated
    }
}

export default useNotifications;