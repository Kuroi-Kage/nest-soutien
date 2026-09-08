import { Injectable } from "@nestjs/common";

@Injectable()
export class AiGatewayClient {
    private readonly baseUrl = process.env.AI_GATEWAY_URL;
    private readonly apiKey = process.env.AI_GATEWAY_API_KEY;

    async getAssistanReply(conversationHistory: { role: 'user' | 'assistant'; content: string}[]): Promise<string> {
        if (!this.baseUrl || !this.apiKey) {
            return "Je suis là pour t'écouter. Tu veux m'en dire un peu plus ?";

        }

        const response = await fetch(`${this.baseUrl}/v1/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:` Bearer ${this.apiKey}`,

            },
            body: JSON.stringify({
                messages: conversationHistory,
                system:
                "Tu es un assisitant de soutien émotionnel bieveillant et non-jugeant. " + 
                'Tu ne remplces jamais un professionnel de santé. Reste chaleureux, simple et humain.',
            }),
        });

        if (!response.ok) {
            throw new Error(`AI Gateway a repondu avec le statut ${response.status}`);
        }

        const data = await response.json();
        return data.reply;
    }
}