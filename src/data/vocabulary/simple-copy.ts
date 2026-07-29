import type {
  VocabularyCategory,
  VocabularySubcategory,
} from "@/src/data/vocabulary/types";

type CopyInput = {
  category: VocabularyCategory;
  definition: string;
  example?: string;
  subcategory: VocabularySubcategory;
  word: string;
};

type CopyOutput = {
  definition: string;
  example?: string;
};

const GENERIC_DEFINITION_PATTERNS = [
  /^A common reading/i,
  /^A word used (to show an action|to tell what|for an action)/i,
  /^An everyday term/i,
  /^A living creature/i,
  /^A growing thing/i,
  /^An outdoor idea/i,
  /^A math (idea|action)/i,
  /^A shape idea/i,
  /^A comparison idea/i,
  /^A measurement idea/i,
  /^A number name/i,
  /^A position idea/i,
  /^A simple term/i,
  /^A word that/i,
  /^A word used/i,
];

const UNSAFE_OR_OFF_TOPIC_COPY_PATTERNS = [
  /\b(argument|attack|blood|bullet|database|die|death|dog|dogs|gun|kill|league|slang|stern|tarot|vulgar|war|weapon)\b/i,
  /;/,
];

const EXACT_DEFINITIONS: Record<string, string> = {
  a: "Used before one person, place, animal, or thing.",
  about: "Used to show the topic, subject, or focus of something.",
  able: "Having the skill or strength needed to do something.",
  above: "In a higher place than something else.",
  across: "From one side to the other side.",
  act: "To do something, often for a reason or in a story.",
  add: "To put numbers or groups together to find how many there are in all.",
  addend: "One number that is joined with another in an addition problem.",
  afraid: "Feeling scared or worried that something may hurt or go wrong.",
  after: "Later than another time or event.",
  afternoon: "The part of the day after lunch and before evening.",
  again: "One more time.",
  against: "Touching, facing, or trying to stop something.",
  age: "How long a person, animal, place, or thing has lived or existed.",
  ago: "Before now.",
  agree: "To think the same thing or say yes to an idea.",
  air: "The invisible gas around us that people, animals, and plants need.",
  airplane: "A vehicle with wings that carries people or things through the sky.",
  all: "Every person or thing in a group.",
  allow: "To let someone do something.",
  almost: "Nearly, but not completely.",
  also: "In addition to something else.",
  altogether: "In one complete amount or group.",
  always: "Every time, with no missing times.",
  am: "Used with I to tell what is true now.",
  among: "In the middle of a group.",
  amount: "How much there is.",
  an: "Used before one thing when the next sound begins like a vowel.",
  and: "Used to join words, ideas, or actions.",
  anger: "A strong upset feeling when something seems wrong or unfair.",
  animal: "A living thing that can eat, move, and sense the world.",
  answer: "A reply or result that fits a question or problem.",
  any: "One, some, or whichever one from a group.",
  appear: "To come into sight or seem to be true.",
  are: "Used with more than one person or thing to tell what is true now.",
  area: "A space or part of a place.",
  arm: "The body part from the shoulder to the hand.",
  around: "On every side or in a circle path.",
  arrange: "To put things in a chosen order or pattern.",
  arrive: "To reach a place.",
  arrow: "A mark or shape that points in a direction.",
  art: "Pictures, music, dance, or other creative work people make.",
  as: "Used to compare or show a role.",
  ask: "To say or write a question.",
  at: "Used to show a place, time, or point.",
  ate: "Took food into the mouth and swallowed it before now.",
  atom: "A very tiny piece that makes up matter.",
  autumn: "The season after summer when leaves may change color.",
  away: "Not near; at a distance from a place.",
  baby: "A very young child or animal.",
  back: "The rear side of the body or something behind.",
  backward: "Toward the back or in the opposite direction.",
  bad: "Not good, helpful, safe, or right.",
  balance: "To keep steady or make two sides equal.",
  ball: "A round object used for throwing, kicking, rolling, or playing.",
  band: "A group of people or a strip that holds things together.",
  bank: "A place that keeps money, or the side of a river.",
  bar: "A long solid piece, counter, or mark.",
  base: "The bottom part that supports something.",
  basic: "Simple and most important.",
  be: "To exist or to have a certain state.",
  bead: "A small piece with a hole that can be strung or counted.",
  beat: "To hit again and again, or to win against someone.",
  beauty: "A pleasing look, sound, or feeling.",
  because: "Used to give a reason.",
  been: "Having existed, stayed, or happened before now.",
  before: "Earlier than another time or event.",
  beginning: "The first part of something.",
  behind: "At the back of something.",
  believe: "To think something is true.",
  bell: "A metal object that makes a ringing sound.",
  below: "In a lower place than something else.",
  best: "Better than all the others.",
  better: "More good, useful, or correct than another.",
  between: "In the space separating two people or things.",
  bicycle: "A two-wheeled vehicle moved by pedals.",
  big: "Large in size or amount.",
  bigger: "Larger than another thing.",
  birthday: "The day each year when someone celebrates being born.",
  bit: "A small piece or amount.",
  black: "The darkest color.",
  blood: "The red liquid that moves through the body.",
  blow: "To move air from the mouth or by wind.",
  board: "A flat piece of wood or other material.",
  body: "All the physical parts of a person or animal.",
  bone: "A hard body part inside people and animals.",
  born: "Brought into life as a baby.",
  both: "The two together.",
  bought: "Got something by paying money before now.",
  box: "A container with flat sides.",
  boy: "A male child.",
  break: "To make something come apart or stop working.",
  bright: "Giving much light or easy to see.",
  bring: "To carry or move something toward a place.",
  broad: "Wide from side to side.",
  broke: "Came apart or stopped working before now.",
  brother: "A boy or man who has the same parent as another child.",
  brought: "Carried or moved something toward a place before now.",
  brown: "A color like soil, wood, or chocolate.",
  build: "To make something by putting parts together.",
  burn: "To damage or change with fire or strong heat.",
  busy: "Having many things to do.",
  but: "Used to show a different or opposite idea.",
  buy: "To get something by paying money.",
  by: "Near, beside, or done through someone or something.",
  call: "To say a name loudly or contact someone by phone.",
  came: "Moved toward a place before now.",
  camp: "A place where people stay outdoors for a short time.",
  can: "Shows that someone is able to do something.",
  capital: "A main city, a large letter, or money used for work.",
  captain: "A person who leads a team, ship, or group.",
  card: "A small flat piece of paper used for games, messages, or information.",
  care: "Kind attention, protection, or help.",
  carry: "To hold something while moving it.",
  case: "A container, situation, or example.",
  catch: "To stop and hold something that is moving.",
  caught: "Stopped and held something that was moving before now.",
  cause: "A reason something happens.",
  cell: "A tiny living unit, or a small separate space.",
  cent: "One small coin or one part out of one hundred cents in a dollar.",
  century: "A time period of one hundred years.",
  certain: "Known for sure.",
  chance: "A possibility that something may happen.",
  change: "To make or become different.",
  character: "A person in a story, or the qualities someone has.",
  charge: "A cost, an electric amount, or the act of rushing forward.",
  chart: "A picture or table that organizes information.",
  check: "To look carefully to see if something is right.",
  chief: "The main or leading person.",
  child: "A young person.",
  children: "More than one young person.",
  choose: "To pick one from two or more choices.",
  chord: "Several musical notes played together.",
  city: "A large town with many people, buildings, and roads.",
  claim: "To say something is true or belongs to someone.",
  class: "A group of learners, a lesson, or a kind of thing.",
  classify: "To sort things into groups by how they are alike.",
  clean: "Free from dirt, or to remove dirt.",
  clear: "Easy to see, hear, or understand.",
  climb: "To go up using hands, feet, or effort.",
  close: "To shut, or near in space or time.",
  clothe: "To put clothes on someone.",
  coat: "A warm outer piece of clothing.",
  colony: "A group living together in one place.",
  color: "What the eye sees, such as red, blue, or green.",
  column: "A line of things going up and down.",
  combine: "To put two or more things together.",
  come: "To move toward a person or place.",
  common: "Seen or used often.",
  company: "A business, or people who are together.",
  compare: "To look at two things and tell how they are alike or different.",
  complete: "Having all parts finished or included.",
  completed: "Finished before now.",
  compost: "Old plant or food scraps that turn into soil.",
  condition: "The way something is, or a rule that must be met.",
  connect: "To join or link things together.",
  consider: "To think carefully about something.",
  consonant: "A speech sound or letter that is not a vowel.",
  contain: "To have something inside.",
  continent: "One of Earth's very large land areas.",
  continue: "To keep going without stopping.",
  control: "To guide, manage, or make something work.",
  cook: "To prepare food with heat.",
  cool: "A little cold, or calm and relaxed.",
  copy: "To make another one that looks or sounds the same.",
  correct: "Right or free from mistakes.",
  cost: "The amount of money needed to buy something.",
  could: "Shows that something was possible or might happen.",
  country: "A land with its own people, rules, and leaders.",
  course: "A path, direction, or set of lessons.",
  cover: "To put something over or on top of another thing.",
  crease: "A line made by folding or pressing something.",
  create: "To make something new.",
  crop: "Plants grown for food or use.",
  cross: "To go from one side to another.",
  crowd: "A large group of people close together.",
  cry: "To make tears or a loud sad sound.",
  current: "Happening now, or moving water or air.",
  cut: "To divide or make an opening with a sharp tool.",
  dad: "A father.",
  dance: "To move the body to music.",
  danger: "A chance that someone or something may be hurt.",
  dark: "Having little or no light.",
  dead: "No longer alive.",
  deal: "An agreement, amount, or act of giving cards.",
  dear: "Loved, valued, or used in a greeting.",
  death: "The end of life.",
  decimal: "A number written with a point to show parts smaller than one.",
  decide: "To choose after thinking.",
  deep: "Going far down or far inward.",
  degree: "A unit for measuring temperature, angles, or turn.",
  depend: "To need help from something or be decided by something.",
  design: "To plan how something will look or work.",
  determine: "To find out or decide after thinking.",
  develop: "To grow, improve, or become more complete.",
  dictionary: "A book or tool that explains words and how to use them.",
  die: "To stop living.",
  differ: "To be unlike another thing.",
  different: "Not the same.",
  difficult: "Hard to do or understand.",
  did: "Shows that an action happened before now.",
  direct: "Straight, clear, or guiding someone where to go.",
  discuss: "To talk about something with others.",
  distant: "Far away.",
  doctor: "A person trained to help sick or hurt people.",
  do: "To perform an action or ask about an action.",
  does: "Shows what one person or thing is doing.",
  dollar: "A unit of money used in some countries.",
  done: "Finished.",
  down: "Toward a lower place.",
  draw: "To make a picture with lines.",
  dream: "Pictures or ideas in the mind during sleep, or something hoped for.",
  drive: "To guide a car or other vehicle.",
  drop: "To let something fall.",
  dry: "Having little or no water.",
  during: "At some time while something is happening.",
  ear: "The body part used for hearing.",
  early: "Before the usual or expected time.",
  earth: "The planet we live on, or soil on the ground.",
  ease: "To make less hard, or a state of comfort.",
  east: "The direction where the sun rises.",
  effect: "A change or result caused by something.",
  either: "One or the other of two choices.",
  electric: "Using or made by electricity.",
  element: "A basic part or a pure kind of matter.",
  else: "In addition or different.",
  empty: "Having nothing inside.",
  end: "The last part.",
  enemy: "A person or group that works against another.",
  energy: "The power to do work, move, heat, or light something.",
  engine: "A machine that gives power to move something.",
  enough: "As much as needed.",
  enter: "To go into a place.",
  equal: "The same in amount, size, or value.",
  equation: "A math sentence showing two sides with the same value.",
  equate: "To show or think that two things are the same.",
  especially: "More than usual or more than others.",
  estimate: "To make a careful guess.",
  even: "Flat and smooth, or able to be split into equal parts.",
  event: "Something that happens.",
  ever: "At any time.",
  every: "Each one in a group.",
  example: "One thing that shows what a rule or idea means.",
  except: "Not including.",
  excite: "To make someone feel happy, eager, or full of energy.",
  exercise: "Movement that helps the body stay healthy.",
  expect: "To think something will happen.",
  experience: "Something a person lives through or learns from.",
  experiment: "A test done to learn what happens.",
  fact: "Something true that can be checked.",
  fair: "Right, honest, and equal.",
  fall: "To move downward, or the season after summer.",
  family: "People who are related or care for one another as a group.",
  famous: "Known by many people.",
  far: "A long distance away.",
  farmer: "A person who grows crops or raises animals.",
  fast: "Moving or happening quickly.",
  fat: "Having much body weight, or a soft oily part in food.",
  father: "A male parent.",
  favor: "Kind help or a choice liked more than another.",
  fear: "A scared feeling.",
  feed: "To give food to a person or animal.",
  feel: "To touch or have an emotion.",
  feet: "More than one body part used for standing and walking.",
  fell: "Moved down to the ground before now.",
  felt: "Touched or had an emotion before now.",
  fight: "To struggle, argue, or try hard against something.",
  figure: "A shape, number, person, or picture.",
  fill: "To put enough inside so there is little or no empty space.",
  final: "Last or at the end.",
  find: "To discover or notice where something is.",
  fine: "Good, okay, or made of very small parts.",
  finger: "One of the long parts at the end of a hand.",
  finish: "To bring something to an end.",
  fit: "To be the right size or shape.",
  flow: "To move like water.",
  fly: "To move through the air.",
  follow: "To go after or do what directions say.",
  for: "Shows who receives something or why something is done.",
  food: "Something people or animals eat to live and grow.",
  foot: "The body part at the end of the leg used for standing.",
  force: "A push or pull that can move or change something.",
  form: "A shape, type, or way something is made.",
  forward: "Toward the front or ahead.",
  found: "Discovered before now.",
  fraction: "A number that shows part of a whole.",
  free: "Not held, trapped, or needing payment.",
  fresh: "New, clean, or recently made.",
  friend: "A person someone likes and trusts.",
  front: "The forward side or first part.",
  full: "Holding as much as possible.",
  fun: "Enjoyment or play.",
  funny: "Making people laugh or seeming strange.",
  gas: "Matter like air that spreads to fill space.",
  gather: "To bring things or people together.",
  gave: "Handed or offered something before now.",
  general: "Usual, common, or not limited to one small part.",
  gentle: "Kind, soft, and careful.",
  get: "To receive, become, or fetch something.",
  girl: "A female child.",
  give: "To hand or offer something to someone.",
  glad: "Happy or pleased.",
  glass: "A hard clear material, or a container for drinking.",
  go: "To move or travel.",
  goes: "Moves or travels.",
  going: "Moving or planning to do something.",
  gold: "A shiny yellow metal or color.",
  gone: "No longer here.",
  good: "Right, kind, useful, or pleasing.",
  govern: "To lead and make rules for a place or group.",
  grand: "Large, impressive, or important.",
  gray: "A color between black and white.",
  great: "Very good or very large.",
  grew: "Became bigger or older before now.",
  grow: "To become bigger, older, or more developed.",
  guess: "To answer without being fully sure.",
  guide: "To lead, show the way, or give help.",
  gun: "A weapon that shoots bullets.",
  had: "Shows someone owned, held, or experienced something before now.",
  hair: "Thin strands that grow from skin.",
  hand: "The body part at the end of the arm used for holding.",
  happen: "To take place or occur.",
  happy: "Feeling joy or pleasure.",
  hard: "Difficult, firm, or not soft.",
  has: "Shows that one person or thing owns, holds, or includes something.",
  have: "To own, hold, include, or experience something.",
  he: "Used for one boy or man instead of saying his name again.",
  head: "The body part with the face, brain, eyes, ears, nose, and mouth.",
  hear: "To notice sound with the ears.",
  heart: "The organ in the chest that pumps blood.",
  held: "Kept in the hands or arms before now.",
  help: "To make something easier for someone.",
  here: "In this place.",
  high: "Far above the ground or above another thing.",
  him: "Used for a boy or man who receives an action.",
  his: "Belonging to a boy or man.",
  history: "Events from the past and the study of them.",
  hit: "To strike something.",
  hold: "To keep something in the hands or arms.",
  hole: "An empty opening in something.",
  home: "The place where someone lives.",
  hope: "To want something good to happen.",
  hot: "Having much heat.",
  hour: "A time period of sixty minutes.",
  house: "A building where people live.",
  how: "Used to ask the way, amount, or condition.",
  huge: "Very large.",
  human: "A person.",
  hundred: "The number equal to ten tens.",
  hunt: "To search for or chase something.",
  hurry: "To move or act quickly.",
  hurt: "To cause pain or feel pain.",
  idea: "A thought, plan, or picture in the mind.",
  if: "Used to show a condition that may happen.",
  imagine: "To make a picture or idea in the mind.",
  in: "Inside a place, thing, or group.",
  inch: "A small unit for measuring length.",
  include: "To have something as part of a group.",
  indicate: "To point out or show.",
  industry: "Work or businesses that make goods or services.",
  insect: "A small animal with six legs and often wings or antennae.",
  inside: "In the inner part of something.",
  instant: "A very short moment.",
  instrument: "A tool or a device used to make music.",
  interest: "A feeling of wanting to learn or know more.",
  into: "Toward the inside of something.",
  invent: "To make or think of something new for the first time.",
  iron: "A strong metal, or a tool that smooths clothes.",
  island: "Land with water all around it.",
  job: "Work that someone does.",
  joy: "A strong happy feeling.",
  jump: "To push the body off the ground with the legs.",
  just: "Only, exactly, or fair.",
  keep: "To hold, save, or continue having something.",
  kept: "Held or saved before now.",
  key: "A tool for opening a lock, or an important answer.",
  kill: "To make a living thing die.",
  kind: "Caring and helpful, or a type of thing.",
  king: "A male ruler.",
  knew: "Understood or had information before now.",
  know: "To understand or have information in the mind.",
  lady: "A woman or polite name for a woman.",
  land: "The solid ground, not water.",
  language: "Words, signs, or sounds people use to communicate.",
  large: "Big in size or amount.",
  late: "After the expected time.",
  laugh: "To make a happy sound when something is funny.",
  law: "A rule made for people in a place.",
  lay: "Put something down before now, or rested in a flat position.",
  lead: "To guide or be first.",
  learn: "To gain knowledge or skill.",
  leave: "To go away from a place.",
  led: "Guided before now.",
  leg: "A body part used for standing, walking, and running.",
  let: "To allow something to happen.",
  letter: "A written symbol for a speech sound, or a message.",
  level: "Flat, even, or a step in learning or difficulty.",
  lie: "To rest flat, or to say something untrue.",
  life: "The state of being alive.",
  lift: "To raise something upward.",
  like: "To enjoy something, or to be similar to something.",
  line: "A long narrow mark or row.",
  liquid: "Matter that flows and takes the shape of its container.",
  list: "A set of words or items written one after another.",
  little: "Small in size or amount.",
  live: "To be alive or have a home in a place.",
  locate: "To find where something is.",
  log: "A cut piece of a tree trunk, or a written record.",
  lone: "By itself, without others.",
  long: "Great in length or time.",
  look: "To use the eyes to see.",
  lost: "Not found, or no longer had.",
  lot: "A large amount or number.",
  loud: "Making a strong sound.",
  love: "To care for someone or something very much.",
  machine: "A tool with parts that work together to do a job.",
  made: "Created or built before now.",
  magnet: "An object that pulls iron or some metals.",
  main: "Most important.",
  major: "Very important or large.",
  make: "To create or build something.",
  man: "An adult male person.",
  map: "A drawing that shows places and directions.",
  mark: "A line, spot, sign, or score.",
  market: "A place where people buy and sell things.",
  mass: "The amount of matter in something.",
  master: "A person with great skill, or to learn very well.",
  material: "What something is made from.",
  matter: "Anything that takes up space and has weight.",
  may: "Shows permission or possibility.",
  me: "Used when the speaker receives an action.",
  mean: "To have a message or definition.",
  meant: "Had a message or purpose before now.",
  meat: "Food from an animal.",
  meet: "To come together with someone.",
  melody: "A line of musical notes.",
  men: "More than one adult male person.",
  metal: "A hard material such as iron, gold, or steel.",
  method: "A way to do something.",
  might: "Shows that something is possible.",
  mile: "A unit used to measure long distance.",
  milk: "A white drink from some animals, often used as food.",
  million: "The number equal to one thousand thousands.",
  mind: "The part of a person that thinks, feels, and remembers.",
  mine: "Belonging to the speaker, or a place where minerals are dug.",
  minute: "A time period of sixty seconds.",
  miss: "To fail to hit, see, or be with someone.",
  mix: "To put things together so they blend.",
  modern: "New or from the present time.",
  molecule: "A tiny group of atoms joined together.",
  moment: "A very short time.",
  money: "Coins, bills, or digital value used to buy things.",
  month: "One of the twelve parts of a year.",
  moon: "The round object that moves around Earth and shines at night.",
  morning: "The early part of the day before noon.",
  mother: "A female parent.",
  motion: "Movement.",
  mount: "To climb onto something or put something in place.",
  mouth: "The body part used for eating, speaking, and breathing.",
  move: "To change place or position.",
  much: "A large amount.",
  multiply: "To find the total from equal groups.",
  music: "Sounds arranged with rhythm or melody.",
  must: "Shows that something is required.",
  myself: "The speaker, used when talking about their own action.",
  my: "Belonging to the speaker.",
  name: "What someone or something is called.",
  nation: "A country and its people.",
  natural: "Found in nature or not made by people.",
  nature: "The living world, land, water, sky, and weather.",
  necessary: "Needed or required.",
  neck: "The body part between the head and shoulders.",
  need: "To require something important.",
  neighbor: "A person who lives nearby.",
  never: "At no time.",
  new: "Not old or not used before.",
  noise: "A sound, especially one that may be loud or unwanted.",
  noon: "The middle of the day.",
  north: "The direction opposite south.",
  nor: "Used after neither to show another negative choice.",
  nose: "The body part used for smelling and breathing.",
  not: "Used to make a statement negative.",
  note: "A short written message or a musical sound.",
  nothing: "Not anything.",
  notice: "To see, hear, or become aware of something.",
  noun: "A naming part of speech for people, places, things, or ideas.",
  now: "At this time.",
  number: "A symbol or word that tells an amount or order.",
  object: "A thing that can be seen or touched.",
  of: "Shows a part, kind, amount, or connection.",
  observe: "To watch or notice carefully.",
  occur: "To happen.",
  offer: "To give or suggest something for someone to accept.",
  office: "A place where people work at desks.",
  often: "Many times.",
  oil: "A slippery liquid that does not mix well with water.",
  old: "Having lived or existed for a long time.",
  once: "One time, or at a time in the past.",
  only: "No more than; just one or just that.",
  on: "Touching the top or surface of something.",
  open: "Not closed, or to make something not closed.",
  operate: "To make a machine work or do a task.",
  opposite: "Completely different or across from something.",
  organ: "A body part that does a special job inside a living thing.",
  original: "First, new, or not copied.",
  other: "Different or additional.",
  out: "Away from the inside of a place or thing.",
  outside: "Not inside.",
  oxygen: "A gas in air that people and animals need to breathe.",
  page: "One side of a sheet in a book or document.",
  paint: "Colored liquid used on a surface, or to put it there.",
  paragraph: "A group of sentences about one idea.",
  parent: "A mother, father, or caregiver.",
  particular: "Specific or special.",
  party: "A fun gathering with people.",
  pass: "To go by, move past, or give to another person.",
  past: "A time before now.",
  path: "A way or track to walk on.",
  pattern: "Something that repeats in a planned way.",
  pay: "To give money for something.",
  people: "More than one person.",
  perhaps: "Maybe.",
  period: "A mark at the end of a sentence, or a length of time.",
  person: "A human being.",
  phrase: "A small group of words that work together.",
  pick: "To choose or take something.",
  picture: "An image, drawing, or photo.",
  piece: "A part of something.",
  pitch: "How high or low a sound is, or to throw something.",
  place: "A location or position.",
  plain: "Simple, clear, or flat land.",
  plan: "An idea or steps for what to do.",
  plane: "A flat surface, or a vehicle that flies.",
  plant: "A living thing that usually grows in soil and needs light and water.",
  play: "To have fun, act in a game, or make music.",
  plural: "A word form that means more than one.",
  poem: "Writing that often uses rhythm, feeling, and careful word choice.",
  point: "A small exact place, sharp end, or idea.",
  poor: "Having little money, or not good in quality.",
  populate: "To live in a place or fill it with people.",
  port: "A place where ships stop.",
  pose: "To hold the body still, or to ask a question.",
  position: "The place where something is.",
  possible: "Able to happen or be done.",
  post: "A pole, job, or message shared for others to read.",
  power: "The ability or energy to do something.",
  practice: "To do something again to get better.",
  prepare: "To get ready.",
  present: "Here now, a gift, or the current time.",
  press: "To push firmly.",
  pretty: "Nice to look at.",
  print: "To make words or pictures on paper.",
  probable: "Likely to happen.",
  problem: "A question or situation that needs an answer or fix.",
  process: "A set of steps for doing something.",
  produce: "To make or grow something.",
  product: "Something made, grown, or sold.",
  proper: "Correct or suitable.",
  property: "Something owned, or a quality something has.",
  protect: "To keep safe.",
  prove: "To show that something is true.",
  provide: "To give what is needed.",
  pull: "To move something closer by drawing it toward you.",
  push: "To move something away by pressing against it.",
  put: "To place something somewhere.",
  quantity: "How many or how much there is.",
  question: "A sentence that asks for information.",
  quick: "Fast or taking little time.",
  quiet: "Making little or no sound.",
  quite: "Very, fairly, or completely.",
  quotient: "The answer after sharing into equal groups.",
  race: "A contest of speed, or a group with shared traits.",
  rail: "A long bar used for support or for trains to run on.",
  raise: "To lift up or help grow.",
  ran: "Moved quickly on foot before now.",
  range: "The distance or set between low and high.",
  rather: "More willingly, or instead.",
  reach: "To stretch toward or arrive at something.",
  ready: "Prepared to start.",
  real: "Truly existing, not pretend.",
  reason: "Why something happens or why someone thinks something.",
  receive: "To get something from someone.",
  record: "To write, save, or keep information.",
  region: "A large area or part of a place.",
  remember: "To keep or bring back an idea in the mind.",
  reply: "To answer.",
  represent: "To stand for or show something.",
  require: "To need or make necessary.",
  rest: "To stop work or movement for a while.",
  result: "What happens because of an action or event.",
  rich: "Having much money, value, or detail.",
  ride: "To sit on and travel with something that moves.",
  ring: "A circle-shaped band, or a ringing sound.",
  rise: "To move upward.",
  road: "A path for cars, buses, and people to travel on.",
  roll: "To move by turning over and over.",
  room: "A space inside a building.",
  rope: "A thick strong cord.",
  rub: "To move something back and forth against a surface.",
  rule: "An instruction that tells what is allowed or how something works.",
  safe: "Protected from danger or harm.",
  said: "Spoke or told something before now.",
  sail: "To travel on water by boat.",
  salt: "A white seasoning that makes food taste salty.",
  sat: "Rested on a seat before now.",
  save: "To keep for later or protect from harm.",
  saw: "Looked at before now, or a tool for cutting.",
  say: "To speak words.",
  scale: "A tool for measuring weight, or a set of marks.",
  science: "The study of the world through observation and tests.",
  score: "The number of points in a game or test.",
  search: "To look carefully for something.",
  season: "One part of the year with certain weather.",
  seat: "A place to sit.",
  second: "Number two in order, or a very short unit of time.",
  section: "One part of a larger thing.",
  see: "To notice with the eyes.",
  seem: "To appear to be.",
  segment: "One part of a line or larger thing.",
  select: "To choose.",
  self: "A person's own body, mind, or identity.",
  sell: "To give something for money.",
  send: "To make something go to another person or place.",
  sense: "A way the body notices the world, or good understanding.",
  sent: "Made something go to another person or place before now.",
  separate: "Not joined, or to move things apart.",
  serve: "To help, give food, or do a job for others.",
  settle: "To become calm, decide, or make a home.",
  several: "More than two but not many.",
  shall: "Used to talk about what will happen or what should happen.",
  she: "Used for one girl or woman instead of saying her name again.",
  shape: "The form or outline of something.",
  sharp: "Able to cut or having a pointed edge.",
  sheet: "A flat piece of paper, cloth, or material.",
  shine: "To give or reflect light.",
  shop: "A place to buy things, or to buy things.",
  short: "Small in length, height, or time.",
  shoulder: "The body part where the arm joins the upper body.",
  shout: "To speak very loudly.",
  show: "To let someone see or understand something.",
  sight: "The ability to see, or something seen.",
  sign: "A mark, notice, or signal that gives information.",
  silent: "Making no sound.",
  silver: "A shiny gray-white metal or color.",
  similar: "Almost the same.",
  simple: "Easy to understand or do.",
  since: "From a time in the past until now, or because.",
  sing: "To make music with the voice.",
  sister: "A girl or woman who has the same parent as another child.",
  sit: "To rest with the body on a chair or surface.",
  size: "How big or small something is.",
  skill: "An ability learned through practice.",
  skin: "The outer covering of the body.",
  slave: "A person forced to work without freedom.",
  sleep: "To rest the body and mind with eyes closed.",
  slip: "To slide by accident.",
  smell: "To notice scent with the nose.",
  smile: "To make a happy expression with the mouth.",
  soft: "Easy to press, not hard.",
  soldier: "A person who serves in an army.",
  solution: "An answer to a problem.",
  solve: "To find the answer or fix a problem.",
  some: "An amount or number, but not all.",
  son: "A male child of a parent.",
  song: "Music with words.",
  south: "The direction opposite north.",
  space: "An empty area, or the area beyond Earth.",
  special: "Different in an important or valued way.",
  speech: "Spoken words or a talk given to people.",
  speed: "How fast something moves.",
  spell: "To say or write the letters of a word in order.",
  spend: "To use money, time, or energy.",
  spoke: "Said words before now.",
  spot: "A small mark or place.",
  spread: "To open out or move over a wider area.",
  stand: "To be upright on the feet.",
  start: "To begin.",
  state: "A condition, a part of a country, or to say clearly.",
  station: "A place where buses, trains, workers, or equipment stay.",
  stay: "To remain in one place.",
  stead: "The place or role of someone or something.",
  steel: "A strong metal made mostly from iron.",
  step: "A foot movement, stair, or part of a process.",
  still: "Not moving, or continuing until now.",
  stood: "Was upright on the feet before now.",
  stop: "To end movement or action.",
  store: "A place to buy things, or to keep things for later.",
  straight: "Not bent or curved.",
  strange: "Unusual or hard to understand.",
  stretch: "To make longer or reach out.",
  street: "A road in a town or city.",
  string: "A thin cord.",
  strong: "Having power, firmness, or force.",
  student: "A person who learns in school or studies.",
  study: "To learn by reading, practicing, or thinking.",
  subject: "The topic being talked about or studied.",
  substance: "A kind of material.",
  success: "Doing well or reaching a goal.",
  such: "Of that kind or amount.",
  sudden: "Happening quickly without warning.",
  suffix: "A letter or group of letters added to the end of a word.",
  sugar: "A sweet substance used in food and drinks.",
  suggest: "To give an idea for someone to think about.",
  suit: "Clothes worn together, or something that fits a need.",
  supply: "An amount kept ready to use.",
  support: "To help someone or hold something up.",
  sure: "Feeling certain.",
  surface: "The outside or top part of something.",
  surprise: "Something unexpected, or the feeling it gives.",
  swim: "To move through water using the body.",
  syllable: "A beat or sound part in a word.",
  symbol: "A mark or picture that stands for something.",
  system: "Parts that work together.",
  tail: "The back body part of some animals.",
  take: "To get, hold, or carry something.",
  talk: "To speak with someone.",
  teach: "To help someone learn.",
  team: "A group working or playing together.",
  teeth: "Hard white parts in the mouth used for biting and chewing.",
  term: "A word or phrase with a special meaning.",
  test: "A way to check knowledge, skill, or how something works.",
  than: "Used when comparing two things.",
  that: "Used to point to something farther away or already mentioned.",
  the: "Used before a specific person, place, animal, or thing.",
  their: "Belonging to them.",
  them: "Used for more than one person or thing receiving an action.",
  there: "In or at that place.",
  thick: "Wide from one side to the other, or not thin.",
  thin: "Narrow from one side to the other, or not thick.",
  thing: "An object, idea, action, or item.",
  think: "To use the mind to make ideas or choices.",
  this: "Used to point to something near or being discussed.",
  though: "Even if, or however.",
  thought: "An idea in the mind, or the past of thinking.",
  throw: "To send something through the air with the hand.",
  tie: "To fasten with a knot.",
  tiny: "Very small.",
  tire: "A rubber wheel covering, or to become tired.",
  together: "With each other or in one group.",
  told: "Said or explained before now.",
  tone: "The sound or feeling of a voice, music, or message.",
  tool: "An object used to do a job.",
  touch: "To feel something with the body, especially the hand.",
  toward: "In the direction of something.",
  town: "A place with homes, streets, and people, smaller than many cities.",
  track: "A path, mark, or course to follow.",
  trade: "To exchange or buy and sell things.",
  travel: "To go from one place to another.",
  trip: "A journey to another place.",
  trouble: "A problem or difficulty.",
  true: "Real or correct.",
  try: "To make an effort.",
  tube: "A hollow round shape or container.",
  turn: "To move around, change direction, or take a chance to act.",
  type: "A kind or group of things.",
  unit: "One part used for counting or measuring.",
  until: "Up to a certain time.",
  up: "Toward a higher place.",
  upon: "On or onto.",
  usual: "Happening or done most of the time.",
  value: "How much something is worth or how important it is.",
  vary: "To change or be different.",
  verb: "A word that shows action, being, or state.",
  very: "Used to make a meaning stronger.",
  view: "To look at, or what can be seen.",
  village: "A small town.",
  visit: "To go see a person or place for a short time.",
  voice: "The sound a person makes when speaking or singing.",
  vowel: "A speech sound made with an open mouth, or a letter for that sound.",
  wait: "To stay until something happens.",
  wall: "A side of a room or a structure that divides or protects.",
  want: "To wish for or need something.",
  war: "A serious fight between countries or groups.",
  warm: "A little hot in a comfortable way.",
  wash: "To clean with water.",
  watch: "To look at carefully, or a small clock worn on the body.",
  water: "A clear liquid that living things need to drink.",
  way: "A path, method, or direction.",
  wear: "To have clothes or items on the body.",
  weather: "The air conditions outside, such as rain, sun, wind, or snow.",
  week: "A time period of seven days.",
  well: "In a good way, healthy, or a deep hole for water.",
  west: "The direction where the sun sets.",
  wheel: "A round part that turns to help something move.",
  whether: "Used to show a choice between possibilities.",
  while: "During the time that something happens.",
  wife: "A married woman in relation to her spouse.",
  wild: "Living or growing in nature, not tame.",
  win: "To get first place or succeed in a game or contest.",
  wing: "A body part or object used for flying.",
  wire: "A thin piece of metal used to carry electricity or hold things.",
  wish: "To want something to happen.",
  woman: "An adult female person.",
  women: "More than one adult female person.",
  wonder: "To think with curiosity or amazement.",
  wont: "Used to mean will not.",
  wood: "Hard material from a tree.",
  word: "A spoken or written unit that carries meaning.",
  work: "To do a job or task.",
  world: "Earth and all the people, places, and things on it.",
  written: "Put into letters or marks before now.",
  wrong: "Not correct or not right.",
  wrote: "Put words on paper or a screen before now.",
  yard: "An outdoor area near a building, or a unit of length.",
  year: "A time period of twelve months.",
  our: "Belonging to us.",
  these: "Points to more than one thing nearby.",
  they: "Used for more than one person, animal, thing, or idea.",
  those: "Points to more than one thing farther away.",
  we: "The speaker and one or more other people.",
  were: "Shows what more than one person or thing was like before now.",
  what: "Used to ask about a thing, action, or idea.",
  when: "Used to ask or tell about time.",
  where: "Used to ask or tell about place.",
  which: "Used to ask someone to choose from choices.",
  who: "Used to ask about a person.",
  why: "Used to ask for a reason.",
  will: "Shows that something may happen in the future.",
  with: "Together with someone or something.",
  would: "Shows something possible, polite, or imagined.",
  you: "Used to talk to one person or a group.",
  your: "Belonging to the listener.",
  young: "Not old; early in life.",
};

