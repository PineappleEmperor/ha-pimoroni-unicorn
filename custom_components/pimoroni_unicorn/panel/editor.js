var Zt=Object.defineProperty;var Gt=Object.getOwnPropertyDescriptor;var p=(o,s,t,e)=>{for(var i=e>1?void 0:e?Gt(s,t):s,n=o.length-1,r;n>=0;n--)(r=o[n])&&(i=(e?r(s,t,i):r(i))||i);return e&&i&&Zt(s,t,i),i};var j=globalThis,B=j.ShadowRoot&&(j.ShadyCSS===void 0||j.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,X=Symbol(),vt=new WeakMap,N=class{constructor(s,t,e){if(this._$cssResult$=!0,e!==X)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=s,this.t=t}get styleSheet(){let s=this.o,t=this.t;if(B&&s===void 0){let e=t!==void 0&&t.length===1;e&&(s=vt.get(t)),s===void 0&&((this.o=s=new CSSStyleSheet).replaceSync(this.cssText),e&&vt.set(t,s))}return s}toString(){return this.cssText}},bt=o=>new N(typeof o=="string"?o:o+"",void 0,X),O=(o,...s)=>{let t=o.length===1?o[0]:s.reduce((e,i,n)=>e+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+o[n+1],o[0]);return new N(t,o,X)},yt=(o,s)=>{if(B)o.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of s){let e=document.createElement("style"),i=j.litNonce;i!==void 0&&e.setAttribute("nonce",i),e.textContent=t.cssText,o.appendChild(e)}},Z=B?o=>o:o=>o instanceof CSSStyleSheet?(s=>{let t="";for(let e of s.cssRules)t+=e.cssText;return bt(t)})(o):o;var{is:Qt,defineProperty:te,getOwnPropertyDescriptor:ee,getOwnPropertyNames:ie,getOwnPropertySymbols:se,getPrototypeOf:ae}=Object,V=globalThis,ft=V.trustedTypes,ne=ft?ft.emptyScript:"",re=V.reactiveElementPolyfillSupport,R=(o,s)=>o,H={toAttribute(o,s){switch(s){case Boolean:o=o?ne:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,s){let t=o;switch(s){case Boolean:t=o!==null;break;case Number:t=o===null?null:Number(o);break;case Object:case Array:try{t=JSON.parse(o)}catch{t=null}}return t}},q=(o,s)=>!Qt(o,s),xt={attribute:!0,type:String,converter:H,reflect:!1,useDefault:!1,hasChanged:q};Symbol.metadata??=Symbol("metadata"),V.litPropertyMetadata??=new WeakMap;var S=class extends HTMLElement{static addInitializer(s){this._$Ei(),(this.l??=[]).push(s)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(s,t=xt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(s)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(s,t),!t.noAccessor){let e=Symbol(),i=this.getPropertyDescriptor(s,e,t);i!==void 0&&te(this.prototype,s,i)}}static getPropertyDescriptor(s,t,e){let{get:i,set:n}=ee(this.prototype,s)??{get(){return this[t]},set(r){this[t]=r}};return{get:i,set(r){let a=i?.call(this);n?.call(this,r),this.requestUpdate(s,a,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(s){return this.elementProperties.get(s)??xt}static _$Ei(){if(this.hasOwnProperty(R("elementProperties")))return;let s=ae(this);s.finalize(),s.l!==void 0&&(this.l=[...s.l]),this.elementProperties=new Map(s.elementProperties)}static finalize(){if(this.hasOwnProperty(R("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(R("properties"))){let t=this.properties,e=[...ie(t),...se(t)];for(let i of e)this.createProperty(i,t[i])}let s=this[Symbol.metadata];if(s!==null){let t=litPropertyMetadata.get(s);if(t!==void 0)for(let[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(let[t,e]of this.elementProperties){let i=this._$Eu(t,e);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(s){let t=[];if(Array.isArray(s)){let e=new Set(s.flat(1/0).reverse());for(let i of e)t.unshift(Z(i))}else s!==void 0&&t.push(Z(s));return t}static _$Eu(s,t){let e=t.attribute;return e===!1?void 0:typeof e=="string"?e:typeof s=="string"?s.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(s=>this.enableUpdating=s),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(s=>s(this))}addController(s){(this._$EO??=new Set).add(s),this.renderRoot!==void 0&&this.isConnected&&s.hostConnected?.()}removeController(s){this._$EO?.delete(s)}_$E_(){let s=new Map,t=this.constructor.elementProperties;for(let e of t.keys())this.hasOwnProperty(e)&&(s.set(e,this[e]),delete this[e]);s.size>0&&(this._$Ep=s)}createRenderRoot(){let s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return yt(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(s=>s.hostConnected?.())}enableUpdating(s){}disconnectedCallback(){this._$EO?.forEach(s=>s.hostDisconnected?.())}attributeChangedCallback(s,t,e){this._$AK(s,e)}_$ET(s,t){let e=this.constructor.elementProperties.get(s),i=this.constructor._$Eu(s,e);if(i!==void 0&&e.reflect===!0){let n=(e.converter?.toAttribute!==void 0?e.converter:H).toAttribute(t,e.type);this._$Em=s,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(s,t){let e=this.constructor,i=e._$Eh.get(s);if(i!==void 0&&this._$Em!==i){let n=e.getPropertyOptions(i),r=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:H;this._$Em=i;let a=r.fromAttribute(t,n.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(s,t,e,i=!1,n){if(s!==void 0){let r=this.constructor;if(i===!1&&(n=this[s]),e??=r.getPropertyOptions(s),!((e.hasChanged??q)(n,t)||e.useDefault&&e.reflect&&n===this._$Ej?.get(s)&&!this.hasAttribute(r._$Eu(s,e))))return;this.C(s,t,e)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(s,t,{useDefault:e,reflect:i,wrapped:n},r){e&&!(this._$Ej??=new Map).has(s)&&(this._$Ej.set(s,r??t??this[s]),n!==!0||r!==void 0)||(this._$AL.has(s)||(this.hasUpdated||e||(t=void 0),this._$AL.set(s,t)),i===!0&&this._$Em!==s&&(this._$Eq??=new Set).add(s))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let s=this.scheduleUpdate();return s!=null&&await s,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[i,n]of e){let{wrapped:r}=n,a=this[i];r!==!0||this._$AL.has(i)||a===void 0||this.C(i,void 0,n,a)}}let s=!1,t=this._$AL;try{s=this.shouldUpdate(t),s?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(e){throw s=!1,this._$EM(),e}s&&this._$AE(t)}willUpdate(s){}_$AE(s){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(s)),this.updated(s)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(s){return!0}update(s){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(s){}firstUpdated(s){}};S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[R("elementProperties")]=new Map,S[R("finalized")]=new Map,re?.({ReactiveElement:S}),(V.reactiveElementVersions??=[]).push("2.1.2");var at=globalThis,$t=o=>o,J=at.trustedTypes,wt=J?J.createPolicy("lit-html",{createHTML:o=>o}):void 0,Tt="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,Ct="?"+E,oe=`<${Ct}>`,A=document,z=()=>A.createComment(""),F=o=>o===null||typeof o!="object"&&typeof o!="function",nt=Array.isArray,le=o=>nt(o)||typeof o?.[Symbol.iterator]=="function",G=`[ 	
\f\r]`,W=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_t=/-->/g,St=/>/g,T=RegExp(`>|${G}(?:([^\\s"'>=/]+)(${G}*=${G}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),kt=/'/g,Et=/"/g,At=/^(?:script|style|textarea|title)$/i,rt=o=>(s,...t)=>({_$litType$:o,strings:s,values:t}),c=rt(1),Ee=rt(2),Ie=rt(3),M=Symbol.for("lit-noChange"),y=Symbol.for("lit-nothing"),It=new WeakMap,C=A.createTreeWalker(A,129);function Mt(o,s){if(!nt(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return wt!==void 0?wt.createHTML(s):s}var ce=(o,s)=>{let t=o.length-1,e=[],i,n=s===2?"<svg>":s===3?"<math>":"",r=W;for(let a=0;a<t;a++){let l=o[a],d,g,m=-1,v=0;for(;v<l.length&&(r.lastIndex=v,g=r.exec(l),g!==null);)v=r.lastIndex,r===W?g[1]==="!--"?r=_t:g[1]!==void 0?r=St:g[2]!==void 0?(At.test(g[2])&&(i=RegExp("</"+g[2],"g")),r=T):g[3]!==void 0&&(r=T):r===T?g[0]===">"?(r=i??W,m=-1):g[1]===void 0?m=-2:(m=r.lastIndex-g[2].length,d=g[1],r=g[3]===void 0?T:g[3]==='"'?Et:kt):r===Et||r===kt?r=T:r===_t||r===St?r=W:(r=T,i=void 0);let b=r===T&&o[a+1].startsWith("/>")?" ":"";n+=r===W?l+oe:m>=0?(e.push(d),l.slice(0,m)+Tt+l.slice(m)+E+b):l+E+(m===-2?a:b)}return[Mt(o,n+(o[t]||"<?>")+(s===2?"</svg>":s===3?"</math>":"")),e]},P=class o{constructor({strings:s,_$litType$:t},e){let i;this.parts=[];let n=0,r=0,a=s.length-1,l=this.parts,[d,g]=ce(s,t);if(this.el=o.createElement(d,e),C.currentNode=this.el.content,t===2||t===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(i=C.nextNode())!==null&&l.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(let m of i.getAttributeNames())if(m.endsWith(Tt)){let v=g[r++],b=i.getAttribute(m).split(E),x=/([.?@])?(.*)/.exec(v);l.push({type:1,index:n,name:x[2],strings:b,ctor:x[1]==="."?tt:x[1]==="?"?et:x[1]==="@"?it:D}),i.removeAttribute(m)}else m.startsWith(E)&&(l.push({type:6,index:n}),i.removeAttribute(m));if(At.test(i.tagName)){let m=i.textContent.split(E),v=m.length-1;if(v>0){i.textContent=J?J.emptyScript:"";for(let b=0;b<v;b++)i.append(m[b],z()),C.nextNode(),l.push({type:2,index:++n});i.append(m[v],z())}}}else if(i.nodeType===8)if(i.data===Ct)l.push({type:2,index:n});else{let m=-1;for(;(m=i.data.indexOf(E,m+1))!==-1;)l.push({type:7,index:n}),m+=E.length-1}n++}}static createElement(s,t){let e=A.createElement("template");return e.innerHTML=s,e}};function L(o,s,t=o,e){if(s===M)return s;let i=e!==void 0?t._$Co?.[e]:t._$Cl,n=F(s)?void 0:s._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(o),i._$AT(o,t,e)),e!==void 0?(t._$Co??=[])[e]=i:t._$Cl=i),i!==void 0&&(s=L(o,i._$AS(o,s.values),i,e)),s}var Q=class{constructor(s,t){this._$AV=[],this._$AN=void 0,this._$AD=s,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(s){let{el:{content:t},parts:e}=this._$AD,i=(s?.creationScope??A).importNode(t,!0);C.currentNode=i;let n=C.nextNode(),r=0,a=0,l=e[0];for(;l!==void 0;){if(r===l.index){let d;l.type===2?d=new U(n,n.nextSibling,this,s):l.type===1?d=new l.ctor(n,l.name,l.strings,this,s):l.type===6&&(d=new st(n,this,s)),this._$AV.push(d),l=e[++a]}r!==l?.index&&(n=C.nextNode(),r++)}return C.currentNode=A,i}p(s){let t=0;for(let e of this._$AV)e!==void 0&&(e.strings!==void 0?(e._$AI(s,e,t),t+=e.strings.length-2):e._$AI(s[t])),t++}},U=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(s,t,e,i){this.type=2,this._$AH=y,this._$AN=void 0,this._$AA=s,this._$AB=t,this._$AM=e,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let s=this._$AA.parentNode,t=this._$AM;return t!==void 0&&s?.nodeType===11&&(s=t.parentNode),s}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(s,t=this){s=L(this,s,t),F(s)?s===y||s==null||s===""?(this._$AH!==y&&this._$AR(),this._$AH=y):s!==this._$AH&&s!==M&&this._(s):s._$litType$!==void 0?this.$(s):s.nodeType!==void 0?this.T(s):le(s)?this.k(s):this._(s)}O(s){return this._$AA.parentNode.insertBefore(s,this._$AB)}T(s){this._$AH!==s&&(this._$AR(),this._$AH=this.O(s))}_(s){this._$AH!==y&&F(this._$AH)?this._$AA.nextSibling.data=s:this.T(A.createTextNode(s)),this._$AH=s}$(s){let{values:t,_$litType$:e}=s,i=typeof e=="number"?this._$AC(s):(e.el===void 0&&(e.el=P.createElement(Mt(e.h,e.h[0]),this.options)),e);if(this._$AH?._$AD===i)this._$AH.p(t);else{let n=new Q(i,this),r=n.u(this.options);n.p(t),this.T(r),this._$AH=n}}_$AC(s){let t=It.get(s.strings);return t===void 0&&It.set(s.strings,t=new P(s)),t}k(s){nt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,e,i=0;for(let n of s)i===t.length?t.push(e=new o(this.O(z()),this.O(z()),this,this.options)):e=t[i],e._$AI(n),i++;i<t.length&&(this._$AR(e&&e._$AB.nextSibling,i),t.length=i)}_$AR(s=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);s!==this._$AB;){let e=$t(s).nextSibling;$t(s).remove(),s=e}}setConnected(s){this._$AM===void 0&&(this._$Cv=s,this._$AP?.(s))}},D=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(s,t,e,i,n){this.type=1,this._$AH=y,this._$AN=void 0,this.element=s,this.name=t,this._$AM=i,this.options=n,e.length>2||e[0]!==""||e[1]!==""?(this._$AH=Array(e.length-1).fill(new String),this.strings=e):this._$AH=y}_$AI(s,t=this,e,i){let n=this.strings,r=!1;if(n===void 0)s=L(this,s,t,0),r=!F(s)||s!==this._$AH&&s!==M,r&&(this._$AH=s);else{let a=s,l,d;for(s=n[0],l=0;l<n.length-1;l++)d=L(this,a[e+l],t,l),d===M&&(d=this._$AH[l]),r||=!F(d)||d!==this._$AH[l],d===y?s=y:s!==y&&(s+=(d??"")+n[l+1]),this._$AH[l]=d}r&&!i&&this.j(s)}j(s){s===y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,s??"")}},tt=class extends D{constructor(){super(...arguments),this.type=3}j(s){this.element[this.name]=s===y?void 0:s}},et=class extends D{constructor(){super(...arguments),this.type=4}j(s){this.element.toggleAttribute(this.name,!!s&&s!==y)}},it=class extends D{constructor(s,t,e,i,n){super(s,t,e,i,n),this.type=5}_$AI(s,t=this){if((s=L(this,s,t,0)??y)===M)return;let e=this._$AH,i=s===y&&e!==y||s.capture!==e.capture||s.once!==e.once||s.passive!==e.passive,n=s!==y&&(e===y||i);i&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,s),this._$AH=s}handleEvent(s){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,s):this._$AH.handleEvent(s)}},st=class{constructor(s,t,e){this.element=s,this.type=6,this._$AN=void 0,this._$AM=t,this.options=e}get _$AU(){return this._$AM._$AU}_$AI(s){L(this,s)}};var de=at.litHtmlPolyfillSupport;de?.(P,U),(at.litHtmlVersions??=[]).push("3.3.3");var Lt=(o,s,t)=>{let e=t?.renderBefore??s,i=e._$litPart$;if(i===void 0){let n=t?.renderBefore??null;e._$litPart$=i=new U(s.insertBefore(z(),n),n,void 0,t??{})}return i._$AI(o),i};var ot=globalThis,_=class extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let s=super.createRenderRoot();return this.renderOptions.renderBefore??=s.firstChild,s}update(s){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(s),this._$Do=Lt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return M}};_._$litElement$=!0,_.finalized=!0,ot.litElementHydrateSupport?.({LitElement:_});var pe=ot.litElementPolyfillSupport;pe?.({LitElement:_});(ot.litElementVersions??=[]).push("4.2.2");var Dt=o=>(s,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(o,s)}):customElements.define(o,s)};var he={attribute:!0,type:String,converter:H,reflect:!1,hasChanged:q},ue=(o=he,s,t)=>{let{kind:e,metadata:i}=t,n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),e==="setter"&&((o=Object.create(o)).wrapped=!0),n.set(t.name,o),e==="accessor"){let{name:r}=t;return{set(a){let l=s.get.call(this);s.set.call(this,a),this.requestUpdate(r,l,o,!0,a)},init(a){return a!==void 0&&this.C(r,void 0,o,a),a}}}if(e==="setter"){let{name:r}=t;return function(a){let l=this[r];s.call(this,a),this.requestUpdate(r,l,o,!0,a)}}throw Error("Unsupported decorator location: "+e)};function I(o){return(s,t)=>typeof t=="object"?ue(o,s,t):((e,i,n)=>{let r=i.hasOwnProperty(n);return i.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(i,n):void 0})(o,s,t)}function h(o){return I({...o,state:!0,attribute:!1})}function lt(o){let s=o.replace(/^#/,""),t=parseInt(s,16);return[t>>16&255,t>>8&255,t&255]}function Nt(o,s,t){let e=i=>Math.max(0,Math.min(255,i|0)).toString(16).padStart(2,"0");return`#${e(o)}${e(s)}${e(t)}`}function Ot(o,s,t,e,i,n){let r=($,w)=>(w*s+$)*3,a=r(e,i),l=o[a],d=o[a+1],g=o[a+2],[m,v,b]=n;if(l===m&&d===v&&g===b)return;let x=[[e,i]];for(;x.length;){let[$,w]=x.pop();if($<0||w<0||$>=s||w>=t)continue;let k=r($,w);o[k]!==l||o[k+1]!==d||o[k+2]!==g||(o[k]=m,o[k+1]=v,o[k+2]=b,x.push([$+1,w],[$-1,w],[$,w+1],[$,w-1]))}}function Rt(o,s,t){let e=s,i=t,n=-1,r=-1;for(let a=0;a<t;a++)for(let l=0;l<s;l++){let d=(a*s+l)*3;(o[d]||o[d+1]||o[d+2])&&(l<e&&(e=l),l>n&&(n=l),a<i&&(i=a),a>r&&(r=a))}return n<0?null:{x0:e,y0:i,x1:n,y1:r}}function Ht(o,s,t,e,i,n){let r=new Uint8ClampedArray(i*n*3);for(let a=0;a<n;a++)for(let l=0;l<i;l++){let d=(a*i+l)*3,g=((e+a)*s+(t+l))*3;r[d]=o[g],r[d+1]=o[g+1],r[d+2]=o[g+2]}return r}function Wt(o,s,t,e,i,n,r,a){let l=new Uint8ClampedArray(r*a*3);for(let d=0;d<a;d++)for(let g=0;g<r;g++){let m=Math.floor(e+g*n),v=Math.floor(i+d*n),b=(d*r+g)*3;if(m<0||v<0||m>=s||v>=t)continue;let x=(v*s+m)*4;l[b]=o[x],l[b+1]=o[x+1],l[b+2]=o[x+2]}return l}var ct=53,dt=32,ge=50,f=class extends _{constructor(){super(...arguments);this.w=16;this.h=16;this.px=new Uint8ClampedArray(16*16*3);this.tool="pencil";this.color="#ff3355";this.swatches=["#ffffff","#ff3355","#33cc66","#3399ff"];this.name="";this.zoomPct=100;this.editCell=0;this.status="";this._skipResize=!1;this.undoStack=[];this.redoStack=[];this.src=null;this.srcOffX=0;this.srcOffY=0;this.painting=!1}willUpdate(t){(t.has("w")||t.has("h"))&&!this._skipResize&&this.resize(this.w,this.h,!1),this._skipResize=!1}get cellPx(){return this.editCell>0?this.editCell:Math.max(3,Math.min(40,Math.floor(Math.min(600/this.w,380/this.h))))}zoomEdit(t){this.editCell=Math.max(3,Math.min(40,this.cellPx+t))}onWheel(t){!t.ctrlKey&&!t.metaKey||(t.preventDefault(),this.zoomEdit(t.deltaY<0?2:-2))}resize(t,e,i){t=Math.max(1,Math.min(ct,t|0)),e=Math.max(1,Math.min(dt,e|0));let n=new Uint8ClampedArray(t*e*3);if(i)for(let r=0;r<Math.min(e,this.h);r++)for(let a=0;a<Math.min(t,this.w);a++){let l=(r*t+a)*3,d=(r*this.w+a)*3;n[l]=this.px[d],n[l+1]=this.px[d+1],n[l+2]=this.px[d+2]}this.w=t,this.h=e,this.px=n,this.draw()}applyResize(t,e){this._skipResize=!0,this.resize(t,e,!0)}_adoptSourceSize(){if(!this.src)return;let t=this.src.w,e=this.src.h;if(t>ct||e>dt){let i=Math.min(ct/t,dt/e);t=Math.max(1,Math.round(t*i)),e=Math.max(1,Math.round(e*i))}this._skipResize=!0,this.w=t,this.h=e,this.px=new Uint8ClampedArray(t*e*3)}fitToContent(){let t=Rt(this.px,this.w,this.h);if(!t){this.status="Nothing drawn to fit.";return}let e=t.x1-t.x0+1,i=t.y1-t.y0+1;if(e===this.w&&i===this.h){this.status="Already tight to the content.";return}this.snapshot();let n=Ht(this.px,this.w,t.x0,t.y0,e,i);this._skipResize=!0,this.w=e,this.h=i,this.px=n,this.draw(),this.status=`Fitted to ${e}\xD7${i}.`}snapshot(){this.undoStack.push(this.px.slice()),this.undoStack.length>ge&&this.undoStack.shift(),this.redoStack=[]}undo(){let t=this.undoStack.pop();t&&(this.redoStack.push(this.px.slice()),this.px=t,this.draw())}redo(){let t=this.redoStack.pop();t&&(this.undoStack.push(this.px.slice()),this.px=t,this.draw())}get canvas(){return this.renderRoot.querySelector("canvas")}updated(){this.draw()}draw(){let t=this.canvas;if(!t)return;let e=this.cellPx;t.width=this.w*e,t.height=this.h*e;let i=t.getContext("2d");if(i)for(let n=0;n<this.h;n++)for(let r=0;r<this.w;r++){let a=(n*this.w+r)*3,l=this.px[a],d=this.px[a+1],g=this.px[a+2];l===0&&d===0&&g===0?i.fillStyle=(r+n)%2===0?"#111":"#1d1d1d":i.fillStyle=`rgb(${l},${d},${g})`,i.fillRect(r*e,n*e,e,e)}}cellAt(t){let e=this.canvas;if(!e)return null;let i=e.getBoundingClientRect(),n=Math.floor((t.clientX-i.left)/i.width*this.w),r=Math.floor((t.clientY-i.top)/i.height*this.h);return n<0||r<0||n>=this.w||r>=this.h?null:[n,r]}applyAt(t,e){let i=(e*this.w+t)*3;if(this.tool==="pick"){this.color=Nt(this.px[i],this.px[i+1],this.px[i+2]);return}if(this.tool==="fill"){Ot(this.px,this.w,this.h,t,e,lt(this.color)),this.draw();return}let n=this.tool==="eraser"?[0,0,0]:lt(this.color);this.px[i]=n[0],this.px[i+1]=n[1],this.px[i+2]=n[2],this.draw()}onDown(t){let e=this.cellAt(t);e&&(this.snapshot(),this.painting=this.tool==="pencil"||this.tool==="eraser",t.target.setPointerCapture(t.pointerId),this.applyAt(e[0],e[1]))}onMove(t){if(!this.painting)return;let e=this.cellAt(t);e&&this.applyAt(e[0],e[1])}onUp(){this.painting=!1}async onFile(t){let e=t.target.files?.[0];if(!e)return;let i=await new Promise(n=>{let r=new FileReader;r.onload=()=>n(String(r.result)),r.readAsDataURL(e)});await this.loadImage(i)}async onUrl(){let t=prompt("Image or GIF URL:");if(!(!t||!this.decode))try{let e=await this.decode({url:t,maxW:this.w,maxH:this.h});await this.loadImage(`data:image/png;base64,${e.png}`)}catch(e){this.status=`Load failed: ${e?.message??e}`}}async loadImage(t){let e=new Image;await new Promise((a,l)=>{e.onload=()=>a(),e.onerror=l,e.src=t});let i=document.createElement("canvas");i.width=e.naturalWidth,i.height=e.naturalHeight;let n=i.getContext("2d");if(!n)return;n.drawImage(e,0,0);let r=n.getImageData(0,0,i.width,i.height).data;this.src={data:new Uint8ClampedArray(r),w:i.width,h:i.height},this.zoomPct=100,this.srcOffX=0,this.srcOffY=0,this._adoptSourceSize(),this.stampSource(),this.status=`Imported ${i.width}\xD7${i.height} \u2192 editing at ${this.w}\xD7${this.h}.`}stampSource(){if(!this.src)return;this.snapshot();let e=Math.max(this.src.w/this.w,this.src.h/this.h)*(100/Math.max(1,this.zoomPct));this.px=Wt(this.src.data,this.src.w,this.src.h,this.srcOffX,this.srcOffY,e,this.w,this.h),this.draw()}toDataUrl(){let t=document.createElement("canvas");t.width=this.w,t.height=this.h;let e=t.getContext("2d");if(!e)return"";let i=e.createImageData(this.w,this.h);for(let n=0;n<this.w*this.h;n++)i.data[n*4]=this.px[n*3],i.data[n*4+1]=this.px[n*3+1],i.data[n*4+2]=this.px[n*3+2],i.data[n*4+3]=255;return e.putImageData(i,0,0),t.toDataURL("image/png")}save(){let t=this.name.trim();if(!t){this.status="Name the icon first.";return}this.dispatchEvent(new CustomEvent("save",{detail:{name:t,dataUrl:this.toDataUrl(),w:this.w,h:this.h},bubbles:!0,composed:!0}))}pickColor(t){this.color=t,this.swatches.includes(t)||(this.swatches=[t,...this.swatches].slice(0,8))}render(){let t=(e,i)=>c`
      <button class=${this.tool===e?"on":""} title=${i}
        @click=${()=>{this.tool=e}}>${i}</button>`;return c`
      <div class="wrap">
        <div class="rail">
          <div class="tools">
            ${t("pencil","\u270F\uFE0F")}${t("eraser","\u{1F9FD}")}
            ${t("pick","\u{1F4A7}")}${t("fill","\u{1FAA3}")}
            <button title="Undo" @click=${this.undo}>↶</button>
            <button title="Redo" @click=${this.redo}>↷</button>
          </div>
          <label>View · ${this.cellPx}px/cell</label>
          <div class="tools">
            <button title="Zoom out" aria-label="Zoom out" @click=${()=>this.zoomEdit(-2)}>−</button>
            <button title="Fit to view" aria-label="Fit to view" @click=${()=>{this.editCell=0}}>Fit</button>
            <button title="Zoom in" aria-label="Zoom in" @click=${()=>this.zoomEdit(2)}>+</button>
          </div>
          <label>Colour</label>
          <input type="color" .value=${this.color}
            @input=${e=>this.pickColor(e.target.value)} />
          <input type="text" .value=${this.color} style="width:100px"
            @change=${e=>this.pickColor(e.target.value)} />
          <div class="sw">
            ${this.swatches.map(e=>c`<span style="background:${e}"
              @click=${()=>this.pickColor(e)}></span>`)}
          </div>
        </div>

        <div class="stage" @wheel=${this.onWheel}>
          <canvas
            @pointerdown=${this.onDown} @pointermove=${this.onMove}
            @pointerup=${this.onUp} @pointercancel=${this.onUp}></canvas>
        </div>

        <div class="rail">
          <label>Source</label>
          <input type="file" accept="image/png,image/gif,image/apng,image/webp" @change=${this.onFile} />
          <button @click=${this.onUrl}>From URL…</button>
          ${this.src?c`
            <label>Crop zoom ${this.zoomPct}%</label>
            <input type="range" min="50" max="400" .value=${String(this.zoomPct)}
              @input=${e=>{this.zoomPct=+e.target.value,this.stampSource()}} />
            <div class="tools">
              <button title="Pan source left" aria-label="Pan source left" @click=${()=>{this.srcOffX-=1,this.stampSource()}}>←</button>
              <button title="Pan source right" aria-label="Pan source right" @click=${()=>{this.srcOffX+=1,this.stampSource()}}>→</button>
              <button title="Pan source up" aria-label="Pan source up" @click=${()=>{this.srcOffY-=1,this.stampSource()}}>↑</button>
              <button title="Pan source down" aria-label="Pan source down" @click=${()=>{this.srcOffY+=1,this.stampSource()}}>↓</button>
            </div>`:""}
          <label>Size</label>
          <div class="tools">
            <input type="number" min="1" max="53" .value=${String(this.w)} style="width:56px" aria-label="Width"
              @change=${e=>this.applyResize(+e.target.value,this.h)} />
            <span>×</span>
            <input type="number" min="1" max="32" .value=${String(this.h)} style="width:56px" aria-label="Height"
              @change=${e=>this.applyResize(this.w,+e.target.value)} />
          </div>
          <button title="Crop the canvas tight to the drawn pixels" @click=${this.fitToContent}>Fit to content</button>
          <label>Name</label>
          <input type="text" .value=${this.name} style="width:120px"
            @input=${e=>{this.name=e.target.value}} />
          <button @click=${this.save}>Save as icon</button>
          ${this.status?c`<span>${this.status}</span>`:""}
        </div>
      </div>`}};f.styles=O`
    :host { display: block; }
    .wrap { display: flex; gap: 16px; flex-wrap: wrap; align-items: flex-start; }
    .rail { flex: 0 0 auto; min-width: 150px; display: flex; flex-direction: column; gap: 8px; }
    .stage { flex: 1 1 320px; display: flex; justify-content: center; align-items: flex-start;
             background: #000; border-radius: 8px; padding: 12px; min-height: 200px;
             max-height: 64vh; overflow: auto; overscroll-behavior: contain; }
    canvas { image-rendering: pixelated; touch-action: none;
             box-shadow: 0 0 0 1px var(--divider-color, #444); }
    .tools { display: flex; flex-wrap: wrap; gap: 6px; }
    button { min-height: 40px; min-width: 40px; }
    button.on { outline: 2px solid var(--primary-color, #03a9f4); }
    .sw { display: flex; flex-wrap: wrap; gap: 4px; }
    .sw span { width: 24px; height: 24px; border-radius: 4px; cursor: pointer;
               box-shadow: inset 0 0 0 1px rgba(255,255,255,.3); }
    label { font-size: 14px; color: var(--secondary-text-color, #aaa); }
    input[type=text], input[type=number] { min-height: 36px; }
  `,p([I({type:Number})],f.prototype,"w",2),p([I({type:Number})],f.prototype,"h",2),p([I({attribute:!1})],f.prototype,"decode",2),p([h()],f.prototype,"px",2),p([h()],f.prototype,"tool",2),p([h()],f.prototype,"color",2),p([h()],f.prototype,"swatches",2),p([h()],f.prototype,"name",2),p([h()],f.prototype,"zoomPct",2),p([h()],f.prototype,"editCell",2),p([h()],f.prototype,"status",2),f=p([Dt("pixel-editor")],f);var pt=".attributes.";function Ft(o){let s=o.indexOf(pt);return s<0?[o,""]:[o.slice(0,s),o.slice(s+pt.length)]}function Pt(o,s){return o&&s?`${o}${pt}${s}`:o}function zt(o,s=24){let t=String(o);return t.length>s?`${t.slice(0,s-1)}\u2026`:t}function me(o){return typeof o=="number"?Number.isFinite(o):typeof o=="boolean"?!0:typeof o=="string"&&o.trim()!==""&&Number.isFinite(Number(o))}function ve(o,s,t){return/[/+#]/.test(o)||s===null||typeof s=="object"?!1:!t||me(s)}function Ut(o,s){if(!o)return[];let t=Object.entries(o.attributes??{}).filter(([e,i])=>ve(e,i,s)).sort(([e],[i])=>e.localeCompare(i)).map(([e,i])=>({attr:e,label:`${e} (${zt(i)})`}));return[{attr:"",label:`State (${zt(o.state)})`},...t]}var be={value:["entity"],bar:["entity"],energy:["solar_entity","consumption_entity","soc_entity"]};function jt(o,s){return be[o]?.includes(s)??!1}var ht=560,ye=JSON.stringify({id:"my_widget",label:"My Widget",w:16,h:7,default_cfg:{color:[0,255,0]},draw:[{op:"value",x:0,y:1,bind:"solar",fmt:"{:.1f}"},{op:"bar",x:0,y:6,w:16,h:1,bind:"soc",max:100,color:[0,120,255],bg:[30,30,30]}]},null,2),Bt={galactic:[53,11],cosmic:[32,32],stellar:[16,16]},Vt=[["clear","Clear"],["partly_cloudy","Partly cloudy"],["cloudy","Cloudy"],["fog","Fog"],["rain","Rain"],["snow","Snow"],["thunderstorm","Storm"]],qt="__mock__",ut="pu_panel_draft",Jt=["value","bar","rect","pixel","icon","dot"],fe={value:[["bind","text"],["fmt","text"],["color","rgb"]],bar:[["w","num"],["h","num"],["bind","text"],["max","num"],["color","rgb"],["bg","rgb"]],rect:[["w","num"],["h","num"],["color","rgb"]],pixel:[["color","rgb"]],icon:[["name","icon"]],dot:[["w","num"],["h","num"],["bind","text"],["on_color","rgb"],["off_color","rgb"]]},Y={value:{label:"Value",desc:"Draw a data value as text \u2014 pick a source and number format."},bar:{label:"Bar",desc:"Horizontal bar that fills from 0 to max by a value."},rect:{label:"Rectangle",desc:"A filled rectangle."},pixel:{label:"Pixel",desc:"A single lit pixel."},icon:{label:"Icon",desc:"Draw an installed icon by name."},dot:{label:"Status dot",desc:"A box that switches colour on a sensor's on/off state."}},Yt={bind:{label:"Data source",hint:"what value to show \u2014 see Available data"},fmt:{label:"Number format",hint:"e.g. {:.1f}W or {}%  (Python format)"},color:{label:"Colour"},bg:{label:"Background",hint:"track colour behind the bar"},w:{label:"Width",hint:"pixels"},h:{label:"Height",hint:"pixels"},max:{label:"Max value",hint:"value that fills the bar fully"},name:{label:"Icon"},on_color:{label:"On colour"},off_color:{label:"Off colour"}},Kt=["solar","consumption","soc","temp","weather","energy_mode","co2"],xe=o=>Yt[o]?.label??o,gt=o=>{let[s,t,e]=o??[0,0,0];return"#"+[s,t,e].map(i=>Math.max(0,Math.min(255,i|0)).toString(16).padStart(2,"0")).join("")},mt=o=>{let s=(o||"").replace("#","");return[0,2,4].map(t=>parseInt(s.substr(t,2),16)||0)},u=class extends _{constructor(){super(...arguments);this.devices=[];this.entryId="";this.model="galactic";this.layout={widgets:[]};this.caps=[];this.widgetThumbs={};this.overlayCaps=[];this.defaultLayout={widgets:[]};this.stored={};this.png="";this.wboxes=[];this.dims=[53,11];this.orientation=0;this.previewWeather="";this.zoom=0;this.selected=-1;this.dragIdx=-1;this.dragOverIdx=-1;this.layoutName="default";this.live=!1;this.wireframe=!1;this.locked=!1;this.status="";this.tab="layout";this.catalog=[];this.busyUnits={};this.fwManifest=null;this.activePage=null;this.contentLayouts=[];this.contentScreensets=[];this.showAllContent=!1;this.iconNames=[];this.installedIcons=[];this.iconThumbs={};this.deviceIcons=[];this.iconCode="";this.iconName="";this.iconTargets=[];this.iconUrl="";this.iconImgName="";this.iconFileData="";this.iconFilePreview="";this.iconImportNote="";this.iconDims={};this.iconTrunc={};this.iconSizeMode="device";this.iconCustomW=16;this.iconCustomH=16;this.fonts=[];this.fontText="";this.fontPngs={};this.fontTimer=0;this.dirty=!1;this.undoStack=[];this.redoStack=[];this.snapshot={widgets:[]};this.sectionsOpen={};this.screenLayouts=[];this.screenDwell=10;this.screenTransition="none";this.screenPngs={};this.screenIdx=0;this.screenOpacity=1;this.screenTimer=0;this.specText=ye;this.editMode="form";this.specPng="";this.specError="";this.specTimer=0;this._frameTimers={};this._pendingDraft=null;this._onBeforeUnload=t=>{this.dirty&&(t.preventDefault(),t.returnValue="")};this._onKey=t=>{let e=t.composedPath()[0],i=e?.tagName;if((t.ctrlKey||t.metaKey)&&t.key.toLowerCase()==="s"){t.preventDefault(),this.save();return}if(i==="INPUT"||i==="SELECT"||i==="TEXTAREA"||e?.isContentEditable)return;if((t.ctrlKey||t.metaKey)&&t.key.toLowerCase()==="z"&&this.tab==="layout"){t.preventDefault(),t.shiftKey?this.redo():this.undo();return}if((t.ctrlKey||t.metaKey)&&t.key.toLowerCase()==="y"&&this.tab==="layout"){t.preventDefault(),this.redo();return}if((t.key==="Delete"||t.key==="Backspace")&&this.tab==="layout"&&this.selected>=0&&this.layout.widgets[this.selected]){t.preventDefault(),this.removeWidget(this.selected);return}let r={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[t.key];!r||this.tab!=="layout"||(t.preventDefault(),this._nudge(r[0],r[1]))};this.fitPx=ht;this._iconDecode=async t=>await this.hass.callWS({type:"pimoroni_unicorn/icon_decode",data:t.data,url:t.url,max_w:t.maxW,max_h:t.maxH})}_persistDraft(){try{localStorage.setItem(ut,JSON.stringify({entryId:this.entryId,layoutName:this.layoutName,layout:this.layout}))}catch{}}_clearDraft(){try{localStorage.removeItem(ut)}catch{}}_applyPendingDraft(){let t=this._pendingDraft;this._pendingDraft=null,!(!t||t.entryId!==this.entryId||!t.layout?.widgets)&&(this.layout=JSON.parse(JSON.stringify(t.layout)),this.layoutName=t.layoutName||this.layoutName,this.snapshot=JSON.parse(JSON.stringify(this.layout)),this.dirty=!0,this.status="Restored your unsaved changes \u2014 Save to keep them, or pick another page to discard.",this.renderPreview())}static{this.styles=O`
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
    .devlink { font-size: 14px; color: var(--pu-primary, var(--primary-color)); text-decoration: none;
               padding: 6px 8px; border-radius: 8px; min-height: 40px; display: inline-flex; align-items: center; }
    .devlink:hover { background: rgba(127,127,127,.12); }
    .grow { flex: 1; }
    .warnbanner { margin-bottom: 12px; padding: 10px 14px; border-radius: var(--pu-radius, 12px);
      background: color-mix(in srgb, var(--warning-color, #f4a100) 16%, transparent);
      border: 1px solid var(--warning-color, #f4a100); font-size: 14px; }
    .warnbanner ul { margin: 6px 0 0; padding-left: 20px; }
    .warnbanner li { margin: 2px 0; }
    .ackbtn { margin-left: 8px; font: inherit; font-size: 12px; font-weight: 500; padding: 2px 10px;
      min-height: 0; border-radius: 10px; border: 1px solid var(--warning-color, #f4a100);
      background: transparent; color: var(--primary-text-color, #1c1b1f); cursor: pointer; }
    .ackbtn:hover { background: color-mix(in srgb, var(--warning-color, #f4a100) 20%, transparent); }
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
    .bindrow { display: flex; gap: 8px; flex-wrap: wrap; flex: 1; min-width: 0; }
    .bindentity { flex: 1 1 180px; min-width: 0; }
    .bindsource { flex: 1 1 160px; min-width: 0; max-width: 100%; }
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
  `}firstUpdated(){try{let t=localStorage.getItem(ut);this._pendingDraft=t?JSON.parse(t):null}catch{this._pendingDraft=null}this.loadDevices(),this.loadIcons(),this.loadFonts()}updated(){if(this._ro)return;let t=this.renderRoot.querySelector(".stagewrap");t&&(this._ro=new ResizeObserver(e=>{let i=e[0]?.contentRect.width;i&&i>8&&(this.fitPx=Math.max(120,Math.floor(i)))}),this._ro.observe(t))}async loadIcons(){try{let t={type:"pimoroni_unicorn/icons"};this.entryId&&(t.entry_id=this.entryId);let e=await this.hass.callWS(t);this.iconNames=[...e.builtin??[],...e.installed??[]],this.installedIcons=e.installed??[],this.iconThumbs=e.thumbs??{},this.iconDims=e.dims??{},this.iconTrunc=e.trunc??{},this.deviceIcons=e.device_installed??[]}catch{}}reloadIconsSoon(){this.loadIcons(),window.setTimeout(()=>this.loadIcons(),1500),window.setTimeout(()=>this.loadIcons(),4e3)}iconOversize(t){let e=this.iconDims[t];return!!e&&(e[0]>this.dims[0]||e[1]>this.dims[1])}async pushIconToDevice(t,e=!1){if(this.entryId){if(this.iconOversize(t)&&!e){let i=this.iconDims[t];if(!confirm(`\u26A0\uFE0F TEST MODE \u2014 "${t}" is ${i[0]}\xD7${i[1]}, larger than this device (${this.dims[0]}\xD7${this.dims[1]}).

Pushing an oversize icon can hang or crash the device until it is power-cycled. Only do this to test. Continue?`))return;e=!0}try{await this.hass.callWS({type:"pimoroni_unicorn/icon_push",entry_id:this.entryId,name:t,allow_oversize:e}),this.status=`Installing "${t}" on this device\u2026`,this.reloadIconsSoon()}catch(i){this.status=`Install failed: ${i?.message??i}`}}}async removeIconFromDevice(t){if(this.entryId)try{await this.hass.callWS({type:"pimoroni_unicorn/icon_device_remove",entry_id:this.entryId,name:t}),this.status=`Removed "${t}" from this device.`,this.reloadIconsSoon()}catch(e){this.status=`Remove failed: ${e?.message??e}`}}iconTargetIds(){return this.iconTargets.length?this.iconTargets:this.devices.map(t=>t.entry_id)}toggleIconTarget(t){let e=new Set(this.iconTargetIds());e.has(t)?e.delete(t):e.add(t),this.iconTargets=this.devices.map(i=>i.entry_id).filter(i=>e.has(i))}async installIcon(){let t=parseInt(this.iconCode,10),e=this.iconName.trim();if(!t||!e)return;let i=this.iconTargetIds(),n=await this.hass.callWS({type:"pimoroni_unicorn/icon_install",code:t,name:e,entry_ids:i});if(!n.ok){this.status="Couldn't fetch that LaMetric code.";return}let r=n.sent??[];this.status=r.length?`Installed "${e}" \u2192 ${r.join(", ")}.`:`Saved "${e}" (no devices to push to).`,this.iconCode="",this.iconName="",this.reloadIconsSoon()}async removeIcon(t){confirm(`Delete "${t}" everywhere? This removes it from the library and every device, and can't be undone.`)&&(await this.hass.callWS({type:"pimoroni_unicorn/icon_remove",name:t}),this.status=`Removed icon "${t}".`,this.reloadIconsSoon())}onIconFile(t){let e=t.target.files?.[0];if(!e)return;let i=new FileReader;i.onload=()=>{let n=String(i.result??"");this.iconFilePreview=n,this.iconFileData=n.includes(",")?n.slice(n.indexOf(",")+1):"",this.iconUrl="",this.iconImgName.trim()||(this.iconImgName=e.name.replace(/\.[^.]+$/,"").replace(/[^a-zA-Z0-9_-]/g,"_").slice(0,32))},i.readAsDataURL(e)}async importIconImage(){let t=this.iconImgName.trim(),e=!!this.iconFileData,i=this.iconUrl.trim();if(!t||!e&&!i)return;let n=this.iconTargetIds(),r=this.iconSizeMode==="device"?{max_w:this.dims[0],max_h:this.dims[1]}:this.iconSizeMode==="custom"?{max_w:Math.max(1,this.iconCustomW|0),max_h:Math.max(1,this.iconCustomH|0)}:{};try{let a=e?await this.hass.callWS({type:"pimoroni_unicorn/icon_upload",name:t,data:this.iconFileData,...r,entry_ids:n}):await this.hass.callWS({type:"pimoroni_unicorn/icon_url",name:t,url:i,...r,entry_ids:n}),l=a.sent??[],d=a.w&&a.h?` ${a.w}\xD7${a.h}`:"",g=a.n_total&&a.n_kept&&a.n_kept<a.n_total?` (kept ${a.n_kept} of ${a.n_total} frames to fit the device)`:a.n_kept&&a.n_kept>1?` (${a.n_kept} frames)`:"";this.iconImportNote=`Imported "${t}"${d}${g}.`,this.status=l.length?`Imported "${t}"${d} \u2192 ${l.join(", ")}.`:`Saved "${t}"${d} (no devices to push to).`,this.iconImgName="",this.iconUrl="",this.iconFileData="",this.iconFilePreview="",this.reloadIconsSoon()}catch(a){this.status=`Import failed: ${a?.message??a}`}}async loadFonts(){try{let t={type:"pimoroni_unicorn/fonts"};this.entryId&&(t.entry_id=this.entryId);let e=await this.hass.callWS(t);this.fonts=e.fonts??[],this.refreshFontPreviews()}catch{}}onFontInput(t){this.fontText=t,clearTimeout(this.fontTimer),this.fontTimer=window.setTimeout(()=>this.refreshFontPreviews(),250)}async refreshFontPreviews(){let t={};await Promise.all(this.fonts.map(async e=>{let i=this.fontText.trim()||e.sample;try{let n=await this.hass.callWS({type:"pimoroni_unicorn/font_preview",font:e.name,text:i});t[e.name]=n.png}catch{}})),this.fontPngs=t}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKey),window.addEventListener("beforeunload",this._onBeforeUnload)}disconnectedCallback(){window.removeEventListener("keydown",this._onKey),window.removeEventListener("beforeunload",this._onBeforeUnload),this._ro?.disconnect(),this._ro=void 0,Object.values(this._frameTimers).forEach(t=>clearInterval(t)),this._frameTimers={},clearInterval(this.screenTimer),clearTimeout(this.renderTimer),clearTimeout(this.pushTimer),clearTimeout(this.fontTimer),clearTimeout(this.specTimer),super.disconnectedCallback()}_nudge(t,e){let[i,n]=this.dims;if(this.selected>=0&&this.layout.widgets[this.selected]){let r=this.layout.widgets[this.selected],[a,l]=this.boxDims(this.selected);r.x=Math.max(1-a,Math.min(i-1,r.x+t)),r.y=Math.max(1-l,Math.min(n-1,r.y+e)),this.edited()}}async loadDevices(){let t=await this.hass.callWS({type:"pimoroni_unicorn/devices"});this.devices=t.devices??[],this.devices.length?await this.selectDevice(this.devices[0].entry_id):await this.selectMock(this.model)}async loadCaps(t){let e=await this.hass.callWS({type:"pimoroni_unicorn/capabilities",...t});this.caps=e.widgets??[],this.overlayCaps=e.overlays??[],this.defaultLayout=e.default_layout,this.model=e.model,this.orientation=e.orientation??0,this.dims=e.dims??Bt[this.model]??[53,11],this.loadWidgetThumbs(),await this.refreshStored()}async loadWidgetThumbs(){try{let t=await this.hass.callWS({type:"pimoroni_unicorn/widget_thumbs",model:this.model});this.widgetThumbs=t.thumbs??{}}catch{}}async selectDevice(t){let e=this.devices.find(n=>n.entry_id===t);if(!e||!this.guardDiscard()){this.requestUpdate();return}this.entryId=t,await this.loadCaps({entry_id:t}),this.loadIcons(),this.loadFonts(),this.loadCatalog();let i=e.active_layout?this.stored[e.active_layout]:void 0;this.loadLayout(i??this.defaultLayout),this._applyPendingDraft()}async selectMock(t){if(!this.guardDiscard()){this.requestUpdate();return}this.entryId="",await this.loadCaps({model:t}),this.loadIcons(),this.loadCatalog(),this.loadLayout(this.defaultLayout),this._applyPendingDraft()}async refreshStored(){let t=await this.hass.callWS({type:"pimoroni_unicorn/layouts"});this.stored=t.layouts??{}}loadLayout(t){this.layout=JSON.parse(JSON.stringify(t)),this.layoutName=this.layout.name??"default",this.selected=-1,this.dirty=!1,this.undoStack=[],this.redoStack=[],this.snapshot=JSON.parse(JSON.stringify(this.layout)),this.renderPreview()}guardDiscard(){return!this.dirty||confirm("Discard unsaved changes to this page?")}playFrames(t,e,i){if(window.clearInterval(this._frameTimers[t]),i(e[0]??""),e.length>1){let n=0;this._frameTimers[t]=window.setInterval(()=>{n=(n+1)%e.length,i(e[n])},200)}}async renderPreview(){try{let t=await this.hass.callWS({type:"pimoroni_unicorn/render",model:this.model,layout:this.layout,orientation:this.orientation,weather:this.previewWeather||void 0,entry_id:this.entryId||void 0});this.wboxes=t.boxes??[],this.playFrames("layout",t.frames??(t.png?[t.png]:[]),e=>{this.png=e}),this.status.startsWith("Render failed")&&(this.status="")}catch(t){this.png="",this.status=`Render failed: ${t?.message??t}`}}edited(){this.undoStack=[...this.undoStack.slice(-99),this.snapshot],this.redoStack=[],this.snapshot=JSON.parse(JSON.stringify(this.layout)),this.dirty=!0,this._persistDraft(),this.requestUpdate(),this.scheduleRender()}scheduleRender(){this.renderTimer&&clearTimeout(this.renderTimer),this.renderTimer=window.setTimeout(()=>this.renderPreview(),80),this.live&&this.entryId&&(this.pushTimer&&clearTimeout(this.pushTimer),this.pushTimer=window.setTimeout(()=>this.pushLive(),250))}undo(){if(!this.undoStack.length)return;this.redoStack=[...this.redoStack,this.snapshot];let t=this.undoStack[this.undoStack.length-1];this.undoStack=this.undoStack.slice(0,-1),this.applyHistory(t)}redo(){if(!this.redoStack.length)return;this.undoStack=[...this.undoStack,this.snapshot];let t=this.redoStack[this.redoStack.length-1];this.redoStack=this.redoStack.slice(0,-1),this.applyHistory(t)}applyHistory(t){this.layout=JSON.parse(JSON.stringify(t)),this.snapshot=JSON.parse(JSON.stringify(t)),this.selected>=this.layout.widgets.length&&(this.selected=this.layout.widgets.length-1),this.layoutName=this.layout.name??this.layoutName,this.dirty=!0,this.requestUpdate(),this.scheduleRender()}async pushLive(){let t={...this.layout,name:this.layoutName};await this.hass.callWS({type:"pimoroni_unicorn/push_layout",entry_id:this.entryId,layout:t})}capFor(t){return this.caps.find(e=>e.id===t)}typeOf(t){return t.type??t.id}_entityField(t,e){let[i,n]=Ft(String(this.cfgVal(t,e.key)??"")),r=Ut(this.hass?.states?.[i],jt(this.typeOf(t),e.key)),a=n&&!r.some(l=>l.attr===n);return c`<div class="panelrow"><label>${e.label??e.key}</label>
      <span class="bindrow">
        <input type="text" class="bindentity" list="pu-entity-list" placeholder="entity id…" .value=${i}
          @change=${l=>this.setCfg(t,e.key,l.target.value.trim())} />
        <select class="bindsource" aria-label="Value source" title="Show the entity's state or one of its attributes"
          ?disabled=${!r.length&&!a}
          @change=${l=>this.setCfg(t,e.key,Pt(i,l.target.value))}>
          ${r.map(l=>c`<option value=${l.attr} ?selected=${l.attr===n}>${l.label}</option>`)}
          ${a?c`<option value=${n} selected>${n} (not found)</option>`:""}
        </select>
      </span>
      <datalist id="pu-entity-list">
        ${Object.keys(this.hass?.states??{}).map(l=>c`<option value=${l}></option>`)}
      </datalist></div>`}capForEntry(t){return this.capFor(this.typeOf(t))}get scale(){return this.zoom||Math.max(4,Math.floor(this.fitPx/this.dims[0]))}get pxScale(){let t=window.devicePixelRatio||1;return Math.max(1,Math.round(this.scale*t))/t}zoomBy(t){this.zoom=Math.min(48,Math.max(4,this.scale+t))}onWheel(t){!t.ctrlKey&&!t.metaKey||(t.preventDefault(),this.zoomBy(t.deltaY<0?2:-2))}startPan(t){if(t.target.closest(".box"))return;let e=t.currentTarget;t.preventDefault();let i=t.clientX,n=t.clientY,r=e.scrollLeft,a=e.scrollTop;e.setPointerCapture(t.pointerId),e.classList.add("panning");let l=g=>{e.scrollLeft=r-(g.clientX-i),e.scrollTop=a-(g.clientY-n)},d=g=>{e.releasePointerCapture(g.pointerId),e.classList.remove("panning"),e.removeEventListener("pointermove",l),e.removeEventListener("pointerup",d)};e.addEventListener("pointermove",l),e.addEventListener("pointerup",d)}boxDims(t){let e=this.wboxes[t];if(e)return e;let i=this.layout.widgets[t],n=i?this.capForEntry(i):void 0;return n?[n.w,n.h]:[0,0]}cfgVal(t,e){return t.cfg?.[e]??this.capForEntry(t)?.default_cfg[e]}colorCtl(t,e){return c`<span class="colorctl">
      <input type="color" .value=${gt(t)}
        @input=${i=>e(mt(i.target.value))} />
      <input type="text" class="hexin" .value=${gt(t)} maxlength="7" spellcheck="false" aria-label="Hex colour"
        @change=${i=>e(mt(i.target.value))} />
    </span>`}setCfg(t,e,i){t.cfg={...t.cfg??{},[e]:i},this.edited()}cfgPalette(t,e){let i=this.cfgVal(t,e);return i&&i.length?i.map(n=>[...n]):[this.cfgVal(t,"color")??[255,255,255]]}setCfgColor(t,e,i,n){let r=this.cfgPalette(t,e);r[i]=n,this.setCfg(t,e,r)}addCfgColor(t,e){let i=this.cfgPalette(t,e);i.push([255,255,255]),this.setCfg(t,e,i)}removeCfgColor(t,e,i){let n=this.cfgPalette(t,e);n.length>1&&(n.splice(i,1),this.setCfg(t,e,n))}setName(t,e){let i=e.trim();i?t.name=i:delete t.name,this.edited()}setPos(t,e,i){let[n,r]=this.boxDims(this.selected),[a,l]=this.dims,d=Math.round(i);e==="x"?t.x=Math.max(1-n,Math.min(a-1,d)):t.y=Math.max(1-r,Math.min(l-1,d)),this.edited()}onImgLoad(t){let e=t.target;this.dims=[e.naturalWidth,e.naturalHeight]}startDrag(t,e){e.preventDefault(),this.selected=t;let i=this.layout.widgets[t],[n,r]=this.boxDims(t),a=this.layout.grid??2,[l,d]=this.dims,g=e.clientX,m=e.clientY,v=i.x,b=i.y;e.target.setPointerCapture(e.pointerId);let x=w=>{let k=Math.round((w.clientX-g)/this.pxScale/a)*a,Xt=Math.round((w.clientY-m)/this.pxScale/a)*a;i.x=Math.max(1-n,Math.min(l-1,v+k)),i.y=Math.max(1-r,Math.min(d-1,b+Xt)),this.edited()},$=()=>{window.removeEventListener("pointermove",x),window.removeEventListener("pointerup",$),this.renderPreview()};window.addEventListener("pointermove",x),window.addEventListener("pointerup",$)}addWidget(t){if(!t)return;let e=this.capFor(t),i=new Set(this.layout.widgets.map(r=>r.id)),n;if(e?.multi||i.has(t)){let r=2,a=`${t}-${r}`;for(;i.has(a);)a=`${t}-${++r}`;n={id:a,type:t,name:`${e?.label??t} ${r}`,x:0,y:0,cfg:{}}}else n={id:t,type:t,x:0,y:0,cfg:{}};this.layout.widgets.push(n),this.selected=this.layout.widgets.length-1,this.edited()}removeWidget(t){this.layout.widgets[t]&&(this.layout.widgets.splice(t,1),this.selected=-1,this.edited())}duplicateWidget(t){let e=this.layout.widgets[t];if(!e)return;let i=new Set(this.layout.widgets.map(d=>d.id)),n=e.type??e.id,r=2,a=`${n}-${r}`;for(;i.has(a);)a=`${n}-${++r}`;let l=JSON.parse(JSON.stringify(e));l.id=a,l.x=(e.x??0)+1,l.y=(e.y??0)+1,this.layout.widgets.splice(t+1,0,l),this.selected=t+1,this.edited()}dropWidget(t){let e=this.dragIdx;if(this.dragIdx=-1,e<0||e===t)return;let i=this.layout.widgets,[n]=i.splice(e,1);i.splice(t,0,n),this.selected=i.indexOf(n),this.edited()}moveLayer(t,e){let i=t+e,n=this.layout.widgets;i<0||i>=n.length||([n[t],n[i]]=[n[i],n[t]],this.selected=i,this.edited())}toggleOverlay(t,e){let i=new Set(this.layout.overlays??[]);e?i.add(t):i.delete(t),this.layout.overlays=[...i],this.edited()}async save(){if(!this.layoutName.trim()){this.status="Name the page before saving.";return}this.layout.name=this.layoutName,await this.hass.callWS({type:"pimoroni_unicorn/save_layout",name:this.layoutName,layout:this.layout}),await this.refreshStored(),this.dirty=!1,this._clearDraft(),this.status=`Saved "${this.layoutName}" to the library.`}newPage(){this.guardDiscard()&&(this.loadLayout(this.defaultLayout),this.layoutName="",this.switchTab("layout"))}async editCurrentPage(){if(!this.entryId||!this.guardDiscard())return;let e=((await this.hass.callWS({type:"pimoroni_unicorn/devices"})).devices??[]).find(n=>n.entry_id===this.entryId);await this.refreshStored();let i=e?.active_layout?this.stored[e.active_layout]:void 0;if(!i){this.status="This device has no active page saved in the library yet.";return}this.layoutName=e.active_layout,this.loadLayout(i),this.switchTab("layout"),this.status=`Loaded the device's current page "${e.active_layout}".`}async deployCurrent(){if(this.entryId){if(!this.layoutName.trim()){this.status="Name the page before deploying.";return}this.layout.name=this.layoutName,this.status=`Deploying "${this.layoutName}"\u2026`;try{await this.hass.callWS({type:"pimoroni_unicorn/save_layout",name:this.layoutName,layout:this.layout}),await this.refreshStored();let t=await this.hass.callWS({type:"pimoroni_unicorn/deploy_layout",entry_id:this.entryId,name:this.layoutName,override:!0});this.status=t.ok?`Deployed "${this.layoutName}" (installed any missing widgets/fonts first).`:"Deploy failed.",this.dirty=!1,this._clearDraft()}catch(t){this.status=`Deploy failed: ${t?.message??t}`}}}async deleteLayout(){this.stored[this.layoutName]&&confirm(`Delete page "${this.layoutName}"? This can't be undone.`)&&(await this.hass.callWS({type:"pimoroni_unicorn/delete_layout",name:this.layoutName}),await this.refreshStored(),this.status=`Deleted "${this.layoutName}".`,this.loadLayout(this.defaultLayout))}async deletePage(t,e){confirm(`Delete page "${e}"? This can't be undone.`)&&(await this.hass.callWS({type:"pimoroni_unicorn/delete_layout",name:t}),await this.refreshStored(),await this.loadCatalog(),this.status=`Deleted page "${e}".`)}async deletePlaylist(t,e){confirm(`Delete playlist "${e}"? This can't be undone.`)&&(await this.hass.callWS({type:"pimoroni_unicorn/delete_screenset",name:t}),await this.loadCatalog(),this.status=`Deleted playlist "${e}".`)}renderWidgetEditor(){let t=this.layout.widgets[this.selected];if(!t)return c`<p class="hint">Select a widget to edit.</p>`;let e=this.capForEntry(t);return e?c`
      <h3>${t.name??e.label}</h3>
      ${t.ack?.length?c`<div class="panelrow">
        <span class="hint">⚠ ${t.ack.length} display warning${t.ack.length>1?"s":""} ignored for this element.</span>
        <button class="secondary" @click=${()=>this.clearAck(this.selected)}>Restore warnings</button></div>`:""}
      ${e.id==="weather"?c`<div class="panelrow"><label>Preview condition</label>
        <select @change=${i=>{this.previewWeather=i.target.value,this.renderPreview()}}>
          <option value="" ?selected=${this.previewWeather===""}>live</option>
          ${Vt.map(([i,n])=>c`<option value=${i} ?selected=${this.previewWeather===i}>${n}</option>`)}
        </select></div>`:""}
      <div class="panelrow"><label>Name</label>
        <input type="text" style="width:160px" placeholder=${e.label} .value=${t.name??""}
          @change=${i=>this.setName(t,i.target.value)} /></div>
      <div class="panelrow">
        <label>X</label><input type="number" style="width:60px" .value=${String(t.x)}
          @change=${i=>this.setPos(t,"x",+i.target.value)} />
        <label>Y</label><input type="number" style="width:60px" .value=${String(t.y)}
          @change=${i=>this.setPos(t,"y",+i.target.value)} />
      </div>
      ${e.cfg_fields.map(i=>{let n=this.cfgVal(t,"color_mode");if(i.key==="speed"&&n!=="rainbow"||i.type==="rgblist"&&n!=="per_char")return"";let r=this.cfgVal(t,"off_mode");if(i.key==="off_brightness"&&r==="colour"||i.key==="off_color"&&r!=="colour")return"";if(i.type==="rgblist"){let a=this.cfgPalette(t,i.key);return c`<div class="panelrow"><label>${i.label??i.key}</label>
            <span class="swatches">
              ${a.map((l,d)=>c`<span class="swatch">
                <input type="color" .value=${gt(l)}
                  @input=${g=>this.setCfgColor(t,i.key,d,mt(g.target.value))} />
                ${a.length>1?c`<button class="x" title="Remove"
                  @click=${()=>this.removeCfgColor(t,i.key,d)}>×</button>`:""}
              </span>`)}
              <button class="add" title="Add colour" @click=${()=>this.addCfgColor(t,i.key)}>+</button>
            </span></div>`}if(i.type==="select")return c`<div class="panelrow"><label>${i.label??i.key}</label>
            <select @change=${a=>this.setCfg(t,i.key,a.target.value)}>
              ${(i.options??[]).map(a=>c`<option ?selected=${this.cfgVal(t,i.key)===a}>${a}</option>`)}
            </select></div>`;if(i.type==="number")return c`<div class="panelrow"><label>${i.label??i.key}</label>
            <input type="number" style="width:60px" min=${i.min??1} max=${i.max??64} step=${i.step??1}
              .value=${String(this.cfgVal(t,i.key))}
              @input=${a=>{let l=a.target.value;l!==""&&!Number.isNaN(+l)&&this.setCfg(t,i.key,+l)}} /></div>`;if(i.type==="bool")return c`<div class="panelrow"><label>${i.label??i.key}</label>
            <input type="checkbox" .checked=${!!this.cfgVal(t,i.key)}
              @change=${a=>this.setCfg(t,i.key,a.target.checked)} /></div>`;if(i.type==="range"){let a=Number(this.cfgVal(t,i.key)??i.max??100);return c`<div class="panelrow"><label>${i.label??i.key}</label>
            <input type="range" min=${i.min??0} max=${i.max??100} step=${i.step??1} .value=${String(a)}
              @input=${l=>this.setCfg(t,i.key,+l.target.value)} />
            <span class="rangeval">${a}</span></div>`}return i.type==="icon"?c`<div class="panelrow"><label>${i.label??i.key}</label>
            <select @change=${a=>this.setCfg(t,i.key,a.target.value)}>
              ${this.iconNames.map(a=>c`<option ?selected=${this.cfgVal(t,i.key)===a}>${a}</option>`)}
            </select></div>`:i.type==="entity"?this._entityField(t,i):i.type==="text"?c`<div class="panelrow"><label>${i.label??i.key}</label>
            <input type="text" style="width:120px" .value=${String(this.cfgVal(t,i.key)??"")}
              @change=${a=>this.setCfg(t,i.key,a.target.value)} /></div>`:c`<div class="panelrow"><label>${i.label??i.key}</label>
          ${this.colorCtl(this.cfgVal(t,i.key)??[255,255,255],a=>this.setCfg(t,i.key,a))}</div>`})}
      <div class="panelrow"><button class="danger" @click=${()=>this.removeWidget(this.selected)}>Remove widget</button></div>
    `:""}switchTab(t){this.tab=t,t==="market"?this.loadCatalog():t==="edit"?this.previewSpec():t==="screens"&&this.buildScreenPreview()}_devicePageHref(){let t=this.devices.find(e=>e.entry_id===this.entryId)?.registry_id;return t?`/config/devices/device/${t}`:""}_displayProblems(){if(!this.entryId)return[];let[t,e]=this.dims,i=[];return this.layout.widgets.forEach((n,r)=>{if(n.enabled===!1)return;let a=n.ack??[],l=n.type??n.id,d=(m,v)=>{a.includes(m)||i.push({idx:r,kind:m,text:v})};if(l==="icon"){let m=n.cfg?.icon,v=m?this.iconDims[m]:void 0;if(v&&(v[0]>t||v[1]>e)){d("oversize",`Icon \u201C${m}\u201D (${v[0]}\xD7${v[1]}) is bigger than the ${t}\xD7${e} screen`);return}let b=m?this.iconTrunc[m]:void 0;if(b){d("trimmed",`Icon \u201C${m}\u201D animation was trimmed to ${b[0]} of ${b[1]} frames to fit`);return}}let g=this.wboxes[r];g&&g[0]&&g[1]&&(n.x+g[0]>t||n.y+g[1]>e)&&d("offscreen",`\u201C${this.capFor(l)?.label??l}\u201D runs off the screen`)}),i}ackProblem(t,e){let i=this.layout.widgets[t];i&&(i.ack=[...new Set([...i.ack??[],e])],this.edited())}clearAck(t){let e=this.layout.widgets[t];e?.ack&&(delete e.ack,this.edited())}_appBar(){let t=this.devices.find(e=>e.entry_id===this.entryId);return c`
      <div class="appbar">
        <span class="brand">Pimoroni Unicorn</span>
        <label>Device
          <select @change=${e=>{let i=e.target.value;i===qt?this.selectMock(this.model):this.selectDevice(i)}}>
            <option value=${qt} ?selected=${!this.entryId}>Mock (preview only)</option>
            ${this.devices.map(e=>c`<option value=${e.entry_id} ?selected=${e.entry_id===this.entryId}>${e.name}</option>`)}
          </select>
        </label>
        ${this._devicePageHref()?c`<a class="devlink" href=${this._devicePageHref()} title="Open this device's Home Assistant page (settings, diagnostics, entities)">⚙ Device page</a>`:""}
        ${this.entryId?c`<span class="chip">${t?.model??this.model}</span>`:c`<label>Model
              <select @change=${e=>this.selectMock(e.target.value)}>
                ${Object.keys(Bt).map(e=>c`<option ?selected=${e===this.model}>${e}</option>`)}
              </select></label>`}
        <span class="chip dim">${this.dims[0]}&times;${this.dims[1]} px</span>
        <span class="grow"></span>
        ${this.dirty?c`<span class="chip warn">unsaved changes</span>`:""}
        ${this.fwManifest?.engine_version?c`<span class="hint">engine v${this.fwManifest.engine_version}</span>`:""}
        <a class="help" href="https://github.com/PineappleEmperor/ha-pimoroni-unicorn#readme" target="_blank" rel="noopener noreferrer" title="Open the documentation in a new tab">Help</a>
      </div>`}render(){let t=this._displayProblems();return c`
      ${this._appBar()}
      <div class="tabs">
        <button class="tab ${this.tab==="layout"?"on":""}" @click=${()=>this.switchTab("layout")}>Designer</button>
        <button class="tab ${this.tab==="market"?"on":""}" @click=${()=>this.switchTab("market")}>Marketplace</button>
        <button class="tab ${this.tab==="edit"?"on":""}" @click=${()=>this.switchTab("edit")}>Widget editor</button>
        <button class="tab ${this.tab==="paint"?"on":""}" @click=${()=>this.switchTab("paint")}>Icon editor</button>
        <button class="tab ${this.tab==="screens"?"on":""}" @click=${()=>this.switchTab("screens")}>Playlists</button>
      </div>
      ${this.status?c`<div class="status ${/fail/i.test(this.status)?"err":""}" role="status" aria-live="polite">${this.status}</div>`:""}
      ${t.length?c`<div class="warnbanner" role="alert">
        <strong>⚠ ${t.length} item${t.length>1?"s":""} on this page may not display on this device:</strong>
        <ul>${t.map(e=>c`<li>${e.text}
          <button class="ackbtn" title="Ignore this warning for this element (saved with the page)"
            @click=${()=>this.ackProblem(e.idx,e.kind)}>Ignore</button></li>`)}</ul>
      </div>`:""}
      ${this.devices.length?"":c`<div class="firstrun">No Pimoroni Unicorn device connected yet — you're previewing on a mock ${this.model}. Add one under <strong>Settings → Devices &amp; Services</strong>, then pick it above to install content and push live.</div>`}
      ${this.tab==="market"?this._marketplaceView():this.tab==="edit"?this._editorView():this.tab==="paint"?this._paintView():this.tab==="screens"?this._screensView():this._layoutView()}
    `}_layoutView(){let t=this.pxScale,e=new Set(this.layout.widgets.map(a=>this.typeOf(a))),i=this.caps.filter(a=>a.multi||!e.has(a.id)),n=new Set(this.layout.overlays??[]),r=`background-image:linear-gradient(to right,rgba(255,255,255,.10) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.10) 1px,transparent 1px);background-size:${t}px ${t}px`;return c`
      <div class="bar">
        <div class="group">
          <label>Page
            <select @change=${a=>{let l=a.target.value;l==="__new__"?this.newPage():this.guardDiscard()?this.loadLayout(this.stored[l]):this.requestUpdate()}}>
              ${Object.keys(this.stored).map(a=>c`<option ?selected=${a===this.layoutName}>${a}</option>`)}
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
          ${this.stored[this.layoutName]?c`<button class="secondary" @click=${()=>this.publishLayout(!0)} title="List this page in the marketplace">Publish</button>`:""}
          ${this.stored[this.layoutName]?c`<button class="danger" @click=${this.deleteLayout}>Delete</button>`:""}
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
              ${[1,2,4].map(a=>c`<option ?selected=${(this.layout.grid??2)===a}>${a}</option>`)}
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
              ${Vt.map(([a,l])=>c`<option value=${a} ?selected=${this.previewWeather===a}>${l}</option>`)}
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
              ${this.png?c`<img src="data:image/png;base64,${this.png}" alt="Live layout preview" width=${this.dims[0]*t} height=${this.dims[1]*t} @load=${this.onImgLoad} />`:""}
              <div class="grid" style=${r}></div>
              ${this.locked?"":c`<div class="boxes ${this.wireframe?"wf":""}">${this.layout.widgets.map((a,l)=>{if(!this.capForEntry(a)||a.enabled===!1)return"";let[d,g]=this.boxDims(l);return c`<div class="box ${l===this.selected?"sel":""}"
                  style=${`left:${a.x*t}px;top:${a.y*t}px;width:${d*t}px;height:${g*t}px`}
                  @pointerdown=${m=>this.startDrag(l,m)}>
                  <span class="tag">${a.name??this.capForEntry(a)?.label??a.id}</span></div>`})}</div>`}
            </div>
          </div>
        </div>

        <div class="col">
          <h3>Layers</h3>
          <ul class="wlist">
            ${[...this.layout.widgets.keys()].reverse().map(a=>{let l=this.layout.widgets[a];return c`
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
          ${this.layout.widgets.length>1?c`<p class="hint">Top of the list draws on top.</p>`:""}
          ${i.length?c`<div class="addgrid">
            ${i.map(a=>c`<button class="addtile" @click=${()=>this.addWidget(a.id)} title="Add ${a.label}">
              ${this.widgetThumbs[a.id]?c`<img class="addthumb" src="data:image/png;base64,${this.widgetThumbs[a.id]}" alt="" />`:c`<div class="addthumb empty"></div>`}
              <span class="addtile-label">${a.label}</span>
            </button>`)}
          </div>`:""}
          <h3>Overlays</h3>
          ${this.overlayCaps.map(a=>c`<div class="panelrow"><label>
            <input type="checkbox" .checked=${n.has(a.id)} @change=${l=>this.toggleOverlay(a.id,l.target.checked)} /> ${a.label}</label></div>`)}
          <h3>Selected</h3>
          ${this.renderWidgetEditor()}
        </div>
      </div>
    `}async loadCatalog(){if(await this.loadContent(),!this.entryId){this.catalog=[],this.fwManifest=null;return}let t=await this.hass.callWS({type:"pimoroni_unicorn/catalog",entry_id:this.entryId});this.catalog=t.widgets??[];let e=await this.hass.callWS({type:"pimoroni_unicorn/fw_manifest",entry_id:this.entryId});this.fwManifest=e.manifest??null,this._reconcileBusy()}_reconcileBusy(){if(!Object.keys(this.busyUnits).length)return;let t={...this.busyUnits},e=!1;for(let[i,n]of Object.entries(this.busyUnits)){let r=this.catalog.find(l=>l.id===i);(n==="Installing"?r?.status==="installed":!r||r.status==="not_installed")&&(delete t[i],e=!0)}e&&(this.busyUnits=t)}_setBusy(t,e){let i={...this.busyUnits};e?i[t]=e:delete i[t],this.busyUnits=i}async loadContent(){let t=this.entryId?{entry_id:this.entryId}:{},e=await this.hass.callWS({type:"pimoroni_unicorn/content_catalog",...t});this.activePage=e.active_page??null,this.contentLayouts=e.layouts??[],this.contentScreensets=e.screensets??[]}async deployLayout(t,e){if(!this.entryId){this.status="Select a device to deploy.";return}if(!(!e&&!confirm(`"${t}" isn't built for this device's model. Deploy anyway?`))){this.status=`Deploying "${t}"\u2026`;try{let i=await this.hass.callWS({type:"pimoroni_unicorn/deploy_layout",entry_id:this.entryId,name:t,override:!e});this.status=i.ok?`Deployed "${t}" (installing any missing widgets/fonts first).`:"Deploy failed."}catch(i){this.status=`Deploy failed: ${i?.message??i}`}}}async deployScreenset(t,e){if(!this.entryId){this.status="Select a device to deploy.";return}if(!(!e&&!confirm(`"${t}" isn't built for this device's model. Deploy anyway?`))){this.status=`Deploying "${t}"\u2026`;try{let i=await this.hass.callWS({type:"pimoroni_unicorn/deploy_screenset",entry_id:this.entryId,name:t,override:!e});this.status=i.ok?`Deployed screen set "${t}".`:"Deploy failed."}catch(i){this.status=`Deploy failed: ${i?.message??i}`}}}async exportLayout(){let t={...this.layout,name:this.layoutName,model:this.model},e=JSON.stringify(t,null,2);try{await navigator.clipboard.writeText(e),this.status=`Copied "${this.layoutName}" JSON (${this.model}) to clipboard.`}catch{let i=document.createElement("a");i.href=URL.createObjectURL(new Blob([e],{type:"application/json"})),i.download=`${this.layoutName||"layout"}.json`,i.click(),URL.revokeObjectURL(i.href),this.status=`Downloaded "${this.layoutName}.json".`}}async publishLayout(t){if(!this.stored[this.layoutName]){this.status="Save the layout first, then publish.";return}await this.hass.callWS({type:"pimoroni_unicorn/publish_layout",name:this.layoutName,published:t}),this.status=t?`Published "${this.layoutName}" to the marketplace.`:`Unpublished "${this.layoutName}".`,this.loadContent()}async saveScreenset(){if(!this.screenLayouts.length){this.status="Add at least one screen first.";return}let t=prompt("Name this screen set:");t&&(await this.hass.callWS({type:"pimoroni_unicorn/save_screenset",name:t,screenset:{label:t,layouts:this.screenLayouts,dwell:this.screenDwell,transition:this.screenTransition,triggers:[]}}),this.status=`Saved screen set "${t}".`,this.loadContent())}reloadCatalogSoon(){for(let t of[8e3,15e3,25e3])setTimeout(()=>this.loadCatalog(),t)}async installFont(t){if(this.entryId)try{await this.hass.callWS({type:"pimoroni_unicorn/font_install",entry_id:this.entryId,font:t}),this.status=`Installing font ${t}\u2026`;for(let e of[2e3,5e3])setTimeout(()=>this.loadFonts(),e)}catch(e){this.status=`Font install failed: ${e?.message??e}`}}async installWidget(t){if(confirm(`Install "${t}" on the device? It will reboot (~20s) and briefly go dark.`)){this._setBusy(t,"Installing");try{await this.hass.callWS({type:"pimoroni_unicorn/fw_install",entry_id:this.entryId,widget_id:t}),this.status=`Installing ${t}\u2026 the device will reboot and reconnect.`,this.reloadCatalogSoon(),this._busyTimeout(t)}catch(e){this._setBusy(t,null),this.status=`Install failed: ${e?.message??e}`}}}async removeWidgetUnit(t){if(confirm(`Remove "${t}" from the device? It will reboot (~20s) and briefly go dark.`)){this._setBusy(t,"Removing");try{await this.hass.callWS({type:"pimoroni_unicorn/fw_remove",entry_id:this.entryId,widget_id:t}),this.status=`Removing ${t}\u2026 the device will reboot and reconnect.`,this.reloadCatalogSoon(),this._busyTimeout(t)}catch(e){this._setBusy(t,null),this.status=`Remove failed: ${e?.message??e}`}}}_busyTimeout(t){window.setTimeout(()=>{this.busyUnits[t]&&(this._setBusy(t,null),this.status=`"${t}" didn't confirm \u2014 check the device is powered and back on Wi-Fi, then Refresh.`)},3e4)}_thumb(t){return t?c`<img class="thumb" alt="" src="data:image/png;base64,${t}" />`:c`<div class="thumb empty"></div>`}_mhead(){return c`<div class="mhead"><span>Preview</span><span>Name</span><span>Dependencies</span><span>Status</span><span></span></div>`}_section(t,e,i,n){let r=this.sectionsOpen[t]!==!1,a=()=>{this.sectionsOpen={...this.sectionsOpen,[t]:!r}};return c`<div class="section">
      <div class="shead" role="button" tabindex="0" aria-expanded=${r}
        @click=${a}
        @keydown=${l=>{(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),a())}}>
        <svg class="chev ${r?"open":""}" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /></svg>
        <span class="stitle">${e}</span>
        <span class="chip dim">${i}</span>
      </div>
      ${r?n:""}
    </div>`}_contentRow(t,e){let i=e==="layout"&&!!this.activePage&&t.id===this.activePage;return c`<div class="mrow">
      ${this._thumb(t.thumb)}
      <div class="cell-name">${t.label}
        ${t.compat?.length?c`<span class="hint">[${t.compat.join("/")}]</span>`:""}
        ${e==="screenset"?c`<span class="hint">${t.screens} page(s)</span>`:""}</div>
      <div class="hint">${t.requires?.length?c`<span title=${t.requires.join(", ")}>${t.requires.length} dep(s)</span>`:"\u2014"}</div>
      <div class="badges">${i?c`<span class="badge ok">on device</span>`:""}${t.compatible?c`<span class="badge ok">compatible</span>`:c`<span class="badge warn">other model</span>`}</div>
      <div class="cell-action"><button ?disabled=${!this.entryId} title=${this.entryId?"":"Select a device to deploy"}
        @click=${()=>e==="layout"?this.deployLayout(t.id,t.compatible):this.deployScreenset(t.id,t.compatible)}>${i?"Re-deploy":"Deploy"}</button>
        <button class="danger" title=${e==="layout"?"Delete this page from the library":"Delete this playlist"}
          @click=${()=>e==="layout"?this.deletePage(t.id,t.label):this.deletePlaylist(t.id,t.label)}>Delete</button></div>
    </div>`}_marketplaceView(){let t=this.showAllContent,e=this.contentLayouts.filter(a=>t||a.compatible),i=this.contentScreensets.filter(a=>t||a.compatible),n={installed:"ok",outdated:"warn",not_installed:""},r={installed:"installed",outdated:"update available",not_installed:"not installed"};return c`
      <div class="bar">
        <label><input type="checkbox" .checked=${this.showAllContent}
          @change=${a=>{this.showAllContent=a.target.checked}} /> show all models</label>
        <span class="grow"></span>
        <button class="secondary" @click=${this.loadCatalog}>Refresh</button>
      </div>

      ${this._section("pages","Pages",e.length,c`
        <div class="panelrow"><button @click=${this.newPage} title="Start a new page in the Designer">+ New page</button></div>
        ${e.length?c`<div class="mtable">${this._mhead()}${e.map(a=>this._contentRow(a,"layout"))}</div>`:c`<p class="hint">No published pages${t?"":" for this device"} yet. Create one above, then Publish it from the Designer.</p>`}`)}

      ${this._section("playlists","Playlists",i.length,i.length?c`<div class="mtable">${this._mhead()}${i.map(a=>this._contentRow(a,"screenset"))}</div>`:c`<p class="hint">No playlists${t?"":" for this device"}. Compose one on the Playlists tab.</p>`)}

      ${this._section("widgets","Widgets & fonts",this.catalog.length,this.entryId?c`<div class="mtable">${this._mhead()}
            ${this.catalog.map(a=>c`<div class="mrow">
              ${this._thumb(a.thumb)}
              <div class="cell-name">${a.label}</div>
              <div class="hint">${a.requires?.length?c`<span title=${a.requires.join(", ")}>${a.requires.length} dep(s)</span>`:"\u2014"}</div>
              <div><span class="badge ${n[a.status]??""}">${r[a.status]??a.status}</span></div>
              <div class="cell-action">${this.busyUnits[a.id]?c`<span class="badge working">${this.busyUnits[a.id]}…</span>`:a.status==="installed"?c`<button class="danger" @click=${()=>this.removeWidgetUnit(a.id)}>Remove</button>`:c`<button @click=${()=>this.installWidget(a.id)}>${a.status==="outdated"?"Update":"Install"}</button>`}</div>
            </div>`)}
          </div>`:c`<p class="hint">Select a device to manage installed widgets.</p>`)}

      ${this._section("icons","Icons",this.installedIcons.length,c`
        <p class="hint">Built-in icons ship with the engine. Add LaMetric gallery icons by code, then choose which devices to install them on.</p>
        <div class="panelrow">
          ${this.iconCode?c`<img class="iconprev" alt=""
            src="https://developer.lametric.com/content/apps/icon_thumbs/${this.iconCode}"
            @load=${a=>a.target.style.visibility="visible"}
            @error=${a=>a.target.style.visibility="hidden"} />`:c`<div class="iconprev empty"></div>`}
          <div class="grow">
            <div class="panelrow">
              <label>LaMetric code</label>
              <input type="number" style="width:100px" .value=${this.iconCode}
                @input=${a=>{this.iconCode=a.target.value}} />
              <label>Name</label>
              <input style="width:120px" .value=${this.iconName}
                @input=${a=>{this.iconName=a.target.value}} />
            </div>
            ${this.devices.length?c`<div class="panelrow">
              <label>Install on</label>
              <span class="targets">
                ${this.devices.map(a=>c`<label class="chk">
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
          ${this.iconFilePreview?c`<img class="iconprev" alt="" src=${this.iconFilePreview} />`:c`<div class="iconprev empty"></div>`}
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
              ${this.iconSizeMode==="custom"?c`
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
            ${this.iconImportNote?c`<p class="hint">${this.iconImportNote}</p>`:""}
          </div>
        </div>
        ${this.entryId?c`<p class="hint">“Install on device” / “Remove from device” affect only the selected device. “Delete everywhere” removes the icon from the library and every device.</p>`:c`<p class="hint">Select a device above to install or remove these on a specific device. “Delete everywhere” removes an icon from the library and every device.</p>`}
        ${this.installedIcons.length?this.installedIcons.map(a=>{let l=this.deviceIcons.includes(a);return c`<div class="iconrow">
              ${this.iconThumbs[a]?c`<img class="iconthumb" alt="" src="data:image/gif;base64,${this.iconThumbs[a]}" />`:c`<div class="iconthumb empty"></div>`}
              <span class="grow">${a}${this.iconDims[a]?c` <span class="hint">${this.iconDims[a][0]}×${this.iconDims[a][1]}</span>`:""}
                ${this.iconTrunc[a]?c`<span class="badge warn" title="Its source had more frames than fit the device budget">trimmed ${this.iconTrunc[a][0]}/${this.iconTrunc[a][1]} frames</span>`:""}
                ${this.entryId&&this.iconOversize(a)?c`<span class="badge warn" title="Larger than this device (${this.dims[0]}×${this.dims[1]}) — won't fit and may hang it">too big for this device</span>`:""}</span>
              ${this.entryId?l?c`<span class="badge ok">on this device</span>
                      <button class="secondary" title="Take this icon off the selected device (stays in the library)"
                        @click=${()=>this.removeIconFromDevice(a)}>Remove from device</button>`:this.iconOversize(a)?c`<button class="danger" title="This icon is larger than the device screen. Pushing it is for testing only and may hang the device."
                        @click=${()=>this.pushIconToDevice(a)}>Test on device ⚠</button>`:c`<button class="secondary" title="Push this icon to the selected device"
                        @click=${()=>this.pushIconToDevice(a)}>Install on device</button>`:""}
              <button class="danger" title="Delete from the library and every device"
                @click=${()=>this.removeIcon(a)}>Delete everywhere</button></div>`}):c`<p class="hint">No custom icons installed yet.</p>`}
      `)}

      ${this._section("fonts","Fonts",this.fonts.length,c`
        <p class="hint">Type below to preview live in every font. Digit fonts (clock faces) show only numerals; alpha fonts cover A–Z. Fonts install automatically with any widget that needs them, or install one directly onto the selected device here (no reboot).</p>
        <div class="panelrow">
          <label>Preview text</label>
          <input style="width:220px" placeholder="type to preview…" .value=${this.fontText}
            @input=${a=>this.onFontInput(a.target.value)} />
        </div>
        ${[...this.fonts].sort((a,l)=>a.h-l.h||a.w-l.w||a.label.localeCompare(l.label)).map(a=>c`<div class="frow">
          <div class="fmeta"><span class="cell-name">${a.label}</span>
            <span class="hint">${a.kind==="digits"?"digits":"A\u2013Z 0\u20139"} · ${a.w}×${a.h}</span></div>
          ${this.fontPngs[a.name]?c`<img class="fprev" alt="" src="data:image/png;base64,${this.fontPngs[a.name]}" />`:c`<div class="fprev empty"></div>`}
          ${a.builtin?c`<span class="badge ok">built-in</span>`:this.entryId?a.installed?c`<span class="badge ok">installed</span>`:c`<button @click=${()=>this.installFont(a.name)}>Install</button>`:""}
        </div>`)}
      `)}
      <p class="hint">Deploying a page installs any widgets/fonts it needs over the air first, then pushes it; the device reboots if files changed.</p>
    `}onSpecInput(t){this.specText=t,clearTimeout(this.specTimer),this.specTimer=window.setTimeout(()=>this.previewSpec(),400)}async previewSpec(){let t;try{t=JSON.parse(this.specText)}catch(e){this.specError=`JSON: ${e.message}`;return}try{let e=await this.hass.callWS({type:"pimoroni_unicorn/widget_preview",model:this.model,spec:t});this.playFrames("spec",e.frames??(e.png?[e.png]:[]),i=>{this.specPng=i}),this.specError=""}catch(e){this.specError=e?.message??String(e)}}async importSpec(t){try{let e=await this.hass.callWS({type:"pimoroni_unicorn/widget_import",text:t});this.specText=JSON.stringify(e.spec,null,2),this.specError="",this.previewSpec()}catch(e){this.specError=e?.message??String(e)}}async saveSpec(){let t;try{t=JSON.parse(this.specText)}catch(e){this.specError=`JSON: ${e.message}`;return}try{let e=await this.hass.callWS({type:"pimoroni_unicorn/widget_save",spec:t});this.specError="",this.status=`Saved custom widget "${e.id}". Install it from the Marketplace tab.`}catch(e){this.specError=e?.message??String(e)}}parsedSpec(){try{return JSON.parse(this.specText)}catch{return null}}writeSpec(t){this.specText=JSON.stringify(t,null,2),this.specError="",clearTimeout(this.specTimer),this.specTimer=window.setTimeout(()=>this.previewSpec(),120)}setSpecField(t,e){let i=this.parsedSpec();i&&(i[t]=e,this.writeSpec(i))}setOpField(t,e,i){let n=this.parsedSpec();if(!n||!Array.isArray(n.draw))return;let r=n.draw[t]??{};n.draw[t]=e==="op"?{op:i,x:r.x??0,y:r.y??0}:{...r,[e]:i},this.writeSpec(n)}addOp(t){let e=this.parsedSpec()??{};e.draw=[...e.draw??[],{op:t,x:0,y:0}],this.writeSpec(e)}removeOp(t){let e=this.parsedSpec();!e||!Array.isArray(e.draw)||(e.draw.splice(t,1),this.writeSpec(e))}_opField(t,e,i,n){let r=Yt[i]?.hint,a=c`<span class="flabel">${xe(i)}</span>`,l;return n==="rgb"?l=this.colorCtl(t[i]??[255,255,255],d=>this.setOpField(e,i,d)):n==="num"?l=c`<input type="number" style="width:64px" .value=${String(t[i]??0)} @change=${d=>this.setOpField(e,i,+d.target.value)} />`:n==="icon"?l=c`<select @change=${d=>this.setOpField(e,i,d.target.value)}>
        ${this.iconNames.map(d=>c`<option ?selected=${t[i]===d}>${d}</option>`)}</select>`:i==="bind"?l=c`<input type="text" style="width:140px" list="pu-bind-list" placeholder="solar…"
        .value=${String(t[i]??"")} @change=${d=>this.setOpField(e,i,d.target.value)} />`:i==="fmt"?l=c`<input type="text" style="width:96px" placeholder="{:.1f}"
        .value=${String(t[i]??"")} @change=${d=>this.setOpField(e,i,d.target.value)} />
        ${["{}","{:.0f}","{:.1f}","{}%","{:.1f}\xB0"].map(d=>c`<button class="fmtchip" title="Use ${d}" @click=${()=>this.setOpField(e,"fmt",d)}>${d}</button>`)}`:l=c`<input type="text" style="width:120px" .value=${String(t[i]??"")} @change=${d=>this.setOpField(e,i,d.target.value)} />`,c`${a}<span class="fcell">${l}${r?c`<span class="fhint">${r}</span>`:""}</span>`}_opEditor(t,e){let i=Y[t.op]??{label:t.op,desc:""};return c`<div class="opcard">
      <div class="ophead">
        <span class="optitle">${i.label}</span>
        <select title="Change op type" @change=${n=>this.setOpField(e,"op",n.target.value)}>
          ${Jt.map(n=>c`<option value=${n} ?selected=${n===t.op}>${Y[n]?.label??n}</option>`)}</select>
        <span class="grow"></span>
        <button class="danger zbtn" title="Remove op" @click=${()=>this.removeOp(e)}>✕</button>
      </div>
      ${i.desc?c`<p class="opdesc">${i.desc}</p>`:""}
      <div class="fieldgrid">
        <span class="flabel">Position</span>
        <span class="fcell">
          <label class="fhint">X</label><input type="number" style="width:64px" .value=${String(t.x??0)} @change=${n=>this.setOpField(e,"x",+n.target.value)} />
          <label class="fhint">Y</label><input type="number" style="width:64px" .value=${String(t.y??0)} @change=${n=>this.setOpField(e,"y",+n.target.value)} />
        </span>
        ${(fe[t.op]??[]).map(([n,r])=>this._opField(t,e,n,r))}
      </div>
    </div>`}_formView(){let t=this.parsedSpec();return t?c`
      <datalist id="pu-bind-list">
        ${Kt.map(e=>c`<option value=${e}></option>`)}
        ${Object.keys(this.hass?.states??{}).map(e=>c`<option value=${e}></option>`)}
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
      <p class="hint">Each op draws one element, in order. Available data: ${Kt.join(", ")} (unknown binds preview as 123).</p>
      ${(t.draw??[]).map((e,i)=>this._opEditor(e,i))}
      <p class="hint">Add an op:</p>
      <div class="addchips">
        ${Jt.map(e=>c`<button class="addchip" title=${Y[e]?.desc??""} @click=${()=>this.addOp(e)}>+ ${Y[e]?.label??e}</button>`)}
      </div>
    `:c`<p class="status err">Spec isn't valid JSON — switch to YAML / JSON to fix it.</p>`}_paintView(){return c`<div class="pane">
      <p class="hint">Paint an icon at this device's resolution, or load an image and edit it. Black = off (checkerboard). Saves to your icon library.</p>
      <pixel-editor .w=${this.dims[0]} .h=${this.dims[1]}
        .decode=${this._iconDecode}
        @save=${t=>this._saveEditorIcon(t.detail)}></pixel-editor>
    </div>`}async _saveEditorIcon(t){let e=t.dataUrl.slice(t.dataUrl.indexOf(",")+1),i=this.iconTargetIds();try{let r=(await this.hass.callWS({type:"pimoroni_unicorn/icon_upload",name:t.name,data:e,max_w:t.w,max_h:t.h,entry_ids:i})).sent??[];this.status=r.length?`Saved "${t.name}" \u2192 ${r.join(", ")}.`:`Saved "${t.name}" (no devices to push to).`,this.reloadIconsSoon()}catch(n){this.status=`Save failed: ${n?.message??n}`}}_editorView(){let t=Math.max(6,Math.floor(ht/this.dims[0]));return c`
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
          ${this.editMode==="form"?this._formView():c`<textarea class="spec" .value=${this.specText}
                @input=${e=>this.onSpecInput(e.target.value)}></textarea>`}
          <div class="panelrow">
            <button @click=${this.saveSpec}>Save custom</button>
            <button class="secondary" @click=${()=>{let e=prompt("Paste YAML or JSON widget spec:");e&&this.importSpec(e)}}>Import…</button>
          </div>
          ${this.specError?c`<div class="status err">${this.specError}</div>`:c`<div class="hint">binds: solar, soc, consumption, co2… (unknown binds preview as 123)</div>`}
        </div>
        <div class="col">
          <div class="stage" style=${`width:${this.dims[0]*t}px;height:${this.dims[1]*t}px`}>
            ${this.specPng?c`<img src="data:image/png;base64,${this.specPng}" alt="Widget preview" width=${this.dims[0]*t} height=${this.dims[1]*t} />`:""}
          </div>
        </div>
      </div>
    `}toggleScreen(t,e){this.screenLayouts=e?[...this.screenLayouts,t]:this.screenLayouts.filter(i=>i!==t),this.buildScreenPreview()}moveScreen(t,e){let i=[...this.screenLayouts],n=i.indexOf(t),r=n+e;n<0||r<0||r>=i.length||([i[n],i[r]]=[i[r],i[n]],this.screenLayouts=i,this.buildScreenPreview())}async buildScreenPreview(){clearInterval(this.screenTimer);let t={};await Promise.all(this.screenLayouts.map(async e=>{let i=this.stored[e];if(i)try{let n=await this.hass.callWS({type:"pimoroni_unicorn/render",model:this.model,layout:i});t[e]=n.png}catch{}})),this.screenPngs=t,this.screenIdx=0,this.screenOpacity=1,this.screenLayouts.length>1&&this.screenDwell>0&&(this.screenTimer=window.setInterval(()=>this._advancePreview(),this.screenDwell*1e3))}_advancePreview(){let t=(this.screenIdx+1)%this.screenLayouts.length;this.screenTransition==="fade"?(this.screenOpacity=0,setTimeout(()=>{this.screenIdx=t,this.screenOpacity=1},280)):this.screenIdx=t}async pushScreens(){!this.entryId||!this.screenLayouts.length||(await this.hass.callWS({type:"pimoroni_unicorn/push_screens",entry_id:this.entryId,layouts:this.screenLayouts,dwell:this.screenDwell,transition:this.screenTransition}),this.status=`Pushed ${this.screenLayouts.length} page(s) to device.`)}_screensView(){let t=Math.max(6,Math.floor(ht/this.dims[0])),e=Object.keys(this.stored),i=this.screenLayouts[this.screenIdx],n=i?this.screenPngs[i]:"";return c`
      <div class="bar"><span class="hint">compose a playlist — pages cycle on a timer; preview on ${this.model}</span></div>
      <div class="wrap">
        <div class="col">
          <h3>Pages in this playlist</h3>
          <p class="hint">Tick pages to include, then order them with ▲ ▼.</p>
          ${e.length?e.map(r=>{let a=this.screenLayouts.includes(r),l=this.screenLayouts.indexOf(r);return c`<div class="panelrow" tabindex=${a?"0":"-1"}
              @keydown=${a?d=>{d.altKey&&d.key==="ArrowUp"?(d.preventDefault(),this.moveScreen(r,-1)):d.altKey&&d.key==="ArrowDown"&&(d.preventDefault(),this.moveScreen(r,1))}:void 0}>
              <input type="checkbox" ?checked=${a}
                @change=${d=>this.toggleScreen(r,d.target.checked)} />
              ${a?c`<span class="chip" title="Position ${l+1}">${l+1}</span>`:""}
              <span class="grow">${r}</span>
              ${a?c`
                <button class="zbtn secondary" ?disabled=${l===0} @click=${()=>this.moveScreen(r,-1)} title="Move up" aria-label="Move ${r} up">▲</button>
                <button class="zbtn secondary" ?disabled=${l===this.screenLayouts.length-1} @click=${()=>this.moveScreen(r,1)} title="Move down" aria-label="Move ${r} down">▼</button>`:""}
            </div>`}):c`<p class="hint">No saved pages yet — create one on the Designer tab.</p>`}
          <div class="panelrow"><label>Dwell (s)
            <input type="number" style="width:60px" min="1" max="600" .value=${String(this.screenDwell)}
              @change=${r=>{this.screenDwell=+r.target.value,this.buildScreenPreview()}} /></label></div>
          <div class="panelrow"><label>Transition
            <select @change=${r=>{this.screenTransition=r.target.value,this.buildScreenPreview()}}>
              ${["none","fade"].map(r=>c`<option ?selected=${r===this.screenTransition}>${r}</option>`)}
            </select></label></div>
          <div class="panelrow">
            <button @click=${this.pushScreens} ?disabled=${!this.entryId} title=${this.entryId?"":"Select a device to push"}>Push to device</button>
            <button class="secondary" @click=${this.saveScreenset} ?disabled=${!this.screenLayouts.length} title="Save as a reusable playlist in the marketplace">Save as playlist</button>
          </div>
        </div>
        <div class="col">
          <div class="stage" style=${`width:${this.dims[0]*t}px;height:${this.dims[1]*t}px`}>
            ${n?c`<img src="data:image/png;base64,${n}" alt="Playlist preview" width=${this.dims[0]*t} height=${this.dims[1]*t}
              style=${`opacity:${this.screenOpacity};transition:opacity 280ms`} />`:""}
          </div>
          <div class="hint">${this.screenLayouts.length>1?`playing ${this.screenIdx+1}/${this.screenLayouts.length}: ${i??""}`:i??"tick pages to preview"}</div>
        </div>
      </div>
    `}};p([I({attribute:!1})],u.prototype,"hass",2),p([h()],u.prototype,"devices",2),p([h()],u.prototype,"entryId",2),p([h()],u.prototype,"model",2),p([h()],u.prototype,"layout",2),p([h()],u.prototype,"caps",2),p([h()],u.prototype,"widgetThumbs",2),p([h()],u.prototype,"overlayCaps",2),p([h()],u.prototype,"defaultLayout",2),p([h()],u.prototype,"stored",2),p([h()],u.prototype,"png",2),p([h()],u.prototype,"wboxes",2),p([h()],u.prototype,"dims",2),p([h()],u.prototype,"orientation",2),p([h()],u.prototype,"previewWeather",2),p([h()],u.prototype,"zoom",2),p([h()],u.prototype,"selected",2),p([h()],u.prototype,"dragIdx",2),p([h()],u.prototype,"dragOverIdx",2),p([h()],u.prototype,"layoutName",2),p([h()],u.prototype,"live",2),p([h()],u.prototype,"wireframe",2),p([h()],u.prototype,"locked",2),p([h()],u.prototype,"status",2),p([h()],u.prototype,"tab",2),p([h()],u.prototype,"catalog",2),p([h()],u.prototype,"busyUnits",2),p([h()],u.prototype,"fwManifest",2),p([h()],u.prototype,"activePage",2),p([h()],u.prototype,"contentLayouts",2),p([h()],u.prototype,"contentScreensets",2),p([h()],u.prototype,"showAllContent",2),p([h()],u.prototype,"iconNames",2),p([h()],u.prototype,"installedIcons",2),p([h()],u.prototype,"iconThumbs",2),p([h()],u.prototype,"deviceIcons",2),p([h()],u.prototype,"iconCode",2),p([h()],u.prototype,"iconName",2),p([h()],u.prototype,"iconTargets",2),p([h()],u.prototype,"iconUrl",2),p([h()],u.prototype,"iconImgName",2),p([h()],u.prototype,"iconFileData",2),p([h()],u.prototype,"iconFilePreview",2),p([h()],u.prototype,"iconImportNote",2),p([h()],u.prototype,"iconDims",2),p([h()],u.prototype,"iconTrunc",2),p([h()],u.prototype,"iconSizeMode",2),p([h()],u.prototype,"iconCustomW",2),p([h()],u.prototype,"iconCustomH",2),p([h()],u.prototype,"fonts",2),p([h()],u.prototype,"fontText",2),p([h()],u.prototype,"fontPngs",2),p([h()],u.prototype,"dirty",2),p([h()],u.prototype,"undoStack",2),p([h()],u.prototype,"redoStack",2),p([h()],u.prototype,"sectionsOpen",2),p([h()],u.prototype,"screenLayouts",2),p([h()],u.prototype,"screenDwell",2),p([h()],u.prototype,"screenTransition",2),p([h()],u.prototype,"screenPngs",2),p([h()],u.prototype,"screenIdx",2),p([h()],u.prototype,"screenOpacity",2),p([h()],u.prototype,"specText",2),p([h()],u.prototype,"editMode",2),p([h()],u.prototype,"specPng",2),p([h()],u.prototype,"specError",2),p([h()],u.prototype,"fitPx",2);customElements.get("pimoroni-unicorn-panel")||customElements.define("pimoroni-unicorn-panel",u);export{u as PimoroniUnicornPanel};
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
