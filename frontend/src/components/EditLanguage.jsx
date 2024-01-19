/**
 * @fileoverview This file defines the CustomTable component, a React component used
 * for displaying and managing language exercises. It includes functionality for adding,
 * editing, and deleting word pairs and categories. The component uses Material-UI components
 * for the UI and Axios for making HTTP requests.
 */
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
  IconButton,
  Menu,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";

/**
 * CustomTable component for displaying and managing word pairs and categories.
 *
 * @returns {ReactElement} A table component with add, edit, and delete functionalities for word pairs and categories.
 */
const CustomTable = () => {
  /**
   * State to store edited data for an exercise with initial values.
   *
   * @type {Object}
   * @property {number|null} word_id - The ID of the word, initially set to null.
   * @property {string} foreign_name - The foreign word name, initially an empty string.
   * @property {string} finnish_name - The Finnish word name, initially an empty string.
   * @property {string} category_name - The category name, initially an empty string.
   * @property {string} category_id - The category ID, initially an empty string.
   */
  const [editedData, setEditedData] = useState({
    word_id: null,
    foreign_name: "",
    finnish_name: "",
    category_name: "",
    category_id: "",
  });

  /**
   * React Router hook for accessing route parameters.
   *
   * @type {Object}
   * @property {string} languageName - The name of the language obtained from the route parameters.
   */
  const { languageName } = useParams();

  /**
   * State to store data with an initial empty array.
   *
   * @type {Array}
   */

  const [data, setData] = useState([]);

  /**
   * State to control the visibility of the edit dialog.
   *
   * @type {boolean}
   */

  const [openEditDialog, setOpenEditDialog] = useState(false);

  /**
   * State to control the visibility of the delete dialog.
   *
   * @type {boolean}
   */
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  /**
   * State to store the ID of the item to delete with an initial value of null.
   *
   * @type {number|null}
   */
  const [deleteItemId, setDeleteItemId] = useState(null);

  /**
   * State to store new exercise data with initial values.
   *
   * @type {Object}
   * @property {string} foreign_word - The foreign word name, initially an empty string.
   * @property {string} finnish_word - The Finnish word name, initially an empty string.
   * @property {string} category - The category name, initially an empty string.
   */
  const [newExercise, setNewExercise] = useState({
    foreign_word: "",
    finnish_word: "",
    category: "",
  });

  /**
   * State to control the visibility of the add exercise dialog.
   *
   * @type {boolean}
   */
  const [addExerciseDialogOpen, setAddExerciseDialogOpen] = useState(false);

  /**
   * State to store an error message with an initial empty string.
   *
   * @type {string}
   */
  const [error, setError] = useState("");

  /**
   * State to store categories with an initial empty array.
   *
   * @type {Array}
   */
  const [categories, setCategories] = useState([]);

  /**
   * State to control the visibility of the add category dialog.
   *
   * @type {boolean}
   */
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] = useState(false);

  /**
   * State to store the name of a new category with an initial empty string.
   *
   * @type {string}
   */
  const [newCategory, setNewCategory] = useState("");

  /**
   * State to track loading state.
   *
   * @type {boolean}
   */
  const [isLoading, setIsLoading] = useState(true);

  // Theme and media query hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  /**
   * Handles the click event to open the menu.
   * @param {Object} event - The event object.
   * @param {Object} item - The item data for the clicked row.
   */
  const handleClickMenu = (event, item) => {
    setAnchorEl(event.currentTarget);
    setEditedData(item);
  };

  /**
   * Closes the menu and resets its state.
   */
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const addWordPairButtonStyle = isMobile
    ? { maxWidth: "200px", margin: "10px auto", display: "block" }
    : { margin: "10px 0" };

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  // Fetch data functions and useEffect
  /**
   * Fetches data from the server and updates the table.
   */
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

  /**
   * Fetches categories data from the server.
   */
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

  // Event handlers for editing, adding, and deleting word pairs and categories
  /**
   * Handles the click event to open the edit dialog.
   * @param {Object|null} item - The item data to be edited. If null, a new item will be created.
   */
  const handleEditClick = (item = null) => {
    if (!isMobile && item) {
      setEditedData(item);
    }

    setOpenEditDialog(true);
    handleCloseMenu();
  };

  /**
   * Handles saving the edited data.
   */
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

  /**
   * Handles the click event to open the dialog for adding a new word pair.
   */
  const handleAddNewClick = () => {
    setNewExercise({
      foreign_word: "",
      finnish_word: "",
      category_id: "",
    });
    setAddExerciseDialogOpen(true);
  };

  /**
   * Handles the confirmation action for adding a new word pair.
   */
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

  /**
   * Handles the cancel button
   */
  const handleCancelNew = () => {
    setAddExerciseDialogOpen(false);
    setError("");
  };

  /**
   * Handles changes in the input fields of the form for adding a new exercise.
   * This function updates the state of the new exercise based on the input field changes.
   *
   * For the 'category_id' field, it finds the corresponding category object and updates both
   * the 'category_id' and 'category' (name) in the state. For other fields, it directly updates
   * the corresponding value in the newExercise state.
   *
   * @param {Object} e - The event object from the input field.
   */
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

  /**
   * Handles input changes in the form for editing an existing exercise.
   * This function updates the state of the edited data based on the changes in the input fields.
   *
   * For changes in the 'category_id' field, it finds the corresponding category object and updates
   * both the 'category_id' and 'category_name' in the editedData state. For other input fields, it
   * updates the corresponding value in the editedData state, along with the field name and value
   * that were changed.
   *
   * @param {Object} e - The event object from the input field, containing the name and value.
   */
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

  /**
   * Handles the click event for initiating the deletion process of an item.
   * This function sets the ID of the item to be deleted and opens the delete confirmation dialog.
   * It also ensures that any open menu is closed when the delete process is initiated.
   *
   * @param {number} id - The ID of the item to be deleted.
   */
  const handleDeleteClick = (id) => {
    // Set the ID of the item to be deleted
    setDeleteItemId(id);

    // Open the delete confirmation dialog
    setOpenDeleteDialog(true);

    // Close any open menu, as the delete action is initiated
    handleCloseMenu();
  };

  /**
   * Handles the confirmation of the delete action.
   * This asynchronous function sends a DELETE request to the server to remove the specified item
   * identified by the deleteItemId state. Upon successful deletion, it closes the delete confirmation
   * dialog and fetches the updated data. It handles any errors that occur during the request and ensures
   * that the menu anchor element is reset after the operation, regardless of the outcome.
   */
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

  /**
   * Handles the cancellation of the delete action.
   * This function resets the deleteItemId state to null and closes the delete confirmation dialog,
   * effectively cancelling the deletion process.
   */
  const handleCancelDelete = () => {
    // Reset the ID of the item to be deleted
    setDeleteItemId(null);

    // Close the delete confirmation dialog
    setOpenDeleteDialog(false);
  };

  /**
   * Handles the action to open the dialog for adding a new category.
   * This function sets the state to open the dialog where the user can input and submit a new category.
   */
  const handleAddNewCategory = () => {
    // Open the dialog for adding a new category
    setAddCategoryDialogOpen(true);
  };

  /**
   * Handles changes in the input field for adding a new category.
   * This function updates the newCategory state with the value from the input field,
   * ensuring that the state always reflects the current input.
   *
   * @param {Object} e - The event object from the input field.
   */
  const handleNewCategoryInputChange = (e) => {
    // Update the newCategory state with the current input
    setNewCategory(e.target.value);
  };

  /**
   * Handles the confirmation action for adding a new category.
   * This asynchronous function sends a POST request to the server to create a new category
   * using the value stored in the `newCategory` state. After successfully adding the new category,
   * it fetches the updated list of categories and closes the add category dialog.
   * Any errors encountered during the request are logged to the console.
   */
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

  /**
   * Handles the cancellation of the new category addition process.
   * This function closes the add category dialog and resets any error messages.
   * It's typically used when the user decides not to proceed with adding a new category.
   */
  const handleCancelNewCategory = () => {
    setAddCategoryDialogOpen(false);
    setError("");
  };

  // Conditional rendering based on loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    // JSX for table and dialog components

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
            {data.map((item, index) => (
              <TableRow key={item.word_id}>
                <TableCell>{index + 1}</TableCell>
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
                        <MenuItem onClick={() => handleEditClick()}>
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
            value={editedData.category_id || ""}
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
