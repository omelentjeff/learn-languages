import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";

export default function CheckboxList({ onSelectCategories }) {
  const [checked, setChecked] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const { languageName } = useParams();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/categories/${languageName}`,
        { withCredentials: true }
      );
      console.log(response.data);
      setCategoryData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    onSelectCategories(newChecked);
  };

  useEffect(() => {
    onSelectCategories(checked);
  }, [onSelectCategories, checked]);

  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
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
                  checked={checked.indexOf(category.category_id) !== -1}
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
