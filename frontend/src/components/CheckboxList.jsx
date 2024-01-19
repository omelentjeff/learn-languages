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

export default function CheckboxList({ onSelectCategories }) {
  const [checked, setChecked] = useState([]);
  const [checkboxStates, setCheckboxStates] = useState({});
  const [isFirstInteraction, setIsFirstInteraction] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const { languageName } = useParams();
  const [isLoading, setIsLoading] = useState(true);

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

  const handleToggle = (value) => () => {
    setCheckboxStates((prev) => ({ ...prev, [value]: !prev[value] }));

    if (isFirstInteraction) {
      setChecked([value]);
      setIsFirstInteraction(false);
    } else {
      const currentIndex = checked.indexOf(value);
      let newChecked = [...checked];
      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked = newChecked.filter((id) => id !== value);
      }
      setChecked(newChecked);
    }

    onSelectCategories(isFirstInteraction ? [value] : checked);
  };

  useEffect(() => {
    onSelectCategories(checked);
  }, [onSelectCategories, checked]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
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
