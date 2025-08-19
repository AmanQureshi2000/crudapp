import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Paper, 
  CircularProgress,
  Alert
} from '@mui/material';

const ItemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [item, setItem] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (id && id !== 'new') {
      fetchItem();
    }
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://apdv-api.onrender.com/api/items/${id}`);
      setItem(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id && id !== 'new') {
        await axios.put(`https://apdv-api.onrender.com/api/items/${id}`, item);
      } else {
        await axios.post('https://apdv-api.onrender.com/api/items', item);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading && !error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        {id ? 'Edit Item' : 'Add New Item'}
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          name="name"
          value={item.name}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="description"
          value={item.description}
          onChange={handleChange}
          multiline
          rows={4}
          required
        />
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {id ? 'Update' : 'Save'}
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            sx={{ ml: 2 }}
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default ItemForm;