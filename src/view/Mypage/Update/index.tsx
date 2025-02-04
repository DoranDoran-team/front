import React, { ChangeEvent, useState } from 'react'
import './style.css';
import { useNavigate } from 'react-router-dom';
import { MY_PATH } from '../../../constants';

// component: 내 정보 수정 화면 컴포넌트 //
export default function Update() {

    // state: 내정보 입력 상태 //
    const [nickname, setNickName] = useState<string>('');
    const [stateMessage, setStateMessage] = useState<string>('');
    const [state] = useState<boolean>(true);    
    // variable: 입력 완료 상태 //
    const isSuccessed = nickname && stateMessage;

    // function: navigator 함수 처리 //
    const navigator = useNavigate();
    // event handler: 닉네임 변경 이벤트 처리 함수 //
    const onNickNameChangeHandler = (event:ChangeEvent<HTMLInputElement>)=> {
        const {value} = event.target;
        setNickName(value);
    }
    // event handler: 상태메세지 변경 이벤트 처리 함수 //
    const onStateMessageChangeHandler = (event:ChangeEvent<HTMLInputElement>)=> {
        const { value } = event.target;
        setStateMessage(value);
    }

    // event handler: 수정 완료 버튼 클릭 이벤트 처리 함수 //
    const onCompleteButtonHandler = () => {
        if (!isSuccessed) return;
        navigator(MY_PATH);
    }
    // render: 내정보 수정 화면 렌더링 
    return (
        <div className="mypage-update-wrapper">
            <div className="mypage-main-wrapper">
                <div className="user-box">
                    <div className="main-profile"></div>
                    <div className="mypage-info">
                        <input className="mypage-nickname edit" value={nickname} placeholder='닉네임을 입력해주세요. ' onChange={onNickNameChangeHandler}/>
                        <div className="mypage-id">@ LiveLive88</div>
                    </div>
                    <div className="mypage-user">구독자 <span>28</span>명 / 토론방<span>9</span>개</div>
                    <div className="edit-button-box" >
                        <div className={`edit-button ${isSuccessed ? 'complete' : 'fail'}` } onClick={onCompleteButtonHandler}>완료</div>
                    </div>
                </div>
                <input className="mypage-state-message edit" value={stateMessage} placeholder='상태메세지를 입력해주세요 'onChange={onStateMessageChangeHandler}/>
                <div className="mypage-discussion-room">내가 개설한 토론방</div>
                <div className="myapge-middle-box">
                    <div className="mypage-middle-icon"></div>
                    <div className="mypage-middle-nickname">별별이</div>
                </div>
                <div className="discussion-room-list">
                    <div className="discussion-image"></div>
                    <div className="discussion-info">
                        <div className="discussion-title-box">
                            <div className="discussion-title">대마초 합법화</div>
                            <div className="discussion-icon"></div>
                        </div>
                        <div className="discussion-contents">범죄 감소와 세수 증대 효과가 있다. vs 건강 문제와 사회적 부작용이 우려된다.</div>
                        <div className="discussion-bottom">
                            <div className="discussion-bottom-box">
                                <div className="discussion-created">20204.12.30 16:30</div>
                                <div className="discussion-fixed">(수정됨)</div>
                                {!state ? <div className="discussion-state-box continue">
                                    <div className="discussion-state ">진행중</div>
                                </div> :
                                <div className="discussion-state-box end">
                                    <div className="discussion-state ">종료</div>
                                </div>
                                }
                            </div>
                            <div className="discussion-icons">
                                <div className="discussion-comment-icon"></div>
                                <div className="discussion-comment">25</div>
                                <div className="discussion-like-icon"></div>
                                <div className="discussion-like">127</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="subscribe-wrapper">
                <div className="subscribe-title">내가 구독한 사람 2명</div>
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
    )
}
