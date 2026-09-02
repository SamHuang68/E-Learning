/**
 * 計算機概論 · 3 秒破題訊號卡庫 (Computer Science Solving Signals)
 * 涵蓋大考、高考、資工研究所與業界工程師面試核心考點：
 * 題目特徵 ➜ 3 秒直覺決策 ➜ 第一步關鍵判斷與秒殺技巧。
 */

export interface CsSolvingSignal {
  id: string
  strand: '軟硬體本質' | '五大單元架構' | '數位邏輯' | '作業系統' | '網路與通訊' | '現代AI硬體' | '前沿AI演算法'
  topic: string
  problemSignal: string
  threeSecondRule: string
  firstStepFormula: string
  exampleProblem: {
    question: string
    quickSolve: string
  }
}

export const CS_SOLVING_SIGNALS: CsSolvingSignal[] = [
  {
    id: 'sig-cs-two-complement',
    strand: '數位邏輯',
    topic: '二補數負數表示法',
    problemSignal: '題目給定十進位負數 $-N$，要求以 $k$ 位元二補數表示，或由二補數求十進位真值',
    threeSecondRule: '【正數求出、取反加一；最高位是1必為負】正數二進位全部反轉後加 1，若最高位為 1，權重為 $-2^{k-1}$！',
    firstStepFormula: 'N_{\\text{2\'s comp}} = \\text{NOT}(N_{\\text{positive}}) + 1',
    exampleProblem: {
      question: '求十進位整數 -19 的 8 位元二補數表示法？',
      quickSolve: '+19 = 00010011 ➜ 取反得 11101100 ➜ 加 1 得 11101101。',
    },
  },
  {
    id: 'sig-cs-amat-cache',
    strand: '五大單元架構',
    topic: '記憶體階層與 AMAT 存取時間',
    problemSignal: '題目給定快取命中率 (Hit Rate)、快取存取時間與記憶體未命中懲罰 (Miss Penalty) 求平均存取時間',
    threeSecondRule: '【命中時間 + 未命中率乘懲罰】AMAT = Hit Time + (1 - Hit Rate) × Miss Penalty！',
    firstStepFormula: '\\text{AMAT} = T_{\\text{hit}} + (1 - H) \\times T_{\\text{penalty}}',
    exampleProblem: {
      question: 'L1 快取 1.2 ns，未命中率 5%，主記憶體懲罰 40 ns，求 AMAT？',
      quickSolve: 'AMAT = 1.2 + 0.05 × 40 = 1.2 + 2.0 = 3.2 ns。',
    },
  },
  {
    id: 'sig-cs-bus-address-space',
    strand: '五大單元架構',
    topic: '位址匯流排與最大可定址空間',
    problemSignal: '題目給定 CPU 位址匯流排有 $k$ 條線，每個位址為位元組編址 (Byte-addressable)，求最大定址記憶體容量',
    threeSecondRule: '【2 的 k 次方直接轉為單位】k 位址線直接代表 $2^k$ Bytes，30 條是 1GB，32 條是 4GB，36 條是 64GB！',
    firstStepFormula: '\\text{Addressable Space} = 2^k \\text{ Bytes}',
    exampleProblem: {
      question: '某 32 位元處理器具備 34 條位址線，最大可支援實體記憶體為何？',
      quickSolve: '2^34 Bytes = 2^4 × 2^30 Bytes = 16 GB。',
    },
  },
  {
    id: 'sig-cs-deadlock-conditions',
    strand: '作業系統',
    topic: '死結 (Deadlock) 四大必要條件',
    problemSignal: '題目詢問系統產生死結的充要條件或如何打破死結避免連鎖停擺',
    threeSecondRule: '【互持不循缺一不可】互斥、持有並等待、不可搶奪、循環等待！打破任一條件死結即解除！',
    firstStepFormula: '\\text{Deadlock} \\iff \\text{Mutual Exclusion} \\land \\text{Hold \\& Wait} \\land \\text{No Preemption} \\land \\text{Circular Wait}',
    exampleProblem: {
      question: '如何保證系統永遠不會發生循環等待條件？',
      quickSolve: '為所有資源全域編號，強制所有行程只能依照遞增編號順序請求資源。',
    },
  },
  {
    id: 'sig-cs-tcp-handshake',
    strand: '網路與通訊',
    topic: 'TCP 連線建立三向交握',
    problemSignal: '題目出現 SYN、ACK 旗標與序號 (Sequence Number / Acknowledgment Number) 配對',
    threeSecondRule: '【SYN ➜ SYN-ACK ➜ ACK，確認號是對方序號加 1】第一次發 SYN=x，第二次回 SYN=y/ACK=x+1，第三次回 ACK=y+1！',
    firstStepFormula: '\\text{Client: } \\text{SYN}(x) \\to \\text{Server: } \\text{SYN}(y), \\text{ACK}(x+1) \\to \\text{Client: } \\text{ACK}(y+1)',
    exampleProblem: {
      question: '客戶端發送 SYN (seq=500)，伺服器同意連線時回傳的 ACK 號是多少？',
      quickSolve: 'ack = seq + 1 = 500 + 1 = 501。',
    },
  },
  {
    id: 'sig-cs-gpu-matrix-gemm',
    strand: '現代AI硬體',
    topic: 'CPU vs GPU 矩陣乘法加速本質',
    problemSignal: '題目比較深度學習為何使用 GPU 而非傳統多核心 CPU 進行模型訓練',
    threeSecondRule: '【高頻寬 + 數千平行 SIMT 核心專攻 GEMM】CPU 針對單執行緒複雜邏輯，GPU 針對巨量無分支矩陣乘加 (GEMM)！',
    firstStepFormula: '\\text{GEMM: } D = \\alpha (A \\times B) + \\beta C \\quad [\\text{SIMT Parallel Throughput}]',
    exampleProblem: {
      question: 'Transformer 每一層的投影矩陣計算主要由何種硬體單元以最高硬體效率執行？',
      quickSolve: 'GPU 內建的專用 Tensor Core 或 TPU 的脈動陣列 (Systolic Array)。',
    },
  },
  {
    id: 'sig-cs-self-attention',
    strand: '前沿AI演算法',
    topic: 'Transformer 自注意力機制計算',
    problemSignal: '題目出現 Query, Key, Value 矩陣與 $\\text{Softmax}$ 縮放點積注意力',
    threeSecondRule: '【QK 轉置除以根號 d，Softmax 後乘上 V】注意力矩陣大小為 $N \\times N$，計算複雜度為 $O(N^2)$！',
    firstStepFormula: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V',
    exampleProblem: {
      question: '當輸入序列長度 $N$ 增長為原來的 2 倍時，標準 Self-Attention 的運算量變為原來的幾倍？',
      quickSolve: '因複雜度為 $O(N^2)$，長度翻倍則運算量擴增為 $2^2 = 4$ 倍。',
    },
  },
  {
    id: 'sig-cs-kv-cache',
    strand: '前沿AI演算法',
    topic: '大模型推論 KV Cache 空間換時間',
    problemSignal: '題目提及自回歸 (Autoregressive) 逐字生成推論延遲與顯存佔用',
    threeSecondRule: '【快取歷史 Key/Value，避免重算，時間降至 O(1)】每生成 1 個新詞，僅需計算新詞的 Q 與已暫存的 K/V 點積！',
    firstStepFormula: '\\text{Inference Step } t: Q_t \\times [K_{1:t-1}, K_t]^T \\to \\text{Reuse Cached } K, V',
    exampleProblem: {
      question: '為什麼長文本對話在大模型推論時顯存會逐漸上升？',
      quickSolve: '因為對話長度增加導致保存在顯存中的 KV Cache 尺寸線性增長。',
    },
  },
]
