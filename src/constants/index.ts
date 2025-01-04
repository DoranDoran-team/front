// variable: 상대 경로 상수 //
export const ROOT_PATH = '/';

export const AUTH_PATH = '/auth';

export const GD_PATH = '/gd';
export const GD_WRITE_PATH = 'write';
export const GD_DETAIL_PATH = (roomId: string | number) => `${roomId}`;
export const GD_UPDATE_PATH = (roomId: string | number) => `${roomId}/update`;

export const OTHERS_PATH = '*';


// variable: 절대 경로 상수 //
export const ROOT_ABSOLUTE_PATH = ROOT_PATH;

export const AUTH_ABSOLUTE_PATH = AUTH_PATH;

export const GD_ABSOLUTE_PATH = GD_PATH;
export const GD_WRITE_ABSOLUTE_PATH = `${GD_PATH}/${GD_WRITE_PATH}`;
export const GD_DETAIL_ABSOLUTE_PATH = (roomId: string | number) => `${GD_PATH}/${GD_DETAIL_PATH(roomId)}`;
export const GD_UPDATE_ABSOLUTE_PATH = (roomId: string | number) => `${GD_PATH}/${GD_UPDATE_PATH(roomId)}`;


