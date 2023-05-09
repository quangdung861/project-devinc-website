import { put, takeEvery } from "redux-saga/effects";
import axios from "axios";

import { REQUEST, SUCCESS, FAIL, VOUCHER_ACTION } from "../constants";

function* getVoucherListSaga(action) {
  try {
    const result = yield axios.get(`https://json-server-vercel-tau-murex.vercel.app/vouchers`);
    yield put({
      type: SUCCESS(VOUCHER_ACTION.GET_VOUCHER_LIST),
      payload: {
        data: result.data,
      },
    });
  } catch (e) {
    yield put({
      type: FAIL(VOUCHER_ACTION.GET_VOUCHER_LIST),
      payload: {
        errors: e.response.data,
      },
    });
  }
}

function* getVoucherShipListSaga(action) {
  try {
    const result = yield axios.get(`https://json-server-vercel-tau-murex.vercel.app/shipvouchers`);
    yield put({
      type: SUCCESS(VOUCHER_ACTION.GET_VOUCHER_SHIP_LIST),
      payload: {
        data: result.data,
      },
    });
  } catch (e) {
    yield put({
      type: FAIL(VOUCHER_ACTION.GET_VOUCHER_SHIP_LIST),
      payload: {
        errors: e.response.data,
      },
    });
  }
}

export default function* voucherSaga() {
  yield takeEvery(REQUEST(VOUCHER_ACTION.GET_VOUCHER_LIST), getVoucherListSaga);
  yield takeEvery(REQUEST(VOUCHER_ACTION.GET_VOUCHER_SHIP_LIST), getVoucherShipListSaga);
}
