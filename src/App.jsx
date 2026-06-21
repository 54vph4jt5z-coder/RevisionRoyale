
import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import {
  Home, Brain, Timer, Trophy, Shield, Users, Store, Bot, BarChart3, Settings,
  Bell, Star, Leaf, Calculator, Atom, FlaskConical, LogOut, Sun, Moon, Send,
  Copy, CheckCircle2, Target, X, Search, UserRound, Palette, Play, Pause,
  Square, Award, Gift, Swords, School, CalendarDays, Crown, Sparkles
} from "lucide-react";
import "./styles.css";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

const LEVELS = ["National 5", "Higher", "Advanced Higher"];
const HOUSES = ["NITH", "SCAUR", "CAIRN"];
const SCHOOLS = [
  "Wallace Hall Academy",
  "Dumfries High School",
  "Sanquhar Academy",
  "St Joseph's College",
  "Dalbeattie High School",
  "Annan Academy",
  "Lockerbie Academy",
  "Moffat Academy",
  "Castle Douglas High School",
  "Kirkcudbright Academy",
  "Other Scottish School"
];
const AVATARS = ["🦊", "🐼", "🐧", "🐸", "🐯", "🐻", "🐨", "🦁", "🐵", "🐰", "🦉", "🐺"];
const PETS = ["🦊", "🐣", "🐢", "🐲", "🦄", "🐉"];

const EXAMS_2026 = [
  { subject: "Biology", level: "National 5", date: "2026-05-12" },
  { subject: "Biology", level: "Higher", date: "2026-05-13" },
  { subject: "Biology", level: "Advanced Higher", date: "2026-05-19" },
  { subject: "Chemistry", level: "National 5", date: "2026-05-22" },
  { subject: "Chemistry", level: "Higher", date: "2026-05-18" },
  { subject: "Chemistry", level: "Advanced Higher", date: "2026-05-26" },
  { subject: "Physics", level: "National 5", date: "2026-05-05" },
  { subject: "Physics", level: "Higher", date: "2026-05-07" },
  { subject: "Physics", level: "Advanced Higher", date: "2026-05-21" },
  { subject: "Maths", level: "National 5", date: "2026-05-01" },
  { subject: "Maths", level: "Higher", date: "2026-04-30" },
  { subject: "Maths", level: "Advanced Higher", date: "2026-05-08" }
];

const SHOP = [
  { id: "double_xp", name: "Double XP Potion", icon: "🧪", costType: "gems", cost: 3, desc: "Next quiz or study timer earns double XP." },
  { id: "triple_xp", name: "Triple XP Potion", icon: "⚡", costType: "gems", cost: 8, desc: "Next quiz or study timer earns triple XP." },
  { id: "coin_charm", name: "Coin Charm", icon: "🪙", costType: "coins", cost: 50, desc: "Next reward earns double coins." },
  { id: "gem_finder", name: "Gem Finder", icon: "💎", costType: "coins", cost: 75, desc: "Next reward gives two bonus gems." },
  { id: "streak_shield", name: "Streak Shield", icon: "🛡️", costType: "gems", cost: 5, desc: "A cosmetic badge for your profile." },
  { id: "fox_costume", name: "Fox Costume", icon: "👑", costType: "coins", cost: 150, desc: "A royal mascot cosmetic." },
  { id: "house_banner", name: "House Banner", icon: "🏳️", costType: "coins", cost: 100, desc: "Show your house spirit." }
];

const TOPICS = {
  Biology: {
    icon: <Leaf />, color: "green",
    "National 5": [
      ["Cell Biology", "Cell structure, transport, DNA, enzymes, respiration and photosynthesis.", "Draw cells, compare diffusion/osmosis/active transport, practise enzyme graphs and explain DNA to protein."],
      ["Multicellular Organisms", "Specialised cells, tissues, organs, control, reproduction and inheritance.", "Use flowcharts for specialisation, revise control systems, practise genetics crosses and link structure to function."],
      ["Life On Earth", "Ecosystems, sampling, biodiversity, energy transfer, adaptation and human impact.", "Practise sampling calculations, food chains, adaptations and biodiversity data questions."]
    ],
    Higher: [
      ["DNA And The Genome", "DNA structure, replication, gene expression, mutations, evolution and genomics.", "Use diagrams for replication/expression, practise mutation effects and sequencing uses."],
      ["Metabolism And Survival", "Metabolic pathways, enzymes, respiration, photosynthesis and survival adaptations.", "Compare pathways, explain limiting factors and connect adaptations to survival."],
      ["Sustainability And Interdependence", "Food supply, plant growth, animal welfare, populations and biodiversity.", "Analyse population graphs, evaluate sustainability and practise extended responses."]
    ],
    "Advanced Higher": [
      ["Cells And Proteins", "Laboratory techniques, proteins, membranes, communication and signalling.", "Interpret protein data, revise signalling and evaluate experimental techniques."],
      ["Organisms And Evolution", "Field techniques, variation, selection, speciation and animal behaviour.", "Use examples for selection, compare behaviours and analyse field evidence."],
      ["Investigative Biology", "Planning, carrying out, analysing and evaluating biological investigations.", "Write aims, variables, uncertainty, graphs, conclusions and evaluations."]
    ]
  },
  Maths: {
    icon: <Calculator />, color: "blue",
    "National 5": [
      ["Expressions And Formulae", "Algebra, indices, surds, factorising, equations and formulae.", "Practise factorising, index rules, rearranging formulae and showing clear working."],
      ["Relationships", "Straight lines, graphs, quadratics, trigonometry and geometry.", "Sketch graphs, learn line formulae, practise trig and solve quadratics."],
      ["Applications", "Statistics, probability, vectors, percentages and problem solving.", "Practise units, rounding, charts, vectors and real-life questions."]
    ],
    Higher: [
      ["Expressions And Functions", "Functions, polynomials, logs, graphs and transformations.", "Practise notation, transformed graphs, log equations and polynomial factorising."],
      ["Relationships And Calculus", "Differentiation, integration, trigonometry and equations.", "Learn calculus rules, trig identities and connect answers to gradients/areas."],
      ["Applications", "Vectors, recurrence relations, optimisation and mathematical modelling.", "Write vector steps, practise recurrence and explain answers in context."]
    ],
    "Advanced Higher": [
      ["Methods In Algebra And Calculus", "Advanced algebra, integration, differentiation and differential equations.", "Practise long solutions, standard integrals, proof structure and logical steps."],
      ["Applications Of Algebra And Calculus", "Advanced modelling using calculus and algebra.", "Define variables, state assumptions and practise mixed exam questions."],
      ["Geometry, Proof And Systems", "Vectors, matrices, complex numbers, proof and systems.", "Use diagrams, matrix operations, Argand diagrams and proof structure."]
    ]
  },
  Physics: {
    icon: <Atom />, color: "purple",
    "National 5": [
      ["Dynamics And Space", "Velocity, acceleration, forces, energy, projectiles, satellites and space.", "Memorise relationships, practise motion graphs and draw force diagrams."],
      ["Electricity And Energy", "Circuits, power, heat, gas laws and conservation of energy.", "Practise circuits, energy equations, series/parallel and heat-transfer examples."],
      ["Waves And Radiation", "Wave properties, light, sound, EM spectrum, nuclear radiation and half-life.", "Use v=fλ, draw waves, compare radiation types and practise half-life."]
    ],
    Higher: [
      ["Our Dynamic Universe", "Motion, forces, energy, gravitation, relativity and cosmology.", "Practise vector motion, redshift, gravitation and space examples."],
      ["Particles And Waves", "Standard Model, nuclear reactions, waves, interference, spectra and photoelectric effect.", "Learn particle families, nuclear equations and spectra/photoelectric evidence."],
      ["Electricity", "Fields, circuits, capacitors, semiconductors and electrical principles.", "Practise capacitor graphs, fields, circuits and semiconductor explanations."],
      ["Researching Physics", "Uncertainty, graph analysis, practical skills and scientific reporting.", "Revise uncertainty, conclusions, improvements and graph gradients."]
    ],
    "Advanced Higher": [
      ["Rotational Motion And Astrophysics", "Angular motion, torque, gravitation, orbital motion and astrophysics.", "Compare linear/rotational motion and explain astrophysics evidence."],
      ["Quanta And Waves", "Quantum theory, wave-particle duality, interference and polarisation.", "Practise quantum calculations and explain evidence for duality."],
      ["Electromagnetism", "Fields, induction, circuits and electromagnetic applications.", "Draw fields, practise induction and link equations to meaning."],
      ["Investigating Physics", "Advanced investigation planning, data processing and evaluation.", "Plan methods, handle uncertainty, process data and evaluate limitations."]
    ]
  },
  Chemistry: {
    icon: <FlaskConical />, color: "orange",
    "National 5": [
      ["Chemical Changes And Structure", "Rates, atomic structure, bonding, formulae, acids and reaction quantities.", "Write formulae, balance equations, draw bonding and explain rates."],
      ["Nature's Chemistry", "Fuels, hydrocarbons, alcohols, acids, esters, fats and oils.", "Learn functional groups, naming, fuels and uses of esters/fats."],
      ["Chemistry In Society", "Metals, plastics, fertilisers, batteries, analysis and industry.", "Revise extraction, plastics, calculations and environmental impact."]
    ],
    Higher: [
      ["Chemical Changes And Structure", "Periodicity, bonding, energetics, rates, equilibrium and calculations.", "Practise enthalpy, equilibrium shifts, pH and bonding explanations."],
      ["Nature's Chemistry", "Organic chemistry, fuels, proteins, fats, oxidation and synthesis.", "Learn pathways, formulae, functional groups and oxidation."],
      ["Chemistry In Society", "Industrial chemistry, redox, batteries, analysis and materials.", "Practise redox, cells, analytical results and process evaluation."],
      ["Researching Chemistry", "Practical skills, uncertainty, chromatography, titration and reporting.", "Revise techniques, process results and explain uncertainty."]
    ],
    "Advanced Higher": [
      ["Inorganic Chemistry", "Electronic structure, transition metals, bonding and complexes.", "Practise configurations, colour, complex formation and bonding models."],
      ["Physical Chemistry", "Thermodynamics, kinetics, equilibrium, electrochemistry and analysis.", "Practise rate laws, K values, thermodynamics and cells."],
      ["Organic Chemistry", "Mechanisms, synthesis, stereochemistry and organic analysis.", "Draw mechanisms, plan synthesis and interpret spectra."],
      ["Instrumental Analysis", "Spectroscopy, chromatography, NMR, IR and MS.", "Match spectra to structures and justify conclusions."],
      ["Researching Chemistry", "Advanced research, planning, analysis, evaluation and reporting.", "Plan reliable experiments, manage risk/uncertainty and write evaluations."]
    ]
  }
};

