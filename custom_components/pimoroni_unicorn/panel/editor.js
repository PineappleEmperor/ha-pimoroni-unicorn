var Lt=Object.defineProperty;var Ct=Object.getOwnPropertyDescriptor;var d=(o,s,t,e)=>{for(var i=e>1?void 0:e?Ct(s,t):s,a=o.length-1,n;a>=0;a--)(n=o[a])&&(i=(e?n(s,t,i):n(i))||i);return e&&i&&Lt(s,t,i),i};var D=globalThis,W=D.ShadowRoot&&(D.ShadyCSS===void 0||D.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,V=Symbol(),nt=new WeakMap,M=class{constructor(s,t,e){if(this._$cssResult$=!0,e!==V)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=s,this.t=t}get styleSheet(){let s=this.o,t=this.t;if(W&&s===void 0){let e=t!==void 0&&t.length===1;e&&(s=nt.get(t)),s===void 0&&((this.o=s=new CSSStyleSheet).replaceSync(this.cssText),e&&nt.set(t,s))}return s}toString(){return this.cssText}},ot=o=>new M(typeof o=="string"?o:o+"",void 0,V),U=(o,...s)=>{let t=o.length===1?o[0]:s.reduce((e,i,a)=>e+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+o[a+1],o[0]);return new M(t,o,V)},lt=(o,s)=>{if(W)o.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of s){let e=document.createElement("style"),i=D.litNonce;i!==void 0&&e.setAttribute("nonce",i),e.textContent=t.cssText,o.appendChild(e)}},B=W?o=>o:o=>o instanceof CSSStyleSheet?(s=>{let t="";for(let e of s.cssRules)t+=e.cssText;return ot(t)})(o):o;var{is:Ot,defineProperty:It,getOwnPropertyDescriptor:Nt,getOwnPropertyNames:Ht,getOwnPropertySymbols:Rt,getPrototypeOf:Dt}=Object,z=globalThis,ct=z.trustedTypes,Wt=ct?ct.emptyScript:"",zt=z.reactiveElementPolyfillSupport,L=(o,s)=>o,C={toAttribute(o,s){switch(s){case Boolean:o=o?Wt:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,s){let t=o;switch(s){case Boolean:t=o!==null;break;case Number:t=o===null?null:Number(o);break;case Object:case Array:try{t=JSON.parse(o)}catch{t=null}}return t}},P=(o,s)=>!Ot(o,s),pt={attribute:!0,type:String,converter:C,reflect:!1,useDefault:!1,hasChanged:P};Symbol.metadata??=Symbol("metadata"),z.litPropertyMetadata??=new WeakMap;var $=class extends HTMLElement{static addInitializer(s){this._$Ei(),(this.l??=[]).push(s)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(s,t=pt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(s)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(s,t),!t.noAccessor){let e=Symbol(),i=this.getPropertyDescriptor(s,e,t);i!==void 0&&It(this.prototype,s,i)}}static getPropertyDescriptor(s,t,e){let{get:i,set:a}=Nt(this.prototype,s)??{get(){return this[t]},set(n){this[t]=n}};return{get:i,set(n){let r=i?.call(this);a?.call(this,n),this.requestUpdate(s,r,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(s){return this.elementProperties.get(s)??pt}static _$Ei(){if(this.hasOwnProperty(L("elementProperties")))return;let s=Dt(this);s.finalize(),s.l!==void 0&&(this.l=[...s.l]),this.elementProperties=new Map(s.elementProperties)}static finalize(){if(this.hasOwnProperty(L("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(L("properties"))){let t=this.properties,e=[...Ht(t),...Rt(t)];for(let i of e)this.createProperty(i,t[i])}let s=this[Symbol.metadata];if(s!==null){let t=litPropertyMetadata.get(s);if(t!==void 0)for(let[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(let[t,e]of this.elementProperties){let i=this._$Eu(t,e);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(s){let t=[];if(Array.isArray(s)){let e=new Set(s.flat(1/0).reverse());for(let i of e)t.unshift(B(i))}else s!==void 0&&t.push(B(s));return t}static _$Eu(s,t){let e=t.attribute;return e===!1?void 0:typeof e=="string"?e:typeof s=="string"?s.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(s=>this.enableUpdating=s),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(s=>s(this))}addController(s){(this._$EO??=new Set).add(s),this.renderRoot!==void 0&&this.isConnected&&s.hostConnected?.()}removeController(s){this._$EO?.delete(s)}_$E_(){let s=new Map,t=this.constructor.elementProperties;for(let e of t.keys())this.hasOwnProperty(e)&&(s.set(e,this[e]),delete this[e]);s.size>0&&(this._$Ep=s)}createRenderRoot(){let s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return lt(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(s=>s.hostConnected?.())}enableUpdating(s){}disconnectedCallback(){this._$EO?.forEach(s=>s.hostDisconnected?.())}attributeChangedCallback(s,t,e){this._$AK(s,e)}_$ET(s,t){let e=this.constructor.elementProperties.get(s),i=this.constructor._$Eu(s,e);if(i!==void 0&&e.reflect===!0){let a=(e.converter?.toAttribute!==void 0?e.converter:C).toAttribute(t,e.type);this._$Em=s,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(s,t){let e=this.constructor,i=e._$Eh.get(s);if(i!==void 0&&this._$Em!==i){let a=e.getPropertyOptions(i),n=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:C;this._$Em=i;let r=n.fromAttribute(t,a.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(s,t,e,i=!1,a){if(s!==void 0){let n=this.constructor;if(i===!1&&(a=this[s]),e??=n.getPropertyOptions(s),!((e.hasChanged??P)(a,t)||e.useDefault&&e.reflect&&a===this._$Ej?.get(s)&&!this.hasAttribute(n._$Eu(s,e))))return;this.C(s,t,e)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(s,t,{useDefault:e,reflect:i,wrapped:a},n){e&&!(this._$Ej??=new Map).has(s)&&(this._$Ej.set(s,n??t??this[s]),a!==!0||n!==void 0)||(this._$AL.has(s)||(this.hasUpdated||e||(t=void 0),this._$AL.set(s,t)),i===!0&&this._$Em!==s&&(this._$Eq??=new Set).add(s))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let s=this.scheduleUpdate();return s!=null&&await s,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,a]of this._$Ep)this[i]=a;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[i,a]of e){let{wrapped:n}=a,r=this[i];n!==!0||this._$AL.has(i)||r===void 0||this.C(i,void 0,a,r)}}let s=!1,t=this._$AL;try{s=this.shouldUpdate(t),s?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(e){throw s=!1,this._$EM(),e}s&&this._$AE(t)}willUpdate(s){}_$AE(s){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(s)),this.updated(s)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(s){return!0}update(s){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(s){}firstUpdated(s){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[L("elementProperties")]=new Map,$[L("finalized")]=new Map,zt?.({ReactiveElement:$}),(z.reactiveElementVersions??=[]).push("2.1.2");var Q=globalThis,dt=o=>o,F=Q.trustedTypes,ht=F?F.createPolicy("lit-html",{createHTML:o=>o}):void 0,bt="$lit$",f=`lit$${Math.random().toFixed(9).slice(2)}$`,$t="?"+f,Pt=`<${$t}>`,E=document,I=()=>E.createComment(""),N=o=>o===null||typeof o!="object"&&typeof o!="function",tt=Array.isArray,Ft=o=>tt(o)||typeof o?.[Symbol.iterator]=="function",J=`[ 	
\f\r]`,O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ut=/-->/g,gt=/>/g,_=RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),mt=/'/g,vt=/"/g,ft=/^(?:script|style|textarea|title)$/i,et=o=>(s,...t)=>({_$litType$:o,strings:s,values:t}),l=et(1),te=et(2),ee=et(3),A=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),yt=new WeakMap,S=E.createTreeWalker(E,129);function xt(o,s){if(!tt(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return ht!==void 0?ht.createHTML(s):s}var jt=(o,s)=>{let t=o.length-1,e=[],i,a=s===2?"<svg>":s===3?"<math>":"",n=O;for(let r=0;r<t;r++){let c=o[r],u,m,g=-1,y=0;for(;y<c.length&&(n.lastIndex=y,m=n.exec(c),m!==null);)y=n.lastIndex,n===O?m[1]==="!--"?n=ut:m[1]!==void 0?n=gt:m[2]!==void 0?(ft.test(m[2])&&(i=RegExp("</"+m[2],"g")),n=_):m[3]!==void 0&&(n=_):n===_?m[0]===">"?(n=i??O,g=-1):m[1]===void 0?g=-2:(g=n.lastIndex-m[2].length,u=m[1],n=m[3]===void 0?_:m[3]==='"'?vt:mt):n===vt||n===mt?n=_:n===ut||n===gt?n=O:(n=_,i=void 0);let b=n===_&&o[r+1].startsWith("/>")?" ":"";a+=n===O?c+Pt:g>=0?(e.push(u),c.slice(0,g)+bt+c.slice(g)+f+b):c+f+(g===-2?r:b)}return[xt(o,a+(o[t]||"<?>")+(s===2?"</svg>":s===3?"</math>":"")),e]},H=class o{constructor({strings:s,_$litType$:t},e){let i;this.parts=[];let a=0,n=0,r=s.length-1,c=this.parts,[u,m]=jt(s,t);if(this.el=o.createElement(u,e),S.currentNode=this.el.content,t===2||t===3){let g=this.el.content.firstChild;g.replaceWith(...g.childNodes)}for(;(i=S.nextNode())!==null&&c.length<r;){if(i.nodeType===1){if(i.hasAttributes())for(let g of i.getAttributeNames())if(g.endsWith(bt)){let y=m[n++],b=i.getAttribute(g).split(f),w=/([.?@])?(.*)/.exec(y);c.push({type:1,index:a,name:w[2],strings:b,ctor:w[1]==="."?Y:w[1]==="?"?X:w[1]==="@"?Z:T}),i.removeAttribute(g)}else g.startsWith(f)&&(c.push({type:6,index:a}),i.removeAttribute(g));if(ft.test(i.tagName)){let g=i.textContent.split(f),y=g.length-1;if(y>0){i.textContent=F?F.emptyScript:"";for(let b=0;b<y;b++)i.append(g[b],I()),S.nextNode(),c.push({type:2,index:++a});i.append(g[y],I())}}}else if(i.nodeType===8)if(i.data===$t)c.push({type:2,index:a});else{let g=-1;for(;(g=i.data.indexOf(f,g+1))!==-1;)c.push({type:7,index:a}),g+=f.length-1}a++}}static createElement(s,t){let e=E.createElement("template");return e.innerHTML=s,e}};function k(o,s,t=o,e){if(s===A)return s;let i=e!==void 0?t._$Co?.[e]:t._$Cl,a=N(s)?void 0:s._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(o),i._$AT(o,t,e)),e!==void 0?(t._$Co??=[])[e]=i:t._$Cl=i),i!==void 0&&(s=k(o,i._$AS(o,s.values),i,e)),s}var K=class{constructor(s,t){this._$AV=[],this._$AN=void 0,this._$AD=s,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(s){let{el:{content:t},parts:e}=this._$AD,i=(s?.creationScope??E).importNode(t,!0);S.currentNode=i;let a=S.nextNode(),n=0,r=0,c=e[0];for(;c!==void 0;){if(n===c.index){let u;c.type===2?u=new R(a,a.nextSibling,this,s):c.type===1?u=new c.ctor(a,c.name,c.strings,this,s):c.type===6&&(u=new G(a,this,s)),this._$AV.push(u),c=e[++r]}n!==c?.index&&(a=S.nextNode(),n++)}return S.currentNode=E,i}p(s){let t=0;for(let e of this._$AV)e!==void 0&&(e.strings!==void 0?(e._$AI(s,e,t),t+=e.strings.length-2):e._$AI(s[t])),t++}},R=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(s,t,e,i){this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=s,this._$AB=t,this._$AM=e,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let s=this._$AA.parentNode,t=this._$AM;return t!==void 0&&s?.nodeType===11&&(s=t.parentNode),s}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(s,t=this){s=k(this,s,t),N(s)?s===v||s==null||s===""?(this._$AH!==v&&this._$AR(),this._$AH=v):s!==this._$AH&&s!==A&&this._(s):s._$litType$!==void 0?this.$(s):s.nodeType!==void 0?this.T(s):Ft(s)?this.k(s):this._(s)}O(s){return this._$AA.parentNode.insertBefore(s,this._$AB)}T(s){this._$AH!==s&&(this._$AR(),this._$AH=this.O(s))}_(s){this._$AH!==v&&N(this._$AH)?this._$AA.nextSibling.data=s:this.T(E.createTextNode(s)),this._$AH=s}$(s){let{values:t,_$litType$:e}=s,i=typeof e=="number"?this._$AC(s):(e.el===void 0&&(e.el=H.createElement(xt(e.h,e.h[0]),this.options)),e);if(this._$AH?._$AD===i)this._$AH.p(t);else{let a=new K(i,this),n=a.u(this.options);a.p(t),this.T(n),this._$AH=a}}_$AC(s){let t=yt.get(s.strings);return t===void 0&&yt.set(s.strings,t=new H(s)),t}k(s){tt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,e,i=0;for(let a of s)i===t.length?t.push(e=new o(this.O(I()),this.O(I()),this,this.options)):e=t[i],e._$AI(a),i++;i<t.length&&(this._$AR(e&&e._$AB.nextSibling,i),t.length=i)}_$AR(s=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);s!==this._$AB;){let e=dt(s).nextSibling;dt(s).remove(),s=e}}setConnected(s){this._$AM===void 0&&(this._$Cv=s,this._$AP?.(s))}},T=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(s,t,e,i,a){this.type=1,this._$AH=v,this._$AN=void 0,this.element=s,this.name=t,this._$AM=i,this.options=a,e.length>2||e[0]!==""||e[1]!==""?(this._$AH=Array(e.length-1).fill(new String),this.strings=e):this._$AH=v}_$AI(s,t=this,e,i){let a=this.strings,n=!1;if(a===void 0)s=k(this,s,t,0),n=!N(s)||s!==this._$AH&&s!==A,n&&(this._$AH=s);else{let r=s,c,u;for(s=a[0],c=0;c<a.length-1;c++)u=k(this,r[e+c],t,c),u===A&&(u=this._$AH[c]),n||=!N(u)||u!==this._$AH[c],u===v?s=v:s!==v&&(s+=(u??"")+a[c+1]),this._$AH[c]=u}n&&!i&&this.j(s)}j(s){s===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,s??"")}},Y=class extends T{constructor(){super(...arguments),this.type=3}j(s){this.element[this.name]=s===v?void 0:s}},X=class extends T{constructor(){super(...arguments),this.type=4}j(s){this.element.toggleAttribute(this.name,!!s&&s!==v)}},Z=class extends T{constructor(s,t,e,i,a){super(s,t,e,i,a),this.type=5}_$AI(s,t=this){if((s=k(this,s,t,0)??v)===A)return;let e=this._$AH,i=s===v&&e!==v||s.capture!==e.capture||s.once!==e.once||s.passive!==e.passive,a=s!==v&&(e===v||i);i&&this.element.removeEventListener(this.name,this,e),a&&this.element.addEventListener(this.name,this,s),this._$AH=s}handleEvent(s){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,s):this._$AH.handleEvent(s)}},G=class{constructor(s,t,e){this.element=s,this.type=6,this._$AN=void 0,this._$AM=t,this.options=e}get _$AU(){return this._$AM._$AU}_$AI(s){k(this,s)}};var qt=Q.litHtmlPolyfillSupport;qt?.(H,R),(Q.litHtmlVersions??=[]).push("3.3.3");var wt=(o,s,t)=>{let e=t?.renderBefore??s,i=e._$litPart$;if(i===void 0){let a=t?.renderBefore??null;e._$litPart$=i=new R(s.insertBefore(I(),a),a,void 0,t??{})}return i._$AI(o),i};var st=globalThis,x=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let s=super.createRenderRoot();return this.renderOptions.renderBefore??=s.firstChild,s}update(s){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(s),this._$Do=wt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return A}};x._$litElement$=!0,x.finalized=!0,st.litElementHydrateSupport?.({LitElement:x});var Vt=st.litElementPolyfillSupport;Vt?.({LitElement:x});(st.litElementVersions??=[]).push("4.2.2");var Ut={attribute:!0,type:String,converter:C,reflect:!1,hasChanged:P},Bt=(o=Ut,s,t)=>{let{kind:e,metadata:i}=t,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),e==="setter"&&((o=Object.create(o)).wrapped=!0),a.set(t.name,o),e==="accessor"){let{name:n}=t;return{set(r){let c=s.get.call(this);s.set.call(this,r),this.requestUpdate(n,c,o,!0,r)},init(r){return r!==void 0&&this.C(n,void 0,o,r),r}}}if(e==="setter"){let{name:n}=t;return function(r){let c=this[n];s.call(this,r),this.requestUpdate(n,c,o,!0,r)}}throw Error("Unsupported decorator location: "+e)};function j(o){return(s,t)=>typeof t=="object"?Bt(o,s,t):((e,i,a)=>{let n=i.hasOwnProperty(a);return i.constructor.createProperty(a,e),n?Object.getOwnPropertyDescriptor(i,a):void 0})(o,s,t)}function h(o){return j({...o,state:!0,attribute:!1})}var it=560,Jt=JSON.stringify({id:"my_widget",label:"My Widget",w:16,h:7,default_cfg:{color:[0,255,0]},draw:[{op:"value",x:0,y:1,bind:"solar",fmt:"{:.1f}"},{op:"bar",x:0,y:6,w:16,h:1,bind:"soc",max:100,color:[0,120,255],bg:[30,30,30]}]},null,2),_t={galactic:[53,11],cosmic:[32,32],stellar:[16,16]},St="__mock__",Et=["value","bar","rect","pixel","icon","dot"],Kt={value:[["bind","text"],["fmt","text"],["color","rgb"]],bar:[["w","num"],["h","num"],["bind","text"],["max","num"],["color","rgb"],["bg","rgb"]],rect:[["w","num"],["h","num"],["color","rgb"]],pixel:[["color","rgb"]],icon:[["name","icon"]],dot:[["w","num"],["h","num"],["bind","text"],["on_color","rgb"],["off_color","rgb"]]},At=o=>{let[s,t,e]=o??[0,0,0];return"#"+[s,t,e].map(i=>Math.max(0,Math.min(255,i|0)).toString(16).padStart(2,"0")).join("")},kt=o=>{let s=(o||"").replace("#","");return[0,2,4].map(t=>parseInt(s.substr(t,2),16)||0)},p=class extends x{constructor(){super(...arguments);this.devices=[];this.entryId="";this.model="galactic";this.layout={widgets:[]};this.caps=[];this.overlayCaps=[];this.defaultLayout={widgets:[]};this.stored={};this.png="";this.wboxes=[];this.dims=[53,11];this.zoom=0;this.selected=-1;this.layoutName="default";this.live=!1;this.wireframe=!0;this.status="";this.tab="layout";this.catalog=[];this.fwManifest=null;this.contentLayouts=[];this.contentScreensets=[];this.showAllContent=!1;this.iconNames=[];this.dirty=!1;this.sectionsOpen={};this.screenLayouts=[];this.screenDwell=10;this.screenTransition="none";this.screenPngs={};this.screenIdx=0;this.screenOpacity=1;this.screenTimer=0;this.specText=Jt;this.editMode="form";this.specPng="";this.specError="";this.specTimer=0;this._onKey=t=>{let e=t.target?.tagName;if(e==="INPUT"||e==="SELECT"||e==="TEXTAREA")return;let a={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[t.key];a&&(t.preventDefault(),this._nudge(a[0],a[1]))}}static{this.styles=U`
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
    .section { margin-bottom: 8px; }
    .shead { display: flex; gap: 10px; align-items: center; cursor: pointer; padding: 10px 4px; user-select: none; }
    .shead:hover .stitle { color: var(--pu-primary); }
    .chev { display: inline-block; transition: transform .15s; color: var(--secondary-text-color, #79747e); font-size: 12px; }
    .chev.open { transform: rotate(90deg); }
    .stitle { font-size: 16px; font-weight: 500; }
    .mtable { max-width: 780px; margin-bottom: 8px; }
    .mhead, .mrow { display: grid; grid-template-columns: 108px minmax(120px,1fr) minmax(80px,0.9fr) 120px 110px; gap: 12px; align-items: center; }
    .mhead { font-size: 12px; font-weight: 600; color: var(--secondary-text-color, #79747e); padding: 0 14px 6px; }
    .mrow { border: 1px solid var(--pu-outline); border-radius: 10px; padding: 10px 14px; margin-bottom: 8px; }
    .cell-name { font-weight: 500; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .cell-action { display: flex; justify-content: flex-end; }
    .thumb { width: 100px; height: 64px; object-fit: contain; image-rendering: pixelated; background: #000; border-radius: 6px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.12); }
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
    .opcard { border: 1px solid var(--pu-outline); border-radius: 8px; padding: 8px 10px; margin-bottom: 8px; }
  `}firstUpdated(){this.loadDevices(),this.loadIcons()}async loadIcons(){try{let t=await this.hass.callWS({type:"pimoroni_unicorn/icons"});this.iconNames=[...t.builtin??[],...t.installed??[]]}catch{}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKey)}disconnectedCallback(){window.removeEventListener("keydown",this._onKey),super.disconnectedCallback()}_nudge(t,e){let[i,a]=this.dims;if(this.selected>=0&&this.layout.widgets[this.selected]){let n=this.layout.widgets[this.selected],[r,c]=this.boxDims(this.selected);n.x=Math.max(1-r,Math.min(i-1,n.x+t)),n.y=Math.max(1-c,Math.min(a-1,n.y+e)),this.edited()}}async loadDevices(){let t=await this.hass.callWS({type:"pimoroni_unicorn/devices"});this.devices=t.devices??[],this.devices.length?await this.selectDevice(this.devices[0].entry_id):await this.selectMock(this.model)}async loadCaps(t){let e=await this.hass.callWS({type:"pimoroni_unicorn/capabilities",...t});this.caps=e.widgets??[],this.overlayCaps=e.overlays??[],this.defaultLayout=e.default_layout,this.model=e.model,this.dims=_t[this.model]??[53,11],await this.refreshStored()}async selectDevice(t){let e=this.devices.find(a=>a.entry_id===t);if(!e||!this.guardDiscard())return;this.entryId=t,await this.loadCaps({entry_id:t});let i=e.active_layout?this.stored[e.active_layout]:void 0;this.loadLayout(i??this.defaultLayout)}async selectMock(t){this.guardDiscard()&&(this.entryId="",await this.loadCaps({model:t}),this.loadLayout(this.defaultLayout))}async refreshStored(){let t=await this.hass.callWS({type:"pimoroni_unicorn/layouts"});this.stored=t.layouts??{}}loadLayout(t){this.layout=JSON.parse(JSON.stringify(t)),this.layoutName=this.layout.name??"default",this.selected=-1,this.dirty=!1,this.renderPreview()}guardDiscard(){return!this.dirty||confirm("Discard unsaved changes to this page?")}async renderPreview(){try{let t=await this.hass.callWS({type:"pimoroni_unicorn/render",model:this.model,layout:this.layout});this.png=t.png,this.wboxes=t.boxes??[],this.status.startsWith("Render failed")&&(this.status="")}catch(t){this.png="",this.status=`Render failed: ${t?.message??t}`}}edited(){this.dirty=!0,this.requestUpdate(),this.renderTimer&&clearTimeout(this.renderTimer),this.renderTimer=window.setTimeout(()=>this.renderPreview(),80),this.live&&this.entryId&&(this.pushTimer&&clearTimeout(this.pushTimer),this.pushTimer=window.setTimeout(()=>this.pushLive(),250))}async pushLive(){await this.hass.callWS({type:"pimoroni_unicorn/push_layout",entry_id:this.entryId,layout:this.layout})}capFor(t){return this.caps.find(e=>e.id===t)}typeOf(t){return t.type??t.id}capForEntry(t){return this.capFor(this.typeOf(t))}get scale(){return this.zoom||Math.max(4,Math.floor(it/this.dims[0]))}zoomBy(t){this.zoom=Math.min(48,Math.max(4,this.scale+t))}onWheel(t){t.preventDefault(),this.zoomBy(t.deltaY<0?2:-2)}boxDims(t){let e=this.wboxes[t];if(e)return e;let i=this.layout.widgets[t],a=i?this.capForEntry(i):void 0;return a?[a.w,a.h]:[0,0]}cfgVal(t,e){return t.cfg?.[e]??this.capForEntry(t)?.default_cfg[e]}setCfg(t,e,i){t.cfg={...t.cfg??{},[e]:i},this.edited()}setName(t,e){let i=e.trim();i?t.name=i:delete t.name,this.edited()}setPos(t,e,i){let[a,n]=this.boxDims(this.selected),[r,c]=this.dims,u=Math.round(i);e==="x"?t.x=Math.max(1-a,Math.min(r-1,u)):t.y=Math.max(1-n,Math.min(c-1,u)),this.edited()}onImgLoad(t){let e=t.target;this.dims=[e.naturalWidth,e.naturalHeight]}startDrag(t,e){e.preventDefault(),this.selected=t;let i=this.layout.widgets[t],[a,n]=this.boxDims(t),r=this.layout.grid??2,[c,u]=this.dims,m=e.clientX,g=e.clientY,y=i.x,b=i.y;e.target.setPointerCapture(e.pointerId);let w=rt=>{let Tt=Math.round((rt.clientX-m)/this.scale/r)*r,Mt=Math.round((rt.clientY-g)/this.scale/r)*r;i.x=Math.max(1-a,Math.min(c-1,y+Tt)),i.y=Math.max(1-n,Math.min(u-1,b+Mt)),this.edited()},at=()=>{window.removeEventListener("pointermove",w),window.removeEventListener("pointerup",at),this.renderPreview()};window.addEventListener("pointermove",w),window.addEventListener("pointerup",at)}addWidget(t){if(!t)return;let e=this.capFor(t),i=new Set(this.layout.widgets.map(n=>n.id)),a;if(e?.multi||i.has(t)){let n=2,r=`${t}-${n}`;for(;i.has(r);)r=`${t}-${++n}`;a={id:r,type:t,name:`${e?.label??t} ${n}`,x:0,y:0,cfg:{}}}else a={id:t,type:t,x:0,y:0,cfg:{}};this.layout.widgets.push(a),this.selected=this.layout.widgets.length-1,this.edited()}removeWidget(t){this.layout.widgets.splice(t,1),this.selected=-1,this.edited()}toggleOverlay(t,e){let i=new Set(this.layout.overlays??[]);e?i.add(t):i.delete(t),this.layout.overlays=[...i],this.edited()}async save(){this.entryId&&(this.layout.name=this.layoutName,await this.hass.callWS({type:"pimoroni_unicorn/save_layout",entry_id:this.entryId,name:this.layoutName,layout:this.layout}),await this.refreshStored(),this.dirty=!1,this.status=`Saved "${this.layoutName}" and pushed to device.`)}async deleteLayout(){this.stored[this.layoutName]&&confirm(`Delete page "${this.layoutName}"? This can't be undone.`)&&(await this.hass.callWS({type:"pimoroni_unicorn/delete_layout",name:this.layoutName}),await this.refreshStored(),this.status=`Deleted "${this.layoutName}".`,this.loadLayout(this.defaultLayout))}renderWidgetEditor(){let t=this.layout.widgets[this.selected];if(!t)return l`<p class="hint">Select a widget to edit.</p>`;let e=this.capForEntry(t);return e?l`
      <h3>${t.name??e.label}</h3>
      <div class="panelrow"><label>Name</label>
        <input type="text" style="width:160px" placeholder=${e.label} .value=${t.name??""}
          @change=${i=>this.setName(t,i.target.value)} /></div>
      <div class="panelrow">
        <label>X</label><input type="number" style="width:60px" .value=${String(t.x)}
          @change=${i=>this.setPos(t,"x",+i.target.value)} />
        <label>Y</label><input type="number" style="width:60px" .value=${String(t.y)}
          @change=${i=>this.setPos(t,"y",+i.target.value)} />
      </div>
      ${e.cfg_fields.map(i=>i.type==="select"?l`<div class="panelrow"><label>${i.label??i.key}</label>
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
          <input type="color" .value=${At(this.cfgVal(t,i.key))}
            @input=${a=>this.setCfg(t,i.key,kt(a.target.value))} /></div>`)}
      <div class="panelrow"><button class="danger" @click=${()=>this.removeWidget(this.selected)}>Remove widget</button></div>
    `:""}switchTab(t){this.tab=t,t==="market"?this.loadCatalog():t==="edit"?this.previewSpec():t==="screens"&&this.buildScreenPreview()}_appBar(){let t=this.devices.find(e=>e.entry_id===this.entryId);return l`
      <div class="appbar">
        <span class="brand">Pimoroni Unicorn</span>
        <label>Device
          <select @change=${e=>{let i=e.target.value;i===St?this.selectMock(this.model):this.selectDevice(i)}}>
            <option value=${St} ?selected=${!this.entryId}>Mock (preview only)</option>
            ${this.devices.map(e=>l`<option value=${e.entry_id} ?selected=${e.entry_id===this.entryId}>${e.name}</option>`)}
          </select>
        </label>
        ${this.entryId?l`<span class="chip">${t?.model??this.model}</span>`:l`<label>Model
              <select @change=${e=>this.selectMock(e.target.value)}>
                ${Object.keys(_t).map(e=>l`<option ?selected=${e===this.model}>${e}</option>`)}
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
    `}_layoutView(){let t=this.scale,e=new Set(this.layout.widgets.map(r=>this.typeOf(r))),i=this.caps.filter(r=>r.multi||!e.has(r.id)),a=new Set(this.layout.overlays??[]),n=`background-image:linear-gradient(to right,rgba(255,255,255,.10) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.10) 1px,transparent 1px);background-size:${t}px ${t}px`;return l`
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
            <div class="grid" style=${n}></div>
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
    `}async loadCatalog(){if(await this.loadContent(),!this.entryId){this.catalog=[],this.fwManifest=null;return}let t=await this.hass.callWS({type:"pimoroni_unicorn/catalog",entry_id:this.entryId});this.catalog=t.widgets??[];let e=await this.hass.callWS({type:"pimoroni_unicorn/fw_manifest",entry_id:this.entryId});this.fwManifest=e.manifest??null}async loadContent(){let t=this.entryId?{entry_id:this.entryId}:{},e=await this.hass.callWS({type:"pimoroni_unicorn/content_catalog",...t});this.contentLayouts=e.layouts??[],this.contentScreensets=e.screensets??[]}async deployLayout(t,e){if(!this.entryId){this.status="Select a device to deploy.";return}if(!e&&!confirm(`"${t}" isn't built for this device's model. Deploy anyway?`))return;let i=await this.hass.callWS({type:"pimoroni_unicorn/deploy_layout",entry_id:this.entryId,name:t,override:!e});this.status=i.ok?`Deployed "${t}" (installing any missing widgets/fonts first).`:"Deploy failed."}async deployScreenset(t,e){if(!this.entryId){this.status="Select a device to deploy.";return}if(!e&&!confirm(`"${t}" isn't built for this device's model. Deploy anyway?`))return;let i=await this.hass.callWS({type:"pimoroni_unicorn/deploy_screenset",entry_id:this.entryId,id:t,override:!e});this.status=i.ok?`Deployed screen set "${t}".`:"Deploy failed."}async publishLayout(t){if(!this.stored[this.layoutName]){this.status="Save the layout first, then publish.";return}await this.hass.callWS({type:"pimoroni_unicorn/publish_layout",name:this.layoutName,published:t}),this.status=t?`Published "${this.layoutName}" to the marketplace.`:`Unpublished "${this.layoutName}".`,this.loadContent()}async saveScreenset(){if(!this.screenLayouts.length){this.status="Add at least one screen first.";return}let t=prompt("Name this screen set:");t&&(await this.hass.callWS({type:"pimoroni_unicorn/save_screenset",id:t,screenset:{label:t,layouts:this.screenLayouts,dwell:this.screenDwell,transition:this.screenTransition,triggers:[]}}),this.status=`Saved screen set "${t}".`,this.loadContent())}async installWidget(t){await this.hass.callWS({type:"pimoroni_unicorn/fw_install",entry_id:this.entryId,widget_id:t}),this.status=`Installing ${t}\u2026 device will reboot.`,setTimeout(()=>this.loadCatalog(),8e3)}async removeWidgetUnit(t){await this.hass.callWS({type:"pimoroni_unicorn/fw_remove",entry_id:this.entryId,widget_id:t}),this.status=`Removing ${t}\u2026 device will reboot.`,setTimeout(()=>this.loadCatalog(),8e3)}_thumb(t){return t?l`<img class="thumb" src="data:image/png;base64,${t}" />`:l`<div class="thumb"></div>`}_mhead(){return l`<div class="mhead"><span>Preview</span><span>Name</span><span>Dependencies</span><span>Status</span><span></span></div>`}_section(t,e,i,a){let n=this.sectionsOpen[t]!==!1;return l`<div class="section">
      <div class="shead" @click=${()=>{this.sectionsOpen={...this.sectionsOpen,[t]:!n}}}>
        <span class="chev ${n?"open":""}">▸</span>
        <span class="stitle">${e}</span>
        <span class="chip dim">${i}</span>
      </div>
      ${n?a:""}
    </div>`}_contentRow(t,e){return l`<div class="mrow">
      ${this._thumb(t.thumb)}
      <div class="cell-name">${t.label}
        ${t.compat?.length?l`<span class="hint">[${t.compat.join("/")}]</span>`:""}
        ${e==="screenset"?l`<span class="hint">${t.screens} page(s)</span>`:""}</div>
      <div class="hint">${t.requires?.length?l`<span title=${t.requires.join(", ")}>${t.requires.length} dep(s)</span>`:"\u2014"}</div>
      <div>${t.compatible?l`<span class="badge ok">compatible</span>`:l`<span class="badge warn">other model</span>`}</div>
      <div class="cell-action"><button ?disabled=${!this.entryId} title=${this.entryId?"":"Select a device to deploy"}
        @click=${()=>e==="layout"?this.deployLayout(t.id,t.compatible):this.deployScreenset(t.id,t.compatible)}>Deploy</button></div>
    </div>`}_marketplaceView(){let t=this.showAllContent,e=this.contentLayouts.filter(r=>t||r.compatible),i=this.contentScreensets.filter(r=>t||r.compatible),a={installed:"ok",outdated:"warn",not_installed:""},n={installed:"installed",outdated:"update available",not_installed:"not installed"};return l`
      <div class="bar">
        <label><input type="checkbox" .checked=${this.showAllContent}
          @change=${r=>{this.showAllContent=r.target.checked}} /> show all models</label>
        <span class="grow"></span>
        <button class="secondary" @click=${this.loadCatalog}>Refresh</button>
      </div>

      ${this._section("pages","Pages",e.length,e.length?l`<div class="mtable">${this._mhead()}${e.map(r=>this._contentRow(r,"layout"))}</div>`:l`<p class="hint">No published pages${t?"":" for this device"}. Publish one from the Designer tab.</p>`)}

      ${this._section("playlists","Playlists",i.length,i.length?l`<div class="mtable">${this._mhead()}${i.map(r=>this._contentRow(r,"screenset"))}</div>`:l`<p class="hint">No playlists${t?"":" for this device"}. Compose one on the Playlists tab.</p>`)}

      ${this._section("widgets","Widgets & fonts",this.catalog.length,this.entryId?l`<div class="mtable">${this._mhead()}
            ${this.catalog.map(r=>l`<div class="mrow">
              ${this._thumb(r.thumb)}
              <div class="cell-name">${r.label}</div>
              <div class="hint">${r.requires?.length?l`<span title=${r.requires.join(", ")}>${r.requires.length} dep(s)</span>`:"\u2014"}</div>
              <div><span class="badge ${a[r.status]??""}">${n[r.status]??r.status}</span></div>
              <div class="cell-action">${r.status==="installed"?l`<button class="danger" @click=${()=>this.removeWidgetUnit(r.id)}>Remove</button>`:l`<button @click=${()=>this.installWidget(r.id)}>${r.status==="outdated"?"Update":"Install"}</button>`}</div>
            </div>`)}
          </div>`:l`<p class="hint">Select a device to manage installed widgets.</p>`)}
      <p class="hint">Deploying a page installs any widgets/fonts it needs over the air first, then pushes it; the device reboots if files changed.</p>
    `}onSpecInput(t){this.specText=t,clearTimeout(this.specTimer),this.specTimer=window.setTimeout(()=>this.previewSpec(),400)}async previewSpec(){let t;try{t=JSON.parse(this.specText)}catch(e){this.specError=`JSON: ${e.message}`;return}try{let e=await this.hass.callWS({type:"pimoroni_unicorn/widget_preview",model:this.model,spec:t});this.specPng=e.png,this.specError=""}catch(e){this.specError=e?.message??String(e)}}async importSpec(t){try{let e=await this.hass.callWS({type:"pimoroni_unicorn/widget_import",text:t});this.specText=JSON.stringify(e.spec,null,2),this.specError="",this.previewSpec()}catch(e){this.specError=e?.message??String(e)}}async saveSpec(){let t;try{t=JSON.parse(this.specText)}catch(e){this.specError=`JSON: ${e.message}`;return}try{let e=await this.hass.callWS({type:"pimoroni_unicorn/widget_save",spec:t});this.specError="",this.status=`Saved custom widget "${e.id}". Install it from the Marketplace tab.`}catch(e){this.specError=e?.message??String(e)}}parsedSpec(){try{return JSON.parse(this.specText)}catch{return null}}writeSpec(t){this.specText=JSON.stringify(t,null,2),this.specError="",clearTimeout(this.specTimer),this.specTimer=window.setTimeout(()=>this.previewSpec(),120)}setSpecField(t,e){let i=this.parsedSpec();i&&(i[t]=e,this.writeSpec(i))}setOpField(t,e,i){let a=this.parsedSpec();!a||!Array.isArray(a.draw)||(a.draw[t]={...a.draw[t],[e]:i},this.writeSpec(a))}addOp(t){let e=this.parsedSpec()??{};e.draw=[...e.draw??[],{op:t,x:0,y:0}],this.writeSpec(e)}removeOp(t){let e=this.parsedSpec();!e||!Array.isArray(e.draw)||(e.draw.splice(t,1),this.writeSpec(e))}_opField(t,e,i,a){return a==="rgb"?l`<label>${i}</label>
      <input type="color" .value=${At(t[i])} @input=${n=>this.setOpField(e,i,kt(n.target.value))} />`:a==="num"?l`<label>${i}</label>
      <input type="number" style="width:54px" .value=${String(t[i]??0)} @change=${n=>this.setOpField(e,i,+n.target.value)} />`:a==="icon"?l`<label>${i}</label>
      <select @change=${n=>this.setOpField(e,i,n.target.value)}>
        ${this.iconNames.map(n=>l`<option ?selected=${t[i]===n}>${n}</option>`)}</select>`:l`<label>${i}</label>
      <input type="text" style="width:90px" .value=${String(t[i]??"")} @change=${n=>this.setOpField(e,i,n.target.value)} />`}_opEditor(t,e){return l`<div class="opcard">
      <div class="panelrow">
        <select @change=${i=>this.setOpField(e,"op",i.target.value)}>
          ${Et.map(i=>l`<option ?selected=${i===t.op}>${i}</option>`)}</select>
        <label>x</label><input type="number" style="width:54px" .value=${String(t.x??0)} @change=${i=>this.setOpField(e,"x",+i.target.value)} />
        <label>y</label><input type="number" style="width:54px" .value=${String(t.y??0)} @change=${i=>this.setOpField(e,"y",+i.target.value)} />
        <span class="grow"></span>
        <button class="danger zbtn" @click=${()=>this.removeOp(e)}>✕</button>
      </div>
      <div class="panelrow">${(Kt[t.op]??[]).map(([i,a])=>this._opField(t,e,i,a))}</div>
    </div>`}_formView(){let t=this.parsedSpec();if(!t)return l`<p class="status err">Spec isn't valid JSON — switch to YAML / JSON to fix it.</p>`;let e=i=>l`<label>${i}</label><input type="number" style="width:60px" .value=${String(t[i]??"")} @change=${a=>this.setSpecField(i,+a.target.value)} />`;return l`
      <div class="panelrow">
        <label>ID</label><input style="width:120px" .value=${t.id??""} @change=${i=>this.setSpecField("id",i.target.value)} />
        <label>Label</label><input style="width:120px" .value=${t.label??""} @change=${i=>this.setSpecField("label",i.target.value)} />
      </div>
      <div class="panelrow">${e("w")}${e("h")}</div>
      <h3>Draw ops</h3>
      ${(t.draw??[]).map((i,a)=>this._opEditor(i,a))}
      <div class="panelrow"><label>Add op</label>
        <select @change=${i=>{let a=i.target.value;a&&(this.addOp(a),i.target.value="")}}>
          <option value="">add op…</option>${Et.map(i=>l`<option>${i}</option>`)}</select></div>
    `}_editorView(){let t=Math.max(6,Math.floor(it/this.dims[0]));return l`
      <div class="bar">
        <span class="hint">declarative widget — previewed on ${this.model}</span>
        <span class="grow"></span>
        <div class="group">
          <button class="${this.editMode==="form"?"":"secondary"}" @click=${()=>{this.editMode="form"}}>Form</button>
          <button class="${this.editMode==="yaml"?"":"secondary"}" @click=${()=>{this.editMode="yaml"}}>YAML / JSON</button>
        </div>
      </div>
      <div class="wrap">
        <div class="col">
          ${this.editMode==="form"?this._formView():l`<textarea class="spec" .value=${this.specText}
                @input=${e=>this.onSpecInput(e.target.value)}></textarea>`}
          <div class="panelrow">
            <button @click=${this.saveSpec}>Save custom</button>
            <button class="secondary" @click=${()=>{let e=prompt("Paste YAML or JSON widget spec:");e&&this.importSpec(e)}}>Import…</button>
          </div>
          ${this.specError?l`<div class="status err">${this.specError}</div>`:l`<div class="hint">binds: solar, soc, consumption, co2… (unknown binds preview as 123)</div>`}
        </div>
        <div class="col">
          <div class="stage" style=${`width:${this.dims[0]*t}px;height:${this.dims[1]*t}px`}>
            ${this.specPng?l`<img src="data:image/png;base64,${this.specPng}" width=${this.dims[0]*t} height=${this.dims[1]*t} />`:""}
          </div>
        </div>
      </div>
    `}toggleScreen(t,e){this.screenLayouts=e?[...this.screenLayouts,t]:this.screenLayouts.filter(i=>i!==t),this.buildScreenPreview()}async buildScreenPreview(){clearInterval(this.screenTimer);let t={};for(let e of this.screenLayouts){let i=this.stored[e];if(i)try{let a=await this.hass.callWS({type:"pimoroni_unicorn/render",model:this.model,layout:i});t[e]=a.png}catch{}}this.screenPngs=t,this.screenIdx=0,this.screenOpacity=1,this.screenLayouts.length>1&&this.screenDwell>0&&(this.screenTimer=window.setInterval(()=>this._advancePreview(),this.screenDwell*1e3))}_advancePreview(){let t=(this.screenIdx+1)%this.screenLayouts.length;this.screenTransition==="fade"?(this.screenOpacity=0,setTimeout(()=>{this.screenIdx=t,this.screenOpacity=1},280)):this.screenIdx=t}async pushScreens(){!this.entryId||!this.screenLayouts.length||(await this.hass.callWS({type:"pimoroni_unicorn/push_screens",entry_id:this.entryId,layouts:this.screenLayouts,dwell:this.screenDwell,transition:this.screenTransition}),this.status=`Pushed ${this.screenLayouts.length} page(s) to device.`)}_screensView(){let t=Math.max(6,Math.floor(it/this.dims[0])),e=Object.keys(this.stored),i=this.screenLayouts[this.screenIdx],a=i?this.screenPngs[i]:"";return l`
      <div class="bar"><span class="hint">compose a playlist — pages cycle on a timer; preview on ${this.model}</span></div>
      <div class="wrap">
        <div class="col">
          <h3>Pages in this playlist</h3>
          <p class="hint">Tick pages to include; play order follows the order you tick.</p>
          ${e.length?e.map(n=>l`<div class="panelrow"><label>
            <input type="checkbox" ?checked=${this.screenLayouts.includes(n)}
              @change=${r=>this.toggleScreen(n,r.target.checked)} />
            ${this.screenLayouts.includes(n)?l`<span class="chip">${this.screenLayouts.indexOf(n)+1}</span>`:""} ${n}</label></div>`):l`<p class="hint">No saved pages yet — create one on the Designer tab.</p>`}
          <div class="panelrow"><label>Dwell (s)
            <input type="number" style="width:60px" min="1" max="600" .value=${String(this.screenDwell)}
              @change=${n=>{this.screenDwell=+n.target.value,this.buildScreenPreview()}} /></label></div>
          <div class="panelrow"><label>Transition
            <select @change=${n=>{this.screenTransition=n.target.value,this.buildScreenPreview()}}>
              ${["none","fade"].map(n=>l`<option ?selected=${n===this.screenTransition}>${n}</option>`)}
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
    `}};d([j({attribute:!1})],p.prototype,"hass",2),d([h()],p.prototype,"devices",2),d([h()],p.prototype,"entryId",2),d([h()],p.prototype,"model",2),d([h()],p.prototype,"layout",2),d([h()],p.prototype,"caps",2),d([h()],p.prototype,"overlayCaps",2),d([h()],p.prototype,"defaultLayout",2),d([h()],p.prototype,"stored",2),d([h()],p.prototype,"png",2),d([h()],p.prototype,"wboxes",2),d([h()],p.prototype,"dims",2),d([h()],p.prototype,"zoom",2),d([h()],p.prototype,"selected",2),d([h()],p.prototype,"layoutName",2),d([h()],p.prototype,"live",2),d([h()],p.prototype,"wireframe",2),d([h()],p.prototype,"status",2),d([h()],p.prototype,"tab",2),d([h()],p.prototype,"catalog",2),d([h()],p.prototype,"fwManifest",2),d([h()],p.prototype,"contentLayouts",2),d([h()],p.prototype,"contentScreensets",2),d([h()],p.prototype,"showAllContent",2),d([h()],p.prototype,"iconNames",2),d([h()],p.prototype,"dirty",2),d([h()],p.prototype,"sectionsOpen",2),d([h()],p.prototype,"screenLayouts",2),d([h()],p.prototype,"screenDwell",2),d([h()],p.prototype,"screenTransition",2),d([h()],p.prototype,"screenPngs",2),d([h()],p.prototype,"screenIdx",2),d([h()],p.prototype,"screenOpacity",2),d([h()],p.prototype,"specText",2),d([h()],p.prototype,"editMode",2),d([h()],p.prototype,"specPng",2),d([h()],p.prototype,"specError",2);customElements.get("pimoroni-unicorn-panel")||customElements.define("pimoroni-unicorn-panel",p);export{p as PimoroniUnicornPanel};
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
