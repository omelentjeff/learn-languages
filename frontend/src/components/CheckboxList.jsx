/**
 * @fileoverview This file defines the CheckboxList component, which is used
 * in a React application for displaying a list of checkboxes. Each checkbox represents
 * a category, and the component allows for selecting multiple categories. It uses
 * Material-UI components for the UI and Axios for making HTTP requests.
 */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";

/**
 * CheckboxList component for displaying and selecting categories.
 *
 * @param {Object} props - Props for CheckboxList component.
 * @param {Function} props.onSelectCategories - Function to handle the selection of categories.
 * @returns {ReactElement} A list of checkboxes representing categories.
 */
export default function CheckboxList({ onSelectCategories }) {
  /**
   * State to store an array of checked items.
   *
   * @type {Array}
   */
  const [checked, setChecked] = useState([]);

  /**
   * State to store checkbox states.
   *
   * @type {Object}
   */
  const [checkboxStates, setCheckboxStates] = useState({});

  /**
   * State to track if it's the first interaction.
   *
   * @type {boolean}
   */
  const [isFirstInteraction, setIsFirstInteraction] = useState(true);

  /**
   * State to store category data.
   *
   * @type {Array}
   */
  const [categoryData, setCategoryData] = useState([]);

  /**
   * React Router hook for accessing route parameters.
   *
   * @type {Object}
   * @property {string} languageName - The name of the language obtained from the route parameters.
   */
  const { languageName } = useParams();

  /**
   * State to track loading state.
   *
   * @type {boolean}
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetches category data from the server.
   */
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/categories/${languageName}`,
        { withCredentials: true }
      );
      setCategoryData(response.data);

      const allCategoryIds = response.data.map(
        (category) => category.category_id
      );
      setChecked(allCategoryIds);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Handles toggling of a checkbox.
   *
   * @param {number} value - The ID of the category associated with the checkbox.
   */
  const handleToggle = (value) => () => {
    // Checkbox toggle logic
  };

  /**
   * This useEffect hook is used to update the selected categories whenever there's a change in the `checked` array or
   * the `onSelectCategories` function. This ensures that the parent component is notified every time the selection changes.
   * Essentially, it's used to propagate the state changes of the checkboxes (which categories are selected) to the parent component.
   */
  useEffect(() => {
    onSelectCategories(checked);
  }, [onSelectCategories, checked]);

  // Conditional rendering based on loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    // JSX for rendering the list of checkboxes
    <List
      sx={{
        width: "100%",
        maxWidth: "100%",
        bgcolor: "background.paper",
      }}
    >
      {categoryData.map((category) => {
        const labelId = category.category_id;

        return (
          <ListItem key={category.category_id} disablePadding>
            <ListItemButton
              role={undefined}
              onClick={handleToggle(category.category_id)}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={
                    isFirstInteraction
                      ? false
                      : checkboxStates[category.category_id] || false
                  }
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={category.category_name} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
