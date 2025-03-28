import React, { useEffect, useState } from 'react'
import './style.css';
import { useSignInUserStore } from '../../../stores';
import { ACCESS_TOKEN, NOTICE_ABSOLUTE_PATH, NOTICE_DETAIL_ABSOLUTE_PATH } from '../../../constants';
import { useCookies } from 'react-cookie';
import { deleteNoticeRequest, getNoticeDetailRequest, getNoticeListRequest } from '../../../apis';
import { useNavigate, useParams } from 'react-router-dom';
import GetNoticeDetailResponseDto from '../../../apis/dto/response/notice/Get-notice-detail.response.dto';
import ResponseDto from '../../../apis/dto/response/response.dto';
import GetNoticeListResponseDto from '../../../apis/dto/response/notice/Get-notice-list.response.dto';
import NoticeList from '../../../types/notice.interface';

// component: 공지사항 상세보기 화면 컴포넌트 //
export default function NoticeDetail() {

    // state: 쿠키 상태 //
    const [cookies, setCookie, removeCookie] = useCookies();

    // state: 로그인 유저 정보 상태 //
    const { signInUser, setSignInUser } = useSignInUserStore();

    // state: 가게 번호 경로 변수 상태 //
    const { noticeNumber } = useParams();

    // state: 공지사항 관련 상태 //
    const [title, setTitle] = useState<String>('');
    const [userId, setUserId] = useState<String>('');
    const [noticeId, setNoticeId] = useState<number>(0);
    const [noticeDate, setNoticeDate] = useState<string>('');
    const [contents, setContents] = useState<String>('');
    const [preTitle, setPreTitle] = useState<string>('');
    const [nextTitle, setNextTitle] = useState<string>('');
    const [noticeList, setNoticeList] = useState<NoticeList[]>([]);

    // variable: access token //
    const accessToken = cookies[ACCESS_TOKEN];

    // function: navigator //
    const navigator = useNavigate();

    // event handler: 삭제 버튼 클릭 이벤트 핸들러 //
    const onDeleteNoticeClickHandler = () => {
        const answer = window.confirm("정말로 삭제하시겠습니까?");
        if(!answer) return;
        else {
            if(!accessToken || !noticeNumber) return;
            deleteNoticeRequest(noticeNumber, accessToken).then(deleteNoticeResponse);
        }
    }

    // event handler: 이전글 클릭 이벤트 핸들러 //
    const onPreNoticeClickHandler = () => {
        const currentIndex = noticeList.findIndex(notice => notice.noticeId === noticeId);
        if (currentIndex + 1 < noticeList.length) {
            const prevNotice = noticeList[currentIndex + 1];  // ✅ currentIndex + 1 = 이전 글
            navigator(NOTICE_DETAIL_ABSOLUTE_PATH(prevNotice.noticeId));
        }
    };
    
    // event handler: 다음글 클릭 이벤트 핸들러 //
    const onNextNoticeClickHandler = () => {
        const currentIndex = noticeList.findIndex(notice => notice.noticeId === noticeId);
        if (currentIndex - 1 >= 0) {
            const nextNotice = noticeList[currentIndex - 1];  // ✅ currentIndex - 1 = 다음 글
            navigator(NOTICE_DETAIL_ABSOLUTE_PATH(nextNotice.noticeId));
        }
    };

    // function: notice detail 불러오기 함수 //
    const getNoticeDetail = () => {
        if(!accessToken || !noticeNumber) return;
        
        getNoticeDetailRequest(noticeNumber, accessToken).then(getNoticeDetailResponse);

        // 전체 공지사항 목록 불러오기 (날짜 정렬을 위해 필요)
        getNoticeListRequest(accessToken).then((response) => {
            if (response && response.code === 'SU') {
                // 날짜 순으로 정렬 (최신 글이 뒤로 가도록 오름차순 정렬)
                const { notices } = response as GetNoticeListResponseDto;
                const sortedNotices = notices.sort((a, b) => 
                    new Date(b.noticeDate).getTime() - new Date(a.noticeDate).getTime()
                );
                setNoticeList(sortedNotices);

                // noticeList 세팅 후 이전/다음 제목 세팅
                const currentNoticeId = Number(noticeNumber);
                const currentIndex = sortedNotices.findIndex(notice => notice.noticeId === currentNoticeId);

                if (currentIndex + 1 < sortedNotices.length) {
                    setPreTitle(sortedNotices[currentIndex + 1].title);
                } else setPreTitle('이전 글이 없습니다.');
                
                if (currentIndex - 1 >= 0) {
                    setNextTitle(sortedNotices[currentIndex - 1].title);
                } else setNextTitle('다음 글이 없습니다.');
            }
        });
    };

    // function: getNoticeDetail response 처리 함수 //
    const getNoticeDetailResponse = (responseBody: GetNoticeDetailResponseDto | ResponseDto | null) => {
        const message =
            responseBody === null ? '서버에 문제가 있습니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
            responseBody.code === 'NN' ? '존재하지 않는 공지사항입니다.' : '';
    
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
    
        const {title, userId, noticeDate, contents, noticeId, preTitle, nextTitle} 
            = responseBody as GetNoticeDetailResponseDto;
        setTitle(title);
        setUserId(userId);
        setNoticeDate(noticeDate);
        setContents(contents);
        setNoticeId(noticeId);
    };

    // function: 날짜 변환 함수 //
    const formatDate = (dateString: string): string => {
        return dateString.split('-').slice(0, 3).join('.');
    };

    // function: delete notice response 처리 함수 //
    const deleteNoticeResponse = (responseBody: ResponseDto | null) => {
        const message =
            responseBody === null ? '서버에 문제가 있습니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
            responseBody.code === 'NN' ? '존재하지 않는 공지사항입니다.' : '';
    
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
        alert("삭제되었습니다.");
        navigator(NOTICE_ABSOLUTE_PATH);
    }

    // effect: 컴포넌트 로드시 공지사항 리스트 불러오기 함수 //
    useEffect(getNoticeDetail, [noticeNumber]);

    // render: 공지사항 상세보기 화면 렌더링 //
    return (
        <div id='notice-detail'>
            <div className='background'>
                <div className='notice-info'>
                    <div className='title'>{title}</div>
                    <div className='admin'>@{userId}</div>
                    <div className='date'>{formatDate(noticeDate)}</div>
                </div>
                <div className='contents'>{contents}</div>
                
                {signInUser?.role ? 
                    <div className='btn-box'>
                        <div className='delete-btn' onClick={onDeleteNoticeClickHandler}>삭제</div>
                    </div> 
                : 
                    ''
                }
            </div>

            <div className='table'>
                <div className='pre' onClick={onPreNoticeClickHandler}>
                    <div className='pre-notice'>이전글</div>
                    <div className='pre-title'>{preTitle}</div>
                </div>
                <div className='next' onClick={onNextNoticeClickHandler}>
                    <div className='next-notice'>다음글</div>
                    <div className='next-title'>{nextTitle}</div>
                </div>
            </div>
        </div>
    )
}
