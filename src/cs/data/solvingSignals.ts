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
  {
    id: 'sig-cs-lora-reduction',
    strand: '前沿AI演算法',
    topic: '大模型 LoRA 矩陣分解參數縮減比例',
    problemSignal: '題目給定原權重維度 $d \\times k$ 與 LoRA 低秩維度 $r$，求可訓練參數量佔比',
    threeSecondRule: '【(d+k)*r 除以 d*k】4096 維下 rank=8 參數量立減 99.6%！',
    firstStepFormula: '\\text{Ratio} = \\frac{(d + k) \\cdot r}{d \\cdot k}',
    exampleProblem: {
      question: '4096 × 4096 的權重矩陣加入 rank=8 的 LoRA 後，需微調的參數為多少？',
      quickSolve: '(4096 + 4096) × 8 = 65,536 個參數 (相較於 1,677 萬縮減 99.6%)。',
    },
  },
  {
    id: 'sig-cs-shunting-yard',
    strand: '軟硬體本質',
    topic: '編譯器 Shunting-Yard 運算式轉後序',
    problemSignal: '題目給定包含括號與乘除加減的中序運算式，求其對應的逆波蘭 (RPN) 順序',
    threeSecondRule: '【遇到數字直接輸出，運算子看優先級比大小進棧，遇右括號全彈出】！',
    firstStepFormula: '\\text{Precedence: } ^ > *, / > +, - \\quad \\& \\quad \\text{Parentheses Match}',
    exampleProblem: {
      question: '運算式 A + B * C 轉換為後序表示法為何？',
      quickSolve: '乘法優先級高於加法，轉換結果為 A B C * +。',
    },
  },
  {
    id: 'sig-cs-ieee754-bias',
    strand: '數位邏輯',
    topic: 'IEEE 754 單精度浮點數指數偏差值',
    problemSignal: '題目給定十進位或二進位小數，求其 IEEE 754 32 位元單精度指數欄位數值',
    threeSecondRule: '【真值指數 e 加上 127】雙精度則是加上 1023！',
    firstStepFormula: 'E = e + 127 \\quad (\\text{Single Precision } 32\\text{-bit})',
    exampleProblem: {
      question: '若規格化後指數為 2^3，則 8-bit 指數欄位填入何值？',
      quickSolve: 'E = 3 + 127 = 130 = (10000010)_2。',
    },
  },
  {
    id: 'sig-cs-vit-patches',
    strand: '現代AI硬體',
    topic: '視覺 Transformer (ViT) 影像分塊總數',
    problemSignal: '題目給定影像高寬 H, W 與 patch 大小 P，求送入 Transformer 的 Token 數',
    threeSecondRule: '【H*W 除以 P 的平方，若問總 Token 數再加 1 個 CLS】！',
    firstStepFormula: 'N = \\frac{H \\times W}{P^2} \\implies \\text{Total} = N + 1',
    exampleProblem: {
      question: '224×224 影像以 16×16 切塊，包含 CLS 的總 Token 數？',
      quickSolve: 'N = (224*224)/(16*16) = 196，加上 CLS 共 197 個 Token。',
    },
  },
  {
    id: 'sig-cs-speculative-speedup',
    strand: '前沿AI演算法',
    topic: '大模型推測解碼 (Speculative Decoding) 加速期望值',
    problemSignal: '題目給定小模型接受率 $\\alpha$ 與草稿步數 $K$，求單步平均生成 Token 數',
    threeSecondRule: '【首項為 1 公比為 alpha 的等比級數和】alpha=0.8, K=4 時單步直出 3.36 個 Token！',
    firstStepFormula: '\\mathbb{E}[N] = \\frac{1 - \\alpha^{K+1}}{1 - \\alpha} = \\sum_{j=0}^K \\alpha^j',
    exampleProblem: {
      question: '接受率 0.8、草稿長度 4 的推測解碼，大模型單次評估平均輸出多少 Token？',
      quickSolve: '1 + 0.8 + 0.64 + 0.512 + 0.4096 = 3.36 個 Token (加速 2.8 倍)。',
    },
  },
  {
    id: 'sig-cs-mux-select',
    strand: '數位邏輯',
    topic: '多工器 (MUX) 輸入線與選擇控制線關係',
    problemSignal: '題目給定 $N$ 條輸入資料線，求需要幾條選擇線 $n$',
    threeSecondRule: '【取以 2 為底的對數】16 條輸入需 4 條線，32 條輸入需 5 條線！',
    firstStepFormula: 'n = \\log_2 N \\iff 2^n = N',
    exampleProblem: {
      question: '64 對 1 多工器需要幾條選擇線？',
      quickSolve: '2^6 = 64，因此需要 6 條選擇線。',
    },
  },
  {
    id: 'sig-cs-bplus-height',
    strand: '五大單元架構',
    topic: '資料庫 B+ 樹索引樹高與磁碟 I/O 次數',
    problemSignal: '題目給定資料量 $N$ 與節點階數/扇出 $M$，求定位資料的磁碟讀取次數',
    threeSecondRule: '【以 M 為底取 log 並無條件進位】扇出 200 時一千萬筆資料只要 4 次 I/O！',
    firstStepFormula: 'h = \\lceil \\log_M N \\rceil',
    exampleProblem: {
      question: '若扇出 M=100，資料量 N=1,000,000，B+ 樹樹高為多少？',
      quickSolve: '100^3 = 1,000,000，故樹高 h = 3，只需 3 次磁碟讀取。',
    },
  },
  {
    id: 'sig-cs-roofline-knee',
    strand: '現代AI硬體',
    topic: 'Roofline 頂蓋模型：記憶體瓶頸與算力瓶頸劃分',
    problemSignal: '題目給定算力強度 $I$ (FLOPs/Byte)、峰值算力 $P_{\\text{peak}}$ 與頻寬 $B$',
    threeSecondRule: '【比較算力強度與拐點值 I_knee】I < I_knee 必為 Memory-Bound！',
    firstStepFormula: 'I_{\\text{knee}} = \\frac{P_{\\text{peak}}}{\\text{Bandwidth}} \\implies I < I_{\\text{knee}} \\to \\text{Memory-Bound}',
    exampleProblem: {
      question: 'GPU 算力 300 TFLOPS，頻寬 1500 GB/s，算力強度為 50 FLOPs/Byte 時為何種瓶頸？',
      quickSolve: 'I_knee = 300e12 / 1500e9 = 200。因 50 < 200，故為 Memory-Bound。',
    },
  },
  {
    id: 'sig-cs-tp-allreduce',
    strand: '現代AI硬體',
    topic: 'Megatron-LM 張量平行單層通訊次數與傳輸量',
    problemSignal: '題目詢問 Transformer 層在張量平行 (TP) 下的前向傳播 All-Reduce 次數',
    threeSecondRule: '【嚴格 2 次 All-Reduce】MHA 輸出投影一次，MLP 第二層投影一次！',
    firstStepFormula: '\\text{Ops} = 2 \\times \\text{All-Reduce} \\implies \\text{Bytes} = 2 \\times \\left[2 \\times \\frac{N-1}{N} M\\right]',
    exampleProblem: {
      question: '單層 Transformer 前向傳播在 TP=8 下產生幾次 All-Reduce？',
      quickSolve: 'Attention 輸出一次、MLP 輸出一次，共 2 次 All-Reduce。',
    },
  },
  {
    id: 'sig-cs-kvcache-mem',
    strand: '前沿AI演算法',
    topic: 'LLM 推論 KV Cache 顯存佔用估算',
    problemSignal: '題目給定 Batch, SeqLen, Layers, HiddenDim 與 FP16 精度，求 KV Cache 顯存大小',
    threeSecondRule: '【乘數因子為 2 (Key 與 Value 各一份)】2 * b * s * L * h * 2 Bytes！',
    firstStepFormula: '\\text{Size} = 2 \\times b \\times s \\times L \\times h \\times 2\\text{ Bytes}',
    exampleProblem: {
      question: 'b=2, s=8192, L=32, h=4096 在 FP16 下的 KV Cache 顯存佔用？',
      quickSolve: '2 * 2 * 8192 * 32 * 4096 * 2 = 8,589,934,592 Bytes = 8 GiB (約 8.59 GB)。',
    },
  },
  {
    id: 'sig-cs-moe-balance-loss',
    strand: '前沿AI演算法',
    topic: 'MoE 門控路由輔助負載均衡損失理論下界',
    problemSignal: '題目詢問 MoE 專家混合模型在完美均勻分佈時的負載均衡損失值',
    threeSecondRule: '【完美平衡時剛好等於權重超參數 alpha】坍塌時膨脹為 alpha * E！',
    firstStepFormula: '\\mathcal{L}_{\\text{balance}} = \\alpha \\cdot E \\sum_{i=1}^E f_i P_i \\implies \\min = \\alpha',
    exampleProblem: {
      question: '8 專家 MoE 模型在 alpha=0.01 且路由完美均勻時的輔助損失為？',
      quickSolve: '每個專家分配 1/8 且機率 1/8，損失嚴格為 0.01。',
    },
  },
  {
    id: 'sig-cs-pagedattention-blocks',
    strand: '現代AI硬體',
    topic: 'PagedAttention 邏輯分頁塊 (Blocks) 數量計算',
    problemSignal: '題目給定序列長度 $S$ 與 Block Size $B$，求所需的物理顯存塊數',
    threeSecondRule: '【S 除以 B 無條件進位】最後一個不滿的塊為唯一內部碎片！',
    firstStepFormula: 'N_{\\text{blocks}} = \\left\\lceil \\frac{S}{B} \\right\\rceil',
    exampleProblem: {
      question: '序列長度 2050，每塊大小 16 個 Token，共需多少個 Block？',
      quickSolve: 'ceil(2050 / 16) = ceil(128.125) = 129 個 Blocks。',
    },
  },
  {
    id: 'sig-cs-pp-bubble-rate',
    strand: '現代AI硬體',
    topic: '大模型 1F1B 管線平行 (Pipeline Parallelism) 氣泡率估算',
    problemSignal: '題目給定管線級數 $p$ 與微批次數 $m$，求硬體閒置氣泡比例',
    threeSecondRule: '【(p - 1) 除以 (m + p - 1)】m 越大氣泡率越趨近零！',
    firstStepFormula: 'F_{\\text{bubble}} = \\frac{p - 1}{m + p - 1}',
    exampleProblem: {
      question: '4 級管線且 16 個微批次時的氣泡率為多少？',
      quickSolve: '(4 - 1) / (16 + 4 - 1) = 3 / 19 ≈ 15.79%。',
    },
  },
  {
    id: 'sig-cs-rsa-euler-inv',
    strand: '網路與通訊',
    topic: 'RSA 公鑰密碼學私鑰模反元素推導',
    problemSignal: '題目給定質數 p, q 與公鑰指數 e，求私鑰 d',
    threeSecondRule: '【先求歐拉值 (p-1)(q-1) 再用擴展歐幾里得求模逆元】e*d ≡ 1 mod phi！',
    firstStepFormula: 'e \\cdot d \\equiv 1 \\pmod{(p-1)(q-1)}',
    exampleProblem: {
      question: 'p=61, q=53, e=17 時的私鑰 d 為多少？',
      quickSolve: 'phi=(60)(52)=3120，解 17d ≡ 1 mod 3120 得 d = 2753。',
    },
  },
  {
    id: 'sig-cs-zero3-comm-ratio',
    strand: '現代AI硬體',
    topic: 'ZeRO-3 (FSDP) 全分片通訊開銷比例',
    problemSignal: '題目詢問 ZeRO-3 全分片相比於標準資料平行 (DP) 的通訊量倍數',
    threeSecondRule: '【恰好為 1.5 倍 (3M / 2M)】增加 50% 通訊換取顯存均勻攤銷 N 倍！',
    firstStepFormula: '\\frac{\\text{Comm}_{\\text{ZeRO-3}}}{\\text{Comm}_{\\text{DP}}} = \\frac{3 \\times \\frac{N-1}{N} M}{2 \\times \\frac{N-1}{N} M} = 1.5',
    exampleProblem: {
      question: '70B 模型在 ZeRO-3 訓練時相較於標準 DP 增加了多少比例通訊量？',
      quickSolve: '通訊比為 1.5 倍，故僅增加了 50% 通訊量。',
    },
  },
  {
    id: 'sig-cs-hbm-interposer',
    strand: '現代AI硬體',
    topic: 'HBM3e 高頻寬記憶體 TSV 與 2.5D 矽中介層特徵',
    problemSignal: '題目問及 AI 晶片達到數 TB/s 顯存頻寬的核心微電子封裝關鍵字',
    threeSecondRule: '【看到 1024-bit 超寬匯流排 + TSV 垂直堆疊 + 矽中介層 Interposer 直選 HBM】！',
    firstStepFormula: '\\text{Bandwidth} = \\text{BusWidth} \\times \\text{DataRate} \\approx 1024\\text{ bits} \\times \\text{Rate} \\to 8\\text{ TB/s}',
    exampleProblem: {
      question: 'GPU 核心與記憶體共封裝在矽中介層上且具備 1024 位元匯流排者為何種記憶體？',
      quickSolve: '此為高頻寬記憶體 (HBM3e) 的標準物理封裝特徵。',
    },
  },
  {
    id: 'sig-cs-lsm-waf',
    strand: '五大單元架構',
    topic: 'LSM-Tree 分層壓縮寫入放大係數 (WAF)',
    problemSignal: '題目給定放大因子 T 與層數 L，求 Leveled Compaction 寫入放大',
    threeSecondRule: '【WAF 大約等於 T 乘以 (L - 1)】每層多路歸併覆寫 T 次！',
    firstStepFormula: '\\text{WAF} \\approx 1 + 1 + T \\times (L - 1)',
    exampleProblem: {
      question: 'T=10 且 L=5 時 LSM-Tree 的 WAF 約為多少？',
      quickSolve: '2 + 10 * 4 = 42。',
    },
  },
  {
    id: 'sig-cs-dpo-closed-form',
    strand: '前沿AI演算法',
    topic: 'DPO 直接偏好優化隱式獎勵閉式解',
    problemSignal: '題目詢問 DPO 為何能擺脫獨立 Reward Model 與 PPO 強化學習',
    threeSecondRule: '【獎勵直接解析為策略對數勝率差】二元交叉熵單步搞定對齊！',
    firstStepFormula: 'r(x, y) = \\beta \\log \\frac{\\pi_\\theta(y|x)}{\\pi_{\\text{ref}}(y|x)} + C',
    exampleProblem: {
      question: 'DPO 的對齊損失函數數學本質為何？',
      quickSolve: '直接在偏好對上透過二元邏輯斯迴歸最小化勝率交叉熵。',
    },
  },
  {
    id: 'sig-cs-consistent-hashing',
    strand: '五大單元架構',
    topic: '一致性哈希 (Consistent Hashing) 與虛擬節點',
    problemSignal: '題目問及伺服器增減時如何避免全域快取雪崩重哈希',
    threeSecondRule: '【看到圓環映射 + 平均 1/N 遷移 + 虛擬節點防偏斜直選一致性哈希】！',
    firstStepFormula: '\\Delta \\text{Migration} \\approx \\frac{1}{N} \\times \\text{TotalKeys}',
    exampleProblem: {
      question: '分散式叢集增減單一節點時僅需遷移多少比例資料？',
      quickSolve: '僅需遷移約 1/N 的相鄰區間資料。',
    },
  },
  {
    id: 'sig-cs-cordic-shifts',
    strand: '數位邏輯',
    topic: 'CORDIC 座標旋轉演算法無乘法器特徵',
    problemSignal: '題目問及微控制器或 FPGA 內僅靠位移與加法計算三角函數的演算法',
    threeSecondRule: '【看到 tan(theta_i) = 2^(-i) 純位移與加法計算旋轉直選 CORDIC】！',
    firstStepFormula: 'x_{i+1} = x_i - d_i y_i 2^{-i}, \\quad y_{i+1} = y_i + d_i x_i 2^{-i}',
    exampleProblem: {
      question: 'FPGA 內無需乘法器計算 sin/cos 的微迭代演算法為何？',
      quickSolve: 'CORDIC 座標旋轉數位計算演算法。',
    },
  },
  {
    id: 'sig-cs-saga-pattern',
    strand: '五大單元架構',
    topic: '分散式長事務 Saga 模式與補償事務',
    problemSignal: '題目問及微服務跨庫事務如何避免 2PC 鎖定阻塞',
    threeSecondRule: '【拆分子事務 + 失敗逆向依序執行補償事務直選 Saga】！',
    firstStepFormula: 'T_1 \\dots T_k (\\text{Fail}) \\implies C_{k-1} \\dots C_1',
    exampleProblem: {
      question: '微服務長事務第三步扣款失敗時 Saga 如何維持最終一致性？',
      quickSolve: '逆向依序執行前兩步的補償事務進行語義回滾。',
    },
  },
  {
    id: 'sig-cs-epoll-redblack',
    strand: '作業系統',
    topic: 'Linux epoll 高並發核心資料結構特徵',
    problemSignal: '題目問及 epoll 突破 select/poll 效能瓶頸的核心資料結構',
    threeSecondRule: '【看到紅黑樹常駐管理 FD + 中斷回調就緒雙向鏈表 O(1) 直選 epoll】！',
    firstStepFormula: 'O(1) \\text{ Event-Driven Dispatch} \\quad (\\text{Ready List})',
    exampleProblem: {
      question: 'epoll 在核心層分別用什麼結構儲存監聽集合與就緒事件？',
      quickSolve: '紅黑樹管理監聽集合，雙向鏈結串列儲存就緒事件。',
    },
  },
]
