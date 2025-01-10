import React from "react";
import './style.css';

// component: 메인 화면 컴포넌트 //
export default function Main() {

    const mainText = '생성형 AI 설명 생성형 AI 설명 생성형 AI 설명 생성형 AI 설명 생성형 AI 설명 생성형 AI 설명 생성형 AI 설명 생성형 AI 설명 생성형 AI 설명 생성형 AI 설명 생성형 AI 설명 생성형 AI 설명 생성형 AI 설명 생성형 AI 설명 생성형 AI 설명 생성형 AI 설명'


    // render: 메인 화면 렌더링 //
    return (
        <div className="main-bottom">
            <div className='scoreboard'>"논쟁은 진리를 추구하는 열쇠이다.” - 소크라테스</div>
            <div className='main-general-discussion'>
                <div className='main-general-box'>
                    <div className='main-general-title'>생성형 AI에게 윤리적 책임을 물을 수 있는가?</div>
                    <div className='main-general-content'>{mainText}</div>
                    <div className='shortcut'>바로가기</div>
                </div>
                <div className='main-general-box'>
                    <div className='main-general-title'>생성형 AI에게 윤리적 책임을 물을 수 있는가?</div>
                    <div className='main-general-content'>{mainText}</div>
                    <div className='shortcut'>바로가기</div>
                </div>
                <div className='main-general-box'>
                    <div className='main-general-title'>생성형 AI에게 윤리적 책임을 물을 수 있는가?</div>
                    <div className='main-general-content'>{mainText}</div>
                    <div className='shortcut'>바로가기</div>
                </div>
                <div className='main-general-box'>
                    <div className='main-general-title'>생성형 AI에게 윤리적 책임을 물을 수 있는가?</div>
                    <div className='main-general-content'>{mainText}</div>
                    <div className='shortcut'>바로가기</div>
                </div>
            </div>
            <div className='main-realtime-discussion'>실시간 토론</div>
        </div>
    )
}