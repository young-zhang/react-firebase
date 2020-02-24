import {createStore, combineReducers, applyMiddleware, Store} from "redux";
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from "redux-thunk";
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

const store: Store<ApplicationState> = createStore(reducers, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;