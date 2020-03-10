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
export const setErrorAction: ActionCreator<SetErrorsAction> = (error: any) => ({type: "SET_ERRORS", payload: error});

export interface ClearErrorsAction extends Action<"CLEAR_ERRORS"> {}
export const clearErrorAction: ActionCreator<ClearErrorsAction> = () => ({type: "CLEAR_ERRORS"});

export interface LoadingUiAction extends Action<"LOADING_UI"> {}
export const loadingUiAction: ActionCreator<LoadingUiAction> = () => ({type: "LOADING_UI"});

export interface StopLoadingUiAction extends Action<"STOP_LOADING_UI"> {}
export const stopLoadingUiAction: ActionCreator<StopLoadingUiAction> = () => ({type: "STOP_LOADING_UI"});

export type UiStateAction = SetErrorsAction | ClearErrorsAction | LoadingUiAction | StopLoadingUiAction;