import { h } from "preact";
import { useState } from "preact/hooks";
import "./accordion.css";
interface AccordionProps {
  title: string;
  children: preact.ComponentChildren;
}
const Accordion = ({ title, children }: AccordionProps) => {
  const [show, setShow] = useState(false);
  const onAccordionClick = () => {
    setShow(!show);
  };

  return (
    <div className="accordion">
      <div className="accordion-title">
        <h3>{title}</h3>
        <button onClick={() => onAccordionClick()}>
          {!show ? "Show" : "Hide"}
        </button>
      </div>
      {show && <div>{children}</div>}
    </div>
  );
};

export default Accordion;
