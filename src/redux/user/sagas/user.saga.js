import { put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { message } from "antd";
import { API_URL } from "../../../constants/routes";

import { REQUEST, SUCCESS, FAIL, USER_ACTION } from "../constants";

function* registerSaga(action) {
  try {
    const { data, callback } = action.payload;
    yield axios.post(`${API_URL}/register`, data);
    yield put({ type: SUCCESS(USER_ACTION.REGISTER) });
    message.success("Đăng ký thành công");
    if (callback.redirectLogin) yield callback.redirectLogin();
  } catch (error) {
    if (error.response.data === "Password is too short") {
      yield put({
        type: FAIL(USER_ACTION.REGISTER),
        payload: {
          errors: {
            password: "Mật khẩu phải trên 6 ký tự",
          },
        },
      });
    }

    if (error.response.data === "Email already exists") {
      yield put({
        type: FAIL(USER_ACTION.REGISTER),
        payload: {
          errors: {
            email: "Email đã tồn tại",
          },
        },
      });
    }
  }
}

function* loginSaga(action) {
  try {
    const { data, callback } = action.payload;
    const result = yield axios.post(`${API_URL}/login`, data);
    localStorage.setItem("accessToken", result.data.accessToken);
    yield put({
      type: SUCCESS(USER_ACTION.LOGIN),
      payload: {
        data: result.data,
      },
    });
    message.success("Đăng nhập thành công");
    if (result.data.user.role !== "admin") {
      yield callback.redirectHome();
    } else {
      yield callback.redirectDashboard();
    }
  } catch (error) {
    yield put({
      type: FAIL(USER_ACTION.LOGIN),
      payload: {
        errors: "Email hoặc mật khẩu không chính xác",
      },
    });
  }
}

function* getUserInfoSaga(action) {
  try {
    const { id } = action.payload;
    const result = yield axios.get(`${API_URL}/users/${id}`, {
      params: {
        _embed: "locations",
      },
    });
    yield put({
      type: SUCCESS(USER_ACTION.GET_USER_INFO),
      payload: {
        data: result.data,
      },
    });
  } catch (error) {
    yield put({
      type: FAIL(USER_ACTION.GET_USER_INFO),
      payload: {
        errors: error,
      },
    });
  }
}

function* updateUserInfoSaga(action) {
  try {
    const { userId, callback, ...values } = action.payload;
    yield axios.patch(`${API_URL}/users/${userId}`, values);
    yield put({
      type: REQUEST(USER_ACTION.GET_USER_INFO),
      payload: {
        id: userId,
      },
    });
    if (values.avatar?.url) {
      yield callback.resetImagePreview();
      message.success("Cập nhập ảnh đại diện thành công");
    }
    if (values.phoneNumber) {
      message.success("Cập nhập thông tin thành công");
    }
  } catch (error) {
    yield console.log(error);
  }
}

export default function* userSaga() {
  yield takeEvery(REQUEST(USER_ACTION.REGISTER), registerSaga);
  yield takeEvery(REQUEST(USER_ACTION.LOGIN), loginSaga);
  yield takeEvery(REQUEST(USER_ACTION.GET_USER_INFO), getUserInfoSaga);
  yield takeEvery(REQUEST(USER_ACTION.UPDATE_USER_INFO), updateUserInfoSaga);
}
