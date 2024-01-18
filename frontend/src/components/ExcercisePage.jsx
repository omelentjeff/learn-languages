import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "./Layout";

const ExercisePage = () => {
  const { state } = useLocation();
  const { languageName, selectedCategories } = state;
  const [exercises, setExercises] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/words`,
        {
          language: languageName,
          categories: selectedCategories,
        },
        { withCredentials: true }
      );
      setExercises(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleBackHome = () => {
    navigate("/home");
  };

  const handlePlayAgain = () => {
    navigate(`/${languageName}`);
  };

  const handleAnswerSubmit = (answer, form) => {
    const currentExercise = exercises[currentQuestionIndex];

    const isCorrect =
      answer.toLowerCase() === currentExercise.finnish_word.toLowerCase();

    setUserAnswers((prevAnswers) => [
      ...prevAnswers,
      {
        question: currentExercise.foreign_word,
        answer,
        isCorrect,
      },
    ]);

    form.reset();
    if (currentQuestionIndex < exercises.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setExerciseCompleted(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!exerciseCompleted && currentQuestionIndex < exercises.length) {
    const currentExercise = exercises[currentQuestionIndex];
    return (
      <Layout>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div style={{ maxWidth: "500px", margin: "auto" }}>
            <h2 style={{ marginBottom: "20px" }}>
              Question {currentQuestionIndex + 1}
            </h2>
            <p style={{ fontSize: "1.2em" }}>{currentExercise.foreign_word}</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const userAnswer = e.target.answer.value;
                handleAnswerSubmit(userAnswer, e.target);
              }}
              style={{ marginTop: "20px" }}
            >
              <div style={{ marginBottom: "15px" }}>
                <input
                  type="text"
                  name="answer"
                  style={{
                    width: "100%",
                    padding: "12px 20px",
                    margin: "8px 0",
                    display: "inline-block",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                    fontSize: "1em",
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  width: "100%",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  padding: "14px 20px",
                  margin: "8px 0",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ textAlign: "center" }}>
        <h2>Results:</h2>
        {exercises.length > 0 ? (
          <>
            <ul>
              {userAnswers.map((item, index) => (
                <li key={index} style={{ listStyle: "none" }}>
                  <strong>{index}.</strong> {item.question},{" "}
                  <strong>Your Answer:</strong> {item.answer},{" "}
                  <strong>Your Answer:</strong> {item.answer},{" "}
                  <strong>{item.isCorrect ? "Correct" : "Wrong"}</strong>
                </li>
              ))}
            </ul>
            <h2>
              You scored:{" "}
              {userAnswers.filter((answer) => answer.isCorrect).length} /{" "}
              {exercises.length}
            </h2>
          </>
        ) : (
          <p>No exercises available</p>
        )}
      </div>
      <div
        style={{
          marginTop: "20px",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={handleBackHome}
          style={{
            maxWidth: "100%",
            backgroundColor: "blue",
            color: "white",
            padding: "14px 20px",
            margin: "8px 0",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Back Home
        </button>
        <button
          onClick={handlePlayAgain}
          style={{
            maxWidth: "100%",
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "14px 20px",
            margin: "8px 0",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Play Again
        </button>
      </div>
    </Layout>
  );
};

export default ExercisePage;
