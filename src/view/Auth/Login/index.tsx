import React, { ChangeEvent, useState } from "react";
import './style.css';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { FIND_ID_ABSOLUTE_PATH, FIND_PW_ABSOLUTE_PATH, MAIN_ABSOLUTE_PATH, SIGN_UP_ABSOLUTE_PATH } from "../../../constants";

// component: 로그인 화면 컴포넌트 //
export default function Login() {

    // state: 쿠키 상태 //
    const [cookies, setCookies] = useCookies();

    // state: 로그인 입력 정보 상태 //
    const [id, setId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [error, setErrorBool] = useState<boolean>(false);

    // variable: 임시 아이디, 비밀번호
    const id_exam = 'qwer1234';
    const pw_exam = 'qwer1234';

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // event handler: 아이디 변경 이벤트 핸들러 //
    const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setId(value);
    }

    // event handler: 비밀번호 번경 이벤트 핸들러 //
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPassword(value);
    }

    // event handler: 엔터키로 로그인 버튼 동작 //
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onLoginClickHandler();
        }
    }

    // event handler: 로그인 버튼 클릭 이벤트 핸들러 //
    const onLoginClickHandler = () => {
        if (!id || !password) {
            alert('아이디와 비밀번호를 모두 입력하세요.');
            return;
        }

        // const requestBody: SignInRequestDto = {
        //     userId: id,
        //     password
        // };

        // signInRequest(requestBody).then(signInResponse);

        if(id !== id_exam || password !== pw_exam) {
            setErrorBool(false);
            setMessage('로그인 정보가 일치하지 않습니다.');
        }

        if(id === id_exam && password === pw_exam) {
            navigator(MAIN_ABSOLUTE_PATH);
        }

        setId('');
        setPassword('');
    }

    // event handler: 아이디 찾기 클릭 이벤트 핸들러 //
    const findIDclickHandler = () => {
        navigator(FIND_ID_ABSOLUTE_PATH);
    }

    // event handler: 비밀번호 찾기 클릭 이벤트 핸들러 //
    const findPWclickHandler = () => {
        navigator(FIND_PW_ABSOLUTE_PATH);
    }

    // event handler: 회원가입 클릭 이벤트 핸들러 //
    const signUpClickHandler = () => {
        navigator(SIGN_UP_ABSOLUTE_PATH);
    }

    // render: 로그인 화면 렌더링 //
    return (
        <div className="auth">
            <div className="pic"></div>

            <div id="Login">
                <div className="title">로그인</div>

                <div className="box">
                    <input className="input-box" value={id} onChange={onIdChangeHandler} placeholder="아이디"></input>
                    <input className="input-box" type='password' value={password} onKeyDown={handleKeyDown} 
                    onChange={onPasswordChangeHandler} placeholder="비밀번호"></input>
                    <div className={error ? 'message-true' : 'message-false'}>{message}</div>
                </div>
                    
                <div className={(id && password) || error ? "login-btn" : "login-btn-false"}
                onClick={(id && password) || error ? onLoginClickHandler : undefined}>로그인</div>
                <hr className="hr"></hr>

                <div className="auth-menu">
                    <div className="find" onClick={findIDclickHandler}>아이디 찾기</div>
                    <div>|</div>
                    <div className="find" onClick={findPWclickHandler}>비밀번호 찾기</div>
                    <div>|</div>
                    <div className="find" onClick={signUpClickHandler}>회원가입</div>
                </div>
                
                <div className="sns-container">
                    <div className="kakao"></div>
                    <div className="google"></div>
                    <div className="naver"></div>
                </div>

            </div>
        </div>
    )
}