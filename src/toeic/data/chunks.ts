/**
 * TOEIC 商務英語高頻語塊庫 (Business Chunks)
 * 借鏡 English Chunker 語塊教學法：
 * 包含：核心語塊、語調重音標註 (Rhythm Hint)、3 個情境例句、常見時態變形、避坑指南 (Pitfall)、Mini-dialog、週末微故事與 3 秒判斷對照表。
 */

export type BusinessChunk = {
  id: string
  chunk: string
  meaningZh: string
  actionSignal: string // 動作訊號：看到什麼情境選這個
  rhythmHint: {
    stress: string // e.g. "get BACK to you"
    note: string // e.g. "重音在 BACK，to 弱讀為 /tə/"
  }
  usage: {
    pattern: string
    explanation: string
  }
  examples: Array<{
    en: string
    zh: string
    note?: string
  }>
  variations: Array<{
    en: string
    zh: string
  }>
  pitfall: {
    wrong: string
    reason: string
  }
  miniDialog: {
    speakerA: { en: string; zh: string }
    speakerB: { en: string; zh: string }
  }
  production: Array<{
    promptZh: string
    answerEn: string
  }>
}

export type ChunkWeekUnit = {
  weekId: number
  certificateBand: 'orange' | 'green' | 'blue' | 'gold'
  themeTitle: string
  themeSubtitle: string
  chunks: BusinessChunk[]
  microStory: {
    title: string
    scenario: string
    sentences: Array<{
      seq: number
      en: string
      zh: string
      highlightChunkId: string
    }>
    decisionTable: Array<{
      chunk: string
      signal: string
      threeSecondRule: string
    }>
  }
}

