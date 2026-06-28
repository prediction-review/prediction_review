import { createFileRoute } from "@tanstack/react-router";
import HomeCard from "@/components/Common/Homeblock";

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
    <div className="py-12 w-4/5 m-auto">
      <h1 className="text-foreground text-center">Prediction Review</h1>
      <div className=" flex justify-center items-center">
        <p>
          <h3>Prediction followup so you know who to trust</h3>
        </p>
      </div>

      <br />
      <HomeCard
        title="Demographics"
        description="Learn how the United Nations projections compare across countries 20 years later"
        mainLink="/demographics"
        links={[
          { text: "population", url: "/demographics" },
          { text: "fertility", url: "/demographics" },
        ]}
      />
    </div>
  );
}
