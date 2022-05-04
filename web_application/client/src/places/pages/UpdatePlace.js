import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/input/Input';
import Button from '../../shared/components/button/Button';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook'
import ErrorModal from '../../shared/components/modal/ErrorModal';
import LoadingSpinner from '../../shared/components/loadingspinner/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';

import './PlaceForm.css';

const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  const [loadedPlace, setLoadedPlace] = useState();
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const placeId = useParams().placeId;

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const repsponse = await sendRequest(
          `${process.env.REACT_APP_BACKEND}/places/${placeId}`
        );
        setLoadedPlace(repsponse.place);
        setFormData(
          {
            title: {
              value: repsponse.place.title,
              isValid: true
            },
            description: {
              value: repsponse.place.description,
              isValid: true
            }
          },
          true
        );
      } catch (err) {}
    }
    fetchPlace();
  },[sendRequest, placeId, setFormData]);

  const history = useHistory();

  const placeUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND}/places/${placeId}`, 
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
      }),
      { 
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth.token
      })
      history.push('/' + auth.userId + '/places');
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
       <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <h2>Could not find place!</h2>
      </div>
    );
  }

  return (
    <React.Fragment>
       <ErrorModal error={error} onClear={clearError} />
       {!isLoading && loadedPlace && <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
          initialValue={loadedPlace.title}
          initialValid={true}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (min. 5 characters)."
          onInput={inputHandler}
          initialValue={loadedPlace.description}
          initialValid={true}
        />
        <Button type="submit" disabled={!formState.isValid}>
          Update place
        </Button>
      </form>}
    </React.Fragment>
  );
};

export default UpdatePlace;