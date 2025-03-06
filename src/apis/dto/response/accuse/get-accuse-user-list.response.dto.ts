import AccuseUserProps from "../../../../types/accuseUserList.interface";
import ResponseDto from "../response.dto";

export default interface GetAccuseUserListResponseDto extends ResponseDto {
  accuseUserList: AccuseUserProps[];
}