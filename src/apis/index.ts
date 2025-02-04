import axios, { AxiosResponse } from "axios";
import ResponseDto from "./dto/response/response.dto";
import IdCheckRequestDto from "./dto/request/auth/id-check.request.dto";
import TelAuthRequestDto from "./dto/request/auth/tel-auth.request.dto";
import TelAuthCheckRequestDto from "./dto/request/auth/tel-auth-check.request.dto";
import SignUpRequestDto from "./dto/request/auth/sign-up.request.dto";
import SignInRequestDto from "./dto/request/auth/sign-in.request.dto";
import SignInResponseDto from "./dto/response/auth/sign-in.response.dto";
import IdSearchNameTelNumberRequestDto from "./dto/request/auth/id-search-name-tel-number.request.dto";
import findIdResultResponseDto from "./dto/response/auth/find-id-result.response.dto";
import FindPwRequestDto from "./dto/request/auth/find-pw.request.dto";
import PatchPwRequestDto from "./dto/request/auth/patch-pw.request.dto";
import PostDiscussionWirteRequestDto from "./dto/request/gd_discussion/post-discussion-wirte.request.dto";
import GetSignInResponseDto from "./dto/response/user/get-sign-in.response.dto";


// variable: api url 상수//
const DORANDORAN_API_DOMAIN = process.env.REACT_APP_API_URL;

const AUTH_MODULE_URL = `${DORANDORAN_API_DOMAIN}/api/v1/auth`;
const GENERAL_DISCUSSION_MODULE_URL = `${DORANDORAN_API_DOMAIN}/api/v1/gen_disc`

const ID_CHECK_API_URL = `${AUTH_MODULE_URL}/id-check`;
const TEL_AUTH_API_URL = `${AUTH_MODULE_URL}/tel-auth`;
const TEL_AUTH_CHECK_API_URL = `${AUTH_MODULE_URL}/tel-auth-check`;
const SIGN_UP_API_URL = `${AUTH_MODULE_URL}/sign-up`;
const SIGN_IN_API_URL = `${AUTH_MODULE_URL}/sign-in`;

const ID_SEARCH_NAME_TEL_API_URL = `${AUTH_MODULE_URL}/find-id`;
const ID_SEARCH_TEL_AUTH_API_URL = `${AUTH_MODULE_URL}/find-id-check`;
const FIND_PW_API_URL = `${AUTH_MODULE_URL}/find-pw`;
const PATCH_PASSWORD_API_URL = `${AUTH_MODULE_URL}/change-pw`;

const WRITE_GENENRAL_DISCUSSION_API_URL = `${GENERAL_DISCUSSION_MODULE_URL}/write`;
const GET_GENENRAL_DISCUSSION_LIST_API_URL = `${GENERAL_DISCUSSION_MODULE_URL}`;
const GET_SIGN_IN_API_URL = `${GENERAL_DISCUSSION_MODULE_URL}/sign-in`;  


const FILE_UPLOAD_URL = `${DORANDORAN_API_DOMAIN}/file/upload`;

const multipart = {headers: { 'Content-Type': 'multipart/form-data' } };

// function: Authorization Bearer 헤더값 //
const bearerAuthorization = (accessToken: String) => ({headers: {'Authorization': `Bearer ${accessToken}`}});

// function: response data 처리 함수 //
const responseDataHandler = <T>(response: AxiosResponse<T, any>) => {
    const {data} = response;
    return data;
};

// function: response error 처리 함수 //
const responseErrorHandler = (error: any) => {
    if(!error.response) return null;
    const {data} = error.response;
    return data as ResponseDto;
};

// function: file upload 요청 함수 //
export const fileUploadeRequest = async (requestBody: FormData) => {
    const url = await axios.post(FILE_UPLOAD_URL, requestBody, multipart)
        .then(responseDataHandler<string>)
        .catch(error => null);
    return url;
};

// function: get sign in api 요청 함수 //
export const getSignInRequest = async (accessToken:string) => {
    const responseBody = await axios.get(GET_SIGN_IN_API_URL, bearerAuthorization(accessToken))
        .then(responseDataHandler<GetSignInResponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
}
// function: id check api 요청 함수 //
export const idCheckRequest = async (requestBody: IdCheckRequestDto) => {
    const responseBody = await axios.post(ID_CHECK_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: tel auth api 요청 함수 //
export const telAuthRequest = async (requestBody: TelAuthRequestDto) => {
    const responseBody = await axios.post(TEL_AUTH_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: tel auth check 요청 함수 //
export const telAuthCheckRequest = async (requestBody: TelAuthCheckRequestDto) => {
    const responseBody = await axios.post(TEL_AUTH_CHECK_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: sign up 요청 함수 //
export const signUpRequest = async(requestBody: SignUpRequestDto) => {
    const responseBody = await axios.post(SIGN_UP_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: sign in 요청 함수 //
export const signInRequest = async(requestBody: SignInRequestDto) => {
    const responseBody = await axios.post(SIGN_IN_API_URL, requestBody)
        .then(responseDataHandler<SignInResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: id search first 요청 함수 (name + telNumber) //
export const idSearchNameTelNumberRequest = async (requestBody: IdSearchNameTelNumberRequestDto) => {
    const responseBody = await axios.post(ID_SEARCH_NAME_TEL_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: id search middle (전화번호 + 인증번호) 요청 함수 //
export const idSearchTelAuthRequest = async (requestBody: TelAuthCheckRequestDto) => {
    const responseBody = await axios.post(ID_SEARCH_TEL_AUTH_API_URL, requestBody)
        .then(responseDataHandler<findIdResultResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: password resetting (userId + telNumber) 요청 함수 //
export const findPwRequest = async (requestBody: FindPwRequestDto) => {
    const responseBody = await axios.post(FIND_PW_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 비밀번호 재설정 patch password 요청 함수 //
export const patchPasswordRequest = async (requestBody: PatchPwRequestDto) => {
    const responseBody = await axios.patch(PATCH_PASSWORD_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 일반 토론방 작성 post discussion 요청 함수 //
export const postDiscussionRequest = async(requestBody: PostDiscussionWirteRequestDto, accessToken:string) => {
    const repsonseBody = await axios.post(WRITE_GENENRAL_DISCUSSION_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return repsonseBody;
}

// function: 일반 토론방 리스트 get discussion List 요청 함수 //
export const getDiscussionListRequest = async(accessToken:string) => {
    const responseBody = await axios.get(GET_GENENRAL_DISCUSSION_LIST_API_URL, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}