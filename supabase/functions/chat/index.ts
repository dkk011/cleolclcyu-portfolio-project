import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    });
  }

  // POST만 허용
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({
        error: 'POST 요청만 허용됩니다.',
      }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }

  try {
    const { question, keyword } = await req.json();

    // 질문 확인
    if (
      typeof question !== 'string' ||
      question.trim().length === 0
    ) {
      return new Response(
        JSON.stringify({
          error: '질문을 입력해주세요.',
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      );
    }

    // 키워드 확인
    if (
      typeof keyword !== 'string' ||
      keyword.trim().length === 0
    ) {
      return new Response(
        JSON.stringify({
          error: '키워드를 선택해주세요.',
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      );
    }

    // Supabase 연결
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const publishableKeys = Deno.env.get(
      'SUPABASE_PUBLISHABLE_KEYS',
    );

    if (!supabaseUrl || !publishableKeys) {
      throw new Error(
        'Supabase 환경변수가 설정되지 않았습니다.',
      );
    }

    const supabase = createClient(
      supabaseUrl,
      JSON.parse(publishableKeys)['default'],
    );

    // 키워드 데이터 조회
    const {
      data: keywordData,
      error: keywordError,
    } = await supabase
      .from('keywords')
      .select('keyword, question, answer')
      .eq('keyword', keyword.trim())
      .single();

    if (keywordError || !keywordData) {
      return new Response(
        JSON.stringify({
          error: '선택한 키워드를 찾을 수 없습니다.',
        }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      );
    }

    // Groq API Key 확인
    const groqApiKey = Deno.env.get('GROQ_API_KEY');

    if (!groqApiKey) {
      return new Response(
        JSON.stringify({
          error: 'Groq API Key가 설정되지 않았습니다.',
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      );
    }

    // Prompt 생성
    const prompt = `
당신은 포트폴리오의 AI 인터뷰 도우미입니다.

아래에 제공된 포트폴리오 데이터만을 근거로 사용자의 질문에 답변하세요.

[키워드]
${keywordData.keyword}

[대표 질문]
${keywordData.question}

[작성자의 답변]
${keywordData.answer}

[사용자 질문]
${question.trim()}

답변 규칙:
1. 제공된 포트폴리오 데이터를 가장 우선적으로 참고하세요.
2. 제공된 내용에 없는 경험이나 사실을 만들어내지 마세요.
3. 자연스럽고 이해하기 쉬운 한국어로 답변하세요.
4. 질문과 관련된 내용만 간결하게 답변하세요.
5. 포트폴리오에 답변할 근거가 없는 경우에는
"포트폴리오에 해당 내용이 없습니다."라고 답변하세요.
6. 답변에 강조 표시 하지 마세요.
`;

    // Groq API 호출
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
        }),
      },
    );

    // Groq API 에러 처리
    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        'Groq API Error:',
        errorText,
      );

      let errorMessage =
        'AI 답변을 생성하지 못했습니다.';
      let statusCode = 502;

      try {
        const groqError = JSON.parse(errorText);

        const groqErrorMessage =
          groqError?.error?.message;

        if (
          typeof groqErrorMessage === 'string' &&
          groqErrorMessage.length > 0
        ) {
          errorMessage = groqErrorMessage;
        }

        if (response.status === 429) {
          errorMessage =
            '현재 AI 사용량이 많습니다. 잠시 후 다시 시도해주세요.';
          statusCode = 429;
        }
      } catch {
        // JSON 파싱 실패 시 기본 오류 메시지 사용
      }

      return new Response(
        JSON.stringify({
          error: errorMessage,
        }),
        {
          status: statusCode,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      );
    }

    // Groq 응답 처리
    const result = await response.json();

    const answer =
      result?.choices?.[0]?.message?.content
        ?.trim();

    if (!answer) {
      console.error(
        'Unexpected Groq response:',
        result,
      );

      return new Response(
        JSON.stringify({
          error: 'AI가 답변을 생성하지 못했습니다.',
        }),
        {
          status: 502,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      );
    }

    // 성공 응답
    return new Response(
      JSON.stringify({
        answer,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error(
      'Function Error:',
      error,
    );

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다.',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});