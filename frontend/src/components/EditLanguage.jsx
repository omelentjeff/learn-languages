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
  useMediaQuery,
  useTheme,
  IconButton, // New import
  Menu, // New import
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";

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
  const [isLoading, setIsLoading] = useState(true);
  const [menuRowId, setMenuRowId] = useState(null);

  const theme = useTheme(); // Use the theme
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const tableContainerStyle = isMobile ? { overflowX: "auto" } : {};

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleClickMenu = (event, item) => {
    setAnchorEl(event.currentTarget);
    setMenuRowId(item.word_id); // Track which row's menu is open
  };

  // When closing the menu, reset the menu state
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuRowId(null);
  };

  const addWordPairButtonStyle = isMobile
    ? { maxWidth: "200px", margin: "10px auto", display: "block" }
    : { margin: "10px 0" };

  const buttonStyle = isMobile
    ? { margin: "8px 0", width: "100%" }
    : { margin: "10px 0" };

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/words/${languageName}`,
        { withCredentials: true }
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/categories`,
        { withCredentials: true }
      );
      setCategories(response.data);
      console.log("Categories fetch: ", response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleEditClick = () => {
    const itemToEdit = data.find((item) => item.word_id === menuRowId);
    if (itemToEdit) {
      setEditedData(itemToEdit);
      setOpenEditDialog(true);
    }
    handleCloseMenu(); // Close the menu after setting the edit data
  };

  const handleSaveEdit = async () => {
    try {
      if (
        !editedData.foreign_word ||
        !editedData.finnish_word ||
        !editedData.category_id
      ) {
        setError("Please fill in all fields");
        return;
      }

      // Extract only the edited fields from the editedData
      const editedFields = {};
      if (editedData.foreign_word !== undefined) {
        editedFields.foreign_word = editedData.foreign_word;
      }
      if (editedData.finnish_word !== undefined) {
        editedFields.finnish_word = editedData.finnish_word;
      }
      if (editedData.category_id !== undefined) {
        editedFields.category_id = editedData.category_id;
      }

      console.log("Sending PUT request...", editedFields);

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/words/${editedData.word_id}`,
        editedFields,
        { withCredentials: true }
      );

      console.log("Response from server:", response);
      fetchData();
      setOpenEditDialog(false);
    } catch (error) {
      console.error("Error updating data:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    } finally {
      setAnchorEl(null);
    }
  };

  const handleAddNewClick = () => {
    setNewExercise({
      foreign_word: "",
      finnish_word: "",
      category_id: "",
    });
    setAddExerciseDialogOpen(true);
  };

  const handleConfirmNew = async () => {
    try {
      if (
        !newExercise.foreign_word ||
        !newExercise.finnish_word ||
        !newExercise.category_id
      ) {
        setError("Please fill in all fields");
        return;
      }

      console.log("Adding new word pair...", newExercise);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/words/${languageName}`,
        newExercise,
        { withCredentials: true }
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

    if (name === "category_id") {
      const selectedCategory = categories.find(
        (category) => category.category_id === value
      );
      if (selectedCategory) {
        setNewExercise({
          ...newExercise,
          category_id: value,
          category: selectedCategory.category_name,
        });
      }
    } else {
      setNewExercise({
        ...newExercise,
        [name]: value,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "category_id") {
      const selectedCategory = categories.find(
        (category) => category.category_id === value
      );
      if (selectedCategory) {
        setEditedData((prevData) => ({
          ...prevData,
          category_id: value,
          category_name: selectedCategory.category_name,
        }));
      }
    } else {
      setEditedData((prevData) => ({
        ...prevData,
        [name]: value,
        editedField: name,
        editedValue: value,
      }));
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteItemId(id);
    setOpenDeleteDialog(true);

    handleCloseMenu();
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/words/${deleteItemId}`,
        { withCredentials: true }
      );
      setOpenDeleteDialog(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting row:", error);
    } finally {
      setAnchorEl(null);
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
        { category: newCategory },
        { withCredentials: true }
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          style={addWordPairButtonStyle}
          variant="contained"
          color="primary"
          onClick={handleAddNewClick}
        >
          Add new word pair
        </Button>
      </div>
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
                  {isMobile ? (
                    <>
                      <IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={(event) => handleClickMenu(event, item)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={openMenu}
                        onClose={handleCloseMenu}
                      >
                        <MenuItem onClick={() => handleEditClick(item)}>
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleDeleteClick(item.word_id)}
                        >
                          Delete
                        </MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <div style={{ display: "flex", gap: "8px" }}>
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
                    </div>
                  )}
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
