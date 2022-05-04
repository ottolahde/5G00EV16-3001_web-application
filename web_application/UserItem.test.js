import React from 'react'
import { render, screen } from '@testing-library/react'
import { 
  BrowserRouter 
} from 'react-router-dom';
import UserItem from './client/src/users/components/UserItem'

describe('UserItem', ()=> { 
  const user = {
    key: 1,
    id: 1,
    image: 'https://media.istockphoto.com/photos/fi/brasilialainen-liikemies-laskee-brasilian-valuuttaa-todellinen-id972220800?k=20&m=972220800&s=612x612&w=0&h=9jPF7yuby2yyDletsCfRzlmvKVOV7D5-3oyg6y40qII=',
    name: 'John Wayne',
    placeCount: 2
  }

  it('should take a snapshot', () => {
    const tree = render(
      <BrowserRouter>
        <UserItem 
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.placeCount}
        />
      </BrowserRouter>
    ).tree;
    // eslint-disable-next-line testing-library/no-debugging-utils
    //screen.debug()
    screen.getByText('John Wayne');
  })

  test('true is truthy', () => {
    expect(true).toBe(true);
  });

  test('false is falsy', () => {
    expect(false).toBe(false);
  });
});