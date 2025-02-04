import DiscussionList from "../../../../types/discussionList.interface";
import ResponseDto from "../response.dto";

export default interface GetDiscussionListResponseDto extends ResponseDto{
    discussionList:DiscussionList[];
}