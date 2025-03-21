import React, { MouseEvent, useEffect, useRef, useState } from "react";
import './style.css';
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, GEN_DISC_DETAIL_ABSOLUTE_PATH, MY_ABSOLUTE_UPDATE_PATH } from "../../constants";
import { useSignInUserStore } from "../../stores";
import { useCookies } from "react-cookie";
import { deleteMyDiscussionRequest, getMyDiscussionRequest } from "../../apis";
import GetMyDiscussionListResposneDto from "../../apis/dto/response/mypage/myInfo/get-my-discussion-list.response.dto";
import ResponseDto from "../../apis/dto/response/response.dto";
import MyDiscussion from "../../types/my-discussion.interface";
import MypageSidebar from "../../components/mypage/sidebar";
import { compareTimes } from "../../components/compare-time/compare_time";

interface DiscussionRowProps {
    discussion: MyDiscussion;
}

// component: 내가 개설한 토론 리스트 //
function RoomList({discussion}: DiscussionRowProps) {

    // state: 내가 개설한 게시글 상태 //
    const [cookies, setCookie] = useCookies();

    const {signInUser} = useSignInUserStore();
    // variable: 엑세스 토큰 //
    const accessToken = cookies[ACCESS_TOKEN];

    // function: navigate 함수 처리 //
    const navigator = useNavigate();

    // event handler: 게시글 클릭 이벤트 핸들러 //
    const onDiscussionClickHandler = () => {
        navigator(GEN_DISC_DETAIL_ABSOLUTE_PATH(discussion.roomId));
    }

    // event handler: 게시물 삭제 이벤트 핸들러 //
    const onDeleteDiscussion = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        if (!accessToken || !discussion.roomId || !signInUser?.userId) return;
        let answer = window.confirm("정말 삭제하시겠습니까?");
        if(answer) {
            if(!accessToken || !discussion.roomId) return;
            deleteMyDiscussionRequest(accessToken, discussion.roomId, signInUser?.userId).then(deleteRoomResponse);
        }else return;
    }

    // function: 게시물 삭제 응답 처리 //
    const deleteRoomResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '일치하는 정보가 없습니다.' :
            responseBody.code === 'AF' ? '일치하는 정보가 없습니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
            responseBody.code === 'NR' ? '존재하지 않는 사용자입니다.' : '';
                
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
                
        if (!isSuccessed) {
            alert(message);
            return;
        } else {
            alert("삭제되었습니다.");
            window.location.reload();
        }
    }

    // render: 내가 개설한 토론 리스트 렌더링 //
    return (
        <div className="discussion-room-list" onClick={onDiscussionClickHandler}>
            <div className="discussion-image" style={{backgroundImage: `url(${discussion.discussionImage})`}}></div>
            <div className="discussion-info">
                <div className="discussion-title-box">
                    <div className="discussion-title">{discussion.roomTitle}</div>
                    <div className="discussion-icon-box">
                        <div className="discussion-icon" onClick={onDeleteDiscussion}></div>
                    </div>
                </div>
                <div className="discussion-contents">{discussion.roomDescription}</div>
                <div className="discussion-bottom">
                    <div className="discussion-bottom-box">
                        <div className="discussion-created">{discussion.createdRoom}</div>
                        {compareTimes(discussion.discussionEnd) ? 
                            <div className="discussion-state-box continue">
                                <div className="discussion-state ">진행 중</div>
                            </div> 
                        :    
                            <div className="discussion-state-box end">
                                <div className="discussion-state ">마감</div>
                            </div>
                        }
                    </div>
                    <div className="discussion-icons">
                        <div className="discussion-comment-icon"></div>
                        <div className="discussion-comment">{discussion.commentCount}</div>
                        <div className="discussion-like-icon"></div>
                        <div className="discussion-like">{discussion.likeCount}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}


