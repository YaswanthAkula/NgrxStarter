import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { UsersStore } from './home.component.store';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { User } from '../../utils/models/user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Mocking the UsersStore
class MockUsersStore {
  entities() {
    return [{ id: 1, name: 'test-name', username: '', email: '' }];
  }
  updateUser(user: User) {
    console.log('Updated user:', user);
  }
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let fb: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [HomeComponent],
      providers: [
        { provide: UsersStore, useClass: MockUsersStore },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty usersList', () => {
    expect(component.userForm).toBeDefined();
    expect(component.usersArray.length).toBe(0);
  });

  it('should load users into the form when entities are available', () => {
    const users = component.store.entities();
    component.loadUsers(users);

    expect(component.usersArray.length).toBe(users.length);
  });

  it('should update form controls when users are loaded', () => {
    const users: User[] = [
      { id: 1, name: 'User 1', username: 'user1', email: 'user1@example.com' },
    ];

    component.loadUsers(users);

    const userGroup = component.usersArray.at(0) as FormGroup;

    expect(userGroup.get('id')?.value).toBe(1);
    expect(userGroup.get('name')?.value).toBe('User 1');
    expect(userGroup.get('username')?.value).toBe('user1');
    expect(userGroup.get('email')?.value).toBe('user1@example.com');
  });

  it('should not load users if usersList is not empty', () => {
    const users = component.store.entities();
    component.loadUsers(users);
    component.usersArray.push(
      fb.group({
        id: 3,
        name: 'Existing User',
        username: 'existing',
        email: 'existing@example.com',
      })
    );
    expect(component.usersArray.length).toBe(1);
  });
});
