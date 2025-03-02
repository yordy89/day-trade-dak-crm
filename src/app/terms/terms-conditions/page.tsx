'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, Typography, Divider, Link } from '@mui/material';
import { paths } from '@/paths';

export default function TermsAndConditions(): React.JSX.Element {
  const router = useRouter();

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
        Términos y Condiciones
      </Typography>
      <Divider sx={{ my: 3 }} />
      
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
        1. Introducción
      </Typography>
      <Typography paragraph>
        Bienvenido a <strong>Day Trade Dak</strong>. Al acceder y utilizar nuestros servicios, 
        aceptas los siguientes términos y condiciones. Si no estás de acuerdo con alguno de estos términos, 
        te recomendamos que no utilices nuestra plataforma.
      </Typography>

      <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
        2. No Asesoramiento Financiero
      </Typography>
      <Typography paragraph>
        <strong>Day Trade Dak</strong> es una plataforma educativa y de análisis de mercado. No somos asesores financieros 
        registrados y no proporcionamos asesoramiento financiero, legal o de inversión. 
        Todas las estrategias y análisis presentados en la plataforma son únicamente para fines educativos.
      </Typography>

      <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
        3. Riesgo de Pérdida
      </Typography>
      <Typography paragraph>
        El trading de instrumentos financieros conlleva un alto riesgo y no es adecuado para todos los inversores. 
        Puedes perder una parte o la totalidad de tu inversión. <strong>Day Trade Dak</strong> no se hace responsable 
        de pérdidas financieras resultantes de la información o estrategias presentadas en la plataforma.
      </Typography>

      <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
        4. Registro y Seguridad de la Cuenta
      </Typography>
      <Typography paragraph>
        Para acceder a ciertas funciones de nuestra plataforma, debes registrarte y proporcionar información precisa y actualizada. 
        Eres responsable de mantener la seguridad de tu cuenta y no compartir tus credenciales con terceros.
      </Typography>

      <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
        5. Suscripciones y Pagos
      </Typography>
      <Typography paragraph>
        Algunas funcionalidades de <strong>Day Trade Dak</strong> están disponibles a través de suscripciones de pago. 
        Los pagos no son reembolsables, salvo que se indique lo contrario en nuestra política de reembolsos.
      </Typography>

      <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
        6. Propiedad Intelectual
      </Typography>
      <Typography paragraph>
        Todo el contenido disponible en nuestra plataforma, incluyendo textos, gráficos, logotipos y materiales educativos, 
        está protegido por derechos de autor y propiedad intelectual. No está permitida su reproducción sin autorización.
      </Typography>

      <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
        7. Cambios en los Términos y Condiciones
      </Typography>
      <Typography paragraph>
        Nos reservamos el derecho de modificar estos términos en cualquier momento. Te notificaremos sobre cambios 
        sustanciales a través de nuestra plataforma o por correo electrónico.
      </Typography>

      <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
        8. Contacto
      </Typography>
      <Typography paragraph>
        Si tienes preguntas sobre estos términos, puedes contactarnos en <Link href="mailto:support@daytradedak.com">soporte@daytradedak.com</Link>.
      </Typography>

      <Divider sx={{ my: 3 }} />
      <Typography sx={{ textAlign: 'center', fontSize: '0.875rem', color: 'text.secondary' }}>
        Última actualización: 2 de marzo de 2025
      </Typography>

      {/* Navigation Buttons */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={() => router.push(paths.auth.signUp)}>
          Ir a Registro
        </Button>
      </Box>
    </Container>
  );
}
