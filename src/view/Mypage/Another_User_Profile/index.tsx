import React, { MouseEvent, useEffect, useRef, useState } from 'react'
import './style.css'
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN, GEN_DISC_DETAIL_ABSOLUTE_PATH, MAIN_ABSOLUTE_PATH, SELECTED_USER } from '../../../constants';
import { cancleFollowRequest, deleteMyDiscussionRequest, getUserProfileRequest, postUserFollowRequest } from '../../../apis';
import GetUserProfileResponseDto from '../../../apis/dto/response/mypage/another_user/get-user-profile.response.dto';
import ResponseDto from '../../../apis/dto/response/response.dto';
import MyDiscussion from '../../../types/my-discussion.interface';
import { useSignInUserStore } from '../../../stores';
import { getCookie } from '../../../components/get-user-cookie/get.user.cookie';
import PostUserFollowRequestDto from '../../../apis/dto/request/follow/post-user-follow.request.dto';
import { useNavigate } from 'react-router-dom';
import { compareTimes } from '../../../components/compare-time/compare_time';

// interface: //
interface DiscussionRowProps {
    discussion: MyDiscussion;
}

// component: 내가 개설한 토론 리스트 //
function RoomList({discussion}: DiscussionRowProps) {

    // function: navigate 함수 처리 //
    const navigator = useNavigate();

    // event handler: 게시글 클릭 이벤트 핸들러 //
    const onDiscussionClickHandler = () => {
        navigator(GEN_DISC_DETAIL_ABSOLUTE_PATH(discussion.roomId));
    }

    // render: 내가 개설한 토론 리스트 렌더링 //
    return (
        <div className="discussion-room-list" onClick={onDiscussionClickHandler}>
            <div className="discussion-image" style={{backgroundImage: `url(${discussion.discussionImage})`}}></div>
            <div className="discussion-info">
                <div className="discussion-title-box">
                    <div className="discussion-title">{discussion.roomTitle}</div>
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

// component: 타 유저 프로필 컴포넌트 //
export default function UserProfile() {

    // state: //
    const [cookies, setCookie] = useCookies();
    const { signInUser, setSignInUser } = useSignInUserStore();
    const userId = getCookie(SELECTED_USER);
    
    const [discussionList, setDiscussionList] = useState<MyDiscussion[]>([]);
    const [nickName, SetNickName] = useState<string>('');
    const [message, setMessage] = useState<string>(''); 
    const [subscribers, setSubscribers] = useState<number>(0);
    const [profileImage, setProfileImage] = useState<string>('');
    const [subscribe, setSubscribe] = useState<boolean>(false);
    const [role, setRole] = useState<boolean>(false);

    // state: 드롭다운 메뉴 상태 //
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [stateType, setStateType] = useState<string>("진행 중");

    // variable: //
    const accessToken = cookies[ACCESS_TOKEN];
    const isUser = signInUser?.userId === userId; // 로그인한 사람이 본인인지 확인

    const navigator = useNavigate();

    // event handler: 구독 버튼 클릭 이벤트 처리 함수 //
    const onSubscribeButtonHandler = () => {
        if(!accessToken || !signInUser?.userId || !userId) return;
    
        const requestBody : PostUserFollowRequestDto = {
            userId: userId,
            subscriber: signInUser.userId
        }
        postUserFollowRequest(requestBody, accessToken).then(postUserFollowResponse);
    }
    
    // event handler: 구독 취소 버튼 이벤트 처리 함수 //
    const onSubscribeCancleHandler = () => {
        if(!accessToken || !signInUser?.userId || !userId) return;
        cancleFollowRequest(signInUser.userId, userId, accessToken).then(cancleFollowResponse);
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

    // function: 타 유저 프로필 가져오기 응답 함수 //
    const getUserProfileResponse = (responseBody: GetUserProfileResponseDto | ResponseDto | null) => {
    
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
            const {myDiscussions, profileImage, nickName, statusMessage, subscribers, role} = responseBody as GetUserProfileResponseDto;
            setDiscussionList(myDiscussions);
            SetNickName(nickName);
            setMessage(statusMessage);
            setProfileImage(profileImage);
            setSubscribers(subscribers);
            setRole(role);
        }
    }

    // function: 구독 후 응답 처리 함수 //
    const postUserFollowResponse = (responseBody: ResponseDto | null) => {
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
            setSubscribe(true);
            window.location.reload();
        }
    }

    // function: 구독 취소 후 응답 처리 함수 //
    const cancleFollowResponse = (responseBody: ResponseDto | null) => {
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
            setSubscribe(false);
            alert("구독 취소되었습니다.");
            window.location.reload();
        }
    }

    // effect: //
    useEffect(()=> {
    if(!accessToken || !userId || !signInUser) return;
    
    const isSubscribed = signInUser.subscribers.some(sub => sub.userId === userId);
    setSubscribe(isSubscribed);  // 상태 업데이트
    
    getUserProfileRequest(accessToken, userId).then(getUserProfileResponse);

    }, [signInUser, userId, accessToken]);

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
    }, [isDropdownOpen])

    // effect: 일반 유저는 관리자 페이지를 못 들어가도록 막음 //
    useEffect(() => {
        if(!signInUser?.role && role) {
            console.log("권한 확인", signInUser?.role, role);
            alert("접근 권한이 없습니다.");
            navigator(MAIN_ABSOLUTE_PATH);
        }
    }, [signInUser, role]);

    // render: 타 유저 프로필 렌더링 //
    return (
        <div className="mypage-wrapper">
            <div className="mypage-main-wrapper">
                <div className="user-box">
                    <div id="main-profile" style={{ backgroundImage: `url(${profileImage})` }}></div>
                    <div className="mypage-info">
                        <div className="mypage-info-top">
                            <div className="mypage-info-top-a">
                                <div className="mypage-nickname">{nickName}</div>
                                <div className="subscribe-button-box">
                                    {signInUser?.role ? <div /> // 활동 중지 관련 버튼 생성 필요
                                    : 
                                        (subscribe? 
                                            <div className="subscribe-button" onClick={onSubscribeCancleHandler}>구독 취소</div>
                                        : 
                                            <div className="subscribe-button" onClick={onSubscribeButtonHandler}>구독</div>
                                        )
                                    }
                                </div>

                            </div>
                        </div>
                        <div className="mypage-id">@{userId}</div>
                        <div className="mypage-info-bottom">
                            <div className="mypage-user">구독자 <strong>{subscribers}</strong></div>
                            <div className="mypage-user">토론방 <strong>{discussionList.length}</strong></div>
                        </div>
                        <div className="mypage-state-message">{message}</div>
                    </div>
        
                    {!isUser ? 
                        <div className="subscribe-button-box" onClick={onSubscribeButtonHandler}></div> 
                    : 
                        ''
                    }
                </div>
        
                <div className="mypage-discussion-room-top">
                    <div className="mypage-discussion-room">{nickName} 님이 개설한 토론방</div>
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
