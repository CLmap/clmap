import data from './nickname_set.json' assert { type: 'json' };

import { NextRequest } from "next/server";
import { MemberService } from "../service";
import withErrorHandler from '@/utils/server-exception';

export interface Nickname {
    nickname: string;
}

export interface CreateNicknameResponse {
    status: number;
    message: string;
    data: Nickname;
}

/**
 * @swagger
 * /api/members/nickname:
 *   get:
 *     description: 닉네임 생성
 *     responses:
 *       200:
 *         description: Hello world!
 */
export const GET = withErrorHandler(async function(request: NextRequest):Promise<Response> {
    const memberService = MemberService.getInstance();
    const result = await memberService.createNickname();
    //응답 body 생성
    const responseBody: CreateNicknameResponse = {
        status: 200,
        message: "ok",
        data: result
    }
    //응답
    return new Response(JSON.stringify(responseBody), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
})
