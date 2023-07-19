import createDataContext from './createDataContext';

const authReducer = (state, action) => {
    switch (action.type) {
        case 'signout':
            return { userToken: '' };
        case 'signin':
            return {
                userToken: action.payload.userToken,
            };
        default:
            return state;
    }
};

const signin = dispatch => {
    return ({ userToken }) => {
        dispatch({
            type: 'signin',
            payload: { userToken }
        });
    };
};

const signout = dispatch => {
    return () => {
        dispatch({ type: 'signout' });
    };
};

export const { Provider, Context } = createDataContext(authReducer, { signin, signout }, { userToken: '' });