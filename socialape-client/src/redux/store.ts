import {createStore, combineReducers, applyMiddleware, Store, AnyAction} from "redux";
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk, {ThunkDispatch} from "redux-thunk";
import userReducer, {UserState, initialState as initialUserState} from "./reducers/userReducer";
import uiReducer, {UiState, initialState as initialUiState} from "./reducers/uiReducer";

export interface ApplicationState {
    user: UserState
    UI: UiState
}

const initialState: ApplicationState = {
    user: initialUserState,
    UI: initialUiState
};

const middleware = [thunk];

const reducers = combineReducers({
    user: userReducer,
    //data: dataReducer,
    UI: uiReducer
});

// https://stackoverflow.com/questions/43013204/how-to-dispatch-an-action-or-a-thunkaction-in-typescript-with-redux-thunk
type DispatchFunctionType = ThunkDispatch<ApplicationState, undefined, AnyAction>
const store = createStore(reducers, initialState,
    composeWithDevTools(applyMiddleware<DispatchFunctionType, ApplicationState>(...middleware)));

export default store;