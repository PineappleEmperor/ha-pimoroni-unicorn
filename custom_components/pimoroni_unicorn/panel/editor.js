var kt=Object.defineProperty;var Ct=Object.getOwnPropertyDescriptor;var p=(n,e,t,s)=>{for(var i=s>1?void 0:s?Ct(e,t):e,a=n.length-1,o;a>=0;a--)(o=n[a])&&(i=(s?o(e,t,i):o(i))||i);return s&&i&&kt(e,t,i),i};var D=globalThis,H=D.ShadowRoot&&(D.ShadyCSS===void 0||D.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,V=Symbol(),nt=new WeakMap,T=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==V)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(H&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=nt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&nt.set(t,e))}return e}toString(){return this.cssText}},ot=n=>new T(typeof n=="string"?n:n+"",void 0,V),B=(n,...e)=>{let t=n.length===1?n[0]:e.reduce((s,i,a)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[a+1],n[0]);return new T(t,n,V)},lt=(n,e)=>{if(H)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=D.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,n.appendChild(s)}},F=H?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return ot(t)})(n):n;var{is:Tt,defineProperty:Mt,getOwnPropertyDescriptor:Lt,getOwnPropertyNames:It,getOwnPropertySymbols:Nt,getPrototypeOf:Ot}=Object,z=globalThis,ct=z.trustedTypes,Rt=ct?ct.emptyScript:"",Wt=z.reactiveElementPolyfillSupport,M=(n,e)=>n,L={toAttribute(n,e){switch(e){case Boolean:n=n?Rt:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},P=(n,e)=>!Tt(n,e),dt={attribute:!0,type:String,converter:L,reflect:!1,useDefault:!1,hasChanged:P};Symbol.metadata??=Symbol("metadata"),z.litPropertyMetadata??=new WeakMap;var f=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=dt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&Mt(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:a}=Lt(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:i,set(o){let r=i?.call(this);a?.call(this,o),this.requestUpdate(e,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??dt}static _$Ei(){if(this.hasOwnProperty(M("elementProperties")))return;let e=Ot(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(M("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(M("properties"))){let t=this.properties,s=[...It(t),...Nt(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(F(i))}else e!==void 0&&t.push(F(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return lt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let a=(s.converter?.toAttribute!==void 0?s.converter:L).toAttribute(t,s.type);this._$Em=e,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let a=s.getPropertyOptions(i),o=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:L;this._$Em=i;let r=o.fromAttribute(t,a.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(e,t,s,i=!1,a){if(e!==void 0){let o=this.constructor;if(i===!1&&(a=this[e]),s??=o.getPropertyOptions(e),!((s.hasChanged??P)(a,t)||s.useDefault&&s.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:a},o){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),a!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,a]of this._$Ep)this[i]=a;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,a]of s){let{wrapped:o}=a,r=this[i];o!==!0||this._$AL.has(i)||r===void 0||this.C(i,void 0,a,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};f.elementStyles=[],f.shadowRootOptions={mode:"open"},f[M("elementProperties")]=new Map,f[M("finalized")]=new Map,Wt?.({ReactiveElement:f}),(z.reactiveElementVersions??=[]).push("2.1.2");var Q=globalThis,pt=n=>n,j=Q.trustedTypes,ht=j?j.createPolicy("lit-html",{createHTML:n=>n}):void 0,bt="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,ft="?"+$,Dt=`<${ft}>`,E=document,N=()=>E.createComment(""),O=n=>n===null||typeof n!="object"&&typeof n!="function",tt=Array.isArray,Ht=n=>tt(n)||typeof n?.[Symbol.iterator]=="function",J=`[ 	
\f\r]`,I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ut=/-->/g,gt=/>/g,_=RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),mt=/'/g,vt=/"/g,$t=/^(?:script|style|textarea|title)$/i,et=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),l=et(1),Gt=et(2),Qt=et(3),A=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),yt=new WeakMap,S=E.createTreeWalker(E,129);function xt(n,e){if(!tt(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return ht!==void 0?ht.createHTML(e):e}var zt=(n,e)=>{let t=n.length-1,s=[],i,a=e===2?"<svg>":e===3?"<math>":"",o=I;for(let r=0;r<t;r++){let c=n[r],u,m,g=-1,y=0;for(;y<c.length&&(o.lastIndex=y,m=o.exec(c),m!==null);)y=o.lastIndex,o===I?m[1]==="!--"?o=ut:m[1]!==void 0?o=gt:m[2]!==void 0?($t.test(m[2])&&(i=RegExp("</"+m[2],"g")),o=_):m[3]!==void 0&&(o=_):o===_?m[0]===">"?(o=i??I,g=-1):m[1]===void 0?g=-2:(g=o.lastIndex-m[2].length,u=m[1],o=m[3]===void 0?_:m[3]==='"'?vt:mt):o===vt||o===mt?o=_:o===ut||o===gt?o=I:(o=_,i=void 0);let b=o===_&&n[r+1].startsWith("/>")?" ":"";a+=o===I?c+Dt:g>=0?(s.push(u),c.slice(0,g)+bt+c.slice(g)+$+b):c+$+(g===-2?r:b)}return[xt(n,a+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},R=class n{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let a=0,o=0,r=e.length-1,c=this.parts,[u,m]=zt(e,t);if(this.el=n.createElement(u,s),S.currentNode=this.el.content,t===2||t===3){let g=this.el.content.firstChild;g.replaceWith(...g.childNodes)}for(;(i=S.nextNode())!==null&&c.length<r;){if(i.nodeType===1){if(i.hasAttributes())for(let g of i.getAttributeNames())if(g.endsWith(bt)){let y=m[o++],b=i.getAttribute(g).split($),w=/([.?@])?(.*)/.exec(y);c.push({type:1,index:a,name:w[2],strings:b,ctor:w[1]==="."?X:w[1]==="?"?Y:w[1]==="@"?Z:C}),i.removeAttribute(g)}else g.startsWith($)&&(c.push({type:6,index:a}),i.removeAttribute(g));if($t.test(i.tagName)){let g=i.textContent.split($),y=g.length-1;if(y>0){i.textContent=j?j.emptyScript:"";for(let b=0;b<y;b++)i.append(g[b],N()),S.nextNode(),c.push({type:2,index:++a});i.append(g[y],N())}}}else if(i.nodeType===8)if(i.data===ft)c.push({type:2,index:a});else{let g=-1;for(;(g=i.data.indexOf($,g+1))!==-1;)c.push({type:7,index:a}),g+=$.length-1}a++}}static createElement(e,t){let s=E.createElement("template");return s.innerHTML=e,s}};function k(n,e,t=n,s){if(e===A)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,a=O(e)?void 0:e._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(n),i._$AT(n,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=k(n,i._$AS(n,e.values),i,s)),e}var K=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??E).importNode(t,!0);S.currentNode=i;let a=S.nextNode(),o=0,r=0,c=s[0];for(;c!==void 0;){if(o===c.index){let u;c.type===2?u=new W(a,a.nextSibling,this,e):c.type===1?u=new c.ctor(a,c.name,c.strings,this,e):c.type===6&&(u=new G(a,this,e)),this._$AV.push(u),c=s[++r]}o!==c?.index&&(a=S.nextNode(),o++)}return S.currentNode=E,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},W=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=k(this,e,t),O(e)?e===v||e==null||e===""?(this._$AH!==v&&this._$AR(),this._$AH=v):e!==this._$AH&&e!==A&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ht(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==v&&O(this._$AH)?this._$AA.nextSibling.data=e:this.T(E.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=R.createElement(xt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let a=new K(i,this),o=a.u(this.options);a.p(t),this.T(o),this._$AH=a}}_$AC(e){let t=yt.get(e.strings);return t===void 0&&yt.set(e.strings,t=new R(e)),t}k(e){tt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let a of e)i===t.length?t.push(s=new n(this.O(N()),this.O(N()),this,this.options)):s=t[i],s._$AI(a),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=pt(e).nextSibling;pt(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},C=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,a){this.type=1,this._$AH=v,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=a,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=v}_$AI(e,t=this,s,i){let a=this.strings,o=!1;if(a===void 0)e=k(this,e,t,0),o=!O(e)||e!==this._$AH&&e!==A,o&&(this._$AH=e);else{let r=e,c,u;for(e=a[0],c=0;c<a.length-1;c++)u=k(this,r[s+c],t,c),u===A&&(u=this._$AH[c]),o||=!O(u)||u!==this._$AH[c],u===v?e=v:e!==v&&(e+=(u??"")+a[c+1]),this._$AH[c]=u}o&&!i&&this.j(e)}j(e){e===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},X=class extends C{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===v?void 0:e}},Y=class extends C{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==v)}},Z=class extends C{constructor(e,t,s,i,a){super(e,t,s,i,a),this.type=5}_$AI(e,t=this){if((e=k(this,e,t,0)??v)===A)return;let s=this._$AH,i=e===v&&s!==v||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,a=e!==v&&(s===v||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},G=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){k(this,e)}};var Pt=Q.litHtmlPolyfillSupport;Pt?.(R,W),(Q.litHtmlVersions??=[]).push("3.3.3");var wt=(n,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let a=t?.renderBefore??null;s._$litPart$=i=new W(e.insertBefore(N(),a),a,void 0,t??{})}return i._$AI(n),i};var st=globalThis,x=class extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=wt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return A}};x._$litElement$=!0,x.finalized=!0,st.litElementHydrateSupport?.({LitElement:x});var jt=st.litElementPolyfillSupport;jt?.({LitElement:x});(st.litElementVersions??=[]).push("4.2.2");var qt={attribute:!0,type:String,converter:L,reflect:!1,hasChanged:P},Ut=(n=qt,e,t)=>{let{kind:s,metadata:i}=t,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),s==="setter"&&((n=Object.create(n)).wrapped=!0),a.set(t.name,n),s==="accessor"){let{name:o}=t;return{set(r){let c=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,c,n,!0,r)},init(r){return r!==void 0&&this.C(o,void 0,n,r),r}}}if(s==="setter"){let{name:o}=t;return function(r){let c=this[o];e.call(this,r),this.requestUpdate(o,c,n,!0,r)}}throw Error("Unsupported decorator location: "+s)};function q(n){return(e,t)=>typeof t=="object"?Ut(n,e,t):((s,i,a)=>{let o=i.hasOwnProperty(a);return i.constructor.createProperty(a,s),o?Object.getOwnPropertyDescriptor(i,a):void 0})(n,e,t)}function h(n){return q({...n,state:!0,attribute:!1})}var it=560,Vt=JSON.stringify({id:"my_widget",label:"My Widget",w:16,h:7,default_cfg:{color:[0,255,0]},draw:[{op:"value",x:0,y:1,bind:"solar",fmt:"{:.1f}"},{op:"bar",x:0,y:6,w:16,h:1,bind:"soc",max:100,color:[0,120,255],bg:[30,30,30]}]},null,2),_t={galactic:[53,11],cosmic:[32,32],stellar:[16,16]},St="__mock__",Bt=n=>{let[e,t,s]=n??[0,0,0];return"#"+[e,t,s].map(i=>Math.max(0,Math.min(255,i|0)).toString(16).padStart(2,"0")).join("")},Ft=n=>{let e=(n||"").replace("#","");return[0,2,4].map(t=>parseInt(e.substr(t,2),16)||0)},d=class extends x{constructor(){super(...arguments);this.devices=[];this.entryId="";this.model="galactic";this.layout={widgets:[]};this.caps=[];this.overlayCaps=[];this.defaultLayout={widgets:[]};this.stored={};this.png="";this.wboxes=[];this.dims=[53,11];this.zoom=0;this.selected=-1;this.layoutName="default";this.live=!1;this.wireframe=!0;this.status="";this.tab="layout";this.catalog=[];this.fwManifest=null;this.contentLayouts=[];this.contentScreensets=[];this.showAllContent=!1;this.iconNames=[];this.dirty=!1;this.screenLayouts=[];this.screenDwell=10;this.screenTransition="none";this.screenPngs={};this.screenIdx=0;this.screenOpacity=1;this.screenTimer=0;this.specText=Vt;this.specPng="";this.specError="";this.specTimer=0;this._onKey=t=>{let s=t.target?.tagName;if(s==="INPUT"||s==="SELECT"||s==="TEXTAREA")return;let a={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[t.key];a&&(t.preventDefault(),this._nudge(a[0],a[1]))}}static{this.styles=B`
    :host {
      display: block; padding: 24px;
      color: var(--primary-text-color, #1c1b1f);
      font-family: var(--paper-font-body1_-_font-family, Roboto, system-ui, sans-serif);
      --pu-radius: 12px;
      --pu-surface: var(--card-background-color, #fff);
      --pu-outline: var(--divider-color, #c8c5ca);
      --pu-primary: var(--primary-color, #6750a4);
      --pu-on-primary: var(--text-primary-color, #fff);
    }
    .wrap { display: flex; gap: 20px; flex-wrap: wrap; align-items: flex-start; }
    .col {
      min-width: 300px; flex: 1; box-sizing: border-box;
      background: var(--pu-surface); border-radius: var(--pu-radius);
      padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.08);
    }
    .bar {
      display: flex; gap: 12px 16px; align-items: center; flex-wrap: wrap;
      margin-bottom: 20px; padding: 14px 16px; border-radius: var(--pu-radius);
      background: var(--pu-surface); box-shadow: 0 1px 2px rgba(0,0,0,.08);
    }
    .group { display: inline-flex; gap: 12px; align-items: center; flex-wrap: wrap; }
    .group + .group { padding-left: 16px; border-left: 1px solid var(--pu-outline); }
    .appbar {
      display: flex; gap: 16px; align-items: center; flex-wrap: wrap;
      padding: 12px 18px; margin-bottom: 16px; border-radius: var(--pu-radius);
      background: var(--pu-surface); box-shadow: 0 1px 3px rgba(0,0,0,.12);
    }
    .brand { font-size: 16px; font-weight: 600; letter-spacing: .2px; margin-right: 4px; }
    .grow { flex: 1; }
    .chip {
      font-size: 12px; font-weight: 500; padding: 4px 12px; border-radius: 14px;
      background: color-mix(in srgb, var(--pu-primary) 12%, transparent); color: var(--pu-primary);
    }
    .chip.dim { background: color-mix(in srgb, var(--secondary-text-color, #79747e) 14%, transparent); color: var(--secondary-text-color, #49454f); }
    .chip.warn { background: color-mix(in srgb, var(--warning-color, #ed6c02) 20%, transparent); color: var(--warning-color, #ed6c02); }
    label { font-size: 13px; display: inline-flex; gap: 6px; align-items: center; color: var(--secondary-text-color, #49454f); }
    select, input, .spec {
      font: inherit; font-size: 14px; padding: 9px 12px; border-radius: 8px;
      border: 1px solid var(--pu-outline); background: var(--pu-surface);
      color: var(--primary-text-color, #1c1b1f); outline: none; transition: border-color .15s, box-shadow .15s;
    }
    select:focus, input:focus, .spec:focus { border-color: var(--pu-primary); box-shadow: 0 0 0 2px color-mix(in srgb, var(--pu-primary) 30%, transparent); }
    input[type="color"] { padding: 0; width: 38px; height: 34px; cursor: pointer; }
    input[type="range"] { padding: 0; border: none; box-shadow: none; accent-color: var(--pu-primary); }
    input[type="checkbox"] { width: 16px; height: 16px; accent-color: var(--pu-primary); }
    button {
      font: inherit; font-size: 14px; font-weight: 500; cursor: pointer;
      padding: 9px 20px; border-radius: 20px; border: none;
      background: var(--pu-primary); color: var(--pu-on-primary);
      transition: filter .15s, box-shadow .15s; box-shadow: 0 1px 2px rgba(0,0,0,.15);
    }
    button:hover:not([disabled]) { filter: brightness(1.08); box-shadow: 0 2px 5px rgba(0,0,0,.2); }
    button:active:not([disabled]) { filter: brightness(.95); }
    button[disabled] { opacity: .38; cursor: not-allowed; box-shadow: none; }
    button.secondary { background: color-mix(in srgb, var(--pu-primary) 14%, var(--pu-surface)); color: var(--pu-primary); box-shadow: none; }
    button.danger { background: var(--error-color, #ba1a1a); color: #fff; }
    button.zbtn { padding: 6px 11px; min-width: 30px; line-height: 1; border-radius: 10px; }
    .stage { position: relative; display: inline-block; background: #000; line-height: 0; border-radius: 8px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.12); overflow: hidden; }
    .stage img { image-rendering: pixelated; display: block; }
    .grid, .boxes { position: absolute; inset: 0; pointer-events: none; }
    .box { position: absolute; box-sizing: border-box; border: 1px solid rgba(255,255,255,.35); cursor: grab; touch-action: none; pointer-events: auto; border-radius: 2px; }
    .box.sel { border: 2px solid var(--pu-primary); background: color-mix(in srgb, var(--pu-primary) 14%, transparent); }
    .box .tag { position: absolute; top: -17px; left: 0; font: 11px ui-monospace, monospace; color: #ddd; white-space: nowrap; }
    .wlist { list-style: none; padding: 0; margin: 0 0 12px; }
    .wlist li { display: flex; gap: 10px; align-items: center; padding: 10px 12px; border-radius: 10px; cursor: pointer; transition: background .12s; }
    .wlist li:hover { background: color-mix(in srgb, var(--pu-primary) 7%, transparent); }
    .wlist li.sel { background: color-mix(in srgb, var(--pu-primary) 14%, transparent); box-shadow: inset 3px 0 0 var(--pu-primary); }
    .wlist li .grow { flex: 1; }
    .panelrow { display: flex; gap: 10px; align-items: center; margin: 10px 0; flex-wrap: wrap; }
    .panelrow > label:first-child { min-width: 64px; }
    h3 { margin: 4px 0 14px; font-size: 16px; font-weight: 500; letter-spacing: .1px; }
    .status { margin-top: 16px; font: 13px ui-monospace, monospace; color: var(--secondary-text-color, #49454f); min-height: 18px; }
    .status.err { color: var(--error-color, #ba1a1a); }
    .hint { color: var(--secondary-text-color, #79747e); font-size: 13px; }
    .tabs { display: flex; gap: 4px; margin-bottom: 20px; border-bottom: 1px solid var(--pu-outline); }
    .tab {
      background: none; color: var(--secondary-text-color, #49454f); border: none; box-shadow: none;
      border-radius: 8px 8px 0 0; padding: 12px 20px; font-weight: 500;
      border-bottom: 2px solid transparent; margin-bottom: -1px;
    }
    .tab:hover:not(.on) { background: color-mix(in srgb, var(--pu-primary) 7%, transparent); filter: none; }
    .tab.on { color: var(--pu-primary); border-bottom-color: var(--pu-primary); }
    .mtable { max-width: 780px; margin-bottom: 8px; }
    .mhead, .mrow { display: grid; grid-template-columns: 56px minmax(120px,1fr) minmax(80px,0.9fr) 120px 110px; gap: 12px; align-items: center; }
    .mtable.compact .mhead, .mtable.compact .mrow { grid-template-columns: minmax(120px,1fr) minmax(80px,0.9fr) 120px 110px; }
    .mhead { font-size: 12px; font-weight: 600; color: var(--secondary-text-color, #79747e); padding: 0 14px 6px; }
    .mrow { border: 1px solid var(--pu-outline); border-radius: 10px; padding: 10px 14px; margin-bottom: 8px; }
    .cell-name { font-weight: 500; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .cell-action { display: flex; justify-content: flex-end; }
    .thumb { width: 48px; height: 48px; object-fit: contain; image-rendering: pixelated; background: #000; border-radius: 6px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.12); }
    .catalog { list-style: none; padding: 0; margin: 0; max-width: 680px; }
    .catalog li {
      display: flex; gap: 12px; align-items: center; padding: 12px 14px;
      border: 1px solid var(--pu-outline); border-radius: 10px; margin-bottom: 8px;
    }
    .catalog li .grow { flex: 1; }
    .badge { font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 12px; background: color-mix(in srgb, var(--pu-primary) 12%, transparent); color: var(--pu-primary); }
    .badge.ok { background: color-mix(in srgb, var(--success-color, #2e7d32) 18%, transparent); color: var(--success-color, #2e7d32); }
    .badge.warn { background: color-mix(in srgb, var(--warning-color, #ed6c02) 20%, transparent); color: var(--warning-color, #ed6c02); }
    .spec { width: 380px; height: 320px; font: 13px ui-monospace, monospace; resize: vertical; }
  `}firstUpdated(){this.loadDevices(),this.loadIcons()}async loadIcons(){try{let t=await this.hass.callWS({type:"pimoroni_unicorn/icons"});this.iconNames=[...t.builtin??[],...t.installed??[]]}catch{}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKey)}disconnectedCallback(){window.removeEventListener("keydown",this._onKey),super.disconnectedCallback()}_nudge(t,s){let[i,a]=this.dims;if(this.selected>=0&&this.layout.widgets[this.selected]){let o=this.layout.widgets[this.selected],[r,c]=this.boxDims(this.selected);o.x=Math.max(1-r,Math.min(i-1,o.x+t)),o.y=Math.max(1-c,Math.min(a-1,o.y+s)),this.edited()}}async loadDevices(){let t=await this.hass.callWS({type:"pimoroni_unicorn/devices"});this.devices=t.devices??[],this.devices.length?await this.selectDevice(this.devices[0].entry_id):await this.selectMock(this.model)}async loadCaps(t){let s=await this.hass.callWS({type:"pimoroni_unicorn/capabilities",...t});this.caps=s.widgets??[],this.overlayCaps=s.overlays??[],this.defaultLayout=s.default_layout,this.model=s.model,this.dims=_t[this.model]??[53,11],await this.refreshStored()}async selectDevice(t){let s=this.devices.find(a=>a.entry_id===t);if(!s||!this.guardDiscard())return;this.entryId=t,await this.loadCaps({entry_id:t});let i=s.active_layout?this.stored[s.active_layout]:void 0;this.loadLayout(i??this.defaultLayout)}async selectMock(t){this.guardDiscard()&&(this.entryId="",await this.loadCaps({model:t}),this.loadLayout(this.defaultLayout))}async refreshStored(){let t=await this.hass.callWS({type:"pimoroni_unicorn/layouts"});this.stored=t.layouts??{}}loadLayout(t){this.layout=JSON.parse(JSON.stringify(t)),this.layoutName=this.layout.name??"default",this.selected=-1,this.dirty=!1,this.renderPreview()}guardDiscard(){return!this.dirty||confirm("Discard unsaved changes to this page?")}async renderPreview(){try{let t=await this.hass.callWS({type:"pimoroni_unicorn/render",model:this.model,layout:this.layout});this.png=t.png,this.wboxes=t.boxes??[],this.status.startsWith("Render failed")&&(this.status="")}catch(t){this.png="",this.status=`Render failed: ${t?.message??t}`}}edited(){this.dirty=!0,this.requestUpdate(),this.renderTimer&&clearTimeout(this.renderTimer),this.renderTimer=window.setTimeout(()=>this.renderPreview(),80),this.live&&this.entryId&&(this.pushTimer&&clearTimeout(this.pushTimer),this.pushTimer=window.setTimeout(()=>this.pushLive(),250))}async pushLive(){await this.hass.callWS({type:"pimoroni_unicorn/push_layout",entry_id:this.entryId,layout:this.layout})}capFor(t){return this.caps.find(s=>s.id===t)}typeOf(t){return t.type??t.id}capForEntry(t){return this.capFor(this.typeOf(t))}get scale(){return this.zoom||Math.max(4,Math.floor(it/this.dims[0]))}zoomBy(t){this.zoom=Math.min(48,Math.max(4,this.scale+t))}onWheel(t){t.preventDefault(),this.zoomBy(t.deltaY<0?2:-2)}boxDims(t){let s=this.wboxes[t];if(s)return s;let i=this.layout.widgets[t],a=i?this.capForEntry(i):void 0;return a?[a.w,a.h]:[0,0]}cfgVal(t,s){return t.cfg?.[s]??this.capForEntry(t)?.default_cfg[s]}setCfg(t,s,i){t.cfg={...t.cfg??{},[s]:i},this.edited()}setName(t,s){let i=s.trim();i?t.name=i:delete t.name,this.edited()}setPos(t,s,i){let[a,o]=this.boxDims(this.selected),[r,c]=this.dims,u=Math.round(i);s==="x"?t.x=Math.max(1-a,Math.min(r-1,u)):t.y=Math.max(1-o,Math.min(c-1,u)),this.edited()}onImgLoad(t){let s=t.target;this.dims=[s.naturalWidth,s.naturalHeight]}startDrag(t,s){s.preventDefault(),this.selected=t;let i=this.layout.widgets[t],[a,o]=this.boxDims(t),r=this.layout.grid??2,[c,u]=this.dims,m=s.clientX,g=s.clientY,y=i.x,b=i.y;s.target.setPointerCapture(s.pointerId);let w=rt=>{let Et=Math.round((rt.clientX-m)/this.scale/r)*r,At=Math.round((rt.clientY-g)/this.scale/r)*r;i.x=Math.max(1-a,Math.min(c-1,y+Et)),i.y=Math.max(1-o,Math.min(u-1,b+At)),this.edited()},at=()=>{window.removeEventListener("pointermove",w),window.removeEventListener("pointerup",at),this.renderPreview()};window.addEventListener("pointermove",w),window.addEventListener("pointerup",at)}addWidget(t){if(!t)return;let s=this.capFor(t),i=new Set(this.layout.widgets.map(o=>o.id)),a;if(s?.multi||i.has(t)){let o=2,r=`${t}-${o}`;for(;i.has(r);)r=`${t}-${++o}`;a={id:r,type:t,name:`${s?.label??t} ${o}`,x:0,y:0,cfg:{}}}else a={id:t,type:t,x:0,y:0,cfg:{}};this.layout.widgets.push(a),this.selected=this.layout.widgets.length-1,this.edited()}removeWidget(t){this.layout.widgets.splice(t,1),this.selected=-1,this.edited()}toggleOverlay(t,s){let i=new Set(this.layout.overlays??[]);s?i.add(t):i.delete(t),this.layout.overlays=[...i],this.edited()}async save(){this.entryId&&(this.layout.name=this.layoutName,await this.hass.callWS({type:"pimoroni_unicorn/save_layout",entry_id:this.entryId,name:this.layoutName,layout:this.layout}),await this.refreshStored(),this.dirty=!1,this.status=`Saved "${this.layoutName}" and pushed to device.`)}async deleteLayout(){this.stored[this.layoutName]&&confirm(`Delete page "${this.layoutName}"? This can't be undone.`)&&(await this.hass.callWS({type:"pimoroni_unicorn/delete_layout",name:this.layoutName}),await this.refreshStored(),this.status=`Deleted "${this.layoutName}".`,this.loadLayout(this.defaultLayout))}renderWidgetEditor(){let t=this.layout.widgets[this.selected];if(!t)return l`<p class="hint">Select a widget to edit.</p>`;let s=this.capForEntry(t);return s?l`
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
      ${s.cfg_fields.map(i=>i.type==="select"?l`<div class="panelrow"><label>${i.label??i.key}</label>
            <select @change=${a=>this.setCfg(t,i.key,a.target.value)}>
              ${(i.options??[]).map(a=>l`<option ?selected=${this.cfgVal(t,i.key)===a}>${a}</option>`)}
            </select></div>`:i.type==="number"?l`<div class="panelrow"><label>${i.label??i.key}</label>
            <input type="number" style="width:60px" min=${i.min??1} max=${i.max??64} step=${i.step??1}
              .value=${String(this.cfgVal(t,i.key))}
              @change=${a=>this.setCfg(t,i.key,+a.target.value)} /></div>`:i.type==="icon"?l`<div class="panelrow"><label>${i.label??i.key}</label>
            <select @change=${a=>this.setCfg(t,i.key,a.target.value)}>
              ${this.iconNames.map(a=>l`<option ?selected=${this.cfgVal(t,i.key)===a}>${a}</option>`)}
            </select></div>`:i.type==="entity"?l`<div class="panelrow"><label>${i.label??i.key}</label>
            <input type="text" style="width:200px" list="pu-entity-list" placeholder="entity id…"
              .value=${String(this.cfgVal(t,i.key)??"")}
              @change=${a=>this.setCfg(t,i.key,a.target.value)} />
            <datalist id="pu-entity-list">
              ${Object.keys(this.hass?.states??{}).map(a=>l`<option value=${a}></option>`)}
            </datalist></div>`:i.type==="text"?l`<div class="panelrow"><label>${i.label??i.key}</label>
            <input type="text" style="width:120px" .value=${String(this.cfgVal(t,i.key)??"")}
              @change=${a=>this.setCfg(t,i.key,a.target.value)} /></div>`:l`<div class="panelrow"><label>${i.label??i.key}</label>
          <input type="color" .value=${Bt(this.cfgVal(t,i.key))}
            @input=${a=>this.setCfg(t,i.key,Ft(a.target.value))} /></div>`)}
      <div class="panelrow"><button class="danger" @click=${()=>this.removeWidget(this.selected)}>Remove widget</button></div>
    `:""}switchTab(t){this.tab=t,t==="market"?this.loadCatalog():t==="edit"?this.previewSpec():t==="screens"&&this.buildScreenPreview()}_appBar(){let t=this.devices.find(s=>s.entry_id===this.entryId);return l`
      <div class="appbar">
        <span class="brand">Pimoroni Unicorn</span>
        <label>Device
          <select @change=${s=>{let i=s.target.value;i===St?this.selectMock(this.model):this.selectDevice(i)}}>
            <option value=${St} ?selected=${!this.entryId}>Mock (preview only)</option>
            ${this.devices.map(s=>l`<option value=${s.entry_id} ?selected=${s.entry_id===this.entryId}>${s.name}</option>`)}
          </select>
        </label>
        ${this.entryId?l`<span class="chip">${t?.model??this.model}</span>`:l`<label>Model
              <select @change=${s=>this.selectMock(s.target.value)}>
                ${Object.keys(_t).map(s=>l`<option ?selected=${s===this.model}>${s}</option>`)}
              </select></label>`}
        <span class="chip dim">${this.dims[0]}&times;${this.dims[1]} px</span>
        <span class="grow"></span>
        ${this.dirty?l`<span class="chip warn">unsaved changes</span>`:""}
        ${this.fwManifest?.engine_version?l`<span class="hint">engine v${this.fwManifest.engine_version}</span>`:""}
      </div>`}render(){return l`
      ${this._appBar()}
      <div class="tabs">
        <button class="tab ${this.tab==="layout"?"on":""}" @click=${()=>this.switchTab("layout")}>Designer</button>
        <button class="tab ${this.tab==="market"?"on":""}" @click=${()=>this.switchTab("market")}>Marketplace</button>
        <button class="tab ${this.tab==="edit"?"on":""}" @click=${()=>this.switchTab("edit")}>Widget editor</button>
        <button class="tab ${this.tab==="screens"?"on":""}" @click=${()=>this.switchTab("screens")}>Playlists</button>
      </div>
      ${this.tab==="market"?this._marketplaceView():this.tab==="edit"?this._editorView():this.tab==="screens"?this._screensView():this._layoutView()}
    `}_layoutView(){let t=this.scale,s=new Set(this.layout.widgets.map(r=>this.typeOf(r))),i=this.caps.filter(r=>r.multi||!s.has(r.id)),a=new Set(this.layout.overlays??[]),o=`background-image:linear-gradient(to right,rgba(255,255,255,.10) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.10) 1px,transparent 1px);background-size:${t}px ${t}px`;return l`
      <div class="bar">
        <div class="group">
          <label>Page
            <select @change=${r=>{let c=r.target.value;this.guardDiscard()&&this.loadLayout(c==="__new__"?this.defaultLayout:this.stored[c])}}>
              ${Object.keys(this.stored).map(r=>l`<option ?selected=${r===this.layoutName}>${r}</option>`)}
              <option value="__new__">+ new page</option>
            </select>
          </label>
          <label>Name <input .value=${this.layoutName} @input=${r=>this.layoutName=r.target.value} /></label>
        </div>
        <div class="group">
          <button @click=${this.save} ?disabled=${!this.entryId} title=${this.entryId?"":"Select a device to save/push"}>Save &amp; Push</button>
          ${this.stored[this.layoutName]?l`<button class="secondary" @click=${()=>this.publishLayout(!0)} title="List this page in the marketplace">Publish</button>`:""}
          ${this.stored[this.layoutName]?l`<button class="danger" @click=${this.deleteLayout}>Delete</button>`:""}
        </div>
        <span class="grow"></span>
        <div class="group">
          <label>Snap
            <select @change=${r=>{this.layout.grid=+r.target.value,this.edited()}}>
              ${[1,2,4].map(r=>l`<option ?selected=${(this.layout.grid??2)===r}>${r}</option>`)}
            </select> px</label>
          <label>Zoom
            <button class="zbtn" @click=${()=>this.zoomBy(-2)} title="Zoom out">&minus;</button>
            <input type="range" min="4" max="48" .value=${String(this.scale)}
              @input=${r=>this.zoom=+r.target.value} />
            <button class="zbtn" @click=${()=>this.zoomBy(2)} title="Zoom in">+</button>
          </label>
          <label><input type="checkbox" .checked=${this.wireframe} @change=${r=>this.wireframe=r.target.checked} /> wireframe</label>
          <label><input type="checkbox" .checked=${this.live} ?disabled=${!this.entryId} @change=${r=>this.live=r.target.checked} /> live push</label>
        </div>
      </div>

      <div class="wrap">
        <div class="col">
          <div class="stage" style=${`width:${this.dims[0]*t}px;height:${this.dims[1]*t}px`}
            @wheel=${this.onWheel}>
            ${this.png?l`<img src="data:image/png;base64,${this.png}" width=${this.dims[0]*t} height=${this.dims[1]*t} @load=${this.onImgLoad} />`:""}
            <div class="grid" style=${o}></div>
            ${this.wireframe?l`<div class="boxes">${this.layout.widgets.map((r,c)=>{if(!this.capForEntry(r)||r.enabled===!1)return"";let[u,m]=this.boxDims(c);return l`<div class="box ${c===this.selected?"sel":""}"
                style=${`left:${r.x*t}px;top:${r.y*t}px;width:${u*t}px;height:${m*t}px`}
                @pointerdown=${g=>this.startDrag(c,g)}>
                <span class="tag">${r.name??this.capForEntry(r)?.label??r.id}</span></div>`})}</div>`:""}
          </div>
          <div class="status ${this.status.startsWith("Render failed")?"err":""}">${this.status}</div>
        </div>

        <div class="col">
          <h3>Widgets</h3>
          <ul class="wlist">
            ${this.layout.widgets.map((r,c)=>l`
              <li class="${c===this.selected?"sel":""}" @click=${()=>this.selected=c}>
                <input type="checkbox" .checked=${r.enabled!==!1}
                  @click=${u=>{u.stopPropagation(),r.enabled=u.target.checked,this.edited()}} />
                <span class="grow">${r.name??this.capForEntry(r)?.label??r.id}</span>
              </li>`)}
          </ul>
          ${i.length?l`<div class="panelrow">
            <select id="addsel"><option value="">add widget…</option>${i.map(r=>l`<option value=${r.id}>${r.label}</option>`)}</select>
            <button class="secondary" @click=${()=>{let r=this.renderRoot.querySelector("#addsel");this.addWidget(r.value),r.value=""}}>Add</button>
          </div>`:""}
          <h3>Overlays</h3>
          ${this.overlayCaps.map(r=>l`<div class="panelrow"><label>
            <input type="checkbox" .checked=${a.has(r.id)} @change=${c=>this.toggleOverlay(r.id,c.target.checked)} /> ${r.label}</label></div>`)}
          <h3>Selected</h3>
          ${this.renderWidgetEditor()}
        </div>
      </div>
    `}async loadCatalog(){if(await this.loadContent(),!this.entryId){this.catalog=[],this.fwManifest=null;return}let t=await this.hass.callWS({type:"pimoroni_unicorn/catalog",entry_id:this.entryId});this.catalog=t.widgets??[];let s=await this.hass.callWS({type:"pimoroni_unicorn/fw_manifest",entry_id:this.entryId});this.fwManifest=s.manifest??null}async loadContent(){let t=this.entryId?{entry_id:this.entryId}:{},s=await this.hass.callWS({type:"pimoroni_unicorn/content_catalog",...t});this.contentLayouts=s.layouts??[],this.contentScreensets=s.screensets??[]}async deployLayout(t,s){if(!this.entryId){this.status="Select a device to deploy.";return}if(!s&&!confirm(`"${t}" isn't built for this device's model. Deploy anyway?`))return;let i=await this.hass.callWS({type:"pimoroni_unicorn/deploy_layout",entry_id:this.entryId,name:t,override:!s});this.status=i.ok?`Deployed "${t}" (installing any missing widgets/fonts first).`:"Deploy failed."}async deployScreenset(t,s){if(!this.entryId){this.status="Select a device to deploy.";return}if(!s&&!confirm(`"${t}" isn't built for this device's model. Deploy anyway?`))return;let i=await this.hass.callWS({type:"pimoroni_unicorn/deploy_screenset",entry_id:this.entryId,id:t,override:!s});this.status=i.ok?`Deployed screen set "${t}".`:"Deploy failed."}async publishLayout(t){if(!this.stored[this.layoutName]){this.status="Save the layout first, then publish.";return}await this.hass.callWS({type:"pimoroni_unicorn/publish_layout",name:this.layoutName,published:t}),this.status=t?`Published "${this.layoutName}" to the marketplace.`:`Unpublished "${this.layoutName}".`,this.loadContent()}async saveScreenset(){if(!this.screenLayouts.length){this.status="Add at least one screen first.";return}let t=prompt("Name this screen set:");t&&(await this.hass.callWS({type:"pimoroni_unicorn/save_screenset",id:t,screenset:{label:t,layouts:this.screenLayouts,dwell:this.screenDwell,transition:this.screenTransition,triggers:[]}}),this.status=`Saved screen set "${t}".`,this.loadContent())}async installWidget(t){await this.hass.callWS({type:"pimoroni_unicorn/fw_install",entry_id:this.entryId,widget_id:t}),this.status=`Installing ${t}\u2026 device will reboot.`,setTimeout(()=>this.loadCatalog(),8e3)}async removeWidgetUnit(t){await this.hass.callWS({type:"pimoroni_unicorn/fw_remove",entry_id:this.entryId,widget_id:t}),this.status=`Removing ${t}\u2026 device will reboot.`,setTimeout(()=>this.loadCatalog(),8e3)}_thumb(t){return t?l`<img class="thumb" src="data:image/png;base64,${t}" />`:l`<div class="thumb"></div>`}_mhead(t=!0){return l`<div class="mhead">${t?l`<span>Preview</span>`:""}<span>Name</span><span>Dependencies</span><span>Status</span><span></span></div>`}_contentRow(t,s){return l`<div class="mrow">
      ${this._thumb(t.thumb)}
      <div class="cell-name">${t.label}
        ${t.compat?.length?l`<span class="hint">[${t.compat.join("/")}]</span>`:""}
        ${s==="screenset"?l`<span class="hint">${t.screens} page(s)</span>`:""}</div>
      <div class="hint">${t.requires?.length?l`<span title=${t.requires.join(", ")}>${t.requires.length} dep(s)</span>`:"\u2014"}</div>
      <div>${t.compatible?l`<span class="badge ok">compatible</span>`:l`<span class="badge warn">other model</span>`}</div>
      <div class="cell-action"><button ?disabled=${!this.entryId} title=${this.entryId?"":"Select a device to deploy"}
        @click=${()=>s==="layout"?this.deployLayout(t.id,t.compatible):this.deployScreenset(t.id,t.compatible)}>Deploy</button></div>
    </div>`}_marketplaceView(){let t=this.showAllContent,s=this.contentLayouts.filter(r=>t||r.compatible),i=this.contentScreensets.filter(r=>t||r.compatible),a={installed:"ok",outdated:"warn",not_installed:""},o={installed:"installed",outdated:"update available",not_installed:"not installed"};return l`
      <div class="bar">
        <label><input type="checkbox" .checked=${this.showAllContent}
          @change=${r=>{this.showAllContent=r.target.checked}} /> show all models</label>
        <span class="grow"></span>
        <button class="secondary" @click=${this.loadCatalog}>Refresh</button>
      </div>

      <h3>Pages</h3>
      ${s.length?l`<div class="mtable">${this._mhead()}${s.map(r=>this._contentRow(r,"layout"))}</div>`:l`<p class="hint">No published pages${t?"":" for this device"}. Publish one from the Designer tab.</p>`}

      <h3>Playlists</h3>
      ${i.length?l`<div class="mtable">${this._mhead()}${i.map(r=>this._contentRow(r,"screenset"))}</div>`:l`<p class="hint">No playlists${t?"":" for this device"}. Compose one on the Playlists tab.</p>`}

      <h3>Widgets &amp; fonts</h3>
      ${this.entryId?l`<div class="mtable compact">${this._mhead(!1)}
            ${this.catalog.map(r=>l`<div class="mrow">
              <div class="cell-name">${r.label}</div>
              <div class="hint">${r.requires?.length?l`<span title=${r.requires.join(", ")}>${r.requires.length} dep(s)</span>`:"\u2014"}</div>
              <div><span class="badge ${a[r.status]??""}">${o[r.status]??r.status}</span></div>
              <div class="cell-action">${r.status==="installed"?l`<button class="danger" @click=${()=>this.removeWidgetUnit(r.id)}>Remove</button>`:l`<button @click=${()=>this.installWidget(r.id)}>${r.status==="outdated"?"Update":"Install"}</button>`}</div>
            </div>`)}
          </div>`:l`<p class="hint">Select a device to manage installed widgets.</p>`}
      <p class="hint">Deploying a page installs any widgets/fonts it needs over the air first, then pushes it; the device reboots if files changed.</p>
    `}onSpecInput(t){this.specText=t,clearTimeout(this.specTimer),this.specTimer=window.setTimeout(()=>this.previewSpec(),400)}async previewSpec(){let t;try{t=JSON.parse(this.specText)}catch(s){this.specError=`JSON: ${s.message}`;return}try{let s=await this.hass.callWS({type:"pimoroni_unicorn/widget_preview",model:this.model,spec:t});this.specPng=s.png,this.specError=""}catch(s){this.specError=s?.message??String(s)}}async importSpec(t){try{let s=await this.hass.callWS({type:"pimoroni_unicorn/widget_import",text:t});this.specText=JSON.stringify(s.spec,null,2),this.specError="",this.previewSpec()}catch(s){this.specError=s?.message??String(s)}}async saveSpec(){let t;try{t=JSON.parse(this.specText)}catch(s){this.specError=`JSON: ${s.message}`;return}try{let s=await this.hass.callWS({type:"pimoroni_unicorn/widget_save",spec:t});this.specError="",this.status=`Saved custom widget "${s.id}". Install it from the Marketplace tab.`}catch(s){this.specError=s?.message??String(s)}}_editorView(){let t=Math.max(6,Math.floor(it/this.dims[0]));return l`
      <div class="bar"><span class="hint">declarative widget — JSON spec, previewed on ${this.model}</span></div>
      <div class="wrap">
        <div class="col">
          <textarea class="spec" .value=${this.specText}
            @input=${s=>this.onSpecInput(s.target.value)}></textarea>
          <div class="panelrow">
            <button @click=${this.saveSpec}>Save custom</button>
            <button class="secondary" @click=${()=>{let s=prompt("Paste YAML or JSON widget spec:");s&&this.importSpec(s)}}>Import…</button>
          </div>
          ${this.specError?l`<div class="status err">${this.specError}</div>`:l`<div class="hint">binds: solar, soc, consumption, co2… (unknown binds preview as 123)</div>`}
        </div>
        <div class="col">
          <div class="stage" style=${`width:${this.dims[0]*t}px;height:${this.dims[1]*t}px`}>
            ${this.specPng?l`<img src="data:image/png;base64,${this.specPng}" width=${this.dims[0]*t} height=${this.dims[1]*t} />`:""}
          </div>
        </div>
      </div>
    `}toggleScreen(t,s){this.screenLayouts=s?[...this.screenLayouts,t]:this.screenLayouts.filter(i=>i!==t),this.buildScreenPreview()}async buildScreenPreview(){clearInterval(this.screenTimer);let t={};for(let s of this.screenLayouts){let i=this.stored[s];if(i)try{let a=await this.hass.callWS({type:"pimoroni_unicorn/render",model:this.model,layout:i});t[s]=a.png}catch{}}this.screenPngs=t,this.screenIdx=0,this.screenOpacity=1,this.screenLayouts.length>1&&this.screenDwell>0&&(this.screenTimer=window.setInterval(()=>this._advancePreview(),this.screenDwell*1e3))}_advancePreview(){let t=(this.screenIdx+1)%this.screenLayouts.length;this.screenTransition==="fade"?(this.screenOpacity=0,setTimeout(()=>{this.screenIdx=t,this.screenOpacity=1},280)):this.screenIdx=t}async pushScreens(){!this.entryId||!this.screenLayouts.length||(await this.hass.callWS({type:"pimoroni_unicorn/push_screens",entry_id:this.entryId,layouts:this.screenLayouts,dwell:this.screenDwell,transition:this.screenTransition}),this.status=`Pushed ${this.screenLayouts.length} page(s) to device.`)}_screensView(){let t=Math.max(6,Math.floor(it/this.dims[0])),s=Object.keys(this.stored),i=this.screenLayouts[this.screenIdx],a=i?this.screenPngs[i]:"";return l`
      <div class="bar"><span class="hint">compose a playlist — pages cycle on a timer; preview on ${this.model}</span></div>
      <div class="wrap">
        <div class="col">
          <h3>Pages in this playlist</h3>
          <p class="hint">Tick pages to include; play order follows the order you tick.</p>
          ${s.length?s.map(o=>l`<div class="panelrow"><label>
            <input type="checkbox" ?checked=${this.screenLayouts.includes(o)}
              @change=${r=>this.toggleScreen(o,r.target.checked)} />
            ${this.screenLayouts.includes(o)?l`<span class="chip">${this.screenLayouts.indexOf(o)+1}</span>`:""} ${o}</label></div>`):l`<p class="hint">No saved pages yet — create one on the Designer tab.</p>`}
          <div class="panelrow"><label>Dwell (s)
            <input type="number" style="width:60px" min="1" max="600" .value=${String(this.screenDwell)}
              @change=${o=>{this.screenDwell=+o.target.value,this.buildScreenPreview()}} /></label></div>
          <div class="panelrow"><label>Transition
            <select @change=${o=>{this.screenTransition=o.target.value,this.buildScreenPreview()}}>
              ${["none","fade"].map(o=>l`<option ?selected=${o===this.screenTransition}>${o}</option>`)}
            </select></label></div>
          <div class="panelrow">
            <button @click=${this.pushScreens} ?disabled=${!this.entryId} title=${this.entryId?"":"Select a device to push"}>Push to device</button>
            <button class="secondary" @click=${this.saveScreenset} ?disabled=${!this.screenLayouts.length} title="Save as a reusable playlist in the marketplace">Save as playlist</button>
          </div>
        </div>
        <div class="col">
          <div class="stage" style=${`width:${this.dims[0]*t}px;height:${this.dims[1]*t}px`}>
            ${a?l`<img src="data:image/png;base64,${a}" width=${this.dims[0]*t} height=${this.dims[1]*t}
              style=${`opacity:${this.screenOpacity};transition:opacity 280ms`} />`:""}
          </div>
          <div class="hint">${this.screenLayouts.length>1?`playing ${this.screenIdx+1}/${this.screenLayouts.length}: ${i??""}`:i??"tick pages to preview"}</div>
        </div>
      </div>
    `}};p([q({attribute:!1})],d.prototype,"hass",2),p([h()],d.prototype,"devices",2),p([h()],d.prototype,"entryId",2),p([h()],d.prototype,"model",2),p([h()],d.prototype,"layout",2),p([h()],d.prototype,"caps",2),p([h()],d.prototype,"overlayCaps",2),p([h()],d.prototype,"defaultLayout",2),p([h()],d.prototype,"stored",2),p([h()],d.prototype,"png",2),p([h()],d.prototype,"wboxes",2),p([h()],d.prototype,"dims",2),p([h()],d.prototype,"zoom",2),p([h()],d.prototype,"selected",2),p([h()],d.prototype,"layoutName",2),p([h()],d.prototype,"live",2),p([h()],d.prototype,"wireframe",2),p([h()],d.prototype,"status",2),p([h()],d.prototype,"tab",2),p([h()],d.prototype,"catalog",2),p([h()],d.prototype,"fwManifest",2),p([h()],d.prototype,"contentLayouts",2),p([h()],d.prototype,"contentScreensets",2),p([h()],d.prototype,"showAllContent",2),p([h()],d.prototype,"iconNames",2),p([h()],d.prototype,"dirty",2),p([h()],d.prototype,"screenLayouts",2),p([h()],d.prototype,"screenDwell",2),p([h()],d.prototype,"screenTransition",2),p([h()],d.prototype,"screenPngs",2),p([h()],d.prototype,"screenIdx",2),p([h()],d.prototype,"screenOpacity",2),p([h()],d.prototype,"specText",2),p([h()],d.prototype,"specPng",2),p([h()],d.prototype,"specError",2);customElements.get("pimoroni-unicorn-panel")||customElements.define("pimoroni-unicorn-panel",d);export{d as PimoroniUnicornPanel};
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
