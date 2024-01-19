/**
 * @fileoverview This file defines the LoadingSpinner component, which is a simple,
 * reusable component that displays a circular progress indicator. This component is
 * typically used to indicate that a page or a section of the application is loading or
 * performing an asynchronous task.
 */

import CircularProgress from "@mui/material/CircularProgress";

/**
 * LoadingSpinner component that displays a circular progress indicator.
 * It centers the spinner both vertically and horizontally within its container,
 * covering the full viewport height.
 *
 * @returns {ReactElement} A component with a centered CircularProgress spinner.
 */
const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <CircularProgress />
  </div>
);

export default LoadingSpinner;
