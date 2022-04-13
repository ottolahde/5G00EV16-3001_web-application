import React, {useEffect, useState} from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/modal/ErrorModal';
import LoadingSpinner from '../../shared/components/loadingspinner/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const [userData, setUserData] = useState()

  useEffect(()=> {
    const fetchUsers = async () => {
      try {
        const users = await sendRequest('http://localhost:5000/api/users/');
        setUserData(users);
      } catch (err) {}
    }
    fetchUsers();
  }, [sendRequest]); //We can add it as dependency because useCallback will prevent a loop

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && ( 
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && userData && <UsersList items={userData.users} />}
    </React.Fragment>
  );
}

export default Users;
