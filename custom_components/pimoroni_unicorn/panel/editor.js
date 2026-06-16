var Tt=Object.defineProperty;var Lt=Object.getOwnPropertyDescriptor;var u=(n,e,t,s)=>{for(var i=s>1?void 0:s?Lt(e,t):e,r=n.length-1,a;r>=0;r--)(a=n[r])&&(i=(s?a(e,t,i):a(i))||i);return s&&i&&Tt(e,t,i),i};var U=globalThis,j=U.ShadowRoot&&(U.ShadyCSS===void 0||U.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,K=Symbol(),lt=new WeakMap,L=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==K)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(j&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=lt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&lt.set(t,e))}return e}toString(){return this.cssText}},ct=n=>new L(typeof n=="string"?n:n+"",void 0,K),X=(n,...e)=>{let t=n.length===1?n[0]:e.reduce((s,i,r)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[r+1],n[0]);return new L(t,n,K)},ht=(n,e)=>{if(j)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=U.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,n.appendChild(s)}},Y=j?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return ct(t)})(n):n;var{is:Ht,defineProperty:Rt,getOwnPropertyDescriptor:Ot,getOwnPropertyNames:It,getOwnPropertySymbols:Nt,getPrototypeOf:Wt}=Object,q=globalThis,dt=q.trustedTypes,Dt=dt?dt.emptyScript:"",Pt=q.reactiveElementPolyfillSupport,H=(n,e)=>n,R={toAttribute(n,e){switch(e){case Boolean:n=n?Dt:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},V=(n,e)=>!Ht(n,e),pt={attribute:!0,type:String,converter:R,reflect:!1,useDefault:!1,hasChanged:V};Symbol.metadata??=Symbol("metadata"),q.litPropertyMetadata??=new WeakMap;var $=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=pt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&Rt(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:r}=Ot(this.prototype,e)??{get(){return this[t]},set(a){this[t]=a}};return{get:i,set(a){let o=i?.call(this);r?.call(this,a),this.requestUpdate(e,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??pt}static _$Ei(){if(this.hasOwnProperty(H("elementProperties")))return;let e=Wt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(H("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(H("properties"))){let t=this.properties,s=[...It(t),...Nt(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(Y(i))}else e!==void 0&&t.push(Y(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ht(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let r=(s.converter?.toAttribute!==void 0?s.converter:R).toAttribute(t,s.type);this._$Em=e,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let r=s.getPropertyOptions(i),a=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:R;this._$Em=i;let o=a.fromAttribute(t,r.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(e,t,s,i=!1,r){if(e!==void 0){let a=this.constructor;if(i===!1&&(r=this[e]),s??=a.getPropertyOptions(e),!((s.hasChanged??V)(r,t)||s.useDefault&&s.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:r},a){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),r!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,r]of s){let{wrapped:a}=r,o=this[i];a!==!0||this._$AL.has(i)||o===void 0||this.C(i,void 0,r,o)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[H("elementProperties")]=new Map,$[H("finalized")]=new Map,Pt?.({ReactiveElement:$}),(q.reactiveElementVersions??=[]).push("2.1.2");var it=globalThis,ut=n=>n,B=it.trustedTypes,mt=B?B.createPolicy("lit-html",{createHTML:n=>n}):void 0,$t="$lit$",_=`lit$${Math.random().toFixed(9).slice(2)}$`,_t="?"+_,zt=`<${_t}>`,E=document,I=()=>E.createComment(""),N=n=>n===null||typeof n!="object"&&typeof n!="function",rt=Array.isArray,Ut=n=>rt(n)||typeof n?.[Symbol.iterator]=="function",Z=`[ 	
\f\r]`,O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,gt=/-->/g,vt=/>/g,w=RegExp(`>|${Z}(?:([^\\s"'>=/]+)(${Z}*=${Z}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),yt=/'/g,ft=/"/g,xt=/^(?:script|style|textarea|title)$/i,ot=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),h=ot(1),ee=ot(2),se=ot(3),A=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),bt=new WeakMap,S=E.createTreeWalker(E,129);function wt(n,e){if(!rt(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return mt!==void 0?mt.createHTML(e):e}var jt=(n,e)=>{let t=n.length-1,s=[],i,r=e===2?"<svg>":e===3?"<math>":"",a=O;for(let o=0;o<t;o++){let l=n[o],c,g,d=-1,y=0;for(;y<l.length&&(a.lastIndex=y,g=a.exec(l),g!==null);)y=a.lastIndex,a===O?g[1]==="!--"?a=gt:g[1]!==void 0?a=vt:g[2]!==void 0?(xt.test(g[2])&&(i=RegExp("</"+g[2],"g")),a=w):g[3]!==void 0&&(a=w):a===w?g[0]===">"?(a=i??O,d=-1):g[1]===void 0?d=-2:(d=a.lastIndex-g[2].length,c=g[1],a=g[3]===void 0?w:g[3]==='"'?ft:yt):a===ft||a===yt?a=w:a===gt||a===vt?a=O:(a=w,i=void 0);let f=a===w&&n[o+1].startsWith("/>")?" ":"";r+=a===O?l+zt:d>=0?(s.push(c),l.slice(0,d)+$t+l.slice(d)+_+f):l+_+(d===-2?o:f)}return[wt(n,r+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},W=class n{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let r=0,a=0,o=e.length-1,l=this.parts,[c,g]=jt(e,t);if(this.el=n.createElement(c,s),S.currentNode=this.el.content,t===2||t===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=S.nextNode())!==null&&l.length<o;){if(i.nodeType===1){if(i.hasAttributes())for(let d of i.getAttributeNames())if(d.endsWith($t)){let y=g[a++],f=i.getAttribute(d).split(_),b=/([.?@])?(.*)/.exec(y);l.push({type:1,index:r,name:b[2],strings:f,ctor:b[1]==="."?Q:b[1]==="?"?tt:b[1]==="@"?et:M}),i.removeAttribute(d)}else d.startsWith(_)&&(l.push({type:6,index:r}),i.removeAttribute(d));if(xt.test(i.tagName)){let d=i.textContent.split(_),y=d.length-1;if(y>0){i.textContent=B?B.emptyScript:"";for(let f=0;f<y;f++)i.append(d[f],I()),S.nextNode(),l.push({type:2,index:++r});i.append(d[y],I())}}}else if(i.nodeType===8)if(i.data===_t)l.push({type:2,index:r});else{let d=-1;for(;(d=i.data.indexOf(_,d+1))!==-1;)l.push({type:7,index:r}),d+=_.length-1}r++}}static createElement(e,t){let s=E.createElement("template");return s.innerHTML=e,s}};function k(n,e,t=n,s){if(e===A)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,r=N(e)?void 0:e._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(n),i._$AT(n,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=k(n,i._$AS(n,e.values),i,s)),e}var G=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??E).importNode(t,!0);S.currentNode=i;let r=S.nextNode(),a=0,o=0,l=s[0];for(;l!==void 0;){if(a===l.index){let c;l.type===2?c=new D(r,r.nextSibling,this,e):l.type===1?c=new l.ctor(r,l.name,l.strings,this,e):l.type===6&&(c=new st(r,this,e)),this._$AV.push(c),l=s[++o]}a!==l?.index&&(r=S.nextNode(),a++)}return S.currentNode=E,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},D=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=k(this,e,t),N(e)?e===v||e==null||e===""?(this._$AH!==v&&this._$AR(),this._$AH=v):e!==this._$AH&&e!==A&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ut(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==v&&N(this._$AH)?this._$AA.nextSibling.data=e:this.T(E.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=W.createElement(wt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let r=new G(i,this),a=r.u(this.options);r.p(t),this.T(a),this._$AH=r}}_$AC(e){let t=bt.get(e.strings);return t===void 0&&bt.set(e.strings,t=new W(e)),t}k(e){rt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let r of e)i===t.length?t.push(s=new n(this.O(I()),this.O(I()),this,this.options)):s=t[i],s._$AI(r),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=ut(e).nextSibling;ut(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},M=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,r){this.type=1,this._$AH=v,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=v}_$AI(e,t=this,s,i){let r=this.strings,a=!1;if(r===void 0)e=k(this,e,t,0),a=!N(e)||e!==this._$AH&&e!==A,a&&(this._$AH=e);else{let o=e,l,c;for(e=r[0],l=0;l<r.length-1;l++)c=k(this,o[s+l],t,l),c===A&&(c=this._$AH[l]),a||=!N(c)||c!==this._$AH[l],c===v?e=v:e!==v&&(e+=(c??"")+r[l+1]),this._$AH[l]=c}a&&!i&&this.j(e)}j(e){e===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Q=class extends M{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===v?void 0:e}},tt=class extends M{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==v)}},et=class extends M{constructor(e,t,s,i,r){super(e,t,s,i,r),this.type=5}_$AI(e,t=this){if((e=k(this,e,t,0)??v)===A)return;let s=this._$AH,i=e===v&&s!==v||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,r=e!==v&&(s===v||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},st=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){k(this,e)}};var qt=it.litHtmlPolyfillSupport;qt?.(W,D),(it.litHtmlVersions??=[]).push("3.3.3");var St=(n,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let r=t?.renderBefore??null;s._$litPart$=i=new D(e.insertBefore(I(),r),r,void 0,t??{})}return i._$AI(n),i};var nt=globalThis,x=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=St(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return A}};x._$litElement$=!0,x.finalized=!0,nt.litElementHydrateSupport?.({LitElement:x});var Vt=nt.litElementPolyfillSupport;Vt?.({LitElement:x});(nt.litElementVersions??=[]).push("4.2.2");var Bt={attribute:!0,type:String,converter:R,reflect:!1,hasChanged:V},Ft=(n=Bt,e,t)=>{let{kind:s,metadata:i}=t,r=globalThis.litPropertyMetadata.get(i);if(r===void 0&&globalThis.litPropertyMetadata.set(i,r=new Map),s==="setter"&&((n=Object.create(n)).wrapped=!0),r.set(t.name,n),s==="accessor"){let{name:a}=t;return{set(o){let l=e.get.call(this);e.set.call(this,o),this.requestUpdate(a,l,n,!0,o)},init(o){return o!==void 0&&this.C(a,void 0,n,o),o}}}if(s==="setter"){let{name:a}=t;return function(o){let l=this[a];e.call(this,o),this.requestUpdate(a,l,n,!0,o)}}throw Error("Unsupported decorator location: "+s)};function F(n){return(e,t)=>typeof t=="object"?Ft(n,e,t):((s,i,r)=>{let a=i.hasOwnProperty(r);return i.constructor.createProperty(r,s),a?Object.getOwnPropertyDescriptor(i,r):void 0})(n,e,t)}function m(n){return F({...n,state:!0,attribute:!1})}var C=n=>n.width??n.size??2,T=n=>n.height??n.size??2,Et=560,Jt=JSON.stringify({id:"my_widget",label:"My Widget",w:16,h:7,default_cfg:{color:[0,255,0]},draw:[{op:"value",x:0,y:1,bind:"solar",fmt:"{:.1f}"},{op:"bar",x:0,y:6,w:16,h:1,bind:"soc",max:100,color:[0,120,255],bg:[30,30,30]}]},null,2),At={galactic:[53,11],cosmic:[32,32],stellar:[16,16]},kt="__mock__",Kt=n=>{let[e,t,s]=n??[0,0,0];return"#"+[e,t,s].map(i=>Math.max(0,Math.min(255,i|0)).toString(16).padStart(2,"0")).join("")},at=n=>{let e=(n||"").replace("#","");return[0,2,4].map(t=>parseInt(e.substr(t,2),16)||0)},Xt=()=>[{id:"demo_a",entity_id:"",name:"Sensor A",on_color:"#8cc050",off_color:"#233014",x_pos:0,y_pos:0},{id:"demo_b",entity_id:"",name:"Sensor B",on_color:"#f7be12",off_color:"#3e3005",x_pos:3,y_pos:0}],p=class extends x{constructor(){super(...arguments);this.devices=[];this.entryId="";this.model="galactic";this.layout={widgets:[]};this.caps=[];this.overlayCaps=[];this.defaultLayout={widgets:[]};this.stored={};this.png="";this.wboxes=[];this.dims=[53,11];this.zoom=0;this.selected=-1;this.sensors=[];this.selSensor=-1;this.layoutName="default";this.live=!1;this.wireframe=!0;this.status="";this.tab="layout";this.catalog=[];this.fwManifest=null;this.specText=Jt;this.specPng="";this.specError="";this.specTimer=0;this._onKey=t=>{let s=t.target?.tagName;if(s==="INPUT"||s==="SELECT"||s==="TEXTAREA")return;let r={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[t.key];r&&(t.preventDefault(),this._nudge(r[0],r[1]))}}static{this.styles=X`
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
    .box.sensor { border: 1px dashed var(--warning-color, #ffa600); }
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
  `}firstUpdated(){this.loadDevices()}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKey)}disconnectedCallback(){window.removeEventListener("keydown",this._onKey),super.disconnectedCallback()}_nudge(t,s){let[i,r]=this.dims;if(this.selected>=0&&this.layout.widgets[this.selected]){let a=this.layout.widgets[this.selected],[o,l]=this.boxDims(this.selected);a.x=Math.max(1-o,Math.min(i-1,a.x+t)),a.y=Math.max(1-l,Math.min(r-1,a.y+s)),this.edited()}else if(this.selSensor>=0&&this.sensors[this.selSensor]){let a=this.sensors[this.selSensor];a.x_pos=Math.max(0,Math.min(i-C(a),a.x_pos+t)),a.y_pos=Math.max(0,Math.min(r-T(a),a.y_pos+s)),this.edited()}}async loadDevices(){let t=await this.hass.callWS({type:"pimoroni_unicorn/devices"});this.devices=t.devices??[],this.devices.length?await this.selectDevice(this.devices[0].entry_id):await this.selectMock(this.model)}async loadCaps(t){let s=await this.hass.callWS({type:"pimoroni_unicorn/capabilities",...t});this.caps=s.widgets??[],this.overlayCaps=s.overlays??[],this.defaultLayout=s.default_layout,this.model=s.model,this.dims=At[this.model]??[53,11],await this.refreshStored()}async selectDevice(t){let s=this.devices.find(a=>a.entry_id===t);if(!s)return;this.entryId=t,await this.loadCaps({entry_id:t});let i=await this.hass.callWS({type:"pimoroni_unicorn/display_sensors",entry_id:t});this.sensors=(i.sensors??[]).map(a=>({...a,on_color:a.on_color?.startsWith("#")?a.on_color:"#"+(a.on_color||"00ff00"),off_color:a.off_color?.startsWith("#")?a.off_color:"#"+(a.off_color||"1a1a1a")})),this.selSensor=-1;let r=s.active_layout?this.stored[s.active_layout]:void 0;this.loadLayout(r??this.defaultLayout)}async selectMock(t){this.entryId="",this.sensors=[],this.selSensor=-1,await this.loadCaps({model:t}),this.loadLayout(this.defaultLayout);for(let s of Xt()){let[i,r]=this.freeSlot(s.size??2);this.sensors=[...this.sensors,{...s,x_pos:i,y_pos:r}]}}renderSensors(){return this.sensors.map(t=>({x:t.x_pos,y:t.y_pos,width:C(t),height:T(t),on_rgb:at(t.on_color),off_rgb:at(t.off_color),state:t.entity_id?this.hass?.states?.[t.entity_id]?.state==="on":!0}))}async refreshStored(){let t=await this.hass.callWS({type:"pimoroni_unicorn/layouts"});this.stored=t.layouts??{}}loadLayout(t){this.layout=JSON.parse(JSON.stringify(t)),this.layoutName=this.layout.name??"default",this.selected=-1,this.renderPreview()}async renderPreview(){try{let t=await this.hass.callWS({type:"pimoroni_unicorn/render",model:this.model,layout:this.layout,sensors:this.renderSensors()});this.png=t.png,this.wboxes=t.boxes??[],this.status.startsWith("Render failed")&&(this.status="")}catch(t){this.png="",this.status=`Render failed: ${t?.message??t}`}}edited(){this.requestUpdate(),this.renderTimer&&clearTimeout(this.renderTimer),this.renderTimer=window.setTimeout(()=>this.renderPreview(),80),this.live&&this.entryId&&(this.pushTimer&&clearTimeout(this.pushTimer),this.pushTimer=window.setTimeout(()=>this.pushLive(),250))}async pushLive(){await this.hass.callWS({type:"pimoroni_unicorn/push_layout",entry_id:this.entryId,layout:this.layout})}capFor(t){return this.caps.find(s=>s.id===t)}get scale(){return this.zoom||Math.max(4,Math.floor(Et/this.dims[0]))}zoomBy(t){this.zoom=Math.min(48,Math.max(4,this.scale+t))}onWheel(t){t.preventDefault(),this.zoomBy(t.deltaY<0?2:-2)}occupiedRects(){let t=[];this.layout.widgets.forEach((s,i)=>{if(s.enabled===!1||!this.capFor(s.id))return;let[r,a]=this.boxDims(i);t.push([s.x,s.y,r,a])});for(let s of this.sensors)t.push([s.x_pos,s.y_pos,C(s),T(s)]);return t}freeSlot(t){let[s,i]=this.dims,r=this.occupiedRects(),a=(o,l)=>r.some(([c,g,d,y])=>o<c+d&&o+t>c&&l<g+y&&l+t>g);for(let o=0;o<=i-t;o++)for(let l=0;l<=s-t;l++)if(!a(l,o))return[l,o];return[0,0]}boxDims(t){let s=this.wboxes[t];if(s)return s;let i=this.capFor(this.layout.widgets[t]?.id??"");return i?[i.w,i.h]:[0,0]}cfgVal(t,s){return t.cfg?.[s]??this.capFor(t.id)?.default_cfg[s]}setCfg(t,s,i){t.cfg={...t.cfg??{},[s]:i},this.edited()}setPos(t,s,i){let[r,a]=this.boxDims(this.selected),[o,l]=this.dims,c=Math.round(i);s==="x"?t.x=Math.max(1-r,Math.min(o-1,c)):t.y=Math.max(1-a,Math.min(l-1,c)),this.edited()}onImgLoad(t){let s=t.target;this.dims=[s.naturalWidth,s.naturalHeight]}startDrag(t,s){s.preventDefault(),this.selected=t;let i=this.layout.widgets[t],[r,a]=this.boxDims(t),o=this.layout.grid??2,[l,c]=this.dims,g=s.clientX,d=s.clientY,y=i.x,f=i.y;s.target.setPointerCapture(s.pointerId);let b=z=>{let Mt=Math.round((z.clientX-g)/this.scale/o)*o,Ct=Math.round((z.clientY-d)/this.scale/o)*o;i.x=Math.max(1-r,Math.min(l-1,y+Mt)),i.y=Math.max(1-a,Math.min(c-1,f+Ct)),this.edited()},P=()=>{window.removeEventListener("pointermove",b),window.removeEventListener("pointerup",P),this.renderPreview()};window.addEventListener("pointermove",b),window.addEventListener("pointerup",P)}addWidget(t){t&&(this.layout.widgets.push({id:t,x:0,y:0,cfg:{}}),this.selected=this.layout.widgets.length-1,this.edited())}removeWidget(t){this.layout.widgets.splice(t,1),this.selected=-1,this.edited()}startSensorDrag(t,s){s.preventDefault(),this.selSensor=t,this.selected=-1;let i=this.sensors[t],r=this.layout.grid??1,[a,o]=this.dims,l=s.clientX,c=s.clientY,g=i.x_pos,d=i.y_pos;s.target.setPointerCapture(s.pointerId);let y=b=>{let P=Math.round((b.clientX-l)/this.scale/r)*r,z=Math.round((b.clientY-c)/this.scale/r)*r;i.x_pos=Math.max(0,Math.min(a-C(i),g+P)),i.y_pos=Math.max(0,Math.min(o-T(i),d+z)),this.edited()},f=()=>{window.removeEventListener("pointermove",y),window.removeEventListener("pointerup",f),this.renderPreview()};window.addEventListener("pointermove",y),window.addEventListener("pointerup",f)}addSensor(){let[t,s]=this.freeSlot(2);this.sensors.push({id:`sensor_${this.sensors.length+1}`,entity_id:"",name:"Sensor",on_color:"#00ff00",off_color:"#1a1a1a",x_pos:t,y_pos:s,width:2,height:2}),this.selSensor=this.sensors.length-1,this.edited()}removeSensor(t){this.sensors.splice(t,1),this.selSensor=-1,this.edited()}setSensor(t,s,i){this.sensors[t][s]=i,this.edited()}async saveSensors(){this.entryId&&(await this.hass.callWS({type:"pimoroni_unicorn/set_display_sensors",entry_id:this.entryId,sensors:this.sensors}),this.status="Saved sensors to device.")}entityOptions(){let t=this.hass?.states??{};return Object.keys(t).filter(s=>/^(binary_sensor|sensor|light|switch|input_boolean)\./.test(s)).sort()}toggleOverlay(t,s){let i=new Set(this.layout.overlays??[]);s?i.add(t):i.delete(t),this.layout.overlays=[...i],this.edited()}async save(){this.entryId&&(this.layout.name=this.layoutName,await this.hass.callWS({type:"pimoroni_unicorn/save_layout",entry_id:this.entryId,name:this.layoutName,layout:this.layout}),await this.refreshStored(),this.status=`Saved "${this.layoutName}" and pushed to device.`)}async deleteLayout(){this.stored[this.layoutName]&&(await this.hass.callWS({type:"pimoroni_unicorn/delete_layout",name:this.layoutName}),await this.refreshStored(),this.status=`Deleted "${this.layoutName}".`,this.loadLayout(this.defaultLayout))}renderWidgetEditor(){let t=this.layout.widgets[this.selected];if(!t)return h`<p class="hint">Select a widget to edit.</p>`;let s=this.capFor(t.id);return s?h`
      <h3>${s.label}</h3>
      <div class="panelrow">
        <label>X</label><input type="number" style="width:60px" .value=${String(t.x)}
          @change=${i=>this.setPos(t,"x",+i.target.value)} />
        <label>Y</label><input type="number" style="width:60px" .value=${String(t.y)}
          @change=${i=>this.setPos(t,"y",+i.target.value)} />
      </div>
      ${s.cfg_fields.map(i=>i.type==="select"?h`<div class="panelrow"><label>${i.label??i.key}</label>
            <select @change=${r=>this.setCfg(t,i.key,r.target.value)}>
              ${(i.options??[]).map(r=>h`<option ?selected=${this.cfgVal(t,i.key)===r}>${r}</option>`)}
            </select></div>`:i.type==="number"?h`<div class="panelrow"><label>${i.label??i.key}</label>
            <input type="number" style="width:60px" min=${i.min??1} max=${i.max??64} step=${i.step??1}
              .value=${String(this.cfgVal(t,i.key))}
              @change=${r=>this.setCfg(t,i.key,+r.target.value)} /></div>`:i.type==="text"?h`<div class="panelrow"><label>${i.label??i.key}</label>
            <input type="text" style="width:120px" .value=${String(this.cfgVal(t,i.key)??"")}
              @change=${r=>this.setCfg(t,i.key,r.target.value)} /></div>`:h`<div class="panelrow"><label>${i.label??i.key}</label>
          <input type="color" .value=${Kt(this.cfgVal(t,i.key))}
            @input=${r=>this.setCfg(t,i.key,at(r.target.value))} /></div>`)}
      <div class="panelrow"><button class="danger" @click=${()=>this.removeWidget(this.selected)}>Remove widget</button></div>
    `:""}render(){return h`
      <div class="tabs">
        <button class="tab ${this.tab==="layout"?"on":""}" @click=${()=>this.tab="layout"}>Layout</button>
        <button class="tab ${this.tab==="market"?"on":""}" @click=${()=>{this.tab="market",this.loadCatalog()}}>Marketplace</button>
        <button class="tab ${this.tab==="edit"?"on":""}" @click=${()=>{this.tab="edit",this.previewSpec()}}>Widget editor</button>
      </div>
      ${this.tab==="market"?this._marketplaceView():this.tab==="edit"?this._editorView():this._layoutView()}
    `}_layoutView(){let t=this.scale,s=new Set(this.layout.widgets.map(o=>o.id)),i=this.caps.filter(o=>!s.has(o.id)),r=new Set(this.layout.overlays??[]),a=`background-image:linear-gradient(to right,rgba(255,255,255,.10) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.10) 1px,transparent 1px);background-size:${t}px ${t}px`;return h`
      <div class="bar">
        <label>Device
          <select @change=${o=>{let l=o.target.value;l===kt?this.selectMock(this.model):this.selectDevice(l)}}>
            <option value=${kt} ?selected=${!this.entryId}>(mock — preview only)</option>
            ${this.devices.map(o=>h`<option value=${o.entry_id} ?selected=${o.entry_id===this.entryId}>${o.name} (${o.model})</option>`)}
          </select>
        </label>
        ${this.entryId?h`<span class="hint">model: ${this.model}</span>`:h`<label>Model
          <select @change=${o=>this.selectMock(o.target.value)}>
            ${Object.keys(At).map(o=>h`<option ?selected=${o===this.model}>${o}</option>`)}
          </select></label>`}
        <span class="hint">${this.dims[0]}&times;${this.dims[1]} px</span>
        <label>Layout
          <select @change=${o=>{let l=o.target.value;this.loadLayout(l==="__new__"?this.defaultLayout:this.stored[l])}}>
            ${Object.keys(this.stored).map(o=>h`<option ?selected=${o===this.layoutName}>${o}</option>`)}
            <option value="__new__">— new —</option>
          </select>
        </label>
        <label>Name <input .value=${this.layoutName} @input=${o=>this.layoutName=o.target.value} /></label>
        <button @click=${this.save} ?disabled=${!this.entryId} title=${this.entryId?"":"Select a device to save/push"}>Save &amp; Push</button>
        ${this.stored[this.layoutName]?h`<button class="danger" @click=${this.deleteLayout}>Delete</button>`:""}
        <label>Snap
          <select @change=${o=>{this.layout.grid=+o.target.value,this.edited()}}>
            ${[1,2,4].map(o=>h`<option ?selected=${(this.layout.grid??2)===o}>${o}</option>`)}
          </select>
        </label>
        <label>Zoom
          <button class="zbtn" @click=${()=>this.zoomBy(-2)} title="Zoom out">&minus;</button>
          <input type="range" min="4" max="48" .value=${String(this.scale)}
            @input=${o=>this.zoom=+o.target.value} />
          <button class="zbtn" @click=${()=>this.zoomBy(2)} title="Zoom in">+</button>
        </label>
        <label><input type="checkbox" .checked=${this.wireframe} @change=${o=>this.wireframe=o.target.checked} /> wireframe</label>
        <label><input type="checkbox" .checked=${this.live} ?disabled=${!this.entryId} @change=${o=>this.live=o.target.checked} /> live push</label>
      </div>

      <div class="wrap">
        <div class="col">
          <div class="stage" style=${`width:${this.dims[0]*t}px;height:${this.dims[1]*t}px`}
            @wheel=${this.onWheel}>
            ${this.png?h`<img src="data:image/png;base64,${this.png}" width=${this.dims[0]*t} height=${this.dims[1]*t} @load=${this.onImgLoad} />`:""}
            <div class="grid" style=${a}></div>
            ${this.wireframe?h`<div class="boxes">${this.layout.widgets.map((o,l)=>{if(!this.capFor(o.id)||o.enabled===!1)return"";let[c,g]=this.boxDims(l);return h`<div class="box ${l===this.selected?"sel":""}"
                style=${`left:${o.x*t}px;top:${o.y*t}px;width:${c*t}px;height:${g*t}px`}
                @pointerdown=${d=>this.startDrag(l,d)}>
                <span class="tag">${o.id}</span></div>`})}${this.sensors.map((o,l)=>h`<div class="box sensor ${l===this.selSensor?"sel":""}"
                style=${`left:${o.x_pos*t}px;top:${o.y_pos*t}px;width:${C(o)*t}px;height:${T(o)*t}px`}
                @pointerdown=${c=>this.startSensorDrag(l,c)}></div>`)}</div>`:""}
          </div>
          <div class="status ${this.status.startsWith("Render failed")?"err":""}">${this.status}</div>
        </div>

        <div class="col">
          <h3>Widgets</h3>
          <ul class="wlist">
            ${this.layout.widgets.map((o,l)=>h`
              <li class="${l===this.selected?"sel":""}" @click=${()=>this.selected=l}>
                <input type="checkbox" .checked=${o.enabled!==!1}
                  @click=${c=>{c.stopPropagation(),o.enabled=c.target.checked,this.edited()}} />
                <span class="grow">${this.capFor(o.id)?.label??o.id}</span>
              </li>`)}
          </ul>
          ${i.length?h`<div class="panelrow">
            <select id="addsel"><option value="">add widget…</option>${i.map(o=>h`<option value=${o.id}>${o.label}</option>`)}</select>
            <button class="secondary" @click=${()=>{let o=this.renderRoot.querySelector("#addsel");this.addWidget(o.value),o.value=""}}>Add</button>
          </div>`:""}
          <h3>Overlays</h3>
          ${this.overlayCaps.map(o=>h`<div class="panelrow"><label>
            <input type="checkbox" .checked=${r.has(o.id)} @change=${l=>this.toggleOverlay(o.id,l.target.checked)} /> ${o.label}</label></div>`)}
          <h3>Selected</h3>
          ${this.renderWidgetEditor()}

          <h3>Sensors</h3>
          ${this.sensors.map((o,l)=>h`
            <div class="panelrow ${l===this.selSensor?"sel":""}" @click=${()=>this.selSensor=l}>
              <input style="width:70px" .value=${o.name} @change=${c=>this.setSensor(l,"name",c.target.value)} title="Name" />
              <select .value=${o.entity_id} @change=${c=>this.setSensor(l,"entity_id",c.target.value)} title="Entity">
                <option value="">(entity)</option>
                ${this.entityOptions().map(c=>h`<option ?selected=${c===o.entity_id}>${c}</option>`)}
              </select>
              <input type="color" .value=${o.on_color} @input=${c=>this.setSensor(l,"on_color",c.target.value)} title="On colour" />
              <input type="color" .value=${o.off_color} @input=${c=>this.setSensor(l,"off_color",c.target.value)} title="Off colour" />
              <input type="number" style="width:42px" min="1" max="32" .value=${String(C(o))}
                @change=${c=>this.setSensor(l,"width",+c.target.value)} title="Width (px)" />
              <input type="number" style="width:42px" min="1" max="32" .value=${String(T(o))}
                @change=${c=>this.setSensor(l,"height",+c.target.value)} title="Height (px)" />
              <button class="danger" @click=${c=>{c.stopPropagation(),this.removeSensor(l)}}>✕</button>
            </div>`)}
          <div class="panelrow">
            <button class="secondary" @click=${this.addSensor}>Add sensor</button>
            <button @click=${this.saveSensors} ?disabled=${!this.entryId} title=${this.entryId?"":"Select a device to save sensors"}>Save sensors</button>
          </div>
        </div>
      </div>
    `}async loadCatalog(){if(!this.entryId){this.catalog=[],this.fwManifest=null;return}let t=await this.hass.callWS({type:"pimoroni_unicorn/catalog",entry_id:this.entryId});this.catalog=t.widgets??[];let s=await this.hass.callWS({type:"pimoroni_unicorn/fw_manifest",entry_id:this.entryId});this.fwManifest=s.manifest??null}async installWidget(t){await this.hass.callWS({type:"pimoroni_unicorn/fw_install",entry_id:this.entryId,widget_id:t}),this.status=`Installing ${t}\u2026 device will reboot.`,setTimeout(()=>this.loadCatalog(),8e3)}async removeWidgetUnit(t){await this.hass.callWS({type:"pimoroni_unicorn/fw_remove",entry_id:this.entryId,widget_id:t}),this.status=`Removing ${t}\u2026 device will reboot.`,setTimeout(()=>this.loadCatalog(),8e3)}_marketplaceView(){if(!this.entryId)return h`<p class="hint">Select a device on the Layout tab to manage installed widgets.</p>`;let t=this.fwManifest?.engine_version??"?",s={installed:"ok",outdated:"warn",not_installed:""},i={installed:"installed",outdated:"update available",not_installed:"not installed"};return h`
      <div class="bar"><span class="hint">engine v${t}</span>
        <button class="secondary" @click=${this.loadCatalog}>Refresh</button></div>
      <ul class="catalog">
        ${this.catalog.map(r=>h`<li>
          <span class="grow">${r.label} <span class="badge ${s[r.status]??""}">${i[r.status]??r.status}</span></span>
          ${r.requires?.length?h`<span class="hint">needs ${r.requires.join(", ")}</span>`:""}
          ${r.status==="installed"?h`<button class="danger" @click=${()=>this.removeWidgetUnit(r.id)}>Remove</button>`:h`<button @click=${()=>this.installWidget(r.id)}>${r.status==="outdated"?"Update":"Install"}</button>`}
        </li>`)}
      </ul>
      <p class="hint">Install pulls the widget (and any fonts it needs) to the device over the air; the device reboots and the widget becomes available on the Layout tab.</p>
    `}onSpecInput(t){this.specText=t,clearTimeout(this.specTimer),this.specTimer=window.setTimeout(()=>this.previewSpec(),400)}async previewSpec(){let t;try{t=JSON.parse(this.specText)}catch(s){this.specError=`JSON: ${s.message}`;return}try{let s=await this.hass.callWS({type:"pimoroni_unicorn/widget_preview",model:this.model,spec:t});this.specPng=s.png,this.specError=""}catch(s){this.specError=s?.message??String(s)}}async importSpec(t){try{let s=await this.hass.callWS({type:"pimoroni_unicorn/widget_import",text:t});this.specText=JSON.stringify(s.spec,null,2),this.specError="",this.previewSpec()}catch(s){this.specError=s?.message??String(s)}}async saveSpec(){let t;try{t=JSON.parse(this.specText)}catch(s){this.specError=`JSON: ${s.message}`;return}try{let s=await this.hass.callWS({type:"pimoroni_unicorn/widget_save",spec:t});this.specError="",this.status=`Saved custom widget "${s.id}". Install it from the Marketplace tab.`}catch(s){this.specError=s?.message??String(s)}}_editorView(){let t=Math.max(6,Math.floor(Et/this.dims[0]));return h`
      <div class="bar"><span class="hint">declarative widget — JSON spec, previewed on ${this.model}</span></div>
      <div class="wrap">
        <div class="col">
          <textarea class="spec" .value=${this.specText}
            @input=${s=>this.onSpecInput(s.target.value)}></textarea>
          <div class="panelrow">
            <button @click=${this.saveSpec}>Save custom</button>
            <button class="secondary" @click=${()=>{let s=prompt("Paste YAML or JSON widget spec:");s&&this.importSpec(s)}}>Import…</button>
          </div>
          ${this.specError?h`<div class="status err">${this.specError}</div>`:h`<div class="hint">binds: solar, soc, consumption, co2… (unknown binds preview as 123)</div>`}
        </div>
        <div class="col">
          <div class="stage" style=${`width:${this.dims[0]*t}px;height:${this.dims[1]*t}px`}>
            ${this.specPng?h`<img src="data:image/png;base64,${this.specPng}" width=${this.dims[0]*t} height=${this.dims[1]*t} />`:""}
          </div>
        </div>
      </div>
    `}};u([F({attribute:!1})],p.prototype,"hass",2),u([m()],p.prototype,"devices",2),u([m()],p.prototype,"entryId",2),u([m()],p.prototype,"model",2),u([m()],p.prototype,"layout",2),u([m()],p.prototype,"caps",2),u([m()],p.prototype,"overlayCaps",2),u([m()],p.prototype,"defaultLayout",2),u([m()],p.prototype,"stored",2),u([m()],p.prototype,"png",2),u([m()],p.prototype,"wboxes",2),u([m()],p.prototype,"dims",2),u([m()],p.prototype,"zoom",2),u([m()],p.prototype,"selected",2),u([m()],p.prototype,"sensors",2),u([m()],p.prototype,"selSensor",2),u([m()],p.prototype,"layoutName",2),u([m()],p.prototype,"live",2),u([m()],p.prototype,"wireframe",2),u([m()],p.prototype,"status",2),u([m()],p.prototype,"tab",2),u([m()],p.prototype,"catalog",2),u([m()],p.prototype,"fwManifest",2),u([m()],p.prototype,"specText",2),u([m()],p.prototype,"specPng",2),u([m()],p.prototype,"specError",2);customElements.get("pimoroni-unicorn-panel")||customElements.define("pimoroni-unicorn-panel",p);export{p as PimoroniUnicornPanel};
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
