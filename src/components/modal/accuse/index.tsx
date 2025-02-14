import React, { useState } from 'react'
import './style.css';
import AccuseComponentProps from '../../../types/accuseList.interface';
interface accuseModalProps {
    cancelHandler: ()=>void;
    accuse?: AccuseComponentProps;
}

// component: 신고하기 모달창 컴포넌트 //
export default function AccuseModal({accuse,cancelHandler}:accuseModalProps) {

    const [selectedReportReason, setSelectedReportReason] = useState<string | null>(null);
    const [reportTarget, setReportTarget] = useState<{ type: 'post' | 'comment'; id: number | null }>({ type: 'post', id: null });
    const handleReportSubmit = () => {
        if (!selectedReportReason) {
            alert('신고 사유를 선택해 주세요.');
            return;
        }
        console.log(`${reportTarget.type === 'post' ? '게시글' : '댓글'} ID ${reportTarget.id} 신고 이유: ${selectedReportReason}`);
        cancelHandler();
    };
    return (
        <div>
            <div className="report-modal">
                <div className="report-modal-content">
                    <h3>신고 사유 선택</h3>
                    <div className='report-modal-labels'>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    value="폭력성"
                                    checked={selectedReportReason === '폭력성'}
                                    onChange={(e) => setSelectedReportReason(e.target.value)}
                                />
                                폭력성
                            </label>
                        </div>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    value="선정성"
                                    checked={selectedReportReason === '선정성'}
                                    onChange={(e) => setSelectedReportReason(e.target.value)}
                                />
                                선정성
                            </label>
                        </div>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    value="따돌림 또는 왕따"
                                    checked={selectedReportReason === '따돌림 또는 왕따'}
                                    onChange={(e) => setSelectedReportReason(e.target.value)}
                                />
                                따돌림 또는 왕따
                            </label>
                        </div>
                        <label>
                            <input
                                type="radio"
                                value="도배"
                                checked={selectedReportReason === '도배'}
                                onChange={(e) => setSelectedReportReason(e.target.value)}
                            />
                            도배
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="개인정보 유출"
                                checked={selectedReportReason === '개인정보 유출'}
                                onChange={(e) => setSelectedReportReason(e.target.value)}
                            />
                            개인정보 유출
                        </label>
                    </div>
                    <div className="modal-buttons">
                        <button onClick={cancelHandler}>취소</button>
                        <button onClick={handleReportSubmit}>신고하기</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
