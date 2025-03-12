import CommentInfo from "../../../../types/comment-info.interface copy";
import ResponseDto from "../response.dto";

// interface: 토론방 좋아요 결과 response dto //
export default interface GetLikeListResponseDto extends ResponseDto{

    roomId:number;
    likePost:boolean;
    isLikeComment : CommentInfo[];
}