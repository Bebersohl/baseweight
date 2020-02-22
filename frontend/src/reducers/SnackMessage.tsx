export const snackMessageReducer = (state = '', action) => {
  if (action.type.includes('SnackMessage')) {
    return action.payload !== undefined ? action.payload : 'Success';
  }

  return state;
};
