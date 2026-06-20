import connectDB from "@/lib/db";
import ChatMessage from "@/models/chatMessage.model";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const geminiUrl = process.env.GEMINI_API_URL!

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const {lastMsg, role} = await req.json()
        const prompt = `You are an AI replay suggestion system for a vehicle booking chat app.
        
        Generate short, smart, human-like quick replay suggestions based on:
        - Role (Driver or User)
        - Recent_Message (last message in the chat)

        Rules:
        - Return exactly 3 suggestions
        - Keep replies short (3-12 words)
        - Match the coversation context and tone
        - Driver replies should sound professional and polite and helful
        - User replies should sound natural and realistic
        - Avoid repitition and generic responses
        - Return ONLY valid JSON

        Output Format:
        {
            "suggestions": [
                "Reply 1",
                "Reply 2",
                "Reply 3",
            ]
        }

        Input:
        Role: ${role}
        Recent_Message: "${lastMsg}"
        `
        const response = await axios.post(geminiUrl, {
            "contents": [
                {
                    "parts": [
                        {
                            "text": `${prompt}`
                        }
                    ]
                }
            ]
        })
        const suggestions = response.data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '')
        return NextResponse.json({ suggestions }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: 'Failed to get ai messages' }, { status: 500 })
    }
}