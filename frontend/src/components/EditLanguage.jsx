import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from "@mui/material";

export default function EditLanguage() {
  const { languageName } = useParams();
  const [words, setWords] = useState([]);
  const [isAddExerciseDialogOpen, setAddExerciseDialogOpen] = useState(false);
  const [newExercise, setNewExercise] = useState({
    foreign_word: "",
    finnish_word: "",
    category: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/words/${languageName}`
        );
        setWords(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [languageName]);

  const columns = [
    { field: "word_id", headerName: "ID", width: 70 },
    {
      field: "foreign_word",
      headerName: `${languageName} Word`,
      type: "string",
      width: 150,
      editable: true,
    },
    {
      field: "finnish_word",
      headerName: "Finnish word",
      width: 150,
      editable: true,
    },
    {
      field: "category_name",
      headerName: "Category",
      width: 150,
      editable: true,
    },
  ];

  const getRowId = (row) => row.word_id;

  const handleEditCellChange = async (params) => {
    console.log("Edit cell changed:", params);
    try {
      console.log("Sending PATCH request...", params.formattedValue);
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/words/${params.id}`,
        { field: params.field, value: params.props.value }
      );

      console.log("Response from server:", response);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleAddExercise = async () => {
    if (
      !newExercise.foreign_word ||
      !newExercise.finnish_word ||
      !newExercise.category
    ) {
      console.error("Please fill in all fields");
      return;
    }

    console.log(newExercise);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/words/${languageName}`,
        newExercise
      );

      console.log("New exercise added:", response.data);

      // Refresh the data by refetching the list of exercises
      const updatedWords = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/words/${languageName}`
      );
      setWords(updatedWords.data);

      // Close the add exercise dialog
      setAddExerciseDialogOpen(false);
    } catch (error) {
      console.error("Error adding new exercise:", error);
    }
  };

  return (
    <div style={{ height: 400, width: "100%", marginTop: "5rem" }}>
      <h1 style={{ textAlign: "center" }}>Edit exercises for {languageName}</h1>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setAddExerciseDialogOpen(true)}
      >
        Add New Exercise
      </Button>

      <Dialog
        open={isAddExerciseDialogOpen}
        onClose={() => setAddExerciseDialogOpen(false)}
      >
        <DialogTitle>Add New Exercise</DialogTitle>
        <DialogContent>
          <TextField
            label={`${languageName} Word`}
            fullWidth
            value={newExercise.foreign_word}
            onChange={(e) =>
              setNewExercise({ ...newExercise, foreign_word: e.target.value })
            }
          />
          <TextField
            label="Finnish Word"
            fullWidth
            value={newExercise.finnish_word}
            onChange={(e) =>
              setNewExercise({ ...newExercise, finnish_word: e.target.value })
            }
          />
          <TextField
            label="Category"
            fullWidth
            value={newExercise.category}
            onChange={(e) =>
              setNewExercise({ ...newExercise, category: e.target.value })
            }
          />
        </DialogContent>
        <Button variant="contained" color="primary" onClick={handleAddExercise}>
          Add
        </Button>
      </Dialog>

      <DataGrid
        rows={words}
        columns={columns}
        getRowId={getRowId}
        onCellEditStop={handleEditCellChange}
        pageSizeOptions={[5, 10]}
        disableColumnFilter
        disableColumnMenu
        disableRowSelectionOnClick
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
      />
    </div>
  );
}
