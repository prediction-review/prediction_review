import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  ResponsiveContainer,
} from "recharts";

// ---------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------

interface Datapoint {
  year_analyzed: number;
  value: number;
  scenario: string;
}

interface PopulationChartProps {
  data: Datapoint[];
  title?: string;
}

// ---------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------

// Map scenario names to colors
const SCENARIO_COLORS: Record<string, string> = {
  Estimates: "#2563eb",  // blue
  Medium: "#16a34a",     // green
  High: "#dc2626",       // red
  Low: "#d97706",        // amber
  Constant: "#9333ea",   // purple
};

// Display order — Estimates on top visually (rendered last)
const SCENARIO_ORDER = ["Low", "High", "Medium", "Estimates"];

// ---------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------

/**
 * Transforms a flat array of datapoints into the shape Recharts expects:
 * one object per year, with each scenario as a key.
 *
 * Input:
 * [
 *   { year_analyzed: 2000, value: 6000000, scenario: "Estimates" },
 *   { year_analyzed: 2000, value: 6100000, scenario: "High" },
 * ]
 *
 * Output:
 * [
 *   { year: 2000, Estimates: 6000000, High: 6100000 },
 * ]
 */
function pivotData(data: Datapoint[]): Record<string, number>[] {
  const byYear: Record<number, Record<string, number>> = {};

  for (const point of data) {
    if (!byYear[point.year_analyzed]) {
      byYear[point.year_analyzed] = { year: point.year_analyzed };
    }
    byYear[point.year_analyzed][point.scenario] = point.value;
  }

  return Object.values(byYear).sort((a, b) => a.year - b.year);
}

/**
 * Formats large population numbers with commas.
 * e.g. 8000000000 → "8,000,000,000"
 */
function formatPopulation(value: number): string {
  return value.toLocaleString();
}

/**
 * Shorter axis label — divides by 1,000,000 and adds "M"
 * e.g. 8000000000 → "8,000M"
 */
function formatYAxis(value: number): string {
  return `${(value / 1_000_000).toLocaleString()}M`;
}

// ---------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------

export function PopulationChart({ data, title }: PopulationChartProps) {
  const chartData = pivotData(data);

  // Derive which scenarios are actually present in the data
  const scenarios = SCENARIO_ORDER.filter((s) =>
    data.some((d) => d.scenario === s)
  );

  return (
    <div className="w-full p-4">
      {title && (
        <h2 className="text-xl font-semibold text-foreground mb-4">{title}</h2>
      )}

      {/* ResponsiveContainer makes the chart fill its parent width */}
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
        >
          {/* Grid lines */}
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          {/* X axis — years */}
          <XAxis
            dataKey="year"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickCount={10}
            label={{ value: "Year", position: "insideBottom", offset: -5 }}
          />

          {/* Y axis — population with formatted labels */}
          <YAxis
            tickFormatter={formatYAxis}
            width={80}
            label={{
              value: "Population",
              angle: -90,
              position: "insideLeft",
              offset: 10,
            }}
          />

          {/* Tooltip shown on mouseover */}
          <Tooltip
            formatter={(value: number, name: string) => [
              formatPopulation(value),
              name,
            ]}
            labelFormatter={(label) => `Year: ${label}`}
          />

          {/* Legend */}
          <Legend verticalAlign="top" height={36} />

          {/* One Line per scenario */}
          {scenarios.map((scenario) => (
            <Line
              key={scenario}
              type="monotone"
              dataKey={scenario}
              stroke={SCENARIO_COLORS[scenario] ?? "#6b7280"}
              strokeWidth={2}
              dot={false}          // hides individual data point dots
              connectNulls={true}  // connects line across missing years
            />
          ))}

          {/* Brush — the slider on the x axis */}
          <Brush
            dataKey="year"
            height={30}
            stroke="#6b7280"
            travellerWidth={8}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
