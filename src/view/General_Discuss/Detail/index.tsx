import React, { useEffect, useState } from 'react';
import './style.css';
import { useParams } from 'react-router';
import { getDiscussionResquest, postAccuseRequest } from '../../../apis';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN } from '../../../constants';
import ResponseDto from '../../../apis/dto/response/response.dto';
import { GetDiscussionResponseDto } from '../../../apis/dto/response/gd_discussion';
import DiscussionData from '../../../types/discussionData.interface';
import { useSignInUserStore } from '../../../stores';
import { PostAccuseRequestDto } from '../../../apis/dto/request/accuse';

// component: 일반 토론방 컴포넌트 //
export default function GDDetail() {

    // state: 로그인 유저 정보 상태 //
    const { signInUser, setSignInUser } = useSignInUserStore();
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
    const [comments, setComments] = useState<{ id: number; user: string; content: string; date: string; replies: any[] }[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const [replyContent, setReplyContent] = useState<{ [key: number]: string }>({});
    const [replyTo, setReplyTo] = useState<number | null>(null);

    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedReportReason, setSelectedReportReason] = useState<string | null>(null);

    const openReportModal = () => {
        setIsReportModalOpen(true);
    };

    const closeReportModal = () => {
        setIsReportModalOpen(false);
        setSelectedReportReason(null);
    };

    // function: 신고 사유 작성 //
    const handleReportSubmit = () => {
        if (!selectedReportReason) {
            alert('신고 사유를 선택해 주세요.');
            return;
        }
        closeReportModal();

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) {
            alert('토큰 오류');
            return;
        }

        const formatDate = (date: Date): string => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 1월 = 0이므로 +1 필요
            const day = String(date.getDate()).padStart(2, '0');

            const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
            const dayOfWeek = days[date.getDay()];

            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');

            return `${year}. ${month}. ${day}. ${dayOfWeek} ${hours}:${minutes}`;
        };

        const now = new Date();
        const accuseDate = formatDate(now);

        const requestBody: PostAccuseRequestDto = {
            reportType: 'POST',
            reportContents: selectedReportReason,
            userId: discussionId as string,
            accuseUserId: discussionData?.userId as string,
            postId: discussionData?.roomId as number,
            replyId: null,
            accuseDate: accuseDate
        }
        postAccuseRequest(requestBody, accessToken).then(postAccuseResponse);
    };

    // function: post accuse response 처리 함수 //
    const postAccuseResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'VF' ? '유효하지 않은 데이터입니다.' :
                    responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                        responseBody.code === 'NS' ? '자기신이 올린 글은 신고가 불가능 합니다.' :
                            responseBody.code === 'NT' ? '신고할려는 항목이 존재하지 않습니다.' :
                                responseBody.code === 'DA' ? '이미 신고를 하셨습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        alert('정상적으로 신고가 접수되었습니다.');
    }

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

    const handleCommentSubmit = () => {
        const currentDate = new Date().toLocaleString();
        const newCommentObj = {
            id: comments.length + 1,
            user: 'user_nickname',
            content: newComment,
            date: currentDate,
            replies: []
        };
        setComments([...comments, newCommentObj]);
        setNewComment('');
    };

    const handleReplySubmit = (commentId: number) => {
        const currentDate = new Date().toLocaleString();
        const newReply = {
            user: 'reply_user',
            content: replyContent[commentId],
            date: currentDate
        };
        const updatedComments = comments.map(comment => {
            if (comment.id === commentId) {
                return { ...comment, replies: [...comment.replies, newReply] };
            }
            return comment;
        });
        setComments(updatedComments);
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
        const updatedComments = comments.filter(comment => comment.id !== commentId);
        setComments(updatedComments);
        console.log(`댓글 ${commentId} 삭제하기`);
    };

    // function: 찬반 의견 //
    const OpinionSelector = () => {
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
                            {discussionData?.agreeOpinion}
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="B"
                                checked={selectedOpinion === 'B'}
                                onChange={handleOpinionChange}
                            />
                            {discussionData?.oppositeOpinion}
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
            getDiscussionResquest(roomIdNumber, accessToken).then(getDiscussionResponse);
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
                                    <div className="post-date">2024.12.30.16:00</div>
                                    <div className="modify">(수정됨)</div>
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
                        <div className="report-modal">
                            <div className="report-modal-content">
                                <h3>신고 사유 선택</h3>
                                <div className='report-modal-labels'>
                                    <div>
                                        <label>
                                            <input
                                                type="radio"
                                                value="폭력성"
                                                checked={selectedReportReason === '폭력성'}
                                                onChange={(e) => setSelectedReportReason(e.target.value)}
                                            />
                                            폭력성
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            <input
                                                type="radio"
                                                value="선정성"
                                                checked={selectedReportReason === '선정성'}
                                                onChange={(e) => setSelectedReportReason(e.target.value)}
                                            />
                                            선정성
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            <input
                                                type="radio"
                                                value="따돌림 또는 왕따"
                                                checked={selectedReportReason === '따돌림 또는 왕따'}
                                                onChange={(e) => setSelectedReportReason(e.target.value)}
                                            />
                                            따돌림 또는 왕따
                                        </label>
                                    </div>
                                    <label>
                                        <input
                                            type="radio"
                                            value="도배"
                                            checked={selectedReportReason === '도배'}
                                            onChange={(e) => setSelectedReportReason(e.target.value)}
                                        />
                                        도배
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="개인정보 유출"
                                            checked={selectedReportReason === '개인정보 유출'}
                                            onChange={(e) => setSelectedReportReason(e.target.value)}
                                        />
                                        개인정보 유출
                                    </label>
                                </div>
                                <div className="modal-buttons">
                                    <button onClick={closeReportModal}>취소</button>
                                    <button onClick={handleReportSubmit}>신고하기</button>
                                </div>
                            </div>
                        </div>
                    )}


                    <div className="discussion-info">
                        <div className="discussion-image">이미지 자리</div>
                        <div className="discussion-text-info">
                            <div className="discussion-title">{discussionData?.roomTitle}</div>
                            <div className="deadline">마감: {discussionData?.discussionEnd}</div>
                            <div className="discussion-content">{discussionData?.roomDescription}</div>
                        </div>
                    </div>
                    <div className="vote-info">
                        <OpinionSelector />
                    </div>
                    <div className="comment-and-recommendation">
                        <div className="comment-icon"></div>
                        <div className="comment-count">{comments.length}</div> {/* 댓글 수 */}
                        <div className="recommendation-icon"></div>
                        <div className="recommendation-count">127</div>
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

                    {comments.map(comment => (
                        <div key={comment.id} className='comment-info'>
                            <div className="comment-user-info">
                                <div className='comment-user'>
                                    <div className="profile-image"></div>
                                    <div>
                                        <div className='comment-user-nickname'>{comment.user}</div>
                                        <div className='comment-date-and-modify'>
                                            <div className="comment-date">{comment.date}</div>
                                            <div className="modify">(수정됨)</div>
                                        </div>
                                    </div>
                                </div>
                                <div className='comment-recommendation-icon-and-count'>
                                    <div className='recommendation-icon'></div>
                                    <div className='recommendation-count'>8</div>
                                    {comment.user === 'comment_user' ? (
                                        <div className='comment-option' onClick={() => toggleCommentOptions(comment.id)}>⋮</div>
                                    ) : (
                                        <div className='siren-button' onClick={() => openReportModal()}></div>
                                    )}
                                </div>
                            </div>
                            {commentOptions[comment.id] && (
                                <div className='dropdown-menu-box'>
                                    <div className='dropdown-menu'>
                                        <div className='dropdown-item' onClick={() => handleEditComment(comment.id)}>수정하기</div>
                                        <div className='dropdown-item' onClick={() => handleDeleteComment(comment.id)}>삭제하기</div>
                                    </div>
                                </div>
                            )}
                            <div className="comment-content">{comment.content}</div>
                            <div className="reply"><span onClick={() => setReplyTo(comment.id)}>댓글 쓰기</span></div>
                            <hr />
                            {replyTo === comment.id && (
                                <div className='reply-box' style={{ marginLeft: '20px', marginRight: '0' }}>
                                    <div className='reply-textarea-and-button'>
                                        <textarea
                                            className='input-reply-text'
                                            defaultValue={`@${comment.user}`}
                                            onChange={(e) => setReplyContent({ ...replyContent, [comment.id]: e.target.value })}
                                        />
                                        <div className='comment-button-box'>
                                            <button className='comment-button' type='button' onClick={handleCancelReply}>취소</button>
                                            <button className='comment-button' type='button' onClick={() => handleReplySubmit(comment.id)}>작성하기</button>
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
                                                <div className='comment-user-nickname'>{reply.user}</div>
                                                <div className='comment-date-and-modify'>
                                                    <div className="comment-date">{reply.date}</div>
                                                    <div className="modify">(수정됨)</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='reply-option'>
                                            <div className='comment-recommendation-icon-and-count'>
                                                <div className='recommendation-icon'></div>
                                                <div className='recommendation-count'>8</div>
                                            </div>
                                            <div className='comment-option' onClick={() => toggleCommentOptions(reply.id)}>⋮</div>
                                            {commentOptions[reply.id] && (
                                                <div className='dropdown-menu-box'>
                                                    <div className='dropdown-menu'>
                                                        <div className='dropdown-item' onClick={() => handleEditComment(reply.id)}>수정하기</div>
                                                        <div className='dropdown-item' onClick={() => handleDeleteComment(reply.id)}>삭제하기</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="comment-content">{reply.content}</div>
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

