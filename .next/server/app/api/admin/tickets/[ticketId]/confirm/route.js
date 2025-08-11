"use strict";(()=>{var e={};e.id=7033,e.ids=[7033],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},61282:e=>{e.exports=require("child_process")},84770:e=>{e.exports=require("crypto")},80665:e=>{e.exports=require("dns")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},76162:e=>{e.exports=require("stream")},82452:e=>{e.exports=require("tls")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},71568:e=>{e.exports=require("zlib")},92069:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>f,patchFetch:()=>x,requestAsyncStorage:()=>m,routeModule:()=>c,serverHooks:()=>g,staticGenerationAsyncStorage:()=>u});var a={};t.r(a),t.d(a,{PUT:()=>l});var o=t(70101),i=t(90796),n=t(83055),s=t(12903),d=t(68364),p=t(59780);async function l(e,{params:r}){try{let e=parseInt(r.ticketId);if(isNaN(e))return s.NextResponse.json({error:"Invalid ticket ID"},{status:400});let t=await d._.$transaction(async r=>{let t=await r.ticket.findUnique({where:{id:e},include:{raffle:{select:{id:!0,title:!0}}}});if(!t)throw Error("Ticket not found");if("confirmed"===t.paymentStatus)throw Error("Ticket already confirmed");let a=await r.ticket.update({where:{id:e},data:{paymentStatus:"confirmed",confirmedAt:new Date},include:{raffle:{select:{id:!0,title:!0}}}}),o=await r.ticket.count({where:{raffleId:a.raffleId,paymentStatus:"confirmed"}});return await r.raffle.update({where:{id:a.raffleId},data:{soldTickets:o}}),{success:!0,ticket:a}});try{let e=t.ticket;await p.y.sendPaymentConfirmation({buyerName:e.buyerName,buyerEmail:e.buyerEmail,raffleTitle:e.raffle.title,ticketNumbers:[e.ticketNumber],totalAmount:Number(e.amountPaid),paymentMethod:e.paymentMethod})}catch(e){console.error("Error sending payment confirmation email:",e)}try{let e=t.ticket;await p.y.sendAdminNotification("Pago Confirmado",`
        <h3>Pago confirmado:</h3>
        <ul>
          <li><strong>Usuario:</strong> ${e.buyerName} (${e.buyerEmail})</li>
          <li><strong>Rifa:</strong> ${e.raffle.title}</li>
          <li><strong>Boleto:</strong> #${e.ticketNumber.toString().padStart(4,"0")}</li>
          <li><strong>M\xe9todo de pago:</strong> ${e.paymentMethod}</li>
          <li><strong>Total:</strong> $${e.amountPaid}</li>
          <li><strong>Referencia:</strong> ${e.paymentReference||"No proporcionada"}</li>
        </ul>
        `)}catch(e){console.error("Error sending admin notification:",e)}return s.NextResponse.json({success:!0})}catch(e){if(console.error("Error confirming payment:",e),e instanceof Error&&e.message.includes("not found"))return s.NextResponse.json({error:e.message},{status:404});if(e instanceof Error&&e.message.includes("already confirmed"))return s.NextResponse.json({error:e.message},{status:400});return s.NextResponse.json({error:"Internal server error"},{status:500})}}let c=new o.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/admin/tickets/[ticketId]/confirm/route",pathname:"/api/admin/tickets/[ticketId]/confirm",filename:"route",bundlePath:"app/api/admin/tickets/[ticketId]/confirm/route"},resolvedPagePath:"C:\\Users\\BIENV\\Downloads\\auth-system\\app\\api\\admin\\tickets\\[ticketId]\\confirm\\route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:m,staticGenerationAsyncStorage:u,serverHooks:g}=c,f="/api/admin/tickets/[ticketId]/confirm/route";function x(){return(0,n.patchFetch)({serverHooks:g,staticGenerationAsyncStorage:u})}},59780:(e,r,t)=>{t.d(r,{y:()=>i});var a=t(90602);class o{constructor(){this.transporter=null,this.initializeTransporter()}initializeTransporter(){let e={host:process.env.EMAIL_SERVER_HOST||"smtp.gmail.com",port:parseInt(process.env.EMAIL_SERVER_PORT||"587"),user:process.env.EMAIL_SERVER_USER||"",password:process.env.EMAIL_SERVER_PASSWORD||"",from:process.env.EMAIL_FROM||"noreply@autorifapro.com"};e.user&&e.password&&(this.transporter=a.createTransporter({host:e.host,port:e.port,secure:465===e.port,auth:{user:e.user,pass:e.password}}))}async sendEmail(e,r,t){if(!this.transporter)return console.warn("Email service not configured. Skipping email send."),!1;try{return await this.transporter.sendMail({from:process.env.EMAIL_FROM||"noreply@autorifapro.com",to:e,subject:r,html:t}),!0}catch(e){return console.error("Error sending email:",e),!1}}async sendTicketPurchaseConfirmation(e){let r=`Confirmaci\xf3n de Compra - ${e.raffleTitle}`,t=`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Confirmaci\xf3n de Compra</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">\xa1Compra Confirmada!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">AutoRifa Pro</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #2c3e50; margin-top: 0;">Hola ${e.buyerName},</h2>
            
            <p>Gracias por tu compra. Hemos recibido tu solicitud para los siguientes boletos:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="margin-top: 0; color: #2c3e50;">${e.raffleTitle}</h3>
              <p><strong>Boletos:</strong> ${e.ticketNumbers.map(e=>e.toString().padStart(4,"0")).join(", ")}</p>
              <p><strong>M\xe9todo de pago:</strong> ${this.getPaymentMethodText(e.paymentMethod)}</p>
              <p><strong>Total pagado:</strong> $${e.totalAmount}</p>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #856404;">⚠️ Importante</h4>
              <p style="margin: 0; color: #856404;">
                Tus boletos est\xe1n <strong>pendientes de confirmaci\xf3n</strong>. 
                Una vez que confirmemos tu pago, tus boletos estar\xe1n activos y podr\xe1s participar en el sorteo.
              </p>
            </div>
            
            <p>Recibir\xe1s una notificaci\xf3n por email cuando tu pago sea confirmado.</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXTAUTH_URL}/my-tickets" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Ver Mis Boletos
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            <p style="text-align: center; color: #6c757d; font-size: 14px;">
              Si tienes alguna pregunta, no dudes en contactarnos.<br>
              <strong>AutoRifa Pro</strong> - La plataforma m\xe1s segura para rifas de veh\xedculos
            </p>
          </div>
        </div>
      </body>
      </html>
    `;return this.sendEmail(e.buyerEmail,r,t)}async sendPaymentConfirmation(e){let r=`Pago Confirmado - ${e.raffleTitle}`,t=`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Pago Confirmado</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">\xa1Pago Confirmado!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">AutoRifa Pro</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #2c3e50; margin-top: 0;">Hola ${e.buyerName},</h2>
            
            <p>\xa1Excelente! Hemos confirmado tu pago y tus boletos est\xe1n ahora <strong>activos</strong>.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
              <h3 style="margin-top: 0; color: #2c3e50;">${e.raffleTitle}</h3>
              <p><strong>Boletos activos:</strong> ${e.ticketNumbers.map(e=>e.toString().padStart(4,"0")).join(", ")}</p>
              <p><strong>M\xe9todo de pago:</strong> ${this.getPaymentMethodText(e.paymentMethod)}</p>
              <p><strong>Total pagado:</strong> $${e.totalAmount}</p>
            </div>
            
            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #155724;">✅ Confirmado</h4>
              <p style="margin: 0; color: #155724;">
                Tus boletos est\xe1n <strong>activos</strong> y participar\xe1n en el sorteo. 
                \xa1Buena suerte!
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXTAUTH_URL}/my-tickets" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Ver Mis Boletos
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            <p style="text-align: center; color: #6c757d; font-size: 14px;">
              Si tienes alguna pregunta, no dudes en contactarnos.<br>
              <strong>AutoRifa Pro</strong> - La plataforma m\xe1s segura para rifas de veh\xedculos
            </p>
          </div>
        </div>
      </body>
      </html>
    `;return this.sendEmail(e.buyerEmail,r,t)}async sendWinnerNotification(e){let r=`\xa1Felicidades! Eres el Ganador - ${e.raffleTitle}`,t=`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>\xa1Eres el Ganador!</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); color: #333; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🎉 \xa1FELICIDADES!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">\xa1Eres el Ganador!</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #2c3e50; margin-top: 0;">Hola ${e.winnerName},</h2>
            
            <p>\xa1Incre\xedbles noticias! Has ganado la rifa:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffd700;">
              <h3 style="margin-top: 0; color: #2c3e50;">${e.raffleTitle}</h3>
              <p><strong>Boleto ganador:</strong> #${e.ticketNumber.toString().padStart(4,"0")}</p>
              <p><strong>Premio:</strong> ${e.prize}</p>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #856404;">🎁 Pr\xf3ximos Pasos</h4>
              <p style="margin: 0; color: #856404;">
                Nuestro equipo se pondr\xe1 en contacto contigo pronto para coordinar la entrega de tu premio.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXTAUTH_URL}/winners" style="background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); color: #333; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Ver Ganadores
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            <p style="text-align: center; color: #6c757d; font-size: 14px;">
              \xa1Gracias por participar en AutoRifa Pro!<br>
              <strong>AutoRifa Pro</strong> - La plataforma m\xe1s segura para rifas de veh\xedculos
            </p>
          </div>
        </div>
      </body>
      </html>
    `;return this.sendEmail(e.winnerEmail,r,t)}async sendAdminNotification(e,r){let t=process.env.ADMIN_EMAILS?.split(",")||["admin@autorifapro.com"],a=`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Notificaci\xf3n Administrativa</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Notificaci\xf3n Administrativa</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">AutoRifa Pro</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #2c3e50; margin-top: 0;">${e}</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              ${r}
            </div>
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            <p style="text-align: center; color: #6c757d; font-size: 14px;">
              <strong>AutoRifa Pro</strong> - Panel de Administraci\xf3n
            </p>
          </div>
        </div>
      </body>
      </html>
    `;return(await Promise.all(t.map(r=>this.sendEmail(r,`[Admin] ${e}`,a)))).every(e=>e)}getPaymentMethodText(e){switch(e){case"zelle":return"Zelle";case"paypal":return"PayPal";case"binance":return"Binance Pay";case"pago-movil":return"Pago M\xf3vil";default:return e}}}let i=new o},68364:(e,r,t)=>{t.d(r,{_:()=>o});let a=require("@prisma/client"),o=globalThis.prisma??new a.PrismaClient}};var r=require("../../../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),a=r.X(0,[9780,332,602],()=>t(92069));module.exports=a})();