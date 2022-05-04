import React from 'react'
import { render, screen } from '@testing-library/react'

import UserList from './UsersList.js'
import { BrowserRouter } from 'react-router-dom'

describe('UserList', ()=> {

  const DUMMY_USERS = [
    {
      id: 'user1',
      name: 'John Smith',
      image: 'https://media.istockphoto.com/photos/fi/brasilialainen-liikemies-laskee-brasilian-valuuttaa-todellinen-id972220800?k=20&m=972220800&s=612x612&w=0&h=9jPF7yuby2yyDletsCfRzlmvKVOV7D5-3oyg6y40qII=',
      places: 1
    },
    {
      id: 'user2',
      name: 'Alex Jones',
      image: 'https://media.istockphoto.com/photos/fi/komea-mies-ulkona-muotokuva-id1320660496?k=20&m=1320660496&s=612x612&w=0&h=wYUxkRkSiSV2lE8zEa679FD4v51I1FVW2wx5F_1ZNpQ=',
      places: 3
    }
  ]

  test('true is truthy', () => {
    expect(true).toBe(true);
  });

  test('false is falsy', () => {
    expect(false).toBe(false);
  });

  it('Should show no users found when array is empty', () => {
    render(<UserList items={[]}/>)
    expect(screen.getByText('No users found.')).toBeInTheDocument()
    // eslint-disable-next-line testing-library/no-debugging-utils
    //screen.debug()
  })

  it('Should show list of users', () => {
    render(
      <BrowserRouter>
        <UserList items={DUMMY_USERS}/>
      </BrowserRouter>
    )
    expect(screen.queryByText('No users found.')).toBeNull()
    expect(screen.getByText('John Smith')).toBeInTheDocument()
    expect(screen.getByText('Alex Jones')).toBeInTheDocument()
  })
})