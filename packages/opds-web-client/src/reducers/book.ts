import { BookData, FetchErrorData } from "../interfaces";
import ActionCreator from "../actions";

export interface BookState {
  url: string;
  data: BookData;
  isFetching: boolean;
  error: FetchErrorData;
}

const initialState: BookState = {
  url: null,
  data: null,
  isFetching: false,
  error: null
};

const book = (state: BookState = initialState, action): BookState => {
  switch (action.type) {
    case ActionCreator.BOOK_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        error: null
      });

    case ActionCreator.BOOK_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        error: action.error
      });

    case ActionCreator.BOOK_LOAD:
      return Object.assign({}, state, {
        data: action.data,
        url: action.url ? action.url : state.url,
        isFetching: false
      });

    case ActionCreator.BOOK_CLEAR:
      return Object.assign({}, state, {
        data: null,
        url: null,
        error: null
      });

    case ActionCreator.CLOSE_ERROR:
      return Object.assign({}, state, {
        error: null
      });

    case ActionCreator.FULFILL_BOOK_REQUEST:
    case ActionCreator.UPDATE_BOOK_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      });

    case ActionCreator.FULFILL_BOOK_SUCCESS:
    case ActionCreator.UPDATE_BOOK_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false
      });

    case ActionCreator.FULFILL_BOOK_FAILURE:
    case ActionCreator.UPDATE_BOOK_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        error: action.error
      });

    case ActionCreator.UPDATE_BOOK_LOAD:
      // We might update a book when no book was in the state, for example
      // when borrowing a book from a collection page. In that case,
      // we shouldn't add the book to the state.
      if (state.data === null) {
        return state;
      }

      // If a book was in the state already, we should replace it on update.
      return Object.assign({}, state, {
        data: Object.assign({}, state.data, action.data)
      });

    default:
      return state;
  }
};

export default book;