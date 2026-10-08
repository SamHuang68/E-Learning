import type { TextbookChapter } from '../cs/data/textbookData'

export type CsTextbookEnglishCopy = Pick<
  TextbookChapter,
  | 'title'
  | 'englishTitle'
  | 'prerequisites'
  | 'historicalContext'
  | 'firstPrinciples'
  | 'architecturalDeepDive'
  | 'industrialCaseStudies'
  | 'deepThinkingQuestions'
  | 'classicReferences'
>

export const CS_TEXTBOOK_COPY_EN: Readonly<Record<string, CsTextbookEnglishCopy>> = {
  'cs-ch-1': {
    title: 'Foundations of Computer Science and Information Philosophy',
    englishTitle: 'Foundations of Computer Science & Information Philosophy',
    prerequisites: ['Discrete mathematics fundamentals', 'Probability fundamentals', 'Basic logic-gate concepts'],
    historicalContext: {
      era: '1936–1948',
      keyFigures: ['Alan Turing', 'Claude Shannon', 'Rolf Landauer'],
      coreMotivation: 'Mid-twentieth-century mathematicians sought an answer to Hilbert\'s Entscheidungsproblem. That search grew into philosophical questions about what information is and where the physical limits of computation lie.',
      breakthroughStory: 'In 1936, Turing proposed the abstract Turing machine, established the possibility of a universal computer, and proved that the Halting Problem is undecidable. In 1948, Shannon\'s “A Mathematical Theory of Communication” quantified information as measurable entropy. In 1961, Landauer showed that erasing one bit must dissipate at least kT ln 2 of energy into the environment, revealing computation as a physical process constrained by thermodynamics.',
    },
    firstPrinciples: {
      summary: 'Computation is fundamentally a finite, deterministic transition among states; information is a physical measure of reduced uncertainty. Every modern processor is bounded by quantum tunneling, thermodynamic energy dissipation, and signal-propagation delay at the speed of light.',
      mathematicalDerivations: [
        {
          topic: 'Shannon Entropy',
          formula: 'H(X) = -\\sum_{x \\in \\mathcal{X}} P(x) \\log_2 P(x)',
          explanation: 'This quantity measures the average uncertainty, or average information, carried by random variable X. Entropy reaches its maximum, log2(N), when all N symbols are equally likely.',
        },
        {
          topic: 'Landauer Principle',
          formula: 'E_{\\text{erase}} \\ge k_B T \\ln 2',
          explanation: 'At temperature T, irreversibly erasing one binary bit increases thermodynamic entropy and dissipates at least 2.85 × 10^-21 joules of heat at room temperature (300 K).',
        },
        {
          topic: 'Dennard-Scaling Breakdown and Power Density',
          formula: '\\text{Power Density} = \\frac{P}{\\text{Area}} \\propto \\frac{C V^2 f}{1 / k^2} \\xrightarrow{V \\approx \\text{const}} k^2',
          explanation: 'If feature size shrinks by a factor of k while supply voltage cannot fall proportionally, power density rises approximately with k squared. Much of the die must then remain inactive, producing the physical “dark silicon” wall.',
        },
      ],
    },
    architecturalDeepDive: {
      sectionTitle: 'Mapping an Abstract Turing Machine onto Physical Silicon Transistors',
      content: 'Modern computer architecture is a precise composition of abstract algebra and semiconductor solid-state physics. CMOS energy-band control governs electron flow between source and drain, turning binary voltage levels such as 0 V and 1.0 V into logic gates.',
      keySubsystems: [
        {
          name: 'Turing State-Transition Core',
          role: 'Finite-state control',
          technicalMechanism: 'A program counter and microinstruction ROM direct each execution step and together support Turing-complete computation.',
        },
        {
          name: 'CMOS Inverter Array',
          role: 'Physical bit manipulation',
          technicalMechanism: 'Complementary NMOS pull-down and PMOS pull-up networks switch the output while providing almost no direct-current path in a stable state.',
        },
        {
          name: 'Domain-Specific Accelerator Fabric',
          role: 'Overcoming the power wall',
          technicalMechanism: 'Dedicated low-power dataflow circuits execute specific tensor operations without the complex decode pipeline of a general-purpose CPU.',
        },
      ],
    },
    industrialCaseStudies: [
      {
        companyOrProject: 'NVIDIA and Google',
        systemName: 'Shift to Dedicated AI Architectures: TPU and Blackwell',
        appliedSolution: 'To address the collapse of Dennard scaling and dark silicon, these designs move beyond simply adding CPU cores and use dedicated tensor-matrix cores and systolic dataflow architectures.',
      },
      {
        companyOrProject: 'NASA JPL',
        systemName: 'RAD750 Radiation-Hardened Processor in the Perseverance Rover',
        appliedSolution: 'Silicon-on-insulator technology suppresses single-event upsets caused by high-energy cosmic rays, applying first-principles fault tolerance to a high-reliability system.',
      },
    ],
    deepThinkingQuestions: [
      {
        question: 'If computation used reversible gates such as Fredkin or Toffoli gates, could chip heating be eliminated completely?',
        philosophicalAnalysis: 'In theory, reversible computation does not erase information and therefore is not bound by Landauer\'s erasure limit. In practice, thermal noise and nonideal switches still cause parasitic resistive loss; the effort to approach zero dissipation motivates superconducting quantum computing and adiabatic logic.',
      },
      {
        question: 'The Halting Problem proves that no universal program analyzer exists. What does that imply for modern compilers and static code review?',
        philosophicalAnalysis: 'Any static infinite-loop analyzer or vulnerability scanner must make an engineering tradeoff between false positives and false negatives. No such tool can be both perfectly sound and perfectly complete for all programs.',
      },
    ],
    classicReferences: [
      {
        title: 'The Mathematical Theory of Communication',
        author: 'Claude Shannon (1948)',
        significance: 'The landmark work that founded modern quantitative information theory and established limits for channel coding.',
      },
      {
        title: 'On Computable Numbers, with an Application to the Entscheidungsproblem',
        author: 'Alan Turing (1936)',
        significance: 'The foundational computer-science work that defined the Turing machine and proved limits on computation.',
      },
    ],
  },
  'cs-ch-2': {
    title: 'Von Neumann Architecture and CPU Microarchitecture',
    englishTitle: 'Von Neumann Architecture & Advanced CPU Microarchitectures',
    prerequisites: ['Binary numbers and basic logic gates', 'Basic assembly instructions', 'Memory-address concepts'],
    historicalContext: {
      era: '1945–1990s',
      keyFigures: ['John von Neumann', 'Gene Amdahl', 'John Hennessy'],
      coreMotivation: 'Early machines such as ENIAC had to be reprogrammed by physically reconnecting cables, a slow process with little generality. Engineers needed a way to treat program instructions and data uniformly and store both in the same memory.',
      breakthroughStory: 'Von Neumann\'s 1945 “First Draft of a Report on the EDVAC” established the stored-program computer and its five functional units. Semiconductor CPUs then became about 50 percent faster per year while DRAM latency improved by only about 7 percent per year, creating the enduring Von Neumann bottleneck, or memory wall.',
    },
    firstPrinciples: {
      summary: 'A CPU is a high-speed engine that decodes instructions and advances register state. Deep pipelines, out-of-order execution, in-order retirement through a reorder buffer (ROB), multilevel caches, and branch prediction extract instruction-level parallelism while strictly preserving a single thread\'s architectural semantics in Sequential Program Order; visibility across cores instead depends on the hardware memory model and memory barriers.',
      mathematicalDerivations: [
        {
          topic: "Amdahl's Law",
          formula: 'S_{\\text{latency}}(s) = \\frac{1}{(1 - p) + \\frac{p}{s}}',
          explanation: 'This equation bounds parallel speedup. If fraction 1 − p must execute serially, adding arbitrarily many processors cannot make the speedup exceed 1 / (1 − p).',
        },
        {
          topic: 'Average Memory Access Time (AMAT)',
          formula: '\\text{AMAT} = T_{\\text{L1}} + M_{\\text{L1}} \\times (T_{\\text{L2}} + M_{\\text{L2}} \\times (T_{\\text{L3}} + M_{\\text{L3}} \\times T_{\\text{DRAM}}))',
          explanation: 'This equation captures the mathematics of a multilevel cache hierarchy. L1 and L2 hit rates above roughly 95 percent hide most of the hundreds of cycles required to access DRAM.',
        },
        {
          topic: 'The Iron Law of Processor Performance',
          formula: '\\text{Execution Time} = \\text{Instruction Count} \\times \\text{CPI} \\times \\text{Clock Cycle Time}',
          explanation: 'The ISA influences instruction count, the microarchitecture determines cycles per instruction, and semiconductor process physics constrains clock-cycle time.',
        },
      ],
    },
    architecturalDeepDive: {
      sectionTitle: 'Superscalar Out-of-Order Pipelines and Memory Disambiguation',
      content: 'Modern high-end CPUs, including Intel Raptor Lake, AMD Zen 4, and Apple M-series processors, are large dataflow engines that execute instructions speculatively and out of order rather than simple scalar in-order machines.',
      keySubsystems: [
        {
          name: 'TAGE Front-End Branch Predictor',
          role: 'Predicting control flow accurately',
          technicalMechanism: 'Multiple tagged tables with geometrically increasing history lengths predict loops and complex branches, reaching accuracy above 97 percent on suitable workloads.',
        },
        {
          name: 'Reservation Stations and Reorder Buffer',
          role: 'Out-of-order scheduling and in-order retirement',
          technicalMechanism: 'Register renaming in the reorder buffer removes WAW and WAR dependencies. Ready instructions execute out of order in functional units, then retire strictly in original program order.',
        },
        {
          name: 'Load/Store Unit and Store-to-Load Forwarding',
          role: 'Forwarding memory data',
          technicalMechanism: 'A store buffer holds writes that have not retired. A matching later load can receive the value directly through store-to-load forwarding instead of waiting for a cache read.',
        },
      ],
    },
    industrialCaseStudies: [
      {
        companyOrProject: 'Apple Silicon',
        systemName: 'M-Series Ultra-Wide-Issue Microarchitecture',
        appliedSolution: 'An instruction issue width as high as eight, a reorder buffer with more than 600 entries, large L1 caches, and high-bandwidth LPDDR5 unified memory produce strong single-core IPC at low power.',
      },
      {
        companyOrProject: 'AMD',
        systemName: '3D V-Cache Vertical Stacking',
        appliedSolution: 'TSMC hybrid bonding stacks a 64 MB SRAM die directly above CPU cores, expanding L3 capacity to 96 MB over a very short physical path and reducing average memory access time.',
      },
    ],
    deepThinkingQuestions: [
      {
        question: 'Speculative execution delivered a major performance gain. Why did it cause the industry-wide Spectre and Meltdown crisis in 2018?',
        philosophicalAnalysis: 'A failed prediction can roll back architectural state, but it can leave microarchitectural traces such as a loaded cache line. An unprivileged program can measure those timing traces as a side channel and infer protected memory contents.',
      },
    ],
    classicReferences: [
      {
        title: 'Computer Architecture: A Quantitative Approach',
        author: 'John L. Hennessy and David A. Patterson',
        significance: 'A field-defining computer-architecture text written by Turing Award recipients.',
      },
    ],
  },
  'cs-ch-3': {
    title: 'Digital Logic, Boolean Algebra, and Advanced Arithmetic Logic Units',
    englishTitle: 'Digital Logic, Boolean Algebra & Advanced Arithmetic Logic Units',
    prerequisites: ["Two's-complement representation", 'Basic logic operations'],
    historicalContext: {
      era: '1854–1960s',
      keyFigures: ['George Boole', 'Claude Shannon', 'John von Neumann'],
      coreMotivation: 'George Boole developed Boolean algebra in the nineteenth century as an exercise in mathematical logic. In his 1937 master\'s thesis, Claude Shannon discovered that relay-switch circuits are isomorphic to Boolean algebra.',
      breakthroughStory: 'Mapping symbolic logic onto physical binary switches enabled electrically operated arithmetic for the first time. As datapaths grew from 4 to 64 bits, carry chains became a physical speed limit, motivating carry-lookahead adders, Wallace trees, and the IEEE 754 floating-point standard.',
    },
    firstPrinciples: {
      summary: 'Addition is the physical foundation of subtraction, multiplication, division, and address generation. Algebraically separating carry generate from carry propagate turns a serial dependency into a parallel prefix tree.',
      mathematicalDerivations: [
        {
          topic: 'Carry-Lookahead Parallel-Prefix Equations',
          formula: 'G_i = A_i B_i, \\quad P_i = A_i \\oplus B_i, \\quad C_{i+1} = G_i + P_i C_i',
          explanation: 'Recursive expansion expresses each carry as a sum of products of original inputs. Under the physical constraint of fixed gate fan-in, hierarchical CLA and parallel-prefix adders reduce logic depth from ripple-carry O(n) to O(log n).',
        },
        {
          topic: "Two's-Complement Congruence",
          formula: '-A = 2^n - A = \\bar{A} + 1 \\pmod{2^n}',
          explanation: "Modulo-2^n congruence lets hardware perform signed subtraction unambiguously by adding the bitwise complement plus one, without a separate subtractor circuit.",
        },
        {
          topic: 'IEEE 754 Floating-Point Representation',
          formula: 'V = (-1)^s \\times (1.M) \\times 2^{E - \\text{Bias}} \\quad (\\text{normalized number})',
          explanation: 'An implicit leading 1 saves one fraction bit. The biased exponent makes unsigned-integer comparison valid for nonnegative, same-sign finite values; a complete floating-point comparison must still handle reversed ordering for negative values, +0 == -0, and unordered NaNs.',
        },
      ],
    },
    architecturalDeepDive: {
      sectionTitle: 'High-Performance 64-Bit ALUs and Floating-Point Microarchitecture',
      content: 'An ALU is more than an adder: it is a parallel hardware fabric that integrates barrel shifters, bit-mask logic, and multiply-accumulate units.',
      keySubsystems: [
        {
          name: 'Wallace-Tree Carry-Save Multiplier',
          role: 'High-speed matrix multiplication',
          technicalMechanism: 'Full adders act as 3:2 compressors, reducing many partial products in parallel to two rows without a serial carry chain; one final carry-lookahead adder produces the result.',
        },
        {
          name: 'Barrel-Shifter Array',
          role: 'Arbitrary single-cycle shifts',
          technicalMechanism: 'A multistage crossbar network performs any 0-to-63-bit logical or arithmetic shift within one clock cycle.',
        },
        {
          name: 'FPU Exception Handling and FTZ/DAZ Controls',
          role: 'Protecting floating-point limits and subnormal values',
          technicalMechanism: 'Architecture registers such as x86 MXCSR configure FTZ (Flush-to-Zero) and DAZ (Denormals-Are-Zero): FTZ flushes underflowing results to zero, while DAZ treats subnormal operands as zero at instruction input. They can reduce subnormal-handling costs on some processors, but they change gradual-underflow semantics and numerical results, so suitability depends on the workload.',
        },
      ],
    },
    industrialCaseStudies: [
      {
        companyOrProject: 'Intel and AMD',
        systemName: 'AVX-512 and AVX10 Vector Execution Units',
        appliedSolution: 'A 512-bit fused multiply-add unit computes sixteen 32-bit single-precision multiply-add operations in parallel each cycle.',
      },
    ],
    deepThinkingQuestions: [
      {
        question: 'Why does IEEE 754 define NaN and positive and negative infinity instead of halting the machine whenever division by zero occurs?',
        philosophicalAnalysis: 'The standard favors tolerant propagation. In large scientific workloads or real-time rendering pipelines, one overflow should not stop an entire batch; NaN can propagate through the numerical chain and be detected uniformly at a final validation layer.',
      },
    ],
    classicReferences: [
      {
        title: 'What Every Computer Scientist Should Know About Floating-Point Arithmetic',
        author: 'David Goldberg (1991)',
        significance: 'A foundational floating-point reference that explains rounding error, catastrophic cancellation, and standards-compliant implementation.',
      },
    ],
  },
  'cs-ch-4': {
    title: 'Modern Operating-System Kernels and Concurrency Philosophy',
    englishTitle: 'Modern Operating System Kernels & Concurrency Philosophy',
    prerequisites: ['Virtual-memory concepts', 'Multithreading concepts', 'Basic interrupt handling'],
    historicalContext: {
      era: '1969–present',
      keyFigures: ['Ken Thompson', 'Dennis Ritchie', 'Linus Torvalds'],
      coreMotivation: 'Early multiprogramming systems were fragile and unprotected: one faulty program could crash an entire mainframe. Designers needed hardware privilege levels that could give every process the illusion of an independent, conflict-free, virtually unlimited address space.',
      breakthroughStory: 'Unix emerged at Bell Labs in 1969 and established the “everything is a file” model and isolated process address spaces. Linux began in 1991 and grew into the dominant kernel for servers and supercomputers. In the multicore and NUMA era, operating systems manage extreme concurrency, reduce lock contention, and hide hardware latency.',
    },
    firstPrinciples: {
      summary: 'An operating system provides protected virtualization and arbitrates resources. CPU privilege levels such as Ring 0 and Ring 3, together with MMU paging, abstract physical hardware into processes, files, and virtual memory.',
      mathematicalDerivations: [
        {
          topic: 'Multilevel Paging and Virtual-Address Coverage',
          formula: '\\text{Virtual Address} = \\text{PGD} \\parallel \\text{PUD} \\parallel \\text{PMD} \\parallel \\text{PTE} \\parallel \\text{Offset}',
          explanation: 'A four-level x86-64 page table maps a sparse 48-bit virtual address space onto physical memory without preallocating a huge contiguous global table that would consume gigabytes.',
        },
        {
          topic: 'Completely Fair Scheduler Virtual Runtime',
          formula: 'vruntime_{i} \\mathrel{+}= \\Delta \\text{exec\\_time} \\times \\frac{\\text{NICE\\_0\\_LOAD}}{\\text{weight}_i}',
          explanation: 'Linux CFS organizes runnable tasks by vruntime in a red-black tree. A high-priority task with a lower nice value has greater weight, so its vruntime advances more slowly and it receives CPU service more often.',
        },
      ],
    },
    architecturalDeepDive: {
      sectionTitle: 'Linux Memory Management, Zero-Copy I/O, and Lock-Free Concurrency',
      content: 'A modern kernel schedules resources at microsecond and nanosecond scales. Unnecessary memory copies or contention on a global lock can collapse throughput.',
      keySubsystems: [
        {
          name: 'Linux CFS Red-Black-Tree Run Queue',
          role: 'Completely fair multitasking',
          technicalMechanism: 'The scheduler selects the leftmost tree node in O(1) time, providing low latency while preventing process starvation.',
        },
        {
          name: 'Read-Copy-Update Synchronization',
          role: 'Read-mostly concurrency',
          technicalMechanism: 'Readers follow a pointer without waiting or taking a lock. After modifying a copy, a writer first atomically publishes the new pointer with a publication primitive, waits through a grace period until every reader holding the old pointer has left its read-side critical section, and only then reclaims the old memory.',
        },
        {
          name: 'epoll Kernel Event Engine',
          role: 'C10K and C1000K concurrent I/O',
          technicalMechanism: 'A kernel red-black tree tracks sockets, and interrupt callbacks append ready events directly to a linked list, eliminating the O(N) scan required by select or poll.',
        },
      ],
    },
    industrialCaseStudies: [
      {
        companyOrProject: 'Linux Kernel Community',
        systemName: 'The io_uring Asynchronous-I/O Model',
        appliedSolution: 'Jens Axboe\'s io_uring shares submission (SQ) and completion (CQ) ring buffers between user and kernel space, amortizing system calls across normal batched submissions. Only when IORING_SETUP_SQPOLL is enabled and its dedicated kernel polling thread remains active can submission avoid a system call, sustaining high NVMe storage and networking throughput.',
      },
    ],
    deepThinkingQuestions: [
      {
        question: 'Microkernels such as seL4 and Fuchsia offer stronger formal verification and modular fault isolation. Why does monolithic Linux still dominate high-performance computing and cloud systems?',
        philosophicalAnalysis: 'The long-running tradeoff is modular isolation versus the cost of IPC context switches. Frequent communication among microkernel servers and repeated TLB disruption can be expensive under intense I/O, while Linux combines in-kernel performance with modular drivers and extensive concurrency optimization.',
      },
    ],
    classicReferences: [
      {
        title: 'Operating Systems: Three Easy Pieces (OSTEP)',
        author: 'Remzi H. Arpaci-Dusseau and Andrea C. Arpaci-Dusseau',
        significance: 'A leading modern introduction organized around virtualization, concurrency, and persistence.',
      },
    ],
  },
  'cs-ch-5': {
    title: 'Modern Computer Networks and Distributed-System Protocols',
    englishTitle: 'Modern Computer Networking & Distributed Protocols',
    prerequisites: ['Basic socket communication', 'Distributed-systems concepts', 'Hash algorithms'],
    historicalContext: {
      era: '1969 (ARPANET)–present',
      keyFigures: ['Vint Cerf', 'Bob Kahn', 'Leslie Lamport'],
      coreMotivation: 'During the Cold War, the United States Department of Defense needed a robust communications network that could reroute itself even if individual nodes were disabled. The problem expanded into global interconnection among billions of heterogeneous devices and strong consistency in distributed databases.',
      breakthroughStory: 'Cerf and Kahn designed TCP/IP so a simple network could support intelligent endpoints through the end-to-end principle. Lamport developed logical clocks and Paxos, establishing causal ordering without a global clock and core methods for fault-tolerant distributed consensus.',
    },
    firstPrinciples: {
      summary: 'A network is an imperfect, asynchronous packet-switching medium. A distributed system must establish a consistent causal partial order despite unreliable communication and random node failures.',
      mathematicalDerivations: [
        {
          topic: "CAP Theorem: Brewer's Conjecture and the Gilbert–Lynch Proof",
          formula: '\\text{Consistency} \\cap \\text{Availability} \\cap \\text{Partition Tolerance} = \\emptyset \\quad (\\text{during a network partition})',
          explanation: 'When a network partition exists, a system cannot provide both strong consistency and availability. An engineering design must choose a CP or AP behavior for that condition.',
        },
        {
          topic: 'Vector-Clock Causal Partial Order',
          formula: 'V_A \\le V_B \\iff \\forall k, V_A[k] \\le V_B[k] \\quad (\\text{otherwise } V_A \\parallel V_B)',
          explanation: 'Vector clocks track event causality and distinguish events that are causally ordered from events that are concurrent.',
        },
        {
          topic: 'Bandwidth–Delay Product',
          formula: '\\text{BDP} = \\text{Bottleneck Bandwidth} \\times \\text{Round-Trip Time}',
          explanation: 'BDP is the amount of data required in flight to fill a high-speed path. It underpins BBR congestion control, which seeks high throughput without persistent bufferbloat.',
        },
      ],
    },
    architecturalDeepDive: {
      sectionTitle: 'QUIC Transport and Google Percolator Distributed Transactions',
      content: 'TCP head-of-line blocking and rigid two-phase commit do not meet every low-latency requirement across global data centers, motivating changes from the transport layer through distributed storage.',
      keySubsystems: [
        {
          name: 'QUIC Multiplexed Streams over UDP',
          role: 'Removing head-of-line blocking between streams',
          technicalMechanism: 'Each stream is reassembled and flow-controlled with independent byte offsets, while packets advance through separate packet-number spaces for accurate loss detection, eliminating head-of-line blocking between streams. QUIC v1 supports variable-length connection IDs from 0 to 20 bytes; migration requires a nonzero-length CID and path validation, while a zero-length CID lacks equivalent address-change support.',
        },
        {
          name: 'Percolator Primary-Lock Commit Engine',
          role: 'Decentralized cross-row ACID transactions',
          technicalMechanism: 'A globally monotonic timestamp oracle and the state of one primary lock provide the commit decision, avoiding a traditional coordinator as a single point of failure.',
        },
        {
          name: 'Raft Replicated State Machine',
          role: 'Majority-replicated logs',
          technicalMechanism: 'Leader heartbeats, the log-matching invariant, and quorum voting provide linearizable replicated state.',
        },
      ],
    },
    industrialCaseStudies: [
      {
        companyOrProject: 'Google',
        systemName: 'Spanner Global Distributed Relational Database',
        appliedSolution: 'Atomic clocks and GPS receivers implement the TrueTime API in each data center, bounding global time uncertainty to within about 7 ms and enabling external consistency with lock-free snapshot reads.',
      },
    ],
    deepThinkingQuestions: [
      {
        question: 'The FLP impossibility result says that no deterministic consensus algorithm can guarantee termination in an asynchronous network if even one node may crash. How do Paxos and Raft work in practice?',
        philosophicalAnalysis: 'FLP concerns guaranteed termination by a deterministic algorithm in the worst case. Paxos and Raft add partial-synchrony assumptions, such as randomized election timeouts and eventual network recovery, while always prioritizing safety; practical systems then converge reliably in stable conditions.',
      },
    ],
    classicReferences: [
      {
        title: 'Time, Clocks, and the Ordering of Events in a Distributed System',
        author: 'Leslie Lamport (1978)',
        significance: 'A landmark paper that established logical clocks and causal ordering in distributed systems.',
      },
    ],
  },
  'cs-ch-6': {
    title: 'Modern AI Accelerator Chips and Memory Subsystems',
    englishTitle: 'Modern AI Hardware Accelerators & Memory Subsystems',
    prerequisites: ['Matrix-multiplication fundamentals', 'Computer memory hierarchies', 'GPU concepts'],
    historicalContext: {
      era: '2012–present',
      keyFigures: ['Jensen Huang', 'Norman Jouppi', 'Tri Dao'],
      coreMotivation: 'AlexNet triggered the deep-learning revolution in 2012, but the enormous number of GEMM operations in multilayer neural networks overwhelmed conventional CPU throughput. The challenge was to execute hundreds of trillions of low-precision multiply-accumulates per second on a chip.',
      breakthroughStory: 'NVIDIA invested in CUDA, tensor cores, and NVSwitch; Google built TPU systolic arrays; and Tri Dao introduced FlashAttention in 2022. SRAM tiling broke through the HBM memory wall and helped define the chip-and-kernel architecture of generative AI.',
    },
    firstPrinciples: {
      summary: 'Deep-learning performance is a Roofline-model tradeoff between memory-bound and compute-bound execution. Operator optimization seeks maximum data reuse and keeps intermediate values in fast on-chip SRAM.',
      mathematicalDerivations: [
        {
          topic: 'Roofline Arithmetic Intensity',
          formula: 'I = \\frac{\\text{FLOPs}}{\\text{DRAM Bytes}}, \\quad P_{\\text{attainable}} = \\min(P_{\\text{peak}}, I \\times \\text{BW}_{\\text{mem}})',
          explanation: 'Below a chip\'s arithmetic-intensity ridge point, memory bandwidth strictly limits an operator. Above the ridge point, the operator can approach peak Tensor Core throughput.',
        },
        {
          topic: 'FlashAttention SRAM-Tiling Derivation',
          formula: '\\mathbf{S}_{i,j} = \\mathbf{Q}_i \\mathbf{K}_j^T, \\quad m_i^{\\text{new}} = \\max(m_i^{\\text{old}}, \\max(\\mathbf{S}_{i,j})), \\quad \\mathbf{O}_i = \\text{OnlineSoftmax}(\\mathbf{S}_{i,j}, \\mathbf{V}_j)',
          explanation: 'Online Softmax rescales running statistics while tiles are processed in roughly 256 KB of fast on-chip SRAM, avoiding repeated writes of the N-by-N attention matrix to slower HBM.',
        },
      ],
    },
    architecturalDeepDive: {
      sectionTitle: 'Enterprise AI Server and Cluster Architecture: DGX and HGX',
      content: 'Enterprise AI servers support training of hundred-billion-parameter models and highly concurrent inference. Flagship configurations differ by generation: DGX H100 has eight 80 GB HBM3 GPUs (640 GB total GPU memory, 3.35 TB/s of memory bandwidth per GPU, and 900 GB/s of NVLink 4 bandwidth per GPU); HGX H200 has eight 141 GB HBM3e GPUs (1,128 GB, or 1.1 TB total, and 4.8 TB/s per GPU); Blackwell DGX B200 has eight 180 GB HBM3e GPUs (1,440 GB, or 1.44 TB total, 8 TB/s per GPU, and 1.8 TB/s of NVLink 5 bandwidth per GPU). The server host also combines dual CPUs with 2 TB (2,048 GB) of high-speed DDR5 ECC registered memory. This industrial cluster scale is categorically distinct from a consumer PC with one GPU or no NVSwitch.',
      keySubsystems: [
        {
          name: 'Dual-CPU Host with 2 TB of ECC Memory',
          role: 'Node scheduling and large dataset caching',
          technicalMechanism: 'Thirty-two DDR5-4800 or DDR5-5600 ECC RDIMMs provide 2 TB of main memory, while PCIe Gen5 switches connect an enterprise NVMe array of roughly 30 TB.',
        },
        {
          name: 'Eight-SXM Tensor Core GPU Fabric',
          role: 'Large-scale low-precision tensor parallelism',
          technicalMechanism: 'Across generations, eight flagship GPUs provide 640 GB (H100 HBM3), 1.1 TB (H200 HBM3e), or 1.44 TB (B200 HBM3e) of high-speed GPU memory. Peak compute must identify the GPU generation, numerical precision, and whether structured sparsity is enabled; FP8 and FP4 figures must not be blended into one metric.',
        },
        {
          name: 'NVLink/NVSwitch Fabric and 400 Gb/s InfiniBand',
          role: 'Removing multi-GPU and inter-node communication bottlenecks',
          technicalMechanism: 'DGX H100 uses four third-generation NVSwitches with 900 GB/s of bidirectional NVLink bandwidth per GPU; DGX B200 uses two fifth-generation NVLink switches and provides 14.4 TB/s of aggregate system interconnect bandwidth. Both generations can pair with 400 Gb/s InfiniBand for cross-node GPUDirect RDMA.',
        },
      ],
    },
    industrialCaseStudies: [
      {
        companyOrProject: 'NVIDIA Enterprise',
        systemName: 'DGX H100 and HGX H100 Enterprise AI Servers',
        appliedSolution: 'A standard configuration combines dual CPUs and 2 TB of system memory. Eight SXM H100 GPUs connect through four onboard third-generation NVSwitches to provide 900 GB/s of bidirectional NVLink 4 bandwidth per GPU and up to 7.2 TB/s bidirectionally across the system for tensor-parallel training of hundred-billion-parameter models.',
      },
      {
        companyOrProject: 'NVIDIA Enterprise',
        systemName: 'DGX B200 Blackwell Flagship AI Server',
        appliedSolution: 'Eight Blackwell B200 GPUs each provide 180 GB of HBM3e and 8 TB/s of memory bandwidth. Fifth-generation NVLink doubles bidirectional per-GPU interconnect bandwidth to 1.8 TB/s and reaches 14.4 TB/s system-wide, reducing all-to-all and tensor-parallel communication bottlenecks.',
      },
      {
        companyOrProject: 'AI Supercomputing Centers',
        systemName: 'Two-Tier Nonblocking Quantum-2 InfiniBand Fat Tree',
        appliedSolution: 'Each server connects eight 400 Gb/s InfiniBand links to leaf switches, and rail-optimized cabling distributes traffic to avoid inter-node hot spots.',
      },
    ],
    deepThinkingQuestions: [
      {
        question: 'If memory bandwidth rather than arithmetic is the main bottleneck in large-model generation, why not manufacture a chip with 100 GB of on-die SRAM?',
        philosophicalAnalysis: 'SRAM obeys hard area and yield limits: each bit typically needs six transistors and occupies tens of times the area of a DRAM bit. A 100 GB SRAM die would exceed an entire 300 mm wafer and have essentially zero yield, which motivates 2.5D and 3D chiplets and vertically stacked HBM.',
      },
    ],
    classicReferences: [
      {
        title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness',
        author: 'Tri Dao, Daniel Y. Fu, Stefano Ermon, Atri Rudra, and Christopher Ré (NeurIPS 2022)',
        significance: 'A pivotal operator-fusion paper that opened a new era of hardware-aware algorithm design for large models.',
      },
    ],
  },
  'cs-ch-7': {
    title: 'Frontier Artificial Intelligence and Large-Language-Model Evolution',
    englishTitle: 'Frontier AI & Large Language Model Evolutionary Architectures',
    prerequisites: ['Linear algebra and calculus', 'Neural-network backpropagation', 'Self-attention fundamentals'],
    historicalContext: {
      era: '2017–present',
      keyFigures: ['Ashish Vaswani', 'Ilya Sutskever', 'Albert Gu'],
      coreMotivation: 'The serial dependency of RNNs and LSTMs restricts parallel execution, and their long-range memory decays sharply. Researchers needed an architecture that could process a sequence globally in parallel and connect any two positions directly.',
      breakthroughStory: 'Google published “Attention Is All You Need” in 2017 and replaced recurrence with self-attention. The GPT family then showed that autoregressive pretraining and scaling laws can produce emergent reasoning behavior. Since 2023, Mamba selective state-space models, RoPE long-context extension, and GRPO reinforcement learning have pushed AI toward more autonomous reasoning.',
    },
    firstPrinciples: {
      summary: 'A large language model estimates the conditional distribution of the next token, P(w_t | w_<t). Self-attention uses geometric similarity in feature space to route context dynamically, while chain-of-thought generation and reinforcement learning guide search through a large solution space.',
      mathematicalDerivations: [
        {
          topic: 'Scaled Dot-Product Attention',
          formula: '\\text{Attention}(\\mathbf{Q}, \\mathbf{K}, \\mathbf{V}) = \\text{softmax}\\left(\\frac{\\mathbf{Q} \\mathbf{K}^T}{\\sqrt{d_k}}\\right) \\mathbf{V}',
          explanation: 'Dividing by the square root of d_k prevents large dot products from saturating Softmax and collapsing its gradients. Q–K dot products measure semantic relevance, and the weighted sum of V aggregates knowledge.',
        },
        {
          topic: 'Rotary Position Embedding and Relative Invariance',
          formula: '\\langle R_{\\Theta, m}^d \\mathbf{q}, R_{\\Theta, n}^d \\mathbf{k} \\rangle = \\mathbf{q}^T R_{\\Theta, n-m}^d \\mathbf{k}',
          explanation: 'Rotating two-dimensional subspaces on the complex plane makes the inner product depend only on relative displacement n − m, providing a theoretical basis for extending context length.',
        },
        {
          topic: 'Group Relative Policy Optimization Objective',
          formula: '\\mathcal{J}_{\\text{GRPO}}(\\theta) = \\mathbb{E}_{q \\sim P(Q), \\{o_i\\}_{i=1}^G \\sim \\pi_{\\text{old}}(O|q)} \\left[ \\frac{1}{G} \\sum_{i=1}^G \\left( \\min\\left(\\frac{\\pi_\\theta(o_i|q)}{\\pi_{\\text{old}}(o_i|q)} A_i, \\text{clip}\\left(\\frac{\\pi_\\theta(o_i|q)}{\\pi_{\\text{old}}(o_i|q)}, 1-\\epsilon, 1+\\epsilon\\right) A_i\\right) - \\beta D_{\\text{KL}}(\\pi_\\theta \\parallel \\pi_{\\text{ref}}) \\right) \\right]',
          explanation: 'GRPO uses no separate critic model. The old policy samples G candidate responses for question q; rewards are normalized by the group mean and standard deviation to estimate advantages, and the policy is updated with a clipped importance ratio plus a KL penalty. The displayed expression is a response-level shorthand; the original algorithm averages the objective across the tokens in each response. Removing the critic can reduce memory use, but the actual savings depend on the configuration.',
        },
      ],
    },
    architecturalDeepDive: {
      sectionTitle: 'From Transformers to Mamba Selective State Space and Multi-Agent Systems',
      content: 'AI algorithms are evolving toward longer context, lower inference cost, and multi-agent systems that can inspect and correct their own work.',
      keySubsystems: [
        {
          name: 'Grouped-Query Attention and PagedAttention',
          role: 'Reducing inference memory',
          technicalMechanism: 'Eight query heads can share one key/value head, while virtual paging reduces memory fragmentation and increases long-context generation throughput.',
        },
        {
          name: 'Mamba Selective State-Space Model',
          role: 'Linear O(N) sequence processing',
          technicalMechanism: 'Input-dependent state-space parameters combine with a hardware-aware associative scan to process sequences with no KV cache and constant per-token inference cost.',
        },
        {
          name: 'Multi-Agent Loop-Engineering Architecture',
          role: 'Reflection and formal verification',
          technicalMechanism: 'A Plan → Execute → Observe → Refine loop assigns bounded review roles to specialized agents so independent evidence can expose errors that one model might miss.',
        },
      ],
    },
    industrialCaseStudies: [
      {
        companyOrProject: 'OpenAI, Anthropic, and DeepSeek',
        systemName: 'Next-Generation Reasoning Models such as o1 and R1',
        appliedSolution: 'Large-scale reinforcement learning increases test-time computation, encouraging long reasoning traces and self-correction that improve performance in mathematics and code synthesis.',
      },
    ],
    deepThinkingQuestions: [
      {
        question: 'If a language model merely predicts the next token from statistical patterns, can it ever possess a genuine world model or understanding?',
        philosophicalAnalysis: 'John Searle\'s Chinese Room challenges the idea that symbol manipulation alone constitutes understanding. Modern representation learning offers a counterpoint: accurate prediction in multimodal, high-dimensional semantic space pressures a network to compress causal regularities of the external world into latent features. Whether predictive compression is sufficient for understanding remains a philosophical and empirical question.',
      },
    ],
    classicReferences: [
      {
        title: 'Attention Is All You Need',
        author: 'Ashish Vaswani et al. (NeurIPS 2017)',
        significance: 'The milestone paper that introduced the Transformer and helped launch modern generative AI.',
      },
      {
        title: 'Mamba: Linear-Time Sequence Modeling with Selective State Spaces',
        author: 'Albert Gu and Tri Dao (2023)',
        significance: 'A foundational selective-state-space paper that presents a linear-time alternative to Transformer sequence modeling.',
      },
    ],
  },
}
