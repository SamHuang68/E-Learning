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
  {
    id: 'sig-cs-pipeline-speedup',
    strand: '五大單元架構',
    topic: 'CPU 管線化極限加速比',
    problemSignal: '題目給定管線級數 $k$ 與指令數 $n$，求管線化相較於單週期的理論加速比 (Speedup)',
    threeSecondRule: '【總單週期時間除以管線總週期】n 趨向無窮大時，加速比極限就是管線級數 k！',
    firstStepFormula: 'S = \\frac{k \\cdot n}{k + n - 1} \\xrightarrow{n \\to \\infty} k',
    exampleProblem: {
      question: '一個 5 級管線處理器執行 1,000,000 條指令，其加速比約為幾倍？',
      quickSolve: '指令數極大，加速比逼近管線級數 5.0 倍。',
    },
  },
  {
    id: 'sig-cs-cache-tag-index',
    strand: '五大單元架構',
    topic: '組相聯快取位址欄位拆分',
    problemSignal: '題目給定快取容量 $C$、區塊大小 $B$ 與路數 $N$，求 Set Index 與 Tag 位元數',
    threeSecondRule: '【算組數取 log2 就是 Index，區塊取 log2 就是 Offset，剩下全給 Tag】！',
    firstStepFormula: '\\text{Offset} = \\log_2(B), \\quad \\text{Index} = \\log_2\\left(\\frac{C}{N \\cdot B}\\right), \\quad \\text{Tag} = 32 - \\text{Index} - \\text{Offset}',
    exampleProblem: {
      question: '32KB 8-Way 64B 快取行，在 32 位元位址下 Tag 佔幾位元？',
      quickSolve: 'Offset=6, Sets=64 (Index=6) ➜ Tag = 32 - 6 - 6 = 20 bits。',
    },
  },
  {
    id: 'sig-cs-tpu-systolic',
    strand: '現代AI硬體',
    topic: 'TPU 脈動陣列矩陣運算延遲',
    problemSignal: '題目詢問 $N \\times N$ 脈動陣列完成矩陣乘法所需的硬體時脈週期數',
    threeSecondRule: '【3N 減 2 週期全部搞定】第一個結果在 2N-1 週期出來，全部乘加在 3N-2 週期收工！',
    firstStepFormula: 'T_{\\text{systolic}} = 3N - 2 \\quad [O(N^3) \\to O(N)]',
    exampleProblem: {
      question: '256 × 256 的 TPU 脈動陣列計算矩陣乘法需要多少時脈週期？',
      quickSolve: 'T = 3 × 256 - 2 = 766 週期。',
    },
  },
  {
    id: 'sig-cs-quantization-int4',
    strand: '前沿AI演算法',
    topic: '大模型權重量化顯存節省精算',
    problemSignal: '題目由參數量與量化位元數 (FP16 vs INT4)，計算模型載入所需的最低顯存',
    threeSecondRule: '【參數量乘位元除以 8 就是 Bytes】FP16 是 2 Bytes，INT4 是 0.5 Bytes，顯存立減 75%！',
    firstStepFormula: '\\text{VRAM (Bytes)} = \\text{Param Count} \\times \\frac{\\text{bits}}{8}',
    exampleProblem: {
      question: '一個 70B 模型採用 INT4 量化載入需要多少顯存？',
      quickSolve: '70B × 0.5 Bytes = 35 GB 顯存。',
    },
  },
  {
    id: 'sig-cs-tlb-emat',
    strand: '作業系統',
    topic: 'TLB 虛擬記憶體有效存取時間 (EMAT)',
    problemSignal: '題目給定 TLB 命中率 $\\alpha$、TLB 延遲與 RAM 訪存時間，求 EMAT',
    threeSecondRule: '【TLB 必查一次，未中罰查兩次主存】公式即為 $T_{\\text{TLB}} + (2 - \\alpha) \\cdot T_{\\text{RAM}}$！',
    firstStepFormula: '\\text{EMAT} = T_{\\text{TLB}} + (2 - \\alpha) \\cdot T_{\\text{RAM}}',
    exampleProblem: {
      question: 'TLB 耗時 10ns，RAM 耗時 100ns，命中率 95% 時之 EMAT？',
      quickSolve: 'EMAT = 10 + (2 - 0.95) × 100 = 115 ns。',
    },
  },
  {
    id: 'sig-cs-moe-routing',
    strand: '前沿AI演算法',
    topic: '混合專家模型 (MoE) 稀疏門控路由',
    problemSignal: '題目詢問 MoE 架構如何實現參數量與推論 FLOPs 計算量的解耦',
    threeSecondRule: '【Top-k 門控只喚醒 k 個專家，其餘權重全歸零】參數量大但每 token 運算量小！',
    firstStepFormula: 'G(x) = \\text{Softmax}(\\text{TopK}(x \\cdot W_g, k))',
    exampleProblem: {
      question: '8x7B (47B) MoE 模型推論時每個 token 的計算量約等同於多少參量的密集模型？',
      quickSolve: '每次僅啟動 Top-2 專家，運算量僅相當於約 13B 密集模型。',
    },
  },
  {
    id: 'sig-cs-raft-quorum',
    strand: '網路與通訊',
    topic: 'Raft 分散式共識法定過半數 (Quorum)',
    problemSignal: '題目給定集群節點數 $N$，求領導者當選或日誌提交所需的最低票數',
    threeSecondRule: '【節點數除以 2 取高斯整數再加 1】5 節點需 3 票，7 節點需 4 票！',
    firstStepFormula: '\\text{Quorum} = \\lfloor N / 2 \\rfloor + 1',
    exampleProblem: {
      question: '一個由 5 台伺服器組成的 Raft 集群，最多能容忍幾台節點同時當機？',
      quickSolve: '法定票數為 3 票，因此最多可容忍 5 - 3 = 2 台節點同時當機故障。',
    },
  },
  {
    id: 'sig-cs-csma-cd-minframe',
    strand: '網路與通訊',
    topic: '乙太網路 CSMA/CD 最短訊框長度',
    problemSignal: '題目給定單向傳播延遲 $\\tau$ 與傳輸速率 $B$，求偵測碰撞的最短訊框長度',
    threeSecondRule: '【2 倍傳播延遲乘以傳輸頻寬】發送時間必須撐過來回爭用期才能確保偵測到衝突！',
    firstStepFormula: 'L_{\\min} = 2\\tau \\times \\text{Bandwidth}',
    exampleProblem: {
      question: '傳播延遲 2.56μs、速率 100Mbps 的乙太網路，最短訊框為多少？',
      quickSolve: 'L = 2 × 2.56μs × 100Mbps = 512 bits = 64 Bytes。',
    },
  },
]
