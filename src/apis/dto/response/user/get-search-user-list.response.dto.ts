import ResponseDto from "../response.dto";

// 개별 사용자 정보
export interface SearchUserData {
    userId: string;
    nickName: string;
    profileImage: string | null;
    statusMessage: string | null;
    role: boolean;
}

// /api/users/search 결과 전체
export default interface GetSearchUserListResponseDto extends ResponseDto {
    userList: SearchUserData[];
}
