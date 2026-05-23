import { SCENARIO_STYLES } from "@/constants/scenarios";
import {
  Brush,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Datapoint {
  scenario: string;
  year_analyzed: number;
  value: number;
}

interface LineChartObjectProps {
  data: Datapoint[];
  title: string;
}

function pivotData(data: Datapoint[]): Record<string, number>[] {
  const year_sort: Record<number, Record<string, number>> = {};
  for (const record of data) {
    if (!year_sort[record.year_analyzed])
      year_sort[record.year_analyzed] = { year_analyzed: record.year_analyzed };
    year_sort[record.year_analyzed][record.scenario] = record.value;
  }

  return Object.values(year_sort).sort(
    (a, b) => a.year_analyzed - b.year_analyzed,
  );
}

export default function LineChartObject({ data, title }: LineChartObjectProps) {
  const formattedData = pivotData(data);

  function getScenarios(data: Datapoint[]): string[] {
    const scenarioSet = new Set<string>();

    for (const record of data) {
      scenarioSet.add(record.scenario);
    }

    return Array.from(scenarioSet.values());
  }

  const scenarioList = getScenarios(data);

  return (
    <div className="w-full">
      <h2 className="text-center text-xl font-semibold text-foreground mb-4">
        {title}
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={formattedData}>
          <XAxis dataKey="year_analyzed" />
          <YAxis width={80} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Brush />
          {scenarioList.map((scenario) => (
            <Line
              key={scenario}
              dataKey={scenario}
              stroke={SCENARIO_STYLES[scenario]?.colour ?? "#0000bb"}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
