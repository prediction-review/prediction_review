import { Link } from "@tanstack/react-router";

interface LinkItem {
  text: string;
  url: string;
}

interface HomeCardProps {
  title: string;
  description: string;
  mainLink: string
  links: LinkItem[];
}

export default function HomeCard({ title, description, mainLink, links }: HomeCardProps) {
  return (
    <Link to={mainLink}>
    <div className="card flex flex-row justify-between p-1">
      <div className="flex flex-col">
        <h2 className="flex flex-1 justify-between p-1">{title}</h2>
        <p className="p-1">{description}</p>
      </div>
      <div className="flex flex-col justify-evenly">
        {links.map((link) => (
          <Link className="p-1 underline" key={link.url} to={link.url}>
            {link.text}
          </Link>
        ))}
      </div>
    </div>
    </Link>
  );
}
