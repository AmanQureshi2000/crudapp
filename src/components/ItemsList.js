import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  IconButton,
  CircularProgress,
  Box,
  Alert,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ItemsList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    itemId: null,
    itemName: ''
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('https://apdv-api.onrender.com/api/items');
      setItems(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id, name) => {
    setDeleteConfirm({
      open: true,
      itemId: id,
      itemName: name
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`https://apdv-api.onrender.com/api/items/${deleteConfirm.itemId}`);
      fetchItems();
    } catch (err) {
      setError(err.message || 'Failed to delete item');
    } finally {
      setDeleteConfirm({
        open: false,
        itemId: null,
        itemName: ''
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({
      open: false,
      itemId: null,
      itemName: ''
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={2}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={fetchItems} variant="contained" sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Items List
      </Typography>
      <Box mb={2}>
        <Button 
          component={Link} 
          to="/items/new" 
          variant="contained" 
          color="primary"
        >
          Add New Item
        </Button>
      </Box>
      
      {items.length === 0 ? (
        <Alert severity="info">No items found. Add a new item to get started.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item._id || item.id}>
                  <TableCell>{item._id || item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    <IconButton 
                      component={Link} 
                      to={`/items/${item._id || item.id}`} 
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDeleteClick(item._id || item.id, item.name)} 
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={deleteConfirm.open} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{deleteConfirm.itemName}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ItemsList;