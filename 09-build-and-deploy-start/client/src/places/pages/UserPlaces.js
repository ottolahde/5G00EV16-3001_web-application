import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import PlacesList from '../components/PlacesList';
import { useHttpClient } from '../../shared/hooks/http-hook'
import ErrorModal from '../../shared/components/modal/ErrorModal';
import LoadingSpinner from '../../shared/components/loadingspinner/LoadingSpinner';

// 'https://visitylojarvi.fi/wp-content/uploads/2016/11/ylojarvi-seitseminen-nuotiopaikka.jpg'

const UserPlaces = props => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const userId = useParams().userId;
  
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const repsponse = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
        );
        setLoadedPlaces(repsponse.places);
      } catch (err) {}
    }
    fetchPlaces();

  },[sendRequest, userId]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces(prevPlaces => 
      prevPlaces.filter(place => place.id !== deletedPlaceId)
    )
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && ( 
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && 
        <PlacesList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />}
    </React.Fragment>
  );
};

export default UserPlaces;