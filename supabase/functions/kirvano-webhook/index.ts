import { createClient } from "@supabase/supabase-js";

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  console.log('--- CREATORIA WEBHOOK V10 START ---');

  try {
    const body = await req.json();
    console.log("Event:", body.event);

    if (body.event !== "SALE_APPROVED") {
      return new Response(JSON.stringify({ ok: true, message: "Event ignored" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const email = body.customer?.email?.toLowerCase().trim();
    const name = body.customer?.name || "Cliente";

    if (!email) {
      throw new Error("Payload missing customer email");
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Plans Configuration
    const PRODUCT_30_DAYS = "be413212-1728-4b4a-bd04-45d02f62125f";
    const PRODUCT_VITALICIO = "59a5b1d0-fc5a-4ae2-b77b-95fa30b0657c";

    let plan = "free";
    let accessUntil: string | null = null;
    let planLabel = "Gratuito";

    const products = body.products || [];
    const hasVitalicio = products.some((p: any) => p.id === PRODUCT_VITALICIO);
    const has30Days = products.some((p: any) => p.id === PRODUCT_30_DAYS);

    if (hasVitalicio) {
      plan = "vitalicio";
      planLabel = "Vitalício";
    } else if (has30Days) {
      plan = "mensal";
      planLabel = "Mensal (30 dias)";
      const d = new Date();
      d.setDate(d.getDate() + 30);
      accessUntil = d.toISOString();
    }

    console.log(`Processing ${email} for plan ${planLabel}`);

    // 1. Auth & Profile
    const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    let authUser = listData.users.find((u: any) => u.email?.toLowerCase() === email);
    let generatedPassword = null;

    if (!authUser) {
      console.log("Creating new user...");
      generatedPassword = "Creatoria@" + Math.random().toString(36).slice(-6).toUpperCase();
      const { data: newData, error: createError } = await supabase.auth.admin.createUser({
        email,
        password: generatedPassword,
        email_confirm: true,
        user_metadata: { name }
      });
      if (createError) throw createError;
      if (!newData.user) throw new Error("Failed to create user object");
      authUser = newData.user;
    }

    if (!authUser || !authUser.id) {
      throw new Error("Could not identify user after creation/lookup");
    }

    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        user_id: authUser.id,
        email,
        name,
        plan,
        access_until: accessUntil,
        created_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (upsertError) throw upsertError;
    console.log("Profile updated successfully");

    // 2. Welcome Email
    const resendKey = Deno.env.get('RESEND_API_KEY');
    let emailStatus = "skipped (no key)";
    const fromEmail = 'suporte123@creatoria.com.br';
    
    if (resendKey) {
      try {
        const passwordInfo = generatedPassword 
          ? '<p style="margin: 8px 0; font-size: 15px;"><b>Senha Temporária:</b> <span style="color: #E81C3E; font-family: monospace; background: #fff; padding: 2px 6px; border-radius: 4px; border: 1px solid #eee;">' + generatedPassword + '</span></p>'
          : '<p style="margin: 8px 0; font-size: 15px; color: #666;"><i>Use sua senha cadastrada anteriormente.</i></p>';

        const expirationInfo = accessUntil 
          ? '<p style="margin: 8px 0; font-size: 15px;"><b>Expiração:</b> ' + new Date(accessUntil).toLocaleDateString('pt-BR') + '</p>'
          : '';

        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + resendKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Creatoria 🚀 <' + fromEmail + '>',
            to: [email],
            subject: 'Acesso Liberado: Creatoria 🚀',
            html: 
              '<div style="font-family: \'Inter\', sans-serif; color: #111; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 30px; border-radius: 16px; background: #ffffff;">' +
                '<div style="text-align: center; margin-bottom: 25px;">' +
                  '<h1 style="color: #E81C3E; margin: 0; font-size: 28px; letter-spacing: -1px;">CREATORIA</h1>' +
                  '<p style="color: #666; margin-top: 5px;">A plataforma definitiva para criadores.</p>' +
                '</div>' +
                '<h2 style="color: #111; font-size: 22px;">Tudo pronto, ' + name + '!</h2>' +
                '<p style="font-size: 16px; line-height: 1.6; color: #444;">Seu acesso à plataforma foi liberado com sucesso. Use as credenciais abaixo para entrar:</p>' +
                '<div style="background: #f9f9f9; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #f0f0f0;">' +
                  '<p style="margin: 8px 0; font-size: 15px;"><b>E-mail:</b> <span style="color: #E81C3E;">' + email + '</span></p>' +
                  passwordInfo +
                  '<p style="margin: 8px 0; font-size: 15px;"><b>Plano Liberado:</b> ' + planLabel + '</p>' +
                  expirationInfo +
                '</div>' +
                '<div style="text-align: center; margin-top: 30px;">' +
                  '<a href="https://creator.vercel.app" style="display: inline-block; background: #E81C3E; color: #fff; padding: 18px 40px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(232, 28, 62, 0.2);">ENTRAR NA PLATAFORMA</a>' +
                '</div>' +
                '<hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">' +
                '<p style="font-size: 13px; color: #888; text-align: center;">Este é um e-mail automático. Por favor, não responda.</p>' +
              '</div>'
          }),
        });
        
        const resData = await res.json();
        emailStatus = res.ok ? "sent" : `failed: ${JSON.stringify(resData)}`;
        console.log("Email result:", emailStatus);
      } catch (e: any) {
        emailStatus = `error: ${e.message}`;
        console.error("Email error:", e);
      }
    }

    return new Response(JSON.stringify({ ok: true, emailStatus, fromEmail, plan }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (err: any) {
    console.error("Critical Error:", err.message);
    return new Response(JSON.stringify({ ok: false, error: err.message, emailStatus: "errored" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }
});