const OBJECT_DEFINITIONS: Record<string, string> = {
  book: "Pages with words, pictures, or both, used for stories and learning.",
  notebook: "A book with blank or lined pages for writing notes.",
  pen: "A writing tool that uses ink.",
  crayon: "A colored wax stick used for drawing.",
  marker: "A pen with a soft tip used for bold writing or coloring.",
  eraser: "A tool used to remove pencil marks.",
  ruler: "A straight tool used to measure length or draw lines.",
  sharpener: "A tool that makes a pencil point sharp.",
  scissors: "A tool with two blades used for cutting.",
  glue: "A sticky substance used to join things together.",
  bag: "A container used to carry things.",
  folder: "A folded cover used to hold papers.",
  paper: "A thin sheet used for writing, drawing, or printing.",
  chalk: "A soft stick used for writing on a board.",
  paintbrush: "A tool with bristles used to spread paint.",
  clipboard: "A flat board with a clip for holding papers.",
  calculator: "A tool used to solve number problems.",
  flashcard: "A card used for quick practice or review.",
  storybook: "A book that tells a story.",
  workbook: "A book with practice pages and activities.",
  whiteboard: "A smooth board people write on with markers.",
  blackboard: "A dark board people write on with chalk.",
  stapler: "A tool that fastens papers with small metal clips.",
  tape: "A sticky strip used to hold or fix things.",
  desk: "A table used for schoolwork, reading, or writing.",
  bed: "Furniture used for sleeping or resting.",
  pillow: "A soft cushion for resting the head.",
  blanket: "A warm cover used while sleeping or resting.",
  lamp: "A light that helps people see indoors.",
  sofa: "A soft seat for more than one person.",
  cabinet: "Furniture with doors or drawers for storing things.",
  shelf: "A flat board used for holding things.",
  drawer: "A sliding box in furniture used for storage.",
  mirror: "A smooth surface that shows a reflection.",
  basket: "A container used for holding or carrying things.",
  plate: "A flat dish used for food.",
  bowl: "A deep dish used for food or liquid.",
  spoon: "A small tool used for eating or serving soft food.",
  fork: "A tool with points used for picking up food.",
  knife: "A cutting tool with a blade.",
  pan: "A cooking container used on a stove.",
  kettle: "A container used to heat or pour water.",
  shirt: "Clothing worn on the upper body.",
  pants: "Clothing worn on the legs and waist.",
  dress: "One-piece clothing that covers the body and hangs down.",
  skirt: "Clothing that hangs from the waist.",
  shoes: "Footwear that protects the feet.",
  sandals: "Open footwear held on by straps.",
  socks: "Soft coverings worn on the feet inside shoes.",
  hat: "A covering worn on the head.",
  jacket: "Outer clothing worn over the upper body.",
  sweater: "Warm knitted clothing worn on the upper body.",
  raincoat: "A coat that helps keep rain off the body.",
  towel: "Cloth used for drying.",
  soap: "A cleaning substance used with water.",
  comb: "A toothed tool used to arrange hair.",
  toothbrush: "A small brush used to clean teeth.",
  toothpaste: "A paste used with a toothbrush to clean teeth.",
  shampoo: "A liquid soap used to wash hair.",
  hairbrush: "A brush used to smooth or arrange hair.",
  washcloth: "A small cloth used for washing the body.",
  slippers: "Soft shoes usually worn indoors.",
  cap: "A soft hat, often with a front brim.",
  belt: "A strip worn around the waist to hold clothes in place.",
  scarf: "A cloth worn around the neck for warmth or style.",
  mittens: "Hand coverings with one part for the thumb and one for the fingers.",
  block: "A solid piece used for building or play.",
  puzzle: "A game or problem solved by fitting parts together.",
  doll: "A toy shaped like a person.",
  "teddy bear": "A soft toy shaped like a bear.",
  "toy car": "A small play vehicle.",
  "yo-yo": "A toy that moves up and down on a string.",
  marble: "A small hard ball used in games.",
  whistle: "A small tool that makes a sharp sound when blown.",
  xylophone: "A musical instrument with bars that are struck to make notes.",
  tambourine: "A small drum-like instrument with jingles.",
  guitar: "A string instrument played by strumming or plucking.",
  piano: "A large keyboard instrument with strings inside.",
  "paint set": "A group of colors and tools used for painting.",
  "building bricks": "Toy blocks that connect to make structures.",
  "jump rope": "A rope swung for jumping games.",
  scooter: "A small ride-on vehicle pushed by one foot.",
  wagon: "A small cart pulled by a handle.",
  hammer: "A tool used to hit nails or break things.",
  screwdriver: "A tool used to turn screws.",
  flashlight: "A portable light carried by hand.",
  lantern: "A light with a handle or cover for carrying or hanging.",
  tablet: "A flat touchscreen computer.",
  headphones: "A device worn over or in the ears for listening.",
  television: "A device that shows moving pictures and sound.",
  radio: "A device used to hear broadcasts or music.",
  fan: "A device that moves air.",
  stove: "A kitchen appliance used for cooking with heat.",
  "washing machine": "A machine that cleans clothes.",
  "traffic light": "A signal with colored lights that guides road traffic.",
  mailbox: "A box where letters and mail are put.",
  "bicycle helmet": "A hard head covering worn for safety while riding.",
  keyboard: "A set of keys used for typing or making music.",
  "mouse pad": "A flat surface used under a computer mouse.",
  printer: "A machine that puts words or pictures on paper.",
  "remote control": "A small device used to control a machine from a distance.",
  hello: "A greeting used when meeting or starting to talk.",
  goodbye: "A polite word said when leaving.",
  please: "A polite word used when asking.",
  "thank you": "A polite phrase used to show thanks.",
  yes: "Used to agree or answer positively.",
  no: "Used to refuse or answer negatively.",
  run: "To move quickly on foot.",
  walk: "To move on foot at a steady pace.",
  eat: "To take food into the mouth and swallow it.",
  drink: "To take liquid into the mouth and swallow it.",
  read: "To look at written words and understand them.",
  write: "To make letters, words, or numbers on paper or a screen.",
  red: "The color of apples, fire trucks, or strawberries.",
  blue: "The color of the sky on a clear day.",
  green: "The color of grass and many leaves.",
  small: "Little in size or amount.",
  speak: "To say words aloud.",
  tell: "To give information using words.",
  share: "To let someone else use or have part of something.",
  respond: "To answer or react.",
  whisper: "To speak very softly.",
  echo: "A sound that bounces back and is heard again.",
  sound: "Something heard with the ears.",
  listen: "To pay attention to sound.",
  repeat: "To do or say something again.",
  story: "A telling of events, real or imagined.",
  title: "The name of a book, story, song, or work.",
  sentence: "A group of words that tells a complete idea.",
  detail: "A small piece of information.",
  describe: "To tell what something is like.",
  explain: "To make an idea clear.",
  identify: "To recognize and name someone or something.",
  christmas: "A holiday celebrated by many people in December.",
  egg: "A round or oval object laid by birds and some other animals.",
  eye: "The body part used for seeing.",
  floor: "The lower surface of a room that people walk on.",
  game: "An activity with rules played for fun or practice.",
  kitty: "A young cat or a friendly name for a cat.",
  "santa claus": "A Christmas figure said to bring gifts.",
  shoe: "A covering worn on the foot for protection.",
  stick: "A thin piece of wood from a tree.",
  toy: "An object used for play.",
};

