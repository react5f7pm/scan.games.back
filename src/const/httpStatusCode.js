const StatusCode = {
  OK:             200, // 성공
  EMPTY_RESPONSE: 204, // 성공 & 응답 데이타는 없음

  INVALID_PARAMS: 400, // 잘못된 요청 
  INVALID_AUTH:   401, // 인증받지 않음
  NOT_FOUND:      404, // 리소스 찾을 수 없음
  CONFLICT:       409, // 리소스 중복(충돌)

  INTERNAL_ERROR: 500, // 서버 내부 오류
}

export default StatusCode