var Et=Object.defineProperty;var St=Object.getOwnPropertyDescriptor;var g=(o,t,e,s)=>{for(var i=s>1?void 0:s?St(t,e):t,n=o.length-1,r;n>=0;n--)(r=o[n])&&(i=(s?r(t,e,i):r(i))||i);return s&&i&&Et(t,e,i),i};var D=globalThis,U=D.ShadowRoot&&(D.ShadyCSS===void 0||D.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,B=Symbol(),rt=new WeakMap,M=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==B)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(U&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=rt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&rt.set(e,t))}return t}toString(){return this.cssText}},ot=o=>new M(typeof o=="string"?o:o+"",void 0,B),V=(o,...t)=>{let e=o.length===1?o[0]:t.reduce((s,i,n)=>s+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+o[n+1],o[0]);return new M(e,o,B)},nt=(o,t)=>{if(U)o.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=D.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,o.appendChild(s)}},F=U?o=>o:o=>o instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return ot(e)})(o):o;var{is:Ct,defineProperty:Tt,getOwnPropertyDescriptor:Mt,getOwnPropertyNames:Lt,getOwnPropertySymbols:kt,getPrototypeOf:Nt}=Object,W=globalThis,at=W.trustedTypes,Ot=at?at.emptyScript:"",Rt=W.reactiveElementPolyfillSupport,L=(o,t)=>o,k={toAttribute(o,t){switch(t){case Boolean:o=o?Ot:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,t){let e=o;switch(t){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},I=(o,t)=>!Ct(o,t),lt={attribute:!0,type:String,converter:k,reflect:!1,useDefault:!1,hasChanged:I};Symbol.metadata??=Symbol("metadata"),W.litPropertyMetadata??=new WeakMap;var $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=lt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Tt(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:n}=Mt(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:i,set(r){let l=i?.call(this);n?.call(this,r),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??lt}static _$Ei(){if(this.hasOwnProperty(L("elementProperties")))return;let t=Nt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(L("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(L("properties"))){let e=this.properties,s=[...Lt(e),...kt(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(F(i))}else t!==void 0&&e.push(F(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return nt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:k).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),r=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:k;this._$Em=i;let l=r.fromAttribute(e,n.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){if(t!==void 0){let r=this.constructor;if(i===!1&&(n=this[t]),s??=r.getPropertyOptions(t),!((s.hasChanged??I)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),n!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,n]of s){let{wrapped:r}=n,l=this[i];r!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,n,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[L("elementProperties")]=new Map,$[L("finalized")]=new Map,Rt?.({ReactiveElement:$}),(W.reactiveElementVersions??=[]).push("2.1.2");var Q=globalThis,ht=o=>o,j=Q.trustedTypes,dt=j?j.createPolicy("lit-html",{createHTML:o=>o}):void 0,yt="$lit$",_=`lit$${Math.random().toFixed(9).slice(2)}$`,vt="?"+_,Ht=`<${vt}>`,E=document,O=()=>E.createComment(""),R=o=>o===null||typeof o!="object"&&typeof o!="function",tt=Array.isArray,Pt=o=>tt(o)||typeof o?.[Symbol.iterator]=="function",J=`[ 	
\f\r]`,N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ct=/-->/g,pt=/>/g,x=RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ut=/'/g,gt=/"/g,ft=/^(?:script|style|textarea|title)$/i,et=o=>(t,...e)=>({_$litType$:o,strings:t,values:e}),m=et(1),Yt=et(2),Gt=et(3),S=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),mt=new WeakMap,w=E.createTreeWalker(E,129);function $t(o,t){if(!tt(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return dt!==void 0?dt.createHTML(t):t}var Dt=(o,t)=>{let e=o.length-1,s=[],i,n=t===2?"<svg>":t===3?"<math>":"",r=N;for(let l=0;l<e;l++){let a=o[l],d,p,h=-1,v=0;for(;v<a.length&&(r.lastIndex=v,p=r.exec(a),p!==null);)v=r.lastIndex,r===N?p[1]==="!--"?r=ct:p[1]!==void 0?r=pt:p[2]!==void 0?(ft.test(p[2])&&(i=RegExp("</"+p[2],"g")),r=x):p[3]!==void 0&&(r=x):r===x?p[0]===">"?(r=i??N,h=-1):p[1]===void 0?h=-2:(h=r.lastIndex-p[2].length,d=p[1],r=p[3]===void 0?x:p[3]==='"'?gt:ut):r===gt||r===ut?r=x:r===ct||r===pt?r=N:(r=x,i=void 0);let f=r===x&&o[l+1].startsWith("/>")?" ":"";n+=r===N?a+Ht:h>=0?(s.push(d),a.slice(0,h)+yt+a.slice(h)+_+f):a+_+(h===-2?l:f)}return[$t(o,n+(o[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},H=class o{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,r=0,l=t.length-1,a=this.parts,[d,p]=Dt(t,e);if(this.el=o.createElement(d,s),w.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=w.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let h of i.getAttributeNames())if(h.endsWith(yt)){let v=p[r++],f=i.getAttribute(h).split(_),A=/([.?@])?(.*)/.exec(v);a.push({type:1,index:n,name:A[2],strings:f,ctor:A[1]==="."?X:A[1]==="?"?Y:A[1]==="@"?G:T}),i.removeAttribute(h)}else h.startsWith(_)&&(a.push({type:6,index:n}),i.removeAttribute(h));if(ft.test(i.tagName)){let h=i.textContent.split(_),v=h.length-1;if(v>0){i.textContent=j?j.emptyScript:"";for(let f=0;f<v;f++)i.append(h[f],O()),w.nextNode(),a.push({type:2,index:++n});i.append(h[v],O())}}}else if(i.nodeType===8)if(i.data===vt)a.push({type:2,index:n});else{let h=-1;for(;(h=i.data.indexOf(_,h+1))!==-1;)a.push({type:7,index:n}),h+=_.length-1}n++}}static createElement(t,e){let s=E.createElement("template");return s.innerHTML=t,s}};function C(o,t,e=o,s){if(t===S)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,n=R(t)?void 0:t._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(o),i._$AT(o,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=C(o,i._$AS(o,t.values),i,s)),t}var K=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??E).importNode(e,!0);w.currentNode=i;let n=w.nextNode(),r=0,l=0,a=s[0];for(;a!==void 0;){if(r===a.index){let d;a.type===2?d=new P(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Z(n,this,t)),this._$AV.push(d),a=s[++l]}r!==a?.index&&(n=w.nextNode(),r++)}return w.currentNode=E,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},P=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=C(this,t,e),R(t)?t===u||t==null||t===""?(this._$AH!==u&&this._$AR(),this._$AH=u):t!==this._$AH&&t!==S&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Pt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==u&&R(this._$AH)?this._$AA.nextSibling.data=t:this.T(E.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=H.createElement($t(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let n=new K(i,this),r=n.u(this.options);n.p(e),this.T(r),this._$AH=n}}_$AC(t){let e=mt.get(t.strings);return e===void 0&&mt.set(t.strings,e=new H(t)),e}k(t){tt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let n of t)i===e.length?e.push(s=new o(this.O(O()),this.O(O()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=ht(t).nextSibling;ht(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},T=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=u,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=u}_$AI(t,e=this,s,i){let n=this.strings,r=!1;if(n===void 0)t=C(this,t,e,0),r=!R(t)||t!==this._$AH&&t!==S,r&&(this._$AH=t);else{let l=t,a,d;for(t=n[0],a=0;a<n.length-1;a++)d=C(this,l[s+a],e,a),d===S&&(d=this._$AH[a]),r||=!R(d)||d!==this._$AH[a],d===u?t=u:t!==u&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}r&&!i&&this.j(t)}j(t){t===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},X=class extends T{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===u?void 0:t}},Y=class extends T{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==u)}},G=class extends T{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=C(this,t,e,0)??u)===S)return;let s=this._$AH,i=t===u&&s!==u||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==u&&(s===u||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Z=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){C(this,t)}};var Ut=Q.litHtmlPolyfillSupport;Ut?.(H,P),(Q.litHtmlVersions??=[]).push("3.3.3");var _t=(o,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let n=e?.renderBefore??null;s._$litPart$=i=new P(t.insertBefore(O(),n),n,void 0,e??{})}return i._$AI(o),i};var st=globalThis,b=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=_t(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return S}};b._$litElement$=!0,b.finalized=!0,st.litElementHydrateSupport?.({LitElement:b});var Wt=st.litElementPolyfillSupport;Wt?.({LitElement:b});(st.litElementVersions??=[]).push("4.2.2");var bt=o=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(o,t)}):customElements.define(o,t)};var It={attribute:!0,type:String,converter:k,reflect:!1,hasChanged:I},jt=(o=It,t,e)=>{let{kind:s,metadata:i}=e,n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),s==="setter"&&((o=Object.create(o)).wrapped=!0),n.set(e.name,o),s==="accessor"){let{name:r}=e;return{set(l){let a=t.get.call(this);t.set.call(this,l),this.requestUpdate(r,a,o,!0,l)},init(l){return l!==void 0&&this.C(r,void 0,o,l),l}}}if(s==="setter"){let{name:r}=e;return function(l){let a=this[r];t.call(this,l),this.requestUpdate(r,a,o,!0,l)}}throw Error("Unsupported decorator location: "+s)};function q(o){return(t,e)=>typeof e=="object"?jt(o,t,e):((s,i,n)=>{let r=i.hasOwnProperty(n);return i.constructor.createProperty(n,s),r?Object.getOwnPropertyDescriptor(i,n):void 0})(o,t,e)}function y(o){return q({...o,state:!0,attribute:!1})}var qt=560,At="\u2014 new \u2014",zt=o=>{let[t,e,s]=o??[0,0,0];return"#"+[t,e,s].map(i=>Math.max(0,Math.min(255,i|0)).toString(16).padStart(2,"0")).join("")},Bt=o=>[1,3,5].map(t=>parseInt(o.substr(t,2),16)),c=class extends b{constructor(){super(...arguments);this.devices=[];this.entryId="";this.model="galactic";this.layout={widgets:[]};this.caps=[];this.overlayCaps=[];this.defaultLayout={widgets:[]};this.stored={};this.png="";this.dims=[53,11];this.selected=-1;this.layoutName="default";this.live=!1;this.status=""}firstUpdated(){this.loadDevices()}async loadDevices(){let e=await this.hass.callWS({type:"pimoroni_unicorn/devices"});this.devices=e.devices??[],this.devices.length&&!this.entryId&&await this.selectDevice(this.devices[0].entry_id)}async selectDevice(e){let s=this.devices.find(r=>r.entry_id===e);if(!s)return;this.entryId=e,this.model=s.model;let i=await this.hass.callWS({type:"pimoroni_unicorn/capabilities",entry_id:e});this.caps=i.widgets??[],this.overlayCaps=i.overlays??[],this.defaultLayout=i.default_layout,await this.refreshStored();let n=s.active_layout?this.stored[s.active_layout]:void 0;this.loadLayout(n??this.defaultLayout)}async refreshStored(){let e=await this.hass.callWS({type:"pimoroni_unicorn/layouts"});this.stored=e.layouts??{}}loadLayout(e){this.layout=JSON.parse(JSON.stringify(e)),this.layoutName=this.layout.name??"default",this.selected=-1,this.renderPreview()}async renderPreview(){let e=await this.hass.callWS({type:"pimoroni_unicorn/render",model:this.model,layout:this.layout});this.png=e.png}edited(){this.requestUpdate(),this.renderTimer&&clearTimeout(this.renderTimer),this.renderTimer=window.setTimeout(()=>this.renderPreview(),80),this.live&&(this.pushTimer&&clearTimeout(this.pushTimer),this.pushTimer=window.setTimeout(()=>this.pushLive(),250))}async pushLive(){this.entryId&&await this.hass.callWS({type:"pimoroni_unicorn/push_layout",entry_id:this.entryId,layout:this.layout})}capFor(e){return this.caps.find(s=>s.id===e)}get scale(){return Math.max(4,Math.floor(qt/this.dims[0]))}cfgVal(e,s){let i=this.capFor(e.id);return e.cfg?.[s]??i?.default_cfg[s]}setCfg(e,s,i){e.cfg={...e.cfg??{},[s]:i},this.edited()}onImgLoad(e){let s=e.target;this.dims=[s.naturalWidth,s.naturalHeight]}startDrag(e,s){s.preventDefault(),this.selected=e;let i=this.layout.widgets[e],n=this.capFor(i.id);if(!n)return;let r=this.layout.grid??2,[l,a]=this.dims,d=s.clientX,p=s.clientY,h=i.x,v=i.y;s.target.setPointerCapture(s.pointerId);let f=it=>{let xt=Math.round((it.clientX-d)/this.scale/r)*r,wt=Math.round((it.clientY-p)/this.scale/r)*r;i.x=Math.max(0,Math.min(l-n.w,h+xt)),i.y=Math.max(0,Math.min(a-n.h,v+wt)),this.edited()},A=()=>{window.removeEventListener("pointermove",f),window.removeEventListener("pointerup",A),this.renderPreview()};window.addEventListener("pointermove",f),window.addEventListener("pointerup",A)}addWidget(e){e&&(this.layout.widgets.push({id:e,x:0,y:0,cfg:{}}),this.selected=this.layout.widgets.length-1,this.edited())}removeWidget(e){this.layout.widgets.splice(e,1),this.selected=-1,this.edited()}toggleOverlay(e,s){let i=new Set(this.layout.overlays??[]);s?i.add(e):i.delete(e),this.layout.overlays=[...i],this.edited()}async save(){this.entryId&&(this.layout.name=this.layoutName,await this.hass.callWS({type:"pimoroni_unicorn/save_layout",entry_id:this.entryId,name:this.layoutName,layout:this.layout}),await this.refreshStored(),this.status=`Saved "${this.layoutName}" and pushed to device.`)}async deleteLayout(){this.stored[this.layoutName]&&(await this.hass.callWS({type:"pimoroni_unicorn/delete_layout",name:this.layoutName}),await this.refreshStored(),this.status=`Deleted "${this.layoutName}".`,this.loadLayout(this.defaultLayout))}renderWidgetEditor(){let e=this.layout.widgets[this.selected];if(!e)return m`<p class="hint">Select a widget to edit.</p>`;let s=this.capFor(e.id);return s?m`
      <h3>${s.label}</h3>
      <div class="panelrow"><label>X</label>${e.x} <label>Y</label>${e.y}</div>
      ${s.cfg_fields.map(i=>i.type==="select"?m`<div class="panelrow"><label>${i.label??i.key}</label>
            <select @change=${n=>this.setCfg(e,i.key,n.target.value)}>
              ${(i.options??[]).map(n=>m`<option ?selected=${this.cfgVal(e,i.key)===n}>${n}</option>`)}
            </select></div>`:m`<div class="panelrow"><label>${i.label??i.key}</label>
          <input type="color" .value=${zt(this.cfgVal(e,i.key))}
            @input=${n=>this.setCfg(e,i.key,Bt(n.target.value))} /></div>`)}
      <div class="panelrow"><button class="danger" @click=${()=>this.removeWidget(this.selected)}>Remove widget</button></div>
    `:""}render(){if(!this.devices.length)return m`<p class="hint">No Pimoroni Unicorn devices configured.</p>`;let e=this.scale,s=new Set(this.layout.widgets.map(r=>r.id)),i=this.caps.filter(r=>!s.has(r.id)),n=new Set(this.layout.overlays??[]);return m`
      <div class="bar">
        <label>Device
          <select @change=${r=>this.selectDevice(r.target.value)}>
            ${this.devices.map(r=>m`<option value=${r.entry_id} ?selected=${r.entry_id===this.entryId}>${r.name} (${r.model})</option>`)}
          </select>
        </label>
        <label>Layout
          <select @change=${r=>{let l=r.target.value;this.loadLayout(l===At?this.defaultLayout:this.stored[l])}}>
            ${Object.keys(this.stored).map(r=>m`<option ?selected=${r===this.layoutName}>${r}</option>`)}
            <option>${At}</option>
          </select>
        </label>
        <label>Name <input .value=${this.layoutName} @input=${r=>this.layoutName=r.target.value} /></label>
        <button @click=${this.save}>Save &amp; Push</button>
        ${this.stored[this.layoutName]?m`<button class="danger" @click=${this.deleteLayout}>Delete</button>`:""}
        <label><input type="checkbox" .checked=${this.live} @change=${r=>this.live=r.target.checked} /> live push</label>
      </div>

      <div class="wrap">
        <div class="col">
          <div class="stage" style=${`width:${this.dims[0]*e}px;height:${this.dims[1]*e}px`}>
            ${this.png?m`<img src="data:image/png;base64,${this.png}" width=${this.dims[0]*e} height=${this.dims[1]*e} @load=${this.onImgLoad} />`:""}
            ${this.layout.widgets.map((r,l)=>{let a=this.capFor(r.id);return!a||r.enabled===!1?"":m`<div class="box ${l===this.selected?"sel":""}"
                style=${`left:${r.x*e}px;top:${r.y*e}px;width:${a.w*e}px;height:${a.h*e}px`}
                @pointerdown=${d=>this.startDrag(l,d)}>
                <span class="tag">${r.id}</span></div>`})}
          </div>
          <div class="status">${this.status}</div>
        </div>

        <div class="col">
          <h3>Widgets</h3>
          <ul class="wlist">
            ${this.layout.widgets.map((r,l)=>m`
              <li class="${l===this.selected?"sel":""}" @click=${()=>this.selected=l}>
                <input type="checkbox" .checked=${r.enabled!==!1}
                  @click=${a=>{a.stopPropagation(),r.enabled=a.target.checked,this.edited()}} />
                <span class="grow">${this.capFor(r.id)?.label??r.id}</span>
              </li>`)}
          </ul>
          ${i.length?m`<div class="panelrow">
            <select id="addsel"><option value="">add widget…</option>${i.map(r=>m`<option value=${r.id}>${r.label}</option>`)}</select>
            <button class="secondary" @click=${()=>{let r=this.renderRoot.querySelector("#addsel");this.addWidget(r.value),r.value=""}}>Add</button>
          </div>`:""}
          <h3>Overlays</h3>
          ${this.overlayCaps.map(r=>m`<div class="panelrow"><label>
            <input type="checkbox" .checked=${n.has(r.id)} @change=${l=>this.toggleOverlay(r.id,l.target.checked)} /> ${r.label}</label></div>`)}
          <h3>Selected</h3>
          ${this.renderWidgetEditor()}
        </div>
      </div>
    `}};c.styles=V`
    :host { display: block; padding: 16px; color: var(--primary-text-color, #111); }
    .wrap { display: flex; gap: 24px; flex-wrap: wrap; align-items: flex-start; }
    .col { min-width: 280px; }
    .bar { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 16px; }
    select, input, button { font: inherit; padding: 6px 8px; border-radius: 6px;
      border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #111); }
    input[type="color"] { padding: 0; width: 34px; height: 28px; }
    button { cursor: pointer; background: var(--primary-color, #03a9f4); color: #fff; border: none; }
    button.secondary { background: var(--secondary-background-color, #e0e0e0); color: var(--primary-text-color, #111); }
    button.danger { background: var(--error-color, #db4437); }
    .stage { position: relative; display: inline-block; background: #000; line-height: 0; border: 1px solid var(--divider-color, #444); }
    .stage img { image-rendering: pixelated; display: block; }
    .box { position: absolute; box-sizing: border-box; border: 1px solid rgba(255,255,255,.5); cursor: grab; touch-action: none; }
    .box.sel { border: 2px solid var(--primary-color, #03a9f4); background: rgba(3,169,244,.12); }
    .box .tag { position: absolute; top: -16px; left: 0; font: 11px monospace; color: #ccc; white-space: nowrap; }
    .wlist { list-style: none; padding: 0; margin: 0 0 12px; }
    .wlist li { display: flex; gap: 8px; align-items: center; padding: 6px 8px; border-radius: 6px; cursor: pointer; }
    .wlist li.sel { background: var(--secondary-background-color, #eef); }
    .wlist li .grow { flex: 1; }
    .panelrow { display: flex; gap: 8px; align-items: center; margin: 6px 0; flex-wrap: wrap; }
    .panelrow label { font-size: 13px; min-width: 64px; }
    h3 { margin: 4px 0 8px; }
    .status { margin-top: 12px; font: 13px monospace; color: var(--secondary-text-color, #888); min-height: 18px; }
    .hint { color: var(--secondary-text-color, #888); font-size: 13px; }
  `,g([q({attribute:!1})],c.prototype,"hass",2),g([y()],c.prototype,"devices",2),g([y()],c.prototype,"entryId",2),g([y()],c.prototype,"model",2),g([y()],c.prototype,"layout",2),g([y()],c.prototype,"caps",2),g([y()],c.prototype,"overlayCaps",2),g([y()],c.prototype,"defaultLayout",2),g([y()],c.prototype,"stored",2),g([y()],c.prototype,"png",2),g([y()],c.prototype,"dims",2),g([y()],c.prototype,"selected",2),g([y()],c.prototype,"layoutName",2),g([y()],c.prototype,"live",2),g([y()],c.prototype,"status",2),c=g([bt("pimoroni-unicorn-panel")],c);export{c as PimoroniUnicornPanel};
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
