import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

    console.log('--- KIRVANO WEBHOOK V3 (RESEND) START ---');
    try {
        const body = await req.json();
        console.log("Payload:", JSON.stringify(body, null, 2));

        // Validação do evento
        if (body.event !== "SALE_APPROVED") {
            return new Response(JSON.stringify({ ok: true, message: "Ignored event" }), {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const email = body.customer?.email;
        const name = body.customer?.name || "Cliente";

        if (!email) {
            return new Response(JSON.stringify({ ok: false, error: 'No email found' }), {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        );

        // Mapeamento de Produtos para Acesso
        const PRODUCT_30_DAYS = "be413212-1728-4b4a-bd04-45d02f62125f";
        const PRODUCT_VITALICIO = "59a5b1d0-fc5a-4ae2-b77b-95fa30b0657c";

        let plan = "free";
        let accessUntil: string | null = null;
        let planLabel = "Gratuito";

        const hasVitalicio = body.products?.some((p: any) => p.id === PRODUCT_VITALICIO);
        const has30Days = body.products?.some((p: any) => p.id === PRODUCT_30_DAYS);

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

        // 1. Database Logic: Auth & Profile
        console.log(`Processing access for ${email}...`);

        // Buscar usuário
        const { data: { users }, error: searchError } = await supabase.auth.admin.listUsers();
        let authUser = users.find(u => u.email === email);

        if (!authUser) {
            console.log("Creating new user...");
            const tempPass = "CreatorLab@" + Math.floor(1000 + Math.random() * 9000);
            const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
                email,
                password: tempPass,
                email_confirm: true,
                user_metadata: { name }
            });
            if (createError) throw createError;
            authUser = newUser.user;
        }

        // Upsert profile no banco
        const { error: upsertError } = await supabase.from('profiles').upsert({
            user_id: authUser.id,
            email,
            name,
            plan,
            access_until: accessUntil,
            created_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

        if (upsertError) throw upsertError;
        console.log("Profile updated successfully.");

        // 2. Direct Resend Fetch
        const resendKey = Deno.env.get('RESEND_API_KEY');
        if (resendKey) {
            console.log('Sending email via Resend...');
            const fromEmail = Deno.env.get('FROM_EMAIL') || 'contato@tiktoksync.com.br';
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            try {
                const res = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${resendKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        from: `Creator Lab <${fromEmail}>`,
                        to: [email],
                        subject: 'Acesso Liberado: Creator Lab 🚀',
                        html: `
              <div style="font-family: sans-serif; color: #111; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 12px;">
                <h2 style="color: #E81C3E;">Tudo pronto, ${name}!</h2>
                <p>Seu acesso ao <b>Creator Lab</b> foi liberado com sucesso.</p>
                <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 5px 0;"><b>Plano Liberado:</b> ${planLabel}</p>
                  ${accessUntil ? `<p style="margin: 5px 0;"><b>Expiração:</b> ${new Date(accessUntil).toLocaleDateString('pt-BR')}</p>` : ''}
                </div>
                <p>Use seu e-mail <b>${email}</b> para entrar na plataforma.</p>
                <p>Caso seja seu primeiro acesso, clique em "Esqueci minha senha" para criar sua senha de acesso.</p>
                <br>
                <a href="https://creatoria.vercel.app" style="display: block; text-align: center; background: #E81C3E; color: #fff; padding: 16px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">ENTRAR NO CREATOR LAB</a>
              </div>
            `,
                    }),
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);
                console.log('Resend response status:', res.status);
            } catch (e) {
                console.log('Resend error:', e.message);
            }
        }

        return new Response(JSON.stringify({ ok: true, email, plan }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (err) {
        console.log('Critical Error:', err.message);
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
