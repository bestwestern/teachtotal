import React from "react";
import ReactDOM from "react-dom";
import { EditExercise } from "./EditExercise";
import { EditProgramme } from "./EditProgramme";
import { PictureAdd } from "./PictureAdd";
import { Pictures } from "./Pictures";
import { Exercises } from "./Exercises";
import { Programmes } from "./Programmes";
import {
  getData,
  saveExercise,
  saveProgramme,
  delExercise,
  delProgramme,
  exTemplate,
  prTemplate,
  copyToPupil,
  convertPictures,
} from "./utils";
class App extends React.Component {
  componentDidMount() {
    getData.call(this);
  }
  cancelProgrammeEdit = (id) => {
    let pr = this.state.programmes.find((pr) => pr.id === id);
    let params = { ...prTemplate };
    for (var prop in params) {
      document
        .getElementsByClassName("programme")[0]
        .getElementsByClassName(prop)[0].value = "";
    }
    document.getElementById("audioQuestionCB").checked = false;
    document.getElementById("usePictureAsAnswerCB").checked = false;
    document.getElementById("exerciseTitleInHeaderCB").checked = false;
    this.setState({
      editingProgrammeId: null,
      editingProgrammeExerciseArray: [],
    });
  };
  setExerciseArray = (arr) =>
    this.setState({ editingProgrammeExerciseArray: arr });
  exClick = (action, id) => {
    switch (action) {
      case "del":
        delExercise.call(this, id);
        break;
      case "edit":
        let params = { ...exTemplate };
        let ex = this.state.exercises.find((ex) => ex.id === id);
        for (var prop in params)
          document
            .getElementsByClassName("exercise")[0]
            .getElementsByClassName(prop)[0].value = ex[prop] || "";
        this.setState({ editingExerciseId: id });
        break;
    }
  };
  prClick = (action, id) => {
    switch (action) {
      case "del":
        delProgramme.call(this, id);
        break;
      case "edit":
        let params = { ...prTemplate };
        let pr = this.state.programmes.find((pr) => pr.id === id);
        let usedExercises = [];
        this.state.programmes.forEach(
          (pr) => (usedExercises = [...usedExercises, ...pr.exercises])
        );
        for (var prop in params) {
          document
            .getElementsByClassName("programme")[0]
            .getElementsByClassName(prop)[0].value = pr[prop];
        }
        document.getElementById("audioQuestionCB").checked = pr.audioQuestion;
        document.getElementById("usePictureAsAnswerCB").checked =
          pr.usePictureAsAnswer;
        document.getElementById("exerciseTitleInHeaderCB").checked =
          pr.exerciseTitleInHeader;
        this.setState({
          editingProgrammeId: id,
          editingProgrammeExerciseArray: pr.exercises,
          usedExercises,
        });
        break;
    }
  };
  state = {
    exercises: [],
    editingExerciseId: null,
    programmes: [],
    editingProgrammeId: null,
    editingProgrammeExerciseArray: [],
    imgData: [],
    chosenIconPictureId: null,
    usedExercises: [],
    sites: [],
    selectedSiteIndex: 0,
  };

  render() {
    const {
      exercises,
      editingExerciseId,
      programmes,
      editingProgrammeExerciseArray,
      editingProgrammeId,
      selectedSiteIndex,
      exDict,
      exToPr,
      sites,
      pictures,
      usedExercises,
      pictureDic,
    } = this.state;
    const selectedSiteprogrammeIds =
      sites.length > 0 && sites[selectedSiteIndex].programmes;
    console.log(selectedSiteprogrammeIds);
    return (
      <React.Fragment>
        <Pictures pictures={pictures} exercises={exercises} parentThis={this} />
        <PictureAdd parentThis={this} />
        <div className="row">
          <div className="col">
            <Exercises
              parentThis={this}
              exercises={exercises}
              exClick={this.exClick}
              exToPr={exToPr}
            />
            <EditExercise saveExercise={saveExercise.bind(this)} />
            <button
              type="button"
              className="btn btn-primary"
              onClick={saveExercise.bind(this)}
            >
              {editingExerciseId
                ? "Gem ændringer"
                : "Tilføj" +
                  (editingProgrammeId ? " " + editingProgrammeId : "")}
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h2>Programmer</h2>
            <Programmes programmes={programmes} prClick={this.prClick} />
            <EditProgramme
              parentThis={this}
              editingProgrammeExerciseArray={editingProgrammeExerciseArray}
              exercises={exercises}
              programmes={programmes}
              usedExercises={usedExercises}
              setExerciseArray={this.setExerciseArray}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={saveProgramme.bind(this)}
            >
              {editingProgrammeId ? "Gem ændringer" : "Tilføj"}
            </button>
            {editingProgrammeId && (
              <button
                type="button"
                className="btn btn-warning"
                onClick={this.cancelProgrammeEdit.bind(
                  this,
                  editingProgrammeId
                )}
              >
                Annuller
              </button>
            )}
            {editingProgrammeExerciseArray.map((pexId) => {
              return (
                exDict[pexId] && (
                  <div
                    key={pexId}
                    className="alert alert-warning alert-dismissible fade show"
                    role="alert"
                  >
                    <strong>{exDict[pexId].title}</strong>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="alert"
                      aria-label="Close"
                      onClick={() =>
                        this.setState({
                          editingProgrammeExerciseArray:
                            editingProgrammeExerciseArray.filter(
                              (eid) => eid !== pexId
                            ),
                        })
                      }
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                )
              );
            })}
          </div>
        </div>
        <div className="row" style={{ paddingTop: "20px" }}>
          <div className="col">
            <div className="list-group">
              {programmes.length > 0 &&
                sites.map((site, index) => {
                  return (
                    <button
                      onClick={(e) =>
                        this.setState({ selectedSiteIndex: index })
                      }
                      type="button"
                      className={
                        "list-group-item list-group-item-action " +
                        (selectedSiteIndex === index ? "active" : "")
                      }
                      aria-current="true"
                    >
                      <strong>{site.name}</strong>
                      <hr />
                      <span>
                        {site.programmes
                          .map(
                            (siteProgrammeId) =>
                              programmes.find(
                                (programme) => programme.id === siteProgrammeId
                              ).title
                          )
                          .join(", ")}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="row" style={{ paddingTop: "20px" }}>
          <div className="col">
            <button
              type="button"
              className="btn btn-primary"
              onClick={(e) =>
                copyToPupil(JSON.stringify(selectedSiteprogrammeIds))
              }
            >
              Opdater front
            </button>
            <button type="button" onClick={convertPictures}>
              Konverter billeder
            </button>
            <audio
              src="https://ssl.gstatic.com/dictionary/static/sounds/oxford/black--_gb_1.mp3"
              controls={true}
            ></audio>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
ReactDOM.render(<App />, document.getElementById("root"));
