import React, { useEffect, useState } from "react";
import './style.css';
import { useLocation, useNavigate } from "react-router-dom";

import { MY_ABSOLUTE_ATTENDANCE_CHECK_PATH, MY_ABSOLUTE_MILEAGE_PATH, MY_ABSOLUTE_UPDATE_PATH, MY_INFO_PW_ABSOLUTE_PATH, MY_INFO_UPDATE_ABSOLUTE_PATH, MY_MILEAGE_PATH, MY_UPDATE_PATH } from "../../constants";
import { FaUserEdit, FaCoins, FaHistory, FaCalendarCheck } from "react-icons/fa";
import { useSignInUserStore } from "../../stores";


// component: 마이페이지 컴포넌트 //
export default function Mypage() {

    // state: 로그인 유저 정보 상태 //
    const { signInUser, setSignInUser } = useSignInUserStore();

    // state: 마이페이지 상태 //
    // const [menu, setMenu] = useState<boolean>(false);
    const [state] = useState<boolean>(true);
    const [subscribe, setSubscribe] = useState<boolean>(false);
    const [user] = useState<boolean>(false);
    const [stateType, setStateType] = useState<boolean>(false);
    const [editbutton, setEditButton] = useState<boolean>(false);

    // variable: 자기자신 확인 //
    const isUser = user && true;

    // // event handler: menu 클릭 이벤트 처리 함수 //
    // const onMenuButtonHandler = () => {

    //     setMenu(!menu);
    // }

    // event handler: 구독 버튼 클릭 이벤츠 처리 함수 //
    const onSubscribeButtonHandler = () => {
        setSubscribe(!subscribe)
    }

    // function: 네비게이터 함수 처리 //
    const navigator = useNavigate();

    // event handler: 내 정보 수정 클릭 이벤트 처리 함수 //
    const onUpdateButtonHandler = () => {
        navigator(MY_ABSOLUTE_UPDATE_PATH(1));
    }

    // event handler: 토론방 상태 클릭 이벤트 처리 함수 //
    const onStateTypeButtonHandler = () => {
        setStateType(!stateType)
    }

    // event handler: 게시물 메뉴 버튼 클릭 이벤트 처리 함수 //
    const onPostMenuButtonHandler = () => {
        setEditButton(!editbutton);
    }

    const navigateToMileage = () => {
        navigator(MY_ABSOLUTE_MILEAGE_PATH);
    };

    // event handler: 개인 정보 수정 버튼 클릭 이벤트 핸들러 //
    const onChangeInfoClickHandler = () => {
        navigator(MY_INFO_PW_ABSOLUTE_PATH('qwer1234'));
    }

    // event handler: 출석체크 버튼 클릭 이벤트 핸들러 //
    const naviagateToAttendance = () => {
        navigator(MY_ABSOLUTE_ATTENDANCE_CHECK_PATH('songth'));
    }

    // effect: //
    useEffect(()=> {
        console.log(signInUser);
    }, []);

    // render: 마이페이지 화면 렌더링 //
    return (
        <div className="mypage-wrapper">
            <div className="mypage-left-opstions">
                <aside className="mypage-sidebar">
                    <h2>마이페이지</h2>
                    <ul>
                        <li onClick={onChangeInfoClickHandler}><FaUserEdit /> 개인정보 수정</li>
                        <li onClick={navigateToMileage}><FaCoins /> 마일리지 관리</li>
                        <li><FaHistory /> 실시간 토론 참여 이력</li>
                        <li onClick={naviagateToAttendance}><FaCalendarCheck /> 출석체크</li>
                    </ul>
                </aside>
                <div className="subscribe-wrapper">
                    <div>
                        <h2 className="subscribe-title">내가 구독한 사람 2명</h2>
                        <div className="subscribe-search-box">
                            <input className="input" placeholder="아이디를 입력하세요. " />
                            <div className="button active">검색</div>
                        </div>
                        <div className="subscribe-box">
                            <div className="subscribe-image"></div>
                            <div className="subscribe-user-info">
                                <div className="subscribe-nickname">마이멜로디</div>
                                <div className="subscribe-user">@1000JEA</div>
                            </div>
                            <div className="subscribe-cancel-button">
                                <div className="subscribe-cancel">구독취소</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mypage-main-wrapper">
                <div className="user-box">
                    <div id="main-profile" style={{ backgroundImage: `url(${signInUser?.profileImage})` }}></div>
                    <div className="mypage-info">
                        <div className="mypage-info-top">
                            <div className="mypage-info-top-a">
                            <div className="mypage-nickname">{signInUser?.nickName}</div>
                                {!isUser ? <div className="subscribe-button-box" onClick={onSubscribeButtonHandler}>
                                    {subscribe ? <div className="subscribe-button">구독</div>
                                        : <div className="subscribe-button">구독 취소</div>}
                                </div> : ''}
                            </div>
                            <div className="top-icon-setting" onClick={onUpdateButtonHandler}></div>
                        </div>
                        <div className="mypage-id">@{signInUser?.userId}</div>
                        <div className="mypage-info-bottom">
                            <div className="mypage-user">구독자 <strong>28</strong></div>
                            <div className="mypage-user">토론방 <strong>9</strong></div>
                        </div>
                        <div className="mypage-state-message">{signInUser?.statusMessage}</div>

                    </div>
                    
                    {!isUser ? <div className="subscribe-button-box" onClick={onSubscribeButtonHandler}>
                        
                    </div> : ''}
                </div>
                
                <div className="mypage-discussion-room-top">
                    <div className="mypage-discussion-room">내가 개설한 토론방</div>
                    <div className="discussion-state-box" onClick={onStateTypeButtonHandler}>진행중
                        {stateType && <div className="state-type-box" >
                            <div className="state-type">진행중</div>
                            <div className="state-type">마감</div>
                        </div>}
                    </div>
                </div>

                <div className="discussion-room-list">
                    <div className="discussion-image"></div>
                    <div className="discussion-info">
                        <div className="discussion-title-box">
                            <div className="discussion-title">대마초 합법화</div>
                            <div className="discussion-icon-box">
                                <div className="discussion-icon" onClick={onPostMenuButtonHandler}></div>
                                {editbutton && <div className="discussion-edit-box">
                                    <div className="edit-item">수정</div>
                                    <div className="edit-item">삭제</div>
                                </div>}
                            </div>
                        </div>
                        <div className="discussion-contents">범죄 감소와 세수 증대 효과가 있다. vs 건강 문제와 사회적 부작용이 우려된다.</div>
                        <div className="discussion-bottom">
                            <div className="discussion-bottom-box">
                                <div className="discussion-created">20204.12.30 16:30</div>
                                <div className="discussion-fixed">(수정됨)</div>
                                {!state ? <div className="discussion-state-box continue">
                                    <div className="discussion-state ">진행중</div>
                                </div> :
                                    <div className="discussion-state-box end">
                                        <div className="discussion-state ">마감</div>
                                    </div>
                                }
                            </div>
                            <div className="discussion-icons">
                                <div className="discussion-comment-icon"></div>
                                <div className="discussion-comment">25</div>
                                <div className="discussion-like-icon"></div>
                                <div className="discussion-like">127</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}