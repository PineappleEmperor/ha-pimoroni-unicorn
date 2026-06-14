var Ct=Object.defineProperty;var kt=Object.getOwnPropertyDescriptor;var m=(o,t,e,s)=>{for(var i=s>1?void 0:s?kt(t,e):t,n=o.length-1,a;n>=0;n--)(a=o[n])&&(i=(s?a(t,e,i):a(i))||i);return s&&i&&Ct(t,e,i),i};var D=globalThis,z=D.ShadowRoot&&(D.ShadyCSS===void 0||D.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,X=Symbol(),at=new WeakMap,L=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==X)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(z&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=at.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&at.set(e,t))}return t}toString(){return this.cssText}},lt=o=>new L(typeof o=="string"?o:o+"",void 0,X),K=(o,...t)=>{let e=o.length===1?o[0]:t.reduce((s,i,n)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+o[n+1],o[0]);return new L(e,o,X)},ht=(o,t)=>{if(z)o.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=D.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,o.appendChild(s)}},Y=z?o=>o:o=>o instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return lt(e)})(o):o;var{is:Lt,defineProperty:Tt,getOwnPropertyDescriptor:Ht,getOwnPropertyNames:Ot,getOwnPropertySymbols:Rt,getPrototypeOf:Nt}=Object,U=globalThis,dt=U.trustedTypes,It=dt?dt.emptyScript:"",Pt=U.reactiveElementPolyfillSupport,T=(o,t)=>o,H={toAttribute(o,t){switch(t){case Boolean:o=o?It:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,t){let e=o;switch(t){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},j=(o,t)=>!Lt(o,t),ct={attribute:!0,type:String,converter:H,reflect:!1,useDefault:!1,hasChanged:j};Symbol.metadata??=Symbol("metadata"),U.litPropertyMetadata??=new WeakMap;var _=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ct){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Tt(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:n}=Ht(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get:i,set(a){let r=i?.call(this);n?.call(this,a),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ct}static _$Ei(){if(this.hasOwnProperty(T("elementProperties")))return;let t=Nt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(T("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(T("properties"))){let e=this.properties,s=[...Ot(e),...Rt(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(Y(i))}else t!==void 0&&e.push(Y(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ht(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:H).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),a=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:H;this._$Em=i;let r=a.fromAttribute(e,n.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){if(t!==void 0){let a=this.constructor;if(i===!1&&(n=this[t]),s??=a.getPropertyOptions(t),!((s.hasChanged??j)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},a){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),n!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,n]of s){let{wrapped:a}=n,r=this[i];a!==!0||this._$AL.has(i)||r===void 0||this.C(i,void 0,n,r)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[T("elementProperties")]=new Map,_[T("finalized")]=new Map,Pt?.({ReactiveElement:_}),(U.reactiveElementVersions??=[]).push("2.1.2");var st=globalThis,pt=o=>o,q=st.trustedTypes,ut=q?q.createPolicy("lit-html",{createHTML:o=>o}):void 0,ft="$lit$",b=`lit$${Math.random().toFixed(9).slice(2)}$`,_t="?"+b,Wt=`<${_t}>`,E=document,R=()=>E.createComment(""),N=o=>o===null||typeof o!="object"&&typeof o!="function",it=Array.isArray,Dt=o=>it(o)||typeof o?.[Symbol.iterator]=="function",J=`[ 	
\f\r]`,O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,mt=/-->/g,gt=/>/g,S=RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),vt=/'/g,yt=/"/g,bt=/^(?:script|style|textarea|title)$/i,rt=o=>(t,...e)=>({_$litType$:o,strings:t,values:e}),c=rt(1),Qt=rt(2),te=rt(3),A=Symbol.for("lit-noChange"),g=Symbol.for("lit-nothing"),$t=new WeakMap,w=E.createTreeWalker(E,129);function xt(o,t){if(!it(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return ut!==void 0?ut.createHTML(t):t}var zt=(o,t)=>{let e=o.length-1,s=[],i,n=t===2?"<svg>":t===3?"<math>":"",a=O;for(let r=0;r<e;r++){let l=o[r],h,u,d=-1,y=0;for(;y<l.length&&(a.lastIndex=y,u=a.exec(l),u!==null);)y=a.lastIndex,a===O?u[1]==="!--"?a=mt:u[1]!==void 0?a=gt:u[2]!==void 0?(bt.test(u[2])&&(i=RegExp("</"+u[2],"g")),a=S):u[3]!==void 0&&(a=S):a===S?u[0]===">"?(a=i??O,d=-1):u[1]===void 0?d=-2:(d=a.lastIndex-u[2].length,h=u[1],a=u[3]===void 0?S:u[3]==='"'?yt:vt):a===yt||a===vt?a=S:a===mt||a===gt?a=O:(a=S,i=void 0);let $=a===S&&o[r+1].startsWith("/>")?" ":"";n+=a===O?l+Wt:d>=0?(s.push(h),l.slice(0,d)+ft+l.slice(d)+b+$):l+b+(d===-2?r:$)}return[xt(o,n+(o[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},I=class o{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,a=0,r=t.length-1,l=this.parts,[h,u]=zt(t,e);if(this.el=o.createElement(h,s),w.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=w.nextNode())!==null&&l.length<r;){if(i.nodeType===1){if(i.hasAttributes())for(let d of i.getAttributeNames())if(d.endsWith(ft)){let y=u[a++],$=i.getAttribute(d).split(b),f=/([.?@])?(.*)/.exec(y);l.push({type:1,index:n,name:f[2],strings:$,ctor:f[1]==="."?Z:f[1]==="?"?Q:f[1]==="@"?tt:C}),i.removeAttribute(d)}else d.startsWith(b)&&(l.push({type:6,index:n}),i.removeAttribute(d));if(bt.test(i.tagName)){let d=i.textContent.split(b),y=d.length-1;if(y>0){i.textContent=q?q.emptyScript:"";for(let $=0;$<y;$++)i.append(d[$],R()),w.nextNode(),l.push({type:2,index:++n});i.append(d[y],R())}}}else if(i.nodeType===8)if(i.data===_t)l.push({type:2,index:n});else{let d=-1;for(;(d=i.data.indexOf(b,d+1))!==-1;)l.push({type:7,index:n}),d+=b.length-1}n++}}static createElement(t,e){let s=E.createElement("template");return s.innerHTML=t,s}};function M(o,t,e=o,s){if(t===A)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,n=N(t)?void 0:t._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(o),i._$AT(o,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=M(o,i._$AS(o,t.values),i,s)),t}var G=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??E).importNode(e,!0);w.currentNode=i;let n=w.nextNode(),a=0,r=0,l=s[0];for(;l!==void 0;){if(a===l.index){let h;l.type===2?h=new P(n,n.nextSibling,this,t):l.type===1?h=new l.ctor(n,l.name,l.strings,this,t):l.type===6&&(h=new et(n,this,t)),this._$AV.push(h),l=s[++r]}a!==l?.index&&(n=w.nextNode(),a++)}return w.currentNode=E,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},P=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=g,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=M(this,t,e),N(t)?t===g||t==null||t===""?(this._$AH!==g&&this._$AR(),this._$AH=g):t!==this._$AH&&t!==A&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Dt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==g&&N(this._$AH)?this._$AA.nextSibling.data=t:this.T(E.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=I.createElement(xt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let n=new G(i,this),a=n.u(this.options);n.p(e),this.T(a),this._$AH=n}}_$AC(t){let e=$t.get(t.strings);return e===void 0&&$t.set(t.strings,e=new I(t)),e}k(t){it(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let n of t)i===e.length?e.push(s=new o(this.O(R()),this.O(R()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=pt(t).nextSibling;pt(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},C=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=g,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=g}_$AI(t,e=this,s,i){let n=this.strings,a=!1;if(n===void 0)t=M(this,t,e,0),a=!N(t)||t!==this._$AH&&t!==A,a&&(this._$AH=t);else{let r=t,l,h;for(t=n[0],l=0;l<n.length-1;l++)h=M(this,r[s+l],e,l),h===A&&(h=this._$AH[l]),a||=!N(h)||h!==this._$AH[l],h===g?t=g:t!==g&&(t+=(h??"")+n[l+1]),this._$AH[l]=h}a&&!i&&this.j(t)}j(t){t===g?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Z=class extends C{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===g?void 0:t}},Q=class extends C{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==g)}},tt=class extends C{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=M(this,t,e,0)??g)===A)return;let s=this._$AH,i=t===g&&s!==g||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==g&&(s===g||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},et=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t)}};var Ut=st.litHtmlPolyfillSupport;Ut?.(I,P),(st.litHtmlVersions??=[]).push("3.3.3");var St=(o,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let n=e?.renderBefore??null;s._$litPart$=i=new P(t.insertBefore(R(),n),n,void 0,e??{})}return i._$AI(o),i};var ot=globalThis,x=class extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=St(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return A}};x._$litElement$=!0,x.finalized=!0,ot.litElementHydrateSupport?.({LitElement:x});var jt=ot.litElementPolyfillSupport;jt?.({LitElement:x});(ot.litElementVersions??=[]).push("4.2.2");var wt=o=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(o,t)}):customElements.define(o,t)};var qt={attribute:!0,type:String,converter:H,reflect:!1,hasChanged:j},Vt=(o=qt,t,e)=>{let{kind:s,metadata:i}=e,n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),s==="setter"&&((o=Object.create(o)).wrapped=!0),n.set(e.name,o),s==="accessor"){let{name:a}=e;return{set(r){let l=t.get.call(this);t.set.call(this,r),this.requestUpdate(a,l,o,!0,r)},init(r){return r!==void 0&&this.C(a,void 0,o,r),r}}}if(s==="setter"){let{name:a}=e;return function(r){let l=this[a];t.call(this,r),this.requestUpdate(a,l,o,!0,r)}}throw Error("Unsupported decorator location: "+s)};function V(o){return(t,e)=>typeof e=="object"?Vt(o,t,e):((s,i,n)=>{let a=i.hasOwnProperty(n);return i.constructor.createProperty(n,s),a?Object.getOwnPropertyDescriptor(i,n):void 0})(o,t,e)}function v(o){return V({...o,state:!0,attribute:!1})}var Bt=560,Et={galactic:[53,11],cosmic:[32,32],stellar:[16,16]},At="__mock__",Ft=o=>{let[t,e,s]=o??[0,0,0];return"#"+[t,e,s].map(i=>Math.max(0,Math.min(255,i|0)).toString(16).padStart(2,"0")).join("")},nt=o=>{let t=(o||"").replace("#","");return[0,2,4].map(e=>parseInt(t.substr(e,2),16)||0)},Xt=()=>[{id:"demo_a",entity_id:"",name:"Sensor A",on_color:"#8cc050",off_color:"#233014",x_pos:0,y_pos:0},{id:"demo_b",entity_id:"",name:"Sensor B",on_color:"#f7be12",off_color:"#3e3005",x_pos:3,y_pos:0}],p=class extends x{constructor(){super(...arguments);this.devices=[];this.entryId="";this.model="galactic";this.layout={widgets:[]};this.caps=[];this.overlayCaps=[];this.defaultLayout={widgets:[]};this.stored={};this.png="";this.dims=[53,11];this.selected=-1;this.sensors=[];this.selSensor=-1;this.layoutName="default";this.live=!1;this.wireframe=!0;this.status=""}firstUpdated(){this.loadDevices()}async loadDevices(){let e=await this.hass.callWS({type:"pimoroni_unicorn/devices"});this.devices=e.devices??[],this.devices.length?await this.selectDevice(this.devices[0].entry_id):await this.selectMock(this.model)}async loadCaps(e){let s=await this.hass.callWS({type:"pimoroni_unicorn/capabilities",...e});this.caps=s.widgets??[],this.overlayCaps=s.overlays??[],this.defaultLayout=s.default_layout,this.model=s.model,this.dims=Et[this.model]??[53,11],await this.refreshStored()}async selectDevice(e){let s=this.devices.find(a=>a.entry_id===e);if(!s)return;this.entryId=e,await this.loadCaps({entry_id:e});let i=await this.hass.callWS({type:"pimoroni_unicorn/display_sensors",entry_id:e});this.sensors=(i.sensors??[]).map(a=>({...a,on_color:a.on_color?.startsWith("#")?a.on_color:"#"+(a.on_color||"00ff00"),off_color:a.off_color?.startsWith("#")?a.off_color:"#"+(a.off_color||"1a1a1a")})),this.selSensor=-1;let n=s.active_layout?this.stored[s.active_layout]:void 0;this.loadLayout(n??this.defaultLayout)}async selectMock(e){this.entryId="",this.sensors=Xt(),this.selSensor=-1,await this.loadCaps({model:e}),this.loadLayout(this.defaultLayout)}renderSensors(){return this.sensors.map(e=>({x:e.x_pos,y:e.y_pos,size:e.size??2,on_rgb:nt(e.on_color),off_rgb:nt(e.off_color),state:e.entity_id?this.hass?.states?.[e.entity_id]?.state==="on":!0}))}async refreshStored(){let e=await this.hass.callWS({type:"pimoroni_unicorn/layouts"});this.stored=e.layouts??{}}loadLayout(e){this.layout=JSON.parse(JSON.stringify(e)),this.layoutName=this.layout.name??"default",this.selected=-1,this.renderPreview()}async renderPreview(){try{let e=await this.hass.callWS({type:"pimoroni_unicorn/render",model:this.model,layout:this.layout,sensors:this.renderSensors()});this.png=e.png,this.status.startsWith("Render failed")&&(this.status="")}catch(e){this.png="",this.status=`Render failed: ${e?.message??e}`}}edited(){this.requestUpdate(),this.renderTimer&&clearTimeout(this.renderTimer),this.renderTimer=window.setTimeout(()=>this.renderPreview(),80),this.live&&this.entryId&&(this.pushTimer&&clearTimeout(this.pushTimer),this.pushTimer=window.setTimeout(()=>this.pushLive(),250))}async pushLive(){await this.hass.callWS({type:"pimoroni_unicorn/push_layout",entry_id:this.entryId,layout:this.layout})}capFor(e){return this.caps.find(s=>s.id===e)}get scale(){return Math.max(4,Math.floor(Bt/this.dims[0]))}boxDims(e){let s=this.capFor(e.id);if(!s)return[0,0];let i=this.cfgVal(e,"size");if(typeof i=="number")return[i,i];let n=this.cfgVal(e,"variant");return s.sizes?.[n]??[s.w,s.h]}cfgVal(e,s){return e.cfg?.[s]??this.capFor(e.id)?.default_cfg[s]}setCfg(e,s,i){e.cfg={...e.cfg??{},[s]:i},this.edited()}setPos(e,s,i){let[n,a]=this.boxDims(e),[r,l]=this.dims,h=Math.round(i);s==="x"?e.x=Math.max(1-n,Math.min(r-1,h)):e.y=Math.max(1-a,Math.min(l-1,h)),this.edited()}onImgLoad(e){let s=e.target;this.dims=[s.naturalWidth,s.naturalHeight]}startDrag(e,s){s.preventDefault(),this.selected=e;let i=this.layout.widgets[e],[n,a]=this.boxDims(i),r=this.layout.grid??2,[l,h]=this.dims,u=s.clientX,d=s.clientY,y=i.x,$=i.y;s.target.setPointerCapture(s.pointerId);let f=W=>{let F=Math.round((W.clientX-u)/this.scale/r)*r,Mt=Math.round((W.clientY-d)/this.scale/r)*r;i.x=Math.max(1-n,Math.min(l-1,y+F)),i.y=Math.max(1-a,Math.min(h-1,$+Mt)),this.edited()},k=()=>{window.removeEventListener("pointermove",f),window.removeEventListener("pointerup",k),this.renderPreview()};window.addEventListener("pointermove",f),window.addEventListener("pointerup",k)}addWidget(e){e&&(this.layout.widgets.push({id:e,x:0,y:0,cfg:{}}),this.selected=this.layout.widgets.length-1,this.edited())}removeWidget(e){this.layout.widgets.splice(e,1),this.selected=-1,this.edited()}startSensorDrag(e,s){s.preventDefault(),this.selSensor=e,this.selected=-1;let i=this.sensors[e],n=this.layout.grid??1,[a,r]=this.dims,l=i.size??2,h=s.clientX,u=s.clientY,d=i.x_pos,y=i.y_pos;s.target.setPointerCapture(s.pointerId);let $=k=>{let W=Math.round((k.clientX-h)/this.scale/n)*n,F=Math.round((k.clientY-u)/this.scale/n)*n;i.x_pos=Math.max(0,Math.min(a-l,d+W)),i.y_pos=Math.max(0,Math.min(r-l,y+F)),this.edited()},f=()=>{window.removeEventListener("pointermove",$),window.removeEventListener("pointerup",f),this.renderPreview()};window.addEventListener("pointermove",$),window.addEventListener("pointerup",f)}addSensor(){this.sensors.push({id:`sensor_${this.sensors.length+1}`,entity_id:"",name:"Sensor",on_color:"#00ff00",off_color:"#1a1a1a",x_pos:0,y_pos:0,size:2}),this.selSensor=this.sensors.length-1,this.edited()}removeSensor(e){this.sensors.splice(e,1),this.selSensor=-1,this.edited()}setSensor(e,s,i){this.sensors[e][s]=i,this.edited()}async saveSensors(){this.entryId&&(await this.hass.callWS({type:"pimoroni_unicorn/set_display_sensors",entry_id:this.entryId,sensors:this.sensors}),this.status="Saved sensors to device.")}entityOptions(){let e=this.hass?.states??{};return Object.keys(e).filter(s=>/^(binary_sensor|sensor|light|switch|input_boolean)\./.test(s)).sort()}toggleOverlay(e,s){let i=new Set(this.layout.overlays??[]);s?i.add(e):i.delete(e),this.layout.overlays=[...i],this.edited()}async save(){this.entryId&&(this.layout.name=this.layoutName,await this.hass.callWS({type:"pimoroni_unicorn/save_layout",entry_id:this.entryId,name:this.layoutName,layout:this.layout}),await this.refreshStored(),this.status=`Saved "${this.layoutName}" and pushed to device.`)}async deleteLayout(){this.stored[this.layoutName]&&(await this.hass.callWS({type:"pimoroni_unicorn/delete_layout",name:this.layoutName}),await this.refreshStored(),this.status=`Deleted "${this.layoutName}".`,this.loadLayout(this.defaultLayout))}renderWidgetEditor(){let e=this.layout.widgets[this.selected];if(!e)return c`<p class="hint">Select a widget to edit.</p>`;let s=this.capFor(e.id);return s?c`
      <h3>${s.label}</h3>
      <div class="panelrow">
        <label>X</label><input type="number" style="width:60px" .value=${String(e.x)}
          @change=${i=>this.setPos(e,"x",+i.target.value)} />
        <label>Y</label><input type="number" style="width:60px" .value=${String(e.y)}
          @change=${i=>this.setPos(e,"y",+i.target.value)} />
      </div>
      ${s.cfg_fields.map(i=>i.type==="select"?c`<div class="panelrow"><label>${i.label??i.key}</label>
            <select @change=${n=>this.setCfg(e,i.key,n.target.value)}>
              ${(i.options??[]).map(n=>c`<option ?selected=${this.cfgVal(e,i.key)===n}>${n}</option>`)}
            </select></div>`:i.type==="number"?c`<div class="panelrow"><label>${i.label??i.key}</label>
            <input type="number" style="width:60px" min=${i.min??1} max=${i.max??64} step=${i.step??1}
              .value=${String(this.cfgVal(e,i.key))}
              @change=${n=>this.setCfg(e,i.key,+n.target.value)} /></div>`:c`<div class="panelrow"><label>${i.label??i.key}</label>
          <input type="color" .value=${Ft(this.cfgVal(e,i.key))}
            @input=${n=>this.setCfg(e,i.key,nt(n.target.value))} /></div>`)}
      <div class="panelrow"><button class="danger" @click=${()=>this.removeWidget(this.selected)}>Remove widget</button></div>
    `:""}render(){let e=this.scale,s=new Set(this.layout.widgets.map(r=>r.id)),i=this.caps.filter(r=>!s.has(r.id)),n=new Set(this.layout.overlays??[]),a=`background-image:linear-gradient(to right,rgba(255,255,255,.10) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.10) 1px,transparent 1px);background-size:${e}px ${e}px`;return c`
      <div class="bar">
        <label>Device
          <select @change=${r=>{let l=r.target.value;l===At?this.selectMock(this.model):this.selectDevice(l)}}>
            <option value=${At} ?selected=${!this.entryId}>(mock — preview only)</option>
            ${this.devices.map(r=>c`<option value=${r.entry_id} ?selected=${r.entry_id===this.entryId}>${r.name} (${r.model})</option>`)}
          </select>
        </label>
        ${this.entryId?c`<span class="hint">model: ${this.model}</span>`:c`<label>Model
          <select @change=${r=>this.selectMock(r.target.value)}>
            ${Object.keys(Et).map(r=>c`<option ?selected=${r===this.model}>${r}</option>`)}
          </select></label>`}
        <span class="hint">${this.dims[0]}&times;${this.dims[1]} px</span>
        <label>Layout
          <select @change=${r=>{let l=r.target.value;this.loadLayout(l==="__new__"?this.defaultLayout:this.stored[l])}}>
            ${Object.keys(this.stored).map(r=>c`<option ?selected=${r===this.layoutName}>${r}</option>`)}
            <option value="__new__">— new —</option>
          </select>
        </label>
        <label>Name <input .value=${this.layoutName} @input=${r=>this.layoutName=r.target.value} /></label>
        <button @click=${this.save} ?disabled=${!this.entryId} title=${this.entryId?"":"Select a device to save/push"}>Save &amp; Push</button>
        ${this.stored[this.layoutName]?c`<button class="danger" @click=${this.deleteLayout}>Delete</button>`:""}
        <label>Snap
          <select @change=${r=>{this.layout.grid=+r.target.value,this.edited()}}>
            ${[1,2,4].map(r=>c`<option ?selected=${(this.layout.grid??2)===r}>${r}</option>`)}
          </select>
        </label>
        <label><input type="checkbox" .checked=${this.wireframe} @change=${r=>this.wireframe=r.target.checked} /> wireframe</label>
        <label><input type="checkbox" .checked=${this.live} ?disabled=${!this.entryId} @change=${r=>this.live=r.target.checked} /> live push</label>
      </div>

      <div class="wrap">
        <div class="col">
          <div class="stage" style=${`width:${this.dims[0]*e}px;height:${this.dims[1]*e}px`}>
            ${this.png?c`<img src="data:image/png;base64,${this.png}" width=${this.dims[0]*e} height=${this.dims[1]*e} @load=${this.onImgLoad} />`:""}
            <div class="grid" style=${a}></div>
            ${this.wireframe?c`<div class="boxes">${this.layout.widgets.map((r,l)=>{if(!this.capFor(r.id)||r.enabled===!1)return"";let[h,u]=this.boxDims(r);return c`<div class="box ${l===this.selected?"sel":""}"
                style=${`left:${r.x*e}px;top:${r.y*e}px;width:${h*e}px;height:${u*e}px`}
                @pointerdown=${d=>this.startDrag(l,d)}>
                <span class="tag">${r.id}</span></div>`})}${this.sensors.map((r,l)=>c`<div class="box sensor ${l===this.selSensor?"sel":""}"
                style=${`left:${r.x_pos*e}px;top:${r.y_pos*e}px;width:${(r.size??2)*e}px;height:${(r.size??2)*e}px`}
                @pointerdown=${h=>this.startSensorDrag(l,h)}></div>`)}</div>`:""}
          </div>
          <div class="status ${this.status.startsWith("Render failed")?"err":""}">${this.status}</div>
        </div>

        <div class="col">
          <h3>Widgets</h3>
          <ul class="wlist">
            ${this.layout.widgets.map((r,l)=>c`
              <li class="${l===this.selected?"sel":""}" @click=${()=>this.selected=l}>
                <input type="checkbox" .checked=${r.enabled!==!1}
                  @click=${h=>{h.stopPropagation(),r.enabled=h.target.checked,this.edited()}} />
                <span class="grow">${this.capFor(r.id)?.label??r.id}</span>
              </li>`)}
          </ul>
          ${i.length?c`<div class="panelrow">
            <select id="addsel"><option value="">add widget…</option>${i.map(r=>c`<option value=${r.id}>${r.label}</option>`)}</select>
            <button class="secondary" @click=${()=>{let r=this.renderRoot.querySelector("#addsel");this.addWidget(r.value),r.value=""}}>Add</button>
          </div>`:""}
          <h3>Overlays</h3>
          ${this.overlayCaps.map(r=>c`<div class="panelrow"><label>
            <input type="checkbox" .checked=${n.has(r.id)} @change=${l=>this.toggleOverlay(r.id,l.target.checked)} /> ${r.label}</label></div>`)}
          <h3>Selected</h3>
          ${this.renderWidgetEditor()}

          <h3>Sensors</h3>
          ${this.sensors.map((r,l)=>c`
            <div class="panelrow ${l===this.selSensor?"sel":""}" @click=${()=>this.selSensor=l}>
              <input style="width:70px" .value=${r.name} @change=${h=>this.setSensor(l,"name",h.target.value)} title="Name" />
              <select .value=${r.entity_id} @change=${h=>this.setSensor(l,"entity_id",h.target.value)} title="Entity">
                <option value="">(entity)</option>
                ${this.entityOptions().map(h=>c`<option ?selected=${h===r.entity_id}>${h}</option>`)}
              </select>
              <input type="color" .value=${r.on_color} @input=${h=>this.setSensor(l,"on_color",h.target.value)} title="On colour" />
              <input type="color" .value=${r.off_color} @input=${h=>this.setSensor(l,"off_color",h.target.value)} title="Off colour" />
              <input type="number" style="width:46px" min="1" max="16" .value=${String(r.size??2)}
                @change=${h=>this.setSensor(l,"size",+h.target.value)} title="Size (px)" />
              <button class="danger" @click=${h=>{h.stopPropagation(),this.removeSensor(l)}}>✕</button>
            </div>`)}
          <div class="panelrow">
            <button class="secondary" @click=${this.addSensor}>Add sensor</button>
            <button @click=${this.saveSensors} ?disabled=${!this.entryId} title=${this.entryId?"":"Select a device to save sensors"}>Save sensors</button>
          </div>
        </div>
      </div>
    `}};p.styles=K`
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
  `,m([V({attribute:!1})],p.prototype,"hass",2),m([v()],p.prototype,"devices",2),m([v()],p.prototype,"entryId",2),m([v()],p.prototype,"model",2),m([v()],p.prototype,"layout",2),m([v()],p.prototype,"caps",2),m([v()],p.prototype,"overlayCaps",2),m([v()],p.prototype,"defaultLayout",2),m([v()],p.prototype,"stored",2),m([v()],p.prototype,"png",2),m([v()],p.prototype,"dims",2),m([v()],p.prototype,"selected",2),m([v()],p.prototype,"sensors",2),m([v()],p.prototype,"selSensor",2),m([v()],p.prototype,"layoutName",2),m([v()],p.prototype,"live",2),m([v()],p.prototype,"wireframe",2),m([v()],p.prototype,"status",2),p=m([wt("pimoroni-unicorn-panel")],p);export{p as PimoroniUnicornPanel};
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
