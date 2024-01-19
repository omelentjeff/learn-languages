import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const ExercisePage = () => {
  const { state } = useLocation();
  const { languageName, selectedCategories, languageChoice } = state;
  const [exercises, setExercises] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

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
    } finally {
      setIsLoading(false);
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

    const correctAnswer =
      languageChoice === languageName
        ? currentExercise.foreign_word.toLowerCase()
        : currentExercise.finnish_word.toLowerCase();

    const isCorrect = answer.toLowerCase() === correctAnswer;

    setUserAnswers((prevAnswers) => [
      ...prevAnswers,
      {
        question: currentExercise.foreign_word,
        correctAnswer:
          languageChoice === languageName
            ? currentExercise.foreign_word
            : currentExercise.finnish_word,
        userAnswer: answer,
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!exerciseCompleted && currentQuestionIndex < exercises.length) {
    const currentExercise = exercises[currentQuestionIndex];
    const question =
      languageChoice === languageName
        ? currentExercise.finnish_word
        : currentExercise.foreign_word;

    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <div style={{ maxWidth: "90%", margin: "auto" }}>
          <h2 style={{ marginBottom: "20px" }}>
            Question {currentQuestionIndex + 1}
          </h2>
          <p style={{ fontSize: "1.3em" }}>{question}</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const userAnswer = e.target.answer.value;
              handleAnswerSubmit(userAnswer, e.target);
            }}
            style={{
              marginTop: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ marginBottom: "15px" }}>
              <input
                type="text"
                name="answer"
                style={{
                  width: "100%",
                  padding: "8px 15px",
                  margin: "8px 0",
                  display: "block",
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
                width: "auto",
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "10px 15px",
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
    );
  }

  return (
    <div style={{ textAlign: "left", padding: "20px" }}>
      <div style={{ maxWidth: "90%", margin: "auto" }}>
        <h2>Results:</h2>
        {exercises.length > 0 ? (
          <>
            <ul
              style={{
                padding: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              {userAnswers.map((item, index) => (
                <li
                  key={index}
                  style={{
                    listStyle: "none",
                    marginBottom: "10px",
                    fontSize: "1.1em",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <strong>{index + 1}.</strong> {item.question},
                    <strong> Your Answer:</strong> {item.userAnswer},
                    {!item.isCorrect && (
                      <>
                        <strong> Correct Answer:</strong> {item.correctAnswer},
                      </>
                    )}
                  </div>
                  <div>
                    {item.isCorrect ? (
                      <CheckIcon sx={{ color: "green" }} />
                    ) : (
                      <CloseIcon sx={{ color: "red" }} />
                    )}
                  </div>
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
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          onClick={handleBackHome}
          style={{
            width: "auto",
            backgroundColor: "blue",
            color: "white",
            padding: "10px 15px",
            margin: "8px 5px",
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
            width: "auto",
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px 15px",
            margin: "8px 5px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default ExercisePage;
