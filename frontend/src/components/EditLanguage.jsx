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
        console.error("Field and value are required for update");
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

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/words/${id}`);

      const updatedWords = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/words/${languageName}`
      );
      setData(updatedWords.data);
    } catch (error) {
      console.error("Error deleting row:", error);
    }
    fetchData();
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

  return (
    <div>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomTable;