function today(){ return new Date().toISOString().slice(0,10); }
function weekStart(){ const d=new Date(),day=(d.getDay()+6)%7; d.setDate(d.getDate()-day); return d.toISOString().slice(0,10); }
function minutesLabel(m){ m=Number(m||0); const h=Math.floor(m/60), mm=m%60; return h?`${h}h ${mm}m`:`${mm}m`; }
function levelFromXP(xp){ return Math.max(1,Math.floor(Math.sqrt(Number(xp||0)/80))+1); }
function safeName(email){ return (email||"student").split("@")[0].replace(/[^a-zA-Z0-9_]/g,"").slice(0,18)||"student"; }
function titleCase(s){ return String(s||"").replace(/\b\w/g,c=>c.toUpperCase()); }
function boostName(id){ return SHOP.find(x=>x.id===id)?.name||id; }
function copyText(t){ navigator.clipboard?.writeText(String(t||"")); }
function calcStreak(sessions){ const days=[...new Set((sessions||[]).map(s=>s.session_date))].sort().reverse(); let st=0,d=new Date(today()+"T00:00:00"); for(let i=0;i<365;i++){ const k=d.toISOString().slice(0,10); if(days.includes(k)){ st++; d.setDate(d.getDate()-1); continue; } if(i===0){ d.setDate(d.getDate()-1); continue; } break; } return st; }
function averageScore(sessions){ const scored=sessions.map(s=>Number(s.score||0)).filter(Boolean); return scored.length?Math.round(scored.reduce((a,b)=>a+b,0)/scored.length):0; }
function daysUntil(dateStr){ const diff=new Date(dateStr+"T09:00:00")-new Date(); return Math.max(0,Math.ceil(diff/86400000)); }

