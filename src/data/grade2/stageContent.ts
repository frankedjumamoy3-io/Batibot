export type Grade2StageCard = {
  id: string;
  label: string;
  caption?: string;
  lines?: string[];
};

export type Grade2TapSlide = Grade2StageCard & {
  speech: string;
};

export type Grade2Choice = {
  id: string;
  label: string;
  isCorrect: boolean;
};

export type Grade2PlayActivity =
  | {
      type: "match";
      title: string;
      instruction: string;
      pairs: { left: string; right: string }[];
      success: string;
      hint: string;
    }
  | {
      type: "sort";
      title: string;
      instruction: string;
      categories: string[];
      pairs: { left: string; right: string }[];
      success: string;
      hint: string;
    }
  | {
      type: "sequence";
      title: string;
      instruction: string;
      sequence: string[];
      success: string;
      hint: string;
    }
  | {
      type: "rounds";
      title: string;
      instruction: string;
      rounds: { prompt: string; answer: string; choices: string[] }[];
      success: string;
      hint: string;
    };

export type Grade2StageLesson = {
  choose: {
    prompt: string;
    choices: Grade2Choice[];
    multiSelect?: boolean;
    success: string;
  };
  look: {
    title: string;
    instruction: string;
    cards: Grade2StageCard[];
  };
  play: Grade2PlayActivity;
  tap: {
    slides: Grade2TapSlide[];
  };
  try: {
    prompt: string;
    choices: Grade2Choice[];
    success: string;
  };
};

const vocabularyLessons: Record<string, Grade2StageLesson> = {
  "synonyms": {
    look: {
      title: "Synonyms",
      instruction: "Look at words that mean almost the same.",
      cards: [
        { id: "big-large", label: "Big <-> Large", lines: ["Big", "<->", "Large"], caption: "Almost the same" },
        { id: "happy-glad", label: "Happy <-> Glad", lines: ["Happy", "<->", "Glad"], caption: "Almost the same" },
      ],
    },
    tap: {
      slides: [
        { id: "big", label: "Big", lines: ["Big"], caption: "Big means large in size.", speech: "Big means large in size." },
        { id: "large", label: "Large", lines: ["Large"], caption: "Large means very big.", speech: "Large means very big." },
        { id: "same", label: "Synonyms", lines: ["Big", "<->", "Large"], caption: "Both mean almost the same.", speech: "Big and large mean almost the same." },
      ],
    },
    try: {
      prompt: "Which pair means almost the same?",
      choices: [
        { id: "synonym", label: "Big <-> Large", isCorrect: true },
        { id: "antonym", label: "Big <-> Small", isCorrect: false },
      ],
      success: "They mean almost the same.",
    },
    choose: {
      prompt: "Which is the synonym of Big?",
      choices: [
        { id: "large", label: "Large", isCorrect: true },
        { id: "small", label: "Small", isCorrect: false },
        { id: "hot", label: "Hot", isCorrect: false },
        { id: "cold", label: "Cold", isCorrect: false },
      ],
      success: "Great! Large is a synonym.",
    },
    play: {
      type: "match",
      title: "Match the synonyms",
      instruction: "Connect each word to a similar word.",
      pairs: [
        { left: "Big", right: "Large" },
        { left: "Happy", right: "Glad" },
        { left: "Begin", right: "Start" },
        { left: "Fast", right: "Quick" },
      ],
      success: "The synonyms are matched.",
      hint: "Synonyms mean almost the same.",
    },
  },
  "antonyms": {
    look: {
      title: "Antonyms",
      instruction: "Look at words with opposite meanings.",
      cards: [
        { id: "big-small", label: "Big <-> Small", lines: ["Big", "<->", "Small"], caption: "Opposite" },
        { id: "hot-cold", label: "Hot <-> Cold", lines: ["Hot", "<->", "Cold"], caption: "Opposite" },
      ],
    },
    tap: {
      slides: [
        { id: "big-small", label: "Big and Small", lines: ["Big", "<->", "Small"], caption: "Big and small are opposites.", speech: "Big and small are opposites." },
        { id: "hot-cold", label: "Hot and Cold", lines: ["Hot", "<->", "Cold"], caption: "Hot and cold are opposites.", speech: "Hot and cold are opposites." },
      ],
    },
    try: {
      prompt: "Big and Small are...",
      choices: [
        { id: "opposites", label: "Opposites", isCorrect: true },
        { id: "same", label: "The same", isCorrect: false },
      ],
      success: "They are opposites.",
    },
    choose: {
      prompt: "Choose the opposite of Fast.",
      choices: [
        { id: "slow", label: "Slow", isCorrect: true },
        { id: "quick", label: "Quick", isCorrect: false },
        { id: "happy", label: "Happy", isCorrect: false },
        { id: "large", label: "Large", isCorrect: false },
      ],
      success: "Great! Slow is the opposite.",
    },
    play: {
      type: "match",
      title: "Match opposites",
      instruction: "Connect each word to its opposite.",
      pairs: [
        { left: "Big", right: "Small" },
        { left: "Hot", right: "Cold" },
        { left: "Fast", right: "Slow" },
        { left: "Up", right: "Down" },
      ],
      success: "The opposites are matched.",
      hint: "Opposites have different meanings.",
    },
  },
  "compound words": {
    look: {
      title: "Compound Words",
      instruction: "Two words can make one new word.",
      cards: [
        { id: "sunflower", label: "Sun + Flower", lines: ["Sun", "+", "Flower", "=", "Sunflower"], caption: "Compound word" },
      ],
    },
    tap: {
      slides: [
        { id: "sun", label: "Sun", lines: ["Sun"], caption: "First word: Sun", speech: "Sun is the first word." },
        { id: "flower", label: "Flower", lines: ["Flower"], caption: "Second word: Flower", speech: "Flower is the second word." },
        { id: "sunflower", label: "Sunflower", lines: ["Sun", "+", "Flower", "=", "Sunflower"], caption: "Sun and flower make sunflower.", speech: "Sun and flower make sunflower." },
      ],
    },
    try: {
      prompt: "Which words build Sunflower?",
      choices: [
        { id: "compound", label: "Sun + Flower", isCorrect: true },
        { id: "category", label: "Sun <-> Cold", isCorrect: false },
      ],
      success: "Two words make one word.",
    },
    choose: {
      prompt: "Which words make Sunflower?",
      choices: [
        { id: "sun", label: "Sun", isCorrect: true },
        { id: "flower", label: "Flower", isCorrect: true },
        { id: "tree", label: "Tree", isCorrect: false },
        { id: "fish", label: "Fish", isCorrect: false },
      ],
      multiSelect: true,
      success: "Great! Sun and flower make sunflower.",
    },
    play: {
      type: "sequence",
      title: "Build Sunflower",
      instruction: "Put the word parts in order.",
      sequence: ["Sun", "Flower", "Sunflower"],
      success: "You built sunflower.",
      hint: "Start with Sun, then Flower.",
    },
  },
  "categories": {
    look: {
      title: "Categories",
      instruction: "Things can belong in a group.",
      cards: [
        { id: "animals", label: "Animals", lines: ["Dog", "Cat", "Cow"], caption: "Animals" },
        { id: "fruits", label: "Fruits", lines: ["Apple", "Mango", "Orange"], caption: "Fruits" },
      ],
    },
    tap: {
      slides: [
        { id: "animals", label: "Animals", lines: ["Dog", "Cat", "Cow"], caption: "Dog, cat, and cow are animals.", speech: "Dog, cat, and cow are animals." },
        { id: "fruits", label: "Fruits", lines: ["Apple", "Mango", "Orange"], caption: "Apple, mango, and orange are fruits.", speech: "Apple, mango, and orange are fruits." },
      ],
    },
    try: {
      prompt: "Which word names a group?",
      choices: [
        { id: "categories", label: "Categories", isCorrect: true },
        { id: "opposites", label: "Opposites", isCorrect: false },
      ],
      success: "Categories are groups.",
    },
    choose: {
      prompt: "Which belongs to Animals?",
      choices: [
        { id: "dog", label: "Dog", isCorrect: true },
        { id: "apple", label: "Apple", isCorrect: false },
        { id: "milk", label: "Milk", isCorrect: false },
        { id: "pencil", label: "Pencil", isCorrect: false },
      ],
      success: "Great! Dog is an animal.",
    },
    play: {
      type: "sort",
      title: "Sort the words",
      instruction: "Tap each item into its category.",
      categories: ["Animals", "Fruits", "Food"],
      pairs: [
        { left: "Dog", right: "Animals" },
        { left: "Cat", right: "Animals" },
        { left: "Apple", right: "Fruits" },
        { left: "Mango", right: "Fruits" },
      ],
      success: "The categories are sorted.",
      hint: "A category is a group.",
    },
  },
  "vocabulary challenge": {
    look: {
      title: "Vocabulary Challenge",
      instruction: "Review word relationships.",
      cards: [
        { id: "synonyms", label: "Big <-> Large", lines: ["Big", "<->", "Large"], caption: "Synonym" },
        { id: "compound", label: "Sun + Flower", lines: ["Sun", "+", "Flower"], caption: "Compound" },
        { id: "category", label: "Animals", lines: ["Dog", "Cat", "Cow"], caption: "Category" },
      ],
    },
    tap: {
      slides: [
        { id: "synonym", label: "Synonym", lines: ["Big", "<->", "Large"], caption: "Synonyms mean almost the same.", speech: "Synonyms mean almost the same." },
        { id: "compound", label: "Compound", lines: ["Sun", "+", "Flower"], caption: "Two words make one word.", speech: "Two words can make one word." },
        { id: "category", label: "Category", lines: ["Dog", "Cat", "Cow"], caption: "A category is a group.", speech: "A category is a group." },
      ],
    },
    try: {
      prompt: "Big and Large are...",
      choices: [
        { id: "synonyms", label: "Synonyms", isCorrect: true },
        { id: "opposites", label: "Opposites", isCorrect: false },
      ],
      success: "They are synonyms.",
    },
    choose: {
      prompt: "Find the vocabulary match.",
      choices: [
        { id: "big-large", label: "Big <-> Large", isCorrect: true },
        { id: "sun-cold", label: "Sun <-> Cold", isCorrect: false },
        { id: "dog-fruit", label: "Dog -> Fruit", isCorrect: false },
        { id: "tree-fish", label: "Tree + Fish", isCorrect: false },
      ],
      success: "Great! Big and large match.",
    },
    play: {
      type: "match",
      title: "Vocabulary Match",
      instruction: "Match each word relationship.",
      pairs: [
        { left: "Big", right: "Large" },
        { left: "Happy", right: "Glad" },
        { left: "Sun + Flower", right: "Sunflower" },
        { left: "Hot", right: "Cold" },
      ],
      success: "Vocabulary relationships are matched.",
      hint: "Use word meaning and word parts.",
    },
  },
};

