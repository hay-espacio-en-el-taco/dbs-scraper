import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { rootEpic, rootReducer } from './modules/root';


export default function configureStore() {
    const epicMiddleware = createEpicMiddleware();
    const store = createStore(
        rootReducer,
        applyMiddleware(epicMiddleware)
    );
    epicMiddleware.run(rootEpic);

    return store;
}