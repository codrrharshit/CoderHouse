export const HOST= import.meta.env.VITE_SERVER_URL;
export const AUTH_ROUTES="api/auth";
export const ACTIVATE_ROUTES="api/activate"
export const ROOM_ROUTES="api/room"






// all the routes will be here 
export const SEND_OTP=`${AUTH_ROUTES}/sendOtp`
export const VERIFY_OTP=`${AUTH_ROUTES}/verifyOtp`
export const LOGOUT=`${AUTH_ROUTES}/logout`

export const ACTIVATE=`${ACTIVATE_ROUTES}/activate`



export const CREATE_ROOM=`${ROOM_ROUTES}/create`
export const GET_ROOM=`${ROOM_ROUTES}/getroom`
export const GET_ROOM_BY_ID=`${ROOM_ROUTES}/getroom/`




