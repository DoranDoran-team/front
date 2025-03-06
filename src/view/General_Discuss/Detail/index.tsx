import React, { useEffect, useState } from 'react';
import './style.css';
import AccuseModal from '../../../components/modal/accuse';
import { deleteCommentRequest, getDiscussionRequest, patchCommentRequest, postCommentRequest } from '../../../apis';
import Comment from '../../../types/Comment.interface';
import { usePagination } from '../../../hooks';
import PostCommentRequestDto from '../../../apis/dto/request/comment/post-comment.request.dto';
import { useNavigate, useParams } from 'react-router';
import { postAccuseRequest } from '../../../apis';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN, MY_ABSOLUTE_PATH } from '../../../constants';
import ResponseDto from '../../../apis/dto/response/response.dto';
import { GetDiscussionResponseDto } from '../../../apis/dto/response/gd_discussion';
import DiscussionData from '../../../types/discussionData.interface';
import { useSignInUserStore } from '../../../stores';
import { PostAccuseRequestDto } from '../../../apis/dto/request/accuse';
import PatchCommentRequestDto from '../../../apis/dto/request/comment/patch-comment.request.dto';

// interface: 댓글 Props //
interface commentProps {
    comment: Comment
    depth: number
}
function Comments({ comment, depth }: commentProps) {

    const { roomId } = useParams();
    const [cookies] = useCookies();
    const [commentOptions, setCommentOptions] = useState<{ [key: number]: boolean }>({});
    const [newReply, setNewReply] = useState<string>('');
    const [replyTo, setReplyTo] = useState<number | null>(null);
    const [subReplyTo, setSubReplyTo] = useState<number | null>(null);
    const [nestedReplyTo, setNestedReplyTo] = useState<number | null>(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [editCotents, setEditContents] = useState<{ [key: number]: boolean }>({});
    const { signInUser } = useSignInUserStore();
    const discussionId = signInUser?.userId
    


    const editContentsHandler = (commentId:number) =>{
        setEditContents((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
        setCommentOptions((prev) => ({
            ...prev,
            [commentId]: false,
        }));
        setNewReply('');
    }
    const openReportModal = () => {
        setIsReportModalOpen(!isReportModalOpen);
    };

    const closeReportModal = () => {
        setIsReportModalOpen(!isReportModalOpen);
    };

    // function: 대댓글 수정 response 처리 //
    const patchCommentResponse = (responseBody:ResponseDto | null) => {
        const message =
        !responseBody ? '서버에 문제가 있습니다. ' :
            responseBody.code === 'AF' ? '접근이 잘못되었습니다. ' :
                responseBody.code === 'NC' ? '존재하지 않는 댓글입니다. ' :
                    responseBody.code ==='NP' ? '잘못된 접근입니다. ' :
                        responseBody.code === 'DBE' ? '서버에 문제가 있습니다. ' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    if (!isSuccessed) {
        alert(message);
        return;
    }

    }
    // event handler: 댓글 수정 이벤트 처리 //
    const handleEditComment = (commentId: number) => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!roomId || !accessToken || !commentId) return;
        const requestBody :PatchCommentRequestDto = { contents:newReply};
        patchCommentRequest(requestBody,roomId,commentId,accessToken).then(patchCommentResponse);

        setEditContents((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
        setCommentOptions((prev) => ({
            ...prev,
            [commentId]: false,
        }));
    };

    // function: 댓글 삭제 response 처리 //
    const deleteCommentResponse = (responseBody:ResponseDto | null) => {
        const message =
        !responseBody ? '서버에 문제가 있습니다. ' :
            responseBody.code === 'AF' ? '접근이 잘못되었습니다. ' :
                responseBody.code === 'NC' ? '존재하지 않는 댓글입니다. ' :
                    responseBody.code ==='NP' ? '잘못된 접근입니다. ' :
                        responseBody.code === 'DBE' ? '서버에 문제가 있습니다. ' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
    }

    // event handler: 댓글 삭제 이벤트 처리 //
    const handleDeleteComment = (commentId: number) => {
        const accessToken = cookies[ACCESS_TOKEN];
        
        if (!discussionId || !roomId || !commentId || !accessToken) return;

        deleteCommentRequest(roomId,commentId,discussionId,accessToken).then(deleteCommentResponse);
        setCommentOptions((prev) => ({
            ...prev,
            [commentId]: false,
        }));
        console.log(discussionId);
    };

    const toggleCommentOptions = (commentId: number) => {
        setCommentOptions((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
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

    // event handler: 대댓글 작성하기 버튼 클릭 이벤트 처리 //
    const handleReplySubmit = (commentId: number) => {

        const accessToken = cookies[ACCESS_TOKEN];
        if (!roomId || !accessToken || !discussionId) return;
        const requestBody: PostCommentRequestDto = {
            userId: discussionId, contents: newReply, discussionType: '찬성', parentId: commentId
        }

        postCommentRequest(requestBody, roomId, accessToken).then(postCommentResponse);
        setNewReply('');
        
        if(replyTo || subReplyTo || nestedReplyTo){
            setReplyTo(null);
            setSubReplyTo(null);
            setNestedReplyTo(null);
        }
    };

    return (
        <div>
            <div key={comment.commentId} className='comment-info'>
                {!editCotents[comment.commentId] ? <div className='comment-item-box'>
                    <div className="comment-user-info">
                        <div className='comment-user'>
                            <div className="profile-image"></div>
                            <div>
                                <div className='comment-user-nickname'>{comment.nickName}</div>
                                <div className='comment-date-and-modify'>
                                    <div className="comment-date">{comment.createdAt}</div>
                                    <div className="modify">{comment.updateStatus ? '(수정됨)' : ''}</div>
                                </div>
                            </div>
                        </div>
                        {!comment.deleteStatus && <div className='reply-option'>
                            <div className='comment-recommendation-icon-and-count'>
                                <div className='recommendation-icon'></div>
                                <div className='recommendation-count'>8</div>
                                {discussionId === comment.userId ? (
                                    <div className='comment-option' onClick={() => toggleCommentOptions(comment.commentId)}>⋮</div>
                                ) : (
                                    <div className='siren-button' onClick={() => openReportModal()}></div>
                                )}
                            </div>
                            {commentOptions[comment.commentId] && (
                                <div className='dropdown-menu-box'>
                                    <div className='dropdown-menu'>
                                        <div className='dropdown-item' onClick={() => editContentsHandler(comment.commentId)}>수정하기</div>
                                        <div className='dropdown-item' onClick={() => handleDeleteComment(comment.commentId)}>삭제하기</div>
                                    </div>
                                </div>
                            )}
                        </div>}
                    </div>
                        <div className="comment-content">{comment.deleteStatus ? '삭제된 메세지 입니다. ' : comment.contents}</div>
                        {!comment.deleteStatus && <div className="reply"><span onClick={() => setReplyTo(comment.commentId)}>댓글 쓰기</span></div>}
                    <hr />
                </div> : 
                <div className='reply-box' style={{ marginLeft: '20px', marginRight: '0' }}>
                        <div className='reply-textarea-and-button'>
                            <textarea
                                className='input-reply-text'
                                placeholder={comment.contents}
                                value={newReply}
                                onChange={(e) => setNewReply(e.target.value)}
                            />
                            <div className='comment-button-box'>
                                <button className='comment-button' type='button' onClick={() => editContentsHandler(comment.commentId)}>취소</button>
                                <button className='comment-button' type='button' onClick={() => handleEditComment(comment.commentId)}>수정하기</button>
                            </div>
                        </div>
                </div>}
                {replyTo === comment.commentId && (
                    <div className='reply-box' style={{ marginLeft: '20px', marginRight: '0' }}>
                        <div className='reply-textarea-and-button'>
                            <textarea
                                className='input-reply-text'
                                placeholder='댓글을 입력해주세요. '
                                onChange={(e) => setNewReply(e.target.value)}
                            />
                            <div className='comment-button-box'>
                                <button className='comment-button' type='button' onClick={()=>setReplyTo(null)}>취소</button>
                                <button className='comment-button' type='button' onClick={() => handleReplySubmit(comment.commentId)}>작성하기</button>
                            </div>
                        </div>
                    </div>
                )}
                {comment.replies && comment.replies.filter(reply => reply.parentId === comment.commentId).map((reply, index) => (
                    <div key={index} className="reply" style={{ marginLeft: (reply.depth ?? 1) * 20 + "px" }}>
                        {!editCotents[reply.commentId] ? <div className='reply-item-box'>
                            <div className="comment-user-info">
                                <div className='comment-user'>
                                    <div className="profile-image"></div>
                                    <div>
                                        <div className='comment-user-nickname'>{reply.nickName}</div>
                                        <div className='comment-date-and-modify'>
                                            <div className="comment-date">{reply.createdAt}</div>
                                            <div className="modify">(수정됨)</div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {!reply.deleteStatus && <div className='reply-option'>
                                        <div className='comment-recommendation-icon-and-count'>
                                            <div className='recommendation-icon'></div>
                                            <div className='recommendation-count'>8</div>
                                        </div>
                                        {discussionId === reply.userId ? (
                                            <div className='comment-option' onClick={() => toggleCommentOptions(reply.commentId)}>⋮</div>
                                        ) : (
                                            <div className='siren-button' onClick={() => openReportModal()}></div>
                                        )}
                                        {commentOptions[reply.commentId] && (
                                            <div className='dropdown-menu-box'>
                                                <div className='dropdown-menu'>
                                                    <div className='dropdown-item' onClick={() => editContentsHandler(reply.commentId)}>수정하기</div>
                                                    <div className='dropdown-item' onClick={() => handleDeleteComment(reply.commentId)}>삭제하기</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>}
                            </div>
                            </div>
                            <div className="comment-content">{reply.deleteStatus ? '삭제된 메세지 입니다. ': reply.contents}</div>
                            {!reply.deleteStatus && <div className="reply"><span onClick={() => setSubReplyTo(comment.commentId)}>댓글 쓰기</span></div> }
                            <hr />
                        </div> : 
                            <div className='reply-box' style={{ marginLeft: '20px', marginRight: '0' }}>
                                <div className='reply-textarea-and-button'>
                                    <textarea
                                        className='input-reply-text'
                                        placeholder={reply.contents}
                                        onChange={(e) => setNewReply(e.target.value)}
                                    />
                                    <div className='comment-button-box'>
                                        <button className='comment-button' type='button' onClick={() => editContentsHandler(reply.commentId)}>취소</button>
                                        <button className='comment-button' type='button' onClick={() => handleEditComment(reply.commentId)}>수정하기</button>
                                    </div>
                                </div>
                            </div>}
                        {subReplyTo === comment.commentId && (
                            <div className='reply-box' style={{ marginLeft: (reply.depth) * 20 + "px", marginRight: '0' }}>
                                <div className='reply-textarea-and-button'>
                                    <textarea
                                        className='input-reply-text'
                                        placeholder='댓글을 입력해주세요. '
                                        onChange={(e) => setNewReply(e.target.value)}
                                    />
                                    <div className='comment-button-box'>
                                        <button className='comment-button' type='button' onClick={() => setSubReplyTo(null)}>취소</button>
                                        <button className='comment-button' type='button' onClick={() => handleReplySubmit(reply.commentId)}>작성하기</button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {reply.replies && reply.replies.map((nestedReply) => (
                            <div key={nestedReply.commentId} className="reply" style={{ marginLeft: (nestedReply.depth) * 20 + "px" }}>
                                {!editCotents[nestedReply.commentId] ? <div className='reply-item-box'>
                                    <div className="comment-user-info">
                                        <div className='comment-user'>
                                            <div className="profile-image"></div>
                                            <div>
                                                <div className='comment-user-nickname'>{nestedReply.nickName}</div>
                                                <div className='comment-date-and-modify'>
                                                    <div className="comment-date">{nestedReply.createdAt}</div>
                                                    <div className="modify">{nestedReply.updateStatus ? '(수정됨)' : ''}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            {!nestedReply.deleteStatus && <div className='reply-option'>
                                                <div className='comment-recommendation-icon-and-count'>
                                                    <div className='recommendation-icon'></div>
                                                    <div className='recommendation-count'>8</div>
                                                </div>
                                                {discussionId === nestedReply.userId ? (
                                                    <div className='comment-option' onClick={() => toggleCommentOptions(nestedReply.commentId)}>⋮</div>
                                                ) : (
                                                    <div className='siren-button' onClick={() => openReportModal()}></div>
                                                )}
                                                {commentOptions[nestedReply.commentId] && (
                                                    <div className='dropdown-menu-box'>
                                                        <div className='dropdown-menu'>
                                                            <div className='dropdown-item' onClick={() => editContentsHandler(nestedReply.commentId)}>수정하기</div>
                                                            <div className='dropdown-item' onClick={() => handleDeleteComment(nestedReply.commentId)}>삭제하기</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>}
                                        </div>
                                    </div>
                                    <div className="comment-content">{nestedReply.deleteStatus ? '삭제된 메세지 입니다. ' : nestedReply.contents}</div>
                                    {!nestedReply.deleteStatus && <div className="reply"><span onClick={() => setNestedReplyTo(comment.commentId)}>댓글 쓰기</span></div>}
                                    <hr />
                                </div>:
                                    <div className='reply-box' style={{ marginLeft: '20px', marginRight: '0' }}>
                                        <div className='reply-textarea-and-button'>
                                            <textarea
                                                className='input-reply-text'
                                                placeholder={nestedReply.contents}
                                                value={newReply}
                                                onChange={(e) => setNewReply(e.target.value)}
                                            />
                                            <div className='comment-button-box'>
                                                <button className='comment-button' type='button' onClick={() => editContentsHandler(nestedReply.commentId)}>취소</button>
                                                <button className='comment-button' type='button' onClick={() => handleEditComment(nestedReply.commentId)}>수정하기</button>
                                            </div>
                                        </div>
                                    </div>}
                                {nestedReplyTo === comment.commentId && (
                                    <div className='reply-box' style={{ marginLeft: (nestedReply.depth ?? 1) * 20 + "px", marginRight: '0' }}>
                                        <div className='reply-textarea-and-button'>
                                            <textarea
                                                className='input-reply-text'
                                                placeholder='댓글을 입력해주세요. '
                                                onChange={(e) => setNewReply(e.target.value)}
                                            />
                                            <div className='comment-button-box'>
                                                <button className='comment-button' type='button' onClick={()=>setNestedReplyTo(null)}>취소</button>
                                                <button className='comment-button' type='button' onClick={() => handleReplySubmit(nestedReply.commentId)}>작성하기</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

// interface: 투표 Props//
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
    const [newReply, setNewReply] = useState<string>('');
    const [replyContent, setReplyContent] = useState<{ [key: number]: string }>({});
    const [replyTo, setReplyTo] = useState<number | null>(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedReportReason, setSelectedReportReason] = useState<string | null>(null);
    const [clicked, setClicked] = useState<boolean>(false);
    const [commentId] = useState<number>();

    // function: navigator //
    const navigator = useNavigate();

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

    const onUserProfileClickHandler = () => {
        console.log(discussionData?.userId);
        if(discussionData) navigator(MY_ABSOLUTE_PATH(discussionData.userId));
    }

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
            userId: discussionId, contents: newComment, discussionType: '찬성', parentId: commentId
        }
        postCommentRequest(requestBody, roomId, accessToken).then(postCommentResponse);
        setNewComment('');
        setClicked(!clicked);
    };

    // event handler: 대댓글 작성하기 버튼 클릭 이벤트 처리 //
    const handleReplySubmit = (commentId: number) => {

        const accessToken = cookies[ACCESS_TOKEN];
        if (!roomId || !accessToken || !discussionId) return;
        const requestBody: PostCommentRequestDto = {
            userId: discussionId, contents: newReply, discussionType: '찬성', parentId: commentId
        }

        postCommentRequest(requestBody, roomId, accessToken).then(postCommentResponse);
        setNewReply('');
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
    }, []);

    return (
        <div id="gd-detail-wrapper">
            <div className="gd-detail-wrapper-in">
                <div className='gd-detail-box'>
                    <div className="gd-detail-category">

                        <div className="width-line"><span>{discussionData?.discussionType}</span></div>
                    </div>
                    <div className="post-info">
                        <div className="post-user-info">
                            <div className="profile-image" style={{ backgroundImage: `url(${discussionData?.profileImage || '/defaultProfile.png'})` }}
                            onClick={onUserProfileClickHandler}></div>
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
                        <div className="comment-count">{discussionData?.commentCount}</div> 
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
                        <Comments key={comment.commentId} comment={comment} depth={1} />
                    ))}
                </div>
            </div>
        </div>
    );
}


