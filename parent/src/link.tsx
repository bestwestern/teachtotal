import { VNode } from "preact";

import { h } from "preact";
interface LinkProps {
  newRoute: Array<string>;
  text?: string;
  children?: VNode;
  className?: string;
  route: any; //preact signal containing current route
}
const Link = ({
  newRoute,
  route,
  text,
  children,
  className = "",
}: LinkProps) => {
  const url = window.location.origin + "/" + newRoute.join("/");
  const click = (e: MouseEvent) => {
    if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;
    e.preventDefault();
    if (JSON.stringify(route.value) === JSON.stringify(newRoute)) return;
    route.value = newRoute;
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
