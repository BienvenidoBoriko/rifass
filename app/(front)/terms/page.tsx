import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Términos y Condiciones
        </h1>
        <p className="text-xl text-slate-600">
          Última actualización: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Aceptación de los Términos</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <p>
              Al acceder y utilizar AutoRifa Pro, usted acepta estar sujeto a estos términos y condiciones. 
              Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Elegibilidad</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <ul>
              <li>Debe ser mayor de 18 años para participar</li>
              <li>Debe residir en una jurisdicción donde las rifas sean legales</li>
              <li>Debe proporcionar información personal veraz y actualizada</li>
              <li>Solo se permite una cuenta por persona</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Compra de Boletos</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <ul>
              <li>Los boletos se venden por orden de llegada</li>
              <li>El pago debe completarse dentro del tiempo límite especificado</li>
              <li>Los boletos no confirmados pueden ser liberados para otros compradores</li>
              <li>No se permiten reembolsos una vez confirmado el pago</li>
              <li>Los precios están sujetos a cambios sin previo aviso</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Sorteos</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <ul>
              <li>Los sorteos se realizan en las fechas programadas</li>
              <li>Todos los sorteos son auditados por terceros independientes</li>
              <li>Los resultados son finales e inapelables</li>
              <li>Los sorteos pueden posponerse por causas de fuerza mayor</li>
              <li>Se requiere un mínimo de boletos vendidos para realizar el sorteo</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Premios</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <ul>
              <li>Los ganadores serán contactados dentro de 48 horas</li>
              <li>Los premios deben reclamarse dentro de 30 días</li>
              <li>Los ganadores son responsables de todos los impuestos aplicables</li>
              <li>Los premios no pueden transferirse a terceros</li>
              <li>AutoRifa Pro se reserva el derecho de verificar la identidad del ganador</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Pagos y Reembolsos</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <ul>
              <li>Aceptamos múltiples métodos de pago seguros</li>
              <li>Los reembolsos solo se procesan en casos excepcionales</li>
              <li>Las cancelaciones de rifas resultan en reembolso completo</li>
              <li>Los cargos por procesamiento de pago no son reembolsables</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Privacidad y Datos</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <ul>
              <li>Protegemos su información personal según nuestra política de privacidad</li>
              <li>Los datos de contacto pueden usarse para comunicaciones relacionadas con rifas</li>
              <li>Los nombres de ganadores pueden publicarse con fines de transparencia</li>
              <li>No vendemos ni compartimos datos personales con terceros</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Limitación de Responsabilidad</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <p>
              AutoRifa Pro no será responsable por daños indirectos, incidentales o consecuentes 
              que surjan del uso de nuestro servicio. Nuestra responsabilidad se limita al valor 
              de los boletos comprados.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Modificaciones</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier momento. 
              Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Contacto</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <p>
              Para preguntas sobre estos términos, contáctenos en:
              <br />
              Email: legal@autorifapro.com
              <br />
              Teléfono: +1 (555) 123-4567
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
