import type { CsQuestionEnglishRegistry } from './csQuestionCopyTypes';
export const CS_QUESTION_COPY_UNIT_2: CsQuestionEnglishRegistry = {
    'cs-q-201': {
        question: 'During instruction fetch, which register holds the main-memory address of the next instruction to execute?',
        options: ['Instruction Register (IR)', 'Program Counter (PC)', 'Memory Buffer Register (MBR)', 'Accumulator (ACC)'],
        solution: [
            "Separate the register that points to the next instruction from the register that holds the current instruction.",
            "Program Counter (PC)",
            "The Program Counter tracks the memory address of the next instruction to fetch."
        ],
        explanation: 'The PC is not necessarily the address of the instruction currently executing; many pipelines increment it during fetch, and control transfers replace that speculative sequential value.',
        tags: ['Five functional units', 'Control unit', 'Registers', 'Instruction cycle']
    },
    'cs-q-202': {
        question: 'An L1 cache has a $1.0\\text{ ns}$ hit time, a $50\\text{ ns}$ miss penalty, and a $96\\%$ hit rate. What is the Average Memory Access Time (AMAT)?',
        options: ['1.5 ns', '3.0 ns', '2.0 ns', '4.5 ns'],
        solution: [
            "Use $\\text{AMAT}=\\text{Hit Time}+(1-\\text{Hit Rate})\\times\\text{Miss Penalty}$.",
            "3.0 ns",
            "$1.0 + 0.04 \\times 50 = 3.0\\text{ ns}$."
        ],
        explanation: 'Hit rate and miss rate are complements, not independent inputs: only the 4% misses pay the stated penalty, while the 1 ns lookup is paid on every access.',
        tags: ['Memory hierarchy', 'AMAT', 'Cache hit rate']
    },
    'cs-q-203': {
        question: 'A four-bank memory uses low-order interleaving. How does sequentially accessing addresses 0, 1, 2, and 3 improve bandwidth?',
        options: [
            'All four addresses map to one bank and must wait for four complete memory cycles.',
            'The addresses map to Banks 0, 1, 2, and 3, allowing overlapped bank accesses and throughput approaching four times one bank.',
            'Low-order interleaving creates a structural hazard that always reduces performance.',
            'It increases capacity but cannot improve bandwidth or latency.',
        ],
        solution: [
            "Use the low address bits to determine the bank selected by each consecutive address.",
            "The addresses map to Banks 0, 1, 2, and 3, allowing overlapped bank accesses and throughput approaching four times one bank.",
            "Low-order interleaving distributes sequential addresses across banks so their accesses can overlap."
        ],
        explanation: 'Interleaving improves sustained throughput, not the service time of one bank access; a stride that repeatedly selects the same bank loses the overlap.',
        tags: ['Memory architecture', 'Interleaving', 'Memory banks']
    },
    'cs-q-204': {
        question: 'What is the main microarchitectural advantage of a Virtually Indexed, Physically Tagged (VIPT) L1 cache?',
        options: [
            'It returns data without any physical-address translation or tag check.',
            'It indexes the cache set with virtual-address bits while the TLB translates the page in parallel, hiding translation latency.',
            'It eliminates every cache-aliasing problem in a multiprocess environment.',
            'It allows cache capacity to grow to hundreds of gigabytes without regard to page size.',
        ],
        solution: [
            "Identify which page-offset bits are unchanged by virtual-to-physical translation.",
            "It indexes the cache set with virtual-address bits while the TLB translates the page in parallel, hiding translation latency.",
            "VIPT overlaps cache-set lookup with TLB translation, then validates the physically tagged line."
        ],
        explanation: 'VIPT’s parallel lookup is constrained by page-offset bits: if set indexing extends beyond them, virtual synonyms can select different sets for the same physical page.',
        tags: ['Cache microarchitecture', 'VIPT', 'TLB parallelism', 'Memory hierarchy']
    },
    'cs-q-205': {
        question: 'Compared with write-through, what is the defining behavior and benefit of a write-back cache on a write hit?',
        options: [
            'Every cache write is synchronously written to DRAM immediately.',
            'The cache updates the line and sets its Dirty bit, writing the line to memory only when it is evicted and thereby reducing bus traffic.',
            'No state bit is needed because memory updates itself automatically.',
            'Write-through consumes no memory-bus write cycles.',
        ],
        solution: [
            "Ask when lower memory receives the modified bytes and how the cache records that obligation.",
            "The cache updates the line and sets its Dirty bit, writing the line to memory only when it is evicted and thereby reducing bus traffic.",
            "Write-back delays memory updates and uses a Dirty bit, filtering redundant writes from the memory bus."
        ],
        explanation: 'A write-back hit is not proof that the value has reached DRAM or durable storage; the dirty line still has to be written on eviction or an explicit flush.',
        tags: ['Cache write policy', 'Write-back', 'Dirty bit', 'Memory bandwidth']
    },
    'cs-q-206': {
        question: 'A valid virtual address refers to a page whose page-table Valid bit is 0 because the data is on secondary storage. What happens next?',
        options: [
            'Hardware reports divide-by-zero and immediately crashes the system.',
            'Hardware raises a page-fault trap; the kernel blocks the process, reads the page into RAM, updates the PTE and Valid bit, and restarts the faulting instruction.',
            'The operating system deletes the process and formats the disk.',
            'The CPU fills every register with 0xFFFFFFFF and skips the instruction.',
        ],
        solution: [
            "Distinguish a legal but nonresident page from an illegal address.",
            "Hardware raises a page-fault trap; the kernel blocks the process, reads the page into RAM, updates the PTE and Valid bit, and restarts the faulting instruction.",
            "A page fault enters the kernel, which pages the data in, repairs the mapping, and transparently retries the original instruction."
        ],
        explanation: 'A page-fault trap does not always mean loading data from disk: a nonpresent PTE may describe an illegal address, a demand-zero page, or a valid swapped page, and the kernel decides which.',
        tags: ['Virtual memory', 'MMU', 'Page fault', 'Exception', 'Instruction restart']
    },
    'cs-q-207': {
        question: 'On a modern x86-64 or ARM CPU, how is a PTE loaded after a TLB miss when the page is resident?',
        options: [
            'Every TLB miss traps into the kernel for a software table walk.',
            'A hardware page-table walker follows the multilevel tables rooted at CR3 or TTBR0, installs the PTE in the TLB, and retries without software intervention.',
            'The processor formats and clears the entire cache.',
            'The processor guesses a random physical address.',
        ],
        solution: [
            "Follow the page-table root register through each index level to the leaf PTE.",
            "A hardware page-table walker follows the multilevel tables rooted at CR3 or TTBR0, installs the PTE in the TLB, and retries without software intervention.",
            "The hardware page-table walker fills the TLB automatically, reducing software overhead and pipeline stalls."
        ],
        explanation: 'A TLB miss and a page fault are different events: the walk completes silently when it finds a present, permitted PTE, but a nonpresent or forbidden mapping raises a fault.',
        tags: ['Virtual memory', 'TLB', 'Page-table walker', 'Multilevel page table', 'Microarchitecture']
    },
    'cs-q-208': {
        question: 'How do non-temporal SSE/AVX stores such as `_mm_stream_si128` use a Write-Combining Buffer (WCB) for framebuffers or streaming copies?',
        options: [
            'They wait until every byte reaches disk before executing the next instruction.',
            'They bypass L1/L2 allocation to avoid cache pollution and merge small stores into aligned 64-byte burst writes for efficient bus use.',
            'They compress all data into a ZIP file held in registers.',
            'They disable the memory bus permanently.',
        ],
        solution: [
            "Determine whether streamed output will be reused soon enough to justify occupying cache lines.",
            "They bypass L1/L2 allocation to avoid cache pollution and merge small stores into aligned 64-byte burst writes for efficient bus use.",
            "Non-temporal stores and WCBs avoid cache pollution while combining writes into bandwidth-efficient full-line transactions."
        ],
        explanation: 'Non-temporal stores can be slower for small or soon-reused data, and software must obey the architecture’s fence and ordering rules before another core or device consumes the combined writes.',
        tags: ['Cache microarchitecture', 'Write combining', 'WCB', 'Non-temporal store', 'Memory bandwidth']
    },
    'cs-q-209': {
        question: 'Why do high-associativity caches use tree-based Pseudo-LRU instead of exact LRU?',
        options: [
            'Exact LRU needs complex state such as $N(N-1)/2$ or $\\lceil\\log_2(N!)\\rceil$ bits per set, while tree PLRU approximates it with only $N-1$ bits and a short update path.',
            'PLRU predicts the next million memory references perfectly.',
            'PLRU converts every set-associative cache into a direct-mapped cache.',
            'PLRU expands cache capacity tenfold at run time.',
        ],
        solution: [
            "Compare the state required to encode a complete recency ordering with one binary direction bit per tree node.",
            "Exact LRU needs complex state such as $N(N-1)/2$ or $\\lceil\\log_2(N!)\\rceil$ bits per set, while tree PLRU approximates it with only $N-1$ bits and a short update path.",
            "Tree PLRU approximates recency with N\u22121 state bits, greatly reducing controller area and hit-update delay."
        ],
        explanation: 'PLRU does not encode a true recency ordering and can evict a recently used line; N−1 bits buy lower cost, not exact LRU behavior.',
        tags: ['Cache replacement', 'PLRU', 'LRU', 'Set associativity', 'Hardware cost']
    },
    'cs-q-210': {
        question: 'What performance behavior occurs when a core in a multi-socket NUMA server accesses RAM attached to another socket?',
        options: [
            'Local RAM may take about 60 ns, while remote RAM crosses UPI or Infinity Fabric and may take 100–150+ ns, so NUMA-aware allocation and CPU pinning matter.',
            'Remote RAM is one thousand times faster than local RAM.',
            'Remote memory is completely inaccessible and always crashes the kernel.',
            'All memory data must be synchronized over Wi-Fi.',
        ],
        solution: [
            "Trace the request through either the local memory controller or the inter-socket fabric.",
            "Local RAM may take about 60 ns, while remote RAM crosses UPI or Infinity Fabric and may take 100\u2013150+ ns, so NUMA-aware allocation and CPU pinning matter.",
            "NUMA makes local access substantially faster than remote access, so scheduling and memory affinity must preserve locality."
        ],
        explanation: 'CPU pinning alone does not ensure locality: first-touch placement can leave the thread’s pages on another socket, so memory placement and thread affinity must be coordinated.',
        tags: ['Memory architecture', 'NUMA', 'SMP', 'UPI', 'Multiprocessor', 'Scheduling']
    },
    'cs-q-211': {
        question: 'In PBFT, how many replicas $N$ are required to preserve safety and liveness in the presence of $f$ Byzantine replicas?',
        options: ['$N \\ge 3f + 1$', '$N = f + 1$', '$N = 2f$', '$N > 0$ regardless of $f$'],
        solution: [
            "Two decision quorums must intersect in enough honest replicas even after accounting for $f$ Byzantine nodes.",
            "$N \\ge 3f + 1$",
            "PBFT requires $N \\ge 3f + 1$ replicas and a quorum of at least $2f + 1$ responses."
        ],
        explanation: 'The 3f+1 count protects safety against Byzantine equivocation, but replica count alone does not guarantee liveness during unbounded network delay; PBFT still needs an eventual-timing assumption.',
        tags: ['Distributed systems', 'PBFT', 'Byzantine fault tolerance', 'Consensus', 'Fault tolerance']
    },
    'cs-q-212': {
        question: 'What do consistent hashing and virtual nodes improve over `Hash(key) % N` in a distributed cache or key-value store?',
        options: [
            'Keys and nodes share a ring; adding or removing one node remaps about $1/N$ of keys, while many virtual nodes smooth load across physical nodes.',
            'They compress all data to zero bytes.',
            'They eliminate hashing and scan every key linearly.',
            'They require the database to use one disk.',
        ],
        solution: [
            "Place both keys and node tokens on the same ring and inspect only the neighboring ownership interval after membership changes.",
            "Keys and nodes share a ring; adding or removing one node remaps about $1/N$ of keys, while many virtual nodes smooth load across physical nodes.",
            "Consistent hashing limits remapping to roughly 1/N and virtual nodes reduce skew and hot spots."
        ],
        explanation: 'Virtual nodes smooth ownership variance, but they neither replicate data nor cure a single hot key; balanced hash ranges can still carry highly uneven request rates.',
        tags: ['Distributed systems', 'Consistent hashing', 'Virtual nodes', 'Load balancing', 'Cache avalanche']
    },
    'cs-q-213': {
        question: 'What problem does a Raft leader lease solve when a leader wants to serve a read from local memory?',
        options: [
            'After quorum heartbeats, a bounded lease interval ensures no other leader can be elected, so the current leader can serve local reads while preserving linearizability.',
            'It formats every database once per hour.',
            'It publishes every database password.',
            'It disables all read queries and permits only writes.',
        ],
        solution: [
            "Establish that the current leader still has exclusive quorum authority for the entire read interval.",
            "After quorum heartbeats, a bounded lease interval ensures no other leader can be elected, so the current leader can serve local reads while preserving linearizability.",
            "A valid leader lease replaces a per-read quorum round with a bounded timing guarantee, combining linearizable reads with low latency."
        ],
        explanation: 'A leader lease is only as safe as its bounded-clock and timing assumptions; after expiry or uncertain clock drift, a local read needs a fresh quorum-based authority check.',
        tags: ['Distributed systems', 'Raft', 'Leader lease', 'Linearizability', 'ReadIndex', 'Consensus']
    },
    'cs-q-214': {
        question: 'What are the three phases of Optimistic Concurrency Control (OCC) for a read-heavy database?',
        options: [
            'Read without locks into private state, validate read/write sets for conflicts, then atomically write on success or abort on failure',
            'Log in, buy credits, then log out',
            'Lock the entire database, disconnect the network, then restart the server',
            'Request manual approval, mail a notice, then archive it',
        ],
        solution: [
            "Separate speculative transaction work from the moment when conflicts are checked and changes become visible.",
            "Read without locks into private state, validate read/write sets for conflicts, then atomically write on success or abort on failure",
            "OCC uses Read, Validation, and Write phases, avoiding blocking and deadlock when conflicts are rare."
        ],
        explanation: 'OCC avoids blocking during speculative work, but high conflict rates convert contention into repeated validation failures and aborts, which can perform worse than locking.',
        tags: ['Database systems', 'OCC', 'Optimistic concurrency', '2PL', 'Transaction isolation', 'ACID']
    },
    'cs-q-215': {
        question: 'Why do high-speed buses prefer centralized parallel arbitration over daisy-chain arbitration?',
        options: [
            'A daisy-chain grant has linear propagation delay and fixed positional priority; independent REQ/GNT lines let one arbiter decide in parallel and implement fair round-robin or weighted policies.',
            'A daisy chain must burn firewood for power.',
            'Parallel arbitration consumes no electrical energy.',
            'A daisy chain can connect only printers and cannot carry data.',
        ],
        solution: [
            "Compare a serial grant path with independent request and grant wires to every bus master.",
            "A daisy-chain grant has linear propagation delay and fixed positional priority; independent REQ/GNT lines let one arbiter decide in parallel and implement fair round-robin or weighted policies.",
            "Centralized parallel arbitration removes serial grant delay and supports programmable fairness that prevents starvation."
        ],
        explanation: 'Independent request lines do not make arbitration automatically fair; starvation freedom depends on the arbiter policy, and the centralized arbiter and wiring can themselves become scaling limits.',
        tags: ['System architecture', 'Bus arbitration', 'Daisy chain', 'Parallel arbitration', 'PCIe', 'Starvation']
    },
    'cs-q-216': {
        question: 'What read and compaction costs accompany LSM-tree write throughput, and how do Bloom filters reduce read amplification?',
        options: [
            'Writes enter a WAL and MemTable, then immutable SSTables across levels; a point lookup may otherwise probe many files, so each SSTable Bloom filter rejects keys that are definitely absent before disk I/O.',
            'An LSM tree compresses all stored data to one byte.',
            'A Bloom filter identifies every historical spelling error exactly.',
            'Read amplification makes on-screen fonts ten times larger.',
        ],
        solution: [
            "Trace one key through WAL, MemTable, flush, SSTable levels, compaction, and point lookup.",
            "Writes enter a WAL and MemTable, then immutable SSTables across levels; a point lookup may otherwise probe many files, so each SSTable Bloom filter rejects keys that are definitely absent before disk I/O.",
            "LSM trees exchange read and write amplification for sequential write speed; Bloom filters prevent most unnecessary SSTable reads."
        ],
        explanation: 'A Bloom filter can prove absence but not presence and does not remove range-scan cost; false positives still cause SSTable reads while compaction adds write amplification.',
        tags: ['Distributed storage', 'LSM tree', 'RocksDB', 'Bloom filter', 'Read amplification', 'Write amplification', 'Compaction']
    },
};
