const LENGTH_TO_METRES = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
};

const MASS_TO_KILOGRAMS = {
  mg: 0.000001,
  g: 0.001,
  kg: 1,
  lb: 0.45359237,
};

export function calculateOhmsLaw(values) {
  const keys = ["voltage", "current", "resistance"];
  const entered = keys.filter((key) => String(values[key] ?? "").trim() !== "");

  if (entered.length !== 2) {
    return { error: "Enter exactly two known values to calculate the third." };
  }

  const numbers = Object.fromEntries(
    entered.map((key) => [key, Number(values[key])]),
  );

  if (entered.some((key) => !Number.isFinite(numbers[key]) || numbers[key] <= 0)) {
    return { error: "Use positive numbers greater than zero." };
  }

  let voltage;
  let current;
  let resistance;

  if (entered.includes("voltage") && entered.includes("current")) {
    voltage = numbers.voltage;
    current = numbers.current;
    resistance = voltage / current;
  } else if (entered.includes("voltage") && entered.includes("resistance")) {
    voltage = numbers.voltage;
    resistance = numbers.resistance;
    current = voltage / resistance;
  } else {
    current = numbers.current;
    resistance = numbers.resistance;
    voltage = current * resistance;
  }

  const power = voltage * current;
  const result = { voltage, current, resistance, power };

  if (Object.values(result).some((number) => !Number.isFinite(number))) {
    return { error: "The result is outside the supported numeric range." };
  }

  return { result };
}

export function convertMeasurement(value, category, fromUnit, toUnit) {
  if (String(value ?? "").trim() === "") return { error: "Enter a value to convert." };
  const amount = Number(value);
  if (!Number.isFinite(amount)) return { error: "Enter a valid number." };

  if (category === "temperature") {
    let celsius;
    if (fromUnit === "C") celsius = amount;
    else if (fromUnit === "F") celsius = (amount - 32) * (5 / 9);
    else if (fromUnit === "K") celsius = amount - 273.15;
    else return { error: "Choose a supported temperature unit." };

    let converted;
    if (toUnit === "C") converted = celsius;
    else if (toUnit === "F") converted = (celsius * 9) / 5 + 32;
    else if (toUnit === "K") converted = celsius + 273.15;
    else return { error: "Choose a supported temperature unit." };

    return { value: converted };
  }

  const factors = category === "length" ? LENGTH_TO_METRES : category === "mass" ? MASS_TO_KILOGRAMS : null;
  if (!factors || !(fromUnit in factors) || !(toUnit in factors)) {
    return { error: "Choose a supported unit conversion." };
  }

  return { value: (amount * factors[fromUnit]) / factors[toUnit] };
}

export function calculateSgpa(subjects) {
  if (!Array.isArray(subjects) || subjects.length === 0) {
    return { error: "Add at least one subject first." };
  }

  const hasIncompleteRow = subjects.some((subject) => {
    const hasAnyValue = subject.name.trim() !== "" || subject.credits !== "" || subject.gradePoint !== "";
    const isComplete = subject.credits !== "" && subject.gradePoint !== "";
    return hasAnyValue && !isComplete;
  });

  if (hasIncompleteRow) {
    return { error: "Complete or remove each started subject row." };
  }

  const completed = subjects.filter((subject) => subject.credits !== "" && subject.gradePoint !== "");
  if (completed.length === 0) return { error: "Enter credits and grade points for at least one subject." };

  const invalid = completed.some((subject) => {
    const credits = Number(subject.credits);
    const gradePoint = Number(subject.gradePoint);
    return !Number.isFinite(credits) || credits <= 0 || !Number.isFinite(gradePoint) || gradePoint < 0 || gradePoint > 10;
  });

  if (invalid) return { error: "Credits must be positive; grade points must be between 0 and 10." };

  const totalCredits = completed.reduce((sum, subject) => sum + Number(subject.credits), 0);
  const weightedPoints = completed.reduce(
    (sum, subject) => sum + Number(subject.credits) * Number(subject.gradePoint),
    0,
  );

  return { sgpa: weightedPoints / totalCredits, totalCredits, subjectCount: completed.length };
}
