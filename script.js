
const KEY = "ttcMeetups";

function loadMeetups(){
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch(e){ return []; }
}
function saveMeetups(items){ localStorage.setItem(KEY, JSON.stringify(items)); }

function renderMeetups(){
  const host = document.querySelector("#meetup-list");
  if(!host) return;
  const items = loadMeetups();
  if(!items.length){
    host.innerHTML = `<div class="empty-state full">No meetups posted yet. Add a show below and it will stay saved in this browser.</div>`;
    return;
  }
  host.innerHTML = items.map((m,i)=>`
    <article class="card">
      <div class="kicker">${escapeHtml(m.date || "Date TBA")}</div>
      <h3 class="band">${escapeHtml(m.show || "Show Meetup")}</h3>
      <p class="meta">${escapeHtml(m.venue || "Venue TBA")}<br>${escapeHtml(m.details || "")}</p>
      <div class="actions">
        ${m.link ? `<a class="btn primary" target="_blank" rel="noopener" href="${safeUrl(m.link)}">Show / Tickets</a>` : ""}
        <button class="btn" onclick="removeMeetup(${i})">Remove</button>
      </div>
    </article>`).join("");
}
function safeUrl(u){
  try{
    const x = new URL(u);
    return ['http:','https:'].includes(x.protocol) ? x.href : '#';
  }catch(e){ return '#'; }
}
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function removeMeetup(i){
  const items=loadMeetups(); items.splice(i,1); saveMeetups(items); renderMeetups();
}
document.addEventListener("DOMContentLoaded",()=>{
  renderMeetups();
  const form=document.querySelector("#meetup-form");
  if(form){
    form.addEventListener("submit",e=>{
      e.preventDefault();
      const data=Object.fromEntries(new FormData(form).entries());
      const items=loadMeetups();
      items.unshift(data); saveMeetups(items); form.reset(); renderMeetups();
    });
  }
});
