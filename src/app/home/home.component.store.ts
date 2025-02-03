import {
  patchState,
  signalStore,
  type,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  setAllEntities,
  setEntity,
  updateAllEntities,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { User } from '../../utils/models/user';
import { computed, inject } from '@angular/core';
import { UserService } from '../../services/users.service';
import { concatMap, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { LOADED_STATE, LOADING_STATE } from '../../utils/constants/constants';
import { FormGroup } from '@angular/forms';

type userState = {
  callState: 'init' | 'loading' | 'loaded' | { error: string };
  userForm: FormGroup;
};

const INITIAL_STATE: userState = {
  callState: 'init',
  userForm: new FormGroup({}),
};

export const UsersStore = signalStore(
  withState(INITIAL_STATE),
  withEntities<User>(),
  withComputed(({ callState }) => ({
    isLoading: computed(() => callState() === LOADING_STATE),
    error: computed(() => (callState() as { error: string }).error),
  })),
  withMethods((store, userService = inject(UserService)) => ({
    loadUsers: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { callState: LOADING_STATE })),
        switchMap(() => {
          return userService.getUsers().pipe(
            tapResponse({
              next: (users: User[]) => {
                patchState(store, setAllEntities(users), {
                  callState: LOADED_STATE,
                });
              },
              error: (error: Error) => {
                patchState(store, { callState: { error: error.message } });
              },
            })
          );
        })
      )
    ),
    updateUser: rxMethod<User>(
      pipe(
        concatMap((user: User) => {
          let { id, name, username, email } = user;
          return userService.updateUser({ id, name, username, email }).pipe(
            tapResponse({
              next: (user: User) => {
                patchState(store, setEntity(user));
              },
              error: (error: Error) => {
                patchState(store, {
                  callState: { error: error.message },
                });
              },
            })
          );
        })
      )
    ),
  })),
  withHooks({
    onInit(store) {
      store.loadUsers();
    },
  })
);
