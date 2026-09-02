/**
 * 計算機概論核心課綱資料庫 (Computer Science Curriculum Data)
 * 涵蓋從軟硬體本質定義、系統抽象階層，延伸至馮紐曼五大功能單元（CU, ALU, MU, IU, OU）、
 * 數位邏輯與二補數、作業系統核心排程、電腦網路與 TCP/IP，
 * 直至當代最前沿 AI 運算架構（GPU 平行加速、TPU 脈動陣列、NPU 邊緣推論、Transformer 自注意力機制與 LLM KV Cache 量化）。
 */

export interface CsQuestion {
  id: string
  title: string
  question: string
  options?: string[]
  answer: string | number
  solution: string[]
  explanation: string
  difficulty: 1 | 2 | 3 | 4 | 5
  tags: string[]
  type?: 'single-choice' | 'calculation'
}

export interface CsUnit {
  id: string
  title: string
  subtitle: string
  strand: '軟硬體本質' | '五大單元架構' | '數位邏輯' | '作業系統' | '網路與通訊' | '現代AI硬體' | '前沿AI演算法'
  band: '基礎核心' | '系統架構' | '前沿AI'
  concepts: string[]
  suggestedLab?: string
  questions: CsQuestion[]
}

export const CS_CURRICULUM: CsUnit[] = [
  {
    id: 'cs-unit-1-foundation',
    title: '單元 1：軟體與硬體之本質定義與電腦系統階層',
    subtitle: 'Abstraction Layers, System Software & Computer Architecture',
    strand: '軟硬體本質',
    band: '基礎核心',
    concepts: [
      '硬體 (Hardware)：指看得見、摸得著之實體電子電路晶片、主機板、電晶體與介面設備，提供運算與訊號儲存的物理基石。',
      '軟體 (Software)：指指導硬體執行特定任務的指令序列與資料架構；分為「系統軟體 (OS, 編譯器, 設備驅動)」與「應用軟體 (網頁瀏覽器, 辦公套件, AI Agent)」。',
      '電腦系統抽象階層 (Abstraction Layers)：應用程式 ➜ 演算法與高階語言 ➜ 編譯器/直譯器 ➜ 指令集架構 (ISA: x86-64, ARM, RISC-V) ➜ 微架構 (Microarchitecture: 管線化流水線) ➜ 數位邏輯閘 ➜ CMOS 電晶體物理層。',
      '編譯器 (Compiler) vs 直譯器 (Interpreter)：編譯器預先將源代碼一次性翻譯為目標機器碼執行（高執行效率，如 C/C++, Rust）；直譯器則逐行讀取、解碼並即時執行（除錯直觀靈活，如 Python, JavaScript）。',
    ],
    suggestedLab: 'von-neumann',
    questions: [
      {
        id: 'cs-q-101',
        title: '軟硬體本質與系統抽象階層',
        question: '在現代計算機階層結構中，直接介於「高階語言編譯器生成的機器代碼」與「CPU 微架構晶片內部實體電路」之間的關鍵合約介面是什麼？',
        options: [
          '作業系統核心 (Kernel)',
          '指令集架構 (Instruction Set Architecture, ISA)',
          '圖形使用者介面 (GUI)',
          '動態隨機存取記憶體 (DRAM)',
        ],
        answer: 1,
        solution: [
          '第一步：理解計算機抽象層次。高階程式語言經編譯後產生機器指令。',
          '第二步：ISA（如 x86-64、ARM64、RISC-V）是軟體與硬體間的正式合約，定義了 CPU 能執行的指令格式、暫存器數量與定址模式。',
          '第三步：CPU 硬體設計師依據 ISA 來實作內部的微架構（管線、分支出題預測、執行單元）。因此介於其間者為 ISA。',
        ],
        explanation: '指令集架構 (ISA) 是軟體程序員/編譯器與底層實體 CPU 硬體電路之間的抽象邊界合約。',
        difficulty: 2,
        tags: ['系統抽象階層', 'ISA', '軟硬體介面'],
        type: 'single-choice',
      },
      {
        id: 'cs-q-102',
        title: '編譯與直譯執行機制比較',
        question: '關於編譯器 (Compiler) 與直譯器 (Interpreter) 的運作機制與特性比較，下列敘述何者最精確正確？',
        options: [
          '直譯器會將全部程式碼一次性編譯生成獨立可執行的二進位檔案 (.exe)，啟動延遲最大',
          '編譯型語言在執行階段不再需要原始碼編譯器常駐，直接由硬體 CPU 執行機器碼，執行速度通常顯著快於直譯型語言',
          'Python 與 JavaScript 絕對無法透過 JIT (Just-In-Time) 技術進行任何機器碼動態編譯',
          '編譯型語言只要編譯一次，產生的二進制機器碼就能未經修改在 x86 與 ARM 架構間自由無縫執行',
        ],
        answer: 1,
        solution: [
          '第一步：編譯器在執行前即將原始程式碼轉換為目標機器架構的二進位機器指令。',
          '第二步：編譯生成的原生執行檔執行時直接由 CPU 處理，無直譯解碼開銷，故速度遠勝逐行直譯。',
          '第三步：編譯出的二進制檔綁定特定 ISA，不能直接跨架構運行；現代直譯語言普遍採用 JIT 加速。因此選項 B 最為正確。',
        ],
        explanation: '編譯型語言在建置期直接生成目標 ISA 的二進位檔案，執行時享有極高硬體吞吐量與低延遲。',
        difficulty: 2,
        tags: ['編譯器', '直譯器', '執行效能'],
        type: 'single-choice',
      },
      {
        id: 'cs-q-103',
        title: 'RISC 與 CISC 控制器設計哲學比較',
        question: '關於精簡指令集 (RISC) 與複雜指令集 (CISC) 之微架構與控制單元實作比較，下列何者完全正確？',
        options: [
          'CISC 通常採用硬連線控制邏輯 (Hardwired Control)，指令長度固定且執行週期單一',
          'RISC 強調指令長度固定、簡化定址模式，通常採用硬連線邏輯以最大化管線化效率，訪存僅限 Load/Store 指令',
          'RISC 架構下的一條機器指令可以直接從記憶體讀取兩個操作數進行相加並寫回記憶體',
          '現代 x86 處理器內部直接以 CISC 純量循序執行，絕不轉譯為微操作 (micro-ops)',
        ],
        answer: 1,
        solution: [
          '第一步：RISC（如 ARM、RISC-V）核心原則為指令等長、大量暫存器、Load/Store 架構（僅 Load/Store 可存取記憶體，運算指令只能操作暫存器）。',
          '第二步：RISC 採用硬連線邏輯 (Hardwired) 以支援單週期與管線化流暢執行；CISC 傳統依賴微程式控制 (Microprogrammed Control)。',
          '第三步：現代 x86 內部在解碼階段會將 CISC 指令拆解為類似 RISC 的微操作 (μ-ops) 以利管線執行。因此選項 B 完全正確。',
        ],
        explanation: 'RISC 透過固定指令長度、Load/Store 架構與硬連線控制，大幅提升了處理器的指令管線化執行效能。',
        difficulty: 3,
        tags: ['RISC', 'CISC', '硬連線控制', 'Load-Store架構'],
        type: 'single-choice',
      },
    ],
  },
  {
    id: 'cs-unit-2-von-neumann',
    title: '單元 2：馮紐曼架構與電腦傳統五大功能單元',
    subtitle: 'The 5 Units: CU, ALU, Memory, Input, Output & Bus',
    strand: '五大單元架構',
    band: '系統架構',
    concepts: [
      '馮紐曼架構核心定理 (Von Neumann Model)：基於「儲存程式概念 (Stored-Program Concept)」，程式指令與運算資料儲存在同一個連續編址的記憶體空間中，由 CPU 循序擷取執行。',
      '控制單元 (Control Unit, CU)：電腦的中樞神經，指揮協調所有硬體動作。執行「機器指令週期 (Instruction Cycle)」：取指 (Fetch) ➜ 解碼 (Decode) ➜ 執行 (Execute) ➜ 寫回 (Writeback)。關鍵暫存器包含程式計數器 (PC) 與指令暫存器 (IR)。',
      '算術邏輯單元 (Arithmetic Logic Unit, ALU)：執行所有二進位算術加減乘除、邏輯運算 (AND, OR, NOT, XOR) 與位移操作，並更新條件狀態旗標 (Zero, Carry, Overflow, Negative)。',
      '記憶體單元 (Memory Unit, MU)：階層式記憶架構 (Memory Hierarchy)。暫存器 (Registers, <1ns) ➜ 快取 (L1/L2/L3 Cache, 1~10ns) ➜ 主記憶體 (RAM: SRAM/DRAM, 50~100ns) ➜ 輔助儲存體 (NVMe SSD/HDD, 10μs~10ms)。',
      '輸入與輸出單元 (IU & OU)：輸入單元（鍵盤、滑鼠、感測器、麥克風 ADC）接收外部訊號；輸出單元（螢幕 GPU Framebuffer、音訊 DAC、印表機）將運算結果傳遞給人類或外界。',
      '系統匯流排 (System Bus) 與馮紐曼瓶頸 (Von Neumann Bottleneck)：由控制匯流排、位址匯流排 ($2^k$ 位址空間) 與資料匯流排組成。由於 CPU 運算速度成長幅度遠超 CPU-RAM 匯流排資料傳輸頻寬，產生了嚴重的記憶體存取瓶頸。',
    ],
    suggestedLab: 'von-neumann',
    questions: [
      {
        id: 'cs-q-201',
        title: '馮紐曼機器週期與暫存器功能',
        question: '在 CPU 執行指令的「取指 (Instruction Fetch)」階段，哪一個暫存器存放著「下一條即將被執行的指令在主記憶體中的位址」？',
        options: [
          '指令暫存器 (Instruction Register, IR)',
          '程式計數器 (Program Counter, PC)',
          '記憶體緩衝暫存器 (Memory Buffer Register, MBR)',
          '累加器 (Accumulator, ACC)',
        ],
        answer: 1,
        solution: [
          '第一步：檢驗各核心暫存器之功能。',
          '第二步：程式計數器 (PC) 專門儲存下一條欲擷取執行的指令之記憶體位址，每取出一條指令後，PC 通常自動遞增或依跳躍指令改寫。',
          '第三步：指令暫存器 (IR) 則是存放「當前正在被解碼與執行的指令機器碼」。因此正解為 PC。',
        ],
        explanation: '程式計數器 (Program Counter, PC) 負責追蹤並指向下一條即將執行的指令記憶體位址。',
        difficulty: 2,
        tags: ['五大單元', '控制單元', '暫存器', '機器週期'],
        type: 'single-choice',
      },
      {
        id: 'cs-q-202',
        title: '快取記憶體命中率與 AMAT 精算',
        question: '某高效能伺服器 CPU 的 L1 快取存取時間為 $1.0\\text{ ns}$，主記憶體存取懲罰時間為 $50\\text{ ns}$。若該程式的 L1 快取命中率 (Hit Rate) 達到 $96\\%$，則平均記憶體存取時間 (AMAT) 為何？',
        options: [
          '1.5 ns',
          '3.0 ns',
          '2.0 ns',
          '4.5 ns',
        ],
        answer: 1,
        solution: [
          '第一步：寫出平均記憶體存取時間公式：$\\text{AMAT} = \\text{Hit Time} + \\text{Miss Rate} \\times \\text{Miss Penalty}$。',
          '第二步：命中率 $H = 96\\% = 0.96$，故未命中率 (Miss Rate) $M = 1 - 0.96 = 0.04$ ($4\\%$)。',
          '第三步：代入數值：$\\text{AMAT} = 1.0\\text{ ns} + (0.04 \\times 50\\text{ ns}) = 1.0\\text{ ns} + 2.0\\text{ ns} = 3.0\\text{ ns}$。',
        ],
        explanation: 'AMAT = Hit Time + (Miss Rate × Miss Penalty) = 1.0 + 0.04 × 50 = 3.0 ns。',
        difficulty: 3,
        tags: ['記憶體階層', 'AMAT', '快取命中率'],
        type: 'single-choice',
      },
      {
        id: 'cs-q-203',
        title: '多體記憶體低位交叉編址 (Low-Order Interleaving)',
        question: '一個包含 4 個獨立記憶體模組 (Banks) 的系統採用「低位交叉編址 (Low-Order Interleaving)」。若 CPU 需要循序存取位址 0, 1, 2, 3，該架構能如何提升頻寬？',
        options: [
          '4 個連續位址全部映射在同一個模組中，必須嚴格排隊等待 4 次記憶體週期',
          '連續位址循序分散在 Bank 0, 1, 2, 3，可管線化重疊平行啟動存取，吞吐量提升逼近 4 倍',
          '低位交叉會使匯流排產生嚴重的結構冒險，性能反而下降',
          '只能提高記憶體容量，對資料傳輸頻寬與延遲完全沒有任何改善效果',
        ],
        answer: 1,
        solution: [
          '第一步：低位交叉編址將記憶體位址的最低 $k$ 位元作為 Bank 選擇信號（$2^k = 4 \\implies k = 2$ bits）。',
          '第二步：位址 0 (00), 1 (01), 2 (10), 3 (11) 分別落入 Bank 0, 1, 2, 3。',
          '第三步：當存取位址 0 時，Bank 1, 2, 3 已可並行預取，隱藏了 DRAM 預充電與讀取延遲，使連續資料傳輸率達到單一模組的近 4 倍。',
        ],
        explanation: '低位交叉編址利用位址最低位元輪詢模組，使循序訪存能跨 Bank 平行重疊展開，極大化記憶體頻寬。',
        difficulty: 3,
        tags: ['記憶體架構', '交錯編址', 'Memory Interleaving'],
        type: 'single-choice',
      },
    ],
  },
  {
    id: 'cs-unit-3-digital-logic',
    title: '單元 3：資料表示法、二補數與數位邏輯電路',
    subtitle: 'Binary, Two\'s Complement, Logic Gates & Adders',
    strand: '數位邏輯',
    band: '基礎核心',
    concepts: [
      '二進位、八進位與十六進位進制基底轉換法。',
      '二補數 (Two\'s Complement) 系統：將二進位數所有位元反相 (Invert) 再加 1。徹底解決 0 具有 $+0$ 與 $-0$ 的重複歧異，且使二進位減法運算能直接複用加法器電路：$A - B = A + (-B)$。',
      '8 位元帶號整數範圍：$-128 \\sim +127$（$-2^{n-1} \\sim 2^{n-1}-1$）。',
      '溢位 (Overflow) 判別：當兩個同號數相加，結果符號與運算元相反時發生溢位；由最高進位輸入與輸出決定：$V = C_{\\text{in}} \\oplus C_{\\text{out}}$。',
      '基本邏輯閘與萬用閘：AND, OR, NOT, XOR ($A \\oplus B = A\\bar{B} + \\bar{A}B$)。NAND 與 NOR 為「萬用邏輯閘 (Universal Gates)」，單憑 NAND 即可組合成任意布林邏輯電路。',
    ],
    suggestedLab: 'von-neumann',
    questions: [
      {
        id: 'cs-q-301',
        title: '8 位元二補數負數編碼',
        question: '在 8 位元有號數二補數 (Two\'s Complement) 系統中，十進位整數 $-43$ 的二進位編碼為何？',
        options: [
          '11010101',
          '10101011',
          '11001011',
          '11010100',
        ],
        answer: 0,
        solution: [
          '第一步：先求 $+43$ 的 8 位元正二進位表示。$43 = 32 + 8 + 2 + 1 = 00101011_2$。',
          '第二步：將所有位元反轉 (一補數)：$11010100_2$。',
          '第三步：將一補數加 1 (二補數)：$11010100_2 + 1 = 11010101_2$。',
        ],
        explanation: '+43 為 00101011，反相得 11010100，加 1 得 11010101。',
        difficulty: 3,
        tags: ['二補數', '資料表示法', '負數編碼'],
        type: 'single-choice',
      },
      {
        id: 'cs-q-303',
        title: '漢明碼 (Hamming Code) 同位檢查位元數計算',
        question: '若要對長度為 $8\\text{ 位元}$ 的資料 ($m = 8$) 加入漢明碼同位檢查位元 ($r$) 以實現單一錯誤更正 (Single Error Correction, SEC)，最少需要幾個同位檢查位元？',
        options: [
          '3 個位元',
          '4 個位元',
          '5 個位元',
          '2 個位元',
        ],
        answer: 1,
        solution: [
          '第一步：漢明碼滿足不等式 $2^r \\ge m + r + 1$，其中 $m = 8$ 為資料位元數，$r$ 為同位校驗位元數。',
          '第二步：若 $r = 3$：$2^3 = 8 < 8 + 3 + 1 = 12$ (不成立)。',
          '第三步：若 $r = 4$：$2^4 = 16 \\ge 8 + 4 + 1 = 13$ (成立！)。因此最少需要 4 個檢查位元，總長度為 12 位元。',
        ],
        explanation: '依據漢明不等式 2^r >= m + r + 1，當 m=8 時，r 最少為 4 (16 >= 13)。',
        difficulty: 3,
        tags: ['錯誤偵測與更正', '漢明碼', 'Hamming Code'],
        type: 'single-choice',
      },
    ],
  },
  {
    id: 'cs-unit-4-operating-systems',
    title: '單元 4：作業系統核心、行程排程與記憶體管理',
    subtitle: 'Kernel, Scheduling Algorithms, Deadlocks & Paging',
    strand: '作業系統',
    band: '系統架構',
    concepts: [
      '行程 (Process) vs 執行緒 (Thread)：行程是資源分配的基本單位，擁有獨立虛擬記憶體空間；執行緒是 CPU 排程與執行的基本單位，同一行程內各執行緒共享代碼段、資料段與開檔描述子，但各自擁有獨立程式計數器與呼叫堆疊 (Stack)。',
      'CPU 排程演算法 (Scheduling)：FCFS (先到先服務)、SJF (最短工作優先，理論平均等待時間最短但有飢餓風險)、Round Robin (時間片輪轉，具搶佔性，適合分時系統)。',
      '死結 (Deadlock) 四大必要條件 (Coffman Conditions)：1. 互斥 (Mutual Exclusion)；2. 持有並等待 (Hold and Wait)；3. 不可搶奪 (No Preemption)；4. 循環等待 (Circular Wait)。四大條件同時成立才會發生死結。',
      '虛擬記憶體與分頁機制 (Paging)：透過分頁表 (Page Table) 與轉譯後備緩衝區 (TLB 快表) 將邏輯位址轉譯為實體位址。若存取未載入實體 RAM 的分頁，觸發分頁缺失中斷 (Page Fault Interrupt)，由 OS 載入並使用 LRU 等演算法置換。',
    ],
    suggestedLab: 'von-neumann',
    questions: [
      {
        id: 'cs-q-401',
        title: '作業系統死結四大必要條件',
        question: '關於作業系統產生死結 (Deadlock) 的四大必要條件（Coffman Conditions），下列何者不屬於這四項必要條件之一？',
        options: [
          '互斥條件 (Mutual Exclusion)',
          '不可搶奪條件 (No Preemption)',
          '動態優先權反轉 (Dynamic Priority Inversion)',
          '循環等待條件 (Circular Wait)',
        ],
        answer: 2,
        solution: [
          '第一步：回顧作業系統經典死結四大必要條件 (Coffman Conditions)：互斥 (Mutual Exclusion)、持有並等待 (Hold and Wait)、不可搶奪 (No Preemption)、循環等待 (Circular Wait)。',
          '第二步：優先權反轉 (Priority Inversion) 是即時作業系統中低優先權行程佔用鎖導致高優先權行程延遲的同步現象，並非死結的必要條件。',
        ],
        explanation: '死結四大必要條件為互斥、持有並等待、不可搶奪與循環等待。優先權反轉非死結必要條件。',
        difficulty: 2,
        tags: ['作業系統', '死結', '行程同步'],
        type: 'single-choice',
      },
      {
        id: 'cs-q-402',
        title: '分頁置換與貝拉迪異常 (Belady\'s Anomaly)',
        question: '關於虛擬記憶體分頁置換演算法之特性，當分配給行程的實體頁框數增加時，分頁缺失次數反而可能增加的現象稱為「貝拉迪異常」。下列哪一個演算法理論上絕不會發生貝拉迪異常？',
        options: [
          '先進先出演算法 (FIFO)',
          '最少最近使用演算法 (LRU)',
          '隨機置換演算法 (Random)',
          '第二次機會演算法 (Second-Chance FIFO)',
        ],
        answer: 1,
        solution: [
          '第一步：貝拉迪異常 (Belady\'s Anomaly) 指在 FIFO 等佇列式演算法中，增加實體頁框數反而導致分頁缺失增加。',
          '第二步：屬於堆疊演算法 (Stack Algorithm) 的置換策略（如 LRU、Optimal），在 $n$ 個頁框中的分頁集合永遠是 $n+1$ 個頁框分頁集合的子集。',
          '第三步：因此 LRU 具備嚴格的包含性，理論上絕對不會發生貝拉迪異常。',
        ],
        explanation: 'LRU 屬於堆疊演算法 (Stack Algorithm)，保證增加頁框數分頁缺失單調不增，絕不發生貝拉迪異常。',
        difficulty: 3,
        tags: ['虛擬記憶體', 'LRU', '貝拉迪異常', '分頁置換'],
        type: 'single-choice',
      },
      {
        id: 'cs-q-403',
        title: '銀行家演算法 (Banker\'s Algorithm) 死結避免',
        question: '作業系統採用銀行家演算法 (Banker\'s Algorithm) 進行資源配置時，系統處於「安全狀態 (Safe State)」的充要意義為何？',
        options: [
          '系統目前沒有任何行程在等待任何資源，資源利用率達到 100%',
          '系統存在至少一個進程執行安全序列 (Safe Sequence)，可保證所有行程最終都能獲得所需最大資源並順利完成',
          '系統已經發生死結，但作業系統具備自動重啟與復原能力',
          '所有行程都處於就緒狀態 (Ready State)，無需任何互斥鎖',
        ],
        answer: 1,
        solution: [
          '第一步：銀行家演算法是死結避免 (Deadlock Avoidance) 的代表性演算法。',
          '第二步：安全狀態定義為：系統能找到一個行程序列 $\\langle P_1, P_2, \\dots, P_n \\rangle$，使得對每個 $P_i$，其仍需要的資源數小於等於當前可用資源加上先前所有行程釋放的資源。',
          '第三步：只要存在安全序列，系統就能避免死結，故選項 B 完全正確。',
        ],
        explanation: '安全狀態代表系統存在至少一個安全執行序列，能保證所有行程都不會陷入死結而順利結束。',
        difficulty: 3,
        tags: ['作業系統', '死結避免', '銀行家演算法'],
        type: 'single-choice',
      },
    ],
  },
  {
    id: 'cs-unit-5-networking',
    title: '單元 5：電腦網路架構、TCP/IP 與網際網路通訊協定',
    subtitle: 'OSI 7 Layers, TCP 3-Way Handshake, DNS & TLS Security',
    strand: '網路與通訊',
    band: '系統架構',
    concepts: [
      'OSI 七層模型 vs TCP/IP 四層架構：實體層、資料鏈結層 (MAC, 乙太網路)、網路層 (IP, 路由器)、傳輸層 (TCP/UDP, 通訊埠 Port)、應用層 (HTTP, DNS, SSH)。',
      'TCP 連線建立——三向交握 (Three-Way Handshake)：客戶端發送 SYN (seq=x) ➜ 伺服器回送 SYN-ACK (seq=y, ack=x+1) ➜ 客戶端確認 ACK (seq=x+1, ack=y+1)，雙向同步序號，確保可靠端對端傳輸。',
      'TCP vs UDP 傳輸特性對比：TCP 面向連線、提供流量控制、壅塞控制與重傳保證；UDP 無連線、無確認握手開銷、延遲極低，適用於即時串流、線上遊戲與 DNS 查詢。',
      '網域名稱系統 (DNS) 解析階層：本機快取 ➜ 遞迴 DNS 伺服器 ➜ 根網域名稱伺服器 (Root) ➜ 頂級網域名稱伺服器 (TLD: .com, .tw) ➜ 授權權威伺服器 (Authoritative)。',
      'HTTPS 與 TLS 1.3 握手加密：結合非對稱密碼學（RSA / ECC 橢圓曲線金鑰交換）驗證伺服器身分並協商會話密鑰，隨後採用對稱加密（AES-GCM / ChaCha20）進行高吞吐數據加密傳輸。',
    ],
    suggestedLab: 'von-neumann',
    questions: [
      {
        id: 'cs-q-501',
        title: 'TCP 傳輸層三向交握流程',
        question: '在網際網路 TCP 通訊協定建立連線的三向交握 (Three-Way Handshake) 過程中，伺服器在接收到客戶端發出的 SYN 請求後，回傳給客戶端的封包控制旗標與內容為何？',
        options: [
          '僅發送 ACK 封包確認收到，隨後立即開始傳輸應用層數據',
          '同時包含 SYN 與 ACK 旗標的封包 (SYN-ACK)，確認客戶端序號並同步伺服器自身起始序號',
          '直接發送 FIN 封包終止未經身分驗證的握手請求',
          '發送 RST 封包重設通訊端點',
        ],
        answer: 1,
        solution: [
          '第一步：TCP 連線建立的第一步驟是客戶端發送 SYN (Synchronize)。',
          '第二步：伺服器同意連線時，必須同時做兩件事：確認收到客戶端請求 (發送 ACK，確認號 ack = client_seq + 1)，並建立伺服器自身序號發送 SYN (seq = server_seq)。',
          '第三步：故伺服器回傳的是合一的 SYN-ACK 封包。',
        ],
        explanation: 'TCP 第二步回傳 SYN-ACK 封包，同時達成確認客戶端序號與同步伺服端起始序號的目的。',
        difficulty: 2,
        tags: ['電腦網路', 'TCP/IP', '三向交握'],
        type: 'single-choice',
      },
      {
        id: 'cs-q-502',
        title: 'TCP 與 UDP 傳輸層協定本質特性比較',
        question: '針對傳輸層 TCP 與 UDP 協定之特性，下列敘述何者完全符合現代網路架構規範？',
        options: [
          'UDP 提供滑動視窗 (Sliding Window) 機制以實現端對端可靠流量控制',
          'TCP 具備三次交握連線建立、壅塞控制與封包確認重傳機制，適合檔案傳輸 (FTP, HTTP/2)；UDP 無握手開銷且低延遲，廣泛應用於即時語音、線上遊戲與 DNS 查詢',
          'TCP 封包標頭僅有 8 位元組，而 UDP 標頭高達 20 位元組',
          'UDP 傳輸前必須先向目標主機取得 SYN 回應，否則無法發送任何數據',
        ],
        answer: 1,
        solution: [
          '第一步：TCP 是面向連線的可靠傳輸協定，包含三向交握、四次揮手、流量控制與擁塞控制，封包標頭最小 20 Bytes。',
          '第二步：UDP 是無連線的不可靠傳輸協定，無確認握手開銷，標頭僅 8 Bytes，延遲極低。',
          '第三步：因此即時語音、視訊串流與 DNS 優先選用 UDP，而重要數據採用 TCP。選項 B 正確無誤。',
        ],
        explanation: 'TCP 保證可靠傳輸與流量控制；UDP 輕量無握手開銷，專注於極低延遲即時應用。',
        difficulty: 2,
        tags: ['傳輸層', 'TCP', 'UDP', '網路協定'],
        type: 'single-choice',
      },
      {
        id: 'cs-q-503',
        title: '乙太網路 CSMA/CD 最短訊框長度計算',
        question: '傳統乙太網路採用載波感測多重存取/碰撞偵測 (CSMA/CD)。若網路傳輸速率為 $100\\text{ Mbps}$，網路兩端最長單向傳播延遲為 $\\tau = 2.56\\,\\mu\\text{s}$，則為確保傳送端在傳送完畢前能偵測到碰撞，該網路的最短訊框長度 (Minimum Frame Size) 為何？',
        options: [
          '256 位元 (32 Bytes)',
          '512 位元 (64 Bytes)',
          '1024 位元 (128 Bytes)',
          '128 位元 (16 Bytes)',
        ],
        answer: 1,
        solution: [
          '第一步：CSMA/CD 碰撞偵測的最壞情況發生在傳播延遲往返時間 (RTT / 爭用期)，即 $2\\tau$。',
          '第二步：傳送端傳送一個訊框所需時間必須大於等於往返時間：$\\frac{L_{\\min}}{\\text{Bandwidth}} \\ge 2\\tau$。',
          '第三步：計算最短長度：$L_{\\min} = 2\\tau \\times \\text{Bandwidth} = 2 \\times (2.56 \\times 10^{-6}\\,\\text{s}) \\times (100 \\times 10^6\\,\\text{bps}) = 512\\text{ bits} = 64\\text{ Bytes}$。',
        ],
        explanation: 'L_min = 2 * tau * Bandwidth = 2 * 2.56us * 100Mbps = 512 bits = 64 Bytes，正是經典乙太網路 64 Bytes 最短訊框由來。',
        difficulty: 3,
        tags: ['CSMA/CD', '乙太網路', '最短訊框長度', '碰撞偵測'],
        type: 'single-choice',
      },
    ],
  },
  {
    id: 'cs-unit-6-ai-hardware',
    title: '單元 6：現代人工智慧 (AI) 運算架構與加速晶片趨勢',
    subtitle: 'CPU vs GPU, TPU Systolic Arrays, NPU & Local Inference',
    strand: '現代AI硬體',
    band: '前沿AI',
    concepts: [
      '運算範式革命：為什麼傳統 CPU 不適合現代深度學習？CPU 設計側重極低延遲的單執行緒與複雜分支預測；深度學習的核心運算為「巨量矩陣相乘與累加 (General Matrix Multiply, GEMM)」，具有高度資料平行性，正是 GPU 數千核心架構的絕對強項。',
      'GPU 運算本質：SIMD/SIMT (單指令多執行緒) 架構。數千個運算核心搭配極高速顯示記憶體（GDDR6X, HBM3 頻寬高達數 TB/s），專用 Tensor Core 在單個時脈週期內硬體執行 $4 \\times 4$ 矩陣乘加運算 ($D = A \\times B + C$)。',
      '專用 AI 加速晶片 (ASIC)：Google TPU (張量處理單元) 採用「脈動陣列 (Systolic Array)」架構，資料在相鄰處理單元 (PE) 間像心臟脈搏般流動，無需每次運算都重複讀寫主暫存器，大幅降低功耗並提升矩陣吞吐量。NPU (神經處理單元) 則針對智慧手機與邊緣終端提供超低功耗 AI 推論。',
      '本地端 AI 部署與硬體整合最佳化：高規格本機硬體配置（如大容量 96GB 系統記憶體、RTX 5080 16GB VRAM）結合 Ollama 本地端服務 (`http://localhost:11434`)，推論開源大語言模型（如非中系 Llama 3.3, Mistral NeMo 等）。利用模型權重量化 (INT4 / AWQ / GGUF) 將數百億參數模型壓縮進有限顯存中極速推論。',
    ],
    suggestedLab: 'ai-transformer',
    questions: [
      {
        id: 'cs-q-601',
        title: 'CPU 與 GPU 運算架構之本質差異',
        question: '深度學習訓練與推論廣泛依賴 GPU 而非 CPU，其最核心的晶片微架構與運算特性差異為何？',
        options: [
          'CPU 核心數量遠多於 GPU，但時脈頻率過低',
          'GPU 擁有數千個針對高度資料平行運算 (SIMT) 最佳化的小核心與極高記憶體頻寬，特別擅長處理巨量矩陣乘加 (GEMM)',
          'GPU 只支援 64 位元雙精度浮點數，無法執行 16 位元半精度運算',
          'CPU 內部沒有快取記憶體 (Cache)，因此存取延遲比 GPU 慢上萬倍',
        ],
        answer: 1,
        solution: [
          '第一步：深度學習本質是神經網絡權重矩陣與特徵向量的大規模乘加運算 (GEMM)。',
          '第二步：CPU 具備數個極為複雜、快取龐大且擅長單執行緒分支預測的強大核心；而 GPU 具備數千個精簡運算核心，支援 SIMT，配合 Tensor Core 與 HBM/GDDR 高頻寬記憶體，能同時平行計算數萬點矩陣運算。',
        ],
        explanation: 'GPU 具備數千平行核心與專用 Tensor Core，專門針對高吞吐矩陣乘法 (GEMM) 最佳化。',
        difficulty: 3,
        tags: ['AI硬體架構', 'GPU', '矩陣運算', 'GEMM'],
        type: 'single-choice',
      },
      {
        id: 'cs-q-602',
        title: '大模型權重量化與顯存佔用估算',
        question: '一個具有 700 億參數 (70B) 的大語言模型，若採用未經量化的 FP16 (16-bit 浮點數，每參數佔用 2 Bytes) 載入顯存，光權重本身就需要約 $140\\text{ GB}$ 顯存；若將其透過最新量化技術壓縮為 INT4 (4-bit 整數，每參數佔用 0.5 Bytes)，則權重顯存需求約降至多少？',
        options: [
          '約 70 GB',
          '約 35 GB',
          '約 18 GB',
          '約 14 GB',
        ],
        answer: 1,
        solution: [
          '第一步：70B 代表 $70 \\times 10^9$ 個參數。',
          '第二步：INT4 每個參數佔用 4 bits = 0.5 Bytes。',
          '第三步：權重顯存佔用 $= 70\\text{ B} \\times 0.5\\text{ Bytes} = 35\\text{ GB}$。',
          '第四步：相較於 FP16 的 140 GB，顯存需求劇降為四分之一 ($25\\%$)，使得高階個人電腦得以在本機高速推論。',
        ],
        explanation: '70B 參數在 4-bit 量化下佔用 70 × 0.5 Bytes = 35 GB 顯存。',
        difficulty: 3,
        tags: ['模型量化', 'INT4', 'VRAM最佳化', 'LLM推論'],
        type: 'single-choice',
      },
      {
        id: 'cs-q-603',
        title: 'GPU 執行緒束分支發散 (Warp Divergence)',
        question: '在 NVIDIA CUDA GPU 架構中，32 個執行緒組成一個執行緒束 (Warp)。若程式碼中存在條件分支語句 `if (threadIdx.x % 2 == 0) { ... } else { ... }`，對 GPU 執行效率將造成何種影響？',
        options: [
          'GPU 具備 32 組獨立程式計數器，兩條分支可同時以全速平行執行，無任何性能損失',
          '引發執行緒束分支發散 (Warp Divergence)，GPU 必須循序執行 if 與 else 兩個分支，處於另一分支的執行緒將被硬體遮蔽 (Masked)，執行效率減半',
          'GPU 硬體會直接拋出異常中斷並重設顯卡驅動程式',
          '執行緒束會自動合併所有運算，執行時間縮減為原來的一半',
        ],
        answer: 1,
        solution: [
          '第一步：GPU 的 SIMT (單指令多執行緒) 架構中，同一個 Warp 內的 32 個執行緒在同一週期必須執行相同的指令。',
          '第二步：當條件分支導致同一個 Warp 內的執行緒走向不同路徑時（如偶數執行 if、奇數執行 else），硬體無法同時走兩條不同指令流。',
          '第三步：GPU 只能串行化（先執行 if，此時奇數執行緒 inactive 被 mask；再執行 else，偶數執行緒 inactive），使執行時間拉長近一倍。這就是經典的 Warp Divergence。',
        ],
        explanation: 'Warp 內 32 個執行緒共享單一指令流，分支發散迫使硬體循序執行所有分支並遮蔽未選中執行緒，造成顯著效能損失。',
        difficulty: 4,
        tags: ['GPU微架構', 'CUDA', 'Warp Divergence', 'SIMT平行運算'],
        type: 'single-choice',
      },
    ],
  },
  {
    id: 'cs-unit-7-frontier-ai-models',
    title: '單元 7：當代前沿 AI 演算法、Transformer 與大語言模型架構',
    subtitle: 'Self-Attention, KV Cache, Quantization & Hive Multi-Agent',
    strand: '前沿AI演算法',
    band: '前沿AI',
    concepts: [
      '類神經網絡本質：神經元加權總和 $z = \\sum w_i x_i + b$，透過非線性激活函數 (ReLU, GELU, SwiGLU) 賦予網絡擬合任意複雜函數之能力；利用損失函數與反向傳播 (Backpropagation) 配合梯度下降法 (AdamW) 更新權重。',
      'Transformer 革命性架構：徹底揚棄傳統 RNN 循環逐步依賴，實現全長度上下文完全平行化訓練。核心為自注意力機制 (Self-Attention)：$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$。',
      '多頭注意力 (Multi-Head Attention)：將查詢 (Query)、鍵 (Key)、值 (Value) 投射到不同子空間各自計算關聯權重，捕捉語法結構、長程語義與上下文邏輯。',
      'LLM 推論關鍵最佳化——KV Cache (鍵值快取)：在自回歸逐詞生成 (Autoregressive Generation) 時，歷史 token 產生的 Key 與 Value 向量保持不變；將其暫存在顯存中，避免每產出一個新詞就重複計算全部歷史 token，將時間複雜度降至 $O(1)$。',
      '前沿 Multi-Agent 蜂群協同 (Hive Agent Architecture)：將龐大複雜任務分解為多個專責特化代理（研究員、架構師、審查員、測試工程師），結合單一寫入者整合 (Single-Writer Integration) 與最嚴格 Review Gate，徹底解決大模型幻覺與長任務飄移問題。',
    ],
    suggestedLab: 'ai-transformer',
    questions: [
      {
        id: 'cs-q-701',
        title: 'Transformer 自注意力機制縮放點積公式',
        question: '在 Transformer 的縮放點積注意力 (Scaled Dot-Product Attention) 公式 $\\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$ 中，除以 $\\sqrt{d_k}$ 的核心數學與工程用意為何？',
        options: [
          '為了將矩陣維度從浮點數強制截斷為整數，以配合整數 ALU 運算',
          '防止當維度 $d_k$ 很大時點積數值過大，導致進入 softmax 函數梯度極小之飽和區而引發梯度消失問題',
          '為了將注意力權重強制歸零，消除所有標點符號的注意力',
          '為了反轉矩陣的特徵值以防止數值溢出',
        ],
        answer: 1,
        solution: [
          '第一步：當向量維度 $d_k$ 很大時，隨機變數內積的變異數約為 $d_k$，導致內積數值的絕對值急遽膨脹。',
          '第二步：如果直接將極大數值輸入 Softmax，輸出機率分佈會趨向 one-hot（極端陡峭），使得 Softmax 的導數（梯度）逼近於零。',
          '第三步：除以縮放因子 $\\sqrt{d_k}$ 能將變異數拉回約 1.0，確保 Softmax 處於梯度充足的非飽和區，使模型能穩定進行梯度反向傳播。',
        ],
        explanation: '縮放因子 √d_k 避免點積數值過大導致 Softmax 進入飽和區引發梯度消失。',
        difficulty: 4,
        tags: ['Transformer', 'Self-Attention', '縮放點積', '梯度消失'],
        type: 'single-choice',
      },
      {
        id: 'cs-q-702',
        title: '大模型推論中 KV Cache 核心機制',
        question: '在大語言模型 (LLM) 逐字生成文字（自回歸推論）的過程中，使用「KV Cache（鍵值快取）」技術的最主要目的為何？',
        options: [
          '將模型全部權重硬體永久寫入 CPU 內部 ROM 中，防止模型被外部逆向工程',
          '快取已生成歷史 Token 的 Key 與 Value 矩陣，避免每生成下一個 Token 時重複計算前面所有上下文的注意力量',
          '將用戶輸入的所有提示詞上傳至外部公共雲端以加速網路傳輸',
          '自動刪除所有注意力權重低於 0.1 的神經元以節省硬碟空間',
        ],
        answer: 1,
        solution: [
          '第一步：大語言模型是自回歸（Autoregressive）逐步輸出 token。每產出一個 token，整個輸入序列長度就增加 1。',
          '第二步：在計算新 token 的自注意力時，歷史前面所有 token 的 Query/Key/Value 其實在之前的步驟已經算過且不會改變。',
          '第三步：將先前的 Key 與 Value 矩陣保存在顯存（KV Cache）中，每次只需計算新 token 的 Q/K/V 並與快取中的 K/V 進行注意力運算，避免了重複計算，極大幅度提升了生成速率。',
        ],
        explanation: 'KV Cache 快取歷史 Token 的 K 與 V 矩陣，消除自回歸推論中對歷史上下文的重複矩陣運算。',
        difficulty: 4,
        tags: ['LLM推論', 'KV Cache', '自回歸生成', '效能最佳化'],
        type: 'single-choice',
      },
      {
        id: 'cs-q-703',
        title: '當代大模型 RoPE 旋轉位置編碼數學本質',
        question: '在當代前沿開源大語言模型（如 Llama 系列、Mistral 系列）中，廣泛採用的 RoPE (Rotary Position Embedding) 旋轉位置編碼，相較於傳統絕對位置編碼 (Absolute Positional Embedding)，其最關鍵的幾何數學優勢為何？',
        options: [
          '直接在嵌入層將一個固定的常數向量與輸入詞向量相加，運算速度最快',
          '在複數二維子平面上透過正交旋轉矩陣對 Query 與 Key 進行旋轉，使得兩者的內積自然且僅依賴於相對位置差 (m - n)，具備優異的相對距離感知與長文本外推能力',
          '會隨機打亂上下文順序以防止模型記憶訓練集',
          '只能用於小於 512 個 token 的超短句子，無法處理長文本',
        ],
        answer: 1,
        solution: [
          '第一步：傳統絕對位置編碼 (如 Vaswani 2017 正弦編碼) 直接加在詞向量上，模型難以直接感知兩詞之間的相對距離。',
          '第二步：RoPE (Su et al.) 將向量兩兩配對看作二維複數平面向量，位置 $m$ 乘以旋轉因子 $e^{im\\theta}$。',
          '第三步：計算注意力內積時：$\\langle R_m q, R_n k \\rangle = \\text{Re}(q k^* e^{i(m-n)\\theta})$，其內積純粹取決於相對距離 $(m - n)$！這賦予了現代 LLM 極強的長文本外推能力。選項 B 完全正確。',
        ],
        explanation: 'RoPE 透過複數平面旋轉，使注意力內積天然具備相對位置不變性，是現代大模型長文本能力的基石。',
        difficulty: 4,
        tags: ['RoPE', '旋轉位置編碼', '相對位置', 'LLM長文本'],
        type: 'single-choice',
      },
    ],
  },
]

export function getAllCsUnits(): CsUnit[] {
  return CS_CURRICULUM
}

export function getCsUnitById(id: string): CsUnit | undefined {
  return CS_CURRICULUM.find((u) => u.id === id)
}