const QUESTION_FACTS = {
  "Biology": {
    "National 5": {
      "Cell Biology": [
        [
          "Diffusion",
          "movement of molecules from high to low concentration down a concentration gradient",
          [
            "movement of water only through a membrane",
            "movement requiring energy",
            "movement of DNA into proteins"
          ]
        ],
        [
          "Osmosis",
          "movement of water from high water concentration to low water concentration through a selectively permeable membrane",
          [
            "movement of glucose using ATP",
            "movement of ions through the nucleus",
            "movement of enzymes to substrates"
          ]
        ],
        [
          "Active Transport",
          "movement of substances against a concentration gradient using energy",
          [
            "passive movement down a gradient",
            "movement of water only",
            "copying DNA before cell division"
          ]
        ],
        [
          "Enzymes",
          "biological catalysts that speed up reactions and have an optimum temperature and pH",
          [
            "cell walls made of cellulose",
            "genes that code for eye colour",
            "membranes that store starch"
          ]
        ],
        [
          "Respiration",
          "process that releases energy from glucose in cells",
          [
            "process that stores genetic information",
            "movement of water across membranes",
            "production of gametes"
          ]
        ],
        [
          "Photosynthesis",
          "process in plants using light energy to make glucose from carbon dioxide and water",
          [
            "breakdown of glucose to release energy",
            "movement of ions with energy",
            "fusion of gametes"
          ]
        ]
      ],
      "Multicellular Organisms": [
        [
          "Stem Cells",
          "unspecialised cells that can divide and develop into specialised cells",
          [
            "cells that cannot divide",
            "enzymes that digest proteins",
            "hormones made of DNA"
          ]
        ],
        [
          "Specialised Cells",
          "cells adapted to carry out a particular function",
          [
            "cells with no function",
            "organ systems made of enzymes",
            "genes without DNA"
          ]
        ],
        [
          "Nervous Control",
          "fast communication using electrical impulses along nerves",
          [
            "slow chemical communication in blood",
            "diffusion of water",
            "random movement of molecules"
          ]
        ],
        [
          "Hormonal Control",
          "chemical communication using hormones carried in the bloodstream",
          [
            "electrical impulses through wires",
            "active transport of glucose only",
            "photosynthesis in leaves"
          ]
        ],
        [
          "Genotype",
          "the genetic information or alleles an organism has",
          [
            "the visible appearance only",
            "a type of enzyme",
            "a food chain level"
          ]
        ],
        [
          "Phenotype",
          "the observable characteristics caused by genotype and environment",
          [
            "the alleles only",
            "an organ system",
            "a sampling method"
          ]
        ]
      ],
      "Life On Earth": [
        [
          "Biodiversity",
          "the variety of living organisms in an ecosystem",
          [
            "the amount of glucose in a cell",
            "one organism's genotype",
            "a type of active transport"
          ]
        ],
        [
          "Quadrat",
          "a square frame used to sample organisms in a habitat",
          [
            "a molecule in DNA",
            "a type of hormone",
            "a graph of velocity"
          ]
        ],
        [
          "Food Chain",
          "a diagram showing feeding relationships and energy transfer",
          [
            "a DNA sequence",
            "a cell membrane model",
            "a chemical equation"
          ]
        ],
        [
          "Producer",
          "an organism such as a plant that makes its own food",
          [
            "an organism that only eats animals",
            "a genetic mutation",
            "a sampling error"
          ]
        ],
        [
          "Competition",
          "when organisms need the same limited resource",
          [
            "when enzymes denature",
            "when water moves by osmosis",
            "when gametes fuse"
          ]
        ],
        [
          "Adaptation",
          "a feature that helps an organism survive in its environment",
          [
            "a random table of results",
            "a food molecule only",
            "a type of quadrat"
          ]
        ]
      ]
    },
    "Higher": {
      "DNA And The Genome": [
        [
          "DNA Replication",
          "the process of copying DNA before cell division",
          [
            "translation of mRNA into protein",
            "breakdown of glucose",
            "movement of water across membranes"
          ]
        ],
        [
          "mRNA",
          "a molecule that carries a copy of genetic information from DNA to ribosomes",
          [
            "a lipid in membranes",
            "a hormone from glands",
            "an enzyme that digests starch"
          ]
        ],
        [
          "Codon",
          "three bases on mRNA that code for one amino acid",
          [
            "a whole chromosome",
            "a type of quadrat",
            "a cell organelle"
          ]
        ],
        [
          "Mutation",
          "a change in DNA sequence that can affect proteins",
          [
            "movement of water",
            "chemical digestion",
            "loss of heat energy"
          ]
        ],
        [
          "Gene Expression",
          "process where information in a gene is used to make a functional product",
          [
            "random inheritance of every trait",
            "osmosis through membranes",
            "food chains in ecosystems"
          ]
        ],
        [
          "Genomic Sequencing",
          "determining the order of bases in DNA",
          [
            "measuring animal behaviour only",
            "counting quadrats",
            "heating enzymes"
          ]
        ]
      ],
      "Metabolism And Survival": [
        [
          "Metabolic Pathway",
          "a series of enzyme-controlled reactions",
          [
            "a food chain diagram",
            "a line graph only",
            "a gene mutation"
          ]
        ],
        [
          "Induced Fit",
          "enzyme active site changes shape to fit the substrate",
          [
            "substrate changes into DNA",
            "water moves through membranes",
            "organisms compete for food"
          ]
        ],
        [
          "Respiration Pathways",
          "chemical pathways that release energy from glucose",
          [
            "light reactions only",
            "sampling ecosystems",
            "DNA sequencing only"
          ]
        ],
        [
          "Limiting Factor",
          "a factor that limits the rate of a process such as photosynthesis",
          [
            "an unlimited resource",
            "a type of chromosome",
            "a food web"
          ]
        ],
        [
          "Homeostasis",
          "maintaining a stable internal environment",
          [
            "random changes in DNA",
            "sampling organisms",
            "making glucose only"
          ]
        ],
        [
          "Survival Adaptation",
          "feature or behaviour increasing chance of survival",
          [
            "a lab error",
            "a type of graph",
            "a codon"
          ]
        ]
      ],
      "Sustainability And Interdependence": [
        [
          "Photosynthesis",
          "the process forming glucose using light, carbon dioxide and water",
          [
            "the breakdown of glucose only",
            "DNA sequencing",
            "active transport in roots only"
          ]
        ],
        [
          "Food Security",
          "reliable access to enough safe and nutritious food",
          [
            "movement of water in cells",
            "a type of mutation",
            "a hormone signal"
          ]
        ],
        [
          "Population Growth",
          "change in number of organisms in a population over time",
          [
            "change in enzyme shape only",
            "the order of DNA bases",
            "a single food molecule"
          ]
        ],
        [
          "Biodiversity",
          "variety of species and genetic variation in ecosystems",
          [
            "only number of humans",
            "only cell size",
            "only rate of respiration"
          ]
        ],
        [
          "Sustainable Production",
          "producing resources without damaging future availability",
          [
            "using all resources immediately",
            "ignoring environmental impact",
            "random crop growth"
          ]
        ],
        [
          "Interdependence",
          "organisms depending on each other and their environment",
          [
            "cells dividing only",
            "enzymes denaturing only",
            "DNA copying only"
          ]
        ]
      ]
    },
    "Advanced Higher": {
      "Cells And Proteins": [
        [
          "Protein Structure",
          "the shape of a protein determines its function",
          [
            "proteins are always straight chains",
            "proteins only store genetic code",
            "proteins are made of nucleotides only"
          ]
        ],
        [
          "Cell Signalling",
          "cells communicate using signalling molecules and receptors",
          [
            "cells communicate by random heat loss",
            "DNA always leaves nucleus",
            "enzymes become chromosomes"
          ]
        ],
        [
          "Membrane Proteins",
          "proteins in membranes help transport and communication",
          [
            "proteins that make cell walls in animals",
            "DNA bases in cytoplasm",
            "only starch molecules"
          ]
        ],
        [
          "Electrophoresis",
          "a technique separating molecules using an electric field",
          [
            "a method for counting quadrats",
            "a type of photosynthesis",
            "a hormone pathway"
          ]
        ],
        [
          "Immunoassay",
          "a technique using specific antibody-antigen binding",
          [
            "a food chain diagram",
            "a gas law calculation",
            "a vector diagram"
          ]
        ],
        [
          "Proteomics",
          "large-scale study of proteins in cells or organisms",
          [
            "study of weather only",
            "counting populations only",
            "using pH paper only"
          ]
        ]
      ],
      "Organisms And Evolution": [
        [
          "Natural Selection",
          "individuals with advantageous variations survive and reproduce more",
          [
            "all individuals survive equally",
            "organisms choose mutations",
            "enzymes decide inheritance"
          ]
        ],
        [
          "Speciation",
          "formation of new species after isolation and genetic divergence",
          [
            "cell division only",
            "food chain transfer",
            "DNA replication only"
          ]
        ],
        [
          "Phylogeny",
          "evolutionary relationships between organisms",
          [
            "a chemical bond",
            "a velocity graph",
            "a membrane protein only"
          ]
        ],
        [
          "Field Technique",
          "method used to collect ecological data reliably",
          [
            "a random guess",
            "a protein fold",
            "a lab-only titration"
          ]
        ],
        [
          "Animal Behaviour",
          "responses that can improve survival and reproduction",
          [
            "a chemical equation",
            "a type of chromosome",
            "a voltage reading"
          ]
        ],
        [
          "Genetic Drift",
          "random change in allele frequency in a population",
          [
            "directed change chosen by organisms",
            "osmosis",
            "enzyme denaturation"
          ]
        ]
      ],
      "Investigative Biology": [
        [
          "Hypothesis",
          "a testable scientific prediction",
          [
            "a final mark",
            "a random opinion",
            "a type of enzyme"
          ]
        ],
        [
          "Independent Variable",
          "the variable deliberately changed in an experiment",
          [
            "the variable measured",
            "the variable kept constant",
            "the conclusion"
          ]
        ],
        [
          "Dependent Variable",
          "the variable measured in an experiment",
          [
            "the variable changed deliberately",
            "a safety rule only",
            "a literature source"
          ]
        ],
        [
          "Control Variables",
          "factors kept constant to make a test fair",
          [
            "variables ignored",
            "random outcomes",
            "only graph labels"
          ]
        ],
        [
          "Reliability",
          "consistency of results, improved by repeats",
          [
            "how colourful a graph is",
            "the title of the report",
            "a food chain"
          ]
        ],
        [
          "Evaluation",
          "judging method, data quality, limitations and improvements",
          [
            "copying results only",
            "choosing no variables",
            "avoiding conclusions"
          ]
        ]
      ]
    }
  },
  "Physics": {
    "National 5": {
      "Dynamics And Space": [
        [
          "Velocity",
          "speed in a stated direction, so it is a vector",
          [
            "distance only",
            "energy stored in fuel",
            "current in a circuit"
          ]
        ],
        [
          "Acceleration",
          "change in velocity per unit time",
          [
            "distance divided by mass",
            "force divided by voltage",
            "energy per charge"
          ]
        ],
        [
          "Newton's Second Law",
          "resultant force equals mass times acceleration",
          [
            "voltage equals current times resistance",
            "speed equals distance times time",
            "energy equals charge divided by voltage"
          ]
        ],
        [
          "Projectile Motion",
          "motion of an object under gravity with horizontal and vertical components",
          [
            "motion with no forces ever",
            "current flow in wires",
            "light bending in glass"
          ]
        ],
        [
          "Satellite",
          "object orbiting a planet due to gravitational attraction",
          [
            "a chemical cell",
            "a radiation detector",
            "a heat store"
          ]
        ],
        [
          "Redshift",
          "increase in wavelength of light from galaxies moving away",
          [
            "decrease in voltage",
            "increase in current",
            "nuclear decay only"
          ]
        ]
      ],
      "Electricity And Energy": [
        [
          "Current",
          "rate of flow of electric charge",
          [
            "energy per second",
            "force per mass",
            "distance per time"
          ]
        ],
        [
          "Potential Difference",
          "energy transferred per unit charge",
          [
            "charge per second",
            "mass per volume",
            "acceleration per time"
          ]
        ],
        [
          "Resistance",
          "opposition to current in a circuit",
          [
            "stored heat only",
            "rate of decay",
            "distance travelled"
          ]
        ],
        [
          "Power",
          "energy transferred per second",
          [
            "current times time only",
            "mass times velocity",
            "frequency times wavelength"
          ]
        ],
        [
          "Specific Heat Capacity",
          "energy needed to raise 1 kg of a substance by 1°C",
          [
            "voltage per coulomb",
            "force per metre",
            "mass per charge"
          ]
        ],
        [
          "Conservation of Energy",
          "energy cannot be created or destroyed, only transferred",
          [
            "energy disappears in circuits",
            "mass always becomes current",
            "heat has no energy"
          ]
        ]
      ],
      "Waves And Radiation": [
        [
          "Frequency",
          "number of waves passing a point each second",
          [
            "distance between wave peaks",
            "height of a wave",
            "mass of a wave"
          ]
        ],
        [
          "Wavelength",
          "distance between corresponding points on adjacent waves",
          [
            "number of waves per second",
            "energy per charge",
            "time for one orbit"
          ]
        ],
        [
          "Wave Speed",
          "speed found from frequency multiplied by wavelength",
          [
            "current times resistance",
            "mass times acceleration",
            "charge divided by time"
          ]
        ],
        [
          "Alpha Radiation",
          "helium nuclei with low penetration and high ionisation",
          [
            "electromagnetic wave with high penetration",
            "electron from nucleus",
            "neutral radiation only"
          ]
        ],
        [
          "Half-life",
          "time for activity or number of nuclei to halve",
          [
            "time for speed to double",
            "voltage in a circuit",
            "distance for one wavelength"
          ]
        ],
        [
          "Gamma Radiation",
          "electromagnetic radiation with high penetration",
          [
            "helium nuclei",
            "water wave",
            "electric current"
          ]
        ]
      ]
    },
    "Higher": {
      "Our Dynamic Universe": [
        [
          "Resultant Force",
          "single force with same effect as all forces acting together",
          [
            "energy stored in a capacitor",
            "charge per second",
            "frequency of light"
          ]
        ],
        [
          "Gravitational Field Strength",
          "force per unit mass in a gravitational field",
          [
            "energy per charge",
            "distance per time",
            "wavelength per frequency"
          ]
        ],
        [
          "Redshift",
          "increase in wavelength from objects moving away",
          [
            "decrease in mass",
            "increase in current",
            "loss of charge"
          ]
        ],
        [
          "Hubble's Law",
          "more distant galaxies recede faster",
          [
            "resistance increases with current only",
            "force equals charge only",
            "energy cannot transfer"
          ]
        ],
        [
          "Special Relativity",
          "time and length measurements depend on relative motion at high speeds",
          [
            "all observers measure the same time always",
            "only applies to circuits",
            "explains acid reactions"
          ]
        ],
        [
          "Kinetic Energy",
          "energy an object has due to motion",
          [
            "energy due to charge only",
            "energy in chemical bonds only",
            "a type of radiation"
          ]
        ]
      ],
      "Particles And Waves": [
        [
          "Standard Model",
          "classification of fundamental particles and interactions",
          [
            "a model of ecosystems",
            "a gas law table",
            "a resistor rule"
          ]
        ],
        [
          "Quark",
          "fundamental particle making up hadrons",
          [
            "a light ray",
            "a circuit component",
            "a unit of voltage"
          ]
        ],
        [
          "Photoelectric Effect",
          "emission of electrons from a surface when light of sufficient frequency is incident",
          [
            "reflection of sound only",
            "heating water only",
            "formation of ions in salt"
          ]
        ],
        [
          "Interference",
          "superposition of waves causing reinforcement or cancellation",
          [
            "random motion of particles",
            "force on a mass",
            "charge flow"
          ]
        ],
        [
          "Nuclear Equation",
          "equation showing conservation of nucleon and proton number",
          [
            "chemical equation only",
            "voltage rule",
            "ecosystem diagram"
          ]
        ],
        [
          "Spectra",
          "patterns of wavelengths used as evidence about atoms and stars",
          [
            "only a force graph",
            "a resistor network",
            "a heat capacity table"
          ]
        ]
      ],
      "Electricity": [
        [
          "Electric Field",
          "region where a charge experiences a force",
          [
            "region where mass cannot exist",
            "only heat transfer",
            "gas pressure zone"
          ]
        ],
        [
          "Capacitor",
          "component that stores charge and energy in an electric field",
          [
            "component that emits alpha radiation",
            "a force meter",
            "a light spectrum"
          ]
        ],
        [
          "Semiconductor",
          "material with conductivity between conductor and insulator",
          [
            "perfect insulator always",
            "perfect conductor always",
            "a radioactive source"
          ]
        ],
        [
          "Ohm's Law",
          "current is proportional to potential difference when temperature is constant",
          [
            "force equals mass times acceleration",
            "energy equals mass times height",
            "speed equals distance over time"
          ]
        ],
        [
          "Potential Divider",
          "circuit that produces a chosen fraction of supply voltage",
          [
            "device for measuring half-life",
            "a wave superposition",
            "a type of quark"
          ]
        ],
        [
          "Internal Resistance",
          "resistance inside a source causing lost volts",
          [
            "resistance outside only",
            "charge stored in capacitor",
            "mass per unit volume"
          ]
        ]
      ],
      "Researching Physics": [
        [
          "Uncertainty",
          "range around a measurement showing doubt in its value",
          [
            "exact proof of no error",
            "only a graph title",
            "a type of particle"
          ]
        ],
        [
          "Gradient",
          "slope of a graph used to find relationships",
          [
            "height of bars only",
            "colour of a line",
            "units of voltage only"
          ]
        ],
        [
          "Valid Conclusion",
          "conclusion supported by results and linked to aim",
          [
            "opinion without data",
            "copy of method",
            "random prediction"
          ]
        ],
        [
          "Systematic Error",
          "consistent error affecting results in same direction",
          [
            "random scatter only",
            "correct calibration",
            "a fair test feature"
          ]
        ],
        [
          "Repeat Measurements",
          "extra measurements used to improve reliability",
          [
            "changing every variable",
            "removing all data",
            "avoiding graphs"
          ]
        ],
        [
          "Control Variable",
          "factor kept constant in an investigation",
          [
            "measured outcome",
            "final conclusion",
            "uncertainty"
          ]
        ]
      ]
    },
    "Advanced Higher": {
      "Rotational Motion And Astrophysics": [
        [
          "Angular Velocity",
          "rate of change of angular displacement",
          [
            "linear distance only",
            "electric charge rate",
            "wave frequency only"
          ]
        ],
        [
          "Torque",
          "turning effect of a force",
          [
            "rate of energy transfer",
            "charge per second",
            "mass per volume"
          ]
        ],
        [
          "Moment of Inertia",
          "resistance of an object to angular acceleration",
          [
            "resistance to current",
            "gravitational field strength",
            "frequency ratio"
          ]
        ],
        [
          "Centripetal Force",
          "force towards centre causing circular motion",
          [
            "force away from centre always",
            "electric field only",
            "nuclear force only"
          ]
        ],
        [
          "Orbital Motion",
          "motion of an object around a massive body due to gravity",
          [
            "only straight-line motion",
            "only sound waves",
            "chemical bonding"
          ]
        ],
        [
          "Stellar Parallax",
          "apparent shift of nearby stars used to measure distance",
          [
            "current in a circuit",
            "force on a spring",
            "mass of a resistor"
          ]
        ]
      ],
      "Quanta And Waves": [
        [
          "Photon",
          "packet of electromagnetic radiation energy",
          [
            "unit of mass",
            "component of a resistor",
            "type of acid"
          ]
        ],
        [
          "de Broglie Wavelength",
          "wavelength associated with a moving particle",
          [
            "distance between planets only",
            "voltage per charge",
            "thermal capacity"
          ]
        ],
        [
          "Wave-Particle Duality",
          "matter and light can show both wave and particle behaviour",
          [
            "light is only a particle always",
            "electrons are only waves always",
            "waves have no energy"
          ]
        ],
        [
          "Polarisation",
          "restriction of vibrations to one plane",
          [
            "increase in mass",
            "chemical oxidation",
            "nuclear fusion"
          ]
        ],
        [
          "Diffraction",
          "spreading of waves around gaps or edges",
          [
            "charge storage",
            "force due to gravity",
            "resistor heating"
          ]
        ],
        [
          "Interference Pattern",
          "pattern from superposition of coherent waves",
          [
            "random circuit fault",
            "chemical precipitate",
            "satellite orbit"
          ]
        ]
      ],
      "Electromagnetism": [
        [
          "Magnetic Flux",
          "measure of magnetic field passing through an area",
          [
            "charge stored in a capacitor",
            "mass per volume",
            "frequency of a photon"
          ]
        ],
        [
          "Induced EMF",
          "voltage produced by changing magnetic flux",
          [
            "force from static mass",
            "half-life value",
            "chemical pH"
          ]
        ],
        [
          "Lenz's Law",
          "induced current opposes the change causing it",
          [
            "current always helps the change",
            "voltage equals wavelength",
            "mass is conserved only"
          ]
        ],
        [
          "Electric Field Strength",
          "force per unit charge",
          [
            "force per unit mass",
            "energy per mass",
            "charge per volume"
          ]
        ],
        [
          "Capacitor Discharge",
          "stored charge decreases through a circuit over time",
          [
            "nuclei decay by alpha only",
            "waves reflect from barriers",
            "planets orbit stars"
          ]
        ],
        [
          "AC Generator",
          "device using electromagnetic induction to produce alternating voltage",
          [
            "device storing DNA",
            "device measuring pH",
            "device making enzymes"
          ]
        ]
      ],
      "Investigating Physics": [
        [
          "Aim",
          "what the investigation is trying to find out",
          [
            "a final graph only",
            "a safety symbol",
            "a random conclusion"
          ]
        ],
        [
          "Risk Assessment",
          "identifying hazards and reducing risk",
          [
            "ignoring uncertainty",
            "removing repeats",
            "changing all variables"
          ]
        ],
        [
          "Raw Data",
          "measurements collected directly during the experiment",
          [
            "processed conclusion only",
            "internet notes only",
            "the title page"
          ]
        ],
        [
          "Data Processing",
          "calculations and graphs used to analyse results",
          [
            "random guessing",
            "changing hypothesis after result",
            "deleting anomalies without reason"
          ]
        ],
        [
          "Evaluation",
          "judging reliability, validity, limitations and improvements",
          [
            "listing apparatus only",
            "stating no errors exist",
            "copying the aim"
          ]
        ],
        [
          "Uncertainty Combination",
          "using rules to combine measurement uncertainties",
          [
            "ignoring units",
            "only drawing diagrams",
            "counting organisms"
          ]
        ]
      ]
    }
  },
  "Chemistry": {
    "National 5": {
      "Chemical Changes And Structure": [
        [
          "Collision Theory",
          "reaction rate depends on collision frequency and energy",
          [
            "atoms never collide",
            "rate only depends on colour",
            "reactions need no particles"
          ]
        ],
        [
          "Covalent Bond",
          "bond formed by sharing electrons",
          [
            "bond from electron transfer only",
            "bond between planets",
            "force in a spring"
          ]
        ],
        [
          "Ionic Bond",
          "electrostatic attraction between oppositely charged ions",
          [
            "sharing electrons equally",
            "hydrogen bond only",
            "metal atoms floating"
          ]
        ],
        [
          "Acid",
          "substance with pH below 7 that releases hydrogen ions in water",
          [
            "substance with pH above 7",
            "neutral molecule only",
            "insoluble salt always"
          ]
        ],
        [
          "Neutralisation",
          "acid reacting with alkali to form salt and water",
          [
            "metal melting",
            "polymer breaking only",
            "DNA replication"
          ]
        ],
        [
          "Mole",
          "amount of substance containing Avogadro's number of particles",
          [
            "unit of current",
            "measure of wavelength",
            "type of enzyme"
          ]
        ]
      ],
      "Nature's Chemistry": [
        [
          "Hydrocarbon",
          "compound containing hydrogen and carbon only",
          [
            "compound with only oxygen",
            "protein molecule",
            "ionic salt"
          ]
        ],
        [
          "Alkane",
          "saturated hydrocarbon with single carbon-carbon bonds",
          [
            "unsaturated molecule with C=C",
            "alcohol functional group",
            "ester linkage only"
          ]
        ],
        [
          "Alkene",
          "unsaturated hydrocarbon containing a carbon-carbon double bond",
          [
            "saturated hydrocarbon only",
            "metal oxide",
            "amino acid"
          ]
        ],
        [
          "Alcohol",
          "organic compound containing hydroxyl group",
          [
            "compound with carboxyl group only",
            "ionic compound",
            "noble gas"
          ]
        ],
        [
          "Ester",
          "compound often with fruity smell made from alcohol and carboxylic acid",
          [
            "metal salt only",
            "polymer monomer always",
            "alkali"
          ]
        ],
        [
          "Combustion",
          "reaction with oxygen releasing energy",
          [
            "reaction with no oxygen ever",
            "DNA copying",
            "osmosis"
          ]
        ]
      ],
      "Chemistry In Society": [
        [
          "Ore",
          "rock containing enough metal compound to extract profitably",
          [
            "pure metal only",
            "polymer chain",
            "gas molecule only"
          ]
        ],
        [
          "Electrolysis",
          "using electricity to break down an ionic compound",
          [
            "heating a gas only",
            "filtering sand",
            "measuring speed"
          ]
        ],
        [
          "Fertiliser",
          "substance adding essential nutrients to soil",
          [
            "substance removing all minerals",
            "type of fuel only",
            "plastic polymer"
          ]
        ],
        [
          "Battery",
          "device converting chemical energy to electrical energy",
          [
            "device using gravity only",
            "enzyme catalyst",
            "food chain"
          ]
        ],
        [
          "Polymer",
          "large molecule made from repeating monomer units",
          [
            "single atom only",
            "ionic lattice only",
            "enzyme active site"
          ]
        ],
        [
          "Flame Test",
          "chemical test identifying metal ions by flame colour",
          [
            "test for speed",
            "DNA test only",
            "wave test"
          ]
        ]
      ]
    },
    "Higher": {
      "Chemical Changes And Structure": [
        [
          "Periodicity",
          "patterns in element properties across the periodic table",
          [
            "random element order",
            "food chain energy",
            "DNA copying"
          ]
        ],
        [
          "Enthalpy Change",
          "heat energy change during a chemical reaction at constant pressure",
          [
            "mass of a substance only",
            "speed of a wave",
            "charge per second"
          ]
        ],
        [
          "Equilibrium",
          "state where forward and reverse reaction rates are equal",
          [
            "reaction has stopped completely",
            "only products remain",
            "all particles vanish"
          ]
        ],
        [
          "Catalyst",
          "substance increasing reaction rate without being used up",
          [
            "reactant that disappears",
            "product only",
            "solvent always"
          ]
        ],
        [
          "Oxidation",
          "loss of electrons or increase in oxidation number",
          [
            "gain of electrons only",
            "movement of water",
            "decrease in temperature"
          ]
        ],
        [
          "pH",
          "measure of hydrogen ion concentration/acidity",
          [
            "measure of mass",
            "measure of current",
            "measure of wavelength"
          ]
        ]
      ],
      "Nature's Chemistry": [
        [
          "Functional Group",
          "atom or group of atoms giving an organic family its characteristic reactions",
          [
            "random part of any graph",
            "metal lattice",
            "radioactive source"
          ]
        ],
        [
          "Oxidation Of Alcohols",
          "primary alcohols can oxidise to aldehydes then carboxylic acids",
          [
            "alcohols become metals",
            "alkanes always become salts",
            "esters become photons"
          ]
        ],
        [
          "Addition Reaction",
          "reaction where atoms add across a double bond",
          [
            "reaction removing all atoms",
            "nuclear decay",
            "osmosis"
          ]
        ],
        [
          "Condensation Reaction",
          "reaction joining molecules with elimination of a small molecule",
          [
            "reaction with no product",
            "ionisation only",
            "gravity effect"
          ]
        ],
        [
          "Protein",
          "polymer made from amino acid monomers",
          [
            "polymer made from glucose only",
            "metal complex",
            "simple alkane"
          ]
        ],
        [
          "Esterification",
          "formation of ester from alcohol and carboxylic acid",
          [
            "formation of salt from metal only",
            "polymerisation of alkenes only",
            "electricity generation"
          ]
        ]
      ],
      "Chemistry In Society": [
        [
          "Redox",
          "reaction involving oxidation and reduction",
          [
            "reaction involving only melting",
            "diffusion only",
            "wave interference"
          ]
        ],
        [
          "Electrochemical Cell",
          "device converting chemical energy into electrical energy using redox",
          [
            "device storing heat only",
            "protein machine",
            "DNA sequencer"
          ]
        ],
        [
          "Volumetric Analysis",
          "quantitative analysis using accurate volumes, often titration",
          [
            "measuring wave speed",
            "finding genotype",
            "counting animals"
          ]
        ],
        [
          "Chromatography",
          "separation technique based on different affinities",
          [
            "technique for force diagrams",
            "technique for orbital speed",
            "technique for quadrats"
          ]
        ],
        [
          "Atom Economy",
          "percentage of reactant atoms ending up in desired product",
          [
            "percentage of light reflected",
            "mass per volume",
            "cell division rate"
          ]
        ],
        [
          "Hess's Law",
          "enthalpy change independent of route taken",
          [
            "rate depends only on colour",
            "current equals voltage",
            "DNA codes proteins"
          ]
        ]
      ],
      "Researching Chemistry": [
        [
          "Titration",
          "technique using measured volumes to find concentration",
          [
            "technique measuring gravity",
            "counting species",
            "finding half-life"
          ]
        ],
        [
          "Uncertainty",
          "doubt in a measurement value",
          [
            "guarantee of exact value",
            "a product colour",
            "an ion charge only"
          ]
        ],
        [
          "Calibration",
          "checking instrument readings against standards",
          [
            "copying notes",
            "heating without measuring",
            "choosing random data"
          ]
        ],
        [
          "Risk Assessment",
          "identifying hazards and reducing risk",
          [
            "ignoring safety",
            "deleting results",
            "not wearing goggles only"
          ]
        ],
        [
          "Conclusion",
          "statement supported by results and linked to aim",
          [
            "guess before experiment",
            "apparatus list",
            "title only"
          ]
        ],
        [
          "Evaluation",
          "judgement of method, reliability and improvements",
          [
            "only repeating aim",
            "no discussion of errors",
            "writing no units"
          ]
        ]
      ]
    },
    "Advanced Higher": {
      "Inorganic Chemistry": [
        [
          "Transition Metal",
          "d-block element forming ions with incomplete d subshells",
          [
            "group 1 metal only",
            "noble gas only",
            "polymer chain"
          ]
        ],
        [
          "Ligand",
          "ion or molecule donating a lone pair to a metal ion",
          [
            "electron acceptor only",
            "hydrocarbon fuel",
            "wave particle"
          ]
        ],
        [
          "Complex Ion",
          "central metal ion surrounded by ligands",
          [
            "DNA molecule",
            "ionic lattice only",
            "gas law"
          ]
        ],
        [
          "Crystal Field Splitting",
          "splitting of d orbitals in a ligand field",
          [
            "splitting of DNA",
            "splitting light by prism only",
            "separating mixtures"
          ]
        ],
        [
          "Oxidation State",
          "apparent charge of an atom in a compound",
          [
            "mass number only",
            "wavelength",
            "reaction rate"
          ]
        ],
        [
          "Colour In Complexes",
          "often caused by d-d transitions absorbing visible light",
          [
            "always caused by pH only",
            "always colourless",
            "caused by gravity"
          ]
        ]
      ],
      "Physical Chemistry": [
        [
          "Rate Law",
          "relationship between reaction rate and concentration of reactants",
          [
            "law of conservation of mass only",
            "voltage rule",
            "food chain rule"
          ]
        ],
        [
          "Order Of Reaction",
          "power to which concentration is raised in the rate equation",
          [
            "position in periodic table",
            "number of products only",
            "molar mass"
          ]
        ],
        [
          "Equilibrium Constant",
          "value expressing product/reactant concentrations at equilibrium",
          [
            "random yield percentage",
            "speed of light",
            "pH only"
          ]
        ],
        [
          "Gibbs Free Energy",
          "quantity used to predict feasibility of a reaction",
          [
            "mass of an atom",
            "charge flow",
            "enzyme shape"
          ]
        ],
        [
          "Electrode Potential",
          "tendency of a species to gain electrons",
          [
            "tendency to evaporate only",
            "mass per volume",
            "reaction colour"
          ]
        ],
        [
          "Arrhenius Equation",
          "relationship between rate constant and temperature",
          [
            "relationship between voltage and current",
            "between force and mass",
            "between wavelength and frequency only"
          ]
        ]
      ],
      "Organic Chemistry": [
        [
          "Nucleophile",
          "electron-pair donor attracted to electron-deficient centres",
          [
            "electron-pair acceptor only",
            "metal ion always",
            "gamma ray"
          ]
        ],
        [
          "Electrophile",
          "electron-pair acceptor attracted to electron-rich centres",
          [
            "electron-pair donor only",
            "solvent only",
            "alkane only"
          ]
        ],
        [
          "Stereoisomers",
          "molecules with same formula but different spatial arrangement",
          [
            "molecules with different formulae",
            "ions only",
            "elements only"
          ]
        ],
        [
          "Aromatic Compound",
          "compound containing a benzene ring or related stable pi system",
          [
            "compound with only single bonds in chain",
            "ionic salt",
            "metal complex only"
          ]
        ],
        [
          "Reaction Mechanism",
          "step-by-step description of bond breaking and forming",
          [
            "balanced equation only",
            "hazard symbol only",
            "spectra only"
          ]
        ],
        [
          "Synthesis Route",
          "planned sequence of reactions to make a target molecule",
          [
            "random mixing of chemicals",
            "only naming compounds",
            "using no reagents"
          ]
        ]
      ],
      "Instrumental Analysis": [
        [
          "Infrared Spectroscopy",
          "identifies bonds using absorption of infrared radiation",
          [
            "measures electric current only",
            "counts animals",
            "finds velocity"
          ]
        ],
        [
          "NMR Spectroscopy",
          "gives information about chemical environments of nuclei",
          [
            "measures pH directly",
            "separates pigments only",
            "calculates force"
          ]
        ],
        [
          "Mass Spectrometry",
          "measures mass-to-charge ratios of ions",
          [
            "measures heat capacity",
            "calculates voltage",
            "counts quadrats"
          ]
        ],
        [
          "Chromatography",
          "separates substances based on different interactions with phases",
          [
            "changes nuclear identity",
            "measures force",
            "forms proteins"
          ]
        ],
        [
          "Chemical Shift",
          "position of NMR signal linked to chemical environment",
          [
            "distance in orbit",
            "cell membrane thickness",
            "wave speed only"
          ]
        ],
        [
          "Molecular Ion Peak",
          "mass spectrum peak corresponding to molecular mass",
          [
            "infrared bond stretch",
            "rate constant",
            "equilibrium colour"
          ]
        ]
      ],
      "Researching Chemistry": [
        [
          "Research Aim",
          "clear statement of what the investigation tests",
          [
            "final graph",
            "random question",
            "safety symbol only"
          ]
        ],
        [
          "Variable Control",
          "keeping relevant factors constant for fair testing",
          [
            "changing everything",
            "ignoring conditions",
            "only writing title"
          ]
        ],
        [
          "Data Analysis",
          "processing results using calculations and graphs",
          [
            "copying apparatus list",
            "guessing conclusion",
            "not using units"
          ]
        ],
        [
          "Reliability",
          "consistency improved by repeats",
          [
            "colour of solution",
            "cost of equipment",
            "randomness"
          ]
        ],
        [
          "Validity",
          "whether the method tests what it is meant to test",
          [
            "number of pages",
            "font size",
            "using no controls"
          ]
        ],
        [
          "Scientific Evaluation",
          "balanced judgement of limitations, errors and improvements",
          [
            "stating perfect method",
            "no conclusion",
            "copying background only"
          ]
        ]
      ]
    }
  }
};

