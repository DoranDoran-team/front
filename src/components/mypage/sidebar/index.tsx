import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import './style.css';
import { useNavigate, useParams } from "react-router-dom";
import { ACCESS_TOKEN, ANOTHER_USER_PROFILE_ABSOULTE_PATH, MY_ABSOLUTE_ACCOUNT_MANAGEMENT_PATH, MY_ABSOLUTE_ATTENDANCE_CHECK_PATH, MY_ABSOLUTE_MILEAGE_PATH, MY_ABSOLUTE_PATH, MY_ABSOLUTE_UPDATE_PATH, MY_INFO_PW_ABSOLUTE_PATH, MY_PATH, SELECTED_USER } from  "../../../constants";
import { FaUserEdit, FaCoins, FaHistory, FaCalendarCheck, FaCreditCard } from "react-icons/fa";
import { useSignInUserStore } from "../../../stores";
import Subscribers from "../../../types/subscribers.interface";
import useNoticePagination from "../../../hooks/notice.pagination.hooks";
import { useCookies } from "react-cookie";
import ResponseDto from "../../../apis/dto/response/response.dto";
import { SearchUserData } from "../../../apis/dto/response/user/get-search-user-list.response.dto";
import { cancleFollowRequest, searchUsersRequest } from "../../../apis";
import { getCookie } from "../../get-user-cookie/get.user.cookie";

interface SubProps {
    subers: Subscribers
}

