import React, {  useState } from 'react'
import './style.css';
import { useNavigate } from 'react-router-dom';
import { ADMIN_ABSOLUTE_ACCUSE_PATH, ADMIN_ABSOLUTE_MILEAGE_PATH, ADMIN_ACCUSE_PATH, ADMIN_MILEAGE_PATH } from '../../../constants';
import AdminSideBar from '../../../components/Admin/Sidebar';

export default function Admin() {

    // state: 관리자 마이페이지 상태 //
    const [menu, setMenu] = useState<boolean>(false);
    const [state] = useState<boolean>(false);
    const [editbutton, setEditButton] = useState<boolean>(false);
    const [toggleDown, setToggleDown] = useState<boolean>(false)
        const [sortingState, setSortingState] = useState({
            selected: '정렬순'
        })

    // function: 네비게이터 함수 처리 //
    const navigator = useNavigate();

    // event handler: menu 클릭 이벤트 처리 함수 //
    const onMenuButtonHandler = () => {

        setMenu(!menu);
    }

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
    const onSortOptionClickHandler = (option:string) => {
        setSortingState({
            selected: option,
        })
        setToggleDown(!toggleDown)
    }
    // event handler: 메뉴 아이템 클릭 이벤트 처리 함수 //
    const onAsscuseButtonHandler = () => {
        navigator(ADMIN_ABSOLUTE_ACCUSE_PATH)
    }

    const onMileageButtonHandler = () => {
        navigator(ADMIN_ABSOLUTE_MILEAGE_PATH)
    }
    return (
        <div className="mypage-wrapper">
            <div className="admin-side-wrapper">
                            <AdminSideBar/>
                        </div>
            <div className="mypage-main-wrapper">
            <div className="top-icon-box">
                    <div className="top-icons">
                        <div className="top-icon-menu" onClick={onMenuButtonHandler}>
                            {menu && (<div className='menu-list' >
                                <div className="menu-item" onClick={onMileageButtonHandler}>마일리지 관리</div>
                                <div className="menu-item" onClick={onAsscuseButtonHandler}>신고 관리</div>
                            </div>)}
                        </div>
                    </div>
                </div>
                <div className="user-box">
                    <div className="main-profile"></div>
                    <div className="mypage-info">
                        <div className="mypage-nickname">관리자</div>
                        <div className="mypage-id">@ Admin01</div>
                    </div>
                </div>
                <div className="mypage-state-message">관리자 계정 입니다. </div>
                <div className="mypage-discussion-room-top">
                    <div className="mypage-discussion-room">실시간 토론방 현황</div>
                    <div className="discussion-state-box" onClick={onSortingButtonHandler}>{sortingState.selected}
                        {toggleDown && <div className="state-type-box" >
                            <div className="state-type" onClick={()=>onSortOptionClickHandler('진행중')}>진행중</div>
                            <div className="state-type" onClick={()=>onSortOptionClickHandler('마감')}>마감</div>
                        </div>}
                    </div>
                </div>
                {sortingState.selected === '진행중' ? <div className="discussion-room-list">
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
                                {state ? <div className="discussion-state-box continue">
                                    <div className="discussion-state ">진행중</div>
                                </div> :
                                    <div className="discussion-state-box end">
                                        <div className="discussion-state ">마감</div>
                                    </div>
                                }
                            </div>
                            <div className="discussion-icons">
                                <div className="discussion-participants-icon"></div>
                                <div className="discussion-comment">6</div>
                            </div>
                        </div>
                    </div>
                </div>:
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
                                <div className="discussion-participants-icon"></div>
                                <div className="discussion-comment">6</div>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    )
}
