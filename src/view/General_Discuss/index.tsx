import React, { ChangeEvent, useEffect, useState } from "react";
import './style.css';
import { useNavigate } from 'react-router-dom';

import { ACCESS_TOKEN, GEN_DISC_DETAIL_ABSOLUTE_PATH, GEN_DISC_WRITE_ABSOLUTE_PATH } from '../../constants';
import DiscussionList from "../../types/discussionList.interface";
import { usePagination } from "../../hooks";

import { useCookies } from "react-cookie";
import GetDiscussionListResponseDto from "../../apis/dto/response/gd_discussion/get-discussion-list.response.dto";
import ResponseDto from "../../apis/dto/response/response.dto";
import { getDiscussionListRequest } from "../../apis";
import Pagination from "../../components/pagination";
import { GetDiscussionListResponseDto } from "../../apis/dto/response/gd_discussion";


interface TableRowProps {
    discussionList: DiscussionList
    getDiscussionList: () => void
}

// component: 일반 토론방 리스트 컴포넌트//
function TableRow({ discussionList, getDiscussionList }: TableRowProps) {

    // function: navigate 함수 처리 //
    const navigator = useNavigate();

    // event handler: 토론방 리스트 클릭 이벤트 처리 //
    const onDiscussionClickHandler = () => {
        navigator(GEN_DISC_DETAIL_ABSOLUTE_PATH(discussionList.roomId))
    }

    // function: get general discussion response 처리 함수 //

    return (
        <div>
            <div className='main-box' onClick={onDiscussionClickHandler}>
                <div className="box1">
                    <div>
                        <div className="profile-image"></div>
                    </div>
                    <div className='user-nickname'>{discussionList.nickName}</div>
                </div>
                <div className="box2">
                    <div className='discussion-image' style={{ backgroundImage: `url(${discussionList.discussionImage})` }}></div>
                    <div className='discussion-info'>
                        <div className="discussion-info-high">
                            <div className="discussion-title">{discussionList.roomTitle}</div>
                        </div>
                        <div className="discussion-info-middle">
                            <div className="">{discussionList.agreeOpinion}</div>
                            <div> VS </div>
                            <div className="">{discussionList.oppositeOpinion}</div>
                        </div>
                        <div className="discussion-info-row">
                            <div className="date-and-status">
                                <div className="deadline">마감 : {discussionList.discussionEnd}</div>
                                <div className="modify">{discussionList.updateStatus ? '(수정됨)' : ''}</div>
                                <div className="progress-status">진행 중</div>
                            </div>
                            <div className="comment-and-recommendation">
                                <div className="comment-icon"></div>
                                <div className="comment-count">{discussionList.commentCount}</div>
                                <div className="recommendation-icon"></div>
                                <div className="recommendation-count">{discussionList.likeCount}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
// GD: general discussion
// component: 일반 토론 컴포넌트 //
export default function GD() {

    const navigator = useNavigate();

    // state: 쿠키 상태 //
    const [cookies] = useCookies();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string>('정렬순');

    // state: 검색어 상태 //
    const [searched, setSearched] = useState<string>('');

    // state: 원본 리스트 상태 //
    const [originalList, setOriginalList] = useState<DiscussionList[]>([]);

    // state: 페이징 관련 상태 //
    const {
        currentPage,
        viewList,
        pageList,
        setTotalList,
        initViewList,
        onPageClickHandler,
        onPreSectionClickHandler,
        onNextSectionClickHandler, } = usePagination<DiscussionList>();

    // state: 일반 토론방 상태 //
    const [category, setCategory] = useState<string>('전체');
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleOptionSelect = (option: string) => {

        let sortedList = [...originalList];

        if (option === '최신순') {
            sortedList.sort((after, before) => new Date(after.createdRoom).getTime() - new Date(before.createdRoom).getTime());

        } else if (option === '추천순') {
            sortedList.sort((up, down) => down.likeCount - up.likeCount);
        }

        setTotalList(sortedList);
        initViewList(sortedList);

        setSelectedOption(option);
        setIsDropdownOpen(false);
    };

    // function: get general discussion list response 처리 함수 //
    const getDiscussionListResponse = (responseBody: GetDiscussionListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === "AF" ? '잘못된 접근입니다. ' :
                    responseBody.code === "DBE" ? '서버에 문제가 있습니다. ' : '';

        const isSuccessd = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessd) {
            alert(message);
            return;
        }

        const { discussionList } = responseBody as GetDiscussionListResponseDto
        setTotalList(discussionList);
        setOriginalList(discussionList);
    }
    // function: 일반 토론방 list 불러오기 함수 //
    const getDiscussionList = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;
        getDiscussionListRequest(accessToken).then(getDiscussionListResponse);
    }

    // event handler: 토론방 작성 클릭 이벤트 처리 //
    const handleWriteButtonClick = () => {
        navigator(GEN_DISC_WRITE_ABSOLUTE_PATH);
    };
    // event handler: 토론방 카테고리 클릭 이벤트 처리 //
    const onCategoryHandler = (type: string) => {
        setCategory(category => (category === type ? '' : type));
    }

    // event handler: 검색어 변경 이벤트 처리 //
    const onSearchedChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearched(value);
    }

    // event handler: 검색 버튼 클릭 이벤트 처리 //
    const onSearchButtonClickHandler = () => {
        const searchedDiscussionList = originalList.filter(discussionList => discussionList.roomTitle.includes(searched));
        setTotalList(searchedDiscussionList);
        initViewList(searchedDiscussionList);
    }


    // effect: 컴포넌트 로드시 일반 토론방 리스트 불러오기 함수 //
    useEffect(getDiscussionList, []);

    // render: 일반 토론 화면 렌더링 //
    return (
        <div id="gd-wrapper">
            <div className="gd-wrapper-in">
                <div className='gd-box'>
                    <div className="top">
                        <div className="top-title">
                            {category}
                        </div>
                        <div className='top-category-box'>
                            {['전체', '시사·교양', '과학', '경제', '기타'].map((type) => (
                                <div
                                    key={type}
                                    className={`top-category ${category === type ? 'active' : ''}`}
                                    onClick={() => onCategoryHandler(type)}
                                >
                                    <span>{type}</span>
                                </div>
                            ))}
                        </div>
                        <div className="search-bar-and-sequence">
                            <div className='search-bar'>
                                <div className="magnifier-and-search-input">
                                    <div className='magnifier'></div>
                                    <input type="text" className="search-input" placeholder="검색어를 입력해주세요." value={searched} onChange={onSearchedChangeHandler} />
                                </div>
                                <div className='search-button' onClick={onSearchButtonClickHandler}>검색</div>
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
                        {(category === '전체' ? viewList : originalList.filter(discussionList => discussionList.discussionType === category))
                            .map((discussionList, index) => (
                                <TableRow
                                    key={index}
                                    discussionList={discussionList}
                                    getDiscussionList={getDiscussionList}
                                />
                            ))}
                    </div>
                    <div className="gd-bottom-pagenation">
                        <div className="gd-bottom-item">
                            <Pagination pageList={pageList} currentPage={currentPage} onPageClickHandler={onPageClickHandler} onPreSectionClickHandler={onPreSectionClickHandler} onNextSectionClickHandler={onNextSectionClickHandler} />
                        </div>
                    </div>

                </div>
                <div id="floating-write-button" onClick={handleWriteButtonClick}>
                    +
                </div>
            </div>
        </div >
    )
}