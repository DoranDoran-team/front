import Subscribers from "../../../../types/subscribers.interface";
import ResponseDto from "../response.dto";

// interface: get sign in response body dto //
export default interface GetSignInResponseDto extends ResponseDto{
    userId: string;
    profileImage: string | null;
    name: string;
    telNumber: string;
    nickName: string;
    role: boolean;
    mileage: string | null;
    statusMessage : string | null;
    subscribers: Subscribers[];
    subscribersCount: number | null;
}