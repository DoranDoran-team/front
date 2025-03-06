import React, { useEffect, useRef, useState } from 'react'
import './style.css';
import AdminSideBar from '../../../../components/Admin/Sidebar';
import Modal from '../../../../components/modal';
import GetAccuseListResponseDto from '../../../../apis/dto/response/accuse/get-accuse-list.response.dto';
import ResponseDto from '../../../../apis/dto/response/response.dto';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN } from '../../../../constants';
import AccuseComponentProps from '../../../../types/accuseList.interface';
import { getAccuseListRequest, getAccuseRequest, getAccuseUserListRequest, patchAccuseApproved, patchAccuseRejected } from '../../../../apis';
import { useSignInUserStore } from '../../../../stores';
import { usePagination } from '../../../../hooks';
import Pagination from '../../../../components/pagination';
import GetAccuseResponseDto from '../../../../apis/dto/response/accuse/get-accuse.response.dto';
import AccuseDetail from '../../../../types/accuseDetail.interface';
import AccuseUserProps from '../../../../types/accuseUserList.interface';
import GetAccuseUserListResponseDto from '../../../../apis/dto/response/accuse/get-accuse-user-list.response.dto';
import axios from 'axios';


const ITEMS_PER_PAGE = 5;
const PAGES_PER_SECTION = 5;