const placeValueLessons: Record<string, Grade2StageLesson> = {
  "ones": {
    look: {
      title: "Ones",
      instruction: "Look at the ones digit.",
      cards: [
        { id: "235", label: "235", lines: ["235", "5 Ones"], caption: "5 ones" },
      ],
    },
    tap: {
      slides: [
        { id: "number", label: "235", lines: ["235"], caption: "Look at each digit.", speech: "Look at each digit in two hundred thirty five." },
        { id: "ones", label: "Ones", lines: ["5", "Ones"], caption: "The ones digit is 5.", speech: "The ones digit is five." },
      ],
    },
    try: {
      prompt: "235: Which is the Ones digit?",
      choices: [
        { id: "2", label: "2", isCorrect: false },
        { id: "3", label: "3", isCorrect: false },
        { id: "5", label: "5", isCorrect: true },
      ],
      success: "5 is in the ones place.",
    },
    choose: {
      prompt: "Which number has 5 Ones?",
      choices: [
        { id: "235", label: "235", isCorrect: true },
        { id: "240", label: "240", isCorrect: false },
        { id: "351", label: "351", isCorrect: false },
        { id: "502", label: "502", isCorrect: false },
      ],
      success: "Great! 235 has 5 ones.",
    },
    play: {
      type: "rounds",
      title: "Build the number 235",
      instruction: "Choose each place-value part.",
      rounds: [
        { prompt: "How many hundreds?", answer: "2 Hundreds", choices: ["2 Hundreds", "3 Hundreds", "5 Hundreds"] },
        { prompt: "How many tens?", answer: "3 Tens", choices: ["2 Tens", "3 Tens", "5 Tens"] },
        { prompt: "How many ones?", answer: "5 Ones", choices: ["2 Ones", "3 Ones", "5 Ones"] },
      ],
      success: "You built 235.",
      hint: "Read hundreds, tens, then ones.",
    },
  },
  "tens": {
    look: {
      title: "Tens",
      instruction: "Look at the tens digit.",
      cards: [
        { id: "235", label: "235", lines: ["235", "3 Tens"], caption: "3 tens" },
      ],
    },
    tap: {
      slides: [
        { id: "number", label: "235", lines: ["235"], caption: "Look at the middle digit.", speech: "Look at the middle digit." },
        { id: "tens", label: "Tens", lines: ["3", "Tens"], caption: "The tens digit is 3.", speech: "The tens digit is three." },
      ],
    },
    try: {
      prompt: "235: Which is the Tens digit?",
      choices: [
        { id: "2", label: "2", isCorrect: false },
        { id: "3", label: "3", isCorrect: true },
        { id: "5", label: "5", isCorrect: false },
      ],
      success: "3 is in the tens place.",
    },
    choose: {
      prompt: "Which number has 4 Tens?",
      choices: [
        { id: "42", label: "42", isCorrect: true },
        { id: "36", label: "36", isCorrect: false },
        { id: "91", label: "91", isCorrect: false },
        { id: "74", label: "74", isCorrect: false },
      ],
      success: "Great! 42 has 4 tens.",
    },
    play: {
      type: "rounds",
      title: "Build the number 352",
      instruction: "Choose hundreds, tens, and ones.",
      rounds: [
        { prompt: "How many hundreds?", answer: "3 Hundreds", choices: ["2 Hundreds", "3 Hundreds", "5 Hundreds"] },
        { prompt: "How many tens?", answer: "5 Tens", choices: ["2 Tens", "3 Tens", "5 Tens"] },
        { prompt: "How many ones?", answer: "2 Ones", choices: ["2 Ones", "3 Ones", "5 Ones"] },
      ],
      success: "You built 352.",
      hint: "Use the digit places.",
    },
  },
  "hundreds": {
    look: {
      title: "Hundreds",
      instruction: "Look at the hundreds digit.",
      cards: [
        { id: "235", label: "235", lines: ["235", "2 Hundreds"], caption: "2 hundreds" },
      ],
    },
    tap: {
      slides: [
        { id: "number", label: "235", lines: ["235"], caption: "Look at the first digit.", speech: "Look at the first digit." },
        { id: "hundreds", label: "Hundreds", lines: ["2", "Hundreds"], caption: "The hundreds digit is 2.", speech: "The hundreds digit is two." },
      ],
    },
    try: {
      prompt: "235: Which is the Hundreds digit?",
      choices: [
        { id: "2", label: "2", isCorrect: true },
        { id: "3", label: "3", isCorrect: false },
        { id: "5", label: "5", isCorrect: false },
      ],
      success: "2 is in the hundreds place.",
    },
    choose: {
      prompt: "Which number has 6 Hundreds?",
      choices: [
        { id: "683", label: "683", isCorrect: true },
        { id: "86", label: "86", isCorrect: false },
        { id: "368", label: "368", isCorrect: false },
        { id: "38", label: "38", isCorrect: false },
      ],
      success: "Great! 683 has 6 hundreds.",
    },
    play: {
      type: "rounds",
      title: "Build the number 683",
      instruction: "Choose each place-value part.",
      rounds: [
        { prompt: "How many hundreds?", answer: "6 Hundreds", choices: ["3 Hundreds", "6 Hundreds", "8 Hundreds"] },
        { prompt: "How many tens?", answer: "8 Tens", choices: ["3 Tens", "6 Tens", "8 Tens"] },
        { prompt: "How many ones?", answer: "3 Ones", choices: ["3 Ones", "6 Ones", "8 Ones"] },
      ],
      success: "You built 683.",
      hint: "Use hundreds, tens, and ones.",
    },
  },
  "expanded form": {
    look: {
      title: "Expanded Form",
      instruction: "Break the number into parts.",
      cards: [
        { id: "427", label: "427", lines: ["427", "400 + 20 + 7"], caption: "Expanded form" },
      ],
    },
    tap: {
      slides: [
        { id: "hundreds", label: "Hundreds", lines: ["4", "Hundreds", "400"], caption: "4 hundreds is 400.", speech: "Four hundreds is four hundred." },
        { id: "tens", label: "Tens", lines: ["2", "Tens", "20"], caption: "2 tens is 20.", speech: "Two tens is twenty." },
        { id: "ones", label: "Ones", lines: ["7", "Ones", "7"], caption: "7 ones is 7.", speech: "Seven ones is seven." },
      ],
    },
    try: {
      prompt: "427 has...",
      choices: [
        { id: "expanded", label: "400 + 20 + 7", isCorrect: true },
        { id: "wrong", label: "40 + 20 + 7", isCorrect: false },
      ],
      success: "That is expanded form.",
    },
    choose: {
      prompt: "What is the expanded form of 257?",
      choices: [
        { id: "correct", label: "200 + 50 + 7", isCorrect: true },
        { id: "wrong1", label: "2 + 5 + 7", isCorrect: false },
        { id: "wrong2", label: "200 + 57", isCorrect: false },
        { id: "wrong3", label: "20 + 50 + 7", isCorrect: false },
      ],
      success: "Great! 257 is 200 + 50 + 7.",
    },
    play: {
      type: "sequence",
      title: "Arrange expanded form",
      instruction: "Build 300 + 50 + 2.",
      sequence: ["300", "+ 50", "+ 2", "= 352"],
      success: "You arranged the expanded form.",
      hint: "Start with hundreds.",
    },
  },
  "place value challenge": {
    look: {
      title: "Place Value Challenge",
      instruction: "Review hundreds, tens, ones, and expanded form.",
      cards: [
        { id: "683", label: "683", lines: ["6 Hundreds", "8 Tens", "3 Ones"], caption: "Place value" },
        { id: "257", label: "257", lines: ["200", "+ 50", "+ 7"], caption: "Expanded form" },
      ],
    },
    tap: {
      slides: [
        { id: "place", label: "Place Value", lines: ["683", "6 | 8 | 3"], caption: "Each digit has a place.", speech: "Each digit has a place." },
        { id: "expanded", label: "Expanded Form", lines: ["257", "200 + 50 + 7"], caption: "Expanded form shows the parts.", speech: "Expanded form shows the parts." },
      ],
    },
    try: {
      prompt: "683: How many hundreds?",
      choices: [
        { id: "6", label: "6", isCorrect: true },
        { id: "8", label: "8", isCorrect: false },
        { id: "3", label: "3", isCorrect: false },
      ],
      success: "6 is the hundreds digit.",
    },
    choose: {
      prompt: "What is the expanded form of 257?",
      choices: [
        { id: "correct", label: "200 + 50 + 7", isCorrect: true },
        { id: "wrong1", label: "2 + 5 + 7", isCorrect: false },
        { id: "wrong2", label: "200 + 57", isCorrect: false },
        { id: "wrong3", label: "20 + 50 + 7", isCorrect: false },
      ],
      success: "Great! 257 is 200 + 50 + 7.",
    },
    play: {
      type: "rounds",
      title: "Place Value Challenge",
      instruction: "Solve each place-value task.",
      rounds: [
        { prompt: "683 has how many hundreds?", answer: "6", choices: ["6", "8", "3"] },
        { prompt: "257 expanded form?", answer: "200 + 50 + 7", choices: ["200 + 50 + 7", "2 + 5 + 7", "200 + 57"] },
        { prompt: "Fill the missing digit: 5 _ 9. Tens digit?", answer: "7", choices: ["6", "7", "8"] },
      ],
      success: "You completed Place Value City.",
      hint: "Use each digit's place.",
    },
  },
};

