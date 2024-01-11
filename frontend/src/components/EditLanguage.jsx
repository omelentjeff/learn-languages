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
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

// TODO: NEW CATEGORY DOESN'T APPEAR IN THE LIST UNTIL AFTER REFRESH

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
  const [categories, setCategories] = useState([]);
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

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

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/categories`
      );
      setCategories(response.data);
      console.log("Categories fetch: ", response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleEditClick = (item) => {
    setEditedData({
      ...item,
      editedField: "category_id", // Use "category_id" instead of "category_name"
      editedValue: item.category_id,
    });
    setOpenEditDialog(true);
  };

  const handleSaveEdit = async () => {
    try {
      if (!editedData.editedField || !editedData[editedData.editedField]) {
        setOpenEditDialog(false);
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
      setOpenEditDialog(false);
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
      category_id: "", // Set the initial value for category_id
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

      fetchCategories();

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

    if (name === "category_id") {
      const selectedCategory = categories.find(
        (category) => category.category_id === value
      );
      if (selectedCategory) {
        setEditedData({
          ...editedData,
          category_id: value,
          category_name: selectedCategory.category_name,
        });
      }
    } else {
      setEditedData({
        ...editedData,
        [name]: value,
        editedField: name,
        editedValue: value,
      });
    }
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

  const handleAddNewCategory = () => {
    setAddCategoryDialogOpen(true);
  };

  const handleNewCategoryInputChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleConfirmNewCategory = async () => {
    try {
      console.log("Adding new category...", newCategory);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/categories/`,
        { category: newCategory }
      );

      console.log("New word pair added:", response.data);

      fetchCategories();
      setAddCategoryDialogOpen(false);
    } catch (error) {
      console.error("Error adding new category:", error);
    }
  };

  const handleCancelNewCategory = () => {
    setAddCategoryDialogOpen(false);
    setError("");
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
              <TableCell>Finnish word</TableCell>
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
            select
            label="Category"
            fullWidth
            name="category_id"
            value={editedData.category_id}
            onChange={handleInputChange}
          >
            {categories.map((category) => (
              <MenuItem key={category.category_id} value={category.category_id}>
                {category.category_name}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddNewCategory}
            style={{ marginTop: 16 }}
          >
            Add New Category
          </Button>

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
            label={languageName + " word"}
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
            select
            label="Category"
            fullWidth
            name="category_id"
            value={newExercise.category_id}
            onChange={handleInputChangeAdd}
          >
            {categories.map((category) => (
              <MenuItem key={category.category_id} value={category.category_id}>
                {category.category_name}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddNewCategory}
            style={{ marginTop: 16 }}
          >
            Add New Category
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelNew}>Cancel</Button>
          <Button onClick={handleConfirmNew} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={addCategoryDialogOpen} onClose={handleCancelNewCategory}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            label="Category Name"
            fullWidth
            name="newCategory"
            value={newCategory}
            onChange={handleNewCategoryInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelNewCategory}>Cancel</Button>
          <Button onClick={handleConfirmNewCategory} color="primary">
            Add Category
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomTable;
