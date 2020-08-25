import { PROFILE_FAIL, PROFILE_START, PROFILE_SUCCESS } from "./actionTypes";
import { authAxios } from "../../utils";
import { profileDetailURL } from "../../constants";

export const profileStart = () => {
  return {
    type: PROFILE_START,
  };
};

export const profileSuccess = (data) => {
  return {
    type: PROFILE_SUCCESS,
    data,
  };
};

export const profileFail = (error) => {
  return {
    type: PROFILE_FAIL,
    error: error,
  };
};

export const fetchProfile = (profileID) => {
  return (dispatch) => {
    dispatch(profileStart());
    authAxios
      .get(profileDetailURL(profileID))
      .then((res) => {
        dispatch(profileSuccess(res.data));
        console.log(res.data);
      })
      .catch((err) => {
        dispatch(profileFail(err));
      });
  };
};
