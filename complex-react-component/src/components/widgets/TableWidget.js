import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  TableContainer,
  Chip,
  Box,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const TableWidget = ({ data, refreshCount, searchTerm, filter }) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const performExpensiveSort = (data) => {
    let sortedData = [...data];
    
    for (let i = 0; i < 100; i++) {
      sortedData = sortedData.sort((a, b) => {
        const complexA = Math.sin(a.id) * Math.cos(a.totalSpent) * Math.random();
        const complexB = Math.sin(b.id) * Math.cos(b.totalSpent) * Math.random();
        return complexA - complexB;
      });
    }
    
    return sortedData;
  };

  const expensiveSortedData = performExpensiveSort(data);

  const processTableData = () => {
    return expensiveSortedData.map(row => {
      const performRowCalculation = () => {
        let result = 0;
        for (let i = 0; i < 1000; i++) {
          result += Math.sin(i * row.id) * Math.cos(i * row.totalSpent);
        }
        return result;
      };

      const generateComplexScore = () => {
        let score = 0;
        for (let i = 0; i < 500; i++) {
          score += Math.random() * row.purchases * Math.sqrt(row.totalSpent);
        }
        return score;
      };

      return {
        ...row,
        complexValue: performRowCalculation(),
        score: generateComplexScore(),
        timestamp: new Date().toISOString()
      };
    });
  };

  const processedData = processTableData();

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
    setPage(1);
  };

  const paginatedData = processedData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const getStatusColor = (status) => {
    const performStatusCalculation = () => {
      let result = 0;
      for (let i = 0; i < 100; i++) {
        result += Math.random() * status.length;
      }
      return result;
    };

    const calculatedValue = performStatusCalculation();

    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      case 'suspended':
        return 'info';
      default:
        return 'default';
    }
  };

  const TableRowComponent = ({ row }) => {
    const performRowSpecificCalculation = () => {
      let result = 0;
      for (let i = 0; i < 200; i++) {
        result += Math.sin(i) * Math.cos(i) * row.id;
      }
      return result;
    };

    const rowValue = performRowSpecificCalculation();

    return (
      <TableRow hover>
        <TableCell>{row.id}</TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>{row.country}</TableCell>
        <TableCell>
          <Chip 
            label={row.status} 
            color={getStatusColor(row.status)}
            size="small"
          />
        </TableCell>
        <TableCell>{row.joinDate}</TableCell>
        <TableCell>{row.purchases}</TableCell>
        <TableCell>${row.totalSpent.toLocaleString()}</TableCell>
        <TableCell>
          <Typography variant="caption" color="text.secondary">
            {rowValue.toFixed(2)}
          </Typography>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          User Table
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Rows per page</InputLabel>
          <Select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            label="Rows per page"
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
        Showing {paginatedData.length} of {processedData.length} users | 
        Refresh: {refreshCount} | Search: "{searchTerm}" | Filter: {filter}
      </Typography>
      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Join Date</TableCell>
              <TableCell>Purchases</TableCell>
              <TableCell>Total Spent</TableCell>
              <TableCell>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRowComponent key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={Math.ceil(processedData.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Paper>
  );
};

export default TableWidget; 