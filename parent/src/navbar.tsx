import { h } from "preact";
import Link from "./link";

const Navbar = ({ route }) => {
  const lis = [
    { text: import.meta.env.VITE_MENURESULTS, newRoute: "" },
    { text: import.meta.env.VITE_MENUPROGRAMMES, newRoute: "programmes" },
    { text: import.meta.env.VITE_MENUDEVICES, newRoute: "devices" },
  ];
  return (
    <nav class=" fixed w-full z-20 bottom-0 left-0 border-t border-gray-200">
      <ul class="text-sm font-medium text-center text-gray-500 rounded-lg divide-x divide-gray-200 shadow flex">
        {lis.map(({ text, newRoute }) => {
          const className =
            route.value[0] === newRoute
              ? "inline-block p-4 w-full focus:outline-none bg-gray-100 text-gray-900 rounded-l-lg active"
              : "inline-block p-4 w-full focus:outline-none bg-white hover:text-gray-700 hover:bg-gray-50";

          return (
            <li class="w-full">
              <Link
                route={route}
                newRoute={[newRoute]}
                className={className}
                text={text}
              ></Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
export default Navbar;
// class="inline-block p-4 w-full bg-white hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
