import { SET_COUNTRIES } from 'lib/actionNames';

const setCountries = countries => ({ type: SET_COUNTRIES, payload: countries });

export { setCountries };
