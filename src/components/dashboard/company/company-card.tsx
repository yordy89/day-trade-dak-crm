'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCompanyStore } from '@/store/company-store';
import type { Company } from '@/store/company-store';
import { Card, Typography, Box, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Trash, Eye } from '@phosphor-icons/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import API from '@/lib/axios';
import { paths } from '@/paths';

const CompanyCard: React.FC<{ company: Company }> = ({ company }) => {
  const router = useRouter();
  const { removeCompany } = useCompanyStore();
  const queryClient = useQueryClient();
  const [hovered, setHovered] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const { mutate: deleteCompany, isPending } = useMutation({
    mutationFn: async () => {
      await API.delete(`/company/${company.symbol}`);
    },
    onSuccess: async () => {
      removeCompany(company.symbol);
      await queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    deleteCompany();
    setOpenConfirmDialog(false);
  };

  return (
    <>
      <Card
        sx={{
          cursor: 'pointer',
          backgroundColor: '#121212',
          color: 'white',
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          textAlign: 'center',
          p: 2,
          width: 220,
          height: 160,
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0px 10px 20px rgba(255, 255, 255, 0.2)',
          },
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Company Logo */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
          <Image
            src={`https://financialmodelingprep.com/image-stock/${company.symbol}.png`}
            alt={company.name}
            width={80}
            height={40}
            style={{ objectFit: 'contain' }}
          />
        </Box>

        {/* Company Details */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          {company.symbol}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2, gap: 2 }}>
          <Typography variant="body2" color="white">
            {company.name}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'lightgreen',  display: !company?.currentPrice ? 'none' : 'block'}}>
            ${company?.currentPrice?.toFixed(2)}
          </Typography>
        </Box>

        {hovered ? (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              transition: 'opacity 0.3s ease-in-out',
            }}
          >
            {/* DELETE BUTTON */}
            <IconButton
              color="error"
              onClick={handleDeleteClick}
              disabled={isPending}
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', p: 1, borderRadius: '50%' }}
            >
              <Trash size={24} />
            </IconButton>

            {/* VIEW DETAILS BUTTON */}
            <IconButton
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`${paths.dashboard.companies}/${company.symbol}`);
              }}
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', p: 1, borderRadius: '50%' }}
            >
              <Eye size={24} />
            </IconButton>
          </Box>
        ) : null}
      </Card>

      {/* CONFIRMATION DIALOG */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{company.name}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CompanyCard;
