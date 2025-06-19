import{j as e,m as i}from"./proxy.CiCI-KIP.js";import{r as d,R as c}from"./index.B52nOzfP.js";import{b as p}from"./utils.W52PejD4.js";import{B as h}from"./button.Cr2OTWVL.js";import{c as l}from"./createLucideIcon.C8e0Pve4.js";/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=l("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=l("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=l("Satellite",[["path",{d:"M13 7 9 3 5 7l4 4",key:"vyckw6"}],["path",{d:"m17 11 4 4-4 4-4-4",key:"rchckc"}],["path",{d:"m8 12 4 4 6-6-4-4Z",key:"1sshf7"}],["path",{d:"m16 8 3-3",key:"x428zp"}],["path",{d:"M9 21a6 6 0 0 0-6-6",key:"1iajcf"}]]);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=l("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=l("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);function k(){const[s,n]=d.useState("dark");d.useEffect(()=>{const t=localStorage.getItem("theme"),a=window.matchMedia("(prefers-color-scheme: dark)").matches,o=t||(a?"dark":"light");n(o),document.documentElement.classList.toggle("dark",o==="dark")},[]);const r=()=>{const t=s==="light"?"dark":"light";n(t),localStorage.setItem("theme",t),document.documentElement.classList.toggle("dark",t==="dark")};return e.jsx(h,{variant:"ghost",size:"icon",onClick:r,"aria-label":"Toggle theme",children:s==="light"?e.jsx(y,{className:"h-5 w-5"}):e.jsx(u,{className:"h-5 w-5"})})}const m=[{href:"/",label:"Home"},{href:"/about",label:"About"},{href:"/subsystems",label:"Subsystems"},{href:"/team",label:"Team"},{href:"/gallery",label:"Gallery"},{href:"/news",label:"News"},{href:"/contact",label:"Contact"}];function M(){const[s,n]=c.useState(!1),[r,t]=c.useState(!1);return c.useEffect(()=>{const a=()=>{t(window.scrollY>10)};return window.addEventListener("scroll",a),()=>window.removeEventListener("scroll",a)},[]),e.jsxs(i.header,{className:p("fixed top-0 left-0 right-0 z-50 transition-all duration-300",r?"bg-background/90 backdrop-blur-md border-b":"bg-transparent"),initial:{y:-100},animate:{y:0},transition:{duration:.5},children:[e.jsx("div",{className:"container mx-auto px-4 py-4",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("a",{href:"/",className:"flex items-center space-x-2","aria-label":"University of Málaga CubeSat Project",children:[e.jsx(f,{className:"h-7 w-7 text-primary"}),e.jsx("span",{className:"hidden sm:inline-block font-bold text-lg",children:"UMA CubeSat"})]}),e.jsx("nav",{className:"hidden md:flex items-center space-x-1",children:m.map(a=>e.jsx("a",{href:a.href,className:"px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors duration-200",children:a.label},a.href))}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(k,{}),e.jsx(h,{variant:"ghost",size:"icon",className:"md:hidden",onClick:()=>n(!s),"aria-label":"Toggle menu",children:s?e.jsx(b,{className:"h-5 w-5"}):e.jsx(x,{className:"h-5 w-5"})})]})]})}),s&&e.jsx(i.div,{className:"md:hidden bg-background border-b",initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},transition:{duration:.2},children:e.jsx("nav",{className:"container mx-auto px-4 py-4 flex flex-col space-y-2",children:m.map(a=>e.jsx("a",{href:a.href,className:"px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors duration-200",onClick:()=>n(!1),children:a.label},a.href))})})]})}export{M as Navbar};
