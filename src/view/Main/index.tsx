import React, { useEffect, useState } from "react";
import './style.css';

// component: 메인 화면 컴포넌트 //
export default function Main() {

    const sentences = [
        `"논쟁은 진리를 추구하는 열쇠이다."\n- 소크라테스`,
        `"토론은 한쪽의 승리가 아니라, 모두가 배우는 기회다."\n- 아브라함 링컨`,
        `"훌륭한 토론은 두 사람이 함께 진실을 발견하는 과정이다."\n- 존 스튜어트 밀`,
        `"우리가 서로 다름을 이해할 때, 우리는 진정으로 소통할 수 있다."\n- 루스 벤데르`,
        `"당신의 의견이 아니라, 당신의 논거가 사람을 설득한다."\n- 마르쿠스 툴리우스 키케로`,
        `"토론은 우리의 편견을 깨고 더 넓은 시각을 열어준다."\n- 에드워드 드 보노`,
        `"모든 진리는 격렬한 논쟁을 통해 더 밝아진다."\n- 토머스 제퍼슨`,
        `"사람의 성장은 반대 의견을 경청할 때 시작된다."\n- 존 록`,
        `"토론의 목적은 승리가 아니라, 이해다."\n- 조셉 주베르`,
        `"열린 대화는 가장 강력한 교육 도구다."\n- 피터 드러커`,
    ];


    // state: 명언 인덱스 번호
    const [currentIndex, setCurrentIndex] = useState(0);

    // state: 애니매이션이 진행중인지 확인
    const [isAnimate, setIsAnimate] = useState(true);

    const [opinionAUsers, setOpinionAUsers] = useState<number>(27); // 의견 A 유저 비율
    const [opinionBUsers, setOpinionBUsers] = useState<number>(73); // 의견 B 유저 비율


    // 게시물 내용
    const posts = [
        {
            tag: "과학",
            title: "영국 처칠치 독일 함대 제압했던 힘은 '석유'",
            content: "1911년 여름에서 가을까지 세상에서 가장 바빴던 사람은 아마도 윈스턴 처칠이었을 것이다. 그해 7월 독일제국 빌헬름 황제가 모로코의 아가디르항에 군함을 파견해 아프리카에서 프랑스의 영향력에 의문을 제기하기 전까지만 해도 처칠은 게르만족과 충분히 잘 지낼 수 있다고 믿었다.",
            imgSrc: "https://img.hankyung.com/photo/202501/AA.39116657.3.jpg"
        },
        {
            tag: "시사·교양",
            title: "임금도 수요·공급이 결정…무작정 올리면 일자리 줄어",
            content: "올해 최저임금은 시간당 1만30원이다. 지난해보다 1.7% 인상되며 처음으로 1만원을 넘겼다. 노동계는 해마다 큰 폭의 최저임금 인상을 주장한다. 물가가 오른 만큼 근로자들의 임금도 높아져야 한다는 요구를 마냥 무시할 수는 없다. 하지만 소상공인과 영세 자영업자들은 “더 이상 버틸 수 없다”며 한숨을 내쉰다. 최저임금 인상이 경제와 노동시장에 미치는 영향을 알아보자.",
            imgSrc: "https://img.hankyung.com/photo/202501/AA.39160686.3.jpg"
        },
        {
            tag: "기타",
            title: "특목고 대입 확률, 일반고보다 20% 이상 높다",
            content: "5일 한국직업능력연구원에 따르면 특목고 학생은 일반고보다 대학에 입학할 확률이 20% 이상 높았으며, 특성화고는 일반고보다 21.5% 낮은 것으로 나타났다. 다른 독립변인을 통제했을 때 여학생이 남학생보다 대학에 입학할 승산이 35.9% 높았다. 직능원은 “여학생은 남학생보다 대학에 진학할 확률이 평균 4.39% 높았다”고 분석했다.",
            imgSrc: "https://img.hankyung.com/photo/202501/AA.39160550.3.jpg"
        },
        {
            tag: "경제",
            title: "6개국 통화로 평가한 달러 가치…새해도 '강달러'",
            content: "미국 화폐인 달러의 가치가 2년여 만에 최고치로 올랐다. 금융시장이 새해 첫 거래를 시작한 지난 2일 달러인덱스(dollar index)는 109.38을 기록했다. 2022년 11월 이후 처음으로 109선을 돌파하며 새해 들어서도 꺾이지 않는 ‘강달러’의 위용을 드러냈다. 이 영향으로 유럽 화폐인 유로화 가치는 2022년 11월 이후 최저치인 유로당 1.023달러까지 하락했다.",
            imgSrc: "https://img.hankyung.com/photo/202501/AA.39130331.3.jpg"
        },
    ]; // 추천 게시물

    // state: 게시물 인덱스 번호
    const [postIndex, setPostIndex] = useState(0);

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

    // 게시물 전환 함수
    const handleNextPost = () => {
        setIsAnimate(false);
        setTimeout(() => {
            setPostIndex((prevIndex) => (prevIndex + 1) % posts.length);
            setIsAnimate(true);
        }, 0); // 애니메이션 지속 시간
    };

    const handlePrevPost = () => {
        setIsAnimate(false);
        setTimeout(() => {
            setPostIndex((prevIndex) => (prevIndex - 1 + posts.length) % posts.length);
            setIsAnimate(true);
        }, 0);
    };


    // render: 메인 화면 렌더링 //
    return (
        <div className="main-background">
            <div className="speech-bubble">
                <div className={`scoreboard ${isAnimate ? "fade-in" : "fade-out"}`}>
                    {sentences[currentIndex]}
                </div>
                <div className="general-discussion">
                    <div className='main-general-discussion'>
                        <div className='main-general-box'>
                            <div className='main-general-photo'>
                                <a href="localhost:3000/main">
                                    <img src={posts[postIndex].imgSrc} className="general-image" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="general-discussion-in">
                        <div className='main-general-content'>
                            <em className="subject-tit">
                                <div>
                                    <a href="태그">일반 토론 - {posts[postIndex].tag}</a>
                                </div>
                                <div className="arrow-circles">
                                    <div className="arrow-circle-left" onClick={handlePrevPost}></div>
                                    <div className="arrow-circle-right" onClick={handleNextPost}></div>
                                </div>
                            </em>
                            <div className="general-news-tit">
                                <a href="이름">{posts[postIndex].title}</a>
                            </div>
                            <div className="general-news-content">{posts[postIndex].content}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="main-bottom">
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
                                <div className="news-tit">
                                    <a href="이름">영국 처칠치 독일 함대 제압했던 힘은 '석유'</a>
                                </div>
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
                                <div className="news-tit">
                                    <a href="이름">임금도 수요·공급이 결정…무작정 올리면 일자리 줄어</a>
                                </div>
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
                                <div className="news-tit">
                                    <a href="이름">특목고 대입 확률, 일반고보다 20% 이상 높다</a>
                                </div>
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
                                <div className="news-tit">
                                    <a href="이름">6개국 통화로 평가한 달러 가치…새해도 '강달러'</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )


}