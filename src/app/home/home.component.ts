import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { UsersStore } from './home.component.store';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { User } from '../../utils/models/user';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styles: [``],
  standalone: false,
  providers: [UsersStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly store = inject(UsersStore);
  readonly userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      usersList: this.fb.array([]),
    });
    effect(() => {
      if (this.store.entities().length && !this.usersArray.length) {
        this.loadUsers(this.store.entities());
      }
    });
  }

  get usersArray(): FormArray {
    return this.userForm.get('usersList') as FormArray;
  }

  loadUsers(users: User[]): void {
    users.forEach((user) => {
      this.usersArray.push(
        this.fb.group({
          id: [user.id, Validators.required],
          name: [user.name, Validators.required],
          username: [user.username, Validators.required],
          email: [user.email, [Validators.required, Validators.email]],
          isEditable: [false],
        })
      );
    });
  }

  toggleEditMode(index: number): void {
    const userGroup = this.usersArray.at(index) as FormGroup;
    const isEditable = userGroup.get('isEditable')?.value;
    if (isEditable) {
      const userDetails = userGroup.value;
      this.store.updateUser(userDetails);
    }
    userGroup.patchValue({
      isEditable: !isEditable,
    });
  }
}
