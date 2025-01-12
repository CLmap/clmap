import { Profile } from "@/app/api/entity/profile";
import { CreateMemberParams, MemberRepository } from "./repository";
import { CreateInitInfoRequest } from "./init-info/route";

import type { User } from "next-auth";

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
    
    // 초기 회원 정보 생성
    public async createMemberInitInfo(dto: CreateInitInfoRequest, id: User["id"]): Promise<void> {
        const exists = await this.isMemberExist(id);
        if (!exists) {
            throw new Error(`멤버 id가 존재하지 않음`);
        }

        const { nickname, crewName, climbingStartDate, userInstagramId } = dto;
        const image = ""; // 기본값 설정

        // TODO: 이미지 업로드 로직 추가
        // const uploadedImage = await this.uploadImage(dto.imageFile);
            
        const profileEntity = new Profile();
        profileEntity.id = id;
        profileEntity.nickname = nickname;
        profileEntity.crewName = crewName;
        profileEntity.climbingStartDate = climbingStartDate;
        profileEntity.instagramId = userInstagramId;
        profileEntity.image = image;

        await this.memberRepository.createMemberInitInfo(dto);
    }
}
