import Reply from "./Reply.interface";

// interface: 댓글 리스트 타입 정의//
export default interface Comment {
    commentId:number;
    roomId:number;
    nickName:string;
    profileImage:string;
    commentContents:string;
    commentTime:string;
    discussionType:string;
    replies:Reply[];
}