function buildQuestionsFromFacts(facts, subject, level, topic){
  const direct = facts.map((f, i) => ({
    q: `In ${level} ${subject}, what does "${f[0]}" mean in ${topic}?`,
    a: 0,
    options: [f[1], ...(f[2] || [])].slice(0,4)
  }));
  const applied = facts.map((f, i) => ({
    q: `Which option is the best example or use of "${f[0]}"?`,
    a: 1,
    options: [
      `Ignoring ${topic} completely`,
      f[1],
      `Only writing the title "${topic}"`,
      `Choosing answers without checking course content`
    ]
  }));
  return [...direct, ...applied].slice(0,10).map((x,i)=>({...x,id:i+1}));
}

function makeQuiz(subject, level, topic){
  const facts = QUESTION_FACTS?.[subject]?.[level]?.[topic];
  if (facts && facts.length >= 5) return buildQuestionsFromFacts(facts, subject, level, topic);

  const topicData = TOPICS[subject][level].find(t=>t[0]===topic) || [topic,"",""];
  const [title, summary, revise] = topicData;
  return [
    { q:`Which summary best matches ${title}?`, a:0, options:[summary,"This topic is not assessed.","This topic is only vocabulary.","This topic is unrelated to the course."] },
    { q:"What is the best first revision move?", a:1, options:["Guess answers quickly","Learn the key ideas, then practise questions","Only change your notes colour","Avoid mistakes completely"] },
    { q:`For ${level}, what improves marks most?`, a:2, options:["One-word answers","No working","Clear reasoning and exam-style practice","Leaving blanks"] },
    { q:"What should you do after a wrong answer?", a:0, options:["Find the mistake and retry a similar question","Ignore it","Delete the quiz","Change all answers randomly"] },
    { q:`Which method fits ${title}?`, a:3, options:["Only reading","Watching one clip only","Copying without thinking",revise] },
    { q:"What helps long-term memory?", a:1, options:["Cram once","Spaced repetition and active recall","Never reviewing","Only highlighting"] },
    { q:"What should a good study note contain?", a:2, options:["Everything copied","No headings","Short key points in your own words","Only emojis"] },
    { q:"What should you track after a quiz?", a:0, options:["Score and weak topic","Only your friend’s score","Nothing","Only the date"] },
    { q:"Why does the app mark the quiz?", a:3, options:["To let users fake XP","To hide mistakes","To make scores random","To give fair XP based on performance"] },
    { q:"What is the best next step after scoring below 7?", a:1, options:["Give up","Revise the topic summary and try again","Buy random items","Skip the subject forever"] }
  ].map((x,i)=>({...x,id:i+1}));
}

