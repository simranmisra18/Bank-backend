import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(req: Request) {
  const sql = neon(process.env.DATABASE_URL ?? '');
  const { searchParams } = new URL(req.url);
  const offset = Number(searchParams.get('offset')) ?? 0;
  const branchid = searchParams.get('branchid');
  if(!branchid){
    return NextResponse.json({error : true, message: 'invalid params'}, {status : 400});
  }
  const count = (await sql`SELECT COUNT(*) FROM Customers WHERE branch_id='the-main-branch'`)?.[0]?.count;
  const data = await sql(`SELECT customer_id, first_name, middle_name, last_name, pincode, credit_limit, credit_usage, credit_score, balance, registration_time from Customers where branch_id='${branchid}' order by registration_time DESC offset ${offset} limit 5`);
  return NextResponse.json({
    count, data, offset
  });
}