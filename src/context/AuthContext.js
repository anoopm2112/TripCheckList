import createDataContext from './createDataContext';

const authReducer = (state, action) => {
    switch (action.type) {
        case 'signout':
            return { userToken: '', userName: '' };
        case 'signin':
            return {
                userToken: action.payload.userToken,
                userName: action.payload.userName
            };
        default:
            return state;
    }
};

const signin = dispatch => {
    return ({ userToken, userName }) => {
        dispatch({
            type: 'signin',
            payload: { userToken, userName }
        });
    };
};

const signout = dispatch => {
    return () => {
        dispatch({ type: 'signout' });
    };
};

export const { Provider, Context } = createDataContext(authReducer, { signin, signout }, { userToken: '', userName: '' });