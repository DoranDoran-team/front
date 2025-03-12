// interface: 로그인한 유저가 팔로우한 사람 정보 //
export default interface Subscribers {
    userId: string;
    profileImage: string | null;
    nickName: string;
}