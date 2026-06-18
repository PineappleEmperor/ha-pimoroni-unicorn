var Lt=Object.defineProperty;var Ct=Object.getOwnPropertyDescriptor;var p=(o,i,t,e)=>{for(var s=e>1?void 0:e?Ct(i,t):i,a=o.length-1,r;a>=0;a--)(r=o[a])&&(s=(e?r(i,t,s):r(s))||s);return e&&s&&Lt(i,t,s),s};var H=globalThis,W=H.ShadowRoot&&(H.ShadyCSS===void 0||H.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,V=Symbol(),lt=new WeakMap,I=class{constructor(i,t,e){if(this._$cssResult$=!0,e!==V)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=t}get styleSheet(){let i=this.o,t=this.t;if(W&&i===void 0){let e=t!==void 0&&t.length===1;e&&(i=lt.get(t)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),e&&lt.set(t,i))}return i}toString(){return this.cssText}},ct=o=>new I(typeof o=="string"?o:o+"",void 0,V),B=(o,...i)=>{let t=o.length===1?o[0]:i.reduce((e,s,a)=>e+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+o[a+1],o[0]);return new I(t,o,V)},dt=(o,i)=>{if(W)o.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of i){let e=document.createElement("style"),s=H.litNonce;s!==void 0&&e.setAttribute("nonce",s),e.textContent=t.cssText,o.appendChild(e)}},J=W?o=>o:o=>o instanceof CSSStyleSheet?(i=>{let t="";for(let e of i.cssRules)t+=e.cssText;return ct(t)})(o):o;var{is:Mt,defineProperty:Ot,getOwnPropertyDescriptor:Nt,getOwnPropertyNames:Rt,getOwnPropertySymbols:Dt,getPrototypeOf:Ht}=Object,z=globalThis,pt=z.trustedTypes,Wt=pt?pt.emptyScript:"",zt=z.reactiveElementPolyfillSupport,L=(o,i)=>o,C={toAttribute(o,i){switch(i){case Boolean:o=o?Wt:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,i){let t=o;switch(i){case Boolean:t=o!==null;break;case Number:t=o===null?null:Number(o);break;case Object:case Array:try{t=JSON.parse(o)}catch{t=null}}return t}},F=(o,i)=>!Mt(o,i),ht={attribute:!0,type:String,converter:C,reflect:!1,useDefault:!1,hasChanged:F};Symbol.metadata??=Symbol("metadata"),z.litPropertyMetadata??=new WeakMap;var f=class extends HTMLElement{static addInitializer(i){this._$Ei(),(this.l??=[]).push(i)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(i,t=ht){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(i)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(i,t),!t.noAccessor){let e=Symbol(),s=this.getPropertyDescriptor(i,e,t);s!==void 0&&Ot(this.prototype,i,s)}}static getPropertyDescriptor(i,t,e){let{get:s,set:a}=Nt(this.prototype,i)??{get(){return this[t]},set(r){this[t]=r}};return{get:s,set(r){let n=s?.call(this);a?.call(this,r),this.requestUpdate(i,n,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(i){return this.elementProperties.get(i)??ht}static _$Ei(){if(this.hasOwnProperty(L("elementProperties")))return;let i=Ht(this);i.finalize(),i.l!==void 0&&(this.l=[...i.l]),this.elementProperties=new Map(i.elementProperties)}static finalize(){if(this.hasOwnProperty(L("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(L("properties"))){let t=this.properties,e=[...Rt(t),...Dt(t)];for(let s of e)this.createProperty(s,t[s])}let i=this[Symbol.metadata];if(i!==null){let t=litPropertyMetadata.get(i);if(t!==void 0)for(let[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(let[t,e]of this.elementProperties){let s=this._$Eu(t,e);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(i){let t=[];if(Array.isArray(i)){let e=new Set(i.flat(1/0).reverse());for(let s of e)t.unshift(J(s))}else i!==void 0&&t.push(J(i));return t}static _$Eu(i,t){let e=t.attribute;return e===!1?void 0:typeof e=="string"?e:typeof i=="string"?i.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(i=>i(this))}addController(i){(this._$EO??=new Set).add(i),this.renderRoot!==void 0&&this.isConnected&&i.hostConnected?.()}removeController(i){this._$EO?.delete(i)}_$E_(){let i=new Map,t=this.constructor.elementProperties;for(let e of t.keys())this.hasOwnProperty(e)&&(i.set(e,this[e]),delete this[e]);i.size>0&&(this._$Ep=i)}createRenderRoot(){let i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return dt(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(i=>i.hostConnected?.())}enableUpdating(i){}disconnectedCallback(){this._$EO?.forEach(i=>i.hostDisconnected?.())}attributeChangedCallback(i,t,e){this._$AK(i,e)}_$ET(i,t){let e=this.constructor.elementProperties.get(i),s=this.constructor._$Eu(i,e);if(s!==void 0&&e.reflect===!0){let a=(e.converter?.toAttribute!==void 0?e.converter:C).toAttribute(t,e.type);this._$Em=i,a==null?this.removeAttribute(s):this.setAttribute(s,a),this._$Em=null}}_$AK(i,t){let e=this.constructor,s=e._$Eh.get(i);if(s!==void 0&&this._$Em!==s){let a=e.getPropertyOptions(s),r=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:C;this._$Em=s;let n=r.fromAttribute(t,a.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(i,t,e,s=!1,a){if(i!==void 0){let r=this.constructor;if(s===!1&&(a=this[i]),e??=r.getPropertyOptions(i),!((e.hasChanged??F)(a,t)||e.useDefault&&e.reflect&&a===this._$Ej?.get(i)&&!this.hasAttribute(r._$Eu(i,e))))return;this.C(i,t,e)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(i,t,{useDefault:e,reflect:s,wrapped:a},r){e&&!(this._$Ej??=new Map).has(i)&&(this._$Ej.set(i,r??t??this[i]),a!==!0||r!==void 0)||(this._$AL.has(i)||(this.hasUpdated||e||(t=void 0),this._$AL.set(i,t)),s===!0&&this._$Em!==i&&(this._$Eq??=new Set).add(i))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let i=this.scheduleUpdate();return i!=null&&await i,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,a]of this._$Ep)this[s]=a;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[s,a]of e){let{wrapped:r}=a,n=this[s];r!==!0||this._$AL.has(s)||n===void 0||this.C(s,void 0,a,n)}}let i=!1,t=this._$AL;try{i=this.shouldUpdate(t),i?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(e){throw i=!1,this._$EM(),e}i&&this._$AE(t)}willUpdate(i){}_$AE(i){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(i)),this.updated(i)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(i){return!0}update(i){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(i){}firstUpdated(i){}};f.elementStyles=[],f.shadowRootOptions={mode:"open"},f[L("elementProperties")]=new Map,f[L("finalized")]=new Map,zt?.({ReactiveElement:f}),(z.reactiveElementVersions??=[]).push("2.1.2");var Q=globalThis,ut=o=>o,j=Q.trustedTypes,gt=j?j.createPolicy("lit-html",{createHTML:o=>o}):void 0,$t="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,xt="?"+$,Ft=`<${xt}>`,E=document,O=()=>E.createComment(""),N=o=>o===null||typeof o!="object"&&typeof o!="function",tt=Array.isArray,jt=o=>tt(o)||typeof o?.[Symbol.iterator]=="function",U=`[ 	
\f\r]`,M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,vt=/-->/g,mt=/>/g,_=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),yt=/'/g,bt=/"/g,wt=/^(?:script|style|textarea|title)$/i,et=o=>(i,...t)=>({_$litType$:o,strings:i,values:t}),l=et(1),te=et(2),ee=et(3),k=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),ft=new WeakMap,S=E.createTreeWalker(E,129);function _t(o,i){if(!tt(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return gt!==void 0?gt.createHTML(i):i}var Pt=(o,i)=>{let t=o.length-1,e=[],s,a=i===2?"<svg>":i===3?"<math>":"",r=M;for(let n=0;n<t;n++){let c=o[n],u,v,g=-1,y=0;for(;y<c.length&&(r.lastIndex=y,v=r.exec(c),v!==null);)y=r.lastIndex,r===M?v[1]==="!--"?r=vt:v[1]!==void 0?r=mt:v[2]!==void 0?(wt.test(v[2])&&(s=RegExp("</"+v[2],"g")),r=_):v[3]!==void 0&&(r=_):r===_?v[0]===">"?(r=s??M,g=-1):v[1]===void 0?g=-2:(g=r.lastIndex-v[2].length,u=v[1],r=v[3]===void 0?_:v[3]==='"'?bt:yt):r===bt||r===yt?r=_:r===vt||r===mt?r=M:(r=_,s=void 0);let b=r===_&&o[n+1].startsWith("/>")?" ":"";a+=r===M?c+Ft:g>=0?(e.push(u),c.slice(0,g)+$t+c.slice(g)+$+b):c+$+(g===-2?n:b)}return[_t(o,a+(o[t]||"<?>")+(i===2?"</svg>":i===3?"</math>":"")),e]},R=class o{constructor({strings:i,_$litType$:t},e){let s;this.parts=[];let a=0,r=0,n=i.length-1,c=this.parts,[u,v]=Pt(i,t);if(this.el=o.createElement(u,e),S.currentNode=this.el.content,t===2||t===3){let g=this.el.content.firstChild;g.replaceWith(...g.childNodes)}for(;(s=S.nextNode())!==null&&c.length<n;){if(s.nodeType===1){if(s.hasAttributes())for(let g of s.getAttributeNames())if(g.endsWith($t)){let y=v[r++],b=s.getAttribute(g).split($),w=/([.?@])?(.*)/.exec(y);c.push({type:1,index:a,name:w[2],strings:b,ctor:w[1]==="."?Y:w[1]==="?"?X:w[1]==="@"?Z:A}),s.removeAttribute(g)}else g.startsWith($)&&(c.push({type:6,index:a}),s.removeAttribute(g));if(wt.test(s.tagName)){let g=s.textContent.split($),y=g.length-1;if(y>0){s.textContent=j?j.emptyScript:"";for(let b=0;b<y;b++)s.append(g[b],O()),S.nextNode(),c.push({type:2,index:++a});s.append(g[y],O())}}}else if(s.nodeType===8)if(s.data===xt)c.push({type:2,index:a});else{let g=-1;for(;(g=s.data.indexOf($,g+1))!==-1;)c.push({type:7,index:a}),g+=$.length-1}a++}}static createElement(i,t){let e=E.createElement("template");return e.innerHTML=i,e}};function T(o,i,t=o,e){if(i===k)return i;let s=e!==void 0?t._$Co?.[e]:t._$Cl,a=N(i)?void 0:i._$litDirective$;return s?.constructor!==a&&(s?._$AO?.(!1),a===void 0?s=void 0:(s=new a(o),s._$AT(o,t,e)),e!==void 0?(t._$Co??=[])[e]=s:t._$Cl=s),s!==void 0&&(i=T(o,s._$AS(o,i.values),s,e)),i}var K=class{constructor(i,t){this._$AV=[],this._$AN=void 0,this._$AD=i,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(i){let{el:{content:t},parts:e}=this._$AD,s=(i?.creationScope??E).importNode(t,!0);S.currentNode=s;let a=S.nextNode(),r=0,n=0,c=e[0];for(;c!==void 0;){if(r===c.index){let u;c.type===2?u=new D(a,a.nextSibling,this,i):c.type===1?u=new c.ctor(a,c.name,c.strings,this,i):c.type===6&&(u=new G(a,this,i)),this._$AV.push(u),c=e[++n]}r!==c?.index&&(a=S.nextNode(),r++)}return S.currentNode=E,s}p(i){let t=0;for(let e of this._$AV)e!==void 0&&(e.strings!==void 0?(e._$AI(i,e,t),t+=e.strings.length-2):e._$AI(i[t])),t++}},D=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(i,t,e,s){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=i,this._$AB=t,this._$AM=e,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let i=this._$AA.parentNode,t=this._$AM;return t!==void 0&&i?.nodeType===11&&(i=t.parentNode),i}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(i,t=this){i=T(this,i,t),N(i)?i===m||i==null||i===""?(this._$AH!==m&&this._$AR(),this._$AH=m):i!==this._$AH&&i!==k&&this._(i):i._$litType$!==void 0?this.$(i):i.nodeType!==void 0?this.T(i):jt(i)?this.k(i):this._(i)}O(i){return this._$AA.parentNode.insertBefore(i,this._$AB)}T(i){this._$AH!==i&&(this._$AR(),this._$AH=this.O(i))}_(i){this._$AH!==m&&N(this._$AH)?this._$AA.nextSibling.data=i:this.T(E.createTextNode(i)),this._$AH=i}$(i){let{values:t,_$litType$:e}=i,s=typeof e=="number"?this._$AC(i):(e.el===void 0&&(e.el=R.createElement(_t(e.h,e.h[0]),this.options)),e);if(this._$AH?._$AD===s)this._$AH.p(t);else{let a=new K(s,this),r=a.u(this.options);a.p(t),this.T(r),this._$AH=a}}_$AC(i){let t=ft.get(i.strings);return t===void 0&&ft.set(i.strings,t=new R(i)),t}k(i){tt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,e,s=0;for(let a of i)s===t.length?t.push(e=new o(this.O(O()),this.O(O()),this,this.options)):e=t[s],e._$AI(a),s++;s<t.length&&(this._$AR(e&&e._$AB.nextSibling,s),t.length=s)}_$AR(i=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);i!==this._$AB;){let e=ut(i).nextSibling;ut(i).remove(),i=e}}setConnected(i){this._$AM===void 0&&(this._$Cv=i,this._$AP?.(i))}},A=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(i,t,e,s,a){this.type=1,this._$AH=m,this._$AN=void 0,this.element=i,this.name=t,this._$AM=s,this.options=a,e.length>2||e[0]!==""||e[1]!==""?(this._$AH=Array(e.length-1).fill(new String),this.strings=e):this._$AH=m}_$AI(i,t=this,e,s){let a=this.strings,r=!1;if(a===void 0)i=T(this,i,t,0),r=!N(i)||i!==this._$AH&&i!==k,r&&(this._$AH=i);else{let n=i,c,u;for(i=a[0],c=0;c<a.length-1;c++)u=T(this,n[e+c],t,c),u===k&&(u=this._$AH[c]),r||=!N(u)||u!==this._$AH[c],u===m?i=m:i!==m&&(i+=(u??"")+a[c+1]),this._$AH[c]=u}r&&!s&&this.j(i)}j(i){i===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,i??"")}},Y=class extends A{constructor(){super(...arguments),this.type=3}j(i){this.element[this.name]=i===m?void 0:i}},X=class extends A{constructor(){super(...arguments),this.type=4}j(i){this.element.toggleAttribute(this.name,!!i&&i!==m)}},Z=class extends A{constructor(i,t,e,s,a){super(i,t,e,s,a),this.type=5}_$AI(i,t=this){if((i=T(this,i,t,0)??m)===k)return;let e=this._$AH,s=i===m&&e!==m||i.capture!==e.capture||i.once!==e.once||i.passive!==e.passive,a=i!==m&&(e===m||s);s&&this.element.removeEventListener(this.name,this,e),a&&this.element.addEventListener(this.name,this,i),this._$AH=i}handleEvent(i){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,i):this._$AH.handleEvent(i)}},G=class{constructor(i,t,e){this.element=i,this.type=6,this._$AN=void 0,this._$AM=t,this.options=e}get _$AU(){return this._$AM._$AU}_$AI(i){T(this,i)}};var qt=Q.litHtmlPolyfillSupport;qt?.(R,D),(Q.litHtmlVersions??=[]).push("3.3.3");var St=(o,i,t)=>{let e=t?.renderBefore??i,s=e._$litPart$;if(s===void 0){let a=t?.renderBefore??null;e._$litPart$=s=new D(i.insertBefore(O(),a),a,void 0,t??{})}return s._$AI(o),s};var st=globalThis,x=class extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let i=super.createRenderRoot();return this.renderOptions.renderBefore??=i.firstChild,i}update(i){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(i),this._$Do=St(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return k}};x._$litElement$=!0,x.finalized=!0,st.litElementHydrateSupport?.({LitElement:x});var Vt=st.litElementPolyfillSupport;Vt?.({LitElement:x});(st.litElementVersions??=[]).push("4.2.2");var Bt={attribute:!0,type:String,converter:C,reflect:!1,hasChanged:F},Jt=(o=Bt,i,t)=>{let{kind:e,metadata:s}=t,a=globalThis.litPropertyMetadata.get(s);if(a===void 0&&globalThis.litPropertyMetadata.set(s,a=new Map),e==="setter"&&((o=Object.create(o)).wrapped=!0),a.set(t.name,o),e==="accessor"){let{name:r}=t;return{set(n){let c=i.get.call(this);i.set.call(this,n),this.requestUpdate(r,c,o,!0,n)},init(n){return n!==void 0&&this.C(r,void 0,o,n),n}}}if(e==="setter"){let{name:r}=t;return function(n){let c=this[r];i.call(this,n),this.requestUpdate(r,c,o,!0,n)}}throw Error("Unsupported decorator location: "+e)};function P(o){return(i,t)=>typeof t=="object"?Jt(o,i,t):((e,s,a)=>{let r=s.hasOwnProperty(a);return s.constructor.createProperty(a,e),r?Object.getOwnPropertyDescriptor(s,a):void 0})(o,i,t)}function h(o){return P({...o,state:!0,attribute:!1})}var it=560,Ut=JSON.stringify({id:"my_widget",label:"My Widget",w:16,h:7,default_cfg:{color:[0,255,0]},draw:[{op:"value",x:0,y:1,bind:"solar",fmt:"{:.1f}"},{op:"bar",x:0,y:6,w:16,h:1,bind:"soc",max:100,color:[0,120,255],bg:[30,30,30]}]},null,2),Et={galactic:[53,11],cosmic:[32,32],stellar:[16,16]},kt="__mock__",Tt=["value","bar","rect","pixel","icon","dot"],Kt={value:[["bind","text"],["fmt","text"],["color","rgb"]],bar:[["w","num"],["h","num"],["bind","text"],["max","num"],["color","rgb"],["bg","rgb"]],rect:[["w","num"],["h","num"],["color","rgb"]],pixel:[["color","rgb"]],icon:[["name","icon"]],dot:[["w","num"],["h","num"],["bind","text"],["on_color","rgb"],["off_color","rgb"]]},at=o=>{let[i,t,e]=o??[0,0,0];return"#"+[i,t,e].map(s=>Math.max(0,Math.min(255,s|0)).toString(16).padStart(2,"0")).join("")},rt=o=>{let i=(o||"").replace("#","");return[0,2,4].map(t=>parseInt(i.substr(t,2),16)||0)},d=class extends x{constructor(){super(...arguments);this.devices=[];this.entryId="";this.model="galactic";this.layout={widgets:[]};this.caps=[];this.overlayCaps=[];this.defaultLayout={widgets:[]};this.stored={};this.png="";this.wboxes=[];this.dims=[53,11];this.zoom=0;this.selected=-1;this.dragIdx=-1;this.layoutName="default";this.live=!1;this.wireframe=!1;this.locked=!1;this.status="";this.tab="layout";this.catalog=[];this.fwManifest=null;this.contentLayouts=[];this.contentScreensets=[];this.showAllContent=!1;this.iconNames=[];this.installedIcons=[];this.iconThumbs={};this.deviceIcons=[];this.iconCode="";this.iconName="";this.iconTargets=[];this.fonts=[];this.fontText="";this.fontPngs={};this.fontTimer=0;this.dirty=!1;this.sectionsOpen={};this.screenLayouts=[];this.screenDwell=10;this.screenTransition="none";this.screenPngs={};this.screenIdx=0;this.screenOpacity=1;this.screenTimer=0;this.specText=Ut;this.editMode="form";this.specPng="";this.specError="";this.specTimer=0;this._frameTimers={};this._onKey=t=>{let e=t.target?.tagName;if(e==="INPUT"||e==="SELECT"||e==="TEXTAREA")return;if((t.key==="Delete"||t.key==="Backspace")&&this.tab==="layout"&&this.selected>=0&&this.layout.widgets[this.selected]){t.preventDefault(),this.removeWidget(this.selected);return}let a={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[t.key];a&&(t.preventDefault(),this._nudge(a[0],a[1]))}}static{this.styles=B`
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
    .stagewrap { max-width: 100%; max-height: 62vh; overflow: auto; overscroll-behavior: contain; padding-top: 18px; cursor: grab; }
    .stagewrap.panning { cursor: grabbing; }
    .stage { position: relative; display: inline-block; background: #000; line-height: 0; border-radius: 8px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.12); overflow: hidden; }
    .stage img { image-rendering: pixelated; display: block; }
    .grid, .boxes { position: absolute; inset: 0; pointer-events: none; }
    /* Boxes are draggable hit-areas always (unless locked); only visible in wireframe mode or when selected. */
    .box { position: absolute; box-sizing: border-box; border: 1px solid transparent; cursor: grab; touch-action: none; pointer-events: auto; border-radius: 2px; }
    .box:hover { border-color: rgba(255,255,255,.25); }
    .boxes.wf .box { border-color: rgba(255,255,255,.35); }
    .box.sel, .boxes.wf .box.sel { border: 2px solid var(--pu-primary); background: color-mix(in srgb, var(--pu-primary) 14%, transparent); }
    .box .tag { position: absolute; top: -17px; left: 0; font: 11px ui-monospace, monospace; color: #ddd; white-space: nowrap; display: none; }
    .boxes.wf .box .tag, .box.sel .tag { display: block; }
    .wlist { list-style: none; padding: 0; margin: 0 0 12px; }
    .wlist li { display: flex; gap: 10px; align-items: center; padding: 10px 12px; border-radius: 10px; cursor: pointer; transition: background .12s; }
    .wlist li:hover { background: color-mix(in srgb, var(--pu-primary) 7%, transparent); }
    .wlist li.sel { background: color-mix(in srgb, var(--pu-primary) 14%, transparent); box-shadow: inset 3px 0 0 var(--pu-primary); }
    .wlist li .grow { flex: 1; }
    .wlist li.dragging { opacity: .4; }
    .wlist li .drag { cursor: grab; color: var(--secondary-text-color, #79747e); user-select: none; line-height: 1; }
    .wlist li .drag:active { cursor: grabbing; }
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
    .iconprev { width: 128px; height: 128px; flex: none; object-fit: contain; image-rendering: pixelated; background: #000; border-radius: 8px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.12); }
    .iconthumb { width: 40px; height: 40px; flex: none; object-fit: contain; image-rendering: pixelated; background: #000; border-radius: 6px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.12); }
    .targets { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
    .chk { display: inline-flex; gap: 4px; align-items: center; font-weight: 400; }
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
    .frow { display: flex; align-items: center; gap: 14px; padding: 8px 10px; border: 1px solid var(--pu-outline); border-radius: 8px; margin-bottom: 6px; }
    .fmeta { display: flex; flex-direction: column; gap: 2px; width: 160px; flex: none; }
    .fprev { height: 40px; image-rendering: pixelated; background: #000; border-radius: 6px; padding: 0 8px; object-fit: contain; box-shadow: inset 0 0 0 1px rgba(255,255,255,.12); }
    .swatches { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
    .swatch { position: relative; display: inline-flex; }
    .swatch .x { position: absolute; top: -6px; right: -6px; width: 14px; height: 14px; line-height: 12px; padding: 0; border-radius: 50%; border: none; background: var(--pu-outline); color: #fff; font-size: 11px; cursor: pointer; }
    .swatches .add { width: 22px; height: 22px; padding: 0; border-radius: 6px; border: 1px dashed var(--pu-outline); background: transparent; color: inherit; font-size: 15px; cursor: pointer; }
  `}firstUpdated(){this.loadDevices(),this.loadIcons(),this.loadFonts()}async loadIcons(){try{let t={type:"pimoroni_unicorn/icons"};this.entryId&&(t.entry_id=this.entryId);let e=await this.hass.callWS(t);this.iconNames=[...e.builtin??[],...e.installed??[]],this.installedIcons=e.installed??[],this.iconThumbs=e.thumbs??{},this.deviceIcons=e.device_installed??[]}catch{}}async pushIconToDevice(t){this.entryId&&(await this.hass.callWS({type:"pimoroni_unicorn/icon_push",entry_id:this.entryId,name:t}),this.status=`Installing "${t}" on this device\u2026`,this.loadIcons())}async removeIconFromDevice(t){this.entryId&&(await this.hass.callWS({type:"pimoroni_unicorn/icon_device_remove",entry_id:this.entryId,name:t}),this.status=`Removed "${t}" from this device.`,this.loadIcons())}iconTargetIds(){return this.iconTargets.length?this.iconTargets:this.devices.map(t=>t.entry_id)}toggleIconTarget(t){let e=new Set(this.iconTargetIds());e.has(t)?e.delete(t):e.add(t),this.iconTargets=this.devices.map(s=>s.entry_id).filter(s=>e.has(s))}async installIcon(){let t=parseInt(this.iconCode,10),e=this.iconName.trim();if(!t||!e)return;let s=this.iconTargetIds(),a=await this.hass.callWS({type:"pimoroni_unicorn/icon_install",code:t,name:e,entry_ids:s});if(!a.ok){this.status="Couldn't fetch that LaMetric code.";return}let r=a.sent??[];this.status=r.length?`Installed "${e}" \u2192 ${r.join(", ")}.`:`Saved "${e}" (no devices to push to).`,this.iconCode="",this.iconName="",this.loadIcons()}async removeIcon(t){confirm(`Delete icon "${t}" from all devices?`)&&(await this.hass.callWS({type:"pimoroni_unicorn/icon_remove",name:t}),this.status=`Removed icon "${t}".`,this.loadIcons())}async loadFonts(){try{let t=await this.hass.callWS({type:"pimoroni_unicorn/fonts"});this.fonts=t.fonts??[],this.refreshFontPreviews()}catch{}}onFontInput(t){this.fontText=t,clearTimeout(this.fontTimer),this.fontTimer=window.setTimeout(()=>this.refreshFontPreviews(),250)}async refreshFontPreviews(){let t={};await Promise.all(this.fonts.map(async e=>{let s=this.fontText.trim()||e.sample;try{let a=await this.hass.callWS({type:"pimoroni_unicorn/font_preview",font:e.name,text:s});t[e.name]=a.png}catch{}})),this.fontPngs=t}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKey)}disconnectedCallback(){window.removeEventListener("keydown",this._onKey),super.disconnectedCallback()}_nudge(t,e){let[s,a]=this.dims;if(this.selected>=0&&this.layout.widgets[this.selected]){let r=this.layout.widgets[this.selected],[n,c]=this.boxDims(this.selected);r.x=Math.max(1-n,Math.min(s-1,r.x+t)),r.y=Math.max(1-c,Math.min(a-1,r.y+e)),this.edited()}}async loadDevices(){let t=await this.hass.callWS({type:"pimoroni_unicorn/devices"});this.devices=t.devices??[],this.devices.length?await this.selectDevice(this.devices[0].entry_id):await this.selectMock(this.model)}async loadCaps(t){let e=await this.hass.callWS({type:"pimoroni_unicorn/capabilities",...t});this.caps=e.widgets??[],this.overlayCaps=e.overlays??[],this.defaultLayout=e.default_layout,this.model=e.model,this.dims=Et[this.model]??[53,11],await this.refreshStored()}async selectDevice(t){let e=this.devices.find(a=>a.entry_id===t);if(!e||!this.guardDiscard())return;this.entryId=t,await this.loadCaps({entry_id:t}),this.loadIcons();let s=e.active_layout?this.stored[e.active_layout]:void 0;this.loadLayout(s??this.defaultLayout)}async selectMock(t){this.guardDiscard()&&(this.entryId="",await this.loadCaps({model:t}),this.loadIcons(),this.loadLayout(this.defaultLayout))}async refreshStored(){let t=await this.hass.callWS({type:"pimoroni_unicorn/layouts"});this.stored=t.layouts??{}}loadLayout(t){this.layout=JSON.parse(JSON.stringify(t)),this.layoutName=this.layout.name??"default",this.selected=-1,this.dirty=!1,this.renderPreview()}guardDiscard(){return!this.dirty||confirm("Discard unsaved changes to this page?")}playFrames(t,e,s){if(window.clearInterval(this._frameTimers[t]),s(e[0]??""),e.length>1){let a=0;this._frameTimers[t]=window.setInterval(()=>{a=(a+1)%e.length,s(e[a])},200)}}async renderPreview(){try{let t=await this.hass.callWS({type:"pimoroni_unicorn/render",model:this.model,layout:this.layout});this.wboxes=t.boxes??[],this.playFrames("layout",t.frames??(t.png?[t.png]:[]),e=>{this.png=e}),this.status.startsWith("Render failed")&&(this.status="")}catch(t){this.png="",this.status=`Render failed: ${t?.message??t}`}}edited(){this.dirty=!0,this.requestUpdate(),this.renderTimer&&clearTimeout(this.renderTimer),this.renderTimer=window.setTimeout(()=>this.renderPreview(),80),this.live&&this.entryId&&(this.pushTimer&&clearTimeout(this.pushTimer),this.pushTimer=window.setTimeout(()=>this.pushLive(),250))}async pushLive(){await this.hass.callWS({type:"pimoroni_unicorn/push_layout",entry_id:this.entryId,layout:this.layout})}capFor(t){return this.caps.find(e=>e.id===t)}typeOf(t){return t.type??t.id}capForEntry(t){return this.capFor(this.typeOf(t))}get scale(){return this.zoom||Math.max(4,Math.floor(it/this.dims[0]))}zoomBy(t){this.zoom=Math.min(48,Math.max(4,this.scale+t))}onWheel(t){!t.ctrlKey&&!t.metaKey||(t.preventDefault(),this.zoomBy(t.deltaY<0?2:-2))}startPan(t){if(t.target.closest(".box"))return;let e=t.currentTarget;t.preventDefault();let s=t.clientX,a=t.clientY,r=e.scrollLeft,n=e.scrollTop;e.setPointerCapture(t.pointerId),e.classList.add("panning");let c=v=>{e.scrollLeft=r-(v.clientX-s),e.scrollTop=n-(v.clientY-a)},u=v=>{e.releasePointerCapture(v.pointerId),e.classList.remove("panning"),e.removeEventListener("pointermove",c),e.removeEventListener("pointerup",u)};e.addEventListener("pointermove",c),e.addEventListener("pointerup",u)}boxDims(t){let e=this.wboxes[t];if(e)return e;let s=this.layout.widgets[t],a=s?this.capForEntry(s):void 0;return a?[a.w,a.h]:[0,0]}cfgVal(t,e){return t.cfg?.[e]??this.capForEntry(t)?.default_cfg[e]}setCfg(t,e,s){t.cfg={...t.cfg??{},[e]:s},this.edited()}cfgPalette(t,e){let s=this.cfgVal(t,e);return s&&s.length?s.map(a=>[...a]):[this.cfgVal(t,"color")??[255,255,255]]}setCfgColor(t,e,s,a){let r=this.cfgPalette(t,e);r[s]=a,this.setCfg(t,e,r)}addCfgColor(t,e){let s=this.cfgPalette(t,e);s.push([255,255,255]),this.setCfg(t,e,s)}removeCfgColor(t,e,s){let a=this.cfgPalette(t,e);a.length>1&&(a.splice(s,1),this.setCfg(t,e,a))}setName(t,e){let s=e.trim();s?t.name=s:delete t.name,this.edited()}setPos(t,e,s){let[a,r]=this.boxDims(this.selected),[n,c]=this.dims,u=Math.round(s);e==="x"?t.x=Math.max(1-a,Math.min(n-1,u)):t.y=Math.max(1-r,Math.min(c-1,u)),this.edited()}onImgLoad(t){let e=t.target;this.dims=[e.naturalWidth,e.naturalHeight]}startDrag(t,e){e.preventDefault(),this.selected=t;let s=this.layout.widgets[t],[a,r]=this.boxDims(t),n=this.layout.grid??2,[c,u]=this.dims,v=e.clientX,g=e.clientY,y=s.x,b=s.y;e.target.setPointerCapture(e.pointerId);let w=ot=>{let At=Math.round((ot.clientX-v)/this.scale/n)*n,It=Math.round((ot.clientY-g)/this.scale/n)*n;s.x=Math.max(1-a,Math.min(c-1,y+At)),s.y=Math.max(1-r,Math.min(u-1,b+It)),this.edited()},nt=()=>{window.removeEventListener("pointermove",w),window.removeEventListener("pointerup",nt),this.renderPreview()};window.addEventListener("pointermove",w),window.addEventListener("pointerup",nt)}addWidget(t){if(!t)return;let e=this.capFor(t),s=new Set(this.layout.widgets.map(r=>r.id)),a;if(e?.multi||s.has(t)){let r=2,n=`${t}-${r}`;for(;s.has(n);)n=`${t}-${++r}`;a={id:n,type:t,name:`${e?.label??t} ${r}`,x:0,y:0,cfg:{}}}else a={id:t,type:t,x:0,y:0,cfg:{}};this.layout.widgets.push(a),this.selected=this.layout.widgets.length-1,this.edited()}removeWidget(t){this.layout.widgets.splice(t,1),this.selected=-1,this.edited()}dropWidget(t){let e=this.dragIdx;if(this.dragIdx=-1,e<0||e===t)return;let s=this.layout.widgets,[a]=s.splice(e,1);s.splice(t,0,a),this.selected=s.indexOf(a),this.edited()}toggleOverlay(t,e){let s=new Set(this.layout.overlays??[]);e?s.add(t):s.delete(t),this.layout.overlays=[...s],this.edited()}async save(){this.entryId&&(this.layout.name=this.layoutName,await this.hass.callWS({type:"pimoroni_unicorn/save_layout",entry_id:this.entryId,name:this.layoutName,layout:this.layout}),await this.refreshStored(),this.dirty=!1,this.status=`Saved "${this.layoutName}" and pushed to device.`)}async deleteLayout(){this.stored[this.layoutName]&&confirm(`Delete page "${this.layoutName}"? This can't be undone.`)&&(await this.hass.callWS({type:"pimoroni_unicorn/delete_layout",name:this.layoutName}),await this.refreshStored(),this.status=`Deleted "${this.layoutName}".`,this.loadLayout(this.defaultLayout))}renderWidgetEditor(){let t=this.layout.widgets[this.selected];if(!t)return l`<p class="hint">Select a widget to edit.</p>`;let e=this.capForEntry(t);return e?l`
      <h3>${t.name??e.label}</h3>
      <div class="panelrow"><label>Name</label>
        <input type="text" style="width:160px" placeholder=${e.label} .value=${t.name??""}
          @change=${s=>this.setName(t,s.target.value)} /></div>
      <div class="panelrow">
        <label>X</label><input type="number" style="width:60px" .value=${String(t.x)}
          @change=${s=>this.setPos(t,"x",+s.target.value)} />
        <label>Y</label><input type="number" style="width:60px" .value=${String(t.y)}
          @change=${s=>this.setPos(t,"y",+s.target.value)} />
      </div>
      ${e.cfg_fields.map(s=>{let a=this.cfgVal(t,"color_mode");if(s.key==="speed"&&a!=="rainbow"||s.type==="rgblist"&&a!=="per_char")return"";if(s.type==="rgblist"){let r=this.cfgPalette(t,s.key);return l`<div class="panelrow"><label>${s.label??s.key}</label>
            <span class="swatches">
              ${r.map((n,c)=>l`<span class="swatch">
                <input type="color" .value=${at(n)}
                  @input=${u=>this.setCfgColor(t,s.key,c,rt(u.target.value))} />
                ${r.length>1?l`<button class="x" title="Remove"
                  @click=${()=>this.removeCfgColor(t,s.key,c)}>×</button>`:""}
              </span>`)}
              <button class="add" title="Add colour" @click=${()=>this.addCfgColor(t,s.key)}>+</button>
            </span></div>`}return s.type==="select"?l`<div class="panelrow"><label>${s.label??s.key}</label>
            <select @change=${r=>this.setCfg(t,s.key,r.target.value)}>
              ${(s.options??[]).map(r=>l`<option ?selected=${this.cfgVal(t,s.key)===r}>${r}</option>`)}
            </select></div>`:s.type==="number"?l`<div class="panelrow"><label>${s.label??s.key}</label>
            <input type="number" style="width:60px" min=${s.min??1} max=${s.max??64} step=${s.step??1}
              .value=${String(this.cfgVal(t,s.key))}
              @change=${r=>this.setCfg(t,s.key,+r.target.value)} /></div>`:s.type==="icon"?l`<div class="panelrow"><label>${s.label??s.key}</label>
            <select @change=${r=>this.setCfg(t,s.key,r.target.value)}>
              ${this.iconNames.map(r=>l`<option ?selected=${this.cfgVal(t,s.key)===r}>${r}</option>`)}
            </select></div>`:s.type==="entity"?l`<div class="panelrow"><label>${s.label??s.key}</label>
            <input type="text" style="width:200px" list="pu-entity-list" placeholder="entity id…"
              .value=${String(this.cfgVal(t,s.key)??"")}
              @change=${r=>this.setCfg(t,s.key,r.target.value)} />
            <datalist id="pu-entity-list">
              ${Object.keys(this.hass?.states??{}).map(r=>l`<option value=${r}></option>`)}
            </datalist></div>`:s.type==="text"?l`<div class="panelrow"><label>${s.label??s.key}</label>
            <input type="text" style="width:120px" .value=${String(this.cfgVal(t,s.key)??"")}
              @change=${r=>this.setCfg(t,s.key,r.target.value)} /></div>`:l`<div class="panelrow"><label>${s.label??s.key}</label>
          <input type="color" .value=${at(this.cfgVal(t,s.key))}
            @input=${r=>this.setCfg(t,s.key,rt(r.target.value))} /></div>`})}
      <div class="panelrow"><button class="danger" @click=${()=>this.removeWidget(this.selected)}>Remove widget</button></div>
    `:""}switchTab(t){this.tab=t,t==="market"?this.loadCatalog():t==="edit"?this.previewSpec():t==="screens"&&this.buildScreenPreview()}_appBar(){let t=this.devices.find(e=>e.entry_id===this.entryId);return l`
      <div class="appbar">
        <span class="brand">Pimoroni Unicorn</span>
        <label>Device
          <select @change=${e=>{let s=e.target.value;s===kt?this.selectMock(this.model):this.selectDevice(s)}}>
            <option value=${kt} ?selected=${!this.entryId}>Mock (preview only)</option>
            ${this.devices.map(e=>l`<option value=${e.entry_id} ?selected=${e.entry_id===this.entryId}>${e.name}</option>`)}
          </select>
        </label>
        ${this.entryId?l`<span class="chip">${t?.model??this.model}</span>`:l`<label>Model
              <select @change=${e=>this.selectMock(e.target.value)}>
                ${Object.keys(Et).map(e=>l`<option ?selected=${e===this.model}>${e}</option>`)}
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
    `}_layoutView(){let t=this.scale,e=new Set(this.layout.widgets.map(n=>this.typeOf(n))),s=this.caps.filter(n=>n.multi||!e.has(n.id)),a=new Set(this.layout.overlays??[]),r=`background-image:linear-gradient(to right,rgba(255,255,255,.10) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.10) 1px,transparent 1px);background-size:${t}px ${t}px`;return l`
      <div class="bar">
        <div class="group">
          <label>Page
            <select @change=${n=>{let c=n.target.value;this.guardDiscard()&&this.loadLayout(c==="__new__"?this.defaultLayout:this.stored[c])}}>
              ${Object.keys(this.stored).map(n=>l`<option ?selected=${n===this.layoutName}>${n}</option>`)}
              <option value="__new__">+ new page</option>
            </select>
          </label>
          <label>Name <input .value=${this.layoutName} @input=${n=>this.layoutName=n.target.value} /></label>
        </div>
        <div class="group">
          <button @click=${this.save} ?disabled=${!this.entryId} title=${this.entryId?"":"Select a device to save/push"}>Save &amp; Push</button>
          <button class="secondary" @click=${this.exportLayout} title="Copy this page's JSON to clipboard to share or import elsewhere">Export JSON</button>
          ${this.stored[this.layoutName]?l`<button class="secondary" @click=${()=>this.publishLayout(!0)} title="List this page in the marketplace">Publish</button>`:""}
          ${this.stored[this.layoutName]?l`<button class="danger" @click=${this.deleteLayout}>Delete</button>`:""}
        </div>
        <span class="grow"></span>
        <div class="group">
          <label>Snap
            <select @change=${n=>{this.layout.grid=+n.target.value,this.edited()}}>
              ${[1,2,4].map(n=>l`<option ?selected=${(this.layout.grid??2)===n}>${n}</option>`)}
            </select> px</label>
          <label>Zoom
            <button class="zbtn" @click=${()=>this.zoomBy(-2)} title="Zoom out">&minus;</button>
            <input type="range" min="4" max="48" .value=${String(this.scale)}
              @input=${n=>this.zoom=+n.target.value} />
            <button class="zbtn" @click=${()=>this.zoomBy(2)} title="Zoom in">+</button>
          </label>
          <label><input type="checkbox" .checked=${this.wireframe} @change=${n=>this.wireframe=n.target.checked} /> wireframe</label>
          <label><input type="checkbox" .checked=${this.locked} @change=${n=>this.locked=n.target.checked} /> lock</label>
          <label><input type="checkbox" .checked=${this.live} ?disabled=${!this.entryId} @change=${n=>this.live=n.target.checked} /> live push</label>
        </div>
      </div>

      <div class="wrap">
        <div class="col">
          <div class="stagewrap" @wheel=${this.onWheel} @pointerdown=${this.startPan}>
            <div class="stage" style=${`width:${this.dims[0]*t}px;height:${this.dims[1]*t}px`}>
              ${this.png?l`<img src="data:image/png;base64,${this.png}" width=${this.dims[0]*t} height=${this.dims[1]*t} @load=${this.onImgLoad} />`:""}
              <div class="grid" style=${r}></div>
              ${this.locked?"":l`<div class="boxes ${this.wireframe?"wf":""}">${this.layout.widgets.map((n,c)=>{if(!this.capForEntry(n)||n.enabled===!1)return"";let[u,v]=this.boxDims(c);return l`<div class="box ${c===this.selected?"sel":""}"
                  style=${`left:${n.x*t}px;top:${n.y*t}px;width:${u*t}px;height:${v*t}px`}
                  @pointerdown=${g=>this.startDrag(c,g)}>
                  <span class="tag">${n.name??this.capForEntry(n)?.label??n.id}</span></div>`})}</div>`}
            </div>
          </div>
          <div class="status ${this.status.startsWith("Render failed")?"err":""}">${this.status}</div>
        </div>

        <div class="col">
          <h3>Layers</h3>
          <ul class="wlist">
            ${[...this.layout.widgets.keys()].reverse().map(n=>{let c=this.layout.widgets[n];return l`
              <li class="${n===this.selected?"sel":""} ${n===this.dragIdx?"dragging":""}"
                  @click=${()=>this.selected=n}
                  @dragover=${u=>{u.preventDefault()}}
                  @drop=${u=>{u.preventDefault(),this.dropWidget(n)}}>
                <span class="drag" title="Drag to reorder" draggable="true"
                  @dragstart=${u=>{this.dragIdx=n,u.dataTransfer&&(u.dataTransfer.effectAllowed="move")}}
                  @dragend=${()=>{this.dragIdx=-1}}>⣿</span>
                <input type="checkbox" .checked=${c.enabled!==!1} title="Show / hide"
                  @click=${u=>{u.stopPropagation(),c.enabled=u.target.checked,this.edited()}} />
                <span class="grow">${c.name??this.capForEntry(c)?.label??c.id}</span>
              </li>`})}
          </ul>
          ${this.layout.widgets.length>1?l`<p class="hint">Top of the list draws on top.</p>`:""}
          ${s.length?l`<div class="panelrow">
            <select id="addsel"><option value="">add widget…</option>${s.map(n=>l`<option value=${n.id}>${n.label}</option>`)}</select>
            <button class="secondary" @click=${()=>{let n=this.renderRoot.querySelector("#addsel");this.addWidget(n.value),n.value=""}}>Add</button>
          </div>`:""}
          <h3>Overlays</h3>
          ${this.overlayCaps.map(n=>l`<div class="panelrow"><label>
            <input type="checkbox" .checked=${a.has(n.id)} @change=${c=>this.toggleOverlay(n.id,c.target.checked)} /> ${n.label}</label></div>`)}
          <h3>Selected</h3>
          ${this.renderWidgetEditor()}
        </div>
      </div>
    `}async loadCatalog(){if(await this.loadContent(),!this.entryId){this.catalog=[],this.fwManifest=null;return}let t=await this.hass.callWS({type:"pimoroni_unicorn/catalog",entry_id:this.entryId});this.catalog=t.widgets??[];let e=await this.hass.callWS({type:"pimoroni_unicorn/fw_manifest",entry_id:this.entryId});this.fwManifest=e.manifest??null}async loadContent(){let t=this.entryId?{entry_id:this.entryId}:{},e=await this.hass.callWS({type:"pimoroni_unicorn/content_catalog",...t});this.contentLayouts=e.layouts??[],this.contentScreensets=e.screensets??[]}async deployLayout(t,e){if(!this.entryId){this.status="Select a device to deploy.";return}if(!e&&!confirm(`"${t}" isn't built for this device's model. Deploy anyway?`))return;let s=await this.hass.callWS({type:"pimoroni_unicorn/deploy_layout",entry_id:this.entryId,name:t,override:!e});this.status=s.ok?`Deployed "${t}" (installing any missing widgets/fonts first).`:"Deploy failed."}async deployScreenset(t,e){if(!this.entryId){this.status="Select a device to deploy.";return}if(!e&&!confirm(`"${t}" isn't built for this device's model. Deploy anyway?`))return;let s=await this.hass.callWS({type:"pimoroni_unicorn/deploy_screenset",entry_id:this.entryId,id:t,override:!e});this.status=s.ok?`Deployed screen set "${t}".`:"Deploy failed."}async exportLayout(){let t={...this.layout,name:this.layoutName,model:this.model},e=JSON.stringify(t,null,2);try{await navigator.clipboard.writeText(e),this.status=`Copied "${this.layoutName}" JSON (${this.model}) to clipboard.`}catch{let s=document.createElement("a");s.href=URL.createObjectURL(new Blob([e],{type:"application/json"})),s.download=`${this.layoutName||"layout"}.json`,s.click(),URL.revokeObjectURL(s.href),this.status=`Downloaded "${this.layoutName}.json".`}}async publishLayout(t){if(!this.stored[this.layoutName]){this.status="Save the layout first, then publish.";return}await this.hass.callWS({type:"pimoroni_unicorn/publish_layout",name:this.layoutName,published:t}),this.status=t?`Published "${this.layoutName}" to the marketplace.`:`Unpublished "${this.layoutName}".`,this.loadContent()}async saveScreenset(){if(!this.screenLayouts.length){this.status="Add at least one screen first.";return}let t=prompt("Name this screen set:");t&&(await this.hass.callWS({type:"pimoroni_unicorn/save_screenset",id:t,screenset:{label:t,layouts:this.screenLayouts,dwell:this.screenDwell,transition:this.screenTransition,triggers:[]}}),this.status=`Saved screen set "${t}".`,this.loadContent())}async installWidget(t){await this.hass.callWS({type:"pimoroni_unicorn/fw_install",entry_id:this.entryId,widget_id:t}),this.status=`Installing ${t}\u2026 device will reboot.`,setTimeout(()=>this.loadCatalog(),8e3)}async removeWidgetUnit(t){await this.hass.callWS({type:"pimoroni_unicorn/fw_remove",entry_id:this.entryId,widget_id:t}),this.status=`Removing ${t}\u2026 device will reboot.`,setTimeout(()=>this.loadCatalog(),8e3)}_thumb(t){return t?l`<img class="thumb" src="data:image/png;base64,${t}" />`:l`<div class="thumb"></div>`}_mhead(){return l`<div class="mhead"><span>Preview</span><span>Name</span><span>Dependencies</span><span>Status</span><span></span></div>`}_section(t,e,s,a){let r=this.sectionsOpen[t]!==!1;return l`<div class="section">
      <div class="shead" @click=${()=>{this.sectionsOpen={...this.sectionsOpen,[t]:!r}}}>
        <span class="chev ${r?"open":""}">▸</span>
        <span class="stitle">${e}</span>
        <span class="chip dim">${s}</span>
      </div>
      ${r?a:""}
    </div>`}_contentRow(t,e){return l`<div class="mrow">
      ${this._thumb(t.thumb)}
      <div class="cell-name">${t.label}
        ${t.compat?.length?l`<span class="hint">[${t.compat.join("/")}]</span>`:""}
        ${e==="screenset"?l`<span class="hint">${t.screens} page(s)</span>`:""}</div>
      <div class="hint">${t.requires?.length?l`<span title=${t.requires.join(", ")}>${t.requires.length} dep(s)</span>`:"\u2014"}</div>
      <div>${t.compatible?l`<span class="badge ok">compatible</span>`:l`<span class="badge warn">other model</span>`}</div>
      <div class="cell-action"><button ?disabled=${!this.entryId} title=${this.entryId?"":"Select a device to deploy"}
        @click=${()=>e==="layout"?this.deployLayout(t.id,t.compatible):this.deployScreenset(t.id,t.compatible)}>Deploy</button></div>
    </div>`}_marketplaceView(){let t=this.showAllContent,e=this.contentLayouts.filter(n=>t||n.compatible),s=this.contentScreensets.filter(n=>t||n.compatible),a={installed:"ok",outdated:"warn",not_installed:""},r={installed:"installed",outdated:"update available",not_installed:"not installed"};return l`
      <div class="bar">
        <label><input type="checkbox" .checked=${this.showAllContent}
          @change=${n=>{this.showAllContent=n.target.checked}} /> show all models</label>
        <span class="grow"></span>
        <button class="secondary" @click=${this.loadCatalog}>Refresh</button>
      </div>

      ${this._section("pages","Pages",e.length,e.length?l`<div class="mtable">${this._mhead()}${e.map(n=>this._contentRow(n,"layout"))}</div>`:l`<p class="hint">No published pages${t?"":" for this device"}. Publish one from the Designer tab.</p>`)}

      ${this._section("playlists","Playlists",s.length,s.length?l`<div class="mtable">${this._mhead()}${s.map(n=>this._contentRow(n,"screenset"))}</div>`:l`<p class="hint">No playlists${t?"":" for this device"}. Compose one on the Playlists tab.</p>`)}

      ${this._section("widgets","Widgets & fonts",this.catalog.length,this.entryId?l`<div class="mtable">${this._mhead()}
            ${this.catalog.map(n=>l`<div class="mrow">
              ${this._thumb(n.thumb)}
              <div class="cell-name">${n.label}</div>
              <div class="hint">${n.requires?.length?l`<span title=${n.requires.join(", ")}>${n.requires.length} dep(s)</span>`:"\u2014"}</div>
              <div><span class="badge ${a[n.status]??""}">${r[n.status]??n.status}</span></div>
              <div class="cell-action">${n.status==="installed"?l`<button class="danger" @click=${()=>this.removeWidgetUnit(n.id)}>Remove</button>`:l`<button @click=${()=>this.installWidget(n.id)}>${n.status==="outdated"?"Update":"Install"}</button>`}</div>
            </div>`)}
          </div>`:l`<p class="hint">Select a device to manage installed widgets.</p>`)}

      ${this._section("icons","Icons",this.installedIcons.length,l`
        <p class="hint">Built-in icons ship with the engine. Add LaMetric gallery icons by code, then choose which devices to install them on.</p>
        <div class="panelrow">
          ${this.iconCode?l`<img class="iconprev"
            src="https://developer.lametric.com/content/apps/icon_thumbs/${this.iconCode}" />`:l`<div class="iconprev"></div>`}
          <div class="grow">
            <div class="panelrow">
              <label>LaMetric code</label>
              <input type="number" style="width:100px" .value=${this.iconCode}
                @input=${n=>{this.iconCode=n.target.value}} />
              <label>Name</label>
              <input style="width:120px" .value=${this.iconName}
                @input=${n=>{this.iconName=n.target.value}} />
            </div>
            ${this.devices.length?l`<div class="panelrow">
              <label>Install on</label>
              <span class="targets">
                ${this.devices.map(n=>l`<label class="chk">
                  <input type="checkbox" ?checked=${this.iconTargetIds().includes(n.entry_id)}
                    @change=${()=>this.toggleIconTarget(n.entry_id)} />${n.name}</label>`)}
              </span>
            </div>`:""}
            <div class="panelrow">
              <button ?disabled=${!this.iconCode||!this.iconName.trim()||this.devices.length>0&&this.iconTargetIds().length===0}
                @click=${this.installIcon}>Add</button>
            </div>
          </div>
        </div>
        ${this.entryId?l`<p class="hint">On-device status is shown for the selected device. “Install” pushes a registry icon to just this device; “Remove” takes it off this device only. “Delete” removes it everywhere.</p>`:""}
        ${this.installedIcons.length?this.installedIcons.map(n=>{let c=this.deviceIcons.includes(n);return l`<div class="panelrow">
              ${this.iconThumbs[n]?l`<img class="iconthumb" src="data:image/png;base64,${this.iconThumbs[n]}" />`:l`<div class="iconthumb"></div>`}
              <span class="grow">${n}</span>
              ${this.entryId?c?l`<button class="zbtn" title="Remove from this device"
                      @click=${()=>this.removeIconFromDevice(n)}>On device ✓</button>`:l`<button class="zbtn" title="Install on this device"
                      @click=${()=>this.pushIconToDevice(n)}>Install</button>`:""}
              <button class="danger zbtn" title="Delete from all devices"
                @click=${()=>this.removeIcon(n)}>Delete</button></div>`}):l`<p class="hint">No custom icons installed yet.</p>`}
      `)}

      ${this._section("fonts","Fonts",this.fonts.length,l`
        <p class="hint">Type below to preview live in every font. Digit fonts (clock faces) show only numerals; alpha fonts cover A–Z. Fonts install automatically with any widget that needs them.</p>
        <div class="panelrow">
          <label>Preview text</label>
          <input style="width:220px" placeholder="type to preview…" .value=${this.fontText}
            @input=${n=>this.onFontInput(n.target.value)} />
        </div>
        ${this.fonts.map(n=>l`<div class="frow">
          <div class="fmeta"><span class="cell-name">${n.label}</span>
            <span class="hint">${n.kind==="digits"?"digits":"A\u2013Z 0\u20139"} · ${n.w}×${n.h}${n.builtin?" \xB7 built-in":""}</span></div>
          ${this.fontPngs[n.name]?l`<img class="fprev" src="data:image/png;base64,${this.fontPngs[n.name]}" />`:l`<div class="fprev"></div>`}
        </div>`)}
      `)}
      <p class="hint">Deploying a page installs any widgets/fonts it needs over the air first, then pushes it; the device reboots if files changed.</p>
    `}onSpecInput(t){this.specText=t,clearTimeout(this.specTimer),this.specTimer=window.setTimeout(()=>this.previewSpec(),400)}async previewSpec(){let t;try{t=JSON.parse(this.specText)}catch(e){this.specError=`JSON: ${e.message}`;return}try{let e=await this.hass.callWS({type:"pimoroni_unicorn/widget_preview",model:this.model,spec:t});this.playFrames("spec",e.frames??(e.png?[e.png]:[]),s=>{this.specPng=s}),this.specError=""}catch(e){this.specError=e?.message??String(e)}}async importSpec(t){try{let e=await this.hass.callWS({type:"pimoroni_unicorn/widget_import",text:t});this.specText=JSON.stringify(e.spec,null,2),this.specError="",this.previewSpec()}catch(e){this.specError=e?.message??String(e)}}async saveSpec(){let t;try{t=JSON.parse(this.specText)}catch(e){this.specError=`JSON: ${e.message}`;return}try{let e=await this.hass.callWS({type:"pimoroni_unicorn/widget_save",spec:t});this.specError="",this.status=`Saved custom widget "${e.id}". Install it from the Marketplace tab.`}catch(e){this.specError=e?.message??String(e)}}parsedSpec(){try{return JSON.parse(this.specText)}catch{return null}}writeSpec(t){this.specText=JSON.stringify(t,null,2),this.specError="",clearTimeout(this.specTimer),this.specTimer=window.setTimeout(()=>this.previewSpec(),120)}setSpecField(t,e){let s=this.parsedSpec();s&&(s[t]=e,this.writeSpec(s))}setOpField(t,e,s){let a=this.parsedSpec();!a||!Array.isArray(a.draw)||(a.draw[t]={...a.draw[t],[e]:s},this.writeSpec(a))}addOp(t){let e=this.parsedSpec()??{};e.draw=[...e.draw??[],{op:t,x:0,y:0}],this.writeSpec(e)}removeOp(t){let e=this.parsedSpec();!e||!Array.isArray(e.draw)||(e.draw.splice(t,1),this.writeSpec(e))}_opField(t,e,s,a){return a==="rgb"?l`<label>${s}</label>
      <input type="color" .value=${at(t[s])} @input=${r=>this.setOpField(e,s,rt(r.target.value))} />`:a==="num"?l`<label>${s}</label>
      <input type="number" style="width:54px" .value=${String(t[s]??0)} @change=${r=>this.setOpField(e,s,+r.target.value)} />`:a==="icon"?l`<label>${s}</label>
      <select @change=${r=>this.setOpField(e,s,r.target.value)}>
        ${this.iconNames.map(r=>l`<option ?selected=${t[s]===r}>${r}</option>`)}</select>`:l`<label>${s}</label>
      <input type="text" style="width:90px" .value=${String(t[s]??"")} @change=${r=>this.setOpField(e,s,r.target.value)} />`}_opEditor(t,e){return l`<div class="opcard">
      <div class="panelrow">
        <select @change=${s=>this.setOpField(e,"op",s.target.value)}>
          ${Tt.map(s=>l`<option ?selected=${s===t.op}>${s}</option>`)}</select>
        <label>x</label><input type="number" style="width:54px" .value=${String(t.x??0)} @change=${s=>this.setOpField(e,"x",+s.target.value)} />
        <label>y</label><input type="number" style="width:54px" .value=${String(t.y??0)} @change=${s=>this.setOpField(e,"y",+s.target.value)} />
        <span class="grow"></span>
        <button class="danger zbtn" @click=${()=>this.removeOp(e)}>✕</button>
      </div>
      <div class="panelrow">${(Kt[t.op]??[]).map(([s,a])=>this._opField(t,e,s,a))}</div>
    </div>`}_formView(){let t=this.parsedSpec();if(!t)return l`<p class="status err">Spec isn't valid JSON — switch to YAML / JSON to fix it.</p>`;let e=s=>l`<label>${s}</label><input type="number" style="width:60px" .value=${String(t[s]??"")} @change=${a=>this.setSpecField(s,+a.target.value)} />`;return l`
      <div class="panelrow">
        <label>ID</label><input style="width:120px" .value=${t.id??""} @change=${s=>this.setSpecField("id",s.target.value)} />
        <label>Label</label><input style="width:120px" .value=${t.label??""} @change=${s=>this.setSpecField("label",s.target.value)} />
      </div>
      <div class="panelrow">${e("w")}${e("h")}</div>
      <h3>Draw ops</h3>
      ${(t.draw??[]).map((s,a)=>this._opEditor(s,a))}
      <div class="panelrow"><label>Add op</label>
        <select @change=${s=>{let a=s.target.value;a&&(this.addOp(a),s.target.value="")}}>
          <option value="">add op…</option>${Tt.map(s=>l`<option>${s}</option>`)}</select></div>
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
    `}toggleScreen(t,e){this.screenLayouts=e?[...this.screenLayouts,t]:this.screenLayouts.filter(s=>s!==t),this.buildScreenPreview()}moveScreen(t,e){let s=[...this.screenLayouts],a=s.indexOf(t),r=a+e;a<0||r<0||r>=s.length||([s[a],s[r]]=[s[r],s[a]],this.screenLayouts=s,this.buildScreenPreview())}async buildScreenPreview(){clearInterval(this.screenTimer);let t={};for(let e of this.screenLayouts){let s=this.stored[e];if(s)try{let a=await this.hass.callWS({type:"pimoroni_unicorn/render",model:this.model,layout:s});t[e]=a.png}catch{}}this.screenPngs=t,this.screenIdx=0,this.screenOpacity=1,this.screenLayouts.length>1&&this.screenDwell>0&&(this.screenTimer=window.setInterval(()=>this._advancePreview(),this.screenDwell*1e3))}_advancePreview(){let t=(this.screenIdx+1)%this.screenLayouts.length;this.screenTransition==="fade"?(this.screenOpacity=0,setTimeout(()=>{this.screenIdx=t,this.screenOpacity=1},280)):this.screenIdx=t}async pushScreens(){!this.entryId||!this.screenLayouts.length||(await this.hass.callWS({type:"pimoroni_unicorn/push_screens",entry_id:this.entryId,layouts:this.screenLayouts,dwell:this.screenDwell,transition:this.screenTransition}),this.status=`Pushed ${this.screenLayouts.length} page(s) to device.`)}_screensView(){let t=Math.max(6,Math.floor(it/this.dims[0])),e=Object.keys(this.stored),s=this.screenLayouts[this.screenIdx],a=s?this.screenPngs[s]:"";return l`
      <div class="bar"><span class="hint">compose a playlist — pages cycle on a timer; preview on ${this.model}</span></div>
      <div class="wrap">
        <div class="col">
          <h3>Pages in this playlist</h3>
          <p class="hint">Tick pages to include, then order them with ▲ ▼.</p>
          ${e.length?e.map(r=>{let n=this.screenLayouts.includes(r),c=this.screenLayouts.indexOf(r);return l`<div class="panelrow">
              <input type="checkbox" ?checked=${n}
                @change=${u=>this.toggleScreen(r,u.target.checked)} />
              ${n?l`<span class="chip">${c+1}</span>`:""}
              <span class="grow">${r}</span>
              ${n?l`
                <button class="zbtn secondary" ?disabled=${c===0} @click=${()=>this.moveScreen(r,-1)} title="Move up">▲</button>
                <button class="zbtn secondary" ?disabled=${c===this.screenLayouts.length-1} @click=${()=>this.moveScreen(r,1)} title="Move down">▼</button>`:""}
            </div>`}):l`<p class="hint">No saved pages yet — create one on the Designer tab.</p>`}
          <div class="panelrow"><label>Dwell (s)
            <input type="number" style="width:60px" min="1" max="600" .value=${String(this.screenDwell)}
              @change=${r=>{this.screenDwell=+r.target.value,this.buildScreenPreview()}} /></label></div>
          <div class="panelrow"><label>Transition
            <select @change=${r=>{this.screenTransition=r.target.value,this.buildScreenPreview()}}>
              ${["none","fade"].map(r=>l`<option ?selected=${r===this.screenTransition}>${r}</option>`)}
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
          <div class="hint">${this.screenLayouts.length>1?`playing ${this.screenIdx+1}/${this.screenLayouts.length}: ${s??""}`:s??"tick pages to preview"}</div>
        </div>
      </div>
    `}};p([P({attribute:!1})],d.prototype,"hass",2),p([h()],d.prototype,"devices",2),p([h()],d.prototype,"entryId",2),p([h()],d.prototype,"model",2),p([h()],d.prototype,"layout",2),p([h()],d.prototype,"caps",2),p([h()],d.prototype,"overlayCaps",2),p([h()],d.prototype,"defaultLayout",2),p([h()],d.prototype,"stored",2),p([h()],d.prototype,"png",2),p([h()],d.prototype,"wboxes",2),p([h()],d.prototype,"dims",2),p([h()],d.prototype,"zoom",2),p([h()],d.prototype,"selected",2),p([h()],d.prototype,"dragIdx",2),p([h()],d.prototype,"layoutName",2),p([h()],d.prototype,"live",2),p([h()],d.prototype,"wireframe",2),p([h()],d.prototype,"locked",2),p([h()],d.prototype,"status",2),p([h()],d.prototype,"tab",2),p([h()],d.prototype,"catalog",2),p([h()],d.prototype,"fwManifest",2),p([h()],d.prototype,"contentLayouts",2),p([h()],d.prototype,"contentScreensets",2),p([h()],d.prototype,"showAllContent",2),p([h()],d.prototype,"iconNames",2),p([h()],d.prototype,"installedIcons",2),p([h()],d.prototype,"iconThumbs",2),p([h()],d.prototype,"deviceIcons",2),p([h()],d.prototype,"iconCode",2),p([h()],d.prototype,"iconName",2),p([h()],d.prototype,"iconTargets",2),p([h()],d.prototype,"fonts",2),p([h()],d.prototype,"fontText",2),p([h()],d.prototype,"fontPngs",2),p([h()],d.prototype,"dirty",2),p([h()],d.prototype,"sectionsOpen",2),p([h()],d.prototype,"screenLayouts",2),p([h()],d.prototype,"screenDwell",2),p([h()],d.prototype,"screenTransition",2),p([h()],d.prototype,"screenPngs",2),p([h()],d.prototype,"screenIdx",2),p([h()],d.prototype,"screenOpacity",2),p([h()],d.prototype,"specText",2),p([h()],d.prototype,"editMode",2),p([h()],d.prototype,"specPng",2),p([h()],d.prototype,"specError",2);customElements.get("pimoroni-unicorn-panel")||customElements.define("pimoroni-unicorn-panel",d);export{d as PimoroniUnicornPanel};
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
