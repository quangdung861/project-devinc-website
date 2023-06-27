import { put, takeEvery } from "redux-saga/effects";
import axios from "axios";

import {
  REQUEST,
  SUCCESS,
  FAIL,
  LOCATION_ACTION,
  USER_ACTION,
} from "../constants";
import { message } from "antd";
import { API_URL } from "../../../constants/routes";

function* getCityListSaga(action) {
  try {
    const result = yield axios.get(`${API_URL}/cities`);
    yield put({
      type: SUCCESS(LOCATION_ACTION.GET_CITY_LIST),
      payload: {
        data: result.data,
      },
    });
  } catch (error) {
    yield put({
      type: FAIL(LOCATION_ACTION.GET_CITY_LIST),
      payload: {
        errors: error,
      },
    });
  }
}

// function* getLocationDetailSaga(action) {
//   try {
//     const result = yield axios.get(`${API_URL}/locations`);
//     yield put({
//       type: SUCCESS(LOCATION_ACTION.GET_DETAIL_LOCATION),
//       payload: {
//         data: result.data,
//       },
//     });
//   } catch (error) {
//     yield put({
//       type: FAIL(LOCATION_ACTION.GET_DETAIL_LOCATION),
//       payload: {
//         errors: error,
//       },
//     });
//   }
// }

function* getDistrictListSaga(action) {
  try {
    const { cityCode } = action.payload;
    const result = yield axios.get(
      `${API_URL}/districts?parentcode=${cityCode}`
    );

    yield put({
      type: SUCCESS(LOCATION_ACTION.GET_DISTRICT_LIST),
      payload: {
        data: result.data,
      },
    });
  } catch (error) {
    yield put({
      type: FAIL(LOCATION_ACTION.GET_DISTRICT_LIST),
      payload: {
        errors: error,
      },
    });
  }
}

function* getWardListSaga(action) {
  try {
    const { districtCode } = action.payload;
    const result = yield axios.get(
      `${API_URL}/wards?parentcode=${districtCode}`
    );

    yield put({
      type: SUCCESS(LOCATION_ACTION.GET_WARD_LIST),
      payload: {
        data: result.data,
      },
    });
  } catch (error) {
    yield put({
      type: FAIL(LOCATION_ACTION.GET_WARD_LIST),
      payload: {
        errors: error,
      },
    });
  }
}

///

function* createLocationSaga(action) {
  try {
    const { callback, defaultAddress, locationList, ...values } =
      action.payload;

    if (defaultAddress === 1) {
      for (let i = 0; i < locationList.length; i++)
        yield axios.patch(
          `${API_URL}/locations/${locationList[i].id}`,
          {
            default: 0,
          }
        );
    }

    const result = yield axios.post(`${API_URL}/locations`, {
      ...values,
      default: defaultAddress,
    });
    yield put({
      type: SUCCESS(LOCATION_ACTION.CREATE_LOCATION_ITEM),
      payload: {
        data: result.data,
      },
    });
    yield put({
      type: REQUEST(USER_ACTION.GET_USER_INFO),
      payload: {
        id: result.data.userId,
      },
    });
    yield message.success("Thêm địa chỉ mới thành công");
    yield callback.resetModalCreateLocation;
    yield callback.cancelModalCreateLocation();
  } catch (error) {
    yield put({
      type: FAIL(LOCATION_ACTION.CREATE_LOCATION_ITEM),
      payload: {
        errors: error,
      },
    });
  }
}

// DELETE

function* deleteLocationSaga(action) {
  try {
    const { locationId, userId } = action.payload;
    console.log(
      "🚀 ~ file: location.saga.js:133 ~ function*deleteLocationSaga ~ locationId:",
      locationId
    );
    yield axios.delete(`${API_URL}/locations/${locationId}`);
    yield put({
      type: SUCCESS(LOCATION_ACTION.DELETE_LOCATION_ITEM),
    });
    yield put({
      type: REQUEST(USER_ACTION.GET_USER_INFO),
      payload: {
        id: userId,
      },
    });
    yield message.success("Xóa địa chỉ thành công");
  } catch (error) {
    yield put({
      type: FAIL(LOCATION_ACTION.DELETE_LOCATION_ITEM),
      payload: {
        errors: "Fails",
      },
    });
  }
}

function* updateLocationSaga(action) {
  try {
    const { callback, locationId, ...values } = action.payload;
    const result = yield axios.patch(
      `${API_URL}/locations/${locationId}`,
      values
    );
    yield put({
      type: SUCCESS(LOCATION_ACTION.UPDATE_LOCATION_ITEM),
      payload: {
        data: result.data,
      },
    });
    yield put({
      type: REQUEST(USER_ACTION.GET_USER_INFO),
      payload: {
        id: result.data.userId,
      },
    });
    yield message.success("Cập nhật địa chỉ thành công");
    if(callback?.resetModalUpdateLocation) yield callback.resetModalUpdateLocation;
    if(callback?.cancelModalUpdateLocation) yield callback.cancelModalUpdateLocation;
    if(callback?.closeModalUpdateAddress) yield callback.closeModalUpdateAddress;
  } catch (error) {
    yield put({
      type: FAIL(LOCATION_ACTION.UPDATE_LOCATION_ITEM),
      payload: {
        errors: error,
      },
    });
  }
}

function* setDefaultLocationSaga(action) {
  try {
    const { locationId, userId } = action.payload;
    const result = yield axios.get(
      `${API_URL}/locations?userId=${userId}`
    );
    for (let i = 0; i < result.data.length; i++) {
      if (result.data[i].id === locationId) {
        yield axios.patch(
          `${API_URL}/locations/${result.data[i].id}`,
          {
            default: 1,
          }
        );
      } else {
        yield axios.patch(
          `${API_URL}/locations/${result.data[i].id}`,
          {
            default: 0,
          }
        );
      }
    }
    yield put({
      type: SUCCESS(LOCATION_ACTION.SET_DEFAULT_LOCATION),
    });
    yield put({
      type: REQUEST(USER_ACTION.GET_USER_INFO),
      payload: {
        id: userId,
      },
    });
  } catch (error) {
    yield put({
      type: FAIL(LOCATION_ACTION.SET_DEFAULT_LOCATION),
      payload: {
        errors: error,
      },
    });
  }
}

export default function* locationSaga() {
  yield takeEvery(REQUEST(LOCATION_ACTION.GET_CITY_LIST), getCityListSaga);
  // yield takeEvery(
  //   REQUEST(LOCATION_ACTION.GET_DETAIL_LOCATION),
  //   getLocationDetailSaga
  // );
  yield takeEvery(
    REQUEST(LOCATION_ACTION.GET_DISTRICT_LIST),
    getDistrictListSaga
  );
  yield takeEvery(REQUEST(LOCATION_ACTION.GET_WARD_LIST), getWardListSaga);
  yield takeEvery(
    REQUEST(LOCATION_ACTION.CREATE_LOCATION_ITEM),
    createLocationSaga
  );
  yield takeEvery(
    REQUEST(LOCATION_ACTION.DELETE_LOCATION_ITEM),
    deleteLocationSaga
  );
  yield takeEvery(
    REQUEST(LOCATION_ACTION.UPDATE_LOCATION_ITEM),
    updateLocationSaga
  );
  yield takeEvery(
    REQUEST(LOCATION_ACTION.SET_DEFAULT_LOCATION),
    setDefaultLocationSaga
  );
}
