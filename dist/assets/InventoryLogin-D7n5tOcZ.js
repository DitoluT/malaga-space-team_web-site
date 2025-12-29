import{c as s,r as n,j as e,G as y,d as f,f as w,a as v,A as g}from"./index-BdA2BdX0.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=s("Loader2",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=s("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=s("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=s("Pen",[["path",{d:"M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z",key:"5qss01"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=s("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=s("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=s("Save",[["path",{d:"M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z",key:"1owoqh"}],["polyline",{points:"17 21 17 13 7 13 7 21",key:"1md35c"}],["polyline",{points:"7 3 7 8 15 8",key:"8nz8an"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=s("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]),C=({onLoginSuccess:m})=>{const[i,x]=n.useState(""),[d,p]=n.useState(""),[c,o]=n.useState(""),[a,h]=n.useState(!1),b=async t=>{t.preventDefault(),o(""),h(!0);try{const r=await fetch(g.login,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({username:i,password:d})}),l=await r.json();r.ok&&l.success?m(l.user,l.requiere_cambio_password||!1):o(l.error||"Error al iniciar sesión")}catch(r){console.error("Error de conexión:",r),o("Error de conexión con el servidor. Asegúrate de que el servidor esté ejecutándose.")}finally{h(!1)}};return e.jsxs("div",{className:"min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900",children:[e.jsxs("div",{className:"absolute inset-0 overflow-hidden pointer-events-none",children:[e.jsx("div",{className:"absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"}),e.jsx("div",{className:"absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"})]}),e.jsx(y,{className:"w-full max-w-md relative z-10",children:e.jsxs("div",{className:"p-8",children:[e.jsxs("div",{className:"text-center mb-8",children:[e.jsx("div",{className:"mx-auto w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-white/30 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg mb-4",children:e.jsx(u,{className:"w-8 h-8 text-white"})}),e.jsx("h1",{className:"text-2xl font-bold text-white mb-2",children:"Sistema de Inventario"}),e.jsx("p",{className:"text-white/70 text-sm",children:"Málaga Space Team"})]}),c&&e.jsxs("div",{className:"mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-3",children:[e.jsx(f,{className:"w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"}),e.jsx("p",{className:"text-red-200 text-sm",children:c})]}),e.jsxs("form",{onSubmit:b,className:"space-y-5",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"username",className:"block text-white/90 text-sm font-medium mb-2",children:"Usuario"}),e.jsxs("div",{className:"relative",children:[e.jsx(w,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40"}),e.jsx("input",{id:"username",type:"text",value:i,onChange:t=>x(t.target.value),className:"w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all",placeholder:"Ingresa tu usuario",required:!0,disabled:a})]})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"password",className:"block text-white/90 text-sm font-medium mb-2",children:"Contraseña"}),e.jsxs("div",{className:"relative",children:[e.jsx(u,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40"}),e.jsx("input",{id:"password",type:"password",value:d,onChange:t=>p(t.target.value),className:"w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all",placeholder:"Ingresa tu contraseña",required:!0,disabled:a})]})]}),e.jsx(v,{type:"submit",variant:"primary",size:"lg",className:"w-full",disabled:a,children:a?e.jsxs(e.Fragment,{children:[e.jsx(j,{className:"w-5 h-5 mr-2 animate-spin"}),"Iniciando sesión..."]}):"Iniciar Sesión"})]})]})})]})};export{C as I,N as L,S as P,L as R,I as S,P as T,M as a,u as b,j as c};
