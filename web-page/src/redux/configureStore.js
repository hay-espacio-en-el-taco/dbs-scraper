import { configureStore as toolkitConfigureStore } from '@reduxjs/toolkit'
import { createEpicMiddleware } from 'redux-observable';
import { rootEpic, rootReducer } from './modules/root';


export default function configureStore() {
    const epicMiddleware = createEpicMiddleware();
    const store = toolkitConfigureStore({
        reducer: rootReducer,
        middleware: [ epicMiddleware ]
    });
    epicMiddleware.run(rootEpic);

    return store;
}