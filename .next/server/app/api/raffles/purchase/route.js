"use strict";(()=>{var e={};e.id=9739,e.ids=[9739],e.modules={72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},78893:e=>{e.exports=require("buffer")},61282:e=>{e.exports=require("child_process")},84770:e=>{e.exports=require("crypto")},80665:e=>{e.exports=require("dns")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},86624:e=>{e.exports=require("querystring")},76162:e=>{e.exports=require("stream")},82452:e=>{e.exports=require("tls")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},71568:e=>{e.exports=require("zlib")},37137:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>y,patchFetch:()=>h,requestAsyncStorage:()=>m,routeModule:()=>g,serverHooks:()=>x,staticGenerationAsyncStorage:()=>f});var o={};t.r(o),t.d(o,{POST:()=>u});var a=t(70101),i=t(90796),n=t(83055),s=t(12903),l=t(68364),d=t(21585),p=t(13778),c=t(59780);async function u(e){console.log("\uD83D\uDCE9 Iniciando proceso de compra de tickets...");let r=await (0,d.getServerSession)(p.L);if(!r?.user?.email)return console.log("❌ Usuario no autenticado"),s.NextResponse.json({error:"Unauthorized"},{status:401});console.log("✅ Usuario autenticado:",r.user.email);try{let t=await e.json();console.log("\uD83D\uDCCB Datos recibidos:",{raffleId:t.raffleId,ticketNumbers:t.ticketNumbers,ticketCount:t.ticketNumbers?.length,paymentMethod:t.paymentMethod,paymentReference:t.paymentReference,hasPaymentProof:!!t.paymentProof,paymentComment:t.paymentComment});let{raffleId:o,ticketNumbers:a,paymentMethod:i,paymentReference:n,paymentProof:d,paymentComment:p}=t;if(!o||!a||!Array.isArray(a)||0===a.length)return console.log("❌ Datos inv\xe1lidos - faltan ticketNumbers o raffleId"),s.NextResponse.json({error:"Faltan datos requeridos: raffleId y ticketNumbers"},{status:400});if(!i||!n)return console.log("❌ Datos inv\xe1lidos - faltan datos de pago"),s.NextResponse.json({error:"Faltan datos de pago: m\xe9todo y referencia"},{status:400});console.log("\uD83D\uDD0D Buscando rifa con ID:",o);let u=await l._.raffle.findUnique({where:{id:o},select:{id:!0,title:!0,pricePerTicket:!0,status:!0,endDate:!0}});if(!u)return console.log("❌ Rifa no encontrada"),s.NextResponse.json({error:"Raffle not found"},{status:404});if(console.log("✅ Rifa encontrada:",u.title),"active"!==u.status)return console.log("❌ Rifa no activa:",u.status),s.NextResponse.json({error:"Raffle is not active"},{status:400});if(new Date>u.endDate)return console.log("❌ Rifa expirada"),s.NextResponse.json({error:"Raffle has ended"},{status:400});console.log("\uD83D\uDD0D Verificando disponibilidad de tickets:",a);let g=await l._.ticket.findMany({where:{raffleId:o,ticketNumber:{in:a},paymentStatus:{in:["confirmed","pending"]}}});if(g.length>0)return console.log("❌ Algunos tickets ya est\xe1n ocupados:",g.map(e=>e.ticketNumber)),s.NextResponse.json({error:"Some tickets are already taken"},{status:409});let m=a.length*Number(u.pricePerTicket);console.log("\uD83D\uDCB0 Monto total calculado:",m);let f=[];for(let e of(console.log("\uD83D\uDCBE Creando tickets en la base de datos..."),a)){console.log(`   📝 Creando ticket #${e}`);let t=await l._.ticket.create({data:{raffleId:o,ticketNumber:e,buyerName:r.user.name||"",buyerPhone:"",buyerEmail:r.user.email,buyerCountry:"",buyerCity:"",paymentMethod:i,paymentReference:n||null,paymentProof:d||null,paymentComment:p||null,amountPaid:m,paymentStatus:"pending"}});f.push(t.id),console.log(`   ✅ Ticket #${e} creado con ID: ${t.id}`)}console.log("✅ Todos los tickets creados. IDs:",f),console.log("\uD83D\uDCE7 Enviando notificaci\xf3n por email al usuario...");try{await c.y.sendTicketPurchaseConfirmation({buyerName:r.user.name||"",buyerEmail:r.user.email,raffleTitle:u.title,ticketNumbers:a,totalAmount:m,paymentMethod:i}),console.log("✅ Email de confirmaci\xf3n enviado")}catch(e){console.error("❌ Error sending email notification:",e)}console.log("\uD83D\uDCE7 Enviando notificaci\xf3n a administradores...");try{await c.y.sendAdminNotification("Nueva Compra de Boletos",`
        <h3>Nueva compra realizada:</h3>
        <ul>
          <li><strong>Usuario:</strong> ${r.user.name} (${r.user.email})</li>
          <li><strong>Rifa:</strong> ${u.title}</li>
          <li><strong>Boletos:</strong> ${a.map(e=>e.toString().padStart(4,"0")).join(", ")}</li>
          <li><strong>M\xe9todo de pago:</strong> ${i}</li>
          <li><strong>Total:</strong> $${m}</li>
          <li><strong>Referencia:</strong> ${n||"No proporcionada"}</li>
          <li><strong>Comentario:</strong> ${p||"Sin comentarios"}</li>
          <li><strong>Comprobante:</strong> ${d?"Adjunto":"No proporcionado"}</li>
        </ul>
        `),console.log("✅ Email de notificaci\xf3n admin enviado")}catch(e){console.error("❌ Error sending admin notification:",e)}let x={success:!0,ticketIds:f,totalAmount:m};return console.log("\uD83C\uDF89 Compra completada exitosamente:",x),s.NextResponse.json(x)}catch(e){return console.error("\uD83D\uDCA5 Error purchasing tickets:",e),s.NextResponse.json({error:"Internal server error"},{status:500})}}let g=new a.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/raffles/purchase/route",pathname:"/api/raffles/purchase",filename:"route",bundlePath:"app/api/raffles/purchase/route"},resolvedPagePath:"C:\\Users\\BIENV\\Downloads\\auth-system\\app\\api\\raffles\\purchase\\route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:m,staticGenerationAsyncStorage:f,serverHooks:x}=g,y="/api/raffles/purchase/route";function h(){return(0,n.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:f})}},13778:(e,r,t)=>{t.d(r,{L:()=>s});var o=t(76330),a=t(44471),i=t(57125),n=t(68364);let s={adapter:(0,o.N)(n._),secret:process.env.NEXTAUTH_SECRET,providers:[(0,a.Z)({name:"credentials",credentials:{email:{label:"Email",type:"email"},password:{label:"Password",type:"password"}},async authorize(e){if(!e?.email||!e?.password)throw Error("Email y contrase\xf1a son requeridos");if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email))throw Error("Formato de email inv\xe1lido");let r=await n._.user.findUnique({where:{email:e.email.toLowerCase()},select:{id:!0,email:!0,name:!0,password:!0,role:!0}});if(!r)throw Error("No existe una cuenta con este email");if(!r.password)throw Error("Esta cuenta no tiene contrase\xf1a configurada");if(!await i.ZP.compare(e.password,r.password))throw Error("Contrase\xf1a incorrecta");return{id:r.id,email:r.email,name:r.name,role:r.role}}})],session:{strategy:"jwt"},pages:{signIn:"/login"},callbacks:{jwt:async({token:e,user:r})=>(r&&(e.id=r.id,e.role=r.role),e),session:async({session:e,token:r})=>(r&&(e.user.id=r.id,e.user.role=r.role),e)}}},59780:(e,r,t)=>{t.d(r,{y:()=>i});var o=t(90602);class a{constructor(){this.transporter=null,this.initializeTransporter()}initializeTransporter(){let e={host:process.env.EMAIL_SERVER_HOST||"smtp.gmail.com",port:parseInt(process.env.EMAIL_SERVER_PORT||"587"),user:process.env.EMAIL_SERVER_USER||"",password:process.env.EMAIL_SERVER_PASSWORD||"",from:process.env.EMAIL_FROM||"noreply@autorifapro.com"};e.user&&e.password&&(this.transporter=o.createTransporter({host:e.host,port:e.port,secure:465===e.port,auth:{user:e.user,pass:e.password}}))}async sendEmail(e,r,t){if(!this.transporter)return console.warn("Email service not configured. Skipping email send."),!1;try{return await this.transporter.sendMail({from:process.env.EMAIL_FROM||"noreply@autorifapro.com",to:e,subject:r,html:t}),!0}catch(e){return console.error("Error sending email:",e),!1}}async sendTicketPurchaseConfirmation(e){let r=`Confirmaci\xf3n de Compra - ${e.raffleTitle}`,t=`
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
    `;return this.sendEmail(e.winnerEmail,r,t)}async sendAdminNotification(e,r){let t=process.env.ADMIN_EMAILS?.split(",")||["admin@autorifapro.com"],o=`
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
    `;return(await Promise.all(t.map(r=>this.sendEmail(r,`[Admin] ${e}`,o)))).every(e=>e)}getPaymentMethodText(e){switch(e){case"zelle":return"Zelle";case"paypal":return"PayPal";case"binance":return"Binance Pay";case"pago-movil":return"Pago M\xf3vil";default:return e}}}let i=new a},68364:(e,r,t)=>{t.d(r,{_:()=>a});let o=require("@prisma/client"),a=globalThis.prisma??new o.PrismaClient}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),o=r.X(0,[9780,332,7125,91,602],()=>t(37137));module.exports=o})();