export function getData(resetEditProgrammeId) {
  fetch("http://localhost:3004/exercises")
    .then((response) => response.json())
    .then((js) => {
      let exDict = {};
      let exToPr = {};
      console.log(js);
      js.forEach((ex) => {
        exToPr[ex.id] = [];
        exDict[ex.id] = ex;
      });
      fetch("http://localhost:3004/programmes")
        .then((response2) => response2.json())
        .then((js2) => {
          {
            js2.forEach((p) =>
              p.exercises.forEach((peid) => exToPr[peid].push(p.id))
            );
            this.setState((prevState) => {
              return {
                programmes: js2,
                editingExerciseId: null,
                editingProgrammeId: resetEditProgrammeId
                  ? null
                  : prevState.editingProgrammeId,
                exercises: js,
                exDict,
                exToPr,
              };
            });
          }
        });
    });
  fetch("http://localhost:3004/pictures")
    .then((response) => response.json())
    .then((js) => {
      let pictDic = {};
      js.forEach((pic) => {
        pictDic[pic.id] = pic;
      });
      this.setState({ pictures: js, pictDic });
    });
  fetch("http://localhost:3004/sites")
    .then((response) => response.json())
    .then((js) => {
      this.setState({ sites: js });
    });
}
export function uploadFiles(fileArray) {
  const file = fileArray.pop();
  var formData = new FormData();
  formData.append("files", file);
  formData.append("name", "some value user types");
  formData.append("description", "some value user types");

  fetch("http://localhost:3001/uploadFile", {
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
    body: formData,
  }).then((response) => {
    if (fileArray.length) this.uploadFiles(fileArray);
  });
}
export function copyToPupil(programmeIdsString) {
  setTimeout(() => {
    var myHeaders = new Headers();
    myHeaders.append("pragma", "no-cache");
    myHeaders.append("cache-control", "no-cache");
    var myRequest = new Request(
      "http://localhost:3001/copytopupil?ids=" + programmeIdsString
    );
    fetch(myRequest, myHeaders)
      .then((response) => response.json())
      .then((js) => {
        console.log(js);
      });
  }, 300);
}
export function convertPictures() {
  var myHeaders = new Headers();
  myHeaders.append("pragma", "no-cache");
  myHeaders.append("cache-control", "no-cache");
  var myRequest = new Request("http://localhost:3001/convertpictures");
  fetch(myRequest, myHeaders);
}
export function copyToStudent(programmeId) {
  var myHeaders = new Headers();
  myHeaders.append("pragma", "no-cache");
  myHeaders.append("cache-control", "no-cache");

  var myInit = {
    method: "GET",
    headers: myHeaders,
  };
  var myRequest = new Request("http://localhost:3001/copy?id=" + programmeId);
  fetch(myRequest, myHeaders)
    .then((response) => response.json())
    .then((js) => {
      console.log(js);
    });
}
export var exTemplate = {
  title: null,
  text: null,
  answer: null,
  answerTag: null,
  exerciseTag: null,
};
export var prTemplate = {
  title: null,
  description: null,
  pictureId: null,
  url: null,
};
export function propChangeExercise(prop, value, exerciseId) {
  fetch("http://localhost:3004/exercises/" + exerciseId)
    .then((response) => response.json())
    .then((ex) => {
      ex[prop] = value;
      fetch("http://localhost:3004/exercises/" + exerciseId, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ex),
      })
        .then((response) => response.json())
        .then((js) => {
          getData.call(this);
        });
    });
}
export function addPictureToExercise(exerciseId, pictureId, fileName) {
  console.log({ exerciseId, pictureId, fileName });
  fetch("http://localhost:3004/exercises/" + exerciseId)
    .then((response) => response.json())
    .then((ex) => {
      ex.pictureId = pictureId;
      if (fileName) {
        ex.answer = fileName;
        ex.title = fileName;
        ex.text = fileName;
      }
      fetch("http://localhost:3004/exercises/" + exerciseId, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ex),
      })
        .then((response) => response.json())
        .then((js) => {
          getData.call(this);
        });
    });
}
function saveExerciseData(params) {
  const { editingExerciseId, exercises, editingProgrammeExerciseArray } =
    this.state;
  const doubleexists =
    !editingExerciseId && exercises.find((ex) => ex.title === params.title);
  // if (doubleexists) return alert("en øvelse med den tekst findes");
  if (editingExerciseId) params.id = editingExerciseId;
  const urlEnd = editingExerciseId ? "/" + editingExerciseId : "";
  fetch("http://localhost:3004/exercises" + urlEnd, {
    method: editingExerciseId ? "PUT" : "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })
    .then((response) => response.json())
    .then((js) => {
      this.setState({
        editingProgrammeExerciseArray: editingProgrammeExerciseArray.concat([
          js.id,
        ]),
      });
      getData.call(this);
    });
}
export function saveExercise() {
  let params = { ...exTemplate };
  for (var prop in params) {
    let domEl = document
      .getElementsByClassName("exercise")[0]
      .getElementsByClassName(prop)[0];
    params[prop] = domEl.value;
    domEl.value = "";
  }
  if (this.state.editingExerciseId)
    params.pictureId =
      this.state.exDict[this.state.editingExerciseId].pictureId;
  saveExerciseData.call(this, params);
}
export function savePicture(
  dataURL,
  name,
  index,
  attachToExerciseId,
  fileName
) {
  console.log({ fileName });
  const now = new Date().getTime();
  const params = {
    saveDate: now,
    name,
    fileType: attachToExerciseId ? "jpeg" : "jpeg",
  };
  console.log({ params });
  fetch("http://localhost:3004/pictures", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })
    .then((response) => response.json())
    .then((json) => {
      fetch("http://localhost:3001/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dataURL, name: json.id }),
      });
      this.setState((prevState) => {
        return {
          imgData: prevState.imgData.filter((img, iindex) => iindex !== index),
        };
      });
      if (this.state.editingProgrammeId) {
        let params = { ...exTemplate };
        params.answer = name;
        params.title = name;
        params.pictureId = json.id;
        saveExerciseData.call(this, params);
      } else {
        if (attachToExerciseId) {
          addPictureToExercise.call(
            this,
            attachToExerciseId,
            json.id,
            fileName
          );
        } else getData.call(this);
      }
    });
}
export function saveProgramme() {
  const { editingProgrammeId, editingProgrammeExerciseArray } = this.state;
  let params = { ...prTemplate };
  for (var prop in params) {
    let domEl = document
      .getElementsByClassName("programme")[0]
      .getElementsByClassName(prop)[0];
    params[prop] = domEl.value;
    domEl.value = "";
    this.setState({ editingProgrammeExerciseArray: [] });
  }
  var cb = document.getElementById("audioQuestionCB");
  params.audioQuestion = cb.checked;
  cb.checked = false;
  cb = document.getElementById("usePictureAsAnswerCB");
  params.usePictureAsAnswer = cb.checked;
  cb.checked = false;
  cb = document.getElementById("exerciseTitleInHeaderCB");
  params.exerciseTitleInHeader = cb.checked;
  cb.checked = false;
  params.exercises = editingProgrammeExerciseArray;
  if (editingProgrammeId) params.id = editingProgrammeId;
  const urlEnd = editingProgrammeId ? "/" + editingProgrammeId : "";
  fetch("http://localhost:3004/programmes" + urlEnd, {
    method: editingProgrammeId ? "PUT" : "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  }).then(getData.bind(this, true));
}
export function delExercise(id) {
  fetch("http://localhost:3004/exercises/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(getData.bind(this));
}
export function delProgramme(id) {
  fetch("http://localhost:3004/programmes/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(getData.bind(this));
}
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}
