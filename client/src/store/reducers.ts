import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import auth from '../modules/auth/reducers';
import core from '../modules/core/reducers';
import activity from '../modules/activity/reducers';

const rootReducer = combineReducers({
  form: formReducer,
  auth,
  activity,
  core
});

export default rootReducer;
export type AppState = ReturnType<typeof rootReducer>;
