import type { CsQuestionEnglishRegistry } from './csQuestionCopyTypes';
export const CS_QUESTION_COPY_UNIT_3: CsQuestionEnglishRegistry = {
    'cs-q-301': {
        question: "What is the 8-bit two's-complement encoding of decimal $-43$?",
        options: ['11010101', '10101011', '11001011', '11010100'],
        solution: [
            "Write +43 as 00101011, invert all bits to 11010100, then add 1.",
            "11010101",
            "The resulting 8-bit pattern is 11010101."
        ],
        explanation: 'The word size must be fixed before encoding: widening an 8-bit negative value requires sign extension, not zero extension.',
        tags: ["Two's complement", 'Data representation', 'Negative-integer encoding']
    },
    'cs-q-302': {
        question: "At gate level, how does an ALU detect overflow in an $n$-bit two's-complement addition?",
        options: [
            'XOR the carry into the sign bit, $C_{\\text{in}}$, with the carry out, $C_{\\text{out}}$; overflow occurs exactly when $V=C_{\\text{in}}\\oplus C_{\\text{out}}=1$.',
            'Test whether the final result is prime.',
            'Wait one second and observe whether the chip temperature rises.',
            'Convert both operands to floating point and ask a person to inspect the terminal output.',
        ],
        solution: [
            "Compare the carry entering the most significant bit with the carry leaving it.",
            "XOR the carry into the sign bit, $C_{\\text{in}}$, with the carry out, $C_{\\text{out}}$; overflow occurs exactly when $V=C_{\\text{in}}\\oplus C_{\\text{out}}=1$.",
            "Two's-complement overflow is $V=C_{\\text{in}}\\oplus C_{\\text{out}}$, implementable with one XOR gate."
        ],
        explanation: 'A final carry-out detects unsigned overflow, not signed overflow; an equivalent signed check asks whether two same-sign operands produced a result with the opposite sign.',
        tags: ["Two's complement", 'Digital logic', 'Overflow detection', 'ALU', 'XOR']
    },
    'cs-q-303': {
        question: 'How many parity bits $r$ are required to add single-error correction to $m=8$ data bits with a Hamming code?',
        options: ['3 bits', '4 bits', '5 bits', '2 bits'],
        solution: [
            "Find the smallest $r$ satisfying $2^r \\ge m+r+1$.",
            "4 bits",
            "For $m=8$, $r=4$ is the minimum because $16\\ge13$."
        ],
        explanation: 'Four check bits provide single-error correction for eight data bits; SECDED needs an additional overall parity bit, so an extended Hamming code would not stop at four.',
        tags: ['Error detection and correction', 'Hamming code', 'SEC']
    },
    'cs-q-304': {
        question: 'What hexadecimal IEEE 754 single-precision bit pattern represents decimal $-6.75$?',
        options: ['0x40D80000', '0xC0D80000', '0xC1580000', '0xBF580000'],
        solution: [
            "Convert the magnitude: $6.75=(110.11)_2$.",
            "Normalize it as $1.1011\\times2^2$.",
            "Encode sign=1 and biased exponent $2+127=129=(10000001)_2$.",
            "Store fraction bits 1011000\u2026 after the implicit leading 1.",
            "Concatenate the fields to obtain 0xC0D80000."
        ],
        explanation: 'A negative IEEE 754 value is not formed by taking the two’s complement of the positive bit pattern; only the sign bit changes, while the exponent and fraction still encode the magnitude.',
        tags: ['Data representation', 'IEEE 754', 'Floating point', 'Normalization']
    },
    'cs-q-305': {
        question: 'How many select lines are required for a 16-to-1 multiplexer with inputs $D_0$ through $D_{15}$?',
        options: ['2 select lines', '4 select lines', '8 select lines', '16 select lines'],
        solution: [
            "Solve $2^s=16$ for the number of select bits $s$.",
            "4 select lines",
            "$log_2(16)=4$, so four select lines identify one of sixteen inputs."
        ],
        explanation: 'Four is the number of binary select bits, not the total control-pin count; an enable pin is separate, and unused select codes appear when the input count is not a power of two.',
        tags: ['Digital logic', 'Multiplexer', 'MUX', 'Combinational logic']
    },
    'cs-q-306': {
        question: 'What can happen when data changes too close before the active clock edge and violates a D flip-flop setup-time requirement?',
        options: [
            'The output repairs itself immediately and always becomes a perfect logic 1.',
            'The bistable element can enter metastability, leaving the output at an indeterminate voltage long enough to cause unpredictable downstream logic.',
            'An internal fuse permanently opens.',
            'The hardware automatically doubles the clock frequency.',
        ],
        solution: [
            "Check whether the D input remained stable throughout both the setup and hold windows around the sampling edge.",
            "The bistable element can enter metastability, leaving the output at an indeterminate voltage long enough to cause unpredictable downstream logic.",
            "A setup or hold violation can make a flip-flop metastable, a major clock-domain-crossing hazard."
        ],
        explanation: 'Metastability usually resolves but has no guaranteed resolution deadline; a synchronizer lowers the probability of propagation rather than preventing the first flip-flop from becoming metastable.',
        tags: ['Sequential logic', 'Timing analysis', 'Setup time', 'Hold time', 'Metastability']
    },
    'cs-q-307': {
        question: 'Which Boolean structure lets a carry-lookahead adder avoid the $O(n)$ carry delay of a ripple-carry adder?',
        options: [
            'Convert every input to decimal before adding.',
            'Define $G_i=A_iB_i$ and $P_i=A_i\\oplus B_i$, then expand $C_{i+1}=G_i+P_iC_i$ so carries depend directly on inputs and $C_0$.',
            'Require every addition result to equal zero.',
            'Run a software interpreter inside the CPU without logic gates.',
        ],
        solution: [
            "Form the per-bit generate and propagate signals before expanding the carry recurrence.",
            "Define $G_i=A_iB_i$ and $P_i=A_ioplus B_i$, then expand $C_{i+1}=G_i+P_iC_i$ so carries depend directly on inputs and $C_0$.",
            "Generate/propagate expansion computes carries in parallel instead of waiting for a serial ripple."
        ],
        explanation: 'A flat carry expansion does not stay constant-time as width grows because gate fan-in and wiring are bounded; practical CLAs use hierarchical groups instead of one enormous AND-OR gate.',
        tags: ['Digital logic', 'Adder', 'CLA', 'Carry lookahead', 'Arithmetic circuit']
    },
    'cs-q-308': {
        question: 'How does non-restoring division avoid the restore-add step used when restoring division produces a negative partial remainder?',
        options: [
            'If the previous partial remainder is negative, emit quotient bit 0 and add the divisor after the next shift instead of subtracting it.',
            'Discard every remainder and round the quotient.',
            'Convert division into calculus differentiation.',
            'Convert both values to floating point and send them to a GPU.',
        ],
        solution: [
            "Use the sign of the current partial remainder to choose addition or subtraction in the next iteration.",
            "If the previous partial remainder is negative, emit quotient bit 0 and add the divisor after the next shift instead of subtracting it.",
            "Adding the divisor on the following negative-remainder step is algebraically equivalent to restoring first, but saves a cycle."
        ],
        explanation: 'Non-restoring division avoids restoration after each negative partial remainder, but a negative final remainder can still require one correction before the result is complete.',
        tags: ['ALU', 'Hardware division', 'Non-restoring division', 'Arithmetic architecture']
    },
    'cs-q-309': {
        question: 'How much does radix-4 Booth recoding reduce the number of partial products in an $n$-bit multiplier?',
        options: ['It does not change the count.', 'It approximately halves the count to $\\lceil n/2\\rceil$; a 64-bit multiply produces 32 partial products.', 'It quadruples the count.', 'It eliminates partial products entirely.'],
        solution: [
            "Group the multiplier into overlapping three-bit windows and map each group to 0, \u00B11, or \u00B12 times the multiplicand.",
            "It approximately halves the count to $\\lceil n/2\\rceil$; a 64-bit multiply produces 32 partial products.",
            "Radix-4 Booth recoding consumes two multiplier bits per step, halving the partial products that a Wallace tree must compress."
        ],
        explanation: 'Fewer partial-product rows do not imply exactly half the total latency; Booth recoding, sign correction, tree compression, and the final carry-propagate addition still consume delay.',
        tags: ['ALU', 'Hardware multiplication', 'Booth algorithm', 'Radix-4', 'Partial products', 'Wallace tree']
    },
    'cs-q-310': {
        question: 'What numerical purpose do IEEE 754 subnormal values serve when the exponent field is all zero and the fraction is nonzero?',
        options: [
            'They make floating-point arithmetic one hundred times faster.',
            'They fill the gap between zero and the smallest normal value, providing gradual underflow so tiny differences do not abruptly become zero.',
            'They force floating-point values to 64-bit integers.',
            'They encode positive and negative infinity.',
        ],
        solution: [
            "Compare the leading significand bit of a normal value, 1.f, with the subnormal form, 0.f.",
            "They fill the gap between zero and the smallest normal value, providing gradual underflow so tiny differences do not abruptly become zero.",
            "Subnormals provide gradual underflow and retain information in results smaller than the minimum normal value."
        ],
        explanation: 'Gradual underflow preserves nonzero results near zero, but subnormals have declining relative precision because each step toward zero loses significant leading bits.',
        tags: ['IEEE 754', 'Floating point', 'Subnormal', 'Gradual underflow', 'Numerical hardware']
    },
    'cs-q-311': {
        question: 'Why is hardware Fused Multiply-Add, $A\\times B+C$, both more accurate and often faster than separate multiply and add instructions?',
        options: [
            'FMA keeps the extended intermediate product and rounds only once after addition, avoiding double-rounding error and one rounding stage.',
            'FMA converts every number to an integer.',
            'FMA can operate only on integers.',
            'FMA deliberately cuts speed in half for thermal protection.',
        ],
        solution: [
            "Count how many rounding operations occur in the separate sequence versus the fused datapath.",
            "FMA keeps the extended intermediate product and rounds only once after addition, avoiding double-rounding error and one rounding stage.",
            "FMA performs a single final rounding on the unrounded product-plus-addend, improving accuracy and pipeline efficiency."
        ],
        explanation: 'Because FMA rounds once, its last bit can legitimately differ from separate multiply and add operations; compiler contraction can therefore change strict floating-point results.',
        tags: ['Floating point', 'FMA', 'ALU', 'IEEE 754', 'Numerical analysis', 'GEMM']
    },
    'cs-q-312': {
        question: 'How does CORDIC compute trigonometric functions and vector rotations without a hardware multiplier?',
        options: [
            'It applies micro-rotations $\\theta_i=\\arctan(2^{-i})$, turning each multiplication or division into binary shifts plus additions or subtractions.',
            'It consumes liquid metal to calculate rotations.',
            'It computes addition only and cannot produce trigonometric functions.',
            'It depends on a 100 GB ROM containing every answer.',
        ],
        solution: [
            "Choose the direction of each power-of-two micro-rotation to reduce the residual angle.",
            "It applies micro-rotations $\\theta_i=\\arctan(2^{-i})$, turning each multiplication or division into binary shifts plus additions or subtractions.",
            "Because $\\tan(\\theta_i)=2^{-i}$, CORDIC implements rotation with shift-add iterations and a fixed scale correction."
        ],
        explanation: 'CORDIC rotations introduce a known gain and have a finite convergence range; practical designs need scale compensation, angle reduction, and enough iterations for the target precision.',
        tags: ['ALU', 'CORDIC', 'Digital circuit', 'Shift operation', 'Trigonometry', 'FPGA']
    },
    'cs-q-313': {
        question: 'What structure lets a Wallace-tree multiplier compress $n$ partial products in $O(\\log n)$ depth?',
        options: [
            'Layers of 3:2 carry-save compressors reduce three vectors to Sum and Carry without horizontal carry propagation, leaving two vectors for one final adder.',
            'Every carry is discarded.',
            'All partial products are stored and read slowly from disk.',
            'Each multiplication is restricted to one decimal digit.',
        ],
        solution: [
            "Compress each column of three same-weight bits into a sum bit and a carry bit of the next weight.",
            "Layers of 3:2 carry-save compressors reduce three vectors to Sum and Carry without horizontal carry propagation, leaving two vectors for one final adder.",
            "A parallel tree of carry-save adders reduces partial-product height logarithmically before the final carry-propagate addition."
        ],
        explanation: 'Carry-save stages postpone rather than eliminate carry propagation; after compression leaves two vectors, a conventional carry-propagate adder is still required.',
        tags: ['ALU', 'Wallace tree', 'CSA', 'Partial products', 'Hardware multiplier', 'Digital logic']
    },
    'cs-q-314': {
        question: 'How does a carry-lookahead adder compute carries in parallel instead of waiting for an $O(n)$ ripple?',
        options: [
            'It defines $G_i=A_iB_i$ and $P_i=A_i\\oplus B_i$, expands each $C_{i+1}=G_i+P_iC_i$, and implements the expanded functions with parallel AND-OR logic.',
            'An operator manually enters every carry before addition.',
            'It computes one bit and discards the remaining 63 bits.',
            'It converts every addition into division.',
        ],
        solution: [
            "Express each carry as a Boolean function of A, B, and the initial carry $C_0$.",
            "It defines $G_i=A_iB_i$ and $P_i=A_i\\oplus B_i$, expands each $C_{i+1}=G_i+P_iC_i$, and implements the expanded functions with parallel AND-OR logic.",
            "Generate and propagate expressions let hierarchical logic produce all carries in $O(1)$ block delay or $O(\\log n)$ depth."
        ],
        explanation: 'Textbooks use two valid propagate conventions, XOR and OR; both can support the carry recurrence, but only XOR is also the sum-without-carry term, so the convention must remain explicit.',
        tags: ['ALU', 'Carry-lookahead adder', 'CLA', 'Ripple carry', 'Digital logic', 'Critical path']
    },
    'cs-q-315': {
        question: 'Which statement correctly describes the output-timing difference between Moore and Mealy finite-state machines?',
        options: [
            'A Moore output depends only on current state and is naturally clock-aligned; a Mealy output also depends on current input, can react sooner, and can expose input glitches.',
            'A Moore output is chosen randomly by a quantum wave function.',
            'A Mealy machine runs automatically without any clock.',
            'The two machines have no structural difference.',
        ],
        solution: [
            "Write the output equations: Moore $y=g(s)$ and Mealy $y=g(s,x)$.",
            "A Moore output depends only on current state and is naturally clock-aligned; a Mealy output also depends on current input, can react sooner, and can expose input glitches.",
            "Moore outputs are state-only and stable between state changes; Mealy outputs react to inputs but need careful glitch control."
        ],
        explanation: 'A Moore output is not automatically glitch-free in hardware: decoded multi-bit state transitions can still produce hazards unless the output is registered or the state encoding is chosen safely.',
        tags: ['Digital logic', 'Finite-state machine', 'FSM', 'Moore', 'Mealy', 'Sequential circuit', 'Glitch', 'FPGA']
    },
    'cs-q-316': {
        question: 'Why can FP32 subnormal values below $2^{-126}$ cause a large CPU slowdown, and how do FTZ and DAZ address it?',
        options: [
            'Subnormals use 0.f instead of the normal 1.f significand and may require a slow microcode assist; FTZ and DAZ treat tiny outputs or inputs as zero to restore full pipeline speed.',
            'Subnormals lower display resolution.',
            'Subnormals add one minute of keyboard latency.',
            'FTZ formats the entire CPU.',
        ],
        solution: [
            "Check whether the FPU implements subnormal operands and results on its normal fast datapath.",
            "Subnormals use 0.f instead of the normal 1.f significand and may require a slow microcode assist; FTZ and DAZ treat tiny outputs or inputs as zero to restore full pipeline speed.",
            "When subnormals trigger a microcode assist, FTZ/DAZ trade gradual-underflow precision for predictable high throughput."
        ],
        explanation: 'Slow subnormal handling is microarchitecture- and operation-dependent, not required by IEEE 754; DAZ and FTZ improve predictability by changing results, not by accelerating exact gradual underflow.',
        tags: ['Digital logic', 'IEEE 754', 'Floating point', 'Denormal', 'Subnormal', 'FTZ', 'DAZ', 'Microcode assist']
    },
};