const problemSolvingLessons: Record<string, Grade2StageLesson> = {
  "addition word problems": {
    look: {
      title: "Addition Problem",
      instruction: "Read the story and look for more.",
      cards: [
        { id: "story", label: "Ben has 12 apples", lines: ["12 apples", "+ 8 apples"], caption: "More apples" },
        { id: "answer", label: "12 + 8 = 20", lines: ["12", "+ 8", "= 20"], caption: "Add to find all" },
      ],
    },
    tap: {
      slides: [
        { id: "story", label: "Story", lines: ["Ben has", "12 apples"], caption: "Ben starts with 12 apples.", speech: "Ben starts with twelve apples." },
        { id: "more", label: "More", lines: ["Mother gives", "8 more"], caption: "More means addition.", speech: "Mother gives eight more apples." },
        { id: "equation", label: "Equation", lines: ["12 + 8", "= 20"], caption: "Add to find the total.", speech: "Twelve plus eight equals twenty." },
      ],
    },
    try: {
      prompt: "Ben gets 8 more. We use...",
      choices: [
        { id: "addition", label: "Addition", isCorrect: true },
        { id: "subtraction", label: "Subtraction", isCorrect: false },
      ],
      success: "Addition puts more together.",
    },
    choose: {
      prompt: "Which equation matches the story?",
      choices: [
        { id: "correct", label: "12 + 8 = 20", isCorrect: true },
        { id: "wrong1", label: "12 - 8 = 4", isCorrect: false },
        { id: "wrong2", label: "8 - 12 = 4", isCorrect: false },
        { id: "wrong3", label: "12 + 8 = 18", isCorrect: false },
      ],
      success: "Great! The story is addition.",
    },
    play: {
      type: "sequence",
      title: "Build the equation",
      instruction: "Arrange the story equation.",
      sequence: ["12", "+", "8", "= 20"],
      success: "The addition story is solved.",
      hint: "More apples means plus.",
    },
  },
  "subtraction word problems": {
    look: {
      title: "Subtraction Problem",
      instruction: "Read the story and look for take away.",
      cards: [
        { id: "story", label: "Ana has 15 balloons", lines: ["15 balloons", "- 6 balloons"], caption: "Give away" },
        { id: "answer", label: "15 - 6 = 9", lines: ["15", "- 6", "= 9"], caption: "Find what is left" },
      ],
    },
    tap: {
      slides: [
        { id: "story", label: "Story", lines: ["Ana has", "15 balloons"], caption: "Ana starts with 15 balloons.", speech: "Ana starts with fifteen balloons." },
        { id: "away", label: "Take Away", lines: ["gives away", "6"], caption: "Take away means subtraction.", speech: "She gives away six balloons." },
        { id: "equation", label: "Equation", lines: ["15 - 6", "= 9"], caption: "Subtract to find what is left.", speech: "Fifteen minus six equals nine." },
      ],
    },
    try: {
      prompt: "Ana gives 6 away. We use...",
      choices: [
        { id: "addition", label: "Addition", isCorrect: false },
        { id: "subtraction", label: "Subtraction", isCorrect: true },
      ],
      success: "Subtraction finds what is left.",
    },
    choose: {
      prompt: "Which equation matches the story?",
      choices: [
        { id: "wrong1", label: "15 + 6 = 21", isCorrect: false },
        { id: "correct", label: "15 - 6 = 9", isCorrect: true },
        { id: "wrong2", label: "6 - 15 = 9", isCorrect: false },
        { id: "wrong3", label: "15 - 6 = 8", isCorrect: false },
      ],
      success: "Great! The story is subtraction.",
    },
    play: {
      type: "sequence",
      title: "Build the equation",
      instruction: "Arrange the subtraction equation.",
      sequence: ["15", "-", "6", "= 9"],
      success: "The subtraction story is solved.",
      hint: "Give away means minus.",
    },
  },
  "mixed word problems": {
    look: {
      title: "Mixed Problems",
      instruction: "Choose plus or minus from the story.",
      cards: [
        { id: "add", label: "More", lines: ["more", "means", "+"], caption: "Addition" },
        { id: "subtract", label: "Give away", lines: ["give away", "means", "-"], caption: "Subtraction" },
      ],
    },
    tap: {
      slides: [
        { id: "add", label: "Addition Clue", lines: ["gets more", "+"], caption: "Use plus when the group grows.", speech: "Use plus when the group grows." },
        { id: "subtract", label: "Subtraction Clue", lines: ["gives away", "-"], caption: "Use minus when the group gets smaller.", speech: "Use minus when the group gets smaller." },
      ],
    },
    try: {
      prompt: "Tom gives away 3 cars. We use...",
      choices: [
        { id: "addition", label: "Addition", isCorrect: false },
        { id: "subtraction", label: "Subtraction", isCorrect: true },
      ],
      success: "Give away means subtraction.",
    },
    choose: {
      prompt: "Which equation matches: 10 cars, gives away 3?",
      choices: [
        { id: "wrong1", label: "10 + 3 = 13", isCorrect: false },
        { id: "correct", label: "10 - 3 = 7", isCorrect: true },
        { id: "wrong2", label: "3 - 10 = 7", isCorrect: false },
        { id: "wrong3", label: "10 - 3 = 8", isCorrect: false },
      ],
      success: "Great! Use subtraction.",
    },
    play: {
      type: "rounds",
      title: "Choose the operation",
      instruction: "Solve each story clue.",
      rounds: [
        { prompt: "Ben gets 8 more apples.", answer: "+", choices: ["+", "-"] },
        { prompt: "Tom gives away 3 cars.", answer: "-", choices: ["+", "-"] },
        { prompt: "Mia buys 4 more books.", answer: "+", choices: ["+", "-"] },
      ],
      success: "You chose the right operations.",
      hint: "More means plus. Give away means minus.",
    },
  },
  "problem solving challenge": {
    look: {
      title: "Problem Challenge",
      instruction: "Use the story, numbers, operation, and answer.",
      cards: [
        { id: "story", label: "Read", lines: ["Story", "Numbers"], caption: "Find clues" },
        { id: "solve", label: "Solve", lines: ["Operation", "Answer"], caption: "Show work" },
      ],
    },
    tap: {
      slides: [
        { id: "story", label: "Story", lines: ["Read", "carefully"], caption: "Find what is happening.", speech: "Read the story carefully." },
        { id: "numbers", label: "Numbers", lines: ["12", "8"], caption: "Use the numbers in the story.", speech: "Use the numbers in the story." },
        { id: "answer", label: "Answer", lines: ["solve", "check"], caption: "Check if the answer makes sense.", speech: "Check if the answer makes sense." },
      ],
    },
    try: {
      prompt: "A good solver first...",
      choices: [
        { id: "read", label: "Reads the story", isCorrect: true },
        { id: "guess", label: "Guesses fast", isCorrect: false },
      ],
      success: "Yes. Read first.",
    },
    choose: {
      prompt: "Which answer matches 12 + 8?",
      choices: [
        { id: "wrong1", label: "18", isCorrect: false },
        { id: "correct", label: "20", isCorrect: true },
        { id: "wrong2", label: "4", isCorrect: false },
        { id: "wrong3", label: "28", isCorrect: false },
      ],
      success: "Great! 12 + 8 = 20.",
    },
    play: {
      type: "rounds",
      title: "Mixed Problem",
      instruction: "Solve the mixed story problems.",
      rounds: [
        { prompt: "12 + 8 = ?", answer: "20", choices: ["18", "20", "22"] },
        { prompt: "15 - 6 = ?", answer: "9", choices: ["7", "8", "9"] },
        { prompt: "10 - 3 = ?", answer: "7", choices: ["6", "7", "8"] },
      ],
      success: "You solved Problem Solver City.",
      hint: "Pick plus or minus from the story.",
    },
  },
};

