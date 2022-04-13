import React, { useState, useContext } from 'react';

import Button from '../../shared/components/button/Button';
import Card from '../../shared/components/card/Card';
import Input from '../../shared/components/input/Input';
import { useForm } from '../../shared/hooks/form-hook';
import { 
  VALIDATOR_EMAIL, 
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE 
} from '../../shared/util/validators';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/modal/ErrorModal';
import LoadingSpinner from '../../shared/components/loadingspinner/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

import './Authenticate.css';

const Authenticate = props => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    }
  );

  const onSubmitHandler = async event => {
    event.preventDefault();
    
    if (isLoginMode) {
      try {
        const response = await sendRequest(
          'http://localhost:5000/api/users/login',
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {
            'Content-Type': 'application/json'
          }
        );
        auth.login(response.userId, response.token);
      } catch (err) {}
    } else {
      try {
        const response = await sendRequest(
          'http://localhost:5000/api/users/signup',
          'POST',
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {
            'Content-Type': 'application/json'
          }
        );
        auth.login(response.userId, response.token);
      } catch (err) {}
    }
  }; 

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(          //We need to drop name data in login mode
        {
          ...formState.inputs,
          name: undefined   //We can set it to undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid);
    } else {
      setFormData(         
        {
          ...formState.inputs,  //We want the current email and password
          name: {
            value: '',          //We add the empty name value
            isValid: false      //False because the name is empty
          }
        }, false);              //Form is false because name was false
    }

    setIsLoginMode(prevMode => !prevMode);
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay/>}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={onSubmitHandler}>
          {!isLoginMode && <Input 
            element="input"
            id="name"
            type="text"
            label="Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Enter a name"
            onInput={inputHandler}
          />}
          <Input 
            element="input"
            id="email"
            type="email"
            label="Email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Enter a valid email address"
            onInput={inputHandler}
          />
          <Input 
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Enter a valid password, at least 6 characters"
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          {isLoginMode ? 'Signup' : 'Login'} instead?
        </Button>
      </Card>
    </React.Fragment>
  )
};

export default Authenticate;