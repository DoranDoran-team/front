export default interface SignInUser {
    userId: string;
    profileImage: string | null;
    name: string;
    telNumber: string;
    nickName: string;
    role: boolean;
    mileage: string | null;
    statusMessage : string | null;
}