import React, { useState } from 'react'
import './style.css';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../components/footer';

import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN, GEN_DISC_ABSOLUTE_PATH, GEN_DISC_PATH, MAIN_ABSOLUTE_PATH, NOTICE, NOTICE_ABSOLUTE_PATH, ROOT_ABSOLUTE_PATH, ROOT_PATH, RT_DISC_ABSOLUTE_PATH, RT_DISC_PATH, SCHEDULE, SCHEDULE_ABSOLUTE_PATH } from '../../constants';
//import ArrowToTop from '../../components/arrow-to-top/ArrowToTop';

// component: 로고 컴포넌트 //
function Logo() {

    // state: path 상태 //
    const { pathname } = useLocation();

    // variable: 특정 경로 여부 변수 //
    const isHome = pathname.startsWith(ROOT_PATH);

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // event handler: 네비케이션 아이템 클릭 이벤트 //
    const onItemClickHandler = (path: string) => {
        navigator(path);
    };

    // render: 로고 컴포넌트 렌더링 //
    return (
        <div id='layout-logo'>
            <div className='box'>
                <div className={`title ${isHome ? 'active' : ''}`} 
                onClick={() => onItemClickHandler(MAIN_ABSOLUTE_PATH)}>도란도란</div>
            </div>
        </div>
    );
}

// component: 상단 네비게이션 컴포넌트 //
function TopNavigation() {

    // state: path 상태 //
    const { pathname } = useLocation();

    // state: login user state //
    //const { signInUser } = useSignInUserStore();

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // variable: 특정 경로 여부 변수 //
    const isGenDisc = pathname.startsWith(GEN_DISC_PATH);
    const isRTDisc = pathname.startsWith(RT_DISC_PATH);
    const isNotice = pathname.startsWith(NOTICE);
    const isSchedule = pathname.startsWith(SCHEDULE);

    // event handler: 네비게이션 아이템 클릭 이벤트 //
    const onItemClickHandler = (path: string) => {
        navigator(path);
    };

    // render: 상단 네비게이션 컴포넌트 //
    return (
        <div id='layout-top-navigation'>
            <div className='navigation'>
                <div className={`navigation-item ${isGenDisc ? 'active' : ''}`} onClick={() => onItemClickHandler(GEN_DISC_ABSOLUTE_PATH)}>
                    <div className='item-text'>일반 토론</div>
                </div>
                <a className={`navigation-item ${isRTDisc ? 'active' : ''}`} onClick={() => onItemClickHandler(RT_DISC_ABSOLUTE_PATH)}>
                    <div className='item-text'>실시간 토론</div>
                </a>
                <div className={`navigation-item ${isNotice ? 'active' : ''}`} onClick={() => onItemClickHandler(NOTICE_ABSOLUTE_PATH)}>
                    <div className='item-text'>공지사항</div>
                </div>
                <div className={`navigation-item ${isSchedule ? 'active' : ''}`} onClick={() => onItemClickHandler(SCHEDULE_ABSOLUTE_PATH)}>
                    <div className='item-text'>일정관리</div>
                </div>
            </div>
        </div>
    );
}

// component: 상단 네비게이션 컴포넌트 //
function TopPersonalNavigation() {

    // state: path 상태 //
    const { pathname } = useLocation();

    // state: cookie 상태 //
    const [cookies, setCookie, removeCookie] = useCookies();
    const accessToken = cookies[ACCESS_TOKEN];

    // state: hovering 상태 //
    const [isHovered, setIsHovered] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // // event handler: 사람 아이콘 버튼 클릭 이벤트 //
    // const onLogInClickHandler = () => {
    //     if (pathname === SIGN_IN_ABSOLUTE_PATH) window.location.reload();
    //     navigator(SIGN_IN_ABSOLUTE_PATH);
    // }

    // // event handler: 회원가입 버튼 //
    // const onSignUpClickHandler = () => {
    //     navigator(SIGN_UP_ABSOLUTE_PATH);
    // }

    // event Handler: 로그아웃 버튼 클릭 이벤트 처리 //
    const onLogoutButtonClickHandler = () => {
        removeCookie(ACCESS_TOKEN, { path: ROOT_ABSOLUTE_PATH });
        navigator(ROOT_ABSOLUTE_PATH);
    };

    // render: 상단 컴포넌트 //
    return (
        <div id='layout-my'>

            <div
                className='layout-my-alarm'
                onMouseEnter={() => setIsHovered2(true)}>
            </div>
            {isHovered2 && (
                <div className='menu-box2'
                    onMouseEnter={() => setIsHovered2(true)}
                    onMouseLeave={() => setIsHovered2(false)}>
                    <div>
                        <div className='menu'>알림1</div>
                        <div className='menu'>알림2</div>
                    </div>
                </div>)
            }

            <div
                className='layout-my-icon'
                onMouseEnter={() => setIsHovered(true)}>
            </div>

            {isHovered && (
                <div className='menu-box'
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}>
                    <div>
                        <div className='menu' onClick={onLogoutButtonClickHandler}>로그아웃</div>
                        <div className='menu' onClick={() => navigator('/mypage')}>마이페이지</div>
                    </div>
                </div>)
            }
        </div>
    );
}


// component: 메인 레이아웃 컴포넌트 //
export default function MainLayout() {

    // function: 네비데이터 함수 //
    const navigator = useNavigate();

    return (
        <div id='main-layout'>
            <div className='category'>
                <Logo />
                <TopNavigation />
                <TopPersonalNavigation />
            </div>
            <div id='main-wrapper'>
                <Outlet />
            </div>
            {/* <ArrowToTop /> */}
            <Footer />
        </div>
    )
}
