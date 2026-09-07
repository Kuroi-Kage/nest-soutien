import { Injectable } from "@nestjs/common";
import { RiskLevel } from "../generated/prisma/enums.js";

@Injectable()
export class RiskService {
    private readonly highRiskPatterns: RegExp[] = [
        /envie de (mourir|dispara[iî]tre)/i,
        /je (veux|vais) (me suicider|en finir)/i,
        /je (me suis|vais me) faire du mal/i,
        /plus envie de vivre/i,
    ];

    private readonly moderateRiskPatterns: RegExp[] = [
        /je (ne )?vais pas bien du tout/i,
        /personne ne (me comprend|s'en soucie)/i,
        /je (me sens|suis) (perdu|au bout)/i,
        /(violence|abus|maltraitance)/i,
    ]

    assessMessage(content: string): { level: RiskLevel; matched: boolean } {
        if (this.highRiskPatterns.some((pattern) => pattern.test(content))) {
            return { level: RiskLevel.CRITICAL, matched: true };
        }

        if (this.moderateRiskPatterns.some((pattern) => pattern.test(content))) {
            return { level: RiskLevel.MODERATE, matched: true };
        }
        return { level: RiskLevel.NONE, matched: false };
    }
    shouldEscalateToModerator(level: RiskLevel): boolean {
        return level === RiskLevel.HIGH || level === RiskLevel.CRITICAL;
    }

    getEmergencyResources(countryCode: string): { label: string; contact: string }[] {
        const resources: Record<string, { label: string; contact: string }[]> = {
            MGA: [
                { label: 'SOS Amitié', contact: '09 72 39 40 50' },
                { label: 'XXX - Numéro national de prévention du suicide', contact: '3114' },
            ],
            BNGRC: [{ label: 'Centre de prévention du suicide', contact: '0800 32 123' }],
            ONG: [{ label: 'Service de prévention du suicide', contact: '1 833 456 4566' }],
        };
        return resources[countryCode] ?? resources['MGA'];
    }
}