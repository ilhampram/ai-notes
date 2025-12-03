import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, mode } = await req.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Teks tidak boleh kosong." }, { status: 400 });
    }

    // 1. Tentukan instruksi berdasarkan mode
    let instruction = "";
    if (mode === "short") {
      instruction = "Ringkas teks berikut menjadi 3-5 kalimat yang jelas dan padat dalam bahasa Indonesia.";
    } else if (mode === "bullets") {
      instruction = "Ringkas teks berikut menjadi poin-poin bullet yang rapi dalam bahasa Indonesia.";
    } else if (mode === "action_items") {
      instruction = "Dari teks berikut, tuliskan hanya hal-hal yang harus dilakukan (action items) dalam bentuk bullet dalam bahasa Indonesia.";
    } else {
      instruction = "Ringkas teks berikut secara singkat dan jelas.";
    }

    const prompt = `${instruction}\n\nTeks:\n${text}`;

    // 2. Ambil API key Groq dari environment
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY tidak ditemukan di environment server." }, { status: 500 });
    }

    // 3. Panggil Groq Chat Completions (OpenAI-compatible)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // model Groq untuk teks
        messages: [
          {
            role: "system",
            content: "Kamu adalah asisten yang ahli merangkum teks.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: errorData.error?.message || `Gagal memanggil Groq API (status ${response.status}).`,
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content || "Tidak ada hasil ringkasan.";

    return NextResponse.json({ summary });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Terjadi kesalahan di server." }, { status: 500 });
  }
}