function App(){
  const [session,setSession]=useState(null),[loading,setLoading]=useState(true),[theme,setTheme]=useState(localStorage.getItem("rr_theme")||"light");
  useEffect(()=>{ document.body.dataset.theme=theme; localStorage.setItem("rr_theme",theme); },[theme]);
  useEffect(()=>{ supabase.auth.getSession().then(({data})=>{setSession(data.session);setLoading(false)}); const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s)); return()=>subscription.unsubscribe(); },[]);
  if(loading) return <div className="loading">Loading RevisionRoyale...</div>;
  if(!session) return <Auth theme={theme} setTheme={setTheme}/>;
  return <Game user={session.user} theme={theme} setTheme={setTheme}/>;
}

function Auth({theme,setTheme}){
  const [mode,setMode]=useState("login"),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[username,setUsername]=useState(""),[school,setSchool]=useState(SCHOOLS[0]),[house,setHouse]=useState("NITH"),[msg,setMsg]=useState("");
  async function submit(){
    setMsg("");
    const result=mode==="login"
      ? await supabase.auth.signInWithPassword({email,password})
      : await supabase.auth.signUp({email,password,options:{data:{username:username||safeName(email),school,house,avatar:"🦊",pet:"🦊"}}});
    if(result.error) setMsg(result.error.message);
    else if(mode==="signup") setMsg("Account created. Check your email if needed, then log in.");
  }
  return <main className="auth-v7">
    <section className="welcome-side">
      <div className="floating">🦊</div>
      <h1>Study. Quiz. Level Up.</h1>
      <p>Join your school, take real marked quizzes, use the study timer, earn rewards and compete in the House Cup.</p>
      <div className="bubble-row"><span>🔥 Streaks</span><span>📝 Quizzes</span><span>⏱️ Timer</span><span>🎁 Daily Chest</span></div>
    </section>
    <section className="auth-card-v7">
      <div className="logo wide"><Fox tiny/><h1>Revision<span>Royale</span></h1></div>
      <h2>{mode==="login"?"Welcome Back":"Create Your Account"}</h2>
      <div className="auth-tabs"><button className={mode==="login"?"on":""} onClick={()=>setMode("login")}>Login</button><button className={mode==="signup"?"on":""} onClick={()=>setMode("signup")}>Sign Up</button></div>
      {msg&&<div className="notice">{msg}</div>}
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
      {mode==="signup"&&<>
        <input placeholder="Username, e.g. Baker07" value={username} onChange={e=>setUsername(e.target.value)}/>
        <select value={school} onChange={e=>setSchool(e.target.value)}>{SCHOOLS.map(s=><option key={s}>{s}</option>)}</select>
        <select value={house} onChange={e=>setHouse(e.target.value)}>{HOUSES.map(h=><option key={h}>{h}</option>)}</select>
      </>}
      <button className="big" onClick={submit}>{mode==="login"?"Enter RevisionRoyale":"Create My Account"}</button>
      <button className="plain" onClick={()=>setTheme(theme==="light"?"dark":"light")}>{theme==="light"?<Moon/>:<Sun/>} Switch Theme</button>
    </section>
  </main>;
}

