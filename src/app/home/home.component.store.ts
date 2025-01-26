import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { User } from '../../utils/models/user';
import { computed, inject } from '@angular/core';
import { UserService } from '../../services/users.service';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

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
    withComputed(({users}) => ({
        isUsersEmpty: computed(() => users.length === 0)
    })),
    withMethods((store, userService = inject(UserService)) => ({
        loadUsers: rxMethod(
            pipe(
                tap(() => patchState(store, {isLoading: true})),
                switchMap(() => {
                    return userService.getUsers().pipe(
                        tapResponse({
                            next: (users: User[]) => patchState(store, { users }),
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    )
                })
            )
        )
    }))
)
