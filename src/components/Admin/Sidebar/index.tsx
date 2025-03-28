import React, { MouseEvent, useEffect, useState } from 'react';
import './style.css';
import { ADMIN_ABSOULTE_PATH, ADMIN_ABSOLUTE_ACCUSE_PATH, ADMIN_ABSOLUTE_MILEAGE_PATH, ANOTHER_USER_PROFILE_ABSOULTE_PATH, ACCESS_TOKEN, MAIN_ABSOLUTE_PATH } from '../../../constants';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { cancelBlackListRequest, getBlackListRequest, searchUsersRequest, setBlackListRequest } from '../../../apis';
import { useSignInUserStore } from '../../../stores';
import BlackList from '../../../types/blackList.interface';
import GetBlackListResponseDto from '../../../apis/dto/response/accuse/get-black-list.response.dto';
import ResponseDto from '../../../apis/dto/response/response.dto';
import { PatchBlackListRequestDto } from '../../../apis/dto/request/accuse';

interface BlackListProps {
    black: BlackList
}

export default function AdminSideBar() {
    const [menuIndex, setMenuIndex] = useState<number | null>(null);
    const navigate = useNavigate();
    const [cookies] = useCookies();
    const accessToken = cookies['accessToken'];
    const { signInUser, setSignInUser } = useSignInUserStore();
    const [blackList, setBlackList] = useState<BlackList[]>([]);

    const goToAdminHome = () => navigate(ADMIN_ABSOULTE_PATH);
    const goToRTManagement = () => navigate(ADMIN_ABSOULTE_PATH);
    const goToAccuseManagement = () => navigate(ADMIN_ABSOLUTE_ACCUSE_PATH);
    const goToMileageManagement = () => navigate(ADMIN_ABSOLUTE_MILEAGE_PATH);

    const menuItems = [
        { label: '실시간 토론방 관리', onClick: goToRTManagement },
        { label: '신고 관리', onClick: goToAccuseManagement },
        { label: '마일리지 관리', onClick: goToMileageManagement },
    ];

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showResults, setShowResults] = useState<boolean>(false);

    const navigator = useNavigate();

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
        try {
            const response = await searchUsersRequest(keyword, accessToken);
            if (!response || response.code !== 'SU' || !('userList' in response)) {
                setSearchResults([]);
            } else {
                setSearchResults(response.userList);
            }
        } catch (error) {
            console.error(error);
            setSearchResults([]);
        }
        setShowResults(true);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const onSearchButtonClick = () => {
        performSearch(searchTerm);
    };

    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') performSearch(searchTerm);
    };

    const closeDropdown = () => {
        setShowResults(false);
    };

    // event handler: 게시글 작성자 프로필 클릭 이벤트 처리 //
    const onProfileClickHandler = (event: MouseEvent<HTMLDivElement>, userId: string) => {
        event.stopPropagation();
        document.cookie = `selectedUser=${userId}; path=/;`;
        navigator(ANOTHER_USER_PROFILE_ABSOULTE_PATH);
        document.cookie = "yourCookieName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    // event handler: 활동 중지(블랙리스트) 처리 //
    const onSuspendUser = (event: MouseEvent<HTMLDivElement>, userId: string) => {
        event.stopPropagation();
        if(!accessToken) return;
            const requestBody: PatchBlackListRequestDto =  {
                userId: userId
            }
        setBlackListRequest(requestBody, accessToken).then(setBlackListResponse);
    };

    // 일반 유저 아이디 검색, 관리자 아이디 걸러내기
    const filteredResults = searchResults.filter(user => !user.role);

    // function: 활동 중지 리스트 가져오기 처리 함수 //
    const getBlackListResponse = (responseBody: GetBlackListResponseDto | ResponseDto | null) => {
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
            const {blackLists} = responseBody as GetBlackListResponseDto;
            setBlackList(blackLists);
        }
    }

    // function: 활동 중지 설정 응답 처리 //
    const setBlackListResponse = (responseBody: ResponseDto | null) => {
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
            alert(`활동 중지 처리 완료.`);
            window.location.reload();
        }
    }

    // component: 활동 중지 리스트 컴포넌트 //
    function BlackList({black}: BlackListProps) {

        // state: //
        const accessToken = cookies[ACCESS_TOKEN];

        // event handler: 프로필 클릭 이벤트 핸들러 //
        const onProfileClickHandler = () => {
            document.cookie = `selectedUser=${black.userId}; path=/;`;
            navigator(ANOTHER_USER_PROFILE_ABSOULTE_PATH);
            document.cookie = "yourCookieName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
        
        // event handler: 취소 버튼 클릭 이벤트 핸들러 //
        const onCancleClickHandler = (event: MouseEvent<HTMLDivElement>) => {
            event.stopPropagation();
            if(!accessToken) return;
            const requestBody: PatchBlackListRequestDto =  {
                userId: black.userId
            }
            cancelBlackListRequest(requestBody, accessToken).then(cancelBlackListResponse);
        }

        // function: 활동 중지 취소 처리 함수 //
        const cancelBlackListResponse = (responseBody: ResponseDto | null) => {
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
                alert("활동 중지 취소되었습니다.");
                window.location.reload();
            }
        }

        // render: //
        return (
            <div className="blacklist-box" onClick={onProfileClickHandler}>
                <div className="blacklist-image"
                    style={{ backgroundImage: `url(${black.profileImage || '/public/mypage/profile1.png'})` }}></div>
                <div className="blacklist-user-info">
                    <div className="blacklist-nickname">{black.nickName}</div>
                    <div className="blacklist-user">@{black.userId}</div>
                </div>
                <div className="blacklist-cancel-button">
                    <div className="blacklist-cancel" onClick={onCancleClickHandler}>취소</div>
                </div>
            </div>
        )
    }

    // effect: 블랙 리스트 가져오기 //
    useEffect(() => {
        if(signInUser) {
            if(!signInUser.role) {
                alert('접근권한이 없습니다.');
                navigator(MAIN_ABSOLUTE_PATH);
            }else {
                getBlackListRequest(accessToken).then(getBlackListResponse);
            }
        }
    }, [signInUser]);

    // render: 관리자 마이페이지 사이드바 렌더링 //
    return (
        <div className="admin-sidebar-container">
            <aside className="admin-sidebar">
                <h3 onClick={goToAdminHome}>관리자 페이지</h3>
                <ul>
                    {menuItems.map((item, index) => (
                        <li
                            key={index}
                            className={menuIndex === index ? 'active' : ''}
                            onClick={() => {
                                setMenuIndex(index);
                                item.onClick();
                            }}
                        >
                            {item.label}
                        </li>
                    ))}
                </ul>
            </aside>
            <div className="blacklist-wrapper">
                <h3>활동 중지</h3>
                <div className="blacklist-search-box">
                    <input
                        className="input"
                        placeholder="아이디를 입력하세요."
                        value={searchTerm}
                        onChange={onInputChange}
                        onKeyDown={onInputKeyDown}
                    />
                    <div className="button active" onClick={onSearchButtonClick}>
                        검색
                    </div>
                </div>
                {showResults && (
                    <div className="search-dropdown">
                        <div className="search-dropdown-close" onClick={closeDropdown}>닫기</div>
                        {filteredResults.length === 0 ? (
                                <div className="search-no-result">검색 결과가 없습니다.</div>
                            ) : (
                                filteredResults.map((user) => (
                                    <div className="search-result" key={user.userId} 
                                        onClick={(event) => onProfileClickHandler(event, user.userId)}>
                                        <div className="search-result-image"
                                            style={{ backgroundImage: `url(${user.profileImage || ''})` }}></div>
                                        <div className="search-result-text">
                                            <div className="search-result-nickname">{user.nickName}</div>
                                            <div className="search-result-userId">@{user.userId}</div>
                                        </div>
                                        <div className="search-suspend-button" onClick={(event) => onSuspendUser(event, user.userId)}>
                                            활동 중지</div>
                                    </div>
                                ))
                            )}
                    </div>
                )}
                {blackList.map((black) => <BlackList key={black.userId} black={black}/>)}
            </div>
        </div>
    );
}
