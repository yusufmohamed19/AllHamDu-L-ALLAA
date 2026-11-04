// مزامنة سحابية: تسجيل دخول بجوجل + Firestore. أي تغيير بيتحفظ وبيظهر على كل جهاز مسجّل بنفس الحساب.
(function(){
const C=window.FIREBASE_CONFIG,btn=document.getElementById("cl");
if(!C||!C.apiKey){if(btn)btn.style.display="none";return}
let db,auth,uid=null,unsub=null,pt=null,ready=false;
const B="https://www.gstatic.com/firebasejs/10.12.2/",ld=u=>new Promise((r,j)=>{const s=document.createElement("script");s.src=B+u;s.onload=r;s.onerror=j;document.head.appendChild(s)});
const setBtn=()=>{btn.textContent=uid?"☁️ متزامن ✓":"☁️ تسجيل الدخول بجوجل"};
const norm=()=>{["pr","tk","ck","pl","days","cnt","az","tm","cal","ov","dd","qd","qf","qt"].forEach(f=>S[f]=S[f]||{});S.q=Object.assign({p:0,k:0,pend:0},S.q||{})};
function merge(a,b){const m=JSON.parse(JSON.stringify(a));
 ["pr","ck","pl","cnt","az","dd","days","tm","cal","ov","qd","qf","qt"].forEach(f=>{m[f]=m[f]||{};Object.keys(b[f]||{}).forEach(k=>{if(!(k in m[f]))m[f][k]=b[f][k]})});
 m.tk=m.tk||{};Object.keys(b.tk||{}).forEach(d=>{if(!m.tk[d]){m.tk[d]=b.tk[d];return}b.tk[d].forEach(t=>{const e=m.tk[d].find(x=>x.t===t.t);if(!e)m.tk[d].push(t);else if(t.x)e.x=1})});
 return m}
function apply(r){Object.keys(S).forEach(k=>delete S[k]);Object.assign(S,r);norm();
 try{localStorage.setItem("yawmi",JSON.stringify(S))}catch(e){}
 const mt=document.getElementById("mot");if(mt){mt.value=S.mot||"";if(window.grow)grow()}
 render()}
function push(){if(!uid||!db)return;clearTimeout(pt);pt=setTimeout(()=>{db.collection("users").doc(uid).set({s:JSON.stringify(S),t:S._t||Date.now()}).catch(()=>{})},1200)}
window.__push=push;
function start(u){const ref=db.collection("users").doc(u.uid);let first=localStorage.getItem("linked")!==u.uid;
 unsub=ref.onSnapshot(snap=>{if(snap.metadata.hasPendingWrites)return;
  const d=snap.data();if(!d||!d.s){S._t=Date.now();push();localStorage.setItem("linked",u.uid);first=false;return}
  let r;try{r=JSON.parse(d.s)}catch(e){return}const rt=d.t||0,lt=S._t||0;
  if(first){first=false;localStorage.setItem("linked",u.uid);
   const has=Object.keys(S.tk||{}).length||Object.keys(S.pr||{}).length||Object.keys(S.cnt||{}).length;
   const m=has?merge(rt>=lt?r:S,rt>=lt?S:r):r;m._t=Date.now();apply(m);push();toast("تم ربط حسابك ✅ بياناتك متزامنة");return}
  if(rt>lt){apply(r)}else if(rt<lt)push()})}
async function init(){if(ready)return;
 try{await ld("firebase-app-compat.js");await ld("firebase-auth-compat.js");await ld("firebase-firestore-compat.js")}catch(e){return}
 firebase.initializeApp(C);auth=firebase.auth();db=firebase.firestore();ready=true;
 auth.getRedirectResult().catch(()=>{});
 auth.onAuthStateChanged(u=>{uid=u?u.uid:null;setBtn();if(unsub){unsub();unsub=null}if(u)start(u)})}
btn.onclick=async()=>{
 if(uid){if(confirm("تسجيل الخروج؟ بياناتك محفوظة في حسابك وهترجع لما تسجل تاني.")){auth.signOut()}return}
 if(!ready){await init();if(!ready){toast("محتاج إنترنت لتسجيل الدخول");return}}
 const p=new firebase.auth.GoogleAuthProvider();
 auth.signInWithPopup(p).catch(e=>{if(e&&(e.code==="auth/popup-blocked"||e.code==="auth/operation-not-supported-in-this-environment"))auth.signInWithRedirect(p);else if(!e||e.code!=="auth/popup-closed-by-user")toast("تعذر تسجيل الدخول: "+(e&&e.code||""))})};
window.addEventListener("online",()=>{if(!ready)init();else push()});
setBtn();init();
})();