const READING_EXTRA_DEFINITIONS: Record<string, string> = {
  began: "Started before now.",
  begin: "To start.",
  coast: "Land beside the sea.",
  dont: "Used to mean do not.",
  from: "Shows the starting place, source, or origin.",
  got: "Received or became before now.",
  heard: "Noticed a sound before now.",
  her: "Refers to a girl or woman, or shows belonging to her.",
  is: "Used with one person or thing to tell what is true now.",
  it: "Refers to one thing, animal, or idea already mentioned.",
  its: "Shows that something belongs to a thing or animal.",
  off: "Away from a surface, place, or working state.",
  oh: "Used to show surprise, feeling, or understanding.",
  or: "Used to show a choice between ideas.",
  own: "Belonging to oneself.",
  should: "Shows the best, right, or expected action.",
  so: "For that reason, or very much.",
  squirrel: "A small tree-climbing mammal with a bushy tail.",
  thank: "To show gratitude or polite appreciation.",
  then: "After that or at that time.",
  thus: "In this way, or for that reason.",
  too: "Also, or more than needed.",
  took: "Picked up, carried, or received before now.",
  to: "Shows direction, purpose, or receiver.",
  us: "The speaker and others as receivers of an action.",
  use: "To put something to work for a purpose.",
  was: "Shows what one person or thing was like in the past.",
  went: "Moved or traveled before now.",
  white: "The lightest color, like snow or milk.",
  whose: "Asks who something belongs to.",
  yellow: "The color of lemons, sunlight, or bananas.",
  yet: "Up to now, still, or however.",
};

