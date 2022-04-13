import React from 'react'
import { render, screen } from '@testing-library/react'

import UserItem from './UserItem.js'
import { BrowserRouter } from 'react-router-dom'

describe('UserItem', () => {
  const DUMMY_USER = {
    id: 'user1',
    name: 'John Smith',
    image: 'https://media.istockphoto.com/photos/fi/brasilialainen-liikemies-laskee-brasilian-valuuttaa-todellinen-id972220800?k=20&m=972220800&s=612x612&w=0&h=9jPF7yuby2yyDletsCfRzlmvKVOV7D5-3oyg6y40qII=',
    places: 1
  }

  it('Should show the user when given', () => {
    render(
      <BrowserRouter>
        <UserItem 
          key={'key_1'}
          id={DUMMY_USER.id}
          image={DUMMY_USER.image}
          name={DUMMY_USER.name}
          placeCount={DUMMY_USER.places}
        />
      </BrowserRouter>
    )
    expect(screen.getByText('John Smith')).toBeInTheDocument()
    expect(screen.getByText('1 Place')).toBeInTheDocument()
    expect(screen.getByRole('img')).toBeInTheDocument()
    expect(screen.getByAltText('John Smith')).toBeInTheDocument()
  })

  it('Should contain some certain classes', () => {
    render(
      <BrowserRouter>
        <UserItem 
          key={'key_1'}
          id={DUMMY_USER.id}
          image={DUMMY_USER.image}
          name={DUMMY_USER.name}
          placeCount={DUMMY_USER.places}
        />
      </BrowserRouter>
    )
    expect(screen.getByRole('listitem')).toHaveClass('user-item')
    expect(screen.getByRole('link')).toHaveAttribute('href', '/user1/places');
  })
})