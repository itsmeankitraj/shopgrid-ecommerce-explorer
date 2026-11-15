import { useEffect, useMemo, useState } from "react";
import Icon from "./Icon.jsx";
import { practiceResources, studyBooks } from "../data/studyResources.js";
import { calculateOhmsLaw, calculateSgpa, convertMeasurement } from "../utils/studyTools.js";
import "./StudySection.css";

const TOOL_CARDS = [
  {
    id: "planner",
    number: "01",
    mark: "P",
    title: "Project Planner",
    category: "PROJECT WORKFLOW",
    description: "Turn an engineering idea into a clear project brief you can save and revisit.",
    action: "Plan a project",
  },
  {
    id: "ohms",
    number: "02",
    mark: "Ω",
    title: "Ohm’s Law Calculator",
    category: "ELECTRONICS",
    description: "Calculate voltage, current, resistance and power from two known values.",
    action: "Open calculator",
  },
  {
    id: "converter",
    number: "03",
    mark: "↔",
    title: "Unit Converter",
    category: "ENGINEERING BASICS",
    description: "Convert common length, mass and temperature units without leaving the page.",
    action: "Convert units",
  },
  {
    id: "sgpa",
    number: "04",
    mark: "Σ",
    title: "SGPA Calculator",
    category: "ACADEMICS",
    description: "Calculate a credit-weighted SGPA from subject credits and grade points.",
    action: "Calculate SGPA",
  },
];

const UNIT_OPTIONS = {
  length: [
    { value: "mm", label: "Millimetre (mm)" },
    { value: "cm", label: "Centimetre (cm)" },
    { value: "m", label: "Metre (m)" },
    { value: "km", label: "Kilometre (km)" },
    { value: "in", label: "Inch (in)" },
    { value: "ft", label: "Foot (ft)" },
  ],
  mass: [
    { value: "mg", label: "Milligram (mg)" },
    { value: "g", label: "Gram (g)" },
    { value: "kg", label: "Kilogram (kg)" },
    { value: "lb", label: "Pound (lb)" },
  ],
  temperature: [
    { value: "C", label: "Celsius (°C)" },
    { value: "F", label: "Fahrenheit (°F)" },
    { value: "K", label: "Kelvin (K)" },
  ],
};

function ToolPanel({ title, subtitle, onClose, children }) {
  return (
    <div className="study-tool-panel" aria-live="polite">
      <div className="study-tool-panel-head">
        <div>
          <span className="study-panel-kicker">SHOPGRID STUDY TOOLS</span>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <button className="study-close-button" type="button" onClick={onClose} aria-label="Close tool">
          <Icon name="close" size={18} />
        </button>
      </div>
      {children}
    </div>
  );
}

