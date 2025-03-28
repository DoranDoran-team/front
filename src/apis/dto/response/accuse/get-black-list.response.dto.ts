import BlackList from "../../../../types/blackList.interface";
import ResponseDto from "../response.dto";

export default interface GetBlackListResponseDto extends ResponseDto {
    blackLists: BlackList[];
}