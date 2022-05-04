import React, { useState, useCallback, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Redirect, 
  Route, 
  Switch 
} from 'react-router-dom';

import AddPlace from './places/pages/AddPlace';
import UpdatePlace from './places/pages/UpdatePlace';
import Users from './users/pages/Users';
import UserPlaces from './places/pages/UserPlaces';
import Authenticate from './users/pages/Authenticate';
import MainNavigation from './shared/components/navigation/MainNavigation'
import { AuthContext } from './shared/context/auth-context';

let logoutTimer;

const App = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false)

  const login = useCallback((uid, token, expirationDate) => {  //prevent a render loop
    setToken(token);
    setUserId(uid);
    //current date in ms + 1h
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      'userData', 
      JSON.stringify({
        userId: uid, 
        token: token,
        expiration: tokenExpirationDate.toISOString()
      })
    );
  }, []);

  const logout = useCallback(() => {  //prevent a render loop
    setToken(null);
    setUserId(null);
    setTokenExpirationDate(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(()=> {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData && storedData.token && 
      new Date(storedData.expiration) > new Date() // if greater, still in future
    ) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <AddPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth">
          <Authenticate />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{ 
        isLoggedIn: !!token, 
        token: token, 
        userId: userId, 
        login: login, 
        logout: logout
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