const ANIMAL_DEFINITIONS: Record<string, string> = {
  alligator: "A large reptile with strong jaws, a long tail, and rough scales.",
  alpaca: "A woolly farm animal with a long neck and soft fleece.",
  ant: "A tiny insect that lives in groups and often carries food.",
  bat: "A flying mammal with wings made of skin.",
  bear: "A large furry mammal with strong legs and claws.",
  beaver: "A water-loving mammal with large front teeth and a flat tail.",
  bee: "A flying insect that can make honey and help flowers grow.",
  beetle: "An insect with a hard outer wing cover.",
  bird: "A feathered animal with wings, a beak, and eggs.",
  bluebird: "A small blue feathered animal that often sings.",
  buffalo: "A large hoofed mammal with horns and a heavy body.",
  butterfly: "An insect with colorful wings that changes from a caterpillar.",
  camel: "A desert mammal with humps that store fat.",
  canary: "A small yellow songbird often kept as a pet.",
  cat: "A small furry pet with whiskers, paws, and a swishy tail.",
  caterpillar: "A soft crawling insect larva that can become a butterfly or moth.",
  chameleon: "A lizard that can change color and move each eye separately.",
  cheetah: "A spotted wild cat known for running very fast.",
  chicken: "A farm bird with feathers that can cluck and lay eggs.",
  chimpanzee: "A smart ape with long arms and no tail.",
  clam: "A sea animal with a soft body inside two hard shells.",
  "coral fish": "A colorful sea animal with fins that lives near reefs.",
  cow: "A farm mammal that gives milk and makes a mooing sound.",
  crab: "A water animal with a hard shell, claws, and sideways walking legs.",
  crocodile: "A large reptile with a long snout, sharp teeth, and a strong tail.",
  crow: "A black feathered animal known for a loud caw.",
  deer: "A gentle hoofed mammal; many males grow antlers.",
  dog: "A friendly pet mammal with paws, a strong nose, and a wagging tail.",
  dolphin: "A smart sea mammal that breathes air and swims with flippers.",
  donkey: "A hoofed farm animal with long ears and a braying sound.",
  dragonfly: "A flying insect with long wings and a thin body.",
  duck: "A water bird with webbed feet and a broad bill.",
  eagle: "A large bird of prey with sharp eyes, talons, and a hooked beak.",
  eel: "A long snake-shaped sea or river animal with fins.",
  elephant: "A huge mammal with a trunk, tusks, and large ears.",
  emu: "A tall flightless bird with long legs.",
  falcon: "A fast bird of prey with pointed wings.",
  fish: "A water animal that breathes through gills and usually has fins.",
  flamingo: "A tall pink bird with long legs and a curved neck.",
  fox: "A wild canine with a pointed face and bushy tail.",
  frog: "A small amphibian that jumps, croaks, and lives near water.",
  gecko: "A small lizard that can climb walls and ceilings.",
  giraffe: "A very tall mammal with a long neck and spotted coat.",
  goat: "A farm mammal with horns that can climb well.",
  goose: "A large water bird with a long neck and honking sound.",
  gorilla: "A large strong ape with long arms and no tail.",
  grasshopper: "A jumping insect with strong back legs.",
  "guinea pig": "A small furry pet with a round body and short legs.",
  hamster: "A small furry pet that stores food in cheek pouches.",
  hawk: "A bird of prey with sharp claws and strong eyesight.",
  hedgehog: "A small mammal covered with short sharp spines.",
  hen: "A female chicken that can lay eggs.",
  hippo: "A huge river mammal with a wide mouth and short legs.",
  horse: "A large hoofed mammal people can ride or use for work.",
  hummingbird: "A tiny bird that hovers and drinks flower nectar.",
  hyena: "A wild mammal with strong jaws and a laughing call.",
  iguana: "A large lizard with scales and a row of spines on its back.",
  jaguar: "A spotted wild cat with a powerful body.",
  jellyfish: "A soft sea animal with a bell-shaped body and stinging tentacles.",
  kangaroo: "A hopping mammal with strong back legs and a pouch.",
  kingfisher: "A bright bird that dives to catch small water animals.",
  kitten: "A young cat.",
  koala: "A tree-climbing mammal with round ears that eats eucalyptus leaves.",
  ladybug: "A small round beetle often red with black spots.",
  leopard: "A spotted wild cat that climbs well.",
  lion: "A large wild cat; males often have a mane.",
  lizard: "A reptile with scales, legs, and a long tail.",
  llama: "A woolly hoofed mammal with a long neck.",
  lobster: "A sea animal with a hard shell, claws, and a long body.",
  monkey: "A playful mammal with hands, long arms, and often a tail.",
  moose: "A very large deer with broad antlers.",
  moth: "A winged insect often active at night.",
  mule: "A strong hoofed animal born from a horse and a donkey.",
  octopus: "A sea animal with eight arms and a soft body.",
  orangutan: "A reddish ape with long arms that lives mostly in trees.",
  ostrich: "A very large flightless bird that runs fast.",
  otter: "A playful water mammal with thick fur and webbed feet.",
  owl: "A night bird of prey with large eyes and a quiet flight.",
  ox: "A strong cattle animal often used for heavy work.",
  oyster: "A shellfish with a soft body inside a hard shell.",
  panda: "A black-and-white bear that mostly eats bamboo.",
  parrot: "A colorful bird that can copy sounds.",
  peacock: "A male bird with long colorful tail feathers.",
  pelican: "A large water bird with a big throat pouch.",
  penguin: "A flightless bird that swims well and lives in cold places.",
  pig: "A farm mammal with a snout and curly tail.",
  pigeon: "A common city bird with a plump body.",
  pufferfish: "A sea animal that can puff up when frightened.",
  puppy: "A young dog.",
  rabbit: "A small mammal with long ears and strong jumping legs.",
  raven: "A large black bird with a deep call.",
  reindeer: "A deer from cold places; both males and females can grow antlers.",
  rhino: "A large mammal with thick skin and one or two horns.",
  robin: "A small songbird often seen in gardens.",
  rooster: "A male chicken that can crow.",
  scorpion: "A small animal with claws and a curved stinging tail.",
  "sea lion": "A sea mammal with flippers that can bark and rest on shore.",
  "sea turtle": "A reptile with a shell that swims in the ocean.",
  seagull: "A coastal bird often seen near beaches and boats.",
  seahorse: "A tiny sea animal with a curled tail and horse-like head.",
  seal: "A sea mammal with flippers and a smooth body.",
  shark: "A large sea animal with sharp teeth and strong fins.",
  sheep: "A farm mammal with woolly fleece.",
  shrimp: "A small sea animal with a curved body and many legs.",
  sloth: "A slow tree-dwelling mammal with long claws.",
  slug: "A soft slow animal like a snail without a shell.",
  snail: "A slow soft animal that carries a spiral shell.",
  snake: "A long legless reptile that moves by sliding.",
  sparrow: "A small brownish bird often seen near homes.",
  spider: "A small animal with eight legs that can spin webs.",
  squid: "A sea animal with a soft body, arms, and two long tentacles.",
  starfish: "A sea animal shaped like a star with arms.",
  stingray: "A flat sea animal with wide fins and a long tail.",
  stork: "A tall long-legged bird with a long beak.",
  swan: "A large graceful water bird with a long neck.",
  tiger: "A large striped wild cat.",
  toad: "A warty amphibian that lives mostly on land.",
  toucan: "A tropical bird with a very large colorful beak.",
  turkey: "A large farm bird with a fan-shaped tail.",
  turtle: "A reptile with a hard shell around its body.",
  walrus: "A large sea mammal with tusks and whiskers.",
  whale: "A huge sea mammal that breathes air.",
  wolf: "A wild canine that often lives and hunts in packs.",
  woodpecker: "A bird that taps tree bark with its strong beak to find food.",
  worm: "A soft long animal with no legs that moves through soil.",
  yak: "A shaggy hoofed mammal from cold mountain areas.",
  zebra: "A horse-like mammal with black and white stripes.",
};

