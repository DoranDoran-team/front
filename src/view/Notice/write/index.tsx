import React, { ChangeEvent, useState } from 'react'
import './style.css';
import { useNavigate } from 'react-router-dom';
import { NOTICE_ABSOLUTE_PATH } from '../../../constants';

// component: 공지사항 작성 화면 컴포넌트 //
export default function NoticeWrite() {

    // state: 공지사항 관련 상태 //
    const [title, setTitle] = useState<string>('');
    const [contents, setContents] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);

    // event handler: 제목 변경 이벤트 핸들러 //
    const titleChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setTitle(value);
    }

    // event handler: 본문 변경 이벤트 핸들러 //
    const contentsChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const {value} = event.target;
        setContents(value);
    }

    // event handler: 등록 버튼 클릭 이벤트 핸들러 //
    const onRegisterClickHandler = () => {
        navigator(NOTICE_ABSOLUTE_PATH);
    }

    // event handler: 취소 버튼 클릭 이벤트 핸들러 //
    const onCancleClickHandler = () => {
        navigator(NOTICE_ABSOLUTE_PATH);
    }

    // function: navigator //
    const navigator = useNavigate();

    // render: 공지사항 작성 화면 렌더링 //
    return (
        <div id='notice-write'>
            <div className='title-box'>
                <div className='title'>TITLE</div>
                <input className='title-input' placeholder='제목을 입력하세요.' onChange={titleChangeHandler}></input>
            </div>

            <textarea className='contents' placeholder='내용을 입력하세요.' onChange={contentsChangeHandler}/>
            {/* <label htmlFor="image">이미지 (선택사항)</label>
            <input
                type="file"
                className="image"
                accept="image/*"
                onChange={(e) => {
                    if (e.target.files) setImage(e.target.files[0]);}}
            />
            {image && (
                <div className="image-preview">
                    <img src={URL.createObjectURL(image)} alt="미리보기" />
                </div>
            )} */}

            <div className='btn-box'>
                <div className='register' onClick={onRegisterClickHandler}>등록</div>
                <div className='cancle' onClick={onCancleClickHandler}>취소</div>
            </div>
        </div>
    )
}
