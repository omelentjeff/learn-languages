import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Layout from "./Layout";

const ExcercisePage = () => {
  const { state } = useLocation();
  const { languageName, selectedCategories } = state;
  const [exercises, setExercises] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);

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

  const handleAnswerSubmit = (answer) => {
    const currentExercise = exercises[currentQuestionIndex];

    // Validate the answer
    const isCorrect =
      answer.toLowerCase() === currentExercise.finnish_word.toLowerCase();

    // Store the user's answer
    setUserAnswers((prevAnswers) => [
      ...prevAnswers,
      {
        question: currentExercise.foreign_word,
        answer,
        isCorrect,
      },
    ]);

    setIsAnswerCorrect(isCorrect);

    // Move to the next question after a delay (for demonstration purposes)
    setTimeout(() => {
      setIsAnswerCorrect(null);
      if (currentQuestionIndex < exercises.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Handle the end of the exercise
        setExerciseCompleted(true);
      }
    }, 1000); // Adjust the delay as needed
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!exerciseCompleted && currentQuestionIndex < exercises.length) {
    // Display the question
    const currentExercise = exercises[currentQuestionIndex];
    return (
      <Layout>
        <div style={{ textAlign: "center" }}>
          {isAnswerCorrect !== null && (
            <div style={{ color: isAnswerCorrect ? "green" : "red" }}>
              {isAnswerCorrect ? "Correct!" : "Incorrect."}
            </div>
          )}

          <div>
            <h2>Question {currentQuestionIndex + 1}</h2>
            <p>{currentExercise.foreign_word}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const userAnswer = e.target.answer.value;
                handleAnswerSubmit(userAnswer);
              }}
              style={{ maxWidth: "300px", margin: "auto" }}
            >
              <label style={{ display: "block", marginBottom: "10px" }}>
                Your Answer:
                <input
                  type="text"
                  name="answer"
                  style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box",
                  }}
                />
              </label>
              <button
                type="submit"
                style={{
                  background: "#4CAF50",
                  color: "white",
                  padding: "10px 15px",
                  border: "none",
                  borderRadius: "5px",
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

  // Display the list of questions and answers at the end
  return (
    <Layout>
      <div style={{ textAlign: "center" }}>
        <h2>Results:</h2>
        {exercises.length > 0 ? (
          <>
            <ul>
              {userAnswers.map((item, index) => (
                <li key={index} style={{ listStyle: "none" }}>
                  <strong>Question:</strong> {item.question},{" "}
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
    </Layout>
  );
};

export default ExcercisePage;