const PLANT_DEFINITIONS: Record<string, string> = {
  acorn: "A small nut with a cap that can grow into an oak tree.",
  aloe: "A thick-leaved plant with gel inside its leaves.",
  apple: "A round fruit with thin skin, crisp flesh, and small seeds.",
  avocado: "A green fruit with creamy flesh and one large seed.",
  bamboo: "A tall fast-growing plant with hard hollow stems.",
  banana: "A long yellow fruit with a soft sweet inside.",
  barley: "A grain plant used for food and drinks.",
  basil: "A leafy herb used to add flavor to food.",
  beet: "A root vegetable often red or purple.",
  blackberry: "A small dark berry made of many tiny juicy parts.",
  blueberry: "A small round blue berry with sweet juice.",
  bread: "A food made from baked dough.",
  broccoli: "A green vegetable with a thick stalk and small flower buds.",
  cabbage: "A leafy vegetable with tightly packed leaves.",
  cake: "A sweet baked food often eaten for celebrations.",
  cantaloupe: "A round orange melon with sweet juicy flesh.",
  carrot: "An orange root vegetable that grows underground.",
  cauliflower: "A pale vegetable with a thick stem and clustered flower buds.",
  cedar: "A tall evergreen tree with fragrant wood.",
  cherry: "A small round fruit with a pit inside.",
  cilantro: "A leafy herb used to flavor food.",
  clover: "A small plant often with three round leaves.",
  coconut: "A large tropical fruit with a hard shell and white flesh.",
  cornstalk: "The tall stem of a corn plant.",
  cotton: "A soft plant fiber used to make cloth.",
  cucumber: "A long green vegetable with watery flesh.",
  daisy: "A small flower with white petals and a yellow center.",
  dandelion: "A yellow wildflower that can turn into a fluffy seed head.",
  "dragon fruit": "A tropical fruit with bright skin and speckled flesh.",
  eggplant: "A purple vegetable with soft flesh.",
  fig: "A soft sweet fruit with many tiny seeds.",
  flower: "The blooming part of a plant, often with petals and color.",
  fruit: "The seed-carrying part of a plant that is often sweet to eat.",
  garlic: "A strong-smelling bulb used to flavor food.",
  grape: "A small round fruit that grows in bunches.",
  greenhouse: "A glass or plastic building where plants are grown.",
  guava: "A tropical fruit with sweet flesh and small seeds.",
  hibiscus: "A plant with large bright flowers.",
  jackfruit: "A very large tropical fruit with sweet yellow pieces inside.",
  jasmine: "A plant with small fragrant flowers.",
  kelp: "A large brown seaweed that grows in ocean water.",
  kiwi: "A small brown fruit with green flesh and tiny black seeds.",
  lavender: "A plant with purple flowers and a calming scent.",
  leaf: "A flat plant part that catches sunlight.",
  lemon: "A yellow sour fruit with juicy flesh.",
  lettuce: "A leafy vegetable often used in salads.",
  lily: "A flowering plant with large petals.",
  lime: "A small green sour fruit.",
  mango: "A sweet tropical fruit with orange flesh and one large seed.",
  marigold: "A bright orange or yellow garden flower.",
  mint: "A leafy herb with a cool fresh taste.",
  mushroom: "A fungus with a cap and stem; some kinds are eaten.",
  okra: "A green pod vegetable with small seeds inside.",
  onion: "A layered bulb vegetable with a strong smell.",
  orange: "A round citrus fruit with juicy sections.",
  orchid: "A flowering plant with delicate colorful blooms.",
  papaya: "A tropical fruit with orange flesh and black seeds.",
  parsley: "A leafy herb often used to flavor or decorate food.",
  peach: "A soft juicy fruit with fuzzy skin and a pit.",
  pear: "A sweet fruit with thin skin and a rounded bottom.",
  pepper: "A vegetable or spice that can taste sweet or hot.",
  petal: "One colorful leaf-like part of a flower.",
  pinecone: "A woody seed holder from a pine tree.",
  pineapple: "A tropical fruit with spiky skin and sweet yellow flesh.",
  planter: "A container used for growing plants.",
  plum: "A small juicy fruit with smooth skin and a pit.",
  potato: "A starchy vegetable that grows underground.",
  pumpkin: "A large orange squash with seeds inside.",
  radish: "A small crisp root vegetable with a peppery taste.",
  raspberry: "A soft red berry made of many tiny juicy parts.",
  rosemary: "A fragrant herb with needle-like leaves.",
  sage: "A gray-green herb used to flavor food.",
  seedling: "A young plant that has just started to grow.",
  spinach: "A leafy green vegetable.",
  sprout: "A new plant shoot beginning to grow.",
  strawberry: "A red sweet fruit with tiny seeds on the outside.",
  succulent: "A plant with thick parts that store water.",
  sugarcane: "A tall grass with sweet juice inside its stalk.",
  sunflower: "A tall plant with a large yellow flower head.",
  tomato: "A soft red fruit often used like a vegetable.",
  tree: "A tall plant with roots, a trunk, branches, and leaves.",
  turnip: "A round root vegetable with white or purple skin.",
  vegetable: "An edible plant part such as a leaf, stem, root, or pod.",
  vine: "A plant stem that climbs, trails, or wraps around things.",
  wheat: "A grain plant used to make flour.",
  zucchini: "A long green summer squash.",
};

const NATURE_DEFINITIONS: Record<string, string> = {
  beach: "A sandy or pebbly place beside water.",
  blizzard: "A strong snowstorm with wind.",
  breeze: "A light gentle wind.",
  canyon: "A deep valley with steep sides.",
  cloud: "A white or gray mass of tiny water drops in the sky.",
  cold: "Having a low temperature.",
  constellation: "A group of stars that forms a picture or pattern.",
  drizzle: "Light rain with very small drops.",
  eclipse: "A sky event when one object blocks the light from another.",
  field: "An open area of land, often with grass or crops.",
  fire: "Hot bright flames made by burning.",
  fog: "A thick cloud near the ground that makes seeing hard.",
  forest: "A large area filled with many trees.",
  ground: "The surface of the earth under our feet.",
  hill: "A raised area of land smaller than a mountain.",
  hot: "Having a high temperature.",
  island: "Land with water all around it.",
  jungle: "A thick tropical forest with many plants.",
  lake: "A large area of water surrounded by land.",
  light: "Brightness that lets eyes see.",
  lightning: "A bright flash of electricity in the sky.",
  meadow: "An open grassy area, often with wildflowers.",
  mist: "Tiny water drops in the air.",
  moon: "The round object that moves around Earth and shines at night.",
  mountain: "A very high raised part of land.",
  ocean: "A very large body of salt water.",
  pond: "A small body of still water.",
  rain: "Water drops that fall from clouds.",
  rainbow: "A curved band of colors seen when sunlight meets water drops.",
  river: "A long flowing body of water.",
  riverbank: "The land along the side of a river.",
  seashore: "Land beside the sea.",
  shadow: "A dark shape made when something blocks light.",
  shore: "Land along the edge of water.",
  sky: "The space above Earth that we see outdoors.",
  snow: "Soft white ice crystals that fall from clouds.",
  space: "The vast area beyond Earth and its air.",
  star: "A huge ball of hot gas that shines in the sky.",
  storm: "Severe weather with wind, rain, snow, thunder, or lightning.",
  stream: "A small flowing body of water.",
  sun: "The star that gives Earth light and warmth.",
  sunrise: "The time when the sun first appears in the morning.",
  sunset: "The time when the sun goes below the horizon in the evening.",
  temperature: "How hot or cold something is.",
  thunder: "The loud sound that can come after lightning.",
  tide: "The regular rise and fall of ocean water.",
  trail: "A path for walking through an outdoor place.",
  warm: "A little hot in a comfortable way.",
  water: "A clear liquid that living things need.",
  waterfall: "Water that falls from a high place.",
  wave: "A raised moving line of water.",
  weather: "The air conditions outside, such as sun, rain, wind, or snow.",
  wind: "Moving air.",
  wood: "Hard material from a tree.",
};

const PLANT_EXTRA_DEFINITIONS: Record<string, string> = {
  watermelon: "A large green melon with sweet red flesh and black seeds.",
  corn: "A tall plant that grows ears filled with yellow kernels.",
  "sweet potato": "A sweet orange root vegetable.",
  pea: "A small round green seed eaten as a vegetable.",
  "green bean": "A long green pod eaten as a vegetable.",
  "bell pepper": "A crisp hollow vegetable that can be green, red, yellow, or orange.",
  "chili pepper": "A small hot pepper used to add spicy flavor.",
  squash: "A vegetable from a plant with soft flesh and seeds.",
  seed: "A small plant part that can grow into a new plant.",
  root: "The plant part that grows underground and takes in water.",
  branch: "A woody part that grows out from a tree trunk.",
  stem: "The plant part that holds up leaves, flowers, or fruit.",
  trunk: "The thick main stem of a tree.",
  bark: "The outer covering of a tree trunk or branch.",
  thorn: "A sharp point that grows on some plants.",
  bud: "A small plant part that can open into a leaf or flower.",
  moss: "A small soft green plant that often grows in damp places.",
  fern: "A green plant with feathery leaves and no flowers.",
  soil: "The top layer of earth where plants can grow.",
  garden: "A place where flowers, fruits, or vegetables are grown.",
  farm: "A place where crops are grown or animals are raised.",
  orchard: "A place where fruit trees are grown.",
  pot: "A container used for growing plants or cooking food.",
  "watering can": "A container with a spout used to pour water on plants.",
  rose: "A flowering plant often known for soft petals and thorns.",
  tulip: "A spring flower with a cup-shaped bloom.",
  thyme: "A small leafy herb used to flavor food.",
  cactus: "A plant with thick water-storing parts and often spines.",
  palm: "A tropical tree with a tall trunk and large leaves.",
  lotus: "A water plant with large floating leaves and flowers.",
  bush: "A low woody plant with many branches.",
  grass: "A short green plant that often covers lawns and fields.",
  rice: "A grain used as food in many meals.",
  oat: "A grain often used for cereal or porridge.",
  "coconut tree": "A tall tropical tree that grows large hard fruits.",
  "pine tree": "An evergreen tree with needles and cones.",
  "mango tree": "A tropical tree that grows sweet orange-fleshed fruit.",
  "apple tree": "A tree that grows round crisp fruit.",
  "banana plant": "A tall tropical plant that grows long yellow fruit.",
  "maple tree": "A tree with broad leaves and sap that can make syrup.",
  "oak tree": "A strong tree that grows acorns.",
  "birch tree": "A tree often known for pale peeling bark.",
  "cedar tree": "An evergreen tree with fragrant wood.",
  seaweed: "A plant-like organism that grows in the sea.",
  "bamboo shoot": "A young edible stem from a bamboo plant.",
  "corn cob": "The center part of an ear of corn that holds kernels.",
};

const NATURE_EXTRA_DEFINITIONS: Record<string, string> = {
  ice: "Frozen water.",
  day: "The time when there is light from the sun.",
  night: "The dark time between evening and morning.",
  dawn: "The first light before sunrise.",
  dusk: "The dim time just after sunset.",
  hail: "Small balls of ice that fall from clouds.",
  tornado: "A violent spinning column of air.",
  sea: "A large body of salt water.",
  rock: "A hard natural piece of earth material.",
  sand: "Tiny grains of rock often found on beaches or deserts.",
  shell: "A hard outer covering from some animals or seeds.",
  cave: "A large natural opening in rock or underground.",
  valley: "Low land between hills or mountains.",
  cliff: "A high steep side of rock or land.",
  volcano: "A mountain or opening where melted rock can come out.",
  desert: "A very dry place with little rain.",
  glacier: "A huge slow-moving mass of ice.",
  marsh: "Wet soft land with grasses.",
  swamp: "Wet land with trees or bushes.",
  lagoon: "A shallow body of water near a larger sea or lake.",
  reef: "A ridge under the sea, often made by coral or rock.",
  spring: "The season when many plants begin to grow.",
  summer: "The warm season after spring.",
  winter: "The cold season after autumn.",
  warmth: "A comfortable amount of heat.",
  coolness: "A slightly cold feeling.",
  heat: "High temperature or warmth.",
  frost: "Thin ice crystals that form on cold surfaces.",
  dew: "Tiny water drops that form on cool surfaces.",
  mud: "Wet soft earth.",
  stone: "A small hard piece of rock.",
  pebble: "A small smooth stone.",
  crystal: "A solid with a clear repeating shape.",
  clay: "Sticky fine earth used for making pots or bricks.",
  steam: "Hot water vapor.",
  smoke: "Gray or black gas from burning.",
  ash: "Powder left after something burns.",
  puddle: "A small pool of water on the ground.",
  icicle: "A hanging spike of ice.",
  raindrop: "One drop of rain.",
  snowflake: "One tiny ice crystal that falls as snow.",
  sunbeam: "A ray of sunlight.",
  shade: "A darker cool area blocked from direct sunlight.",
  boulder: "A very large rock.",
  planet: "A large round object that moves around a star.",
  saturn: "A large planet known for its rings.",
  comet: "An icy space object that can grow a bright tail near the sun.",
  meteor: "A space rock that burns brightly in the sky.",
  rocket: "A vehicle that can travel into the sky or space.",
  orbit: "The path one object follows around another in space.",
  horizon: "The line where the sky seems to meet the land or water.",
  starlight: "Light that comes from stars.",
  moonlight: "Light from the moon.",
  sunlight: "Light from the sun.",
  glow: "A soft steady light.",
  flash: "A quick bright light.",
  rumble: "A low rolling sound.",
  splash: "The sound or movement made when liquid is hit.",
  rustle: "A soft sound like leaves moving.",
  "whispering wind": "A soft wind sound.",
  twinkle: "A small quick shine that seems to blink.",
  reflection: "An image or light that bounces back from a surface.",
  moonbeam: "A ray of moonlight.",
  skylight: "Light from the sky, or a window in a roof.",
  "garden path": "A walkway through a garden.",
  campsite: "A place where people stay outdoors.",
  treetop: "The highest branches and leaves of a tree.",
  rainforest: "A warm wet forest with many plants and animals.",
  woodland: "Land covered with trees.",
  prairie: "A wide grassy land area.",
  nest: "A home built by a bird or small animal.",
  feather: "A light covering that grows on birds.",
  driftwood: "Wood carried by water and left on shore.",
  "pine needle": "A thin leaf from a pine tree.",
  wildflower: "A flower that grows without being planted by people.",
  thundercloud: "A dark cloud that can bring thunder and storms.",
  moonrise: "The time when the moon appears above the horizon.",
  "leaf fall": "The dropping of leaves from trees.",
  birdsong: "The musical sound made by birds.",
  tidepool: "A small pool of seawater left near rocks by the tide.",
  "creek bed": "The ground at the bottom of a small stream.",
};

