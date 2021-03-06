import {Dispatch} from 'redux';
import {loading, errors, success} from '../../core/actions/upsert';
import {saveUser} from '../repositories/user';
import {UserFormData} from '../components/form/UserForm';

export const upsertUser = (payload: UserFormData) => async (
  dispatch: Dispatch
): Promise<void> => {
  dispatch(loading(true));

  try {
    dispatch(success(await saveUser(payload)));
  } catch (e) {
    dispatch(errors(e));
  } finally {
    dispatch(loading(false));
  }
};
