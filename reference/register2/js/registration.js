
const $=selector=>document.querySelector(selector);
const form=$("#registrationForm"),alertBox=$("#alert"),btn=$("#submitBtn");
let fees={DAY_1:0,DAY_2:0};
let specialEvents=[];
let activeEvents=[];
let eventsReady=false;
function alertMsg(message,type="error"){alertBox.className=`alert show ${type}`;alertBox.textContent=message;showFeedback(type==="success"?"Registration submitted":"Registration failed",message,type)}
function escapeHtml(value){return String(value??"").replace(/[&<>"']/g,character=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[character]))}
function updateFee(){const day=$("input[name='day']:checked")?.value;if(!day)return;const amount=day==="BOTH"?fees.DAY_1+fees.DAY_2:day==="SPECIAL"?[...document.querySelectorAll("input[name='special_event']:checked")].reduce((sum,input)=>sum+Number(input.dataset.fee||0),0):fees[day];$("#fee").textContent=`₹${amount.toFixed(2)}`}
function updateEventChoices(){const day=$("input[name='day']:checked")?.value;$("#eventChoices").hidden=!day||day==="SPECIAL";$("#day1Events").hidden=!(day==="DAY_1"||day==="BOTH");$("#day2Events").hidden=!(day==="DAY_2"||day==="BOTH");$("#specialEvents").hidden=day!=="SPECIAL";updateFee()}
function renderEvents(){for(const day of ["DAY_1","DAY_2"]){const target=$(day==="DAY_1"?"#day1Events .event-list":"#day2Events .event-list");const events=activeEvents.filter(event=>event.day===day);target.innerHTML=events.map(event=>`<label class="event-option"><input type="checkbox" name="selected_event" value="${escapeHtml(event.id)}" data-day="${day}"><span><strong>${escapeHtml(event.code)} · ${escapeHtml(event.name)}</strong><small>${escapeHtml(event.event_type||"Event")}</small></span></label>`).join("")||"<p class='notice'>No events are currently available for this day.</p>"}}
document.querySelectorAll("input[name='day']").forEach(input=>input.addEventListener("change",updateEventChoices));
fetch(`${CS_CONFIG.SUPABASE_URL}/functions/v1/get-registration-fees`,{headers:{Authorization:`Bearer ${CS_CONFIG.SUPABASE_ANON_KEY}`}}).then(async response=>{const data=await response.json();if(!response.ok)throw new Error(data.error||"Unable to load registration fees.");return data}).then(data=>{fees={DAY_1:Number(data.DAY_1||0),DAY_2:Number(data.DAY_2||0)};updateFee()}).catch(()=>alertMsg("Registration fees are temporarily unavailable."));
fetch(`${CS_CONFIG.SUPABASE_URL}/rest/v1/events?select=id,code,name,day,event_type,status&status=eq.ACTIVE&order=day,code`,{headers:{apikey:CS_CONFIG.SUPABASE_ANON_KEY,Authorization:`Bearer ${CS_CONFIG.SUPABASE_ANON_KEY}`}}).then(async response=>{const data=await response.json();if(!response.ok)throw new Error(data.message||"Unable to load events.");return data}).then(data=>{activeEvents=Array.isArray(data)?data:[];renderEvents();eventsReady=true}).catch(()=>alertMsg("Events are temporarily unavailable. Please try again later."));
fetch(`${CS_CONFIG.SUPABASE_URL}/rest/v1/rpc/get_special_events`,{method:"POST",headers:{apikey:CS_CONFIG.SUPABASE_ANON_KEY,Authorization:`Bearer ${CS_CONFIG.SUPABASE_ANON_KEY}`}}).then(response=>response.json()).then(data=>{specialEvents=Array.isArray(data)?data:[];$("#specialEvents").innerHTML=specialEvents.map(event=>`<label class="event"><input type="checkbox" name="special_event" value="${escapeHtml(event.code)}" data-fee="${Number(event.fee)||0}"><strong>${escapeHtml(event.code)} · ${escapeHtml(event.name)}</strong><small>${escapeHtml(event.description||"Special event")} · ₹${Number(event.fee).toFixed(2)}</small></label>`).join("");document.querySelectorAll("input[name='special_event']").forEach(input=>input.addEventListener("change",updateFee))}).catch(()=>{});
form.addEventListener("submit",async event=>{
 event.preventDefault();alertBox.className="alert";const day=$("input[name='day']:checked")?.value;
 if(!day)return alertMsg("Please select a registration option.");
 if(day!=="SPECIAL"&&!eventsReady)return alertMsg("Events are still loading. Please try again.");
 const selectedEventIds=[...document.querySelectorAll("input[name='selected_event']:checked")].filter(input=>day==="BOTH"||input.dataset.day===day).map(input=>input.value);
 const selectedDays=day==="BOTH"?["DAY_1","DAY_2"]:day==="SPECIAL"?[]:[day];
 if(day!=="SPECIAL"&&selectedDays.some(selectedDay=>!selectedEventIds.some(id=>activeEvents.some(event=>event.id===id&&event.day===selectedDay))))return alertMsg("Please select at least one event for each selected day.");
 const selectedSpecialEvents=[...document.querySelectorAll("input[name='special_event']:checked")].map(input=>input.value);
 if(day==="SPECIAL"&&!selectedSpecialEvents.length)return alertMsg("Please select at least one special event.");
 btn.disabled=true;btn.textContent="Submitting...";
 try{
  const fields=new FormData();["name","email","phone","college","department","year"].forEach(id=>fields.append(id,$("#"+id).value.trim()));
  fields.append("selected_day",day);fields.append("selected_event_ids",JSON.stringify(selectedEventIds));fields.append("special_event_codes",JSON.stringify(selectedSpecialEvents));
  const response=await fetch(`${CS_CONFIG.SUPABASE_URL}/functions/v1/public-register`,{method:"POST",headers:{Authorization:`Bearer ${CS_CONFIG.SUPABASE_ANON_KEY}`},body:fields});
  const data=await response.json();if(!response.ok)throw new Error(data.error||"Registration failed.");
  localStorage.setItem("cs_last_registration",JSON.stringify({code:data.registration_code,email:$("#email").value.trim(),phone:$("#phone").value.trim()}));
  const externalFields=new FormData();externalFields.append("email",$("#email").value.trim());externalFields.append("day",day);externalFields.append("registration_fee",String(data.registration_fee));
  const externalForm=document.createElement("form");externalForm.method="POST";externalForm.action="https://apps.veltech.edu.in/clique/CybersentinelProcess";externalForm.enctype="multipart/form-data";
  for(const [name,value] of externalFields.entries()){const input=document.createElement("input");input.type="hidden";input.name=name;input.value=String(value);externalForm.append(input)}
  document.body.append(externalForm);externalForm.submit();
 }catch(error){alertMsg(error.message)}finally{btn.disabled=false;btn.textContent="Submit Registration"}
});
