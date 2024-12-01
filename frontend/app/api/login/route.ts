import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

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
  return sid;
}

export async function GET(req: Request) {
  const sql = neon(process.env.DATABASE_URL ?? '');
  let data = null;
  const { searchParams } = new URL(req.url);
  const branch_id = searchParams.get('branch_id');
  const password_hash = searchParams.get('password_hash');

  let branch = null;
  try{ 
    data = await sql`select * from Branch WHERE branch_id=${branch_id} AND password_hash=${password_hash};`;
    if(data.length === 1){
      branch = data[0];
    } else {
      return NextResponse.json({
        error: true,
        message : 'Invalid credentials',
      }, {status: 401})
    }
  } catch(err : unknown){
    return NextResponse.json({
      error: true,
      message: err ?? 'Invalid Query',
    }, { status: 400 });
  }

  const token = create_token();
  try{
    await sql("DELETE FROM Token WHERE for_id=$1", [branch_id]);
    await sql("INSERT INTO Token VALUES ($1, $2, $3)", [token, branch_id, true]);
    return NextResponse.json({
      data : branch,
      token,
    });
  } catch(err : unknown){
    console.log("AMEY_ERROR", err);
    return NextResponse.json({
      error: true,
      message: err ?? 'Server Error',
    }, { status: 500 });
  }
}