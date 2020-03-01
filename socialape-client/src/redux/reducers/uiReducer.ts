import {Action, ActionCreator} from "redux";

export interface UiState {
    readonly loading: boolean
    readonly errors: any | null
}

export const initialState: UiState = {
    loading: false,
    errors: null
};

export interface SetErrorsAction extends Action<"SET_ERRORS"> {payload: any}

export interface ClearErrorsAction extends Action<"CLEAR_ERRORS"> {}

export interface LoadingUiAction extends Action<"LOADING_UI"> {}

export interface StopLoadingUiAction extends Action<"STOP_LOADING_UI"> {}

export type UiStateAction = SetErrorsAction | ClearErrorsAction | LoadingUiAction | StopLoadingUiAction

export const setError: ActionCreator<SetErrorsAction> = (error: any) => ({type: "SET_ERRORS", payload: error});
export const clearError: ActionCreator<ClearErrorsAction> = () => ({type: "CLEAR_ERRORS"});
export const loadingUi: ActionCreator<LoadingUiAction> = () => ({type: "LOADING_UI"});
export const stopLoadingUi: ActionCreator<StopLoadingUiAction> = () => ({type: "STOP_LOADING_UI"});

export default function (state = initialState, action: UiStateAction): UiState {
    switch (action.type) {
    case "SET_ERRORS":
        return {
            ...state,
            loading: false,
            errors: action.payload
        };
    case "CLEAR_ERRORS":
        return {
            ...state,
            loading: false,
            errors: null
        };
    case "LOADING_UI":
        return {
            ...state,
            loading: true
        };
    case "STOP_LOADING_UI":
        return {
            ...state,
            loading: false
        };
    default:
        return state;
    }
};