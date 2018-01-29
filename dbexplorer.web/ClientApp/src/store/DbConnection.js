const getDbInfoType = "GET_DB_INFO";

var initialState = {
    connectionInfo : "localhost"
}

export const actionCreators = {
    getDbInfo: (connectionInfo) => {
        console.log("getdbinfo",connectionInfo);
        return {
            type: getDbInfoType,
            connectionInfo
        }

    }
}

export const reducer = (state, action) => {
    state = state || initialState;
    console.log(state, action);
    if (action.type === getDbInfoType) {
        return {
            ...state,
            connectionInfo:action.connectionInfo
        }
    }


    return state;
};
