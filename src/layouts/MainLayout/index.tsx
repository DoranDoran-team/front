import React, { useEffect, useState } from 'react'
import './style.css';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../components/footer';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN, GEN_DISC_ABSOLUTE_PATH, GEN_DISC_PATH, MAIN_ABSOLUTE_PATH, MAIN_PATH, MY_ABSOLUTE_PATH, NOTICE, NOTICE_ABSOLUTE_PATH, ROOT_ABSOLUTE_PATH, ROOT_PATH, RT_DISC_ABSOLUTE_PATH, RT_DISC_PATH, SCHEDULE, SCHEDULE_ABSOLUTE_PATH } from '../../constants';
import { RankingClickResultStore, useCategoryStore, useSignInUserStore } from '../../stores';
import Notification from '../../components/notification';
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

    // state: 일반 토론방 상태 //
    const {category, setCategory} = useCategoryStore();
    
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
        setCategory('전체');
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

    // state: 로그인 유저 정보 상태 //
    const { signInUser, setSignInUser } = useSignInUserStore();

    // state: cookie 상태 //
    const [cookies, setCookie, removeCookie] = useCookies();

    // state: hovering 상태 //
    const [isHovered, setIsHovered] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // event Handler: 로그아웃 버튼 클릭 이벤트 처리 //
    const onLogoutButtonClickHandler = () => {
        removeCookie(ACCESS_TOKEN, { path: ROOT_ABSOLUTE_PATH });
        navigator(ROOT_ABSOLUTE_PATH);
    };

    // render: 상단 컴포넌트 //
    return (
        <div id="layout-my">

            <div
                className='layout-my-alarm'
                onMouseEnter={() => setIsHovered2(true)}>
                {hasUnread && <div className="alarm-dot" />}
            </div>
            <div style={{ display: 'none' }}>
                <Notification setHasUnread={setHasUnread} />
            </div>
            {isHovered2 && (
                <div className='menu-box2'
                    onMouseEnter={() => setIsHovered2(true)}
                    onMouseLeave={() => setIsHovered2(false)}>
                    <div>
                        {/* 알림 모달용 Notification – 필요 시 표시 */}
                        <Notification setHasUnread={setHasUnread} />
                    </div>
                </div>
            )}


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
                        <div className='menu' onClick={
                            signInUser?.role ? () => navigator('/admin') :
                            () => navigator('/mypage')}>마이페이지</div>
                    </div>
                </div>)
            }
        </div>
    );
}

// component: 알림 메시지 컴포넌트 //
function AlarmMessage() {

    // render: 알림 메시지 렌더링 //
    return (
        <>
            <div className='menu'><strong>@abc123</strong> 님이 회원님의 게시글에 댓글을 달았습니다.</div>
            <hr />
        </>
    )
}

// component: 메인 레이아웃 컴포넌트 //
export default function MainLayout() {
    const [isScrolled, setIsScrolled] = useState<boolean>(false);

    // state: 랭킹 클릭 상태 //
    const { clickRank, setClickRank } = RankingClickResultStore();

    // function: 네비데이터 함수 //
    const navigator = useNavigate();

    const location = useLocation();

    const handleScroll = () => {
        if (window.scrollY > 0) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // 메인 페이지 경로 설정
    const isMainPage = location.pathname === MAIN_PATH;

    const onClickRankHandler = () => {
        setClickRank(!clickRank);
    }

    return (
        <div id='main-layout'>
            <div className={`category ${isScrolled ? (isMainPage ? 'scrolled' : 'default-scrolled') : ''}`}>
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
