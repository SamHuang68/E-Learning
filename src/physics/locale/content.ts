import type { UiLocale } from '../../i18n/locale'
import type {
  PhysicsFormulaSheetSection,
  PhysicsGradeInfo,
  PhysicsQuestion,
  PhysicsUnit,
} from '../data/curriculum'
import type { PhysicsMockExam } from '../data/mockExams'
import type { PhysicsSolvingSignal } from '../data/solvingSignals'

type QuestionCopy = Pick<
  PhysicsQuestion,
  'title' | 'question' | 'options' | 'solution' | 'hint' | 'competency'
>

type UnitCopy = Pick<PhysicsUnit, 'title' | 'subtitle' | 'concepts'>

type GradeCopy = Pick<PhysicsGradeInfo, 'band' | 'description' | 'targetExam'> & {
  labs: Record<string, { name: string; description: string }>
}

type MockCopy = Pick<PhysicsMockExam, 'title' | 'subtitle' | 'targetExam' | 'description'>

type SignalCopy = Pick<
  PhysicsSolvingSignal,
  'gradeBand' | 'topic' | 'problemSignal' | 'threeSecondRule' | 'firstStepFormula'
> & { exampleProblem: PhysicsSolvingSignal['exampleProblem'] }

const PHYSICS_GRADE_EN: Record<string, GradeCopy> = {
  g7: {
    band: 'Junior high foundation',
    description: 'Length and volume measurement with error estimates; mass, density, and flotation; temperature, specific heat, and heat transfer.',
    targetExam: 'Comprehensive Assessment Program (CAP)',
    labs: {
      'lab-j7-measurement': { name: 'Graduated Cylinder and Displacement Lab', description: 'Measure irregular-solid volume by water displacement and practise estimated readings.' },
      'lab-j7-density': { name: 'Mass-Volume Density Lab', description: 'Measure liquid and metal densities and plot straight-line mass-volume graphs.' },
      'lab-j7-specific-heat': { name: 'Specific Heat and Thermal Equilibrium Simulator', description: 'Visualize thermal equilibrium as liquids with different masses and initial temperatures mix.' },
    },
  },
  g8: {
    band: 'Junior high intermediate',
    description: 'Wave speed and echoes; reflection, refraction, and lens imaging; Hooke\'s law and force balance; fluid pressure, atmospheric pressure, and buoyancy.',
    targetExam: 'Comprehensive Assessment Program (CAP)',
    labs: {
      'lab-j8-sound-wave': { name: 'Sound Amplitude, Frequency, and Oscilloscope', description: 'Adjust pitch and loudness while observing the waveform and decibel level.' },
      'lab-j8-lens-optics': { name: 'Convex-Lens Optical Bench', description: 'Move a candle to observe real images on a screen and virtual magnified images.' },
      'lab-j8-hooke-law': { name: 'Spring Extension and Hooke\'s Law', description: 'Hang different masses to verify that force is proportional to extension.' },
      'lab-j8-buoyancy-pressure': { name: 'Archimedes Buoyancy and Fluid Pressure', description: 'Calculate displaced volume, buoyancy, and pressure at different depths.' },
    },
  },
  g9: {
    band: 'Junior high review',
    description: 'Linear motion and acceleration; Newton\'s laws; work and mechanical-energy conservation; Ohm\'s law and magnetic effects of current.',
    targetExam: 'Comprehensive Assessment Program (CAP)',
    labs: {
      'lab-j9-linear-motion': { name: 'Ticker Tape and Velocity-Time Analysis', description: 'Convert cart ticker-tape spacing into acceleration and velocity-time graphs.' },
      'lab-j9-newton-laws': { name: 'Newton\'s Second Law Air Track', description: 'Change force and mass to verify the proportional relationship with acceleration.' },
      'lab-j9-work-energy': { name: 'Pendulum, Incline, and Mechanical Energy', description: 'Visualize kinetic-potential energy conversion and mechanical efficiency.' },
      'lab-j9-circuit-magnetism': { name: 'Basic Circuits and Ampere\'s Rule', description: 'Read meters in series and parallel circuits and predict compass deflection.' },
    },
  },
  g10: {
    band: 'Senior high required',
    description: 'Scientific methods, matter and the four fundamental interactions, laws of motion, electromagnetism, energy and microscopic thermal phenomena, and quantum technology.',
    targetExam: 'General Scholastic Ability Test (GSAT)',
    labs: {
      'lab-measurement-error': { name: 'Measurement and Error Analysis Lab', description: 'Read vernier calipers and micrometers and apply significant figures.' },
      'lab-fundamental-forces': { name: 'Four Fundamental Interactions', description: 'Compare strong and weak interactions at nuclear scales with gravity and electromagnetism at macroscopic scales.' },
      'lab-newton-motion': { name: 'Newtonian Motion and Velocity-Time Graphs', description: 'Adjust initial velocity and force while visualizing velocity-time graphs and displacement area.' },
      'lab-faraday-induction': { name: 'Faraday Induction and Lenz\'s Law Lab', description: 'Analyze induced-current direction and magnetic flux as a magnet passes through a coil.' },
      'lab-energy-conservation': { name: 'Pendulum and Mechanical-Energy Conservation', description: 'Track potential and kinetic energy with live energy bars.' },
      'lab-photoelectric-intro': { name: 'Photoelectric Effect Introduction', description: 'Adjust intensity and wavelength to observe electron emission and stopping voltage.' },
    },
  },
  g11: {
    band: 'Senior high elective',
    description: 'Linear and projectile motion, Newtonian dynamics, rigid-body equilibrium and torque, momentum and collisions, orbital mechanics, work and SHM, waves, and the Doppler effect.',
    targetExam: 'Advanced Subjects Test (AST) / Grade 11 advanced',
    labs: {
      'lab-projectile-motion': { name: 'Projectile Trajectory and Range Simulator', description: 'Adjust launch angle and speed to observe maximum height, flight time, and range.' },
      'lab-atwood-machine': { name: 'Atwood Machine and Connected Bodies', description: 'Visualize system acceleration, rope tension, and isolated free-body diagrams.' },
      'lab-torque-equilibrium': { name: 'Rigid-Body Equilibrium and Torque Pivot Lab', description: 'Choose a reference pivot and verify zero net force and zero net torque.' },
      'lab-collision-cart': { name: 'One-Dimensional Collision Air Track', description: 'Calculate final velocities and kinetic-energy loss for elastic and perfectly inelastic collisions.' },
      'lab-orbital-mechanics': { name: 'Gravity and Satellite-Orbit Simulator', description: 'Explore circular speed, escape speed, elliptical orbits, and Kepler\'s laws.' },
      'lab-shm-oscillation': { name: 'Spring SHM Phase Plot', description: 'View sinusoidal displacement, velocity, acceleration, and the phase-space trajectory.' },
      'lab-standing-waves': { name: 'String and Air-Column Resonance Lab', description: 'Adjust harmonic number and boundary conditions to observe nodes and antinodes.' },
    },
  },
  g12: {
    band: 'Senior high elective',
    description: 'Thermal physics and kinetic theory; geometric and physical optics; electrostatics, potential, and capacitance; DC circuits; magnetic effects and motional emf; atomic structure and matter waves.',
    targetExam: 'Advanced Subjects Test (AST)',
    labs: {
      'lab-gas-kinetics': { name: 'Kinetic-Theory 3D Collision Box', description: 'Explore molecular-speed distributions, the Maxwell distribution, and rms speed versus temperature.' },
      'lab-double-slit-interference': { name: 'Double-Slit Interference and Single-Slit Diffraction', description: 'Control wavelength, slit width, and screen distance to change the fringe-intensity pattern.' },
      'lab-electric-field-mapping': { name: 'Equipotential and Electric-Field Mapping', description: 'Map electric-field vectors and potential around point charges and parallel plates.' },
      'lab-kirchhoff-circuit': { name: 'Complex DC Kirchhoff Solver', description: 'Analyze node voltages and branch currents in multi-source, multi-loop circuits.' },
      'lab-cyclotron-lorentz': { name: 'Cyclotron and Lorentz-Force Chamber', description: 'Observe helical and circular motion of charged particles in uniform electric and magnetic fields.' },
      'lab-bohr-hydrogen-model': { name: 'Bohr Hydrogen Spectrum Lab', description: 'Connect electron transitions, photon wavelengths, and emission lines.' },
    },
  },
}

