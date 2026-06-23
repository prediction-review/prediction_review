import HomeCard from "@/components/Common/homeblock";
import { createFileRoute, Link } from "@tanstack/react-router";

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
  return (
    <div className="p-8 w-full">
      <h1 className="text-foreground text-center">Prediction Review</h1>
      <div className=" flex justify-center items-center">
        <p>
          <h3>Prediction followup so you know who to trust</h3>
        </p>
      </div>

      <Link to="/about">About</Link>
      <br />
      <HomeCard
        title="Demographics"
        description="Learn how the United Nations projections compares across countries 20 years later"
        links={[
          { text: "population", url: "/demographics" },
          { text: "fertility", url: "/demographics" },
        ]}
      />
    </div>
  );
}
