export const API_ROUTES = {
  FETCH_DOCUMENT_DATA_API_URL: "/admin/fetchImagesData",
  SET_COORDINATES_DATA_API_URL: "/admin/setTemplateCoordinates",
};

export const STATUS_CODE = {
  SUCCESS: 200,
  UNAPPROVED: 401,
  UNAUTHORIZED: 400,
  ERROR: 404,
};

export const RESPONSE_MSGS = {
  ERROR: "Something went wrong!",
  OTP_SENT: "OTP sent successfully!",
  OTP_VERIFIED: "OTP verified successfully!",
  LOGGED_IN: "LoggedIn successfully!",
  EMAIL_SENT: "Email sent successfully!",
  PASSWORD_CHANGED: "Password changed successfully!",
  AGREEMENT_UPLOAD_SUCCESS: "Successfully Imported!",
  AGREEMENT_UPLOAD_FAILED: "Importing Failed!",
  EXTRACTION_VALIDATE_SUCCESS: "Extraction validated successfully!",
  NO_RESULT_FOUND: "No Result Found",
  EXTRACTION_AGREEMENT_SUCCESS: "Extraction Agreement successfully!",
  NEW_AGREEMENT_SUCCESS: "Successfully Done!",
  AGREEMENT_REJECTED_STATUS: "Agreement Rejected",
  AGREEMENT_SHARED_STATUS: "Agreement shared successfully",
  AGREEMENT_SIGNED_STATUS: "Agreement signed successfully",
  VENDOR_CREATED_SUCCESS: "User created successfully",
  TOKEN_EXPIRED_AND_LOGIN_AGAIN: "Session Expired. Please login again.",
  EXTRACTION_DELETE_SUCCESS: "Document deleted successfully!",
};