const NUMERIC_DEFINITIONS: Record<string, string> = {
  zero: "The number for none.",
  one: "The number for a single item.",
  two: "The number for one and one more.",
  three: "The number for one more than two.",
  four: "The number for one more than three.",
  five: "The number for one more than four.",
  six: "The number for one more than five.",
  seven: "The number for one more than six.",
  eight: "The number for one more than seven.",
  nine: "The number for one more than eight.",
  ten: "The number for one more than nine.",
  eleven: "The number for ten and one more.",
  twelve: "The number for ten and two more.",
  thirteen: "The number for ten and three more.",
  fourteen: "The number for ten and four more.",
  fifteen: "The number for ten and five more.",
  sixteen: "The number for ten and six more.",
  seventeen: "The number for ten and seven more.",
  eighteen: "The number for ten and eight more.",
  nineteen: "The number for ten and nine more.",
  twenty: "The number for two tens.",
  thirty: "The number for three tens.",
  forty: "The number for four tens.",
  fifty: "The number for five tens.",
  sixty: "The number for six tens.",
  seventy: "The number for seven tens.",
  eighty: "The number for eight tens.",
  ninety: "The number for nine tens.",
  first: "Number one in order.",
  second: "Number two in order.",
  third: "Number three in order.",
  fourth: "Number four in order.",
  last: "At the end of a line, list, or event.",
  middle: "The part between the beginning and the end.",
  "how many": "A question asking for the amount.",
  next: "Coming right after the current one.",
  each: "Every one in a group, counted one by one.",
  many: "A large number of people or things.",
  few: "A small number of people or things.",
  "one more": "One added to the amount.",
  "one less": "One taken away from the amount.",
  match: "To pair things that are the same or belong together.",
  count: "To say numbers in order to find how many.",
  recount: "To count again to check the amount.",
  "dice dots": "Dots on dice used to show a number.",
  "domino dots": "Dots on dominoes used to show amounts.",
  "bundle of ten": "A group of ten ones tied or shown together.",
  "ones place": "The position that shows single units in a number.",
  "tens place": "The position that shows groups of ten in a number.",
  collect: "To bring items together into one group.",
  sort: "To put things into groups by how they are alike.",
  "just enough": "Exactly the amount needed.",
  "not enough": "Less than the amount needed.",
  "too many": "More than the amount needed.",
  "too few": "Less than the amount wanted.",
  numeral: "A written symbol that shows a number.",
  digit: "One symbol used to write a number.",
  "number line": "A straight path marked with numbers in order.",
  "five frame": "A box with five spaces used for counting.",
  "ten frame": "A box with ten spaces used for counting.",
  tally: "A mark used to keep count.",
  "dot card": "A card with dots used for quick counting.",
  counter: "A small object used to count or model math.",
  "bead string": "A string of beads used for counting.",
  "counting jar": "A container holding objects to count.",
  "number card": "A card that shows a number.",
  "number path": "A row of numbers used for counting steps.",
  "place value": "The value a digit has because of its position.",
  ones: "Single units in a number.",
  tens: "Groups of ten in a number.",
  row: "A line of things going side to side.",
  column: "A line of things going up and down.",
  stack: "A pile of things placed one on top of another.",
  array: "Objects arranged in equal rows and columns.",
  estimate: "A careful guess about an amount.",
  subitize: "To know a small amount quickly without counting one by one.",
  circle: "A flat round shape with no corners.",
  square: "A flat shape with four equal sides and four corners.",
  triangle: "A flat shape with three sides and three corners.",
  rectangle: "A flat shape with four sides and four square corners.",
  oval: "A stretched round shape with no corners.",
  heart: "A shape with two rounded top parts and a point at the bottom.",
  diamond: "A four-sided shape that looks like a tilted square.",
  hexagon: "A flat shape with six sides.",
  pentagon: "A flat shape with five sides.",
  octagon: "A flat shape with eight sides.",
  semicircle: "Half of a circle.",
  crescent: "A curved moon-like shape.",
  rhombus: "A four-sided shape with all sides equal.",
  trapezoid: "A four-sided shape with one pair of parallel sides.",
  parallelogram: "A four-sided shape with opposite sides parallel.",
  cube: "A solid shape with six equal square faces.",
  sphere: "A solid round shape like a ball.",
  cone: "A solid shape with a round base and one point.",
  cylinder: "A solid shape with two round bases and one curved side.",
  pyramid: "A solid shape with a base and triangle sides that meet at a point.",
  prism: "A solid shape with two matching bases joined by side faces.",
  hemisphere: "Half of a sphere.",
  cuboid: "A box-shaped solid with rectangular faces.",
  torus: "A doughnut-shaped solid with a hole in the middle.",
  corner: "A place where two sides or edges meet.",
  side: "One line that forms part of a flat shape.",
  edge: "A line where two faces of a solid meet.",
  vertex: "A point where sides or edges meet.",
  face: "A flat surface on a solid shape.",
  curve: "A line that bends smoothly.",
  angle: "The space made where two lines or sides meet.",
  border: "The outside edge around something.",
  outline: "A line that shows the outside shape.",
  pattern: "A design or sequence that repeats.",
  symmetry: "Matching parts on both sides of a line.",
  tessellation: "A pattern of shapes that fit together with no gaps.",
  add: "To join numbers or groups to find how many there are in all.",
  plus: "A math word that tells us to add.",
  "plus sign": "The symbol that shows addition.",
  sum: "The answer found after adding.",
  total: "The complete amount after counting or adding.",
  combine: "To put groups together.",
  join: "To bring groups together into one group.",
  subtract: "To take some away from a group.",
  subtraction: "A math operation for taking away or finding the difference.",
  minus: "A math word that tells us to subtract.",
  "minus sign": "The symbol that shows subtraction.",
  difference: "The amount between two numbers.",
  equals: "Shows that two sides have the same value.",
  "equal sign": "The symbol that shows two sides are equal.",
  "number sentence": "A math statement with numbers and signs.",
  "math fact": "A number statement that is known to be true.",
  part: "One piece of a whole.",
  whole: "All of something together.",
  "number bond": "A picture that shows how parts make a whole.",
  compose: "To make a larger number or shape from parts.",
  decompose: "To break a number or shape into parts.",
  more: "A greater amount.",
  less: "A smaller amount.",
  fewer: "Not as many.",
  greater: "Larger in amount or value.",
  smaller: "Less in size or amount.",
  most: "The greatest amount.",
  least: "The smallest amount.",
  same: "Not different.",
  different: "Not the same.",
  long: "Great in length.",
  short: "Small in length, height, or time.",
  tall: "High from bottom to top.",
  wide: "Large from side to side.",
  narrow: "Small from side to side.",
  heavy: "Weighing a lot.",
  half: "One of two equal parts.",
  capacity: "How much a container can hold.",
  weight: "How heavy something is.",
  length: "How long something is.",
  height: "How tall something is.",
  width: "How wide something is.",
  depth: "How deep something is.",
  measure: "To find the size, amount, or distance.",
  measurement: "The size or amount found by measuring.",
  beside: "Next to something.",
  left: "The side of the body where the heart is usually found.",
  right: "The opposite side from left, or correct.",
  top: "The highest part.",
  bottom: "The lowest part.",
  near: "Close by.",
  far: "A long distance away.",
  over: "Above or across something.",
  under: "Below something.",
  through: "From one side or end to the other inside something.",
  earlier: "Before another time.",
  later: "After another time.",
  soon: "In a short time.",
  yesterday: "The day before today.",
  today: "This day.",
  tomorrow: "The day after today.",
  time: "When something happens or how long it lasts.",
  quick: "Fast or taking little time.",
  slow: "Not fast.",
  data: "Information collected to answer a question.",
};

