import React, { useState } from 'react';
import './style.css';

export default function MypageMileage() {
    const [currentMileage, setCurrentMileage] = useState(5000);
    const [totalEarnedMileage, setTotalEarnedMileage] = useState(10000);
    const [totalRefundedMileage, setTotalRefundedMileage] = useState(3000);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [filterPeriod, setFilterPeriod] = useState<string>('');
    const [refundAmount, setRefundAmount] = useState<number | ''>('');
    const [accountNumber, setAccountNumber] = useState<string>('');
    const [bankName, setBankName] = useState<string>('');

    // 적립 내역 데이터 예시입니다 ~_~
    const initialMileageHistory = [
        { date: '2025-01-01', detail: '실시간 토론 참여', mileage: 500 },
        { date: '2024-12-15', detail: '금주 추천수 1위 토론 게시', mileage: 1000 },
        { date: '2024-12-28', detail: '일반 토론 투표 참여', mileage: 300 },
    ];
    const [mileageHistory, setMileageHistory] = useState(initialMileageHistory); 

    // 환급 내역 상태 예시입니다잉
    const [refundHistory, setRefundHistory] = useState([
        { date: '2025-01-01', amount: 1000, status: '승인 대기' },
        { date: '2025-01-03', amount: 1000, status: '승인 반려' },
        { date: '2025-01-05', amount: 2000, status: '승인 완료' },
    ]);

    const filterMileageHistory = (start: string, end: string) => {
        const filteredData = initialMileageHistory.filter((entry) => {
            const entryDate = new Date(entry.date).getTime();
            const startDateFilter = new Date(start).getTime();
            const endDateFilter = new Date(end).getTime();
            return entryDate >= startDateFilter && entryDate <= endDateFilter;
        });
        setMileageHistory(filteredData);
    };

    const handlePeriodFilter = (period: string) => {
        setFilterPeriod(period);
        const now = new Date();
        let start = '';
        let end = now.toISOString().split('T')[0];

        switch (period) {
            case '오늘':
                start = end;
                break;
            case '1주일':
                start = new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];
                break;
            case '1개월':
                start = new Date(now.setMonth(now.getMonth() - 1)).toISOString().split('T')[0];
                break;
            case '6개월':
                start = new Date(now.setMonth(now.getMonth() - 6)).toISOString().split('T')[0];
                break;
            case '1년':
                start = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString().split('T')[0];
                break;
            default:
                start = '';
        }

        setStartDate(start);
        setEndDate(end);
        if (start && end) filterMileageHistory(start, end);
    };

    const resetFilter = () => {
        setStartDate('');
        setEndDate('');
        setFilterPeriod('');
        setMileageHistory(initialMileageHistory);
    };

    const handleRefund = () => {
        if (refundAmount === '' || refundAmount <= 0 || !accountNumber || !bankName) {
            alert('모든 입력란을 정확히 입력해 주세요.');
            return;
        }
        if (refundAmount > currentMileage) {
            alert('환급 신청 금액이 보유 마일리지를 초과했습니다.');
            return;
        }
        alert(`환급 신청 완료: ${refundAmount}p`);
        setCurrentMileage(currentMileage - refundAmount);
        setTotalRefundedMileage(totalRefundedMileage + refundAmount);
        setRefundHistory((prev) => [
            ...prev,
            { date: new Date().toISOString().split('T')[0], amount: refundAmount, status: '승인 대기' },
        ]);
        setRefundAmount('');
        setAccountNumber('');
        setBankName('');
    };

    return (
        <div id="mypage-mileage">
            <div className="mileage-summary">
                <div className="summary-current">
                    현재 마일리지: <strong>{currentMileage}p</strong>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-details">
                    <div>총 적립 마일리지: <strong>{totalEarnedMileage}p</strong></div>
                    <div>환급 완료 마일리지: <strong>{totalRefundedMileage}p</strong></div>
                </div>
            </div>
            <div className="section-divider"></div>
            {/* 적립 내역 */}
            <div className="mileage-history">
                <h3>적립 내역</h3>
                <div className="filter-controls">
                    <div className="date-filters">
                        <label>조회 기간</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                if (e.target.value && endDate) filterMileageHistory(e.target.value, endDate);
                            }}
                        />
                        <label> ~ </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                if (startDate && e.target.value) filterMileageHistory(startDate, e.target.value);
                            }}
                        />
                    </div>
                    <div className="preset-filters">
                        {['오늘', '1주일', '1개월', '6개월', '1년'].map((period) => (
                            <button
                                key={period}
                                className={`filter-button ${filterPeriod === period ? 'active' : ''}`}
                                onClick={() => handlePeriodFilter(period)}
                            >
                                {period}
                            </button>
                        ))}
                        <button className="filter-reset" onClick={resetFilter}>초기화</button>
                    </div>
                </div>
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>적립 일자</th>
                            <th>상세 내역</th>
                            <th>적립 마일리지</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mileageHistory.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.date}</td>
                                <td>{entry.detail}</td>
                                <td>{entry.mileage}p</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="section-divider"></div>
            {/* 환급 내역 */}
            <div className="refund-history">
                <h3>환급 내역</h3>
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>발생 일자</th>
                            <th>신청 마일리지</th>
                            <th>상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {refundHistory.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.date}</td>
                                <td>{entry.amount}p</td>
                                <td>{entry.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="section-divider"></div>

            <div className="refund-section">
                <h3>환급 신청</h3>
                <div className="refund-info">
                    <div>환급 가능한 마일리지: <strong>{currentMileage}p</strong></div>
                </div>
                <div className="refund-form">
                    <label>환급 신청할 마일리지:</label>
                    <input
                        type="number"
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(Number(e.target.value))}
                        placeholder="금액 입력"
                        min="1"
                    />
                    {refundAmount && (
                        <div className="refund-remaining">
                            환급 후 남는 마일리지: <strong>{currentMileage - refundAmount}p</strong>
                        </div>
                    )}
                    <label>계좌번호:</label>
                    <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="계좌번호 입력"
                    />
                    <label>은행명:</label>
                    <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="은행명 입력"
                    />
                    <button onClick={handleRefund} className="refund-button">환급 신청</button>
                </div>
            </div>
        </div>
    );
}
