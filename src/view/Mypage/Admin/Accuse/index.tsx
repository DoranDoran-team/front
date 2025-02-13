import React, { useEffect, useState } from 'react'
import './style.css';
import AdminSideBar from '../../../../components/Admin/Sidebar';
import Modal from '../../../../components/modal';
import GetAccuseListResponseDto from '../../../../apis/dto/response/accuse/get-accuse-list.response.dto';
import ResponseDto from '../../../../apis/dto/response/response.dto';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN } from '../../../../constants';
import AccuseComponentProps from '../../../../types/accuseList.interface';
import { getAccuseListRequest } from '../../../../apis';
import { useSignInUserStore } from '../../../../stores';

export default function Accuse() {

    // state: 신고 타입 상태 //
    const [activeTypes, setActiveTypes] = useState<string | null>(null);
    const [toggleDown, setToggleDown] = useState<boolean>(false)
    const [sortingState, setSortingState] = useState({
        selected: '정렬순'
    })
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    // state: cookie 상태 //
    const [cookies] = useCookies();

    const { signInUser, setSignInUser } = useSignInUserStore();
    const [adminCheck, setAdminCheck] = useState<string>('');

    // state: 신고 리스트 상태 //
    const [accuseList, setAccuseList] = useState<AccuseComponentProps[]>([]);

    // variable: 모달 내용 //
    const content = '해당 계정을 처리하시겠습니까?';
    const lt_btn = '아니요';
    const rt_btn = '예';

    // event handler: 신고 타입 클릭 이벤트 처리  //

    const onAccuseTypeClickHandler = (type: string) => {
        if (type === '|') return;
        setActiveTypes(type === activeTypes ? null : type);
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

    // event handler: 모달창 오픈 이벤트 처리 함수 //
    const onModalOpenHandler = () => {
        setModalOpen(!modalOpen);
    }

    useEffect(() => {
        setActiveTypes('댓글')
    }, [])


    // interface: 신고 컴포넌트 Props //
    interface AccuseRowProps {
        accuse: AccuseComponentProps;
    }
    // function: 신고 컴포넌트 //
    function Accusetr({ accuse }: AccuseRowProps) {

        const [accuses, setAccuses] = useState<AccuseComponentProps[]>([]);


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

        // effect: 마운트 될 때 일정 불러오기 //
        useEffect(() => {

            const accessToken = cookies[ACCESS_TOKEN];
            if (!accessToken) {
                alert('접근 권한이 없습니다.');
                return;
            }
            console.log("렌더링된 신고 아이템:", accuse);
            if (signInUser?.userId) {
                setAdminCheck(signInUser.userId);
            }

            getAccuseListRequest(adminCheck, accessToken)
                .then((response) => getAccuseListResponse(response as GetAccuseListResponseDto | ResponseDto | null));
        }, []);

        return (
            <div className='accuse-table' onClick={onModalOpenHandler}>
                <div className='accuse-tr'>1</div>
                <div className='accuse-tr'>{accuse.reportType === 'POST' ? '게시글' : '댓글'}</div>
                <div className='accuse-tr'>{accuse.accuseUserId}</div>
                <div className='accuse-tr'>{accuse.userId}</div>
                <div className='accuse-tr'>{accuse.accuseDate}</div>
                <div className='accuse-tr'>{accuse.reportContents}</div>
            </div>
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

        console.log("🚀 getAccuseListRequest 실행됨");

        if (signInUser?.userId) {
            setAdminCheck(signInUser.userId);
        }

        getAccuseListRequest('songth', accessToken)
            .then((response) => {
                console.log("📩 신고 리스트 응답:", response);
                getAccuseListResponse(response as GetAccuseListResponseDto | ResponseDto | null);
            });
    }, [signInUser]);

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
                        <div className="mypage-id">@ Admin01</div>
                    </div>
                </div>
                <div className="mypage-state-message">관리자 계정 입니다. </div>
                <div className='accuse-title-box'>
                    <div className="accuse-title">신고 접수 목록</div>
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
                <div className='accuse-table'>
                    <div className='accuse-th'>번호</div>
                    <div className='accuse-th'>신고내용</div>
                    <div className='accuse-th'>신고글 작성자</div>
                    <div className='accuse-th'>신고자</div>
                    <div className='accuse-th'>신고 일시</div>
                    <div className='accuse-th'>신고 사유</div>
                </div>
                {activeTypes === '댓글' ?
                    <>
                        {
                            accuseList.map((accuse, index) => {
                                console.log(`Accusetr 렌더링 확인 - index: ${index}`, accuse);
                                return <Accusetr key={`${accuse.accuseId}-${index}`} accuse={accuse} />;
                            })
                        }
                    </>

                    : activeTypes === '게시글' ?
                        <div className='accuse-table'>
                            <div className='accuse-tr'>1</div>
                            <div className='accuse-tr'>게시글</div>
                            <div className='accuse-tr'>@dorai5</div>
                            <div className='accuse-tr'>@normal</div>
                            <div className='accuse-tr'>25.01.01</div>
                            <div className='accuse-tr'>0</div>
                            <div className='accuse-tr'>부적절한 언어 사용</div>
                        </div>
                        : activeTypes === '채팅' ?
                            <div className='accuse-table'>
                                <div className='accuse-tr'>1</div>
                                <div className='accuse-tr'>채팅</div>
                                <div className='accuse-tr'>@dorai5</div>
                                <div className='accuse-tr'>@normal</div>
                                <div className='accuse-tr'>25.01.01</div>
                                <div className='accuse-tr'>0</div>
                                <div className='accuse-tr'>부적절한 언어 사용</div>
                            </div> : ''}
                <div className='asscuse-title-box'>
                    <div className="accuse-title">처리 완료</div>
                </div>
                <div className='accuse-box complete'>

                </div>
                <div className='accuse-table'>
                    <div className='accuse-th'>번호</div>
                    <div className='accuse-th'>신고내용</div>
                    <div className='accuse-th'>신고글 작성자</div>
                    <div className='accuse-th'>신고자</div>
                    <div className='accuse-th'>신고 일시</div>
                    <div className='accuse-th'>누적 신고</div>
                    <div className='accuse-th'>처리 날짜</div>
                </div>
                {activeTypes === '댓글' ? <div className='accuse-table'>
                    <div className='accuse-tr'>1</div>
                    <div className='accuse-tr'>댓글</div>
                    <div className='accuse-tr'>@dorai5</div>
                    <div className='accuse-tr'>@normal</div>
                    <div className='accuse-tr'>25.01.01</div>
                    <div className='accuse-tr'>1</div>
                    <div className='accuse-tr'>25.01.01</div>
                </div>
                    : activeTypes === '게시글' ?
                        <div className='accuse-table'>
                            <div className='accuse-tr'>1</div>
                            <div className='accuse-tr'>게시글</div>
                            <div className='accuse-tr'>@dorai5</div>
                            <div className='accuse-tr'>@normal</div>
                            <div className='accuse-tr'>25.01.01</div>
                            <div className='accuse-tr'>1</div>
                            <div className='accuse-tr'>25.01.01</div>
                        </div>
                        : activeTypes === '채팅' ?
                            <div className='accuse-table'>
                                <div className='accuse-tr'>1</div>
                                <div className='accuse-tr'>채팅</div>
                                <div className='accuse-tr'>@dorai5</div>
                                <div className='accuse-tr'>@normal</div>
                                <div className='accuse-tr'>25.01.01</div>
                                <div className='accuse-tr'>1</div>
                                <div className='accuse-tr'>25.01.01</div>

                            </div> : ''}
            </div>
            {modalOpen && <Modal content="해당계정을 처리하시겠습니까? " lt_btn="아니요" rt_btn="예" rt_handler={onModalOpenHandler} lt_handler={onModalOpenHandler} />}
            <div className="blacklist-wrapper">
                <div className="blacklist-title">활동 중지 2명</div>
                <div className="subscribe-search-box">
                    <input className="input" placeholder="아이디를 입력하세요. " />
                    <div className="button active">검색</div>
                </div>
                <div className="blacklist-box">
                    <div className="blacklist-image"></div>
                    <div className="blacklist-user-info">
                        <div className="blacklist-nickname">마이멜로디</div>
                        <div className="blacklist-user">@1000JEA</div>
                    </div>
                    <div className="subscribe-cancel-button">
                        <div className="subscribe-cancel">취소</div>
                    </div>
                </div>
            </div>
        </div>

    )
}