const measurementLessons: Record<string, Grade2StageLesson> = {
  length: {
    look: {
      title: "Length",
      instruction: "Look at how long the pencil is.",
      cards: [
        { id: "pencil", label: "Pencil", lines: ["Pencil", "Length"], caption: "Measure length" },
        { id: "ruler", label: "Ruler", lines: ["0 1 2 3", "4 5 6"], caption: "Use a ruler" },
      ],
    },
    tap: {
      slides: [
        { id: "tool", label: "Ruler", lines: ["Ruler"], caption: "A ruler measures length.", speech: "A ruler measures length." },
        { id: "measure", label: "Measure", lines: ["Pencil", "6 units"], caption: "This pencil is 6 units long.", speech: "This pencil is six units long." },
      ],
    },
    try: {
      prompt: "We measure length with...",
      choices: [
        { id: "ruler", label: "Ruler", isCorrect: true },
        { id: "scale", label: "Scale", isCorrect: false },
      ],
      success: "A ruler measures length.",
    },
    choose: {
      prompt: "Which is longer?",
      choices: [
        { id: "pencil", label: "Pencil", isCorrect: true },
        { id: "crayon", label: "Crayon", isCorrect: false },
        { id: "eraser", label: "Eraser", isCorrect: false },
        { id: "clip", label: "Paper clip", isCorrect: false },
      ],
      success: "Great! The pencil is longer.",
    },
    play: {
      type: "sort",
      title: "Sort by Length",
      instruction: "Drag each object by length.",
      categories: ["Longer", "Shorter"],
      pairs: [
        { left: "Pencil", right: "Longer" },
        { left: "Ruler", right: "Longer" },
        { left: "Crayon", right: "Shorter" },
        { left: "Clip", right: "Shorter" },
      ],
      success: "The length cards are sorted.",
      hint: "Longer objects stretch farther.",
    },
  },
  weight: {
    look: {
      title: "Weight",
      instruction: "Look at heavy and light objects.",
      cards: [
        { id: "rock", label: "Rock", lines: ["Rock", "Heavy"], caption: "Heavy" },
        { id: "feather", label: "Feather", lines: ["Feather", "Light"], caption: "Light" },
      ],
    },
    tap: {
      slides: [
        { id: "heavy", label: "Heavy", lines: ["Rock", "heavy"], caption: "A rock is heavy.", speech: "A rock is heavy." },
        { id: "light", label: "Light", lines: ["Feather", "light"], caption: "A feather is light.", speech: "A feather is light." },
      ],
    },
    try: {
      prompt: "We compare weight by...",
      choices: [
        { id: "heavier", label: "Heavier or lighter", isCorrect: true },
        { id: "longer", label: "Longer or shorter", isCorrect: false },
      ],
      success: "Weight tells heavy or light.",
    },
    choose: {
      prompt: "Which is heavier?",
      choices: [
        { id: "rock", label: "Rock", isCorrect: true },
        { id: "feather", label: "Feather", isCorrect: false },
        { id: "paper", label: "Paper", isCorrect: false },
        { id: "leaf", label: "Leaf", isCorrect: false },
      ],
      success: "Great! The rock is heavier.",
    },
    play: {
      type: "sort",
      title: "Balance Scale",
      instruction: "Drag each object by weight.",
      categories: ["Heavier", "Lighter"],
      pairs: [
        { left: "Rock", right: "Heavier" },
        { left: "Book", right: "Heavier" },
        { left: "Feather", right: "Lighter" },
        { left: "Paper", right: "Lighter" },
      ],
      success: "The weight cards are sorted.",
      hint: "Heavier objects weigh more.",
    },
  },
  capacity: {
    look: {
      title: "Capacity",
      instruction: "Look at containers that hold more or less.",
      cards: [
        { id: "cup", label: "Cup", lines: ["Cup", "less"], caption: "Holds less" },
        { id: "bucket", label: "Bucket", lines: ["Bucket", "more"], caption: "Holds more" },
      ],
    },
    tap: {
      slides: [
        { id: "meaning", label: "Capacity", lines: ["how much", "it holds"], caption: "Capacity tells how much a container holds.", speech: "Capacity tells how much a container holds." },
        { id: "more", label: "Bucket", lines: ["Bucket", "holds more"], caption: "A bucket holds more than a cup.", speech: "A bucket holds more than a cup." },
      ],
    },
    try: {
      prompt: "Capacity tells...",
      choices: [
        { id: "holds", label: "How much it holds", isCorrect: true },
        { id: "heavy", label: "How heavy it is", isCorrect: false },
      ],
      success: "Capacity tells how much it holds.",
    },
    choose: {
      prompt: "Which holds more?",
      choices: [
        { id: "cup", label: "Cup", isCorrect: false },
        { id: "bucket", label: "Bucket", isCorrect: true },
        { id: "spoon", label: "Spoon", isCorrect: false },
        { id: "cap", label: "Cap", isCorrect: false },
      ],
      success: "Great! The bucket holds more.",
    },
    play: {
      type: "sort",
      title: "Fill containers",
      instruction: "Sort containers by capacity.",
      categories: ["Holds More", "Holds Less"],
      pairs: [
        { left: "Bucket", right: "Holds More" },
        { left: "Cup", right: "Holds Less" },
        { left: "Bottle", right: "Holds More" },
        { left: "Spoon", right: "Holds Less" },
      ],
      success: "The containers are sorted.",
      hint: "Capacity is how much it can hold.",
    },
  },
  time: {
    look: {
      title: "Time",
      instruction: "Look at the clock.",
      cards: [
        { id: "clock", label: "3:30", lines: ["3:30"], caption: "Half past three" },
        { id: "hands", label: "Clock Hands", lines: ["hour hand", "minute hand"], caption: "Clock parts" },
      ],
    },
    tap: {
      slides: [
        { id: "hour", label: "Hour Hand", lines: ["short hand"], caption: "The short hand shows the hour.", speech: "The short hand shows the hour." },
        { id: "minute", label: "Minute Hand", lines: ["long hand"], caption: "The long hand shows minutes.", speech: "The long hand shows minutes." },
        { id: "time", label: "3:30", lines: ["3:30"], caption: "3:30 is half past three.", speech: "Three thirty is half past three." },
      ],
    },
    try: {
      prompt: "Which tells time?",
      choices: [
        { id: "clock", label: "Clock", isCorrect: true },
        { id: "ruler", label: "Ruler", isCorrect: false },
      ],
      success: "A clock tells time.",
    },
    choose: {
      prompt: "Which shows 3:30?",
      choices: [
        { id: "correct", label: "3:30", isCorrect: true },
        { id: "wrong1", label: "3:00", isCorrect: false },
        { id: "wrong2", label: "6:30", isCorrect: false },
        { id: "wrong3", label: "12:30", isCorrect: false },
      ],
      success: "Great! That is 3:30.",
    },
    play: {
      type: "sort",
      title: "Clock Parts",
      instruction: "Drag each time clue.",
      categories: ["Hour", "Minute"],
      pairs: [
        { left: "Short hand", right: "Hour" },
        { left: "3 o'clock", right: "Hour" },
        { left: "Long hand", right: "Minute" },
        { left: "30 minutes", right: "Minute" },
      ],
      success: "The clock clues are sorted.",
      hint: "Hour uses the short hand.",
    },
  },
  "measurement challenge": {
    look: {
      title: "Measurement Challenge",
      instruction: "Review length, weight, capacity, and time.",
      cards: [
        { id: "tools", label: "Tools", lines: ["ruler", "scale", "clock"], caption: "Measure" },
        { id: "compare", label: "Compare", lines: ["longer", "heavier", "holds more"], caption: "Use words" },
      ],
    },
    tap: {
      slides: [
        { id: "length", label: "Length", lines: ["ruler"], caption: "Use a ruler for length.", speech: "Use a ruler for length." },
        { id: "weight", label: "Weight", lines: ["scale"], caption: "Use a scale for weight.", speech: "Use a scale for weight." },
        { id: "capacity", label: "Capacity", lines: ["container"], caption: "Capacity tells how much it holds.", speech: "Capacity tells how much it holds." },
        { id: "time", label: "Time", lines: ["clock"], caption: "Use a clock for time.", speech: "Use a clock for time." },
      ],
    },
    try: {
      prompt: "Which tool measures length?",
      choices: [
        { id: "ruler", label: "Ruler", isCorrect: true },
        { id: "clock", label: "Clock", isCorrect: false },
      ],
      success: "A ruler measures length.",
    },
    choose: {
      prompt: "Which holds more?",
      choices: [
        { id: "bucket", label: "Bucket", isCorrect: true },
        { id: "cup", label: "Cup", isCorrect: false },
        { id: "spoon", label: "Spoon", isCorrect: false },
        { id: "cap", label: "Cap", isCorrect: false },
      ],
      success: "Great! The bucket holds more.",
    },
    play: {
      type: "sort",
      title: "Measurement Mix",
      instruction: "Drag each measurement card.",
      categories: ["Tool", "Compare"],
      pairs: [
        { left: "Ruler", right: "Tool" },
        { left: "Scale", right: "Tool" },
        { left: "Longer", right: "Compare" },
        { left: "Heavier", right: "Compare" },
      ],
      success: "You completed Measurement Harbor.",
      hint: "Tools measure. Compare words describe.",
    },
  },
};

