import React, { useEffect, useState } from "react";
import './style.css';

// component: 메인 화면 컴포넌트 //
export default function Main() {

    const sentences = [
        `"논쟁은 진리를 추구하는 열쇠이다.” - 소크라테스`,
        `"토론은 한쪽의 승리가 아니라, 모두가 배우는 기회다." - 아브라함 링컨`,
        `"훌륭한 토론은 두 사람이 함께 진실을 발견하는 과정이다." - 존 스튜어트 밀`,
        `"우리가 서로 다름을 이해할 때, 우리는 진정으로 소통할 수 있다." - 루스 벤데르`,
        `"당신의 의견이 아니라, 당신의 논거가 사람을 설득한다." - 마르쿠스 툴리우스 키케로`,
        `"토론은 우리의 편견을 깨고 더 넓은 시각을 열어준다." - 에드워드 드 보노`,
        `"모든 진리는 격렬한 논쟁을 통해 더 밝아진다." - 토머스 제퍼슨`,
        `"사람의 성장은 반대 의견을 경청할 때 시작된다." - 존 록`,
        `"토론의 목적은 승리가 아니라, 이해다." - 조셉 주베르`,
        `"열린 대화는 가장 강력한 교육 도구다." - 피터 드러커`,
    ] // 명언

    // state: 명언 인덱스 번호
    const [currentIndex, setCurrentIndex] = useState(0);

    // state: 애니매이션이 진행중인지 확인
    const [isAnimate, setIsAnimate] = useState(true);

    const [opinionAUsers, setOpinionAUsers] = useState<number>(27); // 의견 A 유저 비율
    const [opinionBUsers, setOpinionBUsers] = useState<number>(73); // 의견 B 유저 비율

    // effect: 명언 교체 다루기
    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimate(false); // 애니메이션 종료
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % sentences.length);
                setIsAnimate(true); // 애니메이션 시작
            }, 500); // 애니메이션 지속 시간
        }, 10000); // 10초마다 실행
        return () => clearInterval(interval); // 클린업
    }, []);

    // render: 메인 화면 렌더링 //
    return (
        <div className="main-bottom">
            <div className={`sentence ${isAnimate ? "fade-in" : "fade-out"} scoreboard`}>{sentences[currentIndex]}</div>
            <div className="general-discussion">
                <h2 className="general-tit">일반 토론</h2>
                <div className='main-general-discussion'>
                    <div className='main-general-box'>
                        <div className='main-general-photo'>
                            <a href="localhost:3000/main">
                                <img src="https://img.hankyung.com/photo/202501/AA.39116657.3.jpg" className="general-image" />
                            </a>
                        </div>
                        <div className='main-general-content'>
                            <em className="subject-tit">
                                <a href="태그">우리만의 태그</a>
                            </em>
                            <h3 className="news-tit">
                                <a href="이름">영국 처칠치 독일 함대 제압했던 힘은 '석유'</a>
                            </h3>
                        </div>
                    </div>
                    <div className='main-general-box'>
                        <div className='main-general-photo'>
                            <a href="localhost:3000/main">
                                <img src="https://img.hankyung.com/photo/202501/AA.39160686.3.jpg" className="general-image" />
                            </a>
                        </div>
                        <div className='main-general-content'>
                            <em className="subject-tit">
                                <a href="태그">우리만의 태그</a>
                            </em>
                            <h3 className="news-tit">
                                <a href="이름">임금도 수요·공급이 결정…무작정 올리면 일자리 줄어</a>
                            </h3>
                        </div>
                    </div>
                    <div className='main-general-box'>
                        <div className='main-general-photo'>
                            <a href="localhost:3000/main">
                                <img src="https://img.hankyung.com/photo/202501/AA.39160550.3.jpg" className="general-image" />
                            </a>
                        </div>
                        <div className='main-general-content'>
                            <em className="subject-tit">
                                <a href="태그">우리만의 태그</a>
                            </em>
                            <h3 className="news-tit">
                                <a href="이름">특목고 대입 확률, 일반고보다 20% 이상 높다</a>
                            </h3>
                        </div>
                    </div>
                    <div className='main-general-box'>
                        <div className='main-general-photo'>
                            <a href="localhost:3000/main">
                                <img src="https://img.hankyung.com/photo/202501/AA.39130331.3.jpg" className="general-image" />
                            </a>
                        </div>
                        <div className='main-general-content'>
                            <em className="subject-tit">
                                <a href="태그">우리만의 태그</a>
                            </em>
                            <h3 className="news-tit">
                                <a href="이름">6개국 통화로 평가한 달러 가치…새해도 '강달러'</a>
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className="rt-discussion">
                <h2 className="rt-tit">실시간 토론</h2>
                <div className='main-rt-discussion'>
                    <div className='main-rt-box'>
                        <div className='main-rt-photo'>
                            <a href="localhost:3000/main">
                                <img src="https://img.hankyung.com/photo/202501/AA.39116657.3.jpg" className="rt-image" />
                            </a>
                        </div>
                        <div className='main-rt-content'>
                            <em className="subject-tit">
                                <a href="태그">우리만의 태그</a>
                            </em>
                            <div className="bar-container">
                                <em className="subject-tit2">
                                    실시간 참여도
                                </em>
                                <div className="bar">
                                    <div className="bar-a" style={{ width: `${opinionAUsers}%` }} />
                                    <div className="bar-b" style={{ width: `${opinionBUsers}%` }} />
                                </div>
                                <div className="percentage-labels">
                                    <span className="label-a">{opinionAUsers}%</span>
                                    <span className="label-b">{opinionBUsers}%</span>
                                </div>
                            </div>
                            <h3 className="news-tit">
                                <a href="이름">영국 처칠치 독일 함대 제압했던 힘은 '석유'</a>
                            </h3>
                        </div>
                    </div>
                    <div className='main-rt-box'>
                        <div className='main-rt-photo'>
                            <a href="localhost:3000/main">
                                <img src="https://img.hankyung.com/photo/202501/AA.39160686.3.jpg" className="rt-image" />
                            </a>
                        </div>
                        <div className='main-rt-content'>
                            <em className="subject-tit">
                                <a href="태그">우리만의 태그</a>
                            </em>
                            <div className="bar-container">
                                <em className="subject-tit2">
                                    실시간 참여도
                                </em>
                                <div className="bar">
                                    <div className="bar-a" style={{ width: `${opinionAUsers}%` }} />
                                    <div className="bar-b" style={{ width: `${opinionBUsers}%` }} />
                                </div>
                                <div className="percentage-labels">
                                    <span className="label-a">{opinionAUsers}%</span>
                                    <span className="label-b">{opinionBUsers}%</span>
                                </div>
                            </div>
                            <h3 className="news-tit">
                                <a href="이름">임금도 수요·공급이 결정…무작정 올리면 일자리 줄어</a>
                            </h3>
                        </div>
                    </div>
                    <div className='main-rt-box'>
                        <div className='main-rt-photo'>
                            <a href="localhost:3000/main">
                                <img src="https://img.hankyung.com/photo/202501/AA.39160550.3.jpg" className="rt-image" />
                            </a>
                        </div>
                        <div className='main-rt-content'>
                            <em className="subject-tit">
                                <a href="태그">우리만의 태그</a>
                            </em>
                            <div className="bar-container">
                                <em className="subject-tit2">
                                    실시간 참여도
                                </em>
                                <div className="bar">
                                    <div className="bar-a" style={{ width: `${opinionAUsers}%` }} />
                                    <div className="bar-b" style={{ width: `${opinionBUsers}%` }} />
                                </div>
                                <div className="percentage-labels">
                                    <span className="label-a">{opinionAUsers}%</span>
                                    <span className="label-b">{opinionBUsers}%</span>
                                </div>
                            </div>
                            <h3 className="news-tit">
                                <a href="이름">특목고 대입 확률, 일반고보다 20% 이상 높다</a>
                            </h3>
                        </div>
                    </div>
                    <div className='main-rt-box'>
                        <div className='main-rt-photo'>
                            <a href="localhost:3000/main">
                                <img src="https://img.hankyung.com/photo/202501/AA.39130331.3.jpg" className="rt-image" />
                            </a>
                        </div>
                        <div className='main-rt-content'>
                            <em className="subject-tit">
                                <a href="태그">우리만의 태그</a>
                            </em>
                            <div className="bar-container">
                                <em className="subject-tit2">
                                    실시간 참여도
                                </em>
                                <div className="bar">
                                    <div className="bar-a" style={{ width: `${opinionAUsers}%` }} />
                                    <div className="bar-b" style={{ width: `${opinionBUsers}%` }} />
                                </div>
                                <div className="percentage-labels">
                                    <span className="label-a">{opinionAUsers}%</span>
                                    <span className="label-b">{opinionBUsers}%</span>
                                </div>
                            </div>
                            <h3 className="news-tit">
                                <a href="이름">6개국 통화로 평가한 달러 가치…새해도 '강달러'</a>
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )


}