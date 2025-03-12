import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import './style.css';
import { useNavigate, useParams } from 'react-router-dom';
import { ACCESS_TOKEN, MY_PATH } from '../../../constants';
import { useSignInUserStore } from '../../../stores';
import PatchProfileRequestDto from '../../../apis/dto/request/mypage/myInfo/patch-profile.request.dto';
import { fileUploadRequest, patchProfileRequest } from '../../../apis';
import { useCookies } from 'react-cookie';
import ResponseDto from '../../../apis/dto/response/response.dto';
import MypageSidebar from '../../../components/mypage/sidebar';

// component: 내 정보 수정 화면 컴포넌트 //
export default function Update() {

    // variable: 기본 이미지 URL //
    const defaultProfileImageUrl = 'http://localhost:3000/defaultProfile.png';

    // state: 쿠키 상태 //
    const [cookies, setCookie] = useCookies();

    // state: 로그인 유저 정보 상태 //
    const { signInUser, setSignInUser } = useSignInUserStore();

    // state: 내정보 입력 상태 //
    const [nickname, setNickName] = useState<string>('');
    const [stateMessage, setStateMessage] = useState<string>('');
    const [state] = useState<boolean>(true);

    // state: 등록 파일 상태 //
    const storeUrlInputRef = useRef<HTMLInputElement | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(defaultProfileImageUrl);
    const [storeImageUrl, setStoreImageUrl] = useState<File | null>(null);

    // variable: access token //
    const accessToken = cookies[ACCESS_TOKEN];

    // function: navigator 함수 처리 //
    const navigator = useNavigate();

    // event handler: 닉네임 변경 이벤트 처리 함수 //
    const onNickNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setNickName(value);
    }

    // event handler: 상태메세지 변경 이벤트 처리 함수 //
    const onStateMessageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setStateMessage(value);
    }

    // event handler: 이미지 클릭 이벤트 핸들러 //
    const onStoreImageClickHandler = () => {
        const { current } = storeUrlInputRef;
        if (!current) return;
        current.click();
    };

    // event handler: 대표 이미지 파일 선택 //
    const onStoreUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        if (!files || !files.length) return;

        const file = files[0];
        setStoreImageUrl(file);

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onloadend = () => {
            setPreviewUrl(fileReader.result as string);
        }
    };

    // event handler: 수정 완료 버튼 클릭 이벤트 처리 함수 //
    const onCompleteButtonHandler = async () => {
        if (!nickname || !signInUser) return;

        let url: string | null = null;
        if (storeImageUrl) {
            const formData = new FormData();
            formData.append('file', storeImageUrl);
            url = await fileUploadRequest(formData);
            //if(url) setPreviewUrl(url);
        }

        if(url) {
            // 새로운 프로필 이미지 등록
            const requestBody: PatchProfileRequestDto = {
                nickName: nickname,
                profileImage: url,
                statusMessage: stateMessage,
            }
            console.log(requestBody);
            patchProfileRequest(requestBody, accessToken).then(patchProfileResponse);

        } else {
            // 기존의 프로필 이미지 유지
            const requestBody: PatchProfileRequestDto = {
                nickName: nickname,
                profileImage: signInUser.profileImage,
                statusMessage: stateMessage,
            }
            console.log(requestBody);
            patchProfileRequest(requestBody, accessToken).then(patchProfileResponse);
        }
    }

    // function: 프로필 수정 완료 처리 함수 //
    const patchProfileResponse = (responseBody: ResponseDto | null) => {

        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'VF' ? '일치하는 정보가 없습니다.' :
                    responseBody.code === 'AF' ? '일치하는 정보가 없습니다.' :
                        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
                            responseBody.code === 'NI' ? '존재하지 않는 사용자입니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';

        if (!isSuccessed) {
            alert(message);
            return;
        }

        navigator(MY_PATH);
        window.location.reload();
    };

    // effect: 기존 정보 불러오기 //
    useEffect(() => {
        if (signInUser) {
            setNickName(signInUser.nickName);
            setStateMessage(signInUser.statusMessage ?? '');
            setPreviewUrl(signInUser.profileImage ?? defaultProfileImageUrl);
        }
    }, [signInUser]);

    // render: 내정보 수정 화면 렌더링 
    return (
        <div className="mypage-update-wrapper">
            <MypageSidebar />
            <div className="mypage-main-wrapper">
                <div className="user-box">
                    <div id='image'>
                        <div className="main-profile" onClick={onStoreImageClickHandler}
                            style={{ backgroundImage: `url(${previewUrl})` }}>
                            <input ref={storeUrlInputRef} style={{ display: 'none' }} type='file' accept='image/*' onChange={onStoreUrlChange} />
                        </div>
                    </div>

                    <div className="mypage-info">
                        <input className="mypage-nickname edit" value={nickname} placeholder='닉네임을 입력해주세요. ' onChange={onNickNameChangeHandler} />
                        <div className="mypage-id">@{signInUser?.userId}</div>
                    </div>
                    <div className="edit-button-box" >
                        <div className={`edit-button ${nickname ? 'complete' : 'fail'}`} onClick={onCompleteButtonHandler}>완료</div>
                    </div>
                </div>
                <input className="mypage-state-message edit" value={stateMessage}
                    placeholder='상태메세지를 입력해주세요 ' onChange={onStateMessageChangeHandler} />
            </div>

        </div>
    )
}
