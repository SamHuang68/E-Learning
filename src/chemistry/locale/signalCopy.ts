import type { ChemistrySignalCopy } from './types'

export const CHEMISTRY_SIGNAL_EN: Record<string, ChemistrySignalCopy> = {
  'sig-solubility-cooling': {
    gradeBand: 'Grade 7',
    topic: 'Solutions · Crystallization during Cooling',
    problemSignal: 'Solubilities at a high and low temperature are given, and a saturated solution is cooled to find crystal mass.',
    threeSecondRule: 'Keep the water mass fixed and multiply it by the decrease in solubility per 100 g water.',
    firstStepFormula: 'W_{\\text{crystals}}=W_{\\text{water}}\\times\\frac{S_{\\text{high}}-S_{\\text{low}}}{100\\text{ g water}}',
    exampleProblem: {
      question: 'Potassium nitrate solubility falls from $110$ to $32\\text{ g}/100\\text{ g water}$. A $210\\text{ g}$ saturated high-temperature solution is cooled. How much crystallizes?',
      quickSolve: 'The solution contains $100\\text{ g}$ water, so crystal mass is $100(110-32)/100=78\\text{ g}$.',
    },
  },
  'sig-mass-conservation-limiting': {
    gradeBand: 'Grade 8',
    topic: 'Chemical Reactions · Limiting Reagent',
    problemSignal: 'Amounts of two reactants are given; identify which is consumed or calculate maximum product.',
    threeSecondRule: 'Convert everything to moles and divide each amount by its coefficient. The smallest ratio identifies the limiting reagent.',
    firstStepFormula: '\\text{limiting reagent}=\\min\\left(\\frac{n_A}{a},\\frac{n_B}{b}\\right)',
    exampleProblem: {
      question: 'For $2H_2+O_2\\rightarrow2H_2O$, which reagent limits when $4\\text{ mol }H_2$ reacts with $3\\text{ mol }O_2$, and how much water forms?',
      quickSolve: '$4/2=2$ for hydrogen and $3/1=3$ for oxygen, so hydrogen limits and forms $4\\text{ mol}$ water.',
    },
  },
  'sig-metal-activity-redox': {
    gradeBand: 'Grade 8',
    topic: 'Redox · Metal Activity and Displacement',
    problemSignal: 'A metal is heated with another metal oxide, such as $A+BO\\rightarrow AO+B$, and spontaneity must be predicted.',
    threeSecondRule: 'A more active metal captures oxygen from the oxide of a less active metal.',
    firstStepFormula: '\\text{activity: K}>\\text{Na}>\\text{Ca}>\\text{Mg}>\\text{Al}>\\text{C}>\\text{Zn}>\\text{Fe}>\\text{Pb}>\\text{H}>\\text{Cu}>\\text{Ag}',
    exampleProblem: {
      question: 'Will a mixture of aluminium powder and iron oxide react vigorously when ignited?',
      quickSolve: 'Aluminium is more active than iron, so it removes oxygen to form $Al_2O_3$ and molten iron.',
    },
  },
  'sig-density-molarity': {
    gradeBand: 'Grade 10',
    topic: 'Stoichiometry · Mass Percent to Molarity',
    problemSignal: 'Mass percent $P\\%$ and solution density $D$ in $\\text{g/cm}^3$ are given; find molarity.',
    threeSecondRule: 'Multiply ten times the percent number by density and divide by molar mass.',
    firstStepFormula: 'M=\\frac{10\\times P\\%\\times D}{M_w}',
    exampleProblem: {
      question: 'Concentrated sulfuric acid is 98% by mass with density 1.84 and molar mass 98. Find molarity.',
      quickSolve: '$M=10(98)(1.84)/98=18.4\\text{ M}$.',
    },
  },
  'sig-combustion-analysis': {
    gradeBand: 'Grade 10',
    topic: 'Chemical Formulas · Combustion Analysis',
    problemSignal: 'An unknown organic sample burns to known masses of carbon dioxide and water; find its empirical or molecular formula.',
    threeSecondRule: 'Use carbon dioxide to find carbon, water to find hydrogen, and sample-mass difference to find oxygen.',
    firstStepFormula: 'W_C=W_{CO_2}\\frac{12}{44},\\quad W_H=W_{H_2O}\\frac{2}{18},\\quad W_O=W_{sample}-(W_C+W_H)',
    exampleProblem: {
      question: '$4.6\\text{ g}$ sample yields $8.8\\text{ g }CO_2$ and $5.4\\text{ g }H_2O$. Find the C:H:O mole ratio.',
      quickSolve: 'C is $0.2\\text{ mol}$, H $0.6\\text{ mol}$, and O $0.1\\text{ mol}$, giving $2:6:1$ and $C_2H_6O$.',
    },
  },
  'sig-atom-economy': {
    gradeBand: 'Grade 10',
    topic: 'Green Chemistry · Atom Economy',
    problemSignal: 'A synthesis equation is given and the atom economy of the desired product must be evaluated.',
    threeSecondRule: 'Divide desired-product molar mass by the sum for all reactants. An addition reaction with no by-product reaches 100%.',
    firstStepFormula: '\\text{AE (\\%)}=\\frac{\\text{molar mass of desired product}}{\\sum\\text{molar masses of reactants}}\\times100\\%',
    exampleProblem: {
      question: 'What is the atom economy of $C_2H_4+H_2O\\rightarrow C_2H_5OH$?',
      quickSolve: 'Every reactant atom enters ethanol and no by-product forms, so atom economy is 100%.',
    },
  },
  'sig-water-vapor-pressure': {
    gradeBand: 'Grade 11',
    topic: 'Gas Laws · Water-Vapour Correction',
    problemSignal: 'Gas is collected over water and atmospheric pressure plus saturated water-vapour pressure are given.',
    threeSecondRule: 'Subtract water-vapour pressure before using the gas law; the collected sample is a gas mixture.',
    firstStepFormula: 'P_{\\text{dry gas}}=P_{\\text{atmosphere}}-P_{\\text{saturated water vapour}}',
    exampleProblem: {
      question: 'Gas is collected over water at $755\\text{ mmHg}$ when water-vapour pressure is $25\\text{ mmHg}$. Find dry-gas pressure.',
      quickSolve: '$P_{gas}=755-25=730\\text{ mmHg}=730/760\\text{ atm}$.',
    },
  },
  'sig-graham-diffusion': {
    gradeBand: 'Grade 11',
    topic: 'Kinetic Theory · Graham Diffusion',
    problemSignal: 'Two gases are compared by diffusion-rate ratio or by times for the same volume to pass through an opening.',
    threeSecondRule: 'Rate is inversely proportional to square-root molar mass; time is directly proportional. Heavier gases move more slowly.',
    firstStepFormula: '\\frac{r_1}{r_2}=\\frac{t_2}{t_1}=\\sqrt{\\frac{M_2}{M_1}}',
    exampleProblem: {
      question: 'An unknown gas needs 40 s while methane with molar mass 16 needs 20 s for the same diffusion volume. Find the unknown molar mass.',
      quickSolve: '$40/20=2=\\sqrt{M_x/16}$, so $M_x=64$.',
    },
  },
  'sig-colligative-freezing': {
    gradeBand: 'Grade 11',
    topic: 'Colligative Properties · Freezing-Point Molar Mass',
    problemSignal: 'Solute mass, solvent mass, and freezing-point depression are given to find an unknown molar mass.',
    threeSecondRule: 'Use $\\Delta T_f=iK_fm$ directly; for a nonelectrolyte, $i=1$.',
    firstStepFormula: 'M_w=\\frac{iK_fW_{\\text{solute (g)}}}{\\Delta T_fW_{\\text{solvent (kg)}}}',
    exampleProblem: {
      question: '$3.6\\text{ g}$ nonelectrolyte in $100\\text{ g}$ water gives $\\Delta T_f=0.372^\\circ\\text C$, with $K_f=1.86$. Find molar mass.',
      quickSolve: '$M_w=1.86(3.6)/[0.372(0.100)]=180\\text{ g/mol}$.',
    },
  },
  'sig-vsepr-hybridization': {
    gradeBand: 'Grade 11',
    topic: 'Molecular Structure · VSEPR and Hybridization',
    problemSignal: 'A molecular formula is given and central-atom hybridization, bond angle, or geometry is required.',
    threeSecondRule: 'Count steric number: sigma bonds plus lone pairs. Two gives $sp$ linear, three $sp^2$ trigonal planar, and four $sp^3$ tetrahedral domains.',
    firstStepFormula: '\\text{SN}=\\frac12(\\text{central valence electrons}+\\text{monovalent ligands}-\\text{positive charge}+\\text{negative charge})',
    exampleProblem: {
      question: 'What are oxygen hybridization and molecular geometry in water?',
      quickSolve: 'Two bonds plus two lone pairs give SN 4 and $sp^3$ domains; the molecular shape is bent with angle about $104.5^\\circ$.',
    },
  },
  'sig-rate-law-half-life': {
    gradeBand: 'Grade 11',
    topic: 'Kinetics · Constant First-Order Half-Life',
    problemSignal: 'Each halving of reactant concentration takes the same time; find reaction order, rate constant, or remaining fraction.',
    threeSecondRule: 'A concentration-independent half-life identifies first order: $t_{1/2}=0.693/k$.',
    firstStepFormula: 'r=k[A],\\quad t_{1/2}=\\frac{\\ln2}{k}=\\frac{0.693}{k}',
    exampleProblem: {
      question: 'A decomposition has constant half-life 10 minutes. What fraction remains after 30 minutes?',
      quickSolve: 'Three half-lives leave $(1/2)^3=1/8=12.5\\%$.',
    },
  },
  'sig-weak-acid-ph': {
    gradeBand: 'Grade 12',
    topic: 'Acid-Base Equilibrium · Weak-Acid Square Root',
    problemSignal: 'A monoprotic weak-acid concentration $C_0$ and $K_a$ are given; find $[H^+]$ or pH.',
    threeSecondRule: 'When $C_0/K_a\\ge400$, use $[H^+]=\\sqrt{C_0K_a}$ directly.',
    firstStepFormula: '[H^+]=\\sqrt{C_0K_a}\\implies pH=\\frac12(pK_a-\\log C_0)',
    exampleProblem: {
      question: 'Find pH of $0.10\\text{ M}$ acetic acid with $K_a=1.0\\times10^{-5}$.',
      quickSolve: '$[H^+]=\\sqrt{0.10(10^{-5})}=10^{-3}\\text{ M}$, so pH is 3.0.',
    },
  },
  'sig-buffer-henderson': {
    gradeBand: 'Grade 12',
    topic: 'Acid-Base Titration · Buffer Half-Equivalence',
    problemSignal: 'A weak acid is half-neutralized by strong base, or equal amounts of weak acid and its salt are mixed.',
    threeSecondRule: 'At half-equivalence, acid and conjugate base concentrations are equal, so pH equals pKa.',
    firstStepFormula: 'pH=pK_a+\\log\\frac{[A^-]}{[HA]}\\xrightarrow{[A^-]=[HA]}pH=pK_a',
    exampleProblem: {
      question: 'Equal volumes of $0.10\\text{ M}$ acetic acid with $pK_a=4.74$ and $0.05\\text{ M NaOH}$ are mixed. Find pH.',
      quickSolve: 'The acid is half-neutralized, so remaining acid equals acetate formed and pH is 4.74.',
    },
  },
  'sig-cell-potential': {
    gradeBand: 'Grade 12',
    topic: 'Electrochemistry · Standard Cell Potential',
    problemSignal: 'Two standard reduction potentials are given; find the emf of a galvanic cell.',
    threeSecondRule: 'Larger reduction potential is the positive cathode. Subtract the smaller anode value from the larger cathode value.',
    firstStepFormula: 'E^\\circ_{cell}=E^\\circ_{red,cathode}-E^\\circ_{red,anode}',
    exampleProblem: {
      question: '$E^\\circ(Cu^{2+}/Cu)=+0.34\\text V$ and $E^\\circ(Zn^{2+}/Zn)=-0.76\\text V$. Find standard cell emf.',
      quickSolve: '$E^\\circ_{cell}=0.34-(-0.76)=1.10\\text V$.',
    },
  },
  'sig-faraday-electrolysis': {
    gradeBand: 'Grade 12',
    topic: 'Electrolysis · Faraday\'s Law',
    problemSignal: 'Current and electrolysis time are given; find deposited metal mass or gas volume.',
    threeSecondRule: 'Divide $It$ by 96500 to get electron moles, then divide by electrons transferred per product and convert units.',
    firstStepFormula: 'n(e^-)=\\frac{It}{96500},\\quad W=\\frac{n(e^-)}{n_{\\text{transferred}}}M_w',
    exampleProblem: {
      question: '$9.65\\text A$ passes through copper sulfate for 1000 s. How much copper of molar mass 63.5 deposits?',
      quickSolve: '$n(e^-)=0.10\\text{ mol}$, so $n(Cu)=0.050\\text{ mol}$ and mass is $3.18\\text g$.',
    },
  },
}
