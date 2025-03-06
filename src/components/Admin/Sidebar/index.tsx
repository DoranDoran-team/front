import React, { useState } from 'react';
import './style.css';
import { ADMIN_ABSOULTE_PATH, ADMIN_ABSOLUTE_ACCUSE_PATH, ADMIN_ABSOLUTE_MILEAGE_PATH } from '../../../constants';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { searchUsersRequest } from '../../../apis';

export default function AdminSideBar() {
    const [menuIndex, setMenuIndex] = useState<number | null>(null);
    const navigate = useNavigate();
    const [cookies] = useCookies();
    const accessToken = cookies['accessToken'];

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

    // 활동 중지(블랙리스트) 처리 – 추후 기능 구현
    const onSuspendUser = (userId: string) => {
        alert(`(활동 중지 기능 미구현) ${userId} 유저의 활동을 중지합니다.`);
    };

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
                        <div className="search-dropdown-close" onClick={closeDropdown}>
                            닫기
                        </div>
                        {searchResults.length === 0 ? (
                            <div className="search-no-result">검색 결과가 없습니다.</div>
                        ) : (
                            searchResults.map((user: any) => (
                                <div className="search-result" key={user.userId}>
                                    <div
                                        className="search-result-image"
                                        style={{ backgroundImage: `url(${user.profileImage || ''})` }}
                                    ></div>
                                    <div className="search-result-text">
                                        <div className="search-result-nickname">{user.nickName}</div>
                                        <div className="search-result-userId">@{user.userId}</div>
                                    </div>
                                    <div className="search-suspend-button" onClick={() => onSuspendUser(user.userId)}>
                                        활동 중지
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
                <div className="blacklist-box">
                    <div className="blacklist-image"></div>
                    <div className="blacklist-user-info">
                        <div className="blacklist-nickname">사용자이름</div>
                        <div className="blacklist-user">@user123</div>
                    </div>
                    <div className="blacklist-cancel-button">
                        <div className="blacklist-cancel">취소</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
