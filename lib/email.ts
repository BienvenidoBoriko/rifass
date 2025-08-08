import nodemailer from 'nodemailer';

interface EmailConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    from: string;
}

interface TicketPurchaseEmailData {
    buyerName: string;
    buyerEmail: string;
    raffleTitle: string;
    ticketNumbers: number[];
    totalAmount: number;
    paymentMethod: string;
}

interface PaymentConfirmationEmailData {
    buyerName: string;
    buyerEmail: string;
    raffleTitle: string;
    ticketNumbers: number[];
    totalAmount: number;
    paymentMethod: string;
}

interface WinnerEmailData {
    winnerName: string;
    winnerEmail: string;
    raffleTitle: string;
    ticketNumber: number;
    prize: string;
}

class EmailService {
    private transporter: nodemailer.Transporter | null = null;

    constructor() {
        this.initializeTransporter();
    }

    private initializeTransporter() {
        const config: EmailConfig = {
            host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
            user: process.env.EMAIL_SERVER_USER || '',
            password: process.env.EMAIL_SERVER_PASSWORD || '',
            from: process.env.EMAIL_FROM || 'noreply@autorifapro.com',
        };

        if (config.user && config.password) {
            this.transporter = nodemailer.createTransporter({
                host: config.host,
                port: config.port,
                secure: config.port === 465,
                auth: {
                    user: config.user,
                    pass: config.password,
                },
            });
        }
    }

    private async sendEmail(to: string, subject: string, html: string) {
        if (!this.transporter) {
            console.warn('Email service not configured. Skipping email send.');
            return false;
        }

        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_FROM || 'noreply@autorifapro.com',
                to,
                subject,
                html,
            });
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }

    async sendTicketPurchaseConfirmation(data: TicketPurchaseEmailData) {
        const subject = `Confirmación de Compra - ${data.raffleTitle}`;
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Confirmación de Compra</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">¡Compra Confirmada!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">AutoRifa Pro</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #2c3e50; margin-top: 0;">Hola ${data.buyerName},</h2>
            
            <p>Gracias por tu compra. Hemos recibido tu solicitud para los siguientes boletos:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="margin-top: 0; color: #2c3e50;">${data.raffleTitle}</h3>
              <p><strong>Boletos:</strong> ${data.ticketNumbers.map(num => num.toString().padStart(4, '0')).join(', ')}</p>
              <p><strong>Método de pago:</strong> ${this.getPaymentMethodText(data.paymentMethod)}</p>
              <p><strong>Total pagado:</strong> $${data.totalAmount}</p>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #856404;">⚠️ Importante</h4>
              <p style="margin: 0; color: #856404;">
                Tus boletos están <strong>pendientes de confirmación</strong>. 
                Una vez que confirmemos tu pago, tus boletos estarán activos y podrás participar en el sorteo.
              </p>
            </div>
            
            <p>Recibirás una notificación por email cuando tu pago sea confirmado.</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXTAUTH_URL}/my-tickets" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Ver Mis Boletos
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            <p style="text-align: center; color: #6c757d; font-size: 14px;">
              Si tienes alguna pregunta, no dudes en contactarnos.<br>
              <strong>AutoRifa Pro</strong> - La plataforma más segura para rifas de vehículos
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

        return this.sendEmail(data.buyerEmail, subject, html);
    }

    async sendPaymentConfirmation(data: PaymentConfirmationEmailData) {
        const subject = `Pago Confirmado - ${data.raffleTitle}`;
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Pago Confirmado</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">¡Pago Confirmado!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">AutoRifa Pro</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #2c3e50; margin-top: 0;">Hola ${data.buyerName},</h2>
            
            <p>¡Excelente! Hemos confirmado tu pago y tus boletos están ahora <strong>activos</strong>.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
              <h3 style="margin-top: 0; color: #2c3e50;">${data.raffleTitle}</h3>
              <p><strong>Boletos activos:</strong> ${data.ticketNumbers.map(num => num.toString().padStart(4, '0')).join(', ')}</p>
              <p><strong>Método de pago:</strong> ${this.getPaymentMethodText(data.paymentMethod)}</p>
              <p><strong>Total pagado:</strong> $${data.totalAmount}</p>
            </div>
            
            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #155724;">✅ Confirmado</h4>
              <p style="margin: 0; color: #155724;">
                Tus boletos están <strong>activos</strong> y participarán en el sorteo. 
                ¡Buena suerte!
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
              <strong>AutoRifa Pro</strong> - La plataforma más segura para rifas de vehículos
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

        return this.sendEmail(data.buyerEmail, subject, html);
    }

    async sendWinnerNotification(data: WinnerEmailData) {
        const subject = `¡Felicidades! Eres el Ganador - ${data.raffleTitle}`;
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>¡Eres el Ganador!</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); color: #333; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🎉 ¡FELICIDADES!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">¡Eres el Ganador!</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #2c3e50; margin-top: 0;">Hola ${data.winnerName},</h2>
            
            <p>¡Increíbles noticias! Has ganado la rifa:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffd700;">
              <h3 style="margin-top: 0; color: #2c3e50;">${data.raffleTitle}</h3>
              <p><strong>Boleto ganador:</strong> #${data.ticketNumber.toString().padStart(4, '0')}</p>
              <p><strong>Premio:</strong> ${data.prize}</p>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #856404;">🎁 Próximos Pasos</h4>
              <p style="margin: 0; color: #856404;">
                Nuestro equipo se pondrá en contacto contigo pronto para coordinar la entrega de tu premio.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXTAUTH_URL}/winners" style="background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); color: #333; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Ver Ganadores
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            <p style="text-align: center; color: #6c757d; font-size: 14px;">
              ¡Gracias por participar en AutoRifa Pro!<br>
              <strong>AutoRifa Pro</strong> - La plataforma más segura para rifas de vehículos
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

        return this.sendEmail(data.winnerEmail, subject, html);
    }

    async sendAdminNotification(subject: string, message: string) {
        const adminEmails = process.env.ADMIN_EMAILS?.split(',') || ['admin@autorifapro.com'];

        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Notificación Administrativa</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Notificación Administrativa</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">AutoRifa Pro</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #2c3e50; margin-top: 0;">${subject}</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              ${message}
            </div>
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            <p style="text-align: center; color: #6c757d; font-size: 14px;">
              <strong>AutoRifa Pro</strong> - Panel de Administración
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

        const results = await Promise.all(
            adminEmails.map(email => this.sendEmail(email, `[Admin] ${subject}`, html))
        );

        return results.every(result => result);
    }

    private getPaymentMethodText(method: string): string {
        switch (method) {
            case 'zelle':
                return 'Zelle';
            case 'paypal':
                return 'PayPal';
            case 'binance':
                return 'Binance Pay';
            case 'pago-movil':
                return 'Pago Móvil';
            default:
                return method;
        }
    }
}

export const emailService = new EmailService();
