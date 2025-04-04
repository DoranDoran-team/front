import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import './style.css';
import { useNavigate } from 'react-router-dom';

import { ACCESS_TOKEN, ANOTHER_USER_PROFILE_ABSOULTE_PATH, GEN_DISC_DETAIL_ABSOLUTE_PATH, GEN_DISC_WRITE_ABSOLUTE_PATH, MY_PATH } from '../../constants';
import DiscussionList from "../../types/discussionList.interface";
import { usePagination } from "../../hooks";

import { useCookies } from "react-cookie";
import ResponseDto from "../../apis/dto/response/response.dto";
import { useCategoryStore, useSignInUserStore } from "../../stores";
import Pagination from "../../components/pagination";
import { GetDiscussionListResponseDto } from "../../apis/dto/response/gd_discussion";
import { deleteLikeRequest, getDiscussionListRequest, getSearchDiscussionListRequest, postLikeRequest } from "../../apis";

const DEBOUNCE_DELAY = 200; // 0.2초 (200ms)

interface TableRowProps {
    discussionList: DiscussionList;
    getDiscussionList: () => void;
    postLike: (targetId: number, userId: string, likeType: string, event: MouseEvent<HTMLDivElement>) => void;
    click: { [key: number]: boolean };

}

// component: 일반 토론방 리스트 컴포넌트//
function TableRow({ discussionList, getDiscussionList, postLike, click }: TableRowProps) {

    // state: 로그인 유저 //
    const { signInUser, setSignInUser } = useSignInUserStore();
    const user = signInUser?.userId ?? "";



    // function: navigate 함수 처리 //
    const navigator = useNavigate();

    // event handler: 토론방 리스트 클릭 이벤트 처리 //
    const onDiscussionClickHandler = () => {
        navigator(GEN_DISC_DETAIL_ABSOLUTE_PATH(discussionList.roomId))
    }

    // function: 마감 여부 확인 함수 처리 //
    const checkStatus = (discussionEnd: string) => {
        const today = new Date().setHours(0, 0, 0, 0); // 오늘 날짜 (시간 제거)
        const endDate = new Date(discussionEnd).setHours(0, 0, 0, 0); // 문자열을 Date로 변환

        return endDate < today ? "마감" : "진행중";
    };
    
    // event handler: 게시글 작성자 프로필 클릭 이벤트 처리 //
    const onProfileClickHandler = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        if (signInUser?.userId === discussionList.userId) navigator(MY_PATH);
        else {
            document.cookie = `selectedUser=${discussionList.userId}; path=/;`;
            navigator(ANOTHER_USER_PROFILE_ABSOULTE_PATH);
            document.cookie = "yourCookieName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
    }

    // function: get general discussion response 처리 함수 //

    return (
        <div>
            <div className='main-box' onClick={onDiscussionClickHandler}>
                <div className="box1" onClick={onProfileClickHandler}>
                    <div>
                        <div className="profile-image"
                            style={{
                                backgroundImage: `url(${discussionList.profileImage ?
                                    discussionList.profileImage : '/defaultProfile.png'})`
                            }}
                        ></div>
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
                                <div className={`progress-status ${checkStatus(discussionList.discussionEnd) === '마감' ? 'end' : 'active'}`}>{checkStatus(discussionList.discussionEnd)}</div>
                            </div>
                            <div className="comment-and-recommendation">
                                <div className="comment-icon"></div>
                                <div className="comment-count">{discussionList.commentCount}</div>
                                <div className={`recommendation-icon ${click[discussionList.roomId] ? 'active' : ''}`} onClick={(event) => postLike(discussionList.roomId, user, 'POST', event)} ></div>
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
    const [likeClick, setLikeClick] = useState<{[key:number]:boolean}>({});
    const {signInUser} = useSignInUserStore();

    const userId = signInUser?.userId ?? "";



    // state: 검색어 상태 //
    const [searched, setSearched] = useState<string>('');

    // state: 원본 리스트 상태 //
    const [originalList, setOriginalList] = useState<DiscussionList[]>([]);

    const [discussion]=useState<DiscussionList>()

    // state: 페이징 관련 상태 //
    const {
        currentPage,
        viewList,
        pageList,
        setTotalList,
        setViewList,
        initViewList,
        onPageClickHandler,
        onPreSectionClickHandler,
        onNextSectionClickHandler, } = usePagination<DiscussionList>();

    // state: zustand 일반 토론방 상태 //
    const { category, setCategory } = useCategoryStore();
    const [categoryItem, setCategoryItem] = useState(category);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
        console.log(isDropdownOpen);
    };

    const handleOptionSelect = (option: string) => {
        let sortedList = [...originalList];

        if (option === '최신순') {
            sortedList.sort((after, before) => new Date(before.createdRoom).getTime() - new Date(after.createdRoom).getTime());

        } else if (option === '추천순') {
            sortedList.sort((up, down) => down.likeCount - up.likeCount);
        }

        setTotalList(sortedList);
        initViewList(sortedList);

        setSelectedOption(option);
        setIsDropdownOpen(!isDropdownOpen);
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
        const isLiked = discussionList.filter( like => like.roomId && like.isLike===true );
        if (isLiked.length > 0) {
            isLiked.forEach(discussion => {
                setLikeClick((prev) => ({
                    ...prev,
                    [discussion.roomId]: true
                }));
            });
        }
        setTotalList(discussionList);
        setOriginalList(discussionList);
        
    }

    // function: 일반 토론방 list 불러오기 함수 //
    const getDiscussionList = async () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;
        await getDiscussionListRequest(accessToken).then(getDiscussionListResponse);

        await setViewList((prevList)=> prevList.filter((item)=>item.roomId !== discussion?.roomId));

    }

    // event handler: 토론방 작성 클릭 이벤트 처리 //
    const handleWriteButtonClick = () => {
        navigator(GEN_DISC_WRITE_ABSOLUTE_PATH);
    };

    // event handler: 토론방 카테고리 클릭 이벤트 처리 //
    const onCategoryHandler = (type: string) => {
        setCategory(type);
        setCategoryItem(type);
        setSearched('');
        getDiscussionList();
    }

    // event handler: 검색어 변경 이벤트 처리 //
    const onSearchedChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setSearched(event.currentTarget.value);
    }

    // event handler: 검색 버튼 클릭 이벤트 처리 //
    const onSearchButtonClickHandler = () => {
        const searchedDiscussionList = originalList.filter(discussionList => discussionList.roomTitle.includes(searched));
        setTotalList(searchedDiscussionList);
        initViewList(searchedDiscussionList);
    }

    // event handler: 엔터키로 검색 버튼 동작 //
        const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter') {
                onSearchButtonClickHandler();
            }

        }

    // function: post like response 처리 함수 //
    const postLikeResponse = (responseBody: ResponseDto | null) => {
        const message = !responseBody ? '서버에 문제가 있습니다. ' :
            responseBody.code === 'AF' ? '잘못된 접근입니다. ' :
                responseBody.code === 'DL' ? '중복된 값입니다. ' :
                    responseBody.code === 'NR' ? '존재하지 않는 토론방입니다. ' :
                        responseBody.code === 'NM' ? '존재하지 않는 댓글입니다. ' :
                            responseBody.code === 'DBE' ? '서버에 문제가 있습니다. ' : '';
        const isSuccessd = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessd) {
            alert(message);
        }
    }

    // function: delete like response 처리 함수 //
    const deleteLikeResponse = (responseBody: ResponseDto | null) => {
        const message = !responseBody ? '서버에 문제가 있습니다. ' :
            responseBody.code === 'AF' ? '잘못된 접근입니다. ' :
                responseBody.code === 'NT' ? '잘못된 게시물(댓글)입니다. ' :
                    responseBody.code === 'NP' ? '잘못된 접근입니다. ' :
                        responseBody.code === 'DBE' ? '서버에 문제가 있습니다. ' : '';
        const isSuccessd = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessd) {
            alert(message);
        }
    }

    // event handler: 좋아요 버튼 클릭 이벤트 처리 //
    const onLikeClickHandler = async (targetId: number, user: string, likeType: string, event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        const accessToken = cookies[ACCESS_TOKEN];
        if (!targetId || !likeType || !accessToken || !user ) return;
    
        setLikeClick((prevLikeClick) => {
            const newState = { 
                ...prevLikeClick, 
                [targetId]: !prevLikeClick[targetId],  // 이전 상태를 반전시켜서 업데이트
            };
            return newState;
        });

        try {
            if (!likeClick[targetId]) {
                await postLikeRequest(targetId, likeType, user, accessToken).then(postLikeResponse);

            } else {
                await deleteLikeRequest(targetId, likeType, user, accessToken).then(deleteLikeResponse);
            }
            await getDiscussionList();
        } catch (error) {
            console.error("요청 실패:", error);
        }
    }

    // effect: autoSerchVisible GET 요청 //
    useEffect(() => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) {
            alert('토큰 오류');
            return;
        }
        const handler = setTimeout(() => {
            getSearchDiscussionListRequest(searched, accessToken)
                .then(getDiscussionListResponse);
        }, DEBOUNCE_DELAY);
        return () => {
            clearTimeout(handler);
        };
    }, [searched]);

    // effect: 컴포넌트 로드시 일반 토론방 리스트 불러오기 함수 //
    useEffect(()=>{

        getDiscussionList();
        if (!category) return;
        setCategoryItem(category);

    }, [category]);

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
                                    className={`top-category ${categoryItem === type ? 'active' : ''}`}
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
                                    <input type="text" className="search-input" placeholder="검색어를 입력해주세요." value={searched} onChange={onSearchedChangeHandler} onKeyDown={handleKeyDown} />
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
                        {(categoryItem === '전체' ? viewList : originalList.filter(discussionList => discussionList.discussionType === categoryItem))
                            .map((discussionList, index) => (
                                <TableRow
                                    key={index}
                                    discussionList={discussionList}
                                    getDiscussionList={getDiscussionList}
                                    postLike={(targetId:number, userId:string, likeType:string,event) => onLikeClickHandler(targetId, userId, likeType, event)}
                                    click={likeClick}
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