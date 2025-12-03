'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Eye,
  TrendUp,
  TrendDown,
  Notebook,
} from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import API from '@/lib/axios';
import { formatCurrency } from '@/utils/format';
import { useAuth } from '@/hooks/use-auth';
import { Role } from '@/types/user';

interface StudentJournal {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  totalTrades: number;
  lastTradeDate: Date;
  openTrades: number;
  winners: number;
  totalPnl: number;
  needsReview: number;
  winRate: number;
}

export default function TradingJournalAdminPage() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<StudentJournal[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get('/trading-journal/admin/students');
      setStudents(response.data);
    } catch (err: any) {
      console.error('Failed to load students:', err);
      setError(err.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleViewStudent = (studentId: string) => {
    router.push(`${paths.academy.tradingJournal.admin}/student/${studentId}`);
  };

  // Check if user is admin
  if (user && user.role !== Role.Admin && user.role !== Role.SuperAdmin) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        Access denied. Admin privileges required.
      </Alert>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={600} mb={1}>
            Trading Journal - Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor and review student trading activities
          </Typography>
        </Box>
        <Chip
          label={`${students.length} Students`}
          color="primary"
          variant="outlined"
        />
      </Stack>

      {/* Students Table */}
      {students.length === 0 ? (
        <Card sx={{ p: 8, textAlign: 'center' }}>
          <Notebook size={48} color={theme.palette.text.disabled} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            No students with trading journals found
          </Typography>
        </Card>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell align="center">Total Trades</TableCell>
                  <TableCell align="center">Open Positions</TableCell>
                  <TableCell align="center">Win Rate</TableCell>
                  <TableCell align="right">Total P&L</TableCell>
                  <TableCell align="center">Needs Review</TableCell>
                  <TableCell>Last Trade</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow
                    key={student._id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleViewStudent(student._id)}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ width: 40, height: 40 }}>
                          {student.firstName?.[0]}{student.lastName?.[0]}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={600}>
                            {student.firstName} {student.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {student.email}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Typography fontWeight={600}>
                        {student.totalTrades}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {student.openTrades > 0 ? (
                        <Chip
                          label={student.openTrades}
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      ) : (
                        <Typography color="text.secondary">-</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
                        {student.winRate >= 50 ? (
                          <TrendUp size={16} color={theme.palette.success.main} />
                        ) : (
                          <TrendDown size={16} color={theme.palette.error.main} />
                        )}
                        <Typography
                          fontWeight={600}
                          color={student.winRate >= 50 ? 'success.main' : 'text.secondary'}
                        >
                          {student.winRate?.toFixed(1)}%
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        fontWeight={600}
                        color={student.totalPnl >= 0 ? 'success.main' : 'error.main'}
                      >
                        {formatCurrency(student.totalPnl)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {student.needsReview > 0 ? (
                        <Chip
                          label={student.needsReview}
                          size="small"
                          color="error"
                        />
                      ) : (
                        <Chip
                          label="All Reviewed"
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {student.lastTradeDate
                          ? new Date(student.lastTradeDate).toLocaleDateString()
                          : 'Never'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        startIcon={<Eye size={16} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewStudent(student._id);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Box>
  );
}
