"use strict";(()=>{var e={};e.id=2414,e.ids=[2414],e.modules={72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},78893:e=>{e.exports=require("buffer")},61282:e=>{e.exports=require("child_process")},84770:e=>{e.exports=require("crypto")},80665:e=>{e.exports=require("dns")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},86624:e=>{e.exports=require("querystring")},76162:e=>{e.exports=require("stream")},82452:e=>{e.exports=require("tls")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},71568:e=>{e.exports=require("zlib")},44219:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>y,patchFetch:()=>b,requestAsyncStorage:()=>m,routeModule:()=>f,serverHooks:()=>h,staticGenerationAsyncStorage:()=>x});var a={};t.r(a),t.d(a,{GET:()=>g,POST:()=>u});var o=t(70101),i=t(90796),n=t(83055),s=t(12903),d=t(8967),l=t(13778),p=t(68364),c=t(59780);async function u(e){try{let r=await (0,d.getServerSession)(l.L);if(!r?.user||"admin"!==r.user.role)return s.NextResponse.json({error:"Unauthorized"},{status:401});let{raffleId:t,winnerName:a,winnerEmail:o,winnerPhone:i,ticketNumber:n,videoUrl:u,claimed:g}=await e.json();if(!t||!a||!o||void 0===n)return s.NextResponse.json({error:"Missing required fields"},{status:400});let f=await p._.raffle.findUnique({where:{id:t},select:{id:!0,title:!0,description:!0}});if(!f)return s.NextResponse.json({error:"Raffle not found"},{status:404});if(await p._.winner.findFirst({where:{raffleId:t}}))return s.NextResponse.json({error:"Winner already assigned for this raffle"},{status:400});if(!await p._.ticket.findFirst({where:{raffleId:t,ticketNumber:n,paymentStatus:"confirmed"}}))return s.NextResponse.json({error:"Ticket not found or not confirmed"},{status:404});let m=await p._.winner.create({data:{raffleId:t,winnerName:a,winnerEmail:o,winnerPhone:i,ticketNumber:n,videoUrl:u,claimed:g||!1,drawDate:new Date}});await p._.raffle.update({where:{id:t},data:{status:"drawn",winnerTicketNumber:n,winnerName:a,winnerPhone:i,winnerEmail:o}});try{await c.y.sendWinnerNotification({winnerName:a,winnerEmail:o,raffleTitle:f.title,ticketNumber:n,prize:f.description||f.title})}catch(e){console.error("Error sending winner notification email:",e)}try{await c.y.sendAdminNotification("Ganador Asignado",`
                <h3>Ganador asignado:</h3>
                <ul>
                    <li><strong>Rifa:</strong> ${f.title}</li>
                    <li><strong>Ganador:</strong> ${a} (${o})</li>
                    <li><strong>Boleto ganador:</strong> #${n.toString().padStart(4,"0")}</li>
                    <li><strong>Tel\xe9fono:</strong> ${i||"No proporcionado"}</li>
                    <li><strong>Fecha del sorteo:</strong> ${new Date().toLocaleDateString()}</li>
                </ul>
                `)}catch(e){console.error("Error sending admin notification:",e)}return s.NextResponse.json({success:!0,winner:m})}catch(e){return console.error("Error assigning winner:",e),s.NextResponse.json({error:"Internal server error"},{status:500})}}async function g(){try{let e=await (0,d.getServerSession)(l.L);if(!e?.user||"admin"!==e.user.role)return s.NextResponse.json({error:"Unauthorized"},{status:401});let r=(await p._.winner.findMany({include:{raffle:{select:{title:!0}}},orderBy:{createdAt:"desc"}})).map(e=>({id:e.id,raffleId:e.raffleId,raffleTitle:e.raffle.title,winnerName:e.winnerName,winnerEmail:e.winnerEmail,winnerPhone:e.winnerPhone,ticketNumber:e.ticketNumber,videoUrl:e.videoUrl,claimed:e.claimed,drawDate:e.drawDate.toISOString(),createdAt:e.createdAt.toISOString()}));return s.NextResponse.json({winners:r})}catch(e){return console.error("Get winners error:",e),s.NextResponse.json({error:"Internal server error"},{status:500})}}let f=new o.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/admin/winners/route",pathname:"/api/admin/winners",filename:"route",bundlePath:"app/api/admin/winners/route"},resolvedPagePath:"C:\\Users\\BIENV\\Downloads\\auth-system\\app\\api\\admin\\winners\\route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:m,staticGenerationAsyncStorage:x,serverHooks:h}=f,y="/api/admin/winners/route";function b(){return(0,n.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:x})}},13778:(e,r,t)=>{t.d(r,{L:()=>s});var a=t(76330),o=t(44471),i=t(57125),n=t(68364);let s={adapter:(0,a.N)(n._),secret:process.env.NEXTAUTH_SECRET,providers:[(0,o.Z)({name:"credentials",credentials:{email:{label:"Email",type:"email"},password:{label:"Password",type:"password"}},async authorize(e){if(!e?.email||!e?.password)throw Error("Email y contrase\xf1a son requeridos");if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email))throw Error("Formato de email inv\xe1lido");let r=await n._.user.findUnique({where:{email:e.email.toLowerCase()},select:{id:!0,email:!0,name:!0,password:!0,role:!0}});if(!r)throw Error("No existe una cuenta con este email");if(!r.password)throw Error("Esta cuenta no tiene contrase\xf1a configurada");if(!await i.ZP.compare(e.password,r.password))throw Error("Contrase\xf1a incorrecta");return{id:r.id,email:r.email,name:r.name,role:r.role}}})],session:{strategy:"jwt"},pages:{signIn:"/login"},callbacks:{jwt:async({token:e,user:r})=>(r&&(e.id=r.id,e.role=r.role),e),session:async({session:e,token:r})=>(r&&(e.user.id=r.id,e.user.role=r.role),e)}}},59780:(e,r,t)=>{t.d(r,{y:()=>i});var a=t(90602);class o{constructor(){this.transporter=null,this.initializeTransporter()}initializeTransporter(){let e={host:process.env.EMAIL_SERVER_HOST||"smtp.gmail.com",port:parseInt(process.env.EMAIL_SERVER_PORT||"587"),user:process.env.EMAIL_SERVER_USER||"",password:process.env.EMAIL_SERVER_PASSWORD||"",from:process.env.EMAIL_FROM||"noreply@autorifapro.com"};e.user&&e.password&&(this.transporter=a.createTransporter({host:e.host,port:e.port,secure:465===e.port,auth:{user:e.user,pass:e.password}}))}async sendEmail(e,r,t){if(!this.transporter)return console.warn("Email service not configured. Skipping email send."),!1;try{return await this.transporter.sendMail({from:process.env.EMAIL_FROM||"noreply@autorifapro.com",to:e,subject:r,html:t}),!0}catch(e){return console.error("Error sending email:",e),!1}}async sendTicketPurchaseConfirmation(e){let r=`Confirmaci\xf3n de Compra - ${e.raffleTitle}`,t=`
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
    `;return(await Promise.all(t.map(r=>this.sendEmail(r,`[Admin] ${e}`,a)))).every(e=>e)}getPaymentMethodText(e){switch(e){case"zelle":return"Zelle";case"paypal":return"PayPal";case"binance":return"Binance Pay";case"pago-movil":return"Pago M\xf3vil";default:return e}}}let i=new o},68364:(e,r,t)=>{t.d(r,{_:()=>o});let a=require("@prisma/client"),o=globalThis.prisma??new a.PrismaClient},31329:(e,r)=>{Object.defineProperty(r,"__esModule",{value:!0})},8967:(e,r,t)=>{Object.defineProperty(r,"__esModule",{value:!0});var a={};Object.defineProperty(r,"default",{enumerable:!0,get:function(){return i.default}});var o=t(31329);Object.keys(o).forEach(function(e){!("default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(a,e))&&(e in r&&r[e]===o[e]||Object.defineProperty(r,e,{enumerable:!0,get:function(){return o[e]}}))});var i=function(e,r){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var t=n(void 0);if(t&&t.has(e))return t.get(e);var a={__proto__:null},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var i in e)if("default"!==i&&({}).hasOwnProperty.call(e,i)){var s=o?Object.getOwnPropertyDescriptor(e,i):null;s&&(s.get||s.set)?Object.defineProperty(a,i,s):a[i]=e[i]}return a.default=e,t&&t.set(e,a),a}(t(21585));function n(e){if("function"!=typeof WeakMap)return null;var r=new WeakMap,t=new WeakMap;return(n=function(e){return e?t:r})(e)}Object.keys(i).forEach(function(e){!("default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(a,e))&&(e in r&&r[e]===i[e]||Object.defineProperty(r,e,{enumerable:!0,get:function(){return i[e]}}))})}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),a=r.X(0,[9780,332,7125,91,602],()=>t(44219));module.exports=a})();