import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors={
  "Access-Control-Allow-Origin":"*",
  "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":"GET, OPTIONS"
};
const json=(body:any,status=200)=>new Response(JSON.stringify(body),{status,headers:{"Content-Type":"application/json",...cors}});

Deno.serve(async(req)=>{
  if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
  if(req.method!=="GET")return json({error:"Method not allowed. Use GET."},405);

  try{
    const url=new URL(req.url);
    const email=(url.searchParams.get("email")||"").trim().toLowerCase();
    const requestedDay=(url.searchParams.get("day")||"").trim();
    const day=requestedDay.toUpperCase();
    const standardDays=["DAY_1","DAY_2","BOTH","SPECIAL"];
    const specialEventQuery=Boolean(day)&&!standardDays.includes(day);
    if(!email||!requestedDay)return json({error:"Email and day are required."},400);
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return json({error:"Enter a valid email address."},400);
    if(requestedDay.length>100)return json({error:"Day or special-event name is too long."},400);

    const db=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const {data:participant,error:participantError}=await db.from("participants")
      .select("id,email,name,phone,college,department")
      .eq("email",email)
      .maybeSingle();
    if(participantError)return json({error:"Unable to check participant."},500);
    if(!participant)return json({exists:false,day:specialEventQuery?requestedDay:day,registrations:[]});

    const matchingDays=day==="BOTH"?["DAY_1","DAY_2","BOTH"]:day==="DAY_1"?["DAY_1","BOTH"]:day==="DAY_2"?["DAY_2","BOTH"]:["SPECIAL"];
    const {data:registrations,error:registrationError}=await db.from("registrations")
      .select("id,selected_day")
      .eq("participant_id",participant.id)
      .in("selected_day",matchingDays)
      .order("created_at",{ascending:false});
    if(registrationError)return json({error:"Unable to check participant registration."},500);

    let rows=registrations||[];
    const specialEventFeeByRegistration=new Map<string,number>();
    const specialEventNameByRegistration=new Map<string,string>();
    if(specialEventQuery&&rows.length){
      const {data:eventLinks,error:eventLinkError}=await db.from("special_event_registrations")
        .select("registration_id,special_events(code,name,fee)")
        .in("registration_id",rows.map((registration:any)=>registration.id));
      if(eventLinkError)return json({error:"Unable to check special-event registration."},500);
      const matchingRegistrationIds=new Set<string>();
      for(const link of eventLinks||[]){
        const event=Array.isArray(link.special_events)?link.special_events[0]:link.special_events;
        if(!event||![String(event.code).trim().toUpperCase(),String(event.name).trim().toUpperCase()].includes(day))continue;
        matchingRegistrationIds.add(link.registration_id);
        specialEventFeeByRegistration.set(link.registration_id,Number(event.fee));
        specialEventNameByRegistration.set(link.registration_id,event.name);
      }
      rows=rows.filter((registration:any)=>matchingRegistrationIds.has(registration.id));
    }
    const {data:payments,error:paymentError}=rows.length
      ? await db.from("payments").select("registration_id,amount").in("registration_id",rows.map((registration:any)=>registration.id))
      : {data:[],error:null};
    if(paymentError)return json({error:"Unable to check registration fees."},500);
    const feeByRegistration=new Map((payments||[]).map((payment:any)=>[payment.registration_id,payment.amount]));
      const missingFees=rows.filter((registration:any)=>!feeByRegistration.has(registration.id)&&!specialEventFeeByRegistration.has(registration.id));
      const fallbackFeeByRegistration=new Map<string,number>();
      const missingStandardFees=missingFees.filter((registration:any)=>registration.selected_day!=="SPECIAL");
      if(missingStandardFees.length){
        const {data:configuredFees,error:configuredFeeError}=await db.from("registration_fees").select("day,amount");
        if(configuredFeeError)return json({error:"Unable to load configured registration fees."},500);
        const feeByDay=new Map<string,number>((configuredFees||[]).map((fee:any)=>[String(fee.day),Number(fee.amount)]));
        for(const registration of missingStandardFees){
          const fee=registration.selected_day==="BOTH"
            ? feeByDay.get("DAY_1")!==undefined&&feeByDay.get("DAY_2")!==undefined
              ? feeByDay.get("DAY_1")!+feeByDay.get("DAY_2")!
              : undefined
            : feeByDay.get(registration.selected_day);
          if(fee!==undefined)fallbackFeeByRegistration.set(registration.id,fee);
        }
      }
      const missingSpecialFees=missingFees.filter((registration:any)=>registration.selected_day==="SPECIAL");
      if(missingSpecialFees.length){
        const {data:eventLinks,error:eventFeeError}=await db.from("special_event_registrations")
          .select("registration_id,special_events(fee)")
          .in("registration_id",missingSpecialFees.map((registration:any)=>registration.id));
        if(eventFeeError)return json({error:"Unable to load special-event registration fees."},500);
        for(const link of eventLinks||[]){
          const event=Array.isArray(link.special_events)?link.special_events[0]:link.special_events;
          if(event?.fee===undefined||event?.fee===null)continue;
          fallbackFeeByRegistration.set(link.registration_id,(fallbackFeeByRegistration.get(link.registration_id)||0)+Number(event.fee));
        }
      }
    const matches=rows.map((registration:any)=>({
      email:participant.email,
      name:participant.name,
      phone:participant.phone,
      day:specialEventNameByRegistration.get(registration.id)??registration.selected_day,
      registration_fee:specialEventFeeByRegistration.get(registration.id)??feeByRegistration.get(registration.id)??fallbackFeeByRegistration.get(registration.id)??null,
      college:participant.college,
      dept:participant.department
    }));
    const coversBoth=rows.some((registration:any)=>registration.selected_day==="BOTH")||(
      rows.some((registration:any)=>registration.selected_day==="DAY_1")&&
      rows.some((registration:any)=>registration.selected_day==="DAY_2")
    );
    return json({exists:day==="BOTH"?coversBoth:matches.length>0,day:specialEventQuery?requestedDay:day,registrations:matches});
  }catch(error){
    return json({error:error instanceof Error?error.message:"Unexpected error"},500);
  }
});