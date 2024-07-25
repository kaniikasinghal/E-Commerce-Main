import { Action, Dispatch } from "redux";
import { ILogin, UserAuthData } from "../../Interfaces/common_interfaces";
import ActionTypes from "../../Constants/Enums";

export const signInAction =
  (data: UserAuthData) => async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionTypes.LOGIN,
      payload: data,
    });
  };

export const logout = () => async (dispatch: Dispatch<Action>) => {
  dispatch({
    type: ActionTypes.LOGOUT,
  });
};
