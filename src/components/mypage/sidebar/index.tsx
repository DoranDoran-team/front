import React, { useEffect, useState } from "react";
import './style.css';
import { useLocation, useNavigate } from "react-router-dom";

import { MY_ABSOLUTE_ACCOUNT_MANAGEMENT_PATH, MY_ABSOLUTE_ATTENDANCE_CHECK_PATH, MY_ABSOLUTE_MILEAGE_PATH, MY_ABSOLUTE_PATH, MY_INFO_PW_ABSOLUTE_PATH } from "../../../constants";
import { FaUserEdit, FaCoins, FaHistory, FaCalendarCheck, FaCreditCard } from "react-icons/fa";
import { useSignInUserStore } from "../../../stores";
import { useCookies } from "react-cookie";

import { searchUsersRequest } from "../../../apis";
import GetSearchUserListResponseDto, { SearchUserData } from "../../../apis/dto/response/user/get-search-user-list.response.dto";

export default function MypageSidebar() {

    // state: 로그인 유저 정보 상태 //
    const { signInUser, setSignInUser } = useSignInUserStore();

    // state: 마이페이지 상태 //
    const [subscribe, setSubscribe] = useState<boolean>(false);
    const [user] = useState<boolean>(false);

    // variable: 자기자신 확인 //
    const isUser = user && true;

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
        navigator(MY_INFO_PW_ABSOLUTE_PATH('qwer1234'));
    };

    // event handler: 출석체크 버튼 클릭 이벤트 처리 함수 //
    const naviagateToAttendance = () => {
        navigator(MY_ABSOLUTE_ATTENDANCE_CHECK_PATH);
    };

    // effect: 컴포넌트 마운트 시 signInUser 확인용 //
    useEffect(() => {
        console.log(signInUser);
    }, [signInUser]);

    // state: 검색어, 검색 결과, 드롭다운 열림 여부
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<SearchUserData[]>([]);
    const [showResults, setShowResults] = useState<boolean>(false);

    // event handler: 검색어 입력 시
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        // 이미 드롭다운이 열려있다면 실시간 필터링 재호출
        if (showResults) {
            performSearch(value);
        }
    };

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

    // event handler: 검색 버튼 클릭
    const onSearchButtonClick = () => {
        performSearch(searchTerm);
    };

    // event handler: 검색 input에서 Enter 키 입력
    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            performSearch(searchTerm);
        }
    };

    // event handler: 드롭다운 닫기
    const closeDropdown = () => {
        setShowResults(false);
    };

    // event handler: 구독 버튼 클릭 시 (UI만 구현)
    const onSubscribeButtonClick = (userId: string) => {
        alert(`(구독 기능은 아직 미구현), ${userId} 님을(를) 구독합니다`);
    };


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
                    <div>
                        <h3 className="subscribe-title">내가 구독한 사람 2명</h3>
                        <div className="subscribe-search-box">
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
        </>
    );
}
