import React, { ChangeEvent, useState } from 'react'
import './style.css';
import { useNavigate } from 'react-router-dom';
import { MY_INFO_UPDATE_ABSOLUTE_PATH } from '../../../../constants';

// component: 비밀번호 확인 화면 컴포넌트 //
export default function PwCheck() {

    // state: 비밀번호 상태 //
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    const [errMsg, setErrMsg] = useState<string>('');

    // event handler: 비밀번호 변경 이벤트 핸들러 //
    const onPWchangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setPassword(value);

        const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,13}$/;
        let isTrue = pattern.test(value);
        if(isTrue) {
            setError(true);
            setErrMsg('');
        }else {
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

    // function: navigator //
    const navigator = useNavigate();

    // render: 비밀번호 확인 화면 렌더링 //
    return (
        <div id='password-check'>
            <div className='mypage-menu'>
                <div className='mypage'>마이페이지</div>
                <div className='menu-box'>
                    <div className='menu' style={{fontWeight: "600"}}>개인정보 수정</div>
                    <div className='menu'>마일리지 관리</div>
                    <div className='menu'>실시간 토론 참여 이력</div>
                    <div className='menu'>출석체크</div> 
                </div>
            </div>

            <div className='background'>
                <div className='title'>개인정보 수정</div>
                <div className='sub-title'>비밀번호 확인</div>
                <div className='pw-check-box'>
                    <input className='pw-check-input' type='password' value={password} 
                    placeholder='비밀번호' onChange={onPWchangeHandler} onKeyDown={handleKeyDown}/>
                    {error ? '' : <div className='errMsg'>{errMsg}</div>}
                </div>
                <div className={error ? 'changeBtn' : 'changeBtn-false'} 
                onClick={error ? onBtnClickHandler : undefined}>개인정보 수정</div>
            </div>
        </div>
    )
}
