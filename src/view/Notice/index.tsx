import React, { ChangeEvent, useState } from "react";
import './style.css';
import { useNavigate } from "react-router-dom";
import { NOTICE_DETAIL_ABSOLUTE_PATH, NOTICE_WRITE_ABSOLUTE_PATH } from "../../constants";
import { usePagination } from "../../hooks";
import Pagination from "../../components/pagination";
import NoticeList from "../../types/notice.interface";
import formatDate from "../../components/dateFormat/changeDate";

// interface: 공지사항 리스트 아이템 //
interface TableRowProps {
    notice: NoticeList;
    getNoticeList: () => void;
    onDetailClickHandler: (noticeNumber: number) => void;
};

// component: NoticeRow 컴포넌트 //
export function NoticeRow({ notice, getNoticeList, onDetailClickHandler }: TableRowProps) {

    // render: NoticeRow 컴포넌트 렌더링 //
    return (
        <div className="tr" onClick={() => onDetailClickHandler(notice.noticeNumber)}>
            <div className="td-no">{notice.noticeNumber}</div>
            <div className="td-title">{notice.noticeTitle}</div>
            <div className="td-date">{formatDate(notice.noticeDay)}</div>
        </div>
    )
}

// component: 공지사항 컴포넌트 //
export default function Notice() {

    // state: 검색 입력 창 상태 //
    const [searchWords, setSearchWords] = useState<string>('');
    // state: 원본 리스트 상태 //
    const [originalList, setOriginalList] = useState<NoticeList[]>([]);

    // event handler: 등록 버튼 클릭 이벤트 핸들러 //
    const onWriteClickHandler = () => {
        navigator(NOTICE_WRITE_ABSOLUTE_PATH);
    }

    // event handler: 공지사항 tr 클릭 이벤트 핸들러 //
    const onTrClickHandler = (noticeNumber: string | number) => {
        navigator(NOTICE_DETAIL_ABSOLUTE_PATH(noticeNumber));
    }

    // event handler: 검색 입력 창 내용 변경 감지 //
    const onSearchChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchWords(value);
    };

    // event handler: 공지사항 검색 버튼 //
    const onSearchButtonHandler = () => {
        const searchedList = originalList.filter(notice => notice.noticeTitle.includes(searchWords));
        setTotalList(searchedList);
        initViewList(searchedList);
    };

    // event handler: 엔터키로 검색 버튼 동작 //
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onSearchButtonHandler();
        }
    }

    // function: navigator //
    const navigator = useNavigate();

    //* 커스텀 훅 가져오기
    const {
        currentPage,
        totalCount,
        viewList,
        pageList,
        setTotalList,
        initViewList,
        onPageClickHandler,
        onPreSectionClickHandler,
        onNextSectionClickHandler,
    } = usePagination<NoticeList>();

    // render: 공지사항 화면 렌더링 //
    return (
        <div id="notice">
            <div className="title">공지사항</div>

            <div className="write-btn" onClick={onWriteClickHandler}>작성</div>
            <div className="table">
                <div className="th">
                    <div className="td-no">NO.</div>
                    <div className="td-title">TITLE.</div>
                    <div className="td-date">DATE.</div>
                </div>
                    
                <div className="tr" onClick={() => onTrClickHandler(3)}>
                    <div className="tr-no">3</div>
                    <div className="tr-title">title</div>
                    <div className="tr-date">2025.01.01</div>
                </div>
                
                <div className="tr" onClick={() => onTrClickHandler(2)}>
                    <div className="tr-no">2</div>
                    <div className="tr-title">title</div>
                    <div className="tr-date">2025.01.01</div>
                </div>

                <div className="tr" onClick={() => onTrClickHandler(1)}>
                    <div className="tr-no">1</div>
                    <div className="tr-title">title</div>
                    <div className="tr-date">2025.01.01</div>
                </div>
                {/* {viewList.map((notice, index) => <NoticeRow key={index} notice={notice} getNoticeList={getNoticeList} onDetailClickHandler={onTrClickHandler} />)} */}

            </div>

            <div className="search">
                <input value={searchWords} className="search-input" placeholder="제목" 
                    onChange={onSearchChangeHandler} onKeyDown={handleKeyDown}/>
                <div className="search-btn">검색</div>
            </div>

            <Pagination
                pageList={pageList}
                currentPage={currentPage}
                onPageClickHandler={onPageClickHandler}
                onPreSectionClickHandler={onPreSectionClickHandler}
                onNextSectionClickHandler={onNextSectionClickHandler}
            />
        </div>
    )
}