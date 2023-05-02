import { VNode } from "preact";

import { h } from "preact";
interface LinkProps {
  route: Array<string>;
  setRoute: (route: Array<string>) => void;
  text?: string;
  children?: VNode;
  className?: string;
}
const Link = ({
  route,
  text,
  children,
  setRoute,
  className = "",
}: LinkProps) => {
  const url = window.location.origin + "/" + route.join("/");
  const click = (e: MouseEvent) => {
    if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;
    e.preventDefault();
    setRoute(route);
    // window.ww.postMessage({ routeChange: route });
    history.pushState(null, "", url);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return false;
  };
  return (
    <a href={url} onClick={click} class={className}>
      {children || text || url}
    </a>
  );
};
export default Link;
