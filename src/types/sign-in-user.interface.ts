
import VoteInfo from "./voteInfo.interface";
import Subscribers from "./subscribers.interface";

export default interface SignInUser {
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
    accuseCount: number;
    accuseState: boolean;
    accuseTime: string;
}