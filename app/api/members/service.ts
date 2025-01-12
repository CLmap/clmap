import { Profile } from "@/app/api/entity/profile";
import { CreateMemberParams, MemberRepository } from "./repository";
import { Nickname } from "./nickname/route";
import type { User } from "next-auth";

import data from '@/app/api/members/nickname/nickname_set.json' assert { type: 'json' };

export class MemberService {
    private static instance: MemberService;
    
    private memberRepository: MemberRepository;
    
    // 생성 시 MemberRepository 의존성 주입
    private constructor() {
        this.memberRepository = MemberRepository.getInstance();
    }
    
    // 객체 호출
    public static getInstance(): MemberService {
        if (!this.instance) {
            this.instance = new MemberService();
        }
        return this.instance;
    }
    
    // 회원 존재 여부 확인
    private async isMemberExist(id: User["id"]): Promise<boolean> {
        return await this.memberRepository.existMember(id);
    }
    
    // 회원 존재 여부 확인
    private async isNicknameExist(nickname: string): Promise<boolean> {
        return await this.memberRepository.existMemberNickname(nickname);
    }

    // 회원 생성
    public async createMember({ id, provider, refreshToken, expiresAt }: CreateMemberParams): Promise<void> {
        try {
            const exists = await this.isMemberExist(id);
            if (!exists) {
                await this.memberRepository.createMember({ id, provider, refreshToken, expiresAt });
            } else {
                console.warn(`이미 존재함`);
            }
        } catch (error) {
            console.error(`이미 존재함`);
            throw error;
        }
    }
    
    public async createNickname(): Promise<Nickname> {
        let adjective: string;
        let animal: string;
        let nickname: string;
        let count = 0;
        // 닉네임 중복 체크
        do {
            if (count++ >= 10) throw new Error("부여할 수 있는 닉네임이 없습니다.");
            adjective = data.prefix[Math.floor(Math.random() * data.prefix.length)];
            animal = data.suffix[Math.floor(Math.random() * data.suffix.length)];
            nickname = `${adjective} ${animal}`;
        } while(await this.isNicknameExist(nickname));
        
        const result: Nickname = {
            nickname: `${adjective} ${animal}`
        }
        
        return result;
    }
}
