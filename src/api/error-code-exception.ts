export const enum ErrorCode {
    INVALID_CREDENTIALS = 1,
    TOKEN_INVALID = 2,
    INVALID_IMAGE_FORMAT = 3,
    PASSWORD_CONFIRMATION_MANDATORY = 4,
    USER_NOT_FOUND = 5,
}

export const enum ErrorMessage {
    INVALID_CREDENTIALS = 'Invalid credentials',
    TOKEN_INVALID = 'Token invalid',
    INVALID_IMAGE_FORMAT = 'Invalid image format, accepts only jpg, jpeg, png and gif',
    PASSWORD_CONFIRMATION_MANDATORY = 'Password confirmation is mandatory',
    USER_NOT_FOUND = 'User not found'
}

export function getErrorException(error: ErrorCode) {
    switch (error) {
        case ErrorCode.INVALID_CREDENTIALS:
            return {
                errorCode: error,
                message: ErrorMessage.INVALID_CREDENTIALS,
            }
        case ErrorCode.TOKEN_INVALID:
            return {
                errorCode: error,
                message: ErrorMessage.TOKEN_INVALID,
            }
        case ErrorCode.INVALID_IMAGE_FORMAT:
            return {
                errorCode: error,
                message: ErrorMessage.INVALID_IMAGE_FORMAT,
            }
        case ErrorCode.USER_NOT_FOUND:
            return {
                errorCode: error,
                message: ErrorMessage.PASSWORD_CONFIRMATION_MANDATORY,
            }
        case ErrorCode.USER_NOT_FOUND:
            return {
                errorCode: error,
                message: ErrorMessage.PASSWORD_CONFIRMATION_MANDATORY,
            }
        default:
    }
}