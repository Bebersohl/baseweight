const initialState = {
  message: '',
  isModal: false,
};

export const loadingReducer = (state = initialState, action) => {
  if (action.type.includes('LoadingMessage')) {
    if (action.payload === undefined) {
      return { message: 'Loading', isModal: true };
    }

    if (typeof action.payload === 'string') {
      return { message: action.payload, isModal: true };
    }

    return action.payload;
  }

  return state;
};
