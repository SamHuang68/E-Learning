import type { CsQuestionEnglishRegistry } from './csQuestionCopyTypes';
export const CS_QUESTION_COPY_UNIT_1: CsQuestionEnglishRegistry = {
    'cs-q-101': {
        question: 'In a modern computer-system hierarchy, which contract sits directly between machine code emitted by a high-level-language compiler and the physical circuits inside a CPU microarchitecture?',
        options: ['Operating-system kernel', 'Instruction Set Architecture (ISA)', 'Graphical user interface (GUI)', 'Dynamic random-access memory (DRAM)'],
        solution: [
            "Locate the abstraction boundary that defines the instructions, registers, and addressing modes visible to compiled software.",
            "Instruction Set Architecture (ISA)",
            "The ISA is the abstract contract between software and the physical CPU implementation."
        ],
        explanation: 'Do not confuse an ISA with one CPU design: different microarchitectures can implement the same software-visible instructions, registers, and memory model.',
        tags: ['System abstraction', 'ISA', 'Hardware-software interface']
    },
    'cs-q-102': {
        question: 'Which statement most accurately compares how a compiler and an interpreter execute programs?',
        options: [
            'An interpreter always compiles the entire program once into an independent .exe file and therefore has the longest startup delay.',
            'A compiled program can run target-ISA machine code without keeping its source compiler resident, so execution is usually faster than direct interpretation.',
            'Python and JavaScript can never use Just-In-Time (JIT) compilation to generate machine code dynamically.',
            'A binary compiled once can run unchanged on both x86 and ARM processors.',
        ],
        solution: [
            "Separate ahead-of-time translation from run-time evaluation, then account for the target ISA.",
            "A compiled program can run target-ISA machine code without keeping its source compiler resident, so execution is usually faster than direct interpretation.",
            "Compiled languages emit a binary for a target ISA during the build, allowing high-throughput, low-latency native execution."
        ],
        explanation: 'Compilation and interpretation are execution strategies rather than fixed properties of a language: a JIT can compile hot code at run time, while an ahead-of-time binary still targets a specific ISA and ABI.',
        tags: ['Compiler', 'Interpreter', 'Execution performance']
    },
    'cs-q-103': {
        question: 'Which statement correctly compares the microarchitecture and control-unit design philosophies of RISC and CISC processors?',
        options: [
            'CISC normally uses hardwired control, fixed-length instructions, and exactly one execution cycle per instruction.',
            'RISC emphasizes fixed-length instructions and simple addressing, commonly uses hardwired control for efficient pipelines, and restricts memory access to Load/Store instructions.',
            'A RISC instruction can read two operands directly from memory, add them, and write the result back to memory in one instruction.',
            'Modern x86 processors execute CISC instructions strictly in order and never translate them into micro-operations.',
        ],
        solution: [
            "Recall the RISC load/store model and the pipeline benefit of regular instruction fields.",
            "RISC emphasizes fixed-length instructions and simple addressing, commonly uses hardwired control for efficient pipelines, and restricts memory access to Load/Store instructions.",
            "Fixed instruction widths, a load/store architecture, and hardwired control make RISC instruction pipelines efficient."
        ],
        explanation: 'RISC does not mean that every instruction completes in one cycle or that RISC is automatically faster; cache misses, branches, and complex operations still determine real performance.',
        tags: ['RISC', 'CISC', 'Hardwired control', 'Load-store architecture']
    },
    'cs-q-104': {
        question: 'During a large Direct Memory Access (DMA) transfer, what does cycle stealing mean?',
        options: [
            'The DMA controller permanently disconnects memory power from the CPU until the computer restarts.',
            'The DMA controller uses a bus slot when the CPU does not need the bus, or briefly pauses the CPU for one bus cycle to transfer a word.',
            'The CPU polls and copies every word through a register.',
            'DMA consumes no address-bus or data-bus bandwidth.',
        ],
        solution: [
            "Identify which component becomes bus master for each transferred word.",
            "The DMA controller uses a bus slot when the CPU does not need the bus, or briefly pauses the CPU for one bus cycle to transfer a word.",
            "Cycle stealing lets DMA borrow individual bus cycles for data transfer with little disruption to CPU computation."
        ],
        explanation: 'DMA removes per-word CPU copying, not bus contention: a stolen cycle can delay a CPU memory request even when the core has other work it can continue.',
        tags: ['I/O architecture', 'DMA', 'Cycle stealing', 'System bus']
    },
    'cs-q-105': {
        question: 'Compared with a classic Von Neumann system, what is the defining hardware feature and performance benefit of a Harvard architecture?',
        options: [
            'Instructions and data use separate physical memories and buses, allowing an instruction fetch and a data access in the same clock cycle.',
            'The control unit is removed and software directly drives every circuit.',
            'It can be used only in microcontrollers and has disappeared from high-performance processors.',
            'Its memory is permanently read-only.',
        ],
        solution: [
            "Compare whether instruction traffic and data traffic contend for the same memory path.",
            "Instructions and data use separate physical memories and buses, allowing an instruction fetch and a data access in the same clock cycle.",
            "Physical separation of instruction and data paths permits concurrent fetch and memory access, eliminating that structural conflict."
        ],
        explanation: 'Separate instruction and data paths remove one structural conflict, but they do not eliminate cache misses or contention in shared lower-level caches and memory.',
        tags: ['Computer architecture', 'Harvard architecture', 'Von Neumann bottleneck', 'L1 cache']
    },
    'cs-q-106': {
        question: 'In an out-of-order superscalar CPU, which dependencies does register renaming primarily eliminate?',
        options: [
            'True Read-After-Write (RAW) dependencies, allowing a result to be consumed before it exists',
            'False dependencies caused by limited register names: Write-After-Read (WAR) and Write-After-Write (WAW)',
            'The physical width of a 64-bit register by compressing it to 8 bits',
            'The CPU clock, so every instruction can execute asynchronously',
        ],
        solution: [
            "Distinguish true data flow (RAW) from name reuse (WAR and WAW).",
            "False dependencies caused by limited register names: Write-After-Read (WAR) and Write-After-Write (WAW)",
            "Register renaming assigns dynamic physical tags to remove WAR and WAW name dependencies and expose instruction-level parallelism."
        ],
        explanation: "Renaming cannot remove a true RAW dependency: a consumer still waits for the producer's physical register even though WAR and WAW name conflicts disappear.",
        tags: ['Superscalar', 'Tomasulo', 'Register renaming', 'Out-of-order execution', 'ILP']
    },
    'cs-q-107': {
        question: 'In MESI coherence, core A holds a cache line in Shared (S) state and now wants to store to it. What transition and bus action are required?',
        options: [
            'A changes the line to Invalid (I) and abandons the store.',
            'A broadcasts BusInval or BusRdX so peers invalidate their copies, then A transitions its line to Modified (M).',
            'A remains Shared, writes memory, and waits for memory to notify the other cores.',
            'The entire CPU pauses for one second.',
        ],
        solution: [
            "A writer needs exclusive ownership before modifying a line shared with other cores.",
            "A broadcasts BusInval or BusRdX so peers invalidate their copies, then A transitions its line to Modified (M).",
            "A store to a Shared line invalidates peer copies and upgrades the local line to Modified."
        ],
        explanation: 'Modified does not mean the new value was written through to memory; after peer invalidation, the cache may hold the only current copy until eviction or a coherence intervention.',
        tags: ['Cache coherence', 'MESI', 'Bus snooping', 'Multicore architecture']
    },
    'cs-q-108': {
        question: 'What core advantage does a two-bit saturating branch counter have over a one-bit predictor?',
        options: [
            'It eliminates every data hazard.',
            'One loop-exit misprediction does not reverse the learned Taken direction, so the next loop entry is less likely to mispredict.',
            'It removes the program counter.',
            'It reduces branch latency to zero femtoseconds.',
        ],
        solution: [
            "Track how many contrary outcomes are needed to move from strongly Taken to a Not-Taken prediction.",
            "One loop-exit misprediction does not reverse the learned Taken direction, so the next loop entry is less likely to mispredict.",
            "A two-bit counter must be wrong twice before reversing direction, making it resistant to a single loop-exit outcome."
        ],
        explanation: 'The two-bit scheme adds hysteresis, not perfect prediction: a strongly Taken loop still mispredicts its isolated exit, but that one outcome usually does not poison the next entry.',
        tags: ['Branch prediction', 'Saturating counter', '2-bit counter', 'Control hazard', 'Pipelining']
    },
    'cs-q-109': {
        question: 'What compiler and microarchitecture benefit does `[Rb + Ri * Scale + Disp]` base-index-scale-displacement addressing provide?',
        options: [
            'It forces every CPU instruction to access a disk.',
            'One load can use the Address Generation Unit (AGU) to combine an array base, a scaled index, and a field displacement without extra add or shift instructions.',
            'It automatically converts a double-precision number to a string.',
            'It eliminates cache-tag checks.',
        ],
        solution: [
            "Map an array or structure address onto base + scaled index + constant displacement.",
            "One load can use the Address Generation Unit (AGU) to combine an array base, a scaled index, and a field displacement without extra add or shift instructions.",
            "The AGU performs the compound address calculation in one memory operation, improving code density and loop throughput."
        ],
        explanation: 'An AGU calculates an effective address; it does not remove the load’s cache or TLB latency, and legal scale factors remain limited by the ISA.',
        tags: ['ISA', 'Addressing mode', 'Base-index addressing', 'AGU', 'Microarchitecture']
    },
    'cs-q-110': {
        question: 'How do processors such as Intel Core, AMD Ryzen, and Apple Silicon implement a modified Harvard architecture while using one external DRAM address space?',
        options: [
            'External RAM is unified, but each core separates its L1 instruction cache and L1 data cache with independent access paths.',
            'All caches are removed and every access goes directly to a disk.',
            'Only text instructions may execute; numeric computation is forbidden.',
            'Every program instruction is permanently burned into motherboard ROM.',
        ],
        solution: [
            "Compare the unified external address space with the split first-level cache paths inside a core.",
            "External RAM is unified, but each core separates its L1 instruction cache and L1 data cache with independent access paths.",
            "A modified Harvard CPU combines unified external addressing with separate L1 instruction and data caches for pipeline throughput."
        ],
        explanation: 'A unified address space does not make instruction-cache visibility automatic: self-modifying code may need an architecture-defined I-cache synchronization sequence after data stores.',
        tags: ['Computer architecture', 'Von Neumann architecture', 'Harvard architecture', 'Modified Harvard architecture', 'L1 cache', 'Structural hazard']
    },
    'cs-q-111': {
        question: 'Why do large cc-NUMA or distributed shared-memory systems use directory-based coherence instead of broadcast snooping?',
        options: [
            'Snooping broadcasts every invalidation to all cores, while a directory tracks sharers and sends requests only to nodes that hold the line, scaling toward O(1) or O(K) messages.',
            'Snooping supports only legacy 16-bit software.',
            'A directory requires the computer to contain exactly one CPU core.',
            'A directory disables caches and routes every access through a disk.',
        ],
        solution: [
            "Compare all-core broadcast traffic with targeted messages to a recorded sharer set.",
            "Snooping broadcasts every invalidation to all cores, while a directory tracks sharers and sends requests only to nodes that hold the line, scaling toward O(1) or O(K) messages.",
            "Directory mappings replace global broadcasts with point-to-point coherence messages, avoiding a multicore interconnect broadcast storm."
        ],
        explanation: 'Directory coherence trades broadcast traffic for metadata and lookup cost; invalidating a line held by K sharers can still require K targeted messages.',
        tags: ['Multicore architecture', 'Cache coherence', 'Directory protocol', 'MESI', 'cc-NUMA', 'Broadcast storm']
    },
    'cs-q-112': {
        question: 'Why does an x86 front-end decoder consume more area and power than a typical ARM or RISC-V decoder?',
        options: [
            'x86 instructions vary from 1 to 15 bytes and may contain prefixes, so the front end needs predecode, length decode, and micro-op translation; fixed 32-bit RISC fields can be split and decoded directly in parallel.',
            'x86 instructions can be decoded only with vacuum tubes.',
            'RISC architectures contain no registers.',
            'ARM processors cannot execute loops.',
        ],
        solution: [
            "Determine whether instruction boundaries are known before decoding begins.",
            "x86 instructions vary from 1 to 15 bytes and may contain prefixes, so the front end needs predecode, length decode, and micro-op translation; fixed 32-bit RISC fields can be split and decoded directly in parallel.",
            "Variable-length x86 boundaries demand substantial front-end logic, whereas fixed-width RISC encoding enables simpler parallel decode."
        ],
        explanation: 'The difficult part is discovering variable-length instruction boundaries, not a blanket property of every CISC operation; a decoded-uop cache can bypass much of that work on a hit.',
        tags: ['ISA', 'CISC', 'RISC', 'Instruction decode', 'x86', 'ARM', 'Microarchitecture']
    },
    'cs-q-113': {
        question: 'How does an out-of-order processor eliminate WAR and WAW false hazards while preserving true RAW dependencies?',
        options: [
            'It maps the small architectural register set onto a larger Physical Register File and allocates a fresh physical register for each write.',
            'It disables out-of-order issue and forces every instruction to execute serially.',
            'It writes every result to a random cache location.',
            'It deletes all write operations from the instruction stream.',
        ],
        solution: [
            "Follow each architectural destination through the rename map to a newly allocated physical register.",
            "It maps the small architectural register set onto a larger Physical Register File and allocates a fresh physical register for each write.",
            "Register renaming removes name reuse, eliminating WAR and WAW false dependencies and releasing more instruction-level parallelism."
        ],
        explanation: 'Allocating a fresh destination is only half the mechanism: the old physical mapping must remain available until retirement so mispredictions and precise exceptions can roll back safely.',
        tags: ['CPU microarchitecture', 'Superscalar', 'Register renaming', 'Physical register file', 'Out-of-order execution', 'ILP', 'False dependency']
    },
    'cs-q-114': {
        question: 'What is the central prediction mechanism of a TAGE branch predictor?',
        options: [
            'Several tagged tables use geometrically increasing history lengths; short tables capture local correlation and the longest matching tagged table supplies longer-range predictions.',
            'All branches are removed and every program is rewritten as straight-line code.',
            'The processor asks the user what to do at every branch.',
            'A random-number generator decides every branch direction.',
        ],
        solution: [
            "Match the current branch context against tagged predictors that cover different history lengths.",
            "Several tagged tables use geometrically increasing history lengths; short tables capture local correlation and the longest matching tagged table supplies longer-range predictions.",
            "TAGE combines geometric history lengths with tag matching to capture correlations while reducing destructive aliasing."
        ],
        explanation: 'TAGE does not always use the table with the longest configured history; a table must have a matching tag, and usefulness or confidence logic can select or train an alternate predictor.',
        tags: ['CPU microarchitecture', 'Branch prediction', 'TAGE', 'Pipeline', 'Pipeline flush', 'Superscalar']
    },
    'cs-q-115': {
        question: 'What fundamental architectural change followed the breakdown of Dennard scaling and the rise of dark silicon?',
        options: [
            'Transistors continued shrinking but voltage stopped scaling proportionally, so power density and TDP limits forced much of a die to remain off or down-clocked and pushed designs toward heterogeneous domain-specific accelerators.',
            'Every silicon wafer physically turned black.',
            'Microprocessors began working only in dark rooms.',
            'Every semiconductor fab stopped producing electronic components.',
        ],
        solution: [
            "Relate stalled voltage scaling to dynamic power, leakage, power density, and the chip thermal budget.",
            "Transistors continued shrinking but voltage stopped scaling proportionally, so power density and TDP limits forced much of a die to remain off or down-clocked and pushed designs toward heterogeneous domain-specific accelerators.",
            "The power-density wall means not all transistors can run simultaneously, motivating domain-specific accelerators and heterogeneous computing."
        ],
        explanation: 'Dark silicon is not physically dark or defective: usable transistors remain powered off or down-clocked because simultaneous switching would exceed the chip’s power and thermal budget.',
        tags: ['Computer architecture', 'Dark silicon', 'Dennard scaling', "Moore's law", 'Power wall', 'DSA', 'Heterogeneous computing']
    },
    'cs-q-116': {
        question: 'How does Store-to-Load Forwarding (STLF) bypass L1D latency, and when can size or alignment cause forwarding to fail?',
        options: [
            'A recent Store remains in the Store Buffer and a dependent Load can bypass the new data directly; if the Load extends beyond the Store bytes or the ranges are misaligned, hardware may wait for the Store to reach L1D, creating a 10–20-cycle bubble.',
            'An STLF failure erases every CPU register.',
            'The Load automatically moves to a GPU.',
            'The processor skips the Load and pretends it never occurred.',
        ],
        solution: [
            "Compare the byte range requested by the Load with the range already present in the Store Buffer.",
            "A recent Store remains in the Store Buffer and a dependent Load can bypass the new data directly; if the Load extends beyond the Store bytes or the ranges are misaligned, hardware may wait for the Store to reach L1D, creating a 10\u201320-cycle bubble.",
            "STLF supplies matching bytes from the Store Buffer in 1\u20132 cycles; incomplete overlap or misalignment can force a much slower cache path."
        ],
        explanation: 'Byte overlap alone does not guarantee forwarding: the older store address must be resolved, and its covered bytes and alignment must match a forwarding pattern supported by the load-store unit.',
        tags: ['CPU microarchitecture', 'STLF', 'Store buffer', 'LSU', 'Memory disambiguation', 'Alignment', 'Out-of-order execution']
    },
};
