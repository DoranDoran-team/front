import React, { useState } from 'react';
import './style.css';

// component: 일반 토론방 컴포넌트 //
export default function GDDetail() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDropdownOptionOpen, setIsDropdownOptionOpen] = useState(false);
    const [isDropdownCommentOptionOpen, setIsDropdownCommentOptionOpen] = useState(false);
    const [commentOptions, setCommentOptions] = useState<{ [key: number]: boolean }>({});
    const [selectedOption, setSelectedOption] = useState<string>('정렬순');
    const [comments, setComments] = useState<{ id: number; user: string; content: string; date: string; replies: any[] }[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const [replyContent, setReplyContent] = useState<{ [key: number]: string }>({});
    const [replyTo, setReplyTo] = useState<number | null>(null);

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
                            의견 A
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="B"
                                checked={selectedOpinion === 'B'}
                                onChange={handleOpinionChange}
                            />
                            의견 B
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

    return (
        <div id="gd-detail-wrapper">
            <div className="gd-detail-wrapper-in">
                <div className='gd-detail-box'>
                    <div className="gd-detail-category">
                        <div className="width-line"><span>시사·교양</span></div>
                    </div>
                    <div className="post-info">
                        <div className="post-user-info">
                            <div className="profile-image"></div>
                            <div>
                                <div className='user-nickname'>user_nickname</div>
                                <div className='post-date-and-modify'>
                                    <div className="post-date">2024.12.30.16:00</div>
                                    <div className="modify">(수정됨)</div>
                                </div>
                            </div>
                        </div>
                        <div className='status-and-option'>
                            <div className='status'>진행 중</div>
                            <div className='option' onClick={toggleDropdownOption}>⋮</div>
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
                    <div className="discussion-info">
                        <div className="discussion-image">이미지 자리</div>
                        <div className="discussion-text-info">
                            <div className="discussion-title">생성형 AI에게 윤리적 책임을 물을 수 있는가?</div>
                            <div className="deadline">마감: 2025.01.05</div>
                            <div className="discussion-content">최근 몇 년 간 생성형 인공지능(GAI)의 발전은 많은 산업과 사회 전반에 걸쳐 혁신적인 변화를 가져왔습니다. 그러나 이러한 기술의 발전이 가져오는 윤리적, 법적 논란 또한 커지고 있습니다. 특히, 생성형 AI가 창출한 콘텐츠나 결정에 대해 누가 책임을 질 것인지에 대한 질문은 매우 중요합니다.</div>
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
                                        <div className='siren-button'></div>
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

