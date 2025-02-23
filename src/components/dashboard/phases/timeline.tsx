'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, Stepper, Step, StepLabel } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import API from '@/lib/axios';
import { useAuthStore } from '@/store/auth-store';
import { CheckCircle, Circle } from '@phosphor-icons/react';

// **Step Icon Component (Moved Outside)**
const StepIconComponent = (props: any) => {
  const { active, completed } = props;
  return completed ? <CheckCircle size={24} color="green" /> : active ? <CheckCircle size={24} color="blue" /> : <Circle size={24} color="gray" />;
};

// **Trading Phases Data**
const tradingPhases = [
  { phase: 1, title: "Understanding Market Basics", description: "Learn key market concepts and trading terminology.", steps: ["Read trading books", "Watch market analysis", "Follow financial news"] },
  { phase: 2, title: "Setting Up Your Trading Plan", description: "Define your risk tolerance, goals, and trading strategy.", steps: ["Set trading goals", "Choose a strategy", "Define risk tolerance"] },
  { phase: 3, title: "Practicing with Paper Trading", description: "Simulate trades without risking real money.", steps: ["Use a demo account", "Analyze trade performance", "Record learning points"] },
  { phase: 4, title: "Executing Small Trades", description: "Start with small positions and analyze results.", steps: ["Make small trades", "Review outcomes", "Adjust based on analysis"] },
  { phase: 5, title: "Risk Management Mastery", description: "Learn stop-loss, risk-reward ratios, and position sizing.", steps: ["Set stop-loss", "Understand risk-reward ratio", "Calculate position size"] },
  { phase: 6, title: "Developing Emotional Discipline", description: "Overcome fear, greed, and psychological biases.", steps: ["Avoid emotional trading", "Follow a strict strategy", "Keep a trading journal"] },
  { phase: 7, title: "Optimizing Strategies with Data", description: "Backtest strategies and analyze performance metrics.", steps: ["Review historical data", "Optimize entry/exit points", "Fine-tune strategy"] },
  { phase: 8, title: "Managing Multiple Trades", description: "Handle multiple positions and diversify your portfolio.", steps: ["Diversify investments", "Monitor market correlations", "Manage portfolio risk"] },
  { phase: 9, title: "Scaling Your Trading Account", description: "Increase trade sizes while maintaining risk management.", steps: ["Increase capital allocation", "Manage leverage", "Improve trade execution"] },
  { phase: 10, title: "Consistently Profitable Trading", description: "Achieve long-term profitability and trading consistency.", steps: ["Follow a structured routine", "Adapt to market changes", "Refine profitable strategies"] }
];

export function TradingTimeline(): React.JSX.Element {
  const { user, setPhase } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState('');
  const [currentPhase, setCurrentPhase] = useState<number | null>(6);

  useEffect(() => {
    console.log(user);
    if (user?.tradingPhase === null || user?.tradingPhase === undefined) {
      setOpen(true);
    } else {
      setCurrentPhase(user?.tradingPhase);
    }
  }, [user]);

  // Mutation to send user response to OpenAI and get phase
  const { mutate: analyzeTradingPhase, isPending } = useMutation({
    mutationFn: async () => {
      const res = await API.post('/openai/determine-phase', { response });
      console.log(res);
      return res.data.tradingPhase;
    },
    onSuccess: async (phase) => {
      console.log(phase);
      setCurrentPhase(phase);
      setPhase(phase);
      setOpen(false);
    }
  });

  return (
    <Box sx={{ width: '100%', mx: 'auto', mt: 5, textAlign: 'center' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Your Trading Journey
      </Typography>

      {/* Horizontal Stepper Timeline */}
      <Box sx={{ px: 5, pt: 3 }}>
        <Stepper activeStep={(currentPhase || 1) - 1} alternativeLabel>
          {tradingPhases.map(({ phase, title }) => (
            <Step key={phase}>
              <StepLabel StepIconComponent={StepIconComponent}>
                <Typography variant="caption" fontWeight={phase === currentPhase ? 'bold' : 'normal'}>
                  {title}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Current Phase Details */}
      {currentPhase ? (
        <Box sx={{ mt: 4, textAlign: 'left', p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3, mx: 'auto', width: '80%' }}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            {tradingPhases[currentPhase - 1]?.title}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {tradingPhases[currentPhase - 1]?.description}
          </Typography>

          <Typography variant="h6" sx={{ mt: 3 }}>
            Steps to Progress:
          </Typography>
          <ul>
            {tradingPhases[currentPhase - 1]?.steps.map((step) => (
              <li key={step}>
                <Typography variant="body2">{step}</Typography>
              </li>
            ))}
          </ul>
        </Box>
      ): null}

      {/* Initial Dialog to Ask for Trading Challenges */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>What is your biggest challenge in trading?</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Your Response"
            multiline
            rows={3}
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            disabled={isPending}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => analyzeTradingPhase()} disabled={isPending} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
