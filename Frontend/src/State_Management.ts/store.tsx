import {applyMiddleware,combineReducers,createStore,CombinedState} from "redux"
import storage from "redux-persist/lib/storage";
import AuthReducer from "./Reducers/auth_reducer";
import { Reducer } from "react";
import { encryptTransform } from "redux-persist-transform-encrypt";
import { persistStore, persistReducer } from "redux-persist";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import thunk from "redux-thunk";
import logger from "redux-logger";



const appReducer: Reducer<
  CombinedState<{ AuthReducer: never}>,
   never
> = combineReducers({
  AuthReducer,
});

const transforms = [
    encryptTransform({
      secretKey: "ADHKHKDHKDKHKSHKHDSKHKSDKJ",
      onError: (error) => {
        console.error(" Transform ", error);
      },
    }),
  ];

  const persistConfig = {
    key: "root",
    storage,
    transforms,
    stateReconciler: autoMergeLevel2,
  };
  
  const persistedReducer = persistReducer(persistConfig, appReducer as Reducer<unknown, never>);
  
  const store = createStore(persistedReducer, applyMiddleware(thunk, logger));
  
  export default store;
  persistStore(store);