// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export async function GET() {
//   const session = await getServerSession(authOptions);

//   const headers: Record<string, string> = {};
//   if (session?.accessToken) {
//     headers["Authorization"] = `Bearer ${session.accessToken}`;
//   }

//   const response = await fetch("http://localhost:8000/api/v1/products/", {
//     headers,
//     cache: "no-store",
//   });

//   if (!response.ok) {
//     return NextResponse.json(
//       { error: "Não foi possível carregar os produtos" },
//       { status: response.status },
//     );
//   }

//   const data = await response.json();

//   return NextResponse.json(data.results ?? data);
// }
