import React, { useEffect, useState } from 'react'
import './style.css';
import AdminSideBar from '../../../../components/Admin/Sidebar';

export default function Mileage() {

    // state: 신고 타입 상태 //
    const [activeTypes, setActiveTypes] = useState<string | null>(null);
    const [menu, setMenu] = useState<boolean>(false);
    // event handler: 신고 타입 클릭 이벤트 처리  //

    const onAccuseTypeClickHandler = (type: string) => {
        if(type === '|') return;
        setActiveTypes(type === activeTypes ? null : type);
    };

    // event handler: menu 클릭 이벤트 처리 함수 //
    const onMenuButtonHandler = () => {

        setMenu(!menu);
    }

    return (
        <div className="mypage-wrapper">
            <div className="admin-side-wrapper">
                <AdminSideBar/>
            </div>
            <div className="mypage-main-wrapper">
                <div className='accuse-title-box'>
                    <div className="accuse-title">계좌 등록 목록</div>
                </div>
                <div className='accuse-box'>
                    {['대기중', '|','처리 완료'].map((type) => (
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
                    <div className='accuse-th'>계좌번호</div>
                    <div className='accuse-th'>은행명</div>
                    <div className='accuse-th'>아이디</div>
                    <div className='accuse-th'>등록 날짜</div>
                    <div className='accuse-th'>처리 상태</div>
                </div>
                {activeTypes === '대기중' ? <div className='accuse-table'>
                    <div className='accuse-tr'>1</div>
                    <div className='accuse-tr'>1111-112-2223-2323</div>
                    <div className='accuse-tr'>부산은행</div>
                    <div className='accuse-tr'>@normal</div>
                    <div className='accuse-tr'>25.01.01</div>
                    <div className='accuse-tr'>대기중</div>
                </div>
                : activeTypes === '처리 완료' ?
                <div className='accuse-table'>
                    <div className='accuse-tr'>1</div>
                    <div className='accuse-tr'>1111-112-2223-2323</div>
                    <div className='accuse-tr'>부산은행</div>
                    <div className='accuse-tr'>@normal</div>
                    <div className='accuse-tr'>25.01.01</div>
                    <div className='accuse-tr'>대기중</div>
                </div>:''}
                <div className="accuse-title">환전 신청 목록</div>
                <div className='accuse-box complete'>
                    {['대기중', '|' ,'처리 완료'].map((type) => (
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
                    <div className='accuse-th'>지급 계좌</div>
                    <div className='accuse-th'>대상자</div>
                    <div className='accuse-th'>신청날짜</div>
                    <div className='accuse-th'>신청금액</div>
                    <div className='accuse-th'>처리 상태</div>
                </div>
                {activeTypes === '대기중' ? <div className='accuse-table'>
                    <div className='accuse-tr'>1</div>
                    <div className='accuse-tr'>1111-112-2223-2323</div>
                    <div className='accuse-tr'>@normal</div>
                    <div className='accuse-tr'>25.01.01</div>
                    <div className='accuse-tr'>5000원</div>
                    <div className='accuse-tr'>대기중</div>
                </div>
                : activeTypes === '처리 완료' ?
                <div className='accuse-table'>
                    <div className='accuse-tr'>1</div>
                    <div className='accuse-tr'>1111-112-2223-2323</div>
                    <div className='accuse-tr'>@normal</div>
                    <div className='accuse-tr'>25.01.01</div>
                    <div className='accuse-tr'>5000원</div>
                    <div className='accuse-tr'>처리 완료</div>
                </div>:''}
            </div>
        </div>
    )
}
