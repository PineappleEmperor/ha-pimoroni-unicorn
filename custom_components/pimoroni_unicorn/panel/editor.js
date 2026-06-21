var Ot=Object.defineProperty;var Nt=Object.getOwnPropertyDescriptor;var h=(l,i,t,e)=>{for(var s=e>1?void 0:e?Nt(i,t):i,r=l.length-1,n;r>=0;r--)(n=l[r])&&(s=(e?n(i,t,s):n(s))||s);return e&&s&&Ot(i,t,s),s};var W=globalThis,H=W.ShadowRoot&&(W.ShadyCSS===void 0||W.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,B=Symbol(),ct=new WeakMap,A=class{constructor(i,t,e){if(this._$cssResult$=!0,e!==B)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=t}get styleSheet(){let i=this.o,t=this.t;if(H&&i===void 0){let e=t!==void 0&&t.length===1;e&&(i=ct.get(t)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),e&&ct.set(t,i))}return i}toString(){return this.cssText}},dt=l=>new A(typeof l=="string"?l:l+"",void 0,B),J=(l,...i)=>{let t=l.length===1?l[0]:i.reduce((e,s,r)=>e+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+l[r+1],l[0]);return new A(t,l,B)},pt=(l,i)=>{if(H)l.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of i){let e=document.createElement("style"),s=W.litNonce;s!==void 0&&e.setAttribute("nonce",s),e.textContent=t.cssText,l.appendChild(e)}},K=H?l=>l:l=>l instanceof CSSStyleSheet?(i=>{let t="";for(let e of i.cssRules)t+=e.cssText;return dt(t)})(l):l;var{is:Rt,defineProperty:Dt,getOwnPropertyDescriptor:Wt,getOwnPropertyNames:Ht,getOwnPropertySymbols:zt,getPrototypeOf:Ft}=Object,z=globalThis,ht=z.trustedTypes,Pt=ht?ht.emptyScript:"",jt=z.reactiveElementPolyfillSupport,L=(l,i)=>l,C={toAttribute(l,i){switch(i){case Boolean:l=l?Pt:null;break;case Object:case Array:l=l==null?l:JSON.stringify(l)}return l},fromAttribute(l,i){let t=l;switch(i){case Boolean:t=l!==null;break;case Number:t=l===null?null:Number(l);break;case Object:case Array:try{t=JSON.parse(l)}catch{t=null}}return t}},F=(l,i)=>!Rt(l,i),ut={attribute:!0,type:String,converter:C,reflect:!1,useDefault:!1,hasChanged:F};Symbol.metadata??=Symbol("metadata"),z.litPropertyMetadata??=new WeakMap;var f=class extends HTMLElement{static addInitializer(i){this._$Ei(),(this.l??=[]).push(i)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(i,t=ut){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(i)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(i,t),!t.noAccessor){let e=Symbol(),s=this.getPropertyDescriptor(i,e,t);s!==void 0&&Dt(this.prototype,i,s)}}static getPropertyDescriptor(i,t,e){let{get:s,set:r}=Wt(this.prototype,i)??{get(){return this[t]},set(n){this[t]=n}};return{get:s,set(n){let a=s?.call(this);r?.call(this,n),this.requestUpdate(i,a,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(i){return this.elementProperties.get(i)??ut}static _$Ei(){if(this.hasOwnProperty(L("elementProperties")))return;let i=Ft(this);i.finalize(),i.l!==void 0&&(this.l=[...i.l]),this.elementProperties=new Map(i.elementProperties)}static finalize(){if(this.hasOwnProperty(L("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(L("properties"))){let t=this.properties,e=[...Ht(t),...zt(t)];for(let s of e)this.createProperty(s,t[s])}let i=this[Symbol.metadata];if(i!==null){let t=litPropertyMetadata.get(i);if(t!==void 0)for(let[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(let[t,e]of this.elementProperties){let s=this._$Eu(t,e);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(i){let t=[];if(Array.isArray(i)){let e=new Set(i.flat(1/0).reverse());for(let s of e)t.unshift(K(s))}else i!==void 0&&t.push(K(i));return t}static _$Eu(i,t){let e=t.attribute;return e===!1?void 0:typeof e=="string"?e:typeof i=="string"?i.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(i=>i(this))}addController(i){(this._$EO??=new Set).add(i),this.renderRoot!==void 0&&this.isConnected&&i.hostConnected?.()}removeController(i){this._$EO?.delete(i)}_$E_(){let i=new Map,t=this.constructor.elementProperties;for(let e of t.keys())this.hasOwnProperty(e)&&(i.set(e,this[e]),delete this[e]);i.size>0&&(this._$Ep=i)}createRenderRoot(){let i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return pt(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(i=>i.hostConnected?.())}enableUpdating(i){}disconnectedCallback(){this._$EO?.forEach(i=>i.hostDisconnected?.())}attributeChangedCallback(i,t,e){this._$AK(i,e)}_$ET(i,t){let e=this.constructor.elementProperties.get(i),s=this.constructor._$Eu(i,e);if(s!==void 0&&e.reflect===!0){let r=(e.converter?.toAttribute!==void 0?e.converter:C).toAttribute(t,e.type);this._$Em=i,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(i,t){let e=this.constructor,s=e._$Eh.get(i);if(s!==void 0&&this._$Em!==s){let r=e.getPropertyOptions(s),n=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:C;this._$Em=s;let a=n.fromAttribute(t,r.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(i,t,e,s=!1,r){if(i!==void 0){let n=this.constructor;if(s===!1&&(r=this[i]),e??=n.getPropertyOptions(i),!((e.hasChanged??F)(r,t)||e.useDefault&&e.reflect&&r===this._$Ej?.get(i)&&!this.hasAttribute(n._$Eu(i,e))))return;this.C(i,t,e)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(i,t,{useDefault:e,reflect:s,wrapped:r},n){e&&!(this._$Ej??=new Map).has(i)&&(this._$Ej.set(i,n??t??this[i]),r!==!0||n!==void 0)||(this._$AL.has(i)||(this.hasUpdated||e||(t=void 0),this._$AL.set(i,t)),s===!0&&this._$Em!==i&&(this._$Eq??=new Set).add(i))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let i=this.scheduleUpdate();return i!=null&&await i,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[s,r]of e){let{wrapped:n}=r,a=this[s];n!==!0||this._$AL.has(s)||a===void 0||this.C(s,void 0,r,a)}}let i=!1,t=this._$AL;try{i=this.shouldUpdate(t),i?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(e){throw i=!1,this._$EM(),e}i&&this._$AE(t)}willUpdate(i){}_$AE(i){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(i)),this.updated(i)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(i){return!0}update(i){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(i){}firstUpdated(i){}};f.elementStyles=[],f.shadowRootOptions={mode:"open"},f[L("elementProperties")]=new Map,f[L("finalized")]=new Map,jt?.({ReactiveElement:f}),(z.reactiveElementVersions??=[]).push("2.1.2");var tt=globalThis,gt=l=>l,P=tt.trustedTypes,vt=P?P.createPolicy("lit-html",{createHTML:l=>l}):void 0,$t="$lit$",x=`lit$${Math.random().toFixed(9).slice(2)}$`,wt="?"+x,qt=`<${wt}>`,E=document,O=()=>E.createComment(""),N=l=>l===null||typeof l!="object"&&typeof l!="function",et=Array.isArray,Vt=l=>et(l)||typeof l?.[Symbol.iterator]=="function",U=`[ 	
\f\r]`,M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,mt=/-->/g,yt=/>/g,_=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),bt=/'/g,ft=/"/g,_t=/^(?:script|style|textarea|title)$/i,st=l=>(i,...t)=>({_$litType$:l,strings:i,values:t}),o=st(1),re=st(2),ne=st(3),k=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),xt=new WeakMap,S=E.createTreeWalker(E,129);function St(l,i){if(!et(l)||!l.hasOwnProperty("raw"))throw Error("invalid template strings array");return vt!==void 0?vt.createHTML(i):i}var Bt=(l,i)=>{let t=l.length-1,e=[],s,r=i===2?"<svg>":i===3?"<math>":"",n=M;for(let a=0;a<t;a++){let c=l[a],d,g,v=-1,y=0;for(;y<c.length&&(n.lastIndex=y,g=n.exec(c),g!==null);)y=n.lastIndex,n===M?g[1]==="!--"?n=mt:g[1]!==void 0?n=yt:g[2]!==void 0?(_t.test(g[2])&&(s=RegExp("</"+g[2],"g")),n=_):g[3]!==void 0&&(n=_):n===_?g[0]===">"?(n=s??M,v=-1):g[1]===void 0?v=-2:(v=n.lastIndex-g[2].length,d=g[1],n=g[3]===void 0?_:g[3]==='"'?ft:bt):n===ft||n===bt?n=_:n===mt||n===yt?n=M:(n=_,s=void 0);let b=n===_&&l[a+1].startsWith("/>")?" ":"";r+=n===M?c+qt:v>=0?(e.push(d),c.slice(0,v)+$t+c.slice(v)+x+b):c+x+(v===-2?a:b)}return[St(l,r+(l[t]||"<?>")+(i===2?"</svg>":i===3?"</math>":"")),e]},R=class l{constructor({strings:i,_$litType$:t},e){let s;this.parts=[];let r=0,n=0,a=i.length-1,c=this.parts,[d,g]=Bt(i,t);if(this.el=l.createElement(d,e),S.currentNode=this.el.content,t===2||t===3){let v=this.el.content.firstChild;v.replaceWith(...v.childNodes)}for(;(s=S.nextNode())!==null&&c.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(let v of s.getAttributeNames())if(v.endsWith($t)){let y=g[n++],b=s.getAttribute(v).split(x),w=/([.?@])?(.*)/.exec(y);c.push({type:1,index:r,name:w[2],strings:b,ctor:w[1]==="."?Z:w[1]==="?"?X:w[1]==="@"?G:I}),s.removeAttribute(v)}else v.startsWith(x)&&(c.push({type:6,index:r}),s.removeAttribute(v));if(_t.test(s.tagName)){let v=s.textContent.split(x),y=v.length-1;if(y>0){s.textContent=P?P.emptyScript:"";for(let b=0;b<y;b++)s.append(v[b],O()),S.nextNode(),c.push({type:2,index:++r});s.append(v[y],O())}}}else if(s.nodeType===8)if(s.data===wt)c.push({type:2,index:r});else{let v=-1;for(;(v=s.data.indexOf(x,v+1))!==-1;)c.push({type:7,index:r}),v+=x.length-1}r++}}static createElement(i,t){let e=E.createElement("template");return e.innerHTML=i,e}};function T(l,i,t=l,e){if(i===k)return i;let s=e!==void 0?t._$Co?.[e]:t._$Cl,r=N(i)?void 0:i._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),r===void 0?s=void 0:(s=new r(l),s._$AT(l,t,e)),e!==void 0?(t._$Co??=[])[e]=s:t._$Cl=s),s!==void 0&&(i=T(l,s._$AS(l,i.values),s,e)),i}var Y=class{constructor(i,t){this._$AV=[],this._$AN=void 0,this._$AD=i,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(i){let{el:{content:t},parts:e}=this._$AD,s=(i?.creationScope??E).importNode(t,!0);S.currentNode=s;let r=S.nextNode(),n=0,a=0,c=e[0];for(;c!==void 0;){if(n===c.index){let d;c.type===2?d=new D(r,r.nextSibling,this,i):c.type===1?d=new c.ctor(r,c.name,c.strings,this,i):c.type===6&&(d=new Q(r,this,i)),this._$AV.push(d),c=e[++a]}n!==c?.index&&(r=S.nextNode(),n++)}return S.currentNode=E,s}p(i){let t=0;for(let e of this._$AV)e!==void 0&&(e.strings!==void 0?(e._$AI(i,e,t),t+=e.strings.length-2):e._$AI(i[t])),t++}},D=class l{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(i,t,e,s){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=i,this._$AB=t,this._$AM=e,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let i=this._$AA.parentNode,t=this._$AM;return t!==void 0&&i?.nodeType===11&&(i=t.parentNode),i}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(i,t=this){i=T(this,i,t),N(i)?i===m||i==null||i===""?(this._$AH!==m&&this._$AR(),this._$AH=m):i!==this._$AH&&i!==k&&this._(i):i._$litType$!==void 0?this.$(i):i.nodeType!==void 0?this.T(i):Vt(i)?this.k(i):this._(i)}O(i){return this._$AA.parentNode.insertBefore(i,this._$AB)}T(i){this._$AH!==i&&(this._$AR(),this._$AH=this.O(i))}_(i){this._$AH!==m&&N(this._$AH)?this._$AA.nextSibling.data=i:this.T(E.createTextNode(i)),this._$AH=i}$(i){let{values:t,_$litType$:e}=i,s=typeof e=="number"?this._$AC(i):(e.el===void 0&&(e.el=R.createElement(St(e.h,e.h[0]),this.options)),e);if(this._$AH?._$AD===s)this._$AH.p(t);else{let r=new Y(s,this),n=r.u(this.options);r.p(t),this.T(n),this._$AH=r}}_$AC(i){let t=xt.get(i.strings);return t===void 0&&xt.set(i.strings,t=new R(i)),t}k(i){et(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,e,s=0;for(let r of i)s===t.length?t.push(e=new l(this.O(O()),this.O(O()),this,this.options)):e=t[s],e._$AI(r),s++;s<t.length&&(this._$AR(e&&e._$AB.nextSibling,s),t.length=s)}_$AR(i=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);i!==this._$AB;){let e=gt(i).nextSibling;gt(i).remove(),i=e}}setConnected(i){this._$AM===void 0&&(this._$Cv=i,this._$AP?.(i))}},I=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(i,t,e,s,r){this.type=1,this._$AH=m,this._$AN=void 0,this.element=i,this.name=t,this._$AM=s,this.options=r,e.length>2||e[0]!==""||e[1]!==""?(this._$AH=Array(e.length-1).fill(new String),this.strings=e):this._$AH=m}_$AI(i,t=this,e,s){let r=this.strings,n=!1;if(r===void 0)i=T(this,i,t,0),n=!N(i)||i!==this._$AH&&i!==k,n&&(this._$AH=i);else{let a=i,c,d;for(i=r[0],c=0;c<r.length-1;c++)d=T(this,a[e+c],t,c),d===k&&(d=this._$AH[c]),n||=!N(d)||d!==this._$AH[c],d===m?i=m:i!==m&&(i+=(d??"")+r[c+1]),this._$AH[c]=d}n&&!s&&this.j(i)}j(i){i===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,i??"")}},Z=class extends I{constructor(){super(...arguments),this.type=3}j(i){this.element[this.name]=i===m?void 0:i}},X=class extends I{constructor(){super(...arguments),this.type=4}j(i){this.element.toggleAttribute(this.name,!!i&&i!==m)}},G=class extends I{constructor(i,t,e,s,r){super(i,t,e,s,r),this.type=5}_$AI(i,t=this){if((i=T(this,i,t,0)??m)===k)return;let e=this._$AH,s=i===m&&e!==m||i.capture!==e.capture||i.once!==e.once||i.passive!==e.passive,r=i!==m&&(e===m||s);s&&this.element.removeEventListener(this.name,this,e),r&&this.element.addEventListener(this.name,this,i),this._$AH=i}handleEvent(i){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,i):this._$AH.handleEvent(i)}},Q=class{constructor(i,t,e){this.element=i,this.type=6,this._$AN=void 0,this._$AM=t,this.options=e}get _$AU(){return this._$AM._$AU}_$AI(i){T(this,i)}};var Jt=tt.litHtmlPolyfillSupport;Jt?.(R,D),(tt.litHtmlVersions??=[]).push("3.3.3");var Et=(l,i,t)=>{let e=t?.renderBefore??i,s=e._$litPart$;if(s===void 0){let r=t?.renderBefore??null;e._$litPart$=s=new D(i.insertBefore(O(),r),r,void 0,t??{})}return s._$AI(l),s};var it=globalThis,$=class extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let i=super.createRenderRoot();return this.renderOptions.renderBefore??=i.firstChild,i}update(i){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(i),this._$Do=Et(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return k}};$._$litElement$=!0,$.finalized=!0,it.litElementHydrateSupport?.({LitElement:$});var Kt=it.litElementPolyfillSupport;Kt?.({LitElement:$});(it.litElementVersions??=[]).push("4.2.2");var Ut={attribute:!0,type:String,converter:C,reflect:!1,hasChanged:F},Yt=(l=Ut,i,t)=>{let{kind:e,metadata:s}=t,r=globalThis.litPropertyMetadata.get(s);if(r===void 0&&globalThis.litPropertyMetadata.set(s,r=new Map),e==="setter"&&((l=Object.create(l)).wrapped=!0),r.set(t.name,l),e==="accessor"){let{name:n}=t;return{set(a){let c=i.get.call(this);i.set.call(this,a),this.requestUpdate(n,c,l,!0,a)},init(a){return a!==void 0&&this.C(n,void 0,l,a),a}}}if(e==="setter"){let{name:n}=t;return function(a){let c=this[n];i.call(this,a),this.requestUpdate(n,c,l,!0,a)}}throw Error("Unsupported decorator location: "+e)};function j(l){return(i,t)=>typeof t=="object"?Yt(l,i,t):((e,s,r)=>{let n=s.hasOwnProperty(r);return s.constructor.createProperty(r,e),n?Object.getOwnPropertyDescriptor(s,r):void 0})(l,i,t)}function u(l){return j({...l,state:!0,attribute:!1})}var at=560,Zt=JSON.stringify({id:"my_widget",label:"My Widget",w:16,h:7,default_cfg:{color:[0,255,0]},draw:[{op:"value",x:0,y:1,bind:"solar",fmt:"{:.1f}"},{op:"bar",x:0,y:6,w:16,h:1,bind:"soc",max:100,color:[0,120,255],bg:[30,30,30]}]},null,2),kt={galactic:[53,11],cosmic:[32,32],stellar:[16,16]},Xt=[["clear","Clear"],["partly_cloudy","Partly cloudy"],["cloudy","Cloudy"],["fog","Fog"],["rain","Rain"],["snow","Snow"],["thunderstorm","Storm"]],Tt="__mock__",It=["value","bar","rect","pixel","icon","dot"],Gt={value:[["bind","text"],["fmt","text"],["color","rgb"]],bar:[["w","num"],["h","num"],["bind","text"],["max","num"],["color","rgb"],["bg","rgb"]],rect:[["w","num"],["h","num"],["color","rgb"]],pixel:[["color","rgb"]],icon:[["name","icon"]],dot:[["w","num"],["h","num"],["bind","text"],["on_color","rgb"],["off_color","rgb"]]},V={value:{label:"Value",desc:"Draw a data value as text \u2014 pick a source and number format."},bar:{label:"Bar",desc:"Horizontal bar that fills from 0 to max by a value."},rect:{label:"Rectangle",desc:"A filled rectangle."},pixel:{label:"Pixel",desc:"A single lit pixel."},icon:{label:"Icon",desc:"Draw an installed icon by name."},dot:{label:"Status dot",desc:"A box that switches colour on a sensor's on/off state."}},Lt={bind:{label:"Data source",hint:"what value to show \u2014 see Available data"},fmt:{label:"Number format",hint:"e.g. {:.1f}W or {}%  (Python format)"},color:{label:"Colour"},bg:{label:"Background",hint:"track colour behind the bar"},w:{label:"Width",hint:"pixels"},h:{label:"Height",hint:"pixels"},max:{label:"Max value",hint:"value that fills the bar fully"},name:{label:"Icon"},on_color:{label:"On colour"},off_color:{label:"Off colour"}},At=["solar","consumption","soc","temp","weather","energy_mode","co2"],Qt=l=>Lt[l]?.label??l,rt=l=>{let[i,t,e]=l??[0,0,0];return"#"+[i,t,e].map(s=>Math.max(0,Math.min(255,s|0)).toString(16).padStart(2,"0")).join("")},nt=l=>{let i=(l||"").replace("#","");return[0,2,4].map(t=>parseInt(i.substr(t,2),16)||0)},p=class extends ${constructor(){super(...arguments);this.devices=[];this.entryId="";this.model="galactic";this.layout={widgets:[]};this.caps=[];this.widgetThumbs={};this.overlayCaps=[];this.defaultLayout={widgets:[]};this.stored={};this.png="";this.wboxes=[];this.dims=[53,11];this.orientation=0;this.previewWeather="";this.zoom=0;this.selected=-1;this.dragIdx=-1;this.dragOverIdx=-1;this.layoutName="default";this.live=!1;this.wireframe=!1;this.locked=!1;this.status="";this.tab="layout";this.catalog=[];this.fwManifest=null;this.activePage=null;this.contentLayouts=[];this.contentScreensets=[];this.showAllContent=!1;this.iconNames=[];this.installedIcons=[];this.iconThumbs={};this.deviceIcons=[];this.iconCode="";this.iconName="";this.iconTargets=[];this.fonts=[];this.fontText="";this.fontPngs={};this.fontTimer=0;this.dirty=!1;this.undoStack=[];this.redoStack=[];this.snapshot={widgets:[]};this.sectionsOpen={};this.screenLayouts=[];this.screenDwell=10;this.screenTransition="none";this.screenPngs={};this.screenIdx=0;this.screenOpacity=1;this.screenTimer=0;this.specText=Zt;this.editMode="form";this.specPng="";this.specError="";this.specTimer=0;this._frameTimers={};this._onKey=t=>{let e=t.target?.tagName;if(e==="INPUT"||e==="SELECT"||e==="TEXTAREA")return;if((t.ctrlKey||t.metaKey)&&t.key.toLowerCase()==="z"&&this.tab==="layout"){t.preventDefault(),t.shiftKey?this.redo():this.undo();return}if((t.ctrlKey||t.metaKey)&&t.key.toLowerCase()==="y"&&this.tab==="layout"){t.preventDefault(),this.redo();return}if((t.key==="Delete"||t.key==="Backspace")&&this.tab==="layout"&&this.selected>=0&&this.layout.widgets[this.selected]){t.preventDefault(),this.removeWidget(this.selected);return}let r={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[t.key];r&&(t.preventDefault(),this._nudge(r[0],r[1]))}}static{this.styles=J`
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
    .colorctl { display: inline-flex; align-items: center; gap: 8px; }
    .hexin { width: 84px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; text-transform: lowercase; }
    .rangeval { min-width: 32px; text-align: right; color: var(--secondary-text-color, #49454f); font-variant-numeric: tabular-nums; }
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
    .wlist li { display: flex; gap: 10px; align-items: center; padding: 10px 12px; min-height: 48px; box-sizing: border-box; border-radius: 10px; cursor: pointer; transition: background .12s; }
    .wlist li:hover { background: color-mix(in srgb, var(--pu-primary) 7%, transparent); }
    .wlist li.sel { background: color-mix(in srgb, var(--pu-primary) 14%, transparent); box-shadow: inset 3px 0 0 var(--pu-primary); }
    .wlist li .grow { flex: 1; }
    .wlist li.dragging { opacity: .4; }
    .wlist li.dragover { outline: 2px solid var(--pu-primary); outline-offset: -2px; }
    .wlist li .drag { cursor: grab; color: var(--secondary-text-color, #79747e); user-select: none; line-height: 1; }
    .wlist li .drag:active { cursor: grabbing; }
    .wlist li .wlx { border: none; background: none; color: var(--secondary-text-color, #79747e); font-size: 20px; line-height: 1; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; padding: 0; display: grid; place-items: center; flex: none; }
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
    .mhead, .mrow { display: grid; grid-template-columns: 108px minmax(120px,1fr) minmax(80px,0.9fr) 120px 110px; gap: 12px; align-items: center; }
    .mhead { font-size: 12px; font-weight: 600; color: var(--secondary-text-color, #79747e); padding: 0 14px 6px; }
    .mrow { border: 1px solid var(--pu-outline); border-radius: 10px; padding: 10px 14px; margin-bottom: 8px; }
    .cell-name { font-weight: 500; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .cell-action { display: flex; justify-content: flex-end; }
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
    .fcell { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; }
    .frow { display: flex; align-items: center; gap: 14px; padding: 8px 10px; border: 1px solid var(--pu-outline); border-radius: 8px; margin-bottom: 6px; }
    .fmeta { display: flex; flex-direction: column; gap: 2px; width: 160px; flex: none; }
    .fprev { height: 40px; image-rendering: pixelated; background: #000; border-radius: 6px; padding: 0 8px; object-fit: contain; box-shadow: inset 0 0 0 1px rgba(255,255,255,.12); }
    .swatches { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
    .swatch { position: relative; display: inline-flex; }
    .swatch .x { position: absolute; top: -6px; right: -6px; width: 14px; height: 14px; line-height: 12px; padding: 0; border-radius: 50%; border: none; background: var(--pu-outline); color: #fff; font-size: 11px; cursor: pointer; }
    .swatches .add { width: 22px; height: 22px; padding: 0; border-radius: 6px; border: 1px dashed var(--pu-outline); background: transparent; color: inherit; font-size: 15px; cursor: pointer; }
  `}firstUpdated(){this.loadDevices(),this.loadIcons(),this.loadFonts()}async loadIcons(){try{let t={type:"pimoroni_unicorn/icons"};this.entryId&&(t.entry_id=this.entryId);let e=await this.hass.callWS(t);this.iconNames=[...e.builtin??[],...e.installed??[]],this.installedIcons=e.installed??[],this.iconThumbs=e.thumbs??{},this.deviceIcons=e.device_installed??[]}catch{}}reloadIconsSoon(){this.loadIcons(),window.setTimeout(()=>this.loadIcons(),1500),window.setTimeout(()=>this.loadIcons(),4e3)}async pushIconToDevice(t){this.entryId&&(await this.hass.callWS({type:"pimoroni_unicorn/icon_push",entry_id:this.entryId,name:t}),this.status=`Installing "${t}" on this device\u2026`,this.reloadIconsSoon())}async removeIconFromDevice(t){this.entryId&&(await this.hass.callWS({type:"pimoroni_unicorn/icon_device_remove",entry_id:this.entryId,name:t}),this.status=`Removed "${t}" from this device.`,this.reloadIconsSoon())}iconTargetIds(){return this.iconTargets.length?this.iconTargets:this.devices.map(t=>t.entry_id)}toggleIconTarget(t){let e=new Set(this.iconTargetIds());e.has(t)?e.delete(t):e.add(t),this.iconTargets=this.devices.map(s=>s.entry_id).filter(s=>e.has(s))}async installIcon(){let t=parseInt(this.iconCode,10),e=this.iconName.trim();if(!t||!e)return;let s=this.iconTargetIds(),r=await this.hass.callWS({type:"pimoroni_unicorn/icon_install",code:t,name:e,entry_ids:s});if(!r.ok){this.status="Couldn't fetch that LaMetric code.";return}let n=r.sent??[];this.status=n.length?`Installed "${e}" \u2192 ${n.join(", ")}.`:`Saved "${e}" (no devices to push to).`,this.iconCode="",this.iconName="",this.reloadIconsSoon()}async removeIcon(t){confirm(`Delete icon "${t}" from all devices?`)&&(await this.hass.callWS({type:"pimoroni_unicorn/icon_remove",name:t}),this.status=`Removed icon "${t}".`,this.reloadIconsSoon())}async loadFonts(){try{let t={type:"pimoroni_unicorn/fonts"};this.entryId&&(t.entry_id=this.entryId);let e=await this.hass.callWS(t);this.fonts=e.fonts??[],this.refreshFontPreviews()}catch{}}onFontInput(t){this.fontText=t,clearTimeout(this.fontTimer),this.fontTimer=window.setTimeout(()=>this.refreshFontPreviews(),250)}async refreshFontPreviews(){let t={};await Promise.all(this.fonts.map(async e=>{let s=this.fontText.trim()||e.sample;try{let r=await this.hass.callWS({type:"pimoroni_unicorn/font_preview",font:e.name,text:s});t[e.name]=r.png}catch{}})),this.fontPngs=t}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKey)}disconnectedCallback(){window.removeEventListener("keydown",this._onKey),super.disconnectedCallback()}_nudge(t,e){let[s,r]=this.dims;if(this.selected>=0&&this.layout.widgets[this.selected]){let n=this.layout.widgets[this.selected],[a,c]=this.boxDims(this.selected);n.x=Math.max(1-a,Math.min(s-1,n.x+t)),n.y=Math.max(1-c,Math.min(r-1,n.y+e)),this.edited()}}async loadDevices(){let t=await this.hass.callWS({type:"pimoroni_unicorn/devices"});this.devices=t.devices??[],this.devices.length?await this.selectDevice(this.devices[0].entry_id):await this.selectMock(this.model)}async loadCaps(t){let e=await this.hass.callWS({type:"pimoroni_unicorn/capabilities",...t});this.caps=e.widgets??[],this.overlayCaps=e.overlays??[],this.defaultLayout=e.default_layout,this.model=e.model,this.orientation=e.orientation??0,this.dims=e.dims??kt[this.model]??[53,11],this.loadWidgetThumbs(),await this.refreshStored()}async loadWidgetThumbs(){try{let t=await this.hass.callWS({type:"pimoroni_unicorn/widget_thumbs",model:this.model});this.widgetThumbs=t.thumbs??{}}catch{}}async selectDevice(t){let e=this.devices.find(r=>r.entry_id===t);if(!e||!this.guardDiscard())return;this.entryId=t,await this.loadCaps({entry_id:t}),this.loadIcons(),this.loadFonts();let s=e.active_layout?this.stored[e.active_layout]:void 0;this.loadLayout(s??this.defaultLayout)}async selectMock(t){this.guardDiscard()&&(this.entryId="",await this.loadCaps({model:t}),this.loadIcons(),this.loadLayout(this.defaultLayout))}async refreshStored(){let t=await this.hass.callWS({type:"pimoroni_unicorn/layouts"});this.stored=t.layouts??{}}loadLayout(t){this.layout=JSON.parse(JSON.stringify(t)),this.layoutName=this.layout.name??"default",this.selected=-1,this.dirty=!1,this.undoStack=[],this.redoStack=[],this.snapshot=JSON.parse(JSON.stringify(this.layout)),this.renderPreview()}guardDiscard(){return!this.dirty||confirm("Discard unsaved changes to this page?")}playFrames(t,e,s){if(window.clearInterval(this._frameTimers[t]),s(e[0]??""),e.length>1){let r=0;this._frameTimers[t]=window.setInterval(()=>{r=(r+1)%e.length,s(e[r])},200)}}async renderPreview(){try{let t=await this.hass.callWS({type:"pimoroni_unicorn/render",model:this.model,layout:this.layout,orientation:this.orientation,weather:this.previewWeather||void 0});this.wboxes=t.boxes??[],this.playFrames("layout",t.frames??(t.png?[t.png]:[]),e=>{this.png=e}),this.status.startsWith("Render failed")&&(this.status="")}catch(t){this.png="",this.status=`Render failed: ${t?.message??t}`}}edited(){this.undoStack=[...this.undoStack.slice(-99),this.snapshot],this.redoStack=[],this.snapshot=JSON.parse(JSON.stringify(this.layout)),this.dirty=!0,this.requestUpdate(),this.scheduleRender()}scheduleRender(){this.renderTimer&&clearTimeout(this.renderTimer),this.renderTimer=window.setTimeout(()=>this.renderPreview(),80),this.live&&this.entryId&&(this.pushTimer&&clearTimeout(this.pushTimer),this.pushTimer=window.setTimeout(()=>this.pushLive(),250))}undo(){if(!this.undoStack.length)return;this.redoStack=[...this.redoStack,this.snapshot];let t=this.undoStack[this.undoStack.length-1];this.undoStack=this.undoStack.slice(0,-1),this.applyHistory(t)}redo(){if(!this.redoStack.length)return;this.undoStack=[...this.undoStack,this.snapshot];let t=this.redoStack[this.redoStack.length-1];this.redoStack=this.redoStack.slice(0,-1),this.applyHistory(t)}applyHistory(t){this.layout=JSON.parse(JSON.stringify(t)),this.snapshot=JSON.parse(JSON.stringify(t)),this.selected>=this.layout.widgets.length&&(this.selected=this.layout.widgets.length-1),this.layoutName=this.layout.name??this.layoutName,this.dirty=!0,this.requestUpdate(),this.scheduleRender()}async pushLive(){let t={...this.layout,name:this.layoutName};await this.hass.callWS({type:"pimoroni_unicorn/push_layout",entry_id:this.entryId,layout:t})}capFor(t){return this.caps.find(e=>e.id===t)}typeOf(t){return t.type??t.id}capForEntry(t){return this.capFor(this.typeOf(t))}get scale(){return this.zoom||Math.max(4,Math.floor(at/this.dims[0]))}get pxScale(){let t=window.devicePixelRatio||1;return Math.max(1,Math.round(this.scale*t))/t}zoomBy(t){this.zoom=Math.min(48,Math.max(4,this.scale+t))}onWheel(t){!t.ctrlKey&&!t.metaKey||(t.preventDefault(),this.zoomBy(t.deltaY<0?2:-2))}startPan(t){if(t.target.closest(".box"))return;let e=t.currentTarget;t.preventDefault();let s=t.clientX,r=t.clientY,n=e.scrollLeft,a=e.scrollTop;e.setPointerCapture(t.pointerId),e.classList.add("panning");let c=g=>{e.scrollLeft=n-(g.clientX-s),e.scrollTop=a-(g.clientY-r)},d=g=>{e.releasePointerCapture(g.pointerId),e.classList.remove("panning"),e.removeEventListener("pointermove",c),e.removeEventListener("pointerup",d)};e.addEventListener("pointermove",c),e.addEventListener("pointerup",d)}boxDims(t){let e=this.wboxes[t];if(e)return e;let s=this.layout.widgets[t],r=s?this.capForEntry(s):void 0;return r?[r.w,r.h]:[0,0]}cfgVal(t,e){return t.cfg?.[e]??this.capForEntry(t)?.default_cfg[e]}colorCtl(t,e){return o`<span class="colorctl">
      <input type="color" .value=${rt(t)}
        @input=${s=>e(nt(s.target.value))} />
      <input type="text" class="hexin" .value=${rt(t)} maxlength="7" spellcheck="false" aria-label="Hex colour"
        @change=${s=>e(nt(s.target.value))} />
    </span>`}setCfg(t,e,s){t.cfg={...t.cfg??{},[e]:s},this.edited()}cfgPalette(t,e){let s=this.cfgVal(t,e);return s&&s.length?s.map(r=>[...r]):[this.cfgVal(t,"color")??[255,255,255]]}setCfgColor(t,e,s,r){let n=this.cfgPalette(t,e);n[s]=r,this.setCfg(t,e,n)}addCfgColor(t,e){let s=this.cfgPalette(t,e);s.push([255,255,255]),this.setCfg(t,e,s)}removeCfgColor(t,e,s){let r=this.cfgPalette(t,e);r.length>1&&(r.splice(s,1),this.setCfg(t,e,r))}setName(t,e){let s=e.trim();s?t.name=s:delete t.name,this.edited()}setPos(t,e,s){let[r,n]=this.boxDims(this.selected),[a,c]=this.dims,d=Math.round(s);e==="x"?t.x=Math.max(1-r,Math.min(a-1,d)):t.y=Math.max(1-n,Math.min(c-1,d)),this.edited()}onImgLoad(t){let e=t.target;this.dims=[e.naturalWidth,e.naturalHeight]}startDrag(t,e){e.preventDefault(),this.selected=t;let s=this.layout.widgets[t],[r,n]=this.boxDims(t),a=this.layout.grid??2,[c,d]=this.dims,g=e.clientX,v=e.clientY,y=s.x,b=s.y;e.target.setPointerCapture(e.pointerId);let w=lt=>{let Ct=Math.round((lt.clientX-g)/this.pxScale/a)*a,Mt=Math.round((lt.clientY-v)/this.pxScale/a)*a;s.x=Math.max(1-r,Math.min(c-1,y+Ct)),s.y=Math.max(1-n,Math.min(d-1,b+Mt)),this.edited()},ot=()=>{window.removeEventListener("pointermove",w),window.removeEventListener("pointerup",ot),this.renderPreview()};window.addEventListener("pointermove",w),window.addEventListener("pointerup",ot)}addWidget(t){if(!t)return;let e=this.capFor(t),s=new Set(this.layout.widgets.map(n=>n.id)),r;if(e?.multi||s.has(t)){let n=2,a=`${t}-${n}`;for(;s.has(a);)a=`${t}-${++n}`;r={id:a,type:t,name:`${e?.label??t} ${n}`,x:0,y:0,cfg:{}}}else r={id:t,type:t,x:0,y:0,cfg:{}};this.layout.widgets.push(r),this.selected=this.layout.widgets.length-1,this.edited()}removeWidget(t){this.layout.widgets.splice(t,1),this.selected=-1,this.edited()}dropWidget(t){let e=this.dragIdx;if(this.dragIdx=-1,e<0||e===t)return;let s=this.layout.widgets,[r]=s.splice(e,1);s.splice(t,0,r),this.selected=s.indexOf(r),this.edited()}toggleOverlay(t,e){let s=new Set(this.layout.overlays??[]);e?s.add(t):s.delete(t),this.layout.overlays=[...s],this.edited()}async save(){if(!this.layoutName.trim()){this.status="Name the page before saving.";return}this.layout.name=this.layoutName,await this.hass.callWS({type:"pimoroni_unicorn/save_layout",name:this.layoutName,layout:this.layout}),await this.refreshStored(),this.dirty=!1,this.status=`Saved "${this.layoutName}" to the library.`}newPage(){this.guardDiscard()&&(this.loadLayout(this.defaultLayout),this.layoutName="",this.switchTab("layout"))}async editCurrentPage(){if(!this.entryId||!this.guardDiscard())return;let e=((await this.hass.callWS({type:"pimoroni_unicorn/devices"})).devices??[]).find(r=>r.entry_id===this.entryId);await this.refreshStored();let s=e?.active_layout?this.stored[e.active_layout]:void 0;if(!s){this.status="This device has no active page saved in the library yet.";return}this.layoutName=e.active_layout,this.loadLayout(s),this.switchTab("layout"),this.status=`Loaded the device's current page "${e.active_layout}".`}async deploy(){this.entryId&&(this.layout.name=this.layoutName,await this.hass.callWS({type:"pimoroni_unicorn/push_layout",entry_id:this.entryId,layout:this.layout,set_active:!0,name:this.layoutName}),this.status=`Pushed "${this.layoutName}" to the device.`)}async deleteLayout(){this.stored[this.layoutName]&&confirm(`Delete page "${this.layoutName}"? This can't be undone.`)&&(await this.hass.callWS({type:"pimoroni_unicorn/delete_layout",name:this.layoutName}),await this.refreshStored(),this.status=`Deleted "${this.layoutName}".`,this.loadLayout(this.defaultLayout))}renderWidgetEditor(){let t=this.layout.widgets[this.selected];if(!t)return o`<p class="hint">Select a widget to edit.</p>`;let e=this.capForEntry(t);return e?o`
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
      ${e.cfg_fields.map(s=>{let r=this.cfgVal(t,"color_mode");if(s.key==="speed"&&r!=="rainbow"||s.type==="rgblist"&&r!=="per_char")return"";let n=this.cfgVal(t,"off_mode");if(s.key==="off_brightness"&&n==="colour"||s.key==="off_color"&&n!=="colour")return"";if(s.type==="rgblist"){let a=this.cfgPalette(t,s.key);return o`<div class="panelrow"><label>${s.label??s.key}</label>
            <span class="swatches">
              ${a.map((c,d)=>o`<span class="swatch">
                <input type="color" .value=${rt(c)}
                  @input=${g=>this.setCfgColor(t,s.key,d,nt(g.target.value))} />
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
              @change=${a=>this.setCfg(t,s.key,+a.target.value)} /></div>`;if(s.type==="bool")return o`<div class="panelrow"><label>${s.label??s.key}</label>
            <input type="checkbox" .checked=${!!this.cfgVal(t,s.key)}
              @change=${a=>this.setCfg(t,s.key,a.target.checked)} /></div>`;if(s.type==="range"){let a=Number(this.cfgVal(t,s.key)??s.max??100);return o`<div class="panelrow"><label>${s.label??s.key}</label>
            <input type="range" min=${s.min??0} max=${s.max??100} step=${s.step??1} .value=${String(a)}
              @input=${c=>this.setCfg(t,s.key,+c.target.value)} />
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
          <select @change=${e=>{let s=e.target.value;s===Tt?this.selectMock(this.model):this.selectDevice(s)}}>
            <option value=${Tt} ?selected=${!this.entryId}>Mock (preview only)</option>
            ${this.devices.map(e=>o`<option value=${e.entry_id} ?selected=${e.entry_id===this.entryId}>${e.name}</option>`)}
          </select>
        </label>
        ${this.entryId?o`<span class="chip">${t?.model??this.model}</span>`:o`<label>Model
              <select @change=${e=>this.selectMock(e.target.value)}>
                ${Object.keys(kt).map(e=>o`<option ?selected=${e===this.model}>${e}</option>`)}
              </select></label>`}
        <span class="chip dim">${this.dims[0]}&times;${this.dims[1]} px</span>
        <span class="grow"></span>
        ${this.dirty?o`<span class="chip warn">unsaved changes</span>`:""}
        ${this.fwManifest?.engine_version?o`<span class="hint">engine v${this.fwManifest.engine_version}</span>`:""}
      </div>`}render(){return o`
      ${this._appBar()}
      <div class="tabs">
        <button class="tab ${this.tab==="layout"?"on":""}" @click=${()=>this.switchTab("layout")}>Designer</button>
        <button class="tab ${this.tab==="market"?"on":""}" @click=${()=>this.switchTab("market")}>Marketplace</button>
        <button class="tab ${this.tab==="edit"?"on":""}" @click=${()=>this.switchTab("edit")}>Widget editor</button>
        <button class="tab ${this.tab==="screens"?"on":""}" @click=${()=>this.switchTab("screens")}>Playlists</button>
      </div>
      ${this.tab==="market"?this._marketplaceView():this.tab==="edit"?this._editorView():this.tab==="screens"?this._screensView():this._layoutView()}
    `}_layoutView(){let t=this.pxScale,e=new Set(this.layout.widgets.map(a=>this.typeOf(a))),s=this.caps.filter(a=>a.multi||!e.has(a.id)),r=new Set(this.layout.overlays??[]),n=`background-image:linear-gradient(to right,rgba(255,255,255,.10) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.10) 1px,transparent 1px);background-size:${t}px ${t}px`;return o`
      <div class="bar">
        <div class="group">
          <label>Page
            <select @change=${a=>{let c=a.target.value;this.guardDiscard()&&this.loadLayout(c==="__new__"?this.defaultLayout:this.stored[c])}}>
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
        <div class="group">
          <button class="secondary" @click=${this.editCurrentPage} ?disabled=${!this.entryId} title=${this.entryId?"Load the page currently active on the device to edit it":"Select a device first"}>Edit current page</button>
          <button @click=${this.save} title="Save this page to the library (no device needed)">Save</button>
          <button class="secondary" @click=${this.deploy} ?disabled=${!this.entryId} title=${this.entryId?"Push this page to the selected device now":"Select a device to push"}>Push to device</button>
          <button class="secondary" @click=${this.exportLayout} title="Copy this page's JSON to clipboard to share or import elsewhere">Export JSON</button>
          ${this.stored[this.layoutName]?o`<button class="secondary" @click=${()=>this.publishLayout(!0)} title="List this page in the marketplace">Publish</button>`:""}
          ${this.stored[this.layoutName]?o`<button class="danger" @click=${this.deleteLayout}>Delete</button>`:""}
        </div>
        <span class="grow"></span>
        <div class="group">
          <label>Snap
            <select @change=${a=>{this.layout.grid=+a.target.value,this.edited()}}>
              ${[1,2,4].map(a=>o`<option ?selected=${(this.layout.grid??2)===a}>${a}</option>`)}
            </select> px</label>
          <label>Zoom
            <button class="zbtn" @click=${()=>this.zoomBy(-2)} title="Zoom out">&minus;</button>
            <input type="range" min="4" max="48" .value=${String(this.scale)}
              @input=${a=>this.zoom=+a.target.value} />
            <button class="zbtn" @click=${()=>this.zoomBy(2)} title="Zoom in">+</button>
          </label>
          <label>Weather
            <select @change=${a=>{this.previewWeather=a.target.value,this.renderPreview()}}>
              <option value="" ?selected=${this.previewWeather===""}>live</option>
              ${Xt.map(([a,c])=>o`<option value=${a} ?selected=${this.previewWeather===a}>${c}</option>`)}
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
              ${this.png?o`<img src="data:image/png;base64,${this.png}" width=${this.dims[0]*t} height=${this.dims[1]*t} @load=${this.onImgLoad} />`:""}
              <div class="grid" style=${n}></div>
              ${this.locked?"":o`<div class="boxes ${this.wireframe?"wf":""}">${this.layout.widgets.map((a,c)=>{if(!this.capForEntry(a)||a.enabled===!1)return"";let[d,g]=this.boxDims(c);return o`<div class="box ${c===this.selected?"sel":""}"
                  style=${`left:${a.x*t}px;top:${a.y*t}px;width:${d*t}px;height:${g*t}px`}
                  @pointerdown=${v=>this.startDrag(c,v)}>
                  <span class="tag">${a.name??this.capForEntry(a)?.label??a.id}</span></div>`})}</div>`}
            </div>
          </div>
          <div class="status ${this.status.startsWith("Render failed")?"err":""}">${this.status}</div>
        </div>

        <div class="col">
          <h3>Layers</h3>
          <ul class="wlist">
            ${[...this.layout.widgets.keys()].reverse().map(a=>{let c=this.layout.widgets[a];return o`
              <li class="${a===this.selected?"sel":""} ${a===this.dragIdx?"dragging":""} ${a===this.dragOverIdx&&a!==this.dragIdx?"dragover":""}"
                  @click=${()=>this.selected=a}
                  @dragover=${d=>{d.preventDefault(),d.dataTransfer&&(d.dataTransfer.dropEffect="move"),this.dragOverIdx=a}}
                  @dragleave=${()=>{this.dragOverIdx===a&&(this.dragOverIdx=-1)}}
                  @drop=${d=>{d.preventDefault(),this.dropWidget(a),this.dragOverIdx=-1}}>
                <span class="drag" title="Drag to reorder" draggable="true"
                  @dragstart=${d=>{if(this.dragIdx=a,d.dataTransfer){d.dataTransfer.effectAllowed="move",d.dataTransfer.setData("text/plain",String(a));let g=d.target.closest("li");g&&d.dataTransfer.setDragImage(g,0,0)}}}
                  @dragend=${()=>{this.dragIdx=-1,this.dragOverIdx=-1}}>⣿</span>
                <input type="checkbox" .checked=${c.enabled!==!1} title="Show / hide"
                  @click=${d=>{d.stopPropagation(),c.enabled=d.target.checked,this.edited()}} />
                <span class="grow">${c.name??this.capForEntry(c)?.label??c.id}</span>
                <button class="wlx" title="Delete layer"
                  @click=${d=>{d.stopPropagation(),this.removeWidget(a)}}>×</button>
              </li>`})}
          </ul>
          ${this.layout.widgets.length>1?o`<p class="hint">Top of the list draws on top.</p>`:""}
          ${s.length?o`<div class="addgrid">
            ${s.map(a=>o`<button class="addtile" @click=${()=>this.addWidget(a.id)} title="Add ${a.label}">
              ${this.widgetThumbs[a.id]?o`<img class="addthumb" src="data:image/png;base64,${this.widgetThumbs[a.id]}" alt="" />`:o`<div class="addthumb"></div>`}
              <span class="addtile-label">${a.label}</span>
            </button>`)}
          </div>`:""}
          <h3>Overlays</h3>
          ${this.overlayCaps.map(a=>o`<div class="panelrow"><label>
            <input type="checkbox" .checked=${r.has(a.id)} @change=${c=>this.toggleOverlay(a.id,c.target.checked)} /> ${a.label}</label></div>`)}
          <h3>Selected</h3>
          ${this.renderWidgetEditor()}
        </div>
      </div>
    `}async loadCatalog(){if(await this.loadContent(),!this.entryId){this.catalog=[],this.fwManifest=null;return}let t=await this.hass.callWS({type:"pimoroni_unicorn/catalog",entry_id:this.entryId});this.catalog=t.widgets??[];let e=await this.hass.callWS({type:"pimoroni_unicorn/fw_manifest",entry_id:this.entryId});this.fwManifest=e.manifest??null}async loadContent(){let t=this.entryId?{entry_id:this.entryId}:{},e=await this.hass.callWS({type:"pimoroni_unicorn/content_catalog",...t});this.activePage=e.active_page??null,this.contentLayouts=e.layouts??[],this.contentScreensets=e.screensets??[]}async deployLayout(t,e){if(!this.entryId){this.status="Select a device to deploy.";return}if(!e&&!confirm(`"${t}" isn't built for this device's model. Deploy anyway?`))return;let s=await this.hass.callWS({type:"pimoroni_unicorn/deploy_layout",entry_id:this.entryId,name:t,override:!e});this.status=s.ok?`Deployed "${t}" (installing any missing widgets/fonts first).`:"Deploy failed."}async deployScreenset(t,e){if(!this.entryId){this.status="Select a device to deploy.";return}if(!e&&!confirm(`"${t}" isn't built for this device's model. Deploy anyway?`))return;let s=await this.hass.callWS({type:"pimoroni_unicorn/deploy_screenset",entry_id:this.entryId,id:t,override:!e});this.status=s.ok?`Deployed screen set "${t}".`:"Deploy failed."}async exportLayout(){let t={...this.layout,name:this.layoutName,model:this.model},e=JSON.stringify(t,null,2);try{await navigator.clipboard.writeText(e),this.status=`Copied "${this.layoutName}" JSON (${this.model}) to clipboard.`}catch{let s=document.createElement("a");s.href=URL.createObjectURL(new Blob([e],{type:"application/json"})),s.download=`${this.layoutName||"layout"}.json`,s.click(),URL.revokeObjectURL(s.href),this.status=`Downloaded "${this.layoutName}.json".`}}async publishLayout(t){if(!this.stored[this.layoutName]){this.status="Save the layout first, then publish.";return}await this.hass.callWS({type:"pimoroni_unicorn/publish_layout",name:this.layoutName,published:t}),this.status=t?`Published "${this.layoutName}" to the marketplace.`:`Unpublished "${this.layoutName}".`,this.loadContent()}async saveScreenset(){if(!this.screenLayouts.length){this.status="Add at least one screen first.";return}let t=prompt("Name this screen set:");t&&(await this.hass.callWS({type:"pimoroni_unicorn/save_screenset",id:t,screenset:{label:t,layouts:this.screenLayouts,dwell:this.screenDwell,transition:this.screenTransition,triggers:[]}}),this.status=`Saved screen set "${t}".`,this.loadContent())}reloadCatalogSoon(){for(let t of[8e3,15e3,25e3])setTimeout(()=>this.loadCatalog(),t)}async installFont(t){if(this.entryId){await this.hass.callWS({type:"pimoroni_unicorn/font_install",entry_id:this.entryId,font:t}),this.status=`Installing font ${t}\u2026`;for(let e of[2e3,5e3])setTimeout(()=>this.loadFonts(),e)}}async installWidget(t){await this.hass.callWS({type:"pimoroni_unicorn/fw_install",entry_id:this.entryId,widget_id:t}),this.status=`Installing ${t}\u2026`,this.reloadCatalogSoon()}async removeWidgetUnit(t){await this.hass.callWS({type:"pimoroni_unicorn/fw_remove",entry_id:this.entryId,widget_id:t}),this.status=`Removing ${t}\u2026`,this.reloadCatalogSoon()}_thumb(t){return t?o`<img class="thumb" src="data:image/png;base64,${t}" />`:o`<div class="thumb"></div>`}_mhead(){return o`<div class="mhead"><span>Preview</span><span>Name</span><span>Dependencies</span><span>Status</span><span></span></div>`}_section(t,e,s,r){let n=this.sectionsOpen[t]!==!1;return o`<div class="section">
      <div class="shead" @click=${()=>{this.sectionsOpen={...this.sectionsOpen,[t]:!n}}}>
        <svg class="chev ${n?"open":""}" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /></svg>
        <span class="stitle">${e}</span>
        <span class="chip dim">${s}</span>
      </div>
      ${n?r:""}
    </div>`}_contentRow(t,e){let s=e==="layout"&&!!this.activePage&&t.id===this.activePage;return o`<div class="mrow">
      ${this._thumb(t.thumb)}
      <div class="cell-name">${t.label}
        ${t.compat?.length?o`<span class="hint">[${t.compat.join("/")}]</span>`:""}
        ${e==="screenset"?o`<span class="hint">${t.screens} page(s)</span>`:""}</div>
      <div class="hint">${t.requires?.length?o`<span title=${t.requires.join(", ")}>${t.requires.length} dep(s)</span>`:"\u2014"}</div>
      <div class="badges">${s?o`<span class="badge ok">on device</span>`:""}${t.compatible?o`<span class="badge ok">compatible</span>`:o`<span class="badge warn">other model</span>`}</div>
      <div class="cell-action"><button ?disabled=${!this.entryId} title=${this.entryId?"":"Select a device to deploy"}
        @click=${()=>e==="layout"?this.deployLayout(t.id,t.compatible):this.deployScreenset(t.id,t.compatible)}>${s?"Re-deploy":"Deploy"}</button></div>
    </div>`}_marketplaceView(){let t=this.showAllContent,e=this.contentLayouts.filter(a=>t||a.compatible),s=this.contentScreensets.filter(a=>t||a.compatible),r={installed:"ok",outdated:"warn",not_installed:""},n={installed:"installed",outdated:"update available",not_installed:"not installed"};return o`
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
              <div><span class="badge ${r[a.status]??""}">${n[a.status]??a.status}</span></div>
              <div class="cell-action">${a.status==="installed"?o`<button class="danger" @click=${()=>this.removeWidgetUnit(a.id)}>Remove</button>`:o`<button @click=${()=>this.installWidget(a.id)}>${a.status==="outdated"?"Update":"Install"}</button>`}</div>
            </div>`)}
          </div>`:o`<p class="hint">Select a device to manage installed widgets.</p>`)}

      ${this._section("icons","Icons",this.installedIcons.length,o`
        <p class="hint">Built-in icons ship with the engine. Add LaMetric gallery icons by code, then choose which devices to install them on.</p>
        <div class="panelrow">
          ${this.iconCode?o`<img class="iconprev"
            src="https://developer.lametric.com/content/apps/icon_thumbs/${this.iconCode}" />`:o`<div class="iconprev"></div>`}
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
        ${this.entryId?o`<p class="hint">On-device status is shown for the selected device. “Install” pushes a registry icon to just this device; “Remove” takes it off this device only. “Delete” removes it everywhere.</p>`:""}
        ${this.installedIcons.length?this.installedIcons.map(a=>{let c=this.deviceIcons.includes(a);return o`<div class="panelrow">
              ${this.iconThumbs[a]?o`<img class="iconthumb" src="data:image/png;base64,${this.iconThumbs[a]}" />`:o`<div class="iconthumb"></div>`}
              <span class="grow">${a}</span>
              ${this.entryId?c?o`<button class="zbtn" title="Remove from this device"
                      @click=${()=>this.removeIconFromDevice(a)}>On device ✓</button>`:o`<button class="zbtn" title="Install on this device"
                      @click=${()=>this.pushIconToDevice(a)}>Install</button>`:""}
              <button class="danger zbtn" title="Delete from all devices"
                @click=${()=>this.removeIcon(a)}>Delete</button></div>`}):o`<p class="hint">No custom icons installed yet.</p>`}
      `)}

      ${this._section("fonts","Fonts",this.fonts.length,o`
        <p class="hint">Type below to preview live in every font. Digit fonts (clock faces) show only numerals; alpha fonts cover A–Z. Fonts install automatically with any widget that needs them, or install one directly onto the selected device here (no reboot).</p>
        <div class="panelrow">
          <label>Preview text</label>
          <input style="width:220px" placeholder="type to preview…" .value=${this.fontText}
            @input=${a=>this.onFontInput(a.target.value)} />
        </div>
        ${[...this.fonts].sort((a,c)=>a.h-c.h||a.w-c.w||a.label.localeCompare(c.label)).map(a=>o`<div class="frow">
          <div class="fmeta"><span class="cell-name">${a.label}</span>
            <span class="hint">${a.kind==="digits"?"digits":"A\u2013Z 0\u20139"} · ${a.w}×${a.h}</span></div>
          ${this.fontPngs[a.name]?o`<img class="fprev" src="data:image/png;base64,${this.fontPngs[a.name]}" />`:o`<div class="fprev"></div>`}
          ${a.builtin?o`<span class="badge ok">built-in</span>`:this.entryId?a.installed?o`<span class="badge ok">installed</span>`:o`<button @click=${()=>this.installFont(a.name)}>Install</button>`:""}
        </div>`)}
      `)}
      <p class="hint">Deploying a page installs any widgets/fonts it needs over the air first, then pushes it; the device reboots if files changed.</p>
    `}onSpecInput(t){this.specText=t,clearTimeout(this.specTimer),this.specTimer=window.setTimeout(()=>this.previewSpec(),400)}async previewSpec(){let t;try{t=JSON.parse(this.specText)}catch(e){this.specError=`JSON: ${e.message}`;return}try{let e=await this.hass.callWS({type:"pimoroni_unicorn/widget_preview",model:this.model,spec:t});this.playFrames("spec",e.frames??(e.png?[e.png]:[]),s=>{this.specPng=s}),this.specError=""}catch(e){this.specError=e?.message??String(e)}}async importSpec(t){try{let e=await this.hass.callWS({type:"pimoroni_unicorn/widget_import",text:t});this.specText=JSON.stringify(e.spec,null,2),this.specError="",this.previewSpec()}catch(e){this.specError=e?.message??String(e)}}async saveSpec(){let t;try{t=JSON.parse(this.specText)}catch(e){this.specError=`JSON: ${e.message}`;return}try{let e=await this.hass.callWS({type:"pimoroni_unicorn/widget_save",spec:t});this.specError="",this.status=`Saved custom widget "${e.id}". Install it from the Marketplace tab.`}catch(e){this.specError=e?.message??String(e)}}parsedSpec(){try{return JSON.parse(this.specText)}catch{return null}}writeSpec(t){this.specText=JSON.stringify(t,null,2),this.specError="",clearTimeout(this.specTimer),this.specTimer=window.setTimeout(()=>this.previewSpec(),120)}setSpecField(t,e){let s=this.parsedSpec();s&&(s[t]=e,this.writeSpec(s))}setOpField(t,e,s){let r=this.parsedSpec();!r||!Array.isArray(r.draw)||(r.draw[t]={...r.draw[t],[e]:s},this.writeSpec(r))}addOp(t){let e=this.parsedSpec()??{};e.draw=[...e.draw??[],{op:t,x:0,y:0}],this.writeSpec(e)}removeOp(t){let e=this.parsedSpec();!e||!Array.isArray(e.draw)||(e.draw.splice(t,1),this.writeSpec(e))}_opField(t,e,s,r){let n=Lt[s]?.hint,a=o`<span class="flabel">${Qt(s)}</span>`,c;return r==="rgb"?c=this.colorCtl(t[s]??[255,255,255],d=>this.setOpField(e,s,d)):r==="num"?c=o`<input type="number" style="width:64px" .value=${String(t[s]??0)} @change=${d=>this.setOpField(e,s,+d.target.value)} />`:r==="icon"?c=o`<select @change=${d=>this.setOpField(e,s,d.target.value)}>
        ${this.iconNames.map(d=>o`<option ?selected=${t[s]===d}>${d}</option>`)}</select>`:s==="bind"?c=o`<input type="text" style="width:140px" list="pu-bind-list" placeholder="solar…"
        .value=${String(t[s]??"")} @change=${d=>this.setOpField(e,s,d.target.value)} />`:c=o`<input type="text" style="width:120px" .value=${String(t[s]??"")} @change=${d=>this.setOpField(e,s,d.target.value)} />`,o`${a}<span class="fcell">${c}${n?o`<span class="fhint">${n}</span>`:""}</span>`}_opEditor(t,e){let s=V[t.op]??{label:t.op,desc:""};return o`<div class="opcard">
      <div class="ophead">
        <span class="optitle">${s.label}</span>
        <select title="Change op type" @change=${r=>this.setOpField(e,"op",r.target.value)}>
          ${It.map(r=>o`<option value=${r} ?selected=${r===t.op}>${V[r]?.label??r}</option>`)}</select>
        <span class="grow"></span>
        <button class="danger zbtn" title="Remove op" @click=${()=>this.removeOp(e)}>✕</button>
      </div>
      ${s.desc?o`<p class="opdesc">${s.desc}</p>`:""}
      <div class="fieldgrid">
        <span class="flabel">Position</span>
        <span class="fcell">
          <label class="fhint">X</label><input type="number" style="width:64px" .value=${String(t.x??0)} @change=${r=>this.setOpField(e,"x",+r.target.value)} />
          <label class="fhint">Y</label><input type="number" style="width:64px" .value=${String(t.y??0)} @change=${r=>this.setOpField(e,"y",+r.target.value)} />
        </span>
        ${(Gt[t.op]??[]).map(([r,n])=>this._opField(t,e,r,n))}
      </div>
    </div>`}_formView(){let t=this.parsedSpec();return t?o`
      <datalist id="pu-bind-list">${At.map(e=>o`<option value=${e}></option>`)}</datalist>
      <div class="fieldgrid">
        <span class="flabel">ID</span><span class="fcell"><input style="width:140px" .value=${t.id??""} @change=${e=>this.setSpecField("id",e.target.value)} /><span class="fhint">unique id, e.g. my_widget</span></span>
        <span class="flabel">Label</span><span class="fcell"><input style="width:140px" .value=${t.label??""} @change=${e=>this.setSpecField("label",e.target.value)} /></span>
        <span class="flabel">Size</span><span class="fcell">
          <label class="fhint">W</label><input type="number" style="width:64px" .value=${String(t.w??"")} @change=${e=>this.setSpecField("w",+e.target.value)} />
          <label class="fhint">H</label><input type="number" style="width:64px" .value=${String(t.h??"")} @change=${e=>this.setSpecField("h",+e.target.value)} />
        </span>
      </div>
      <h3>Draw ops</h3>
      <p class="hint">Each op draws one element, in order. Available data: ${At.join(", ")} (unknown binds preview as 123).</p>
      ${(t.draw??[]).map((e,s)=>this._opEditor(e,s))}
      <p class="hint">Add an op:</p>
      <div class="addchips">
        ${It.map(e=>o`<button class="addchip" title=${V[e]?.desc??""} @click=${()=>this.addOp(e)}>+ ${V[e]?.label??e}</button>`)}
      </div>
    `:o`<p class="status err">Spec isn't valid JSON — switch to YAML / JSON to fix it.</p>`}_editorView(){let t=Math.max(6,Math.floor(at/this.dims[0]));return o`
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
            ${this.specPng?o`<img src="data:image/png;base64,${this.specPng}" width=${this.dims[0]*t} height=${this.dims[1]*t} />`:""}
          </div>
        </div>
      </div>
    `}toggleScreen(t,e){this.screenLayouts=e?[...this.screenLayouts,t]:this.screenLayouts.filter(s=>s!==t),this.buildScreenPreview()}moveScreen(t,e){let s=[...this.screenLayouts],r=s.indexOf(t),n=r+e;r<0||n<0||n>=s.length||([s[r],s[n]]=[s[n],s[r]],this.screenLayouts=s,this.buildScreenPreview())}async buildScreenPreview(){clearInterval(this.screenTimer);let t={};for(let e of this.screenLayouts){let s=this.stored[e];if(s)try{let r=await this.hass.callWS({type:"pimoroni_unicorn/render",model:this.model,layout:s});t[e]=r.png}catch{}}this.screenPngs=t,this.screenIdx=0,this.screenOpacity=1,this.screenLayouts.length>1&&this.screenDwell>0&&(this.screenTimer=window.setInterval(()=>this._advancePreview(),this.screenDwell*1e3))}_advancePreview(){let t=(this.screenIdx+1)%this.screenLayouts.length;this.screenTransition==="fade"?(this.screenOpacity=0,setTimeout(()=>{this.screenIdx=t,this.screenOpacity=1},280)):this.screenIdx=t}async pushScreens(){!this.entryId||!this.screenLayouts.length||(await this.hass.callWS({type:"pimoroni_unicorn/push_screens",entry_id:this.entryId,layouts:this.screenLayouts,dwell:this.screenDwell,transition:this.screenTransition}),this.status=`Pushed ${this.screenLayouts.length} page(s) to device.`)}_screensView(){let t=Math.max(6,Math.floor(at/this.dims[0])),e=Object.keys(this.stored),s=this.screenLayouts[this.screenIdx],r=s?this.screenPngs[s]:"";return o`
      <div class="bar"><span class="hint">compose a playlist — pages cycle on a timer; preview on ${this.model}</span></div>
      <div class="wrap">
        <div class="col">
          <h3>Pages in this playlist</h3>
          <p class="hint">Tick pages to include, then order them with ▲ ▼.</p>
          ${e.length?e.map(n=>{let a=this.screenLayouts.includes(n),c=this.screenLayouts.indexOf(n);return o`<div class="panelrow">
              <input type="checkbox" ?checked=${a}
                @change=${d=>this.toggleScreen(n,d.target.checked)} />
              ${a?o`<span class="chip">${c+1}</span>`:""}
              <span class="grow">${n}</span>
              ${a?o`
                <button class="zbtn secondary" ?disabled=${c===0} @click=${()=>this.moveScreen(n,-1)} title="Move up">▲</button>
                <button class="zbtn secondary" ?disabled=${c===this.screenLayouts.length-1} @click=${()=>this.moveScreen(n,1)} title="Move down">▼</button>`:""}
            </div>`}):o`<p class="hint">No saved pages yet — create one on the Designer tab.</p>`}
          <div class="panelrow"><label>Dwell (s)
            <input type="number" style="width:60px" min="1" max="600" .value=${String(this.screenDwell)}
              @change=${n=>{this.screenDwell=+n.target.value,this.buildScreenPreview()}} /></label></div>
          <div class="panelrow"><label>Transition
            <select @change=${n=>{this.screenTransition=n.target.value,this.buildScreenPreview()}}>
              ${["none","fade"].map(n=>o`<option ?selected=${n===this.screenTransition}>${n}</option>`)}
            </select></label></div>
          <div class="panelrow">
            <button @click=${this.pushScreens} ?disabled=${!this.entryId} title=${this.entryId?"":"Select a device to push"}>Push to device</button>
            <button class="secondary" @click=${this.saveScreenset} ?disabled=${!this.screenLayouts.length} title="Save as a reusable playlist in the marketplace">Save as playlist</button>
          </div>
        </div>
        <div class="col">
          <div class="stage" style=${`width:${this.dims[0]*t}px;height:${this.dims[1]*t}px`}>
            ${r?o`<img src="data:image/png;base64,${r}" width=${this.dims[0]*t} height=${this.dims[1]*t}
              style=${`opacity:${this.screenOpacity};transition:opacity 280ms`} />`:""}
          </div>
          <div class="hint">${this.screenLayouts.length>1?`playing ${this.screenIdx+1}/${this.screenLayouts.length}: ${s??""}`:s??"tick pages to preview"}</div>
        </div>
      </div>
    `}};h([j({attribute:!1})],p.prototype,"hass",2),h([u()],p.prototype,"devices",2),h([u()],p.prototype,"entryId",2),h([u()],p.prototype,"model",2),h([u()],p.prototype,"layout",2),h([u()],p.prototype,"caps",2),h([u()],p.prototype,"widgetThumbs",2),h([u()],p.prototype,"overlayCaps",2),h([u()],p.prototype,"defaultLayout",2),h([u()],p.prototype,"stored",2),h([u()],p.prototype,"png",2),h([u()],p.prototype,"wboxes",2),h([u()],p.prototype,"dims",2),h([u()],p.prototype,"orientation",2),h([u()],p.prototype,"previewWeather",2),h([u()],p.prototype,"zoom",2),h([u()],p.prototype,"selected",2),h([u()],p.prototype,"dragIdx",2),h([u()],p.prototype,"dragOverIdx",2),h([u()],p.prototype,"layoutName",2),h([u()],p.prototype,"live",2),h([u()],p.prototype,"wireframe",2),h([u()],p.prototype,"locked",2),h([u()],p.prototype,"status",2),h([u()],p.prototype,"tab",2),h([u()],p.prototype,"catalog",2),h([u()],p.prototype,"fwManifest",2),h([u()],p.prototype,"activePage",2),h([u()],p.prototype,"contentLayouts",2),h([u()],p.prototype,"contentScreensets",2),h([u()],p.prototype,"showAllContent",2),h([u()],p.prototype,"iconNames",2),h([u()],p.prototype,"installedIcons",2),h([u()],p.prototype,"iconThumbs",2),h([u()],p.prototype,"deviceIcons",2),h([u()],p.prototype,"iconCode",2),h([u()],p.prototype,"iconName",2),h([u()],p.prototype,"iconTargets",2),h([u()],p.prototype,"fonts",2),h([u()],p.prototype,"fontText",2),h([u()],p.prototype,"fontPngs",2),h([u()],p.prototype,"dirty",2),h([u()],p.prototype,"undoStack",2),h([u()],p.prototype,"redoStack",2),h([u()],p.prototype,"sectionsOpen",2),h([u()],p.prototype,"screenLayouts",2),h([u()],p.prototype,"screenDwell",2),h([u()],p.prototype,"screenTransition",2),h([u()],p.prototype,"screenPngs",2),h([u()],p.prototype,"screenIdx",2),h([u()],p.prototype,"screenOpacity",2),h([u()],p.prototype,"specText",2),h([u()],p.prototype,"editMode",2),h([u()],p.prototype,"specPng",2),h([u()],p.prototype,"specError",2);customElements.get("pimoroni-unicorn-panel")||customElements.define("pimoroni-unicorn-panel",p);export{p as PimoroniUnicornPanel};
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
