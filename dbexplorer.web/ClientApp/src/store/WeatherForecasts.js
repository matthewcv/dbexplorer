const requestWeatherForecastsType = 'REQUEST_WEATHER_FORECASTS';
const receiveWeatherForecastsType = 'RECEIVE_WEATHER_FORECASTS';
const initialState = { forecasts: [], isLoading: false };

export const actionCreators = {
    requestWeatherForecasts: startDateIndex => {
        console.log("requestWeatherForecasts");
        return async (dispatch, getState) => {
            console.log("requestWeatherForecasts.inner async top",getState());
            if (startDateIndex === getState().weatherForecasts.startDateIndex) {
                // Don't issue a duplicate request (we already have or are loading the requested data)
                return;
            }

            dispatch({ type: requestWeatherForecastsType, startDateIndex });

            const url = `api/SampleData/WeatherForecasts?startDateIndex=${startDateIndex}`;
            const response = await fetch(url);
            const forecasts = await response.json();

            dispatch({ type: receiveWeatherForecastsType, startDateIndex, forecasts });
            console.log("requestWeatherForecasts.inner async bottom", getState());

        }
    }
};
/*every reducer always needs to check action.type every time because every reducer gets called every time for every action.
 this is a good thig because it allows any component to react to any action from any other component. 
 */
export const reducer = (state, action,...args) => {
  state = state || initialState;
    console.log('reducer', state, action, args);
  if (action.type === requestWeatherForecastsType) {
    return {
      ...state,
      startDateIndex: action.startDateIndex,
      isLoading: true
    };
  }

  if (action.type === receiveWeatherForecastsType) {
    return {
      ...state,
      startDateIndex: action.startDateIndex,
      forecasts: action.forecasts,
      isLoading: false
    };
  }

  return state;
};
