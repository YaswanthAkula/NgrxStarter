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
import { concatMap, config, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { LOADED_STATE, LOADING_STATE } from '../../utils/constants/constants';
import { FormGroup } from '@angular/forms';

type userState = {
  callState: 'init' | 'loading' | 'loaded' | { error: string };
};

const INITIAL_STATE: userState = {
  callState: 'init',
};

function convertToArr(response: any): User[] {
  const keys = Object.keys(response);
  let usersArray = [];
  for(var i=0; i< keys.length; i++) {
    const user = keys[i]
    usersArray.push(response[user] as never);
  }
  return usersArray;
}

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
    updateAllUsers: rxMethod<User[]>(
      pipe(
        concatMap((users: User[]) => {
          return userService.updateAllUsers(users).pipe(
            tapResponse({
              next: (users: User[]) => {
                const transformedArr =convertToArr(users);
                console.log(transformedArr);
                patchState(store, 
                  updateAllEntities((user) => user))
              },
              error: (error: Error) => {
                patchState(store, {
                  callState: { error: error.message },
                });
              },
            })
          )
        })
      )
    )
  })),
  withHooks({
    onInit(store) {
      store.loadUsers();
    },
  })
);