function Game({user,theme,setTheme}){
  const [page,setPage]=useState("home"),[profile,setProfile]=useState(null),[sessions,setSessions]=useState([]),[friends,setFriends]=useState([]),[subject,setSubject]=useState(localStorage.getItem("rr_subject")||"Biology"),[courseLevel,setCourseLevel]=useState(localStorage.getItem("rr_level")||"Higher"),[toast,setToast]=useState(""),[notifs,setNotifs]=useState(false),[loading,setLoading]=useState(true);
  useEffect(()=>localStorage.setItem("rr_subject",subject),[subject]);
  useEffect(()=>localStorage.setItem("rr_level",courseLevel),[courseLevel]);
  function notify(t){ setToast(t); setTimeout(()=>setToast(""),2800); }
  async function ensureProfile(){
    let {data:p}=await supabase.from("profiles").select("*").eq("id",user.id).maybeSingle();
    if(!p){
      const md=user.user_metadata||{},username=md.username||safeName(user.email);
      const {data:newP}=await supabase.from("profiles").insert({id:user.id,email:user.email,username,display_name:username,school:md.school||SCHOOLS[0],house:md.house||"NITH",avatar:md.avatar||"🦊",pet:md.pet||"🦊",coins:0,gems:0,active_boost:null,last_chest:null}).select("*").single();
      p=newP;
    }
    return p;
  }
  async function load(){
    setLoading(true);
    const p=await ensureProfile();
    const [s,f]=await Promise.all([
      supabase.from("study_sessions").select("*").eq("user_id",user.id).order("created_at",{ascending:false}),
      supabase.from("friends_view").select("*").or(`requester.eq.${user.id},receiver.eq.${user.id}`)
    ]);
    setProfile(p); setSessions(s.data||[]); setFriends(f.data||[]); setLoading(false);
  }
  useEffect(()=>{load()},[]);
  const stats=useMemo(()=>{const xp=sessions.reduce((a,s)=>a+Number(s.xp||0),0),todayS=sessions.filter(s=>s.session_date===today()),week=sessions.filter(s=>s.session_date>=weekStart());return{xp,levelNum:levelFromXP(xp),coins:Number(profile?.coins||0),gems:Number(profile?.gems||0),activeBoost:profile?.active_boost||"",streak:calcStreak(sessions),total:sessions.reduce((a,s)=>a+Number(s.minutes||0),0),todayMinutes:todayS.reduce((a,s)=>a+Number(s.minutes||0),0),todayCount:todayS.length,week:week.reduce((a,s)=>a+Number(s.minutes||0),0),avgScore:averageScore(sessions)}} ,[sessions,profile]);
  if(loading) return <div className="loading">Loading Your Study Hub...</div>;
  const notifications=[`You have a ${stats.streak} day streak.`,stats.activeBoost?`${boostName(stats.activeBoost)} is active.`:"No boost active.",`Balance: ${stats.coins} coins and ${stats.gems} gems.`];
  return <div className="shell">
    <aside className="sidebar">
      <div className="logo sidebar-logo"><Fox tiny/><h1>Revision<span>Royale</span></h1></div>
      <Nav page={page} setPage={setPage} id="home" icon={<Home/>} label="Home"/>
      <Nav page={page} setPage={setPage} id="quiz" icon={<Brain/>} label="Quiz"/>
      <Nav page={page} setPage={setPage} id="timer" icon={<Timer/>} label="Timer"/>
      <Nav page={page} setPage={setPage} id="quests" icon={<Target/>} label="Quests"/>
      <Nav page={page} setPage={setPage} id="leaderboard" icon={<Trophy/>} label="Leaderboard"/>
      <Nav page={page} setPage={setPage} id="battles" icon={<Swords/>} label="Battles"/>
      <Nav page={page} setPage={setPage} id="house" icon={<Shield/>} label="House"/>
      <Nav page={page} setPage={setPage} id="friends" icon={<Users/>} label="Friends"/>
      <Nav page={page} setPage={setPage} id="shop" icon={<Store/>} label="Shop"/>
      <Nav page={page} setPage={setPage} id="character" icon={<UserRound/>} label="Character"/>
      <Nav page={page} setPage={setPage} id="ai" icon={<Bot/>} label="AI Coach"/>
      <Nav page={page} setPage={setPage} id="stats" icon={<BarChart3/>} label="Stats"/>
      <Nav page={page} setPage={setPage} id="settings" icon={<Settings/>} label="Settings"/>
      <ProfileCard profile={profile} stats={stats}/>
      <button className="logout" onClick={()=>supabase.auth.signOut()}><LogOut/> Sign Out</button>
    </aside>
    <main className="main">
      <PageHeader title={pageTitle(page)} profile={profile} stats={stats} theme={theme} setTheme={setTheme} setNotifs={setNotifs}/>
      {toast&&<div className="toast">{toast}</div>}
      {notifs&&<Modal title="Notifications" close={()=>setNotifs(false)}>{notifications.map(n=><div className="topic-row" key={n}><Bell size={18}/><span>{n}</span></div>)}</Modal>}
      {page==="home"&&<HomePage stats={stats} subject={subject} setSubject={setSubject} courseLevel={courseLevel} setCourseLevel={setCourseLevel} setPage={setPage} profile={profile} reload={load} notify={notify}/>}
      {page==="quiz"&&<QuizPage user={user} subject={subject} setSubject={setSubject} courseLevel={courseLevel} setCourseLevel={setCourseLevel} reload={load} notify={notify} profile={profile}/>}
      {page==="timer"&&<StudyTimer user={user} subject={subject} setSubject={setSubject} courseLevel={courseLevel} setCourseLevel={setCourseLevel} reload={load} notify={notify} profile={profile}/>}
      {page==="quests"&&<Quests stats={stats} subject={subject} courseLevel={courseLevel} setPage={setPage}/>}
      {page==="leaderboard"&&<Leaderboards profile={profile} friends={friends}/>}
      {page==="battles"&&<Battles profile={profile} stats={stats}/>}
      {page==="house"&&<HouseCup school={profile?.school}/>}
      {page==="friends"&&<Friends user={user} friends={friends} reload={load} notify={notify}/>}
      {page==="shop"&&<Shop profile={profile} reload={load} notify={notify}/>}
      {page==="character"&&<Character profile={profile} setProfile={setProfile} notify={notify}/>}
      {page==="ai"&&<AI stats={stats} sessions={sessions} profile={profile} subject={subject} courseLevel={courseLevel}/>}
      {page==="stats"&&<Stats stats={stats} sessions={sessions}/>}
      {page==="settings"&&<SettingsPage profile={profile} setProfile={setProfile} notify={notify} theme={theme} setTheme={setTheme}/>}
    </main>
  </div>;
}

function pageTitle(p){return({home:"Study Hub",quiz:"Topic Quiz",timer:"Study Timer",quests:"Daily Quests",leaderboard:"Leaderboards",battles:"Battles",house:"House Cup",friends:"Friends",shop:"Boost Shop",character:"Customise Character",ai:"AI Study Coach",stats:"Progress Stats",settings:"Settings"}[p]||titleCase(p));}
function Fox({tiny}){return <div className={tiny?"fox tiny":"fox"}><span className="crown">👑</span><span className="face">🦊</span></div>;}
function Nav({page,setPage,id,icon,label}){return <button className={`nav ${page===id?"active":""}`} onClick={()=>setPage(id)}>{React.cloneElement(icon,{size:20})}<span>{label}</span></button>;}
function ProfileCard({profile,stats}){return <div className="player"><div className="avatar-big">{profile?.avatar||"🦊"}</div><b>@{profile?.username||"Student"}</b><span>{profile?.school||"School"}</span><small>{profile?.house||"NITH"} · Level {stats.levelNum}</small><div className="bar"><i style={{width:`${Math.min(100,(stats.xp%800)/8)}%`}}/></div><small>{stats.xp%800}/800 XP</small><div className="wallet"><span>🪙 {stats.coins}</span><span>💎 {stats.gems}</span></div></div>;}
function PageHeader({title,profile,stats,theme,setTheme,setNotifs}){return <header className="page-head"><div><h1>{title}</h1><p>{profile?.school||"Your School"} · {profile?.house||"NITH"} House</p></div><div className="header-actions"><span className="chip">🔥 {stats.streak}</span><span className="chip">🪙 {stats.coins}</span><span className="chip">💎 {stats.gems}</span><button className="circle" onClick={()=>setNotifs(true)}><Bell size={18}/></button><button className="circle" onClick={()=>setTheme(theme==="light"?"dark":"light")}>{theme==="light"?<Moon size={18}/>:<Sun size={18}/>}</button><span className="mini-avatar">{profile?.avatar||"🦊"}</span></div></header>;}

function HomePage({stats,subject,setSubject,courseLevel,setCourseLevel,setPage,profile,reload,notify}){
  return <div className="home-grid">
    <section className="hero"><div><h1>Study Smarter. Score Higher.</h1><p>Take marked quizzes, use the study timer, unlock rewards and climb your school leaderboard.</p><div className="hero-actions"><button onClick={()=>setPage("quiz")}><Brain/> Take Quiz</button><button className="alt" onClick={()=>setPage("timer")}><Timer/> Start Timer</button></div></div><PetFox profile={profile} stats={stats}/></section>
    <DailyChest profile={profile} reload={reload} notify={notify}/>
    <section className="card selectors"><div><h2>Choose Subject</h2><SubjectPicker subject={subject} setSubject={setSubject}/></div><div><h2>Choose Level</h2><LevelPicker courseLevel={courseLevel} setCourseLevel={setCourseLevel}/></div></section>
    <TopicMap subject={subject} courseLevel={courseLevel} setPage={setPage} stats={stats}/>
    <ExamCountdown subject={subject} courseLevel={courseLevel}/>
    <Activity stats={stats}/>
  </div>;
}

