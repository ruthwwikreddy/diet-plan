
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if admin user already exists
    const { data: existingUsers, error: searchError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", "admin@example.com")
      .maybeSingle();

    if (searchError) {
      throw searchError;
    }

    if (existingUsers) {
      return new Response(
        JSON.stringify({ message: "Admin user already exists" }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Create admin user in auth.users
    const { data: authUser, error: signupError } = await supabaseAdmin.auth.admin.createUser({
      email: "admin@example.com",
      password: "admin",
      email_confirm: true,
      user_metadata: {
        name: "Admin",
        role: "trainer"
      }
    });

    if (signupError) {
      throw signupError;
    }

    console.log("Admin user created:", authUser.user);

    return new Response(
      JSON.stringify({ message: "Admin user created successfully" }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error creating admin user:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
