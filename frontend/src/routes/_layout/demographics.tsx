import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import LineChart from "@/components/Graphs/LineChart";
import type { Region } from "@/types";

export const Route = createFileRoute("/_layout/demographics")({
  component: RouteComponent,
});

interface Datapoint {
  scenario: string;
  year_analyzed: number;
  value: number;
}

interface getRegionProps {
  region_iso3: string;
  regionList: Region[]
}

function RouteComponent() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>();
  const [populationDatapoints, setPopulationDatapoints] = useState<Datapoint[]>(
    [],
  );
  const [fertilityDatapoints, setFertilityDatapoints] = useState<Datapoint[]>(
    [],
  );

  function getRegion({region_iso3, regionList}: getRegionProps) {
    // return region object where region_iso3 == region.iso3
    return regionList.find((region) => region.iso3 === region_iso3)
  }

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/regions`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = 
          data.sort((a: Region, b: Region) =>
            a.region_name.localeCompare(b.region_name),
          )
        setRegions(sorted)

        const randomRegion =
          sorted[Math.floor(Math.random() * sorted.length)];
        setSelectedRegion(randomRegion);
      });
  }, []);

  useEffect(() => {
    if (selectedRegion === null) return;

    Promise.all([
      // populations
      // 2000 report — Low, Medium, High (ids 3, 4, 5)
      // TODO: these scenarios are hard-coded, make this dynamic
      fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/datapoints/?region_id=${selectedRegion?.id}&report_id=1&datatype_id=1&scenario_id=3`,
      ).then((res) => res.json()),
      fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/datapoints/?region_id=${selectedRegion?.id}&report_id=1&datatype_id=1&scenario_id=4`,
      ).then((res) => res.json()),
      fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/datapoints/?region_id=${selectedRegion?.id}&report_id=1&datatype_id=1&scenario_id=5`,
      ).then((res) => res.json()),
      // 2022 report — Estimates only (id 2)
      fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/datapoints/?region_id=${selectedRegion?.id}&report_id=2&datatype_id=1&scenario_id=2`,
      ).then((res) => res.json()),
    ]).then(([low, medium, high, estimates]) => {
      setPopulationDatapoints([...low, ...medium, ...high, ...estimates]);
    });

    Promise.all([
      // fertility
      // 2000 report — Low, Medium, High (ids 3, 4, 5)
      // TODO: these scenarios are hard-coded, make this dynamic
      fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/datapoints/?region_id=${selectedRegion?.id}&report_id=1&datatype_id=2&scenario_id=3`,
      ).then((res) => res.json()),
      fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/datapoints/?region_id=${selectedRegion?.id}&report_id=1&datatype_id=2&scenario_id=4`,
      ).then((res) => res.json()),
      fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/datapoints/?region_id=${selectedRegion?.id}&report_id=1&datatype_id=2&scenario_id=5`,
      ).then((res) => res.json()),
      // 2022 report — Estimates only (id 2)
      fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/datapoints/?region_id=${selectedRegion?.id}&report_id=2&datatype_id=2&scenario_id=2`,
      ).then((res) => res.json()),
    ]).then(([low, medium, high, estimates]) => {
      setFertilityDatapoints([...low, ...medium, ...high, ...estimates]);
    });
  }, [selectedRegion]);

  return (
    <div className="p-8">
      <select value={selectedRegion ? String(selectedRegion.iso3) : ""} onChange={(e) => setSelectedRegion(getRegion({ region_iso3: e.target.value, regionList: regions}) ?? null)}>
        <option value="">Select a region</option>
        {regions.map((region: Region) => (
          <option key={region.id} value={String(region.iso3)}>
            {region.region_name}
          </option>
        ))}
      </select>
      <LineChart data={populationDatapoints} title="Population Projections" />
      <LineChart data={fertilityDatapoints} title="Fertility Projections" />
    </div>
  );
}
