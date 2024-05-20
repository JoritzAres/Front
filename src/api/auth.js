import jwtDecode from 'jwt-decode';
import {config } from '../config';
import {ACCESS_TOKEN, REFRESH_TOKEN} from '../utils/constants';

export function getAccessToken() {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  if(!accessToken || accessToken == "null"){
    return null;
  }

  return willExpireToken(accessToken) ? null : accessToken;
}

function willExpireToken(token){
  const second = 60;
  const metaToken = jwtDecode(token);
  const {exp} = metaToken;
  const now = (Date.now() + second) / 1000;

  return now > exp;
}

export function getRefreshToken(){
  const refreshToken = localStorage.getItem(REFRESH_TOKEN);
  if(!refreshToken || refreshToken == "null"){
    return null;
  }
  console.log("will expire token --> ", willExpireToken(refreshToken))
  return willExpireToken(refreshToken) ? null : refreshToken;
}

export function refreshAccessTokenApi(refreshToken){
  const url = `${config.server}:${config.server_port}/refresh-access-token`;
  fetch(url,{
    method: 'POST',
    body: JSON.stringify({refreshToken: refreshToken}),
    headers: {
    "Content-Type": "application/json"
    }
  })
    .then(result => {
      if(result.status !== 200){
        return null;
      }
      return result.json();
    })
    .then(response => {
      if(!response){
        
      }else{
        const {accessToken, refreshToken} = response;
        localStorage.setItem(ACCESS_TOKEN, accessToken);
        localStorage.setItem(REFRESH_TOKEN, refreshToken);
      }
    })
}

export function logout(){
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
}