const PHYSICS_UNIT_EN: Record<string, UnitCopy> = {
  g7_u1: {
    title: 'Length and Volume Measurement with Experimental Error',
    subtitle: 'Smallest-scale readings, estimated digits, and water displacement',
    concepts: [
      'Report a measurement as $\\text{measured value} = \\text{certain digits} + \\text{one estimated digit}$. The estimated digit is one place beyond the instrument\'s smallest division.',
      'Measure an irregular object by water displacement: $V = V_2 - V_1$. The object must sink and must not dissolve in water.',
      'For repeated measurements, remove clear outliers and take the arithmetic mean to reduce random error.',
    ],
  },
  g7_u2: {
    title: 'Mass, Density, and Material Properties',
    subtitle: 'Balance operation, density calculations, and floating or sinking',
    concepts: [
      'Density is $D = \\frac{M}{V}$, in $\\text{g/cm}^3$ or $\\text{kg/m}^3$, with $1\\text{ g/cm}^3 = 1000\\text{ kg/m}^3$.',
      'A uniform substance has constant density at fixed temperature and pressure. Its $M-V$ graph is a line through the origin whose slope is $D$.',
      'An object sinks if $D_{\\text{obj}} > D_{\\text{liq}}$, remains suspended if they are equal, and floats if $D_{\\text{obj}} < D_{\\text{liq}}$.',
    ],
  },
  g7_u3: {
    title: 'Temperature, Specific Heat, and Heat Transfer',
    subtitle: 'The equation H = msΔT, thermal equilibrium, and three transfer mechanisms',
    concepts: [
      'Heat is $H = m \\cdot s \\cdot \\Delta T$, where $H$ is in $\\text{cal}$, $m$ in grams, and $s$ in $\\text{cal/(g}\\cdot^\\circ\\text{C)}$; water has $s=1.0$.',
      'In an insulated system, heat released by the hotter object equals heat absorbed by the cooler object: $H_{\\text{released}} = H_{\\text{absorbed}}$.',
      'Heat transfer occurs by: 1. conduction, mainly through solids; 2. convection in fluids, where warm fluid rises and cool fluid sinks; and 3. radiation, which needs no medium and can cross a vacuum.',
    ],
  },
  g8_u1: {
    title: 'Wave Properties and Sound Propagation',
    subtitle: 'Wave speed v = fλ, echo ranging, and three properties of sound',
    concepts: [
      'The basic wave relation is $v = f\\lambda = \\frac{\\lambda}{T}$. A wave carries energy and its shape; particles of the medium oscillate locally.',
      'Sound is a mechanical wave and requires a medium. It cannot travel through a vacuum. Sound is generally fastest in solids, then liquids, then gases; in air $v \\approx 331 + 0.6T$.',
      'The three perceptual properties are: loudness, set by amplitude and measured in dB; pitch, set by frequency in Hz; and timbre, set by waveform. Human hearing is about $20\\sim 20000\\text{ Hz}$.',
    ],
  },
  g8_u2: {
    title: 'Reflection, Refraction, and Lens Imaging',
    subtitle: 'Reflection laws, refraction direction, convex-lens images, and vision correction',
    concepts: [
      'For reflection, the angle of incidence equals the angle of reflection, and the incident ray, reflected ray, and normal lie in one plane. A plane mirror forms an upright, same-size, symmetric virtual image.',
      'A ray entering water or glass obliquely from air bends toward the normal; on leaving for air it bends away from the normal.',
      'For a convex lens: $p>2f$ gives a reduced inverted real image; $p=2f$ gives a same-size inverted real image; $f<p<2f$ gives a magnified inverted real image; and $p<f$ gives a magnified upright virtual image.',
      'Myopia is corrected with a diverging lens because the image forms before the retina; hyperopia is corrected with a converging lens because the image would form behind the retina.',
    ],
  },
  g8_u3: {
    title: 'Forces, Hooke\'s Law, and Two-Force Equilibrium',
    subtitle: 'Spring extension, equilibrium conditions, and friction',
    concepts: [
      'Within the elastic limit, spring force is proportional to extension: $F = k\\Delta x$, where $\\Delta x = L-L_0$ rather than the total length.',
      'Two forces balance when they have equal magnitude, opposite direction, the same line of action, and act on the same object. The net force is zero.',
      'Greater roughness or normal force raises maximum static friction. While an object remains at rest, $f_s=F_{\\text{push}}$ up to its limit; kinetic friction is approximately constant.',
    ],
  },
  g8_u4: {
    title: 'Fluid Pressure, Atmospheric Pressure, and Buoyancy',
    subtitle: 'Pressure P = hd, Torricelli\'s experiment, and Archimedes\' principle',
    concepts: [
      'Solid pressure is $P = \\frac{F}{A}$, measured in $\\text{gw/cm}^2$ or pascals, $\\text{Pa}=\\text{N/m}^2$.',
      'Hydrostatic pressure is $P=hD$, where $h$ is vertical depth and $D$ is liquid density. It acts in all directions normal to a surface.',
      'Atmospheric pressure is $1\\text{ atm}=76\\text{ cm-Hg}=1033.6\\text{ gw/cm}^2\\approx1013\\text{ hPa}$, as in Torricelli\'s mercury-column experiment.',
      'Archimedes\' principle states that buoyancy equals the weight of displaced fluid: $B=V_{\\text{disp}}D_{\\text{liq}}$. A floating object has $B=W$; an immersed object has apparent weight $W\'=W-B$.',
    ],
  },
  g9_u1: {
    title: 'Linear Motion, Velocity, and Acceleration',
    subtitle: 'Position-time and velocity-time graphs with constant acceleration',
    concepts: [
      'Average velocity and acceleration are $\\bar v=\\frac{\\Delta x}{\\Delta t}$ and $\\bar a=\\frac{\\Delta v}{\\Delta t}$.',
      'The slope of an $x-t$ graph is velocity; the slope of a $v-t$ graph is acceleration; and area between a $v-t$ graph and the time axis is displacement.',
      'A ticker timer makes points at fixed intervals $T$. Increasing spacing indicates acceleration; equal spacing indicates constant speed.',
    ],
  },
  g9_u2: {
    title: 'Newton\'s Laws of Motion and Gravity',
    subtitle: 'Newton\'s three laws, action-reaction pairs, and gravitation',
    concepts: [
      'Newton\'s first law: when net force is zero, an object remains at rest or moves with constant velocity in a straight line.',
      'Newton\'s second law is $F_{\\text{net}}=ma$, with $1\\text{ N}=1\\text{ kg}\\cdot\\text{m/s}^2$ and $1\\text{ kgw}\\approx9.8\\text{ N}$.',
      'Newton\'s third law: action and reaction are equal, opposite, collinear, simultaneous forces on different objects, so they do not cancel on one free-body diagram.',
    ],
  },
  g9_u3: {
    title: 'Work, Power, and Mechanical-Energy Conservation',
    subtitle: 'Work W = Fs, kinetic-potential conversion, and simple machines',
    concepts: [
      'For force parallel to displacement, $W=Fs$ and $1\\text{ J}=1\\text{ N}\\cdot\\text{m}$. A perpendicular force does no work.',
      'Power is work per unit time: $P=\\frac{W}{t}$, measured in watts, $\\text{W}=\\text{J/s}$.',
      'Kinetic and gravitational potential energies are $E_k=\\frac12mv^2$ and $U=mgh$. Without nonconservative resistance, $E_k+U$ is constant.',
      'Simple machines include levers, $F_1d_1=F_2d_2$, and movable pulleys, which halve force but double distance and do not save work.',
    ],
  },
  g9_u4: {
    title: 'Electrostatics, Basic Circuits, and Magnetic Effects of Current',
    subtitle: 'Ohm\'s law V = IR, series-parallel circuits, power, and the right-hand rule',
    concepts: [
      'Ohm\'s law is $V=IR$, where $V$ is voltage, $I$ current, and $R$ resistance.',
      'In series, current is equal, resistances add, and voltage drops add. In parallel, branch voltages are equal, currents add, and $\\frac1R=\\frac1{R_1}+\\frac1{R_2}$.',
      'Electric power is $P=IV=I^2R=\\frac{V^2}{R}$. One kilowatt-hour is $3.6\\times10^6\\text{ J}$.',
      'A current produces a circular magnetic field around a straight wire. Use the right-hand grip rule for wires and solenoids and the right-hand palm rule for magnetic force.',
    ],
  },
  g10_u1: {
    title: 'Scientific Practice and Measurement of Matter',
    subtitle: 'SI base units, order-of-magnitude estimates, and experimental error',
    concepts: [
      'The seven SI base units are metre ($\\text m$), kilogram ($\\text{kg}$), second ($\\text s$), ampere ($\\text A$), kelvin ($\\text K$), mole ($\\text{mol}$), and candela ($\\text{cd}$).',
      'For $a\\times10^n$, the order of magnitude is $10^n$ if $a<\\sqrt{10}\\approx3.162$, and $10^{n+1}$ otherwise.',
      'Systematic errors arise from calibration or method bias; random errors arise from fluctuating conditions and estimated readings. Apply significant-figure rules.',
    ],
  },
  g10_u2: {
    title: 'Composition of Matter and Fundamental Interactions',
    subtitle: 'Nuclear structure, the quark model, and four fundamental forces',
    concepts: [
      'Matter is organized from atoms ($\\sim10^{-10}\\text{ m}$) to nuclei ($\\sim10^{-15}\\text{ m}$), nucleons, and quarks. An up quark has $+2/3e$, a down quark $-1/3e$; a proton is $uud$ and a neutron $udd$.',
      'The four interactions are gravity, a long-range force governing celestial motion; electromagnetism, governing atoms, bonds, and contact forces; the short-range strong interaction binding quarks and nuclei; and the very-short-range weak interaction governing beta decay and stellar fusion.',
    ],
  },
  g10_u3: {
    title: 'Motion and Newton\'s Laws',
    subtitle: 'Constant acceleration, velocity-time graphs, and universal gravitation',
    concepts: [
      'The slope of an $x-t$ graph is instantaneous velocity; the slope of a $v-t$ graph is acceleration; and area under a $v-t$ graph is displacement.',
      'Constant-acceleration equations: 1. $v=v_0+at$; 2. $\\Delta x=v_0t+\\frac12at^2$; 3. $v^2=v_0^2+2a\\Delta x$.',
      'Newton\'s laws connect force and motion; Kepler\'s third law gives $\\frac{T^2}{R^3}=\\text{constant}$.',
    ],
  },
  g10_u4: {
    title: 'Unification of Electricity, Magnetism, and Light',
    subtitle: 'Magnetic effects, Faraday induction, and the electromagnetic spectrum',
    concepts: [
      'Faraday\'s law is $\\mathcal E=-N\\frac{\\Delta\\Phi_B}{\\Delta t}$.',
      'Lenz\'s law: the induced current creates a magnetic field that opposes the change in magnetic flux.',
      'The electromagnetic spectrum runs radio, microwave, infrared, visible, ultraviolet, X ray, and $\\gamma$ ray; all travel at $c$ in vacuum.',
    ],
  },
  g10_u5: {
    title: 'Forms of Energy and Microscopic Thermal Phenomena',
    subtitle: 'Work-energy, mechanical-energy conservation, mass-energy equivalence, and thermal concepts',
    concepts: [
      'When only gravity or an elastic force does work, mechanical energy is conserved: $E_{\\text{total}}=E_k+U=\\text{constant}$.',
      'Mass-energy equivalence is $E=mc^2$ or $\\Delta E=\\Delta m\\,c^2$.',
      'Temperature is the macroscopic expression of average molecular kinetic energy; $1\\text{ cal}\\approx4.186\\text{ J}$.',
    ],
  },
  g10_u6: {
    title: 'Quantum Phenomena and Modern Technology',
    subtitle: 'Photons, the photoelectric effect, atomic spectra, and semiconductor devices',
    concepts: [
      'Photon energy is $E=h\\nu=\\frac{hc}{\\lambda}$; intensity sets photon count, while frequency sets energy per photon.',
      'Hydrogen levels are $E_n=-\\frac{13.6}{n^2}\\text{ eV}$, and a transition emits or absorbs $h\\nu=E_2-E_1$.',
      'Modern materials include P-N diodes, LEDs for electro-optical conversion, and superconductors with the Meissner effect.',
    ],
  },
  g11_u1: {
    title: 'Linear Motion and Projectile Motion',
    subtitle: 'Constant acceleration, two-dimensional components, and projectile trajectories',
    concepts: [
      'For launch angle $\\theta$: $T=\\frac{2v_0\\sin\\theta}{g}$, $H=\\frac{(v_0\\sin\\theta)^2}{2g}$, and $R=\\frac{v_0^2\\sin(2\\theta)}{g}$.',
      'A horizontal projectile follows $y=\\frac{g}{2v_0^2}x^2$.',
    ],
  },
  g11_u2: {
    title: 'Newtonian Dynamics',
    subtitle: 'Friction, inclined planes, connected bodies, and inertial forces',
    concepts: [
      'For connected bodies, $a=\\frac{\\text{net external driving force}}{\\text{total system mass}}$; then isolate one body to find internal tension.',
      'In an accelerating frame, the effective gravitational field is $\\vec g_{\\text{eff}}=\\vec g-\\vec a$.',
    ],
  },
  g11_u3: {
    title: 'Static Equilibrium and Torque',
    subtitle: 'Torque, rotational equilibrium, center of mass, sliding, and tipping',
    concepts: [
      'Rigid-body equilibrium requires $\\sum\\vec F=0$ and $\\sum\\vec\\tau=0$.',
      'Sliding on an incline begins when $\\tan\\theta>\\mu_s$; tipping begins when the line of action of weight crosses the support edge.',
    ],
  },
  g11_u4: {
    title: 'Momentum Conservation and Collisions',
    subtitle: 'Impulse-momentum, center-of-mass motion, and one-dimensional collisions',
    concepts: [
      'Momentum conservation is $\\sum\\vec p_i=\\sum\\vec p_f$.',
      'For a one-dimensional elastic collision, $v_1\'=\\frac{m_1-m_2}{m_1+m_2}v_1+\\frac{2m_2}{m_1+m_2}v_2$ and $v_1-v_2=-(v_1\'-v_2\')$.',
    ],
  },
  g11_u5: {
    title: 'Universal Gravitation and Orbital Motion',
    subtitle: 'Fields, potential energy, circular satellites, binding energy, and escape speed',
    concepts: [
      'For a circular orbit, $E_k:U:E=1:-2:-1$, where $E_k=\\frac{GMm}{2r}$, $U=-\\frac{GMm}{r}$, and $E=-\\frac{GMm}{2r}$.',
      'Escape speed is $v_{\\text{esc}}=\\sqrt{\\frac{2GM}{R}}=\\sqrt2v_{\\text{orbit}}$.',
    ],
  },
  g11_u6: {
    title: 'Work, Energy, and Simple Harmonic Motion',
    subtitle: 'Conservative forces, spring oscillators, pendulum period, and energy conservation',
    concepts: [
      'The SHM period is $T=2\\pi\\sqrt{\\frac{m}{k}}$; a simple pendulum has $T=2\\pi\\sqrt{\\frac{L}{g}}$.',
      'SHM conserves $E=\\frac12mv^2+\\frac12kx^2=\\frac12kA^2$.',
    ],
  },
  g11_u7: {
    title: 'Waves, Sound, and the Doppler Effect',
    subtitle: 'Superposition, standing waves, resonance, and Doppler frequency',
    concepts: [
      'Adjacent nodes in a standing wave are separated by $\\frac{\\lambda}{2}$.',
      'The Doppler relation is $f\'=f\\left(\\frac{v\\pm v_O}{v\\mp v_S}\\right)$.',
    ],
  },
  g12_u1: {
    title: 'Thermal Physics and Kinetic Theory',
    subtitle: 'Ideal gases, rms speed, molecular energy, and the first law',
    concepts: [
      'Kinetic theory gives $\\bar E_k=\\frac32k_BT$ and $v_{\\text{rms}}=\\sqrt{\\frac{3RT}{M}}$.',
      'The first law of thermodynamics is $Q=\\Delta U+W$.',
    ],
  },
  g12_u2: {
    title: 'Geometric and Physical Optics',
    subtitle: 'Refraction, total internal reflection, lenses, interference, and diffraction',
    concepts: [
      'Double-slit fringe spacing is $\\Delta y=\\frac{\\lambda L}{d}$.',
      'The width of the central maximum for a single slit is $W_0=\\frac{2\\lambda L}{b}$.',
    ],
  },
  g12_u3: {
    title: 'Electrostatics, Electric Fields, and Potential',
    subtitle: 'Coulomb\'s law, charged-particle motion, potential energy, and capacitance',
    concepts: [
      'Work through a potential difference changes kinetic energy by $E_k=qV$.',
      'A parallel-plate capacitor stores $U_C=\\frac12CV^2=\\frac{Q^2}{2C}$.',
    ],
  },
  g12_u4: {
    title: 'Current, Resistance, and DC Circuits',
    subtitle: 'Microscopic current, resistivity, Kirchhoff\'s laws, and RC transients',
    concepts: [
      'Kirchhoff\'s laws are $\\sum I_{\\text{in}}=\\sum I_{\\text{out}}$ and $\\sum\\Delta V=0$.',
      'An RC circuit has time constant $\\tau=RC$.',
    ],
  },
  g12_u5: {
    title: 'Magnetic Effects of Current and Electromagnetic Induction',
    subtitle: 'Lorentz-force orbits, forces on wires, Faraday induction, and motional emf',
    concepts: [
      'A charged particle in a magnetic field has $R=\\frac{mv}{qB}=\\frac{p}{qB}$ and $T=\\frac{2\\pi m}{qB}$.',
      'Motional emf is $\\mathcal E=BLv$.',
    ],
  },
  g12_u6: {
    title: 'Atomic Structure and Modern Quantum Physics',
    subtitle: 'Blackbody radiation, the photoelectric equation, the Bohr model, and matter waves',
    concepts: [
      'Einstein\'s photoelectric equation is $h\\nu=W+eV_s$.',
      'The de Broglie wavelength is $\\lambda=\\frac hp=\\frac{h}{\\sqrt{2mE_k}}$.',
    ],
  },
}

