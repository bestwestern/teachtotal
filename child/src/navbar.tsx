import { h } from "preact";
import connect from "./assets/connect.svg";
import Link from "./link";

interface NavbarProps {
  route: Array<string>;
  txt: string;
  targetReached: boolean;
  useConnectImage: boolean;
  setRoute: (route: Array<string>) => void;
}
const Navbar = ({
  route,
  txt,
  targetReached,
  setRoute,
  useConnectImage,
  showCheckMark,
}: NavbarProps) => {
  console.log({ showCheckMark });
  return (
    <div class="pb-20">
      <nav class="bg-white px-2 sm:px-4 py-2.5  fixed w-full z-20 top-0 left-0 border-b border-gray-200">
        <div class="container flex flex-wrap justify-between items-center mx-auto">
          {showCheckMark ? (
            <span class="self-center text-xl font-semibold whitespace-nowrap ">
              &#10003; {txt}
            </span>
          ) : (
            <span class="self-center text-xl font-semibold whitespace-nowrap ">
              {txt}
            </span>
          )}

          <div class="flex md:order-2">
            <Link
              route={route}
              setRoute={setRoute}
              className="text-gray-500  hover:bg-gray-100  focus:outline-none   rounded-lg text-sm p-2"
            >
              {useConnectImage ? (
                <img class="w-8 h-8" src={connect} />
              ) : (
                <svg
                  class="w-8 h-8"
                  aria-hidden="true"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.588,24.297c0,0-0.024,0.59,0.553,0.59c0.718,0,6.652-0.008,6.652-0.008l0.01-5.451c0,0-0.094-0.898,0.777-0.898h2.761
    c1.031,0,0.968,0.898,0.968,0.898l-0.012,5.434c0,0,5.628,0,6.512,0c0.732,0,0.699-0.734,0.699-0.734V14.076L13.33,5.913
    l-9.742,8.164C3.588,14.077,3.588,24.297,3.588,24.297z"
                  />
                  <path d="M0,13.317c0,0,0.826,1.524,2.631,0l10.781-9.121l10.107,9.064c2.088,1.506,2.871,0,2.871,0L13.412,1.504L0,13.317z" />
                  <polygon points="23.273,4.175 20.674,4.175 20.685,7.328 23.273,9.525 		" />
                </svg>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
