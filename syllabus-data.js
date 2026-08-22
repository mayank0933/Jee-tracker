// Complete JEE Main & Advanced Syllabus, Formulas and Routine Templates
const JEE_SYLLABUS_DATA = {
  "physics": [
    {
      "id": "phy_11_01",
      "name": "Units, Dimensions & Errors",
      "class": 11,
      "weightage": "Medium",
      "topics": [
        "Dimensional Analysis",
        "Significant Figures",
        "Vernier & Screw Gauge",
        "Error Analysis"
      ]
    },
    {
      "id": "phy_11_02",
      "name": "Motion in a Straight Line",
      "class": 11,
      "weightage": "Medium",
      "topics": [
        "Kinematics Graphs",
        "Uniform Acceleration",
        "Relative Motion 1D",
        "Variable Acceleration"
      ]
    },
    {
      "id": "phy_11_03",
      "name": "Motion in a Plane (Vectors & Projectile)",
      "class": 11,
      "weightage": "High",
      "topics": [
        "Vector Algebra",
        "Projectile on Horizontal/Inclined",
        "Relative Motion in 2D",
        "Rain-Man / River-Boat"
      ]
    },
    {
      "id": "phy_11_04",
      "name": "Laws of Motion & Friction",
      "class": 11,
      "weightage": "High",
      "topics": [
        "Free Body Diagrams",
        "Pulley & Constraint Motion",
        "Static & Kinetic Friction",
        "Circular Dynamics"
      ]
    },
    {
      "id": "phy_11_05",
      "name": "Work, Energy & Power",
      "class": 11,
      "weightage": "High",
      "topics": [
        "Work-Energy Theorem",
        "Conservative Forces & Potential Energy",
        "Power",
        "Vertical Circular Motion"
      ]
    },
    {
      "id": "phy_11_06",
      "name": "Centre of Mass & Collisions",
      "class": 11,
      "weightage": "High",
      "topics": [
        "Calculation of COM",
        "Conservation of Momentum",
        "Elastic & Inelastic Collisions",
        "Impulse"
      ]
    },
    {
      "id": "phy_11_07",
      "name": "Rotational Motion (Rigid Body Dynamics)",
      "class": 11,
      "weightage": "High",
      "topics": [
        "Moment of Inertia Theorems",
        "Torque & Angular Momentum",
        "Pure Rolling Motion",
        "Toppling & Dynamic Equilibrium"
      ]
    },
    {
      "id": "phy_11_08",
      "name": "Gravitation",
      "class": 11,
      "weightage": "High",
      "topics": [
        "Gravitational Field & Potential",
        "Kepler's Laws",
        "Escape & Orbital Velocity",
        "Satellite Motion & Energy"
      ]
    },
    {
      "id": "phy_11_09",
      "name": "Mechanical Properties of Solids (Elasticity)",
      "class": 11,
      "weightage": "Medium",
      "topics": [
        "Stress-Strain Curve",
        "Young's, Bulk & Shear Modulus",
        "Elastic Potential Energy"
      ]
    },
    {
      "id": "phy_11_10",
      "name": "Fluid Mechanics",
      "class": 11,
      "weightage": "High",
      "topics": [
        "Pascal's & Archimedes Principle",
        "Equation of Continuity & Bernoulli",
        "Surface Tension & Capillarity",
        "Viscosity & Poiseuille's Flow"
      ]
    },
    {
      "id": "phy_11_11",
      "name": "Thermal Properties of Matter & Calorimetry",
      "class": 11,
      "weightage": "Medium",
      "topics": [
        "Thermal Expansion",
        "Calorimetry & Phase Change",
        "Modes of Heat Transfer (Conduction/Radiation)",
        "Newton's Law of Cooling & Wien's Law"
      ]
    },
    {
      "id": "phy_11_12",
      "name": "Thermodynamics & KTG",
      "class": 11,
      "weightage": "High",
      "topics": [
        "First & Second Law of Thermodynamics",
        "Isothermal, Adiabatic, Isobaric, Isochoric",
        "Carnot Engine & Efficiency",
        "Degrees of Freedom & KTG Equations"
      ]
    },
    {
      "id": "phy_11_13",
      "name": "Oscillations (Simple Harmonic Motion)",
      "class": 11,
      "weightage": "High",
      "topics": [
        "SHM Equations & Energy",
        "Simple & Physical Pendulum",
        "Spring-Mass Systems",
        "Damped & Forced Oscillations"
      ]
    },
    {
      "id": "phy_11_14",
      "name": "Waves & Sound Waves",
      "class": 11,
      "weightage": "High",
      "topics": [
        "Wave Equation & Speed on Strings",
        "Standing Waves & Harmonics",
        "Organ Pipes & Resonance Tube",
        "Beats & Doppler Effect"
      ]
    },
    {
      "id": "phy_12_01",
      "name": "Electrostatics & Gauss's Law",
      "class": 12,
      "weightage": "High",
      "topics": [
        "Coulomb's Law & Superposition",
        "Electric Field & Dipole",
        "Gauss's Law & Flux Applications",
        "Potential & Potential Energy of Continuous Systems"
      ]
    },
    {
      "id": "phy_12_02",
      "name": "Capacitance",
      "class": 12,
      "weightage": "High",
      "topics": [
        "Parallel Plate Capacitor with Dielectrics",
        "Combination of Capacitors",
        "Energy Stored & Redistribution",
        "RC Circuits Charging & Discharging"
      ]
    },
    {
      "id": "phy_12_03",
      "name": "Current Electricity",
      "class": 12,
      "weightage": "High",
      "topics": [
        "Drift Velocity & Ohm's Law",
        "Kirchhoff's Laws & Circuit Analysis",
        "Wheatstone Bridge & Meter Bridge",
        "Potentiometer, Galvanometer, Ammeter & Voltmeter"
      ]
    },
    {
      "id": "phy_12_04",
      "name": "Magnetic Effects of Current",
      "class": 12,
      "weightage": "High",
      "topics": [
        "Biot-Savart Law",
        "Ampere's Circuital Law",
        "Force on Moving Charges & Current Wires",
        "Torque on Current Loop & Magnetic Dipole"
      ]
    },
    {
      "id": "phy_12_05",
      "name": "Magnetism & Matter",
      "class": 12,
      "weightage": "Low",
      "topics": [
        "Bar Magnet & Earth's Magnetism",
        "Dia, Para, Ferro Magnetism",
        "Hysteresis Curve & Magnetic Permeability"
      ]
    },
    {
      "id": "phy_12_06",
      "name": "Electromagnetic Induction (EMI)",
      "class": 12,
      "weightage": "High",
      "topics": [
        "Faraday's Law & Lenz's Law",
        "Motional EMF",
        "Self & Mutual Inductance",
        "LR Circuits & Energy in Inductors"
      ]
    },
    {
      "id": "phy_12_07",
      "name": "Alternating Current (AC)",
      "class": 12,
      "weightage": "High",
      "topics": [
        "Phasors & AC Circuit Components",
        "Series LCR Circuits & Resonance",
        "Power Factor & Quality Factor",
        "Transformers & LC Oscillations"
      ]
    },
    {
      "id": "phy_12_08",
      "name": "Electromagnetic Waves (EM Waves)",
      "class": 12,
      "weightage": "Medium",
      "topics": [
        "Displacement Current",
        "Maxwell's Equations",
        "EM Wave Spectrum & Energy Density",
        "Poynting Vector"
      ]
    },
    {
      "id": "phy_12_09",
      "name": "Ray Optics & Optical Instruments",
      "class": 12,
      "weightage": "High",
      "topics": [
        "Reflection & Refraction at Spherical Surfaces",
        "Total Internal Reflection (TIR)",
        "Lens Maker's Formula & Prism Dispersion",
        "Microscopes & Telescopes"
      ]
    },
    {
      "id": "phy_12_10",
      "name": "Wave Optics",
      "class": 12,
      "weightage": "High",
      "topics": [
        "Huygens' Principle",
        "Young's Double Slit Experiment (YDSE)",
        "Diffraction at a Single Slit",
        "Polarization & Brewster's Law"
      ]
    },
    {
      "id": "phy_12_11",
      "name": "Dual Nature of Radiation & Matter",
      "class": 12,
      "weightage": "High",
      "topics": [
        "Photoelectric Effect & Einstein's Equation",
        "Stopping Potential & Work Function",
        "de-Broglie Wavelength",
        "Davisson-Germer Experiment"
      ]
    },
    {
      "id": "phy_12_12",
      "name": "Atoms & Nuclei (Modern Physics)",
      "class": 12,
      "weightage": "High",
      "topics": [
        "Bohr's Atomic Model & Hydrogen Spectrum",
        "Nuclear Radius & Mass Defect",
        "Binding Energy per Nucleon",
        "Radioactivity (Alpha, Beta, Gamma Decay)"
      ]
    },
    {
      "id": "phy_12_13",
      "name": "Semiconductor Electronics",
      "class": 12,
      "weightage": "High",
      "topics": [
        "Energy Bands (Intrinsic/Extrinsic)",
        "p-n Junction Diode as Rectifier",
        "Zener Diode as Voltage Regulator",
        "Logic Gates (AND, OR, NOT, NAND, NOR, XOR)"
      ]
    }
  ],
  "chemistry": [
    {
      "id": "chem_11_01",
      "name": "Mole Concept & Stoichiometry",
      "class": 11,
      "branch": "Physical",
      "weightage": "High",
      "topics": [
        "Mole Calculations & Limiting Reagent",
        "Concentration Terms (M, m, N, ppm, mole fraction)",
        "Equivalent Concept & Titrations"
      ]
    },
    {
      "id": "chem_11_02",
      "name": "Atomic Structure",
      "class": 11,
      "branch": "Physical",
      "weightage": "High",
      "topics": [
        "Bohr's Theory & Quantum Numbers",
        "de Broglie & Heisenberg Uncertainty",
        "Schrodinger Wave Equation & Orbitals",
        "Aufbau, Pauli & Hund's Rules"
      ]
    },
    {
      "id": "chem_11_03",
      "name": "States of Matter (Gaseous State)",
      "class": 11,
      "branch": "Physical",
      "weightage": "Medium",
      "topics": [
        "Gas Laws & Ideal Gas Equation",
        "Dalton's & Graham's Laws",
        "van der Waals Equation of Real Gases",
        "Compressibility Factor (Z) & Liquefaction"
      ]
    },
    {
      "id": "chem_11_04",
      "name": "Thermodynamics & Thermochemistry",
      "class": 11,
      "branch": "Physical",
      "weightage": "High",
      "topics": [
        "Enthalpy, Internal Energy, Work",
        "First, Second & Third Law",
        "Hess's Law & Enthalpy of Reactions",
        "Gibbs Free Energy & Spontaneity"
      ]
    },
    {
      "id": "chem_11_05",
      "name": "Chemical & Ionic Equilibrium",
      "class": 11,
      "branch": "Physical",
      "weightage": "High",
      "topics": [
        "Law of Mass Action, Kp & Kc",
        "Le Chatelier's Principle",
        "pH Calculation, Ostwald's Dilution",
        "Buffer Solutions & Salt Hydrolysis",
        "Solubility Product (Ksp)"
      ]
    },
    {
      "id": "chem_11_06",
      "name": "Redox Reactions",
      "class": 11,
      "branch": "Physical",
      "weightage": "Medium",
      "topics": [
        "Oxidation Number Method",
        "Ion-Electron Balancing",
        "n-factor in Redox Titrations"
      ]
    },
    {
      "id": "chem_12_01",
      "name": "Solutions",
      "class": 12,
      "branch": "Physical",
      "weightage": "High",
      "topics": [
        "Raoult's Law & Ideal/Non-ideal Solutions",
        "Colligative Properties (Elevation in BP, Depression in FP, Osmotic Pressure)",
        "van 't Hoff Factor (i)"
      ]
    },
    {
      "id": "chem_12_02",
      "name": "Electrochemistry",
      "class": 12,
      "branch": "Physical",
      "weightage": "High",
      "topics": [
        "Nernst Equation & Cell Potential",
        "Kohlrausch's Law & Molar Conductivity",
        "Faraday's Laws of Electrolysis",
        "Batteries & Corrosion"
      ]
    },
    {
      "id": "chem_12_03",
      "name": "Chemical Kinetics",
      "class": 12,
      "branch": "Physical",
      "weightage": "High",
      "topics": [
        "Rate Law & Order of Reaction",
        "Integrated Rate Equations (0th, 1st, 2nd order)",
        "Arrhenius Equation & Activation Energy",
        "Collision Theory & Catalysis"
      ]
    },
    {
      "id": "chem_12_04",
      "name": "Surface Chemistry",
      "class": 12,
      "branch": "Physical",
      "weightage": "Medium",
      "topics": [
        "Adsorption Isotherms (Freundlich)",
        "Colloids & Tyndall Effect",
        "Emulsions, Micelles & Coagulation (Hardy-Schulze)"
      ]
    },
    {
      "id": "chem_11_07",
      "name": "Periodic Table & Periodicity",
      "class": 11,
      "branch": "Inorganic",
      "weightage": "High",
      "topics": [
        "Ionization Enthalpy Trends",
        "Electron Gain Enthalpy & Electronegativity",
        "Atomic & Ionic Radii Anomalies"
      ]
    },
    {
      "id": "chem_11_08",
      "name": "Chemical Bonding & Molecular Structure",
      "class": 11,
      "branch": "Inorganic",
      "weightage": "High",
      "topics": [
        "VSEPR Theory & Molecular Geometry",
        "Hybridization (sp, sp2, sp3, sp3d, etc.)",
        "Molecular Orbital Theory (MOT)",
        "Hydrogen Bonding & Dipole Moments",
        "Fajan's Rules"
      ]
    },
    {
      "id": "chem_11_09",
      "name": "s-Block & Hydrogen",
      "class": 11,
      "branch": "Inorganic",
      "weightage": "Medium",
      "topics": [
        "Alkali & Alkaline Earth Metals Properties",
        "Anomalous Properties of Li & Be",
        "Hydrides, Heavy Water & Hydrogen Peroxide"
      ]
    },
    {
      "id": "chem_11_10",
      "name": "p-Block Elements (Group 13 & 14)",
      "class": 11,
      "branch": "Inorganic",
      "weightage": "High",
      "topics": [
        "Inert Pair Effect",
        "Boron Compounds (Diborane, Borax)",
        "Allotropes of Carbon, Silicones & Silicates"
      ]
    },
    {
      "id": "chem_12_05",
      "name": "p-Block Elements (Group 15, 16, 17, 18)",
      "class": 12,
      "branch": "Inorganic",
      "weightage": "High",
      "topics": [
        "Nitrogen Oxides & Nitric Acid",
        "Phosphorus Allotropes & Oxoacids",
        "Sulfur Oxoacids & Sulfuric Acid",
        "Halogens & Interhalogens",
        "Noble Gas Compounds (XeF2, XeF4, XeF6)"
      ]
    },
    {
      "id": "chem_12_06",
      "name": "d and f Block Elements",
      "class": 12,
      "branch": "Inorganic",
      "weightage": "High",
      "topics": [
        "Electronic Configuration & Oxidation States",
        "Magnetic Properties & Catalytic Properties",
        "KMnO4 and K2Cr2O7 Chemistry",
        "Lanthanoid & Actinoid Contraction"
      ]
    },
    {
      "id": "chem_12_07",
      "name": "Coordination Compounds",
      "class": 12,
      "branch": "Inorganic",
      "weightage": "High",
      "topics": [
        "Werner's Theory & IUPAC Nomenclature",
        "Structural & Stereo Isomerism",
        "Valence Bond Theory (VBT)",
        "Crystal Field Theory (CFT - Octahedral/Tetrahedral)",
        "Synergic Bonding in Carbonyls"
      ]
    },
    {
      "id": "chem_12_08",
      "name": "Metallurgy & Qualitative Analysis",
      "class": 12,
      "branch": "Inorganic",
      "weightage": "Medium",
      "topics": [
        "Ellingham Diagram & Principles of Extraction",
        "Froth Floatation, Leaching & Refining",
        "Cation/Anion Salt Analysis Tests"
      ]
    },
    {
      "id": "chem_11_11",
      "name": "General Organic Chemistry (GOC)",
      "class": 11,
      "branch": "Organic",
      "weightage": "High",
      "topics": [
        "Inductive, Resonance & Hyperconjugation",
        "Aromaticity (Huckel's Rule)",
        "Carbocation, Carbanion & Free Radical Stability",
        "Acidic & Basic Strength Order"
      ]
    },
    {
      "id": "chem_11_12",
      "name": "Isomerism",
      "class": 11,
      "branch": "Organic",
      "weightage": "High",
      "topics": [
        "Structural Isomerism (Tautomerism)",
        "Geometrical Isomerism (cis/trans, E/Z)",
        "Optical Isomerism (Chirality, Enantiomers, Diastereomers, Meso)"
      ]
    },
    {
      "id": "chem_11_13",
      "name": "Hydrocarbons (Alkanes, Alkenes, Alkynes, Benzene)",
      "class": 11,
      "branch": "Organic",
      "weightage": "High",
      "topics": [
        "Electrophilic Addition to Alkenes (Markovnikov)",
        "Ozonolysis & Hydroboration-Oxidation",
        "Acidity of Alkynes",
        "Electrophilic Aromatic Substitution (Nitration, Friedel-Crafts)"
      ]
    },
    {
      "id": "chem_12_09",
      "name": "Haloalkanes & Haloarenes",
      "class": 12,
      "branch": "Organic",
      "weightage": "High",
      "topics": [
        "SN1 vs SN2 Mechanisms & Stereochemistry",
        "E1 vs E2 Elimination (Saytzeff/Hofmann)",
        "Nucleophilic Aromatic Substitution",
        "Grignard Reagents Reactions"
      ]
    },
    {
      "id": "chem_12_10",
      "name": "Alcohols, Phenols & Ethers",
      "class": 12,
      "branch": "Organic",
      "weightage": "High",
      "topics": [
        "Reimer-Tiemann & Kolbe's Reaction",
        "Lucas Test & Dehydration of Alcohols",
        "Williamson Ether Synthesis & Cleavage with HI"
      ]
    },
    {
      "id": "chem_12_11",
      "name": "Aldehydes & Ketones",
      "class": 12,
      "branch": "Organic",
      "weightage": "High",
      "topics": [
        "Nucleophilic Addition Reactions",
        "Aldol Condensation & Cannizzaro Reaction",
        "Haloform Reaction & Tollens/Fehling Tests",
        "Wolff-Kishner & Clemmensen Reduction"
      ]
    },
    {
      "id": "chem_12_12",
      "name": "Carboxylic Acids & Derivatives",
      "class": 12,
      "branch": "Organic",
      "weightage": "High",
      "topics": [
        "Acidic Strength Factors",
        "HVZ Reaction (Hell-Volhard-Zelinsky)",
        "Esterification, Acid Halides, Anhydrides & Amides"
      ]
    },
    {
      "id": "chem_12_13",
      "name": "Amines & Diazonium Salts",
      "class": 12,
      "branch": "Organic",
      "weightage": "High",
      "topics": [
        "Basicity of Aliphatic & Aromatic Amines",
        "Hoffmann Bromamide Degradation",
        "Gabriel Phthalimide Synthesis",
        "Sandmeyer & Azo Dye Coupling Reactions"
      ]
    },
    {
      "id": "chem_12_14",
      "name": "Biomolecules & Chemistry in Everyday Life",
      "class": 12,
      "branch": "Organic",
      "weightage": "High",
      "topics": [
        "Carbohydrates (Glucose, Fructose, Glycosidic Linkage)",
        "Proteins (Amino Acids, Peptide Bond, Denaturation)",
        "Nucleic Acids (DNA/RNA, Replication)",
        "Vitamins & Enzymes"
      ]
    }
  ],
  "mathematics": [
    {
      "id": "math_11_01",
      "name": "Sets, Relations & Functions (11th)",
      "class": 11,
      "weightage": "Medium",
      "topics": [
        "Venn Diagrams & Set Operations",
        "Types of Relations (Equivalence)",
        "Domain, Range & Types of Functions"
      ]
    },
    {
      "id": "math_11_02",
      "name": "Trigonometric Functions & Equations",
      "class": 11,
      "weightage": "High",
      "topics": [
        "Compound & Multiple Angle Formulas",
        "Trigonometric Series & Transformations",
        "General Solutions of Trig Equations",
        "Properties of Triangles (SOT)"
      ]
    },
    {
      "id": "math_11_03",
      "name": "Complex Numbers & Quadratic Equations",
      "class": 11,
      "weightage": "High",
      "topics": [
        "Roots of Unity & Geometry in Argand Plane",
        "Triangle Inequality & Modulus/Argument",
        "Nature of Roots, Common Roots",
        "Location of Roots for Quadratics"
      ]
    },
    {
      "id": "math_11_04",
      "name": "Permutations & Combinations (PnC)",
      "class": 11,
      "weightage": "High",
      "topics": [
        "Fundamental Principle of Counting",
        "Arrangements & Selections with Constraints",
        "Circular Permutations & Derangements",
        "Distribution of Identical/Distinct Objects (Beggar's Method)"
      ]
    },
    {
      "id": "math_11_05",
      "name": "Binomial Theorem",
      "class": 11,
      "weightage": "High",
      "topics": [
        "General & Middle Terms",
        "Properties of Binomial Coefficients",
        "Divisibility & Remainder Problems",
        "Multinomial Theorem & Approximations"
      ]
    },
    {
      "id": "math_11_06",
      "name": "Sequences & Series",
      "class": 11,
      "weightage": "High",
      "topics": [
        "AP, GP, HP & AGP Properties",
        "AM-GM-HM Inequality",
        "Sum of Special Series (\u03a3n, \u03a3n\u00b2, \u03a3n\u00b3)",
        "Telescoping Sums / Method of Differences"
      ]
    },
    {
      "id": "math_11_07",
      "name": "Straight Lines",
      "class": 11,
      "weightage": "High",
      "topics": [
        "Slope, Intercept & Normal Forms",
        "Angle Between Lines & Distance Formula",
        "Family of Lines & Angle Bisectors",
        "Pair of Straight Lines & Homogenization"
      ]
    },
    {
      "id": "math_11_08",
      "name": "Circles",
      "class": 11,
      "weightage": "High",
      "topics": [
        "Standard & General Equation of Circle",
        "Tangents & Normals (Point, Slope, Parametric)",
        "Chord of Contact & Director Circle",
        "Common Tangents & Radical Axis"
      ]
    },
    {
      "id": "math_11_09",
      "name": "Parabola",
      "class": 11,
      "weightage": "High",
      "topics": [
        "Standard Equations & Properties",
        "Parametric Coordinates (at\u00b2, 2at)",
        "Equations of Tangents & Normals",
        "Focal Chords & Reflection Property"
      ]
    },
    {
      "id": "math_11_10",
      "name": "Ellipse & Hyperbola",
      "class": 11,
      "weightage": "High",
      "topics": [
        "Eccentricity, Foci & Directrix",
        "Parametric Representation & Auxiliary Circle",
        "Tangents, Normals & Director Circle",
        "Asymptotes & Rectangular Hyperbola (xy=c\u00b2)"
      ]
    },
    {
      "id": "math_11_11",
      "name": "Statistics & Mathematical Reasoning",
      "class": 11,
      "weightage": "Medium",
      "topics": [
        "Mean, Median, Mode & Variance",
        "Standard Deviation & Shift of Origin/Scale",
        "Tautology, Contradiction & Contrapositive"
      ]
    },
    {
      "id": "math_12_01",
      "name": "Relations, Functions & ITF",
      "class": 12,
      "weightage": "High",
      "topics": [
        "One-One, Onto, Bijective & Inverse Functions",
        "Composite Functions & Functional Equations",
        "Properties of Inverse Trigonometric Functions",
        "Summation of ITF Series"
      ]
    },
    {
      "id": "math_12_02",
      "name": "Matrices & Determinants",
      "class": 12,
      "weightage": "High",
      "topics": [
        "Matrix Multiplication & Transpose Properties",
        "Symmetric & Skew-Symmetric Matrices",
        "Properties of Determinants & Cramers Rule",
        "Adjoint & Inverse of Matrix, Cayley-Hamilton"
      ]
    },
    {
      "id": "math_12_03",
      "name": "Limits, Continuity & Differentiability",
      "class": 12,
      "weightage": "High",
      "topics": [
        "L'Hopital's Rule & Standard Expansions",
        "1^\u221e Form & Sandwich Theorem",
        "Continuity at a Point and in Interval",
        "Differentiability & Sharp Turns / Cusp"
      ]
    },
    {
      "id": "math_12_04",
      "name": "Differentiation & Method of Differentiation",
      "class": 12,
      "weightage": "Medium",
      "topics": [
        "Chain Rule & Implicit Differentiation",
        "Parametric & Logarithmic Differentiation",
        "Higher Order Derivatives & Leibniz Rule"
      ]
    },
    {
      "id": "math_12_05",
      "name": "Application of Derivatives (AOD)",
      "class": 12,
      "weightage": "High",
      "topics": [
        "Tangents & Normals",
        "Rolle's & Lagrange's Mean Value Theorem (LMVT)",
        "Monotonicity (Increasing/Decreasing Functions)",
        "Maxima & Minima (First & Second Derivative Tests)"
      ]
    },
    {
      "id": "math_12_06",
      "name": "Indefinite Integration",
      "class": 12,
      "weightage": "High",
      "topics": [
        "Standard Integrals & Substitution",
        "Integration by Parts & ILATE Rule",
        "Partial Fractions & Special Algebraic Integrals",
        "Trigonometric Integrals (sin^m x cos^n x)"
      ]
    },
    {
      "id": "math_12_07",
      "name": "Definite Integration & Area Under Curves",
      "class": 12,
      "weightage": "High",
      "topics": [
        "King's Property & Properties of Definite Integrals",
        "Leibniz Rule of Differentiation under Integral",
        "Definite Integral as Limit of a Sum",
        "Area Bounded by Curves & Symmetric Areas"
      ]
    },
    {
      "id": "math_12_08",
      "name": "Differential Equations",
      "class": 12,
      "weightage": "High",
      "topics": [
        "Order & Degree Formation",
        "Variable Separable & Reducible Forms",
        "Homogeneous Differential Equations",
        "Linear Differential Equations (Integrating Factor)"
      ]
    },
    {
      "id": "math_12_09",
      "name": "Vector Algebra",
      "class": 12,
      "weightage": "High",
      "topics": [
        "Dot Product & Projections",
        "Cross Product & Area of Triangle/Parallelogram",
        "Scalar Triple Product (Box Product) & Coplanarity",
        "Vector Triple Product & Linear Independence"
      ]
    },
    {
      "id": "math_12_10",
      "name": "Three Dimensional Geometry (3D)",
      "class": 12,
      "weightage": "High",
      "topics": [
        "Direction Cosines & Direction Ratios",
        "Equation of Line in 3D & Shortest Distance Between Skew Lines",
        "Equation of Plane & Intersecting Lines",
        "Distance of a Point from Line/Plane & Foot of Perpendicular"
      ]
    },
    {
      "id": "math_12_11",
      "name": "Probability",
      "class": 12,
      "weightage": "High",
      "topics": [
        "Conditional Probability & Multiplication Rule",
        "Bayes' Theorem & Total Probability",
        "Probability Distribution & Binomial Distribution",
        "Expectation & Variance"
      ]
    }
  ],
  "formulas": [
    {
      "subject": "physics",
      "chapter": "Rotational Motion",
      "title": "Moment of Inertia Theorems",
      "formula": "I = I_cm + Md^2 (Parallel Axis), I_z = I_x + I_y (Perpendicular Axis for planar bodies)",
      "note": "Always ensure d is measured from Center of Mass."
    },
    {
      "subject": "physics",
      "chapter": "Modern Physics",
      "title": "Photoelectric Equation",
      "formula": "h\u03bd = \u03a6 + K_max = hc/\u03bb = \u03a6 + eV_0",
      "note": "V_0 is stopping potential. Energy in eV = 12400 / \u03bb (\u00c5)."
    },
    {
      "subject": "physics",
      "chapter": "Current Electricity",
      "title": "Drift Velocity & Mobility",
      "formula": "v_d = (eE/m)\u03c4, I = n e A v_d, \u03c3 = n e^2 \u03c4 / m, \u03bc = v_d / E",
      "note": "Drift speed is of order mm/s."
    },
    {
      "subject": "physics",
      "chapter": "Electrostatics",
      "title": "Gauss's Law & Dipole Field",
      "formula": "\u222e E\u00b7dA = q_enclosed / \u03b5_0 | Axial: 2kp/r^3, Equatorial: -kp/r^3",
      "note": "Torque \u03c4 = p \u00d7 E, Potential Energy U = -p\u00b7E."
    },
    {
      "subject": "chemistry",
      "chapter": "Thermodynamics",
      "title": "Gibbs Free Energy & Equilibrium",
      "formula": "\u0394G = \u0394H - T\u0394S, \u0394G\u00b0 = -RT ln K_eq = -2.303 RT log10 K_eq",
      "note": "Spontaneous if \u0394G < 0."
    },
    {
      "subject": "chemistry",
      "chapter": "Electrochemistry",
      "title": "Nernst Equation",
      "formula": "E_cell = E\u00b0_cell - (0.0591 / n) log10 Q at 298 K",
      "note": "At equilibrium E_cell = 0, so E\u00b0_cell = (0.0591/n) log10 K_c."
    },
    {
      "subject": "chemistry",
      "chapter": "Chemical Kinetics",
      "title": "Arrhenius Equation & 1st Order",
      "formula": "k = A e^(-Ea / RT), t_1/2 = 0.693 / k, k = (2.303/t) log(a / (a-x))",
      "note": "First order half-life is independent of initial concentration."
    },
    {
      "subject": "chemistry",
      "chapter": "Solutions",
      "title": "Colligative Properties",
      "formula": "\u0394T_b = i K_b m, \u0394T_f = i K_f m, \u03a0 = i C R T, \u0394P/P\u00b0 = i X_solute",
      "note": "Remember van 't Hoff factor: i = 1 + (n-1)\u03b1 for dissociation."
    },
    {
      "subject": "mathematics",
      "chapter": "Matrices & Determinants",
      "title": "Adjoint & Inverse Properties",
      "formula": "A(adj A) = |A| I, |adj A| = |A|^(n-1), adj(adj A) = |A|^(n-2) A",
      "note": "|kA| = k^n |A| for n \u00d7 n matrix."
    },
    {
      "subject": "mathematics",
      "chapter": "Definite Integration",
      "title": "King's Property & Leibniz Rule",
      "formula": "\u222b[a to b] f(x)dx = \u222b[a to b] f(a+b-x)dx | d/dx \u222b[u(x) to v(x)] f(t)dt = f(v(x))v'(x) - f(u(x))u'(x)",
      "note": "Crucial for JEE Advanced integration problems."
    },
    {
      "subject": "mathematics",
      "chapter": "3D Geometry",
      "title": "Shortest Distance between Skew Lines",
      "formula": "d = | (a2 - a1) \u00b7 (b1 \u00d7 b2) | / | b1 \u00d7 b2 |",
      "note": "If distance is 0, lines are coplanar and intersect."
    },
    {
      "subject": "mathematics",
      "chapter": "Permutations & Combinations",
      "title": "Beggar's Method (Identical Items)",
      "formula": "Non-negative: (n + r - 1) C (r - 1) | Positive integers: (n - 1) C (r - 1)",
      "note": "Distributing n identical coins among r persons."
    }
  ],
  "default_routines": {
    "dropper_12hr": {
      "name": "12-Hour Focused Dropper Routine",
      "description": "Ideal for full-time JEE aspirants & droppers targeting Top IITs/NITs with balanced PCM problem solving and mock tests.",
      "slots": [
        {
          "id": "s1",
          "time": "06:00 - 07:00",
          "subject": "General",
          "title": "Morning Routine, Exercise & Formula Revision",
          "type": "Revision"
        },
        {
          "id": "s2",
          "time": "07:00 - 09:30",
          "subject": "Physics",
          "title": "Physics Deep Problem Solving (PYQs & Advanced Sheets)",
          "type": "Practice"
        },
        {
          "id": "s3",
          "time": "09:30 - 10:00",
          "subject": "General",
          "title": "Healthy Breakfast & Power Walk",
          "type": "Break"
        },
        {
          "id": "s4",
          "time": "10:00 - 12:30",
          "subject": "Chemistry",
          "title": "Organic / Physical Chemistry Mechanics & Reaction Practice",
          "type": "Practice"
        },
        {
          "id": "s5",
          "time": "12:30 - 13:30",
          "subject": "Chemistry",
          "title": "Inorganic NCERT Line-by-Line Reading & Short Notes",
          "type": "Notes"
        },
        {
          "id": "s6",
          "time": "13:30 - 14:30",
          "subject": "General",
          "title": "Lunch & Relaxation / Power Nap",
          "type": "Break"
        },
        {
          "id": "s7",
          "time": "14:30 - 17:30",
          "subject": "Mathematics",
          "title": "Mathematics Heavy Problem Solving (Calculus/Algebra/Coordinate)",
          "type": "Practice"
        },
        {
          "id": "s8",
          "time": "17:30 - 18:15",
          "subject": "General",
          "title": "Tea Break, Refreshment & Light Walk",
          "type": "Break"
        },
        {
          "id": "s9",
          "time": "18:15 - 20:30",
          "subject": "Physics",
          "title": "Physics High-Yield Theory / Lectures & Backlog Clearance",
          "type": "Lecture"
        },
        {
          "id": "s10",
          "time": "20:30 - 21:30",
          "subject": "General",
          "title": "Dinner & Family Time",
          "type": "Break"
        },
        {
          "id": "s11",
          "time": "21:30 - 23:00",
          "subject": "Mixed",
          "title": "Daily Mock Test / Speed Test (30 Qs) & Error Analysis",
          "type": "Mock Test"
        },
        {
          "id": "s12",
          "time": "23:00 - 23:45",
          "subject": "Mixed",
          "title": "Day Review, Mistake Book Entry & Next Day Target Planning",
          "type": "Revision"
        }
      ]
    },
    "school_6hr": {
      "name": "6-8 Hour School-Going Routine",
      "description": "Tailored for Class 11/12 school students balancing board exams with JEE coaching & self-study.",
      "slots": [
        {
          "id": "sc1",
          "time": "05:30 - 07:00",
          "subject": "Chemistry",
          "title": "Early Morning Inorganic & Formula Memorization",
          "type": "Revision"
        },
        {
          "id": "sc2",
          "time": "07:00 - 14:30",
          "subject": "General",
          "title": "School / College Hours + Commute",
          "type": "School"
        },
        {
          "id": "sc3",
          "time": "14:30 - 15:30",
          "subject": "General",
          "title": "Lunch, Relaxation & Rest",
          "type": "Break"
        },
        {
          "id": "sc4",
          "time": "15:30 - 17:30",
          "subject": "Physics",
          "title": "Coaching Lecture Review & Physics Homework/DPP",
          "type": "Practice"
        },
        {
          "id": "sc5",
          "time": "17:30 - 18:00",
          "subject": "General",
          "title": "Evening Snacks & Refreshment",
          "type": "Break"
        },
        {
          "id": "sc6",
          "time": "18:00 - 20:30",
          "subject": "Mathematics",
          "title": "Maths DPP & Chapter-Wise PYQ Solving",
          "type": "Practice"
        },
        {
          "id": "sc7",
          "time": "20:30 - 21:15",
          "subject": "General",
          "title": "Dinner",
          "type": "Break"
        },
        {
          "id": "sc8",
          "time": "21:15 - 23:00",
          "subject": "Chemistry",
          "title": "Organic Chemistry Reactions & Physical Numericals",
          "type": "Practice"
        },
        {
          "id": "sc9",
          "time": "23:00 - 23:30",
          "subject": "Mixed",
          "title": "Error Log & Tomorrow's Checklist Preparation",
          "type": "Revision"
        }
      ]
    },
    "weekend_marathon": {
      "name": "Weekend Marathon & Full Mock Routine",
      "description": "High-intensity weekend routine dedicated to 3-hour exam simulation, rigorous test analysis & weekly backlog clearing.",
      "slots": [
        {
          "id": "wm1",
          "time": "06:30 - 08:30",
          "subject": "Mixed",
          "title": "Rapid Formula Revision & Short Notes Sweep",
          "type": "Revision"
        },
        {
          "id": "wm2",
          "time": "08:30 - 09:00",
          "subject": "General",
          "title": "Exam Mindset Prep & Light Breakfast",
          "type": "Break"
        },
        {
          "id": "wm3",
          "time": "09:00 - 12:00",
          "subject": "Mixed",
          "title": "FULL 3-HOUR JEE MAIN MOCK TEST (Morning Shift Simulation)",
          "type": "Mock Test"
        },
        {
          "id": "wm4",
          "time": "12:00 - 13:00",
          "subject": "General",
          "title": "Relaxation, Hydration & Lunch",
          "type": "Break"
        },
        {
          "id": "wm5",
          "time": "13:00 - 15:30",
          "subject": "Mixed",
          "title": "In-Depth Mock Test Analysis & Mistake Book Entries",
          "type": "Analysis"
        },
        {
          "id": "wm6",
          "time": "15:30 - 16:00",
          "subject": "General",
          "title": "Walk & Mental Reset",
          "type": "Break"
        },
        {
          "id": "wm7",
          "time": "16:00 - 19:00",
          "subject": "Physics",
          "title": "Weak Topic Drill & Backlog Resolution",
          "type": "Practice"
        },
        {
          "id": "wm8",
          "time": "19:00 - 21:00",
          "subject": "Mathematics",
          "title": "Challenging JEE Advanced Multi-Correct / Integer Practice",
          "type": "Practice"
        },
        {
          "id": "wm9",
          "time": "21:00 - 22:00",
          "subject": "General",
          "title": "Dinner & Recreation",
          "type": "Break"
        },
        {
          "id": "wm10",
          "time": "22:00 - 23:30",
          "subject": "Chemistry",
          "title": "NCERT Chemistry Exemplar & PYQ Revision",
          "type": "Revision"
        }
      ]
    }
  }
};
