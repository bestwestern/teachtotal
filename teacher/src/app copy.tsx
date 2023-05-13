import { useState, useRef } from "preact/hooks";
import Cropper from "cropperjs";

import { Component } from "preact";
const targetFileSize = 1000000;
const maxFileSize = 800000000;
//https://img.ly/blog/how-to-compress-an-image-before-uploading-it-in-javascript/
export function App() {
  const [dragActive, setDragActive] = useState(false);
  const [exercises, setExercises] = useState(new Map());
  const inputRef = useRef(null);

  // handle drag events
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    console.log(files);
    let filesThatAreTooBig = [];
    for (const file of files) {
      if (file.size > maxFileSize) filesThatAreTooBig.push(file.name);
    }
    if (filesThatAreTooBig.length)
      return alert(
        "Følgende filer er for store " + filesThatAreTooBig.join(", ")
      );
    for (const file of files) {
      if (file.size > maxFileSize) filesThatAreTooBig.push(file.name);
    }
    let newMap = new Map(exercises);
    let index = 0;
    for (const file of files) {
      const dotIndex = file.name.lastIndexOf(".");
      newMap.set(new Date().getTime() + "_" + index, {
        orgFile: file,
        answer: file.name.substr(0, dotIndex),
      });
      index++;
    }
    setExercises(newMap);
  };
  // triggers when file is selected with click
  const handleChange = function (e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };
  const createClick = () => {
    exercises.forEach((value, key) => {
      // Chile country
      // 30 age
      // bobby hadz name
      const cvas = window["cropper" + key].getCroppedCanvas();
      console.log(cvas);
      console.log(cvas.toDataURL());
    });
  };
  console.log(Array.from(exercises.entries()));
  return (
    <div class="m-4">
      <p class="text-lg font-normal text-gray-500 lg:text-xl  dark:text-gray-400">
        Tilføj nyt emne. Angiv navn, upload billeder,tilpas størrelse og angiv
        svarene (default er filnavn)
      </p>

      <form
        id="form-file-upload"
        onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={inputRef}
          type="file"
          id="input-file-upload"
          multiple={true}
          onChange={handleChange}
        />
        <label
          id="label-file-upload"
          htmlFor="input-file-upload"
          className={dragActive ? "drag-active" : ""}
        >
          <div>
            <p>Drag and drop your file here or</p>
            <button className="upload-button" onClick={onButtonClick}>
              Upload a file
            </button>
          </div>
        </label>
        {dragActive && (
          <div
            id="drag-file-element"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          ></div>
        )}
      </form>

      {Array.from(exercises.keys()).length > 0 && (
        <button
          type="button"
          onClick={createClick}
          class="inline-flex items-center my-3 justify-center px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
        >
          Opret emne
        </button>
      )}
      <div class="grid grid-cols-2 gap-32">
        {Array.from(exercises.entries()).map(([key, value]) => {
          return <Exercise key={key} id={key} {...value}></Exercise>;
        })}
      </div>
    </div>
  );
}
function fileToDataUri(field) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      resolve(reader.result);
    });
    reader.readAsDataURL(field);
  });
}
class Exercise extends Component {
  constructor(props) {
    super();
    this.state = { time: Date.now() };
    console.log(props);
    console.log(props.orgFile.size);
  }
  counter = 0;
  async componentDidMount() {
    console.log("Mounted");
    const invPic = document.getElementById("imgInv" + this.props.id);
    invPic.addEventListener("load", () => {
      console.log("loaded");
      this.compressImage();
    });
    invPic.src = await fileToDataUri(this.props.orgFile);
  }
  compressImage() {
    const quality = 0.9;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const invPic = document.getElementById("imgInv" + this.props.id);
    const pic = document.getElementById("imgInv" + this.props.id);
    const originalWidth = invPic.width;
    const originalHeight = invPic.height;
    const maxDim = Math.max([originalWidth, originalHeight]);
    const factor = 300 / originalWidth;
    const canvasWidth = originalWidth * factor;
    const canvasHeight = originalHeight * factor;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    context.drawImage(
      invPic,
      0,
      0,
      originalWidth * factor,
      originalHeight * factor
    );

    // reducing the quality of the image
    canvas.toBlob(
      (blob) => {
        if (blob) {
          console.log(blob.size);
          if (blob.size > 100000 || !this.counter) {
            this.counter++;
            document.getElementById(this.props.id + "loading")?.remove();
            pic.src = URL.createObjectURL(blob);
          } else {
            window["cropper" + this.props.id] = new Cropper(pic, {
              aspectRatio: 1,
              autoCropArea: 1,
              crop(event) {
                console.log(event.detail.x);
                console.log(event.detail.y);
                console.log(event.detail.width);
                console.log(event.detail.height);
                console.log(event.detail.rotate);
                console.log(event.detail.scaleX);
                console.log(event.detail.scaleY);
              },
            });
          }
        }
      },
      "image/jpeg",
      quality
    );
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log({ c: this.props, cs: this.state, nextProps, nextState });
    return false;
  }
  // Lifecycle: Called whenever our component is created
  click = () => {
    this.setState({ time: Date.now() });
  };
  render(props, state) {
    const { id, answer } = props;
    return (
      <div class="mb-2">
        <div style={{ maxWidth: "300px" }}>
          <label
            for={id + "inp"}
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Svar
          </label>
          <input
            type="tetx"
            id={id + "inp"}
            value={answer}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="svar"
          />
        </div>
        <i id={id + "loading"}>Behandler billede</i>
        <img
          style={{ display: "block", maxWidth: "100%" }}
          id={"imgInv" + id}
        ></img>
      </div>
    );
  }
}
