import React from "react";
import ReactTooltip from "react-tooltip";
import { savePicture, addPictureToExercise, propChangeExercise } from "./utils";
import { PictureCropAdd } from "./PictureCropAdd";

export class Exercises extends React.Component {
  state = {
    showing: false,
    deletingId: null,
    updatedValues: {},
    sortDesc: true,
    sortProp: "text",
    addingCropToPictureId: -1,
    filterOnProgramme: -1,
    useFileName: true,
  };
  pictureCropAdded = (exercise, dataURL, fileName) => {
    const { parentThis } = this.props;
    this.setState({ addingCropToPictureId: -1 });
    console.log({ exercise, fileName });
    savePicture.call(
      parentThis,
      dataURL,
      exercise.title,
      null,
      exercise.id,
      this.state.useFileName && fileName
    );
  };
  updatingExerciseIds = {};
  paste = (exercise, event) => {
    const { parentThis } = this.props;
    // use event.originalEvent.clipboard for newer chrome versions
    var items = (event.clipboardData || event.originalEvent.clipboardData)
      .items;
    // find pasted image among pasted items
    var blob = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") === 0) {
        blob = items[i].getAsFile();
      }
    }
    if (blob !== null) {
      var reader = new FileReader();
      reader.onload = function (loadEvent) {
        const dataURL = loadEvent.target.result;
        savePicture.call(
          parentThis,
          dataURL,
          exercise.title,
          null,
          exercise.id
        );
      };
      reader.readAsDataURL(blob);
    }
  };
  propChange = (prop, value, exercise) => {
    const exerciseId = exercise.id;
    this.setState((prevState) => {
      let newVal = { ...prevState.updatedValues };
      if (!newVal[exerciseId]) newVal[exerciseId] = { ...exercise };
      newVal[exerciseId][prop] = value;
      return { updatedValues: newVal };
    });
    if (this.updatingExerciseIds[exerciseId])
      clearTimeout(this.updatingExerciseIds[exerciseId]);
    this.updatingExerciseIds[exerciseId] = setTimeout(() => {
      propChangeExercise.call(this.props.parentThis, prop, value, exerciseId);
    }, 1000);
  };
  delClick = (id) => {
    this.setState({ deletingId: id });
  };
  editableProps = [
    "text",
    "answer",
    "answerTag",
    "exerciseTag",
    "audioFilename",
  ];
  render() {
    const {
      deletingId,
      showing,
      updatedValues,
      sortProp,
      sortDesc,
      addingCropToPictureId,
      useFileName,
      filterOnProgramme,
    } = this.state;
    const { exercises, exClick, exToPr, parentThis } = this.props;
    const { pictDic, programmes } = parentThis.state;
    console.log(parentThis);
    return (
      <React.Fragment>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => this.setState({ showing: !showing })}
        >
          {showing ? "Skjul " : "Vis "} øvelser
        </button>
        {showing && (
          <React.Fragment>
            <h2>Øvelser</h2>
            <div
              className="btn-group"
              role="group"
              aria-label="Basic outlined example"
            >
              <div className="input-group-text" id="btnGroupAddon">
                Vis kun øvelser fra program
              </div>
              <button
                type="button"
                onClick={() =>
                  this.setState({
                    filterOnProgramme: filterOnProgramme === -1 ? 0 : -1,
                  })
                }
                className={
                  filterOnProgramme === -1
                    ? "btn btn-primary"
                    : "btn btn-outline-primary"
                }
              >
                Uden tilknytning
              </button>
              {programmes.map(({ id, title }) => {
                const sel = filterOnProgramme === id;
                return (
                  <button
                    id={id}
                    type="button"
                    onClick={() =>
                      this.setState({
                        filterOnProgramme: sel ? 0 : id,
                      })
                    }
                    className={
                      sel ? "btn btn-primary" : "btn btn-outline-primary"
                    }
                  >
                    {title}
                  </button>
                );
              })}
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">action</th>
                  <th scope="col">Prs</th>
                  <th scope="col">Id</th>
                  {["title", ...this.editableProps].map((prop) => (
                    <th
                      key={prop}
                      onClick={() =>
                        this.setState({ sortProp: prop, sortDesc: !sortDesc })
                      }
                    >
                      {prop}
                    </th>
                  ))}
                  <th scope="col">Billede</th>
                </tr>
              </thead>
              <tbody>
                {exercises
                  .filter((ex) => {
                    if (!filterOnProgramme) return true;
                    if (filterOnProgramme === -1) {
                      return !programmes.find((prog) =>
                        prog.exercises.includes(ex.id)
                      );
                    }
                    return programmes
                      .find((prog) => prog.id === filterOnProgramme)
                      .exercises.includes(ex.id);
                  })
                  .sort((a, b) => {
                    return a.id - b.id;
                    const txta =
                      a[sortProp] == null ? "ååå" : a[sortProp].toLowerCase();
                    const txtb =
                      b[sortProp] == null ? "ååå" : b[sortProp].toLowerCase();
                    const val = txta.localeCompare(txtb);
                    return sortDesc ? val : -val;
                  })
                  .map((exercise) => {
                    const ex = updatedValues[exercise.id] || exercise;
                    const { audioFilename, title } = ex;
                    const audioSource = audioFilename
                      ? "mp3/" + audioFilename + ".mp3"
                      : null;
                    const pict = ex.pictureId && pictDic[ex.pictureId];
                    const srcString = ex.title.split(" ").join("+");
                    const audioUrl =
                      "http://shtooka.net/search.php?str=" +
                      srcString +
                      "&lang=eng";
                    const googleURL =
                      "https://www.google.com/search?q=" +
                      srcString +
                      "+cartoon&tbm=isch&source=lnt&tbs=sur:fc&sa=X&ved=0ahUKEwiZv725-rbiAhVJUBUIHVvWBE4QpwUIHw&biw=1500&bih=836&dpr=2";
                    return (
                      <React.Fragment key={ex.id}>
                        <tr>
                          <th scope="row">
                            <button
                              type="button"
                              onClick={exClick.bind(null, "edit", ex.id)}
                              className="btn btn-outline"
                            >
                              <i className="fa fa-pencil" />
                            </button>
                            {exToPr[ex.id].length === 0 &&
                              (deletingId === ex.id ? (
                                <button
                                  type="button"
                                  onClick={exClick.bind(null, "del", ex.id)}
                                  className="btn btn-outline"
                                >
                                  Slet
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    this.delClick(ex.id);
                                  }}
                                  className="btn btn-outline"
                                >
                                  <i className="fa fa-trash-o" />
                                </button>
                              ))}
                          </th>
                          <td>{exToPr[ex.id].join(", ")}</td>
                          <td>{ex.id}</td>
                          <td>
                            <a target="_blank" href={googleURL}>
                              {ex.title}
                            </a>
                            <a target="_blank" href={audioUrl}>
                              Lyd
                            </a>
                            {audioSource && (
                              <audio
                                id={ex.id}
                                controls
                                src={audioSource}
                              ></audio>
                            )}
                          </td>
                          {this.editableProps.map((prop) => (
                            <td key={prop}>
                              <input
                                type="text"
                                value={ex[prop]}
                                onChange={(e) =>
                                  this.propChange(prop, e.target.value, ex)
                                }
                              />
                            </td>
                          ))}
                          <td>
                            {ex.pictureId ? (
                              <div>
                                <u
                                  data-tip={
                                    '<img style="width:200px" src="/allpictures/' +
                                    pict.id +
                                    "." +
                                    pict.fileType +
                                    '" title="Title of image" alt="alt text here"/>'
                                  }
                                  data-html={true}
                                >
                                  {ex.pictureId}
                                </u>
                                <ReactTooltip html={true} />
                                {ex.pictureId && (
                                  <button
                                    style={{ marginLeft: "10px" }}
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={addPictureToExercise.bind(
                                      parentThis,
                                      ex.id,
                                      null,
                                      false
                                    )}
                                  >
                                    Slet
                                  </button>
                                )}
                              </div>
                            ) : (
                              <input
                                type="text"
                                placeholder="brug næste knap..."
                              />
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-outline-primary"
                              onClick={(e) =>
                                this.setState({ addingCropToPictureId: ex.id })
                              }
                            >
                              Add pic
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="8">
                            {addingCropToPictureId === ex.id && (
                              <PictureCropAdd
                                upload={this.pictureCropAdded.bind(
                                  this,
                                  exercise
                                )}
                              />
                            )}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
              </tbody>
            </table>
            <div className="row">
              <div className="col">
                <div className="form-check">
                  <input
                    onChange={(e) =>
                      this.setState({ useFileName: !useFileName })
                    }
                    checked={useFileName}
                    className="form-check-input"
                    id="FileNameCB"
                    type="checkbox"
                  />
                  <label className="form-check-label" htmlFor="FileNameCB">
                    Brug filnavn til titel og svar ved upload af billede
                  </label>
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}
