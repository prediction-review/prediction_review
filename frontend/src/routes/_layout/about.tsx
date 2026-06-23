import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mx-16 my-8">
      <h1>
        <strong>About Prediction Review</strong>
      </h1>
      <p>
        Welcome to Prediction Review! Prediction Review allows anyone to evalute
        the reliability of past predictions and make more informed decisions.
        Often, institutions will make predictions which shape public policy but
        not follow up on those predictions, leaving the public in the dark about
        how reliable those predictions were and how much to trust that
        institution's future forecasts. Prediction Reivew casts light on past
        predictions, allowing researchers, policy makers, and the public to know
        who is trustworthy, who has insights into the future, and who is just
        making predictions that serve their own interests.
      </p>
    </div>
  );
}
