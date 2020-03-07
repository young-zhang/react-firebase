import Axios, {CancelToken} from "axios";
import {Action, ActionCreator} from 'redux'
import {ThunkAction} from 'redux-thunk'
import {Credentials, Like} from "../../types";
import {clearError, loadingUi, setError, UiStateAction} from "./uiActions";
import {LikeScreamAction, UnlikeScreamAction} from "./dataActions";

export interface UserState {
    readonly authenticated: boolean,
    readonly loading: boolean
    readonly credentials: Credentials,
    readonly likes: Like[],
    readonly notifications: Notification[]
}

export const initialState: UserState = {
    authenticated: false,
    loading: false,
    credentials: {},
    likes: [],
    notifications: []
};

interface UserPayload {
    credentials: Credentials,
    likes: Like[],
    notifications: Notification[]
}

export interface SetAuthenticatedAction extends Action<"SET_AUTHENTICATED"> {}

export interface SetUnauthenticatedAction extends Action<"SET_UNAUTHENTICATED"> {}

export interface SetUserAction extends Action<"SET_USER"> {payload: UserPayload}

export interface LoadingUserAction extends Action<"LOADING_USER"> {}

export type UserStateAction = SetAuthenticatedAction | SetUnauthenticatedAction | SetUserAction | LoadingUserAction
    | LikeScreamAction | UnlikeScreamAction;

export const setAuthenticated: ActionCreator<SetAuthenticatedAction> = () => ({type: "SET_AUTHENTICATED"});
export const setUnauthenticated: ActionCreator<SetUnauthenticatedAction> = () => ({type: "SET_UNAUTHENTICATED"});
export const setUser: ActionCreator<SetUserAction> = (payload: UserPayload) => ({type: "SET_USER", payload});
export const loadingUser: ActionCreator<LoadingUserAction> = () => ({type: "LOADING_USER"});

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
        dispatch(loadingUser());
        Axios.get("/user")
            .then(res => dispatch(setUser(res.data)))
            .catch(err => console.log(err));
    };
};

export const uploadImage: ActionCreator<ThunkAction<Promise<void>, any, undefined, UserStateAction>> = (formData: FormData) => {
    return async (dispatch) => {
        dispatch(loadingUser());
        Axios.post("/user/image", formData)
            .then(() => dispatch(getUserData()))
            .catch(err => console.log(err));
    };
};

export const editUserDetails: ActionCreator<ThunkAction<Promise<void>, any, undefined, UserStateAction>> = (userDetails: Credentials) => {
    return async (dispatch) => {
        dispatch(loadingUser());
        Axios.post("/user", userDetails)
            .then(() => dispatch(getUserData()))
            .catch(err => console.log(err));
    };
};

const setAuthorizationHeader = (token: CancelToken) => {
    const fbIdToken = `Bearer ${token}`;
    localStorage.setItem("fbIdToken", fbIdToken);
    Axios.defaults.headers.common["Authorization"] = fbIdToken;
};