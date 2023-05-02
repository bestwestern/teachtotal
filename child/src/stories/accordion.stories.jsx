import { h } from "preact";
import Accordion from "../accordion";

// More on default export: https://storybook.js.org/docs/preact/writing-stories/introduction#default-export
export default {
  title: "Example/Button",
  component: Accordion,
  // More on argTypes: https://storybook.js.org/docs/preact/api/argtypes
  // argTypes: {
  //   backgroundColor: { control: "color" },
  //   onClick: { action: "onClick" },
  // },
};

// More on component templates: https://storybook.js.org/docs/preact/writing-stories/introduction#using-args
const Template = (args) => (
  <Accordion {...args}>
    <h3>jl</h3>
  </Accordion>
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/preact/writing-stories/args
Primary.args = {
  title: "def",
};

// export const Secondary = Template.bind({});
// Secondary.args = {
//   label: "Button",
// };

// export const Large = Template.bind({});
// Large.args = {
//   size: "large",
//   label: "Button",
// };

// export const Small = Template.bind({});
// Small.args = {
//   size: "small",
//   label: "Button",
// };