export default function MypageSidebar() {

    // state: 로그인 유저 정보 상태 //
    const { signInUser, setSignInUser } = useSignInUserStore();
    const { userId } = useParams();

    // state: 마이페이지 상태 //
    const [subscribe, setSubscribe] = useState<boolean>(false);
    const [user] = useState<boolean>(false);
    // const [stateType, setStateType] = useState<boolean>(false);
    const [editbutton, setEditButton] = useState<boolean>(false);
    const [subscribers, setSubscribers] = useState<Subscribers[]>([]);
    const [searchWord, setSearchWord] = useState<string>('');

    // state: 원본 리스트 상태 //
    const [originalList, setOriginalList] = useState<Subscribers[]>([]);

    // state: 검색어, 검색 결과, 드롭다운 열림 여부
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<SearchUserData[]>([]);
    const [showResults, setShowResults] = useState<boolean>(false);
 

    // variable: 자기자신 확인 //
    const isUser = signInUser?.userId === userId; // 로그인한 사람이 본인인지 확인

    // function: 네비게이터 함수 처리 //
    const navigator = useNavigate();

    const [cookies] = useCookies();
    const accessToken = cookies['accessToken'];

    // event handler: 마이페이지 버튼 클릭 이벤트 처리 함수 //
    const navigateToMyPage = () => {
        navigator(MY_ABSOLUTE_PATH);
    };

    // event handler: 마일리지 관리 버튼 클릭 이벤트 처리 함수 //
    const navigateToMileage = () => {
        navigator(MY_ABSOLUTE_MILEAGE_PATH);
    };

    // event handler: 계좌 관리 버튼 클릭 이벤트 처리 함수 //
    const navigateToAccountManagement = () => {
        navigator(MY_ABSOLUTE_ACCOUNT_MANAGEMENT_PATH);
    };

    // event handler: 개인정보 수정 버튼 클릭 이벤트 처리 함수 //
    const onChangeInfoClickHandler = () => {
        navigator(MY_INFO_PW_ABSOLUTE_PATH);
    }

    // event handler: 출석체크 버튼 클릭 이벤트 처리 함수 //
    const naviagateToAttendance = () => {
        navigator(MY_ABSOLUTE_ATTENDANCE_CHECK_PATH);
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

    const performSearch = async (keyword: string) => {
        if (!keyword.trim()) {
            setShowResults(false);
            setSearchResults([]);
            return;
        }

        if (!accessToken) {
            alert('로그인이 필요한 기능입니다.');
            return;
        }

        const response = await searchUsersRequest(keyword, accessToken);

        if (!response || response.code !== 'SU') {
            setSearchResults([]);
            setShowResults(true);
            return;
        }

        if (!('userList' in response)) {
            setSearchResults([]);
            setShowResults(true);
            return;
        }

        // 여기까지 왔으면 response는 GetSearchUserListResponseDto 타입
        setSearchResults(response.userList);
        setShowResults(true);
    };


    // event handler: 검색어 입력 시
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        // 이미 드롭다운이 열려있다면 실시간 필터링 재호출
        if (showResults) {
            performSearch(value);
        }
    };

    // event handler: 검색 input에서 Enter 키 입력
    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            performSearch(searchTerm);
        }
    };

    // event handler: 검색 버튼 클릭
    const onSearchButtonClick = () => {
        performSearch(searchTerm);
    };

    // event handler: 드롭다운 닫기
    const closeDropdown = () => {
        setShowResults(false);
    };

    // event handler: 구독 버튼 클릭 시 (UI만 구현)
    const onSubscribeButtonClick = (userId: string) => {
        alert(`(구독 기능은 아직 미구현), ${userId} 님을(를) 구독합니다`);
    };


    // effect: 컴포넌트 마운트 시 signInUser 확인용 //
    useEffect(() => {
        if(signInUser) {
            setSubscribers(signInUser.subscribers);
        }
    }, [signInUser]);

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
        const userId = getCookie(SELECTED_USER);

        const [id, setId] = useState<string>('');

        // event handler: 상대방 프로필 클릭 이벤트 핸들러 //
        const onProfileClickHandler = () => {
            document.cookie = `selectedUser=${subers.userId}; path=/;`;
            navigator(ANOTHER_USER_PROFILE_ABSOULTE_PATH);
            document.cookie = "yourCookieName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }

        // event handler: 구독 취소 버튼 이벤트 처리 함수 //
        const onSubscribeCancleHandler = (event: MouseEvent<HTMLDivElement>, userId: string) => {
            event.stopPropagation();
            if(!accessToken || !signInUser?.userId) return;
            cancleFollowRequest(signInUser.userId, userId, accessToken).then(cancleFollowResponse);
        }

        // function: 구독 취소 후 응답 처리 함수 //
        const cancleFollowResponse = (responseBody: ResponseDto | null) => {
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
                alert("구독 취소되었습니다.");
                window.location.reload();
            }
    }

        // render: 구독 박스 렌더링 //
        return (
            <div className="subscribe-box" style={{marginBottom: "20px"}}
                onClick={onProfileClickHandler}>
                <div className="subscribe-image" 
                    style={{backgroundImage: `url(${subers.profileImage ? 
                        subers.profileImage : '/defaultProfile.png'})`}}
                ></div>
                <div className="subscribe-user-info">
                    <div className="subscribe-nickname" style={{cursor: "pointer"}}>{subers.nickName}</div>
                    <div className="subscribe-user" style={{cursor: "pointer"}}>@{subers.userId}</div>
                </div>
                <div className="subscribe-cancel-button" 
                    onClick={(event) => onSubscribeCancleHandler(event, subers.userId)}>
                    <div className="subscribe-cancel">구독취소</div>
                </div>
            </div>
        )
    }

    // render: 마이페이지 사이드 바 //
    return (
        <>
            <div className="mypage-left-opstions">
                <div>
                    <aside className="mypage-sidebar">
                        <h3 onClick={navigateToMyPage}>마이페이지</h3>
                        <ul>
                            <li onClick={onChangeInfoClickHandler}><FaUserEdit /> 개인정보 수정</li>
                            <li><FaHistory /> 실시간 토론 참여 이력</li>
                            <li onClick={naviagateToAttendance}><FaCalendarCheck /> 출석체크</li>
                            <li onClick={navigateToMileage}><FaCoins /> 마일리지 관리</li>
                            <li onClick={navigateToAccountManagement}><FaCreditCard /> 계좌 관리</li>
                        </ul>
                    </aside>
                </div>
                <div className="subscribe-wrapper">
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <h2 className="subscribe-title">내가 구독한 사람 {subscribers.length}명</h2>
                        <div className="subscribe-search-box">
                            {/* <input className="input" placeholder="아이디를 입력하세요. " 
                                value={searchWord} onChange={onIdChangeHandler} onKeyDown={handleKeyDown}/> 
                            <div className="button active">검색</div>*/}    
                            <input
                                className="input"
                                placeholder="아이디를 입력하세요. "
                                value={searchTerm}
                                onChange={onInputChange}
                                onKeyDown={onInputKeyDown}
                            />
                            <div className="button active" onClick={onSearchButtonClick}>검색</div>
                        </div>

                        {/* 드롭다운 영역 */}
                        {showResults && (
                            <div className="search-dropdown">
                                <div className="search-dropdown-close" onClick={closeDropdown}>닫기</div>
                                {searchResults.length === 0 ? (
                                    <div className="search-no-result">검색 결과가 없습니다.</div>
                                ) : (
                                    searchResults.map((user) => (
                                        <div className="search-result" key={user.userId}>
                                            <div
                                                className="search-result-image"
                                                style={{ backgroundImage: `url(${user.profileImage || ''})` }}
                                            ></div>
                                            <div className="search-result-text">
                                                <div className="search-result-nickname">{user.nickName}</div>
                                                <div className="search-result-userId">@{user.userId}</div>
                                            </div>
                                            <div
                                                className="search-subscribe-button"
                                                onClick={() => onSubscribeButtonClick(user.userId)}
                                            >
                                                구독
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* 예시: 기존 구독 목록 */}
                        {subscribers.map((sub) => <SmallProfile key={sub.userId} subers={sub}/>)}
                    </div>

                </div>
            </div>
        </>
    );
}
