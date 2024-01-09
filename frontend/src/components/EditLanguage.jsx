import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

const CustomTable = () => {
  const [editedData, setEditedData] = useState({
    word_id: null,
    foreign_name: "",
    finnish_name: "",
    category_name: "",
  });
  const { languageName } = useParams();
  const [data, setData] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [newExercise, setNewExercise] = useState({
    foreign_word: "",
    finnish_word: "",
    category: "",
  });
  const [addExerciseDialogOpen, setAddExerciseDialogOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []); // Make sure to handle the fetch logic (fetchData function)

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/words/${languageName}`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEditClick = (item) => {
    setEditedData({ ...item });
    setOpenEditDialog(true);
  };

  const handleSaveEdit = async () => {
    try {
      if (!editedData.editedField || !editedData[editedData.editedField]) {
        // Check if both field and value are present
        setError("Field and value are required for update");
        return;
      }

      console.log("Sending PATCH request...", editedData);

      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/words/${editedData.word_id}`,
        {
          field: editedData.editedField,
          value: editedData[editedData.editedField],
        }
      );

      console.log("Response from server:", response);
      fetchData();
      setOpenEditDialog(false); // Close the dialog after a successful update
    } catch (error) {
      console.error("Error updating data:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    }
  };

  const handleAddNewClick = () => {
    setNewExercise({
      foreign_word: "",
      finnish_word: "",
      category: "",
    });
    setAddExerciseDialogOpen(true);
  };

  const handleConfirmNew = async () => {
    try {
      if (
        !newExercise.foreign_word ||
        !newExercise.finnish_word ||
        !newExercise.category
      ) {
        setError("Please fill in all fields");
        return;
      }

      console.log("Adding new word pair...", newExercise);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/words/${languageName}`,
        newExercise
      );

      console.log("New word pair added:", response.data);
      fetchData();
      setAddExerciseDialogOpen(false);
    } catch (error) {
      console.error("Error adding new word pair:", error);
    }
  };

  const handleCancelNew = () => {
    setAddExerciseDialogOpen(false);
    setError("");
  };

  const handleInputChangeAdd = (e) => {
    const { name, value } = e.target;
    setNewExercise({
      ...newExercise,
      [name]: value,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value,
      editedField: name,
      editedValue: value,
    });
  };

  const handleDeleteClick = (id) => {
    setDeleteItemId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/words/${deleteItemId}`
      );
      setOpenDeleteDialog(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteItemId(null);
    setOpenDeleteDialog(false);
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddNewClick}
        style={{ marginBottom: 16 }}
      >
        Add new word pair
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>{languageName} word</TableCell>
              <TableCell>Finnish words</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.word_id}>
                <TableCell>{item.word_id}</TableCell>
                <TableCell>{item.foreign_word}</TableCell>
                <TableCell>{item.finnish_word}</TableCell>
                <TableCell>{item.category_name}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditClick(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteClick(item.word_id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <TextField
            label={languageName}
            fullWidth
            name="foreign_word"
            value={editedData.foreign_word}
            onChange={handleInputChange}
          />
          <TextField
            label="Finnish word"
            fullWidth
            name="finnish_word"
            value={editedData.finnish_word}
            onChange={handleInputChange}
          />
          <TextField
            label="Category"
            fullWidth
            name="category_name"
            value={editedData.category_name}
            onChange={handleInputChange}
          />
          {error && <Typography color="error">{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this item?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Exercise Dialog */}
      <Dialog open={addExerciseDialogOpen} onClose={handleCancelNew}>
        <DialogTitle>Add New Word Pair</DialogTitle>
        <DialogContent>
          {error && <Typography color="error">{error}</Typography>}
          <TextField
            label="Foreign Word"
            fullWidth
            name="foreign_word"
            value={newExercise.foreign_word}
            onChange={handleInputChangeAdd}
          />
          <TextField
            label="Finnish Word"
            fullWidth
            name="finnish_word"
            value={newExercise.finnish_word}
            onChange={handleInputChangeAdd}
          />
          <TextField
            label="Category"
            fullWidth
            name="category"
            value={newExercise.category}
            onChange={handleInputChangeAdd}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelNew}>Cancel</Button>
          <Button onClick={handleConfirmNew} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomTable;