function PetFox({profile,stats}){let mood="📚"; if(stats.streak>=7)mood="🔥"; if(stats.xp>=2000)mood="🏆"; if(stats.todayCount===0)mood="😴"; return <div className="pet-fox"><span>{profile?.pet||profile?.avatar||"🦊"}</span><b>{mood}</b><small>{stats.streak>=7?"Streak Mode":stats.todayCount>0?"Studying":"Ready To Start"}</small></div>;}
function DailyChest({profile,reload,notify}){const canClaim=profile?.last_chest!==today(); async function claim(){if(!canClaim){notify("Daily Chest Already Claimed.");return}const coins=75,gems=1;const{error}=await supabase.from("profiles").update({coins:Number(profile?.coins||0)+coins,gems:Number(profile?.gems||0)+gems,last_chest:today()}).eq("id",profile.id);if(error){notify(error.message);return}notify(`Daily Chest: ${coins} Coins And ${gems} Gem.`);reload()}return <section className="quest-card chest-card"><h2>🎁 Daily Chest</h2><p>{canClaim?"Claim Today’s Reward.":"Come Back Tomorrow For Another Reward."}</p><button onClick={claim}><Gift/> {canClaim?"Claim Chest":"Claimed"}</button></section>;}
function SubjectPicker({subject,setSubject}){return <div className="subject-grid">{Object.entries(TOPICS).map(([name,s])=><button key={name} className={`subject ${s.color} ${subject===name?"selected":""}`} onClick={()=>setSubject(name)}>{React.cloneElement(s.icon,{size:22})}<b>{name}</b></button>)}</div>;}
function LevelPicker({courseLevel,setCourseLevel}){return <div className="level-grid">{LEVELS.map(l=><button key={l} className={courseLevel===l?"level selected":"level"} onClick={()=>setCourseLevel(l)}>{l}</button>)}</div>;}
function Progress({value}){return <div className="progress"><i style={{width:`${Math.max(0,Math.min(100,value))}%`}}/></div>;}

function TopicMap({subject,courseLevel,setPage,stats}){const[open,setOpen]=useState(false),[selected,setSelected]=useState(null),course=TOPICS[subject],topics=course[courseLevel];return <section className="card map-card"><div className="head"><h2>{courseLevel} {subject} Learning Path</h2><button onClick={()=>setOpen(true)}>View Topics ›</button></div><div className="path-map">{topics.map(([title,summary,revise],i)=><button className={`path-node ${course.color} node-${i%5}`} key={title} onClick={()=>setSelected({title,summary,revise,i})}><span>{stats.avgScore>=8?<Award/>:<Star/>}</span><b>{title}</b><small>{stats.avgScore>=8?"Gold Path":"Tap To Learn"}</small></button>)}</div>{open&&<Modal title={`${courseLevel} ${subject} Topics`} close={()=>setOpen(false)}>{topics.map(([t,s,r],i)=><div className="topic-row clickable" key={t} onClick={()=>setSelected({title:t,summary:s,revise:r,i})}><b>{i+1}</b><div><strong>{t}</strong><p>{s}</p></div></div>)}</Modal>}{selected&&<Modal title={selected.title} close={()=>setSelected(null)}><p className="summary">{selected.summary}</p><div className="study-tips"><h3>Best Revision Method</h3><p>{selected.revise}</p><div className="modal-actions"><button onClick={()=>{setSelected(null);setPage("quiz")}}><Brain/> Take Quiz</button><button className="alt" onClick={()=>{setSelected(null);setPage("timer")}}><Timer/> Study Timer</button></div></div></Modal>}</section>;}
function ExamCountdown({subject,courseLevel}){const exam=EXAMS_2026.find(e=>e.subject===subject&&e.level===courseLevel);return <section className="card exam-card"><CalendarDays/><div><h2>{courseLevel} {subject} Exam Countdown</h2><p>{exam?`${daysUntil(exam.date)} Days Remaining · ${exam.date}`:"Add Your Exam Date In Settings Later."}</p></div></section>;}
function Modal({title,close,children}){return <div className="modal-back" onClick={close}><div className="modal" onClick={e=>e.stopPropagation()}><button className="modal-x" onClick={close}><X/></button><h2>{title}</h2>{children}</div></div>;}
function Activity({stats}){return <section className="card activity"><div className="head"><h2>📅 Today’s Activity</h2></div><div className="activity-grid"><Mini icon="📝" label="Sessions Today" value={`${stats.todayCount}`} goal="Goal: 3" pct={Math.min(100,stats.todayCount/3*100)}/><Mini icon="🎯" label="Average Score" value={`${stats.avgScore}/10`} goal="Aim For 8+" pct={Math.min(100,stats.avgScore*10)}/><Mini icon="⏱️" label="Study Time" value={minutesLabel(stats.todayMinutes)} goal="Timer XP" pct={Math.min(100,stats.todayMinutes/120*100)}/></div></section>;}
function Mini({icon,label,value,goal,pct}){return <div className="mini"><span>{icon}</span><div><small>{label}</small><b>{value}</b><em>{goal}</em><Progress value={pct}/></div></div>;}

function QuizPage({user,subject,setSubject,courseLevel,setCourseLevel,reload,notify,profile}){
  const [topic,setTopic]=useState(TOPICS[subject][courseLevel][0][0]),[answers,setAnswers]=useState({}),[result,setResult]=useState(null),[saved,setSaved]=useState(false);
  useEffect(()=>{setTopic(TOPICS[subject][courseLevel][0][0]);setAnswers({});setResult(null);setSaved(false)},[subject,courseLevel]);
  const questions=useMemo(()=>makeQuiz(subject,courseLevel,topic),[subject,courseLevel,topic]);
  function mark(){const score=questions.reduce((a,q)=>a+(Number(answers[q.id])===q.a?1:0),0);setResult(score);setSaved(false);}
  async function save(){if(result===null){notify("Complete And Mark The Quiz First.");return}let xp=result*20,coins=Math.max(1,result*3),gems=result>=9?2:result>=7?1:0;if(profile?.active_boost==="double_xp")xp*=2;if(profile?.active_boost==="triple_xp")xp*=3;if(profile?.active_boost==="coin_charm")coins*=2;if(profile?.active_boost==="gem_finder")gems+=2;const{error}=await supabase.from("study_sessions").insert({user_id:user.id,subject,minutes:10,xp,score:result,notes:`Quiz: ${topic}`,check_in:`${courseLevel} · ${topic} · Quiz Score ${result}/10`,session_date:today(),session_type:"quiz"});if(error){notify(error.message);return}await supabase.from("profiles").update({coins:Number(profile?.coins||0)+coins,gems:Number(profile?.gems||0)+gems,active_boost:null}).eq("id",user.id);setSaved(true);notify(`Quiz Saved: ${result}/10 · ${xp} XP · ${coins} Coins · ${gems} Gems`);reload();}
  return <section className="page quiz-page"><h1>10-Question Topic Quiz</h1><p className="summary">The app marks the quiz and awards XP from the score. Students do not choose their own score.</p><SubjectPicker subject={subject} setSubject={setSubject}/><LevelPicker courseLevel={courseLevel} setCourseLevel={setCourseLevel}/><label>Topic</label><select value={topic} onChange={e=>{setTopic(e.target.value);setAnswers({});setResult(null);setSaved(false)}}>{TOPICS[subject][courseLevel].map(([t])=><option key={t}>{t}</option>)}</select><div className="quiz-list">{questions.map(q=><div className="question" key={q.id}><h3>{q.id}. {q.q}</h3>{q.options.map((op,i)=><label className={`option ${Number(answers[q.id])===i?"picked":""}`} key={`${q.id}-${i}`}><input type="radio" name={`q${q.id}`} checked={Number(answers[q.id])===i} onChange={()=>setAnswers({...answers,[q.id]:i})}/>{op}</label>)}</div>)}</div><div className="quiz-actions"><button onClick={mark}><CheckCircle2/> Mark Quiz</button>{result!==null&&<button className="green" onClick={save} disabled={saved}><Sparkles/> {saved?"Saved":"Save And Earn XP"}</button>}</div>{result!==null&&<div className="result-card"><h2>Your Score: {result}/10</h2><p>{result>=9?"Excellent. Maximum rewards unlocked.":result>=7?"Strong result. Keep building.":result>=4?"Good attempt. Revise weak points and retry.":"Revise the topic summary, then try again."}</p><b>Base XP: {result*20}</b></div>}</section>;
}

function StudyTimer({user,subject,setSubject,courseLevel,setCourseLevel,reload,notify,profile}){
  const [running,setRunning]=useState(false),[seconds,setSeconds]=useState(0),[notes,setNotes]=useState("");
  useEffect(()=>{if(!running)return;const t=setInterval(()=>setSeconds(s=>Math.min(s+1,36000)),1000);return()=>clearInterval(t)},[running]);
  const minutes=Math.max(1,Math.floor(seconds/60)); const projectedXP=Math.round(minutes*(200/60));
  async function save(){let xp=projectedXP,coins=Math.max(1,Math.floor(xp/15)),gems=minutes>=60?1:0;if(profile?.active_boost==="double_xp")xp*=2;if(profile?.active_boost==="triple_xp")xp*=3;if(profile?.active_boost==="coin_charm")coins*=2;if(profile?.active_boost==="gem_finder")gems+=2;const{error}=await supabase.from("study_sessions").insert({user_id:user.id,subject,minutes,xp,score:null,notes,check_in:`${courseLevel} · Study Timer · ${minutes} minutes`,session_date:today(),session_type:"timer"});if(error){notify(error.message);return}await supabase.from("profiles").update({coins:Number(profile?.coins||0)+coins,gems:Number(profile?.gems||0)+gems,active_boost:null}).eq("id",user.id);notify(`Study Saved: ${minutes} Min · ${xp} XP · ${coins} Coins · ${gems} Gems`);setRunning(false);setSeconds(0);setNotes("");reload();}
  return <section className="page timer-page"><h1>Study Timer</h1><p className="summary">Timer XP scales with study time: 200 XP per hour, proportional from 1 minute up to 10 hours.</p><SubjectPicker subject={subject} setSubject={setSubject}/><LevelPicker courseLevel={courseLevel} setCourseLevel={setCourseLevel}/><div className="timer-card"><span>{profile?.avatar||"🦊"}</span><b>{String(Math.floor(seconds/3600)).padStart(2,"0")}:{String(Math.floor(seconds/60)%60).padStart(2,"0")}:{String(seconds%60).padStart(2,"0")}</b><p>Projected XP: {projectedXP}</p><div className="timer-buttons">{!running?<button onClick={()=>setRunning(true)}><Play/> Start</button>:<button onClick={()=>setRunning(false)}><Pause/> Pause</button>}<button className="plain" onClick={()=>{setRunning(false);setSeconds(0)}}><Square/> Reset</button></div></div><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="What did you study?"/><button className="green" onClick={save}><CheckCircle2/> Save Study Time And Earn XP</button></section>;
}

