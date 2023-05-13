import { useState, useRef } from "preact/hooks";
import Cropper from "cropperjs"; //indlæs som alm js fil - mangler der en png fil? (bg.png)

import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  import.meta.env.VITE_SUPABASEURL,
  import.meta.env.VITE_SUPABASEKEY
);
console.log(supabase);
import { Component } from "preact";
const targetFileSize = 1000000;
const maxFileSize = 800000000;
//https://img.ly/blog/how-to-compress-an-image-before-uploading-it-in-javascript/
//https://stackoverflow.com/questions/62209609/how-to-convert-any-image-to-webp
export function App() {
  const [dragActive, setDragActive] = useState(false);
  const [exercises, setExercises] = useState(new Map());
  const [subjectName, setSubjectName] = useState("");
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
    //vent med at vise opret knappen til alle er initialiseret
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
  const createClick = async () => {
    const { data, error } = await supabase
      .from("subjects")
      .insert([{ name: subjectName }])
      .select();
    if (error) return alert(JSON.stringify(error));
    const subjectId = data[0].id;

    console.log(subjectId, data, error);
    exercises.forEach((value, key) => {
      const cvas = window["cropper" + key].getCroppedCanvas();
      canvasToFile(cvas, key, (file) => {
        const answer = document.getElementById(key + "inp").value;
        console.log(file);
        supabase
          .from("exercises")
          .insert([{ answer, haspicture: true }])
          .select()
          .then((exerciseRes) => {
            console.log(exerciseRes);
            const id = exerciseRes.data[0].id;
            supabase.storage
              .from("images")
              .upload(id + ".webp", file)
              .then((fileRes) => console.log(fileRes)); // Cooper/ASDFASDFASDF uuid, taylorSwift.png -> taylorSwift.png
          });

        console.log(file, answer);
      });
    });
  };
  const canvasToFile = (cvas, key, callBack, quality = 1) => {
    let canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const originalWidth = cvas.width;
    const originalHeight = cvas.height;
    const factor = 300 / originalWidth;
    const canvasWidth = originalWidth * factor;
    const canvasHeight = originalHeight * factor;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    context.drawImage(
      cvas,
      0,
      0,
      originalWidth * factor,
      originalHeight * factor
    );
    console.log(canvas);
    //lav fkt med nedentstående i en while løkke
    canvas.toBlob(
      (blob) => {
        if (blob) {
          console.log(blob.size);
          document.getElementById("imgInv2" + key).src =
            URL.createObjectURL(blob);
          const myImage = new File([blob], "my-new-name.webp", {
            type: blob.type,
          });
          if (blob.size > 50000)
            canvasToFile(cvas, key, callBack, quality * 0.95);
          else callBack(myImage);
        }
      },
      "image/webp",
      quality
    );
  };
  return (
    <div class="m-4">
      <p class="text-lg font-normal text-gray-500 lg:text-xl  ">
        Tilføj nyt emne. Angiv navn, upload billeder,tilpas størrelse og angiv
        svarene (default er filnavn)
      </p>
      <div style={{ width: "444px" }} class="my-4">
        <label
          for="subject"
          class="block mb-2 text-sm font-medium text-gray-900 "
        >
          Emne
        </label>
        <input
          type="tetx"
          id="subject"
          value={subjectName}
          onInput={(e) => setSubjectName(e.target.value)}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
          placeholder="svar"
        />
      </div>

      {subjectName.length > 0 && (
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
              <p>Drag and drop filer her eller </p>
              <button
                className="upload-button underline"
                onClick={onButtonClick}
              >
                Upload
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
      )}
      {Array.from(exercises.keys()).length > -1 && subjectName.length > 0 && (
        <button
          type="button"
          onClick={createClick}
          class="inline-flex items-center my-3 justify-center px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 "
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
  }
  counter = 0;
  async componentDidMount() {
    const invPic = document.getElementById("imgInv" + this.props.id);
    invPic.addEventListener("load", () => {
      document.getElementById(this.props.id + "loading")?.remove();
      //this.compressImage();
      window["cropper" + this.props.id] = new Cropper(invPic, {
        aspectRatio: 1,
        autoCropArea: 1,
      });
    });
    invPic.src = await fileToDataUri(this.props.orgFile);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }
  // Lifecycle: Called whenever our component is created

  render(props, state) {
    const { id, answer } = props;
    return (
      <div class="mb-2">
        <div style={{ maxWidth: "300px" }}>
          <label
            for={id + "inp"}
            class="block mb-2 text-sm font-medium text-gray-900 "
          >
            Svar
          </label>
          <input
            type="tetx"
            id={id + "inp"}
            value={answer}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
            placeholder="svar"
          />
        </div>
        <i id={id + "loading"}>Behandler billede</i>
        <img
          style={{ display: "block", maxWidth: "100%" }}
          id={"imgInv" + id}
        ></img>
        <img id={"imgInv2" + id}></img>
      </div>
    );
  }
}
