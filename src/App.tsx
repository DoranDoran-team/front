import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, useNavigate, useSearchParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN, CHANGE_PW, FIND_ID, FIND_ID_RESULT, FIND_PW, GEN_DISC_PATH, LOGIN_ABSOLUTE_PATH, LOGIN_PATH, MAIN_ABSOLUTE_PATH, MAIN_PATH, MY_PATH, NOTICE, OTHERS_PATH, ROOT_PATH, RT_DISC_PATH, SCHEDULE, SIGN_UP, SNS_SUCCESS_PATH } from './constants';
import MainLayout from './layouts/MainLayout';
import GerneralDiscuss from './view/General_Discuss';
import RTDiscuss from './view/RT_Discuss';
import Notice from './view/Notice';
import Schedule from './view/Schedule';
import Main from './view/Main';
import Mypage from './view/Mypage';
import Login from './view/Auth/Login';
import FindId from './view/Auth/Find-id';
import FindPw from './view/Auth/Find-pw';
import SignUp from './view/Auth/Sign-up';
import FindIdResult from './view/Auth/Find-id-result';
import ChangePw from './view/Auth/Change-pw';


// component: root path 컴포넌트 //
function Index() {

  // state: 쿠키 상태 //
  const [cookies] = useCookies();

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // effect: 마운트 시 경로 이동 effect //
  useEffect(()=> {
    if(cookies[ACCESS_TOKEN]) navigator(MAIN_ABSOLUTE_PATH);
    else navigator(LOGIN_ABSOLUTE_PATH);
  }, []);

  // render: root path 컴포넌트 렌더링 //
  return (
    <></>
  );
}


// component: sns success 컴포넌트 //
function SnsSuccess() {

  // state: query parameter 상태 //
  const [queryParam] = useSearchParams();
  const accessToken = queryParam.get('accessToken');
  const expiration = queryParam.get('expiration');

  // state: cookie 상태 //
  const [cookies, setCookie] = useCookies();

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // effect: sns success 컴포넌트 로드시 accessToken과 expiration을 확인하여 로그인 처리하는 함수 //
  useEffect(()=> {
    if(accessToken && expiration) {
      const expires = new Date(Date.now() + (Number(expiration) * 1000));
      setCookie(ACCESS_TOKEN, accessToken, {path: ROOT_PATH, expires});

      navigator(MAIN_ABSOLUTE_PATH);
    }else {
      navigator(LOGIN_ABSOLUTE_PATH);
    }
  }, []);

  // render: sns success 컴포넌트 렌더링 //
  return <></>;

}

// component: 도란도란 컴포넌트 //
export default function DoranDoran() {
  
    // render: 메인 화면 렌더링 //
    return (
      <BrowserRouter>
        <Routes>
          <Route index element={<Index />} />
          <Route path={LOGIN_PATH} element={<Login />}></Route>
          <Route path={FIND_ID} element={<FindId/>}/>
          <Route path={FIND_ID_RESULT} element={<FindIdResult/>} />
          <Route path={FIND_PW} element={<FindPw/>}></Route>
          <Route path={CHANGE_PW} element={<ChangePw/>} />
          <Route path={SIGN_UP} element={<SignUp/>}></Route>

          <Route path={MAIN_PATH} element={<MainLayout/>} >
            <Route index element={<Main />} />
          </Route>

          <Route path={GEN_DISC_PATH} element={<MainLayout/>}>
            <Route index element={<GerneralDiscuss />} />
          </Route>

          <Route path={RT_DISC_PATH} element={<MainLayout/>}>
            <Route index element={<RTDiscuss />} />
          </Route>

          <Route path={NOTICE} element={<MainLayout/>} >
            <Route index element={<Notice />} />
          </Route>

          <Route path={SCHEDULE} element={<MainLayout/>} >
            <Route index element={<Schedule />} />
          </Route>

          <Route path={MY_PATH} element={<MainLayout />}  >
            <Route index element={<Mypage />} />
          </Route>

          <Route path={SNS_SUCCESS_PATH} element={<SnsSuccess/>} />
          <Route path={OTHERS_PATH} element={<Index />}/>
        </Routes>
      </BrowserRouter>
    );
  }