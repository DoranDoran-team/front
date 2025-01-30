import React, { useState } from "react";
import './style.css';
import { useNavigate } from 'react-router-dom';

import { GEN_DISC_DETAIL_ABSOLUTE_PATH, GEN_DISC_WRITE_ABSOLUTE_PATH } from '../../constants';

const discussionData = Array.from({ length: 30 }, (_, index) => ({
    id: index + 1,
    title: `생성형 AI에게 윤리적 책임을 물을 수 있는가? ${index + 1}`,
    category: index % 4 === 0 ? '시사·교양' : index % 4 === 1 ? '과학' : index % 4 === 2 ? '경제' : '기타',
    deadline: '2025.01.05',
    userNickname: 'user_nickname',
    commentCount: 5,
    recommendationCount: 127,
}));

const categories = ['전체', '시사·교양', '과학', '경제', '기타'];

// GD: general discussion
// component: 일반 토론 컴포넌트 //
export default function GD() {
    const navigate = useNavigate();
    const roomId = "123";

    const [currentPage, setCurrentPage] = useState(1);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string>('정렬순');
    const [selectedCategory, setSelectedCategory] = useState<string>('전체');

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleOptionSelect = (option: string) => {
        setSelectedOption(option);
        setIsDropdownOpen(false);
        console.log(`선택한 정렬순: ${option}`);
    };
    const itemsPerPage = 10;

    const handleWriteButtonClick = () => {
        navigate(GEN_DISC_WRITE_ABSOLUTE_PATH);
    };

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1); // 카테고리 변경 시 페이지 초기화
    };

    // 페이지에 표시할 데이터 계산

    const filteredData = selectedCategory === '전체'
        ? discussionData
        : discussionData.filter(item => item.category === selectedCategory);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = discussionData.slice(indexOfFirstItem, indexOfLastItem);

    // 클릭 이벤트 핸들러
    const handleBoxClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;

        // 클릭한 요소가 discussion-option 클래스가 없는 경우
        if (!target.classList.contains('discussion-option')) {
            navigate(GEN_DISC_DETAIL_ABSOLUTE_PATH(roomId)); // 상세 조회 페이지로 이동
        }
    };

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(discussionData.length / itemsPerPage);

    // render: 일반 토론 화면 렌더링 //
    return (
        <div id="gd-wrapper">
            <div className="gd-wrapper-in">
                <div className='gd-box'>
                    <div className="top">
                        <div className="top-title">
                            {selectedCategory}
                        </div>
                        <div className='top-category-box'>
                            {categories.map(category => (
                                <div
                                    key={category}
                                    className={`top-category ${selectedCategory === category ? 'active' : ''}`}
                                    onClick={() => handleCategoryClick(category)}
                                >
                                    <span>{category}</span>
                                </div>
                            ))}
                        </div>
                        <div className="search-bar-and-sequence">
                            <div className='search-bar'>
                                <div className="magnifier-and-search-input">
                                    <div className='magnifier'></div>
                                    <input type="text" className="search-input" placeholder="검색어를 입력해주세요." />
                                </div>
                                <div className='search-button'>검색</div>
                            </div>
                            <div className='sequence-choice'><button className='sequence-choice-button' type='button' onClick={toggleDropdown}>{selectedOption}</button></div>

                        </div>
                        {isDropdownOpen && (
                            <div className='dropdown-menu-box'>
                                <div className='dropdown-menu'>
                                    <div className='dropdown-item' onClick={() => handleOptionSelect('최신순')}>최신순</div>
                                    <div className='dropdown-item' onClick={() => handleOptionSelect('추천순')}>추천순</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="main">
                        <div className='main-box'>
                            <div className="box1">
                                <div>
                                    <div className="profile-image"></div>
                                </div>
                                <div className='user-nickname'>user_nickname</div>
                            </div>
                            <div className="box2" onClick={handleBoxClick}>
                                <div className='discussion-image'>이미지 자리
                                    <img src=''></img>
                                </div>
                                <div className='discussion-info'>
                                    <div className="discussion-info-high">
                                        <div className="discussion-title">생성형 AI에게 윤리적 책임을 물을 수 있는가?</div>
                                    </div>
                                    <div className="discussion-info-middle">
                                        <div className="">찬성팀 주장</div>
                                        <div> VS </div>
                                        <div className="">반대팀 주장</div>
                                    </div>
                                    <div className="discussion-info-row">
                                        <div className="date-and-status">
                                            <div className="deadline">마감 : 2025.01.05</div>
                                            <div className="modify">(수정됨)</div>
                                            <div className="progress-status">진행 중</div>
                                        </div>
                                        <div className="comment-and-recommendation">
                                            <div className="comment-icon"></div>
                                            <div className="comment-count">5</div>
                                            <div className="recommendation-icon"></div>
                                            <div className="recommendation-count">127</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="main">
                        <div className='main-box'>
                            <div className="box1">
                                <div>
                                    <div className="profile-image"></div>
                                </div>
                                <div className='user-nickname'>user_nickname</div>
                            </div>
                            <div className="box2" onClick={handleBoxClick}>
                                <div className='discussion-image'>이미지 자리
                                    <img src=''></img>
                                </div>
                                <div className='discussion-info'>
                                    <div className="discussion-info-high">
                                        <div className="discussion-title">생성형 AI에게 윤리적 책임을 물을 수 있는가?</div>
                                    </div>
                                    <div className="discussion-info-middle">
                                        <div className="">찬성팀 주장</div>
                                        <div> VS </div>
                                        <div className="">반대팀 주장</div>
                                    </div>
                                    <div className="discussion-info-row">
                                        <div className="date-and-status">
                                            <div className="deadline">마감 : 2025.01.05</div>
                                            <div className="modify">(수정됨)</div>
                                            <div className="progress-status">진행 중</div>
                                        </div>
                                        <div className="comment-and-recommendation">
                                            <div className="comment-icon"></div>
                                            <div className="comment-count">5</div>
                                            <div className="recommendation-icon"></div>
                                            <div className="recommendation-count">127</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="main">
                        <div className='main-box'>
                            <div className="box1">
                                <div>
                                    <div className="profile-image"></div>
                                </div>
                                <div className='user-nickname'>user_nickname</div>
                            </div>
                            <div className="box2" onClick={handleBoxClick}>
                                <div className='discussion-image'>이미지 자리
                                    <img src=''></img>
                                </div>
                                <div className='discussion-info'>
                                    <div className="discussion-info-high">
                                        <div className="discussion-title">생성형 AI에게 윤리적 책임을 물을 수 있는가?</div>
                                    </div>
                                    <div className="discussion-info-middle">
                                        <div className="">찬성팀 주장</div>
                                        <div> VS </div>
                                        <div className="">반대팀 주장</div>
                                    </div>
                                    <div className="discussion-info-row">
                                        <div className="date-and-status">
                                            <div className="deadline">마감 : 2025.01.05</div>
                                            <div className="modify">(수정됨)</div>
                                            <div className="progress-status">진행 중</div>
                                        </div>
                                        <div className="comment-and-recommendation">
                                            <div className="comment-icon"></div>
                                            <div className="comment-count">5</div>
                                            <div className="recommendation-icon"></div>
                                            <div className="recommendation-count">127</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="main">
                        <div className='main-box'>
                            <div className="box1">
                                <div>
                                    <div className="profile-image"></div>
                                </div>
                                <div className='user-nickname'>user_nickname</div>
                            </div>
                            <div className="box2" onClick={handleBoxClick}>
                                <div className='discussion-image'>이미지 자리
                                    <img src=''></img>
                                </div>
                                <div className='discussion-info'>
                                    <div className="discussion-info-high">
                                        <div className="discussion-title">생성형 AI에게 윤리적 책임을 물을 수 있는가?</div>
                                    </div>
                                    <div className="discussion-info-middle">
                                        <div className="">찬성팀 주장</div>
                                        <div> VS </div>
                                        <div className="">반대팀 주장</div>
                                    </div>
                                    <div className="discussion-info-row">
                                        <div className="date-and-status">
                                            <div className="deadline">마감 : 2025.01.05</div>
                                            <div className="modify">(수정됨)</div>
                                            <div className="progress-status">진행 중</div>
                                        </div>
                                        <div className="comment-and-recommendation">
                                            <div className="comment-icon"></div>
                                            <div className="comment-count">5</div>
                                            <div className="recommendation-icon"></div>
                                            <div className="recommendation-count">127</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="main">
                        <div className='main-box'>
                            <div className="box1">
                                <div>
                                    <div className="profile-image"></div>
                                </div>
                                <div className='user-nickname'>user_nickname</div>
                            </div>
                            <div className="box2" onClick={handleBoxClick}>
                                <div className='discussion-image'>이미지 자리
                                    <img src=''></img>
                                </div>
                                <div className='discussion-info'>
                                    <div className="discussion-info-high">
                                        <div className="discussion-title">생성형 AI에게 윤리적 책임을 물을 수 있는가?</div>
                                    </div>
                                    <div className="discussion-info-middle">
                                        <div className="">찬성팀 주장</div>
                                        <div> VS </div>
                                        <div className="">반대팀 주장</div>
                                    </div>
                                    <div className="discussion-info-row">
                                        <div className="date-and-status">
                                            <div className="deadline">마감 : 2025.01.05</div>
                                            <div className="modify">(수정됨)</div>
                                            <div className="progress-status">진행 중</div>
                                        </div>
                                        <div className="comment-and-recommendation">
                                            <div className="comment-icon"></div>
                                            <div className="comment-count">5</div>
                                            <div className="recommendation-icon"></div>
                                            <div className="recommendation-count">127</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div id="floating-write-button" onClick={handleWriteButtonClick}>
                +
            </div>

        </div >
    )
}