function Quests({stats,subject,courseLevel,setPage}){return <section className="page"><h1>Daily Quests</h1><Quest title={`Complete 2 ${courseLevel} ${subject} Quizzes`} progress={Math.min(stats.todayCount,2)} goal={2}/><Quest title="Score 7 Or Higher In A Quiz" progress={stats.avgScore>=7?1:0} goal={1}/><Quest title="Use The Study Timer Today" progress={stats.todayMinutes>0?1:0} goal={1}/><div className="actions"><button onClick={()=>setPage("quiz")}><Brain/> Take Quiz</button><button className="alt" onClick={()=>setPage("timer")}><Timer/> Study Timer</button></div></section>;}
function Quest({title,progress,goal}){return <div className="quest"><Target/><div><b>{title}</b><Progress value={Math.min(100,progress/goal*100)}/><small>{progress}/{goal} · Reward Available</small></div></div>;}

function Leaderboards({profile,friends}){const[tab,setTab]=useState("school"),[rows,setRows]=useState([]);useEffect(()=>{let q=supabase.from("leaderboard_weekly").select("*").limit(50);if(tab==="school")q=q.eq("school",profile?.school||"");if(tab==="house")q=q.eq("school",profile?.school||"").eq("house",profile?.house||"");q.then(({data})=>setRows(data||[]));},[tab,profile?.school,profile?.house]);return <section className="page"><h1>Leaderboards</h1><div className="tabs"><button className={tab==="school"?"on":""} onClick={()=>setTab("school")}><School/> School</button><button className={tab==="house"?"on":""} onClick={()=>setTab("house")}><Shield/> House</button><button className={tab==="global"?"on":""} onClick={()=>setTab("global")}><Trophy/> Global</button></div>{rows.map((r,i)=><div className="leader" key={r.user_id}><span>#{i+1}</span><b>@{r.username}</b><em>{minutesLabel(r.minutes)}</em><strong>{r.xp} XP</strong></div>)}{!rows.length&&<p>No leaderboard data yet.</p>}</section>;}
function Battles({profile,stats}){return <section className="page"><h1>Weekly Battles</h1><div className="battle-card"><Swords/><div><h2>Friend Streak Battle</h2><p>You: {stats.streak} Days · Rival: 0 Days</p><b>Winner Reward: 200 XP + 25 Coins</b></div></div><SchoolBattle profile={profile}/></section>;}
function SchoolBattle({profile}){const[rows,setRows]=useState([]);useEffect(()=>{supabase.from("leaderboard_weekly").select("school,xp").limit(200).then(({data})=>{const map={};(data||[]).forEach(r=>{map[r.school]=(map[r.school]||0)+Number(r.xp||0)});setRows(Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,8));});},[]);return <div className="battle-card"><School/><div><h2>School Vs School</h2>{rows.map(([school,xp])=><p key={school}>{school}: <b>{xp} XP</b></p>)}{!rows.length&&<p>No school battle data yet.</p>}</div></div>;}
function HouseCup({school}){const[rows,setRows]=useState([]);useEffect(()=>{supabase.from("house_leaderboard").select("*").eq("school",school||"").then(({data})=>setRows(data||[]))},[school]);const all=HOUSES.map((h,i)=>rows.find(r=>r.house===h)||{house:h,xp:0,color:["red","blue","green"][i]});return <section className="page house"><h1>🏆 House Cup</h1><p>House points start at 0 and rise when students earn XP.</p>{all.map((h,i)=><div className={`house-row ${["red","blue","green"][i]}`} key={h.house}><Shield/><b>{h.house}</b><span>{h.xp||0} Pts</span></div>)}</section>;}
function Friends({user,friends,reload,notify}){const[query,setQuery]=useState(""),[results,setResults]=useState([]);async function search(){const q=query.trim();if(!q)return;const{data}=await supabase.from("profiles").select("id,username,display_name,school").ilike("username",`%${q}%`).limit(8);setResults((data||[]).filter(p=>p.id!==user.id))}async function add(p){const{error}=await supabase.from("friends").insert({requester:user.id,receiver:p.id,status:"accepted"});if(error){notify(error.message);return}notify(`Added @${p.username}`);setResults([]);setQuery("");reload()}return <section className="page"><h1>Friends</h1><p>Search by username. School is shown so you know who you are adding.</p><div className="inline"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search username, e.g. Baker07"/><button onClick={search}><Search/>Search</button></div>{results.map(p=><div className="friend" key={p.id}><b>@{p.username}</b><span>{p.school}</span><button onClick={()=>add(p)}>Add</button></div>)}<h2>Your Friends</h2>{friends.map(f=><div className="friend" key={f.id}>👥 {f.friend_username?`@${f.friend_username}`:f.friend_email||"Friend"}</div>)}</section>;}
function Shop({profile,reload,notify}){async function buy(item){if(profile?.active_boost){notify("Use Your Current Boost Before Buying Another.");return}const coins=Number(profile?.coins||0),gems=Number(profile?.gems||0);if(item.costType==="coins"&&coins<item.cost){notify("You Don't Have Enough Coins.");return}if(item.costType==="gems"&&gems<item.cost){notify("You Don't Have Enough Gems.");return}const patch={active_boost:item.id};if(item.costType==="coins")patch.coins=coins-item.cost;else patch.gems=gems-item.cost;const{error}=await supabase.from("profiles").update(patch).eq("id",profile.id);if(error){notify(error.message);return}notify(`${item.name} Activated.`);reload()}return <section className="page"><h1>Boost Shop</h1><p>Your Balance: 🪙 {profile?.coins||0} Coins · 💎 {profile?.gems||0} Gems</p>{profile?.active_boost&&<div className="notice good">Active Boost: {boostName(profile.active_boost)}</div>}<div className="shop-grid">{SHOP.map(item=><div className="shop" key={item.id}><span>{item.icon}</span><b>{item.name}</b><p>{item.desc}</p><strong>{item.cost} {titleCase(item.costType)}</strong><button onClick={()=>buy(item)}>Buy And Activate</button></div>)}</div></section>;}
function Character({profile,setProfile,notify}){const[avatar,setAvatar]=useState(profile?.avatar||"🦊"),[pet,setPet]=useState(profile?.pet||"🦊");async function save(){const{data,error}=await supabase.from("profiles").update({avatar,pet}).eq("id",profile.id).select("*").single();if(error){notify(error.message);return}setProfile(data);notify("Character Saved.")}return <section className="page character"><h1>Customise Character</h1><div className="character-preview">{avatar} {pet}</div><h2>Avatar</h2><div className="avatar-grid">{AVATARS.map(a=><button key={a} className={avatar===a?"avatar-choice selected":"avatar-choice"} onClick={()=>setAvatar(a)}>{a}</button>)}</div><h2>Pet</h2><div className="avatar-grid">{PETS.map(a=><button key={a} className={pet===a?"avatar-choice selected":"avatar-choice"} onClick={()=>setPet(a)}>{a}</button>)}</div><button onClick={save}><Palette/>Save Character</button></section>;}
function AI({stats,sessions,profile,subject,courseLevel}){const[q,setQ]=useState(""),[answer,setAnswer]=useState(""),[busy,setBusy]=useState(false);async function ask(prompt){const question=prompt||q||`Make me a ${courseLevel} ${subject} revision plan using my weak topics, quiz score, timer study time and streak.`;setBusy(true);try{const res=await fetch("/api/ai-study-coach",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question,stats,recentSessions:sessions.slice(0,20),profile,subject,level:courseLevel})});const data=await res.json();setAnswer(data.answer||"Try Again.")}catch{setAnswer("AI Could Not Respond Right Now.")}setBusy(false)}return <section className="page ai"><h1>AI Study Coach 🤖</h1><div className="quick"><button onClick={()=>ask(`Make me a ${courseLevel} ${subject} plan based on my weakest quiz scores.`)}>Revision Plan</button><button onClick={()=>ask("Which topic should I improve next?")}>Weak Topics</button><button onClick={()=>ask("Make me a 7-day streak plan.")}>Streak Plan</button></div><div className="ai-chat"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask anything about studying..." onKeyDown={e=>{if(e.key==="Enter")ask()}}/><button onClick={()=>ask()}><Send/>Ask</button></div><pre>{busy?"Thinking...":answer||"Ask your AI coach for revision tips."}</pre>{answer&&<button onClick={()=>copyText(answer)}><Copy/>Copy</button>}</section>;}
function Stats({stats,sessions}){return <section className="page"><h1>Progress Stats</h1><div className="stats-grid"><div className="stat-tile"><b>🔥</b><strong>{stats.streak}</strong><span>Streak</span></div><div className="stat-tile"><b>⚡</b><strong>{stats.xp}</strong><span>Total XP</span></div><div className="stat-tile"><b>🎯</b><strong>{stats.avgScore}/10</strong><span>Average Quiz Score</span></div><div className="stat-tile"><b>⏱️</b><strong>{minutesLabel(stats.total)}</strong><span>Total Study Time</span></div></div>{Object.keys(TOPICS).map(s=>{const xp=sessions.filter(x=>x.subject===s).reduce((a,x)=>a+Number(x.xp||0),0);return <div className="subject-stat" key={s}><b>{s}</b><Progress value={Math.min(100,xp/800*100)}/><span>{xp} XP</span></div>})}</section>;}
function SettingsPage({profile,setProfile,notify,theme,setTheme}){const[name,setName]=useState(profile?.display_name||""),[username,setUsername]=useState(profile?.username||""),[school,setSchool]=useState(profile?.school||SCHOOLS[0]),[house,setHouse]=useState(profile?.house||"NITH");async function save(){const{data,error}=await supabase.from("profiles").update({display_name:name,username,school,house}).eq("id",profile.id).select("*").single();if(error){notify(error.message);return}setProfile(data);notify("Settings Saved.")}return <section className="page"><h1>Settings</h1><label>Display Name</label><input value={name} onChange={e=>setName(e.target.value)}/><label>Username</label><input value={username} onChange={e=>setUsername(e.target.value)}/><label>School</label><select value={school} onChange={e=>setSchool(e.target.value)}>{SCHOOLS.map(s=><option key={s}>{s}</option>)}</select><label>House</label><select value={house} onChange={e=>setHouse(e.target.value)}>{HOUSES.map(h=><option key={h}>{h}</option>)}</select><button onClick={save}>Save</button><button className="plain" onClick={()=>setTheme(theme==="light"?"dark":"light")}>Switch Theme</button></section>;}

createRoot(document.getElementById("root")).render(<App/>);