const multiplicationLessons: Record<string, Grade2StageLesson> = {
  "equal groups": {
    look: {
      title: "Equal Groups",
      instruction: "Look at groups with the same number.",
      cards: [
        { id: "groups", label: "3 groups of 2", lines: ["2", "2", "2"], caption: "Equal groups" },
        { id: "fact", label: "3 x 2 = 6", lines: ["3 x 2", "= 6"], caption: "Multiplication fact" },
      ],
    },
    tap: {
      slides: [
        { id: "groups", label: "Groups", lines: ["2", "2", "2"], caption: "There are 3 equal groups.", speech: "There are three equal groups." },
        { id: "total", label: "Total", lines: ["2 + 2 + 2", "= 6"], caption: "Count all the objects.", speech: "Two plus two plus two equals six." },
        { id: "fact", label: "Fact", lines: ["3 x 2", "= 6"], caption: "3 groups of 2 is 6.", speech: "Three groups of two is six." },
      ],
    },
    try: {
      prompt: "Which model shows equal groups?",
      choices: [
        { id: "groups", label: "Equal Groups", isCorrect: true },
        { id: "not", label: "Unequal Groups", isCorrect: false },
      ],
      success: "Equal groups have the same amount.",
    },
    choose: {
      prompt: "What is 2 + 2 + 2?",
      choices: [
        { id: "4", label: "4", isCorrect: false },
        { id: "6", label: "6", isCorrect: true },
        { id: "8", label: "8", isCorrect: false },
        { id: "10", label: "10", isCorrect: false },
      ],
      success: "Great! 2 + 2 + 2 = 6.",
    },
    play: {
      type: "rounds",
      title: "Make equal groups",
      instruction: "Solve each equal-group fact.",
      rounds: [
        { prompt: "3 groups of 2 = ?", answer: "6", choices: ["4", "6", "8"] },
        { prompt: "2 groups of 3 = ?", answer: "6", choices: ["5", "6", "9"] },
      ],
      success: "The equal groups are complete.",
      hint: "Count each group.",
    },
  },
  "repeated addition": {
    look: {
      title: "Repeated Addition",
      instruction: "Look at the same number added again.",
      cards: [
        { id: "add", label: "2 + 2 + 2", lines: ["2 + 2 + 2", "= 6"], caption: "Repeated addition" },
        { id: "multiply", label: "3 x 2", lines: ["3 x 2", "= 6"], caption: "Multiplication" },
      ],
    },
    tap: {
      slides: [
        { id: "add", label: "Repeated Addition", lines: ["2 + 2 + 2"], caption: "The same number repeats.", speech: "The same number repeats." },
        { id: "groups", label: "Groups", lines: ["3 groups", "of 2"], caption: "It means 3 groups of 2.", speech: "It means three groups of two." },
        { id: "fact", label: "Fact", lines: ["3 x 2", "= 6"], caption: "Repeated addition can become multiplication.", speech: "Repeated addition can become multiplication." },
      ],
    },
    try: {
      prompt: "2 + 2 + 2 is...",
      choices: [
        { id: "repeat", label: "Repeated Addition", isCorrect: true },
        { id: "place", label: "Place Value", isCorrect: false },
      ],
      success: "Yes. The addend repeats.",
    },
    choose: {
      prompt: "Which repeated addition matches 3 x 2?",
      choices: [
        { id: "wrong1", label: "2 + 2 = 4", isCorrect: false },
        { id: "correct", label: "2 + 2 + 2 = 6", isCorrect: true },
        { id: "wrong2", label: "3 + 3 + 3 = 9", isCorrect: false },
        { id: "wrong3", label: "2 + 2 + 2 + 2 = 8", isCorrect: false },
      ],
      success: "Great! Three groups of two.",
    },
    play: {
      type: "sequence",
      title: "Convert the fact",
      instruction: "Arrange repeated addition into a multiplication fact.",
      sequence: ["2 + 2 + 2", "=", "3 x 2", "= 6"],
      success: "The repeated addition became multiplication.",
      hint: "Count groups, then count in each group.",
    },
  },
  "multiplication facts": {
    look: {
      title: "Multiplication Facts",
      instruction: "Use groups to solve facts.",
      cards: [
        { id: "fact", label: "3 x 2 = 6", lines: ["3 x 2", "= 6"], caption: "Fact" },
        { id: "add", label: "2 + 2 + 2", lines: ["2 + 2 + 2"], caption: "Repeated addition" },
      ],
    },
    tap: {
      slides: [
        { id: "groups", label: "Groups", lines: ["3 groups", "of 2"], caption: "Groups help us multiply.", speech: "Groups help us multiply." },
        { id: "repeated", label: "Repeated Addition", lines: ["2 + 2 + 2"], caption: "Repeated addition shows the same total.", speech: "Repeated addition shows the same total." },
        { id: "fact", label: "Fact", lines: ["3 x 2 = 6"], caption: "The multiplication fact is 3 x 2 = 6.", speech: "The multiplication fact is three times two equals six." },
      ],
    },
    try: {
      prompt: "3 x 2 means...",
      choices: [
        { id: "correct", label: "3 groups of 2", isCorrect: true },
        { id: "wrong", label: "3 tens and 2 ones", isCorrect: false },
      ],
      success: "Yes. 3 groups of 2.",
    },
    choose: {
      prompt: "Solve 3 x 2.",
      choices: [
        { id: "4", label: "4", isCorrect: false },
        { id: "6", label: "6", isCorrect: true },
        { id: "8", label: "8", isCorrect: false },
        { id: "10", label: "10", isCorrect: false },
      ],
      success: "Great! 3 x 2 = 6.",
    },
    play: {
      type: "rounds",
      title: "Solve the facts",
      instruction: "Choose the product.",
      rounds: [
        { prompt: "3 x 2 = ?", answer: "6", choices: ["4", "6", "8"] },
        { prompt: "2 x 5 = ?", answer: "10", choices: ["7", "10", "12"] },
      ],
      success: "The facts are solved.",
      hint: "Use equal groups.",
    },
  },
  "multiplication challenge": {
    look: {
      title: "Multiplication Challenge",
      instruction: "Review equal groups, addition, and facts.",
      cards: [
        { id: "groups", label: "Equal Groups", lines: ["2", "2", "2"], caption: "Groups" },
        { id: "facts", label: "Facts", lines: ["2 + 2 + 2", "3 x 2 = 6"], caption: "Connect" },
      ],
    },
    tap: {
      slides: [
        { id: "equal", label: "Equal Groups", lines: ["same amount"], caption: "Equal groups have the same number.", speech: "Equal groups have the same number." },
        { id: "repeated", label: "Repeated Addition", lines: ["2 + 2 + 2"], caption: "Repeated addition adds equal groups.", speech: "Repeated addition adds equal groups." },
        { id: "fact", label: "Fact", lines: ["3 x 2 = 6"], caption: "A fact names the groups and total.", speech: "A fact names the groups and total." },
      ],
    },
    try: {
      prompt: "These help us...",
      choices: [
        { id: "multiply", label: "Multiply", isCorrect: true },
        { id: "measure", label: "Measure", isCorrect: false },
      ],
      success: "Yes. They help us multiply.",
    },
    choose: {
      prompt: "Which is repeated addition?",
      choices: [
        { id: "correct", label: "2 + 2 + 2", isCorrect: true },
        { id: "wrong1", label: "235", isCorrect: false },
        { id: "wrong2", label: "3:30", isCorrect: false },
        { id: "wrong3", label: "4 + 2 + 2", isCorrect: false },
      ],
      success: "Great! That repeats the same addend.",
    },
    play: {
      type: "rounds",
      title: "Multiplication Mix",
      instruction: "Solve each multiplication task.",
      rounds: [
        { prompt: "3 groups of 2 = ?", answer: "6", choices: ["4", "6", "8"] },
        { prompt: "2 + 2 + 2 = ?", answer: "6", choices: ["4", "6", "8"] },
        { prompt: "3 x 2 = ?", answer: "6", choices: ["4", "6", "8"] },
      ],
      success: "You completed Multiplication Workshop.",
      hint: "All three show the same total.",
    },
  },
};

