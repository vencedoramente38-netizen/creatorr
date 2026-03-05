import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  console.log('--- CREATORIA WEBHOOK v2 (Refactored) ---');

  try {
    const body = await req.json();
    console.log("Processing event:", body.event);

    if (body.event !== "SALE_APPROVED") {
      return new Response(JSON.stringify({ ok: true, message: "Event ignored" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const email = body.customer?.email?.toLowerCase().trim();
    const name = body.customer?.name || "Cliente";

    if (!email) throw new Error("Payload missing customer email");

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Product IDs from Kirvano
    const PRODUCT_30_DAYS = "be413212-1728-4b4a-bd04-45d02f62125f";
    const PRODUCT_VITALICIO = "59a5b1d0-fc5a-4ae2-b77b-95fa30b0657c";

    let plan = "free";
    let accessUntil: string | null = null;
    let planLabel = "Gratuito";

    // Detect plan from products array or singular product object
    const products = body.products || (body.product ? [body.product] : []);
    const hasVitalicio = products.some((p: any) => p.id === PRODUCT_VITALICIO);
    const has30Days = products.some((p: any) => p.id === PRODUCT_30_DAYS);

    if (hasVitalicio) {
      plan = "vitalicio";
      planLabel = "Vitalício 💎";
    } else if (has30Days) {
      plan = "mensal";
      planLabel = "Mensal (30 dias) ⚡";
      const d = new Date();
      d.setDate(d.getDate() + 30);
      accessUntil = d.toISOString();
    }

    console.log(`Plan identified: ${planLabel} for ${email}`);

    // Direct user lookup (more reliable than listUsers)
    let authUser = null;
    const { data: userData, error: getError } = await supabase.auth.admin.getUserByEmail(email);
    
    if (getError || !userData?.user) {
      console.log("User not found, creating new account...");
      const generatedPassword = "Creatoria@" + Math.random().toString(36).slice(-6).toUpperCase();
      
      const { data: newData, error: createError } = await supabase.auth.admin.createUser({
        email,
        password: generatedPassword,
        email_confirm: true,
        user_metadata: { name }
      });

      if (createError) throw createError;
      authUser = newData.user;
      (authUser as any).generated_pw = generatedPassword;
    } else {
      console.log("Existing user found.");
      authUser = userData.user;
    }

    if (!authUser) throw new Error("Failed to identify or create user.");

    // Update Profile
    const { error: upsertError } = await supabase.from('profiles').upsert({
      user_id: authUser.id,
      email,
      name,
      plan,
      access_until: accessUntil,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

    if (upsertError) throw upsertError;

    // Send Email via Resend
    const resendKey = Deno.env.get('RESEND_API_KEY');
    const fromEmail = 'suporte123@creatoria.com.br';
    const loginUrl = 'https://creatoria.vercel.app'; // Updated Branding URL
    
    if (resendKey) {
      const generatedPassword = (authUser as any).generated_pw;
      const passwordInfo = generatedPassword 
        ? `<p style="margin: 8px 0; font-size: 15px;"><b>Senha Temporária:</b> <span style="color: #E81C3E; font-family: monospace; background: #fff; padding: 2px 6px; border-radius: 4px; border: 1px solid #eee;">${generatedPassword}</span></p>`
        : '<p style="margin: 8px 0; font-size: 15px; color: #666;"><i>Use sua senha cadastrada anteriormente.</i></p>';

      const expirationInfo = accessUntil 
        ? `<p style="margin: 8px 0; font-size: 15px;"><b>Expiração:</b> ${new Date(accessUntil).toLocaleDateString('pt-BR')}</p>`
        : '';

      const emailHtml = `
        <div style="font-family: sans-serif; color: #111; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 30px; border-radius: 16px; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #E81C3E; margin: 0; font-size: 28px; letter-spacing: -1px;">CREATORIA</h1>
            <p style="color: #666; font-size: 14px; margin-top: 4px;">Sua jornada épica começa agora</p>
          </div>
          <h2 style="color: #111; font-size: 22px;">Tudo pronto, ${name}!</h2>
          <p style="font-size: 16px; line-height: 1.5; color: #444;">O seu acesso à Creatoria foi liberado com sucesso. Prepare-se para elevar o nível das suas criações.</p>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #f0f0f0;">
            <p style="margin: 8px 0; font-size: 15px;"><b>E-mail:</b> <span style="color: #E81C3E;">${email}</span></p>
            ${passwordInfo}
            <p style="margin: 8px 0; font-size: 15px;"><b>Plano Liberado:</b> ${planLabel}</p>
            ${expirationInfo}
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="${loginUrl}" style="display: inline-block; background: #E81C3E; color: #fff; padding: 18px 40px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(232, 28, 62, 0.2);">ACESSAR PLATAFORMA</a>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">Este e-mail foi enviado automaticamente pela Creatoria. Se você tiver algum problema, entre em contato com nosso suporte.</p>
        </div>
      `;

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `Creatoria 🚀 <${fromEmail}>`,
          to: [email],
          subject: 'Acesso Liberado: Creatoria 🚀',
          html: emailHtml
        }),
      });
    }

    return new Response(JSON.stringify({ ok: true, plan }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400, // Important to show error in webhook logs
    });
  }
});
