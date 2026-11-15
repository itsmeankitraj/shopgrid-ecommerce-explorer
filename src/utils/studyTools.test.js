import test from "node:test";
import assert from "node:assert/strict";
import { calculateCgpa, calculateOhmsLaw, calculateSgpa, convertMeasurement } from "./studyTools.js";

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

test("SGPA maps subject marks to grade points and averages entered subjects", () => {
  const result = calculateSgpa(["95", "80", "72", "65", "58", "40", "39", ""]);
  assert.equal(result.subjectCount, 7);
  assert.equal(result.sgpa, 45 / 7);
});

test("SGPA uses the grade-point boundary for each mark band", () => {
  assert.equal(calculateSgpa(["90", "80", "70", "60", "50", "40", "0"]).sgpa, 45 / 7);
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

test("SGPA rejects out-of-range and non-numeric marks and requires an entry", () => {
  assert.match(calculateSgpa([""]).error, /at least one subject/);
  assert.match(calculateSgpa(["101"]).error, /between 0 and 100/);
  assert.match(calculateSgpa(["abc"]).error, /between 0 and 100/);
});

test("CGPA averages entered semester SGPAs", () => {
  const result = calculateCgpa(["8.5", "", "9.5"]);
  assert.equal(result.semesterCount, 2);
  assert.equal(result.cgpa, 9);
});

test("CGPA rejects invalid semester SGPAs and requires an entry", () => {
  assert.match(calculateCgpa(["", ""]).error, /at least one semester/);
  assert.match(calculateCgpa(["10.1"]).error, /between 0 and 10/);
  assert.match(calculateCgpa(["abc"]).error, /between 0 and 10/);
});
