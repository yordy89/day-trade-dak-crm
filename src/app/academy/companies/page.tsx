import React from "react";
import { Container, Typography } from "@mui/material";
import CompanySearch from "@/components/academy/company/company-search";
import CompanyList from "@/components/academy/company/company-list";

export default function CompaniesPage() {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Search and Add Companies
      </Typography>
      <CompanySearch />
      <CompanyList />
    </Container>
  );
}
