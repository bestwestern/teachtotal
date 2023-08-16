import React from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { addPictureToExercise } from "./utils";
export class Pictures extends React.Component {
  imgError = (pic) => {
    let exerciseIdsForThisPic = [];
    this.props.exercises.forEach((ex) => {
      const picId = ex.pictureId;
      if (picId == pic.id) {
        exerciseIdsForThisPic.push(ex.id);
      }
    });
    this.setState((prevState) => {
      return {
        ...prevState,
        imgIdToExerciseIds: {
          ...prevState.imgIdToExerciseIds,
          [pic.id]: exerciseIdsForThisPic,
        },
      };
    });
  };
  exerciseArrayChange = (pictureId, arr) => {
    const { parentThis } = this.props;
    if (arr.length) {
      addPictureToExercise.call(parentThis, arr[0].id, pictureId);
      this.setState({ updatingPictureId: pictureId }, () => {
        this.setState({ updatingPictureId: null });
      });
    }
  };
  state = { updatingPictureId: null, showing: false, imgIdToExerciseIds: {} };
  render() {
    const { updatingPictureId, showing, imgIdToExerciseIds } = this.state;
    const { pictures, exercises, parentThis } = this.props;
    if (!pictures) return null;
    let exCountByPictureId = {};
    exercises.forEach((ex) => {
      const picId = ex.pictureId;
      if (picId) {
        if (exCountByPictureId[picId]) exCountByPictureId[picId]++;
        else exCountByPictureId[picId] = 1;
      }
    });
    return (
      <React.Fragment>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => this.setState({ showing: !showing })}
        >
          {showing ? "Skjul " : "Vis "} billeder
        </button>
        {showing &&
          pictures.map((pic) => {
            return (
              <div className="row" key={pic.id}>
                <div className="col">
                  <img
                    onError={(e) => this.imgError(pic)}
                    style={{ width: "200px" }}
                    src={
                      process.env.PUBLIC_URL +
                      "/allpictures/" +
                      pic.id +
                      "." +
                      pic.fileType
                    }
                  />
                </div>
                <div className="col-6 d-flex align-items-center">
                  <span>{pic.name + " (id:" + pic.id + ", "}</span>
                  {exCountByPictureId[pic.id] ? (
                    <span>{exCountByPictureId[pic.id] + " øvelser)"}</span>
                  ) : (
                    <span>bruges ikke)</span>
                  )}
                </div>
                <div className="col">
                  {imgIdToExerciseIds[pic.id] !== undefined &&
                    imgIdToExerciseIds[pic.id].length > 0 && (
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={addPictureToExercise.bind(
                          parentThis,
                          imgIdToExerciseIds[pic.id][0],
                          null,
                          false
                        )}
                      >
                        Removefrom Exercise
                      </button>
                    )}
                </div>
                <div className="col d-flex align-items-center">
                  {updatingPictureId !== pic.id && (
                    <Typeahead
                      labelKey="title"
                      options={exercises.filter(
                        (ex) => ex.pictureId !== pic.id
                      )}
                      onChange={this.exerciseArrayChange.bind(this, pic.id)}
                      placeholder="Tilføj til øvelse"
                    />
                  )}
                </div>
              </div>
            );
          })}
      </React.Fragment>
    );
  }
}
