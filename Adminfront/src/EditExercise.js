import React from "react";
export class EditExercise extends React.Component {
  onKeyDown = (e) => {
    if (e.keyCode === 13) this.props.saveExercise();
  };
  render() {
    return (
      <React.Fragment>
        <h2>Øvelse</h2>
        <div className="row exercise">
          <div className="col">
            <input
              onKeyDown={this.onKeyDown}
              type="text"
              className="form-control title"
              placeholder="Titel"
            />
          </div>
          <div className="col">
            <input
              onKeyDown={this.onKeyDown}
              type="text"
              className="form-control text"
              placeholder="Tekst"
            />
          </div>
          <div className="col">
            <input
              onKeyDown={this.onKeyDown}
              type="text"
              className="form-control answer"
              placeholder="Svar"
            />
          </div>
          <div className="col">
            <input
              onKeyDown={this.onKeyDown}
              type="text"
              className="form-control answerTag"
              placeholder="Svartag"
            />
          </div>
          <div className="col">
            <input
              onKeyDown={this.onKeyDown}
              type="text"
              className="form-control exerciseTag"
              placeholder="Øvelsestype"
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
