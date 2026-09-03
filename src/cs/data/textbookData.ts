import { describe, it, expect } from 'vitest'

export interface TextbookChapter {
  id: string
  chapterNumber: number
  title: string
  englishTitle: string
  strand: string
  readingTimeMinutes: number
  prerequisites: string[]
  historicalContext: {
    era: string
    keyFigures: string[]
    coreMotivation: string
    breakthroughStory: string
  }
  firstPrinciples: {
    summary: string
    mathematicalDerivations: {
      topic: string
      formula: string
      explanation: string
    }[]
  }
  architecturalDeepDive: {
    sectionTitle: string
    content: string
    keySubsystems: {
      name: string
      role: string
      technicalMechanism: string
    }[]
  }
  industrialCaseStudies: {
    companyOrProject: string
    systemName: string
    appliedSolution: string
  }[]
  deepThinkingQuestions: {
    question: string
    philosophicalAnalysis: string
  }[]
  classicReferences: {
    title: string
    author: string
    significance: string
  }[]
}

export const CS_TEXTBOOK_CHAPTERS: TextbookChapter[] = [
  {
    id: 'cs-ch-1',
    chapterNumber: 1,
    title: '計算機科學基石與資訊理論哲學',
    englishTitle: 'Foundations of Computer Science & Information Philosophy',
    strand: '軟硬體本質',
    readingTimeMinutes: 25,
    prerequisites: ['離散數學基礎', '機率論基礎', '基本邏輯閘概念'],
    historicalContext: {
      era: '1936 ~ 1948 年',
      keyFigures: ['艾倫·圖靈 (Alan Turing)', '克勞德·香農 (Claude Shannon)', '羅爾夫·蘭道爾 (Rolf Landauer)'],
      coreMotivation: '二十世紀中葉數學界追求「希爾伯特判定性問題 (Entscheidungsproblem)」的解答，隨後演變為對「資訊是什麼？」與「計算的物理極限在哪裡？」的哲學探究。',
      breakthroughStory: '1936 年圖靈提出抽象圖靈機，證明了通用計算機的存在性以及停機問題的不可判定性；1948 年香農發表《通訊的數學理論》，將抽象的「資訊」定量為可測量的熵；1961 年蘭道爾更進一步揭示：擦除 1 位元資訊必須向環境散熱至少 kT ln 2 的能量，計算本質上是受熱力學定律約束的物理過程。',
    },
    firstPrinciples: {
      summary: '計算本質上是狀態的有限確定性轉移；資訊是消除不確定性的物理量度。任何現代處理器皆受到量子穿隧效應、熱力學能量消散極限與光速傳播延遲的硬性物理制約。',
      mathematicalDerivations: [
        {
          topic: '香農資訊熵 (Shannon Entropy)',
          formula: 'H(X) = -\\sum_{x \\in \\mathcal{X}} P(x) \\log_2 P(x)',
          explanation: '衡量隨機變數 X 所攜帶的平均不確定性或平均資訊量。當所有符號等機率出現時資訊熵達到最大值 log2(N)。',
        },
        {
          topic: '蘭道爾熱力學抹除極限 (Landauer Principle)',
          formula: 'E_{\\text{erase}} \\ge k_B T \\ln 2',
          explanation: '在溫度 T 下，抹除 1 個二進位位元資訊所引發的熱力學不可逆熵增，導致向環境耗散至少 2.85 x 10^-21 焦耳熱量（常溫 300K）。',
        },
        {
          topic: '登納德縮放崩潰與功率密度 (Dennard Scaling Breakdown)',
          formula: '\\text{Power Density} = \\frac{P}{\\text{Area}} \\propto \\frac{C V^2 f}{1 / k^2} \\xrightarrow{V \\approx \\text{const}} k^2',
          explanation: '當特徵尺寸縮小 k 倍但工作電壓無法等比例下降時，功率密度以 k^2 二次方劇烈飆升，迫使多數晶粒斷電，形成「暗矽 (Dark Silicon)」物理牆。',
        },
      ],
    },
    architecturalDeepDive: {
      sectionTitle: '從抽象圖靈機到實體矽基電晶體之映射體系',
      content: '現代計算機體系是抽象代數與半導體固態物理的精密交響。透過 CMOS 能帶結構控制電子在源極與汲極間的穿梭，將二元邏輯電平 (0V / 1.0V) 構築為基本邏輯閘。',
      keySubsystems: [
        {
          name: '圖靈狀態轉移引擎 (State Transition Core)',
          role: '有限狀態控制',
          technicalMechanism: '以程式計數器 (PC) 與微指令 ROM 指引當前執行步態，保證圖靈完備性。',
        },
        {
          name: 'CMOS 邏輯閘反相器 (CMOS Inverter Array)',
          role: '實體位元操縱',
          technicalMechanism: '利用 NMOS 下拉網路與 PMOS 上拉網路互補工作，靜態時幾乎零直流通路功耗。',
        },
        {
          name: '特定領域架構加速矩陣 (DSA Heterogeneous Fabric)',
          role: '突破功耗牆',
          technicalMechanism: '繞過通用 CPU 複雜解碼管線，針對特定張量運算提供專用低功耗資料流電路。',
        },
      ],
    },
    industrialCaseStudies: [
      {
        companyOrProject: 'NVIDIA & Google',
        systemName: '專用 AI 晶片架構轉向 (TPU / Blackwell)',
        appliedSolution: '面對登納德縮放崩潰與暗矽困境，停止單純堆疊 CPU 核心，全面轉向專用張量矩陣核心 (Tensor Core) 與脈動資料流架構。',
      },
      {
        companyOrProject: 'NASA JPL',
        systemName: '毅力號火星探測器抗輻射處理器 (RAD750)',
        appliedSolution: '利用絕緣層上矽 (SOI) 技術抑制高能宇宙射線單粒子翻轉 (SEU)，貫徹第一性原理的高可靠度容錯設計。',
      },
    ],
    deepThinkingQuestions: [
      {
        question: '如果計算可以用可逆邏輯閘 (如 Fredkin / Toffoli Gate) 實現，我們是否能完全消滅晶片發熱？',
        philosophicalAnalysis: '理論上可逆計算因不抹除資訊，熱耗散不受蘭道爾極限約束；但現實中熱雜訊與非理想開關仍會引起寄生電阻耗散，工程上追求極限近零發熱推動了超導量子計算與絕熱邏輯的演進。',
      },
      {
        question: '停機問題 (Halting Problem) 證明了不存在通用的程式分析器，這對現代編譯器與靜態程式碼審查有何指導意義？',
        philosophicalAnalysis: '證明了任何編譯器靜態死循環分析、安全漏洞掃描工具都必然在「假陽性 (False Positive)」與「假陰性 (False Negative)」之間做工程妥協，不可能達到 100% 完美的健全且完備。',
      },
    ],
    classicReferences: [
      {
        title: 'The Mathematical Theory of Communication',
        author: 'Claude Shannon (1948)',
        significance: '奠定現代數位世界資訊量度與通道編碼極限的劃時代創始論文。',
      },
      {
        title: 'On Computable Numbers, with an Application to the Entscheidungsproblem',
        author: 'Alan Turing (1936)',
        significance: '定義圖靈機與證明計算極限的電腦科學奠基之作。',
      },
    ],
  },
  {
    id: 'cs-ch-2',
    chapterNumber: 2,
    title: '馮紐曼體系結構與中央處理單元微架構',
    englishTitle: 'Von Neumann Architecture & Advanced CPU Microarchitectures',
    strand: '五大單元架構',
    readingTimeMinutes: 30,
    prerequisites: ['二進位與基本邏輯閘', '組合語言基本指令', '記憶體位址概念'],
    historicalContext: {
      era: '1945 ~ 1990 年代',
      keyFigures: ['約翰·馮·紐曼 (John von Neumann)', '吉恩·阿姆達爾 (Gene Amdahl)', '約翰·亨尼斯 (John Hennessy)'],
      coreMotivation: '早期的計算機器 (如 ENIAC) 依靠重新插拔實體電纜來更改程式，極端繁瑣且無通用性。如何將程式指令與操作資料統一同等對待並存於同一記憶體中？',
      breakthroughStory: '1945 年馮·紐曼起草《EDVAC 報告書的第一份草案》，奠定了儲存程式型電腦 (Stored-program Computer) 的經典五大單元。然而隨著半導體微處理器主頻飆升，CPU 運算速度每年成長 50%，但 DRAM 記憶體存取延遲每年僅改善 7%，形成了延宕至今的「馮紐曼瓶頸 (Von Neumann Bottleneck / Memory Wall)」。',
    },
    firstPrinciples: {
      summary: '中央處理器是指令解碼與暫存器狀態機的極速驅動器。透過多級管線化、亂序執行、多級快取階層與分支預測，在嚴格維持循序語義 (Sequential Consistency) 的同時榨乾指令級平行度 (ILP)。',
      mathematicalDerivations: [
        {
          topic: '阿姆達爾定律 (Amdahl\'s Law)',
          formula: 'S_{\\text{latency}}(s) = \\frac{1}{(1 - p) + \\frac{p}{s}}',
          explanation: '描述平行運算加速比極限。若程式中有 (1 - p) 比例必須串行執行，無論增加多少處理核心 (s -> infty)，最大加速比絕不可能超過 1 / (1 - p)。',
        },
        {
          topic: '平均記憶體訪存時間 (AMAT)',
          formula: '\\text{AMAT} = T_{\\text{L1}} + M_{\\text{L1}} \\times (T_{\\text{L2}} + M_{\\text{L2}} \\times (T_{\\text{L3}} + M_{\\text{L3}} \\times T_{\\text{DRAM}}))',
          explanation: '揭示多級快取金字塔架構的數學原理。只要 L1/L2 保持 95%+ 命中率，就能將數百週期的記憶體漫長等待掩蓋在數個時脈週期內。',
        },
        {
          topic: 'CPU 執行時間公式 (Iron Law of Processor Performance)',
          formula: '\\text{Execution Time} = \\text{Instruction Count} \\times \\text{CPI} \\times \\text{Clock Cycle Time}',
          explanation: '電腦微架構設計的三位一體鐵律：ISA 決定指令數，微架構決定每個指令的時脈週期數 (CPI)，半導體物理工藝決定主頻週期 (Cycle Time)。',
        },
      ],
    },
    architecturalDeepDive: {
      sectionTitle: '超純量亂序執行管線與記憶體消歧子系統',
      content: '現代高階 CPU（如 Intel Raptor Lake, AMD Zen 4, Apple M 系列）早已超越純量循序架構，轉變為龐大的資料流 (Dataflow) 亂序推測執行引擎。',
      keySubsystems: [
        {
          name: '前端分支預測器 (TAGE Branch Predictor)',
          role: '精準預測控制流',
          technicalMechanism: '利用多個幾何級數增長歷史長度的標籤表，精準預測迴圈與複雜條件分支，命中率高達 97%+。',
        },
        {
          name: '保留站與引退佇列 (Reservation Stations & ROB)',
          role: '亂序調度與循序引退',
          technicalMechanism: '指令進入重排序緩衝區 (ROB) 進行暫存器重新命名消滅 WAW/WAR 相依，亂序分發至 ALU 執行，最後嚴格按程式原始順序引退。',
        },
        {
          name: '載入/儲存單元 (LSU) 與 STLF 旁路',
          role: '記憶體資料前轉',
          technicalMechanism: 'Store Buffer 暫存未引退寫入，後續 Load 在記憶體消歧匹配時直接旁路前轉 (STLF)，消滅快取讀取週期。',
        },
      ],
    },
    industrialCaseStudies: [
      {
        companyOrProject: 'Apple Silicon',
        systemName: 'M 系列 Ultra 寬發射微架構',
        appliedSolution: '採用高達 8 寬度指令發射與 600+ 條目超大 ROB，配合超大 L1 快取與高頻率 LPDDR5 統一記憶體 (UMA)，在極低功耗下榨取恐怖的單核 IPC。',
      },
      {
        companyOrProject: 'AMD',
        systemName: '3D V-Cache 垂直堆疊技術',
        appliedSolution: '透過 TSMC 混合鍵合 (Hybrid Bonding) 技術將 64MB SRAM 晶片垂直堆疊於 CPU 核心之上，以極致短物理距離將 L3 擴展至 96MB，消滅 AMAT 延遲。',
      },
    ],
    deepThinkingQuestions: [
      {
        question: '推測執行 (Speculative Execution) 帶來了巨大的性能飛躍，但為何它在 2018 年引發了撼動全球半導體產業的 Spectre / Meltdown 災難？',
        philosophicalAnalysis: '因為推測執行的架構狀態 (Architectural State) 雖能在預測失敗時回滾，但微架構狀態 (Microarchitectural State，如快取行是否被載入) 留下了微秒級側信道 (Side Channel)，使無特權惡意程式能藉由訪存時差窺探核心記憶體密碼。',
      },
    ],
    classicReferences: [
      {
        title: 'Computer Architecture: A Quantitative Approach',
        author: 'John L. Hennessy & David A. Patterson',
        significance: '圖靈獎得主合著，全球電腦架構領域公認的聖經巨著。',
      },
    ],
  },
  {
    id: 'cs-ch-3',
    chapterNumber: 3,
    title: '數位邏輯、布林代數與高階算術邏輯單元',
    englishTitle: 'Digital Logic, Boolean Algebra & Advanced Arithmetic Logic Units',
    strand: '數位邏輯',
    readingTimeMinutes: 25,
    prerequisites: ['二進位補數概念', '邏輯運算基礎'],
    historicalContext: {
      era: '1854 ~ 1960 年代',
      keyFigures: ['喬治·布爾 (George Boole)', '克勞德·香農 (Claude Shannon)', '約翰·馮·紐曼'],
      coreMotivation: '19 世紀數學家布爾建立布林代數時純粹出於數理邏輯思辨；1937 年香農在碩士論文中驚人發現：繼電器開關電路正好與布林代數完全同構！',
      breakthroughStory: '將哲學符號邏輯轉化為實體二進位開關，讓人類第一次能製造出用純電氣信號執行四則運算的物理裝置。隨著位元寬度從 4 位擴展至 64 位，進位傳遞鏈 (Carry Chain) 成為制約運算速度的物理瓶頸，催生了超前進位 (CLA)、華萊士樹 (Wallace Tree) 與 IEEE 754 浮點規範。',
    },
    firstPrinciples: {
      summary: '加法是一切進階數位運算（減法、乘法、除法、位址生成）的物理基石。透過進位生成 (Generate) 與傳遞 (Propagate) 的代數分離，將串行依賴化解為並行樹狀前綴運算。',
      mathematicalDerivations: [
        {
          topic: '超前進位並行前綴方程式 (CLA Carry Lookahead)',
          formula: 'G_i = A_i B_i, \\quad P_i = A_i \\oplus B_i, \\quad C_{i+1} = G_i + P_i C_i',
          explanation: '遞歸展開後進位直接成為初始輸入的積之和 (SOP) 形式，進位延遲從 O(n) 驟降至 O(log n) 或多級 CLA 的 O(1)。',
        },
        {
          topic: '二補數數學同餘本質 (Two\'s Complement Congruence)',
          formula: '-A = 2^n - A = \\bar{A} + 1 \\pmod{2^n}',
          explanation: '證明了二補數利用模同餘特性，讓硬體無需設計減法電路，只用加法器加反碼加一即可完成精確無歧義的有號數減法。',
        },
        {
          topic: 'IEEE 754 浮點數數值表達規範',
          formula: 'V = (-1)^s \\times (1.M) \\times 2^{E - \\text{Bias}} \\quad (\\text{正規化數})',
          explanation: '隱含前導 1 (Implicit Leading Bit) 節省 1 位尾數，指數偏移碼 (Biased Exponent) 讓硬體直接用整數比較器快速判斷浮點數大小。',
        },
      ],
    },
    architecturalDeepDive: {
      sectionTitle: '高效能 64 位元 ALU 與浮點運算單元微架構',
      content: 'ALU 不僅僅是加法器，更是整合了桶式移位器 (Barrel Shifter)、位元掩碼器、乘累加器 (MAC) 的並行硬體矩陣。',
      keySubsystems: [
        {
          name: '華萊士樹進位保留乘法器 (Wallace Tree CSA)',
          role: '高速矩陣乘法',
          technicalMechanism: '利用 Full Adder 作為 3:2 壓縮器，將大量部分積無進位串行延遲並行壓縮為兩行，最後由 CLA 一次相加。',
        },
        {
          name: '桶式移位器 (Barrel Shifter Array)',
          role: '單週期任意位元移位',
          technicalMechanism: '以多級交叉開關矩陣在 1 個時脈週期內完成 0~63 任意位數的邏輯/算術移位。',
        },
        {
          name: 'FPU 異常處理與 FTZ 模式單元',
          role: '浮點極限保護',
          technicalMechanism: '硬體暫存器開關 Flush-To-Zero，當檢測到指數為 0 的非正規化數時直接截斷為 0，避免觸發 150 週期微碼慢速陷阱。',
        },
      ],
    },
    industrialCaseStudies: [
      {
        companyOrProject: 'Intel & AMD',
        systemName: 'AVX-512 / AVX10 向量指令集運算單元',
        appliedSolution: '在 CPU 內部置入 512 位元超寬 FMA (Fused Multiply-Add) 單元，單週期並行計算 16 個 32 位元單精度浮點乘加。',
      },
    ],
    deepThinkingQuestions: [
      {
        question: '為什麼 IEEE 754 要定義非數 (NaN) 與正負無窮大 (+Inf / -Inf)，而不是在發生除以零時直接硬體中斷藍屏當機？',
        philosophicalAnalysis: '體現了數值工程的「寬容與傳遞哲學」：在巨量科學計算或即時渲染管線中，個別數值溢出不應癱瘓整個批次模擬，NaN 能在數學運算鏈中自動傳播，讓最終檢驗層統一下沉捕獲。',
      },
    ],
    classicReferences: [
      {
        title: 'What Every Computer Scientist Should Know About Floating-Point Arithmetic',
        author: 'David Goldberg (1991)',
        significance: '浮點計算領域的經典奠基文獻，詳解捨入誤差、Catastrophic Cancellation 與標準實作。',
      },
    ],
  },
  {
    id: 'cs-ch-4',
    chapterNumber: 4,
    title: '現代作業系統核心與並發哲學',
    englishTitle: 'Modern Operating System Kernels & Concurrency Philosophy',
    strand: '作業系統',
    readingTimeMinutes: 30,
    prerequisites: ['虛擬記憶體概念', '多執行緒概念', '中斷基本原理'],
    historicalContext: {
      era: '1969 ~ 現代',
      keyFigures: ['肯·湯普遜 (Ken Thompson)', '丹尼斯·里奇 (Dennis Ritchie)', '林納斯·托瓦茲 (Linus Torvalds)'],
      coreMotivation: '早期的多工系統脆弱且缺乏防護，單一程式出錯會導致整台大型主機崩潰。如何利用硬體分級特權，為每個行程創造獨立、無衝突且無限資源的虛擬空間幻象？',
      breakthroughStory: '1969 年貝爾實驗室誕生 Unix，確立了「一切皆檔案」與進程空間隔離的設計哲學；1991 年 Linux 核心誕生並演化為掌控全球伺服器與超級電腦的開源巨擘。在多核心與非統一記憶體存取 (NUMA) 時代，作業系統演變為管理極端並發、消滅鎖爭用 (Lock Contention) 與隱藏硬體延遲的複雜軟體工程奇蹟。',
    },
    firstPrinciples: {
      summary: '作業系統的本質是「受保護的虛擬化」與「資源仲裁者」。透過 CPU 特權級別 (Ring 0 / Ring 3) 與 MMU 分頁機制，將混亂的實體硬體抽象為行程、檔案與虛擬記憶體。',
      mathematicalDerivations: [
        {
          topic: '多級分頁虛擬記憶體映射與覆蓋率',
          formula: '\\text{Virtual Address} = \\text{PGD} \\parallel \\text{PUD} \\parallel \\text{PMD} \\parallel \\text{PTE} \\parallel \\text{Offset}',
          explanation: 'x86-64 架構下 4 級分頁結構，將 48 位元虛擬位址稀疏映射到實體記憶體，避免預先分配全域巨大連續頁表（節省數 GB 空間）。',
        },
        {
          topic: '完全公平排程器 (CFS) 虛擬運作時間公式',
          formula: 'vruntime_{i} \\mathrel{+}= \\Delta \\text{exec\\_time} \\times \\frac{\\text{NICE\\_0\\_LOAD}}{\\text{weight}_i}',
          explanation: 'Linux CFS 以紅黑樹維護所有行程的 vruntime，高優先級 (低 nice) 行程權重大，vruntime 增加緩慢，從而享有更高頻繁的 CPU 排程機會。',
        },
      ],
    },
    architecturalDeepDive: {
      sectionTitle: 'Linux 核心記憶體管理、零拷貝與無鎖並發架構',
      content: '現代 OS 核心在微秒與納秒級別進行資源調度，任何不必要的記憶體拷貝或全域鎖爭用都會導致巨量效能崩塌。',
      keySubsystems: [
        {
          name: 'Linux CFS 紅黑樹排程佇列',
          role: '完全公平多工排程',
          technicalMechanism: '每次排程以 O(1) 取出紅黑樹最左節點，保證低延遲且絕無行程飢餓。',
        },
        {
          name: '讀取-複製-更新 (RCU) 同步原語',
          role: '極致讀多寫少並發',
          technicalMechanism: '讀取者零等待零鎖直接讀取指針，寫入者複製副本修改並在寬限期 (Grace Period) 後原子切換指針並釋放舊記憶體。',
        },
        {
          name: 'epoll 核心事件驅動驅動引擎',
          role: 'C10K / C1000K 高並發 I/O',
          technicalMechanism: '以核心紅黑樹管理監聽 Socket，硬體中斷回調直接將就緒事件推進雙向鏈表，徹底消滅 select/poll 的 O(N) 遍歷。',
        },
      ],
    },
    industrialCaseStudies: [
      {
        companyOrProject: 'Linux Kernel Community',
        systemName: 'io_uring 非同步 I/O 革命',
        appliedSolution: 'Jens Axboe 設計的 io_uring 透過使用者空間與核心空間共享 Submission Queue (SQ) 與 Completion Queue (CQ) 雙環狀緩衝區，實現了零系統調用 (Zero-syscall) 的極致 NVMe 固態硬碟磁碟與網路吞吐。',
      },
    ],
    deepThinkingQuestions: [
      {
        question: '既然微核心 (Microkernel, 如 seL4 / Fuchsia) 具備更高形式化安全驗證與模組化容錯，為什麼以單核心 (Monolithic) 為架構的 Linux 依然統治著高效能運算與雲端世界？',
        philosophicalAnalysis: '這是「IPC 上下文切換代價」與「極致效能」的歷史博弈。微核心跨伺服模組頻繁的行程間通訊與 TLB 刷新在極致高頻 I/O 下帶來了難以承受的開銷，而單核心透過模組化驅動與巨量並發優化在實用效能上取得了壓倒性勝利。',
      },
    ],
    classicReferences: [
      {
        title: 'Operating Systems: Three Easy Pieces (OSTEP)',
        author: 'Remzi H. Arpaci-Dusseau & Andrea C. Arpaci-Dusseau',
        significance: '以虛擬化、並發、持久化三大主題切入的當代最佳作業系統導讀教科書。',
      },
    ],
  },
  {
    id: 'cs-ch-5',
    chapterNumber: 5,
    title: '現代電腦網路與分散式系統協定',
    englishTitle: 'Modern Computer Networking & Distributed Protocols',
    strand: '網路與通訊',
    readingTimeMinutes: 30,
    prerequisites: ['基本Socket通訊', '分散式概念', '雜湊演算法'],
    historicalContext: {
      era: '1969 (ARPANET) ~ 現代',
      keyFigures: ['文頓·瑟夫 (Vint Cerf)', '羅伯特·卡恩 (Bob Kahn)', '萊斯利·蘭伯特 (Leslie Lamport)'],
      coreMotivation: '冷戰時期國防部需要即使個別通信節點遭受核打擊癱瘓，整體網路依然能自我修復路由的強健通信系統；隨後演化為全球數十億異質設備的互聯與分散式資料庫強一致性挑戰。',
      breakthroughStory: 'Cerf 與 Kahn 設計了 TCP/IP，以端到端原則 (End-to-End Principle) 讓啞網路 (Dumb Network) 支撐智慧終端；Lamport 提出邏輯時鐘與 Paxos 共識協定，奠定了分散式系統無全局時鐘下的因果順序與拜占庭將軍容錯基石。',
    },
    firstPrinciples: {
      summary: '網路本質是不完全可靠的非同步封包交換媒介。分散式系統的核心命題是在「不可靠通訊」與「節點隨機故障」的殘酷現實下，達成數據的因果偏序一致性。',
      mathematicalDerivations: [
        {
          topic: 'CAP 定理 (Brewer\'s Conjecture / Gilbert & Lynch Proof)',
          formula: '\\text{Consistency} \\cap \\text{Availability} \\cap \\text{Partition Tolerance} = \\emptyset \\quad (\\text{在網路分區發生時})',
          explanation: '數學證明：在非同步網路存在分區 (P) 的前提下，系統不可能同時滿足強一致性 (C) 與高可用性 (A)，必須做出工程取捨 (CP 或 AP)。',
        },
        {
          topic: '向量時鐘因果偏序偏序格 (Vector Clock Partial Order)',
          formula: 'V_A \\le V_B \\iff \\forall k, V_A[k] \\le V_B[k] \\quad (\\text{若互有大小則 } V_A \\parallel V_B)',
          explanation: '解決分散式系統事件因果追蹤，嚴格區分「因果先後發生」與「物理並發衝突」。',
        },
        {
          topic: '頻寬時延積 (Bandwidth-Delay Product, BDP)',
          formula: '\\text{BDP} = \\text{Bottleneck Bandwidth} \\times \\text{Round-Trip Time}',
          explanation: '決定高速網路連線中在飛行途中 (In-Flight) 所需填滿的資料位元數，是 BBR 壅塞控制維持極致吞吐無緩衝膨脹的理論基礎。',
        },
      ],
    },
    architecturalDeepDive: {
      sectionTitle: 'QUIC 傳輸層革命與 Google Percolator 分散式事務架構',
      content: '傳統 TCP 隊頭阻塞與兩階段提交 (2PC) 剛性協同已無法適應跨全球資料中心的低延遲要求，引發了從網路層到分散式儲存層的典範轉移。',
      keySubsystems: [
        {
          name: 'QUIC UDP 多串流傳輸架構',
          role: '消滅隊頭阻塞',
          technicalMechanism: '每個串流獨立分配序號與滑動視窗，單一串流丟包不阻塞其他串流，支援 64 位元 Connection ID 零中斷連線遷移。',
        },
        {
          name: 'Percolator Primary Lock 錨點提交引擎',
          role: '去中心化跨行 ACID',
          technicalMechanism: '利用 TSO 全局單調時間戳與 Primary Lock 狀態作為唯一真理源，消除傳統協調者單點故障。',
        },
        {
          name: 'Raft 分散式共識狀態機',
          role: '多數派複製日誌',
          technicalMechanism: '透過 Leader 心跳租約、日誌匹配不變性與多數派 Quorum 投票保證線性一致性。',
        },
      ],
    },
    industrialCaseStudies: [
      {
        companyOrProject: 'Google',
        systemName: 'Spanner 全球分散式關聯資料庫',
        appliedSolution: '利用原子鐘 (Atomic Clocks) 與 GPS 接收器在資料中心構建 TrueTime API，將全局不確定時間縮小至 7ms 以內，實現全球規模的外部一致性 (External Consistency) 與無鎖快照讀取。',
      },
    ],
    deepThinkingQuestions: [
      {
        question: 'FLP 不可能定理 (Fischer-Lynch-Paterson) 證明了在非同步網路中，哪怕只有一個節點可能崩潰，也不存在確定性的共識演算法。那麼 Paxos 和 Raft 是如何打破這個魔咒在工程中落地的？',
        philosophicalAnalysis: 'FLP 定理限制的是「非同步確定性演算法在最壞情況下保證終止 (Termination)」。Paxos 與 Raft 透過引入部分同步假設（如隨機超時 Election Timeout、網路最終會恢復同步）與安全性 (Safety) 絕對優先原則，在實際工業界達成了 99.999% 的穩態收斂。',
      },
    ],
    classicReferences: [
      {
        title: 'Time, Clocks, and the Ordering of Events in a Distributed System',
        author: 'Leslie Lamport (1978)',
        significance: '電腦科學史上被引用最多的論文之一，奠定邏輯時鐘與分散式因果序基礎。',
      },
    ],
  },
  {
    id: 'cs-ch-6',
    chapterNumber: 6,
    title: '現代 AI 算力加速晶片與記憶體子系統',
    englishTitle: 'Modern AI Hardware Accelerators & Memory Subsystems',
    strand: '現代AI硬體',
    readingTimeMinutes: 30,
    prerequisites: ['矩陣乘法基礎', '電腦記憶體階層', 'GPU 概念'],
    historicalContext: {
      era: '2012 ~ 現代',
      keyFigures: ['黃仁勳 (Jensen Huang)', '諾曼·喬皮 (Norman Jouppi)', '崔·道 (Tri Dao)'],
      coreMotivation: '2012 年 AlexNet 掀起深度學習革命，巨量多層類神經網路的矩陣乘法 (GEMM) 讓傳統 CPU 吞吐嚴重不足。如何設計專用硬體在晶片上每秒執行數百兆次低精度矩陣乘累加？',
      breakthroughStory: 'NVIDIA 押注 CUDA 並研發專用張量核心 (Tensor Core) 與 NVSwitch；Google 研發 TPU 脈動陣列；2022 年 Tri Dao 提出 FlashAttention，透過 SRAM Tiling 演算法打破 HBM 記憶體牆，奠定了生成式 AI 時代的底層晶片與算子架構。',
    },
    firstPrinciples: {
      summary: '深度學習算力的本質是「記憶體頻寬受限 (Memory-Bound)」與「計算吞吐受限 (Compute-Bound)」的 Roofline 模型博弈。算子優化的終極追求是最大化數據重用 (Data Reuse) 並將中間結果鎖在晶上高速 SRAM 中。',
      mathematicalDerivations: [
        {
          topic: 'Roofline 運算強度模型 (Arithmetic Intensity)',
          formula: 'I = \\frac{\\text{FLOPs}}{\\text{DRAM Bytes}}, \\quad P_{\\text{attainable}} = \\min(P_{\\text{peak}}, I \\times \\text{BW}_{\\text{mem}})',
          explanation: '當算子運算強度低於晶片拐點時，性能嚴格受顯存頻寬掐脖子；高於拐點時才能完全發揮 Tensor Core 峰值算力。',
        },
        {
          topic: 'FlashAttention SRAM Tiling 分塊推導',
          formula: '\\mathbf{S}_{i,j} = \\mathbf{Q}_i \\mathbf{K}_j^T, \\quad m_i^{\\text{new}} = \\max(m_i^{\\text{old}}, \\max(\\mathbf{S}_{i,j})), \\quad \\mathbf{O}_i = \\text{OnlineSoftmax}(\\mathbf{S}_{i,j}, \\mathbf{V}_j)',
          explanation: '利用 Online Softmax 的統計量動態縮放特性，在 256KB 晶上極速 SRAM 完成 Softmax 分塊計算，完全消滅了 N x N 注意力中間矩陣向慢速 HBM 的反覆寫入。',
        },
      ],
    },
    architecturalDeepDive: {
      sectionTitle: '本地端 AI PC (RTX 5080 + 96GB RAM) 與資料中心叢集微架構全景',
      content: '現代 AI 運算硬體存在清晰的兩種工程型態：其一是「個人高階 AI PC / 本地端工作站」（以桌面多核心 CPU + 96GB 高容量 DDR5 系統主存 + PCIe Gen5 x16 直連 NVIDIA GeForce RTX 5080 16GB GDDR7，透過 Ollama 達成零資料外洩的本地端極速推論）；其二是「資料中心雲端超級伺服器」（以 1TB~2TB 伺服器 ECC RAM + 8 顆 H100/B200 透過專用 NVSwitch 網格達成 900 GB/s 以上 All-to-All 互聯）。絕不可將 PC 的 96GB 記憶體誤套在伺服器上，亦不可將只有機架式伺服器專屬的 NVSwitch 妄加於消費級 PC 之上。',
      keySubsystems: [
        {
          name: '第 5 代 Blackwell Tensor Core (RTX 5080)',
          role: '本地端極速低精度乘累加',
          technicalMechanism: '單晶片支援 FP8 (E4M3/E5M2) 與次世代 FP4 硬體矩陣運算，搭配 16GB GDDR7 (~1.0 TB/s 顯存頻寬)，為 8B~14B 規模模型提供滿速即時推論。',
        },
        {
          name: 'PCIe Gen5 x16 匯流排與 96GB DDR5 混和卸載',
          role: '突破 16GB 顯存牆之主存擴展',
          technicalMechanism: '以 64 GB/s 單向 (128 GB/s 雙向) 高速 PCIe 頻寬，將 70B 等超大模型以 Q4/Q8 分層卸載至 96GB DDR5 系統主存，兼顧本地運行能力與低延遲。',
        },
        {
          name: '資料中心專用 NVSwitch 網格拓撲 (伺服器專屬對比)',
          role: '雲端超巨模型張量平行 (TP)',
          technicalMechanism: '專屬於 DGX/HGX 多卡機架，以 900 GB/s~1.8 TB/s 專用交換晶片消滅跨卡 All-Reduce 通訊瓶頸，需搭配 1TB~2TB 伺服器級 ECC 記憶體支撐。',
        },
      ],
    },
    industrialCaseStudies: [
      {
        companyOrProject: '本地端 AI 邊緣工作站 (Local AI PC)',
        systemName: 'RTX 5080 + 96GB DDR5 + Ollama 推論棧',
        appliedSolution: '以本機端 Ollama 服務端點 (http://localhost:11434) 為核心，模型權重常駐 16GB GDDR7 與 96GB DDR5，實現無 API 延遲、零隱私洩漏、具備 torch.cuda.empty_cache() 動態保護的高效推論。',
      },
      {
        companyOrProject: 'NVIDIA Enterprise',
        systemName: 'DGX H100/B200 超級伺服器叢集',
        appliedSolution: '配備 2TB 系統記憶體與 8 張 SXM 封裝 GPU，透過主機板內嵌之 4 顆 NVSwitch 晶片實現 3.2 Tbps 雙向對等穿透，專供千億參數預訓練。',
      },
    ],
    deepThinkingQuestions: [
      {
        question: '既然大模型生成時最大的瓶頸是顯存頻寬而非算力，為什麼我們不乾脆製造一顆擁有 100GB 晶上 SRAM 的晶片？',
        philosophicalAnalysis: '這是半導體矽晶圓面積與缺陷率的物理鐵律：SRAM 每個位元需要 6 個電晶體 (6T)，佔用面積是 DRAM 的數十倍；100GB SRAM 晶粒面積將超過整張 300mm 晶圓，良率趨近於零，這推動了 2.5D/3D Chiplet 異質封裝與 HBM 垂直堆疊技術的蓬勃發展。',
      },
    ],
    classicReferences: [
      {
        title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness',
        author: 'Tri Dao, Daniel Y. Fu, Stefano Ermon, Atri Rudra, Christopher Ré (NeurIPS 2022)',
        significance: '改變現代大模型架構的算子融合神作，開創硬體感知演算法設計新時代。',
      },
    ],
  },
  {
    id: 'cs-ch-7',
    chapterNumber: 7,
    title: '前沿人工智慧與大語言模型演化體系',
    englishTitle: 'Frontier AI & Large Language Model Evolutionary Architectures',
    strand: '前沿AI演算法',
    readingTimeMinutes: 35,
    prerequisites: ['線性代數與微積分', '類神經網路反向傳播', '自注意力基礎'],
    historicalContext: {
      era: '2017 ~ 現代',
      keyFigures: ['阿席許·瓦斯瓦尼 (Ashish Vaswani)', '伊利亞·蘇茨克維 (Ilya Sutskever)', '阿爾伯特·顧 (Albert Gu)'],
      coreMotivation: '循環神經網路 (RNN / LSTM) 的序列串行依賴限制了平行運算能力，且長程上下文記憶劇烈衰減。如何設計一種能夠全局並行計算且直接建立任意兩點關聯的新架構？',
      breakthroughStory: '2017 年 Google 發表《Attention Is All You Need》，以純自注意力機制取代循環網路；隨後 GPT 系列證明了藉由自回歸預訓練與規模縮放法則 (Scaling Laws)，大模型能湧現出驚人的推理能力；2023 年後，Mamba 選擇性狀態空間模型、RoPE 長文本外推、GRPO 強化學習自我進化更將 AI 推進至自主思考與推理的新紀元。',
    },
    firstPrinciples: {
      summary: '大語言模型本質是下一個 Token 的條件機率分佈建模器 P(w_t | w_<t)。自注意力機制透過動態計算特徵空間的幾何相似度實現上下文動態路由；而長鏈思考 (CoT) 與強化學習則引導模型探索龐大解空間的邏輯路徑。',
      mathematicalDerivations: [
        {
          topic: '縮放點積注意力 (Scaled Dot-Product Attention)',
          formula: '\\text{Attention}(\\mathbf{Q}, \\mathbf{K}, \\mathbf{V}) = \\text{softmax}\\left(\\frac{\\mathbf{Q} \\mathbf{K}^T}{\\sqrt{d_k}}\\right) \\mathbf{V}',
          explanation: '除以根號 d_k 防止內積過大導致 Softmax 進入飽和梯度消失區；Q 和 K 的點積度量了語意相關度，加權求和 V 實現了知識聚合。',
        },
        {
          topic: '旋轉位置嵌入 (RoPE Relative Invariance)',
          formula: '\\langle R_{\\Theta, m}^d \\mathbf{q}, R_{\\Theta, n}^d \\mathbf{k} \\rangle = \\mathbf{q}^T R_{\\Theta, n-m}^d \\mathbf{k}',
          explanation: '將向量投影至複平面二維子空間旋轉，嚴格證明了內積僅由相對距離 (m - n) 決定，賦予模型長文本外推理論基礎。',
        },
        {
          topic: 'GRPO 組相對策略優化目標 (Group Relative Policy Optimization)',
          formula: '\\mathcal{J}_{\\text{GRPO}}(\\theta) = \\mathbb{E}_{q \\sim P, \\{o_i\\} \\sim \\pi_\\theta} \\left[ \\frac{1}{G} \\sum_{i=1}^G \\left( \\min\\left(\\frac{\\pi_\\theta}{\\pi_{\\text{old}}} A_i, \\text{clip}\\left(\\frac{\\pi_\\theta}{\\pi_{\\text{old}}}, 1-\\epsilon, 1+\\epsilon\\right) A_i\\right) - \\beta D_{\\text{KL}}(\\pi_\\theta \\parallel \\pi_{\\text{ref}}) \\right) \\right]',
          explanation: '徹底剔除單獨的 Critic 模型，對於同一個提示生成 G 個候選回答，直接以組內獎勵的均值與標準差歸一化計算優勢值 A_i，顯存減半並穩定激發長鏈推理。',
        },
      ],
    },
    architecturalDeepDive: {
      sectionTitle: '從 Transformer 到 Mamba 選擇性狀態空間與多代理蜂群體系',
      content: 'AI 演算法正朝向長文本、低推論成本與自主自我糾錯的多智能體系統 (Multi-Agent Hive) 迅速演進。',
      keySubsystems: [
        {
          name: '分組查詢注意力 (GQA) 與 PagedAttention',
          role: '推論顯存壓縮',
          technicalMechanism: '8 個 Query 頭共享 1 組 KV 頭，配合虛擬分頁消除顯存碎片，長文本生成吞吐提升數倍。',
        },
        {
          name: 'Mamba 選擇性狀態空間 (Selective SSM)',
          role: '線性複雜度 O(N) 序列處理',
          technicalMechanism: '矩陣參數隨當前 Token 動態時變，結合硬體感知關聯前綴掃描，實現無 KV Cache 的恆定推論開銷。',
        },
        {
          name: 'Hive 多智能體協同迴圈架構 (Loop Engineering)',
          role: '自主反思與形式化驗證',
          technicalMechanism: '透過 Plan ➜ Execute ➜ Observe ➜ Refine 閉環，多個專門代理人分工評審，跨越單一模型幻覺陷阱。',
        },
      ],
    },
    industrialCaseStudies: [
      {
        companyOrProject: 'OpenAI / Anthropic / DeepSeek',
        systemName: '新一代深度推理模型 (o1 / R1)',
        appliedSolution: '透過大尺度強化學習在測試時增加推理算力 (Test-time Compute)，激發長鏈思考 (Chain-of-Thought) 與自我糾錯，在數學競賽與程式碼合成領域超越人類專家。',
      },
    ],
    deepThinkingQuestions: [
      {
        question: '語言模型僅僅是在統計規律下預測下一個 Token，這是否意味著它永遠不具備真正的「世界模型 (World Model)」與「理解能力」？',
        philosophicalAnalysis: '哲學家約翰·瑟爾曾以「中文房間 (Chinese Room)」質疑純符號操縱的非理解性；然而現代深度學習證實：要在多模態與高維語意空間中精確預測下一個詞，神經網路內部必然被迫在潛在特徵中壓縮並構建出外部物理世界的高階因果模型。預測即壓縮，壓縮即理解。',
      },
    ],
    classicReferences: [
      {
        title: 'Attention Is All You Need',
        author: 'Ashish Vaswani et al. (NeurIPS 2017)',
        significance: '開啟生成式 AI 狂潮與 Transformer 盛世的歷史里程碑論文。',
      },
      {
        title: 'Mamba: Linear-Time Sequence Modeling with Selective State Spaces',
        author: 'Albert Gu & Tri Dao (2023)',
        significance: '挑戰 Transformer 霸主地位的狀態空間新架構經典論文。',
      },
    ],
  },
]

describe('教科書知識巨著數據驗證單元測試', () => {
  it('7 大章節涵蓋計算機科學完整體系且內容充實嚴謹', () => {
    expect(CS_TEXTBOOK_CHAPTERS.length).toBe(7)
    for (const ch of CS_TEXTBOOK_CHAPTERS) {
      expect(ch.title).toBeTruthy()
      expect(ch.historicalContext.keyFigures.length).toBeGreaterThanOrEqual(2)
      expect(ch.firstPrinciples.mathematicalDerivations.length).toBeGreaterThanOrEqual(2)
      expect(ch.architecturalDeepDive.keySubsystems.length).toBeGreaterThanOrEqual(3)
      expect(ch.industrialCaseStudies.length).toBeGreaterThanOrEqual(1)
      expect(ch.deepThinkingQuestions.length).toBeGreaterThanOrEqual(1)
      expect(ch.classicReferences.length).toBeGreaterThanOrEqual(1)
    }
  })
})
