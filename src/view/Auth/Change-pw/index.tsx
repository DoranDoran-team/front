import React, { ChangeEvent, useState } from 'react'
import './style.css';
import { useNavigate } from 'react-router-dom';
import { LOGIN_ABSOLUTE_PATH } from '../../../constants';

// component: 비밀번호 재설정 화면 컴포넌트 //
export default function ChangePw() {

    // state: 비밀번호 재설정 관련 상태 //
    const [password, setPassword] = useState<string>('');
    const [passwordCheck, setPasswordCheck] = useState<string>('');
    const [isMatched, setIsMatched] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isPossible, setIsPossible] = useState<boolean>(false);

    // event handler: 비밀번호 변경 이벤트 핸들러 //
    const onPasswordChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setPassword(value);

        const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,13}$/;
        let isTrue = pattern.test(value);

        if(isTrue) {
            setIsPossible(true);
            setMessage('');
        }else {
            setIsPossible(false);
            setMessage('영문, 숫자를 혼용하여 8 ~ 13자 입력해주세요.');
        }
    }

    // event handler: 비밀번호 확인 변경 이벤트 핸들러 //
    const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setPasswordCheck(value);

        if(password === value) {
            setIsMatched(true);
            setErrorMessage('');
        }else {
            setIsMatched(false);
            setErrorMessage('비밀번호가 일치하지 않습니다.');
        }
    }

    // event handler: 엔터키로 비밀번호 변경 버튼 동작 //
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onChangeClickHandler();
        }
    }

    // event handler: 비밀번호 변경 버튼 클릭 이벤트 핸들러 //
    const onChangeClickHandler = () => {
        alert('비밀번호가 변경되었습니다.');
        navigator(LOGIN_ABSOLUTE_PATH);
    }

    // function: navigator //
    const navigator = useNavigate();
    
    // render: 비밀번호 재설정 화면 렌더링 //
    return (
        <div className="auth">
            <div className="pic"></div>

            <div id="ChangePW">
                <div className="title">비밀번호 재설정</div>

                <div className="box">
                    <div style={{display:"flex", flexDirection: "column", marginBottom:"10px"}}>
                        <input className="input-box" type='password' value={password} onChange={onPasswordChangeHandler} 
                            placeholder="새로운 비밀번호(영문 + 숫자 혼합 8 ~ 13자)"></input>
                        <div className={isPossible ? 'message-true' : 'message-false'}>{message}</div>
                    </div>
                    
                    <input className="input-box" type='password' value={passwordCheck} onKeyDown={handleKeyDown} 
                    onChange={onPasswordCheckChangeHandler} placeholder="비밀번호 확인"></input>
                    <div className={isMatched ? 'message-true' : 'message-false'}>{errorMessage}</div>
                </div>
                    
                <div className={isMatched ? "login-btn" : "login-btn-false"}
                onClick={isMatched ? onChangeClickHandler : undefined}>비밀번호 변경</div>
                
            </div>
        </div>
    )
}
