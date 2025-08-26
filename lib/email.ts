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

interface PaymentRejectionEmailData {
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

interface NonWinnerEmailData {
  buyerName: string;
  buyerEmail: string;
  raffleTitle: string;
  ticketNumbers: number[];
  winnerName: string;
  winnerTicketNumber: number;
}

interface RaffleDrawNotificationData {
  raffleTitle: string;
  winnerName: string;
  winnerEmail: string;
  winnerTicketNumber: number;
  totalParticipants: number;
  totalTickets: number;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private fromEmail: string;

  constructor() {
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@ganaxdar.com';
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const config: EmailConfig = {
      host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
      user: process.env.EMAIL_SERVER_USER || '',
      password: process.env.EMAIL_SERVER_PASSWORD || '',
      from: this.fromEmail,
    };

    if (!config.user || !config.password) {
      console.warn('Email credentials not configured. Email service will be disabled.');
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.port === 465, // true for 465, false for other ports
        auth: {
          user: config.user,
          pass: config.password,
        },
        // Add these options for better compatibility
        tls: {
          rejectUnauthorized: false // Only for development - remove in production
        }
      });

      // Verify the connection
      this.verifyConnection();
    } catch (error) {
      console.error('Error initializing email transporter:', error);
      this.transporter = null;
    }
  }

  private async verifyConnection() {
    if (!this.transporter) return;

    try {
      await this.transporter.verify();
      console.log('Email server connection verified successfully');
    } catch (error) {
      console.error('Email server connection failed:', error);
      this.transporter = null;
    }
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    if (!this.transporter) {
      console.warn('Email service not configured. Skipping email send.');
      return false;
    }

    // Validate email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      console.error('Invalid email address:', to);
      return false;
    }

    try {
      const info = await this.transporter.sendMail({
        from: this.fromEmail,
        to,
        subject,
        html,
        // Add text fallback
        text: this.htmlToText(html)
      });

      console.log('Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email to', to, ':', error);
      return false;
    }
  }

  // Simple HTML to text converter
  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  async sendTicketPurchaseConfirmation(data: TicketPurchaseEmailData): Promise<boolean> {
    const subject = `Confirmación de Compra - ${data.raffleTitle}`;
    const html = this.generateTicketPurchaseHTML(data);
    return this.sendEmail(data.buyerEmail, subject, html);
  }

  private generateTicketPurchaseHTML(data: TicketPurchaseEmailData): string {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://ganaxdar.com';

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Compra</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">¡Compra Confirmada!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Ganaxdar</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h2 style="color: #2c3e50; margin-top: 0;">Hola ${data.buyerName},</h2>
            
            <p>Gracias por tu compra. Hemos recibido tu solicitud para los siguientes boletos:</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="margin-top: 0; color: #2c3e50;">${data.raffleTitle}</h3>
              <p><strong>Boletos:</strong> ${data.ticketNumbers.map(num => num.toString().padStart(4, '0')).join(', ')}</p>
              <p><strong>Método de pago:</strong> ${this.getPaymentMethodText(data.paymentMethod)}</p>
              <p><strong>Total:</strong> $${data.totalAmount.toFixed(2)}</p>
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
              <a href="${baseUrl}/my-tickets" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Ver Mis Boletos
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            <p style="text-align: center; color: #6c757d; font-size: 14px;">
              Si tienes alguna pregunta, no dudes en contactarnos.<br>
              <strong>Ganaxdar</strong> - La plataforma más segura para rifas de vehículos
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendPaymentConfirmation(data: PaymentConfirmationEmailData): Promise<boolean> {
    const subject = `Pago Confirmado - ${data.raffleTitle}`;
    const html = this.generatePaymentConfirmationHTML(data);
    return this.sendEmail(data.buyerEmail, subject, html);
  }

  private generatePaymentConfirmationHTML(data: PaymentConfirmationEmailData): string {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://ganaxdar.com';

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pago Confirmado</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">¡Pago Confirmado!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Ganaxdar</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h2 style="color: #2c3e50; margin-top: 0;">Hola ${data.buyerName},</h2>
            
            <p>¡Excelente! Hemos confirmado tu pago y tus boletos están ahora <strong>activos</strong>.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
              <h3 style="margin-top: 0; color: #2c3e50;">${data.raffleTitle}</h3>
              <p><strong>Boletos activos:</strong> ${data.ticketNumbers.map(num => num.toString().padStart(4, '0')).join(', ')}</p>
              <p><strong>Método de pago:</strong> ${this.getPaymentMethodText(data.paymentMethod)}</p>
              <p><strong>Total pagado:</strong> $${data.totalAmount.toFixed(2)}</p>
            </div>
            
            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #155724;">✅ Confirmado</h4>
              <p style="margin: 0; color: #155724;">
                Tus boletos están <strong>activos</strong> y participarán en el sorteo. 
                ¡Buena suerte!
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${baseUrl}/my-tickets" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Ver Mis Boletos
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            <p style="text-align: center; color: #6c757d; font-size: 14px;">
              Si tienes alguna pregunta, no dudes en contactarnos.<br>
              <strong>Ganaxdar</strong> - La plataforma más segura para rifas de vehículos
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendPaymentRejection(data: PaymentRejectionEmailData): Promise<boolean> {
    const subject = `Pago Rechazado - ${data.raffleTitle}`;
    const html = this.generatePaymentRejectionHTML(data);
    return this.sendEmail(data.buyerEmail, subject, html);
  }

  async sendWinnerNotification(data: WinnerEmailData): Promise<boolean> {
    const subject = `¡Felicidades! Eres el Ganador - ${data.raffleTitle}`;
    const html = this.generateWinnerNotificationHTML(data);
    return this.sendEmail(data.winnerEmail, subject, html);
  }

  async sendNonWinnerNotification(data: NonWinnerEmailData): Promise<boolean> {
    const subject = `Resultado del Sorteo - ${data.raffleTitle}`;
    const html = this.generateNonWinnerNotificationHTML(data);
    return this.sendEmail(data.buyerEmail, subject, html);
  }

  async sendRaffleDrawNotification(data: RaffleDrawNotificationData): Promise<boolean> {
    const subject = `Sorteo Completado - ${data.raffleTitle}`;
    const html = this.generateRaffleDrawNotificationHTML(data);
    return this.sendEmail(process.env.ADMIN_EMAILS?.split(',')[0] || 'admin@ganaxdar.com', subject, html);
  }

  private generatePaymentRejectionHTML(data: PaymentRejectionEmailData): string {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://ganaxdar.com';

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pago Rechazado</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🚫 Pago Rechazado</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Ganaxdar</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h2 style="color: #2c3e50; margin-top: 0;">Hola ${data.buyerName},</h2>
            
            <p>Lamentamos informarte que tu pago ha sido rechazado.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
              <h3 style="margin-top: 0; color: #2c3e50;">${data.raffleTitle}</h3>
              <p><strong>Boletos:</strong> ${data.ticketNumbers.map(num => num.toString().padStart(4, '0')).join(', ')}</p>
              <p><strong>Método de pago:</strong> ${this.getPaymentMethodText(data.paymentMethod)}</p>
              <p><strong>Total:</strong> $${data.totalAmount.toFixed(2)}</p>
            </div>
            
            <div style="background: #ffe3e3; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #721c24;">🚫 Rechazado</h4>
              <p style="margin: 0; color: #721c24;">
                Tu pago no ha sido procesado correctamente. Por favor, intenta nuevamente.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${baseUrl}/my-tickets" style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Ver Mis Boletos
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            <p style="text-align: center; color: #6c757d; font-size: 14px;">
              Si tienes alguna pregunta, no dudes en contactarnos.<br>
              <strong>Ganaxdar</strong> - La plataforma más segura para rifas de vehículos
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateWinnerNotificationHTML(data: WinnerEmailData): string {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://ganaxdar.com';

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>¡Eres el Ganador!</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); color: #333; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🎉 ¡FELICIDADES!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">¡Eres el Ganador!</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h2 style="color: #2c3e50; margin-top: 0;">Hola ${data.winnerName},</h2>
            
            <p>¡Increíbles noticias! Has ganado la rifa:</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffd700;">
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
              <a href="${baseUrl}/winners" style="background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); color: #333; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Ver Ganadores
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            <p style="text-align: center; color: #6c757d; font-size: 14px;">
              ¡Gracias por participar en Ganaxdar!<br>
              <strong>Ganaxdar</strong> - La plataforma más segura para rifas de vehículos
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateNonWinnerNotificationHTML(data: NonWinnerEmailData): string {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://ganaxdar.com';

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resultado del Sorteo</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #6c757d 0%, #495057 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🎯 Sorteo Completado</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Ganaxdar</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h2 style="color: #2c3e50; margin-top: 0;">Hola ${data.buyerName},</h2>
            
            <p>El sorteo de la rifa ha sido completado. Aquí están los resultados:</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6c757d;">
              <h3 style="margin-top: 0; color: #2c3e50;">${data.raffleTitle}</h3>
              <p><strong>Tus boletos:</strong> ${data.ticketNumbers.map(num => num.toString().padStart(4, '0')).join(', ')}</p>
            </div>
            
            <div style="background: #e9ecef; border: 1px solid #dee2e6; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #495057;">🏆 Ganador del Sorteo</h4>
              <p style="margin: 0; color: #495057;">
                <strong>Ganador:</strong> ${data.winnerName}<br>
                <strong>Boleto ganador:</strong> #${data.winnerTicketNumber.toString().padStart(4, '0')}
              </p>
            </div>
            
            <div style="background: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #6c757d;">💡 ¡No te desanimes!</h4>
              <p style="margin: 0; color: #6c757d;">
                Gracias por participar. ¡Sigue atento a nuestras próximas rifas! 
                Cada participación nos ayuda a seguir creciendo.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${baseUrl}/raffles" style="background: linear-gradient(135deg, #6c757d 0%, #495057 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Ver Próximas Rifas
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            <p style="text-align: center; color: #6c757d; font-size: 14px;">
              ¡Gracias por participar en Ganaxdar!<br>
              <strong>Ganaxdar</strong> - La plataforma más segura para rifas de vehículos
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateRaffleDrawNotificationHTML(data: RaffleDrawNotificationData): string {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Notificación de Sorteo Completado</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">✅ Sorteo Completado</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Notificación Administrativa</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h2 style="color: #2c3e50; margin-top: 0;">Sorteo Completado Exitosamente</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
              <h3 style="margin-top: 0; color: #2c3e50;">${data.raffleTitle}</h3>
              <p><strong>Ganador:</strong> ${data.winnerName} (${data.winnerEmail})</p>
              <p><strong>Boleto ganador:</strong> #${data.winnerTicketNumber.toString().padStart(4, '0')}</p>
              <p><strong>Total de participantes:</strong> ${data.totalParticipants}</p>
              <p><strong>Total de boletos vendidos:</strong> ${data.totalTickets}</p>
            </div>
            
            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #155724;">📧 Notificaciones Enviadas</h4>
              <p style="margin: 0; color: #155724;">
                Se han enviado notificaciones por email a todos los participantes 
                (ganador y no ganadores) sobre el resultado del sorteo.
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            <p style="text-align: center; color: #6c757d; font-size: 14px;">
              <strong>Ganaxdar</strong> - Panel de Administración
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendAdminNotification(subject: string, message: string): Promise<boolean> {
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || ['admin@ganaxdar.com'];

    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Notificación Administrativa</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Notificación Administrativa</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Ganaxdar</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h2 style="color: #2c3e50; margin-top: 0;">${subject}</h2>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              ${message}
            </div>
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            <p style="text-align: center; color: #6c757d; font-size: 14px;">
              <strong>Ganaxdar</strong> - Panel de Administración
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
    const paymentMethods: Record<string, string> = {
      'zelle': 'Zelle',
      'paypal': 'PayPal',
      'binance': 'Binance Pay',
      'pago-movil': 'Pago Móvil',
      'transfer': 'Transferencia Bancaria',
      'cash': 'Efectivo'
    };

    return paymentMethods[method] || method;
  }

  // Method to test email configuration
  async testConnection(): Promise<boolean> {
    if (!this.transporter) {
      console.error('Email transporter not initialized');
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('Email connection test successful');
      return true;
    } catch (error) {
      console.error('Email connection test failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();