import React, { useState } from 'react'
import './style.css';

export default function Admin() {

    // state: 신고 타입 상태 //
    const [activeTypes, setActiveTypes] = useState<string | null>(null);
    // event handler: 신고 타입 클릭 이벤트 처리  //

    const onAccuseTypeClickHandler = (type: string) => {
        setActiveTypes(type === activeTypes ? null : type);
    };


    return (
        <div className="mypage-wrapper">
            <div className="mypage-main-wrapper">
                <div className="user-box">
                    <div className="main-profile"></div>
                    <div className="mypage-info">
                        <div className="mypage-nickname">관리자</div>
                        <div className="mypage-id">@ Admin01</div>
                    </div>
                </div>
                <div className="mypage-state-message">관리자 계정 입니다. </div>
                <div className="mypage-discussion-room">신고 접수 목록</div>
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
                    <div className='accuse-th'>신고 사유</div>
                </div>
                {activeTypes === '댓글' ? <div className='accuse-table'>
                    <div className='accuse-tr'>1</div>
                    <div className='accuse-tr'>댓글</div>
                    <div className='accuse-tr'>@dorai5</div>
                    <div className='accuse-tr'>@normal</div>
                    <div className='accuse-tr'>25.01.01</div>
                    <div className='accuse-tr'>부적절한 언어 사용</div>
                </div>
                : activeTypes === '게시글' ?
                <div className='accuse-table'>
                    <div className='accuse-tr'>1</div>
                    <div className='accuse-tr'>게시글</div>
                    <div className='accuse-tr'>@dorai5</div>
                    <div className='accuse-tr'>@normal</div>
                    <div className='accuse-tr'>25.01.01</div>
                    <div className='accuse-tr'>부적절한 언어 사용</div>
                </div>
                :activeTypes === '채팅' ?
                <div className='accuse-table'>
                    <div className='accuse-tr'>1</div>
                    <div className='accuse-tr'>채팅</div>
                    <div className='accuse-tr'>@dorai5</div>
                    <div className='accuse-tr'>@normal</div>
                    <div className='accuse-tr'>25.01.01</div>
                    <div className='accuse-tr'>부적절한 언어 사용</div>
                </div>:''}
            </div>
            <div className="subscribe-wrapper">
                <div className="subscribe-title">활동 중지 2명</div>
                <div className="subscribe-box">
                    <div className="subscribe-image"></div>
                    <div className="subscribe-user-info">
                        <div className="subscribe-nickname">마이멜로디</div>
                        <div className="subscribe-user">@1000JEA</div>
                    </div>
                    <div className="subscribe-cancel-button">
                        <div className="subscribe-cancel">취소</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
