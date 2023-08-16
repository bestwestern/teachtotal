import ReactDOM from "react-dom";
import React, { PureComponent } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  var dataURL = canvas.toDataURL("image/png");
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

class PictureCropAdd extends PureComponent {
  state = {
    src: null,
    crop: {
      unit: "%",
      width: 100,
      aspect: 1 / 1,
    },
  };

  onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      let fna = e.target.files[0].name;
      this.setState({ fileName: fna.substr(0, fna.indexOf(".")) });
      reader.addEventListener("load", () => {
        this.setState({ src: reader.result });
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // If you setState the crop in here you should return false.

  onImageLoaded = (image) => {
    this.imageRef = image;
  };

  onCropComplete = (crop) => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:

    // this.setState({ crop: percentCrop });
    var image = this.imageRef;
    const canvas = document.createElement("canvas");
    let scaleX = image.naturalWidth / image.width;
    let scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
    var dataURL = canvas.toDataURL("image/jpeg", 1.0);
    this.dlURL = dataURL;
    // downloadImage(dataURL, "my-canvas.jpeg");
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    let scaleX = image.naturalWidth / image.width;
    let scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, "image/jpeg");
    });
  }

  paste = (pasteEvent) => {
    var self = this;
    var items = pasteEvent.clipboardData.items;
    for (var i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") > -1) {
        var URLObj = window.URL || window.webkitURL;
        self.setState({
          src: URLObj.createObjectURL(items[i].getAsFile()),
        });
      }
    }
  };

  render() {
    const { crop, croppedImageUrl, src } = this.state;
    return (
      <div className="App">
        <div>
          <input
            style={{ height: "200px" }}
            onPaste={this.paste}
            type="text"
            autoFocus
            placeholder="copy from clipboard here"
          ></input>

          <input type="file" accept="image/*" onChange={this.onSelectFile} />
        </div>

        {src && (
          <ReactCrop
            src={src}
            crop={crop}
            ruleOfThirds
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
          />
        )}

        {croppedImageUrl && (
          <div>
            <img
              alt="Crop"
              id="abc"
              style={{ width: "320px", border: "5px solid" }}
              src={croppedImageUrl}
            />

            <button
              onClick={(e) =>
                this.props.upload(
                  this.dlURL,
                  this.state.fileName
                  // "data:image/png;base64," +
                  //   getBase64Image(document.getElementById("abc"))
                )
              }
            >
              Tilføj
            </button>
          </div>
        )}
      </div>
    );
  }
}
export { PictureCropAdd };
function downloadImage(data, filename = "untitled.jpeg") {
  var a = document.createElement("a");
  a.href = data;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
}
