import React from 'react';
import UserItem from './UserItem';

import './UsersList.css';

const UsersList = props => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <h2>No users found.</h2>
      </div>
    );
  }

  return (
    <ul className="users-list">
      { props.items.map(user => (
        <UserItem 
          key={user.id}
          id={user.id}
          image={'https://media.istockphoto.com/photos/fi/brasilialainen-liikemies-laskee-brasilian-valuuttaa-todellinen-id972220800?k=20&m=972220800&s=612x612&w=0&h=9jPF7yuby2yyDletsCfRzlmvKVOV7D5-3oyg6y40qII='}
          name={user.name}
          placeCount={user.places}
        />
      ))}
    </ul>
  )
}

export default UsersList;
