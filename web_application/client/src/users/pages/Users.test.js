import React from 'react'
import { render, screen, act } from '@testing-library/react'

import Users from './Users.js'
import { useHttpClient } from '../../shared/hooks/http-hook';

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

describe('Users', () => {
  it('should show a loading spinner while waiting', () => {
    render(<Users />)
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('should show the list of users', () => {
    // jest.useFakeTimers()
    // const { queryByTestId } = render(<Users />)
    
    // act(() => {
    //   jest.advanceTimersByTime(2000);
    // });

    // expect(screen.queryByTestId('loading-spinner')).toBeNull()
  })
})