const PHYSICS_QUESTION_EN: Record<string, QuestionCopy> = {
  g7_u1_q1: {
    title: 'Ruler Reading and Smallest Division',
    question: 'A student records a pencil length as $15.48\\text{ cm}$. What is the ruler\'s smallest scale division?',
    options: ['A. 1 metre', 'B. 1 centimetre', 'C. 1 millimetre (0.1 cm)', 'D. 0.01 centimetre'],
    solution: 'Solution: In $15.48\\text{ cm}$, $15.4\\text{ cm}$ is certain and the final digit 8 is estimated. The smallest division is therefore the preceding place, $0.1\\text{ cm}=1\\text{ mm}$. Choose C.',
    hint: 'The final digit is estimated; the preceding place is the smallest division.',
    competency: 'J-A1: Read instrument scales correctly and record one estimated digit.',
  },
  g7_u2_q1: {
    title: 'Mass-Volume Graph and Density',
    question: 'A graduated cylinder plus liquid has mass $54\\text{ g}$ at $V=30\\text{ cm}^3$ and $70\\text{ g}$ at $V=50\\text{ cm}^3$. Find the liquid density and the empty-cylinder mass.',
    options: ['A. $D=0.8\\text{ g/cm}^3$; cylinder $30\\text{ g}$', 'B. $D=1.0\\text{ g/cm}^3$; cylinder $24\\text{ g}$', 'C. $D=0.8\\text{ g/cm}^3$; cylinder $24\\text{ g}$', 'D. $D=1.2\\text{ g/cm}^3$; cylinder $18\\text{ g}$'],
    solution: 'Solution: $\\Delta V=20\\text{ cm}^3$ and $\\Delta M=16\\text{ g}$, so $D=\\frac{16}{20}=0.8\\text{ g/cm}^3$. The empty-cylinder mass is $54-30(0.8)=30\\text{ g}$. Choose A.',
    hint: 'The slope $\\Delta M/\\Delta V$ is the liquid density; subtract the liquid mass to get the container mass.',
    competency: 'J-B1: Use linear equations and data to separate container mass from liquid density.',
  },
  g7_u3_q1: {
    title: 'Final Temperature at Thermal Equilibrium',
    question: 'Mix $100\\text{ g}$ of water at $80^\\circ\\text C$ with $200\\text{ g}$ at $20^\\circ\\text C$ in an insulated cup. With no heat loss, what is the equilibrium temperature?',
    options: ['A. $30^\\circ\\text C$', 'B. $40^\\circ\\text C$', 'C. $50^\\circ\\text C$', 'D. $60^\\circ\\text C$'],
    solution: 'Solution: Let the final temperature be $T$. Heat lost equals heat gained: $100(80-T)=200(T-20)$. Thus $3T=120$ and $T=40^\\circ\\text C$. Choose B.',
    hint: 'Set heat lost equal to heat gained: $m_1(T_1-T)=m_2(T-T_2)$.',
    competency: 'J-A2: Build and solve a thermal-equilibrium equation.',
  },
  g8_u1_q1: {
    title: 'Echo Distance from Time Delay',
    question: 'A person hears an echo $1.2\\text{ s}$ after firing a starting pistol toward a cliff. If sound speed is $340\\text{ m/s}$, how far away is the cliff?',
    options: ['A. 170 m', 'B. 204 m', 'C. 340 m', 'D. 408 m'],
    solution: 'Solution: The echo covers the round trip, so $2d=vt=340(1.2)=408\\text{ m}$ and $d=204\\text{ m}$. Choose B.',
    hint: 'An echo travels twice the one-way distance: $d=vt/2$.',
    competency: 'J-B2: Use reflection and constant-speed motion to calculate distance.',
  },
  g8_u2_q1: {
    title: 'Convex-Lens Image from Object Distance',
    question: 'A convex lens has focal length $10\\text{ cm}$. A candle is $15\\text{ cm}$ in front of it. What kind of image appears on a screen on the other side?',
    options: ['A. Reduced inverted real image', 'B. Magnified inverted real image', 'C. Magnified upright virtual image', 'D. Reduced upright virtual image'],
    solution: 'Solution: $f=10\\text{ cm}$ and $2f=20\\text{ cm}$. Since $f<p<2f$, the image forms beyond $2f$ and is real, inverted, and magnified. Choose B.',
    hint: 'When $f<p<2f$, the image is real, inverted, and magnified.',
    competency: 'J-A3: Relate lens-image properties to object position and optical devices.',
  },
  g8_u3_q1: {
    title: 'Spring Extension with Hooke\'s Law',
    question: 'A spring is initially $12\\text{ cm}$ long and becomes $15\\text{ cm}$ with a $30\\text{ gw}$ load. Within the elastic limit, what is its total length with $50\\text{ gw}$?',
    options: ['A. 16 cm', 'B. 17 cm', 'C. 18 cm', 'D. 20 cm'],
    solution: 'Solution: The $30\\text{ gw}$ load produces $3\\text{ cm}$ extension, or $1\\text{ cm}$ per $10\\text{ gw}$. A $50\\text{ gw}$ load gives $5\\text{ cm}$ extension, so the total length is $12+5=17\\text{ cm}$. Choose B.',
    hint: 'Force is proportional to extension, not total length.',
    competency: 'J-A4: Apply Hooke\'s-law proportions to spring deformation.',
  },
  g8_u4_q1: {
    title: 'Buoyancy and Apparent Weight',
    question: 'A metal block of volume $100\\text{ cm}^3$ and mass $350\\text{ g}$ is fully submerged in water of density $1\\text{ g/cm}^3$. What does the supporting spring scale read?',
    options: ['A. 100 gw', 'B. 250 gw', 'C. 350 gw', 'D. 450 gw'],
    solution: 'Solution: The displaced volume is $100\\text{ cm}^3$, so $B=100(1)=100\\text{ gw}$. The apparent weight is $W\'=350-100=250\\text{ gw}$. Choose B.',
    hint: 'Use $B=V_{\\text{disp}}D_{\\text{liq}}$ and $W\'=W-B$.',
    competency: 'J-B3: Combine Archimedes\' principle with force equilibrium.',
  },
  g9_u1_q1: {
    title: 'Acceleration and Displacement from a Velocity-Time Graph',
    question: 'A particle accelerates uniformly from $(0\\text{ s},0\\text{ m/s})$ to $(5\\text{ s},30\\text{ m/s})$ on a $v-t$ graph. Find its acceleration magnitude and displacement in 5 s.',
    options: ['A. $a=6\\text{ m/s}^2,\\Delta x=75\\text{ m}$', 'B. $a=6\\text{ m/s}^2,\\Delta x=150\\text{ m}$', 'C. $a=30\\text{ m/s}^2,\\Delta x=75\\text{ m}$', 'D. $a=5\\text{ m/s}^2,\\Delta x=100\\text{ m}$'],
    solution: 'Solution: $a=\\frac{30-0}{5}=6\\text{ m/s}^2$. Displacement is the triangular area, $\\Delta x=\\frac{5(30)}2=75\\text{ m}$. Choose A.',
    hint: 'Acceleration is slope; displacement is area under the graph.',
    competency: 'J-A5: Read slope and area on a velocity-time graph.',
  },
  g9_u2_q1: {
    title: 'Newton\'s Second Law Calculation',
    question: 'A constant horizontal force of $12\\text{ N}$ pushes a stationary $3\\text{ kg}$ block on a frictionless surface for $4\\text{ s}$. What is its final speed?',
    options: ['A. 4 m/s', 'B. 8 m/s', 'C. 16 m/s', 'D. 24 m/s'],
    solution: 'Solution: $a=F/m=12/3=4\\text{ m/s}^2$, so $v=v_0+at=0+4(4)=16\\text{ m/s}$. Choose C.',
    hint: 'First find $a=F/m$, then use $v=at$.',
    competency: 'J-B4: Combine Newton\'s second law with constant-acceleration motion.',
  },
  g9_u3_q1: {
    title: 'Mechanical-Energy Conservation in Free Fall',
    question: 'A $1\\text{ kg}$ ball is released from rest $20\\text{ m}$ above the ground. Take $g=10\\text{ m/s}^2$. What is its speed immediately before impact?',
    options: ['A. 10 m/s', 'B. 14.1 m/s', 'C. 20 m/s', 'D. 40 m/s'],
    solution: 'Solution: From $mgh=\\frac12mv^2$, $v=\\sqrt{2gh}=\\sqrt{2(10)(20)}=20\\text{ m/s}$. Choose C.',
    hint: 'All gravitational potential energy becomes kinetic energy: $v=\\sqrt{2gh}$.',
    competency: 'J-A6: Use mechanical-energy conservation to calculate speed.',
  },
  g9_u4_q1: {
    title: 'Ohm\'s Law and Series-Bulb Power',
    question: 'Bulbs A and B are rated $110\\text V,100\\text W$ and $110\\text V,50\\text W$. They are connected in series to a $110\\text V$ supply. Which is brighter?',
    options: ['A. Bulb A (100 W)', 'B. Bulb B (50 W)', 'C. They are equally bright', 'D. Both burn out'],
    solution: 'Solution: From $R=V^2/P$, $R_A=121\\,\\Omega$ and $R_B=242\\,\\Omega$. Series current is equal, and $P=I^2R$, so the higher-resistance 50 W bulb B dissipates more power. Choose B.',
    hint: 'Series current is equal; compare $P=I^2R$.',
    competency: 'J-B5: Use rated resistance and electric power to compare brightness.',
  },
  g10_u1_q1: {
    title: 'Identifying SI Base Units',
    question: 'Which choice contains only SI base units?',
    options: ['A. metre (m), newton (N), second (s)', 'B. kilogram (kg), metre (m), ampere (A)', 'C. joule (J), kelvin (K), mole (mol)', 'D. coulomb (C), kilogram (kg), candela (cd)'],
    solution: 'Solution: The seven base units are m, kg, s, A, K, mol, and cd. The newton, joule, and coulomb are derived units. Choose B.',
    hint: 'Recall the seven SI base units: m, kg, s, A, K, mol, cd.',
    competency: 'U-A1: Recognize base quantities and measurement standards.',
  },
  g10_u1_q2: {
    title: 'Order-of-Magnitude Estimate in Daily Life',
    question: 'An adult heart ejects about $70\\text{ mL}$ per beat at 72 beats per minute. Estimate the order of magnitude of total blood pumped over 80 years, in litres.',
    options: ['A. $10^6\\text L$', 'B. $10^7\\text L$', 'C. $10^8\\text L$', 'D. $10^9\\text L$'],
    solution: 'Solution: Annual beats are $72(60)(24)(365)\\approx3.78\\times10^7$. Over 80 years this is $3.03\\times10^9$ beats, pumping about $2.12\\times10^8\\text L$. Its order is $10^8\\text L$. Choose C.',
    hint: 'Find the minutes in 80 years, then multiply by $72(0.07\\text L)$ per minute.',
    competency: 'U-B1: Use scientific notation and order-of-magnitude estimates for real situations.',
  },
  g10_u2_q1: {
    title: 'Quark Composition and Charge Conservation',
    question: 'A proton is $uud$ and a neutron is $udd$. If an up quark has charge $+2/3e$, which statement about the down-quark charge and neutron charge is correct?',
    options: ['A. Down quark $-1/3e$; neutron charge 0', 'B. Down quark $+1/3e$; neutron charge $+1e$', 'C. Down quark $-2/3e$; neutron charge $-1e$', 'D. Down quark $+2/3e$; neutron charge $+2e$'],
    solution: 'Solution: For the proton, $+1e=2(+2/3e)+q_d$, so $q_d=-1/3e$. A neutron has $(+2/3e)+2(-1/3e)=0$. Choose A.',
    hint: 'A proton $uud$ has charge $+1e$; a neutron $udd$ has charge 0.',
    competency: 'U-A2: Use the quark model to describe subatomic structure.',
  },
  g10_u3_q1: {
    title: 'Area and Slope on a Velocity-Time Graph',
    question: 'An electric car accelerates uniformly from rest to $20\\text{ m/s}$ during the first $4\\text{ s}$, then remains at $20\\text{ m/s}$ through $t=10\\text{ s}$. What total distance does it travel?',
    options: ['A. 120 m', 'B. 140 m', 'C. 160 m', 'D. 200 m'],
    solution: 'Solution: The area under the $v-t$ graph is $\\frac12(4)(20)+(6)(20)=40+120=160\\text m$. Choose C.',
    hint: 'Area under a velocity-time graph is displacement.',
    competency: 'U-B3: Interpret and calculate quantities from velocity-time graphs.',
  },
  g10_u4_q1: {
    title: 'Induced-Current Direction from Lenz\'s Law',
    question: 'The north pole of a bar magnet moves rapidly downward toward a horizontal copper loop. Viewed from above, what is the induced-current direction and force direction?',
    options: ['A. Clockwise; downward repulsion', 'B. Counterclockwise; downward repulsion', 'C. Clockwise; upward attraction', 'D. Counterclockwise; upward attraction'],
    solution: 'Solution: The approaching north pole increases downward flux, so the loop creates an upward field to oppose the change. The current is counterclockwise from above, and the loop is repelled downward. Choose B.',
    hint: 'Oppose the flux increase, then use the right-hand grip rule.',
    competency: 'U-A3: Apply Lenz\'s law to induced current and force.',
  },
  g10_u5_q1: {
    title: 'Mass-Energy Conversion in Solar Fusion',
    question: 'The Sun loses $4.0\\times10^9\\text{ kg}$ of mass each second through fusion. With $c=3.0\\times10^8\\text{ m/s}$, how many joules are radiated per second? Enter scientific notation such as 3.6e26.',
    solution: 'Solution: $\\Delta E=\\Delta mc^2=(4.0\\times10^9)(3.0\\times10^8)^2=3.6\\times10^{26}\\text J$.',
    hint: 'Substitute into $E=mc^2$.',
    competency: 'U-C2: Apply mass-energy equivalence to nuclear energy.',
  },
  g10_u6_q1: {
    title: 'Intensity and Frequency in the Photoelectric Effect',
    question: 'Monochromatic light causes photoemission from a metal. If frequency stays fixed while intensity doubles, which statement is correct?',
    options: ['A. Maximum electron kinetic energy doubles', 'B. Electrons emitted per unit time double', 'C. The work function doubles', 'D. The stopping voltage doubles'],
    solution: 'Solution: Doubling intensity doubles the incident photon count and therefore the emission rate. Maximum kinetic energy and stopping voltage depend on frequency and remain unchanged. Choose B.',
    hint: 'Intensity controls photon count; frequency controls energy per photon.',
    competency: 'U-A4: Distinguish the roles of intensity and frequency in photoemission.',
  },
  g11_u1_q1: {
    title: 'Horizontal Range of a Projectile',
    question: 'A particle is launched from level ground at $v_0=20\\text{ m/s}$ and $30^\\circ$, with $g=10\\text{ m/s}^2$. What is its horizontal range?',
    options: ['A. $10\\sqrt3\\text m$', 'B. $20\\sqrt3\\text m$', 'C. $30\\text m$', 'D. $40\\sqrt3\\text m$'],
    solution: 'Solution: $T=\\frac{2(20\\sin30^\\circ)}{10}=2\\text s$ and $R=(20\\cos30^\\circ)(2)=20\\sqrt3\\text m$. Choose B.',
    hint: 'Multiply horizontal velocity by $T=2v_y/g$.',
    competency: 'S-A1: Resolve projectile motion into orthogonal components.',
  },
  g11_u2_q1: {
    title: 'Acceleration and Tension in an Atwood Machine',
    question: 'Masses $m_1=3\\text{ kg}$ and $m_2=2\\text{ kg}$ hang from opposite sides of a pulley. With $g=10\\text{ m/s}^2$, find acceleration and rope tension.',
    options: ['A. $a=2\\text{ m/s}^2,T=24\\text N$', 'B. $a=2\\text{ m/s}^2,T=20\\text N$', 'C. $a=1\\text{ m/s}^2,T=24\\text N$', 'D. $a=5\\text{ m/s}^2,T=30\\text N$'],
    solution: 'Solution: $a=\\frac{(3-2)10}{3+2}=2\\text{ m/s}^2$ and $T=m_2(g+a)=2(10+2)=24\\text N$. Choose A.',
    hint: 'Use the system method for $a$, then isolate one mass for $T$.',
    competency: 'S-A2: Analyze connected bodies with system and isolation methods.',
  },
  g11_u3_q1: {
    title: 'Critical Angle for a Ladder in Equilibrium',
    question: 'A uniform ladder rests against a smooth vertical wall. The floor has static-friction coefficient $\\mu_s$. What condition on the angle $\\theta$ between ladder and floor maintains equilibrium?',
    options: ['A. $\\tan\\theta\\ge\\frac1{2\\mu_s}$', 'B. $\\tan\\theta\\le\\frac1{2\\mu_s}$', 'C. $\\tan\\theta\\ge\\frac1{\\mu_s}$', 'D. $\\sin\\theta\\ge2\\mu_s$'],
    solution: 'Solution: Torque about the foot gives $W(\\frac L2\\cos\\theta)=N_1L\\sin\\theta$, so $N_1=\\frac W{2\\tan\\theta}\\le\\mu_sW$. Therefore $\\tan\\theta\\ge\\frac1{2\\mu_s}$. Choose A.',
    hint: 'Take torques about the foot of the ladder.',
    competency: 'S-B1: Derive a limiting condition from rigid-body torque equilibrium.',
  },
  g11_u4_q1: {
    title: 'Final Velocities in a One-Dimensional Elastic Collision',
    question: 'A $2\\text{ kg}$ ball A moving at $6\\text{ m/s}$ collides head-on elastically with a stationary $1\\text{ kg}$ ball B. What are their final velocities?',
    options: ['A. $v_1\'=2\\text{ m/s},v_2\'=8\\text{ m/s}$', 'B. $v_1\'=1\\text{ m/s},v_2\'=6\\text{ m/s}$', 'C. $v_1\'=3\\text{ m/s},v_2\'=6\\text{ m/s}$', 'D. $v_1\'=0\\text{ m/s},v_2\'=12\\text{ m/s}$'],
    solution: 'Solution: $v_1\'=\\frac{2-1}{3}(6)=2\\text{ m/s}$ and $v_2\'=\\frac{2(2)}3(6)=8\\text{ m/s}$. Choose A.',
    hint: 'Substitute into the one-dimensional elastic-collision equations.',
    competency: 'S-A3: Calculate one-dimensional elastic-collision velocities.',
  },
  g11_u5_q1: {
    title: 'Energy Ratios for a Circular-Orbit Satellite',
    question: 'What is the ratio of kinetic energy $E_k$, gravitational potential energy $U$, and total energy $E$ for a circular-orbit satellite?',
    options: ['A. $E_k:U:E=1:-2:-1$', 'B. $E_k:U:E=1:-1:0$', 'C. $E_k:U:E=2:-1:1$', 'D. $E_k:U:E=1:2:3$'],
    solution: 'Solution: The circular-orbit energy ratio is $E_k:U:E=1:-2:-1$. Choose A.',
    hint: 'Kinetic energy is positive; potential energy is negative with twice its magnitude; total energy equals negative kinetic energy.',
    competency: 'S-B2: Use the circular-orbit satellite energy ratio.',
  },
  g11_u6_q1: {
    title: 'Maximum Speed in Simple Harmonic Motion',
    question: 'A $0.5\\text{ kg}$ mass is attached to a $50\\text{ N/m}$ spring with amplitude $0.2\\text{ m}$. What is its maximum speed at equilibrium?',
    options: ['A. 1.0 m/s', 'B. 2.0 m/s', 'C. 4.0 m/s', 'D. 10 m/s'],
    solution: 'Solution: $\\omega=\\sqrt{50/0.5}=10\\text{ rad/s}$ and $v_{\\max}=A\\omega=0.2(10)=2.0\\text{ m/s}$. Choose B.',
    hint: 'Use $v_{\\max}=A\\sqrt{k/m}$.',
    competency: 'S-A4: Calculate SHM angular frequency and extrema.',
  },
  g11_u7_q1: {
    title: 'Doppler Frequency for an Approaching Source',
    question: 'Sound speed is $340\\text{ m/s}$. A horn emitting $900\\text{ Hz}$ moves toward a stationary observer at $34\\text{ m/s}$. What frequency is heard?',
    options: ['A. 818 Hz', 'B. 900 Hz', 'C. 1000 Hz', 'D. 1100 Hz'],
    solution: 'Solution: $f\'=900\\frac{340}{340-34}=1000\\text{ Hz}$. Choose C.',
    hint: 'For an approaching source, subtract source speed in the denominator.',
    competency: 'S-A5: Calculate a Doppler-shifted frequency.',
  },
  g12_u1_q1: {
    title: 'Temperature Dependence of Molecular rms Speed',
    question: 'Helium is heated from $27^\\circ\\text C$ to $327^\\circ\\text C$. By what factor does its rms speed change?',
    options: ['A. $\\sqrt2$', 'B. 2', 'C. $2\\sqrt3$', 'D. 4'],
    solution: 'Solution: $T_1=300\\text K$ and $T_2=600\\text K$, so $v_2/v_1=\\sqrt{600/300}=\\sqrt2$. Choose A.',
    hint: 'Convert to absolute temperature with $T=^\\circ\\text C+273$.',
    competency: 'S-A6: Relate kinetic theory to absolute temperature.',
  },
  g12_u2_q1: {
    title: 'Double-Slit Fringe Spacing',
    question: 'For slit separation $d=0.2\\text{ mm}$, screen distance $L=1.0\\text m$, and wavelength $\\lambda=600\\text{ nm}$, what is the spacing of adjacent bright fringes?',
    options: ['A. 0.3 mm', 'B. 1.5 mm', 'C. 3.0 mm', 'D. 6.0 mm'],
    solution: 'Solution: $\\Delta y=\\frac{(6\\times10^{-7})(1)}{0.2\\times10^{-3}}=3.0\\times10^{-3}\\text m=3.0\\text{ mm}$. Choose C.',
    hint: 'Use $\\Delta y=\\lambda L/d$.',
    competency: 'S-A7: Calculate double-slit fringe spacing.',
  },
  g12_u3_q1: {
    title: 'Particle Energy from an Accelerating Potential',
    question: 'An $\\alpha$ particle with charge $+2e$ is accelerated through $500\\text V$. How much kinetic energy does it gain in eV?',
    options: ['A. 250 eV', 'B. 500 eV', 'C. 1000 eV', 'D. 2000 eV'],
    solution: 'Solution: $E_k=qV=(2e)(500\\text V)=1000\\text{ eV}$. Choose C.',
    hint: 'Use $E_k=qV$.',
    competency: 'S-B3: Convert electric-potential energy into electronvolts.',
  },
  g12_u4_q1: {
    title: 'Equivalent Resistance and Current for Three Parallel Resistors',
    question: 'Resistors $2\\,\\Omega$, $3\\,\\Omega$, and $6\\,\\Omega$ are connected in parallel to a $12\\text V$ DC source. Find equivalent resistance and total current.',
    options: ['A. $R_{\\text{eq}}=1\\,\\Omega,I_{\\text{total}}=12\\text A$', 'B. $R_{\\text{eq}}=2\\,\\Omega,I_{\\text{total}}=6\\text A$', 'C. $R_{\\text{eq}}=11\\,\\Omega,I_{\\text{total}}=1.09\\text A$', 'D. $R_{\\text{eq}}=3\\,\\Omega,I_{\\text{total}}=4\\text A$'],
    solution: 'Solution: $1/R_{\\text{eq}}=1/2+1/3+1/6=1$, so $R_{\\text{eq}}=1\\,\\Omega$ and $I=12/1=12\\text A$. Choose A.',
    hint: 'Add the reciprocals of parallel resistances.',
    competency: 'S-A8: Combine parallel resistance with Ohm\'s law.',
  },
  g12_u5_q1: {
    title: 'Magnetic-Radius Ratio for a Proton and Alpha Particle',
    question: 'A proton $(m,+e)$ and an alpha particle $(4m,+2e)$ have equal kinetic energy and enter a uniform magnetic field perpendicularly. What is $R_p:R_\\alpha$?',
    options: ['A. 1 : 1', 'B. 1 : 2', 'C. 1 : 4', 'D. 2 : 1'],
    solution: 'Solution: $R=\\frac{\\sqrt{2mE_k}}{qB}\\propto\\frac{\\sqrt m}{q}$. The proton factor is 1 and the alpha-particle factor is $\\sqrt4/2=1$, so the ratio is 1:1. Choose A.',
    hint: 'At equal kinetic energy, radius is proportional to $\\sqrt m/q$.',
    competency: 'S-B4: Compare magnetic-orbit radii of charged particles.',
  },
  g12_u6_q1: {
    title: 'Electron Matter-Wave Wavelength after Acceleration',
    question: 'An electron initially at rest is accelerated through potential difference $V$. What is its de Broglie wavelength $\\lambda$?',
    options: ['A. $\\lambda=\\frac h{\\sqrt{2meV}}$', 'B. $\\lambda=\\frac h{2meV}$', 'C. $\\lambda=\\frac{\\sqrt{2meV}}h$', 'D. $\\lambda=\\frac h{\\sqrt{meV}}$'],
    solution: 'Solution: $E_k=eV$, so $p=\\sqrt{2meV}$ and $\\lambda=h/p=\\frac h{\\sqrt{2meV}}$. Choose A.',
    hint: 'Use $\\lambda=h/p=h/\\sqrt{2mE_k}$.',
    competency: 'S-A9: Derive the matter-wave wavelength expression.',
  },
}

