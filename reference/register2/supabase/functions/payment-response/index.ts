import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors={
  "Access-Control-Allow-Origin":"*",
  "Access-Control-Allow-Headers":"content-type",
  "Access-Control-Allow-Methods":"POST, OPTIONS"
};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{"Content-Type":"application/json",...cors}});

Deno.serve(async(req)=>{
  if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
  if(req.method!=="POST")return json({error:"Method not allowed. Use POST."},405);

  try{
    const contentType=req.headers.get("content-type")?.toLowerCase()||"";
    const fields:Record<string,unknown>={};
    if(contentType.includes("application/json")){
      const body=await req.json();
      if(!body||typeof body!=="object"||Array.isArray(body))return json({error:"Expected a JSON object."},400);
      Object.assign(fields,body);
    }else if(contentType.includes("multipart/form-data")||contentType.includes("application/x-www-form-urlencoded")){
      const form=await req.formData();
      for(const [key,value] of form.entries()){
        if(typeof value!=="string")return json({error:`${key} must be text.`},400);
        fields[key]=value;
      }
    }else{
      return json({error:"Use multipart/form-data, application/x-www-form-urlencoded, or application/json."},415);
    }

    const value=(...keys:string[])=>{
      for(const key of keys){
        const field=fields[key];
        if(typeof field==="string"&&field.trim())return field.trim();
        if(typeof field==="number"&&Number.isFinite(field))return String(field);
      }
      return "";
    };
    const email=value("Email","email").toLowerCase();
    const contact=value("Contact","contact");
    const day=value("Day","day");
    const transactionId=value("TransactionID","transaction_id","transactionId");
    const paymentStatus=value("PaymentStatus","payment_status","paymentStatus");
    const paymentDatetime=value("PaymentDatetime","payment_datetime","paymentDatetime");
    const paidAmountValue=value("PaidAmount","paid_amount","paidAmount");
    const transactionRefNo=value("TransactionRefNo","transaction_ref_no","transactionRefNo");

    if(!email||!contact||!day||!transactionId||!paymentStatus||!paymentDatetime||!paidAmountValue)
      return json({error:"Email, Contact, Day, TransactionID, PaymentStatus, PaymentDatetime, and PaidAmount are required."},400);
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return json({error:"Email must be valid."},400);
    const paidAmount=Number(paidAmountValue);
    if(!Number.isFinite(paidAmount)||paidAmount<0)return json({error:"PaidAmount must be a non-negative number."},400);
    const paymentDate=new Date(paymentDatetime);
    if(Number.isNaN(paymentDate.getTime()))return json({error:"PaymentDatetime must be a valid date/time."},400);

    const db=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const {data,error}=await db.from("payment_responses").upsert({
      email,
      contact,
      day,
      transaction_id:transactionId,
      payment_status:paymentStatus,
      payment_datetime:paymentDate.toISOString(),
      paid_amount:paidAmount,
      transaction_ref_no:transactionRefNo||null
    },{onConflict:"transaction_id"}).select("id,transaction_id").single();
    if(error)return json({error:"Unable to save payment response."},500);

    return json({success:true,id:data.id,transaction_id:data.transaction_id});
  }catch(error){
    return json({error:error instanceof Error?error.message:"Unexpected error"},500);
  }
});