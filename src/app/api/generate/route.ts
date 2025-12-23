import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY || "";
const baseUrl = process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com";

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing in environment variables");
      return NextResponse.json({ error: "API Key is not configured on the server" }, { status: 500 });
    }

    const model = "gemini-2.0-flash";
    // Ensure baseUrl doesn't have a trailing slash to avoid double slashes
    const sanitizedBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const url = `${sanitizedBaseUrl}/v1beta/models/${model}:generateContent?key=${apiKey}`;


    const prompt = `你好，你是一个“图文知识卡片策划与结构化输出”助手。你的任务是把用户输入的文本，转成用于知识卡片展示的结构化 JSON。

硬性规则：
1) 只输出 JSON，不要输出任何解释、注释、Markdown 代码块、前后缀文字。
2) 输出必须是一个 JSON 对象，字段名必须与 schema 一致，不能新增字段，不能缺字段。
3) cards 数组长度必须等于 suggestedCards；strategy 数组长度也必须等于 suggestedCards。
4) suggestedCards 只能是 1 到 4 的整数。
5) 每张卡片必须包含 title（1 行）和 points（2 到 4 条）。
6) 不要编造用户未提供的具体事实或数据；只做概括、提炼、结构化。

内容类型定义：
- "金句 / 观点型"：一句或几句强观点、结论、态度。
- "笔记 / 知识型"：信息点、概念解释、框架摘录、知识总结。
- "思考 / 方法论型"：推理链、方法步骤、可行动建议、复盘总结。

输出 JSON schema：
{
  "contentType": string,
  "suggestedCards": number,
  "strategy": string[],
  "cards": [
    {
      "title": string,
      "points": string[]
    }
  ]
}

生成要求：
- 先判断 contentType。
- 决定 suggestedCards（1-4）并给出 strategy（每张卡片的功能定位）。
- 生成 cards：title 贴合定位；points 为短句，2-4 条。
- 输出使用简体中文。title 不超过 18 个字，points 每条不超过 28 个字。
- 输出前请自检：cards.length == suggestedCards 且 strategy.length == suggestedCards。

用户输入：
${content}`;

    const apiResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          response_mime_type: "application/json",
        },
      }),
    });

    const result = await apiResponse.json();

    if (!apiResponse.ok) {
      console.error("Gemini API Error:", result);
      // If gemini-1.5-flash fails with 404, try gemini-pro as fallback if needed, 
      // but let's see if this direct fetch fixes the baseUrl issue first.
      return NextResponse.json({ error: result.error?.message || "API call failed" }, { status: apiResponse.status });
    }

    try {
      const text = result.candidates[0].content.parts[0].text;
      // With response_mime_type: "application/json", it should be clean JSON
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch (parseError) {
      console.error("JSON parse error:", parseError, result);
      return NextResponse.json({ error: "AI returned invalid JSON" }, { status: 500 });
    }
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
