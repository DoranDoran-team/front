import React, { ChangeEvent, useState } from 'react'
import './style.css';
import { useNavigate } from 'react-router-dom';
import { MY_ABSOLUTE_MILEAGE_PATH, MY_INFO_PW_ABSOLUTE_PATH, MY_INFO_UPDATE_ABSOLUTE_PATH } from '../../../../constants';
import { FaUserEdit, FaCoins, FaHistory, FaCalendarCheck } from "react-icons/fa";

// component: 비밀번호 확인 화면 컴포넌트 //
export default function PwCheck() {

    // state: 비밀번호 상태 //
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    const [errMsg, setErrMsg] = useState<string>('');
    const [editbutton, setEditButton] = useState<boolean>(false);

    // event handler: 비밀번호 변경 이벤트 핸들러 //
    const onPWchangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPassword(value);

        const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,13}$/;
        let isTrue = pattern.test(value);
        if (isTrue) {
            setError(true);
            setErrMsg('');
        } else {
            setError(false);
            setErrMsg('영문, 숫자를 혼용하여 8 ~ 13자 입력해주세요.');
        }
    }

    // event handler: 엔터키로 로그인 버튼 동작 //
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onBtnClickHandler();
        }
    }

    // event handler: 개인정보 관리 버튼 클릭 이벤트 핸들러 //
    const onBtnClickHandler = () => {
        navigator(MY_INFO_UPDATE_ABSOLUTE_PATH('qwer1234'));
    }

    // event handler: 게시물 메뉴 버튼 클릭 이벤트 처리 함수 //
    const onPostMenuButtonHandler = () => {
        setEditButton(!editbutton);
    }

    const navigateToMileage = () => {
        navigator(MY_ABSOLUTE_MILEAGE_PATH);
    };

    // event handler: 개인 정보 수정 버튼 클릭 이벤트 핸들러 //
    const onChangeInfoClickHandler = () => {
        navigator(MY_INFO_PW_ABSOLUTE_PATH('qwer1234'));
    }


    // function: navigator //
    const navigator = useNavigate();

    // render: 비밀번호 확인 화면 렌더링 //
    return (
        <div id='password-check'>
            <div className='mypage-menu'>
                <div className="mypage-left-opstions">
                    <aside className="mypage-sidebar">
                        <h2>마이페이지</h2>
                        <ul>
                            <li onClick={onChangeInfoClickHandler}><FaUserEdit /> 개인정보 수정</li>
                            <li onClick={navigateToMileage}><FaCoins /> 마일리지 관리</li>
                            <li><FaHistory /> 실시간 토론 참여 이력</li>
                            <li><FaCalendarCheck /> 출석체크</li>
                        </ul>
                    </aside>
                    <div className="subscribe-wrapper">
                        <div>
                            <h2 className="subscribe-title">내가 구독한 사람 2명</h2>
                            <div className="subscribe-search-box">
                                <input className="input" placeholder="아이디를 입력하세요. " />
                                <div className="button active">검색</div>
                            </div>
                            <div className="subscribe-box">
                                <div className="subscribe-image"></div>
                                <div className="subscribe-user-info">
                                    <div className="subscribe-nickname">마이멜로디</div>
                                    <div className="subscribe-user">@1000JEA</div>
                                </div>
                                <div className="subscribe-cancel-button">
                                    <div className="subscribe-cancel">구독취소</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='background'>
                <div className='title'>개인정보 수정</div>
                <div className='sub-title'>비밀번호 확인</div>
                <div className='pw-check-box'>
                    <input className='pw-check-input' type='password' value={password}
                        placeholder='비밀번호' onChange={onPWchangeHandler} onKeyDown={handleKeyDown} />
                    {error ? '' : <div className='errMsg'>{errMsg}</div>}
                </div>
                <div className={error ? 'changeBtn' : 'changeBtn-false'}
                    onClick={error ? onBtnClickHandler : undefined}>개인정보 수정</div>
            </div>
        </div>
    )
}
