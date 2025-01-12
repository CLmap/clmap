import { NextRequest, NextResponse } from "next/server";

function withErrorHandler(fn:Function) {
  return async function (request:NextRequest, ...args:any) {
    try {
      return await fn(request, ...args);
    } catch (error: unknown) {
        
      // console에 뜨는 에러
      console.error({ error, requestBody: request, location: fn.name });
      
      // 에러별로 핸들링할 예정
      if (error instanceof Error) {
          return NextResponse.json(
            { message: error.message },
            { status: 400 }
          );
      }
      
      // 서버 오류
      return NextResponse.json(
        { message: "An unknown error occurred" },
        { status: 500 }
      );
    }
  };
}

export default withErrorHandler;