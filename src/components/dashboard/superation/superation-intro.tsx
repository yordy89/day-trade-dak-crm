'use client';

import React from 'react';
import { Box, Button, Typography } from '@mui/material';

interface SuperacionIntroProps {
  onStart: () => void;
  ctaText: string;
}

export default function SuperacionIntro({ onStart, ctaText }: SuperacionIntroProps) {
  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Curso para Traders: “PAZ CON EL DINERO”
      </Typography>

      <Typography paragraph>¿Y si tu verdadera estrategia ganadora fuera SANAR tu relación con el dinero?</Typography>
      <Typography paragraph>
        No es tu sistema de trading el que te frena, es tu vínculo emocional, mental y energético con el dinero. En 21
        días obtendrás las claves para transformar esa relación y construir una base sólida para resultados sostenibles.
      </Typography>

      <Button variant="contained" size="large" sx={{ mt: 2, mb: 4 }} onClick={onStart}>
        {ctaText}
      </Button>

      <Typography variant="h6" fontWeight="bold" mt={4}>
        🎯 Este curso es para ti si…
      </Typography>
      <ul>
        <li>Te frustra ver que tus resultados no reflejan tu preparación técnica.</li>
        <li>Vives altibajos emocionales al operar: ansiedad, euforia, miedo, bloqueo.</li>
        <li>Ganas dinero, pero no logras retenerlo ni sostenerlo en el tiempo.</li>
        <li>Sientes que, aunque estudias y te formas, algo interno te sabotea.</li>
        <li>
          Sabes que la libertad financiera no se alcanza solo con análisis técnico, sino desde una mente ordenada y un
          corazón en paz.
        </li>
      </ul>

      <Typography variant="h6" fontWeight="bold" mt={4}>
        🧘‍♂️ Lo que recibirás en estos 21 días
      </Typography>
      <ul>
        <li>Una estructura clara para revisar y sanar tu relación con el dinero.</li>
        <li>Herramientas prácticas para transformar creencias limitantes.</li>
        <li>Claves para trabajar tu merecimiento, enfoque y conexión interior.</li>
        <li>Técnicas energéticas, emocionales y mentales para operar con más coherencia.</li>
        <li>Una base sólida para comenzar un camino de verdadera libertad financiera.</li>
      </ul>

      <Typography variant="h6" fontWeight="bold" mt={4}>
        📦 ¿Qué incluye?
      </Typography>
      <ul>
        <li>🌀 21 lecciones con contenido teórico-práctico.</li>
        <li>📕 E-book: La Guía Definitiva para Vivir la Paz con el Dinero.</li>
        <li>💭 Ejercicios de introspección, visualización y activación de abundancia.</li>
        <li>Acceso 100% online, desde cualquier lugar, a tu ritmo.</li>
        <li>Reflexiones para integrar lo aprendido en tu día a día como trader.</li>
      </ul>

      <Typography variant="h6" fontWeight="bold" mt={4}>
        ❌ Esto NO es… / ✅ Esto SÍ es…
      </Typography>
      <ul>
        <li>❌ Un curso técnico de trading.</li>
        <li>❌ Una promesa de rentabilidad rápida.</li>
        <li>❌ Un camino espiritual sin aplicación práctica.</li>
        <li>✅ Una puerta hacia una relación ordenada y poderosa con el dinero.</li>
        <li>✅ Un trabajo interior para sostener el éxito.</li>
        <li>✅ La base para operar con mayor paz y estabilidad emocional.</li>
      </ul>

      <Typography variant="h6" fontWeight="bold" mt={4}>
        📉 ¿Por qué sigues teniendo altibajos aunque domines el análisis técnico?
      </Typography>
      <Typography paragraph>
        Porque el dinero activa tus miedos más profundos. Porque la relación que tienes con él define cómo lo atraes, lo
        sostienes o lo pierdes. Cambiar esa relación cambia tus resultados.
      </Typography>

      <Typography paragraph mt={4}>
        <strong>Jorge Lázaro León 👨‍🏫✍️</strong> es escritor, terapeuta y coach especializado en transformación personal
        y energética. Su enfoque integra herramientas de conciencia, energía y reprogramación interior para ayudarte a
        vivir el dinero desde merecimiento y paz.
      </Typography>

      <Typography variant="h6" fontWeight="bold" mt={4}>
        🎁 BONUS
      </Typography>
      <Typography paragraph>
        Al inscribirte, puedes descargar gratis el e-book “La guía definitiva para vivir la paz con el dinero”.
      </Typography>

      <Typography variant="h6" fontWeight="bold" mt={4}>
        💸 Modalidad
      </Typography>
      <Typography paragraph>
        Duración: 21 días. Modalidad: 100% online, flexible y a tu ritmo. <strong>Acceso: 60 dias.</strong> 
      </Typography>

      <Button variant="contained" size="large" sx={{ mt: 2, mb: 4 }} onClick={onStart}>
        {ctaText}
      </Button>
    </Box>
  );
}
