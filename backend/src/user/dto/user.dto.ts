export interface UserDTO {
    intraId: string;
    name: string;
    image: string;
    score?: number;
    mfa_enabled: boolean;
    friends?: string[];
    blocks?: string[];
    status?: string;
}

export interface StatisticsDTO {
    score: number;
    matches: number;
    wins: number;
    goalsMade: number;
    goalsTaken: number;
    scorePerMatches: number; // *
    looses: number; // *
    winsPerLooses: number; // *
    goalsMadePerTaken: number; // *
    // * No need to be on database, because its calculated.
}

export interface TokenDTO {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    created_at: number;
}

export interface registerResp {
    intraId?: string;
    mfa_enabled?: boolean;
    mfa_verified?: boolean;
}