var kt=Object.defineProperty;var Mt=Object.getOwnPropertyDescriptor;var h=(n,e,t,s)=>{for(var i=s>1?void 0:s?Mt(e,t):e,r=n.length-1,o;r>=0;r--)(o=n[r])&&(i=(s?o(e,t,i):o(i))||i);return s&&i&&kt(e,t,i),i};var W=globalThis,D=W.ShadowRoot&&(W.ShadyCSS===void 0||W.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,V=Symbol(),nt=new WeakMap,T=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==V)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(D&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=nt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&nt.set(t,e))}return e}toString(){return this.cssText}},ot=n=>new T(typeof n=="string"?n:n+"",void 0,V),B=(n,...e)=>{let t=n.length===1?n[0]:e.reduce((s,i,r)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[r+1],n[0]);return new T(t,n,V)},lt=(n,e)=>{if(D)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=W.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,n.appendChild(s)}},F=D?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return ot(t)})(n):n;var{is:Tt,defineProperty:Ct,getOwnPropertyDescriptor:Lt,getOwnPropertyNames:Ot,getOwnPropertySymbols:It,getPrototypeOf:Rt}=Object,P=globalThis,ct=P.trustedTypes,Ht=ct?ct.emptyScript:"",Nt=P.reactiveElementPolyfillSupport,C=(n,e)=>n,L={toAttribute(n,e){switch(e){case Boolean:n=n?Ht:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},z=(n,e)=>!Tt(n,e),dt={attribute:!0,type:String,converter:L,reflect:!1,useDefault:!1,hasChanged:z};Symbol.metadata??=Symbol("metadata"),P.litPropertyMetadata??=new WeakMap;var b=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=dt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&Ct(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:r}=Lt(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:i,set(o){let a=i?.call(this);r?.call(this,o),this.requestUpdate(e,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??dt}static _$Ei(){if(this.hasOwnProperty(C("elementProperties")))return;let e=Rt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(C("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(C("properties"))){let t=this.properties,s=[...Ot(t),...It(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(F(i))}else e!==void 0&&t.push(F(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return lt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let r=(s.converter?.toAttribute!==void 0?s.converter:L).toAttribute(t,s.type);this._$Em=e,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let r=s.getPropertyOptions(i),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:L;this._$Em=i;let a=o.fromAttribute(t,r.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(e,t,s,i=!1,r){if(e!==void 0){let o=this.constructor;if(i===!1&&(r=this[e]),s??=o.getPropertyOptions(e),!((s.hasChanged??z)(r,t)||s.useDefault&&s.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:r},o){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),r!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,r]of s){let{wrapped:o}=r,a=this[i];o!==!0||this._$AL.has(i)||a===void 0||this.C(i,void 0,r,a)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[C("elementProperties")]=new Map,b[C("finalized")]=new Map,Nt?.({ReactiveElement:b}),(P.reactiveElementVersions??=[]).push("2.1.2");var Q=globalThis,ht=n=>n,j=Q.trustedTypes,pt=j?j.createPolicy("lit-html",{createHTML:n=>n}):void 0,$t="$lit$",f=`lit$${Math.random().toFixed(9).slice(2)}$`,bt="?"+f,Wt=`<${bt}>`,S=document,I=()=>S.createComment(""),R=n=>n===null||typeof n!="object"&&typeof n!="function",tt=Array.isArray,Dt=n=>tt(n)||typeof n?.[Symbol.iterator]=="function",J=`[ 	
\f\r]`,O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ut=/-->/g,gt=/>/g,x=RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),mt=/'/g,vt=/"/g,ft=/^(?:script|style|textarea|title)$/i,et=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),c=et(1),Gt=et(2),Qt=et(3),A=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),yt=new WeakMap,E=S.createTreeWalker(S,129);function wt(n,e){if(!tt(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return pt!==void 0?pt.createHTML(e):e}var Pt=(n,e)=>{let t=n.length-1,s=[],i,r=e===2?"<svg>":e===3?"<math>":"",o=O;for(let a=0;a<t;a++){let l=n[a],u,m,g=-1,y=0;for(;y<l.length&&(o.lastIndex=y,m=o.exec(l),m!==null);)y=o.lastIndex,o===O?m[1]==="!--"?o=ut:m[1]!==void 0?o=gt:m[2]!==void 0?(ft.test(m[2])&&(i=RegExp("</"+m[2],"g")),o=x):m[3]!==void 0&&(o=x):o===x?m[0]===">"?(o=i??O,g=-1):m[1]===void 0?g=-2:(g=o.lastIndex-m[2].length,u=m[1],o=m[3]===void 0?x:m[3]==='"'?vt:mt):o===vt||o===mt?o=x:o===ut||o===gt?o=O:(o=x,i=void 0);let $=o===x&&n[a+1].startsWith("/>")?" ":"";r+=o===O?l+Wt:g>=0?(s.push(u),l.slice(0,g)+$t+l.slice(g)+f+$):l+f+(g===-2?a:$)}return[wt(n,r+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},H=class n{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let r=0,o=0,a=e.length-1,l=this.parts,[u,m]=Pt(e,t);if(this.el=n.createElement(u,s),E.currentNode=this.el.content,t===2||t===3){let g=this.el.content.firstChild;g.replaceWith(...g.childNodes)}for(;(i=E.nextNode())!==null&&l.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(let g of i.getAttributeNames())if(g.endsWith($t)){let y=m[o++],$=i.getAttribute(g).split(f),_=/([.?@])?(.*)/.exec(y);l.push({type:1,index:r,name:_[2],strings:$,ctor:_[1]==="."?X:_[1]==="?"?Y:_[1]==="@"?Z:M}),i.removeAttribute(g)}else g.startsWith(f)&&(l.push({type:6,index:r}),i.removeAttribute(g));if(ft.test(i.tagName)){let g=i.textContent.split(f),y=g.length-1;if(y>0){i.textContent=j?j.emptyScript:"";for(let $=0;$<y;$++)i.append(g[$],I()),E.nextNode(),l.push({type:2,index:++r});i.append(g[y],I())}}}else if(i.nodeType===8)if(i.data===bt)l.push({type:2,index:r});else{let g=-1;for(;(g=i.data.indexOf(f,g+1))!==-1;)l.push({type:7,index:r}),g+=f.length-1}r++}}static createElement(e,t){let s=S.createElement("template");return s.innerHTML=e,s}};function k(n,e,t=n,s){if(e===A)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,r=R(e)?void 0:e._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(n),i._$AT(n,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=k(n,i._$AS(n,e.values),i,s)),e}var K=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??S).importNode(t,!0);E.currentNode=i;let r=E.nextNode(),o=0,a=0,l=s[0];for(;l!==void 0;){if(o===l.index){let u;l.type===2?u=new N(r,r.nextSibling,this,e):l.type===1?u=new l.ctor(r,l.name,l.strings,this,e):l.type===6&&(u=new G(r,this,e)),this._$AV.push(u),l=s[++a]}o!==l?.index&&(r=E.nextNode(),o++)}return E.currentNode=S,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},N=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=k(this,e,t),R(e)?e===v||e==null||e===""?(this._$AH!==v&&this._$AR(),this._$AH=v):e!==this._$AH&&e!==A&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Dt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==v&&R(this._$AH)?this._$AA.nextSibling.data=e:this.T(S.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=H.createElement(wt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let r=new K(i,this),o=r.u(this.options);r.p(t),this.T(o),this._$AH=r}}_$AC(e){let t=yt.get(e.strings);return t===void 0&&yt.set(e.strings,t=new H(e)),t}k(e){tt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let r of e)i===t.length?t.push(s=new n(this.O(I()),this.O(I()),this,this.options)):s=t[i],s._$AI(r),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=ht(e).nextSibling;ht(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},M=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,r){this.type=1,this._$AH=v,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=v}_$AI(e,t=this,s,i){let r=this.strings,o=!1;if(r===void 0)e=k(this,e,t,0),o=!R(e)||e!==this._$AH&&e!==A,o&&(this._$AH=e);else{let a=e,l,u;for(e=r[0],l=0;l<r.length-1;l++)u=k(this,a[s+l],t,l),u===A&&(u=this._$AH[l]),o||=!R(u)||u!==this._$AH[l],u===v?e=v:e!==v&&(e+=(u??"")+r[l+1]),this._$AH[l]=u}o&&!i&&this.j(e)}j(e){e===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},X=class extends M{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===v?void 0:e}},Y=class extends M{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==v)}},Z=class extends M{constructor(e,t,s,i,r){super(e,t,s,i,r),this.type=5}_$AI(e,t=this){if((e=k(this,e,t,0)??v)===A)return;let s=this._$AH,i=e===v&&s!==v||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,r=e!==v&&(s===v||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},G=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){k(this,e)}};var zt=Q.litHtmlPolyfillSupport;zt?.(H,N),(Q.litHtmlVersions??=[]).push("3.3.3");var _t=(n,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let r=t?.renderBefore??null;s._$litPart$=i=new N(e.insertBefore(I(),r),r,void 0,t??{})}return i._$AI(n),i};var st=globalThis,w=class extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=_t(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return A}};w._$litElement$=!0,w.finalized=!0,st.litElementHydrateSupport?.({LitElement:w});var jt=st.litElementPolyfillSupport;jt?.({LitElement:w});(st.litElementVersions??=[]).push("4.2.2");var qt={attribute:!0,type:String,converter:L,reflect:!1,hasChanged:z},Ut=(n=qt,e,t)=>{let{kind:s,metadata:i}=t,r=globalThis.litPropertyMetadata.get(i);if(r===void 0&&globalThis.litPropertyMetadata.set(i,r=new Map),s==="setter"&&((n=Object.create(n)).wrapped=!0),r.set(t.name,n),s==="accessor"){let{name:o}=t;return{set(a){let l=e.get.call(this);e.set.call(this,a),this.requestUpdate(o,l,n,!0,a)},init(a){return a!==void 0&&this.C(o,void 0,n,a),a}}}if(s==="setter"){let{name:o}=t;return function(a){let l=this[o];e.call(this,a),this.requestUpdate(o,l,n,!0,a)}}throw Error("Unsupported decorator location: "+s)};function q(n){return(e,t)=>typeof t=="object"?Ut(n,e,t):((s,i,r)=>{let o=i.hasOwnProperty(r);return i.constructor.createProperty(r,s),o?Object.getOwnPropertyDescriptor(i,r):void 0})(n,e,t)}function p(n){return q({...n,state:!0,attribute:!1})}var it=560,Vt=JSON.stringify({id:"my_widget",label:"My Widget",w:16,h:7,default_cfg:{color:[0,255,0]},draw:[{op:"value",x:0,y:1,bind:"solar",fmt:"{:.1f}"},{op:"bar",x:0,y:6,w:16,h:1,bind:"soc",max:100,color:[0,120,255],bg:[30,30,30]}]},null,2),xt={galactic:[53,11],cosmic:[32,32],stellar:[16,16]},Et="__mock__",Bt=n=>{let[e,t,s]=n??[0,0,0];return"#"+[e,t,s].map(i=>Math.max(0,Math.min(255,i|0)).toString(16).padStart(2,"0")).join("")},Ft=n=>{let e=(n||"").replace("#","");return[0,2,4].map(t=>parseInt(e.substr(t,2),16)||0)},d=class extends w{constructor(){super(...arguments);this.devices=[];this.entryId="";this.model="galactic";this.layout={widgets:[]};this.caps=[];this.overlayCaps=[];this.defaultLayout={widgets:[]};this.stored={};this.png="";this.wboxes=[];this.dims=[53,11];this.zoom=0;this.selected=-1;this.layoutName="default";this.live=!1;this.wireframe=!0;this.status="";this.tab="layout";this.catalog=[];this.fwManifest=null;this.screenLayouts=[];this.screenDwell=10;this.screenTransition="none";this.screenPngs={};this.screenIdx=0;this.screenOpacity=1;this.screenTimer=0;this.specText=Vt;this.specPng="";this.specError="";this.specTimer=0;this._onKey=t=>{let s=t.target?.tagName;if(s==="INPUT"||s==="SELECT"||s==="TEXTAREA")return;let r={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[t.key];r&&(t.preventDefault(),this._nudge(r[0],r[1]))}}static{this.styles=B`
    :host { display: block; padding: 16px; color: var(--primary-text-color, #111); }
    .wrap { display: flex; gap: 24px; flex-wrap: wrap; align-items: flex-start; }
    .col { min-width: 280px; }
    .bar { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 16px; }
    select, input, button { font: inherit; padding: 6px 8px; border-radius: 6px;
      border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color, #fff); color: var(--primary-text-color, #111); }
    input[type="color"] { padding: 0; width: 34px; height: 28px; }
    button { cursor: pointer; background: var(--primary-color, #03a9f4); color: #fff; border: none; }
    button[disabled] { opacity: .5; cursor: not-allowed; }
    button.secondary { background: var(--secondary-background-color, #e0e0e0); color: var(--primary-text-color, #111); }
    button.danger { background: var(--error-color, #db4437); }
    button.zbtn { padding: 4px 9px; min-width: 28px; line-height: 1; }
    .stage { position: relative; display: inline-block; background: #000; line-height: 0; border: 1px solid var(--divider-color, #444); overflow: hidden; }
    .stage img { image-rendering: pixelated; display: block; }
    .grid, .boxes { position: absolute; inset: 0; pointer-events: none; }
    .boxes { pointer-events: none; }
    .box { position: absolute; box-sizing: border-box; border: 1px solid rgba(255,255,255,.35); cursor: grab; touch-action: none; pointer-events: auto; }
    .box.sel { border: 2px solid var(--primary-color, #03a9f4); background: rgba(3,169,244,.10); }
    .box .tag { position: absolute; top: -16px; left: 0; font: 11px monospace; color: #ccc; white-space: nowrap; }
    .wlist { list-style: none; padding: 0; margin: 0 0 12px; }
    .wlist li { display: flex; gap: 8px; align-items: center; padding: 6px 8px; border-radius: 6px; cursor: pointer; }
    .wlist li.sel { background: var(--secondary-background-color, #eef); }
    .wlist li .grow { flex: 1; }
    .panelrow { display: flex; gap: 8px; align-items: center; margin: 6px 0; flex-wrap: wrap; }
    .panelrow label { font-size: 13px; min-width: 64px; }
    h3 { margin: 4px 0 8px; }
    .status { margin-top: 12px; font: 13px monospace; color: var(--secondary-text-color, #888); min-height: 18px; }
    .status.err { color: var(--error-color, #db4437); }
    .hint { color: var(--secondary-text-color, #888); font-size: 13px; }
    .tabs { display: flex; gap: 4px; margin-bottom: 12px; }
    .tab { background: var(--secondary-background-color, #e0e0e0); color: var(--primary-text-color, #111); }
    .tab.on { background: var(--primary-color, #03a9f4); color: #fff; }
    .catalog { list-style: none; padding: 0; margin: 0; max-width: 640px; }
    .catalog li { display: flex; gap: 8px; align-items: center; padding: 8px; border-bottom: 1px solid var(--divider-color, #333); }
    .catalog li .grow { flex: 1; }
    .badge { font-size: 11px; padding: 1px 6px; border-radius: 8px; background: var(--secondary-background-color, #444); color: var(--secondary-text-color, #ccc); }
    .badge.ok { background: var(--success-color, #43a047); color: #fff; }
    .badge.warn { background: var(--warning-color, #ffa600); color: #000; }
    .spec { width: 380px; height: 320px; font: 13px monospace; resize: vertical;
      border: 1px solid var(--divider-color, #ccc); border-radius: 6px; padding: 8px;
      background: var(--card-background-color, #fff); color: var(--primary-text-color, #111); }
  `}firstUpdated(){this.loadDevices()}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKey)}disconnectedCallback(){window.removeEventListener("keydown",this._onKey),super.disconnectedCallback()}_nudge(t,s){let[i,r]=this.dims;if(this.selected>=0&&this.layout.widgets[this.selected]){let o=this.layout.widgets[this.selected],[a,l]=this.boxDims(this.selected);o.x=Math.max(1-a,Math.min(i-1,o.x+t)),o.y=Math.max(1-l,Math.min(r-1,o.y+s)),this.edited()}}async loadDevices(){let t=await this.hass.callWS({type:"pimoroni_unicorn/devices"});this.devices=t.devices??[],this.devices.length?await this.selectDevice(this.devices[0].entry_id):await this.selectMock(this.model)}async loadCaps(t){let s=await this.hass.callWS({type:"pimoroni_unicorn/capabilities",...t});this.caps=s.widgets??[],this.overlayCaps=s.overlays??[],this.defaultLayout=s.default_layout,this.model=s.model,this.dims=xt[this.model]??[53,11],await this.refreshStored()}async selectDevice(t){let s=this.devices.find(r=>r.entry_id===t);if(!s)return;this.entryId=t,await this.loadCaps({entry_id:t});let i=s.active_layout?this.stored[s.active_layout]:void 0;this.loadLayout(i??this.defaultLayout)}async selectMock(t){this.entryId="",await this.loadCaps({model:t}),this.loadLayout(this.defaultLayout)}async refreshStored(){let t=await this.hass.callWS({type:"pimoroni_unicorn/layouts"});this.stored=t.layouts??{}}loadLayout(t){this.layout=JSON.parse(JSON.stringify(t)),this.layoutName=this.layout.name??"default",this.selected=-1,this.renderPreview()}async renderPreview(){try{let t=await this.hass.callWS({type:"pimoroni_unicorn/render",model:this.model,layout:this.layout});this.png=t.png,this.wboxes=t.boxes??[],this.status.startsWith("Render failed")&&(this.status="")}catch(t){this.png="",this.status=`Render failed: ${t?.message??t}`}}edited(){this.requestUpdate(),this.renderTimer&&clearTimeout(this.renderTimer),this.renderTimer=window.setTimeout(()=>this.renderPreview(),80),this.live&&this.entryId&&(this.pushTimer&&clearTimeout(this.pushTimer),this.pushTimer=window.setTimeout(()=>this.pushLive(),250))}async pushLive(){await this.hass.callWS({type:"pimoroni_unicorn/push_layout",entry_id:this.entryId,layout:this.layout})}capFor(t){return this.caps.find(s=>s.id===t)}typeOf(t){return t.type??t.id}capForEntry(t){return this.capFor(this.typeOf(t))}get scale(){return this.zoom||Math.max(4,Math.floor(it/this.dims[0]))}zoomBy(t){this.zoom=Math.min(48,Math.max(4,this.scale+t))}onWheel(t){t.preventDefault(),this.zoomBy(t.deltaY<0?2:-2)}boxDims(t){let s=this.wboxes[t];if(s)return s;let i=this.layout.widgets[t],r=i?this.capForEntry(i):void 0;return r?[r.w,r.h]:[0,0]}cfgVal(t,s){return t.cfg?.[s]??this.capForEntry(t)?.default_cfg[s]}setCfg(t,s,i){t.cfg={...t.cfg??{},[s]:i},this.edited()}setName(t,s){let i=s.trim();i?t.name=i:delete t.name,this.edited()}setPos(t,s,i){let[r,o]=this.boxDims(this.selected),[a,l]=this.dims,u=Math.round(i);s==="x"?t.x=Math.max(1-r,Math.min(a-1,u)):t.y=Math.max(1-o,Math.min(l-1,u)),this.edited()}onImgLoad(t){let s=t.target;this.dims=[s.naturalWidth,s.naturalHeight]}startDrag(t,s){s.preventDefault(),this.selected=t;let i=this.layout.widgets[t],[r,o]=this.boxDims(t),a=this.layout.grid??2,[l,u]=this.dims,m=s.clientX,g=s.clientY,y=i.x,$=i.y;s.target.setPointerCapture(s.pointerId);let _=at=>{let St=Math.round((at.clientX-m)/this.scale/a)*a,At=Math.round((at.clientY-g)/this.scale/a)*a;i.x=Math.max(1-r,Math.min(l-1,y+St)),i.y=Math.max(1-o,Math.min(u-1,$+At)),this.edited()},rt=()=>{window.removeEventListener("pointermove",_),window.removeEventListener("pointerup",rt),this.renderPreview()};window.addEventListener("pointermove",_),window.addEventListener("pointerup",rt)}addWidget(t){if(!t)return;let s=this.capFor(t),i=new Set(this.layout.widgets.map(o=>o.id)),r;if(s?.multi||i.has(t)){let o=2,a=`${t}-${o}`;for(;i.has(a);)a=`${t}-${++o}`;r={id:a,type:t,name:`${s?.label??t} ${o}`,x:0,y:0,cfg:{}}}else r={id:t,type:t,x:0,y:0,cfg:{}};this.layout.widgets.push(r),this.selected=this.layout.widgets.length-1,this.edited()}removeWidget(t){this.layout.widgets.splice(t,1),this.selected=-1,this.edited()}toggleOverlay(t,s){let i=new Set(this.layout.overlays??[]);s?i.add(t):i.delete(t),this.layout.overlays=[...i],this.edited()}async save(){this.entryId&&(this.layout.name=this.layoutName,await this.hass.callWS({type:"pimoroni_unicorn/save_layout",entry_id:this.entryId,name:this.layoutName,layout:this.layout}),await this.refreshStored(),this.status=`Saved "${this.layoutName}" and pushed to device.`)}async deleteLayout(){this.stored[this.layoutName]&&(await this.hass.callWS({type:"pimoroni_unicorn/delete_layout",name:this.layoutName}),await this.refreshStored(),this.status=`Deleted "${this.layoutName}".`,this.loadLayout(this.defaultLayout))}renderWidgetEditor(){let t=this.layout.widgets[this.selected];if(!t)return c`<p class="hint">Select a widget to edit.</p>`;let s=this.capForEntry(t);return s?c`
      <h3>${t.name??s.label}</h3>
      <div class="panelrow"><label>Name</label>
        <input type="text" style="width:160px" placeholder=${s.label} .value=${t.name??""}
          @change=${i=>this.setName(t,i.target.value)} /></div>
      <div class="panelrow">
        <label>X</label><input type="number" style="width:60px" .value=${String(t.x)}
          @change=${i=>this.setPos(t,"x",+i.target.value)} />
        <label>Y</label><input type="number" style="width:60px" .value=${String(t.y)}
          @change=${i=>this.setPos(t,"y",+i.target.value)} />
      </div>
      ${s.cfg_fields.map(i=>i.type==="select"?c`<div class="panelrow"><label>${i.label??i.key}</label>
            <select @change=${r=>this.setCfg(t,i.key,r.target.value)}>
              ${(i.options??[]).map(r=>c`<option ?selected=${this.cfgVal(t,i.key)===r}>${r}</option>`)}
            </select></div>`:i.type==="number"?c`<div class="panelrow"><label>${i.label??i.key}</label>
            <input type="number" style="width:60px" min=${i.min??1} max=${i.max??64} step=${i.step??1}
              .value=${String(this.cfgVal(t,i.key))}
              @change=${r=>this.setCfg(t,i.key,+r.target.value)} /></div>`:i.type==="entity"?c`<div class="panelrow"><label>${i.label??i.key}</label>
            <input type="text" style="width:200px" list="pu-entity-list" placeholder="entity id…"
              .value=${String(this.cfgVal(t,i.key)??"")}
              @change=${r=>this.setCfg(t,i.key,r.target.value)} />
            <datalist id="pu-entity-list">
              ${Object.keys(this.hass?.states??{}).map(r=>c`<option value=${r}></option>`)}
            </datalist></div>`:i.type==="text"?c`<div class="panelrow"><label>${i.label??i.key}</label>
            <input type="text" style="width:120px" .value=${String(this.cfgVal(t,i.key)??"")}
              @change=${r=>this.setCfg(t,i.key,r.target.value)} /></div>`:c`<div class="panelrow"><label>${i.label??i.key}</label>
          <input type="color" .value=${Bt(this.cfgVal(t,i.key))}
            @input=${r=>this.setCfg(t,i.key,Ft(r.target.value))} /></div>`)}
      <div class="panelrow"><button class="danger" @click=${()=>this.removeWidget(this.selected)}>Remove widget</button></div>
    `:""}render(){return c`
      <div class="tabs">
        <button class="tab ${this.tab==="layout"?"on":""}" @click=${()=>this.tab="layout"}>Layout</button>
        <button class="tab ${this.tab==="market"?"on":""}" @click=${()=>{this.tab="market",this.loadCatalog()}}>Marketplace</button>
        <button class="tab ${this.tab==="edit"?"on":""}" @click=${()=>{this.tab="edit",this.previewSpec()}}>Widget editor</button>
        <button class="tab ${this.tab==="screens"?"on":""}" @click=${()=>{this.tab="screens",this.buildScreenPreview()}}>Screens</button>
      </div>
      ${this.tab==="market"?this._marketplaceView():this.tab==="edit"?this._editorView():this.tab==="screens"?this._screensView():this._layoutView()}
    `}_layoutView(){let t=this.scale,s=new Set(this.layout.widgets.map(a=>this.typeOf(a))),i=this.caps.filter(a=>a.multi||!s.has(a.id)),r=new Set(this.layout.overlays??[]),o=`background-image:linear-gradient(to right,rgba(255,255,255,.10) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.10) 1px,transparent 1px);background-size:${t}px ${t}px`;return c`
      <div class="bar">
        <label>Device
          <select @change=${a=>{let l=a.target.value;l===Et?this.selectMock(this.model):this.selectDevice(l)}}>
            <option value=${Et} ?selected=${!this.entryId}>(mock — preview only)</option>
            ${this.devices.map(a=>c`<option value=${a.entry_id} ?selected=${a.entry_id===this.entryId}>${a.name} (${a.model})</option>`)}
          </select>
        </label>
        ${this.entryId?c`<span class="hint">model: ${this.model}</span>`:c`<label>Model
          <select @change=${a=>this.selectMock(a.target.value)}>
            ${Object.keys(xt).map(a=>c`<option ?selected=${a===this.model}>${a}</option>`)}
          </select></label>`}
        <span class="hint">${this.dims[0]}&times;${this.dims[1]} px</span>
        <label>Layout
          <select @change=${a=>{let l=a.target.value;this.loadLayout(l==="__new__"?this.defaultLayout:this.stored[l])}}>
            ${Object.keys(this.stored).map(a=>c`<option ?selected=${a===this.layoutName}>${a}</option>`)}
            <option value="__new__">— new —</option>
          </select>
        </label>
        <label>Name <input .value=${this.layoutName} @input=${a=>this.layoutName=a.target.value} /></label>
        <button @click=${this.save} ?disabled=${!this.entryId} title=${this.entryId?"":"Select a device to save/push"}>Save &amp; Push</button>
        ${this.stored[this.layoutName]?c`<button class="danger" @click=${this.deleteLayout}>Delete</button>`:""}
        <label>Snap
          <select @change=${a=>{this.layout.grid=+a.target.value,this.edited()}}>
            ${[1,2,4].map(a=>c`<option ?selected=${(this.layout.grid??2)===a}>${a}</option>`)}
          </select>
        </label>
        <label>Zoom
          <button class="zbtn" @click=${()=>this.zoomBy(-2)} title="Zoom out">&minus;</button>
          <input type="range" min="4" max="48" .value=${String(this.scale)}
            @input=${a=>this.zoom=+a.target.value} />
          <button class="zbtn" @click=${()=>this.zoomBy(2)} title="Zoom in">+</button>
        </label>
        <label><input type="checkbox" .checked=${this.wireframe} @change=${a=>this.wireframe=a.target.checked} /> wireframe</label>
        <label><input type="checkbox" .checked=${this.live} ?disabled=${!this.entryId} @change=${a=>this.live=a.target.checked} /> live push</label>
      </div>

      <div class="wrap">
        <div class="col">
          <div class="stage" style=${`width:${this.dims[0]*t}px;height:${this.dims[1]*t}px`}
            @wheel=${this.onWheel}>
            ${this.png?c`<img src="data:image/png;base64,${this.png}" width=${this.dims[0]*t} height=${this.dims[1]*t} @load=${this.onImgLoad} />`:""}
            <div class="grid" style=${o}></div>
            ${this.wireframe?c`<div class="boxes">${this.layout.widgets.map((a,l)=>{if(!this.capForEntry(a)||a.enabled===!1)return"";let[u,m]=this.boxDims(l);return c`<div class="box ${l===this.selected?"sel":""}"
                style=${`left:${a.x*t}px;top:${a.y*t}px;width:${u*t}px;height:${m*t}px`}
                @pointerdown=${g=>this.startDrag(l,g)}>
                <span class="tag">${a.name??this.capForEntry(a)?.label??a.id}</span></div>`})}</div>`:""}
          </div>
          <div class="status ${this.status.startsWith("Render failed")?"err":""}">${this.status}</div>
        </div>

        <div class="col">
          <h3>Widgets</h3>
          <ul class="wlist">
            ${this.layout.widgets.map((a,l)=>c`
              <li class="${l===this.selected?"sel":""}" @click=${()=>this.selected=l}>
                <input type="checkbox" .checked=${a.enabled!==!1}
                  @click=${u=>{u.stopPropagation(),a.enabled=u.target.checked,this.edited()}} />
                <span class="grow">${a.name??this.capForEntry(a)?.label??a.id}</span>
              </li>`)}
          </ul>
          ${i.length?c`<div class="panelrow">
            <select id="addsel"><option value="">add widget…</option>${i.map(a=>c`<option value=${a.id}>${a.label}</option>`)}</select>
            <button class="secondary" @click=${()=>{let a=this.renderRoot.querySelector("#addsel");this.addWidget(a.value),a.value=""}}>Add</button>
          </div>`:""}
          <h3>Overlays</h3>
          ${this.overlayCaps.map(a=>c`<div class="panelrow"><label>
            <input type="checkbox" .checked=${r.has(a.id)} @change=${l=>this.toggleOverlay(a.id,l.target.checked)} /> ${a.label}</label></div>`)}
          <h3>Selected</h3>
          ${this.renderWidgetEditor()}
        </div>
      </div>
    `}async loadCatalog(){if(!this.entryId){this.catalog=[],this.fwManifest=null;return}let t=await this.hass.callWS({type:"pimoroni_unicorn/catalog",entry_id:this.entryId});this.catalog=t.widgets??[];let s=await this.hass.callWS({type:"pimoroni_unicorn/fw_manifest",entry_id:this.entryId});this.fwManifest=s.manifest??null}async installWidget(t){await this.hass.callWS({type:"pimoroni_unicorn/fw_install",entry_id:this.entryId,widget_id:t}),this.status=`Installing ${t}\u2026 device will reboot.`,setTimeout(()=>this.loadCatalog(),8e3)}async removeWidgetUnit(t){await this.hass.callWS({type:"pimoroni_unicorn/fw_remove",entry_id:this.entryId,widget_id:t}),this.status=`Removing ${t}\u2026 device will reboot.`,setTimeout(()=>this.loadCatalog(),8e3)}_marketplaceView(){if(!this.entryId)return c`<p class="hint">Select a device on the Layout tab to manage installed widgets.</p>`;let t=this.fwManifest?.engine_version??"?",s={installed:"ok",outdated:"warn",not_installed:""},i={installed:"installed",outdated:"update available",not_installed:"not installed"};return c`
      <div class="bar"><span class="hint">engine v${t}</span>
        <button class="secondary" @click=${this.loadCatalog}>Refresh</button></div>
      <ul class="catalog">
        ${this.catalog.map(r=>c`<li>
          <span class="grow">${r.label} <span class="badge ${s[r.status]??""}">${i[r.status]??r.status}</span></span>
          ${r.requires?.length?c`<span class="hint">needs ${r.requires.join(", ")}</span>`:""}
          ${r.status==="installed"?c`<button class="danger" @click=${()=>this.removeWidgetUnit(r.id)}>Remove</button>`:c`<button @click=${()=>this.installWidget(r.id)}>${r.status==="outdated"?"Update":"Install"}</button>`}
        </li>`)}
      </ul>
      <p class="hint">Install pulls the widget (and any fonts it needs) to the device over the air; the device reboots and the widget becomes available on the Layout tab.</p>
    `}onSpecInput(t){this.specText=t,clearTimeout(this.specTimer),this.specTimer=window.setTimeout(()=>this.previewSpec(),400)}async previewSpec(){let t;try{t=JSON.parse(this.specText)}catch(s){this.specError=`JSON: ${s.message}`;return}try{let s=await this.hass.callWS({type:"pimoroni_unicorn/widget_preview",model:this.model,spec:t});this.specPng=s.png,this.specError=""}catch(s){this.specError=s?.message??String(s)}}async importSpec(t){try{let s=await this.hass.callWS({type:"pimoroni_unicorn/widget_import",text:t});this.specText=JSON.stringify(s.spec,null,2),this.specError="",this.previewSpec()}catch(s){this.specError=s?.message??String(s)}}async saveSpec(){let t;try{t=JSON.parse(this.specText)}catch(s){this.specError=`JSON: ${s.message}`;return}try{let s=await this.hass.callWS({type:"pimoroni_unicorn/widget_save",spec:t});this.specError="",this.status=`Saved custom widget "${s.id}". Install it from the Marketplace tab.`}catch(s){this.specError=s?.message??String(s)}}_editorView(){let t=Math.max(6,Math.floor(it/this.dims[0]));return c`
      <div class="bar"><span class="hint">declarative widget — JSON spec, previewed on ${this.model}</span></div>
      <div class="wrap">
        <div class="col">
          <textarea class="spec" .value=${this.specText}
            @input=${s=>this.onSpecInput(s.target.value)}></textarea>
          <div class="panelrow">
            <button @click=${this.saveSpec}>Save custom</button>
            <button class="secondary" @click=${()=>{let s=prompt("Paste YAML or JSON widget spec:");s&&this.importSpec(s)}}>Import…</button>
          </div>
          ${this.specError?c`<div class="status err">${this.specError}</div>`:c`<div class="hint">binds: solar, soc, consumption, co2… (unknown binds preview as 123)</div>`}
        </div>
        <div class="col">
          <div class="stage" style=${`width:${this.dims[0]*t}px;height:${this.dims[1]*t}px`}>
            ${this.specPng?c`<img src="data:image/png;base64,${this.specPng}" width=${this.dims[0]*t} height=${this.dims[1]*t} />`:""}
          </div>
        </div>
      </div>
    `}toggleScreen(t,s){this.screenLayouts=s?[...this.screenLayouts,t]:this.screenLayouts.filter(i=>i!==t),this.buildScreenPreview()}async buildScreenPreview(){clearInterval(this.screenTimer);let t={};for(let s of this.screenLayouts){let i=this.stored[s];if(i)try{let r=await this.hass.callWS({type:"pimoroni_unicorn/render",model:this.model,layout:i});t[s]=r.png}catch{}}this.screenPngs=t,this.screenIdx=0,this.screenOpacity=1,this.screenLayouts.length>1&&this.screenDwell>0&&(this.screenTimer=window.setInterval(()=>this._advancePreview(),this.screenDwell*1e3))}_advancePreview(){let t=(this.screenIdx+1)%this.screenLayouts.length;this.screenTransition==="fade"?(this.screenOpacity=0,setTimeout(()=>{this.screenIdx=t,this.screenOpacity=1},280)):this.screenIdx=t}async pushScreens(){!this.entryId||!this.screenLayouts.length||(await this.hass.callWS({type:"pimoroni_unicorn/push_screens",entry_id:this.entryId,layouts:this.screenLayouts,dwell:this.screenDwell,transition:this.screenTransition}),this.status=`Pushed ${this.screenLayouts.length} screen(s) to device.`)}_screensView(){let t=Math.max(6,Math.floor(it/this.dims[0])),s=Object.keys(this.stored),i=this.screenLayouts[this.screenIdx],r=i?this.screenPngs[i]:"";return c`
      <div class="bar"><span class="hint">compose a screen rotation — mock preview on ${this.model}</span></div>
      <div class="wrap">
        <div class="col">
          <h3>Screens (rotation order)</h3>
          ${s.length?s.map(o=>c`<div class="panelrow"><label>
            <input type="checkbox" ?checked=${this.screenLayouts.includes(o)}
              @change=${a=>this.toggleScreen(o,a.target.checked)} /> ${o}</label></div>`):c`<p class="hint">No saved layouts yet — create them on the Layout tab.</p>`}
          <div class="panelrow"><label>Dwell (s)
            <input type="number" style="width:60px" min="1" max="600" .value=${String(this.screenDwell)}
              @change=${o=>{this.screenDwell=+o.target.value,this.buildScreenPreview()}} /></label></div>
          <div class="panelrow"><label>Transition
            <select @change=${o=>{this.screenTransition=o.target.value,this.buildScreenPreview()}}>
              ${["none","fade"].map(o=>c`<option ?selected=${o===this.screenTransition}>${o}</option>`)}
            </select></label></div>
          <div class="panelrow">
            <button @click=${this.pushScreens} ?disabled=${!this.entryId} title=${this.entryId?"":"Select a device to push"}>Push to device</button>
          </div>
        </div>
        <div class="col">
          <div class="stage" style=${`width:${this.dims[0]*t}px;height:${this.dims[1]*t}px`}>
            ${r?c`<img src="data:image/png;base64,${r}" width=${this.dims[0]*t} height=${this.dims[1]*t}
              style=${`opacity:${this.screenOpacity};transition:opacity 280ms`} />`:""}
          </div>
          <div class="hint">${this.screenLayouts.length>1?`rotating ${this.screenIdx+1}/${this.screenLayouts.length}: ${i??""}`:i??"select layouts to preview"}</div>
        </div>
      </div>
    `}};h([q({attribute:!1})],d.prototype,"hass",2),h([p()],d.prototype,"devices",2),h([p()],d.prototype,"entryId",2),h([p()],d.prototype,"model",2),h([p()],d.prototype,"layout",2),h([p()],d.prototype,"caps",2),h([p()],d.prototype,"overlayCaps",2),h([p()],d.prototype,"defaultLayout",2),h([p()],d.prototype,"stored",2),h([p()],d.prototype,"png",2),h([p()],d.prototype,"wboxes",2),h([p()],d.prototype,"dims",2),h([p()],d.prototype,"zoom",2),h([p()],d.prototype,"selected",2),h([p()],d.prototype,"layoutName",2),h([p()],d.prototype,"live",2),h([p()],d.prototype,"wireframe",2),h([p()],d.prototype,"status",2),h([p()],d.prototype,"tab",2),h([p()],d.prototype,"catalog",2),h([p()],d.prototype,"fwManifest",2),h([p()],d.prototype,"screenLayouts",2),h([p()],d.prototype,"screenDwell",2),h([p()],d.prototype,"screenTransition",2),h([p()],d.prototype,"screenPngs",2),h([p()],d.prototype,"screenIdx",2),h([p()],d.prototype,"screenOpacity",2),h([p()],d.prototype,"specText",2),h([p()],d.prototype,"specPng",2),h([p()],d.prototype,"specError",2);customElements.get("pimoroni-unicorn-panel")||customElements.define("pimoroni-unicorn-panel",d);export{d as PimoroniUnicornPanel};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
