import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/dashboard/:path*", "/documents/:path*", "/assistant/:path*", "/decision/:path*", "/situations/:path*", "/portfolio/:path*", "/history/:path*", "/mon-ecole/:path*", "/generateur/:path*", "/verification/:path*", "/equipe/:path*", "/parametres/:path*"],
};
