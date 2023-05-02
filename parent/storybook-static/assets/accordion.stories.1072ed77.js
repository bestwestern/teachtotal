import"./preact.module.183e1c25.js";import{p as i,e as o}from"./jsxRuntime.module.30cce17c.js";const a=({title:n,children:e})=>{const[t,c]=i(!1),s=()=>{c(!t)};return o("div",{className:"accordion",children:[o("div",{className:"accordion-title",children:[o("h3",{children:n}),o("button",{onClick:()=>s(),children:t?"Hide":"Show"})]}),t&&o("div",{children:e})]})},r=a,g={parameters:{storySource:{source:`import { h } from "preact";
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
`,locationsMap:{primary:{startLoc:{col:17,line:16},endLoc:{col:1,line:20},startBody:{col:17,line:16},endBody:{col:1,line:20}}}}},title:"Example/Button",component:r},l=n=>o(r,{...n,children:o("h3",{children:"jl"})}),d=l.bind({});d.args={title:"def"};const h=["Primary"];export{d as Primary,h as __namedExportsOrder,g as default};
//# sourceMappingURL=accordion.stories.1072ed77.js.map
