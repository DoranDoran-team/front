import React, { useEffect, useRef, useState } from 'react'
import './style.css';
import AdminSideBar from '../../../components/Admin/Sidebar';
import { useSignInUserStore } from '../../../stores';
import { useNavigate } from 'react-router-dom';
import { MAIN_ABSOLUTE_PATH } from '../../../constants';

export default function Admin() {

    // variable: 기본 이미지 URL //
    const defaultProfileImageUrl = 'http://localhost:3000/defaultProfile.png';

    const navigator = useNavigate();

    // state: 로그인 유저 정보 상태 //
    const { signInUser, setSignInUser } = useSignInUserStore();

    // state: 관리자 마이페이지 상태 //
    const [editbutton, setEditButton] = useState<boolean>(false);
    const [toggleDown, setToggleDown] = useState<boolean>(false)
    const [sortingState, setSortingState] = useState({
        selected: '정렬순'
    })
    const [profileUrl, setProfileUrl] = useState<string>('');

    // state: 정렬 상태 //
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [stateType, setStateType] = useState<string>("진행 중");

    // event handler: 게시물 메뉴 버튼 클릭 이벤트 처리 함수 //
    const onPostMenuButtonHandler = () => {
        setEditButton(!editbutton);
    }

    // event handler: 정렬 메뉴 버튼 이벤트 처리 함수 //
    const onSortingButtonHandler = () => {
        setToggleDown(!toggleDown);
        setSortingState((prevState) => ({
            ...prevState
        }));

    };
    // event handler: 정렬 메뉴 아이템 클릭 이벤트 처리 함수 //
    const onSortOptionClickHandler = (option: string) => {
        setSortingState({
            selected: option,

        })
        setToggleDown(!toggleDown)
    }

    // event handler: 엔터키로 검색 버튼 동작 //
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onSearchClickHandler();
        }
    }

    // event handler: 검색 버튼 클릭 핸들러 //
    const onSearchClickHandler = () => {

    }

    // event handler: 토론방 상태 클릭 이벤트 처리 함수 //
    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    // event handler: 토론방 상태 클릭 이벤트 처리 //
    const onStateTypeSelect = (type: string) => {
        setStateType(type);
        setIsDropdownOpen(false); // 선택 후 닫기
    };

    // effect: //
    useEffect(() => {
        if(signInUser) {
            if(signInUser.profileImage === null) setProfileUrl(defaultProfileImageUrl);
            else setProfileUrl(signInUser?.profileImage);
        }
    }, [signInUser]);

    // effect: //
    useEffect(() => {
        const handleClickOutside = (event: globalThis.MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        
        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    // effect: 일반 사용자 관리자 마이페이지 이동 막기 //
    useEffect(() => {
        if(!signInUser?.role) {
            alert('접근권한이 없습니다.');
            navigator(MAIN_ABSOLUTE_PATH);
        }
    }, [signInUser]);
    
    return (
        <div className="mypage-wrapper">
            <div className="admin-side-wrapper">
                <AdminSideBar />
            </div>
            <div className="mypage-main-wrapper">
                <div className="top-icon-box">
                    <div className="top-icons"></div>
                </div>
                <div className="user-box">
                    <div className="main-profile" style={{ backgroundImage: `url(${profileUrl})` }}></div>
                    <div className="mypage-info">
                        <div className="mypage-nickname">{signInUser?.name} - 관리자</div>
                        <div className="mypage-id">@ {signInUser?.userId}</div>
                        <div className="mypage-state-message" style={{marginTop: "20px"}}>관리자 계정 입니다. </div>
                    </div>
                </div>
                
                <div className="mypage-discussion-room-top">
                    <div className="mypage-discussion-room">실시간 토론방 현황
                        <div className='search-bar'>
                            <div className="magnifier-and-search-input">
                                <input type="text" className="search-input" placeholder="검색어를 입력해주세요." 
                                        onKeyDown={handleKeyDown}/>
                                <div className='mypage-magnifier' onClick={onSearchClickHandler}></div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="discussion-state-box" ref={dropdownRef}>
                        <div className="selected-state" onClick={toggleDropdown}>{stateType} ▼</div>  
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-item" onClick={() => onStateTypeSelect("진행 중")}>진행 중</div>
                                <div className="dropdown-item" onClick={() => onStateTypeSelect("마감")}>마감</div>
                            </div>
                        )}
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
                                <div className={`discussion-state-box ${sortingState.selected === '진행중' ? 'continue' : sortingState.selected === '마감' ? 'end' : 'continue'}`}>
                                    <div className="discussion-state ">{sortingState.selected === '진행중' ? '진행중' : sortingState.selected === '마감' ? '마감' : '진행중'}</div>
                                </div>
                            </div>
                            <div className="discussion-icons">
                                <div className="discussion-participants-icon"></div>
                                <div className="discussion-comment">6</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