function missing(kind: string, id: string): never {
  throw new Error(`Missing English physics ${kind} copy: ${id}`)
}

function checkOptions(source: PhysicsQuestion, copy: QuestionCopy): void {
  if ((source.options?.length ?? 0) !== (copy.options?.length ?? 0)) {
    throw new Error(`Physics option-count mismatch: ${source.id}`)
  }
}

export function localizePhysicsQuestion(question: PhysicsQuestion, locale: UiLocale): PhysicsQuestion {
  if (locale !== 'en') return question
  const copy = PHYSICS_QUESTION_EN[question.id] ?? PHYSICS_MOCK_QUESTION_EN[question.id] ?? missing('question', question.id)
  checkOptions(question, copy)
  return { ...question, ...copy }
}

export function localizePhysicsUnit(unit: PhysicsUnit, locale: UiLocale): PhysicsUnit {
  if (locale !== 'en') return unit
  const copy = PHYSICS_UNIT_EN[unit.key] ?? missing('unit', unit.key)
  if (copy.concepts.length !== unit.concepts.length) {
    throw new Error(`Physics concept-count mismatch: ${unit.key}`)
  }
  return {
    ...unit,
    ...copy,
    band: PHYSICS_GRADE_EN[unit.key.split('_')[0]]?.band ?? missing('band', unit.key),
    targetExam: PHYSICS_GRADE_EN[unit.key.split('_')[0]]?.targetExam ?? missing('exam', unit.key),
    questions: unit.questions.map((question) => localizePhysicsQuestion(question, locale)),
  }
}

