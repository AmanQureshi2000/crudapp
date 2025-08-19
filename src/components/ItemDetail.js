import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Typography, 
  Paper, 
  Box, 
  Button, 
  CircularProgress,
  Alert
} from '@mui/material';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await axios.get(`https://apdv-api.onrender.com/api/items/${id}`);
      setItem(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://apdv-api.onrender.com/api/items/${id}`);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!item) {
    return <Alert severity="warning">Item not found</Alert>;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        {item.name}
      </Typography>
      <Typography variant="body1" paragraph>
        {item.description}
      </Typography>
      <Box mt={3}>
        <Button 
          component={Link} 
          to={`/items/${id}/edit`} 
          variant="contained" 
          color="primary"
          sx={{ mr: 2 }}
        >
          Edit
        </Button>
        <Button 
          variant="contained" 
          color="error"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Box>
    </Paper>
  );
};

export default ItemDetail;