// component: 마이페이지 컴포넌트 //
export default function Mypage() {

    // state: 로그인 유저 정보 상태 //
    const { signInUser, setSignInUser } = useSignInUserStore();

    // state: 마이페이지 상태 //
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [stateType, setStateType] = useState<string>("진행 중");
    const [cookies, setCookie] = useCookies();
    const [discussionList, setDiscussionList] = useState<MyDiscussion[]>([]);
    const [profileImage, setProfileImage] = useState<string>('');
    
    // variable: 자기자신 확인 //
    const accessToken = cookies[ACCESS_TOKEN];

    // function: 네비게이터 함수 처리 //
    const navigator = useNavigate();

    // event handler: 내 정보 수정 클릭 이벤트 처리 함수 //
    const onUpdateButtonHandler = () => {
        navigator(MY_ABSOLUTE_UPDATE_PATH);
    }

    // event handler: 토론방 상태 클릭 이벤트 처리 함수 //
    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    // event handler: 토론방 상태 클릭 이벤트 처리 //
    const onStateTypeSelect = (type: string) => {
        setStateType(type);
        setIsDropdownOpen(false); // 선택 후 닫기
    };

    // event handler: 토론방 상태에 따른 정렬 함수 //
    const filteredDiscussions = discussionList.filter(
        (discussion) => 
            (stateType === "진행 중" && compareTimes(discussion.discussionEnd)) ||
            (stateType === "마감" && !compareTimes(discussion.discussionEnd))
    );

    // function: 내가 작성한 게시글 불러오기 처리 함수 //
    const getMyDiscussionResponse = (responseBody: GetMyDiscussionListResposneDto | ResponseDto | null) => {
        
        if(!signInUser) return;

        if(signInUser.profileImage) setProfileImage(signInUser.profileImage);
        else setProfileImage("http://localhost:3000/defaultProfile.png");
        
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '일치하는 정보가 없습니다.' :
            responseBody.code === 'AF' ? '일치하는 정보가 없습니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
            responseBody.code === 'NI' ? '존재하지 않는 사용자입니다.' : '';
                
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
                
        if (!isSuccessed) {
            alert(message);
            return;
        } else {
            const {myDiscussions} = responseBody as GetMyDiscussionListResposneDto;
            setDiscussionList(myDiscussions);
        }
    }

    // effect: //
    useEffect(()=> {
        if(!accessToken || !signInUser) return;
        getMyDiscussionRequest(accessToken).then(getMyDiscussionResponse);
    }, [signInUser]);

    // effect: //
    useEffect(() => {
        const handleClickOutside = (event: globalThis.MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
    
        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
    
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    // render: 마이페이지 화면 렌더링 //
    return (
        <div className="mypage-wrapper">
            <MypageSidebar />
            <div className="mypage-main-wrapper">
                <div className="user-box">
                    <div id="main-profile" style={{ backgroundImage: `url(${profileImage})` }}></div>
                    <div className="mypage-info">
                        <div className="mypage-info-top">
                            <div className="mypage-info-top-a">
                                <div className="mypage-nickname">{signInUser?.nickName}</div>
                            </div>
                            <div className="top-icon-setting" onClick={onUpdateButtonHandler}></div>
                        </div>
                        <div className="mypage-id">@{signInUser?.userId}</div>
                        <div className="mypage-info-bottom">
                            <div className="mypage-user">구독자 <strong>{signInUser?.subscribersCount}</strong></div>
                            <div className="mypage-user">토론방 <strong>{discussionList.length}</strong></div>
                        </div>
                        <div className="mypage-state-message">{signInUser?.statusMessage}</div>
                    </div>
                </div>

                <div className="mypage-discussion-room-top">
                    <div className="mypage-discussion-room">내가 개설한 토론방</div>
                    <div className="discussion-state-box" ref={dropdownRef}>
                        <div className="selected-state" onClick={toggleDropdown}>{stateType} ▼</div>  
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-item" onClick={() => onStateTypeSelect("진행 중")}>진행 중</div>
                                <div className="dropdown-item" onClick={() => onStateTypeSelect("마감")}>마감</div>
                            </div>
                        )}
                    </div>
                </div>

                {filteredDiscussions.map((discussion) => (<RoomList key={discussion.roomId} discussion={discussion}/>))}
                
            </div>
        </div>
    )
}