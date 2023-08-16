import React from "react";
import { Typeahead } from "react-bootstrap-typeahead";
export class EditProgramme extends React.Component {
  exerciseArrayChange = (arr) => {
    const { setExerciseArray, editingProgrammeExerciseArray } = this.props;
    setExerciseArray(
      editingProgrammeExerciseArray.concat(arr.map((ex) => ex.id))
    );
    this._typeahead.clear();
    this._typeahead.clear();
  };
  render() {
    const {
      exercises,
      editingProgrammeExerciseArray,
      parentThis,
      usedExercises,
    } = this.props;
    console.log(usedExercises);
    const { pictures } = parentThis.state;
    console.log(editingProgrammeExerciseArray);
    const exercisesInDropDown = exercises.filter(
      (ex) =>
        editingProgrammeExerciseArray.indexOf(ex.id) === -1 &&
        !usedExercises.includes(ex.id)
    );
    console.log(exercisesInDropDown);
    return (
      <div className=" programme">
        <div className="row">
          <div className="col">
            <input
              type="text"
              className="form-control title"
              placeholder="Titel"
            />
          </div>
          <div className="col">
            <Typeahead
              labelKey="name"
              options={exercisesInDropDown}
              labelKey={"title"}
              ref={(ref) => (this._typeahead = ref)}
              onChange={this.exerciseArrayChange}
              placeholder="Tilføj øvelse"
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control description"
              placeholder="Beskrivelse"
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control pictureId"
              placeholder="Billedid"
            />
          </div>
          <div className="col">
            <input type="text" className="form-control url" placeholder="Url" />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="audioQuestionCB"
              />
              <label className="form-check-label" htmlFor="audioQuestionCB">
                Lydspørgsmål
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="usePictureAsAnswerCB"
              />
              <label
                className="form-check-label"
                htmlFor="usePictureAsAnswerCB"
              >
                Brug billede som svar
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="exerciseTitleInHeaderCB"
              />
              <label
                className="form-check-label"
                htmlFor="exerciseTitleInHeaderCB"
              >
                Vis øvelsestitel i header
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