const storyLessons: Record<string, Grade2StageLesson> = {
  characters: {
    look: {
      title: "Story",
      instruction: "Look at who is in the story.",
      cards: [
        { id: "ben", label: "Ben", lines: ["Ben"], caption: "Character" },
        { id: "puppy", label: "Puppy", lines: ["Puppy"], caption: "Character" },
      ],
    },
    tap: {
      slides: [
        { id: "story", label: "Story", lines: ["Ben and his puppy", "went to the park"], caption: "Read the story picture.", speech: "Ben and his puppy went to the park." },
        { id: "character", label: "Character", lines: ["Ben", "Puppy"], caption: "Characters are who is in the story.", speech: "Characters are who is in the story." },
      ],
    },
    try: {
      prompt: "Who is in the story?",
      choices: [
        { id: "ben", label: "Ben", isCorrect: true },
        { id: "beach", label: "Beach", isCorrect: false },
      ],
      success: "Ben is a character.",
    },
    choose: {
      prompt: "Find a character.",
      choices: [
        { id: "ben", label: "Ben", isCorrect: true },
        { id: "park", label: "Park", isCorrect: false },
        { id: "tree", label: "Tree", isCorrect: false },
        { id: "bench", label: "Bench", isCorrect: false },
      ],
      success: "Great! Ben is a character.",
    },
    play: {
      type: "match",
      title: "Character Match",
      instruction: "Match the story word.",
      pairs: [
        { left: "Ben", right: "Boy" },
        { left: "Puppy", right: "Dog" },
        { left: "Girl", right: "Helper" },
        { left: "Teacher", right: "Adult" },
      ],
      success: "The characters are matched.",
      hint: "Characters are who is in the story.",
    },
  },
  setting: {
    look: {
      title: "Setting",
      instruction: "Look at where the story happens.",
      cards: [
        { id: "park", label: "Park", lines: ["Park"], caption: "Place" },
        { id: "trees", label: "Trees", lines: ["Trees"], caption: "Clue" },
      ],
    },
    tap: {
      slides: [
        { id: "where", label: "Where", lines: ["Park"], caption: "Setting tells where the story happens.", speech: "Setting tells where the story happens." },
        { id: "clue", label: "Clue", lines: ["trees", "bench"], caption: "Trees and bench are park clues.", speech: "Trees and bench are park clues." },
      ],
    },
    try: {
      prompt: "Where did Ben go?",
      choices: [
        { id: "park", label: "Park", isCorrect: true },
        { id: "school", label: "School", isCorrect: false },
      ],
      success: "The setting is the park.",
    },
    choose: {
      prompt: "Where did the story happen?",
      choices: [
        { id: "park", label: "Park", isCorrect: true },
        { id: "beach", label: "Beach", isCorrect: false },
        { id: "school", label: "School", isCorrect: false },
        { id: "farm", label: "Farm", isCorrect: false },
      ],
      success: "Great! The story happens in the park.",
    },
    play: {
      type: "match",
      title: "Setting Match",
      instruction: "Match setting clues.",
      pairs: [
        { left: "Park", right: "Trees" },
        { left: "Playground", right: "Slide" },
        { left: "School", right: "Classroom" },
        { left: "Market", right: "Stall" },
      ],
      success: "The setting clues are matched.",
      hint: "Setting tells where and when.",
    },
  },
  beginning: {
    look: {
      title: "Beginning",
      instruction: "Look at what happens first.",
      cards: [
        { id: "first", label: "First", lines: ["Ben", "walks puppy"], caption: "Beginning" },
        { id: "story", label: "Story Start", lines: ["Start"], caption: "First part" },
      ],
    },
    tap: {
      slides: [
        { id: "meaning", label: "Beginning", lines: ["first"], caption: "The beginning tells what happens first.", speech: "The beginning tells what happens first." },
        { id: "event", label: "First Event", lines: ["Ben and puppy", "go to park"], caption: "This starts the story.", speech: "Ben and his puppy go to the park." },
      ],
    },
    try: {
      prompt: "Beginning means...",
      choices: [
        { id: "first", label: "What happens first", isCorrect: true },
        { id: "last", label: "What happens last", isCorrect: false },
      ],
      success: "Beginning is first.",
    },
    choose: {
      prompt: "Which happens first?",
      choices: [
        { id: "correct", label: "Ben goes to park", isCorrect: true },
        { id: "wrong1", label: "Ben says thanks", isCorrect: false },
        { id: "wrong2", label: "Puppy is found", isCorrect: false },
        { id: "wrong3", label: "Ben sleeps at home", isCorrect: false },
      ],
      success: "Great! That is the beginning.",
    },
    play: {
      type: "sequence",
      title: "Story Order",
      instruction: "Put the story in order.",
      sequence: ["Beginning", "Middle", "Ending"],
      success: "The story order is complete.",
      hint: "Beginning comes first.",
    },
  },
  middle: {
    look: {
      title: "Middle",
      instruction: "Look at what happens next.",
      cards: [
        { id: "middle", label: "Middle", lines: ["Puppy runs", "Ben looks"], caption: "Next part" },
        { id: "search", label: "Search", lines: ["trees", "bench"], caption: "Story action" },
      ],
    },
    tap: {
      slides: [
        { id: "meaning", label: "Middle", lines: ["next"], caption: "The middle tells what happens next.", speech: "The middle tells what happens next." },
        { id: "event", label: "Middle Event", lines: ["Ben looks", "for puppy"], caption: "Ben searches in the park.", speech: "Ben looks for the puppy." },
      ],
    },
    try: {
      prompt: "Middle means...",
      choices: [
        { id: "next", label: "What happens next", isCorrect: true },
        { id: "title", label: "The story title", isCorrect: false },
      ],
      success: "Middle is what happens next.",
    },
    choose: {
      prompt: "Which is a middle event?",
      choices: [
        { id: "correct", label: "Ben looks for puppy", isCorrect: true },
        { id: "wrong1", label: "Story ends", isCorrect: false },
        { id: "wrong2", label: "Title", isCorrect: false },
        { id: "wrong3", label: "Ben eats breakfast", isCorrect: false },
      ],
      success: "Great! Ben looks for the puppy.",
    },
    play: {
      type: "sequence",
      title: "Story Order",
      instruction: "Put the story in order.",
      sequence: ["Puppy runs away", "Ben looks", "Girl points"],
      success: "The middle events are in order.",
      hint: "Use what happens next.",
    },
  },
  ending: {
    look: {
      title: "Ending",
      instruction: "Look at how the story ends.",
      cards: [
        { id: "found", label: "Ben found puppy", lines: ["Found", "Puppy"], caption: "Ending" },
        { id: "thanks", label: "Ben thanked girl", lines: ["Thank", "you"], caption: "Last part" },
      ],
    },
    tap: {
      slides: [
        { id: "meaning", label: "Ending", lines: ["last"], caption: "The ending tells how the story finishes.", speech: "The ending tells how the story finishes." },
        { id: "event", label: "Final Event", lines: ["Ben found", "his puppy"], caption: "Ben finds the puppy.", speech: "Ben finds his puppy." },
      ],
    },
    try: {
      prompt: "Ending means...",
      choices: [
        { id: "last", label: "What happens last", isCorrect: true },
        { id: "first", label: "What happens first", isCorrect: false },
      ],
      success: "Ending is last.",
    },
    choose: {
      prompt: "How did the story end?",
      choices: [
        { id: "correct", label: "Ben found his puppy", isCorrect: true },
        { id: "wrong1", label: "Ben lost a ball", isCorrect: false },
        { id: "wrong2", label: "Ben went to school", isCorrect: false },
        { id: "wrong3", label: "Puppy runs away", isCorrect: false },
      ],
      success: "Great! Ben found his puppy.",
    },
    play: {
      type: "rounds",
      title: "Ending Builder",
      instruction: "Choose the ending that fits.",
      rounds: [
        { prompt: "How did the story end?", answer: "Ben found puppy", choices: ["Ben found puppy", "Ben lost book", "Ben went home first"] },
      ],
      success: "The ending fits the story.",
      hint: "The ending finishes the story.",
    },
  },
  "story sequence": {
    look: {
      title: "Story Sequence",
      instruction: "Look at beginning, middle, and ending.",
      cards: [
        { id: "order", label: "B-M-E", lines: ["Beginning", "Middle", "Ending"], caption: "Story order" },
        { id: "events", label: "Events", lines: ["1", "2", "3"], caption: "Sequence" },
      ],
    },
    tap: {
      slides: [
        { id: "beginning", label: "Beginning", lines: ["First"], caption: "First, Ben and puppy go to the park.", speech: "First, Ben and puppy go to the park." },
        { id: "middle", label: "Middle", lines: ["Next"], caption: "Next, Ben looks for puppy.", speech: "Next, Ben looks for puppy." },
        { id: "ending", label: "Ending", lines: ["Last"], caption: "Last, Ben finds puppy.", speech: "Last, Ben finds puppy." },
      ],
    },
    try: {
      prompt: "A story sequence shows...",
      choices: [
        { id: "order", label: "Order of events", isCorrect: true },
        { id: "random", label: "Random words", isCorrect: false },
      ],
      success: "Sequence is order.",
    },
    choose: {
      prompt: "What comes after Beginning?",
      choices: [
        { id: "middle", label: "Middle", isCorrect: true },
        { id: "ending", label: "Ending", isCorrect: false },
        { id: "title", label: "Title", isCorrect: false },
        { id: "problem", label: "Problem", isCorrect: false },
      ],
      success: "Great! Middle comes next.",
    },
    play: {
      type: "sequence",
      title: "Put the story in order",
      instruction: "Arrange beginning, middle, ending.",
      sequence: ["Beginning", "Middle", "Ending"],
      success: "The story sequence is complete.",
      hint: "Start with beginning.",
    },
  },
  "story challenge": {
    look: {
      title: "Story Challenge",
      instruction: "Review characters, setting, and sequence.",
      cards: [
        { id: "parts", label: "Story Parts", lines: ["Character", "Setting", "Events"], caption: "Story map" },
        { id: "order", label: "Order", lines: ["Beginning", "Middle", "Ending"], caption: "Sequence" },
      ],
    },
    tap: {
      slides: [
        { id: "characters", label: "Characters", lines: ["Ben", "Puppy"], caption: "Characters are who.", speech: "Characters are who is in the story." },
        { id: "setting", label: "Setting", lines: ["Park"], caption: "Setting is where.", speech: "Setting is where the story happens." },
        { id: "sequence", label: "Sequence", lines: ["First", "Next", "Last"], caption: "Sequence is event order.", speech: "Sequence is event order." },
      ],
    },
    try: {
      prompt: "Who is in the story?",
      choices: [
        { id: "ben", label: "Ben", isCorrect: true },
        { id: "park", label: "Park", isCorrect: false },
      ],
      success: "Ben is a character.",
    },
    choose: {
      prompt: "Where did the story happen?",
      choices: [
        { id: "park", label: "Park", isCorrect: true },
        { id: "beach", label: "Beach", isCorrect: false },
        { id: "school", label: "School", isCorrect: false },
        { id: "farm", label: "Farm", isCorrect: false },
      ],
      success: "Great! The setting is the park.",
    },
    play: {
      type: "rounds",
      title: "Story Quest Mix",
      instruction: "Answer the story questions.",
      rounds: [
        { prompt: "Who is a character?", answer: "Ben", choices: ["Ben", "Park", "Tree"] },
        { prompt: "Where is the setting?", answer: "Park", choices: ["Beach", "Park", "School"] },
        { prompt: "What comes first?", answer: "Beginning", choices: ["Ending", "Middle", "Beginning"] },
      ],
      success: "You completed Story Quest.",
      hint: "Use the story parts.",
    },
  },
};

function normalizeKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

export function getGrade2StageLesson(worldId: string, topicTitle: string) {
  const key = normalizeKey(topicTitle);

  if (worldId === "grade2-vocabulary") {
    return vocabularyLessons[key] ?? null;
  }

  if (worldId === "grade2-place-value") {
    return placeValueLessons[key] ?? null;
  }

  if (worldId === "grade2-problems") {
    return problemSolvingLessons[key] ?? null;
  }

  if (worldId === "grade2-measurement") {
    return measurementLessons[key] ?? null;
  }

  if (worldId === "grade2-multiplication") {
    return multiplicationLessons[key] ?? null;
  }

  if (worldId === "grade2-story") {
    return storyLessons[key] ?? null;
  }

  return null;
}
