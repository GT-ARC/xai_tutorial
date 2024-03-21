import React, { useState, useEffect } from "react";

const Tutorial = (props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextButton = () => {
    setCurrentIndex(currentIndex + 1);
  };

  const handleBackButton = () => {
    setCurrentIndex(currentIndex - 1);
  };

  const handleModelCardButton = () => {
    setCurrentIndex(props.data.findIndex(item =>item.tag==="aboutModelCards"));
  };

  const handleModelExplanationButton = () => {
    setCurrentIndex(props.data.findIndex(item =>item.tag==="aboutModelExplanation"));
  };

  const { tag, title, description, elements } = props.data[currentIndex];

  const [imageExists, setImageExists] = useState(false);
  const [checkboxesExist, setCheckboxesExist] = useState(false);
  const [questionTableExists, setQuestionTableExists] = useState(false);

  const [selectedQuestions, setSelectedQuestions] = useState({
    global: false,
    local: false,
    counterfactual: false,
  });

  useEffect(() => {
    const hasImage = elements.some((item) => item.type === "image");
    setImageExists(hasImage);
  }, [elements]);

  useEffect(() => {
    const hasQuestionExists = elements.some((item) => item.type === "checkbox");
    setCheckboxesExist(hasQuestionExists);
  }, [elements]);

  useEffect(() => {
    const hasQuestionTable = elements.some((item) => item.type === "question");
    setQuestionTableExists(hasQuestionTable);
  }, [elements]);

  const [selectedOptions, setSelectedOptions] = useState([]);
  // Application (4rd index), data (5), performance (6), ethics (7)
  
  const handleCheckbox = (questionIndex) => {

    const elementExists = selectedOptions.some(item => (
      item[0] === tag && item[1] === questionIndex
    ));

    const newOption = [tag, questionIndex];

    if (elementExists) { // remove from list
      const updatedOptions = selectedOptions.filter(item => (
        item[0] !== tag || item[1] !== questionIndex
      ));
      setSelectedOptions(updatedOptions);
    }
    else {  // add to list
      setSelectedOptions(prevOptions => [...prevOptions, newOption]);
    }
  };

  const handleIsQuestionChecked = (event) => {
    const { id, checked } = event.target;
    setSelectedQuestions({
      ...selectedQuestions,
      [id]: checked,
    });
  };

  const [filteredExplanations, setFilteredExplanations] = useState([]);

  useEffect(() => {
    const newFilteredExplanations = [];

    for (let i = 0; i < selectedOptions.length; i++) {
      const option = selectedOptions[i];

      const filteredElement = props.data.find(item => item.tag === "modelCard").elements.find((element) => element.tag === option[0]);
      if (filteredElement) {
        const filteredExp = filteredElement.explanations.filter((explanation) => explanation.index === option[1]);

        filteredExp.forEach((explanation) => {
          const newItem = {
            tag: option[0],
            text: explanation.text
          };
          newFilteredExplanations.push(newItem);
        });
      }
    }

    setFilteredExplanations(newFilteredExplanations);

  }, [props.data, selectedOptions]);

  return (
    <div>

      <div
        class="next_button"
        onClick={handleNextButton}
        style={currentIndex === props.data.length-1 ? { display: "none" } : { display: "block" }}
      >
        <button class="page_switch_button next_page_button">
          <span>Weiter</span>
        </button>
      </div>
      <div
        class="back_button"
        onClick={handleBackButton}
        style={currentIndex === 0 ? { display: "none" } : { display: "block" }}
      >
        <button class="page_switch_button previous_page_button">
          <span>Zurück</span>
        </button>
      </div>

      <h1 className="page_title">{title}</h1>

      <div className='general_container'>
        <div class="title_and_description">
          <p dangerouslySetInnerHTML={{ __html: description }} class="description"/>
          {questionTableExists && elements.map(
          (item, index) =>
            item.type === "image" && (
              <img
                id={item.id}
                src={process.env.PUBLIC_URL + item.target}
                style={imageExists ? { display: "block" } : { display: "none" }}
              />
            )
          )}
        </div>

        <div className="container">

        {!questionTableExists && elements.map(
          (item, index) =>
            item.type === "image" && (
              <img
                id={item.id}
                src={process.env.PUBLIC_URL + item.target}
                style={imageExists ? { display: "block" } : { display: "none" }}
              />
            )
        )}

        <div style={checkboxesExist ? { display: "block" } : { display: "none" }} class="tutorial_question_part">
          <div className="titles">
            <p><b>Bist du an den folgenden Fragen interessiert? <br></br>Bitte wähle aus.</b></p>
            <p><b>Weiß ich schon /<br></br> Möchte ich wissen</b></p>
          </div>
          <div>
            {elements.map((item1) =>
              item1.type === "checkbox" && (
                <>
                  {item1.questions.map((item2) => (
                    <div className="question">
                      <p style={{ float: "left" }}>{item2.question}</p>
                      <div class="table-row">
                        <div class="checkbox-wrapper">
                          <input
                            id={tag + " " + item2.index}
                            type="checkbox"
                            checked={selectedOptions.some(item => (item[0] === tag && item[1] === item2.index)) ? true : false}
                            onChange={() => handleCheckbox(item2.index)}
                          />
                          <label for={tag + " " + item2.index}></label>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )
            )}
          </div>
        </div>

        <div className="question-table" style={questionTableExists ? { display: "block" } : { display: "none" }}>
          <div className="question_table">
          {elements.map(
            (item, index) =>
              item.type === "question" && 
              (<>
                <div class="table-header col col-1">
                  Sind Sie an dieser Frage interessiert?
                </div>
                <div class="table-row">
                    <div class="checkbox-wrapper">
                      <input
                        id={item.explanation_scope}
                        type="checkbox"
                        checked={selectedQuestions[item.explanation_scope]}
                        onChange={handleIsQuestionChecked}
                      />
                        <label for={item.explanation_scope}></label>
                    </div>
                </div>
              </>)
          )}
          </div>
        </div>

        </div>
      </div>

      <div className="output_parts">
      {tag === "modelCard" && filteredExplanations.length > 0 && (
          <>
            <div className="model_card_container">
              <p className="model_card_title"><b>MODEL CARD</b></p>
                <div className="cards">
                  
                  {filteredExplanations.filter(item => item.tag === "application").length > 0 && (
                    <div className="model_card_object">
                    <p className="description_yellow"><b><u>Anwendungsbereich</u></b></p>
                      {filteredExplanations.filter(item => item.tag === "application").map((item, index) => (
                        <div key={index}>
                          <div className="model_card_text"> • {item.text}</div>
                          <br/>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {filteredExplanations.filter(item => item.tag === "data").length > 0 && (
                    <div className="model_card_object">
                    <p className="description_yellow"><b><u>Daten</u></b></p>
                      {filteredExplanations.filter(item => item.tag === "data").map((item, index) => (
                        <div key={index}>
                          <div className="model_card_text"> • {item.text}</div>
                          <br/>
                       </div>
                      ))}
                    </div>
                  )}
                  
                  {filteredExplanations.filter(item => item.tag === "performance").length > 0 && (
                    <div className="model_card_object">
                    <p className="description_yellow"><b><u>Leistung</u></b></p>
                      {filteredExplanations.filter(item => item.tag === "performance").map((item, index) => (
                        <div key={index}>
                          <div className="model_card_text"> • {item.text}</div>
                          <br/>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {filteredExplanations.filter(item => item.tag === "ethics").length > 0 && (
                    <div className="model_card_object">
                    <p className="description_yellow"><b><u>Ethik</u></b></p>
                      {filteredExplanations.filter(item => item.tag === "ethics").map((item, index) => (
                        <div key={index}>
                          <div className="model_card_text"> • {item.text}</div>
                          <br/>
                        </div>
                      ))}
                    </div>
                  )}
                  
                </div>
            </div>
          </>
        )}
        {tag === "modelCard" && filteredExplanations.length === 0 && (
          <>
          <p className="description" style={{textAlign: 'center'}}><b>Sie haben keine gültige Wahl getroffen.<br></br><br></br>Bitte treffen Sie Ihre Wahl:</b></p>
          <button className="button_target_tab" onClick={handleModelCardButton}>Über Model Cards</button>
          </>
        )}

        {tag === "exampleCard" && (selectedQuestions.global || selectedQuestions.local || selectedQuestions.counterfactual) && (
          <div style={{display: "flex", justifyContent: "center"}}>
            <div className="example_card_container">
              <p className="example_card_title"><b>BEISPIELE</b></p>
                <div className="cards">
                  {selectedQuestions.global && (
                    <div className="model_card_object">
                      <div className="example_card_text">Global</div>
                        <div className="example_card_info">
                          <img src={process.env.PUBLIC_URL + props.data.find(item => item.tag === "question1").elements[1].example_target}/>
                          <div className="example_card_text2">{elements.find(item => item.tag === 'global')?.explanation}</div>
                        </div>
                    </div>
                  )}
                  {selectedQuestions.local && (
                    <div className="model_card_object">
                      <div className="example_card_text">Local</div>
                        <div className="example_card_info">
                          <img src={process.env.PUBLIC_URL + props.data.find(item => item.tag === "question2").elements[1].example_target}/>
                          <div className="example_card_text2">{elements.find(item => item.tag === 'local')?.explanation}</div>
                        </div>
                    </div>
                  )}
                  {selectedQuestions.counterfactual && (
                    <div className="model_card_object">
                      <div className="example_card_text">Counterfactual</div>
                        <div className="example_card_info">
                          <img src={process.env.PUBLIC_URL + props.data.find(item => item.tag === "question3").elements[1].example_target}/>
                          <div className="example_card_text2">{elements.find(item => item.tag === 'counterfactual')?.explanation}</div>
                        </div>
                    </div>
                  )}
                </div>
            </div>
          </div>
        )}
        {tag === "exampleCard" && !(selectedQuestions.global && selectedQuestions.local && selectedQuestions.counterfactual) && (
          <>
          <p className="description" style={{textAlign: 'center'}}><b>Sie haben keine gültige Wahl getroffen.<br></br><br></br>Bitte treffen Sie Ihre Wahl:</b></p>
          <button className="button_target_tab" onClick={handleModelExplanationButton}>Über Model Erklärung</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Tutorial;