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

export function calculateSgpa(marks) {
  if (!Array.isArray(marks) || marks.length === 0) {
    return { error: "Enter marks for at least one subject." };
  }

  const enteredMarks = marks.filter((mark) => String(mark ?? "").trim() !== "");
  if (enteredMarks.length === 0) return { error: "Enter marks for at least one subject." };

  const numericMarks = enteredMarks.map(Number);
  if (numericMarks.some((mark) => !Number.isFinite(mark) || mark < 0 || mark > 100)) {
    return { error: "Marks must be valid numbers between 0 and 100." };
  }

  const totalGradePoints = numericMarks.reduce((total, mark) => {
    if (mark >= 90) return total + 10;
    if (mark >= 80) return total + 9;
    if (mark >= 70) return total + 8;
    if (mark >= 60) return total + 7;
    if (mark >= 50) return total + 6;
    if (mark >= 40) return total + 5;
    return total;
  }, 0);

  return {
    sgpa: totalGradePoints / numericMarks.length,
    subjectCount: numericMarks.length,
  };
}

export function calculateCgpa(semesterGrades) {
  if (!Array.isArray(semesterGrades) || semesterGrades.length === 0) {
    return { error: "Enter an SGPA for at least one semester." };
  }

  const enteredGrades = semesterGrades.filter((grade) => String(grade ?? "").trim() !== "");
  if (enteredGrades.length === 0) return { error: "Enter an SGPA for at least one semester." };

  const numericGrades = enteredGrades.map(Number);
  if (numericGrades.some((grade) => !Number.isFinite(grade) || grade < 0 || grade > 10)) {
    return { error: "Semester SGPAs must be valid numbers between 0 and 10." };
  }

  const total = numericGrades.reduce((sum, grade) => sum + grade, 0);
  return { cgpa: total / numericGrades.length, semesterCount: numericGrades.length };
}
