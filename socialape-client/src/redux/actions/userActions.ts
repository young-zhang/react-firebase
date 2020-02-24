import Axios from "axios";
import {clearError, loadingUi, setError, UiStateAction} from "../reducers/uiReducer";
import {setUser, SetUserAction, UserState} from "../reducers/userReducer";
import {ActionCreator} from 'redux'
import {ThunkAction} from 'redux-thunk'

export interface UserLoginData {
    email: string,
    password: string
}

export const loginUser: ActionCreator<ThunkAction<Promise<void>, any, null, UiStateAction>> = (userData: UserLoginData, history: any) => {
    return async (dispatch) => {
        dispatch(loadingUi());
        Axios.post("/login", userData)
            .then(res => {
                const {token} = res.data;
                const fbIdToken = `Bearer ${token}`;
                localStorage.setItem("fbIdToken", fbIdToken);
                Axios.defaults.headers.common["Authorization"] = fbIdToken;
                dispatch(getUserData());
                dispatch(clearError());
                history.push("/");
            })
            .catch(err => dispatch(setError(err.response.data)));
    };
};

export const getUserData: ActionCreator<ThunkAction<Promise<void>, UserState, null, SetUserAction>> = () => {
    return async (dispatch) => {
        Axios.get("/user")
            .then(res => dispatch(setUser(res.data)))
            .catch(err => console.log(err));
    };
};