export const TOEIC_CHUNK_WEEKS: ChunkWeekUnit[] = [
  {
    weekId: 1,
    certificateBand: 'orange',
    themeTitle: '工作日常聯繫與跟進 (Workplace Follow-ups)',
    themeSubtitle: '先練最核心的 5 個商務反應動作：查原因、追進度、找人確認、承接處理與稍後回覆。',
    chunks: [
      {
        id: 'get-back-to-you',
        chunk: 'get back to you',
        meaningZh: '確認之後再回覆你',
        actionSignal: '現在不能立刻回答，需要查資料或確認後再給答案',
        rhythmHint: {
          stress: 'get BACK to you',
          note: '重音放在 back。自然語速裡的 to 通常會弱讀為輕音 /tə/。',
        },
        usage: {
          pattern: 'get back to + 人 + [by 時間 / with 細節]',
          explanation: '後面接回覆對象；換成自己時用 get back to me。補上明確時間（如 by noon）承諾更專業。',
        },
        examples: [
          {
            en: "I'll check the inventory and get back to you by noon.",
            zh: '我確認一下庫存，中午前回覆你。',
            note: 'by noon 表示最晚中午前，給出明確 Deadline。',
          },
          {
            en: 'Let me look into the issue and get back to you.',
            zh: '讓我調查一下這個問題，再回覆你。',
            note: '會議中遇到突發狀況時的標準專業應對。',
          },
          {
            en: "She promised she'd get back to me before the end of the day.",
            zh: '她承諾今天下班前會回覆我。',
            note: '對象換成自己時用 get back to me。',
          },
        ],
        variations: [
          { en: "I'll get back to you this afternoon.", zh: '我今天下午再回覆你。' },
          { en: 'He got back to me yesterday.', zh: '他昨天回覆我了。' },
          { en: "They haven't gotten back to us yet.", zh: '他們還沒有回覆我們。' },
        ],
        pitfall: {
          wrong: 'I will return you later.',
          reason: 'return 通常指「歸還物品」或「返回原處」。稍後回信或回電給人，請一律使用 get back to someone。',
        },
        miniDialog: {
          speakerA: { en: 'Do we have the revised budget ready?', zh: '修訂後的預算準備好了嗎？' },
          speakerB: { en: "Not yet. I'll review it with Finance and get back to you.", zh: '還沒。我會跟財務核對，稍後回覆你。' },
        },
        production: [
          { promptZh: '我核對完數據後，會在下班前回覆你。', answerEn: "I'll check the data and get back to you before the end of the day." },
          { promptZh: '他承諾明天早上會回覆我們。', answerEn: "He promised he'd get back to us tomorrow morning." },
        ],
      },
      {
        id: 'follow-up-on',
        chunk: 'follow up on',
        meaningZh: '跟進某件事／追蹤後續進度',
        actionSignal: '事情或信件已經發出，現在要去追查最新狀況',
        rhythmHint: {
          stress: 'FOLLOW UP on',
          note: 'follow 與 up 連音念為 /fɑː.loʊ.wʌp/，重音在前。',
        },
        usage: {
          pattern: 'follow up on + 事情 / 專案 / 郵件',
          explanation: '名詞形式為 a follow-up（後續跟進）。追蹤客戶、報價或合約必備。',
        },
        examples: [
          {
            en: 'I am writing to follow up on our discussion last Tuesday.',
            zh: '我寫這封信是想跟進我們上週二的討論。',
            note: '商業英文 Email 最經典的破題句。',
          },
          {
            en: 'Could you follow up on the quote we sent to the client?',
            zh: '你能追蹤一下我們寄給客戶的報價單嗎？',
            note: '交付同事追蹤進度的標準問法。',
          },
          {
            en: 'We need to follow up on this lead as soon as possible.',
            zh: '我們需要儘快跟進這個潛在客戶。',
            note: 'lead 在商務指潛在商機或潛在客戶名單。',
          },
        ],
        variations: [
          { en: 'I followed up with the supplier this morning.', zh: '我今天早上向供應商追蹤了（追人時可用 with）。' },
          { en: "Let's schedule a quick follow-up meeting.", zh: '我們來安排一次簡短的跟進會議吧。' },
        ],
        pitfall: {
          wrong: 'I want to track this letter.',
          reason: 'track 通常指物流包裹「物理追蹤號碼」，商務業務進度跟進應使用 follow up on。',
        },
        miniDialog: {
          speakerA: { en: 'Has the client approved the contract yet?', zh: '客戶核准合約了嗎？' },
          speakerB: { en: "Not yet. I'll follow up on it right away.", zh: '還沒。我馬上跟進這件事。' },
        },
        production: [
          { promptZh: '請在週五前跟進這筆訂單的配送進度。', answerEn: 'Please follow up on the delivery status of this order by Friday.' },
        ],
      },
      {
        id: 'look-into',
        chunk: 'look into',
        meaningZh: '查一下／調查了解原因',
        actionSignal: '目前還不知道原因或答案，需要主動去調查',
        rhythmHint: {
          stress: 'LOOK INto',
          note: '重音在 look，into 輕讀。',
        },
        usage: {
          pattern: 'look into + 問題 / 情況 / 投訴',
          explanation: '比 investigate 更口語、自然且不失專業度。',
        },
        examples: [
          {
            en: "We're looking into the server downtime right now.",
            zh: '我們目前正在調查伺服器斷線的原因。',
          },
          {
            en: "I'll look into the error and let you know what happened.",
            zh: '我會調查這個錯誤，並讓你知道發生了什麼事。',
          },
          {
            en: 'The manager promised to look into our concerns.',
            zh: '經理承諾會了解並調查我們反映的顧慮。',
          },
        ],
        variations: [
          { en: 'We have looked into several alternatives.', zh: '我們已經研究評估了幾個替代方案。' },
        ],
        pitfall: {
          wrong: 'I will see this problem.',
          reason: 'see 只是「看見」，深入調查探究原因要用 look into。',
        },
        miniDialog: {
          speakerA: { en: 'Why did the payment fail twice?', zh: '為什麼款項失敗了兩次？' },
          speakerB: { en: "I'm not sure. Let me look into it immediately.", zh: '我不確定，讓我立刻調查一下。' },
        },
        production: [
          { promptZh: '工程團隊正在調查這個系統漏洞。', answerEn: 'The engineering team is looking into this system bug.' },
        ],
      },
      {
        id: 'check-in-with',
        chunk: 'check in with',
        meaningZh: '找某人確認一下／關心進度',
        actionSignal: '對象是具體的人，輕量且友善地確認最新狀況',
        rhythmHint: {
          stress: 'CHECK IN with',
          note: 'check 與 in 連音為 /tʃek.ɪn/。',
        },
        usage: {
          pattern: 'check in with + 人 + [about 事情]',
          explanation: '語氣輕鬆自然，比 formal inquire 更加平易近人。',
        },
        examples: [
          {
            en: "I'll check in with Sarah before finalizing the slides.",
            zh: '在定稿簡報之前，我會先找 Sarah 確認一下。',
          },
          {
            en: 'Just checking in to see how the project is going.',
            zh: '只是來關心一下專案進行得如何。',
            note: '極為實用的問候開場白。',
          },
          {
            en: 'Let me check in with the logistics team first.',
            zh: '讓我先跟物流團隊確認一下。',
          },
        ],
        variations: [
          { en: 'Did you check in with the client today?', zh: '你今天有跟客戶確認聯繫過了嗎？' },
        ],
        pitfall: {
          wrong: 'I will ask with Sarah.',
          reason: 'ask 不與 with 連用，輕量關心確認進度請用 check in with someone。',
        },
        miniDialog: {
          speakerA: { en: 'Are we ready for tomorrow’s demo?', zh: '我們明天的產品展示準備好了嗎？' },
          speakerB: { en: "Almost. I just need to check in with the designer.", zh: '差不多了。我只需要再跟設計師確認一下。' },
        },
        production: [
          { promptZh: '我等等會跟專案經理確認預算。', answerEn: "I'll check in with the project manager about the budget later." },
        ],
      },
      {
        id: 'take-care-of',
        chunk: 'take care of',
        meaningZh: '處理好／承擔責任完成',
        actionSignal: '把任務責任承接下來，讓對方放心交給你處理',
        rhythmHint: {
          stress: 'take CARE of',
          note: '重音在 care，of 弱讀為 /əv/。',
        },
        usage: {
          pattern: 'take care of + 任務 / 帳單 / 客戶 / 問題',
          explanation: '表達主動負責與執行力的核心高頻語塊。',
        },
        examples: [
          {
            en: "Don't worry about the booking; I'll take care of it.",
            zh: '別擔心預約的事，我來處理就好。',
          },
          {
            en: 'Everything has already been taken care of.',
            zh: '所有事情都已經妥善處理好了。',
            note: '被動完成時態非常高頻。',
          },
          {
            en: 'Who is going to take care of the keynote speaker?',
            zh: '誰要負責接待主講嘉賓？',
          },
        ],
        variations: [
          { en: 'It was taken care of yesterday.', zh: '這件事昨天就處理完畢了。' },
        ],
        pitfall: {
          wrong: 'I will handle to this matter.',
          reason: 'handle 直接接受詞不加 to；或者直接用 take care of。',
        },
        miniDialog: {
          speakerA: { en: 'We have an urgent ticket from VIP customer.', zh: '我們收到一筆 VIP 客戶的緊急工單。' },
          speakerB: { en: 'Leave it to me. I will take care of it right now.', zh: '交給我吧。我現在馬上處理。' },
        },
        production: [
          { promptZh: '發票的事情已經全部處理好了。', answerEn: 'The invoices have all been taken care of.' },
        ],
      },
    ],
    microStory: {
      title: 'A Busy Monday Morning (忙碌的週一早晨)',
      scenario: '將本週 5 個核心語塊串入同一個真實辦公室場景，練習情境判斷與連貫切換。',
      sentences: [
        {
          seq: 1,
          en: 'On Monday morning, a key client emailed about an urgent shipment delay.',
          zh: '週一早上，一位重要客戶來信詢問緊急貨運延誤的問題。',
          highlightChunkId: '',
        },
        {
          seq: 2,
          en: "I told her I would look into the root cause and get back to her by noon.",
          zh: '我告訴她我會先【調查原因 (look into)】，並在中午前【確認後回覆她 (get back to her)】。',
          highlightChunkId: 'look-into',
        },
        {
          seq: 3,
          en: 'Then I immediately checked in with Leo, who was managing that warehouse account.',
          zh: '接著我立刻【找負責該帳戶的 Leo 確認狀況 (checked in with)】。',
          highlightChunkId: 'check-in-with',
        },
        {
          seq: 4,
          en: 'He had already followed up on the courier and asked Operations to take care of the express replacement.',
          zh: '他已經向貨運公司【追蹤進度 (followed up on)】，並請營運部【處理好補寄事宜 (take care of)】。',
          highlightChunkId: 'follow-up-on',
        },
        {
          seq: 5,
          en: 'By 11:30, the whole issue had been taken care of, and I sent the new tracking number back to the client.',
          zh: '十一點半前，整起事件都已經【圓滿處理完畢 (taken care of)】，我也將新單號回傳給客戶。',
          highlightChunkId: 'take-care-of',
        },
      ],
      decisionTable: [
        {
          chunk: 'look into',
          signal: '答案還不知道，需要去查原因',
          threeSecondRule: '我還不知道為什麼出事，我要去調查。',
        },
        {
          chunk: 'follow up on',
          signal: '信件/專案已經發出，現在要去追進度',
          threeSecondRule: '事情已經在進行中，我去盯緊後續。',
        },
        {
          chunk: 'check in with',
          signal: '對象是某個人，輕量友善確認',
          threeSecondRule: '我要找具體的某同事/客戶問一下進展。',
        },
        {
          chunk: 'take care of',
          signal: '承擔任務並把事情徹底辦好',
          threeSecondRule: '這件事交給我負責處理，請放心。',
        },
        {
          chunk: 'get back to you',
          signal: '當下無法立刻回答，確認後回覆',
          threeSecondRule: '等我查明/確認好，再回來答覆你。',
        },
      ],
    },
  },
]
