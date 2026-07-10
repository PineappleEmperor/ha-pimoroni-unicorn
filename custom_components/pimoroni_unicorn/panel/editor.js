var Vt=Object.defineProperty;var qt=Object.getOwnPropertyDescriptor;var h=(c,a,t,e)=>{for(var i=e>1?void 0:e?qt(a,t):a,n=c.length-1,r;n>=0;n--)(r=c[n])&&(i=(e?r(a,t,i):r(i))||i);return e&&i&&Vt(a,t,i),i};var j=globalThis,B=j.ShadowRoot&&(j.ShadyCSS===void 0||j.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,X=Symbol(),mt=new WeakMap,N=class{constructor(a,t,e){if(this._$cssResult$=!0,e!==X)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=a,this.t=t}get styleSheet(){let a=this.o,t=this.t;if(B&&a===void 0){let e=t!==void 0&&t.length===1;e&&(a=mt.get(t)),a===void 0&&((this.o=a=new CSSStyleSheet).replaceSync(this.cssText),e&&mt.set(t,a))}return a}toString(){return this.cssText}},vt=c=>new N(typeof c=="string"?c:c+"",void 0,X),O=(c,...a)=>{let t=c.length===1?c[0]:a.reduce((e,i,n)=>e+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+c[n+1],c[0]);return new N(t,c,X)},yt=(c,a)=>{if(B)c.adoptedStyleSheets=a.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of a){let e=document.createElement("style"),i=j.litNonce;i!==void 0&&e.setAttribute("nonce",i),e.textContent=t.cssText,c.appendChild(e)}},Z=B?c=>c:c=>c instanceof CSSStyleSheet?(a=>{let t="";for(let e of a.cssRules)t+=e.cssText;return vt(t)})(c):c;var{is:Jt,defineProperty:Kt,getOwnPropertyDescriptor:Yt,getOwnPropertyNames:Xt,getOwnPropertySymbols:Zt,getPrototypeOf:Gt}=Object,V=globalThis,bt=V.trustedTypes,Qt=bt?bt.emptyScript:"",te=V.reactiveElementPolyfillSupport,R=(c,a)=>c,H={toAttribute(c,a){switch(a){case Boolean:c=c?Qt:null;break;case Object:case Array:c=c==null?c:JSON.stringify(c)}return c},fromAttribute(c,a){let t=c;switch(a){case Boolean:t=c!==null;break;case Number:t=c===null?null:Number(c);break;case Object:case Array:try{t=JSON.parse(c)}catch{t=null}}return t}},q=(c,a)=>!Jt(c,a),ft={attribute:!0,type:String,converter:H,reflect:!1,useDefault:!1,hasChanged:q};Symbol.metadata??=Symbol("metadata"),V.litPropertyMetadata??=new WeakMap;var S=class extends HTMLElement{static addInitializer(a){this._$Ei(),(this.l??=[]).push(a)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(a,t=ft){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(a)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(a,t),!t.noAccessor){let e=Symbol(),i=this.getPropertyDescriptor(a,e,t);i!==void 0&&Kt(this.prototype,a,i)}}static getPropertyDescriptor(a,t,e){let{get:i,set:n}=Yt(this.prototype,a)??{get(){return this[t]},set(r){this[t]=r}};return{get:i,set(r){let s=i?.call(this);n?.call(this,r),this.requestUpdate(a,s,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(a){return this.elementProperties.get(a)??ft}static _$Ei(){if(this.hasOwnProperty(R("elementProperties")))return;let a=Gt(this);a.finalize(),a.l!==void 0&&(this.l=[...a.l]),this.elementProperties=new Map(a.elementProperties)}static finalize(){if(this.hasOwnProperty(R("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(R("properties"))){let t=this.properties,e=[...Xt(t),...Zt(t)];for(let i of e)this.createProperty(i,t[i])}let a=this[Symbol.metadata];if(a!==null){let t=litPropertyMetadata.get(a);if(t!==void 0)for(let[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(let[t,e]of this.elementProperties){let i=this._$Eu(t,e);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(a){let t=[];if(Array.isArray(a)){let e=new Set(a.flat(1/0).reverse());for(let i of e)t.unshift(Z(i))}else a!==void 0&&t.push(Z(a));return t}static _$Eu(a,t){let e=t.attribute;return e===!1?void 0:typeof e=="string"?e:typeof a=="string"?a.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(a=>this.enableUpdating=a),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(a=>a(this))}addController(a){(this._$EO??=new Set).add(a),this.renderRoot!==void 0&&this.isConnected&&a.hostConnected?.()}removeController(a){this._$EO?.delete(a)}_$E_(){let a=new Map,t=this.constructor.elementProperties;for(let e of t.keys())this.hasOwnProperty(e)&&(a.set(e,this[e]),delete this[e]);a.size>0&&(this._$Ep=a)}createRenderRoot(){let a=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return yt(a,this.constructor.elementStyles),a}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(a=>a.hostConnected?.())}enableUpdating(a){}disconnectedCallback(){this._$EO?.forEach(a=>a.hostDisconnected?.())}attributeChangedCallback(a,t,e){this._$AK(a,e)}_$ET(a,t){let e=this.constructor.elementProperties.get(a),i=this.constructor._$Eu(a,e);if(i!==void 0&&e.reflect===!0){let n=(e.converter?.toAttribute!==void 0?e.converter:H).toAttribute(t,e.type);this._$Em=a,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(a,t){let e=this.constructor,i=e._$Eh.get(a);if(i!==void 0&&this._$Em!==i){let n=e.getPropertyOptions(i),r=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:H;this._$Em=i;let s=r.fromAttribute(t,n.type);this[i]=s??this._$Ej?.get(i)??s,this._$Em=null}}requestUpdate(a,t,e,i=!1,n){if(a!==void 0){let r=this.constructor;if(i===!1&&(n=this[a]),e??=r.getPropertyOptions(a),!((e.hasChanged??q)(n,t)||e.useDefault&&e.reflect&&n===this._$Ej?.get(a)&&!this.hasAttribute(r._$Eu(a,e))))return;this.C(a,t,e)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(a,t,{useDefault:e,reflect:i,wrapped:n},r){e&&!(this._$Ej??=new Map).has(a)&&(this._$Ej.set(a,r??t??this[a]),n!==!0||r!==void 0)||(this._$AL.has(a)||(this.hasUpdated||e||(t=void 0),this._$AL.set(a,t)),i===!0&&this._$Em!==a&&(this._$Eq??=new Set).add(a))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let a=this.scheduleUpdate();return a!=null&&await a,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[i,n]of e){let{wrapped:r}=n,s=this[i];r!==!0||this._$AL.has(i)||s===void 0||this.C(i,void 0,n,s)}}let a=!1,t=this._$AL;try{a=this.shouldUpdate(t),a?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(e){throw a=!1,this._$EM(),e}a&&this._$AE(t)}willUpdate(a){}_$AE(a){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(a)),this.updated(a)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(a){return!0}update(a){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(a){}firstUpdated(a){}};S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[R("elementProperties")]=new Map,S[R("finalized")]=new Map,te?.({ReactiveElement:S}),(V.reactiveElementVersions??=[]).push("2.1.2");var at=globalThis,xt=c=>c,J=at.trustedTypes,$t=J?J.createPolicy("lit-html",{createHTML:c=>c}):void 0,It="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,Tt="?"+E,ee=`<${Tt}>`,C=document,z=()=>C.createComment(""),F=c=>c===null||typeof c!="object"&&typeof c!="function",nt=Array.isArray,ie=c=>nt(c)||typeof c?.[Symbol.iterator]=="function",G=`[ 	
\f\r]`,W=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,wt=/-->/g,_t=/>/g,T=RegExp(`>|${G}(?:([^\\s"'>=/]+)(${G}*=${G}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),St=/'/g,kt=/"/g,At=/^(?:script|style|textarea|title)$/i,rt=c=>(a,...t)=>({_$litType$:c,strings:a,values:t}),l=rt(1),ye=rt(2),be=rt(3),M=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),Et=new WeakMap,A=C.createTreeWalker(C,129);function Ct(c,a){if(!nt(c)||!c.hasOwnProperty("raw"))throw Error("invalid template strings array");return $t!==void 0?$t.createHTML(a):a}var se=(c,a)=>{let t=c.length-1,e=[],i,n=a===2?"<svg>":a===3?"<math>":"",r=W;for(let s=0;s<t;s++){let o=c[s],d,g,m=-1,v=0;for(;v<o.length&&(r.lastIndex=v,g=r.exec(o),g!==null);)v=r.lastIndex,r===W?g[1]==="!--"?r=wt:g[1]!==void 0?r=_t:g[2]!==void 0?(At.test(g[2])&&(i=RegExp("</"+g[2],"g")),r=T):g[3]!==void 0&&(r=T):r===T?g[0]===">"?(r=i??W,m=-1):g[1]===void 0?m=-2:(m=r.lastIndex-g[2].length,d=g[1],r=g[3]===void 0?T:g[3]==='"'?kt:St):r===kt||r===St?r=T:r===wt||r===_t?r=W:(r=T,i=void 0);let y=r===T&&c[s+1].startsWith("/>")?" ":"";n+=r===W?o+ee:m>=0?(e.push(d),o.slice(0,m)+It+o.slice(m)+E+y):o+E+(m===-2?s:y)}return[Ct(c,n+(c[t]||"<?>")+(a===2?"</svg>":a===3?"</math>":"")),e]},P=class c{constructor({strings:a,_$litType$:t},e){let i;this.parts=[];let n=0,r=0,s=a.length-1,o=this.parts,[d,g]=se(a,t);if(this.el=c.createElement(d,e),A.currentNode=this.el.content,t===2||t===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(i=A.nextNode())!==null&&o.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let m of i.getAttributeNames())if(m.endsWith(It)){let v=g[r++],y=i.getAttribute(m).split(E),x=/([.?@])?(.*)/.exec(v);o.push({type:1,index:n,name:x[2],strings:y,ctor:x[1]==="."?tt:x[1]==="?"?et:x[1]==="@"?it:D}),i.removeAttribute(m)}else m.startsWith(E)&&(o.push({type:6,index:n}),i.removeAttribute(m));if(At.test(i.tagName)){let m=i.textContent.split(E),v=m.length-1;if(v>0){i.textContent=J?J.emptyScript:"";for(let y=0;y<v;y++)i.append(m[y],z()),A.nextNode(),o.push({type:2,index:++n});i.append(m[v],z())}}}else if(i.nodeType===8)if(i.data===Tt)o.push({type:2,index:n});else{let m=-1;for(;(m=i.data.indexOf(E,m+1))!==-1;)o.push({type:7,index:n}),m+=E.length-1}n++}}static createElement(a,t){let e=C.createElement("template");return e.innerHTML=a,e}};function L(c,a,t=c,e){if(a===M)return a;let i=e!==void 0?t._$Co?.[e]:t._$Cl,n=F(a)?void 0:a._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(c),i._$AT(c,t,e)),e!==void 0?(t._$Co??=[])[e]=i:t._$Cl=i),i!==void 0&&(a=L(c,i._$AS(c,a.values),i,e)),a}var Q=class{constructor(a,t){this._$AV=[],this._$AN=void 0,this._$AD=a,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(a){let{el:{content:t},parts:e}=this._$AD,i=(a?.creationScope??C).importNode(t,!0);A.currentNode=i;let n=A.nextNode(),r=0,s=0,o=e[0];for(;o!==void 0;){if(r===o.index){let d;o.type===2?d=new U(n,n.nextSibling,this,a):o.type===1?d=new o.ctor(n,o.name,o.strings,this,a):o.type===6&&(d=new st(n,this,a)),this._$AV.push(d),o=e[++s]}r!==o?.index&&(n=A.nextNode(),r++)}return A.currentNode=C,i}p(a){let t=0;for(let e of this._$AV)e!==void 0&&(e.strings!==void 0?(e._$AI(a,e,t),t+=e.strings.length-2):e._$AI(a[t])),t++}},U=class c{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(a,t,e,i){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=a,this._$AB=t,this._$AM=e,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let a=this._$AA.parentNode,t=this._$AM;return t!==void 0&&a?.nodeType===11&&(a=t.parentNode),a}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(a,t=this){a=L(this,a,t),F(a)?a===b||a==null||a===""?(this._$AH!==b&&this._$AR(),this._$AH=b):a!==this._$AH&&a!==M&&this._(a):a._$litType$!==void 0?this.$(a):a.nodeType!==void 0?this.T(a):ie(a)?this.k(a):this._(a)}O(a){return this._$AA.parentNode.insertBefore(a,this._$AB)}T(a){this._$AH!==a&&(this._$AR(),this._$AH=this.O(a))}_(a){this._$AH!==b&&F(this._$AH)?this._$AA.nextSibling.data=a:this.T(C.createTextNode(a)),this._$AH=a}$(a){let{values:t,_$litType$:e}=a,i=typeof e=="number"?this._$AC(a):(e.el===void 0&&(e.el=P.createElement(Ct(e.h,e.h[0]),this.options)),e);if(this._$AH?._$AD===i)this._$AH.p(t);else{let n=new Q(i,this),r=n.u(this.options);n.p(t),this.T(r),this._$AH=n}}_$AC(a){let t=Et.get(a.strings);return t===void 0&&Et.set(a.strings,t=new P(a)),t}k(a){nt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,e,i=0;for(let n of a)i===t.length?t.push(e=new c(this.O(z()),this.O(z()),this,this.options)):e=t[i],e._$AI(n),i++;i<t.length&&(this._$AR(e&&e._$AB.nextSibling,i),t.length=i)}_$AR(a=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);a!==this._$AB;){let e=xt(a).nextSibling;xt(a).remove(),a=e}}setConnected(a){this._$AM===void 0&&(this._$Cv=a,this._$AP?.(a))}},D=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(a,t,e,i,n){this.type=1,this._$AH=b,this._$AN=void 0,this.element=a,this.name=t,this._$AM=i,this.options=n,e.length>2||e[0]!==""||e[1]!==""?(this._$AH=Array(e.length-1).fill(new String),this.strings=e):this._$AH=b}_$AI(a,t=this,e,i){let n=this.strings,r=!1;if(n===void 0)a=L(this,a,t,0),r=!F(a)||a!==this._$AH&&a!==M,r&&(this._$AH=a);else{let s=a,o,d;for(a=n[0],o=0;o<n.length-1;o++)d=L(this,s[e+o],t,o),d===M&&(d=this._$AH[o]),r||=!F(d)||d!==this._$AH[o],d===b?a=b:a!==b&&(a+=(d??"")+n[o+1]),this._$AH[o]=d}r&&!i&&this.j(a)}j(a){a===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,a??"")}},tt=class extends D{constructor(){super(...arguments),this.type=3}j(a){this.element[this.name]=a===b?void 0:a}},et=class extends D{constructor(){super(...arguments),this.type=4}j(a){this.element.toggleAttribute(this.name,!!a&&a!==b)}},it=class extends D{constructor(a,t,e,i,n){super(a,t,e,i,n),this.type=5}_$AI(a,t=this){if((a=L(this,a,t,0)??b)===M)return;let e=this._$AH,i=a===b&&e!==b||a.capture!==e.capture||a.once!==e.once||a.passive!==e.passive,n=a!==b&&(e===b||i);i&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,a),this._$AH=a}handleEvent(a){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,a):this._$AH.handleEvent(a)}},st=class{constructor(a,t,e){this.element=a,this.type=6,this._$AN=void 0,this._$AM=t,this.options=e}get _$AU(){return this._$AM._$AU}_$AI(a){L(this,a)}};var ae=at.litHtmlPolyfillSupport;ae?.(P,U),(at.litHtmlVersions??=[]).push("3.3.3");var Mt=(c,a,t)=>{let e=t?.renderBefore??a,i=e._$litPart$;if(i===void 0){let n=t?.renderBefore??null;e._$litPart$=i=new U(a.insertBefore(z(),n),n,void 0,t??{})}return i._$AI(c),i};var ot=globalThis,_=class extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let a=super.createRenderRoot();return this.renderOptions.renderBefore??=a.firstChild,a}update(a){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(a),this._$Do=Mt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return M}};_._$litElement$=!0,_.finalized=!0,ot.litElementHydrateSupport?.({LitElement:_});var ne=ot.litElementPolyfillSupport;ne?.({LitElement:_});(ot.litElementVersions??=[]).push("4.2.2");var Lt=c=>(a,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(c,a)}):customElements.define(c,a)};var re={attribute:!0,type:String,converter:H,reflect:!1,hasChanged:q},oe=(c=re,a,t)=>{let{kind:e,metadata:i}=t,n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),e==="setter"&&((c=Object.create(c)).wrapped=!0),n.set(t.name,c),e==="accessor"){let{name:r}=t;return{set(s){let o=a.get.call(this);a.set.call(this,s),this.requestUpdate(r,o,c,!0,s)},init(s){return s!==void 0&&this.C(r,void 0,c,s),s}}}if(e==="setter"){let{name:r}=t;return function(s){let o=this[r];a.call(this,s),this.requestUpdate(r,o,c,!0,s)}}throw Error("Unsupported decorator location: "+e)};function I(c){return(a,t)=>typeof t=="object"?oe(c,a,t):((e,i,n)=>{let r=i.hasOwnProperty(n);return i.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(i,n):void 0})(c,a,t)}function p(c){return I({...c,state:!0,attribute:!1})}function lt(c){let a=c.replace(/^#/,""),t=parseInt(a,16);return[t>>16&255,t>>8&255,t&255]}function Dt(c,a,t){let e=i=>Math.max(0,Math.min(255,i|0)).toString(16).padStart(2,"0");return`#${e(c)}${e(a)}${e(t)}`}function Nt(c,a,t,e,i,n){let r=($,w)=>(w*a+$)*3,s=r(e,i),o=c[s],d=c[s+1],g=c[s+2],[m,v,y]=n;if(o===m&&d===v&&g===y)return;let x=[[e,i]];for(;x.length;){let[$,w]=x.pop();if($<0||w<0||$>=a||w>=t)continue;let k=r($,w);c[k]!==o||c[k+1]!==d||c[k+2]!==g||(c[k]=m,c[k+1]=v,c[k+2]=y,x.push([$+1,w],[$-1,w],[$,w+1],[$,w-1]))}}function Ot(c,a,t){let e=a,i=t,n=-1,r=-1;for(let s=0;s<t;s++)for(let o=0;o<a;o++){let d=(s*a+o)*3;(c[d]||c[d+1]||c[d+2])&&(o<e&&(e=o),o>n&&(n=o),s<i&&(i=s),s>r&&(r=s))}return n<0?null:{x0:e,y0:i,x1:n,y1:r}}function Rt(c,a,t,e,i,n){let r=new Uint8ClampedArray(i*n*3);for(let s=0;s<n;s++)for(let o=0;o<i;o++){let d=(s*i+o)*3,g=((e+s)*a+(t+o))*3;r[d]=c[g],r[d+1]=c[g+1],r[d+2]=c[g+2]}return r}function Ht(c,a,t,e,i,n,r,s){let o=new Uint8ClampedArray(r*s*3);for(let d=0;d<s;d++)for(let g=0;g<r;g++){let m=Math.floor(e+g*n),v=Math.floor(i+d*n),y=(d*r+g)*3;if(m<0||v<0||m>=a||v>=t)continue;let x=(v*a+m)*4;o[y]=c[x],o[y+1]=c[x+1],o[y+2]=c[x+2]}return o}var ct=53,dt=32,le=50,f=class extends _{constructor(){super(...arguments);this.w=16;this.h=16;this.px=new Uint8ClampedArray(16*16*3);this.tool="pencil";this.color="#ff3355";this.swatches=["#ffffff","#ff3355","#33cc66","#3399ff"];this.name="";this.zoomPct=100;this.editCell=0;this.status="";this._skipResize=!1;this.undoStack=[];this.redoStack=[];this.src=null;this.srcOffX=0;this.srcOffY=0;this.painting=!1}willUpdate(t){(t.has("w")||t.has("h"))&&!this._skipResize&&this.resize(this.w,this.h,!1),this._skipResize=!1}get cellPx(){return this.editCell>0?this.editCell:Math.max(3,Math.min(40,Math.floor(Math.min(600/this.w,380/this.h))))}zoomEdit(t){this.editCell=Math.max(3,Math.min(40,this.cellPx+t))}onWheel(t){!t.ctrlKey&&!t.metaKey||(t.preventDefault(),this.zoomEdit(t.deltaY<0?2:-2))}resize(t,e,i){t=Math.max(1,Math.min(ct,t|0)),e=Math.max(1,Math.min(dt,e|0));let n=new Uint8ClampedArray(t*e*3);if(i)for(let r=0;r<Math.min(e,this.h);r++)for(let s=0;s<Math.min(t,this.w);s++){let o=(r*t+s)*3,d=(r*this.w+s)*3;n[o]=this.px[d],n[o+1]=this.px[d+1],n[o+2]=this.px[d+2]}this.w=t,this.h=e,this.px=n,this.draw()}applyResize(t,e){this._skipResize=!0,this.resize(t,e,!0)}_adoptSourceSize(){if(!this.src)return;let t=this.src.w,e=this.src.h;if(t>ct||e>dt){let i=Math.min(ct/t,dt/e);t=Math.max(1,Math.round(t*i)),e=Math.max(1,Math.round(e*i))}this._skipResize=!0,this.w=t,this.h=e,this.px=new Uint8ClampedArray(t*e*3)}fitToContent(){let t=Ot(this.px,this.w,this.h);if(!t){this.status="Nothing drawn to fit.";return}let e=t.x1-t.x0+1,i=t.y1-t.y0+1;if(e===this.w&&i===this.h){this.status="Already tight to the content.";return}this.snapshot();let n=Rt(this.px,this.w,t.x0,t.y0,e,i);this._skipResize=!0,this.w=e,this.h=i,this.px=n,this.draw(),this.status=`Fitted to ${e}\xD7${i}.`}snapshot(){this.undoStack.push(this.px.slice()),this.undoStack.length>le&&this.undoStack.shift(),this.redoStack=[]}undo(){let t=this.undoStack.pop();t&&(this.redoStack.push(this.px.slice()),this.px=t,this.draw())}redo(){let t=this.redoStack.pop();t&&(this.undoStack.push(this.px.slice()),this.px=t,this.draw())}get canvas(){return this.renderRoot.querySelector("canvas")}updated(){this.draw()}draw(){let t=this.canvas;if(!t)return;let e=this.cellPx;t.width=this.w*e,t.height=this.h*e;let i=t.getContext("2d");if(i)for(let n=0;n<this.h;n++)for(let r=0;r<this.w;r++){let s=(n*this.w+r)*3,o=this.px[s],d=this.px[s+1],g=this.px[s+2];o===0&&d===0&&g===0?i.fillStyle=(r+n)%2===0?"#111":"#1d1d1d":i.fillStyle=`rgb(${o},${d},${g})`,i.fillRect(r*e,n*e,e,e)}}cellAt(t){let e=this.canvas;if(!e)return null;let i=e.getBoundingClientRect(),n=Math.floor((t.clientX-i.left)/i.width*this.w),r=Math.floor((t.clientY-i.top)/i.height*this.h);return n<0||r<0||n>=this.w||r>=this.h?null:[n,r]}applyAt(t,e){let i=(e*this.w+t)*3;if(this.tool==="pick"){this.color=Dt(this.px[i],this.px[i+1],this.px[i+2]);return}if(this.tool==="fill"){Nt(this.px,this.w,this.h,t,e,lt(this.color)),this.draw();return}let n=this.tool==="eraser"?[0,0,0]:lt(this.color);this.px[i]=n[0],this.px[i+1]=n[1],this.px[i+2]=n[2],this.draw()}onDown(t){let e=this.cellAt(t);e&&(this.snapshot(),this.painting=this.tool==="pencil"||this.tool==="eraser",t.target.setPointerCapture(t.pointerId),this.applyAt(e[0],e[1]))}onMove(t){if(!this.painting)return;let e=this.cellAt(t);e&&this.applyAt(e[0],e[1])}onUp(){this.painting=!1}async onFile(t){let e=t.target.files?.[0];if(!e)return;let i=await new Promise(n=>{let r=new FileReader;r.onload=()=>n(String(r.result)),r.readAsDataURL(e)});await this.loadImage(i)}async onUrl(){let t=prompt("Image or GIF URL:");if(!(!t||!this.decode))try{let e=await this.decode({url:t,maxW:this.w,maxH:this.h});await this.loadImage(`data:image/png;base64,${e.png}`)}catch(e){this.status=`Load failed: ${e?.message??e}`}}async loadImage(t){let e=new Image;await new Promise((s,o)=>{e.onload=()=>s(),e.onerror=o,e.src=t});let i=document.createElement("canvas");i.width=e.naturalWidth,i.height=e.naturalHeight;let n=i.getContext("2d");if(!n)return;n.drawImage(e,0,0);let r=n.getImageData(0,0,i.width,i.height).data;this.src={data:new Uint8ClampedArray(r),w:i.width,h:i.height},this.zoomPct=100,this.srcOffX=0,this.srcOffY=0,this._adoptSourceSize(),this.stampSource(),this.status=`Imported ${i.width}\xD7${i.height} \u2192 editing at ${this.w}\xD7${this.h}.`}stampSource(){if(!this.src)return;this.snapshot();let e=Math.max(this.src.w/this.w,this.src.h/this.h)*(100/Math.max(1,this.zoomPct));this.px=Ht(this.src.data,this.src.w,this.src.h,this.srcOffX,this.srcOffY,e,this.w,this.h),this.draw()}toDataUrl(){let t=document.createElement("canvas");t.width=this.w,t.height=this.h;let e=t.getContext("2d");if(!e)return"";let i=e.createImageData(this.w,this.h);for(let n=0;n<this.w*this.h;n++)i.data[n*4]=this.px[n*3],i.data[n*4+1]=this.px[n*3+1],i.data[n*4+2]=this.px[n*3+2],i.data[n*4+3]=255;return e.putImageData(i,0,0),t.toDataURL("image/png")}save(){let t=this.name.trim();if(!t){this.status="Name the icon first.";return}this.dispatchEvent(new CustomEvent("save",{detail:{name:t,dataUrl:this.toDataUrl(),w:this.w,h:this.h},bubbles:!0,composed:!0}))}pickColor(t){this.color=t,this.swatches.includes(t)||(this.swatches=[t,...this.swatches].slice(0,8))}render(){let t=(e,i)=>l`
      <button class=${this.tool===e?"on":""} title=${i}
        @click=${()=>{this.tool=e}}>${i}</button>`;return l`
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
            ${this.swatches.map(e=>l`<span style="background:${e}"
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
          ${this.src?l`
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
          ${this.status?l`<span>${this.status}</span>`:""}
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
  `,h([I({type:Number})],f.prototype,"w",2),h([I({type:Number})],f.prototype,"h",2),h([I({attribute:!1})],f.prototype,"decode",2),h([p()],f.prototype,"px",2),h([p()],f.prototype,"tool",2),h([p()],f.prototype,"color",2),h([p()],f.prototype,"swatches",2),h([p()],f.prototype,"name",2),h([p()],f.prototype,"zoomPct",2),h([p()],f.prototype,"editCell",2),h([p()],f.prototype,"status",2),f=h([Lt("pixel-editor")],f);var ht=560,ce=JSON.stringify({id:"my_widget",label:"My Widget",w:16,h:7,default_cfg:{color:[0,255,0]},draw:[{op:"value",x:0,y:1,bind:"solar",fmt:"{:.1f}"},{op:"bar",x:0,y:6,w:16,h:1,bind:"soc",max:100,color:[0,120,255],bg:[30,30,30]}]},null,2),Wt={galactic:[53,11],cosmic:[32,32],stellar:[16,16]},zt=[["clear","Clear"],["partly_cloudy","Partly cloudy"],["cloudy","Cloudy"],["fog","Fog"],["rain","Rain"],["snow","Snow"],["thunderstorm","Storm"]],Ft="__mock__",pt="pu_panel_draft",Pt=["value","bar","rect","pixel","icon","dot"],de={value:[["bind","text"],["fmt","text"],["color","rgb"]],bar:[["w","num"],["h","num"],["bind","text"],["max","num"],["color","rgb"],["bg","rgb"]],rect:[["w","num"],["h","num"],["color","rgb"]],pixel:[["color","rgb"]],icon:[["name","icon"]],dot:[["w","num"],["h","num"],["bind","text"],["on_color","rgb"],["off_color","rgb"]]},Y={value:{label:"Value",desc:"Draw a data value as text \u2014 pick a source and number format."},bar:{label:"Bar",desc:"Horizontal bar that fills from 0 to max by a value."},rect:{label:"Rectangle",desc:"A filled rectangle."},pixel:{label:"Pixel",desc:"A single lit pixel."},icon:{label:"Icon",desc:"Draw an installed icon by name."},dot:{label:"Status dot",desc:"A box that switches colour on a sensor's on/off state."}},jt={bind:{label:"Data source",hint:"what value to show \u2014 see Available data"},fmt:{label:"Number format",hint:"e.g. {:.1f}W or {}%  (Python format)"},color:{label:"Colour"},bg:{label:"Background",hint:"track colour behind the bar"},w:{label:"Width",hint:"pixels"},h:{label:"Height",hint:"pixels"},max:{label:"Max value",hint:"value that fills the bar fully"},name:{label:"Icon"},on_color:{label:"On colour"},off_color:{label:"Off colour"}},Ut=["solar","consumption","soc","temp","weather","energy_mode","co2"],he=c=>jt[c]?.label??c,ut=c=>{let[a,t,e]=c??[0,0,0];return"#"+[a,t,e].map(i=>Math.max(0,Math.min(255,i|0)).toString(16).padStart(2,"0")).join("")},gt=c=>{let a=(c||"").replace("#","");return[0,2,4].map(t=>parseInt(a.substr(t,2),16)||0)},u=class extends _{constructor(){super(...arguments);this.devices=[];this.entryId="";this.model="galactic";this.layout={widgets:[]};this.caps=[];this.widgetThumbs={};this.overlayCaps=[];this.defaultLayout={widgets:[]};this.stored={};this.png="";this.wboxes=[];this.dims=[53,11];this.orientation=0;this.previewWeather="";this.zoom=0;this.selected=-1;this.dragIdx=-1;this.dragOverIdx=-1;this.layoutName="default";this.live=!1;this.wireframe=!1;this.locked=!1;this.status="";this.tab="layout";this.catalog=[];this.busyUnits={};this.fwManifest=null;this.activePage=null;this.contentLayouts=[];this.contentScreensets=[];this.showAllContent=!1;this.iconNames=[];this.installedIcons=[];this.iconThumbs={};this.deviceIcons=[];this.iconCode="";this.iconName="";this.iconTargets=[];this.iconUrl="";this.iconImgName="";this.iconFileData="";this.iconFilePreview="";this.iconImportNote="";this.iconDims={};this.iconTrunc={};this.iconSizeMode="device";this.iconCustomW=16;this.iconCustomH=16;this.fonts=[];this.fontText="";this.fontPngs={};this.fontTimer=0;this.dirty=!1;this.undoStack=[];this.redoStack=[];this.snapshot={widgets:[]};this.sectionsOpen={};this.screenLayouts=[];this.screenDwell=10;this.screenTransition="none";this.screenPngs={};this.screenIdx=0;this.screenOpacity=1;this.screenTimer=0;this.specText=ce;this.editMode="form";this.specPng="";this.specError="";this.specTimer=0;this._frameTimers={};this._pendingDraft=null;this._onBeforeUnload=t=>{this.dirty&&(t.preventDefault(),t.returnValue="")};this._onKey=t=>{let e=t.composedPath()[0],i=e?.tagName;if((t.ctrlKey||t.metaKey)&&t.key.toLowerCase()==="s"){t.preventDefault(),this.save();return}if(i==="INPUT"||i==="SELECT"||i==="TEXTAREA"||e?.isContentEditable)return;if((t.ctrlKey||t.metaKey)&&t.key.toLowerCase()==="z"&&this.tab==="layout"){t.preventDefault(),t.shiftKey?this.redo():this.undo();return}if((t.ctrlKey||t.metaKey)&&t.key.toLowerCase()==="y"&&this.tab==="layout"){t.preventDefault(),this.redo();return}if((t.key==="Delete"||t.key==="Backspace")&&this.tab==="layout"&&this.selected>=0&&this.layout.widgets[this.selected]){t.preventDefault(),this.removeWidget(this.selected);return}let r={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[t.key];!r||this.tab!=="layout"||(t.preventDefault(),this._nudge(r[0],r[1]))};this.fitPx=ht;this._iconDecode=async t=>await this.hass.callWS({type:"pimoroni_unicorn/icon_decode",data:t.data,url:t.url,max_w:t.maxW,max_h:t.maxH})}_persistDraft(){try{localStorage.setItem(pt,JSON.stringify({entryId:this.entryId,layoutName:this.layoutName,layout:this.layout}))}catch{}}_clearDraft(){try{localStorage.removeItem(pt)}catch{}}_applyPendingDraft(){let t=this._pendingDraft;this._pendingDraft=null,!(!t||t.entryId!==this.entryId||!t.layout?.widgets)&&(this.layout=JSON.parse(JSON.stringify(t.layout)),this.layoutName=t.layoutName||this.layoutName,this.snapshot=JSON.parse(JSON.stringify(this.layout)),this.dirty=!0,this.status="Restored your unsaved changes \u2014 Save to keep them, or pick another page to discard.",this.renderPreview())}static{this.styles=O`
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
  `}firstUpdated(){try{let t=localStorage.getItem(pt);this._pendingDraft=t?JSON.parse(t):null}catch{this._pendingDraft=null}this.loadDevices(),this.loadIcons(),this.loadFonts()}updated(){if(this._ro)return;let t=this.renderRoot.querySelector(".stagewrap");t&&(this._ro=new ResizeObserver(e=>{let i=e[0]?.contentRect.width;i&&i>8&&(this.fitPx=Math.max(120,Math.floor(i)))}),this._ro.observe(t))}async loadIcons(){try{let t={type:"pimoroni_unicorn/icons"};this.entryId&&(t.entry_id=this.entryId);let e=await this.hass.callWS(t);this.iconNames=[...e.builtin??[],...e.installed??[]],this.installedIcons=e.installed??[],this.iconThumbs=e.thumbs??{},this.iconDims=e.dims??{},this.iconTrunc=e.trunc??{},this.deviceIcons=e.device_installed??[]}catch{}}reloadIconsSoon(){this.loadIcons(),window.setTimeout(()=>this.loadIcons(),1500),window.setTimeout(()=>this.loadIcons(),4e3)}iconOversize(t){let e=this.iconDims[t];return!!e&&(e[0]>this.dims[0]||e[1]>this.dims[1])}async pushIconToDevice(t,e=!1){if(this.entryId){if(this.iconOversize(t)&&!e){let i=this.iconDims[t];if(!confirm(`\u26A0\uFE0F TEST MODE \u2014 "${t}" is ${i[0]}\xD7${i[1]}, larger than this device (${this.dims[0]}\xD7${this.dims[1]}).

Pushing an oversize icon can hang or crash the device until it is power-cycled. Only do this to test. Continue?`))return;e=!0}try{await this.hass.callWS({type:"pimoroni_unicorn/icon_push",entry_id:this.entryId,name:t,allow_oversize:e}),this.status=`Installing "${t}" on this device\u2026`,this.reloadIconsSoon()}catch(i){this.status=`Install failed: ${i?.message??i}`}}}async removeIconFromDevice(t){if(this.entryId)try{await this.hass.callWS({type:"pimoroni_unicorn/icon_device_remove",entry_id:this.entryId,name:t}),this.status=`Removed "${t}" from this device.`,this.reloadIconsSoon()}catch(e){this.status=`Remove failed: ${e?.message??e}`}}iconTargetIds(){return this.iconTargets.length?this.iconTargets:this.devices.map(t=>t.entry_id)}toggleIconTarget(t){let e=new Set(this.iconTargetIds());e.has(t)?e.delete(t):e.add(t),this.iconTargets=this.devices.map(i=>i.entry_id).filter(i=>e.has(i))}async installIcon(){let t=parseInt(this.iconCode,10),e=this.iconName.trim();if(!t||!e)return;let i=this.iconTargetIds(),n=await this.hass.callWS({type:"pimoroni_unicorn/icon_install",code:t,name:e,entry_ids:i});if(!n.ok){this.status="Couldn't fetch that LaMetric code.";return}let r=n.sent??[];this.status=r.length?`Installed "${e}" \u2192 ${r.join(", ")}.`:`Saved "${e}" (no devices to push to).`,this.iconCode="",this.iconName="",this.reloadIconsSoon()}async removeIcon(t){confirm(`Delete "${t}" everywhere? This removes it from the library and every device, and can't be undone.`)&&(await this.hass.callWS({type:"pimoroni_unicorn/icon_remove",name:t}),this.status=`Removed icon "${t}".`,this.reloadIconsSoon())}onIconFile(t){let e=t.target.files?.[0];if(!e)return;let i=new FileReader;i.onload=()=>{let n=String(i.result??"");this.iconFilePreview=n,this.iconFileData=n.includes(",")?n.slice(n.indexOf(",")+1):"",this.iconUrl="",this.iconImgName.trim()||(this.iconImgName=e.name.replace(/\.[^.]+$/,"").replace(/[^a-zA-Z0-9_-]/g,"_").slice(0,32))},i.readAsDataURL(e)}async importIconImage(){let t=this.iconImgName.trim(),e=!!this.iconFileData,i=this.iconUrl.trim();if(!t||!e&&!i)return;let n=this.iconTargetIds(),r=this.iconSizeMode==="device"?{max_w:this.dims[0],max_h:this.dims[1]}:this.iconSizeMode==="custom"?{max_w:Math.max(1,this.iconCustomW|0),max_h:Math.max(1,this.iconCustomH|0)}:{};try{let s=e?await this.hass.callWS({type:"pimoroni_unicorn/icon_upload",name:t,data:this.iconFileData,...r,entry_ids:n}):await this.hass.callWS({type:"pimoroni_unicorn/icon_url",name:t,url:i,...r,entry_ids:n}),o=s.sent??[],d=s.w&&s.h?` ${s.w}\xD7${s.h}`:"",g=s.n_total&&s.n_kept&&s.n_kept<s.n_total?` (kept ${s.n_kept} of ${s.n_total} frames to fit the device)`:s.n_kept&&s.n_kept>1?` (${s.n_kept} frames)`:"";this.iconImportNote=`Imported "${t}"${d}${g}.`,this.status=o.length?`Imported "${t}"${d} \u2192 ${o.join(", ")}.`:`Saved "${t}"${d} (no devices to push to).`,this.iconImgName="",this.iconUrl="",this.iconFileData="",this.iconFilePreview="",this.reloadIconsSoon()}catch(s){this.status=`Import failed: ${s?.message??s}`}}async loadFonts(){try{let t={type:"pimoroni_unicorn/fonts"};this.entryId&&(t.entry_id=this.entryId);let e=await this.hass.callWS(t);this.fonts=e.fonts??[],this.refreshFontPreviews()}catch{}}onFontInput(t){this.fontText=t,clearTimeout(this.fontTimer),this.fontTimer=window.setTimeout(()=>this.refreshFontPreviews(),250)}async refreshFontPreviews(){let t={};await Promise.all(this.fonts.map(async e=>{let i=this.fontText.trim()||e.sample;try{let n=await this.hass.callWS({type:"pimoroni_unicorn/font_preview",font:e.name,text:i});t[e.name]=n.png}catch{}})),this.fontPngs=t}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKey),window.addEventListener("beforeunload",this._onBeforeUnload)}disconnectedCallback(){window.removeEventListener("keydown",this._onKey),window.removeEventListener("beforeunload",this._onBeforeUnload),this._ro?.disconnect(),this._ro=void 0,Object.values(this._frameTimers).forEach(t=>clearInterval(t)),this._frameTimers={},clearInterval(this.screenTimer),clearTimeout(this.renderTimer),clearTimeout(this.pushTimer),clearTimeout(this.fontTimer),clearTimeout(this.specTimer),super.disconnectedCallback()}_nudge(t,e){let[i,n]=this.dims;if(this.selected>=0&&this.layout.widgets[this.selected]){let r=this.layout.widgets[this.selected],[s,o]=this.boxDims(this.selected);r.x=Math.max(1-s,Math.min(i-1,r.x+t)),r.y=Math.max(1-o,Math.min(n-1,r.y+e)),this.edited()}}async loadDevices(){let t=await this.hass.callWS({type:"pimoroni_unicorn/devices"});this.devices=t.devices??[],this.devices.length?await this.selectDevice(this.devices[0].entry_id):await this.selectMock(this.model)}async loadCaps(t){let e=await this.hass.callWS({type:"pimoroni_unicorn/capabilities",...t});this.caps=e.widgets??[],this.overlayCaps=e.overlays??[],this.defaultLayout=e.default_layout,this.model=e.model,this.orientation=e.orientation??0,this.dims=e.dims??Wt[this.model]??[53,11],this.loadWidgetThumbs(),await this.refreshStored()}async loadWidgetThumbs(){try{let t=await this.hass.callWS({type:"pimoroni_unicorn/widget_thumbs",model:this.model});this.widgetThumbs=t.thumbs??{}}catch{}}async selectDevice(t){let e=this.devices.find(n=>n.entry_id===t);if(!e||!this.guardDiscard()){this.requestUpdate();return}this.entryId=t,await this.loadCaps({entry_id:t}),this.loadIcons(),this.loadFonts(),this.loadCatalog();let i=e.active_layout?this.stored[e.active_layout]:void 0;this.loadLayout(i??this.defaultLayout),this._applyPendingDraft()}async selectMock(t){if(!this.guardDiscard()){this.requestUpdate();return}this.entryId="",await this.loadCaps({model:t}),this.loadIcons(),this.loadCatalog(),this.loadLayout(this.defaultLayout),this._applyPendingDraft()}async refreshStored(){let t=await this.hass.callWS({type:"pimoroni_unicorn/layouts"});this.stored=t.layouts??{}}loadLayout(t){this.layout=JSON.parse(JSON.stringify(t)),this.layoutName=this.layout.name??"default",this.selected=-1,this.dirty=!1,this.undoStack=[],this.redoStack=[],this.snapshot=JSON.parse(JSON.stringify(this.layout)),this.renderPreview()}guardDiscard(){return!this.dirty||confirm("Discard unsaved changes to this page?")}playFrames(t,e,i){if(window.clearInterval(this._frameTimers[t]),i(e[0]??""),e.length>1){let n=0;this._frameTimers[t]=window.setInterval(()=>{n=(n+1)%e.length,i(e[n])},200)}}async renderPreview(){try{let t=await this.hass.callWS({type:"pimoroni_unicorn/render",model:this.model,layout:this.layout,orientation:this.orientation,weather:this.previewWeather||void 0,entry_id:this.entryId||void 0});this.wboxes=t.boxes??[],this.playFrames("layout",t.frames??(t.png?[t.png]:[]),e=>{this.png=e}),this.status.startsWith("Render failed")&&(this.status="")}catch(t){this.png="",this.status=`Render failed: ${t?.message??t}`}}edited(){this.undoStack=[...this.undoStack.slice(-99),this.snapshot],this.redoStack=[],this.snapshot=JSON.parse(JSON.stringify(this.layout)),this.dirty=!0,this._persistDraft(),this.requestUpdate(),this.scheduleRender()}scheduleRender(){this.renderTimer&&clearTimeout(this.renderTimer),this.renderTimer=window.setTimeout(()=>this.renderPreview(),80),this.live&&this.entryId&&(this.pushTimer&&clearTimeout(this.pushTimer),this.pushTimer=window.setTimeout(()=>this.pushLive(),250))}undo(){if(!this.undoStack.length)return;this.redoStack=[...this.redoStack,this.snapshot];let t=this.undoStack[this.undoStack.length-1];this.undoStack=this.undoStack.slice(0,-1),this.applyHistory(t)}redo(){if(!this.redoStack.length)return;this.undoStack=[...this.undoStack,this.snapshot];let t=this.redoStack[this.redoStack.length-1];this.redoStack=this.redoStack.slice(0,-1),this.applyHistory(t)}applyHistory(t){this.layout=JSON.parse(JSON.stringify(t)),this.snapshot=JSON.parse(JSON.stringify(t)),this.selected>=this.layout.widgets.length&&(this.selected=this.layout.widgets.length-1),this.layoutName=this.layout.name??this.layoutName,this.dirty=!0,this.requestUpdate(),this.scheduleRender()}async pushLive(){let t={...this.layout,name:this.layoutName};await this.hass.callWS({type:"pimoroni_unicorn/push_layout",entry_id:this.entryId,layout:t})}capFor(t){return this.caps.find(e=>e.id===t)}typeOf(t){return t.type??t.id}capForEntry(t){return this.capFor(this.typeOf(t))}get scale(){return this.zoom||Math.max(4,Math.floor(this.fitPx/this.dims[0]))}get pxScale(){let t=window.devicePixelRatio||1;return Math.max(1,Math.round(this.scale*t))/t}zoomBy(t){this.zoom=Math.min(48,Math.max(4,this.scale+t))}onWheel(t){!t.ctrlKey&&!t.metaKey||(t.preventDefault(),this.zoomBy(t.deltaY<0?2:-2))}startPan(t){if(t.target.closest(".box"))return;let e=t.currentTarget;t.preventDefault();let i=t.clientX,n=t.clientY,r=e.scrollLeft,s=e.scrollTop;e.setPointerCapture(t.pointerId),e.classList.add("panning");let o=g=>{e.scrollLeft=r-(g.clientX-i),e.scrollTop=s-(g.clientY-n)},d=g=>{e.releasePointerCapture(g.pointerId),e.classList.remove("panning"),e.removeEventListener("pointermove",o),e.removeEventListener("pointerup",d)};e.addEventListener("pointermove",o),e.addEventListener("pointerup",d)}boxDims(t){let e=this.wboxes[t];if(e)return e;let i=this.layout.widgets[t],n=i?this.capForEntry(i):void 0;return n?[n.w,n.h]:[0,0]}cfgVal(t,e){return t.cfg?.[e]??this.capForEntry(t)?.default_cfg[e]}colorCtl(t,e){return l`<span class="colorctl">
      <input type="color" .value=${ut(t)}
        @input=${i=>e(gt(i.target.value))} />
      <input type="text" class="hexin" .value=${ut(t)} maxlength="7" spellcheck="false" aria-label="Hex colour"
        @change=${i=>e(gt(i.target.value))} />
    </span>`}setCfg(t,e,i){t.cfg={...t.cfg??{},[e]:i},this.edited()}cfgPalette(t,e){let i=this.cfgVal(t,e);return i&&i.length?i.map(n=>[...n]):[this.cfgVal(t,"color")??[255,255,255]]}setCfgColor(t,e,i,n){let r=this.cfgPalette(t,e);r[i]=n,this.setCfg(t,e,r)}addCfgColor(t,e){let i=this.cfgPalette(t,e);i.push([255,255,255]),this.setCfg(t,e,i)}removeCfgColor(t,e,i){let n=this.cfgPalette(t,e);n.length>1&&(n.splice(i,1),this.setCfg(t,e,n))}setName(t,e){let i=e.trim();i?t.name=i:delete t.name,this.edited()}setPos(t,e,i){let[n,r]=this.boxDims(this.selected),[s,o]=this.dims,d=Math.round(i);e==="x"?t.x=Math.max(1-n,Math.min(s-1,d)):t.y=Math.max(1-r,Math.min(o-1,d)),this.edited()}onImgLoad(t){let e=t.target;this.dims=[e.naturalWidth,e.naturalHeight]}startDrag(t,e){e.preventDefault(),this.selected=t;let i=this.layout.widgets[t],[n,r]=this.boxDims(t),s=this.layout.grid??2,[o,d]=this.dims,g=e.clientX,m=e.clientY,v=i.x,y=i.y;e.target.setPointerCapture(e.pointerId);let x=w=>{let k=Math.round((w.clientX-g)/this.pxScale/s)*s,Bt=Math.round((w.clientY-m)/this.pxScale/s)*s;i.x=Math.max(1-n,Math.min(o-1,v+k)),i.y=Math.max(1-r,Math.min(d-1,y+Bt)),this.edited()},$=()=>{window.removeEventListener("pointermove",x),window.removeEventListener("pointerup",$),this.renderPreview()};window.addEventListener("pointermove",x),window.addEventListener("pointerup",$)}addWidget(t){if(!t)return;let e=this.capFor(t),i=new Set(this.layout.widgets.map(r=>r.id)),n;if(e?.multi||i.has(t)){let r=2,s=`${t}-${r}`;for(;i.has(s);)s=`${t}-${++r}`;n={id:s,type:t,name:`${e?.label??t} ${r}`,x:0,y:0,cfg:{}}}else n={id:t,type:t,x:0,y:0,cfg:{}};this.layout.widgets.push(n),this.selected=this.layout.widgets.length-1,this.edited()}removeWidget(t){this.layout.widgets[t]&&(this.layout.widgets.splice(t,1),this.selected=-1,this.edited())}duplicateWidget(t){let e=this.layout.widgets[t];if(!e)return;let i=new Set(this.layout.widgets.map(d=>d.id)),n=e.type??e.id,r=2,s=`${n}-${r}`;for(;i.has(s);)s=`${n}-${++r}`;let o=JSON.parse(JSON.stringify(e));o.id=s,o.x=(e.x??0)+1,o.y=(e.y??0)+1,this.layout.widgets.splice(t+1,0,o),this.selected=t+1,this.edited()}dropWidget(t){let e=this.dragIdx;if(this.dragIdx=-1,e<0||e===t)return;let i=this.layout.widgets,[n]=i.splice(e,1);i.splice(t,0,n),this.selected=i.indexOf(n),this.edited()}moveLayer(t,e){let i=t+e,n=this.layout.widgets;i<0||i>=n.length||([n[t],n[i]]=[n[i],n[t]],this.selected=i,this.edited())}toggleOverlay(t,e){let i=new Set(this.layout.overlays??[]);e?i.add(t):i.delete(t),this.layout.overlays=[...i],this.edited()}async save(){if(!this.layoutName.trim()){this.status="Name the page before saving.";return}this.layout.name=this.layoutName,await this.hass.callWS({type:"pimoroni_unicorn/save_layout",name:this.layoutName,layout:this.layout}),await this.refreshStored(),this.dirty=!1,this._clearDraft(),this.status=`Saved "${this.layoutName}" to the library.`}newPage(){this.guardDiscard()&&(this.loadLayout(this.defaultLayout),this.layoutName="",this.switchTab("layout"))}async editCurrentPage(){if(!this.entryId||!this.guardDiscard())return;let e=((await this.hass.callWS({type:"pimoroni_unicorn/devices"})).devices??[]).find(n=>n.entry_id===this.entryId);await this.refreshStored();let i=e?.active_layout?this.stored[e.active_layout]:void 0;if(!i){this.status="This device has no active page saved in the library yet.";return}this.layoutName=e.active_layout,this.loadLayout(i),this.switchTab("layout"),this.status=`Loaded the device's current page "${e.active_layout}".`}async deployCurrent(){if(this.entryId){if(!this.layoutName.trim()){this.status="Name the page before deploying.";return}this.layout.name=this.layoutName,this.status=`Deploying "${this.layoutName}"\u2026`;try{await this.hass.callWS({type:"pimoroni_unicorn/save_layout",name:this.layoutName,layout:this.layout}),await this.refreshStored();let t=await this.hass.callWS({type:"pimoroni_unicorn/deploy_layout",entry_id:this.entryId,name:this.layoutName,override:!0});this.status=t.ok?`Deployed "${this.layoutName}" (installed any missing widgets/fonts first).`:"Deploy failed.",this.dirty=!1,this._clearDraft()}catch(t){this.status=`Deploy failed: ${t?.message??t}`}}}async deleteLayout(){this.stored[this.layoutName]&&confirm(`Delete page "${this.layoutName}"? This can't be undone.`)&&(await this.hass.callWS({type:"pimoroni_unicorn/delete_layout",name:this.layoutName}),await this.refreshStored(),this.status=`Deleted "${this.layoutName}".`,this.loadLayout(this.defaultLayout))}async deletePage(t,e){confirm(`Delete page "${e}"? This can't be undone.`)&&(await this.hass.callWS({type:"pimoroni_unicorn/delete_layout",name:t}),await this.refreshStored(),await this.loadCatalog(),this.status=`Deleted page "${e}".`)}async deletePlaylist(t,e){confirm(`Delete playlist "${e}"? This can't be undone.`)&&(await this.hass.callWS({type:"pimoroni_unicorn/delete_screenset",name:t}),await this.loadCatalog(),this.status=`Deleted playlist "${e}".`)}renderWidgetEditor(){let t=this.layout.widgets[this.selected];if(!t)return l`<p class="hint">Select a widget to edit.</p>`;let e=this.capForEntry(t);return e?l`
      <h3>${t.name??e.label}</h3>
      ${t.ack?.length?l`<div class="panelrow">
        <span class="hint">⚠ ${t.ack.length} display warning${t.ack.length>1?"s":""} ignored for this element.</span>
        <button class="secondary" @click=${()=>this.clearAck(this.selected)}>Restore warnings</button></div>`:""}
      ${e.id==="weather"?l`<div class="panelrow"><label>Preview condition</label>
        <select @change=${i=>{this.previewWeather=i.target.value,this.renderPreview()}}>
          <option value="" ?selected=${this.previewWeather===""}>live</option>
          ${zt.map(([i,n])=>l`<option value=${i} ?selected=${this.previewWeather===i}>${n}</option>`)}
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
      ${e.cfg_fields.map(i=>{let n=this.cfgVal(t,"color_mode");if(i.key==="speed"&&n!=="rainbow"||i.type==="rgblist"&&n!=="per_char")return"";let r=this.cfgVal(t,"off_mode");if(i.key==="off_brightness"&&r==="colour"||i.key==="off_color"&&r!=="colour")return"";if(i.type==="rgblist"){let s=this.cfgPalette(t,i.key);return l`<div class="panelrow"><label>${i.label??i.key}</label>
            <span class="swatches">
              ${s.map((o,d)=>l`<span class="swatch">
                <input type="color" .value=${ut(o)}
                  @input=${g=>this.setCfgColor(t,i.key,d,gt(g.target.value))} />
                ${s.length>1?l`<button class="x" title="Remove"
                  @click=${()=>this.removeCfgColor(t,i.key,d)}>×</button>`:""}
              </span>`)}
              <button class="add" title="Add colour" @click=${()=>this.addCfgColor(t,i.key)}>+</button>
            </span></div>`}if(i.type==="select")return l`<div class="panelrow"><label>${i.label??i.key}</label>
            <select @change=${s=>this.setCfg(t,i.key,s.target.value)}>
              ${(i.options??[]).map(s=>l`<option ?selected=${this.cfgVal(t,i.key)===s}>${s}</option>`)}
            </select></div>`;if(i.type==="number")return l`<div class="panelrow"><label>${i.label??i.key}</label>
            <input type="number" style="width:60px" min=${i.min??1} max=${i.max??64} step=${i.step??1}
              .value=${String(this.cfgVal(t,i.key))}
              @input=${s=>{let o=s.target.value;o!==""&&!Number.isNaN(+o)&&this.setCfg(t,i.key,+o)}} /></div>`;if(i.type==="bool")return l`<div class="panelrow"><label>${i.label??i.key}</label>
            <input type="checkbox" .checked=${!!this.cfgVal(t,i.key)}
              @change=${s=>this.setCfg(t,i.key,s.target.checked)} /></div>`;if(i.type==="range"){let s=Number(this.cfgVal(t,i.key)??i.max??100);return l`<div class="panelrow"><label>${i.label??i.key}</label>
            <input type="range" min=${i.min??0} max=${i.max??100} step=${i.step??1} .value=${String(s)}
              @input=${o=>this.setCfg(t,i.key,+o.target.value)} />
            <span class="rangeval">${s}</span></div>`}return i.type==="icon"?l`<div class="panelrow"><label>${i.label??i.key}</label>
            <select @change=${s=>this.setCfg(t,i.key,s.target.value)}>
              ${this.iconNames.map(s=>l`<option ?selected=${this.cfgVal(t,i.key)===s}>${s}</option>`)}
            </select></div>`:i.type==="entity"?l`<div class="panelrow"><label>${i.label??i.key}</label>
            <input type="text" style="width:200px" list="pu-entity-list" placeholder="entity id…"
              .value=${String(this.cfgVal(t,i.key)??"")}
              @change=${s=>this.setCfg(t,i.key,s.target.value)} />
            <datalist id="pu-entity-list">
              ${Object.keys(this.hass?.states??{}).map(s=>l`<option value=${s}></option>`)}
            </datalist></div>`:i.type==="text"?l`<div class="panelrow"><label>${i.label??i.key}</label>
            <input type="text" style="width:120px" .value=${String(this.cfgVal(t,i.key)??"")}
              @change=${s=>this.setCfg(t,i.key,s.target.value)} /></div>`:l`<div class="panelrow"><label>${i.label??i.key}</label>
          ${this.colorCtl(this.cfgVal(t,i.key)??[255,255,255],s=>this.setCfg(t,i.key,s))}</div>`})}
      <div class="panelrow"><button class="danger" @click=${()=>this.removeWidget(this.selected)}>Remove widget</button></div>
    `:""}switchTab(t){this.tab=t,t==="market"?this.loadCatalog():t==="edit"?this.previewSpec():t==="screens"&&this.buildScreenPreview()}_devicePageHref(){let t=this.devices.find(e=>e.entry_id===this.entryId)?.registry_id;return t?`/config/devices/device/${t}`:""}_displayProblems(){if(!this.entryId)return[];let[t,e]=this.dims,i=[];return this.layout.widgets.forEach((n,r)=>{if(n.enabled===!1)return;let s=n.ack??[],o=n.type??n.id,d=(m,v)=>{s.includes(m)||i.push({idx:r,kind:m,text:v})};if(o==="icon"){let m=n.cfg?.icon,v=m?this.iconDims[m]:void 0;if(v&&(v[0]>t||v[1]>e)){d("oversize",`Icon \u201C${m}\u201D (${v[0]}\xD7${v[1]}) is bigger than the ${t}\xD7${e} screen`);return}let y=m?this.iconTrunc[m]:void 0;if(y){d("trimmed",`Icon \u201C${m}\u201D animation was trimmed to ${y[0]} of ${y[1]} frames to fit`);return}}let g=this.wboxes[r];g&&g[0]&&g[1]&&(n.x+g[0]>t||n.y+g[1]>e)&&d("offscreen",`\u201C${this.capFor(o)?.label??o}\u201D runs off the screen`)}),i}ackProblem(t,e){let i=this.layout.widgets[t];i&&(i.ack=[...new Set([...i.ack??[],e])],this.edited())}clearAck(t){let e=this.layout.widgets[t];e?.ack&&(delete e.ack,this.edited())}_appBar(){let t=this.devices.find(e=>e.entry_id===this.entryId);return l`
      <div class="appbar">
        <span class="brand">Pimoroni Unicorn</span>
        <label>Device
          <select @change=${e=>{let i=e.target.value;i===Ft?this.selectMock(this.model):this.selectDevice(i)}}>
            <option value=${Ft} ?selected=${!this.entryId}>Mock (preview only)</option>
            ${this.devices.map(e=>l`<option value=${e.entry_id} ?selected=${e.entry_id===this.entryId}>${e.name}</option>`)}
          </select>
        </label>
        ${this._devicePageHref()?l`<a class="devlink" href=${this._devicePageHref()} title="Open this device's Home Assistant page (settings, diagnostics, entities)">⚙ Device page</a>`:""}
        ${this.entryId?l`<span class="chip">${t?.model??this.model}</span>`:l`<label>Model
              <select @change=${e=>this.selectMock(e.target.value)}>
                ${Object.keys(Wt).map(e=>l`<option ?selected=${e===this.model}>${e}</option>`)}
              </select></label>`}
        <span class="chip dim">${this.dims[0]}&times;${this.dims[1]} px</span>
        <span class="grow"></span>
        ${this.dirty?l`<span class="chip warn">unsaved changes</span>`:""}
        ${this.fwManifest?.engine_version?l`<span class="hint">engine v${this.fwManifest.engine_version}</span>`:""}
        <a class="help" href="https://github.com/PineappleEmperor/ha-pimoroni-unicorn#readme" target="_blank" rel="noopener noreferrer" title="Open the documentation in a new tab">Help</a>
      </div>`}render(){let t=this._displayProblems();return l`
      ${this._appBar()}
      <div class="tabs">
        <button class="tab ${this.tab==="layout"?"on":""}" @click=${()=>this.switchTab("layout")}>Designer</button>
        <button class="tab ${this.tab==="market"?"on":""}" @click=${()=>this.switchTab("market")}>Marketplace</button>
        <button class="tab ${this.tab==="edit"?"on":""}" @click=${()=>this.switchTab("edit")}>Widget editor</button>
        <button class="tab ${this.tab==="paint"?"on":""}" @click=${()=>this.switchTab("paint")}>Icon editor</button>
        <button class="tab ${this.tab==="screens"?"on":""}" @click=${()=>this.switchTab("screens")}>Playlists</button>
      </div>
      ${this.status?l`<div class="status ${/fail/i.test(this.status)?"err":""}" role="status" aria-live="polite">${this.status}</div>`:""}
      ${t.length?l`<div class="warnbanner" role="alert">
        <strong>⚠ ${t.length} item${t.length>1?"s":""} on this page may not display on this device:</strong>
        <ul>${t.map(e=>l`<li>${e.text}
          <button class="ackbtn" title="Ignore this warning for this element (saved with the page)"
            @click=${()=>this.ackProblem(e.idx,e.kind)}>Ignore</button></li>`)}</ul>
      </div>`:""}
      ${this.devices.length?"":l`<div class="firstrun">No Pimoroni Unicorn device connected yet — you're previewing on a mock ${this.model}. Add one under <strong>Settings → Devices &amp; Services</strong>, then pick it above to install content and push live.</div>`}
      ${this.tab==="market"?this._marketplaceView():this.tab==="edit"?this._editorView():this.tab==="paint"?this._paintView():this.tab==="screens"?this._screensView():this._layoutView()}
    `}_layoutView(){let t=this.pxScale,e=new Set(this.layout.widgets.map(s=>this.typeOf(s))),i=this.caps.filter(s=>s.multi||!e.has(s.id)),n=new Set(this.layout.overlays??[]),r=`background-image:linear-gradient(to right,rgba(255,255,255,.10) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.10) 1px,transparent 1px);background-size:${t}px ${t}px`;return l`
      <div class="bar">
        <div class="group">
          <label>Page
            <select @change=${s=>{let o=s.target.value;o==="__new__"?this.newPage():this.guardDiscard()?this.loadLayout(this.stored[o]):this.requestUpdate()}}>
              ${Object.keys(this.stored).map(s=>l`<option ?selected=${s===this.layoutName}>${s}</option>`)}
              <option value="__new__">+ new page</option>
            </select>
          </label>
          <label>Name <input .value=${this.layoutName} @input=${s=>this.layoutName=s.target.value} /></label>
        </div>
        <div class="group">
          <button class="secondary" @click=${this.undo} ?disabled=${!this.undoStack.length} title="Undo (Ctrl+Z)">↶ Undo</button>
          <button class="secondary" @click=${this.redo} ?disabled=${!this.redoStack.length} title="Redo (Ctrl+Shift+Z)">↷ Redo</button>
        </div>
        <div class="group" role="group" aria-label="Library actions">
          <span class="grouplabel">Library</span>
          <button @click=${this.save} title="Save this page to the library (no device needed)">Save</button>
          <button class="secondary" @click=${this.exportLayout} title="Copy this page's JSON to clipboard to share or import elsewhere">Export JSON</button>
          ${this.stored[this.layoutName]?l`<button class="secondary" @click=${()=>this.publishLayout(!0)} title="List this page in the marketplace">Publish</button>`:""}
          ${this.stored[this.layoutName]?l`<button class="danger" @click=${this.deleteLayout}>Delete</button>`:""}
        </div>
        <div class="group" role="group" aria-label="Device actions">
          <span class="grouplabel">Device</span>
          <button class="secondary" @click=${this.editCurrentPage} ?disabled=${!this.entryId} title=${this.entryId?"Load the page currently active on the device to edit it":"Select a device first"}>Edit current</button>
          <button @click=${this.deployCurrent} ?disabled=${!this.entryId} title=${this.entryId?"Save, install any missing widgets/fonts, then push to the selected device":"Select a device to deploy"}>Deploy</button>
        </div>
        <span class="grow"></span>
        <div class="group">
          <label>Snap
            <select @change=${s=>{this.layout.grid=+s.target.value,this.edited()}}>
              ${[1,2,4].map(s=>l`<option ?selected=${(this.layout.grid??2)===s}>${s}</option>`)}
            </select> px</label>
          <label>Zoom
            <button class="zbtn" @click=${()=>this.zoomBy(-2)} title="Zoom out" aria-label="Zoom out">&minus;</button>
            <input type="range" min="4" max="48" .value=${String(this.scale)}
              @input=${s=>this.zoom=+s.target.value} />
            <button class="zbtn" @click=${()=>this.zoomBy(2)} title="Zoom in" aria-label="Zoom in">+</button>
          </label>
          <label>Weather
            <select @change=${s=>{this.previewWeather=s.target.value,this.renderPreview()}}>
              <option value="" ?selected=${this.previewWeather===""}>live</option>
              ${zt.map(([s,o])=>l`<option value=${s} ?selected=${this.previewWeather===s}>${o}</option>`)}
            </select></label>
          <label><input type="checkbox" .checked=${this.wireframe} @change=${s=>this.wireframe=s.target.checked} /> wireframe</label>
          <label><input type="checkbox" .checked=${this.locked} @change=${s=>this.locked=s.target.checked} /> lock</label>
          <label><input type="checkbox" .checked=${this.live} ?disabled=${!this.entryId} @change=${s=>this.live=s.target.checked} /> live push</label>
        </div>
      </div>

      <div class="wrap">
        <div class="col">
          <div class="stagewrap" @wheel=${this.onWheel} @pointerdown=${this.startPan}>
            <div class="stage" style=${`width:${this.dims[0]*t}px;height:${this.dims[1]*t}px`}>
              ${this.png?l`<img src="data:image/png;base64,${this.png}" alt="Live layout preview" width=${this.dims[0]*t} height=${this.dims[1]*t} @load=${this.onImgLoad} />`:""}
              <div class="grid" style=${r}></div>
              ${this.locked?"":l`<div class="boxes ${this.wireframe?"wf":""}">${this.layout.widgets.map((s,o)=>{if(!this.capForEntry(s)||s.enabled===!1)return"";let[d,g]=this.boxDims(o);return l`<div class="box ${o===this.selected?"sel":""}"
                  style=${`left:${s.x*t}px;top:${s.y*t}px;width:${d*t}px;height:${g*t}px`}
                  @pointerdown=${m=>this.startDrag(o,m)}>
                  <span class="tag">${s.name??this.capForEntry(s)?.label??s.id}</span></div>`})}</div>`}
            </div>
          </div>
        </div>

        <div class="col">
          <h3>Layers</h3>
          <ul class="wlist">
            ${[...this.layout.widgets.keys()].reverse().map(s=>{let o=this.layout.widgets[s];return l`
              <li class="${s===this.selected?"sel":""} ${s===this.dragIdx?"dragging":""} ${s===this.dragOverIdx&&s!==this.dragIdx?"dragover":""}"
                  tabindex="0" role="option" aria-selected=${s===this.selected}
                  @click=${()=>this.selected=s}
                  @keydown=${d=>{d.key==="Enter"||d.key===" "?(d.preventDefault(),d.stopPropagation(),this.selected=s):d.altKey&&d.key==="ArrowUp"?(d.preventDefault(),d.stopPropagation(),this.moveLayer(s,1)):d.altKey&&d.key==="ArrowDown"&&(d.preventDefault(),d.stopPropagation(),this.moveLayer(s,-1))}}
                  @dragover=${d=>{d.preventDefault(),d.dataTransfer&&(d.dataTransfer.dropEffect="move"),this.dragOverIdx=s}}
                  @dragleave=${()=>{this.dragOverIdx===s&&(this.dragOverIdx=-1)}}
                  @drop=${d=>{d.preventDefault(),this.dropWidget(s),this.dragOverIdx=-1}}>
                <span class="drag" title="Drag to reorder (or focus the row and use Alt+↑/↓)" aria-hidden="true" draggable="true"
                  @dragstart=${d=>{if(this.dragIdx=s,d.dataTransfer){d.dataTransfer.effectAllowed="move",d.dataTransfer.setData("text/plain",String(s));let g=d.target.closest("li");g&&d.dataTransfer.setDragImage(g,0,0)}}}
                  @dragend=${()=>{this.dragIdx=-1,this.dragOverIdx=-1}}>⣿</span>
                <input type="checkbox" .checked=${o.enabled!==!1} title="Show / hide"
                  aria-label="Show or hide ${o.name??this.capForEntry(o)?.label??o.id}"
                  @click=${d=>{d.stopPropagation(),o.enabled=d.target.checked,this.edited()}} />
                <span class="grow">${o.name??this.capForEntry(o)?.label??o.id}</span>
                <button class="wlx" title="Duplicate layer" aria-label="Duplicate layer"
                  @click=${d=>{d.stopPropagation(),this.duplicateWidget(s)}}>⧉</button>
                <button class="wlx" title="Delete layer" aria-label="Delete layer"
                  @click=${d=>{d.stopPropagation(),this.removeWidget(s)}}>×</button>
              </li>`})}
          </ul>
          ${this.layout.widgets.length>1?l`<p class="hint">Top of the list draws on top.</p>`:""}
          ${i.length?l`<div class="addgrid">
            ${i.map(s=>l`<button class="addtile" @click=${()=>this.addWidget(s.id)} title="Add ${s.label}">
              ${this.widgetThumbs[s.id]?l`<img class="addthumb" src="data:image/png;base64,${this.widgetThumbs[s.id]}" alt="" />`:l`<div class="addthumb empty"></div>`}
              <span class="addtile-label">${s.label}</span>
            </button>`)}
          </div>`:""}
          <h3>Overlays</h3>
          ${this.overlayCaps.map(s=>l`<div class="panelrow"><label>
            <input type="checkbox" .checked=${n.has(s.id)} @change=${o=>this.toggleOverlay(s.id,o.target.checked)} /> ${s.label}</label></div>`)}
          <h3>Selected</h3>
          ${this.renderWidgetEditor()}
        </div>
      </div>
    `}async loadCatalog(){if(await this.loadContent(),!this.entryId){this.catalog=[],this.fwManifest=null;return}let t=await this.hass.callWS({type:"pimoroni_unicorn/catalog",entry_id:this.entryId});this.catalog=t.widgets??[];let e=await this.hass.callWS({type:"pimoroni_unicorn/fw_manifest",entry_id:this.entryId});this.fwManifest=e.manifest??null,this._reconcileBusy()}_reconcileBusy(){if(!Object.keys(this.busyUnits).length)return;let t={...this.busyUnits},e=!1;for(let[i,n]of Object.entries(this.busyUnits)){let r=this.catalog.find(o=>o.id===i);(n==="Installing"?r?.status==="installed":!r||r.status==="not_installed")&&(delete t[i],e=!0)}e&&(this.busyUnits=t)}_setBusy(t,e){let i={...this.busyUnits};e?i[t]=e:delete i[t],this.busyUnits=i}async loadContent(){let t=this.entryId?{entry_id:this.entryId}:{},e=await this.hass.callWS({type:"pimoroni_unicorn/content_catalog",...t});this.activePage=e.active_page??null,this.contentLayouts=e.layouts??[],this.contentScreensets=e.screensets??[]}async deployLayout(t,e){if(!this.entryId){this.status="Select a device to deploy.";return}if(!(!e&&!confirm(`"${t}" isn't built for this device's model. Deploy anyway?`))){this.status=`Deploying "${t}"\u2026`;try{let i=await this.hass.callWS({type:"pimoroni_unicorn/deploy_layout",entry_id:this.entryId,name:t,override:!e});this.status=i.ok?`Deployed "${t}" (installing any missing widgets/fonts first).`:"Deploy failed."}catch(i){this.status=`Deploy failed: ${i?.message??i}`}}}async deployScreenset(t,e){if(!this.entryId){this.status="Select a device to deploy.";return}if(!(!e&&!confirm(`"${t}" isn't built for this device's model. Deploy anyway?`))){this.status=`Deploying "${t}"\u2026`;try{let i=await this.hass.callWS({type:"pimoroni_unicorn/deploy_screenset",entry_id:this.entryId,name:t,override:!e});this.status=i.ok?`Deployed screen set "${t}".`:"Deploy failed."}catch(i){this.status=`Deploy failed: ${i?.message??i}`}}}async exportLayout(){let t={...this.layout,name:this.layoutName,model:this.model},e=JSON.stringify(t,null,2);try{await navigator.clipboard.writeText(e),this.status=`Copied "${this.layoutName}" JSON (${this.model}) to clipboard.`}catch{let i=document.createElement("a");i.href=URL.createObjectURL(new Blob([e],{type:"application/json"})),i.download=`${this.layoutName||"layout"}.json`,i.click(),URL.revokeObjectURL(i.href),this.status=`Downloaded "${this.layoutName}.json".`}}async publishLayout(t){if(!this.stored[this.layoutName]){this.status="Save the layout first, then publish.";return}await this.hass.callWS({type:"pimoroni_unicorn/publish_layout",name:this.layoutName,published:t}),this.status=t?`Published "${this.layoutName}" to the marketplace.`:`Unpublished "${this.layoutName}".`,this.loadContent()}async saveScreenset(){if(!this.screenLayouts.length){this.status="Add at least one screen first.";return}let t=prompt("Name this screen set:");t&&(await this.hass.callWS({type:"pimoroni_unicorn/save_screenset",name:t,screenset:{label:t,layouts:this.screenLayouts,dwell:this.screenDwell,transition:this.screenTransition,triggers:[]}}),this.status=`Saved screen set "${t}".`,this.loadContent())}reloadCatalogSoon(){for(let t of[8e3,15e3,25e3])setTimeout(()=>this.loadCatalog(),t)}async installFont(t){if(this.entryId)try{await this.hass.callWS({type:"pimoroni_unicorn/font_install",entry_id:this.entryId,font:t}),this.status=`Installing font ${t}\u2026`;for(let e of[2e3,5e3])setTimeout(()=>this.loadFonts(),e)}catch(e){this.status=`Font install failed: ${e?.message??e}`}}async installWidget(t){if(confirm(`Install "${t}" on the device? It will reboot (~20s) and briefly go dark.`)){this._setBusy(t,"Installing");try{await this.hass.callWS({type:"pimoroni_unicorn/fw_install",entry_id:this.entryId,widget_id:t}),this.status=`Installing ${t}\u2026 the device will reboot and reconnect.`,this.reloadCatalogSoon(),this._busyTimeout(t)}catch(e){this._setBusy(t,null),this.status=`Install failed: ${e?.message??e}`}}}async removeWidgetUnit(t){if(confirm(`Remove "${t}" from the device? It will reboot (~20s) and briefly go dark.`)){this._setBusy(t,"Removing");try{await this.hass.callWS({type:"pimoroni_unicorn/fw_remove",entry_id:this.entryId,widget_id:t}),this.status=`Removing ${t}\u2026 the device will reboot and reconnect.`,this.reloadCatalogSoon(),this._busyTimeout(t)}catch(e){this._setBusy(t,null),this.status=`Remove failed: ${e?.message??e}`}}}_busyTimeout(t){window.setTimeout(()=>{this.busyUnits[t]&&(this._setBusy(t,null),this.status=`"${t}" didn't confirm \u2014 check the device is powered and back on Wi-Fi, then Refresh.`)},3e4)}_thumb(t){return t?l`<img class="thumb" alt="" src="data:image/png;base64,${t}" />`:l`<div class="thumb empty"></div>`}_mhead(){return l`<div class="mhead"><span>Preview</span><span>Name</span><span>Dependencies</span><span>Status</span><span></span></div>`}_section(t,e,i,n){let r=this.sectionsOpen[t]!==!1,s=()=>{this.sectionsOpen={...this.sectionsOpen,[t]:!r}};return l`<div class="section">
      <div class="shead" role="button" tabindex="0" aria-expanded=${r}
        @click=${s}
        @keydown=${o=>{(o.key==="Enter"||o.key===" ")&&(o.preventDefault(),s())}}>
        <svg class="chev ${r?"open":""}" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /></svg>
        <span class="stitle">${e}</span>
        <span class="chip dim">${i}</span>
      </div>
      ${r?n:""}
    </div>`}_contentRow(t,e){let i=e==="layout"&&!!this.activePage&&t.id===this.activePage;return l`<div class="mrow">
      ${this._thumb(t.thumb)}
      <div class="cell-name">${t.label}
        ${t.compat?.length?l`<span class="hint">[${t.compat.join("/")}]</span>`:""}
        ${e==="screenset"?l`<span class="hint">${t.screens} page(s)</span>`:""}</div>
      <div class="hint">${t.requires?.length?l`<span title=${t.requires.join(", ")}>${t.requires.length} dep(s)</span>`:"\u2014"}</div>
      <div class="badges">${i?l`<span class="badge ok">on device</span>`:""}${t.compatible?l`<span class="badge ok">compatible</span>`:l`<span class="badge warn">other model</span>`}</div>
      <div class="cell-action"><button ?disabled=${!this.entryId} title=${this.entryId?"":"Select a device to deploy"}
        @click=${()=>e==="layout"?this.deployLayout(t.id,t.compatible):this.deployScreenset(t.id,t.compatible)}>${i?"Re-deploy":"Deploy"}</button>
        <button class="danger" title=${e==="layout"?"Delete this page from the library":"Delete this playlist"}
          @click=${()=>e==="layout"?this.deletePage(t.id,t.label):this.deletePlaylist(t.id,t.label)}>Delete</button></div>
    </div>`}_marketplaceView(){let t=this.showAllContent,e=this.contentLayouts.filter(s=>t||s.compatible),i=this.contentScreensets.filter(s=>t||s.compatible),n={installed:"ok",outdated:"warn",not_installed:""},r={installed:"installed",outdated:"update available",not_installed:"not installed"};return l`
      <div class="bar">
        <label><input type="checkbox" .checked=${this.showAllContent}
          @change=${s=>{this.showAllContent=s.target.checked}} /> show all models</label>
        <span class="grow"></span>
        <button class="secondary" @click=${this.loadCatalog}>Refresh</button>
      </div>

      ${this._section("pages","Pages",e.length,l`
        <div class="panelrow"><button @click=${this.newPage} title="Start a new page in the Designer">+ New page</button></div>
        ${e.length?l`<div class="mtable">${this._mhead()}${e.map(s=>this._contentRow(s,"layout"))}</div>`:l`<p class="hint">No published pages${t?"":" for this device"} yet. Create one above, then Publish it from the Designer.</p>`}`)}

      ${this._section("playlists","Playlists",i.length,i.length?l`<div class="mtable">${this._mhead()}${i.map(s=>this._contentRow(s,"screenset"))}</div>`:l`<p class="hint">No playlists${t?"":" for this device"}. Compose one on the Playlists tab.</p>`)}

      ${this._section("widgets","Widgets & fonts",this.catalog.length,this.entryId?l`<div class="mtable">${this._mhead()}
            ${this.catalog.map(s=>l`<div class="mrow">
              ${this._thumb(s.thumb)}
              <div class="cell-name">${s.label}</div>
              <div class="hint">${s.requires?.length?l`<span title=${s.requires.join(", ")}>${s.requires.length} dep(s)</span>`:"\u2014"}</div>
              <div><span class="badge ${n[s.status]??""}">${r[s.status]??s.status}</span></div>
              <div class="cell-action">${this.busyUnits[s.id]?l`<span class="badge working">${this.busyUnits[s.id]}…</span>`:s.status==="installed"?l`<button class="danger" @click=${()=>this.removeWidgetUnit(s.id)}>Remove</button>`:l`<button @click=${()=>this.installWidget(s.id)}>${s.status==="outdated"?"Update":"Install"}</button>`}</div>
            </div>`)}
          </div>`:l`<p class="hint">Select a device to manage installed widgets.</p>`)}

      ${this._section("icons","Icons",this.installedIcons.length,l`
        <p class="hint">Built-in icons ship with the engine. Add LaMetric gallery icons by code, then choose which devices to install them on.</p>
        <div class="panelrow">
          ${this.iconCode?l`<img class="iconprev" alt=""
            src="https://developer.lametric.com/content/apps/icon_thumbs/${this.iconCode}"
            @load=${s=>s.target.style.visibility="visible"}
            @error=${s=>s.target.style.visibility="hidden"} />`:l`<div class="iconprev empty"></div>`}
          <div class="grow">
            <div class="panelrow">
              <label>LaMetric code</label>
              <input type="number" style="width:100px" .value=${this.iconCode}
                @input=${s=>{this.iconCode=s.target.value}} />
              <label>Name</label>
              <input style="width:120px" .value=${this.iconName}
                @input=${s=>{this.iconName=s.target.value}} />
            </div>
            ${this.devices.length?l`<div class="panelrow">
              <label>Install on</label>
              <span class="targets">
                ${this.devices.map(s=>l`<label class="chk">
                  <input type="checkbox" ?checked=${this.iconTargetIds().includes(s.entry_id)}
                    @change=${()=>this.toggleIconTarget(s.entry_id)} />${s.name}</label>`)}
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
          ${this.iconFilePreview?l`<img class="iconprev" alt="" src=${this.iconFilePreview} />`:l`<div class="iconprev empty"></div>`}
          <div class="grow">
            <div class="panelrow">
              <label>Image file</label>
              <input type="file" accept="image/png,image/gif,image/apng,image/webp"
                @change=${this.onIconFile} />
            </div>
            <div class="panelrow">
              <label>or URL</label>
              <input style="width:220px" placeholder="https://…/animation.gif" .value=${this.iconUrl}
                @input=${s=>{this.iconUrl=s.target.value,this.iconFileData="",this.iconFilePreview=""}} />
            </div>
            <div class="panelrow">
              <label>Size</label>
              <select @change=${s=>{this.iconSizeMode=s.target.value}}>
                <option value="device" ?selected=${this.iconSizeMode==="device"}>Device screen (${this.dims[0]}×${this.dims[1]})</option>
                <option value="native" ?selected=${this.iconSizeMode==="native"}>Native (keep source)</option>
                <option value="custom" ?selected=${this.iconSizeMode==="custom"}>Custom</option>
              </select>
              ${this.iconSizeMode==="custom"?l`
                <input type="number" min="1" max="53" style="width:56px" .value=${String(this.iconCustomW)}
                  @input=${s=>{this.iconCustomW=parseInt(s.target.value,10)||1}} />
                <span>×</span>
                <input type="number" min="1" max="32" style="width:56px" .value=${String(this.iconCustomH)}
                  @input=${s=>{this.iconCustomH=parseInt(s.target.value,10)||1}} />`:""}
            </div>
            <div class="panelrow">
              <label>Name</label>
              <input style="width:120px" .value=${this.iconImgName}
                @input=${s=>{this.iconImgName=s.target.value}} />
              <button ?disabled=${!this.iconImgName.trim()||!this.iconFileData&&!this.iconUrl.trim()||this.devices.length>0&&this.iconTargetIds().length===0}
                @click=${this.importIconImage}>Import</button>
            </div>
            ${this.iconImportNote?l`<p class="hint">${this.iconImportNote}</p>`:""}
          </div>
        </div>
        ${this.entryId?l`<p class="hint">“Install on device” / “Remove from device” affect only the selected device. “Delete everywhere” removes the icon from the library and every device.</p>`:l`<p class="hint">Select a device above to install or remove these on a specific device. “Delete everywhere” removes an icon from the library and every device.</p>`}
        ${this.installedIcons.length?this.installedIcons.map(s=>{let o=this.deviceIcons.includes(s);return l`<div class="iconrow">
              ${this.iconThumbs[s]?l`<img class="iconthumb" alt="" src="data:image/gif;base64,${this.iconThumbs[s]}" />`:l`<div class="iconthumb empty"></div>`}
              <span class="grow">${s}${this.iconDims[s]?l` <span class="hint">${this.iconDims[s][0]}×${this.iconDims[s][1]}</span>`:""}
                ${this.iconTrunc[s]?l`<span class="badge warn" title="Its source had more frames than fit the device budget">trimmed ${this.iconTrunc[s][0]}/${this.iconTrunc[s][1]} frames</span>`:""}
                ${this.entryId&&this.iconOversize(s)?l`<span class="badge warn" title="Larger than this device (${this.dims[0]}×${this.dims[1]}) — won't fit and may hang it">too big for this device</span>`:""}</span>
              ${this.entryId?o?l`<span class="badge ok">on this device</span>
                      <button class="secondary" title="Take this icon off the selected device (stays in the library)"
                        @click=${()=>this.removeIconFromDevice(s)}>Remove from device</button>`:this.iconOversize(s)?l`<button class="danger" title="This icon is larger than the device screen. Pushing it is for testing only and may hang the device."
                        @click=${()=>this.pushIconToDevice(s)}>Test on device ⚠</button>`:l`<button class="secondary" title="Push this icon to the selected device"
                        @click=${()=>this.pushIconToDevice(s)}>Install on device</button>`:""}
              <button class="danger" title="Delete from the library and every device"
                @click=${()=>this.removeIcon(s)}>Delete everywhere</button></div>`}):l`<p class="hint">No custom icons installed yet.</p>`}
      `)}

      ${this._section("fonts","Fonts",this.fonts.length,l`
        <p class="hint">Type below to preview live in every font. Digit fonts (clock faces) show only numerals; alpha fonts cover A–Z. Fonts install automatically with any widget that needs them, or install one directly onto the selected device here (no reboot).</p>
        <div class="panelrow">
          <label>Preview text</label>
          <input style="width:220px" placeholder="type to preview…" .value=${this.fontText}
            @input=${s=>this.onFontInput(s.target.value)} />
        </div>
        ${[...this.fonts].sort((s,o)=>s.h-o.h||s.w-o.w||s.label.localeCompare(o.label)).map(s=>l`<div class="frow">
          <div class="fmeta"><span class="cell-name">${s.label}</span>
            <span class="hint">${s.kind==="digits"?"digits":"A\u2013Z 0\u20139"} · ${s.w}×${s.h}</span></div>
          ${this.fontPngs[s.name]?l`<img class="fprev" alt="" src="data:image/png;base64,${this.fontPngs[s.name]}" />`:l`<div class="fprev empty"></div>`}
          ${s.builtin?l`<span class="badge ok">built-in</span>`:this.entryId?s.installed?l`<span class="badge ok">installed</span>`:l`<button @click=${()=>this.installFont(s.name)}>Install</button>`:""}
        </div>`)}
      `)}
      <p class="hint">Deploying a page installs any widgets/fonts it needs over the air first, then pushes it; the device reboots if files changed.</p>
    `}onSpecInput(t){this.specText=t,clearTimeout(this.specTimer),this.specTimer=window.setTimeout(()=>this.previewSpec(),400)}async previewSpec(){let t;try{t=JSON.parse(this.specText)}catch(e){this.specError=`JSON: ${e.message}`;return}try{let e=await this.hass.callWS({type:"pimoroni_unicorn/widget_preview",model:this.model,spec:t});this.playFrames("spec",e.frames??(e.png?[e.png]:[]),i=>{this.specPng=i}),this.specError=""}catch(e){this.specError=e?.message??String(e)}}async importSpec(t){try{let e=await this.hass.callWS({type:"pimoroni_unicorn/widget_import",text:t});this.specText=JSON.stringify(e.spec,null,2),this.specError="",this.previewSpec()}catch(e){this.specError=e?.message??String(e)}}async saveSpec(){let t;try{t=JSON.parse(this.specText)}catch(e){this.specError=`JSON: ${e.message}`;return}try{let e=await this.hass.callWS({type:"pimoroni_unicorn/widget_save",spec:t});this.specError="",this.status=`Saved custom widget "${e.id}". Install it from the Marketplace tab.`}catch(e){this.specError=e?.message??String(e)}}parsedSpec(){try{return JSON.parse(this.specText)}catch{return null}}writeSpec(t){this.specText=JSON.stringify(t,null,2),this.specError="",clearTimeout(this.specTimer),this.specTimer=window.setTimeout(()=>this.previewSpec(),120)}setSpecField(t,e){let i=this.parsedSpec();i&&(i[t]=e,this.writeSpec(i))}setOpField(t,e,i){let n=this.parsedSpec();if(!n||!Array.isArray(n.draw))return;let r=n.draw[t]??{};n.draw[t]=e==="op"?{op:i,x:r.x??0,y:r.y??0}:{...r,[e]:i},this.writeSpec(n)}addOp(t){let e=this.parsedSpec()??{};e.draw=[...e.draw??[],{op:t,x:0,y:0}],this.writeSpec(e)}removeOp(t){let e=this.parsedSpec();!e||!Array.isArray(e.draw)||(e.draw.splice(t,1),this.writeSpec(e))}_opField(t,e,i,n){let r=jt[i]?.hint,s=l`<span class="flabel">${he(i)}</span>`,o;return n==="rgb"?o=this.colorCtl(t[i]??[255,255,255],d=>this.setOpField(e,i,d)):n==="num"?o=l`<input type="number" style="width:64px" .value=${String(t[i]??0)} @change=${d=>this.setOpField(e,i,+d.target.value)} />`:n==="icon"?o=l`<select @change=${d=>this.setOpField(e,i,d.target.value)}>
        ${this.iconNames.map(d=>l`<option ?selected=${t[i]===d}>${d}</option>`)}</select>`:i==="bind"?o=l`<input type="text" style="width:140px" list="pu-bind-list" placeholder="solar…"
        .value=${String(t[i]??"")} @change=${d=>this.setOpField(e,i,d.target.value)} />`:i==="fmt"?o=l`<input type="text" style="width:96px" placeholder="{:.1f}"
        .value=${String(t[i]??"")} @change=${d=>this.setOpField(e,i,d.target.value)} />
        ${["{}","{:.0f}","{:.1f}","{}%","{:.1f}\xB0"].map(d=>l`<button class="fmtchip" title="Use ${d}" @click=${()=>this.setOpField(e,"fmt",d)}>${d}</button>`)}`:o=l`<input type="text" style="width:120px" .value=${String(t[i]??"")} @change=${d=>this.setOpField(e,i,d.target.value)} />`,l`${s}<span class="fcell">${o}${r?l`<span class="fhint">${r}</span>`:""}</span>`}_opEditor(t,e){let i=Y[t.op]??{label:t.op,desc:""};return l`<div class="opcard">
      <div class="ophead">
        <span class="optitle">${i.label}</span>
        <select title="Change op type" @change=${n=>this.setOpField(e,"op",n.target.value)}>
          ${Pt.map(n=>l`<option value=${n} ?selected=${n===t.op}>${Y[n]?.label??n}</option>`)}</select>
        <span class="grow"></span>
        <button class="danger zbtn" title="Remove op" @click=${()=>this.removeOp(e)}>✕</button>
      </div>
      ${i.desc?l`<p class="opdesc">${i.desc}</p>`:""}
      <div class="fieldgrid">
        <span class="flabel">Position</span>
        <span class="fcell">
          <label class="fhint">X</label><input type="number" style="width:64px" .value=${String(t.x??0)} @change=${n=>this.setOpField(e,"x",+n.target.value)} />
          <label class="fhint">Y</label><input type="number" style="width:64px" .value=${String(t.y??0)} @change=${n=>this.setOpField(e,"y",+n.target.value)} />
        </span>
        ${(de[t.op]??[]).map(([n,r])=>this._opField(t,e,n,r))}
      </div>
    </div>`}_formView(){let t=this.parsedSpec();return t?l`
      <datalist id="pu-bind-list">
        ${Ut.map(e=>l`<option value=${e}></option>`)}
        ${Object.keys(this.hass?.states??{}).map(e=>l`<option value=${e}></option>`)}
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
      <p class="hint">Each op draws one element, in order. Available data: ${Ut.join(", ")} (unknown binds preview as 123).</p>
      ${(t.draw??[]).map((e,i)=>this._opEditor(e,i))}
      <p class="hint">Add an op:</p>
      <div class="addchips">
        ${Pt.map(e=>l`<button class="addchip" title=${Y[e]?.desc??""} @click=${()=>this.addOp(e)}>+ ${Y[e]?.label??e}</button>`)}
      </div>
    `:l`<p class="status err">Spec isn't valid JSON — switch to YAML / JSON to fix it.</p>`}_paintView(){return l`<div class="pane">
      <p class="hint">Paint an icon at this device's resolution, or load an image and edit it. Black = off (checkerboard). Saves to your icon library.</p>
      <pixel-editor .w=${this.dims[0]} .h=${this.dims[1]}
        .decode=${this._iconDecode}
        @save=${t=>this._saveEditorIcon(t.detail)}></pixel-editor>
    </div>`}async _saveEditorIcon(t){let e=t.dataUrl.slice(t.dataUrl.indexOf(",")+1),i=this.iconTargetIds();try{let r=(await this.hass.callWS({type:"pimoroni_unicorn/icon_upload",name:t.name,data:e,max_w:t.w,max_h:t.h,entry_ids:i})).sent??[];this.status=r.length?`Saved "${t.name}" \u2192 ${r.join(", ")}.`:`Saved "${t.name}" (no devices to push to).`,this.reloadIconsSoon()}catch(n){this.status=`Save failed: ${n?.message??n}`}}_editorView(){let t=Math.max(6,Math.floor(ht/this.dims[0]));return l`
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
            ${this.specPng?l`<img src="data:image/png;base64,${this.specPng}" alt="Widget preview" width=${this.dims[0]*t} height=${this.dims[1]*t} />`:""}
          </div>
        </div>
      </div>
    `}toggleScreen(t,e){this.screenLayouts=e?[...this.screenLayouts,t]:this.screenLayouts.filter(i=>i!==t),this.buildScreenPreview()}moveScreen(t,e){let i=[...this.screenLayouts],n=i.indexOf(t),r=n+e;n<0||r<0||r>=i.length||([i[n],i[r]]=[i[r],i[n]],this.screenLayouts=i,this.buildScreenPreview())}async buildScreenPreview(){clearInterval(this.screenTimer);let t={};await Promise.all(this.screenLayouts.map(async e=>{let i=this.stored[e];if(i)try{let n=await this.hass.callWS({type:"pimoroni_unicorn/render",model:this.model,layout:i});t[e]=n.png}catch{}})),this.screenPngs=t,this.screenIdx=0,this.screenOpacity=1,this.screenLayouts.length>1&&this.screenDwell>0&&(this.screenTimer=window.setInterval(()=>this._advancePreview(),this.screenDwell*1e3))}_advancePreview(){let t=(this.screenIdx+1)%this.screenLayouts.length;this.screenTransition==="fade"?(this.screenOpacity=0,setTimeout(()=>{this.screenIdx=t,this.screenOpacity=1},280)):this.screenIdx=t}async pushScreens(){!this.entryId||!this.screenLayouts.length||(await this.hass.callWS({type:"pimoroni_unicorn/push_screens",entry_id:this.entryId,layouts:this.screenLayouts,dwell:this.screenDwell,transition:this.screenTransition}),this.status=`Pushed ${this.screenLayouts.length} page(s) to device.`)}_screensView(){let t=Math.max(6,Math.floor(ht/this.dims[0])),e=Object.keys(this.stored),i=this.screenLayouts[this.screenIdx],n=i?this.screenPngs[i]:"";return l`
      <div class="bar"><span class="hint">compose a playlist — pages cycle on a timer; preview on ${this.model}</span></div>
      <div class="wrap">
        <div class="col">
          <h3>Pages in this playlist</h3>
          <p class="hint">Tick pages to include, then order them with ▲ ▼.</p>
          ${e.length?e.map(r=>{let s=this.screenLayouts.includes(r),o=this.screenLayouts.indexOf(r);return l`<div class="panelrow" tabindex=${s?"0":"-1"}
              @keydown=${s?d=>{d.altKey&&d.key==="ArrowUp"?(d.preventDefault(),this.moveScreen(r,-1)):d.altKey&&d.key==="ArrowDown"&&(d.preventDefault(),this.moveScreen(r,1))}:void 0}>
              <input type="checkbox" ?checked=${s}
                @change=${d=>this.toggleScreen(r,d.target.checked)} />
              ${s?l`<span class="chip" title="Position ${o+1}">${o+1}</span>`:""}
              <span class="grow">${r}</span>
              ${s?l`
                <button class="zbtn secondary" ?disabled=${o===0} @click=${()=>this.moveScreen(r,-1)} title="Move up" aria-label="Move ${r} up">▲</button>
                <button class="zbtn secondary" ?disabled=${o===this.screenLayouts.length-1} @click=${()=>this.moveScreen(r,1)} title="Move down" aria-label="Move ${r} down">▼</button>`:""}
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
            ${n?l`<img src="data:image/png;base64,${n}" alt="Playlist preview" width=${this.dims[0]*t} height=${this.dims[1]*t}
              style=${`opacity:${this.screenOpacity};transition:opacity 280ms`} />`:""}
          </div>
          <div class="hint">${this.screenLayouts.length>1?`playing ${this.screenIdx+1}/${this.screenLayouts.length}: ${i??""}`:i??"tick pages to preview"}</div>
        </div>
      </div>
    `}};h([I({attribute:!1})],u.prototype,"hass",2),h([p()],u.prototype,"devices",2),h([p()],u.prototype,"entryId",2),h([p()],u.prototype,"model",2),h([p()],u.prototype,"layout",2),h([p()],u.prototype,"caps",2),h([p()],u.prototype,"widgetThumbs",2),h([p()],u.prototype,"overlayCaps",2),h([p()],u.prototype,"defaultLayout",2),h([p()],u.prototype,"stored",2),h([p()],u.prototype,"png",2),h([p()],u.prototype,"wboxes",2),h([p()],u.prototype,"dims",2),h([p()],u.prototype,"orientation",2),h([p()],u.prototype,"previewWeather",2),h([p()],u.prototype,"zoom",2),h([p()],u.prototype,"selected",2),h([p()],u.prototype,"dragIdx",2),h([p()],u.prototype,"dragOverIdx",2),h([p()],u.prototype,"layoutName",2),h([p()],u.prototype,"live",2),h([p()],u.prototype,"wireframe",2),h([p()],u.prototype,"locked",2),h([p()],u.prototype,"status",2),h([p()],u.prototype,"tab",2),h([p()],u.prototype,"catalog",2),h([p()],u.prototype,"busyUnits",2),h([p()],u.prototype,"fwManifest",2),h([p()],u.prototype,"activePage",2),h([p()],u.prototype,"contentLayouts",2),h([p()],u.prototype,"contentScreensets",2),h([p()],u.prototype,"showAllContent",2),h([p()],u.prototype,"iconNames",2),h([p()],u.prototype,"installedIcons",2),h([p()],u.prototype,"iconThumbs",2),h([p()],u.prototype,"deviceIcons",2),h([p()],u.prototype,"iconCode",2),h([p()],u.prototype,"iconName",2),h([p()],u.prototype,"iconTargets",2),h([p()],u.prototype,"iconUrl",2),h([p()],u.prototype,"iconImgName",2),h([p()],u.prototype,"iconFileData",2),h([p()],u.prototype,"iconFilePreview",2),h([p()],u.prototype,"iconImportNote",2),h([p()],u.prototype,"iconDims",2),h([p()],u.prototype,"iconTrunc",2),h([p()],u.prototype,"iconSizeMode",2),h([p()],u.prototype,"iconCustomW",2),h([p()],u.prototype,"iconCustomH",2),h([p()],u.prototype,"fonts",2),h([p()],u.prototype,"fontText",2),h([p()],u.prototype,"fontPngs",2),h([p()],u.prototype,"dirty",2),h([p()],u.prototype,"undoStack",2),h([p()],u.prototype,"redoStack",2),h([p()],u.prototype,"sectionsOpen",2),h([p()],u.prototype,"screenLayouts",2),h([p()],u.prototype,"screenDwell",2),h([p()],u.prototype,"screenTransition",2),h([p()],u.prototype,"screenPngs",2),h([p()],u.prototype,"screenIdx",2),h([p()],u.prototype,"screenOpacity",2),h([p()],u.prototype,"specText",2),h([p()],u.prototype,"editMode",2),h([p()],u.prototype,"specPng",2),h([p()],u.prototype,"specError",2),h([p()],u.prototype,"fitPx",2);customElements.get("pimoroni-unicorn-panel")||customElements.define("pimoroni-unicorn-panel",u);export{u as PimoroniUnicornPanel};
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
