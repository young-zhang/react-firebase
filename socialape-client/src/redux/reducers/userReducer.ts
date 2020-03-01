import {Credentials, Like} from "../../types";
import {Action, ActionCreator} from "redux";

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

export const setAuthenticated: ActionCreator<SetAuthenticatedAction> = () => ({type: "SET_AUTHENTICATED"});
export const setUnauthenticated: ActionCreator<SetUnauthenticatedAction> = () => ({type: "SET_UNAUTHENTICATED"});
export const setUser: ActionCreator<SetUserAction> = (payload: UserPayload) => ({type: "SET_USER", payload});
export const loadingUser: ActionCreator<LoadingUserAction> = () => ({type: "LOADING_USER"});

export default function (state = initialState, action: UserStateAction) {
    switch (action.type) {
    case "SET_AUTHENTICATED":
        return {
            ...state,
            authenticated: true
        };
    case "SET_UNAUTHENTICATED":
        return initialState;
    case "SET_USER":
        return {
            authenticated: true,
            loading: false,
            ...action.payload
        };
    case "LOADING_USER":
        return {
            ...state,
            loading: true
        };
    default:
        return state;
    }
};