export function localizePhysicsGrade(grade: PhysicsGradeInfo, locale: UiLocale): PhysicsGradeInfo {
  if (locale !== 'en') return grade
  const copy = PHYSICS_GRADE_EN[grade.id] ?? missing('grade', grade.id)
  return {
    ...grade,
    name: grade.nameEn,
    band: copy.band,
    description: copy.description,
    targetExam: copy.targetExam,
    units: grade.units.map((unit) => localizePhysicsUnit(unit, locale)),
    labs: grade.labs.map((lab) => ({ ...lab, ...(copy.labs[lab.id] ?? missing('lab', lab.id)) })),
  }
}

export function localizePhysicsFormulaSections(
  sections: PhysicsFormulaSheetSection[],
  locale: UiLocale,
): PhysicsFormulaSheetSection[] {
  if (locale !== 'en') return sections
  return sections.map((section) => ({
    ...section,
    name: section.nameEn,
    units: section.units.map((unit) => {
      const copy = PHYSICS_UNIT_EN[`${section.gradeId}_u${unit.id}`] ?? missing('formula unit', `${section.gradeId}:${unit.id}`)
      if (copy.concepts.length !== unit.concepts.length) throw new Error(`Physics formula-count mismatch: ${section.gradeId}:${unit.id}`)
      return { ...unit, title: copy.title, concepts: [...copy.concepts] }
    }),
  }))
}

