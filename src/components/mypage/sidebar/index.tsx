import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import './style.css';
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { ACCESS_TOKEN, MY_ABSOLUTE_ACCOUNT_MANAGEMENT_PATH, MY_ABSOLUTE_ATTENDANCE_CHECK_PATH, MY_ABSOLUTE_MILEAGE_PATH, MY_ABSOLUTE_PATH, MY_ABSOLUTE_UPDATE_PATH, MY_INFO_PW_ABSOLUTE_PATH, MY_PATH } from  "../../../constants";
import { FaUserEdit, FaCoins, FaHistory, FaCalendarCheck, FaCreditCard } from "react-icons/fa";
import { useSignInUserStore } from "../../../stores";
import Subscribers from "../../../types/subscribers.interface";
import useNoticePagination from "../../../hooks/notice.pagination.hooks";
import NoticePagination from "../../noticePagination";
import { cancleFollowRequest } from "../../../apis";
import { Cookies, useCookies } from "react-cookie";
import ResponseDto from "../../../apis/dto/response/response.dto";

interface SubProps {
    subers: Subscribers
}

export default function MypageSidebar() {

    // state: 로그인 유저 정보 상태 //
    const { signInUser, setSignInUser } = useSignInUserStore();
    const { userId } = useParams();

    // state: 마이페이지 상태 //
    // const [state] = useState<boolean>(true);
    const [subscribe, setSubscribe] = useState<boolean>(false);
    const [user] = useState<boolean>(false);
    // const [stateType, setStateType] = useState<boolean>(false);
    const [editbutton, setEditButton] = useState<boolean>(false);
    const [subscribers, setSubscribers] = useState<Subscribers[]>([]);
    const [searchWord, setSearchWord] = useState<string>('');

    // state: 원본 리스트 상태 //
    const [originalList, setOriginalList] = useState<Subscribers[]>([]);

    // variable: 자기자신 확인 //
    const isUser = signInUser?.userId === userId; // 로그인한 사람이 본인인지 확인

    // function: 네비게이터 함수 처리 //
    const navigator = useNavigate();

    // event handler: 마일리지 관리 버튼 클릭 이벤트 처리 함수 //
    const navigateToMyPage = () => {
        //navigator(MY_ABSOLUTE_PATH);
    };

    // event handler: 마일리지 관리 버튼 클릭 이벤트 처리 함수 //
    const navigateToMileage = () => {
        if(signInUser) navigator(MY_ABSOLUTE_MILEAGE_PATH(signInUser.userId));
    };

    // event handler: 마일리지 관리 버튼 클릭 이벤트 처리 함수 //
    const navigateToAccountManagement = () => {
        if(signInUser) navigator(MY_ABSOLUTE_ACCOUNT_MANAGEMENT_PATH(signInUser.userId));
    };

    // event handler: 개인 정보 수정 버튼 클릭 이벤트 핸들러 //
    const onChangeInfoClickHandler = () => {
        if(signInUser) navigator(MY_INFO_PW_ABSOLUTE_PATH(signInUser.userId));
        else return;
    }

    // event handler: 출석체크 버튼 클릭 이벤트 핸들러 //
    const naviagateToAttendance = () => {
        if(signInUser) navigator(MY_ABSOLUTE_ATTENDANCE_CHECK_PATH(signInUser.userId));
    }

    // event handler: 아이디 검색 입력 변경 이벤트 핸들러 //
    const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchWord(value);
    };

    // event handler: 공지사항 검색 버튼 //
    const onSearchButtonHandler = () => {
        const searchedList = originalList.filter(notice => notice.userId.includes(searchWord));
        setTotalList(searchedList);
        initViewList(searchedList);
    };

    // event handler: 엔터키로 검색 버튼 동작 //
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onSearchButtonHandler();
        }
    }

    // effect: //
    useEffect(() => {
        if(signInUser) {
            setSubscribers(signInUser.subscribers);
        }
    }, []);

    //* 커스텀 훅 가져오기
    const {
        currentPage,
        totalCount,
        viewList,
        pageList,
        setTotalList,
        initViewList,
        onPageClickHandler,
        onPreSectionClickHandler,
        onNextSectionClickHandler,
    } = useNoticePagination<Subscribers>();

    // component: 내가 구독한 유저 스몰 프로필 //
    function SmallProfile({subers}: SubProps) {

        const [cookies, setCookie] = useCookies();
        const accessToken = cookies[ACCESS_TOKEN];
        const { userId } = useParams();

        const [id, setId] = useState<string>('');

        // event handler: 상대방 프로필 클릭 이벤트 핸들러 //
        const onProfileClickHandler = () => {
            navigator(MY_PATH(subers.userId));
        }

        // event handler: 구독 취소 버튼 이벤트 처리 함수 //
        const onSubscribeCancleHandler = (event: MouseEvent<HTMLDivElement>) => {
            event.stopPropagation();
            if(!accessToken || !signInUser?.userId) return;
            //cancleFollowRequest(signInUser.userId, id, accessToken).then(cancleFollowResponse);
        }

        // function: 구독 취소 후 응답 처리 함수 //
        const cancleFollowResponse = (responseBody: ResponseDto | null) => {
            
            if(userId) setId(userId);
            else return;
            console.log(responseBody, userId, "로그인 유저: ", signInUser?.userId);
            const message =
                !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'VF' ? '일치하는 정보가 없습니다.' :
                responseBody.code === 'AF' ? '일치하는 정보가 없습니다.' :
                responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
                responseBody.code === 'NI' ? '존재하지 않는 사용자입니다.' : '';
                        
            const isSuccessed = responseBody !== null && responseBody.code === 'SU';
                        
            if (!isSuccessed) {
                alert(message);
                return;
            } else {
                setSubscribe(false);
                //alert("구독 취소되었습니다.");
                //window.location.reload();
            }
        }

        // render: 구독 박스 렌더링 //
        return (
            <div className="subscribe-box" style={{marginBottom: "15px"}}
                onClick={onProfileClickHandler}>
                <div className="subscribe-image" 
                    style={{backgroundImage: `url(${subers.profileImage ? 
                        subers.profileImage : '/defaultProfile.png'})`}}
                ></div>
                <div className="subscribe-user-info">
                    <div className="subscribe-nickname">{subers.nickName}</div>
                    <div className="subscribe-user">@{subers.userId}</div>
                </div>
                <div className="subscribe-cancel-button" onClick={onSubscribeCancleHandler}>
                    <div className="subscribe-cancel">구독취소</div>
                </div>
            </div>
        )
    }

    // render: 마이페이지 사이드 바 //
    return (
        <>
            <div className="mypage-left-opstions">
                <aside className="mypage-sidebar">
                    <h2 onClick={navigateToMyPage}>마이페이지</h2>
                    <ul>
                        <li onClick={onChangeInfoClickHandler}><FaUserEdit /> 개인정보 수정</li>
                        <li><FaHistory /> 실시간 토론 참여 이력</li>
                        <li onClick={naviagateToAttendance}><FaCalendarCheck /> 출석체크</li>
                        <li onClick={navigateToMileage}><FaCoins /> 마일리지 관리</li>
                        <li onClick={navigateToAccountManagement}><FaCreditCard  /> 계좌 관리</li>
                    </ul>
                </aside>
                <div className="subscribe-wrapper">
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <h2 className="subscribe-title">내가 구독한 사람 {subscribers.length}명</h2>
                        <div className="subscribe-search-box">
                            <input className="input" placeholder="아이디를 입력하세요. " 
                                value={searchWord} onChange={onIdChangeHandler} onKeyDown={handleKeyDown}/>
                            <div className="button active">검색</div>
                        </div>
                        {subscribers.map((sub) => <SmallProfile key={sub.userId} subers={sub}/>)}
                    </div>

                </div>
            </div>
        </>
    )
}