function normalizeWord(word: string) {
  return word.trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeForCopyCheck(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsOwnWord(copy: string, word: string) {
  const normalizedWord = normalizeForCopyCheck(word);
  const allowedSelfReferenceWords = new Set([
    "an",
    "her",
    "is",
    "out",
    "there",
    "was",
    "with",
  ]);

  if (normalizedWord.length <= 1 || allowedSelfReferenceWords.has(normalizedWord)) {
    return false;
  }

  return new RegExp(`\\b${normalizedWord.replace(/\s+/g, "\\s+")}\\b`, "u").test(
    normalizeForCopyCheck(copy)
  );
}

function isGenericDefinition(definition: string) {
  return GENERIC_DEFINITION_PATTERNS.some((pattern) => pattern.test(definition));
}

function isUnsafeOrOffTopicCopy(copy: string) {
  return UNSAFE_OR_OFF_TOPIC_COPY_PATTERNS.some((pattern) => pattern.test(copy));
}

function indefiniteArticle(word: string) {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

function readableWord(word: string) {
  return normalizeWord(word);
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function fallbackDefinition(subcategory: VocabularySubcategory) {
  switch (subcategory) {
    case "animals":
      return "A creature learners can identify by body, sound, movement, and habitat.";
    case "plants":
      return "A plant, food, or growing part learners can identify by look or use.";
    case "things":
      return "A person, place, object, action, or daily idea used in life.";
    case "nature":
      return "A sky, weather, land, water, or world idea learners can observe.";
    case "counting":
      return "A counting term that tells amount, order, grouping, or number form.";
    case "shapes":
      return "A geometry term for form, line, side, corner, surface, or pattern.";
    case "adding":
      return "A math operation term for joining, separating, or solving a number story.";
    case "comparing":
      return "A comparison term for size, amount, position, time, or measure.";
    case "reading":
      return "A reading term used to build clear sentences and ideas.";
    default:
      return "A learning term with a clear use in speaking, reading, or math.";
  }
}

function buildCompoundNumericDefinition(word: string, subcategory: VocabularySubcategory) {
  const lowerWord = normalizeWord(word);
  const numberWord = lowerWord.match(/\b(one|two|three|four|five|six|seven|eight|nine|ten|twenty)\b/)?.[1];

  if (lowerWord.includes("take away")) {
    return "To remove part of a group and see what remains.";
  }

  if (lowerWord.includes("in all") || lowerWord.includes("how many now")) {
    return "The complete amount after groups are joined or counted.";
  }

  if (
    lowerWord.includes("put together") ||
    lowerWord.includes("bring together") ||
    lowerWord.includes("pack together") ||
    lowerWord.includes("stack together") ||
    lowerWord.includes("collect together") ||
    lowerWord.includes("mix together")
  ) {
    return "To join separate groups into one group.";
  }

  if (lowerWord.includes("add") || lowerWord.includes("plus")) {
    return numberWord
      ? `To increase an amount by ${numberWord}.`
      : "To increase an amount by joining more.";
  }

  if (lowerWord.includes("more")) {
    return numberWord
      ? `An amount that is ${numberWord} greater than before.`
      : "An extra amount added to what is already there.";
  }

  if (lowerWord.includes("sum")) {
    return "The answer found after numbers are added.";
  }

  if (lowerWord.includes("total")) {
    return "The full amount after counting or adding everything.";
  }

  if (lowerWord.includes("addend")) {
    return "A number used as one part in an addition problem.";
  }

  if (lowerWord.includes("equation")) {
    return "A math sentence with numbers and signs.";
  }

  if (lowerWord.includes("answer") || lowerWord.includes("result")) {
    return "The value found after solving a math problem.";
  }

  if (lowerWord.includes("partner") || lowerWord.includes("pair")) {
    return "Two numbers that work together in a math fact.";
  }

  if (lowerWord.includes("double") || lowerWord.includes("twin")) {
    return "Two equal parts or amounts put together.";
  }

  if (lowerWord.includes("ten frame")) {
    return "A box with ten spaces used to show and add numbers.";
  }

  if (lowerWord.includes("fingers")) {
    return "A counting strategy that uses hands to show amounts.";
  }

  if (lowerWord.includes("order")) {
    return "A sequence that shows what comes first, next, and last.";
  }

  if (lowerWord.includes("grow by") || lowerWord.includes("increase by")) {
    return "To make an amount larger by adding more.";
  }

  if (lowerWord.includes("part") && lowerWord.includes("whole")) {
    return "A way to show how smaller parts make one complete amount.";
  }

  if (lowerWord.includes("equal to")) {
    return "Having the same value as another amount.";
  }

  if (lowerWord === "makes") {
    return "Shows the answer or result of joining parts.";
  }

  if (lowerWord.includes("fact family")) {
    return "Related number facts that use the same numbers.";
  }

  if (lowerWord.includes("turn-around")) {
    return "An addition fact with addends switched around.";
  }

  if (lowerWord.includes("ones and tens")) {
    return "Single units and groups of ten used to build numbers.";
  }

  if (lowerWord.includes("put with")) {
    return "To place one group together with another group.";
  }

  if (lowerWord.includes("count up") || lowerWord.includes("count ahead")) {
    return "To count forward from a starting number.";
  }

  if (lowerWord.includes("make ten")) {
    return "To build a group of ten to help add.";
  }

  if (lowerWord.includes("make a ten")) {
    return "To build a group of ten to help add.";
  }

  if (lowerWord.includes("put in") || lowerWord.includes("gather the")) {
    return "To place or collect objects into one group.";
  }

  if (lowerWord.includes("count every")) {
    return "To check each object so none are missed.";
  }

  if (lowerWord.includes("break") || lowerWord.includes("split")) {
    return "To take a number or group apart into smaller parts.";
  }

  if (lowerWord.includes("bridge")) {
    return "A strategy that uses ten to make adding easier.";
  }

  if (lowerWord.includes("check")) {
    return "To look again and make sure a math answer is correct.";
  }

  if (lowerWord.includes("show your work")) {
    return "To write or draw the steps used to solve a problem.";
  }

  if (lowerWord.includes("circle")) {
    return "To draw a round mark around the answer or amount.";
  }

  if (lowerWord.includes("share")) {
    return "To divide objects fairly into groups or places.";
  }

  if (lowerWord.includes("fill")) {
    return "To place enough objects inside a space or container.";
  }

  if (lowerWord.startsWith("count by ")) {
    return `To count forward using equal jumps of ${lowerWord.replace("count by ", "")}.`;
  }

  if (lowerWord.endsWith(" count")) {
    return "A way to find how many by checking objects carefully.";
  }

  if (lowerWord.startsWith("count ")) {
    return "To say numbers in order while checking objects, sounds, or steps.";
  }

  if (lowerWord.includes("counting")) {
    return "The act of saying numbers in order to find an amount.";
  }

  if (lowerWord.startsWith("match ")) {
    return "To pair items that show the same amount, value, or idea.";
  }

  if (lowerWord.includes("number")) {
    return "A math item connected to amount, order, or written symbols.";
  }

  if (lowerWord.includes("group") || lowerWord.includes("set")) {
    return "Objects placed together so they can be counted or compared.";
  }

  if (lowerWord.includes("ring")) {
    return "A round outline or band shape with a space inside.";
  }

  if (lowerWord.includes("frame")) {
    return "An outside border that holds or surrounds a shape.";
  }

  if (lowerWord.includes("tile")) {
    return "A flat shape piece that can fit with other pieces.";
  }

  if (lowerWord.includes("flag")) {
    return "A shape like a small flag used for visual practice.";
  }

  if (lowerWord.includes("prism")) {
    return "A solid with two matching bases and side faces.";
  }

  if (lowerWord.includes("base")) {
    return "The bottom part a shape or solid rests on.";
  }

  if (lowerWord.includes("block") || lowerWord.includes("cube")) {
    return "A solid piece with flat faces used for building or counting.";
  }

  if (lowerWord.includes("sphere")) {
    return "A solid round form like a ball.";
  }

  if (lowerWord.includes("round object")) {
    return "A thing with a curved outline or surface.";
  }

  if (lowerWord.includes("angle")) {
    return "The space where two lines or sides meet.";
  }

  if (lowerWord.includes("spiral")) {
    return "A curve that winds around from a center point.";
  }

  if (lowerWord.includes("zigzag")) {
    return "A line that turns sharply back and forth.";
  }

  if (lowerWord.includes("arch")) {
    return "A curved shape like the top of a doorway.";
  }

  if (lowerWord.includes("loop")) {
    return "A curved line that goes around and meets itself.";
  }

  if (lowerWord.includes("chevron")) {
    return "A V-shaped mark or pattern.";
  }

  if (lowerWord.includes("rotate")) {
    return "To turn around a center point.";
  }

  if (lowerWord.includes("line")) {
    return "A straight or curved mark used to show shape, direction, or order.";
  }

  if (lowerWord.includes("shape")) {
    return "A form or outline that can be seen, traced, or named.";
  }

  if (lowerWord.includes("side")) {
    return "One boundary line of a flat shape.";
  }

  if (lowerWord.includes("face")) {
    return "A flat surface on a solid shape.";
  }

  if (lowerWord.includes("edge")) {
    return "A line where two surfaces meet.";
  }

  if (lowerWord.includes("point") || lowerWord.includes("peak")) {
    return "A sharp or exact place on a shape.";
  }

  if (lowerWord.includes("top")) {
    return "The highest part of a shape or object.";
  }

  if (lowerWord.includes("sign")) {
    return "A written symbol that shows a math action or relation.";
  }

  if (lowerWord.includes("story")) {
    return "A short math situation that can be solved with numbers.";
  }

  if (lowerWord.includes("compare")) {
    return "To check how two amounts, sizes, or objects are alike or different.";
  }

  if (lowerWord.includes("than")) {
    return "Used to compare one amount, size, or measure with another.";
  }

  if (lowerWord.includes("few") || lowerWord.includes("fewer")) {
    return "A small number compared with another group.";
  }

  if (lowerWord.includes("amount")) {
    return "How many or how much there is in a group.";
  }

  if (lowerWord.includes("match")) {
    return "A pair or group that has the same value, size, or kind.";
  }

  if (lowerWord.includes("scale")) {
    return "A tool used to compare or measure weight.";
  }

  if (lowerWord.includes("spaces")) {
    return "Places between objects or positions.";
  }

  if (lowerWord.includes("position")) {
    return "The place where something is located.";
  }

  if (lowerWord.includes("upward")) {
    return "Moving or pointing toward a higher place.";
  }

  if (lowerWord.includes("downward")) {
    return "Moving or pointing toward a lower place.";
  }

  if (lowerWord.includes("evening")) {
    return "The later part of the day before night.";
  }

  if (lowerWord.includes("lunch")) {
    return "A time word connected to the meal in the middle of the day.";
  }

  if (lowerWord.includes("wait turn")) {
    return "A time to pause until it is one's chance.";
  }

  if (lowerWord.includes("guess")) {
    return "An estimate made before the exact answer is known.";
  }

  if (lowerWord.includes("measure")) {
    return "To find size, distance, amount, or weight.";
  }

  if (lowerWord.endsWith("er") || lowerWord.endsWith("est")) {
    return "A comparing word for size, amount, distance, speed, or time.";
  }

  if (lowerWord.includes("same")) {
    return "Matching in size, amount, kind, or speed.";
  }

  if (lowerWord.includes("different")) {
    return "Not matching in size, amount, kind, or speed.";
  }

  if (lowerWord.includes("full") || lowerWord.includes("empty")) {
    return "A word that tells how much space has something inside.";
  }

  if (lowerWord.includes("time")) {
    return "A word for when something starts, ends, or lasts.";
  }

  if (lowerWord.includes("votes") || lowerWord.includes("bar") || lowerWord.includes("category")) {
    return "A data word used when sorting or reading information.";
  }

  if (lowerWord.includes("pattern")) {
    return "A repeating design or sequence used for sorting and predicting.";
  }

  if (subcategory === "counting") {
    return "A counting term that tells amount, order, grouping, or number form.";
  }

  if (subcategory === "shapes") {
    return "A geometry term for form, line, side, corner, surface, or pattern.";
  }

  if (subcategory === "adding") {
    return "A math operation term for joining, separating, or solving a number story.";
  }

  return "A comparison term for size, amount, position, time, or measure.";
}

function buildDefinition(input: CopyInput) {
  const lowerWord = normalizeWord(input.word);

  return (
    EXACT_DEFINITIONS[lowerWord] ??
    OBJECT_DEFINITIONS[lowerWord] ??
    READING_EXTRA_DEFINITIONS[lowerWord] ??
    ANIMAL_DEFINITIONS[lowerWord] ??
    PLANT_DEFINITIONS[lowerWord] ??
    PLANT_EXTRA_DEFINITIONS[lowerWord] ??
    NATURE_DEFINITIONS[lowerWord] ??
    NATURE_EXTRA_DEFINITIONS[lowerWord] ??
    NUMERIC_DEFINITIONS[lowerWord] ??
    (input.category === "numeric"
      ? buildCompoundNumericDefinition(input.word, input.subcategory)
      : fallbackDefinition(input.subcategory))
  );
}

function shouldImprove(input: CopyInput) {
  return (
    isGenericDefinition(input.definition) ||
    containsOwnWord(input.definition, input.word) ||
    !!EXACT_DEFINITIONS[normalizeWord(input.word)] ||
    !!OBJECT_DEFINITIONS[normalizeWord(input.word)] ||
    !!READING_EXTRA_DEFINITIONS[normalizeWord(input.word)] ||
    !!ANIMAL_DEFINITIONS[normalizeWord(input.word)] ||
    !!PLANT_DEFINITIONS[normalizeWord(input.word)] ||
    !!PLANT_EXTRA_DEFINITIONS[normalizeWord(input.word)] ||
    !!NATURE_DEFINITIONS[normalizeWord(input.word)] ||
    !!NATURE_EXTRA_DEFINITIONS[normalizeWord(input.word)] ||
    !!NUMERIC_DEFINITIONS[normalizeWord(input.word)]
  );
}

const EXAMPLE_OVERRIDES: Record<string, string> = {
  about: "The story is about animals.",
  above: "The kite is above the tree.",
  across: "We walk across the bridge.",
  after: "We play after lunch.",
  again: "I try again.",
  all: "All the children clap.",
  an: "An apple starts with a vowel sound.",
  and: "I have a book and a pencil.",
  are: "The blocks are red.",
  because: "I smile because I am happy.",
  before: "I wash my hands before lunch.",
  between: "The ball is between two boxes.",
  can: "I can read.",
  did: "I did my work.",
  do: "I do my best.",
  does: "She does her work.",
  for: "This card is for you.",
  from: "The letter is from my friend.",
  had: "I had a snack.",
  has: "The dog has a bone.",
  have: "I have two crayons.",
  he: "He reads a book.",
  her: "I gave her a turn.",
  here: "The book is here.",
  him: "I helped him.",
  his: "That is his hat.",
  i: "I am ready.",
  if: "We go outside if it is sunny.",
  in: "The toy is in the box.",
  is: "The apple is red.",
  it: "I found it.",
  me: "Please help me.",
  my: "This is my bag.",
  of: "I read a page of the book.",
  on: "The cup is on the table.",
  our: "Our class sings.",
  out: "We go out to play.",
  said: "She said hello.",
  she: "She can write.",
  that: "I like that picture.",
  the: "The sun is bright.",
  their: "Their team won.",
  them: "I helped them.",
  there: "The ball is there.",
  these: "These blocks are blue.",
  they: "They are ready.",
  this: "This story is fun.",
  those: "Those shoes are clean.",
  to: "We go to school.",
  was: "The room was quiet.",
  we: "We read together.",
  were: "The children were kind.",
  what: "What is in the box?",
  when: "When does class start?",
  where: "Where is the pencil?",
  which: "Which cup is yours?",
  who: "Who is at the door?",
  why: "Why is the sky dark?",
  will: "I will try again.",
  with: "I read with a friend.",
  would: "I would like a turn.",
  you: "You can do it.",
  your: "Your pencil is sharp.",
  describe: "We describe the picture by naming color, shape, and action.",
  dog: "The dog wags its tail when a friend comes near.",
  window: "The garden is visible through the window.",
};

const FOOD_WORD_PARTS = [
  "apple",
  "avocado",
  "banana",
  "barley",
  "basil",
  "beet",
  "berry",
  "bread",
  "broccoli",
  "cabbage",
  "cake",
  "cantaloupe",
  "carrot",
  "cauliflower",
  "cherry",
  "cilantro",
  "coconut",
  "corn",
  "cucumber",
  "eggplant",
  "fig",
  "fruit",
  "garlic",
  "grape",
  "guava",
  "jackfruit",
  "kiwi",
  "lemon",
  "lettuce",
  "lime",
  "mango",
  "melon",
  "mint",
  "okra",
  "onion",
  "orange",
  "papaya",
  "parsley",
  "peach",
  "pear",
  "pepper",
  "pineapple",
  "plum",
  "potato",
  "pumpkin",
  "radish",
  "rice",
  "rosemary",
  "sage",
  "spinach",
  "squash",
  "strawberry",
  "sugarcane",
  "thyme",
  "tomato",
  "turnip",
  "vegetable",
  "watermelon",
  "wheat",
  "zucchini",
];

const NO_ARTICLE_WORDS = new Set([
  "pants",
  "sandals",
  "scissors",
  "shoes",
  "socks",
  "slippers",
  "headphones",
  "mittens",
  "children",
  "men",
  "people",
  "teeth",
  "women",
]);

const DESCRIBING_WORDS = new Set([
  "able",
  "afraid",
  "bad",
  "basic",
  "beautiful",
  "best",
  "better",
  "big",
  "black",
  "bright",
  "broad",
  "brown",
  "busy",
  "certain",
  "clean",
  "clear",
  "cold",
  "common",
  "complete",
  "correct",
  "dark",
  "dead",
  "dear",
  "deep",
  "different",
  "difficult",
  "direct",
  "distant",
  "dry",
  "early",
  "electric",
  "empty",
  "enough",
  "equal",
  "even",
  "fair",
  "famous",
  "far",
  "fast",
  "fat",
  "final",
  "fine",
  "flat",
  "free",
  "fresh",
  "full",
  "fun",
  "funny",
  "general",
  "gentle",
  "glad",
  "gold",
  "good",
  "grand",
  "gray",
  "great",
  "green",
  "happy",
  "hard",
  "heavy",
  "high",
  "hot",
  "huge",
  "human",
  "kind",
  "large",
  "late",
  "little",
  "long",
  "loud",
  "low",
  "modern",
  "natural",
  "necessary",
  "new",
  "old",
  "open",
  "opposite",
  "original",
  "particular",
  "plain",
  "poor",
  "possible",
  "pretty",
  "probable",
  "proper",
  "quick",
  "quiet",
  "real",
  "rich",
  "safe",
  "same",
  "separate",
  "several",
  "sharp",
  "short",
  "silent",
  "silver",
  "similar",
  "simple",
  "single",
  "small",
  "soft",
  "special",
  "straight",
  "strange",
  "strong",
  "sudden",
  "sure",
  "thick",
  "thin",
  "tiny",
  "true",
  "usual",
  "warm",
  "white",
  "wide",
  "wild",
  "wrong",
  "yellow",
  "young",
]);

const ABSTRACT_EXAMPLE_WORDS = new Set([
  "age",
  "anger",
  "beauty",
  "care",
  "cause",
  "chance",
  "condition",
  "danger",
  "death",
  "effect",
  "energy",
  "experience",
  "fact",
  "favor",
  "fear",
  "history",
  "hope",
  "idea",
  "interest",
  "joy",
  "language",
  "law",
  "life",
  "love",
  "method",
  "mind",
  "motion",
  "music",
  "nature",
  "noise",
  "power",
  "reason",
  "science",
  "skill",
  "solution",
  "success",
  "surprise",
  "system",
  "thought",
  "trouble",
  "value",
  "voice",
  "war",
  "work",
]);

const ACTION_EXAMPLE_SENTENCES: Record<string, string> = {
  agree: "I agree with my friend.",
  appear: "The stars appear at night.",
  arrive: "The bus can arrive soon.",
  be: "I can be kind.",
  become: "A seed can become a plant.",
  begin: "We begin the lesson.",
  believe: "I believe the story is true.",
  come: "Please come here.",
  depend: "Plants depend on water.",
  die: "Plants can die without water.",
  differ: "The two pictures differ in color.",
  dream: "I dream about flying.",
  fall: "Leaves fall from the tree.",
  feel: "I feel happy today.",
  fight: "The team will fight for a fair game.",
  flow: "Water can flow down the hill.",
  fly: "Birds fly in the sky.",
  go: "We go to school.",
  happen: "The event can happen today.",
  hear: "I hear a bell.",
  hope: "I hope for a sunny day.",
  hurry: "We hurry to class.",
  laugh: "We laugh at the funny story.",
  lie: "I lie down to rest.",
  live: "Fish live in water.",
  occur: "A change can occur slowly.",
  rain: "Rain can fall in the afternoon.",
  rest: "I rest after playing.",
  rise: "The sun can rise early.",
  run: "I run in the yard.",
  seem: "The puzzle can seem hard.",
  shine: "The lamp can shine brightly.",
  sit: "I sit on the chair.",
  sleep: "I sleep at night.",
  slip: "I slip on the wet floor.",
  stand: "I stand in line.",
  stay: "I stay with my class.",
  swim: "I swim in the pool.",
  vary: "The colors can vary.",
  wait: "I wait for my turn.",
  walk: "I walk to the door.",
  work: "We work together.",
};

const ACTION_EXAMPLE_OBJECTS: Record<string, string> = {
  act: "in the play",
  add: "two numbers",
  allow: "a turn",
  arrange: "the cards",
  ask: "a question",
  beat: "the drum",
  blow: "bubbles",
  break: "a stick",
  bring: "a book",
  build: "a tower",
  burn: "dry wood safely",
  buy: "fruit",
  call: "a friend",
  carry: "a bag",
  catch: "a ball",
  change: "the plan",
  check: "the answer",
  choose: "a card",
  claim: "a prize",
  climb: "a hill",
  close: "the door",
  clothe: "the doll",
  combine: "two groups",
  compare: "two blocks",
  connect: "the dots",
  consider: "the idea",
  contain: "small toys",
  continue: "the work",
  control: "the toy car",
  cook: "rice",
  copy: "the word",
  cover: "the box",
  create: "a drawing",
  cross: "the road",
  cry: "softly",
  cut: "paper",
  dance: "to music",
  decide: "the answer",
  describe: "the picture",
  design: "a poster",
  determine: "the answer",
  develop: "a skill",
  discuss: "the story",
  do: "my work",
  drink: "water",
  draw: "a star",
  drive: "a car",
  drop: "the ball",
  ease: "the pain",
  eat: "lunch",
  enter: "the room",
  equate: "two amounts",
  excite: "the class",
  expect: "rain",
  explain: "the answer",
  feed: "the dog",
  fill: "the cup",
  find: "a shell",
  finish: "the puzzle",
  fit: "the pieces",
  follow: "directions",
  form: "a line",
  gather: "the blocks",
  get: "a pencil",
  give: "a gift",
  govern: "the town",
  grow: "a plant",
  guess: "the answer",
  guide: "the group",
  help: "a friend",
  hit: "the ball",
  hold: "the cup",
  hunt: "for clues",
  hurt: "my knee",
  identify: "the correct picture",
  imagine: "a castle",
  include: "everyone",
  indicate: "the answer",
  invent: "a game",
  jump: "over the line",
  keep: "the paper",
  kill: "weeds in the garden",
  know: "the answer",
  lead: "the line",
  learn: "a new word",
  leave: "the room",
  let: "a friend play",
  lift: "the box",
  like: "the story",
  listen: "to the story",
  locate: "the place",
  look: "at the picture",
  love: "my family",
  make: "a card",
  mark: "the page",
  mean: "the same idea",
  meet: "a friend",
  miss: "my friend",
  mix: "the colors",
  mount: "the picture",
  move: "the chair",
  need: "water",
  notice: "the clue",
  offer: "help",
  open: "the book",
  operate: "the machine",
  observe: "the insects",
  paint: "a flower",
  pass: "the ball",
  pay: "for lunch",
  pick: "a flower",
  play: "a game",
  point: "to the answer",
  populate: "the village",
  pose: "for a picture",
  practice: "reading",
  prepare: "lunch",
  press: "the button",
  print: "my name",
  produce: "fresh fruit",
  protect: "the seedling",
  prove: "the answer",
  provide: "water",
  pull: "the rope",
  push: "the wagon",
  put: "the toy away",
  raise: "my hand",
  reach: "the shelf",
  read: "a book",
  receive: "a letter",
  record: "the score",
  remember: "the rule",
  repeat: "the word",
  reply: "to the question",
  represent: "the number",
  require: "practice",
  respond: "to the question",
  ride: "a bike",
  roll: "the ball",
  rub: "the spot",
  sail: "a boat",
  save: "my work",
  say: "hello",
  search: "for the key",
  see: "the moon",
  select: "one answer",
  sell: "fruit",
  send: "a note",
  serve: "food",
  settle: "the group",
  share: "my crayons",
  shop: "for shoes",
  shout: "for help",
  show: "the picture",
  sing: "a song",
  smell: "a flower",
  smile: "at a friend",
  solve: "the problem",
  spell: "the word",
  speak: "clearly",
  spend: "time reading",
  spread: "the blanket",
  start: "the game",
  step: "carefully",
  stop: "the game",
  stretch: "my arms",
  study: "the lesson",
  suggest: "an idea",
  support: "the team",
  take: "a turn",
  talk: "to a friend",
  teach: "a lesson",
  tell: "a story",
  test: "the idea",
  thank: "my teacher",
  think: "about the answer",
  throw: "the ball",
  tie: "my shoes",
  touch: "the soft cloth",
  track: "the score",
  trade: "cards",
  travel: "to the city",
  try: "again",
  turn: "the page",
  use: "a pencil",
  view: "the picture",
  visit: "my friend",
  want: "a turn",
  wash: "my hands",
  watch: "the game",
  wear: "a hat",
  whisper: "softly",
  win: "the race",
  wish: "for help",
  wonder: "about the stars",
  write: "my name",
};

const DESCRIBING_EXAMPLE_SENTENCES: Record<string, string> = {
  able: "I am able to help.",
  afraid: "The child is afraid of the dark.",
  bad: "The old apple smells bad.",
  basic: "We learned a basic rule.",
  beautiful: "The flower is beautiful.",
  best: "This is my best work.",
  better: "My reading is better today.",
  big: "The box is big.",
  bright: "The lamp is bright.",
  broad: "The river is broad.",
  busy: "The classroom is busy.",
  certain: "I am certain of my answer.",
  clean: "The table is clean.",
  clear: "The water is clear.",
  common: "That bird is common here.",
  correct: "The answer is correct.",
  dead: "The dead leaf fell.",
  dear: "My dear friend smiled.",
  deep: "The hole is deep.",
  different: "The two socks are different.",
  difficult: "The puzzle is difficult.",
  direct: "The path is direct.",
  distant: "The mountain is distant.",
  dry: "The towel is dry.",
  early: "We came early.",
  electric: "The fan is electric.",
  empty: "The cup is empty.",
  enough: "We have enough paper.",
  equal: "The two groups are equal.",
  even: "The table is even.",
  fair: "The game is fair.",
  famous: "The singer is famous.",
  fast: "The runner is fast.",
  final: "This is the final page.",
  fine: "I feel fine today.",
  free: "The bird is free.",
  fresh: "The fruit is fresh.",
  full: "The basket is full.",
  funny: "The joke is funny.",
  gentle: "The puppy is gentle.",
  glad: "I am glad to help.",
  good: "The story is good.",
  great: "You did a great job.",
  happy: "The child is happy.",
  hard: "The rock is hard.",
  heavy: "The bag is heavy.",
  huge: "The truck is huge.",
  kind: "The teacher is kind.",
  large: "The room is large.",
  late: "The bus is late.",
  little: "The kitten is little.",
  loud: "The drum is loud.",
  modern: "The building is modern.",
  necessary: "Water is necessary.",
  new: "I have a new book.",
  old: "The chair is old.",
  open: "The door is open.",
  plain: "The shirt is plain.",
  poor: "The poor plant needs water.",
  possible: "A win is possible.",
  pretty: "The picture is pretty.",
  quick: "The fox is quick.",
  quiet: "The room is quiet.",
  real: "The coin is real.",
  rich: "The soup has a rich taste.",
  safe: "The path is safe.",
  sharp: "The pencil is sharp.",
  short: "The line is short.",
  silent: "The room is silent.",
  simple: "The question is simple.",
  small: "The cup is small.",
  soft: "The pillow is soft.",
  special: "This card is special.",
  strange: "The sound is strange.",
  strong: "The rope is strong.",
  sudden: "The sudden noise surprised us.",
  sure: "I am sure of my answer.",
  thin: "The paper is thin.",
  tiny: "The seed is tiny.",
  true: "The sentence is true.",
  warm: "The soup is warm.",
  wide: "The road is wide.",
  wild: "The animal is wild.",
  wrong: "The answer is wrong.",
  young: "The tree is young.",
};

function hasFoodMeaning(word: string) {
  return FOOD_WORD_PARTS.some((part) => word.includes(part));
}

function hasNumericWord(word: string) {
  return /\b(one|two|three|four|five|six|seven|eight|nine|ten|twenty|hundred|thousand|million)\b/.test(word);
}

function getDictionaryCopyOverride(_word: string): CopyOutput | undefined {
  return undefined;
}

function getNaturalNoun(word: string) {
  return NO_ARTICLE_WORDS.has(word) || word.endsWith("s")
    ? word
    : `${indefiniteArticle(word)} ${word}`;
}

function buildActionExample(word: string) {
  const sentence = ACTION_EXAMPLE_SENTENCES[word];

  if (sentence) {
    return sentence;
  }

  const object = ACTION_EXAMPLE_OBJECTS[word];

  if (object) {
    return `I can ${word} ${object}.`;
  }

  return `I can ${word} carefully.`;
}

function buildReadingExample(word: string, definition: string, namedWord: string) {
  if (DESCRIBING_WORDS.has(word)) {
    return `The picture is ${word}.`;
  }

  if (ABSTRACT_EXAMPLE_WORDS.has(word)) {
    return `A character can feel or show ${word}.`;
  }

  if (definition.startsWith("Used ") || definition.startsWith("Shows ")) {
    return `${capitalize(word)} helps connect the sentence idea.`;
  }

  return `The teacher points to ${namedWord} during reading.`;
}

function buildExample(input: CopyInput) {
  const lowerWord = readableWord(input.word);
  const namedWord = getNaturalNoun(lowerWord);
  const definition = buildDefinition(input);
  const override = EXAMPLE_OVERRIDES[lowerWord];

  if (override) {
    return override;
  }

  if (input.category === "numeric") {
    switch (input.subcategory) {
      case "counting":
        return hasNumericWord(lowerWord)
          ? `We counted ${lowerWord} blocks.`
          : `We use ${lowerWord} while counting.`;
      case "shapes":
        return `The drawing shows ${namedWord}.`;
      case "adding":
        return hasNumericWord(lowerWord)
          ? `We add ${lowerWord} more blocks.`
          : `We use ${lowerWord} in the number story.`;
      case "comparing":
        return `The lesson uses ${lowerWord} to compare things.`;
      default:
        return `We use ${lowerWord} in math.`;
    }
  }

  if (definition.startsWith("To ")) {
    return buildActionExample(lowerWord);
  }

  if (DESCRIBING_WORDS.has(lowerWord)) {
    return DESCRIBING_EXAMPLE_SENTENCES[lowerWord] ?? `The picture is ${lowerWord}.`;
  }

  switch (input.subcategory) {
    case "animals":
      return `The picture shows ${namedWord}.`;
    case "plants":
      return hasFoodMeaning(lowerWord)
        ? `I see ${namedWord} at the market.`
        : `The garden has ${namedWord}.`;
    case "things":
      return `I see ${namedWord}.`;
    case "nature":
      return `We noticed ${lowerWord} outside.`;
    case "reading":
      return buildReadingExample(lowerWord, definition, namedWord);
    default:
      return `I see ${namedWord}.`;
  }
}

function isWeakExample(example: string, word: string) {
  const lowerWord = readableWord(word);
  const normalizedExample = normalizeForCopyCheck(example);
  const namedWord = getNaturalNoun(lowerWord);

  if (!normalizedExample || isUnsafeOrOffTopicCopy(example)) {
    return true;
  }

  return [
    `the picture shows ${lowerWord}`,
    `the picture shows ${normalizeForCopyCheck(namedWord)}`,
    `i see ${lowerWord}`,
    `i see ${normalizeForCopyCheck(namedWord)}`,
    `we use ${lowerWord} in this lesson`,
    `we talk about ${lowerWord} today`,
    `we noticed ${lowerWord} in a story`,
    `we describe ${lowerWord} clearly`,
  ].includes(normalizedExample);
}

function pickBestExample(input: CopyInput, generatedExample: string) {
  const lowerWord = readableWord(input.word);

  if (EXAMPLE_OVERRIDES[lowerWord]) {
    return generatedExample;
  }

  if (input.example && !isWeakExample(input.example, input.word)) {
    return input.example;
  }

  return generatedExample;
}

export function improveVocabularyCopy(input: CopyInput): CopyOutput {
  const dictionaryCopy = getDictionaryCopyOverride(input.word);

  if (
    dictionaryCopy &&
    !containsOwnWord(dictionaryCopy.definition, input.word) &&
    !isGenericDefinition(dictionaryCopy.definition) &&
    !isUnsafeOrOffTopicCopy(dictionaryCopy.definition) &&
    !isUnsafeOrOffTopicCopy(dictionaryCopy.example ?? "")
  ) {
    return dictionaryCopy;
  }

  const shouldUseImprovedDefinition = shouldImprove(input);
  const generatedDefinition = shouldUseImprovedDefinition
    ? buildDefinition(input)
    : input.definition;
  const safeDefinition = containsOwnWord(generatedDefinition, input.word)
    ? fallbackDefinition(input.subcategory)
    : generatedDefinition;

  return {
    definition: safeDefinition,
    example: pickBestExample(input, buildExample(input)),
  };
}