const PHYSICS_MOCK_EN: Record<string, MockCopy> = {
  cap: {
    title: 'CAP Physics Competency Mock Exam',
    subtitle: 'Core physics assessment covering Grades 7-9',
    targetExam: 'Comprehensive Assessment Program (CAP)',
    description: 'Covers measurement and density, heat transfer, waves and optics, force and motion, pressure and buoyancy, basic circuits, and magnetic effects of current.',
  },
  gsat: {
    title: 'GSAT Physics Mock Exam',
    subtitle: 'Competency assessment across required Grade 10 physics',
    targetExam: 'General Scholastic Ability Test (GSAT)',
    description: 'Covers the four fundamental interactions, constant-acceleration motion, Faraday induction, mass-energy equivalence, and quantum concepts in the photoelectric effect.',
  },
  ast: {
    title: 'AST Advanced Physics Mock Exam',
    subtitle: 'Derivations and integrated analysis across elective Physics I-V',
    targetExam: 'Advanced Subjects Test (AST)',
    description: 'Covers projectile motion, one-dimensional collisions, orbital binding energy, SHM, double-slit interference, Kirchhoff circuits, the Lorentz force, and de Broglie waves.',
  },
}

const PHYSICS_MOCK_QUESTION_EN: Record<string, QuestionCopy> = {
  mock_cap_q1: {
    title: 'Buoyancy and a Spring-Scale Reading',
    question: 'A solid of volume $80\\text{ cm}^3$ and mass $200\\text{ g}$ is fully submerged in water of density $1\\text{ g/cm}^3$. What does the supporting spring scale read?',
    options: ['A. 80 gw', 'B. 120 gw', 'C. 200 gw', 'D. 280 gw'],
    solution: 'Solution: $B=V_{\\text{disp}}D=80(1)=80\\text{ gw}$. Thus $W\'=W-B=200-80=120\\text{ gw}$. Choose B.',
    competency: 'J-B3: Analyze buoyancy and apparent weight.',
  },
  mock_cap_q2: {
    title: 'Equilibrium Temperature of Mixed Water',
    question: 'Mix $200\\text{ g}$ of water at $70^\\circ\\text C$ with $300\\text{ g}$ at $20^\\circ\\text C$ in an insulated cup. What is the equilibrium temperature?',
    options: ['A. $35^\\circ\\text C$', 'B. $40^\\circ\\text C$', 'C. $45^\\circ\\text C$', 'D. $50^\\circ\\text C$'],
    solution: 'Solution: $200(70-T)=300(T-20)$, so $5T=200$ and $T=40^\\circ\\text C$. Choose B.',
    competency: 'J-A2: Solve a heat-balance equation.',
  },
  mock_cap_q3: {
    title: 'Object Distance and Convex-Lens Image',
    question: 'A convex lens has focal length $15\\text{ cm}$. A candle is placed $25\\text{ cm}$ in front of it, so $f<p<2f$. What image appears on a screen?',
    options: ['A. Magnified inverted real image', 'B. Reduced inverted real image', 'C. Magnified upright virtual image', 'D. Same-size inverted real image'],
    solution: 'Solution: Since $15<p<30$, the object is between one and two focal lengths. The image is real, inverted, and magnified. Choose A.',
    competency: 'J-A3: Apply the convex-lens imaging rules.',
  },
  mock_cap_q4: {
    title: 'Velocity from Newton\'s Second Law',
    question: 'A stationary $2\\text{ kg}$ object is pushed by a constant horizontal $10\\text N$ force for $3\\text s$. What is its speed after 3 s?',
    options: ['A. 5 m/s', 'B. 10 m/s', 'C. 15 m/s', 'D. 30 m/s'],
    solution: 'Solution: $a=F/m=10/2=5\\text{ m/s}^2$, so $v=v_0+at=0+5(3)=15\\text{ m/s}$. Choose C.',
    competency: 'J-B4: Calculate acceleration and velocity from Newton\'s second law.',
  },
  mock_cap_q5: {
    title: 'Total Current in a Household Parallel Circuit',
    question: 'A $1100\\text W$ heater and $220\\text W$ television are connected in parallel to a $110\\text V$ household circuit. What is the total current?',
    options: ['A. 6 A', 'B. 10 A', 'C. 12 A', 'D. 15 A'],
    solution: 'Solution: Total power is $1100+220=1320\\text W$, so $I=P/V=1320/110=12\\text A$. Choose C.',
    competency: 'J-B5: Calculate total circuit current from electric power.',
  },
  mock_gsat_q1: {
    title: 'Scales and Strengths of the Fundamental Interactions',
    question: 'Which statement about the four fundamental interactions is correct?',
    options: ['A. The strong force between protons is an inverse-square long-range force', 'B. Gravity is stronger than Coulomb force inside a nucleus', 'C. Normal and friction forces arise microscopically from electromagnetism', 'D. Radioactive $\\beta$ decay is governed by the strong interaction'],
    solution: 'Solution: Contact forces arise from electromagnetic interactions between electron clouds. The strong force is short range, gravity is weakest, and beta decay is governed by the weak interaction. Choose C.',
    competency: 'U-B2: Compare the four fundamental interactions.',
  },
  mock_gsat_q2: {
    title: 'Slope and Area on a Velocity-Time Graph',
    question: 'A particle speeds up from 0 to 10 m/s during the first 2 s, remains at 10 m/s for 3 s, then slows to 0 during the final 1 s. What is its total displacement?',
    options: ['A. 30 m', 'B. 40 m', 'C. 45 m', 'D. 60 m'],
    solution: 'Solution: The area is a trapezoid with parallel widths 3 s and 6 s and height 10 m/s: $\\Delta x=\\frac{(3+6)10}{2}=45\\text m$. Choose C.',
    competency: 'U-B3: Obtain displacement from the area of a motion graph.',
  },
  mock_gsat_q3: {
    title: 'Frequency and Maximum Energy in the Photoelectric Effect',
    question: 'Light at three times a metal\'s threshold frequency gives photoelectrons maximum kinetic energy $K_0$. What is the maximum energy for light at five times the threshold frequency?',
    options: ['A. $2K_0$', 'B. $3K_0$', 'C. $4K_0$', 'D. $5K_0$'],
    solution: 'Solution: $W=h\\nu_0$ and $K_0=h(3\\nu_0)-h\\nu_0=2h\\nu_0$. At $5\\nu_0$, $K\'=4h\\nu_0=2K_0$. Choose A.',
    competency: 'U-A4: Use Einstein\'s photoelectric equation in ratios.',
  },
  mock_gsat_q4: {
    title: 'Faraday Induction and Lenz\'s Law',
    question: 'A magnet\'s south pole moves downward away from a closed horizontal loop. Viewed from above, what are the induced-current direction and force on the loop?',
    options: ['A. Clockwise; upward attraction', 'B. Counterclockwise; upward attraction', 'C. Clockwise; downward repulsion', 'D. Counterclockwise; downward repulsion'],
    solution: 'Solution: Upward flux is decreasing, so the loop creates an upward field and its upper face becomes north. From above the current is clockwise, and the loop is attracted upward. Choose A.',
    competency: 'U-A3: Analyze induced current and force with Lenz\'s law.',
  },
  mock_ast_q1: {
    title: 'Head-On Elastic Collision and Mass Ratio',
    question: 'A particle of mass $m$ moving at $v$ collides elastically head-on with a stationary particle of mass $M$. If $m$ rebounds at speed $v/3$, what is $M:m$?',
    options: ['A. 2 : 1', 'B. 3 : 1', 'C. 4 : 1', 'D. 5 : 1'],
    solution: 'Solution: $v_1\'=\\frac{m-M}{m+M}v=-v/3$. Hence $\\frac{M-m}{M+m}=1/3$, giving $2M=4m$ and $M:m=2:1$. Choose A.',
    competency: 'S-A3: Infer mass ratio from rebound speed in an elastic collision.',
  },
  mock_ast_q2: {
    title: 'Kinetic Energy of a Charged Particle in a Magnetic Orbit',
    question: 'A particle with charge $+q$ and mass $m$ moves at constant speed in a circle of radius $R$ in magnetic field $B$. What is its kinetic energy?',
    options: ['A. $\\frac{q^2B^2R^2}{2m}$', 'B. $\\frac{qBR}{2m}$', 'C. $\\frac{q^2B^2R}{m}$', 'D. $\\frac{2m}{q^2B^2R^2}$'],
    solution: 'Solution: $qvB=mv^2/R$ gives $v=qBR/m$. Therefore $E_k=\\frac12mv^2=\\frac{q^2B^2R^2}{2m}$. Choose A.',
    competency: 'S-B4: Derive kinetic energy for magnetic circular motion.',
  },
  mock_ast_q3: {
    title: 'Combined Double-Slit Interference and Single-Slit Diffraction',
    question: 'A double slit has separation $d=0.5\\text{ mm}$ and each slit has width $b=0.1\\text{ mm}$. At most how many double-slit bright fringes fit inside the central single-slit maximum?',
    options: ['A. 5 fringes', 'B. 9 fringes', 'C. 10 fringes', 'D. 11 fringes'],
    solution: 'Solution: The missing order is $m=d/b=5$, so orders $\\pm5$ coincide with the first single-slit minima. The central maximum contains $m=0,\\pm1,\\pm2,\\pm3,\\pm4$, for 9 fringes. Choose B.',
    competency: 'S-A7: Analyze missing orders in combined interference and diffraction.',
  },
  mock_ast_q4: {
    title: 'Energy Transfer in Simple Harmonic Motion',
    question: 'A horizontal spring oscillator has amplitude $A$. At displacement $x=\\frac{\\sqrt3}{2}A$, what is the ratio $E_k:U$?',
    options: ['A. 1 : 3', 'B. 3 : 1', 'C. 1 : 2', 'D. 1 : 4'],
    solution: 'Solution: $E=\\frac12kA^2$ and $U=\\frac12kx^2=3E/4$, so $E_k=E/4$ and $E_k:U=1:3$. Choose A.',
    competency: 'S-A4: Calculate the energy partition in SHM.',
  },
}