export default function Accuse() {

    // state: 신고 타입 상태 //
    const [activeTypes, setActiveTypes] = useState<string | null>(null);
    const [toggleDown, setToggleDown] = useState<boolean>(false)
    const [sortingState, setSortingState] = useState({
        selected: '정렬순'
    })
    const typeMapping: Record<string, string> = {
        '댓글': 'COMMENT',
        '게시글': 'POST',
        '채팅': 'CHAT'
    };

    // state: cookie 상태 //
    const [cookies] = useCookies();

    const { signInUser, setSignInUser } = useSignInUserStore();
    const [adminCheck, setAdminCheck] = useState<string>('');

    // state: 신고 리스트 상태 //
    const [accuseList, setAccuseList] = useState<AccuseComponentProps[]>([]);

    // state: 유저 리스트 상태 //
    const [userList, setUserList] = useState<AccuseUserProps[]>([]);

    const [keyword, setKeyword] = useState<string>("");
    const [autoSearchVisible, setAutoSearchVisible] = useState(false);
    const searchBoxRef = useRef<HTMLDivElement>(null); // 바깥 클릭 감지용

    // function: 입력값 변경 이벤트 //
    const onChangeData = (e: React.FormEvent<HTMLInputElement>) => {
        setKeyword(e.currentTarget.value);
        setAutoSearchVisible(true);
    };

    // function: input 클릭시 자동 완성 //
    const onFocusInput = () => {
        setAutoSearchVisible(true);
    };

    // function: 바깥 클릭 시 자동완성 숨기기 //
    useEffect(() => {
        if (!searchBoxRef.current) return; // 🔥 null 방지
        const handleClickOutside = (event: MouseEvent) => {
            if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
                setAutoSearchVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchBoxRef]);

    //* 커스텀 훅 가져오기
    const {
        currentPage,
        totalPage,
        totalCount,
        totalSection,
        viewList,
        pageList,
        setViewList,
        setTotalList,
        setTotalPage,
        setTotalSection,
        onPageClickHandler,
        onPreSectionClickHandler,
        onNextSectionClickHandler
    } = usePagination<AccuseComponentProps>();

    // event handler: 신고 타입 클릭 이벤트 처리  //
    const onAccuseTypeClickHandler = (type: string) => {
        if (type === '|') return;
        setActiveTypes(type);
    };

    // event handler: 정렬 메뉴 버튼 이벤트 처리 함수 //
    const onSortingButtonHandler = () => {
        setToggleDown(!toggleDown);
        setSortingState((prevState) => ({
            ...prevState
        }));

    };
    // event handler: 정렬 메뉴 아이템 클릭 이벤트 처리 함수 //
    const onSortOptionClickHandler = (option: string) => {
        setSortingState({
            selected: option,
        })
        setToggleDown(!toggleDown)
    }

    // function: 유저 리스트 GET 요청 함수 //
    const GetAccuseUserListResponse = (responseBody: GetAccuseUserListResponseDto | ResponseDto | null) => {
        if (!responseBody) {
            return;
        }

        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'VF' ? '유효하지 않은 데이터입니다.' :
                    responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const { accuseUserList } = responseBody as GetAccuseUserListResponseDto;
        setUserList(accuseUserList);
    }

    // effect: autoSerchVisible GET 요청 //
    useEffect(() => {

        if (!autoSearchVisible) {
            return;
        }

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) {
            alert('토큰 오류');
            return;
        }

        getAccuseUserListRequest(keyword, accessToken)
            .then((response) => {
                GetAccuseUserListResponse(response as GetAccuseUserListResponseDto | ResponseDto | null);
            });

    }, [autoSearchVisible, keyword]);

    // interface: 신고 컴포넌트 Props //
    interface AccuseRowProps {
        accuse: AccuseComponentProps;
    }
    // function: 신고 컴포넌트 //
    function Accusetr({ accuse, index }: AccuseRowProps & { index: number }) {

        const [accuses, setAccuses] = useState<AccuseComponentProps[]>([]);
        const [accuseData, setAccuseData] = useState<AccuseDetail | null>(null);
        const [modalOpen, setModalOpen] = useState<boolean>(false);
        const modalBackground = useRef<HTMLDivElement | null>(null);

        // function: 신고 승인 핸들러 //
        const handleSave = async () => {

            const accessToken = cookies[ACCESS_TOKEN];
            if (!accessToken) {
                alert('접근 권한이 없습니다.');
                return;
            }

            await patchAccuseApproved(accuse.accuseId, accessToken)
                .then((response) => patchApprovedResponse(response as ResponseDto | null));

            setModalOpen(false);
        };

        // function: 신고 승인 처리 함수 //
        const patchApprovedResponse = (responseBody: ResponseDto | null) => {

            if (!responseBody) {
                alert('서버 응답이 없습니다.');
                return;
            }

            const message =
                !responseBody ? '서버에 문제가 있습니다.' :
                    responseBody.code === 'VF' ? '유효하지 않은 데이터입니다.' :
                        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                            responseBody.code === 'AA' ? '이미 처리된 신고건입니다.' :
                                responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
            const isSuccessed = responseBody !== null && responseBody.code === 'SU';
            if (!isSuccessed) {
                alert(message);
                return;
            }

            setAccuseList((prevList) => prevList.filter((item) => item.accuseId !== accuse.accuseId));

            alert('신고가 정상적으로 처리되었습니다.');
        }

        // function: 신고 반려 핸들러 //
        const handleClose = async () => {
            setModalOpen(false);

            const accessToken = cookies[ACCESS_TOKEN];
            if (!accessToken) {
                alert('접근 권한이 없습니다.');
                return;
            }

            await patchAccuseRejected(accuse.accuseId, accessToken)
                .then((response) => patchRejectedResponse(response as ResponseDto | null));
        };

        // function: 신고 반려 처리 함수 //
        const patchRejectedResponse = (responseBody: ResponseDto | null) => {

            const message =
                !responseBody ? '서버에 문제가 있습니다.' :
                    responseBody.code === 'VF' ? '유효하지 않은 데이터입니다.' :
                        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                            responseBody.code === 'AA' ? '이미 처리된 신고건입니다.' :
                                responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
            const isSuccessed = responseBody !== null && responseBody.code === 'SU';
            if (!isSuccessed) {
                alert(message);
                return;
            }

            setAccuseList((prevList) => prevList.filter((item) => item.accuseId !== accuse.accuseId));

            alert('신고가 반려되었습니다.');
        }

        // event handler: 모달창 오픈 이벤트 처리 함수 //
        const onModalOpenHandler = () => {
            setModalOpen(!modalOpen);

            const accessToken = cookies[ACCESS_TOKEN];
            if (!accessToken) {
                alert('접근 권한이 없습니다.');
                return;
            }

            getAccuseRequest(accuse.accuseId, accessToken)
                .then((response) => getAccuseResponse(response as GetAccuseResponseDto | ResponseDto | null));
        }

        // function: 신고 Detail 불러오기 함수 //
        const getAccuseResponse = (responseBody: GetAccuseResponseDto | ResponseDto | null) => {
            if (!responseBody) {
                alert('서버에 문제가 있습니다.');
                return;
            }
            const message =
                !responseBody ? '서버에 문제가 있습니다.' :
                    responseBody.code === 'VF' ? '유효하지 않은 데이터입니다.' :
                        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
                                responseBody.code === 'NA' ? '신고 내역이 존재하지 않습니다.' : '';

            const isSuccessed = responseBody !== null && responseBody.code === 'SU';
            if (!isSuccessed) {
                alert(message);
                return;
            }

            if ("getAccuseResultSet" in responseBody) {
                setAccuseData(responseBody.getAccuseResultSet as AccuseDetail);
            }
        }


        // function: 신고 리스트 불러오기 response 처리 함수 //
        const getAccuseListResponse = (responseBody: GetAccuseListResponseDto | ResponseDto | null) => {

            if (!responseBody) {
                alert('서버에 문제가 있습니다.');
                return;
            }
            const message =
                !responseBody ? '서버에 문제가 있습니다.' :
                    responseBody.code === 'VF' ? '유효하지 않은 데이터입니다.' :
                        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

            const isSuccessed = responseBody !== null && responseBody.code === 'SU';
            if (!isSuccessed) {
                alert(message);
                return;
            }

            const accessToken = cookies[ACCESS_TOKEN];
            if (!accessToken) {
                alert('토큰 오류');
                return;
            }
            const { accuses } = responseBody as GetAccuseListResponseDto;
            setAccuses(accuses);
        }

        // function: 신고 리스트 불러오기 //
        const getAccuseList = async () => {
            const accessToken = cookies[ACCESS_TOKEN];
            if (!accessToken) {
                alert('접근 권한이 없습니다.');
                return;
            }

            await getAccuseListRequest(adminCheck, accessToken)
                .then((response) => getAccuseListResponse(response as GetAccuseListResponseDto | ResponseDto | null));
        }

        // effect: 마운트 될 때 신고  불러오기 //
        useEffect(() => {

            const accessToken = cookies[ACCESS_TOKEN];
            if (!accessToken) {
                alert('접근 권한이 없습니다.');
                return;
            }
            if (signInUser?.userId) {
                setAdminCheck(signInUser.userId);
            }

            getAccuseList();
        }, [accuse.accuseId]);

        return (
            <>
                <div className='accuse-table2' onClick={onModalOpenHandler}>
                    <div className='accuse-tr'>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</div>
                    <div className='accuse-tr'>{accuse.reportType === 'POST' ? '게시글' : '댓글'}</div>
                    <div className='accuse-tr'>{accuse.accuseUserId}</div>
                    <div className='accuse-tr'>{accuse.userId}</div>
                    <div className='accuse-tr'>{accuse.accuseDate}</div>
                    <div className='accuse-tr'>{accuse.reportContents}</div>
                </div>
                {
                    modalOpen && <div className='accuse-modal-container' ref={modalBackground} onClick={e => {
                        if (e.target === modalBackground.current) {
                            setModalOpen(false);
                        }
                    }}>
                        <div className="event-form">
                            <h2>신고 내역</h2>
                            <div className="form-group">
                                <label>악용사용자 아이디 : </label>
                                <div>{accuseData?.userId}</div>
                            </div>
                            <div className="form-group">
                                <label>신고 내역 : </label>
                                <div>{accuseData?.roomDescription ?? accuseData?.contents}</div>
                            </div>
                            <div className="form-group">
                                <label>신고사유 : </label>
                                <div>{accuse.reportContents}</div>
                            </div>
                            <div className="button-group">
                                <button className='button-red' onClick={handleSave}>신고처리</button>
                                <button onClick={handleClose}>신고반려</button>
                            </div>
                        </div>

                    </div>
                }
            </>
        )
    }

    // function: 신고 리스트 불러오기 response 처리 함수 //
    const getAccuseListResponse = (responseBody: GetAccuseListResponseDto | ResponseDto | null) => {

        if (!responseBody) {
            alert('서버에 문제가 있습니다.');
            return;
        }
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'VF' ? '유효하지 않은 데이터입니다.' :
                    responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) {
            alert('토큰 오류');
            return;
        }
        const { accuses } = responseBody as GetAccuseListResponseDto;

        setAccuseList(accuses);
    }

    useEffect(() => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) {
            alert('접근 권한이 없습니다.');
            return;
        }

        if (signInUser?.userId) {
            setAdminCheck(signInUser.userId);
        }

        getAccuseListRequest('songth', accessToken)
            .then((response) => {
                getAccuseListResponse(response as GetAccuseListResponseDto | ResponseDto | null);
            });

        setActiveTypes('댓글')
    }, [signInUser]);

    // effect: 페이지네이션 적용//
    useEffect(() => {
        if (!accuseList) return;

        // 현재 선택된 신고 유형에 따라 필터링
        const filteredAccuses = accuseList.filter(accuse => {
            const reportType = activeTypes ? typeMapping[activeTypes] : null;
            return reportType && accuse.reportType === reportType;
        });

        setTotalList(filteredAccuses);
        const filteredTotalPage = Math.ceil(filteredAccuses.length / ITEMS_PER_PAGE);
        const filteredTotalSection = Math.ceil(filteredTotalPage / PAGES_PER_SECTION);

        setTotalPage(filteredTotalPage);
        setTotalSection(filteredTotalSection);
    }, [accuseList, activeTypes]);  // activeTypes가 바뀔 때마다 다시 필터링

    // interface: 유저 컴포넌트 Props //
    interface AccuseUserListProps {
        userList: AccuseUserProps;
    }

    // function: 유저 검색창 컴포넌트 //
    function UserListBox({ userList }: AccuseUserListProps) {

        const [modalOpen, setModalOpen] = useState<boolean>(false);
        const modalBackground = useRef<HTMLDivElement | null>(null);

        const handleSave = () => {
            setModalOpen(false);
        };

        const handleClose = () => {
            setModalOpen(false);
        };

        // event handler: 모달창 오픈 이벤트 처리 함수 //
        const onModalOpenHandler = () => {
            setModalOpen(!modalOpen);

            const accessToken = cookies[ACCESS_TOKEN];
            if (!accessToken) {
                alert('접근 권한이 없습니다.');
                return;
            }
        }

        // function: 일치하는 글자 색칠하기 //
        const highlightMatch = (text: string, keyword: string) => {
            if (!keyword) return text; // 검색어가 없으면 원본 텍스트 반환
            const regex = new RegExp(`(${keyword})`, "gi"); // 검색어를 대소문자 구분 없이 찾는 정규식
            return text.replace(regex, `<span class="highlight">$1</span>`); // 검색어 부분을 <span>으로 감싸기
        };

        return (
            <>
                <div key={userList.userId} className="user-list-box" onClick={onModalOpenHandler}>
                    <div className="user-image" style={{ backgroundImage: userList.profileImage ? `url(${userList.profileImage})` : `url('/defaultProfile.png')` }}></div>
                    <div className="user-list-info">
                        <div className="user-nickname">{userList.name}</div>
                        <div
                            className="user-id"
                            dangerouslySetInnerHTML={{
                                __html: `@${highlightMatch(userList.userId, keyword)}`,
                            }}
                        />
                    </div>
                </div>
                {
                    modalOpen && <div className='accuse-modal-container' ref={modalBackground} onClick={e => {
                        if (e.target === modalBackground.current) {
                            setModalOpen(false);
                        }
                    }}>
                        <div className="event-form">
                            <h2>신고 내역 관리</h2>
                            <div className="profile-group">
                                <div className="profile-user-image" style={{ backgroundImage: userList.profileImage ? `url(${userList.profileImage})` : `url('/defaultProfile.png')` }}></div>
                                <div className="profile-info">
                                    <div className="user-nickname">{userList.name}</div>
                                    <div className="user-id">@{userList.userId}</div>
                                </div>
                            </div>
                            <div className="accuse-group">
                                <label>신고처리 횟수 : {userList.accuseCount}</label>
                            </div>
                            <div className="button-group">
                                <button className='button-red' onClick={handleSave}>영구제명</button>
                                <button onClick={handleClose}>닫기</button>
                            </div>
                        </div>

                    </div>
                }
            </>
        )
    }

    return (
        <div className="mypage-wrapper">
            <div className="admin-side-wrapper">
                <AdminSideBar />
            </div>
            <div className="mypage-main-wrapper">
                <div className="user-box">
                    <div className="main-profile"></div>
                    <div className="mypage-info">
                        <div className="mypage-nickname">관리자</div>
                        <div className="mypage-id">{signInUser?.nickName}</div>
                    </div>
                </div>
                <div className="mypage-state-message">관리자 계정 입니다. </div>
                <div className='accuse-title-box'>
                    <div className="accuse-title">신고 접수 목록</div>
                    <div className='search-box'>
                        <div className='search-container' ref={searchBoxRef}>
                            <input className='search' value={keyword} onChange={onChangeData} onFocus={onFocusInput} placeholder='유저아이디를 검색해주세요.' />
                            <img src="/search.svg" alt="searchIcon" />
                            {autoSearchVisible && (
                                <div className='auto-search-container'>
                                    <div className='user-search-container'>
                                        {userList.map((user) => (
                                            <UserListBox key={user.userId} userList={user} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="discussion-state-box" onClick={onSortingButtonHandler}>{sortingState.selected}
                        {toggleDown && <div className="state-type-box" >
                            <div className="state-type" onClick={() => onSortOptionClickHandler('최신순')}>최신순</div>
                            <div className="state-type" onClick={() => onSortOptionClickHandler('누적 신고순')}>누적 신고순</div>
                        </div>}
                    </div>
                </div>
                <div className='accuse-box'>
                    {['댓글', '|', '게시글', '|', '채팅'].map((type) => (
                        <div
                            key={type}
                            className={`accuse-type ${activeTypes === type ? 'active' : ''}`}
                            onClick={() => onAccuseTypeClickHandler(type)}
                        >
                            {type}
                        </div>
                    ))}
                </div>
                <div className='accuse-table2'>
                    <div className='accuse-th'>번호</div>
                    <div className='accuse-th'>신고내용</div>
                    <div className='accuse-th'>신고글 작성자</div>
                    <div className='accuse-th'>피신고자</div>
                    <div className='accuse-th'>신고 일시</div>
                    <div className='accuse-th'>신고 사유</div>
                </div>
                {viewList
                    .filter(accuse => {
                        const reportType = activeTypes ? typeMapping[activeTypes] : null;
                        return reportType && accuse.reportType === reportType;
                    })
                    .map((accuse, index) => {
                        return <Accusetr key={`${accuse.accuseId}-${index}`} accuse={accuse} index={index} />;
                    })}

                {/* 페이지네이션 UI */}
                <Pagination
                    pageList={pageList}
                    currentPage={currentPage}
                    onPageClickHandler={onPageClickHandler}
                    onPreSectionClickHandler={onPreSectionClickHandler}
                    onNextSectionClickHandler={onNextSectionClickHandler}
                />
            </div>
        </div>

    )
}
