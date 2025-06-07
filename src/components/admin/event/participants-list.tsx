'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { FilePdf, FileXls } from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';
import { jsPDF as JSPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import * as XLSX from 'xlsx';

import API from '@/lib/axios';

interface Participant {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  isVip: boolean;
  promoCode?: string;
}

export default function ParticipantList({ eventId }: { eventId: string }) {
  const [filter, setFilter] = useState<'all' | 'vip' | 'free' | 'promo'>('all');

  const { data: participants = [] } = useQuery({
    queryKey: ['event-participants', eventId],
    queryFn: async () => {
      const res = await API.get(`/event-registrations/event/${eventId}`);
      return res.data;
    },
    enabled: Boolean(eventId),
  });

  const filtered = participants.filter((p: Participant) => {
    if (filter === 'vip') return p.isVip;
    if (filter === 'free') return !p.isVip;
    if (filter === 'promo') return Boolean(p.promoCode);
    return true;
  });

  const exportToExcel = () => {
    const worksheetData = filtered.map((p: any) => ({
      Nombre: `${p.firstName} ${p.lastName}`,
      Email: p.email,
      Teléfono: p.phoneNumber || '',
      VIP: p.isVip ? 'Sí' : 'No',
      'Código Promo': p.promoCode || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Participantes');

    XLSX.writeFile(workbook, 'participantes_evento.xlsx');
  };

  const exportToPDF = () => {
    const doc = new JSPDF();
    doc.text('Participantes del Evento', 14, 18);

    autoTable(doc, {
      startY: 24,
      head: [['Nombre', 'Email', 'Teléfono', 'VIP', 'Promo']],
      body: filtered.map((p: any) => [
        `${p.firstName} ${p.lastName}`,
        p.email,
        p.phoneNumber || '',
        p.isVip ? 'Sí' : 'No',
        p.promoCode || '',
      ]),
    });

    doc.save('participantes_evento.pdf');
  };

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        mb={3}
        spacing={2}
      >
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Filtrar Participantes</InputLabel>
          <Select value={filter} label="Filtrar Participantes" onChange={(e) => setFilter(e.target.value as any)}>
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="vip">Solo VIP</MenuItem>
            <MenuItem value="free">Solo Gratis</MenuItem>
            <MenuItem value="promo">Con Código Promocional</MenuItem>
          </Select>
        </FormControl>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={exportToExcel}
            startIcon={<FileXls size={18} color="#1D6F42" />} // Excel green
          >
            Export Excel
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={exportToPDF}
            startIcon={<FilePdf size={18} color="#D3302F" />} // PDF red
          >
            Export PDF
          </Button>
        </Stack>
      </Stack>

      {filtered.length === 0 ? (
        <Typography variant="body1" textAlign="center" color="text.secondary">
          No hay participantes que coincidan con el filtro seleccionado.
        </Typography>
      ) : (
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
                <TableCell>
                  <strong>Nombre</strong>
                </TableCell>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                <TableCell>
                  <strong>Teléfono</strong>
                </TableCell>
                <TableCell>
                  <strong>VIP</strong>
                </TableCell>
                <TableCell>
                  <strong>Promo</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((p: any) => (
                <TableRow key={p._id} hover>
                  <TableCell>
                    {p.firstName} {p.lastName}
                  </TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>{p.phoneNumber || '—'}</TableCell>
                  <TableCell>{p.isVip ? 'Sí' : 'No'}</TableCell>
                  <TableCell>{p.promoCode || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}
