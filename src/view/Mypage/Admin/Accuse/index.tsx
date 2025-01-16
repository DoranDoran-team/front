import React, { useState } from 'react'
import './style.css';
import { useNavigate } from 'react-router-dom';
import { ADMIN_ABSOLUTE_ACCUSE_PATH, ADMIN_ABSOLUTE_MILEAGE_PATH, ADMIN_ABSOULTE_PATH } from '../../../../constants';
import AdminSideBar from '../../../../components/Admin/Sidebar';

export default function Accuse() {

    // state: 신고 타입 상태 //
    const [activeTypes, setActiveTypes] = useState<string | null>(null);
    const [menu, setMenu] = useState<boolean>(false);
    const [toggleDown, setToggleDown] = useState<boolean>(false)
    const [sortingState, setSortingState] = useState({
        selected: '정렬순'
    })
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    
    // event handler: 신고 타입 클릭 이벤트 처리  //

    const onAccuseTypeClickHandler = (type: string) => {
        if(type === '|') return;
        setActiveTypes(type === activeTypes ? null : type);
    };


    
    
    // event handler: menu 클릭 이벤트 처리 함수 //
    const onMenuButtonHandler = () => {

        setMenu(!menu);
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

    // event handler: 모달창 오픈 이벤트 처리 함수 //
    const onModalOpenHandler = () => {
        setModalOpen(!modalOpen);
    }

    return (
        <div className="mypage-wrapper">
            <div className="admin-side-wrapper">
                <AdminSideBar/>
            </div>
            <div className="mypage-main-wrapper">
                <div className="user-box">
                    <div className="main-profile"></div>
                    <div className="mypage-info">
                        <div className="mypage-nickname">관리자</div>
                        <div className="mypage-id">@ Admin01</div>
                    </div>
                </div>
                <div className="mypage-state-message">관리자 계정 입니다. </div>
                <div className='accuse-title-box'>
                    <div className="accuse-title">신고 접수 목록</div>
                    <div className="discussion-state-box" onClick={onSortingButtonHandler}>{sortingState.selected}
                        {toggleDown && <div className="state-type-box" >
                            <div className="state-type" onClick={()=>onSortOptionClickHandler('최신순')}>최신순</div>
                            <div className="state-type" onClick={()=>onSortOptionClickHandler('누적 신고순')}>누적 신고순</div>
                        </div>}
                    </div>
                </div>
                <div className='accuse-box'>
                    {['댓글', '|','게시글','|','채팅'].map((type) => (
                        <div
                            key={type}
                            className={`accuse-type ${activeTypes === type ? 'active' : ''}`} 
                            onClick={() => onAccuseTypeClickHandler(type)} 
                        >
                            {type}
                        </div>
                    ))}
                </div>
                <div className='accuse-table'>
                    <div className='accuse-th'>번호</div>
                    <div className='accuse-th'>신고내용</div>
                    <div className='accuse-th'>신고글 작성자</div>
                    <div className='accuse-th'>신고자</div>
                    <div className='accuse-th'>신고 일시</div>
                    <div className='accuse-th'>누적 신고</div>
                    <div className='accuse-th'>신고 사유</div>
                </div>
                {activeTypes === '댓글' ? <div className='accuse-table' onClick={onModalOpenHandler}>
                    <div className='accuse-tr'>1</div>
                    <div className='accuse-tr'>댓글</div>
                    <div className='accuse-tr'>@dorai5</div>
                    <div className='accuse-tr'>@normal</div>
                    <div className='accuse-tr'>25.01.01</div>
                    <div className='accuse-tr'>0</div>
                    <div className='accuse-tr'>부적절한 언어 사용</div>
                </div>
                : activeTypes === '게시글' ?
                <div className='accuse-table'>
                    <div className='accuse-tr'>1</div>
                    <div className='accuse-tr'>게시글</div>
                    <div className='accuse-tr'>@dorai5</div>
                    <div className='accuse-tr'>@normal</div>
                    <div className='accuse-tr'>25.01.01</div>
                    <div className='accuse-tr'>0</div>
                    <div className='accuse-tr'>부적절한 언어 사용</div>
                </div>
                :activeTypes === '채팅' ?
                <div className='accuse-table'>
                    <div className='accuse-tr'>1</div>
                    <div className='accuse-tr'>채팅</div>
                    <div className='accuse-tr'>@dorai5</div>
                    <div className='accuse-tr'>@normal</div>
                    <div className='accuse-tr'>25.01.01</div>
                    <div className='accuse-tr'>0</div>
                    <div className='accuse-tr'>부적절한 언어 사용</div>
                </div>:''}
                <div className='asscuse-title-box'>
                    <div className="accuse-title">처리 완료</div>
                </div>
                <div className='accuse-box complete'>
                    {['댓글', '|','게시글','|','채팅'].map((type) => (
                        <div
                            key={type}
                            className={`accuse-type ${activeTypes === type ? 'active' : ''}`} 
                            onClick={() => onAccuseTypeClickHandler(type)} 
                        >
                            {type}
                        </div>
                    ))}
                </div>
                <div className='accuse-table'>
                    <div className='accuse-th'>번호</div>
                    <div className='accuse-th'>신고내용</div>
                    <div className='accuse-th'>신고글 작성자</div>
                    <div className='accuse-th'>신고자</div>
                    <div className='accuse-th'>신고 일시</div>
                    <div className='accuse-th'>누적 신고</div>
                    <div className='accuse-th'>처리 날짜</div>
                </div>
                {activeTypes === '댓글' ? <div className='accuse-table'>
                    <div className='accuse-tr'>1</div>
                    <div className='accuse-tr'>댓글</div>
                    <div className='accuse-tr'>@dorai5</div>
                    <div className='accuse-tr'>@normal</div>
                    <div className='accuse-tr'>25.01.01</div>
                    <div className='accuse-tr'>1</div>
                    <div className='accuse-tr'>25.01.01</div>
                </div>
                : activeTypes === '게시글' ?
                <div className='accuse-table'>
                    <div className='accuse-tr'>1</div>
                    <div className='accuse-tr'>게시글</div>
                    <div className='accuse-tr'>@dorai5</div>
                    <div className='accuse-tr'>@normal</div>
                    <div className='accuse-tr'>25.01.01</div>
                    <div className='accuse-tr'>1</div>
                    <div className='accuse-tr'>25.01.01</div>
                </div>
                :activeTypes === '채팅' ?
                <div className='accuse-table'>
                    <div className='accuse-tr'>1</div>
                    <div className='accuse-tr'>채팅</div>
                    <div className='accuse-tr'>@dorai5</div>
                    <div className='accuse-tr'>@normal</div>
                    <div className='accuse-tr'>25.01.01</div>
                    <div className='accuse-tr'>1</div>
                    <div className='accuse-tr'>25.01.01</div>

                </div>:''}
            </div>
            {modalOpen && <div className='accuse-modal'>
                <div className='modal-box'>
                    <div className='modal-content'>해당 계정을 처리하시겠습니까?</div>
                    <div className='modal-button-box'>
                        <div className='modal-button'>예</div>
                        <div className='modal-button' onClick={onModalOpenHandler}>아니요</div>
                    </div>
                </div>
            </div>}
            <div className="blacklist-wrapper">
                <div className="blacklist-title">활동 중지 2명</div>
                <div className="subscribe-search-box">
                    <input className="input" placeholder="아이디를 입력하세요. " />
                    <div className="button active">검색</div>
                </div>
                <div className="blacklist-box">
                    <div className="blacklist-image"></div>
                    <div className="blacklist-user-info">
                        <div className="blacklist-nickname">마이멜로디</div>
                        <div className="blacklist-user">@1000JEA</div>
                    </div>
                    <div className="subscribe-cancel-button">
                        <div className="subscribe-cancel">취소</div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}
