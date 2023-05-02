import{d as h}from"./iframe.860dda13.js";import{h as u,p as y,P as s}from"./preact.module.183e1c25.js";var c;function f(t,e){return e||(e=t.slice(0)),Object.freeze(Object.defineProperties(t,{raw:{value:Object.freeze(e)}}))}var l;function m(t,e){y?s(t,e):l=s(t,e,l)}var d=function(e){var o=e.showError,n=e.name,a=e.title,i=e.storyFn;e.domElement;var r=u(i,null);return r||(o({title:'Expecting a Preact element from the story: "'.concat(n,'" of "').concat(a,'".'),description:h(c||(c=f([`
        Did you forget to return the Preact element from the story?
        Use "() => (<MyComp/>)" or "() => { return <MyComp/>; }" when defining the story.
      `])))}),null)};function E(t,e){var o=t.storyFn,n=t.title,a=t.name,i=t.showMain,r=t.showError,p=t.forceRemount;p&&m(null,e),i(),m(u(d,{name:a,title:n,showError:r,storyFn:o,domElement:e}),e)}var F={framework:"preact"};export{F as parameters,E as renderToDOM};
//# sourceMappingURL=config.7c701b93.js.map
