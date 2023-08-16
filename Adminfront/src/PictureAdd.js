import React from "react";
import classNames from "classnames";
import Dropzone from "react-dropzone";
import { NewPictures } from "./NewPictures";

import { uploadFiles } from "./utils";
export class PictureAdd extends React.Component {
  state = {
    showing: false,
  };
  gifUpload = (event) => {
    let files = [];
    for (var i = 0; i < event.target.files.length; i++)
      files.push(event.target.files[i]);
    uploadFiles(files);
  };

  onDrop = (acceptedFiles, rejectedFiles) => {
    this.file = acceptedFiles[0];
    this.files = acceptedFiles;
    for (let i = 0; i < this.files.length; i++) {
      setTimeout(this.processFile.bind(this, 0, i), 100 * i);
    }
  };
  file = null;
  processFile = (wantedQualityIncrement, index) => {
    var reader = new FileReader();
    var canvas = document.createElement("CANVAS");
    const name = this.files[index].name.split(".").slice(0, -1).join(".");
    reader.onload = (event) => {
      var img = new Image();
      img.onload = () => {
        let qualityIncrement = 1;
        var ctx = canvas.getContext("2d");
        const maxWidth = 1000;
        let width = img.width;
        while (
          width > maxWidth &&
          (!wantedQualityIncrement ||
            wantedQualityIncrement !== qualityIncrement)
        ) {
          width = width / 2;
          qualityIncrement++;
        }
        const scaleFactor = width / img.width;
        canvas.width = width;
        canvas.height = img.height * scaleFactor;
        ctx.drawImage(img, 0, 0, width, img.height * scaleFactor);
        let qualityFactor = 1;
        let dataURL = ctx.canvas.toDataURL("image/jpeg", qualityFactor);
        while (
          dataURL.length > 200000 &&
          (!wantedQualityIncrement ||
            wantedQualityIncrement !== qualityIncrement)
        ) {
          qualityIncrement++;
          qualityFactor = qualityFactor * 0.95;
          dataURL = ctx.canvas.toDataURL("image/jpeg", qualityFactor);
        }
        this.props.parentThis.setState((prevState) => {
          let { imgData } = prevState;
          imgData[index] = { qualityIncrement, dataURL, name };
          return { imgData };
        });
      };
      img.src = event.target.result;
    };
    //reader.readAsDataURL(this.file);
    reader.readAsDataURL(this.files[index]);
  };
  nameChange = (index, e) => {
    const name = e.target.value;
    this.props.parentThis.setState((prevState) => {
      prevState.imgData[index].name = name;
      return prevState;
    });
  };

  render() {
    const { showing } = this.state;
    const { parentThis } = this.props;
    const { imgData } = parentThis.state;
    return (
      <React.Fragment>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => this.setState({ showing: !showing })}
        >
          {showing ? "Skjul " : "Vis "} tilføj billeder
        </button>
        {showing && (
          <React.Fragment>
            <i>Brug udklipsholderen ved at redigere øvelser</i>
            <Dropzone onDrop={this.onDrop}>
              {({ getRootProps, getInputProps, isDragActive }) => {
                return (
                  <div
                    style={{ border: "1px solid", height: "300px" }}
                    {...getRootProps()}
                    className={classNames("dropzone", {
                      "dropzone--isActive": isDragActive,
                    })}
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p>Drop files here...</p>
                    ) : (
                      <p>Upload billede</p>
                    )}
                  </div>
                );
              }}
            </Dropzone>
            <NewPictures
              imgData={imgData}
              nameChange={this.nameChange.bind(this)}
              processFile={this.processFile.bind(this)}
              parentThis={parentThis}
            />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}
