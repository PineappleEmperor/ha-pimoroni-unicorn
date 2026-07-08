var Ut=Object.defineProperty;var jt=Object.getOwnPropertyDescriptor;var p=(c,i,t,e)=>{for(var s=e>1?void 0:e?jt(i,t):i,n=c.length-1,r;n>=0;n--)(r=c[n])&&(s=(e?r(i,t,s):r(s))||s);return e&&s&&Ut(i,t,s),s};var B=globalThis,q=B.ShadowRoot&&(B.ShadyCSS===void 0||B.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Z=Symbol(),gt=new WeakMap,O=class{constructor(i,t,e){if(this._$cssResult$=!0,e!==Z)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=t}get styleSheet(){let i=this.o,t=this.t;if(q&&i===void 0){let e=t!==void 0&&t.length===1;e&&(i=gt.get(t)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),e&&gt.set(t,i))}return i}toString(){return this.cssText}},mt=c=>new O(typeof c=="string"?c:c+"",void 0,Z),R=(c,...i)=>{let t=c.length===1?c[0]:i.reduce((e,s,n)=>e+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+c[n+1],c[0]);return new O(t,c,Z)},vt=(c,i)=>{if(q)c.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of i){let e=document.createElement("style"),s=B.litNonce;s!==void 0&&e.setAttribute("nonce",s),e.textContent=t.cssText,c.appendChild(e)}},G=q?c=>c:c=>c instanceof CSSStyleSheet?(i=>{let t="";for(let e of i.cssRules)t+=e.cssText;return mt(t)})(c):c;var{is:Bt,defineProperty:qt,getOwnPropertyDescriptor:Vt,getOwnPropertyNames:Jt,getOwnPropertySymbols:Kt,getPrototypeOf:Yt}=Object,V=globalThis,yt=V.trustedTypes,Xt=yt?yt.emptyScript:"",Zt=V.reactiveElementPolyfillSupport,H=(c,i)=>c,W={toAttribute(c,i){switch(i){case Boolean:c=c?Xt:null;break;case Object:case Array:c=c==null?c:JSON.stringify(c)}return c},fromAttribute(c,i){let t=c;switch(i){case Boolean:t=c!==null;break;case Number:t=c===null?null:Number(c);break;case Object:case Array:try{t=JSON.parse(c)}catch{t=null}}return t}},J=(c,i)=>!Bt(c,i),bt={attribute:!0,type:String,converter:W,reflect:!1,useDefault:!1,hasChanged:J};Symbol.metadata??=Symbol("metadata"),V.litPropertyMetadata??=new WeakMap;var S=class extends HTMLElement{static addInitializer(i){this._$Ei(),(this.l??=[]).push(i)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(i,t=bt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(i)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(i,t),!t.noAccessor){let e=Symbol(),s=this.getPropertyDescriptor(i,e,t);s!==void 0&&qt(this.prototype,i,s)}}static getPropertyDescriptor(i,t,e){let{get:s,set:n}=Vt(this.prototype,i)??{get(){return this[t]},set(r){this[t]=r}};return{get:s,set(r){let a=s?.call(this);n?.call(this,r),this.requestUpdate(i,a,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(i){return this.elementProperties.get(i)??bt}static _$Ei(){if(this.hasOwnProperty(H("elementProperties")))return;let i=Yt(this);i.finalize(),i.l!==void 0&&(this.l=[...i.l]),this.elementProperties=new Map(i.elementProperties)}static finalize(){if(this.hasOwnProperty(H("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(H("properties"))){let t=this.properties,e=[...Jt(t),...Kt(t)];for(let s of e)this.createProperty(s,t[s])}let i=this[Symbol.metadata];if(i!==null){let t=litPropertyMetadata.get(i);if(t!==void 0)for(let[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(let[t,e]of this.elementProperties){let s=this._$Eu(t,e);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(i){let t=[];if(Array.isArray(i)){let e=new Set(i.flat(1/0).reverse());for(let s of e)t.unshift(G(s))}else i!==void 0&&t.push(G(i));return t}static _$Eu(i,t){let e=t.attribute;return e===!1?void 0:typeof e=="string"?e:typeof i=="string"?i.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(i=>i(this))}addController(i){(this._$EO??=new Set).add(i),this.renderRoot!==void 0&&this.isConnected&&i.hostConnected?.()}removeController(i){this._$EO?.delete(i)}_$E_(){let i=new Map,t=this.constructor.elementProperties;for(let e of t.keys())this.hasOwnProperty(e)&&(i.set(e,this[e]),delete this[e]);i.size>0&&(this._$Ep=i)}createRenderRoot(){let i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return vt(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(i=>i.hostConnected?.())}enableUpdating(i){}disconnectedCallback(){this._$EO?.forEach(i=>i.hostDisconnected?.())}attributeChangedCallback(i,t,e){this._$AK(i,e)}_$ET(i,t){let e=this.constructor.elementProperties.get(i),s=this.constructor._$Eu(i,e);if(s!==void 0&&e.reflect===!0){let n=(e.converter?.toAttribute!==void 0?e.converter:W).toAttribute(t,e.type);this._$Em=i,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(i,t){let e=this.constructor,s=e._$Eh.get(i);if(s!==void 0&&this._$Em!==s){let n=e.getPropertyOptions(s),r=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:W;this._$Em=s;let a=r.fromAttribute(t,n.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(i,t,e,s=!1,n){if(i!==void 0){let r=this.constructor;if(s===!1&&(n=this[i]),e??=r.getPropertyOptions(i),!((e.hasChanged??J)(n,t)||e.useDefault&&e.reflect&&n===this._$Ej?.get(i)&&!this.hasAttribute(r._$Eu(i,e))))return;this.C(i,t,e)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(i,t,{useDefault:e,reflect:s,wrapped:n},r){e&&!(this._$Ej??=new Map).has(i)&&(this._$Ej.set(i,r??t??this[i]),n!==!0||r!==void 0)||(this._$AL.has(i)||(this.hasUpdated||e||(t=void 0),this._$AL.set(i,t)),s===!0&&this._$Em!==i&&(this._$Eq??=new Set).add(i))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let i=this.scheduleUpdate();return i!=null&&await i,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[s,n]of e){let{wrapped:r}=n,a=this[s];r!==!0||this._$AL.has(s)||a===void 0||this.C(s,void 0,n,a)}}let i=!1,t=this._$AL;try{i=this.shouldUpdate(t),i?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(e){throw i=!1,this._$EM(),e}i&&this._$AE(t)}willUpdate(i){}_$AE(i){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(i)),this.updated(i)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(i){return!0}update(i){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(i){}firstUpdated(i){}};S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[H("elementProperties")]=new Map,S[H("finalized")]=new Map,Zt?.({ReactiveElement:S}),(V.reactiveElementVersions??=[]).push("2.1.2");var nt=globalThis,ft=c=>c,K=nt.trustedTypes,$t=K?K.createPolicy("lit-html",{createHTML:c=>c}):void 0,kt="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,It="?"+k,Gt=`<${It}>`,A=document,F=()=>A.createComment(""),P=c=>c===null||typeof c!="object"&&typeof c!="function",rt=Array.isArray,Qt=c=>rt(c)||typeof c?.[Symbol.iterator]=="function",Q=`[ 	
\f\r]`,z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,xt=/-->/g,wt=/>/g,T=RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),_t=/'/g,St=/"/g,Tt=/^(?:script|style|textarea|title)$/i,ot=c=>(i,...t)=>({_$litType$:c,strings:i,values:t}),o=ot(1),ve=ot(2),ye=ot(3),M=Symbol.for("lit-noChange"),y=Symbol.for("lit-nothing"),Et=new WeakMap,L=A.createTreeWalker(A,129);function Lt(c,i){if(!rt(c)||!c.hasOwnProperty("raw"))throw Error("invalid template strings array");return $t!==void 0?$t.createHTML(i):i}var te=(c,i)=>{let t=c.length-1,e=[],s,n=i===2?"<svg>":i===3?"<math>":"",r=z;for(let a=0;a<t;a++){let l=c[a],d,g,m=-1,v=0;for(;v<l.length&&(r.lastIndex=v,g=r.exec(l),g!==null);)v=r.lastIndex,r===z?g[1]==="!--"?r=xt:g[1]!==void 0?r=wt:g[2]!==void 0?(Tt.test(g[2])&&(s=RegExp("</"+g[2],"g")),r=T):g[3]!==void 0&&(r=T):r===T?g[0]===">"?(r=s??z,m=-1):g[1]===void 0?m=-2:(m=r.lastIndex-g[2].length,d=g[1],r=g[3]===void 0?T:g[3]==='"'?St:_t):r===St||r===_t?r=T:r===xt||r===wt?r=z:(r=T,s=void 0);let b=r===T&&c[a+1].startsWith("/>")?" ":"";n+=r===z?l+Gt:m>=0?(e.push(d),l.slice(0,m)+kt+l.slice(m)+k+b):l+k+(m===-2?a:b)}return[Lt(c,n+(c[t]||"<?>")+(i===2?"</svg>":i===3?"</math>":"")),e]},U=class c{constructor({strings:i,_$litType$:t},e){let s;this.parts=[];let n=0,r=0,a=i.length-1,l=this.parts,[d,g]=te(i,t);if(this.el=c.createElement(d,e),L.currentNode=this.el.content,t===2||t===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(s=L.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(let m of s.getAttributeNames())if(m.endsWith(kt)){let v=g[r++],b=s.getAttribute(m).split(k),f=/([.?@])?(.*)/.exec(v);l.push({type:1,index:n,name:f[2],strings:b,ctor:f[1]==="."?et:f[1]==="?"?st:f[1]==="@"?it:D}),s.removeAttribute(m)}else m.startsWith(k)&&(l.push({type:6,index:n}),s.removeAttribute(m));if(Tt.test(s.tagName)){let m=s.textContent.split(k),v=m.length-1;if(v>0){s.textContent=K?K.emptyScript:"";for(let b=0;b<v;b++)s.append(m[b],F()),L.nextNode(),l.push({type:2,index:++n});s.append(m[v],F())}}}else if(s.nodeType===8)if(s.data===It)l.push({type:2,index:n});else{let m=-1;for(;(m=s.data.indexOf(k,m+1))!==-1;)l.push({type:7,index:n}),m+=k.length-1}n++}}static createElement(i,t){let e=A.createElement("template");return e.innerHTML=i,e}};function C(c,i,t=c,e){if(i===M)return i;let s=e!==void 0?t._$Co?.[e]:t._$Cl,n=P(i)?void 0:i._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(c),s._$AT(c,t,e)),e!==void 0?(t._$Co??=[])[e]=s:t._$Cl=s),s!==void 0&&(i=C(c,s._$AS(c,i.values),s,e)),i}var tt=class{constructor(i,t){this._$AV=[],this._$AN=void 0,this._$AD=i,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(i){let{el:{content:t},parts:e}=this._$AD,s=(i?.creationScope??A).importNode(t,!0);L.currentNode=s;let n=L.nextNode(),r=0,a=0,l=e[0];for(;l!==void 0;){if(r===l.index){let d;l.type===2?d=new j(n,n.nextSibling,this,i):l.type===1?d=new l.ctor(n,l.name,l.strings,this,i):l.type===6&&(d=new at(n,this,i)),this._$AV.push(d),l=e[++a]}r!==l?.index&&(n=L.nextNode(),r++)}return L.currentNode=A,s}p(i){let t=0;for(let e of this._$AV)e!==void 0&&(e.strings!==void 0?(e._$AI(i,e,t),t+=e.strings.length-2):e._$AI(i[t])),t++}},j=class c{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(i,t,e,s){this.type=2,this._$AH=y,this._$AN=void 0,this._$AA=i,this._$AB=t,this._$AM=e,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let i=this._$AA.parentNode,t=this._$AM;return t!==void 0&&i?.nodeType===11&&(i=t.parentNode),i}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(i,t=this){i=C(this,i,t),P(i)?i===y||i==null||i===""?(this._$AH!==y&&this._$AR(),this._$AH=y):i!==this._$AH&&i!==M&&this._(i):i._$litType$!==void 0?this.$(i):i.nodeType!==void 0?this.T(i):Qt(i)?this.k(i):this._(i)}O(i){return this._$AA.parentNode.insertBefore(i,this._$AB)}T(i){this._$AH!==i&&(this._$AR(),this._$AH=this.O(i))}_(i){this._$AH!==y&&P(this._$AH)?this._$AA.nextSibling.data=i:this.T(A.createTextNode(i)),this._$AH=i}$(i){let{values:t,_$litType$:e}=i,s=typeof e=="number"?this._$AC(i):(e.el===void 0&&(e.el=U.createElement(Lt(e.h,e.h[0]),this.options)),e);if(this._$AH?._$AD===s)this._$AH.p(t);else{let n=new tt(s,this),r=n.u(this.options);n.p(t),this.T(r),this._$AH=n}}_$AC(i){let t=Et.get(i.strings);return t===void 0&&Et.set(i.strings,t=new U(i)),t}k(i){rt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,e,s=0;for(let n of i)s===t.length?t.push(e=new c(this.O(F()),this.O(F()),this,this.options)):e=t[s],e._$AI(n),s++;s<t.length&&(this._$AR(e&&e._$AB.nextSibling,s),t.length=s)}_$AR(i=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);i!==this._$AB;){let e=ft(i).nextSibling;ft(i).remove(),i=e}}setConnected(i){this._$AM===void 0&&(this._$Cv=i,this._$AP?.(i))}},D=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(i,t,e,s,n){this.type=1,this._$AH=y,this._$AN=void 0,this.element=i,this.name=t,this._$AM=s,this.options=n,e.length>2||e[0]!==""||e[1]!==""?(this._$AH=Array(e.length-1).fill(new String),this.strings=e):this._$AH=y}_$AI(i,t=this,e,s){let n=this.strings,r=!1;if(n===void 0)i=C(this,i,t,0),r=!P(i)||i!==this._$AH&&i!==M,r&&(this._$AH=i);else{let a=i,l,d;for(i=n[0],l=0;l<n.length-1;l++)d=C(this,a[e+l],t,l),d===M&&(d=this._$AH[l]),r||=!P(d)||d!==this._$AH[l],d===y?i=y:i!==y&&(i+=(d??"")+n[l+1]),this._$AH[l]=d}r&&!s&&this.j(i)}j(i){i===y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,i??"")}},et=class extends D{constructor(){super(...arguments),this.type=3}j(i){this.element[this.name]=i===y?void 0:i}},st=class extends D{constructor(){super(...arguments),this.type=4}j(i){this.element.toggleAttribute(this.name,!!i&&i!==y)}},it=class extends D{constructor(i,t,e,s,n){super(i,t,e,s,n),this.type=5}_$AI(i,t=this){if((i=C(this,i,t,0)??y)===M)return;let e=this._$AH,s=i===y&&e!==y||i.capture!==e.capture||i.once!==e.once||i.passive!==e.passive,n=i!==y&&(e===y||s);s&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,i),this._$AH=i}handleEvent(i){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,i):this._$AH.handleEvent(i)}},at=class{constructor(i,t,e){this.element=i,this.type=6,this._$AN=void 0,this._$AM=t,this.options=e}get _$AU(){return this._$AM._$AU}_$AI(i){C(this,i)}};var ee=nt.litHtmlPolyfillSupport;ee?.(U,j),(nt.litHtmlVersions??=[]).push("3.3.3");var At=(c,i,t)=>{let e=t?.renderBefore??i,s=e._$litPart$;if(s===void 0){let n=t?.renderBefore??null;e._$litPart$=s=new j(i.insertBefore(F(),n),n,void 0,t??{})}return s._$AI(c),s};var lt=globalThis,_=class extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let i=super.createRenderRoot();return this.renderOptions.renderBefore??=i.firstChild,i}update(i){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(i),this._$Do=At(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return M}};_._$litElement$=!0,_.finalized=!0,lt.litElementHydrateSupport?.({LitElement:_});var se=lt.litElementPolyfillSupport;se?.({LitElement:_});(lt.litElementVersions??=[]).push("4.2.2");var Mt=c=>(i,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(c,i)}):customElements.define(c,i)};var ie={attribute:!0,type:String,converter:W,reflect:!1,hasChanged:J},ae=(c=ie,i,t)=>{let{kind:e,metadata:s}=t,n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),e==="setter"&&((c=Object.create(c)).wrapped=!0),n.set(t.name,c),e==="accessor"){let{name:r}=t;return{set(a){let l=i.get.call(this);i.set.call(this,a),this.requestUpdate(r,l,c,!0,a)},init(a){return a!==void 0&&this.C(r,void 0,c,a),a}}}if(e==="setter"){let{name:r}=t;return function(a){let l=this[r];i.call(this,a),this.requestUpdate(r,l,c,!0,a)}}throw Error("Unsupported decorator location: "+e)};function I(c){return(i,t)=>typeof t=="object"?ae(c,i,t):((e,s,n)=>{let r=s.hasOwnProperty(n);return s.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(s,n):void 0})(c,i,t)}function h(c){return I({...c,state:!0,attribute:!1})}function ct(c){let i=c.replace(/^#/,""),t=parseInt(i,16);return[t>>16&255,t>>8&255,t&255]}function Ct(c,i,t){let e=s=>Math.max(0,Math.min(255,s|0)).toString(16).padStart(2,"0");return`#${e(c)}${e(i)}${e(t)}`}function Dt(c,i,t,e,s,n){let r=(x,w)=>(w*i+x)*3,a=r(e,s),l=c[a],d=c[a+1],g=c[a+2],[m,v,b]=n;if(l===m&&d===v&&g===b)return;let f=[[e,s]];for(;f.length;){let[x,w]=f.pop();if(x<0||w<0||x>=i||w>=t)continue;let E=r(x,w);c[E]!==l||c[E+1]!==d||c[E+2]!==g||(c[E]=m,c[E+1]=v,c[E+2]=b,f.push([x+1,w],[x-1,w],[x,w+1],[x,w-1]))}}function Nt(c,i,t,e,s,n,r,a){let l=new Uint8ClampedArray(r*a*3);for(let d=0;d<a;d++)for(let g=0;g<r;g++){let m=Math.floor(e+g*n),v=Math.floor(s+d*n),b=(d*r+g)*3;if(m<0||v<0||m>=i||v>=t)continue;let f=(v*i+m)*4;l[b]=c[f],l[b+1]=c[f+1],l[b+2]=c[f+2]}return l}var ne=53,re=32,oe=50,N=12,$=class extends _{constructor(){super(...arguments);this.w=16;this.h=16;this.px=new Uint8ClampedArray(16*16*3);this.tool="pencil";this.color="#ff3355";this.swatches=["#ffffff","#ff3355","#33cc66","#3399ff"];this.name="";this.zoomPct=100;this.status="";this.undoStack=[];this.redoStack=[];this.src=null;this.srcOffX=0;this.srcOffY=0;this.painting=!1}willUpdate(t){(t.has("w")||t.has("h"))&&this.resize(this.w,this.h,!1)}resize(t,e,s){t=Math.max(1,Math.min(ne,t|0)),e=Math.max(1,Math.min(re,e|0));let n=new Uint8ClampedArray(t*e*3);if(s)for(let r=0;r<Math.min(e,this.h);r++)for(let a=0;a<Math.min(t,this.w);a++){let l=(r*t+a)*3,d=(r*this.w+a)*3;n[l]=this.px[d],n[l+1]=this.px[d+1],n[l+2]=this.px[d+2]}this.w=t,this.h=e,this.px=n,this.draw()}snapshot(){this.undoStack.push(this.px.slice()),this.undoStack.length>oe&&this.undoStack.shift(),this.redoStack=[]}undo(){let t=this.undoStack.pop();t&&(this.redoStack.push(this.px.slice()),this.px=t,this.draw())}redo(){let t=this.redoStack.pop();t&&(this.undoStack.push(this.px.slice()),this.px=t,this.draw())}get canvas(){return this.renderRoot.querySelector("canvas")}updated(){this.draw()}draw(){let t=this.canvas;if(!t)return;t.width=this.w*N,t.height=this.h*N;let e=t.getContext("2d");if(e)for(let s=0;s<this.h;s++)for(let n=0;n<this.w;n++){let r=(s*this.w+n)*3,a=this.px[r],l=this.px[r+1],d=this.px[r+2];a===0&&l===0&&d===0?e.fillStyle=(n+s)%2===0?"#111":"#1d1d1d":e.fillStyle=`rgb(${a},${l},${d})`,e.fillRect(n*N,s*N,N,N)}}cellAt(t){let e=this.canvas;if(!e)return null;let s=e.getBoundingClientRect(),n=Math.floor((t.clientX-s.left)/s.width*this.w),r=Math.floor((t.clientY-s.top)/s.height*this.h);return n<0||r<0||n>=this.w||r>=this.h?null:[n,r]}applyAt(t,e){let s=(e*this.w+t)*3;if(this.tool==="pick"){this.color=Ct(this.px[s],this.px[s+1],this.px[s+2]);return}if(this.tool==="fill"){Dt(this.px,this.w,this.h,t,e,ct(this.color)),this.draw();return}let n=this.tool==="eraser"?[0,0,0]:ct(this.color);this.px[s]=n[0],this.px[s+1]=n[1],this.px[s+2]=n[2],this.draw()}onDown(t){let e=this.cellAt(t);e&&(this.snapshot(),this.painting=this.tool==="pencil"||this.tool==="eraser",t.target.setPointerCapture(t.pointerId),this.applyAt(e[0],e[1]))}onMove(t){if(!this.painting)return;let e=this.cellAt(t);e&&this.applyAt(e[0],e[1])}onUp(){this.painting=!1}async onFile(t){let e=t.target.files?.[0];if(!e)return;let s=await new Promise(n=>{let r=new FileReader;r.onload=()=>n(String(r.result)),r.readAsDataURL(e)});await this.loadImage(s)}async onUrl(){let t=prompt("Image or GIF URL:");if(!(!t||!this.decode))try{let e=await this.decode({url:t,maxW:this.w,maxH:this.h});await this.loadImage(`data:image/png;base64,${e.png}`)}catch(e){this.status=`Load failed: ${e?.message??e}`}}async loadImage(t){let e=new Image;await new Promise((a,l)=>{e.onload=()=>a(),e.onerror=l,e.src=t});let s=document.createElement("canvas");s.width=e.naturalWidth,s.height=e.naturalHeight;let n=s.getContext("2d");if(!n)return;n.drawImage(e,0,0);let r=n.getImageData(0,0,s.width,s.height).data;this.src={data:new Uint8ClampedArray(r),w:s.width,h:s.height},this.zoomPct=100,this.srcOffX=0,this.srcOffY=0,this.stampSource()}stampSource(){if(!this.src)return;this.snapshot();let e=Math.max(this.src.w/this.w,this.src.h/this.h)*(100/Math.max(1,this.zoomPct));this.px=Nt(this.src.data,this.src.w,this.src.h,this.srcOffX,this.srcOffY,e,this.w,this.h),this.draw()}toDataUrl(){let t=document.createElement("canvas");t.width=this.w,t.height=this.h;let e=t.getContext("2d");if(!e)return"";let s=e.createImageData(this.w,this.h);for(let n=0;n<this.w*this.h;n++)s.data[n*4]=this.px[n*3],s.data[n*4+1]=this.px[n*3+1],s.data[n*4+2]=this.px[n*3+2],s.data[n*4+3]=255;return e.putImageData(s,0,0),t.toDataURL("image/png")}save(){let t=this.name.trim();if(!t){this.status="Name the icon first.";return}this.dispatchEvent(new CustomEvent("save",{detail:{name:t,dataUrl:this.toDataUrl(),w:this.w,h:this.h},bubbles:!0,composed:!0}))}pickColor(t){this.color=t,this.swatches.includes(t)||(this.swatches=[t,...this.swatches].slice(0,8))}render(){let t=(e,s)=>o`
      <button class=${this.tool===e?"on":""} title=${s}
        @click=${()=>{this.tool=e}}>${s}</button>`;return o`
      <div class="wrap">
        <div class="rail">
          <div class="tools">
            ${t("pencil","\u270F\uFE0F")}${t("eraser","\u{1F9FD}")}
            ${t("pick","\u{1F4A7}")}${t("fill","\u{1FAA3}")}
            <button title="Undo" @click=${this.undo}>↶</button>
            <button title="Redo" @click=${this.redo}>↷</button>
          </div>
          <label>Colour</label>
          <input type="color" .value=${this.color}
            @input=${e=>this.pickColor(e.target.value)} />
          <input type="text" .value=${this.color} style="width:100px"
            @change=${e=>this.pickColor(e.target.value)} />
          <div class="sw">
            ${this.swatches.map(e=>o`<span style="background:${e}"
              @click=${()=>this.pickColor(e)}></span>`)}
          </div>
        </div>

        <div class="stage">
          <canvas
            @pointerdown=${this.onDown} @pointermove=${this.onMove}
            @pointerup=${this.onUp} @pointercancel=${this.onUp}></canvas>
        </div>

        <div class="rail">
          <label>Source</label>
          <input type="file" accept="image/png,image/gif,image/apng,image/webp" @change=${this.onFile} />
          <button @click=${this.onUrl}>From URL…</button>
          ${this.src?o`
            <label>Zoom ${this.zoomPct}%</label>
            <input type="range" min="50" max="400" .value=${String(this.zoomPct)}
              @input=${e=>{this.zoomPct=+e.target.value,this.stampSource()}} />
            <div class="tools">
              <button @click=${()=>{this.srcOffX-=1,this.stampSource()}}>←</button>
              <button @click=${()=>{this.srcOffX+=1,this.stampSource()}}>→</button>
              <button @click=${()=>{this.srcOffY-=1,this.stampSource()}}>↑</button>
              <button @click=${()=>{this.srcOffY+=1,this.stampSource()}}>↓</button>
            </div>`:""}
          <label>Size</label>
          <div class="tools">
            <input type="number" min="1" max="53" .value=${String(this.w)} style="width:56px"
              @change=${e=>this.resize(+e.target.value,this.h,!0)} />
            <span>×</span>
            <input type="number" min="1" max="32" .value=${String(this.h)} style="width:56px"
              @change=${e=>this.resize(this.w,+e.target.value,!0)} />
          </div>
          <label>Name</label>
          <input type="text" .value=${this.name} style="width:120px"
            @input=${e=>{this.name=e.target.value}} />
          <button @click=${this.save}>Save as icon</button>
          ${this.status?o`<span>${this.status}</span>`:""}
        </div>
      </div>`}};$.styles=R`
    :host { display: block; }
    .wrap { display: flex; gap: 16px; flex-wrap: wrap; align-items: flex-start; }
    .rail { flex: 0 0 auto; min-width: 150px; display: flex; flex-direction: column; gap: 8px; }
    .stage { flex: 1 1 320px; display: flex; justify-content: center; background: #000;
             border-radius: 8px; padding: 12px; min-height: 200px; }
    canvas { image-rendering: pixelated; touch-action: none;
             box-shadow: 0 0 0 1px var(--divider-color, #444); max-width: 100%; }
    .tools { display: flex; flex-wrap: wrap; gap: 6px; }
    button { min-height: 40px; min-width: 40px; }
    button.on { outline: 2px solid var(--primary-color, #03a9f4); }
    .sw { display: flex; flex-wrap: wrap; gap: 4px; }
    .sw span { width: 24px; height: 24px; border-radius: 4px; cursor: pointer;
               box-shadow: inset 0 0 0 1px rgba(255,255,255,.3); }
    label { font-size: 14px; color: var(--secondary-text-color, #aaa); }
    input[type=text], input[type=number] { min-height: 36px; }
  `,p([I({type:Number})],$.prototype,"w",2),p([I({type:Number})],$.prototype,"h",2),p([I({attribute:!1})],$.prototype,"decode",2),p([h()],$.prototype,"px",2),p([h()],$.prototype,"tool",2),p([h()],$.prototype,"color",2),p([h()],$.prototype,"swatches",2),p([h()],$.prototype,"name",2),p([h()],$.prototype,"zoomPct",2),p([h()],$.prototype,"status",2),$=p([Mt("pixel-editor")],$);var dt=560,le=JSON.stringify({id:"my_widget",label:"My Widget",w:16,h:7,default_cfg:{color:[0,255,0]},draw:[{op:"value",x:0,y:1,bind:"solar",fmt:"{:.1f}"},{op:"bar",x:0,y:6,w:16,h:1,bind:"soc",max:100,color:[0,120,255],bg:[30,30,30]}]},null,2),Ot={galactic:[53,11],cosmic:[32,32],stellar:[16,16]},Rt=[["clear","Clear"],["partly_cloudy","Partly cloudy"],["cloudy","Cloudy"],["fog","Fog"],["rain","Rain"],["snow","Snow"],["thunderstorm","Storm"]],Ht="__mock__",pt="pu_panel_draft",Wt=["value","bar","rect","pixel","icon","dot"],ce={value:[["bind","text"],["fmt","text"],["color","rgb"]],bar:[["w","num"],["h","num"],["bind","text"],["max","num"],["color","rgb"],["bg","rgb"]],rect:[["w","num"],["h","num"],["color","rgb"]],pixel:[["color","rgb"]],icon:[["name","icon"]],dot:[["w","num"],["h","num"],["bind","text"],["on_color","rgb"],["off_color","rgb"]]},X={value:{label:"Value",desc:"Draw a data value as text \u2014 pick a source and number format."},bar:{label:"Bar",desc:"Horizontal bar that fills from 0 to max by a value."},rect:{label:"Rectangle",desc:"A filled rectangle."},pixel:{label:"Pixel",desc:"A single lit pixel."},icon:{label:"Icon",desc:"Draw an installed icon by name."},dot:{label:"Status dot",desc:"A box that switches colour on a sensor's on/off state."}},Ft={bind:{label:"Data source",hint:"what value to show \u2014 see Available data"},fmt:{label:"Number format",hint:"e.g. {:.1f}W or {}%  (Python format)"},color:{label:"Colour"},bg:{label:"Background",hint:"track colour behind the bar"},w:{label:"Width",hint:"pixels"},h:{label:"Height",hint:"pixels"},max:{label:"Max value",hint:"value that fills the bar fully"},name:{label:"Icon"},on_color:{label:"On colour"},off_color:{label:"Off colour"}},zt=["solar","consumption","soc","temp","weather","energy_mode","co2"],de=c=>Ft[c]?.label??c,ht=c=>{let[i,t,e]=c??[0,0,0];return"#"+[i,t,e].map(s=>Math.max(0,Math.min(255,s|0)).toString(16).padStart(2,"0")).join("")},ut=c=>{let i=(c||"").replace("#","");return[0,2,4].map(t=>parseInt(i.substr(t,2),16)||0)},u=class extends _{constructor(){super(...arguments);this.devices=[];this.entryId="";this.model="galactic";this.layout={widgets:[]};this.caps=[];this.widgetThumbs={};this.overlayCaps=[];this.defaultLayout={widgets:[]};this.stored={};this.png="";this.wboxes=[];this.dims=[53,11];this.orientation=0;this.previewWeather="";this.zoom=0;this.selected=-1;this.dragIdx=-1;this.dragOverIdx=-1;this.layoutName="default";this.live=!1;this.wireframe=!1;this.locked=!1;this.status="";this.tab="layout";this.catalog=[];this.busyUnits={};this.fwManifest=null;this.activePage=null;this.contentLayouts=[];this.contentScreensets=[];this.showAllContent=!1;this.iconNames=[];this.installedIcons=[];this.iconThumbs={};this.deviceIcons=[];this.iconCode="";this.iconName="";this.iconTargets=[];this.iconUrl="";this.iconImgName="";this.iconFileData="";this.iconFilePreview="";this.iconImportNote="";this.iconDims={};this.iconSizeMode="device";this.iconCustomW=16;this.iconCustomH=16;this.fonts=[];this.fontText="";this.fontPngs={};this.fontTimer=0;this.dirty=!1;this.undoStack=[];this.redoStack=[];this.snapshot={widgets:[]};this.sectionsOpen={};this.screenLayouts=[];this.screenDwell=10;this.screenTransition="none";this.screenPngs={};this.screenIdx=0;this.screenOpacity=1;this.screenTimer=0;this.specText=le;this.editMode="form";this.specPng="";this.specError="";this.specTimer=0;this._frameTimers={};this._pendingDraft=null;this._onBeforeUnload=t=>{this.dirty&&(t.preventDefault(),t.returnValue="")};this._onKey=t=>{let e=t.composedPath()[0],s=e?.tagName;if((t.ctrlKey||t.metaKey)&&t.key.toLowerCase()==="s"){t.preventDefault(),this.save();return}if(s==="INPUT"||s==="SELECT"||s==="TEXTAREA"||e?.isContentEditable)return;if((t.ctrlKey||t.metaKey)&&t.key.toLowerCase()==="z"&&this.tab==="layout"){t.preventDefault(),t.shiftKey?this.redo():this.undo();return}if((t.ctrlKey||t.metaKey)&&t.key.toLowerCase()==="y"&&this.tab==="layout"){t.preventDefault(),this.redo();return}if((t.key==="Delete"||t.key==="Backspace")&&this.tab==="layout"&&this.selected>=0&&this.layout.widgets[this.selected]){t.preventDefault(),this.removeWidget(this.selected);return}let r={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[t.key];!r||this.tab!=="layout"||(t.preventDefault(),this._nudge(r[0],r[1]))};this.fitPx=dt;this._iconDecode=async t=>await this.hass.callWS({type:"pimoroni_unicorn/icon_decode",data:t.data,url:t.url,max_w:t.maxW,max_h:t.maxH})}_persistDraft(){try{localStorage.setItem(pt,JSON.stringify({entryId:this.entryId,layoutName:this.layoutName,layout:this.layout}))}catch{}}_clearDraft(){try{localStorage.removeItem(pt)}catch{}}_applyPendingDraft(){let t=this._pendingDraft;this._pendingDraft=null,!(!t||t.entryId!==this.entryId||!t.layout?.widgets)&&(this.layout=JSON.parse(JSON.stringify(t.layout)),this.layoutName=t.layoutName||this.layoutName,this.snapshot=JSON.parse(JSON.stringify(this.layout)),this.dirty=!0,this.status="Restored your unsaved changes \u2014 Save to keep them, or pick another page to discard.",this.renderPreview())}static{this.styles=R`
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
    .grouplabel { font-size: 11px; font-weight: 600; color: var(--secondary-text-color, #79747e); }
    .help { font-size: 13px; color: var(--pu-primary); text-decoration: none; }
    .help:hover { text-decoration: underline; }
    .firstrun { margin: 4px 0 16px; padding: 12px 16px; border-radius: var(--pu-radius); font-size: 14px;
      color: var(--primary-text-color, #1c1b1f); background: color-mix(in srgb, var(--pu-primary) 8%, var(--pu-surface)); }
    .empty { background:
      repeating-linear-gradient(45deg, var(--pu-outline) 0 1px, transparent 1px 7px), var(--pu-surface) !important; }
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
    .colorctl { display: inline-flex; align-items: center; gap: 8px; }
    .hexin { width: 84px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; text-transform: lowercase; }
    .rangeval { min-width: 32px; text-align: right; color: var(--secondary-text-color, #49454f); font-variant-numeric: tabular-nums; }
    input[type="checkbox"] { width: 16px; height: 16px; accent-color: var(--pu-primary); }
    button {
      font: inherit; font-size: 14px; font-weight: 500; cursor: pointer;
      padding: 11px 20px; border-radius: 20px; border: none;
      background: var(--pu-primary); color: var(--pu-on-primary);
      transition: filter .15s, box-shadow .15s; box-shadow: 0 1px 2px rgba(0,0,0,.15);
    }
    button:hover:not([disabled]) { filter: brightness(1.08); box-shadow: 0 2px 5px rgba(0,0,0,.2); }
    button:active:not([disabled]) { filter: brightness(.95); }
    :focus-visible { outline: 2px solid var(--pu-primary); outline-offset: 2px; border-radius: 4px; }
    button[disabled] { opacity: .38; cursor: not-allowed; box-shadow: none; }
    button.secondary { background: color-mix(in srgb, var(--pu-primary) 14%, var(--pu-surface)); color: var(--pu-primary); box-shadow: none; }
    button.danger { background: var(--error-color, #ba1a1a); color: #fff; }
    button.zbtn { padding: 6px; min-width: 40px; min-height: 40px; line-height: 1; border-radius: 10px; }
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
    .wlist li { display: flex; gap: 10px; align-items: center; padding: 10px 12px; min-height: 48px; box-sizing: border-box; border-radius: 10px; cursor: pointer; transition: background .12s; }
    .wlist li:hover { background: color-mix(in srgb, var(--pu-primary) 7%, transparent); }
    .wlist li.sel { background: color-mix(in srgb, var(--pu-primary) 14%, transparent); box-shadow: inset 3px 0 0 var(--pu-primary); }
    .wlist li .grow { flex: 1; }
    .wlist li.dragging { opacity: .4; }
    .wlist li.dragover { outline: 2px solid var(--pu-primary); outline-offset: -2px; }
    .wlist li .drag { cursor: grab; color: var(--secondary-text-color, #79747e); user-select: none; line-height: 1; }
    .wlist li .drag:active { cursor: grabbing; }
    .wlist li .wlx { border: none; background: none; color: var(--secondary-text-color, #79747e); font-size: 20px; line-height: 1; width: 40px; height: 40px; border-radius: 8px; cursor: pointer; padding: 0; display: grid; place-items: center; flex: none; }
    .wlist li .wlx:hover { background: color-mix(in srgb, var(--error-color, #ba1a1a) 16%, transparent); color: var(--error-color, #ba1a1a); }
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
    .shead { display: flex; gap: 10px; align-items: center; cursor: pointer; padding: 12px 4px; min-height: 48px; box-sizing: border-box; user-select: none; }
    .shead:hover .stitle { color: var(--pu-primary); }
    .chev { width: 24px; height: 24px; flex: none; transition: transform .15s; fill: var(--secondary-text-color, #79747e); }
    .chev.open { transform: rotate(90deg); }
    .stitle { font-size: 22px; line-height: 28px; font-weight: 400; letter-spacing: 0; }
    .mtable { max-width: 780px; margin-bottom: 8px; }
    .mhead, .mrow { display: grid; grid-template-columns: 108px minmax(120px,1fr) minmax(80px,0.9fr) 120px 150px; gap: 12px; align-items: center; }
    .mhead { font-size: 12px; font-weight: 600; color: var(--secondary-text-color, #79747e); padding: 0 14px 6px; }
    .mrow { border: 1px solid var(--pu-outline); border-radius: 10px; padding: 10px 14px; margin-bottom: 8px; }
    .cell-name { font-weight: 500; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .cell-action { display: flex; justify-content: flex-end; gap: 8px; }
    .cell-action button { white-space: nowrap; }
    .thumb { width: 100px; height: 64px; object-fit: contain; image-rendering: pixelated; background: #000; border-radius: 6px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.12); }
    .iconprev { width: 128px; height: 128px; flex: none; object-fit: contain; image-rendering: pixelated; background: #000; border-radius: 8px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.12); }
    .iconthumb { width: 64px; height: 64px; flex: none; object-fit: contain; image-rendering: pixelated; background: #000; border-radius: 6px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.12); }
    .addchips { display: flex; flex-wrap: wrap; gap: 8px; margin: 6px 0 10px; }
    .addchip { font-size: 14px; font-weight: 500; line-height: 20px; padding: 9px 14px; min-height: 40px; border-radius: 20px; border: 1px solid var(--pu-outline); background: transparent; color: inherit; cursor: pointer; }
    .addchip:hover { background: color-mix(in srgb, var(--pu-primary) 12%, transparent); border-color: var(--pu-primary); color: var(--pu-primary); }
    .addgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(92px, 1fr)); gap: 8px; margin: 6px 0 10px; }
    .addtile { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 8px; border-radius: 12px; border: 1px solid var(--pu-outline); background: transparent; color: inherit; cursor: pointer; transition: background .12s, border-color .12s; }
    .addtile:hover { background: color-mix(in srgb, var(--pu-primary) 12%, transparent); border-color: var(--pu-primary); }
    .addthumb { width: 100%; height: 40px; object-fit: contain; image-rendering: pixelated; background: #000; border-radius: 6px; }
    .addtile-label { font-size: 12px; font-weight: 500; line-height: 16px; text-align: center; }
    .targets { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
    .chk { display: inline-flex; gap: 4px; align-items: center; font-weight: 400; }
    .catalog { list-style: none; padding: 0; margin: 0; max-width: 680px; }
    .catalog li {
      display: flex; gap: 12px; align-items: center; padding: 12px 14px;
      border: 1px solid var(--pu-outline); border-radius: 10px; margin-bottom: 8px;
    }
    .catalog li .grow { flex: 1; }
    .badge { font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 12px; white-space: nowrap; background: color-mix(in srgb, var(--pu-primary) 12%, transparent); color: var(--pu-primary); }
    .badge.working { animation: pupulse 1.2s ease-in-out infinite; }
    @keyframes pupulse { 50% { opacity: .5; } }
    .badges { display: flex; flex-wrap: wrap; gap: 6px; }
    .badge.ok { background: color-mix(in srgb, var(--success-color, #2e7d32) 18%, transparent); color: var(--success-color, #2e7d32); }
    .badge.warn { background: color-mix(in srgb, var(--warning-color, #ed6c02) 20%, transparent); color: var(--warning-color, #ed6c02); }
    .spec { width: 380px; height: 320px; font: 13px ui-monospace, monospace; resize: vertical; }
    .opcard { border: 1px solid var(--pu-outline); border-radius: 10px; padding: 12px 14px; margin-bottom: 12px; }
    .ophead { display: flex; gap: 10px; align-items: center; margin-bottom: 4px; }
    .optitle { font-size: 16px; font-weight: 500; }
    .opdesc { color: var(--secondary-text-color, #79747e); font-size: 13px; margin: 0 0 10px; }
    .fieldgrid { display: grid; grid-template-columns: max-content 1fr; gap: 8px 12px; align-items: center; }
    .flabel { font-size: 14px; color: var(--secondary-text-color, #49454f); }
    .fhint { font-size: 12px; color: var(--secondary-text-color, #79747e); margin-left: 8px; }
    .fmtchip { font-family: ui-monospace, monospace; font-size: 11px; padding: 3px 8px; border-radius: 8px; border: 1px solid var(--pu-outline); background: transparent; color: var(--secondary-text-color, #79747e); cursor: pointer; }
    .fmtchip:hover { border-color: var(--pu-primary); color: var(--pu-primary); }
    .fcell { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; }
    .frow { display: flex; align-items: center; gap: 14px; padding: 8px 10px; border: 1px solid var(--pu-outline); border-radius: 8px; margin-bottom: 6px; }
    .iconrow { display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 6px 12px; border: 1px solid var(--pu-outline); border-radius: 10px; margin-bottom: 6px; }
    .fmeta { display: flex; flex-direction: column; gap: 2px; width: 160px; flex: none; }
    .fprev { height: 40px; image-rendering: pixelated; background: #000; border-radius: 6px; padding: 0 8px; object-fit: contain; box-shadow: inset 0 0 0 1px rgba(255,255,255,.12); }
    .swatches { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
    .swatch { position: relative; display: inline-flex; }
    .swatch .x { position: absolute; top: -7px; right: -7px; width: 18px; height: 18px; line-height: 16px; padding: 0; border-radius: 50%; border: none; background: var(--pu-outline); color: #fff; font-size: 12px; cursor: pointer; }
    .swatches .add { width: 32px; height: 32px; padding: 0; border-radius: 6px; border: 1px dashed var(--pu-outline); background: transparent; color: inherit; font-size: 16px; cursor: pointer; }
    @media (prefers-reduced-motion: reduce) {
      * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
    }
  `}firstUpdated(){try{let t=localStorage.getItem(pt);this._pendingDraft=t?JSON.parse(t):null}catch{this._pendingDraft=null}this.loadDevices(),this.loadIcons(),this.loadFonts()}updated(){if(this._ro)return;let t=this.renderRoot.querySelector(".stagewrap");t&&(this._ro=new ResizeObserver(e=>{let s=e[0]?.contentRect.width;s&&s>8&&(this.fitPx=Math.max(120,Math.floor(s)))}),this._ro.observe(t))}async loadIcons(){try{let t={type:"pimoroni_unicorn/icons"};this.entryId&&(t.entry_id=this.entryId);let e=await this.hass.callWS(t);this.iconNames=[...e.builtin??[],...e.installed??[]],this.installedIcons=e.installed??[],this.iconThumbs=e.thumbs??{},this.iconDims=e.dims??{},this.deviceIcons=e.device_installed??[]}catch{}}reloadIconsSoon(){this.loadIcons(),window.setTimeout(()=>this.loadIcons(),1500),window.setTimeout(()=>this.loadIcons(),4e3)}iconOversize(t){let e=this.iconDims[t];return!!e&&(e[0]>this.dims[0]||e[1]>this.dims[1])}async pushIconToDevice(t,e=!1){if(this.entryId){if(this.iconOversize(t)&&!e){let s=this.iconDims[t];if(!confirm(`\u26A0\uFE0F TEST MODE \u2014 "${t}" is ${s[0]}\xD7${s[1]}, larger than this device (${this.dims[0]}\xD7${this.dims[1]}).

Pushing an oversize icon can hang or crash the device until it is power-cycled. Only do this to test. Continue?`))return;e=!0}try{await this.hass.callWS({type:"pimoroni_unicorn/icon_push",entry_id:this.entryId,name:t,allow_oversize:e}),this.status=`Installing "${t}" on this device\u2026`,this.reloadIconsSoon()}catch(s){this.status=`Install failed: ${s?.message??s}`}}}async removeIconFromDevice(t){if(this.entryId)try{await this.hass.callWS({type:"pimoroni_unicorn/icon_device_remove",entry_id:this.entryId,name:t}),this.status=`Removed "${t}" from this device.`,this.reloadIconsSoon()}catch(e){this.status=`Remove failed: ${e?.message??e}`}}iconTargetIds(){return this.iconTargets.length?this.iconTargets:this.devices.map(t=>t.entry_id)}toggleIconTarget(t){let e=new Set(this.iconTargetIds());e.has(t)?e.delete(t):e.add(t),this.iconTargets=this.devices.map(s=>s.entry_id).filter(s=>e.has(s))}async installIcon(){let t=parseInt(this.iconCode,10),e=this.iconName.trim();if(!t||!e)return;let s=this.iconTargetIds(),n=await this.hass.callWS({type:"pimoroni_unicorn/icon_install",code:t,name:e,entry_ids:s});if(!n.ok){this.status="Couldn't fetch that LaMetric code.";return}let r=n.sent??[];this.status=r.length?`Installed "${e}" \u2192 ${r.join(", ")}.`:`Saved "${e}" (no devices to push to).`,this.iconCode="",this.iconName="",this.reloadIconsSoon()}async removeIcon(t){confirm(`Delete "${t}" everywhere? This removes it from the library and every device, and can't be undone.`)&&(await this.hass.callWS({type:"pimoroni_unicorn/icon_remove",name:t}),this.status=`Removed icon "${t}".`,this.reloadIconsSoon())}onIconFile(t){let e=t.target.files?.[0];if(!e)return;let s=new FileReader;s.onload=()=>{let n=String(s.result??"");this.iconFilePreview=n,this.iconFileData=n.includes(",")?n.slice(n.indexOf(",")+1):"",this.iconUrl="",this.iconImgName.trim()||(this.iconImgName=e.name.replace(/\.[^.]+$/,"").replace(/[^a-zA-Z0-9_-]/g,"_").slice(0,32))},s.readAsDataURL(e)}async importIconImage(){let t=this.iconImgName.trim(),e=!!this.iconFileData,s=this.iconUrl.trim();if(!t||!e&&!s)return;let n=this.iconTargetIds(),r=this.iconSizeMode==="device"?{max_w:this.dims[0],max_h:this.dims[1]}:this.iconSizeMode==="custom"?{max_w:Math.max(1,this.iconCustomW|0),max_h:Math.max(1,this.iconCustomH|0)}:{};try{let a=e?await this.hass.callWS({type:"pimoroni_unicorn/icon_upload",name:t,data:this.iconFileData,...r,entry_ids:n}):await this.hass.callWS({type:"pimoroni_unicorn/icon_url",name:t,url:s,...r,entry_ids:n}),l=a.sent??[],d=a.w&&a.h?` ${a.w}\xD7${a.h}`:"",g=a.n_total&&a.n_kept&&a.n_kept<a.n_total?` (kept ${a.n_kept} of ${a.n_total} frames to fit the device)`:a.n_kept&&a.n_kept>1?` (${a.n_kept} frames)`:"";this.iconImportNote=`Imported "${t}"${d}${g}.`,this.status=l.length?`Imported "${t}"${d} \u2192 ${l.join(", ")}.`:`Saved "${t}"${d} (no devices to push to).`,this.iconImgName="",this.iconUrl="",this.iconFileData="",this.iconFilePreview="",this.reloadIconsSoon()}catch(a){this.status=`Import failed: ${a?.message??a}`}}async loadFonts(){try{let t={type:"pimoroni_unicorn/fonts"};this.entryId&&(t.entry_id=this.entryId);let e=await this.hass.callWS(t);this.fonts=e.fonts??[],this.refreshFontPreviews()}catch{}}onFontInput(t){this.fontText=t,clearTimeout(this.fontTimer),this.fontTimer=window.setTimeout(()=>this.refreshFontPreviews(),250)}async refreshFontPreviews(){let t={};await Promise.all(this.fonts.map(async e=>{let s=this.fontText.trim()||e.sample;try{let n=await this.hass.callWS({type:"pimoroni_unicorn/font_preview",font:e.name,text:s});t[e.name]=n.png}catch{}})),this.fontPngs=t}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKey),window.addEventListener("beforeunload",this._onBeforeUnload)}disconnectedCallback(){window.removeEventListener("keydown",this._onKey),window.removeEventListener("beforeunload",this._onBeforeUnload),this._ro?.disconnect(),this._ro=void 0,Object.values(this._frameTimers).forEach(t=>clearInterval(t)),this._frameTimers={},clearInterval(this.screenTimer),clearTimeout(this.renderTimer),clearTimeout(this.pushTimer),clearTimeout(this.fontTimer),clearTimeout(this.specTimer),super.disconnectedCallback()}_nudge(t,e){let[s,n]=this.dims;if(this.selected>=0&&this.layout.widgets[this.selected]){let r=this.layout.widgets[this.selected],[a,l]=this.boxDims(this.selected);r.x=Math.max(1-a,Math.min(s-1,r.x+t)),r.y=Math.max(1-l,Math.min(n-1,r.y+e)),this.edited()}}async loadDevices(){let t=await this.hass.callWS({type:"pimoroni_unicorn/devices"});this.devices=t.devices??[],this.devices.length?await this.selectDevice(this.devices[0].entry_id):await this.selectMock(this.model)}async loadCaps(t){let e=await this.hass.callWS({type:"pimoroni_unicorn/capabilities",...t});this.caps=e.widgets??[],this.overlayCaps=e.overlays??[],this.defaultLayout=e.default_layout,this.model=e.model,this.orientation=e.orientation??0,this.dims=e.dims??Ot[this.model]??[53,11],this.loadWidgetThumbs(),await this.refreshStored()}async loadWidgetThumbs(){try{let t=await this.hass.callWS({type:"pimoroni_unicorn/widget_thumbs",model:this.model});this.widgetThumbs=t.thumbs??{}}catch{}}async selectDevice(t){let e=this.devices.find(n=>n.entry_id===t);if(!e||!this.guardDiscard()){this.requestUpdate();return}this.entryId=t,await this.loadCaps({entry_id:t}),this.loadIcons(),this.loadFonts(),this.loadCatalog();let s=e.active_layout?this.stored[e.active_layout]:void 0;this.loadLayout(s??this.defaultLayout),this._applyPendingDraft()}async selectMock(t){if(!this.guardDiscard()){this.requestUpdate();return}this.entryId="",await this.loadCaps({model:t}),this.loadIcons(),this.loadCatalog(),this.loadLayout(this.defaultLayout),this._applyPendingDraft()}async refreshStored(){let t=await this.hass.callWS({type:"pimoroni_unicorn/layouts"});this.stored=t.layouts??{}}loadLayout(t){this.layout=JSON.parse(JSON.stringify(t)),this.layoutName=this.layout.name??"default",this.selected=-1,this.dirty=!1,this.undoStack=[],this.redoStack=[],this.snapshot=JSON.parse(JSON.stringify(this.layout)),this.renderPreview()}guardDiscard(){return!this.dirty||confirm("Discard unsaved changes to this page?")}playFrames(t,e,s){if(window.clearInterval(this._frameTimers[t]),s(e[0]??""),e.length>1){let n=0;this._frameTimers[t]=window.setInterval(()=>{n=(n+1)%e.length,s(e[n])},200)}}async renderPreview(){try{let t=await this.hass.callWS({type:"pimoroni_unicorn/render",model:this.model,layout:this.layout,orientation:this.orientation,weather:this.previewWeather||void 0,entry_id:this.entryId||void 0});this.wboxes=t.boxes??[],this.playFrames("layout",t.frames??(t.png?[t.png]:[]),e=>{this.png=e}),this.status.startsWith("Render failed")&&(this.status="")}catch(t){this.png="",this.status=`Render failed: ${t?.message??t}`}}edited(){this.undoStack=[...this.undoStack.slice(-99),this.snapshot],this.redoStack=[],this.snapshot=JSON.parse(JSON.stringify(this.layout)),this.dirty=!0,this._persistDraft(),this.requestUpdate(),this.scheduleRender()}scheduleRender(){this.renderTimer&&clearTimeout(this.renderTimer),this.renderTimer=window.setTimeout(()=>this.renderPreview(),80),this.live&&this.entryId&&(this.pushTimer&&clearTimeout(this.pushTimer),this.pushTimer=window.setTimeout(()=>this.pushLive(),250))}undo(){if(!this.undoStack.length)return;this.redoStack=[...this.redoStack,this.snapshot];let t=this.undoStack[this.undoStack.length-1];this.undoStack=this.undoStack.slice(0,-1),this.applyHistory(t)}redo(){if(!this.redoStack.length)return;this.undoStack=[...this.undoStack,this.snapshot];let t=this.redoStack[this.redoStack.length-1];this.redoStack=this.redoStack.slice(0,-1),this.applyHistory(t)}applyHistory(t){this.layout=JSON.parse(JSON.stringify(t)),this.snapshot=JSON.parse(JSON.stringify(t)),this.selected>=this.layout.widgets.length&&(this.selected=this.layout.widgets.length-1),this.layoutName=this.layout.name??this.layoutName,this.dirty=!0,this.requestUpdate(),this.scheduleRender()}async pushLive(){let t={...this.layout,name:this.layoutName};await this.hass.callWS({type:"pimoroni_unicorn/push_layout",entry_id:this.entryId,layout:t})}capFor(t){return this.caps.find(e=>e.id===t)}typeOf(t){return t.type??t.id}capForEntry(t){return this.capFor(this.typeOf(t))}get scale(){return this.zoom||Math.max(4,Math.floor(this.fitPx/this.dims[0]))}get pxScale(){let t=window.devicePixelRatio||1;return Math.max(1,Math.round(this.scale*t))/t}zoomBy(t){this.zoom=Math.min(48,Math.max(4,this.scale+t))}onWheel(t){!t.ctrlKey&&!t.metaKey||(t.preventDefault(),this.zoomBy(t.deltaY<0?2:-2))}startPan(t){if(t.target.closest(".box"))return;let e=t.currentTarget;t.preventDefault();let s=t.clientX,n=t.clientY,r=e.scrollLeft,a=e.scrollTop;e.setPointerCapture(t.pointerId),e.classList.add("panning");let l=g=>{e.scrollLeft=r-(g.clientX-s),e.scrollTop=a-(g.clientY-n)},d=g=>{e.releasePointerCapture(g.pointerId),e.classList.remove("panning"),e.removeEventListener("pointermove",l),e.removeEventListener("pointerup",d)};e.addEventListener("pointermove",l),e.addEventListener("pointerup",d)}boxDims(t){let e=this.wboxes[t];if(e)return e;let s=this.layout.widgets[t],n=s?this.capForEntry(s):void 0;return n?[n.w,n.h]:[0,0]}cfgVal(t,e){return t.cfg?.[e]??this.capForEntry(t)?.default_cfg[e]}colorCtl(t,e){return o`<span class="colorctl">
      <input type="color" .value=${ht(t)}
        @input=${s=>e(ut(s.target.value))} />
      <input type="text" class="hexin" .value=${ht(t)} maxlength="7" spellcheck="false" aria-label="Hex colour"
        @change=${s=>e(ut(s.target.value))} />
    </span>`}setCfg(t,e,s){t.cfg={...t.cfg??{},[e]:s},this.edited()}cfgPalette(t,e){let s=this.cfgVal(t,e);return s&&s.length?s.map(n=>[...n]):[this.cfgVal(t,"color")??[255,255,255]]}setCfgColor(t,e,s,n){let r=this.cfgPalette(t,e);r[s]=n,this.setCfg(t,e,r)}addCfgColor(t,e){let s=this.cfgPalette(t,e);s.push([255,255,255]),this.setCfg(t,e,s)}removeCfgColor(t,e,s){let n=this.cfgPalette(t,e);n.length>1&&(n.splice(s,1),this.setCfg(t,e,n))}setName(t,e){let s=e.trim();s?t.name=s:delete t.name,this.edited()}setPos(t,e,s){let[n,r]=this.boxDims(this.selected),[a,l]=this.dims,d=Math.round(s);e==="x"?t.x=Math.max(1-n,Math.min(a-1,d)):t.y=Math.max(1-r,Math.min(l-1,d)),this.edited()}onImgLoad(t){let e=t.target;this.dims=[e.naturalWidth,e.naturalHeight]}startDrag(t,e){e.preventDefault(),this.selected=t;let s=this.layout.widgets[t],[n,r]=this.boxDims(t),a=this.layout.grid??2,[l,d]=this.dims,g=e.clientX,m=e.clientY,v=s.x,b=s.y;e.target.setPointerCapture(e.pointerId);let f=w=>{let E=Math.round((w.clientX-g)/this.pxScale/a)*a,Pt=Math.round((w.clientY-m)/this.pxScale/a)*a;s.x=Math.max(1-n,Math.min(l-1,v+E)),s.y=Math.max(1-r,Math.min(d-1,b+Pt)),this.edited()},x=()=>{window.removeEventListener("pointermove",f),window.removeEventListener("pointerup",x),this.renderPreview()};window.addEventListener("pointermove",f),window.addEventListener("pointerup",x)}addWidget(t){if(!t)return;let e=this.capFor(t),s=new Set(this.layout.widgets.map(r=>r.id)),n;if(e?.multi||s.has(t)){let r=2,a=`${t}-${r}`;for(;s.has(a);)a=`${t}-${++r}`;n={id:a,type:t,name:`${e?.label??t} ${r}`,x:0,y:0,cfg:{}}}else n={id:t,type:t,x:0,y:0,cfg:{}};this.layout.widgets.push(n),this.selected=this.layout.widgets.length-1,this.edited()}removeWidget(t){this.layout.widgets[t]&&(this.layout.widgets.splice(t,1),this.selected=-1,this.edited())}duplicateWidget(t){let e=this.layout.widgets[t];if(!e)return;let s=new Set(this.layout.widgets.map(d=>d.id)),n=e.type??e.id,r=2,a=`${n}-${r}`;for(;s.has(a);)a=`${n}-${++r}`;let l=JSON.parse(JSON.stringify(e));l.id=a,l.x=(e.x??0)+1,l.y=(e.y??0)+1,this.layout.widgets.splice(t+1,0,l),this.selected=t+1,this.edited()}dropWidget(t){let e=this.dragIdx;if(this.dragIdx=-1,e<0||e===t)return;let s=this.layout.widgets,[n]=s.splice(e,1);s.splice(t,0,n),this.selected=s.indexOf(n),this.edited()}moveLayer(t,e){let s=t+e,n=this.layout.widgets;s<0||s>=n.length||([n[t],n[s]]=[n[s],n[t]],this.selected=s,this.edited())}toggleOverlay(t,e){let s=new Set(this.layout.overlays??[]);e?s.add(t):s.delete(t),this.layout.overlays=[...s],this.edited()}async save(){if(!this.layoutName.trim()){this.status="Name the page before saving.";return}this.layout.name=this.layoutName,await this.hass.callWS({type:"pimoroni_unicorn/save_layout",name:this.layoutName,layout:this.layout}),await this.refreshStored(),this.dirty=!1,this._clearDraft(),this.status=`Saved "${this.layoutName}" to the library.`}newPage(){this.guardDiscard()&&(this.loadLayout(this.defaultLayout),this.layoutName="",this.switchTab("layout"))}async editCurrentPage(){if(!this.entryId||!this.guardDiscard())return;let e=((await this.hass.callWS({type:"pimoroni_unicorn/devices"})).devices??[]).find(n=>n.entry_id===this.entryId);await this.refreshStored();let s=e?.active_layout?this.stored[e.active_layout]:void 0;if(!s){this.status="This device has no active page saved in the library yet.";return}this.layoutName=e.active_layout,this.loadLayout(s),this.switchTab("layout"),this.status=`Loaded the device's current page "${e.active_layout}".`}async deployCurrent(){if(this.entryId){if(!this.layoutName.trim()){this.status="Name the page before deploying.";return}this.layout.name=this.layoutName,this.status=`Deploying "${this.layoutName}"\u2026`;try{await this.hass.callWS({type:"pimoroni_unicorn/save_layout",name:this.layoutName,layout:this.layout}),await this.refreshStored();let t=await this.hass.callWS({type:"pimoroni_unicorn/deploy_layout",entry_id:this.entryId,name:this.layoutName,override:!0});this.status=t.ok?`Deployed "${this.layoutName}" (installed any missing widgets/fonts first).`:"Deploy failed.",this.dirty=!1,this._clearDraft()}catch(t){this.status=`Deploy failed: ${t?.message??t}`}}}async deleteLayout(){this.stored[this.layoutName]&&confirm(`Delete page "${this.layoutName}"? This can't be undone.`)&&(await this.hass.callWS({type:"pimoroni_unicorn/delete_layout",name:this.layoutName}),await this.refreshStored(),this.status=`Deleted "${this.layoutName}".`,this.loadLayout(this.defaultLayout))}async deletePage(t,e){confirm(`Delete page "${e}"? This can't be undone.`)&&(await this.hass.callWS({type:"pimoroni_unicorn/delete_layout",name:t}),await this.refreshStored(),await this.loadCatalog(),this.status=`Deleted page "${e}".`)}async deletePlaylist(t,e){confirm(`Delete playlist "${e}"? This can't be undone.`)&&(await this.hass.callWS({type:"pimoroni_unicorn/delete_screenset",name:t}),await this.loadCatalog(),this.status=`Deleted playlist "${e}".`)}renderWidgetEditor(){let t=this.layout.widgets[this.selected];if(!t)return o`<p class="hint">Select a widget to edit.</p>`;let e=this.capForEntry(t);return e?o`
      <h3>${t.name??e.label}</h3>
      ${e.id==="weather"?o`<div class="panelrow"><label>Preview condition</label>
        <select @change=${s=>{this.previewWeather=s.target.value,this.renderPreview()}}>
          <option value="" ?selected=${this.previewWeather===""}>live</option>
          ${Rt.map(([s,n])=>o`<option value=${s} ?selected=${this.previewWeather===s}>${n}</option>`)}
        </select></div>`:""}
      <div class="panelrow"><label>Name</label>
        <input type="text" style="width:160px" placeholder=${e.label} .value=${t.name??""}
          @change=${s=>this.setName(t,s.target.value)} /></div>
      <div class="panelrow">
        <label>X</label><input type="number" style="width:60px" .value=${String(t.x)}
          @change=${s=>this.setPos(t,"x",+s.target.value)} />
        <label>Y</label><input type="number" style="width:60px" .value=${String(t.y)}
          @change=${s=>this.setPos(t,"y",+s.target.value)} />
      </div>
      ${e.cfg_fields.map(s=>{let n=this.cfgVal(t,"color_mode");if(s.key==="speed"&&n!=="rainbow"||s.type==="rgblist"&&n!=="per_char")return"";let r=this.cfgVal(t,"off_mode");if(s.key==="off_brightness"&&r==="colour"||s.key==="off_color"&&r!=="colour")return"";if(s.type==="rgblist"){let a=this.cfgPalette(t,s.key);return o`<div class="panelrow"><label>${s.label??s.key}</label>
            <span class="swatches">
              ${a.map((l,d)=>o`<span class="swatch">
                <input type="color" .value=${ht(l)}
                  @input=${g=>this.setCfgColor(t,s.key,d,ut(g.target.value))} />
                ${a.length>1?o`<button class="x" title="Remove"
                  @click=${()=>this.removeCfgColor(t,s.key,d)}>×</button>`:""}
              </span>`)}
              <button class="add" title="Add colour" @click=${()=>this.addCfgColor(t,s.key)}>+</button>
            </span></div>`}if(s.type==="select")return o`<div class="panelrow"><label>${s.label??s.key}</label>
            <select @change=${a=>this.setCfg(t,s.key,a.target.value)}>
              ${(s.options??[]).map(a=>o`<option ?selected=${this.cfgVal(t,s.key)===a}>${a}</option>`)}
            </select></div>`;if(s.type==="number")return o`<div class="panelrow"><label>${s.label??s.key}</label>
            <input type="number" style="width:60px" min=${s.min??1} max=${s.max??64} step=${s.step??1}
              .value=${String(this.cfgVal(t,s.key))}
              @input=${a=>{let l=a.target.value;l!==""&&!Number.isNaN(+l)&&this.setCfg(t,s.key,+l)}} /></div>`;if(s.type==="bool")return o`<div class="panelrow"><label>${s.label??s.key}</label>
            <input type="checkbox" .checked=${!!this.cfgVal(t,s.key)}
              @change=${a=>this.setCfg(t,s.key,a.target.checked)} /></div>`;if(s.type==="range"){let a=Number(this.cfgVal(t,s.key)??s.max??100);return o`<div class="panelrow"><label>${s.label??s.key}</label>
            <input type="range" min=${s.min??0} max=${s.max??100} step=${s.step??1} .value=${String(a)}
              @input=${l=>this.setCfg(t,s.key,+l.target.value)} />
            <span class="rangeval">${a}</span></div>`}return s.type==="icon"?o`<div class="panelrow"><label>${s.label??s.key}</label>
            <select @change=${a=>this.setCfg(t,s.key,a.target.value)}>
              ${this.iconNames.map(a=>o`<option ?selected=${this.cfgVal(t,s.key)===a}>${a}</option>`)}
            </select></div>`:s.type==="entity"?o`<div class="panelrow"><label>${s.label??s.key}</label>
            <input type="text" style="width:200px" list="pu-entity-list" placeholder="entity id…"
              .value=${String(this.cfgVal(t,s.key)??"")}
              @change=${a=>this.setCfg(t,s.key,a.target.value)} />
            <datalist id="pu-entity-list">
              ${Object.keys(this.hass?.states??{}).map(a=>o`<option value=${a}></option>`)}
            </datalist></div>`:s.type==="text"?o`<div class="panelrow"><label>${s.label??s.key}</label>
            <input type="text" style="width:120px" .value=${String(this.cfgVal(t,s.key)??"")}
              @change=${a=>this.setCfg(t,s.key,a.target.value)} /></div>`:o`<div class="panelrow"><label>${s.label??s.key}</label>
          ${this.colorCtl(this.cfgVal(t,s.key)??[255,255,255],a=>this.setCfg(t,s.key,a))}</div>`})}
      <div class="panelrow"><button class="danger" @click=${()=>this.removeWidget(this.selected)}>Remove widget</button></div>
    `:""}switchTab(t){this.tab=t,t==="market"?this.loadCatalog():t==="edit"?this.previewSpec():t==="screens"&&this.buildScreenPreview()}_appBar(){let t=this.devices.find(e=>e.entry_id===this.entryId);return o`
      <div class="appbar">
        <span class="brand">Pimoroni Unicorn</span>
        <label>Device
          <select @change=${e=>{let s=e.target.value;s===Ht?this.selectMock(this.model):this.selectDevice(s)}}>
            <option value=${Ht} ?selected=${!this.entryId}>Mock (preview only)</option>
            ${this.devices.map(e=>o`<option value=${e.entry_id} ?selected=${e.entry_id===this.entryId}>${e.name}</option>`)}
          </select>
        </label>
        ${this.entryId?o`<span class="chip">${t?.model??this.model}</span>`:o`<label>Model
              <select @change=${e=>this.selectMock(e.target.value)}>
                ${Object.keys(Ot).map(e=>o`<option ?selected=${e===this.model}>${e}</option>`)}
              </select></label>`}
        <span class="chip dim">${this.dims[0]}&times;${this.dims[1]} px</span>
        <span class="grow"></span>
        ${this.dirty?o`<span class="chip warn">unsaved changes</span>`:""}
        ${this.fwManifest?.engine_version?o`<span class="hint">engine v${this.fwManifest.engine_version}</span>`:""}
        <a class="help" href="https://github.com/PineappleEmperor/ha-pimoroni-unicorn#readme" target="_blank" rel="noopener noreferrer" title="Open the documentation in a new tab">Help</a>
      </div>`}render(){return o`
      ${this._appBar()}
      <div class="tabs">
        <button class="tab ${this.tab==="layout"?"on":""}" @click=${()=>this.switchTab("layout")}>Designer</button>
        <button class="tab ${this.tab==="market"?"on":""}" @click=${()=>this.switchTab("market")}>Marketplace</button>
        <button class="tab ${this.tab==="edit"?"on":""}" @click=${()=>this.switchTab("edit")}>Widget editor</button>
        <button class="tab ${this.tab==="paint"?"on":""}" @click=${()=>this.switchTab("paint")}>Icon editor</button>
        <button class="tab ${this.tab==="screens"?"on":""}" @click=${()=>this.switchTab("screens")}>Playlists</button>
      </div>
      ${this.status?o`<div class="status ${/fail/i.test(this.status)?"err":""}" role="status" aria-live="polite">${this.status}</div>`:""}
      ${this.devices.length?"":o`<div class="firstrun">No Pimoroni Unicorn device connected yet — you're previewing on a mock ${this.model}. Add one under <strong>Settings → Devices &amp; Services</strong>, then pick it above to install content and push live.</div>`}
      ${this.tab==="market"?this._marketplaceView():this.tab==="edit"?this._editorView():this.tab==="paint"?this._paintView():this.tab==="screens"?this._screensView():this._layoutView()}
    `}_layoutView(){let t=this.pxScale,e=new Set(this.layout.widgets.map(a=>this.typeOf(a))),s=this.caps.filter(a=>a.multi||!e.has(a.id)),n=new Set(this.layout.overlays??[]),r=`background-image:linear-gradient(to right,rgba(255,255,255,.10) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.10) 1px,transparent 1px);background-size:${t}px ${t}px`;return o`
      <div class="bar">
        <div class="group">
          <label>Page
            <select @change=${a=>{let l=a.target.value;l==="__new__"?this.newPage():this.guardDiscard()?this.loadLayout(this.stored[l]):this.requestUpdate()}}>
              ${Object.keys(this.stored).map(a=>o`<option ?selected=${a===this.layoutName}>${a}</option>`)}
              <option value="__new__">+ new page</option>
            </select>
          </label>
          <label>Name <input .value=${this.layoutName} @input=${a=>this.layoutName=a.target.value} /></label>
        </div>
        <div class="group">
          <button class="secondary" @click=${this.undo} ?disabled=${!this.undoStack.length} title="Undo (Ctrl+Z)">↶ Undo</button>
          <button class="secondary" @click=${this.redo} ?disabled=${!this.redoStack.length} title="Redo (Ctrl+Shift+Z)">↷ Redo</button>
        </div>
        <div class="group" role="group" aria-label="Library actions">
          <span class="grouplabel">Library</span>
          <button @click=${this.save} title="Save this page to the library (no device needed)">Save</button>
          <button class="secondary" @click=${this.exportLayout} title="Copy this page's JSON to clipboard to share or import elsewhere">Export JSON</button>
          ${this.stored[this.layoutName]?o`<button class="secondary" @click=${()=>this.publishLayout(!0)} title="List this page in the marketplace">Publish</button>`:""}
          ${this.stored[this.layoutName]?o`<button class="danger" @click=${this.deleteLayout}>Delete</button>`:""}
        </div>
        <div class="group" role="group" aria-label="Device actions">
          <span class="grouplabel">Device</span>
          <button class="secondary" @click=${this.editCurrentPage} ?disabled=${!this.entryId} title=${this.entryId?"Load the page currently active on the device to edit it":"Select a device first"}>Edit current</button>
          <button @click=${this.deployCurrent} ?disabled=${!this.entryId} title=${this.entryId?"Save, install any missing widgets/fonts, then push to the selected device":"Select a device to deploy"}>Deploy</button>
        </div>
        <span class="grow"></span>
        <div class="group">
          <label>Snap
            <select @change=${a=>{this.layout.grid=+a.target.value,this.edited()}}>
              ${[1,2,4].map(a=>o`<option ?selected=${(this.layout.grid??2)===a}>${a}</option>`)}
            </select> px</label>
          <label>Zoom
            <button class="zbtn" @click=${()=>this.zoomBy(-2)} title="Zoom out" aria-label="Zoom out">&minus;</button>
            <input type="range" min="4" max="48" .value=${String(this.scale)}
              @input=${a=>this.zoom=+a.target.value} />
            <button class="zbtn" @click=${()=>this.zoomBy(2)} title="Zoom in" aria-label="Zoom in">+</button>
          </label>
          <label>Weather
            <select @change=${a=>{this.previewWeather=a.target.value,this.renderPreview()}}>
              <option value="" ?selected=${this.previewWeather===""}>live</option>
              ${Rt.map(([a,l])=>o`<option value=${a} ?selected=${this.previewWeather===a}>${l}</option>`)}
            </select></label>
          <label><input type="checkbox" .checked=${this.wireframe} @change=${a=>this.wireframe=a.target.checked} /> wireframe</label>
          <label><input type="checkbox" .checked=${this.locked} @change=${a=>this.locked=a.target.checked} /> lock</label>
          <label><input type="checkbox" .checked=${this.live} ?disabled=${!this.entryId} @change=${a=>this.live=a.target.checked} /> live push</label>
        </div>
      </div>

      <div class="wrap">
        <div class="col">
          <div class="stagewrap" @wheel=${this.onWheel} @pointerdown=${this.startPan}>
            <div class="stage" style=${`width:${this.dims[0]*t}px;height:${this.dims[1]*t}px`}>
              ${this.png?o`<img src="data:image/png;base64,${this.png}" alt="Live layout preview" width=${this.dims[0]*t} height=${this.dims[1]*t} @load=${this.onImgLoad} />`:""}
              <div class="grid" style=${r}></div>
              ${this.locked?"":o`<div class="boxes ${this.wireframe?"wf":""}">${this.layout.widgets.map((a,l)=>{if(!this.capForEntry(a)||a.enabled===!1)return"";let[d,g]=this.boxDims(l);return o`<div class="box ${l===this.selected?"sel":""}"
                  style=${`left:${a.x*t}px;top:${a.y*t}px;width:${d*t}px;height:${g*t}px`}
                  @pointerdown=${m=>this.startDrag(l,m)}>
                  <span class="tag">${a.name??this.capForEntry(a)?.label??a.id}</span></div>`})}</div>`}
            </div>
          </div>
        </div>

        <div class="col">
          <h3>Layers</h3>
          <ul class="wlist">
            ${[...this.layout.widgets.keys()].reverse().map(a=>{let l=this.layout.widgets[a];return o`
              <li class="${a===this.selected?"sel":""} ${a===this.dragIdx?"dragging":""} ${a===this.dragOverIdx&&a!==this.dragIdx?"dragover":""}"
                  tabindex="0" role="option" aria-selected=${a===this.selected}
                  @click=${()=>this.selected=a}
                  @keydown=${d=>{d.key==="Enter"||d.key===" "?(d.preventDefault(),d.stopPropagation(),this.selected=a):d.altKey&&d.key==="ArrowUp"?(d.preventDefault(),d.stopPropagation(),this.moveLayer(a,1)):d.altKey&&d.key==="ArrowDown"&&(d.preventDefault(),d.stopPropagation(),this.moveLayer(a,-1))}}
                  @dragover=${d=>{d.preventDefault(),d.dataTransfer&&(d.dataTransfer.dropEffect="move"),this.dragOverIdx=a}}
                  @dragleave=${()=>{this.dragOverIdx===a&&(this.dragOverIdx=-1)}}
                  @drop=${d=>{d.preventDefault(),this.dropWidget(a),this.dragOverIdx=-1}}>
                <span class="drag" title="Drag to reorder (or focus the row and use Alt+↑/↓)" aria-hidden="true" draggable="true"
                  @dragstart=${d=>{if(this.dragIdx=a,d.dataTransfer){d.dataTransfer.effectAllowed="move",d.dataTransfer.setData("text/plain",String(a));let g=d.target.closest("li");g&&d.dataTransfer.setDragImage(g,0,0)}}}
                  @dragend=${()=>{this.dragIdx=-1,this.dragOverIdx=-1}}>⣿</span>
                <input type="checkbox" .checked=${l.enabled!==!1} title="Show / hide"
                  aria-label="Show or hide ${l.name??this.capForEntry(l)?.label??l.id}"
                  @click=${d=>{d.stopPropagation(),l.enabled=d.target.checked,this.edited()}} />
                <span class="grow">${l.name??this.capForEntry(l)?.label??l.id}</span>
                <button class="wlx" title="Duplicate layer" aria-label="Duplicate layer"
                  @click=${d=>{d.stopPropagation(),this.duplicateWidget(a)}}>⧉</button>
                <button class="wlx" title="Delete layer" aria-label="Delete layer"
                  @click=${d=>{d.stopPropagation(),this.removeWidget(a)}}>×</button>
              </li>`})}
          </ul>
          ${this.layout.widgets.length>1?o`<p class="hint">Top of the list draws on top.</p>`:""}
          ${s.length?o`<div class="addgrid">
            ${s.map(a=>o`<button class="addtile" @click=${()=>this.addWidget(a.id)} title="Add ${a.label}">
              ${this.widgetThumbs[a.id]?o`<img class="addthumb" src="data:image/png;base64,${this.widgetThumbs[a.id]}" alt="" />`:o`<div class="addthumb empty"></div>`}
              <span class="addtile-label">${a.label}</span>
            </button>`)}
          </div>`:""}
          <h3>Overlays</h3>
          ${this.overlayCaps.map(a=>o`<div class="panelrow"><label>
            <input type="checkbox" .checked=${n.has(a.id)} @change=${l=>this.toggleOverlay(a.id,l.target.checked)} /> ${a.label}</label></div>`)}
          <h3>Selected</h3>
          ${this.renderWidgetEditor()}
        </div>
      </div>
    `}async loadCatalog(){if(await this.loadContent(),!this.entryId){this.catalog=[],this.fwManifest=null;return}let t=await this.hass.callWS({type:"pimoroni_unicorn/catalog",entry_id:this.entryId});this.catalog=t.widgets??[];let e=await this.hass.callWS({type:"pimoroni_unicorn/fw_manifest",entry_id:this.entryId});this.fwManifest=e.manifest??null,this._reconcileBusy()}_reconcileBusy(){if(!Object.keys(this.busyUnits).length)return;let t={...this.busyUnits},e=!1;for(let[s,n]of Object.entries(this.busyUnits)){let r=this.catalog.find(l=>l.id===s);(n==="Installing"?r?.status==="installed":!r||r.status==="not_installed")&&(delete t[s],e=!0)}e&&(this.busyUnits=t)}_setBusy(t,e){let s={...this.busyUnits};e?s[t]=e:delete s[t],this.busyUnits=s}async loadContent(){let t=this.entryId?{entry_id:this.entryId}:{},e=await this.hass.callWS({type:"pimoroni_unicorn/content_catalog",...t});this.activePage=e.active_page??null,this.contentLayouts=e.layouts??[],this.contentScreensets=e.screensets??[]}async deployLayout(t,e){if(!this.entryId){this.status="Select a device to deploy.";return}if(!(!e&&!confirm(`"${t}" isn't built for this device's model. Deploy anyway?`))){this.status=`Deploying "${t}"\u2026`;try{let s=await this.hass.callWS({type:"pimoroni_unicorn/deploy_layout",entry_id:this.entryId,name:t,override:!e});this.status=s.ok?`Deployed "${t}" (installing any missing widgets/fonts first).`:"Deploy failed."}catch(s){this.status=`Deploy failed: ${s?.message??s}`}}}async deployScreenset(t,e){if(!this.entryId){this.status="Select a device to deploy.";return}if(!(!e&&!confirm(`"${t}" isn't built for this device's model. Deploy anyway?`))){this.status=`Deploying "${t}"\u2026`;try{let s=await this.hass.callWS({type:"pimoroni_unicorn/deploy_screenset",entry_id:this.entryId,name:t,override:!e});this.status=s.ok?`Deployed screen set "${t}".`:"Deploy failed."}catch(s){this.status=`Deploy failed: ${s?.message??s}`}}}async exportLayout(){let t={...this.layout,name:this.layoutName,model:this.model},e=JSON.stringify(t,null,2);try{await navigator.clipboard.writeText(e),this.status=`Copied "${this.layoutName}" JSON (${this.model}) to clipboard.`}catch{let s=document.createElement("a");s.href=URL.createObjectURL(new Blob([e],{type:"application/json"})),s.download=`${this.layoutName||"layout"}.json`,s.click(),URL.revokeObjectURL(s.href),this.status=`Downloaded "${this.layoutName}.json".`}}async publishLayout(t){if(!this.stored[this.layoutName]){this.status="Save the layout first, then publish.";return}await this.hass.callWS({type:"pimoroni_unicorn/publish_layout",name:this.layoutName,published:t}),this.status=t?`Published "${this.layoutName}" to the marketplace.`:`Unpublished "${this.layoutName}".`,this.loadContent()}async saveScreenset(){if(!this.screenLayouts.length){this.status="Add at least one screen first.";return}let t=prompt("Name this screen set:");t&&(await this.hass.callWS({type:"pimoroni_unicorn/save_screenset",name:t,screenset:{label:t,layouts:this.screenLayouts,dwell:this.screenDwell,transition:this.screenTransition,triggers:[]}}),this.status=`Saved screen set "${t}".`,this.loadContent())}reloadCatalogSoon(){for(let t of[8e3,15e3,25e3])setTimeout(()=>this.loadCatalog(),t)}async installFont(t){if(this.entryId)try{await this.hass.callWS({type:"pimoroni_unicorn/font_install",entry_id:this.entryId,font:t}),this.status=`Installing font ${t}\u2026`;for(let e of[2e3,5e3])setTimeout(()=>this.loadFonts(),e)}catch(e){this.status=`Font install failed: ${e?.message??e}`}}async installWidget(t){if(confirm(`Install "${t}" on the device? It will reboot (~20s) and briefly go dark.`)){this._setBusy(t,"Installing");try{await this.hass.callWS({type:"pimoroni_unicorn/fw_install",entry_id:this.entryId,widget_id:t}),this.status=`Installing ${t}\u2026 the device will reboot and reconnect.`,this.reloadCatalogSoon(),this._busyTimeout(t)}catch(e){this._setBusy(t,null),this.status=`Install failed: ${e?.message??e}`}}}async removeWidgetUnit(t){if(confirm(`Remove "${t}" from the device? It will reboot (~20s) and briefly go dark.`)){this._setBusy(t,"Removing");try{await this.hass.callWS({type:"pimoroni_unicorn/fw_remove",entry_id:this.entryId,widget_id:t}),this.status=`Removing ${t}\u2026 the device will reboot and reconnect.`,this.reloadCatalogSoon(),this._busyTimeout(t)}catch(e){this._setBusy(t,null),this.status=`Remove failed: ${e?.message??e}`}}}_busyTimeout(t){window.setTimeout(()=>{this.busyUnits[t]&&(this._setBusy(t,null),this.status=`"${t}" didn't confirm \u2014 check the device is powered and back on Wi-Fi, then Refresh.`)},3e4)}_thumb(t){return t?o`<img class="thumb" alt="" src="data:image/png;base64,${t}" />`:o`<div class="thumb empty"></div>`}_mhead(){return o`<div class="mhead"><span>Preview</span><span>Name</span><span>Dependencies</span><span>Status</span><span></span></div>`}_section(t,e,s,n){let r=this.sectionsOpen[t]!==!1,a=()=>{this.sectionsOpen={...this.sectionsOpen,[t]:!r}};return o`<div class="section">
      <div class="shead" role="button" tabindex="0" aria-expanded=${r}
        @click=${a}
        @keydown=${l=>{(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),a())}}>
        <svg class="chev ${r?"open":""}" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /></svg>
        <span class="stitle">${e}</span>
        <span class="chip dim">${s}</span>
      </div>
      ${r?n:""}
    </div>`}_contentRow(t,e){let s=e==="layout"&&!!this.activePage&&t.id===this.activePage;return o`<div class="mrow">
      ${this._thumb(t.thumb)}
      <div class="cell-name">${t.label}
        ${t.compat?.length?o`<span class="hint">[${t.compat.join("/")}]</span>`:""}
        ${e==="screenset"?o`<span class="hint">${t.screens} page(s)</span>`:""}</div>
      <div class="hint">${t.requires?.length?o`<span title=${t.requires.join(", ")}>${t.requires.length} dep(s)</span>`:"\u2014"}</div>
      <div class="badges">${s?o`<span class="badge ok">on device</span>`:""}${t.compatible?o`<span class="badge ok">compatible</span>`:o`<span class="badge warn">other model</span>`}</div>
      <div class="cell-action"><button ?disabled=${!this.entryId} title=${this.entryId?"":"Select a device to deploy"}
        @click=${()=>e==="layout"?this.deployLayout(t.id,t.compatible):this.deployScreenset(t.id,t.compatible)}>${s?"Re-deploy":"Deploy"}</button>
        <button class="danger" title=${e==="layout"?"Delete this page from the library":"Delete this playlist"}
          @click=${()=>e==="layout"?this.deletePage(t.id,t.label):this.deletePlaylist(t.id,t.label)}>Delete</button></div>
    </div>`}_marketplaceView(){let t=this.showAllContent,e=this.contentLayouts.filter(a=>t||a.compatible),s=this.contentScreensets.filter(a=>t||a.compatible),n={installed:"ok",outdated:"warn",not_installed:""},r={installed:"installed",outdated:"update available",not_installed:"not installed"};return o`
      <div class="bar">
        <label><input type="checkbox" .checked=${this.showAllContent}
          @change=${a=>{this.showAllContent=a.target.checked}} /> show all models</label>
        <span class="grow"></span>
        <button class="secondary" @click=${this.loadCatalog}>Refresh</button>
      </div>

      ${this._section("pages","Pages",e.length,o`
        <div class="panelrow"><button @click=${this.newPage} title="Start a new page in the Designer">+ New page</button></div>
        ${e.length?o`<div class="mtable">${this._mhead()}${e.map(a=>this._contentRow(a,"layout"))}</div>`:o`<p class="hint">No published pages${t?"":" for this device"} yet. Create one above, then Publish it from the Designer.</p>`}`)}

      ${this._section("playlists","Playlists",s.length,s.length?o`<div class="mtable">${this._mhead()}${s.map(a=>this._contentRow(a,"screenset"))}</div>`:o`<p class="hint">No playlists${t?"":" for this device"}. Compose one on the Playlists tab.</p>`)}

      ${this._section("widgets","Widgets & fonts",this.catalog.length,this.entryId?o`<div class="mtable">${this._mhead()}
            ${this.catalog.map(a=>o`<div class="mrow">
              ${this._thumb(a.thumb)}
              <div class="cell-name">${a.label}</div>
              <div class="hint">${a.requires?.length?o`<span title=${a.requires.join(", ")}>${a.requires.length} dep(s)</span>`:"\u2014"}</div>
              <div><span class="badge ${n[a.status]??""}">${r[a.status]??a.status}</span></div>
              <div class="cell-action">${this.busyUnits[a.id]?o`<span class="badge working">${this.busyUnits[a.id]}…</span>`:a.status==="installed"?o`<button class="danger" @click=${()=>this.removeWidgetUnit(a.id)}>Remove</button>`:o`<button @click=${()=>this.installWidget(a.id)}>${a.status==="outdated"?"Update":"Install"}</button>`}</div>
            </div>`)}
          </div>`:o`<p class="hint">Select a device to manage installed widgets.</p>`)}

      ${this._section("icons","Icons",this.installedIcons.length,o`
        <p class="hint">Built-in icons ship with the engine. Add LaMetric gallery icons by code, then choose which devices to install them on.</p>
        <div class="panelrow">
          ${this.iconCode?o`<img class="iconprev" alt=""
            src="https://developer.lametric.com/content/apps/icon_thumbs/${this.iconCode}"
            @load=${a=>a.target.style.visibility="visible"}
            @error=${a=>a.target.style.visibility="hidden"} />`:o`<div class="iconprev empty"></div>`}
          <div class="grow">
            <div class="panelrow">
              <label>LaMetric code</label>
              <input type="number" style="width:100px" .value=${this.iconCode}
                @input=${a=>{this.iconCode=a.target.value}} />
              <label>Name</label>
              <input style="width:120px" .value=${this.iconName}
                @input=${a=>{this.iconName=a.target.value}} />
            </div>
            ${this.devices.length?o`<div class="panelrow">
              <label>Install on</label>
              <span class="targets">
                ${this.devices.map(a=>o`<label class="chk">
                  <input type="checkbox" ?checked=${this.iconTargetIds().includes(a.entry_id)}
                    @change=${()=>this.toggleIconTarget(a.entry_id)} />${a.name}</label>`)}
              </span>
            </div>`:""}
            <div class="panelrow">
              <button ?disabled=${!this.iconCode||!this.iconName.trim()||this.devices.length>0&&this.iconTargetIds().length===0}
                @click=${this.installIcon}>Add</button>
            </div>
          </div>
        </div>
        <p class="hint">Or import your own image or animation — PNG, GIF or APNG. It’s auto-fit to your display (aspect kept, never upscaled) and animations play frame-by-frame, up to a full-screen animation. Large or long clips are trimmed to fit device memory. Uses the “Install on” selection above.</p>
        <div class="panelrow">
          ${this.iconFilePreview?o`<img class="iconprev" alt="" src=${this.iconFilePreview} />`:o`<div class="iconprev empty"></div>`}
          <div class="grow">
            <div class="panelrow">
              <label>Image file</label>
              <input type="file" accept="image/png,image/gif,image/apng,image/webp"
                @change=${this.onIconFile} />
            </div>
            <div class="panelrow">
              <label>or URL</label>
              <input style="width:220px" placeholder="https://…/animation.gif" .value=${this.iconUrl}
                @input=${a=>{this.iconUrl=a.target.value,this.iconFileData="",this.iconFilePreview=""}} />
            </div>
            <div class="panelrow">
              <label>Size</label>
              <select @change=${a=>{this.iconSizeMode=a.target.value}}>
                <option value="device" ?selected=${this.iconSizeMode==="device"}>Device screen (${this.dims[0]}×${this.dims[1]})</option>
                <option value="native" ?selected=${this.iconSizeMode==="native"}>Native (keep source)</option>
                <option value="custom" ?selected=${this.iconSizeMode==="custom"}>Custom</option>
              </select>
              ${this.iconSizeMode==="custom"?o`
                <input type="number" min="1" max="53" style="width:56px" .value=${String(this.iconCustomW)}
                  @input=${a=>{this.iconCustomW=parseInt(a.target.value,10)||1}} />
                <span>×</span>
                <input type="number" min="1" max="32" style="width:56px" .value=${String(this.iconCustomH)}
                  @input=${a=>{this.iconCustomH=parseInt(a.target.value,10)||1}} />`:""}
            </div>
            <div class="panelrow">
              <label>Name</label>
              <input style="width:120px" .value=${this.iconImgName}
                @input=${a=>{this.iconImgName=a.target.value}} />
              <button ?disabled=${!this.iconImgName.trim()||!this.iconFileData&&!this.iconUrl.trim()||this.devices.length>0&&this.iconTargetIds().length===0}
                @click=${this.importIconImage}>Import</button>
            </div>
            ${this.iconImportNote?o`<p class="hint">${this.iconImportNote}</p>`:""}
          </div>
        </div>
        ${this.entryId?o`<p class="hint">“Install on device” / “Remove from device” affect only the selected device. “Delete everywhere” removes the icon from the library and every device.</p>`:o`<p class="hint">Select a device above to install or remove these on a specific device. “Delete everywhere” removes an icon from the library and every device.</p>`}
        ${this.installedIcons.length?this.installedIcons.map(a=>{let l=this.deviceIcons.includes(a);return o`<div class="iconrow">
              ${this.iconThumbs[a]?o`<img class="iconthumb" alt="" src="data:image/gif;base64,${this.iconThumbs[a]}" />`:o`<div class="iconthumb empty"></div>`}
              <span class="grow">${a}${this.iconDims[a]?o` <span class="hint">${this.iconDims[a][0]}×${this.iconDims[a][1]}</span>`:""}
                ${this.entryId&&this.iconOversize(a)?o`<span class="badge warn" title="Larger than this device (${this.dims[0]}×${this.dims[1]}) — won't fit and may hang it">too big for this device</span>`:""}</span>
              ${this.entryId?l?o`<span class="badge ok">on this device</span>
                      <button class="secondary" title="Take this icon off the selected device (stays in the library)"
                        @click=${()=>this.removeIconFromDevice(a)}>Remove from device</button>`:this.iconOversize(a)?o`<button class="danger" title="This icon is larger than the device screen. Pushing it is for testing only and may hang the device."
                        @click=${()=>this.pushIconToDevice(a)}>Test on device ⚠</button>`:o`<button class="secondary" title="Push this icon to the selected device"
                        @click=${()=>this.pushIconToDevice(a)}>Install on device</button>`:""}
              <button class="danger" title="Delete from the library and every device"
                @click=${()=>this.removeIcon(a)}>Delete everywhere</button></div>`}):o`<p class="hint">No custom icons installed yet.</p>`}
      `)}

      ${this._section("fonts","Fonts",this.fonts.length,o`
        <p class="hint">Type below to preview live in every font. Digit fonts (clock faces) show only numerals; alpha fonts cover A–Z. Fonts install automatically with any widget that needs them, or install one directly onto the selected device here (no reboot).</p>
        <div class="panelrow">
          <label>Preview text</label>
          <input style="width:220px" placeholder="type to preview…" .value=${this.fontText}
            @input=${a=>this.onFontInput(a.target.value)} />
        </div>
        ${[...this.fonts].sort((a,l)=>a.h-l.h||a.w-l.w||a.label.localeCompare(l.label)).map(a=>o`<div class="frow">
          <div class="fmeta"><span class="cell-name">${a.label}</span>
            <span class="hint">${a.kind==="digits"?"digits":"A\u2013Z 0\u20139"} · ${a.w}×${a.h}</span></div>
          ${this.fontPngs[a.name]?o`<img class="fprev" alt="" src="data:image/png;base64,${this.fontPngs[a.name]}" />`:o`<div class="fprev empty"></div>`}
          ${a.builtin?o`<span class="badge ok">built-in</span>`:this.entryId?a.installed?o`<span class="badge ok">installed</span>`:o`<button @click=${()=>this.installFont(a.name)}>Install</button>`:""}
        </div>`)}
      `)}
      <p class="hint">Deploying a page installs any widgets/fonts it needs over the air first, then pushes it; the device reboots if files changed.</p>
    `}onSpecInput(t){this.specText=t,clearTimeout(this.specTimer),this.specTimer=window.setTimeout(()=>this.previewSpec(),400)}async previewSpec(){let t;try{t=JSON.parse(this.specText)}catch(e){this.specError=`JSON: ${e.message}`;return}try{let e=await this.hass.callWS({type:"pimoroni_unicorn/widget_preview",model:this.model,spec:t});this.playFrames("spec",e.frames??(e.png?[e.png]:[]),s=>{this.specPng=s}),this.specError=""}catch(e){this.specError=e?.message??String(e)}}async importSpec(t){try{let e=await this.hass.callWS({type:"pimoroni_unicorn/widget_import",text:t});this.specText=JSON.stringify(e.spec,null,2),this.specError="",this.previewSpec()}catch(e){this.specError=e?.message??String(e)}}async saveSpec(){let t;try{t=JSON.parse(this.specText)}catch(e){this.specError=`JSON: ${e.message}`;return}try{let e=await this.hass.callWS({type:"pimoroni_unicorn/widget_save",spec:t});this.specError="",this.status=`Saved custom widget "${e.id}". Install it from the Marketplace tab.`}catch(e){this.specError=e?.message??String(e)}}parsedSpec(){try{return JSON.parse(this.specText)}catch{return null}}writeSpec(t){this.specText=JSON.stringify(t,null,2),this.specError="",clearTimeout(this.specTimer),this.specTimer=window.setTimeout(()=>this.previewSpec(),120)}setSpecField(t,e){let s=this.parsedSpec();s&&(s[t]=e,this.writeSpec(s))}setOpField(t,e,s){let n=this.parsedSpec();if(!n||!Array.isArray(n.draw))return;let r=n.draw[t]??{};n.draw[t]=e==="op"?{op:s,x:r.x??0,y:r.y??0}:{...r,[e]:s},this.writeSpec(n)}addOp(t){let e=this.parsedSpec()??{};e.draw=[...e.draw??[],{op:t,x:0,y:0}],this.writeSpec(e)}removeOp(t){let e=this.parsedSpec();!e||!Array.isArray(e.draw)||(e.draw.splice(t,1),this.writeSpec(e))}_opField(t,e,s,n){let r=Ft[s]?.hint,a=o`<span class="flabel">${de(s)}</span>`,l;return n==="rgb"?l=this.colorCtl(t[s]??[255,255,255],d=>this.setOpField(e,s,d)):n==="num"?l=o`<input type="number" style="width:64px" .value=${String(t[s]??0)} @change=${d=>this.setOpField(e,s,+d.target.value)} />`:n==="icon"?l=o`<select @change=${d=>this.setOpField(e,s,d.target.value)}>
        ${this.iconNames.map(d=>o`<option ?selected=${t[s]===d}>${d}</option>`)}</select>`:s==="bind"?l=o`<input type="text" style="width:140px" list="pu-bind-list" placeholder="solar…"
        .value=${String(t[s]??"")} @change=${d=>this.setOpField(e,s,d.target.value)} />`:s==="fmt"?l=o`<input type="text" style="width:96px" placeholder="{:.1f}"
        .value=${String(t[s]??"")} @change=${d=>this.setOpField(e,s,d.target.value)} />
        ${["{}","{:.0f}","{:.1f}","{}%","{:.1f}\xB0"].map(d=>o`<button class="fmtchip" title="Use ${d}" @click=${()=>this.setOpField(e,"fmt",d)}>${d}</button>`)}`:l=o`<input type="text" style="width:120px" .value=${String(t[s]??"")} @change=${d=>this.setOpField(e,s,d.target.value)} />`,o`${a}<span class="fcell">${l}${r?o`<span class="fhint">${r}</span>`:""}</span>`}_opEditor(t,e){let s=X[t.op]??{label:t.op,desc:""};return o`<div class="opcard">
      <div class="ophead">
        <span class="optitle">${s.label}</span>
        <select title="Change op type" @change=${n=>this.setOpField(e,"op",n.target.value)}>
          ${Wt.map(n=>o`<option value=${n} ?selected=${n===t.op}>${X[n]?.label??n}</option>`)}</select>
        <span class="grow"></span>
        <button class="danger zbtn" title="Remove op" @click=${()=>this.removeOp(e)}>✕</button>
      </div>
      ${s.desc?o`<p class="opdesc">${s.desc}</p>`:""}
      <div class="fieldgrid">
        <span class="flabel">Position</span>
        <span class="fcell">
          <label class="fhint">X</label><input type="number" style="width:64px" .value=${String(t.x??0)} @change=${n=>this.setOpField(e,"x",+n.target.value)} />
          <label class="fhint">Y</label><input type="number" style="width:64px" .value=${String(t.y??0)} @change=${n=>this.setOpField(e,"y",+n.target.value)} />
        </span>
        ${(ce[t.op]??[]).map(([n,r])=>this._opField(t,e,n,r))}
      </div>
    </div>`}_formView(){let t=this.parsedSpec();return t?o`
      <datalist id="pu-bind-list">
        ${zt.map(e=>o`<option value=${e}></option>`)}
        ${Object.keys(this.hass?.states??{}).map(e=>o`<option value=${e}></option>`)}
      </datalist>
      <div class="fieldgrid">
        <span class="flabel">ID</span><span class="fcell"><input style="width:140px" .value=${t.id??""} @change=${e=>this.setSpecField("id",e.target.value)} /><span class="fhint">unique id, e.g. my_widget</span></span>
        <span class="flabel">Label</span><span class="fcell"><input style="width:140px" .value=${t.label??""} @change=${e=>this.setSpecField("label",e.target.value)} /></span>
        <span class="flabel">Size</span><span class="fcell">
          <label class="fhint">W</label><input type="number" style="width:64px" .value=${String(t.w??"")} @change=${e=>this.setSpecField("w",+e.target.value)} />
          <label class="fhint">H</label><input type="number" style="width:64px" .value=${String(t.h??"")} @change=${e=>this.setSpecField("h",+e.target.value)} />
        </span>
      </div>
      <h3>Draw ops</h3>
      <p class="hint">Each op draws one element, in order. Available data: ${zt.join(", ")} (unknown binds preview as 123).</p>
      ${(t.draw??[]).map((e,s)=>this._opEditor(e,s))}
      <p class="hint">Add an op:</p>
      <div class="addchips">
        ${Wt.map(e=>o`<button class="addchip" title=${X[e]?.desc??""} @click=${()=>this.addOp(e)}>+ ${X[e]?.label??e}</button>`)}
      </div>
    `:o`<p class="status err">Spec isn't valid JSON — switch to YAML / JSON to fix it.</p>`}_paintView(){return o`<div class="pane">
      <p class="hint">Paint an icon at this device's resolution, or load an image and edit it. Black = off (checkerboard). Saves to your icon library.</p>
      <pixel-editor .w=${this.dims[0]} .h=${this.dims[1]}
        .decode=${this._iconDecode}
        @save=${t=>this._saveEditorIcon(t.detail)}></pixel-editor>
    </div>`}async _saveEditorIcon(t){let e=t.dataUrl.slice(t.dataUrl.indexOf(",")+1),s=this.iconTargetIds();try{let r=(await this.hass.callWS({type:"pimoroni_unicorn/icon_upload",name:t.name,data:e,max_w:t.w,max_h:t.h,entry_ids:s})).sent??[];this.status=r.length?`Saved "${t.name}" \u2192 ${r.join(", ")}.`:`Saved "${t.name}" (no devices to push to).`,this.reloadIconsSoon()}catch(n){this.status=`Save failed: ${n?.message??n}`}}_editorView(){let t=Math.max(6,Math.floor(dt/this.dims[0]));return o`
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
          ${this.editMode==="form"?this._formView():o`<textarea class="spec" .value=${this.specText}
                @input=${e=>this.onSpecInput(e.target.value)}></textarea>`}
          <div class="panelrow">
            <button @click=${this.saveSpec}>Save custom</button>
            <button class="secondary" @click=${()=>{let e=prompt("Paste YAML or JSON widget spec:");e&&this.importSpec(e)}}>Import…</button>
          </div>
          ${this.specError?o`<div class="status err">${this.specError}</div>`:o`<div class="hint">binds: solar, soc, consumption, co2… (unknown binds preview as 123)</div>`}
        </div>
        <div class="col">
          <div class="stage" style=${`width:${this.dims[0]*t}px;height:${this.dims[1]*t}px`}>
            ${this.specPng?o`<img src="data:image/png;base64,${this.specPng}" alt="Widget preview" width=${this.dims[0]*t} height=${this.dims[1]*t} />`:""}
          </div>
        </div>
      </div>
    `}toggleScreen(t,e){this.screenLayouts=e?[...this.screenLayouts,t]:this.screenLayouts.filter(s=>s!==t),this.buildScreenPreview()}moveScreen(t,e){let s=[...this.screenLayouts],n=s.indexOf(t),r=n+e;n<0||r<0||r>=s.length||([s[n],s[r]]=[s[r],s[n]],this.screenLayouts=s,this.buildScreenPreview())}async buildScreenPreview(){clearInterval(this.screenTimer);let t={};await Promise.all(this.screenLayouts.map(async e=>{let s=this.stored[e];if(s)try{let n=await this.hass.callWS({type:"pimoroni_unicorn/render",model:this.model,layout:s});t[e]=n.png}catch{}})),this.screenPngs=t,this.screenIdx=0,this.screenOpacity=1,this.screenLayouts.length>1&&this.screenDwell>0&&(this.screenTimer=window.setInterval(()=>this._advancePreview(),this.screenDwell*1e3))}_advancePreview(){let t=(this.screenIdx+1)%this.screenLayouts.length;this.screenTransition==="fade"?(this.screenOpacity=0,setTimeout(()=>{this.screenIdx=t,this.screenOpacity=1},280)):this.screenIdx=t}async pushScreens(){!this.entryId||!this.screenLayouts.length||(await this.hass.callWS({type:"pimoroni_unicorn/push_screens",entry_id:this.entryId,layouts:this.screenLayouts,dwell:this.screenDwell,transition:this.screenTransition}),this.status=`Pushed ${this.screenLayouts.length} page(s) to device.`)}_screensView(){let t=Math.max(6,Math.floor(dt/this.dims[0])),e=Object.keys(this.stored),s=this.screenLayouts[this.screenIdx],n=s?this.screenPngs[s]:"";return o`
      <div class="bar"><span class="hint">compose a playlist — pages cycle on a timer; preview on ${this.model}</span></div>
      <div class="wrap">
        <div class="col">
          <h3>Pages in this playlist</h3>
          <p class="hint">Tick pages to include, then order them with ▲ ▼.</p>
          ${e.length?e.map(r=>{let a=this.screenLayouts.includes(r),l=this.screenLayouts.indexOf(r);return o`<div class="panelrow" tabindex=${a?"0":"-1"}
              @keydown=${a?d=>{d.altKey&&d.key==="ArrowUp"?(d.preventDefault(),this.moveScreen(r,-1)):d.altKey&&d.key==="ArrowDown"&&(d.preventDefault(),this.moveScreen(r,1))}:void 0}>
              <input type="checkbox" ?checked=${a}
                @change=${d=>this.toggleScreen(r,d.target.checked)} />
              ${a?o`<span class="chip" title="Position ${l+1}">${l+1}</span>`:""}
              <span class="grow">${r}</span>
              ${a?o`
                <button class="zbtn secondary" ?disabled=${l===0} @click=${()=>this.moveScreen(r,-1)} title="Move up" aria-label="Move ${r} up">▲</button>
                <button class="zbtn secondary" ?disabled=${l===this.screenLayouts.length-1} @click=${()=>this.moveScreen(r,1)} title="Move down" aria-label="Move ${r} down">▼</button>`:""}
            </div>`}):o`<p class="hint">No saved pages yet — create one on the Designer tab.</p>`}
          <div class="panelrow"><label>Dwell (s)
            <input type="number" style="width:60px" min="1" max="600" .value=${String(this.screenDwell)}
              @change=${r=>{this.screenDwell=+r.target.value,this.buildScreenPreview()}} /></label></div>
          <div class="panelrow"><label>Transition
            <select @change=${r=>{this.screenTransition=r.target.value,this.buildScreenPreview()}}>
              ${["none","fade"].map(r=>o`<option ?selected=${r===this.screenTransition}>${r}</option>`)}
            </select></label></div>
          <div class="panelrow">
            <button @click=${this.pushScreens} ?disabled=${!this.entryId} title=${this.entryId?"":"Select a device to push"}>Push to device</button>
            <button class="secondary" @click=${this.saveScreenset} ?disabled=${!this.screenLayouts.length} title="Save as a reusable playlist in the marketplace">Save as playlist</button>
          </div>
        </div>
        <div class="col">
          <div class="stage" style=${`width:${this.dims[0]*t}px;height:${this.dims[1]*t}px`}>
            ${n?o`<img src="data:image/png;base64,${n}" alt="Playlist preview" width=${this.dims[0]*t} height=${this.dims[1]*t}
              style=${`opacity:${this.screenOpacity};transition:opacity 280ms`} />`:""}
          </div>
          <div class="hint">${this.screenLayouts.length>1?`playing ${this.screenIdx+1}/${this.screenLayouts.length}: ${s??""}`:s??"tick pages to preview"}</div>
        </div>
      </div>
    `}};p([I({attribute:!1})],u.prototype,"hass",2),p([h()],u.prototype,"devices",2),p([h()],u.prototype,"entryId",2),p([h()],u.prototype,"model",2),p([h()],u.prototype,"layout",2),p([h()],u.prototype,"caps",2),p([h()],u.prototype,"widgetThumbs",2),p([h()],u.prototype,"overlayCaps",2),p([h()],u.prototype,"defaultLayout",2),p([h()],u.prototype,"stored",2),p([h()],u.prototype,"png",2),p([h()],u.prototype,"wboxes",2),p([h()],u.prototype,"dims",2),p([h()],u.prototype,"orientation",2),p([h()],u.prototype,"previewWeather",2),p([h()],u.prototype,"zoom",2),p([h()],u.prototype,"selected",2),p([h()],u.prototype,"dragIdx",2),p([h()],u.prototype,"dragOverIdx",2),p([h()],u.prototype,"layoutName",2),p([h()],u.prototype,"live",2),p([h()],u.prototype,"wireframe",2),p([h()],u.prototype,"locked",2),p([h()],u.prototype,"status",2),p([h()],u.prototype,"tab",2),p([h()],u.prototype,"catalog",2),p([h()],u.prototype,"busyUnits",2),p([h()],u.prototype,"fwManifest",2),p([h()],u.prototype,"activePage",2),p([h()],u.prototype,"contentLayouts",2),p([h()],u.prototype,"contentScreensets",2),p([h()],u.prototype,"showAllContent",2),p([h()],u.prototype,"iconNames",2),p([h()],u.prototype,"installedIcons",2),p([h()],u.prototype,"iconThumbs",2),p([h()],u.prototype,"deviceIcons",2),p([h()],u.prototype,"iconCode",2),p([h()],u.prototype,"iconName",2),p([h()],u.prototype,"iconTargets",2),p([h()],u.prototype,"iconUrl",2),p([h()],u.prototype,"iconImgName",2),p([h()],u.prototype,"iconFileData",2),p([h()],u.prototype,"iconFilePreview",2),p([h()],u.prototype,"iconImportNote",2),p([h()],u.prototype,"iconDims",2),p([h()],u.prototype,"iconSizeMode",2),p([h()],u.prototype,"iconCustomW",2),p([h()],u.prototype,"iconCustomH",2),p([h()],u.prototype,"fonts",2),p([h()],u.prototype,"fontText",2),p([h()],u.prototype,"fontPngs",2),p([h()],u.prototype,"dirty",2),p([h()],u.prototype,"undoStack",2),p([h()],u.prototype,"redoStack",2),p([h()],u.prototype,"sectionsOpen",2),p([h()],u.prototype,"screenLayouts",2),p([h()],u.prototype,"screenDwell",2),p([h()],u.prototype,"screenTransition",2),p([h()],u.prototype,"screenPngs",2),p([h()],u.prototype,"screenIdx",2),p([h()],u.prototype,"screenOpacity",2),p([h()],u.prototype,"specText",2),p([h()],u.prototype,"editMode",2),p([h()],u.prototype,"specPng",2),p([h()],u.prototype,"specError",2),p([h()],u.prototype,"fitPx",2);customElements.get("pimoroni-unicorn-panel")||customElements.define("pimoroni-unicorn-panel",u);export{u as PimoroniUnicornPanel};
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
