import test from "node:test";
import assert from "node:assert/strict";
import { calculateOhmsLaw, calculateSgpa, convertMeasurement } from "./studyTools.js";

test("Ohm's law calculates resistance and power from voltage and current", () => {
  const { result } = calculateOhmsLaw({ voltage: "12", current: "2", resistance: "" });
  assert.equal(result.resistance, 6);
  assert.equal(result.power, 24);
});

test("Ohm's law rejects anything other than exactly two known values", () => {
  assert.match(calculateOhmsLaw({ voltage: "12", current: "", resistance: "" }).error, /exactly two/);
  assert.match(calculateOhmsLaw({ voltage: "12", current: "2", resistance: "6" }).error, /exactly two/);
});

test("unit converter handles metric length and temperature", () => {
  assert.equal(convertMeasurement("100", "length", "cm", "m").value, 1);
  assert.equal(convertMeasurement("32", "temperature", "F", "C").value, 0);
  assert.match(convertMeasurement("", "length", "cm", "m").error, /Enter a value/);
});

test("SGPA uses credit-weighted grade points", () => {
  const result = calculateSgpa([
    { name: "Maths", credits: "4", gradePoint: "9" },
    { name: "Physics", credits: "3", gradePoint: "8" },
  ]);
  assert.equal(result.totalCredits, 7);
  assert.equal(result.sgpa, (4 * 9 + 3 * 8) / 7);
});

test("SGPA reports incomplete rows instead of silently ignoring them", () => {
  const result = calculateSgpa([{ name: "Maths", credits: "4", gradePoint: "" }]);
  assert.match(result.error, /Complete or remove/);
});

test("Ohm's law derives voltage from current and resistance", () => {
  const { result } = calculateOhmsLaw({ voltage: "", current: "2", resistance: "6" });
  assert.equal(result.voltage, 12);
  assert.equal(result.power, 24);
});

test("Ohm's law rejects zero and non-numeric inputs", () => {
  assert.match(calculateOhmsLaw({ voltage: "0", current: "2", resistance: "" }).error, /positive numbers/);
  assert.match(calculateOhmsLaw({ voltage: "abc", current: "2", resistance: "" }).error, /positive numbers/);
});

test("unit converter handles mass and rejects a blank input", () => {
  assert.equal(convertMeasurement("1", "mass", "kg", "g").value, 1000);
  assert.match(convertMeasurement("", "length", "cm", "m").error, /Enter a value/);
});

test("SGPA rejects invalid grade points and zero credits", () => {
  assert.match(calculateSgpa([{ name: "Maths", credits: "0", gradePoint: "9" }]).error, /Credits must be positive/);
  assert.match(calculateSgpa([{ name: "Maths", credits: "4", gradePoint: "11" }]).error, /grade points must be between 0 and 10/);
});
