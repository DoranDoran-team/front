import React, { useEffect, useState } from 'react';
import './style.css';
import AccuseModal from '../../../components/modal/accuse';
import { getDiscussionRequest, postCommentRequest } from '../../../apis';
import Comment from '../../../types/Comment.interface';
import { usePagination } from '../../../hooks';
import PostCommentRequestDto from '../../../apis/dto/request/comment/post-comment.request.dto';
import { useParams } from 'react-router';
import { postAccuseRequest } from '../../../apis';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN } from '../../../constants';
import ResponseDto from '../../../apis/dto/response/response.dto';
import { GetDiscussionResponseDto } from '../../../apis/dto/response/gd_discussion';
import DiscussionData from '../../../types/discussionData.interface';
import { useSignInUserStore } from '../../../stores';
import { PostAccuseRequestDto } from '../../../apis/dto/request/accuse';

interface voteProps {
    agreeOpinion: string | undefined;
    oppositeOpinion: string | undefined;
}

// component: 찬/반 의견 선택 컴포넌트 //
function OpinionSelector({ agreeOpinion, oppositeOpinion }: voteProps) {
    const [selectedOpinion, setSelectedOpinion] = useState<string>('');
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [opinionAUsers, setOpinionAUsers] = useState<number>(27); // 의견 A 유저 비율
    const [opinionBUsers, setOpinionBUsers] = useState<number>(73); // 의견 B 유저 비율

    const handleOpinionChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        setSelectedOpinion(event.target.value);
    };

    const handleSubmit = () => {
        if (selectedOpinion) {
            setSubmitted(true);
        } else {
            alert("의견을 선택해 주세요.");
        }
    };

    return (
        <div>
            <div className='vote-opinions'>
                <div>
                    <label>
                        <input
                            type="radio"
                            value="A"
                            checked={selectedOpinion === 'A'}
                            onChange={handleOpinionChange}
                        />
                        {agreeOpinion}
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="B"
                            checked={selectedOpinion === 'B'}
                            onChange={handleOpinionChange}
                        />
                        {oppositeOpinion}
                    </label>
                </div>
                <button className='vote-select-button' onClick={handleSubmit}>선택 완료하기</button>
            </div>

            {submitted && (
                <div className="bar-container">
                    <div className="bar">
                        <div className="bar-a" style={{ width: `${opinionAUsers}%` }} />
                        <div className="bar-b" style={{ width: `${opinionBUsers}%` }} />
                    </div>
                    <div className="percentage-labels">
                        <span className="label-a">{opinionAUsers}%</span>
                        <span className="label-b">{opinionBUsers}%</span>
                    </div>
                </div>
            )}
        </div>
    );
};

