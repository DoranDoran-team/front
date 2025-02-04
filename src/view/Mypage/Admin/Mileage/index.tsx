import React, {useEffect, useState } from 'react'
import './style.css';
import AdminSideBar from '../../../../components/Admin/Sidebar';
import Modal from '../../../../components/modal';

export default function Mileage() {

    // state: 신고 타입 상태 //
    const [activeTypes, setActiveTypes] = useState<string | null>(null);

    // state: modal 상태 //
    const [accountModalOpen, setAccountModalOpen] = useState<boolean>(false);
    const [mileageModalOpen, setMileageModalOpen] = useState<boolean>(false);
    // event handler: 신고 타입 클릭 이벤트 처리  //

    const onAccuseTypeClickHandler = (type: string) => {
        if(type === '|') return;
        setActiveTypes(type === activeTypes ? null : type);
    };
    useEffect(()=>{
        setActiveTypes('대기중');
    },[])
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
                {activeTypes === '대기중' ? <div className='accuse-table' onClick={()=>setAccountModalOpen(!accountModalOpen)}>
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

                </div>
                <div className='accuse-table'>
                    <div className='accuse-th'>번호</div>
                    <div className='accuse-th'>지급 계좌</div>
                    <div className='accuse-th'>대상자</div>
                    <div className='accuse-th'>신청날짜</div>
                    <div className='accuse-th'>신청금액</div>
                    <div className='accuse-th'>처리 상태</div>
                </div>
                {activeTypes === '대기중' ? <div className='accuse-table' onClick={()=>setMileageModalOpen(!mileageModalOpen)}>
                    <div className='accuse-tr'>1</div>
                    <div className='accuse-tr'>1111-112-2223-2323</div>
                    <div className='accuse-tr'>@normal</div>
                    <div className='accuse-tr'>25.01.01</div>
                    <div className='accuse-tr'>5000원</div>
                    <div className='accuse-tr'>대기중</div>
                </div>
                : activeTypes === '처리 완료' ?
                <div className='accuse-table' >
                    <div className='accuse-tr'>1</div>
                    <div className='accuse-tr'>1111-112-2223-2323</div>
                    <div className='accuse-tr'>@normal</div>
                    <div className='accuse-tr'>25.01.01</div>
                    <div className='accuse-tr'>5000원</div>
                    <div className='accuse-tr'>처리 완료</div>
                </div>:''}
            </div>
            {accountModalOpen&& <Modal content='해당 계정의 계좌를 승인하시겠습니까?' lt_btn='아니요' rt_btn='예' rt_handler={()=>setAccountModalOpen(!accountModalOpen)} lt_handler={()=>setAccountModalOpen(!accountModalOpen)}/>}
            {mileageModalOpen&& <Modal content='해당 계정의 환전을 승인하시겠습니까?' lt_btn='아니요' rt_btn='예' rt_handler={()=>setMileageModalOpen(!mileageModalOpen)} lt_handler={()=>setMileageModalOpen(!mileageModalOpen)}/>}    
        </div>
    )
}
