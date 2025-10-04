import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("📄 Document upload started");
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.log("❌ No file provided");
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    console.log(`📎 Processing file: ${file.name} (${file.type})`);

    // Read file content
    const buffer = await file.arrayBuffer();
    let text = "";

    // Extract text based on file type
    if (file.type === "text/plain" || file.type === "text/markdown") {
      text = new TextDecoder().decode(buffer);
    } else if (file.type === "application/pdf") {
      // PDF parsing - will need pdf-parse library
      try {
        const pdfParse = require("pdf-parse");
        const pdfData = await pdfParse(Buffer.from(buffer));
        text = pdfData.text;
      } catch (err) {
        return NextResponse.json(
          { error: "PDF parsing library not installed. Run: npm install pdf-parse" },
          { status: 500 }
        );
      }
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // DOCX parsing - will need mammoth library
      try {
        const mammoth = require("mammoth");
        const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
        text = result.value;
      } catch (err) {
        return NextResponse.json(
          { error: "DOCX parsing library not installed. Run: npm install mammoth" },
          { status: 500 }
        );
      }
    }

    if (!text || text.trim().length === 0) {
      console.log("❌ No text extracted from document");
      return NextResponse.json(
        { error: "Could not extract text from document" },
        { status: 400 }
      );
    }

    console.log(`📝 Extracted ${text.length} characters of text`);

    // Parse with AI
    console.log("🤖 Parsing with AI...");
    const extractedData = await parseWithAI(text);

    console.log("✅ Successfully extracted team data:", extractedData);
    return NextResponse.json(extractedData);
  } catch (error) {
    console.error("Document parsing error:", error);
    return NextResponse.json(
      { error: "Failed to process document" },
      { status: 500 }
    );
  }
}

async function parseWithAI(text: string) {
  // Check if OpenAI API key is available
  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!openaiKey && !anthropicKey) {
    console.log("⚠️  No API keys found, using fallback parser");
    // Fallback: Use basic pattern matching
    return fallbackParse(text);
  }

  try {
    if (openaiKey) {
      return await parseWithOpenAI(text, openaiKey);
    } else if (anthropicKey) {
      return await parseWithAnthropic(text, anthropicKey);
    }
  } catch (error) {
    console.error("AI parsing error:", error);
    // Fallback to pattern matching if AI fails
    return fallbackParse(text);
  }
}

async function parseWithOpenAI(text: string, apiKey: string) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-5-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that extracts team information from documents.
Extract the following fields and return ONLY a valid JSON object:
{
  "team_name": "string",
  "description": "string",
  "products": ["array", "of", "strings"],
  "issues_handled": ["array", "of", "strings"],
  "contact": "email@example.com"
}

If any field cannot be found, make a reasonable inference based on the context. If you absolutely cannot determine a field, use an empty string or empty array.`,
        },
        {
          role: "user",
          content: `Extract team information from this document:\n\n${text.slice(0, 6000)}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("OpenAI API error:", errorData);
    throw new Error(`OpenAI API request failed: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No content in OpenAI response");
  }

  // Parse the JSON from the response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  throw new Error("Could not parse JSON from OpenAI response");
}

async function parseWithAnthropic(text: string, apiKey: string) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Extract team information from this document and return ONLY a valid JSON object with these fields:
{
  "team_name": "string",
  "description": "string",
  "products": ["array", "of", "strings"],
  "issues_handled": ["array", "of", "strings"],
  "contact": "email@example.com"
}

Document:
${text.slice(0, 6000)}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("Anthropic API request failed");
  }

  const data = await response.json();
  const content = data.content[0]?.text;

  if (!content) {
    throw new Error("No content in Anthropic response");
  }

  // Parse the JSON from the response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  throw new Error("Could not parse JSON from Anthropic response");
}

function fallbackParse(text: string) {
  // Basic pattern matching fallback
  const lines = text.split("\n").map((line) => line.trim());

  // Try to find team name
  let team_name = "";
  const teamNamePatterns = [
    /team\s*name[:\s]+(.+)/i,
    /team[:\s]+(.+)/i,
    /department[:\s]+(.+)/i,
  ];

  for (const pattern of teamNamePatterns) {
    for (const line of lines) {
      const match = line.match(pattern);
      if (match && match[1]) {
        team_name = match[1].trim();
        break;
      }
    }
    if (team_name) break;
  }

  // Try to find email
  let contact = "";
  const emailPattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
  for (const line of lines) {
    const match = line.match(emailPattern);
    if (match && match[1]) {
      contact = match[1];
      break;
    }
  }

  // Use first few non-empty lines as description
  const description = lines
    .filter((line) => line.length > 20)
    .slice(0, 3)
    .join(" ")
    .slice(0, 200);

  return {
    team_name: team_name || "Team Name (Please Edit)",
    description: description || "Please provide a team description",
    products: [],
    issues_handled: [],
    contact: contact || "team@example.com",
  };
}
