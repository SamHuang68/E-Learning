import type { ChemistryGradeCopy, ChemistryUnitCopy } from './types'

export const CHEMISTRY_GRADE_EN: Record<string, ChemistryGradeCopy> = {
  g7: {
    band: 'Junior high required',
    description: 'Solutions, concentration calculations, solubility curves, crystallization, and physical methods for separating mixtures.',
    targetExam: 'Comprehensive Assessment Program (CAP)',
    labs: {
      lab_g7_solubility_curve: {
        name: 'Potassium Nitrate Solubility-Curve Lab',
        description: 'Measure saturated solubility at different temperatures, plot a solubility curve, and calculate crystallization yield during cooling.',
      },
      lab_g7_salt_purification: {
        name: 'Crude-Salt Purification and Crystallization Lab',
        description: 'Practise dissolution, folded-filter-paper filtration, and controlled evaporation to recover purified salt crystals.',
      },
    },
  },
  g8: {
    band: 'Junior high required',
    description: 'Atomic structure, the periodic table, equations and stoichiometry, conservation of mass, redox chemistry, and common acids, bases, and salts.',
    targetExam: 'Comprehensive Assessment Program (CAP)',
    labs: {
      lab_g8_mass_conservation: {
        name: 'Conservation of Mass in a Closed System',
        description: 'Use a flask and balloon to verify that the total mass stays constant when calcium carbonate reacts with hydrochloric acid.',
      },
      lab_g8_metal_activity: {
        name: 'Metal Activity and Redox Displacement Lab',
        description: 'Compare combustion and hydrogen-production rates for magnesium, zinc, iron, and copper.',
      },
      lab_g8_neutralization_therm: {
        name: 'Neutralization Heat and Indicator-Colour Lab',
        description: 'Measure the temperature rise when hydrochloric acid neutralizes sodium hydroxide and observe the phenolphthalein endpoint.',
      },
    },
  },
  g9: {
    band: 'Junior high required',
    description: 'Electrolyte conductivity, ionic charge balance, organic compounds, esterification, saponification, and polymers used in daily life.',
    targetExam: 'Comprehensive Assessment Program (CAP)',
    labs: {
      lab_g9_electrolyte_tester: {
        name: 'Electrolyte Conductivity and Ionization Test',
        description: 'Compare the conductivity of pure water, sugar solution, salt solution, hydrochloric acid, and acetic acid.',
      },
      lab_g9_soap_making: {
        name: 'Plant-Oil Soap Making and Salting-Out Lab',
        description: 'Saponify olive or coconut oil with sodium hydroxide, separate the soap with saturated brine, and test its cleaning action.',
      },
      lab_g9_fiber_burn_test: {
        name: 'Fibre and Plastic Burn-Test Identification',
        description: 'Identify cotton, wool, and nylon by their flame behaviour, odour, and residue.',
      },
    },
  },
  g10: {
    band: 'Senior high required',
    description: 'Matter and separation, atomic structure and periodicity, bonding, stoichiometry, common reactions, and green and sustainable chemistry.',
    targetExam: 'General Scholastic Ability Test (GSAT)',
    labs: {
      lab_g10_chromatography: {
        name: 'Paper Chromatography and Pigment Purification',
        description: 'Use stationary- and mobile-phase affinity differences to separate pigments and calculate retention factors.',
      },
      lab_g10_flame_test: {
        name: 'Metal-Ion Flame Tests and Emission Spectra',
        description: 'Observe characteristic emission colours from lithium, sodium, potassium, copper, calcium, and barium ions.',
      },
      lab_g10_conductivity: {
        name: 'Conductivity in Different States of Matter',
        description: 'Compare ionic, metallic, and molecular substances as solids, melts, and aqueous solutions.',
      },
      lab_g10_stoichiometry_gas: {
        name: 'Carbonate Stoichiometry and Gas Molar Volume',
        description: 'Measure carbon dioxide by water displacement or mass loss to verify reaction stoichiometry and conservation of mass.',
      },
      lab_g10_biodiesel: {
        name: 'Green Biodiesel from Waste Cooking Oil',
        description: 'Run base-catalyzed transesterification with methanol, separate glycerol, and compare biodiesel viscosity and heat of combustion.',
      },
    },
  },
  g11: {
    band: 'Senior high elective',
    description: 'Gas laws, phases and colligative properties, orbitals and molecular geometry, kinetics, and dynamic chemical equilibrium.',
    targetExam: 'Advanced Subjects Test (AST)',
    labs: {
      lab_g11_charles_law: {
        name: 'Charles\'s Law and Absolute-Zero Extrapolation',
        description: 'Measure a trapped air volume in water baths at different temperatures and extrapolate toward absolute zero.',
      },
      lab_g11_freezing_point: {
        name: 'Molar Mass by Freezing-Point Depression',
        description: 'Compare cooling curves for a pure solvent and a solution to determine the molar mass of an unknown solute.',
      },
      lab_g11_molecular_models: {
        name: 'Molecular Geometry and Hybridization Models',
        description: 'Build methane, ammonia, water, and sulfur hexafluoride models to examine bond angles and lone-pair repulsion.',
      },
      lab_g11_thiosulfate_rate: {
        name: 'Thiosulfate Reaction Rate and Activation Energy',
        description: 'Use the disappearing-cross method at varied concentrations and temperatures to estimate reaction order and activation energy.',
      },
      lab_g11_le_chatelier: {
        name: 'Le Chatelier Equilibrium-Shift Lab',
        description: 'Test acid-base effects on chromate equilibrium and temperature effects on cobalt chloride complex equilibrium.',
      },
    },
  },
  g12: {
    band: 'Senior high elective',
    description: 'Acid-base and salt equilibria, buffers and titration, solubility, electrochemical cells, electrolysis, organic chemistry, and biomolecules.',
    targetExam: 'Advanced Subjects Test (AST)',
    labs: {
      lab_g12_buffer_ph: {
        name: 'Buffer Preparation and Buffer-Capacity Lab',
        description: 'Prepare acetic-acid/acetate buffers and compare pH changes after adding small amounts of strong acid or base.',
      },
      lab_g12_potentiometric_titration: {
        name: 'Potentiometric Titration and Ka Determination',
        description: 'Record a pH titration curve and use its derivative to locate the equivalence point and pKa.',
      },
      lab_g12_ksp_determination: {
        name: 'Solubility-Product and Precipitation-Equilibrium Lab',
        description: 'Measure ion concentrations in a saturated sparingly soluble salt solution and calculate its solubility product.',
      },
      lab_g12_galvanic_cell: {
        name: 'Galvanic-Cell Potential and Nernst Effects',
        description: 'Assemble several metal electrode pairs, measure open-circuit voltage, and test concentration effects on cell potential.',
      },
      lab_g12_organic_synthesis: {
        name: 'Isoamyl Acetate Synthesis and Functional-Group Tests',
        description: 'Reflux acetic acid with isoamyl alcohol under acid catalysis, then extract and identify the banana-scented ester.',
      },
      lab_g12_silver_mirror: {
        name: 'Silver-Mirror and Organic Functional-Group Tests',
        description: 'Use Tollens\' reagent to identify aldehydes and reducing sugars and examine the associated redox chemistry.',
      },
    },
  },
}

