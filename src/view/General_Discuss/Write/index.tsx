import React, { useState } from 'react';
import './style.css';
import { GEN_DISC_ABSOLUTE_PATH } from '../../../constants';

export default function GDWrite() {
    const [firstOpinion, setFirstOpinion] = useState<string>('');
    const [secondOpinion, setSecondOpinion] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [category, setCategory] = useState<string>('시사·교양');
    const [image, setImage] = useState<File | null>(null);
    const [deadline, setDeadline] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const first = firstOpinion || '찬성';
        const second = secondOpinion || '반대';

        const newErrors: { [key: string]: string } = {};
        if (!title) newErrors.title = '내용을 입력해주세요.';
        if (!content) newErrors.content = '내용을 입력해주세요.';
        if (!deadline) newErrors.deadline = '마감일을 입력해주세요.';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setShowModal(true);
        }
    };

    const handleConfirm = () => {
        console.log({ title, content, image, firstOpinion, secondOpinion, category, deadline });
        window.location.href = GEN_DISC_ABSOLUTE_PATH;
    };

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0]; // 내일 날짜 가져오기

    return (
        <div id="gd-write-wrapper">
            <div className="gd-write-wrapper-in">
                <div className='gd-write-box'>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="category">카테고리 *</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="시사·교양">시사·교양</option>
                            <option value="과학">과학</option>
                            <option value="경제">경제</option>
                            <option value="기타">기타</option>
                        </select>

                        <label htmlFor="title">제목 *</label>
                        <input
                            type="text"
                            id="title"
                            placeholder="제목을 입력하세요"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        {errors.title && <span className="error-message">{errors.title}</span>}

                        <label htmlFor="content">본문 *</label>
                        <textarea
                            id="content"
                            placeholder="본문을 입력하세요"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={{ resize: 'none', height: '300px' }}
                        />
                        {errors.content && <span className="error-message">{errors.content}</span>}

                        <label htmlFor="image">이미지 (선택사항)</label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files) {
                                    setImage(e.target.files[0]);
                                }
                            }}
                        />
                        {image && (
                            <div className="image-preview">
                                <img src={URL.createObjectURL(image)} alt="미리보기" />
                            </div>
                        )}

                        <label htmlFor="firstOpinion">첫번째 의견 (미입력 시 '찬성'으로 게시됩니다)</label>
                        <input
                            type="text"
                            id="firstOpinion"
                            placeholder="첫번째 의견을 입력하세요"
                            value={firstOpinion}
                            onChange={(e) => setFirstOpinion(e.target.value)}
                        />

                        <label htmlFor="secondOpinion">두번째 의견 (미입력 시 '반대'로 게시됩니다)</label>
                        <input
                            type="text"
                            id="secondOpinion"
                            placeholder="두번째 의견을 입력하세요"
                            value={secondOpinion}
                            onChange={(e) => setSecondOpinion(e.target.value)}
                        />

                        <label htmlFor="deadline">토론 마감일 *</label>
                        <input
                            type="date"
                            id="deadline"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            min={minDate}
                        />
                        {errors.deadline && <span className="error-message">{errors.deadline}</span>}

                        <div className="button-container">
                            <button type="submit">게시하기</button>
                        </div>
                    </form>
                </div>
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <p>게시하시겠습니까?</p>
                        <button onClick={handleConfirm}>예</button>
                        <button onClick={() => setShowModal(false)}>아니오</button>
                    </div>
                </div>
            )}
        </div>
    );
}
