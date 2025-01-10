// variable: 상대 경로 상수 //
export const ROOT_PATH = '/';

export const LOGIN_PATH = '/login';
export const FIND_ID = '/find-id';
export const FIND_ID_RESULT = '/find-id-result';
export const FIND_PW = '/find-pw';
export const CHANGE_PW = '/change-pw';
export const SIGN_UP = '/sign-up';

export const MAIN_PATH = '/main';

export const GEN_DISC_PATH = '/gen_disc';
export const RT_DISC_PATH = '/rt_disc';
export const NOTICE = '/notice';
export const SCHEDULE = '/schedule';

export const MY_PATH = '/mypage';
export const MY_UPDATE_PATH = (userId: string|number) => `${userId}/update`;
export const ADMIN_PATH = '/admin'

export const SNS_SUCCESS_PATH = '/sns-success';
export const OTHERS_PATH = '*';


// variable: 절대 경로 상수 //
export const ROOT_ABSOLUTE_PATH = ROOT_PATH;

export const LOGIN_ABSOLUTE_PATH = LOGIN_PATH;
export const FIND_ID_ABSOLUTE_PATH = FIND_ID;
export const FIND_PW_ABSOLUTE_PATH = FIND_PW;
export const FIND_ID_RESULT_ABSOLUTE_PATH = FIND_ID_RESULT;
export const CHANGE_PW_ABSOLUTE_PATH = CHANGE_PW;
export const SIGN_UP_ABSOLUTE_PATH = SIGN_UP;

export const MAIN_ABSOLUTE_PATH = MAIN_PATH;

export const GEN_DISC_ABSOLUTE_PATH = GEN_DISC_PATH;
export const RT_DISC_ABSOLUTE_PATH = RT_DISC_PATH;
export const NOTICE_ABSOLUTE_PATH = NOTICE;
export const SCHEDULE_ABSOLUTE_PATH = SCHEDULE;

export const MY_ABSOLUTE_PATH = MY_PATH;
export const MY_ABSOLUTE_UPDATE_PATH = (userId:string|number) => `${MY_PATH}/${MY_UPDATE_PATH(userId)}`

export const ADMIN_ABSOULTE_PATH = ADMIN_PATH;
export const OTHERS_ABSOLUTE_PATH = OTHERS_PATH;

// variable: HTTP BEARER TOKEN COOKIE NAME //
export const ACCESS_TOKEN = 'accessToken';