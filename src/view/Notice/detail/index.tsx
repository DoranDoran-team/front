import React from 'react'
import './style.css';

// component: 공지사항 상세보기 화면 컴포넌트 //
export default function NoticeDetail() {

    // render: 공지사항 상세보기 화면 렌더링 //
    return (
        <div id='notice-detail'>
            <div className='background'>
                <div className='notice-info'>
                    <div className='title'>실시간 투표 임시 점검 안내</div>
                    <div className='admin'>@admin123</div>
                    <div className='date'>2025.01.01</div>
                </div>
                <div className='contents'>2025년 1월 10일 18시부터 22시까지 실시간 토론 임시 점검이 있겠습니다. 
                    해당 시간 동안에는 서비스 이용이 불가하오니 양해 부탁드립니다.
                </div>
            </div>

            <div className='table'>
                <div className='pre'>
                    <div className='pre-notice'>이전글</div>
                    <div className='pre-title'>이전글 제목</div>
                </div>
                <div className='next'>
                    <div className='next-notice'>다음글</div>
                    <div className='next-title'>다음글 제목</div>
                </div>
            </div>
        </div>
    )
}
