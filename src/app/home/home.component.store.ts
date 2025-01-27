import { patchState, signalStore, type, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { User } from '../../utils/models/user';
import { computed, inject } from '@angular/core';
import { UserService } from '../../services/users.service';
import { pipe, switchMap, tap } from 'rxjs';

type userState = {
    users: User[],
    isLoading: boolean;
};

const INITIAL_STATE: userState = {
    users: [],
    isLoading: false
};

export const UsersStore = signalStore(
   withState(INITIAL_STATE),
    withComputed(({ users }) => ({
        isUsersEmpty: computed(() => users().length === 0),
      })),
    withMethods((store, userService = inject(UserService)) => ({
        loadUsers: rxMethod(
            pipe(
                tap(() => patchState(store, {isLoading: true})),
                switchMap(() => {
                    return userService.getUsers().pipe(
                        tap(
                            {
                            next: (users: User[]) => patchState(store, { users }),
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        }
                    )
                    )
                })
            )
        ),
        updateUser: rxMethod<User>(
            pipe(
                switchMap((user: User) => {
                    return userService.updateUser(user).pipe(
                        tap({
                            next: (user: User) => {
                                const users = store.users();
                                users.map(uuser =>  {
                                    if(uuser.id == user.id) {
                                        uuser = user
                                }});
                                patchState(store, { users })
                            },
                        })
                    )
                })
            )
        ),
    })),
    withHooks({
        onInit(store) {
            store.loadUsers(0);
        },
    })
)
