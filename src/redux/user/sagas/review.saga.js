import { put, takeEvery } from "redux-saga/effects";
import axios from "axios";

import { REQUEST, SUCCESS, FAIL, REVIEW_ACTION } from "../constants";

function* getReviewListSaga(action) {
  try {
    const { productId } = action.payload;
    const result = yield axios.get(`https://json-server-vercel-tau-murex.vercel.app/reviews`, {
      params: {
        productId,
        _expand: "user",
        _sort: "id",
        _order: "desc",
      },
    });
    yield put({
      type: SUCCESS(REVIEW_ACTION.GET_REVIEW_LIST),
      payload: {
        data: result.data,
      },
    });
  } catch (e) {
    yield put({
      type: FAIL(REVIEW_ACTION.GET_REVIEW_LIST),
      payload: {
        errors: e.response.data,
      },
    });
  }
}

function* postReviewSaga(action) {
  try {
    const { productId, callback } = action.payload;
    const result = yield axios.post(
      `https://json-server-vercel-tau-murex.vercel.app/reviews`,
      action.payload
    );
    yield put({
      type: SUCCESS(REVIEW_ACTION.POST_REVIEW),
      payload: result.data,
    });
    yield put({
      type: REQUEST(REVIEW_ACTION.GET_REVIEW_LIST),
      payload: {
        productId,
      },
    });
    yield callback.setIsShowFormReview();
  } catch (error) {
    yield put({
      type: FAIL(REVIEW_ACTION.POST_REVIEW),
      payload: {
        errors: error,
      },
    });
  }
}

function* patchReviewSaga(action) {
  try {
    const { id, productId, callback, ...values } = action.payload;
    const result = yield axios.patch(
      `https://json-server-vercel-tau-murex.vercel.app/reviews/${id}`,
      values
    );
    yield put({
      type: SUCCESS(REVIEW_ACTION.PATCH_REVIEW),
      payload: result.data,
    });
    yield put({
      type: REQUEST(REVIEW_ACTION.GET_REVIEW_LIST),
      payload: {
        productId,
      },
    });
    if (callback.resetReviewForm) yield callback.resetReviewForm();
    if (callback.setIsShowFormReview) yield callback.setIsShowFormReview();
  } catch (error) {
    yield put({
      type: FAIL(REVIEW_ACTION.PATCH_REVIEW),
      payload: {
        errors: error,
      },
    });
  }
}

export default function* reviewSaga() {
  yield takeEvery(REQUEST(REVIEW_ACTION.GET_REVIEW_LIST), getReviewListSaga);
  yield takeEvery(REQUEST(REVIEW_ACTION.POST_REVIEW), postReviewSaga);
  yield takeEvery(REQUEST(REVIEW_ACTION.PATCH_REVIEW), patchReviewSaga);
}