const PHYSICS_SIGNAL_EN: Record<string, SignalCopy> = {
  'sig-j-measurement-scale': {
    gradeBand: 'Grade 7', topic: 'Measurement and Uncertainty · Smallest Division and Estimated Digit',
    problemSignal: 'A measured value is recorded to a final decimal place; identify the instrument\'s smallest division or the estimated digit.',
    threeSecondRule: 'The last recorded digit is estimated. The instrument\'s smallest division is one place to its left, or ten times the last recorded place value.',
    firstStepFormula: '\\Delta_{\\min}=10\\,\\Delta_{\\text{last recorded place}}',
    exampleProblem: { question: 'A ruler reading is recorded as $15.48\\text{ cm}$. What is the smallest division?', quickSolve: 'The final digit is estimated at $0.01\\text{ cm}$, so the smallest division is $0.1\\text{ cm}=1\\text{ mm}$.' },
  },
  'sig-j-density': {
    gradeBand: 'Grade 7', topic: 'Mass and Density · Mass-Volume Slope',
    problemSignal: 'A cylinder\'s total mass is given for two liquid volumes; find liquid density or empty-cylinder mass.',
    threeSecondRule: 'Density is mass difference divided by volume difference. Then subtract liquid mass from total mass to get the empty cylinder.',
    firstStepFormula: 'D_{\\text{liq}}=\\frac{\\Delta M}{\\Delta V}=\\frac{M_2-M_1}{V_2-V_1},\\quad M_{\\text{empty}}=M_1-D_{\\text{liq}}V_1',
    exampleProblem: { question: 'Total mass is $38\\text g$ with $20\\text{ cm}^3$ and $62\\text g$ with $50\\text{ cm}^3$. Find density.', quickSolve: '$D=\\frac{62-38}{50-20}=0.8\\text{ g/cm}^3$; empty-cylinder mass is $38-20(0.8)=22\\text g$.' },
  },
  'sig-j-heat': {
    gradeBand: 'Grade 7', topic: 'Heat and Specific Heat · Insulated Mixing',
    problemSignal: 'A hot object is placed in cooler water in an insulated system; find final temperature or specific heat.',
    threeSecondRule: 'Heat released equals heat absorbed: $m_1s_1(T_1-T)=m_2s_2(T-T_2)$.',
    firstStepFormula: 'm_1s_1(T_1-T_{\\text{final}})=m_2s_2(T_{\\text{final}}-T_2)',
    exampleProblem: { question: 'Mix $100\\text g$ of $80^\\circ\\text C$ water with $200\\text g$ at $20^\\circ\\text C$. Find the final temperature.', quickSolve: '$100(80-T)=200(T-20)\\implies3T=120\\implies T=40^\\circ\\text C$.' },
  },
  'sig-j-buoyancy': {
    gradeBand: 'Grade 8', topic: 'Fluids · Buoyancy and Apparent Weight',
    problemSignal: 'An object is submerged and read on a spring scale, or a floating object is in equilibrium.',
    threeSecondRule: 'Buoyancy equals displaced-fluid weight; for a floater $B=W$; for a submerged object $B=W-W\'$.',
    firstStepFormula: 'B=V_{\\text{disp}}D_{\\text{liq}}=W_{\\text{air}}-W\'_{\\text{liquid}}',
    exampleProblem: { question: 'A $50\\text{ cm}^3$ aluminium block weighs $135\\text{ gw}$ in air. What does it weigh when fully submerged in water?', quickSolve: '$B=50\\text{ gw}$, so $W\'=135-50=85\\text{ gw}$.' },
  },
  'sig-j-circuits': {
    gradeBand: 'Grade 9', topic: 'Electricity · Bulb Brightness in Series and Parallel',
    problemSignal: 'Rated bulb values such as 110 V-100 W and 110 V-50 W are given; compare brightness in series or parallel.',
    threeSecondRule: 'First find $R=V^2/P$. In series, equal current means larger $R$ is brighter; in parallel, equal voltage means smaller $R$ is brighter.',
    firstStepFormula: 'R=\\frac{V_{\\text{rated}}^2}{P_{\\text{rated}}},\\quad\\text{series: }P\\propto R,\\quad\\text{parallel: }P\\propto\\frac1R',
    exampleProblem: { question: 'A 100 W bulb and a 50 W bulb are in series on 110 V. Which is brighter?', quickSolve: '$R_{50}>R_{100}$ and series current is equal, so $P=I^2R$ makes the 50 W bulb brighter.' },
  },
  'sig-kinematics-select': {
    gradeBand: 'Grades 10-11', topic: 'Linear Motion · Selecting a Constant-Acceleration Equation',
    problemSignal: 'Known and unknown quantities are selected from $v_0,v,a,t,\\Delta x$; choose an equation that omits the unavailable quantity.',
    threeSecondRule: 'No $t$: use $v^2=v_0^2+2a\\Delta x$. No $a$: use average velocity. Match the equation to the missing variable.',
    firstStepFormula: '\\text{no }t\\implies v^2=v_0^2+2a\\Delta x,\\quad\\text{no }a\\implies\\Delta x=\\frac{v_0+v}{2}t',
    exampleProblem: { question: 'A car at $20\\text{ m/s}$ stops over $40\\text m$ with constant deceleration. Find deceleration magnitude and stopping time.', quickSolve: '$0=20^2-2a(40)\\implies a=5\\text{ m/s}^2$; then $40=\\frac{20+0}{2}t\\implies t=4\\text s$.' },
  },
  'sig-projectile-ortho': {
    gradeBand: 'Grade 11', topic: 'Plane Motion · Projectile Components',
    problemSignal: 'A launch speed and angle are given; find flight time, maximum height, or horizontal range.',
    threeSecondRule: 'Horizontal motion is uniform and vertical motion is free fall. First resolve $v_{0x}=v_0\\cos\\theta$ and $v_{0y}=v_0\\sin\\theta$.',
    firstStepFormula: 'T=\\frac{2v_0\\sin\\theta}{g},\\quad H=\\frac{(v_0\\sin\\theta)^2}{2g},\\quad R=\\frac{v_0^2\\sin2\\theta}{g}',
    exampleProblem: { question: 'A stone is launched at $25\\text{ m/s}$ and $53^\\circ$ with $g=10\\text{ m/s}^2$. Find maximum height and flight time.', quickSolve: '$v_{0y}=20\\text{ m/s}$, so $T=4\\text s$ and $H=20\\text m$.' },
  },
  'sig-system-acc': {
    gradeBand: 'Grade 11', topic: 'Newtonian Dynamics · Connected-System Method',
    problemSignal: 'Several blocks are connected by a rope on a smooth plane or pulley; find system acceleration or internal tension.',
    threeSecondRule: 'Find $a$ for the whole system first, then isolate one body to find internal force $T$.',
    firstStepFormula: 'a_{\\text{sys}}=\\frac{\\sum F_{\\text{ext,drive}}-\\sum F_{\\text{ext,resist}}}{\\sum m_i}',
    exampleProblem: { question: '$m_1=3\\text{ kg}$ is on a smooth table and connected over a pulley to $m_2=2\\text{ kg}$, with $g=10\\text{ m/s}^2$. Find acceleration.', quickSolve: 'Driving force is $20\\text N$ and total mass is $5\\text{ kg}$, so $a=4\\text{ m/s}^2$.' },
  },
  'sig-momentum-collision': {
    gradeBand: 'Grade 11', topic: 'Momentum · Elastic and Perfectly Inelastic Collisions',
    problemSignal: 'Two objects collide, stick, explode, or interact on a smooth horizontal surface with no external force.',
    threeSecondRule: 'Momentum is conserved. Sticking gives a common center-of-mass speed and the greatest kinetic-energy loss.',
    firstStepFormula: 'm_1v_1+m_2v_2=(m_1+m_2)v_{\\text{cm}},\\quad v_1-v_2=-(v_1\'-v_2\')\\quad(e=1)',
    exampleProblem: { question: 'A $2\\text{ kg}$ cart at $6\\text{ m/s}$ hits a stationary $4\\text{ kg}$ cart and sticks. Find final speed.', quickSolve: '$v\'=\\frac{2(6)}{2+4}=2\\text{ m/s}$.' },
  },
  'sig-centripetal-force': {
    gradeBand: 'Grade 11', topic: 'Circular Motion · Source of Centripetal Force',
    problemSignal: 'A turning car, conical pendulum, roller-coaster top, or satellite moves on a circular path.',
    threeSecondRule: 'Centripetal force is not a new force; it is the net radial force. Draw the free-body diagram and set inward net force to $mv^2/R$.',
    firstStepFormula: 'F_{\\text{net,radial}}=m\\frac{v^2}{R}=m\\omega^2R=m\\left(\\frac{2\\pi}{T}\\right)^2R',
    exampleProblem: { question: 'At the top inside a vertical loop of radius $10\\text m$, a coaster just maintains contact. With $g=10\\text{ m/s}^2$, find its speed.', quickSolve: '$N=0$, so $mg=mv^2/R$ and $v=\\sqrt{gR}=10\\text{ m/s}$.' },
  },
  'sig-satellite-energy': {
    gradeBand: 'Grade 11', topic: 'Gravitation · Circular-Orbit Energy Ratio',
    problemSignal: 'A satellite in a circular orbit of radius $r$ requires kinetic, potential, or total mechanical energy.',
    threeSecondRule: 'Use the ratio $1:-2:-1$: kinetic energy is positive, potential is twice as large and negative, and total equals negative kinetic energy.',
    firstStepFormula: 'E_k=\\frac{GMm}{2r},\\quad U=-\\frac{GMm}{r},\\quad E=-\\frac{GMm}{2r}\\implies E_k:U:E=1:-2:-1',
    exampleProblem: { question: 'A satellite has kinetic energy $4\\times10^9\\text J$. Find its potential and total energies.', quickSolve: '$U=-8\\times10^9\\text J$ and $E=-4\\times10^9\\text J$.' },
  },
  'sig-shm-frequency': {
    gradeBand: 'Grade 11', topic: 'Simple Harmonic Motion · Restoring Force and Period',
    problemSignal: 'A spring oscillator, floating-body oscillation, or small-angle pendulum requires period or an extreme value.',
    threeSecondRule: 'Reduce the restoring force to $F=-k_{\\text{eff}}x$, then use $T=2\\pi\\sqrt{m/k_{\\text{eff}}}$.',
    firstStepFormula: 'F_{\\text{net}}=-kx\\implies\\omega=\\sqrt{\\frac km},\\quad T=2\\pi\\sqrt{\\frac mk},\\quad E=\\frac12kA^2',
    exampleProblem: { question: 'A $1\\text{ kg}$ mass on a $100\\text{ N/m}$ spring has amplitude $0.1\\text m$. Find maximum kinetic energy and period.', quickSolve: '$T=\\pi/5\\text s$ and $E_{k,\\max}=\\frac12(100)(0.1)^2=0.5\\text J$.' },
  },
  'sig-double-slit-fringe': {
    gradeBand: 'Grade 12', topic: 'Physical Optics · Interference and Diffraction Fringes',
    problemSignal: 'Find adjacent bright-fringe spacing for a double slit or central-maximum width for a single slit.',
    threeSecondRule: 'Double slit: $\\lambda L/d$. Single-slit central maximum: $2\\lambda L/b$. Use separation $d$ for two slits and width $b$ for one slit.',
    firstStepFormula: '\\text{double slit: }\\Delta y=\\frac{\\lambda L}{d},\\qquad\\text{single-slit central maximum: }W_0=\\frac{2\\lambda L}{b}',
    exampleProblem: { question: 'Light of $500\\text{ nm}$ passes through a $0.1\\text{ mm}$ single slit to a screen $2\\text m$ away. Find central width.', quickSolve: '$W_0=\\frac{2(500\\times10^{-9})(2)}{0.1\\times10^{-3}}=20\\text{ mm}$.' },
  },
  'sig-gas-rms-speed': {
    gradeBand: 'Grade 12', topic: 'Thermal Physics · Molecular Energy and Speed',
    problemSignal: 'Given absolute temperature, find average molecular kinetic energy or rms speed.',
    threeSecondRule: 'Single-molecule kinetic energy depends on $T$; rms speed depends on $T/M$. Convert Celsius to kelvin first.',
    firstStepFormula: '\\overline E_k=\\frac32k_BT,\\qquad v_{\\text{rms}}=\\sqrt{\\frac{3RT}{M}}=\\sqrt{\\frac{3k_BT}{m}}',
    exampleProblem: { question: 'Oxygen at $300\\text K$ has rms speed $v_0$. Find the rms speed of hydrogen at $600\\text K$, given $M_O=32$ and $M_H=2$.', quickSolve: '$v_H/v_O=\\sqrt{(600/2)/(300/32)}=\\sqrt{32}=4\\sqrt2$.' },
  },
  'sig-lorentz-cyclotron': {
    gradeBand: 'Grade 12', topic: 'Magnetic Fields · Lorentz-Force Circular Motion',
    problemSignal: 'A charged particle enters a uniform magnetic field perpendicularly; find orbit radius or period.',
    threeSecondRule: 'Magnetic force supplies centripetal force. Radius depends on momentum; period is independent of speed and radius.',
    firstStepFormula: 'R=\\frac{mv}{qB}=\\frac p{qB},\\qquad T=\\frac{2\\pi m}{qB}\\quad(T\\text{ is independent of }v,R)',
    exampleProblem: { question: 'Two particles have equal momentum and charge but masses in ratio 1:4. They enter the same field. Find radius and period ratios.', quickSolve: '$R_1:R_2=1:1$ and $T_1:T_2=1:4$.' },
  },
  'sig-motional-emf': {
    gradeBand: 'Grade 12', topic: 'Induction · A Conductor Cutting Magnetic-Field Lines',
    problemSignal: 'A rod of length $L$ moves at speed $v$ through field $B$; find induced emf, current, or magnetic force.',
    threeSecondRule: 'Use $BLv$ for emf. The right-hand rule identifies the positive end, and external work becomes Joule heat.',
    firstStepFormula: '\\mathcal E=BLv,\\quad I=\\frac{BLv}{R},\\quad F_{\\text{magnetic}}=ILB=\\frac{B^2L^2v}{R}',
    exampleProblem: { question: 'A $0.5\\text m$ rod moves at $10\\text{ m/s}$ through $0.4\\text T$. Circuit resistance is $2\\,\\Omega$. Find current.', quickSolve: '$\\mathcal E=0.4(0.5)(10)=2\\text V$, so $I=1\\text A$.' },
  },
  'sig-photoelectric-cutoff': {
    gradeBand: 'Grades 10 and 12', topic: 'Modern Physics · Einstein\'s Photoelectric Equation',
    problemSignal: 'Photoelectric effect with incident frequency $\\nu$, work function $W$, or stopping voltage $V_s$.',
    threeSecondRule: 'Incident energy equals work function plus maximum kinetic energy. Intensity controls electron count; frequency controls electron energy and stopping voltage.',
    firstStepFormula: 'h\\nu=W+K_{\\max}=W+eV_s\\iff eV_s=h\\nu-h\\nu_0',
    exampleProblem: { question: 'A metal has threshold frequency $\\nu_0$ and is illuminated at $3\\nu_0$. Find maximum kinetic energy and stopping voltage.', quickSolve: '$K_{\\max}=2h\\nu_0$ and $V_s=2h\\nu_0/e$.' },
  },
  'sig-bohr-transition': {
    gradeBand: 'Grade 12', topic: 'Modern Physics · Bohr Energy-Level Transitions',
    problemSignal: 'Hydrogen transitions from higher level $n_2$ to lower level $n_1$; find photon energy or wavelength.',
    threeSecondRule: 'Use $-13.6/n^2$ eV. Transitions to $n=1$ are Lyman UV, to $n=2$ Balmer visible, and to $n=3$ Paschen infrared.',
    firstStepFormula: '\\Delta E=13.6\\left(\\frac1{n_1^2}-\\frac1{n_2^2}\\right)\\text{ eV}=\\frac{hc}{\\lambda}',
    exampleProblem: { question: 'A hydrogen electron falls from $n=4$ to $n=2$. Find photon energy.', quickSolve: '$\\Delta E=13.6(1/4-1/16)=2.55\\text{ eV}$, a Balmer visible photon.' },
  },
  'sig-circuit-kcl': {
    gradeBand: 'Grade 12', topic: 'Circuits · Node-Voltage Method',
    problemSignal: 'A multi-source or bridge circuit asks for a branch current.',
    threeSecondRule: 'Set ground to $0\\text V$, assign unknown node voltage $V_x$, and apply KCL: current in equals current out.',
    firstStepFormula: '\\sum I_{\\text{out}}=0\\implies\\frac{V_x-V_1}{R_1}+\\frac{V_x-V_2}{R_2}+\\frac{V_x-V_3}{R_3}=0',
    exampleProblem: { question: '$V_x$ connects through $2\\,\\Omega$ to $10\\text V$, through $3\\,\\Omega$ to ground, and through $6\\,\\Omega$ to ground. Find $V_x$.', quickSolve: '$(V_x-10)/2+V_x/3+V_x/6=0\\implies V_x=5\\text V$.' },
  },
  'sig-doppler-frequency': {
    gradeBand: 'Grade 11', topic: 'Waves · Doppler Frequency',
    problemSignal: 'A moving sound source, observer, or both are given; find the observed frequency.',
    threeSecondRule: 'Observer speed is in the numerator and source speed in the denominator. Approaching raises frequency: numerator plus, denominator minus.',
    firstStepFormula: 'f\'=f\\left(\\frac{v\\pm v_O}{v\\mp v_S}\\right)\\quad(\\text{approaching: numerator }+,\\text{ denominator }-)',
    exampleProblem: { question: 'Sound speed is $340\\text{ m/s}$. A $640\\text{ Hz}$ source approaches a stationary observer at $20\\text{ m/s}$. Find observed frequency.', quickSolve: '$f\'=640\\frac{340}{340-20}=680\\text{ Hz}$.' },
  },
}

export function localizePhysicsMockExam(exam: PhysicsMockExam, locale: UiLocale): PhysicsMockExam {
  if (locale !== 'en') return exam
  const copy = PHYSICS_MOCK_EN[exam.id] ?? missing('mock exam', exam.id)
  return { ...exam, ...copy, questions: exam.questions.map((question) => localizePhysicsQuestion(question, locale)) }
}

export function localizePhysicsSignal(signal: PhysicsSolvingSignal, locale: UiLocale): PhysicsSolvingSignal {
  if (locale !== 'en') return signal
  const copy = PHYSICS_SIGNAL_EN[signal.id] ?? missing('signal', signal.id)
  return { ...signal, ...copy, unitCheckTip: signal.unitCheckTip ? { ...signal.unitCheckTip, zh: signal.unitCheckTip.en } : undefined }
}

export const PHYSICS_ENGLISH_COVERAGE = {
  grades: PHYSICS_GRADE_EN,
  units: PHYSICS_UNIT_EN,
  questions: PHYSICS_QUESTION_EN,
  mockQuestions: PHYSICS_MOCK_QUESTION_EN,
  mockExams: PHYSICS_MOCK_EN,
  signals: PHYSICS_SIGNAL_EN,
} as const