function ProjectPlanner() {
  const [savedPlans, setSavedPlans] = useState(() => {
    try {
      const stored = window.localStorage.getItem("shopgrid-study-plans-v1");
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [form, setForm] = useState({ title: "", area: "Computer Science", goal: "", stack: "", timeline: "4 weeks" });
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      window.localStorage.setItem("shopgrid-study-plans-v1", JSON.stringify(savedPlans));
    } catch {
      setNotice("Your browser could not save this plan. Check local storage settings.");
    }
  }, [savedPlans]);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function savePlan(event) {
    event.preventDefault();
    const plan = {
      ...form,
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: new Date().toLocaleDateString(),
    };
    setSavedPlans((current) => [plan, ...current].slice(0, 8));
    setForm({ title: "", area: "Computer Science", goal: "", stack: "", timeline: "4 weeks" });
    setNotice("Project brief saved in this browser.");
  }

  function removePlan(id) {
    setSavedPlans((current) => current.filter((plan) => plan.id !== id));
    setNotice("Project brief removed.");
  }

  return (
    <div className="planner-layout">
      <form className="study-form planner-form" onSubmit={savePlan}>
        <div className="study-form-intro">
          <span className="study-form-step">START WITH THE PROBLEM</span>
          <h4>Create a project brief</h4>
          <p>Write down what you want to solve before you start coding or building.</p>
        </div>
        <label>
          Project name
          <input name="title" value={form.title} onChange={updateField} placeholder="e.g. Smart energy monitor" maxLength={70} required />
        </label>
        <div className="study-form-row">
          <label>
            Engineering area
            <select name="area" value={form.area} onChange={updateField}>
              <option>Computer Science</option>
              <option>AI & Machine Learning</option>
              <option>IoT & Electronics</option>
              <option>Mechanical Engineering</option>
              <option>Civil Engineering</option>
              <option>Other</option>
            </select>
          </label>
          <label>
            Target timeline
            <select name="timeline" value={form.timeline} onChange={updateField}>
              <option>1–2 weeks</option>
              <option>4 weeks</option>
              <option>6–8 weeks</option>
              <option>One semester</option>
            </select>
          </label>
        </div>
        <label>
          Problem / project goal
          <textarea name="goal" value={form.goal} onChange={updateField} placeholder="What problem will your project solve? Who will use it?" rows="3" maxLength={320} required />
        </label>
        <label>
          Tools or technologies (optional)
          <input name="stack" value={form.stack} onChange={updateField} placeholder="e.g. React, Python, ESP32, sensors" maxLength={120} />
        </label>
        <button className="study-primary-button" type="submit">Save project brief <Icon name="arrow" size={16} /></button>
        {notice && <p className="study-feedback" role="status">{notice}</p>}
      </form>

      <div className="saved-plans-panel">
        <div className="saved-plans-heading">
          <div>
            <span className="study-form-step">YOUR WORKSPACE</span>
            <h4>Saved project briefs</h4>
          </div>
          <span className="saved-plan-count">{savedPlans.length}/8</span>
        </div>
        {savedPlans.length > 0 ? (
          <div className="saved-plan-list">
            {savedPlans.map((plan) => (
              <article className="saved-plan-card" key={plan.id}>
                <div className="saved-plan-topline"><span>{plan.area}</span><span>{plan.createdAt}</span></div>
                <h5>{plan.title}</h5>
                <p>{plan.goal}</p>
                <div className="saved-plan-meta">
                  <span>{plan.timeline}</span>
                  {plan.stack && <span>{plan.stack}</span>}
                </div>
                <button className="study-text-button" type="button" onClick={() => removePlan(plan.id)}>Remove brief</button>
              </article>
            ))}
          </div>
        ) : (
          <div className="study-empty-state">
            <span className="study-empty-mark">+</span>
            <h5>Your next build starts here.</h5>
            <p>Save a project brief and it will stay in this browser when you come back.</p>
          </div>
        )}
        <p className="study-small-note">Saved on this device only. This is a planning aid, not cloud storage.</p>
      </div>
    </div>
  );
}

