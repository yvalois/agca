import { applyMiddleware, compose, createStore, combineReducers } from "redux";
import thunk from "redux-thunk";
import adminReducer from "./adminReducer";
import blockchainReducer from "./blockchainReducer";
import icoReducer from "./icoReducer";
import userReducer from "./userReducer";


const rootReducer = combineReducers({
    blockchain: blockchainReducer,
    user: userReducer,
    ico: icoReducer,
    admin: adminReducer
})

const middleware = [thunk];
const composeEnhancers = compose(applyMiddleware(...middleware));

const configureStore = () => {
    return createStore(rootReducer, composeEnhancers);
}

const store = configureStore();

export default store;