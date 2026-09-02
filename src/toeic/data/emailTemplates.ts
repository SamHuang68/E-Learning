/**
 * TOEIC 多益英語：商務電子郵件經典結構與句型轉換資料庫 (Business Email Templates & Transformations)
 * 涵蓋多益 Part 7 最高頻商務電郵四大類型：詢價 (Inquiry)、道歉補償 (Apology)、會議邀請 (Invitation)、投訴處理 (Complaint Resolution)。
 */

export interface EmailTemplateItem {
  id: string
  category: 'Inquiry' | 'Apology' | 'Invitation' | 'Resolution'
  title: string
  titleJa: string
  subjectLine: string
  subjectLineJa: string
  formalBody: string
  semiFormalBody: string
  keyPhrases: Array<{
    phraseEn: string
    phraseJa: string
    phraseZh: string
    purposeJa: string
  }>
  quiz: {
    questionZh: string
    questionJa: string
    options: string[]
    correctIndex: number
    clueExplanationJa: string
  }
}

export const EMAIL_TEMPLATES: EmailTemplateItem[] = [
  {
    id: 'email-inquiry',
    category: 'Inquiry',
    title: '產品報價與交貨時程詢問信',
    titleJa: '製品見積もりおよび納期照会メール（Inquiry Email）',
    subjectLine: 'Inquiry Regarding Bulk Pricing and Delivery Lead Time for Model AX-400',
    subjectLineJa: '件名：モデルAX-400の大口価格および納期に関するお問い合わせ',
    formalBody: `Dear Mr. Henderson,\n\nI am writing to inquire about the bulk pricing structure and estimated delivery lead time for your Model AX-400 office printers. Our company is considering purchasing approximately 60 units for our regional branches.\n\nCould you please provide a formal quotation including volume discount tiers and freight charges? We would appreciate receiving this information by Friday, October 10.\n\nThank you for your time and assistance.\n\nSincerely,\nMarcus Vance\nOperations Director, Horizon Media`,
    semiFormalBody: `Hi Henderson,\n\nHope this email finds you well. We are looking to buy around 60 units of the Model AX-400 printers. Could you send over a quote with bulk discounts and shipping estimates by this Friday?\n\nThanks a lot,\nMarcus Vance`,
    keyPhrases: [
      {
        phraseEn: 'I am writing to inquire about...',
        phraseJa: '〜についてお問い合わせしたく、ご連絡いたしました。',
        phraseZh: '我寫此信是為了詢問...',
        purposeJa: 'メール冒頭で用件を端的に切り出す最も標準的なフォーマル表現。',
      },
      {
        phraseEn: 'Could you please provide a formal quotation...',
        phraseJa: '正式なお見積書をご提示いただけますでしょうか。',
        phraseZh: '能否請您提供正式報價單...',
        purposeJa: '相手に丁寧に見積もりや資料の提出を要請する定番フレーズ。',
      },
      {
        phraseEn: 'We would appreciate receiving this information by...',
        phraseJa: '〜までに本情報をご教示いただけますと幸甚に存じます。',
        phraseZh: '若能在...之前收到此資訊，我們將不勝感激。',
        purposeJa: '回答期日を失礼のないように指定する必須テクニック。',
      },
    ],
    quiz: {
      questionZh: '若要在商務電郵開頭正式宣告「我寫信是為了詢問...」，最佳句型為？',
      questionJa: 'ビジネスメール冒頭で「〜について問い合わせるため連絡しました」と伝える最もフォーマルな表現は？',
      options: [
        'I am writing to inquire about...',
        'I want to ask something about...',
        'Tell me the details about...',
        'Do you know about...',
      ],
      correctIndex: 0,
      clueExplanationJa: 'TOEIC Part 7で最も頻出するフォーマルな書き出しは「I am writing to inquire about...」です。',
    },
  },
  {
    id: 'email-apology',
    category: 'Apology',
    title: '伺服器維護延遲與補償道歉信',
    titleJa: 'システム障害・メンテナンス遅延のお詫びと補償メール（Apology Email）',
    subjectLine: 'Apology for Service Interruption and Account Credit Notification',
    subjectLineJa: '件名：サービス停止のお詫びおよびアカウントクレジット付与のお知らせ',
    formalBody: `Dear Valued Customer,\n\nPlease accept our sincere apologies for the unexpected outage experienced on our cloud analytics platform earlier today. The downtime was caused by an unforeseen network routing glitch during our scheduled maintenance window.\n\nOur engineering team has fully resolved the issue and implemented redundant safeguards. To compensate for any inconvenience caused, we have credited your account with one month of complimentary premium service.\n\nWe deeply value your trust and partnership.\n\nSincerely,\nCustomer Success Team, CloudSphere`,
    semiFormalBody: `Dear Customer,\n\nSorry about the system glitch earlier today. Everything is fixed now! To make it up to you, we have added one free month of premium access to your account.\n\nBest,\nCloudSphere Team`,
    keyPhrases: [
      {
        phraseEn: 'Please accept our sincere apologies for...',
        phraseJa: '〜につきまして、心より深くお詫び申し上げます。',
        phraseZh: '對於...，請接受我們誠摯的歉意。',
        purposeJa: '企業の公式謝罪文で使われる最高峰の丁寧な謝罪表現。',
      },
      {
        phraseEn: 'To compensate for any inconvenience caused...',
        phraseJa: 'ご不便をおかけしたことへの補償といたしまして...',
        phraseZh: '為了補償所造成的不便...',
        purposeJa: '顧客へ割引やクレジット付与などの解決策を提案する際の定番。',
      },
    ],
    quiz: {
      questionZh: '在向企業客戶表達最高誠意道歉時，最合適的正式開頭句是？',
      questionJa: '企業顧客に対して最も誠実かつ公式に謝罪する際の標準フレーズは？',
      options: [
        'Please accept our sincere apologies for...',
        'I am sorry about...',
        'Excuse me for...',
        'My fault about...',
      ],
      correctIndex: 0,
      clueExplanationJa: 'ビジネス公式文書では「Please accept our sincere apologies for...」が正解です。',
    },
  },
]
