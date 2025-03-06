import MyDiscussion from "../../../../../types/my-discussion.interface";
import ResponseDto from "../../response.dto";

export default interface GetUserProfileResponseDto extends ResponseDto{
    profileImage: string;
    nickName: string;
    statusMessage : string | '';
    myDiscussions: MyDiscussion[];
    subscribers: number;
}