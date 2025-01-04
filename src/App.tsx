import React from 'react';
import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router';
import { Cookies, useCookies } from 'react-cookie';

import { AUTH_ABSOLUTE_PATH, AUTH_PATH, GD_ABSOLUTE_PATH, GD_DETAIL_PATH, GD_PATH, GD_UPDATE_PATH, GD_WRITE_PATH, OTHERS_PATH, ROOT_ABSOLUTE_PATH, ROOT_PATH } from './constants';

import './App.css';
import GD from './view/GD';
import GDWrite from './view/GD/Write';
import GDDetail from './view/GD/Detail';
import GDUpdate from './view/GD/Update';
import MainLayout from './layouts/MainLayout';


// component: root path 컴포넌트 //
function Index() {

  // state: 쿠키 상태 //
  const [cookies] = useCookies();

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  
  useEffect(() => {
    navigator(ROOT_ABSOLUTE_PATH);
  }, []);

  // // effect: 마운트 시 경로 이동 effect //
  // useEffect(() => {
  //   if (cookies[ACCESS_TOKEN]) navigator(GD_ABSOLUTE_PATH);   // 값이 존재한다면 로그인 상태, 아니라면 비로그인 상태
  //   else navigator(AUTH_ABSOLUTE_PATH);
  // }, []);   // 배열 생략 가능

  // render: root path 컴포넌트 렌더링 //

  return (
    <></>
  );
}

function App() {

    //function: 네비게이터 함수 //
    // const navigator = useNavigate();

  return (
    <Routes>
      <Route index element={<Index />} />

      {/* <Route path={GD_PATH} element={<MainLayout />}> */}
      <Route path={GD_PATH} element={<MainLayout />}>
        <Route index element={<GD />} />
        <Route path={GD_WRITE_PATH} element={<GDWrite />} />
        <Route path={GD_DETAIL_PATH(':roomId')} element={<GDDetail />} />
        <Route path={GD_UPDATE_PATH(':roomId')} element={<GDUpdate />} />
      </Route>

    </Routes>
  );
}

export default App;
