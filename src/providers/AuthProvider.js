import React, {useState, useEffect, createContext} from 'react';
import {getAccessToken, getRefreshToken,  refreshAccessTokenApi, logout,} from '../api/auth.js';
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext();

export default function AuthProvider(props){
  const {children} = props;
  const [user, setUser] = useState({
    user: null,
    isLoading: null
  });

  useEffect (() =>{
    checkUserLogin(setUser);
  }, [])

  return <AuthContext.Provider value={user} setUser={setUser}>{children}</AuthContext.Provider>

}

async function checkUserLogin(setUser){
  const accessToken = getAccessToken();
  if(!accessToken || accessToken == "null" || accessToken == "undefined"){
    const refreshToken = getRefreshToken();
    console.log("getRefresh token --> ", refreshToken);
    if(!accessToken){
      logout();
      setUser({
        user: null,
        isLoading: false
      })
    }else{
      refreshAccessTokenApi(refreshToken);
    }
  }else{
    console.log("Prueba -->", jwtDecode(accessToken));

    setUser({
      isLoading: false,
      user: jwtDecode(accessToken)
    })
  }
}

