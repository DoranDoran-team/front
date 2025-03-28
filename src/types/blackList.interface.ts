// interface: 활동 중지 유저 타입 //
export default interface BlackList {
    userId: string;
    nickName: string;
    profileImage: string;
    accuseCount: number;
    accuseTime: string;
    accuseState: boolean;
  }