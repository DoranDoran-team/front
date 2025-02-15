import React, { useEffect, useState } from 'react'
import './style.css';
import AdminSideBar from '../../../../components/Admin/Sidebar';
import Modal from '../../../../components/modal';
import { useCookies } from 'react-cookie';
import { refundRequest } from '../../../../apis';

export default function Mileage() {
    const [cookies] = useCookies();
    const accessToken = cookies.accessToken;

    // state: 신고 타입 상태 //
    const [activeTypes, setActiveTypes] = useState<string | null>(null);

    // state: modal 상태 //
    const [accountModalOpen, setAccountModalOpen] = useState<boolean>(false);
    const [mileageModalOpen, setMileageModalOpen] = useState<boolean>(false);

    const [currentMileage, setCurrentMileage] = useState(5000);
    const [refundAmount, setRefundAmount] = useState<number | ''>('');
    const [accountNumber, setAccountNumber] = useState<string>('');
    const [bankName, setBankName] = useState<string>('');

    // event handler: 신고 타입 클릭 이벤트 처리  //

    const onAccuseTypeClickHandler = (type: string) => {
        if (type === '|') return;
        setActiveTypes(type === activeTypes ? null : type);
    };
    useEffect(() => {
        setActiveTypes('대기중');
    }, [])

    const handleSendMileage = async () => {
        if (refundAmount === '' || refundAmount <= 0 || !accountNumber || !bankName) {
            alert('모든 입력란을 정확히 입력해 주세요.');
            return;
        }
        if (refundAmount > currentMileage) {
            alert('환급 신청 금액이 보유 마일리지를 초과했습니다.');
            return;
        }

        if (!accessToken) {
            alert('로그인 정보가 없습니다. 다시 로그인 해주세요.');
            return;
        }

        const requestBody = {
            accountNumber,
            bankName,
            amount: refundAmount,
        };

        const response = await refundRequest(requestBody, accessToken);

        if (response && response.code === "SU") {
            alert(`마일리지 지급 완료: ${refundAmount}p`);
            setCurrentMileage(currentMileage - refundAmount);
        } else {
            alert('지급에 실패했습니다. 다시 시도해 주세요.');
        }

    };

    return (
        <div id="admin-mypage-wrapper">
            <div className="admin-side-wrapper">
                <AdminSideBar />
            </div>
            <div className='send-mileage-box'>
                <div className='send-mileage'>
                    <div className="accuse-title">마일리지 지급</div>
                    <div className="input-box">
                        <div>
                            <label>사용자 아이디</label>
                            <input
                                type="string"
                                placeholder="마일리지를 지급 사용자 아이디"
                            />
                        </div>
                        <div>
                            <label>금액</label>
                            <input
                                type="number"
                                placeholder="금액 입력"
                                min="1"
                            />
                        </div>
                        <div>
                            <label>지급 사유</label>
                            <input
                                type="string"
                                placeholder="지급 사유 작성"
                            />
                        </div>
                        <div className='send-mileage-button-box'>
                        <button onClick={handleSendMileage} className="send-mileage-button">마일리지 지급</button>
                        </div>
                    </div>
                </div>
                <div className="mypage-main-wrapper">
                    <div className="accuse-title">환전 신청 목록</div>
                    <div className='accuse-box'>
                        {['대기중', '|', '처리 완료'].map((type) => (
                            <div
                                key={type}
                                className={`accuse-type ${activeTypes === type ? 'active' : ''}`}
                                onClick={() => onAccuseTypeClickHandler(type)}
                            >
                                {type}
                            </div>
                        ))}
                    </div>
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
                    {activeTypes === '대기중' ? <div className='accuse-table' onClick={() => setMileageModalOpen(!mileageModalOpen)}>
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
                            </div> : ''}
                </div>
            </div>
            {accountModalOpen && <Modal content='해당 계정의 계좌를 승인하시겠습니까?' lt_btn='아니요' rt_btn='예' rt_handler={() => setAccountModalOpen(!accountModalOpen)} lt_handler={() => setAccountModalOpen(!accountModalOpen)} />}
            {mileageModalOpen && <Modal content='해당 계정의 환전을 승인하시겠습니까?' lt_btn='아니요' rt_btn='예' rt_handler={() => setMileageModalOpen(!mileageModalOpen)} lt_handler={() => setMileageModalOpen(!mileageModalOpen)} />}
        </div>
    )
}
