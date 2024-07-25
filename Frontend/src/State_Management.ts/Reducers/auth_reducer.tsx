import ActionTypes from "../../Constants/Enums";
import { UserAuthData } from "../../Interfaces/common_interfaces";

export interface IRootState {
  isLoggedIn: boolean;
  authData?: UserAuthData;
}

const initialState: IRootState = {
  isLoggedIn: false,
  authData: {} as UserAuthData,
};

interface UpdateAction {
  type: ActionTypes.LOGOUT;
}

interface LoginAction {
  type: ActionTypes.LOGIN;
  payload: UserAuthData;
}

export type Action = LoginAction | UpdateAction;

const AuthReducer = (state = initialState, action?: Action) => {
  switch (action?.type){
    case ActionTypes.LOGIN: 
      return {
        ...state,
        isLoggedIn: true,
        authData: { ...state.authData, ...action?.payload },
      };
    
    case ActionTypes.LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        authData: {},
      };
  
    default:

      return state;
      
  }
};

export default AuthReducer;
