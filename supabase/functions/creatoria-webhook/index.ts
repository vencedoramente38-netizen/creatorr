import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  console.log('--- CREATORIA WEBHOOK v1 ---');

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

    if (!email) throw new Error("Payload missing customer email");

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

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

    const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    let authUser = listData.users.find((u: any) => u.email?.toLowerCase() === email);
    let generatedPassword = null;

    if (!authUser) {
      generatedPassword = "Creatoria@" + Math.random().toString(36).slice(-6).toUpperCase();
      const { data: newData, error: createError } = await supabase.auth.admin.createUser({
        email,
        password: generatedPassword,
        email_confirm: true,
        user_metadata: { name }
      });
      if (createError) throw createError;
      authUser = newData.user;
    }

    await supabase.from('profiles').upsert({
      user_id: authUser.id,
      email,
      name,
      plan,
      access_until: accessUntil,
      created_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

    const resendKey = Deno.env.get('RESEND_API_KEY');
    const fromEmail = 'suporte123@creatoria.com.br';
    
    if (resendKey) {
      const passwordInfo = generatedPassword 
        ? `<p style="margin: 8px 0; font-size: 15px;"><b>Senha Temporária:</b> <span style="color: #E81C3E; font-family: monospace; background: #fff; padding: 2px 6px; border-radius: 4px; border: 1px solid #eee;">${generatedPassword}</span></p>`
        : '<p style="margin: 8px 0; font-size: 15px; color: #666;"><i>Use sua senha cadastrada anteriormente.</i></p>';

      const expirationInfo = accessUntil 
        ? '<p style="margin: 8px 0; font-size: 15px;"><b>Expiração:</b> ' + new Date(accessUntil).toLocaleDateString('pt-BR') + '</p>'
        : '';

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
          html: 
            '<div style="font-family: sans-serif; color: #111; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 30px; border-radius: 16px; background: #ffffff;">' +
              '<div style="text-align: center; margin-bottom: 25px;">' +
                '<h1 style="color: #E81C3E; margin: 0; font-size: 28px; letter-spacing: -1px;">CREATORIA</h1>' +
              '</div>' +
              '<h2 style="color: #111; font-size: 22px;">Tudo pronto, ' + name + '!</h2>' +
              '<div style="background: #f9f9f9; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #f0f0f0;">' +
                '<p style="margin: 8px 0; font-size: 15px;"><b>E-mail:</b> <span style="color: #E81C3E;">' + email + '</span></p>' +
                passwordInfo +
                '<p style="margin: 8px 0; font-size: 15px;"><b>Plano Liberado:</b> ' + planLabel + '</p>' +
                expirationInfo +
              '</div>' +
              '<div style="text-align: center; margin-top: 30px;">' +
                '<a href="https://creatorlabai.vercel.app" style="display: inline-block; background: #E81C3E; color: #fff; padding: 18px 40px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px;">ENTRAR NA PLATAFORMA</a>' +
              '</div>' +
            '</div>'
        }),
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }
});