function OhmsLawCalculator() {
  const [values, setValues] = useState({ voltage: "12", current: "2", resistance: "" });
  const calculation = useMemo(() => calculateOhmsLaw(values), [values]);

  function updateValue(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function clearValues() {
    setValues({ voltage: "", current: "", resistance: "" });
  }

  return (
    <div className="calculator-layout">
      <div className="calculator-input-card">
        <span className="study-form-step">ENTER ANY TWO VALUES</span>
        <h4>Ohm’s law</h4>
        <p className="calculator-equation">V = I × R</p>
        <div className="calculator-fields">
          <label>Voltage <span>(volts, V)</span><input name="voltage" type="number" min="0" step="any" value={values.voltage} onChange={updateValue} placeholder="e.g. 12" /></label>
          <label>Current <span>(amperes, A)</span><input name="current" type="number" min="0" step="any" value={values.current} onChange={updateValue} placeholder="e.g. 2" /></label>
          <label>Resistance <span>(ohms, Ω)</span><input name="resistance" type="number" min="0" step="any" value={values.resistance} onChange={updateValue} placeholder="e.g. 6" /></label>
        </div>
        <button className="study-secondary-button" type="button" onClick={clearValues}>Clear values</button>
      </div>
      <div className="calculator-result-card">
        <span className="study-form-step">CALCULATED VALUES</span>
        {calculation.error ? (
          <div className="calculator-placeholder"><span>Ω</span><p>{calculation.error}</p></div>
        ) : (
          <>
            <div className="calculator-result-grid">
              <div><span>Voltage</span><strong>{calculation.result.voltage.toLocaleString(undefined, { maximumFractionDigits: 4 })} <small>V</small></strong></div>
              <div><span>Current</span><strong>{calculation.result.current.toLocaleString(undefined, { maximumFractionDigits: 4 })} <small>A</small></strong></div>
              <div><span>Resistance</span><strong>{calculation.result.resistance.toLocaleString(undefined, { maximumFractionDigits: 4 })} <small>Ω</small></strong></div>
              <div className="power-result"><span>Power</span><strong>{calculation.result.power.toLocaleString(undefined, { maximumFractionDigits: 4 })} <small>W</small></strong></div>
            </div>
            <p className="study-small-note">Ideal DC circuit calculation. Check component ratings and circuit conditions before using values in a real build.</p>
          </>
        )}
      </div>
    </div>
  );
}

function UnitConverter() {
  const [category, setCategory] = useState("length");
  const [value, setValue] = useState("100");
  const [fromUnit, setFromUnit] = useState("cm");
  const [toUnit, setToUnit] = useState("m");
  const units = UNIT_OPTIONS[category];
  const converted = convertMeasurement(value, category, fromUnit, toUnit);

  function changeCategory(event) {
    const nextCategory = event.target.value;
    setCategory(nextCategory);
    setFromUnit(UNIT_OPTIONS[nextCategory][0].value);
    setToUnit(UNIT_OPTIONS[nextCategory][1]?.value ?? UNIT_OPTIONS[nextCategory][0].value);
  }

  return (
    <div className="converter-layout">
      <div className="converter-controls">
        <label>Measurement type
          <select value={category} onChange={changeCategory}>
            <option value="length">Length</option>
            <option value="mass">Mass</option>
            <option value="temperature">Temperature</option>
          </select>
        </label>
        <label>Value
          <input type="number" step="any" value={value} onChange={(event) => setValue(event.target.value)} placeholder="Enter a value" />
        </label>
        <label>From
          <select value={fromUnit} onChange={(event) => setFromUnit(event.target.value)}>
            {units.map((unit) => <option value={unit.value} key={unit.value}>{unit.label}</option>)}
          </select>
        </label>
        <div className="converter-swap"><Icon name="arrow" size={17} /></div>
        <label>To
          <select value={toUnit} onChange={(event) => setToUnit(event.target.value)}>
            {units.map((unit) => <option value={unit.value} key={unit.value}>{unit.label}</option>)}
          </select>
        </label>
      </div>
      <div className="converter-output">
        <span className="study-form-step">CONVERTED VALUE</span>
        {converted.error ? <strong className="converter-error">{converted.error}</strong> : (
          <>
            <strong>{Number(converted.value.toPrecision(8)).toLocaleString(undefined, { maximumFractionDigits: 8 })}</strong>
            <span>{value || "0"} {fromUnit} = {Number(converted.value.toPrecision(8)).toLocaleString(undefined, { maximumFractionDigits: 8 })} {toUnit}</span>
          </>
        )}
      </div>
    </div>
  );
}

function SgpaCalculator() {
  const [subjects, setSubjects] = useState([
    { id: 1, name: "", credits: "", gradePoint: "" },
    { id: 2, name: "", credits: "", gradePoint: "" },
    { id: 3, name: "", credits: "", gradePoint: "" },
  ]);
  const [result, setResult] = useState(null);

  function updateSubject(id, field, value) {
    setSubjects((current) => current.map((subject) => subject.id === id ? { ...subject, [field]: value } : subject));
    setResult(null);
  }

  function addSubject() {
    if (subjects.length >= 10) return;
    setSubjects((current) => [...current, { id: Date.now(), name: "", credits: "", gradePoint: "" }]);
    setResult(null);
  }

  function removeSubject(id) {
    setSubjects((current) => current.filter((subject) => subject.id !== id));
    setResult(null);
  }

  function handleCalculate() {
    setResult(calculateSgpa(subjects));
  }

  return (
    <div className="sgpa-layout">
      <div className="sgpa-input-card">
        <div className="sgpa-table-head"><span>SUBJECT (OPTIONAL)</span><span>CREDITS</span><span>GRADE POINT (0–10)</span><span /></div>
        <div className="sgpa-rows">
          {subjects.map((subject, index) => (
            <div className="sgpa-row" key={subject.id}>
              <input aria-label={`Subject ${index + 1} name`} value={subject.name} onChange={(event) => updateSubject(subject.id, "name", event.target.value)} placeholder={`Subject ${index + 1}`} maxLength={40} />
              <input aria-label={`Subject ${index + 1} credits`} type="number" min="0.1" step="any" value={subject.credits} onChange={(event) => updateSubject(subject.id, "credits", event.target.value)} placeholder="4" />
              <input aria-label={`Subject ${index + 1} grade point`} type="number" min="0" max="10" step="any" value={subject.gradePoint} onChange={(event) => updateSubject(subject.id, "gradePoint", event.target.value)} placeholder="9" />
              <button className="study-remove-row" type="button" onClick={() => removeSubject(subject.id)} disabled={subjects.length === 1} aria-label={`Remove subject ${index + 1}`}><Icon name="close" size={15} /></button>
            </div>
          ))}
        </div>
        <div className="sgpa-actions">
          <button className="study-text-button" type="button" onClick={addSubject} disabled={subjects.length >= 10}>+ Add subject</button>
          <button className="study-primary-button" type="button" onClick={handleCalculate}>Calculate SGPA <Icon name="arrow" size={16} /></button>
        </div>
      </div>
      <div className="sgpa-result-card">
        <span className="study-form-step">YOUR SEMESTER RESULT</span>
        {result?.error ? (
          <p className="sgpa-result-message" role="alert">{result.error}</p>
        ) : result ? (
          <>
            <strong className="sgpa-score">{result.sgpa.toFixed(2)}<small>/ 10</small></strong>
            <p>Weighted SGPA across {result.subjectCount} subjects and {result.totalCredits} total credits.</p>
          </>
        ) : (
          <div className="calculator-placeholder"><span>Σ</span><p>Enter each subject’s credits and grade points, then calculate.</p></div>
        )}
        <p className="study-small-note">Uses Σ(credits × grade points) ÷ Σ(credits). Your university’s official grading rules may differ.</p>
      </div>
    </div>
  );
}

function ToolContent({ activeTool, onClose }) {
  if (activeTool === "planner") {
    return <ToolPanel title="Project Planner" subtitle="A simple place to shape an engineering project before you build it." onClose={onClose}><ProjectPlanner /></ToolPanel>;
  }
  if (activeTool === "ohms") {
    return <ToolPanel title="Ohm’s Law Calculator" subtitle="Enter any two electrical values. ShopGrid calculates the third value and power." onClose={onClose}><OhmsLawCalculator /></ToolPanel>;
  }
  if (activeTool === "converter") {
    return <ToolPanel title="Unit Converter" subtitle="Convert everyday measurement units used in engineering and science." onClose={onClose}><UnitConverter /></ToolPanel>;
  }
  if (activeTool === "sgpa") {
    return <ToolPanel title="SGPA Calculator" subtitle="Calculate a credit-weighted semester grade point average." onClose={onClose}><SgpaCalculator /></ToolPanel>;
  }
  return null;
}

function BookCard({ book }) {
  return (
    <article className="study-book-card">
      <div className={`study-book-cover ${book.tone}`} aria-hidden="true"><span>{book.mark}</span><small>SHOPGRID<br />READING LIST</small></div>
      <div className="study-book-copy">
        <div className="study-book-meta"><span>{book.topic}</span><span>{book.level}</span></div>
        <h4>{book.title}</h4>
        <p className="study-book-author">{book.author}</p>
        <p className="study-book-note">{book.note}</p>
        <div className="study-book-bottom"><span>{book.format}</span><a href={book.url} target="_blank" rel="noreferrer">Read online <Icon name="arrow" size={14} /></a></div>
      </div>
    </article>
  );
}

export default function StudySection() {
  const [activeTab, setActiveTab] = useState("tools");
  const [activeTool, setActiveTool] = useState("");
  const [bookSearch, setBookSearch] = useState("");

  const filteredBooks = useMemo(() => {
    const query = bookSearch.trim().toLowerCase();
    if (!query) return studyBooks;
    return studyBooks.filter((book) => [book.title, book.author, book.topic, book.note].join(" ").toLowerCase().includes(query));
  }, [bookSearch]);

  function changeTab(tab) {
    setActiveTab(tab);
    setActiveTool("");
  }

  return (
    <section className="study-section shell" id="study">
      <div className="study-section-heading">
        <div>
          <span className="eyebrow">THE SHOPGRID STUDY DESK</span>
          <h2>Make room to <em>learn.</em></h2>
          <p>Useful tools, thoughtful reading and places to practise — for the next thing you want to build.</p>
        </div>
        <div className="study-heading-stamp"><span>LEARN</span><strong>+</strong><span>BUILD</span></div>
      </div>

      <div className="study-tabs" aria-label="Study desk sections">
        <button className={activeTab === "tools" ? "active" : ""} type="button" aria-pressed={activeTab === "tools"} onClick={() => changeTab("tools")}>Project tools <span>04</span></button>
        <button className={activeTab === "books" ? "active" : ""} type="button" aria-pressed={activeTab === "books"} onClick={() => changeTab("books")}>Books & guides <span>06</span></button>
        <button className={activeTab === "practice" ? "active" : ""} type="button" aria-pressed={activeTab === "practice"} onClick={() => changeTab("practice")}>Practice links <span>04</span></button>
      </div>

      {activeTab === "tools" && (
        <div className="study-tab-panel" aria-label="Project tools">
          <div className="study-subheading"><div><span className="study-form-step">SMALL TOOLS. PRACTICAL WORK.</span><h3>Tools for your next project<span>.</span></h3></div><p>Pick a tool to open it. Your saved project briefs stay in this browser.</p></div>
          <div className="study-tool-grid">
            {TOOL_CARDS.map((tool) => (
              <article className={`study-tool-card ${activeTool === tool.id ? "selected" : ""}`} key={tool.id}>
                <div className="study-tool-card-top"><span className="study-tool-number">{tool.number}</span><span className="study-tool-mark">{tool.mark}</span></div>
                <span className="study-tool-category">{tool.category}</span>
                <h4>{tool.title}</h4>
                <p>{tool.description}</p>
                <button type="button" onClick={() => setActiveTool((current) => current === tool.id ? "" : tool.id)}>
                  {activeTool === tool.id ? "Close tool" : tool.action}<Icon name="arrow" size={15} />
                </button>
              </article>
            ))}
          </div>
          {activeTool && <ToolContent activeTool={activeTool} onClose={() => setActiveTool("")} />}
        </div>
      )}

      {activeTab === "books" && (
        <div className="study-tab-panel" aria-label="Books and guides">
          <div className="study-subheading books-subheading">
            <div><span className="study-form-step">CURATED READING</span><h3>Good books. Better foundations<span>.</span></h3></div>
            <label className="study-book-search"><Icon name="search" size={15} /><input value={bookSearch} onChange={(event) => setBookSearch(event.target.value)} placeholder="Search books or topics" aria-label="Search books" /></label>
          </div>
          {filteredBooks.length > 0 ? (
            <div className="study-book-grid">{filteredBooks.map((book) => <BookCard book={book} key={book.id} />)}</div>
          ) : (
            <div className="study-empty-state book-empty"><h5>No books found.</h5><p>Try searching by subject, title or author.</p></div>
          )}
          <p className="study-library-note">These links open the authors’ or project teams’ official reading pages. ShopGrid does not host or redistribute book files.</p>
        </div>
      )}

      {activeTab === "practice" && (
        <div className="study-tab-panel" aria-label="Practice links">
          <div className="study-subheading"><div><span className="study-form-step">LEARN BY DOING</span><h3>Practice makes progress<span>.</span></h3></div><p>Helpful destinations for coding practice, documentation and building a developer workflow.</p></div>
          <div className="study-practice-grid">
            {practiceResources.map((resource, index) => (
              <article className="study-practice-card" key={resource.id}>
                <div className="study-practice-top"><span>0{index + 1}</span><strong>{resource.mark}</strong></div>
                <span className="study-tool-category">{resource.kind}</span>
                <h4>{resource.name}</h4>
                <p>{resource.description}</p>
                <a href={resource.url} target="_blank" rel="noreferrer">Explore resource <Icon name="arrow" size={15} /></a>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
