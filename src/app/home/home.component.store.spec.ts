import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UsersStore } from './home.component.store';
import { UserService } from '../../services/users.service';
import { of } from 'rxjs';
import { identifierName } from '@angular/compiler';

describe('HomeComponentStore', () => {
  function setup() {
    const mockUsersService = jasmine.createSpyObj('UserService', [
      'getUsers',
      'updateUser',
    ]);
    mockUsersService.getUsers.and.returnValue(
      of([
        {
          id: 1,
          name: 'test-name',
          username: '',
          email: '',
        },
      ])
    );
    mockUsersService.updateUser.and.returnValue(of({}));
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UsersStore,
        {
          provide: UserService,
          useValue: mockUsersService,
        },
      ],
    });
    const mockUserStore = TestBed.inject(UsersStore);
    return {
      mockUserStore,
      mockUsersService,
    };
  }

  it('will call loadData', () => {
    const { mockUserStore, mockUsersService } = setup();
    mockUserStore.loadUsers();
    expect(mockUsersService.getUsers).toHaveBeenCalled();
    expect(mockUserStore.entities()).toEqual([
      {
        id: 1,
        name: 'test-name',
        username: '',
        email: '',
      },
    ]);
  });
});
