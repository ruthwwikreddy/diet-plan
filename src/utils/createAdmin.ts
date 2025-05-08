
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const createAdminUser = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('create-admin', {
      method: 'POST',
    });
    
    if (error) {
      console.error("Error invoking create-admin function:", error);
      return;
    }
    
    console.log("Create admin response:", data);
  } catch (error) {
    console.error("Failed to create admin user:", error);
  }
};
