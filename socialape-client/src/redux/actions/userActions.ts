import Axios, {CancelToken} from "axios";
import {clearError, loadingUi, setError, UiStateAction} from "../reducers/uiReducer";
import {setUnauthenticated, setUser, UserState, UserStateAction} from "../reducers/userReducer";
import {ActionCreator} from 'redux'
import {ThunkAction} from 'redux-thunk'

export interface UserLoginData {
    email: string,
    password: string
}

export interface NewUserData {
    handle: string,
    email: string,
    password: string
    confirmPassword: string
}

export const loginUser: ActionCreator<ThunkAction<Promise<void>, any, undefined, UiStateAction>> = (userData: UserLoginData, history: any) => {
    return async (dispatch) => {
        dispatch(loadingUi());
        Axios.post("/login", userData)
            .then(res => {
                setAuthorizationHeader(res.data.token);
                dispatch(getUserData());
                dispatch(clearError());
                history.push("/");
            })
            .catch(err => dispatch(setError(err.response.data)));
    };
};

export const signupUser: ActionCreator<ThunkAction<Promise<void>, any, undefined, UiStateAction>> = (userData: NewUserData, history: any) => {
    return async (dispatch) => {
        dispatch(loadingUi());
        Axios.post("/signup", userData)
            .then(res => {
                setAuthorizationHeader(res.data.token);
                dispatch(getUserData());
                dispatch(clearError());
                history.push("/");
            })
            .catch(err => dispatch(setError(err.response.data)));
    };
};

export const logoutUser: ActionCreator<ThunkAction<Promise<void>, any, undefined, UserStateAction>> = () => {
    return async (dispatch) => {
        localStorage.removeItem('FBIdToken');
        delete Axios.defaults.headers.common['Authorization'];
        dispatch(setUnauthenticated());
    };
};


export const getUserData: ActionCreator<ThunkAction<Promise<void>, any, undefined, UserStateAction>> = () => {
    return async (dispatch) => {
        Axios.get("/user")
            .then(res => dispatch(setUser(res.data)))
            .catch(err => console.log(err));
    };
};

const setAuthorizationHeader = (token: CancelToken) => {
    const fbIdToken = `Bearer ${token}`;
    localStorage.setItem("fbIdToken", fbIdToken);
    Axios.defaults.headers.common["Authorization"] = fbIdToken;
};