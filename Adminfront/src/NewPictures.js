import React from "react";
import { savePicture } from "./utils";
export class NewPictures extends React.Component {
  saveAll = () => {
    const { imgData, parentThis } = this.props;
    const index = imgData.length - 1;
    const img = imgData[index];
    const { dataURL, name } = img;
    savePicture.call(parentThis, dataURL, name, index, null);
    if (index) setTimeout(this.saveAll, 300);
  };
  render() {
    const { imgData, processFile, nameChange, parentThis } = this.props;
    return (
      <div>
        {imgData.length && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.saveAll}
          >
            Gem alle
          </button>
        )}
        {imgData.map((img, index) => {
          const { dataURL, qualityIncrement, name } = img;
          return (
            dataURL && (
              <div key={index} style={{ border: "1px solid" }}>
                <p>{name + " " + dataURL.length}</p>
                <input
                  type="text"
                  value={name}
                  onChange={nameChange.bind(null, index)}
                />
                <p>
                  {qualityIncrement > 1 && (
                    <button
                      type="button"
                      className="btn btn-info"
                      onClick={processFile.bind(
                        null,
                        qualityIncrement - 1,
                        index
                      )}
                    >
                      -
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={savePicture.bind(
                      parentThis,
                      dataURL,
                      name,
                      index,
                      null
                    )}
                  >
                    {qualityIncrement}
                  </button>
                  <button
                    type="button"
                    className="btn btn-info"
                    onClick={processFile.bind(
                      null,
                      qualityIncrement + 1,
                      index
                    )}
                  >
                    +
                  </button>
                </p>
                <img src={dataURL} />
              </div>
            )
          );
        })}
      </div>
    );
  }
}
