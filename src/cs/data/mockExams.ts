import type { CsQuestion } from './curriculum'

export interface CsMockExam {
  id: string
  title: string
  subtitle: string
  targetExam: 'MIDTERM' | 'FINAL'
  durationMinutes: number
  totalPoints: number
  questions: CsQuestion[]
}

export const CS_MOCK_EXAMS: Record<'midterm' | 'final', CsMockExam> = {
  midterm: {
    id: 'cs-midterm',
    title: '計算機概論 期中標準模擬評量',
    subtitle: '檢測軟硬體本質、馮紐曼五大單元、AMAT 快取、二補數與作業系統排程',
    targetExam: 'MIDTERM',
    durationMinutes: 30,
    totalPoints: 100,
    questions: [
      {
        id: 'cs-mock-m1',
        title: '馮紐曼儲存程式概念',
        question: '馮紐曼型電腦架構 (Von Neumann Architecture) 最核心革命性概念為何？',
        options: [
          '程式指令與資料皆以二進位形式儲存於同一個記憶體中，由 CPU 循序讀取執行',
          '每個指令必須由專門的物理硬體連線即時重組電路才能執行',
          '中央處理器內部不需要任何暫存器與時脈訊號',
          '電腦只能處理類比訊號，不能進行二進位邏輯運算',
        ],
        answer: 0,
        solution: [
          '馮紐曼架構最核心的突破即為「儲存程式概念 (Stored-Program Concept)」，使電腦無需重新接線即可透過修改記憶體中的程式碼改變功能。',
        ],
        explanation: '程式指令與運算資料共享記憶體編址與儲存。',
        difficulty: 2,
        tags: ['馮紐曼架構', '儲存程式'],
        type: 'single-choice',
      },
      {
        id: 'cs-mock-m2',
        title: 'CPU 機器週期順序',
        question: '一個典型的 CPU 指令執行週期 (Instruction Cycle) 之基本運作順序為何？',
        options: [
          '解碼 (Decode) ➜ 取指 (Fetch) ➜ 寫回 (Writeback) ➜ 執行 (Execute)',
          '取指 (Fetch) ➜ 解碼 (Decode) ➜ 執行 (Execute) ➜ 寫回 (Writeback)',
          '執行 (Execute) ➜ 解碼 (Decode) ➜ 取指 (Fetch) ➜ 寫回 (Writeback)',
          '寫回 (Writeback) ➜ 執行 (Execute) ➜ 解碼 (Decode) ➜ 取指 (Fetch)',
        ],
        answer: 1,
        solution: [
          'CPU 首先依據 PC 取出指令 (Fetch)，再由控制單元解碼指令 (Decode)，ALU 執行運算 (Execute)，最後將結果寫回暫存器或記憶體 (Writeback)。',
        ],
        explanation: '標準指令週期順序為取指 ➜ 解碼 ➜ 執行 ➜ 寫回。',
        difficulty: 2,
        tags: ['機器週期', '控制單元'],
        type: 'single-choice',
      },
      {
        id: 'cs-mock-m3',
        title: '二補數溢位檢測',
        question: '在 8 位元有號整數二補數運算中，若將兩個正數相加，何種情況代表發生了算術溢位 (Arithmetic Overflow)？',
        options: [
          '最高符號位元 (MSB) 變成 1 (結果變成負數)',
          '最高符號位元維持 0 (結果維持正數)',
          '所有位元全部變為 0',
          '結果絕對值小於任一運算元',
        ],
        answer: 0,
        solution: [
          '兩正數相加，若結果超出最大容許範圍 (+127)，進位會侵入符號位元使其變成 1，代表運算結果由正變負，即為溢位。',
        ],
        explanation: '兩正數相加符號位元變 1 代表溢位。',
        difficulty: 2,
        tags: ['二補數', '溢位'],
        type: 'single-choice',
      },
      {
        id: 'cs-mock-m4',
        title: '作業系統分頁與快表 (TLB)',
        question: '在作業系統虛擬記憶體管理中，轉譯後備緩衝區 (TLB) 的最主要功用為何？',
        options: [
          '永久備份使用者所有硬碟檔案',
          '作為硬體高速快取，加速虛擬頁號 (VPN) 轉譯為實體頁框號 (PFN) 的過程',
          '專門防止電腦病毒侵入作業系統核心',
          '自動壓縮網頁瀏覽器下載的影片',
        ],
        answer: 1,
        solution: [
          'TLB 是位於 CPU MMU 內的專用硬體快取，用以記錄最近頻繁使用的虛擬位址到實體位址的映射，避免每次訪存都要多次讀取主記憶體中的分頁表。',
        ],
        explanation: 'TLB 加速虛擬記憶體位址至實體位址之轉換。',
        difficulty: 3,
        tags: ['作業系統', '虛擬記憶體', 'TLB'],
        type: 'single-choice',
      },
    ],
  },
  final: {
    id: 'cs-final',
    title: '計算機概論 期末前沿 AI 綜合大考',
    subtitle: '涵蓋電腦網路、GPU 平行架構、TPU 脈動陣列、Transformer 與大語言模型',
    targetExam: 'FINAL',
    durationMinutes: 40,
    totalPoints: 100,
    questions: [
      {
        id: 'cs-mock-f1',
        title: 'TCP vs UDP 傳輸協定特性',
        question: '線上多人射擊遊戲與即時語音通話，通常優先選用 UDP 而非 TCP 的最核心原因為何？',
        options: [
          'UDP 無需三向交握連線開銷且不強制遺失重傳，具有極低傳輸延遲特性',
          'UDP 具備世界上最高強度的金融級 AES 加密演算法',
          'UDP 能保證 100% 封包零遺失且完全按序到達',
          'TCP 無法在網際網路 IPv4 網路上傳輸任何封包',
        ],
        answer: 0,
        solution: [
          '即時遊戲與語音串流追求極致低延遲，偶爾掉包可直接捨棄，若使用 TCP 重傳會造成畫面嚴重視訊卡頓。',
        ],
        explanation: 'UDP 無握手與重傳開銷，提供極佳即時性。',
        difficulty: 2,
        tags: ['電腦網路', 'TCP/UDP', '通訊協定'],
        type: 'single-choice',
      },
      {
        id: 'cs-mock-f2',
        title: 'GPU 與 Tensor Core 矩陣平行加速',
        question: '現代 GPU 中的 Tensor Core 相較於傳統 CPU 核心，在執行深度學習矩陣相乘 ($D = A \\times B + C$) 時效能大幅領先的主因為何？',
        options: [
          '能在單個硬體時脈週期內，高度平行執行小型密集矩陣乘加運算 (Fused Multiply-Add)',
          '完全不需要任何外部電力供應即可自動運作',
          '單核心時脈頻率高達 100 GHz',
          '內部配備了數百 TB 的超大容量機械硬碟',
        ],
        answer: 0,
        solution: [
          'Tensor Core 在硬體電路層面專門為 GEMM 乘加融合運算設計，以矩陣而非純量為基本處理單位，帶來數十倍的張量運算吞吐量。',
        ],
        explanation: 'Tensor Core 在單週期內硬體完成矩陣乘加運算。',
        difficulty: 3,
        tags: ['GPU', 'Tensor Core', '矩陣相乘'],
        type: 'single-choice',
      },
      {
        id: 'cs-mock-f3',
        title: 'Transformer 自注意力機制計算複雜度',
        question: '標準 Transformer 架構中，自注意力機制 (Self-Attention) 對輸入序列長度 $N$ 的計算時間複雜度為何？',
        options: [
          '$O(N)$',
          '$O(N^2)$',
          '$O(\\log N)$',
          '$O(1)$',
        ],
        answer: 1,
        solution: [
          '計算 $Q \\times K^T$ 需讓序列中每個 token 與所有其他 token 兩兩計算內積，產生 $N \\times N$ 的注意力矩陣，其時間與空間複雜度皆為 $O(N^2)$。',
        ],
        explanation: '標準 Self-Attention 複雜度為 O(N^2)。',
        difficulty: 3,
        tags: ['Transformer', 'Self-Attention', '複雜度'],
        type: 'single-choice',
      },
      {
        id: 'cs-mock-f4',
        title: '大模型 KV Cache 空間換時間機制',
        question: '大語言模型 (LLM) 推論時採用 KV Cache 技術，其最主要的工程回報為何？',
        options: [
          '大幅降低模型自回歸生成每一步新詞的時間開銷，避免重複計算歷史上下文',
          '能自動將大模型權重直接上傳至雲端共享',
          '能徹底消除所有 Python 程式碼語法錯誤',
          '能讓電腦螢幕解析度提升 4 倍',
        ],
        answer: 0,
        solution: [
          '自回歸生成時歷史 Token 的 Key 與 Value 保持不變，快取在顯存中可讓每步生成的計算量從 $O(N)$ 降至 $O(1)$。',
        ],
        explanation: 'KV Cache 消除歷史上下文重複運算，大幅加速推論。',
        difficulty: 3,
        tags: ['LLM推論', 'KV Cache', '效能最佳化'],
        type: 'single-choice',
      },
    ],
  },
}
