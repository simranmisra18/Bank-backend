import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import md5 from "md5";

const create_token = () => {
  const letters = []
  for(let i=0;i<26;i++){
      letters.push(String.fromCharCode('a'.charCodeAt(0) + i));
  }
  for(let i=0;i<9;i++){
      letters.push(String(i));
  }

  let numid = Date.now();
  const id_l = [];
  const n = letters.length;
  while(numid > 0){
      id_l.push(letters[numid % n]);
      numid = Math.floor(numid / n);
  }
  numid = Math.floor(1e9 * Math.random());
  console.log(numid);
  while(numid > 0){
      id_l.push(letters[numid % n]);
      numid = Math.floor(numid / n);
  }
  let sid = "";
  let c = 0;
  for(const s of id_l){
      c++;
      if(c === 4){
          c = 0;
          sid += '-';
      }
      sid += s;
  }
  return sid.slice(10);
}

export async function POST(req: Request) {
  const body = await req.json();
  const sql = neon(process.env.DATABASE_URL ?? '');
  const count = Number((await sql`SELECT COUNT(*) FROM Customers`)[0].count);
  const user_id = create_token();
  const query = `INSERT INTO CUSTOMERS (customer_id, password_hash, first_name, middle_name, last_name, loc, pinCode, st, credit_limit, credit_usage, credit_score, registration_time, branch_id, balance) VALUES ('${user_id}','${md5(body.password)}','${body.first_name}','${body.middle_name}','${body.last_name}','${body.loc}',${body.pinCode},'${body.st}',0,0,0,'${new Date().toISOString()}','${body.branch_id}',0);`
  try{
    await sql(query);
    return NextResponse.json({id : user_id});
  } catch(err){
    return NextResponse.json({err, message: 'Invalid Request'}, {status: 400});
  }

//   await sql(`INSERT INTO Customers 
//     (customer_id, password_hash, first_name, middle_name, last_name, loc, pinCode, st, credit_limit, credit_usage, credit_score, registration_time, branch_id, balance) VALUES
//     ('CUST001', '5f4dcc3b5aa765d61d8327deb882cf99', 'John', 'A.', 'Doe', '123 Elm Street, Springfield', 62701, 'AZ', 10000.00, 2000.50, 720, '2023-05-15 14:30:00', 'the-main-branch', 5000.75),
// `)
  console.log({body, count});
  return NextResponse.json({query});
  // let data = null;
  // const { searchParams } = new URL(req.url);
  // const branch_id = searchParams.get('branch_id');
  // const password_hash = searchParams.get('password_hash');

  // let branch = null;
  // try{ 
  //   data = await sql`select * from Branch WHERE branch_id=${branch_id} AND password_hash=${password_hash};`;
  //   if(data.length === 1){
  //     branch = data[0];
  //   } else {
  //     return NextResponse.json({
  //       error: true,
  //       message : 'Invalid credentials',
  //     }, {status: 401})
  //   }
  // } catch(err : unknown){
  //   return NextResponse.json({
  //     error: true,
  //     message: err ?? 'Invalid Query',
  //   }, { status: 400 });
  // }

  // const token = create_token();
  // try{
  //   await sql("DELETE FROM Token WHERE for_id=$1", [branch_id]);
  //   await sql("INSERT INTO Token VALUES ($1, $2, $3)", [token, branch_id, true]);
  //   return NextResponse.json({
  //     data : branch,
  //     token,
  //   });
  // } catch(err : unknown){
  //   console.log("AMEY_ERROR", err);
  //   return NextResponse.json({
  //     error: true,
  //     message: err ?? 'Server Error',
  //   }, { status: 500 });
  // }
}