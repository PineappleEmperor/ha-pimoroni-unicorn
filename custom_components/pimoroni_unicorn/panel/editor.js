var Ct=Object.defineProperty;var kt=Object.getOwnPropertyDescriptor;var g=(r,t,e,s)=>{for(var i=s>1?void 0:s?kt(t,e):t,o=r.length-1,a;o>=0;o--)(a=r[o])&&(i=(s?a(t,e,i):a(i))||i);return s&&i&&Ct(t,e,i),i};var D=globalThis,I=D.ShadowRoot&&(D.ShadyCSS===void 0||D.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,B=Symbol(),ot=new WeakMap,M=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==B)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(I&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=ot.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&ot.set(e,t))}return t}toString(){return this.cssText}},nt=r=>new M(typeof r=="string"?r:r+"",void 0,B),V=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((s,i,o)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[o+1],r[0]);return new M(e,r,B)},at=(r,t)=>{if(I)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=D.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},F=I?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return nt(e)})(r):r;var{is:Mt,defineProperty:Tt,getOwnPropertyDescriptor:Lt,getOwnPropertyNames:Rt,getOwnPropertySymbols:Ot,getPrototypeOf:Nt}=Object,W=globalThis,lt=W.trustedTypes,Ht=lt?lt.emptyScript:"",Pt=W.reactiveElementPolyfillSupport,T=(r,t)=>r,L={toAttribute(r,t){switch(t){case Boolean:r=r?Ht:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},U=(r,t)=>!Mt(r,t),ht={attribute:!0,type:String,converter:L,reflect:!1,useDefault:!1,hasChanged:U};Symbol.metadata??=Symbol("metadata"),W.litPropertyMetadata??=new WeakMap;var $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ht){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Tt(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:o}=Lt(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get:i,set(a){let n=i?.call(this);o?.call(this,a),this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ht}static _$Ei(){if(this.hasOwnProperty(T("elementProperties")))return;let t=Nt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(T("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(T("properties"))){let e=this.properties,s=[...Rt(e),...Ot(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(F(i))}else t!==void 0&&e.push(F(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return at(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:L).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let o=s.getPropertyOptions(i),a=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:L;this._$Em=i;let n=a.fromAttribute(e,o.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(t!==void 0){let a=this.constructor;if(i===!1&&(o=this[t]),s??=a.getPropertyOptions(t),!((s.hasChanged??U)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},a){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),o!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,o]of s){let{wrapped:a}=o,n=this[i];a!==!0||this._$AL.has(i)||n===void 0||this.C(i,void 0,o,n)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[T("elementProperties")]=new Map,$[T("finalized")]=new Map,Pt?.({ReactiveElement:$}),(W.reactiveElementVersions??=[]).push("2.1.2");var Q=globalThis,dt=r=>r,j=Q.trustedTypes,ct=j?j.createPolicy("lit-html",{createHTML:r=>r}):void 0,vt="$lit$",b=`lit$${Math.random().toFixed(9).slice(2)}$`,ft="?"+b,Dt=`<${ft}>`,E=document,O=()=>E.createComment(""),N=r=>r===null||typeof r!="object"&&typeof r!="function",tt=Array.isArray,It=r=>tt(r)||typeof r?.[Symbol.iterator]=="function",K=`[ 	
\f\r]`,R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,pt=/-->/g,ut=/>/g,w=RegExp(`>|${K}(?:([^\\s"'>=/]+)(${K}*=${K}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),gt=/'/g,mt=/"/g,$t=/^(?:script|style|textarea|title)$/i,et=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),u=et(1),Zt=et(2),Qt=et(3),S=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),yt=new WeakMap,A=E.createTreeWalker(E,129);function bt(r,t){if(!tt(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ct!==void 0?ct.createHTML(t):t}var Wt=(r,t)=>{let e=r.length-1,s=[],i,o=t===2?"<svg>":t===3?"<math>":"",a=R;for(let n=0;n<e;n++){let l=r[n],d,p,h=-1,v=0;for(;v<l.length&&(a.lastIndex=v,p=a.exec(l),p!==null);)v=a.lastIndex,a===R?p[1]==="!--"?a=pt:p[1]!==void 0?a=ut:p[2]!==void 0?($t.test(p[2])&&(i=RegExp("</"+p[2],"g")),a=w):p[3]!==void 0&&(a=w):a===w?p[0]===">"?(a=i??R,h=-1):p[1]===void 0?h=-2:(h=a.lastIndex-p[2].length,d=p[1],a=p[3]===void 0?w:p[3]==='"'?mt:gt):a===mt||a===gt?a=w:a===pt||a===ut?a=R:(a=w,i=void 0);let f=a===w&&r[n+1].startsWith("/>")?" ":"";o+=a===R?l+Dt:h>=0?(s.push(d),l.slice(0,h)+vt+l.slice(h)+b+f):l+b+(h===-2?n:f)}return[bt(r,o+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},H=class r{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,a=0,n=t.length-1,l=this.parts,[d,p]=Wt(t,e);if(this.el=r.createElement(d,s),A.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=A.nextNode())!==null&&l.length<n;){if(i.nodeType===1){if(i.hasAttributes())for(let h of i.getAttributeNames())if(h.endsWith(vt)){let v=p[a++],f=i.getAttribute(h).split(b),x=/([.?@])?(.*)/.exec(v);l.push({type:1,index:o,name:x[2],strings:f,ctor:x[1]==="."?X:x[1]==="?"?Y:x[1]==="@"?G:k}),i.removeAttribute(h)}else h.startsWith(b)&&(l.push({type:6,index:o}),i.removeAttribute(h));if($t.test(i.tagName)){let h=i.textContent.split(b),v=h.length-1;if(v>0){i.textContent=j?j.emptyScript:"";for(let f=0;f<v;f++)i.append(h[f],O()),A.nextNode(),l.push({type:2,index:++o});i.append(h[v],O())}}}else if(i.nodeType===8)if(i.data===ft)l.push({type:2,index:o});else{let h=-1;for(;(h=i.data.indexOf(b,h+1))!==-1;)l.push({type:7,index:o}),h+=b.length-1}o++}}static createElement(t,e){let s=E.createElement("template");return s.innerHTML=t,s}};function C(r,t,e=r,s){if(t===S)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,o=N(t)?void 0:t._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=C(r,i._$AS(r,t.values),i,s)),t}var J=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??E).importNode(e,!0);A.currentNode=i;let o=A.nextNode(),a=0,n=0,l=s[0];for(;l!==void 0;){if(a===l.index){let d;l.type===2?d=new P(o,o.nextSibling,this,t):l.type===1?d=new l.ctor(o,l.name,l.strings,this,t):l.type===6&&(d=new Z(o,this,t)),this._$AV.push(d),l=s[++n]}a!==l?.index&&(o=A.nextNode(),a++)}return A.currentNode=E,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},P=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=C(this,t,e),N(t)?t===m||t==null||t===""?(this._$AH!==m&&this._$AR(),this._$AH=m):t!==this._$AH&&t!==S&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):It(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==m&&N(this._$AH)?this._$AA.nextSibling.data=t:this.T(E.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=H.createElement(bt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let o=new J(i,this),a=o.u(this.options);o.p(e),this.T(a),this._$AH=o}}_$AC(t){let e=yt.get(t.strings);return e===void 0&&yt.set(t.strings,e=new H(t)),e}k(t){tt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let o of t)i===e.length?e.push(s=new r(this.O(O()),this.O(O()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=dt(t).nextSibling;dt(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},k=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=m,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=m}_$AI(t,e=this,s,i){let o=this.strings,a=!1;if(o===void 0)t=C(this,t,e,0),a=!N(t)||t!==this._$AH&&t!==S,a&&(this._$AH=t);else{let n=t,l,d;for(t=o[0],l=0;l<o.length-1;l++)d=C(this,n[s+l],e,l),d===S&&(d=this._$AH[l]),a||=!N(d)||d!==this._$AH[l],d===m?t=m:t!==m&&(t+=(d??"")+o[l+1]),this._$AH[l]=d}a&&!i&&this.j(t)}j(t){t===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},X=class extends k{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===m?void 0:t}},Y=class extends k{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==m)}},G=class extends k{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=C(this,t,e,0)??m)===S)return;let s=this._$AH,i=t===m&&s!==m||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==m&&(s===m||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Z=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){C(this,t)}};var Ut=Q.litHtmlPolyfillSupport;Ut?.(H,P),(Q.litHtmlVersions??=[]).push("3.3.3");var _t=(r,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let o=e?.renderBefore??null;s._$litPart$=i=new P(t.insertBefore(O(),o),o,void 0,e??{})}return i._$AI(r),i};var st=globalThis,_=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=_t(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return S}};_._$litElement$=!0,_.finalized=!0,st.litElementHydrateSupport?.({LitElement:_});var jt=st.litElementPolyfillSupport;jt?.({LitElement:_});(st.litElementVersions??=[]).push("4.2.2");var xt=r=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(r,t)}):customElements.define(r,t)};var zt={attribute:!0,type:String,converter:L,reflect:!1,hasChanged:U},qt=(r=zt,t,e)=>{let{kind:s,metadata:i}=e,o=globalThis.litPropertyMetadata.get(i);if(o===void 0&&globalThis.litPropertyMetadata.set(i,o=new Map),s==="setter"&&((r=Object.create(r)).wrapped=!0),o.set(e.name,r),s==="accessor"){let{name:a}=e;return{set(n){let l=t.get.call(this);t.set.call(this,n),this.requestUpdate(a,l,r,!0,n)},init(n){return n!==void 0&&this.C(a,void 0,r,n),n}}}if(s==="setter"){let{name:a}=e;return function(n){let l=this[a];t.call(this,n),this.requestUpdate(a,l,r,!0,n)}}throw Error("Unsupported decorator location: "+s)};function z(r){return(t,e)=>typeof e=="object"?qt(r,t,e):((s,i,o)=>{let a=i.hasOwnProperty(o);return i.constructor.createProperty(o,s),a?Object.getOwnPropertyDescriptor(i,o):void 0})(r,t,e)}function y(r){return z({...r,state:!0,attribute:!1})}var Bt=560,wt={galactic:[53,11],cosmic:[32,32],stellar:[16,16]},At="__mock__",Vt=r=>{let[t,e,s]=r??[0,0,0];return"#"+[t,e,s].map(i=>Math.max(0,Math.min(255,i|0)).toString(16).padStart(2,"0")).join("")},Ft=r=>[1,3,5].map(t=>parseInt(r.substr(t,2),16)),c=class extends _{constructor(){super(...arguments);this.devices=[];this.entryId="";this.model="galactic";this.layout={widgets:[]};this.caps=[];this.overlayCaps=[];this.defaultLayout={widgets:[]};this.stored={};this.png="";this.dims=[53,11];this.selected=-1;this.layoutName="default";this.live=!1;this.wireframe=!0;this.status=""}firstUpdated(){this.loadDevices()}async loadDevices(){let e=await this.hass.callWS({type:"pimoroni_unicorn/devices"});this.devices=e.devices??[],this.devices.length?await this.selectDevice(this.devices[0].entry_id):await this.selectMock(this.model)}async loadCaps(e){let s=await this.hass.callWS({type:"pimoroni_unicorn/capabilities",...e});this.caps=s.widgets??[],this.overlayCaps=s.overlays??[],this.defaultLayout=s.default_layout,this.model=s.model,this.dims=wt[this.model]??[53,11],await this.refreshStored()}async selectDevice(e){let s=this.devices.find(o=>o.entry_id===e);if(!s)return;this.entryId=e,await this.loadCaps({entry_id:e});let i=s.active_layout?this.stored[s.active_layout]:void 0;this.loadLayout(i??this.defaultLayout)}async selectMock(e){this.entryId="",await this.loadCaps({model:e}),this.loadLayout(this.defaultLayout)}async refreshStored(){let e=await this.hass.callWS({type:"pimoroni_unicorn/layouts"});this.stored=e.layouts??{}}loadLayout(e){this.layout=JSON.parse(JSON.stringify(e)),this.layoutName=this.layout.name??"default",this.selected=-1,this.renderPreview()}async renderPreview(){try{let e=await this.hass.callWS({type:"pimoroni_unicorn/render",model:this.model,layout:this.layout});this.png=e.png,this.status.startsWith("Render failed")&&(this.status="")}catch(e){this.png="",this.status=`Render failed: ${e?.message??e}`}}edited(){this.requestUpdate(),this.renderTimer&&clearTimeout(this.renderTimer),this.renderTimer=window.setTimeout(()=>this.renderPreview(),80),this.live&&this.entryId&&(this.pushTimer&&clearTimeout(this.pushTimer),this.pushTimer=window.setTimeout(()=>this.pushLive(),250))}async pushLive(){await this.hass.callWS({type:"pimoroni_unicorn/push_layout",entry_id:this.entryId,layout:this.layout})}capFor(e){return this.caps.find(s=>s.id===e)}get scale(){return Math.max(4,Math.floor(Bt/this.dims[0]))}boxDims(e){let s=this.capFor(e.id);if(!s)return[0,0];let i=this.cfgVal(e,"variant");return s.sizes?.[i]??[s.w,s.h]}cfgVal(e,s){return e.cfg?.[s]??this.capFor(e.id)?.default_cfg[s]}setCfg(e,s,i){e.cfg={...e.cfg??{},[s]:i},this.edited()}onImgLoad(e){let s=e.target;this.dims=[s.naturalWidth,s.naturalHeight]}startDrag(e,s){s.preventDefault(),this.selected=e;let i=this.layout.widgets[e],[o,a]=this.boxDims(i),n=this.layout.grid??2,[l,d]=this.dims,p=s.clientX,h=s.clientY,v=i.x,f=i.y;s.target.setPointerCapture(s.pointerId);let x=rt=>{let Et=Math.round((rt.clientX-p)/this.scale/n)*n,St=Math.round((rt.clientY-h)/this.scale/n)*n;i.x=Math.max(0,Math.min(l-o,v+Et)),i.y=Math.max(0,Math.min(d-a,f+St)),this.edited()},it=()=>{window.removeEventListener("pointermove",x),window.removeEventListener("pointerup",it),this.renderPreview()};window.addEventListener("pointermove",x),window.addEventListener("pointerup",it)}addWidget(e){e&&(this.layout.widgets.push({id:e,x:0,y:0,cfg:{}}),this.selected=this.layout.widgets.length-1,this.edited())}removeWidget(e){this.layout.widgets.splice(e,1),this.selected=-1,this.edited()}toggleOverlay(e,s){let i=new Set(this.layout.overlays??[]);s?i.add(e):i.delete(e),this.layout.overlays=[...i],this.edited()}async save(){this.entryId&&(this.layout.name=this.layoutName,await this.hass.callWS({type:"pimoroni_unicorn/save_layout",entry_id:this.entryId,name:this.layoutName,layout:this.layout}),await this.refreshStored(),this.status=`Saved "${this.layoutName}" and pushed to device.`)}async deleteLayout(){this.stored[this.layoutName]&&(await this.hass.callWS({type:"pimoroni_unicorn/delete_layout",name:this.layoutName}),await this.refreshStored(),this.status=`Deleted "${this.layoutName}".`,this.loadLayout(this.defaultLayout))}renderWidgetEditor(){let e=this.layout.widgets[this.selected];if(!e)return u`<p class="hint">Select a widget to edit.</p>`;let s=this.capFor(e.id);return s?u`
      <h3>${s.label}</h3>
      <div class="panelrow"><label>X</label>${e.x} <label>Y</label>${e.y}</div>
      ${s.cfg_fields.map(i=>i.type==="select"?u`<div class="panelrow"><label>${i.label??i.key}</label>
            <select @change=${o=>this.setCfg(e,i.key,o.target.value)}>
              ${(i.options??[]).map(o=>u`<option ?selected=${this.cfgVal(e,i.key)===o}>${o}</option>`)}
            </select></div>`:u`<div class="panelrow"><label>${i.label??i.key}</label>
            <input type="color" .value=${Vt(this.cfgVal(e,i.key))}
              @input=${o=>this.setCfg(e,i.key,Ft(o.target.value))} /></div>`)}
      <div class="panelrow"><button class="danger" @click=${()=>this.removeWidget(this.selected)}>Remove widget</button></div>
    `:""}render(){let e=this.scale,s=new Set(this.layout.widgets.map(n=>n.id)),i=this.caps.filter(n=>!s.has(n.id)),o=new Set(this.layout.overlays??[]),a=`background-image:linear-gradient(to right,rgba(255,255,255,.10) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.10) 1px,transparent 1px);background-size:${e}px ${e}px`;return u`
      <div class="bar">
        <label>Device
          <select @change=${n=>{let l=n.target.value;l===At?this.selectMock(this.model):this.selectDevice(l)}}>
            <option value=${At} ?selected=${!this.entryId}>(mock — preview only)</option>
            ${this.devices.map(n=>u`<option value=${n.entry_id} ?selected=${n.entry_id===this.entryId}>${n.name} (${n.model})</option>`)}
          </select>
        </label>
        ${this.entryId?u`<span class="hint">model: ${this.model}</span>`:u`<label>Model
          <select @change=${n=>this.selectMock(n.target.value)}>
            ${Object.keys(wt).map(n=>u`<option ?selected=${n===this.model}>${n}</option>`)}
          </select></label>`}
        <label>Layout
          <select @change=${n=>{let l=n.target.value;this.loadLayout(l==="__new__"?this.defaultLayout:this.stored[l])}}>
            ${Object.keys(this.stored).map(n=>u`<option ?selected=${n===this.layoutName}>${n}</option>`)}
            <option value="__new__">— new —</option>
          </select>
        </label>
        <label>Name <input .value=${this.layoutName} @input=${n=>this.layoutName=n.target.value} /></label>
        <button @click=${this.save} ?disabled=${!this.entryId} title=${this.entryId?"":"Select a device to save/push"}>Save &amp; Push</button>
        ${this.stored[this.layoutName]?u`<button class="danger" @click=${this.deleteLayout}>Delete</button>`:""}
        <label><input type="checkbox" .checked=${this.wireframe} @change=${n=>this.wireframe=n.target.checked} /> wireframe</label>
        <label><input type="checkbox" .checked=${this.live} ?disabled=${!this.entryId} @change=${n=>this.live=n.target.checked} /> live push</label>
      </div>

      <div class="wrap">
        <div class="col">
          <div class="stage" style=${`width:${this.dims[0]*e}px;height:${this.dims[1]*e}px`}>
            ${this.png?u`<img src="data:image/png;base64,${this.png}" width=${this.dims[0]*e} height=${this.dims[1]*e} @load=${this.onImgLoad} />`:""}
            <div class="grid" style=${a}></div>
            ${this.wireframe?u`<div class="boxes">${this.layout.widgets.map((n,l)=>{if(!this.capFor(n.id)||n.enabled===!1)return"";let[d,p]=this.boxDims(n);return u`<div class="box ${l===this.selected?"sel":""}"
                style=${`left:${n.x*e}px;top:${n.y*e}px;width:${d*e}px;height:${p*e}px`}
                @pointerdown=${h=>this.startDrag(l,h)}>
                <span class="tag">${n.id}</span></div>`})}</div>`:""}
          </div>
          <div class="status ${this.status.startsWith("Render failed")?"err":""}">${this.status}</div>
        </div>

        <div class="col">
          <h3>Widgets</h3>
          <ul class="wlist">
            ${this.layout.widgets.map((n,l)=>u`
              <li class="${l===this.selected?"sel":""}" @click=${()=>this.selected=l}>
                <input type="checkbox" .checked=${n.enabled!==!1}
                  @click=${d=>{d.stopPropagation(),n.enabled=d.target.checked,this.edited()}} />
                <span class="grow">${this.capFor(n.id)?.label??n.id}</span>
              </li>`)}
          </ul>
          ${i.length?u`<div class="panelrow">
            <select id="addsel"><option value="">add widget…</option>${i.map(n=>u`<option value=${n.id}>${n.label}</option>`)}</select>
            <button class="secondary" @click=${()=>{let n=this.renderRoot.querySelector("#addsel");this.addWidget(n.value),n.value=""}}>Add</button>
          </div>`:""}
          <h3>Overlays</h3>
          ${this.overlayCaps.map(n=>u`<div class="panelrow"><label>
            <input type="checkbox" .checked=${o.has(n.id)} @change=${l=>this.toggleOverlay(n.id,l.target.checked)} /> ${n.label}</label></div>`)}
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
      border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color, #fff); color: var(--primary-text-color, #111); }
    input[type="color"] { padding: 0; width: 34px; height: 28px; }
    button { cursor: pointer; background: var(--primary-color, #03a9f4); color: #fff; border: none; }
    button[disabled] { opacity: .5; cursor: not-allowed; }
    button.secondary { background: var(--secondary-background-color, #e0e0e0); color: var(--primary-text-color, #111); }
    button.danger { background: var(--error-color, #db4437); }
    .stage { position: relative; display: inline-block; background: #000; line-height: 0; border: 1px solid var(--divider-color, #444); }
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
  `,g([z({attribute:!1})],c.prototype,"hass",2),g([y()],c.prototype,"devices",2),g([y()],c.prototype,"entryId",2),g([y()],c.prototype,"model",2),g([y()],c.prototype,"layout",2),g([y()],c.prototype,"caps",2),g([y()],c.prototype,"overlayCaps",2),g([y()],c.prototype,"defaultLayout",2),g([y()],c.prototype,"stored",2),g([y()],c.prototype,"png",2),g([y()],c.prototype,"dims",2),g([y()],c.prototype,"selected",2),g([y()],c.prototype,"layoutName",2),g([y()],c.prototype,"live",2),g([y()],c.prototype,"wireframe",2),g([y()],c.prototype,"status",2),c=g([xt("pimoroni-unicorn-panel")],c);export{c as PimoroniUnicornPanel};
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
