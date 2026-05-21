import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import LineChart from "@/components/Graphs/LineChart";
import type { Region } from "@/types";

interface Datapoint {
  scenario: string
  year_analyzed: number
  value: number
}

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
  head: () => ({
    meta: [
      {
        title: "Prediction Review",
      },
    ],
  }),
});

function Dashboard() {
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [datapoints, setDatapoints] = useState<Datapoint[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/regions")
      .then((res) => res.json())
      .then((data) => setRegions(data.sort((a: Region, b: Region) => 
        a.region_name.localeCompare(b.region_name)
      )));
  }, []);

  useEffect(() => {
    if (selectedRegion === null) return;

    Promise.all([
      // 2000 report — Low, Medium, High (ids 3, 4, 5)
      // TODO: these scenarios are hard-coded, make this dynamic
      fetch(
        `http://localhost:8000/api/v1/datapoints/?region_id=${selectedRegion}&report_id=1&scenario_id=3`,
      ).then((res) => res.json()),
      fetch(
        `http://localhost:8000/api/v1/datapoints/?region_id=${selectedRegion}&report_id=1&scenario_id=4`,
      ).then((res) => res.json()),
      fetch(
        `http://localhost:8000/api/v1/datapoints/?region_id=${selectedRegion}&report_id=1&scenario_id=5`,
      ).then((res) => res.json()),
      // 2022 report — Estimates only (id 2)
      fetch(
        `http://localhost:8000/api/v1/datapoints/?region_id=${selectedRegion}&report_id=2&scenario_id=2`,
      ).then((res) => res.json()),
    ]).then(([low, medium, high, estimates]) => {
      setDatapoints([...low, ...medium, ...high, ...estimates]);
    });
  }, [selectedRegion]);

  return (
    <div className="p-8 w-full">
      <h1 className="text-3xl font-bold text-foreground">Prediction Review</h1>
      <select onChange={(e) => setSelectedRegion(Number(e.target.value))}>
        <option value="">Select a region</option>
        {regions.map((region: Region) => (
          <option key={region.id} value={String(region.id)}>
            {region.region_name}
          </option>
        ))}
      </select>
      <LineChart data={datapoints} title="Population Projections" />
    </div>
  );
}
