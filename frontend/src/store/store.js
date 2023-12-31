import { configureStore } from "@reduxjs/toolkit";
// import { rootReducer } from "./root-reducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { rootReducer } from "./root-reducer";

const persistConfig = {
    key: "root",
    storage,
    whiteList: "auth"
}

const persistedReducer = persistReducer(persistConfig, rootReducer)


const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})


const persistor = persistStore(store)

export { store, persistor };