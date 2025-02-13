import ResponseDto from "../response.dto";

export default interface GetDiscussionResponseDto extends ResponseDto {
  discussionResultSet: {
    userId: string,
    nickName: string,
    profileImage: string,
    discussionType: string,
    roomTitle: string,
    discussionImage: string,
    createdRoom: string,
    agreeOpinion: string,
    oppositeOpinion: string,
    discussionEnd: string,
    updateStatus: boolean,
    commentCount: number,
    likeCount: number,
    roomId: number,
    roomDescription: string
  };
  comments: any[];  // 댓글 데이터 (필요하면 타입 수정)
}