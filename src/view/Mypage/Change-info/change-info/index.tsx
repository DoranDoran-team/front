import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import './style.css'
import { useNavigate } from 'react-router-dom';
import { MY_ABSOLUTE_PATH } from '../../../../constants';

// component: 개인정보 수정 화면 컴포넌트 //
export default function ChangeInfo() {

    // state: 회원가입 관련 상태 //
    const [name, setName] = useState<string>('');
    const [birth, setBirth] = useState<string>('');
    const [birthMessage, setBirthMessage] = useState<string>('');
    const [birthMsgBool, setBirthMsgBool] = useState<boolean>(false);
    const [telNumber, setTelNumber] = useState<string>('');
    const [authNumber, setAuthNumber] = useState<string>('');
    const [error, setErrorBool] = useState<boolean>(false);
    const [authMessage, setAuthMessage] = useState<string>('');
    const [send, setSend] = useState<boolean>(true);
    const [isMatched, setIsMatched] = useState<boolean>(false);
    const [pwIsMatched, setPwIsMatched] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [passwordCheck, setPasswordCheck] = useState<string>('');
    const [isPossible, setIsPossible] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    // state: 타이머 상태 //
    const [timer, setTimer] = useState(5);

    // state: 타이머를 멈출 상태 추가
    const [stopTimer, setStopTimer] = useState(false);

    // state: 비밀번호 변경 모달창 상태 //
    const [open, setOpen] = useState<boolean>(false);

    // variable: 임시 변수 //
    const authNumber_exam = '123456';

    // event handler: 이름 변경 이벤트 핸들러 //
    const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setName(value);
    }

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
            setPwIsMatched(true);
            setErrorMessage('');
        }else {
            setPwIsMatched(false);
            setErrorMessage('비밀번호가 일치하지 않습니다.');
        }
    }

    // event handler: 생년월일 변경 이벤트 핸들러 //
    const onBirthChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setBirth(value);

        if (value.length === 8) {
            const year = parseInt(value.substring(0, 4), 10);
            const month = parseInt(value.substring(4, 6), 10) - 1; // 월은 0부터 시작
            const day = parseInt(value.substring(6, 8), 10);

            const inputDate = new Date(year, month, day);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // 오늘의 시간 초기화

            if (inputDate > today) {
                setBirthMessage('일치하지 않는 형식입니다.');
                setBirthMsgBool(false);
            } else {
                setBirthMessage('');
                setBirthMsgBool(true);
            }

        } else if (value.length === 0) {
            setBirthMessage('');
            setBirthMsgBool(false);
        } else {
            setBirthMessage('일치하지 않는 형식입니다.');
            setBirthMsgBool(false);
        }
    }

    // event handler: 전화번호 변경 이벤트 핸들러 //
    const onTelNumberChangeHandler = (e: { target: { value: string } }) => {
        const numbersOnly = e.target.value.replace(/\D/g, "");
        if (numbersOnly.length <= 11) setTelNumber(numbersOnly);
        
        //setSend(false);
        //setTelMessage('');
    }

    // event handler: 엔터키로 인증번호 전송 버튼 동작 //
    const handleKeyDown2 = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') onSendClickHandler();
    }

    // event handler: 전화번호 인증 메시지 전송 클릭 이벤트 핸들러 //
    const onSendClickHandler = () => {
        setErrorBool(true);
        setTimer(180);
    }

    // event handler: 전화번호 인증번호 변경 이벤트 핸들러 //
    const authNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setAuthNumber(value);
    }

    // event handler: 엔터키로 전화번호 인증번호 확인 버튼 동작 //
    const handleKeyDown3 = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') onCheckClickHandler();
    }

    // event handler: 인증 번호 확인 버튼 클릭 이벤트 핸들러 //
    const onCheckClickHandler = () => {
        if (!authNumber) return;

        if (authNumber === authNumber_exam) {
            setIsMatched(true);
            setStopTimer(true);
            setAuthMessage('인증번호가 일치합니다.');
        } else {
            setIsMatched(false);
            setAuthMessage('인증번호가 일치하지 않습니다.');
        }

        //const requestBody: TelAuthCheckRequestDto = { telNumber, telAuthNumber };
        //idSearchTelAuthRequest(requestBody).then(idSearchtelAuthCheckResponse);
    }

    // event handler: 수정 버튼 클릭 이벤트 핸들러 //
    const onUpdateClickHandler = () => {
        alert('수정이 완료되었습니다.');
        navigator(MY_ABSOLUTE_PATH);
    }

    // event handler: 취소 버튼 클릭 이벤트 핸들러 //
    const onCancleClickHandler = () => {
        navigator(MY_ABSOLUTE_PATH);
    }

    // function: navigator //
    const navigator = useNavigate();

    // Function: 전화번호 '-'넣는 함수 //
    const displayFormattedPhoneNumber = (numbers: string) => {
        if (numbers.length <= 3) {
            return numbers;
        } else if (numbers.length <= 7) {
            return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        } else {
            return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
        }
    };

    // Function: 타이머 //
    const formatTime = () => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    // useRef로 interval을 관리
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Effect: 타이머 기능 구현 //
    useEffect(() => {
        if (error && !stopTimer) { // stopTimer가 false일 때만 타이머 시작
            intervalRef.current = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer <= 1) {
                        clearInterval(intervalRef.current!);
                        setSend(false);
                        setErrorBool(false);
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
        }

        // stopTimer가 true가 되면 타이머를 멈추도록 추가
        if (stopTimer && intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [error, stopTimer]);

    // render: 개인 정보 수정 화면 렌더링
    return (
        <div id='change-info'>
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
                <div style={{ display: "flex", flexDirection: "column", marginBottom: "60px"}}>
                    <input className="input-box" value={name} onChange={onNameChangeHandler} placeholder="이름"></input>

                    <input className="input-box3" type='password' value={password} onChange={onPasswordChangeHandler} 
                            placeholder="비밀번호(영문 + 숫자 혼합 8 ~ 13자)"></input>
                    <div className={isPossible ? 'message-true' : 'message-false'}
                        style={{ marginBottom: "15px"}}>{message}</div>

                    <input className="input-box3" type='password' value={passwordCheck}
                        onChange={onPasswordCheckChangeHandler} placeholder="비밀번호 확인"></input>
                    <div className={pwIsMatched ? 'message-true' : 'message-false'}>{errorMessage}</div>
                    
                    <input className="input-box3" value={birth} onChange={onBirthChangeHandler} placeholder="생년월일(YYYYMMDD)"
                        maxLength={8} style={{marginTop: "15px"}}></input>
                    {birthMsgBool ? '' : <div className="message-false">{birthMessage}</div>}

                    <div className="tel-box" style={{ marginTop: "15px"}}>
                        <input className="input-box2" onChange={onTelNumberChangeHandler} placeholder="전화번호(- 제외)"
                            value={displayFormattedPhoneNumber(telNumber)} onKeyDown={handleKeyDown2}></input>
                        <div className={telNumber.length === 11 ? "send-btn" : "send-btn-false"}
                            onClick={telNumber.length === 11 ? onSendClickHandler : undefined}>{send ? '전송' : '재전송'}</div>
                    </div>
                    {error ? <div className="message-true">인증번호가 전송되었습니다.</div> : ''}

                    {error ?
                        <>
                            <div className="tel-box2" style={{ marginTop: "15px"}}>
                                <input className="input-box2" onChange={authNumberChangeHandler} placeholder="인증번호 6자리"
                                    value={authNumber} onKeyDown={handleKeyDown3} maxLength={6}></input>
                                <div className='timer'>{formatTime()}</div>
                                <div className={authNumber.length === 6 ? "send-btn" : "send-btn-false"}
                                    onClick={authNumber.length === 6 ? onCheckClickHandler : undefined}>확인</div>
                            </div>
                            <div className={isMatched ? "message-true" : "message-false"}>{authMessage}</div>
                        </> 
                    : ''}

                    <div className='btn-box'>
                        <div className='update-btn' onClick={onUpdateClickHandler}>수정</div>
                        <div className='cancle-btn' onClick={onCancleClickHandler}>취소</div>
                    </div>
                </div>
            </div>
        </div>
    )
}