// component: 일반 토론방 컴포넌트 //
export default function GDDetail() {

    // state: 로그인 유저 정보 상태 //
    const { signInUser } = useSignInUserStore();
    const discussionId = signInUser?.userId;

    const { roomId } = useParams();
    const roomIdNumber = Number(roomId);
    const [discussionData, setDiscussionData] = useState<DiscussionData | null>(null);
    const [cookies] = useCookies();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDropdownOptionOpen, setIsDropdownOptionOpen] = useState(false);
    const [isDropdownCommentOptionOpen, setIsDropdownCommentOptionOpen] = useState(false);
    const [commentOptions, setCommentOptions] = useState<{ [key: number]: boolean }>({});
    const [selectedOption, setSelectedOption] = useState<string>('정렬순');
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const [replyContent, setReplyContent] = useState<{ [key: number]: string }>({});
    const [replyTo, setReplyTo] = useState<number | null>(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedReportReason, setSelectedReportReason] = useState<string | null>(null);
    const [clicked, setClicked] = useState<boolean>(false);


    // state: 원본 리스트 상태 //
    const [originalList, setOriginalList] = useState<Comment[]>([]);

    // state: 페이징 관련 상태 //
    const {
        currentPage,
        viewList,
        pageList,
        setTotalList,
        initViewList } = usePagination<Comment>();

    const openReportModal = () => {
        setIsReportModalOpen(!isReportModalOpen);
    };


    const closeReportModal = () => {
        setIsReportModalOpen(!isReportModalOpen);
    };


    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleDropdownOption = () => {
        setIsDropdownOptionOpen(!isDropdownOptionOpen);
    };

    const toggleCommentOptions = (commentId: number) => {
        setCommentOptions((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    const handleOptionSelect = (option: string) => {
        if (option === '수정하기' || option === '삭제하기') {
            setIsDropdownOptionOpen(false);
            setIsDropdownCommentOptionOpen(false);
            console.log(`선택한 옵션: ${option}`);
        } else {
            setSelectedOption(option);
            setIsDropdownOptionOpen(false);
            setIsDropdownCommentOptionOpen(false);
            console.log(`선택한 정렬순: ${option}`);
        }
    };


    const handleReplySubmit = (commentId: number) => {
        const currentDate = new Date().toLocaleString();
        const newReply = {
            user: 'reply_user',
            content: replyContent[commentId],
            date: currentDate
        };
        const updatedComments = comments.map(comment => {
            if (comment.commentId === commentId) {
                return { ...comment, replies: [...comment.replies, newReply] };
            }
            return comment;
        });
        // setComments(updatedComments);
        setReplyContent({ ...replyContent, [commentId]: '' });
        setReplyTo(null);
    };

    const handleCancelReply = () => {
        setReplyTo(null);
        setReplyContent({});
    };

    const handleEditComment = (commentId: number) => {
        // 수정 로직 구현해야 합니다!
        console.log(`댓글 ${commentId} 수정하기`);
    };

    const handleDeleteComment = (commentId: number) => {
        const updatedComments = comments.filter(comment => comment.commentId !== commentId);
        setComments(updatedComments);
        console.log(`댓글 ${commentId} 삭제하기`);
    };

    // function: post comment response 처리 함수 //
    const postCommentResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다. ' :
                responseBody.code === 'AF' ? '접근이 잘못되었습니다. ' :
                    responseBody.code === 'NR' ? '존재하지 않는 토론방입니다. ' :
                        responseBody.code === 'DBE' ? '서버에 문제가 있습니다. ' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
    }

    // event handler: 댓글 작성하기 버튼 클릭 이벤트 처리 //
    const handleCommentSubmit = () => {

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken || !discussionId || !roomId) return;

        const requestBody: PostCommentRequestDto = {
            userId: discussionId, commentContents: newComment, discussionType: '찬성'
        }
        postCommentRequest(requestBody, roomId, accessToken).then(postCommentResponse);
        setNewComment('');
        setClicked(!clicked);
    };

    // function: get dicussion list response 처리 //
    const getDiscussionResponse = (responseBody: GetDiscussionResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다. ' :
                responseBody.code === 'DBE' ? '서버에 문제가 있습니다. ' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
        if ("discussionResultSet" in responseBody) {
            setDiscussionData(responseBody.discussionResultSet);
            setComments(responseBody.comments);
            console.log(responseBody.comments);
            setTotalList(responseBody.comments);
            setOriginalList(responseBody.comments);
        } else {
            alert('서버 응답이 올바르지 않습니다.');
        }
    }

    // function: 토론 정보 불러 오기 함수 //
    const getDiscussion = () => {

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) {
            alert('토큰 오류');
            return;
        }

        if (roomId) {
            getDiscussionRequest(roomIdNumber, accessToken).then(getDiscussionResponse);
        }
    }

    // Effect: 토론 정보 불러오기 //
    useEffect(() => {
        getDiscussion();
    }, [roomId]);

    return (
        <div id="gd-detail-wrapper">
            <div className="gd-detail-wrapper-in">
                <div className='gd-detail-box'>
                    <div className="gd-detail-category">

                        <div className="width-line"><span>{discussionData?.discussionType}</span></div>
                    </div>
                    <div className="post-info">
                        <div className="post-user-info">
                            <div className="profile-image" style={{ backgroundImage: `url(${discussionData?.profileImage || `url('../../../image/profile.png');`})` }}></div>
                            <div>
                                <div className='user-nickname'>{discussionData?.nickName}</div>
                                <div className='post-date-and-modify'>
                                    <div className="post-date">{discussionData?.createdRoom}</div>
                                    <div className="modify">{discussionData?.updateStatus ? '(수정됨)' : ''}</div>
                                </div>
                            </div>
                        </div>
                        <div className='status-and-option'>
                            <div className='status'>진행 중</div>
                            {discussionId === discussionData?.userId ? (
                                <div className='option' onClick={toggleDropdownOption}>⋮</div>
                            ) : (

                                <div className="siren-button" onClick={() => openReportModal()}></div>
                            )}
                        </div>
                    </div>
                    {isDropdownOptionOpen && (
                        <div className='dropdown-menu-box'>
                            <div className='dropdown-menu'>
                                <div className='dropdown-item' onClick={() => handleOptionSelect('수정하기')}>수정하기</div>
                                <div className='dropdown-item' onClick={() => handleOptionSelect('삭제하기')}>삭제하기</div>
                            </div>
                        </div>
                    )}
                    {isReportModalOpen && (
                        <AccuseModal cancelHandler={closeReportModal} discussionData={discussionData} />
                    )}
                    <div className="discussion-info">
                        <div className="discussion-image" style={{ backgroundImage: `url(${discussionData?.discussionImage})` }}></div>
                        <div className="discussion-text-info">
                            <div className="discussion-title">{discussionData?.roomTitle}</div>
                            <div className="deadline">마감: {discussionData?.discussionEnd}</div>
                            <div className="discussion-content">{discussionData?.roomDescription}</div>
                        </div>
                    </div>
                    <div className="vote-info">
                        <OpinionSelector agreeOpinion={discussionData?.agreeOpinion} oppositeOpinion={discussionData?.oppositeOpinion} />
                    </div>
                    <div className="comment-and-recommendation">
                        <div className="comment-icon"></div>
                        <div className="comment-count">{discussionData?.commentCount}</div> {/* 댓글 수 */}
                        <div className="recommendation-icon"></div>
                        <div className="recommendation-count">{discussionData?.likeCount}</div>
                    </div>
                    <hr />
                    <div className='comment-box'>
                        <div className='comment-input-and-button'>
                            <div className='input-comment'>
                                <textarea
                                    className='input-comment-text'
                                    placeholder='댓글을 입력해주세요.'
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                            </div>
                            <div className='comment-button-box'>
                                <button className='comment-button' type='button' onClick={handleCommentSubmit}>작성하기</button>
                            </div>
                        </div>
                    </div>
                    <div className='sequence-choice'>
                        <button className='sequence-choice-button' type='button' onClick={toggleDropdown}>{selectedOption}</button>
                    </div>

                    {isDropdownOpen && (
                        <div className='dropdown-menu-box'>
                            <div className='dropdown-menu'>
                                <div className='dropdown-item' onClick={() => handleOptionSelect('최신순')}>최신순</div>
                                <div className='dropdown-item' onClick={() => handleOptionSelect('추천순')}>추천순</div>
                            </div>
                        </div>
                    )}

                    {viewList.map(comment => (
                        <div key={comment.commentId} className='comment-info'>
                            <div className="comment-user-info">
                                <div className='comment-user'>
                                    <div className="profile-image"></div>
                                    <div>
                                        <div className='comment-user-nickname'>{comment.nickName}</div>
                                        <div className='comment-date-and-modify'>
                                            <div className="comment-date">{comment.commentTime}</div>
                                            <div className="modify">(수정됨)</div>
                                        </div>
                                    </div>
                                </div>
                                <div className='comment-recommendation-icon-and-count'>
                                    <div className='recommendation-icon'></div>
                                    <div className='recommendation-count'>8</div>
                                    {comment.nickName === 'comment_user' ? (
                                        <div className='comment-option' onClick={() => toggleCommentOptions(comment.commentId)}>⋮</div>
                                    ) : (
                                        <div className='siren-button' onClick={() => openReportModal()}></div>
                                    )}
                                </div>
                            </div>
                            {commentOptions[comment.commentId] && (
                                <div className='dropdown-menu-box'>
                                    <div className='dropdown-menu'>
                                        <div className='dropdown-item' onClick={() => handleEditComment(comment.commentId)}>수정하기</div>
                                        <div className='dropdown-item' onClick={() => handleDeleteComment(comment.commentId)}>삭제하기</div>
                                    </div>
                                </div>
                            )}
                            <div className="comment-content">{comment.commentContents}</div>
                            <div className="reply"><span onClick={() => setReplyTo(comment.commentId)}>댓글 쓰기</span></div>
                            <hr />
                            {replyTo === comment.commentId && (
                                <div className='reply-box' style={{ marginLeft: '20px', marginRight: '0' }}>
                                    <div className='reply-textarea-and-button'>
                                        <textarea
                                            className='input-reply-text'
                                            defaultValue={`@${comment.nickName}`}
                                            onChange={(e) => setReplyContent({ ...replyContent, [comment.commentId]: e.target.value })}
                                        />
                                        <div className='comment-button-box'>
                                            <button className='comment-button' type='button' onClick={handleCancelReply}>취소</button>
                                            {/* <button className='comment-button' type='button' onClick={() => handleReplySubmit(comment.commentId)}>작성하기</button> */}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {comment.replies && comment.replies.map((reply, index) => (
                                <div key={index} className="reply" style={{ marginLeft: '20px' }}>
                                    <div className="comment-user-info">
                                        <div className='comment-user'>
                                            <div className="profile-image"></div>
                                            <div>
                                                <div className='comment-user-nickname'>{reply.nickName}</div>
                                                <div className='comment-date-and-modify'>
                                                    <div className="comment-date">{reply.replyTime}</div>
                                                    <div className="modify">(수정됨)</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='reply-option'>
                                            <div className='comment-recommendation-icon-and-count'>
                                                <div className='recommendation-icon'></div>
                                                <div className='recommendation-count'>8</div>
                                            </div>
                                            <div className='comment-option' onClick={() => toggleCommentOptions(reply.replyId)}>⋮</div>
                                            {commentOptions[reply.replyId] && (
                                                <div className='dropdown-menu-box'>
                                                    <div className='dropdown-menu'>
                                                        <div className='dropdown-item' onClick={() => handleEditComment(reply.replyId)}>수정하기</div>
                                                        <div className='dropdown-item' onClick={() => handleDeleteComment(reply.replyId)}>삭제하기</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="comment-content">{reply.replyContents}</div>
                                    <hr />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