export const CHEMISTRY_UNIT_EN: Record<string, ChemistryUnitCopy> = {
  g7_u1_solutions_and_solubility: {
    title: 'Aqueous Solutions, Concentration, and Solubility',
    subtitle: 'Solutes and solvents, percent concentration, ppm, saturation, and solubility curves',
    concepts: [
      'A solution is a homogeneous mixture of solute and solvent. Its particles are smaller than $1\\text{ nm}$, do not settle, and pass through filter paper.',
      'Mass-percent concentration is $P\\%=\\frac{W_{\\text{solute}}}{W_{\\text{solution}}}\\times100\\%=\\frac{W_{\\text{solute}}}{W_{\\text{solute}}+W_{\\text{solvent}}}\\times100\\%$.',
      'Parts per million is $\\text{ppm}=\\frac{W_{\\text{solute (mg)}}}{W_{\\text{solution (kg)}}}=\\frac{W_{\\text{solute}}}{W_{\\text{solution}}}\\times10^6$.',
      'Solubility is the maximum mass of solute that dissolves in $100\\text{ g}$ of solvent at a specified temperature.',
      'An unsaturated solution can dissolve more solute; a saturated solution is at dynamic equilibrium; an unstable supersaturated solution crystallizes when seeded or disturbed.',
    ],
    suggestedLab: 'Measure potassium nitrate solubility at several water temperatures and observe crystallization during cooling.',
  },
  g7_u2_mixtures_separation: {
    title: 'Classification and Separation of Matter',
    subtitle: 'Pure substances, mixtures, filtration, crystallization, distillation, and paper chromatography',
    concepts: [
      'Pure substances are elements or compounds with characteristic melting and boiling points; mixtures such as air and salt water do not have fixed melting or boiling points.',
      'Choose a separation method by physical property: filtration for particle size, evaporation or crystallization for volatility and solubility, distillation for boiling-point differences, and chromatography for different affinities. In chromatography, $R_f=\\frac{\\text{distance travelled by solute}}{\\text{distance travelled by solvent front}}$.',
    ],
    suggestedLab: 'Purify crude salt by dissolving it, filtering insoluble impurities, and evaporating the filtrate to crystallize salt.',
  },
  g8_u3_atoms_and_periodic_table: {
    title: 'Atoms, Molecules, and the Periodic Table',
    subtitle: 'Dalton\'s theory, subatomic particles, isotopes, groups, periods, and periodic patterns',
    concepts: [
      'Dalton proposed that matter consists of atoms, compounds use simple whole-number ratios, and reactions rearrange atoms. Later evidence revealed subatomic particles and isotopes.',
      'An atom contains protons and neutrons in its nucleus and electrons outside it. Atomic number equals proton count and, for a neutral atom, electron count; mass number equals protons plus neutrons.',
      'The modern periodic table is ordered by atomic number. Elements in a group have similar properties, including alkali metals, alkaline-earth metals, halogens, and noble gases.',
    ],
    suggestedLab: 'Compare alkali-metal reactions with water and test the resulting solution and hydrogen gas.',
  },
  g8_u4_stoichiometry_and_reactions: {
    title: 'Chemical Equations, Conservation of Mass, and the Mole',
    subtitle: 'Balancing equations, mole conversions, limiting reagents, and reaction yields',
    concepts: [
      'In a closed system, total mass before a reaction equals total mass after it because atom types and counts are conserved.',
      'Balanced coefficients conserve atoms and charge and represent particle or mole ratios, not mass ratios.',
      '$1\\text{ mol}=6.02\\times10^{23}$ particles, and amount is $n=\\frac{W}{M_w}$.',
    ],
    suggestedLab: 'Verify mass conservation for a precipitation reaction between sodium carbonate and calcium chloride in a closed system.',
  },
  g8_u5_redox_and_metal_activity: {
    title: 'Redox Reactions and Metal Activity',
    subtitle: 'Metal activity, oxygen transfer, oxidizing and reducing agents, and iron smelting',
    concepts: [
      'A useful activity series is $\\text{K}>\\text{Na}>\\text{Ca}>\\text{Mg}>\\text{Al}>\\text{C}>\\text{Zn}>\\text{Fe}>\\text{Sn}>\\text{Pb}>\\text{H}>\\text{Cu}>\\text{Hg}>\\text{Ag}>\\text{Pt}>\\text{Au}$.',
      'A substance that gains oxygen is oxidized and acts as the reducing agent; one that loses oxygen is reduced and acts as the oxidizing agent. More active metals bind oxygen more readily.',
      'In a blast furnace, carbon monoxide reduces iron(III) oxide: $\\text{Fe}_2\\text{O}_3+3\\text{CO}\\rightarrow2\\text{Fe}+3\\text{CO}_2$. Limestone removes silica as calcium silicate slag.',
    ],
    suggestedLab: 'Compare metal activity and oxygen transfer by igniting magnesium with carbon dioxide.',
  },
  g8_u6_acids_bases_salts: {
    title: 'Common Acids, Bases, Salts, and Neutralization',
    subtitle: 'Indicators, pH, neutralization, and salts used in daily life',
    concepts: [
      'Acid solutions turn blue litmus red, react with sufficiently active metals to produce hydrogen, and react with carbonates to produce carbon dioxide. Always add concentrated acid to water during dilution.',
      'Base solutions turn red litmus blue, turn phenolphthalein pink, and can dissolve grease.',
      'Neutralization is acid plus base forming salt and water while releasing heat. At completion, moles of $\\text{H}^+$ equal moles of $\\text{OH}^-$.',
      'Common salts include $\\text{CaCO}_3$ in limestone, $\\text{Na}_2\\text{CO}_3$ as washing soda, $\\text{NaHCO}_3$ as baking soda, and $\\text{CaSO}_4$ as gypsum.',
    ],
    suggestedLab: 'Titrate hydrochloric acid with sodium hydroxide while tracking indicator colour and temperature change.',
  },
  g9_u7_electrolytes_and_ions: {
    title: 'Electrolytes, Ions, and Ionization',
    subtitle: 'Arrhenius ionization, strong and weak electrolytes, conductivity, and charge neutrality',
    concepts: [
      'An electrolyte is a compound that forms mobile ions in water, allowing the solution to conduct electricity; its solid form generally does not conduct.',
      'Strong electrolytes dissociate almost completely, weak electrolytes only partly, and nonelectrolytes such as sugar and ethanol remain as molecules in solution.',
      'Every solution is electrically neutral: total positive charge equals total negative charge, although cation and anion counts need not be equal.',
    ],
    suggestedLab: 'Use an LED or conductivity probe to compare ion formation and conductivity in several aqueous solutions.',
  },
  g9_u8_organic_compounds: {
    title: 'Organic Compounds and Common Reactions',
    subtitle: 'Hydrocarbons, alcohols, carboxylic acids, esterification, saponification, and cleaning action',
    concepts: [
      'Organic compounds are carbon compounds, with conventional exceptions such as carbon oxides, carbonic acid, carbonates, and cyanides.',
      'Hydrocarbons contain only carbon and hydrogen. Natural gas is mainly methane, while liquefied petroleum gas is mainly propane and butane.',
      'Esterification combines a carboxylic acid and alcohol under heated concentrated sulfuric acid to form an ester and water. Many esters are fragrant, poorly soluble in water, and less dense than water.',
      'Saponification converts a triglyceride and sodium hydroxide into soap and glycerol. Brine salts out the soap; its nonpolar tail binds grease while its ionic head interacts with water.',
    ],
    suggestedLab: 'Make soap from coconut oil and synthesize a fragrant ester, then separate and identify the products.',
  },
  g9_u9_polymers_and_materials: {
    title: 'Polymers, Synthetic Materials, and Everyday Chemistry',
    subtitle: 'Monomers, natural and synthetic polymers, thermoplastics, thermosets, and recycling codes',
    concepts: [
      'A polymer is a high-molar-mass molecule made by joining thousands of repeating monomer units.',
      'Natural polymers include starch, cellulose, proteins, and natural rubber; synthetic polymers include fibres, rubbers, and plastics.',
      'Thermoplastics have chains that can soften and be reshaped, while thermosets have covalent cross-links and char rather than melt.',
      'Common recycling codes include 1 PET, 2 HDPE, 3 PVC, 4 LDPE, 5 PP, 6 PS, and 7 other plastics.',
    ],
    suggestedLab: 'Identify natural and synthetic fibres by observing their burning behaviour and heat response.',
  },
  g10_u1_matter_classification: {
    title: 'Composition, Classification, and Purification of Matter',
    subtitle: 'Pure substances, mixtures, physical and chemical changes, chromatography, distillation, and composition laws',
    concepts: [
      'Matter may be a homogeneous mixture, a heterogeneous mixture such as a colloid or suspension, or a pure element or compound.',
      'Separation methods exploit particle size, solubility, boiling point, partitioning, or stationary/mobile-phase affinity; paper chromatography uses a retention factor $R_f$.',
      'The laws of conservation of mass, definite proportions, and multiple proportions connect measured masses to fixed atomic ratios.',
      'Avogadro\'s law states that equal gas volumes at the same temperature and pressure contain equal numbers of molecules, so $V\\propto n$.',
    ],
    suggestedLab: 'Separate mixed pigments by paper chromatography and purify a solid by recrystallization.',
  },
  g10_u2_atomic_structure: {
    title: 'Atomic Structure and the Periodic Table',
    subtitle: 'Atomic models, isotopes, shell configurations, and periodic trends',
    concepts: [
      'Atomic models progressed from Dalton to Thomson, Rutherford, Bohr, and the modern quantum-mechanical model as new evidence appeared.',
      'In ${}^{A}_{Z}\\text X$, $Z$ is the proton count and $A=Z+N$. Isotopes share a proton count but differ in neutron count.',
      'A principal shell can hold at most $2n^2$ electrons: K 2, L 8, M 18, and N 32.',
      'For the first 20 elements, period number tracks occupied shells and main-group number tracks valence electrons.',
      'Across a period atomic radius generally decreases and metallic character declines; down a group both radius and metallic character increase.',
    ],
    suggestedLab: 'Use flame colours and emission spectra to investigate periodic behaviour in metal ions.',
  },
  g10_u3_chemical_bonding: {
    title: 'Chemical Bonding and Formulas',
    subtitle: 'Octets, ionic, covalent, and metallic bonding, crystal types, and chemical formulas',
    concepts: [
      'Ionic bonding is electrostatic attraction between ions, covalent bonding shares electron pairs, and metallic bonding joins metal cations through delocalized electrons.',
      'The octet rule describes main-group atoms gaining, losing, or sharing electrons to reach a noble-gas valence shell, with helium as a duet exception.',
      'Network covalent, ionic, metallic, and molecular solids have distinct melting, hardness, and conductivity patterns because their particles and attractions differ.',
      'Empirical formulas give simplest ratios, molecular formulas give actual atom counts, condensed formulas highlight groups, and structural formulas show connectivity.',
    ],
    suggestedLab: 'Relate bonding to conductivity by testing substances as solids, melts, and aqueous solutions.',
  },
  g10_u4_stoichiometry: {
    title: 'Chemical Equations and Stoichiometry',
    subtitle: 'Mole conversions, limiting reagents, theoretical yield, and molar concentration',
    concepts: [
      'The mole connects measurements through $n=\\frac{W}{M_w}=\\frac{N}{N_A}=\\frac{V}{22.4\\text{ L at STP}}=M V_{\\text{(L)}}$.',
      'Balance the equation, convert every amount to moles, identify the limiting reagent, and use coefficient ratios to calculate product amount.',
      'The smallest value of $n_{\\text{available}}/\\text{coefficient}$ identifies the limiting reagent.',
      'Percent yield is $\\frac{\\text{actual yield}}{\\text{theoretical yield}}\\times100\\%$.',
      'For mass percent $P\\%$ and density $D$ in $\\text{g/cm}^3$, molarity is $M=\\frac{10P\\%D}{M_w}$.',
    ],
    suggestedLab: 'Measure carbon dioxide from a carbonate-acid reaction to test stoichiometry, conservation of mass, and gas molar volume.',
  },
  g10_u5_common_reactions: {
    title: 'Common Reactions: Acid-Base, Precipitation, and Redox',
    subtitle: 'Solubility rules, neutralization, oxidation numbers, and everyday redox chemistry',
    concepts: [
      'Solubility rules predict precipitates: salts of alkali metals, ammonium, nitrate, and acetate are soluble, while selected halides and sulfates form insoluble salts.',
      'Neutralization has the net ionic equation $\\text{H}^++\\text{OH}^-\\rightarrow\\text{H}_2\\text O$ and releases about $56\\text{ kJ/mol}$; equivalence requires equal acid and base equivalents.',
      'Oxidation raises oxidation number and loses electrons; reduction lowers oxidation number and gains electrons. Disproportionation oxidizes and reduces the same element.',
    ],
    suggestedLab: 'Titrate vitamin C as an antioxidant and investigate selective precipitation reactions.',
  },
  g10_u6_life_and_sustainability: {
    title: 'Chemistry in Life and Green Sustainability',
    subtitle: 'Chemical energy, fuels, food and medicines, atmospheric chemistry, green chemistry, and atom economy',
    concepts: [
      'Petroleum fractions include LPG, gasoline, and diesel. Octane number compares knock resistance with isooctane at 100 and n-heptane at 0.',
      'Green chemistry emphasizes waste prevention, high atom economy, safer synthesis, catalysis, and renewable feedstocks. $\\text{AE}=\\frac{\\text{molar mass of desired product}}{\\text{sum of reactant molar masses}}\\times100\\%$.',
      'Atmospheric topics include acid rain from sulfur and nitrogen oxides, greenhouse gases, and photochemical smog containing ozone and PAN.',
    ],
    suggestedLab: 'Prepare a natural acid-base indicator and synthesize biodiesel by transesterification.',
  },
  g11_u7_gas_laws: {
    title: 'Gas Properties and Gas Laws',
    subtitle: 'Ideal gases, partial pressures, Graham diffusion, and van der Waals corrections',
    concepts: [
      'The ideal-gas equation is $PV=nRT=\\frac{W}{M_w}RT$, so gas density obeys $PM_w=dRT$.',
      'Dalton\'s law gives $P_{\\text{total}}=\\sum P_i$ and $P_i=X_iP_{\\text{total}}$. For gas collected over water, subtract saturated water-vapour pressure.',
      'Graham\'s law is $\\frac{r_1}{r_2}=\\sqrt{\\frac{M_2}{M_1}}=\\sqrt{\\frac{d_2}{d_1}}$.',
      'Real gases approach ideal behaviour at high temperature and low pressure. In $\\left(P+\\frac{n^2a}{V^2}\\right)(V-nb)=nRT$, $a$ corrects attraction and $b$ molecular volume.',
    ],
    suggestedLab: 'Verify Charles\'s law by measuring gas volume at constant pressure over a range of absolute temperatures.',
  },
  g11_u8_liquids_solids_colligative: {
    title: 'Liquids, Solids, and Colligative Properties',
    subtitle: 'Intermolecular forces, phase diagrams, Raoult\'s law, boiling and freezing shifts, and osmotic pressure',
    concepts: [
      'Hydrogen bonding involving H bonded to F, O, or N is generally stronger than dipole-dipole attraction, which is stronger than dispersion for similar-sized molecules.',
      'A phase diagram contains triple and critical points. Water\'s solid-liquid line slopes negatively because melting ice reduces volume.',
      'For a nonvolatile nonelectrolyte, Raoult\'s law is $P_{\\text{solution}}=P^\\circ_{\\text{solvent}}X_{\\text{solvent}}$ and $\\Delta P=P^\\circ_{\\text{solvent}}X_{\\text{solute}}$.',
      'Colligative relations are $\\Delta T_b=iK_bm$, $\\Delta T_f=iK_fm$, and $\\Pi=iC_MRT$; they depend on effective particle concentration.',
    ],
    suggestedLab: 'Determine an unknown molar mass from the freezing-point depression of a solvent.',
  },
  g11_u9_atomic_orbitals_bonding: {
    title: 'Atomic Orbitals, Molecular Geometry, and Crystal Structure',
    subtitle: 'Quantum numbers, electron filling, ionization energy, VSEPR, hybridization, FCC, and BCC lattices',
    concepts: [
      'The quantum numbers are $n$ for shell, $l$ for subshell shape, $m_l$ for orientation, and $m_s=\\pm\\frac12$ for spin.',
      'Electrons fill according to the Aufbau principle, Pauli exclusion principle, and Hund\'s rule.',
      'Ionization energy generally rises across a period, with subshell and pairing exceptions; a large successive jump reveals the valence-electron count.',
      'VSEPR connects electron-domain count to geometry and hybridization: two domains are $sp$, three $sp^2$, and four $sp^3$, with lone pairs compressing bond angles.',
      'BCC has coordination number 8, two atoms per unit cell, and $\\sqrt3a=4r$; FCC has coordination number 12, four atoms per cell, and $\\sqrt2a=4r$.',
    ],
    suggestedLab: 'Build ball-and-stick molecular models to relate electron domains, hybridization, symmetry, and bond angles.',
  },
  g11_u10_reaction_kinetics: {
    title: 'Reaction Rates and Chemical Kinetics',
    subtitle: 'Rate laws, initial rates, half-life, collision theory, Arrhenius behaviour, catalysts, and mechanisms',
    concepts: [
      'A measured rate law has the form $r=k[A]^m[B]^n$; orders come from experiment, not directly from the balanced equation.',
      'For a first-order reaction, $t_{1/2}=\\frac{\\ln2}{k}=\\frac{0.693}{k}$ and is independent of initial concentration.',
      'An effective collision has energy at least equal to the activation energy and a productive orientation.',
      'The Arrhenius equation $k=Ae^{-E_a/(RT)}$ gives a linear plot of $\\ln k$ against $1/T$ with slope $-E_a/R$.',
      'A catalyst lowers forward and reverse activation energies through an alternate pathway but does not change $\\Delta H$, $K$, or equilibrium composition.',
      'In a multistep mechanism, the slow step with the largest effective barrier is the rate-determining step.',
    ],
    suggestedLab: 'Use the disappearing-cross reaction of thiosulfate and acid to study concentration and temperature effects on rate.',
  },
  g11_u11_chemical_equilibrium: {
    title: 'Chemical Equilibrium and Equilibrium Constants',
    subtitle: 'Dynamic equilibrium, Kc and Kp, reaction quotients, and Le Chatelier\'s principle',
    concepts: [
      'At dynamic equilibrium, forward and reverse rates are equal and nonzero while macroscopic concentrations and pressures remain constant.',
      'For $aA+bB\\rightleftharpoons cC+dD$, $K_c=\\frac{[C]^c[D]^d}{[A]^a[B]^b}$ and pure solids and liquids are omitted; $K_p=K_c(RT)^{\\Delta n}$.',
      'If $Q<K$, net reaction proceeds right; if $Q=K$, the system is at equilibrium; if $Q>K$, it proceeds left.',
      'A system shifts to oppose a disturbance. Only temperature changes $K$; compression favours the side with fewer gas moles.',
    ],
    suggestedLab: 'Observe acid-base and temperature shifts in chromate and cobalt-complex equilibria.',
  },
  g12_u12_acid_base_equilibria: {
    title: 'Aqueous Acid-Base Equilibria and Salt Hydrolysis',
    subtitle: 'Bronsted-Lowry theory, Ka and Kb, polyprotic acids, and salt-solution pH',
    concepts: [
      'A Bronsted-Lowry acid donates a proton and a base accepts one. For a conjugate pair, $K_aK_b=K_w=1.0\\times10^{-14}$ at $25^\\circ\\text C$.',
      'For $HA\\rightleftharpoons H^++A^-$ with $C_0/K_a\\ge400$, $[H^+]\\approx\\sqrt{C_0K_a}$ and $\\alpha\\approx\\sqrt{K_a/C_0}$. Dilution raises fractional ionization but lowers $[H^+]$.',
      'Polyprotic acids ionize stepwise with $K_{a1}\\gg K_{a2}\\gg K_{a3}$; the first step usually dominates hydrogen-ion concentration.',
      'Strong-acid/strong-base salts are neutral; conjugate acids of weak bases acidify water, and conjugate bases of weak acids make it basic through hydrolysis.',
    ],
    suggestedLab: 'Measure pH precisely for salt solutions containing different conjugate ions and metal ions.',
  },
  g12_u13_buffers_and_titration: {
    title: 'Buffer Solutions and Acid-Base Titration',
    subtitle: 'Buffer action, Henderson-Hasselbalch, buffer capacity, titration curves, and indicator selection',
    concepts: [
      'A buffer contains a weak acid and its conjugate-base salt or a weak base and its conjugate-acid salt.',
      '$\\text{pH}=\\text{p}K_a+\\log\\frac{[A^-]}{[HA]}$. At the half-equivalence point $[A^-]=[HA]$, so $\\text{pH}=\\text{p}K_a$ and buffering is strongest.',
      'Strong acid-strong base equivalence is near pH 7; strong base-weak acid equivalence is basic and suits phenolphthalein; strong acid-weak base equivalence is acidic and suits methyl red or methyl orange.',
    ],
    suggestedLab: 'Use a pH electrode to titrate vinegar, plot the curve and its derivative, and determine acetic-acid content.',
  },
  g12_u14_solubility_product: {
    title: 'Sparingly Soluble Salts and Solubility Equilibria',
    subtitle: 'Ksp, molar solubility, Qsp, common ions, selective precipitation, and complex formation',
    concepts: [
      'For $M_mX_n(s)\\rightleftharpoons mM^{n+}+nX^{m-}$, $K_{sp}=[M^{n+}]^m[X^{m-}]^n$ and, in pure water, $K_{sp}=m^mn^nS^{m+n}$.',
      '$Q_{sp}<K_{sp}$ is unsaturated, $Q_{sp}=K_{sp}$ is saturated, and $Q_{sp}>K_{sp}$ causes precipitation until equilibrium is restored.',
      'Adding a common ion shifts dissolution left and lowers molar solubility.',
      'A ligand such as $NH_3$ can bind free metal ions in a stable complex, lower their concentration, and drive a precipitate to dissolve.',
    ],
    suggestedLab: 'Compare ammonia and thiosulfate effects on silver halide precipitation and dissolution equilibria.',
  },
  g12_u15_redox_and_galvanic_cells: {
    title: 'Redox Reactions and Galvanic Cells',
    subtitle: 'Half-reaction balancing, standard reduction potentials, cell notation, emf, and the Nernst equation',
    concepts: [
      'Balance redox equations with half-reactions by balancing atoms, then oxygen with water, hydrogen with $H^+$, and charge with electrons; in base, neutralize $H^+$ with $OH^-$.',
      'Standard reduction potentials are measured relative to the standard hydrogen electrode. A larger $E^\\circ$ means a stronger tendency to be reduced.',
      'In a galvanic cell, oxidation occurs at the negative anode and reduction at the positive cathode. The salt bridge maintains charge balance, and $E^\\circ_{cell}=E^\\circ_{cathode}-E^\\circ_{anode}$.',
    ],
    suggestedLab: 'Assemble a zinc-copper cell, measure its emf, and trace electron and salt-bridge ion flow.',
  },
  g12_u16_electrolysis_and_batteries: {
    title: 'Electrolysis, Electroplating, and Practical Batteries',
    subtitle: 'Faraday\'s law, aqueous electrolysis products, plating, lead-acid and lithium-ion batteries, and fuel cells',
    concepts: [
      'Faraday\'s law gives $Q=It=n(e^-)F$ with $F=96500\\text{ C/mol }e^-$, and deposited mass $W=\\frac{ItM}{nF}$.',
      'In aqueous electrolysis, cathode reduction and anode oxidation compete. Electrode material, reduction potentials, halides, and water determine the products.',
      'A discharging lead-acid battery follows $Pb+PbO_2+2H_2SO_4\\rightarrow2PbSO_4+2H_2O$, lowering acid concentration. A hydrogen-oxygen fuel cell produces water.',
    ],
    suggestedLab: 'Electroplate copper from copper sulfate and use mass change to estimate Faraday\'s constant.',
  },
  g12_u17_organic_and_biomolecules: {
    title: 'Organic Compounds, Polymers, and Biomolecules',
    subtitle: 'Functional groups, structural and stereoisomers, organic tests, reaction types, polymers, carbohydrates, and proteins',
    concepts: [
      'Degree of unsaturation is $\\text{IHD}=C+1-\\frac{H-N+X}{2}$; a ring or double bond contributes 1, a triple bond 2, and a benzene ring 4.',
      'Isomers include constitutional isomers and stereoisomers. A tetrahedral carbon bonded to four different groups is a chiral centre.',
      'Alkenes decolourize bromine, aldehydes give Tollens and Fehling tests, phenols colour with ferric chloride, and carboxylic acids release carbon dioxide from bicarbonate.',
      'Addition polymers include PE and PVC; condensation polymers include PET and nylon. Biomolecules use glycosidic, peptide, and phosphodiester linkages.',
    ],
    suggestedLab: 'Synthesize and purify an ester, then identify aldehydes and reducing sugars with a silver-mirror test.',
  },
}
