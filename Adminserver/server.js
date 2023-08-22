//@ts-check
const express = require("express");
const copydir = require("copy-dir");
const webp = require("webp-converter");
const path = require("path");
const sharp = require("sharp");
const app = express();
const port = 3001;
const fetch = require("node-fetch");
const stringHash = require("string-hash");
const cors = require("cors");
const formidable = require("formidable");
const bodyParser = require("body-parser");
const ba64 = require("ba64");
var fs = require("fs");
const { Hash } = require("crypto");
const pupilProgrammeListFileName = "../child/src\\programmelist.ts";
const pupilplFileName = "../child/src\\pl.js";
const emneropgaveplFileName = "../../teach3emneropgaver/src\\pl.js";
const pupilImageDirectory = "../child/public/imgs/";
const teacherImageDirectory = "../parent/public/imgs/";
const pupilMp3Directory = "../child/public/mp3/";
const pupilMp4Directory = "../child/public/mp4/";
const programmeDictFileNameTeacher = "../parent/public/programmedict.json/";
// [pupilMp4Directory].forEach((dir) => {
//   if (!fs.existsSync(dir)) {
//     console.log(dir);
//     fs.mkdirSync(dir);
//   }
// });
//const  = "../pupil2/public/assets/mp3/";
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.json());
let exercises = [];
function copyExercisesWithLittleChange(pid) {
  fetch("http://localhost:3004/programmes/" + pid)
    .then((response2) => response2.json())
    .then((prog) => {
      console.log("her");
      console.log(prog.exercises);
      insertExercises(prog.exercises);
      // prog.exercises.forEach((eid) => {

      // });
    });
}
var insertedIds = [];
function insertExercises(array) {
  if (array.length) {
    console.log(array.length);
    const eid = array[0];
    console.log(eid);
    fetch("http://localhost:3004/exercises/" + eid)
      .then((response2) => response2.json())
      .then((exercise) => {
        console.log(exercise);
        const { pictureId, title, text, answer } = exercise;
        fetch("http://localhost:3004/exercises", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            text,
            answer: "",
            answerTag: "",
            exerciseTag: "",
            pictureId,
          }),
        })
          .then((response2) => response2.json())
          .then((rJson) => {
            console.log({ rJson });
            insertedIds.push(rJson.id);
            setTimeout(() => {
              insertExercises(array.splice(1));
            }, 1000);
          });
      });
  } else {
    console.log(insertedIds);
    console.log(insertedIds.splice(95));
  }
}
//c();
// "exercises": [
//   526, 527, 528, 529, 530, 531, 532, 533, 534, 535, 536, 537, 538, 539,
//   540, 541, 542, 543, 544, 545, 546, 547, 548, 549, 550, 551, 552, 553,
//   554, 555, 556, 557, 558, 559, 560, 561, 562, 563, 564, 565, 566, 567,
//   568, 569, 570, 571, 572, 573, 574, 575, 576, 577, 578, 579, 580, 581,
//   582, 583, 584, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595,
//   596, 597, 598, 599, 600, 601, 602, 603, 604, 605, 606, 607, 608, 609,
//   610, 611, 612, 613, 614, 615, 616, 617, 618, 619, 620, 621, 622, 623,
//   624, 625, 626, 627, 628, 629, 630, 631, 632, 633, 634, 635, 636, 637,
//   638, 639, 640, 641
// ],
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3006");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});
function convertAllPictures() {
  const dir = "../adminfront/public/allpictures/";
  sharp("../adminfront/public/allpictures/1.jpeg")
    .resize(64, 64)
    .toFile("sols.avif");
  sharp("../adminfront/public/allpictures/1.jpeg").toFile("solss.avif");
  // sharp("../adminfront/public/allpictures/1.jpeg").toFile("sols.webp");
  // sharp("../adminfront/public/allpictures/1.jpeg").toFile("sols.jpeg");
  fs.readdir(dir, function (err, files) {
    if (err) {
      console.error("Could not list the directory.", err);
      process.exit(1);
    }

    files.forEach(function (file, index) {
      if (file.substr(-4) !== "webp") {
        console.log(file);
        const dotIndex = file.lastIndexOf(".");
        const webpName = file.substring(0, dotIndex) + ".webp";
        sharp(dir + file)
          .resize(384, 384)
          .toFile(dir + webpName);
      }
    });
  });
}
app.get("/convertpictures", function (req, res) {
  console.log("ffs");
  convertAllPictures();
});
app.get("/copytopupil", function (req, res) {
  console.log("x");

  const programmeIds = req.query.ids;
  console.log(programmeIds);
  const programmeArray = JSON.parse(programmeIds);
  console.log(programmeArray.length);
  const directoriesToEmpty = [
    pupilMp3Directory,
    pupilMp4Directory,
    pupilImageDirectory,
    teacherImageDirectory,
    // "../Pensum/assets/assets/pictures/",
    // "../Pensum/assets/assets/mp3/",
  ];

  directoriesToEmpty.forEach((directoryToEmpty) => {
    if (fs.existsSync(directoryToEmpty)) {
      fs.readdir(directoryToEmpty, (err, files) => {
        if (err) throw err;

        for (const file of files) {
          fs.unlink(path.join(directoryToEmpty, file), (err) => {
            if (err) throw err;
          });
        }
      });
    }
  });
  fetch("http://localhost:3004/programmes")
    .then((response2) => response2.json())
    .then((allProgrammes) => {
      {
        // let activeProgrammes = allProgrammes.filter(
        //   (prog) => !prog.archived && programmeArray.indexOf(prog.id) > -1
        // );
        let activeProgrammes = [];

        programmeArray.forEach((id) => {
          const foundProg = allProgrammes.find((prog) => prog.id == id);
          if (foundProg) activeProgrammes.push(foundProg);
        });
        let pictureIdsInUseToFileType = {};
        let mp3sInUse = {};
        let mp4sInUse = {};
        let exerciseIdsInUse = [];
        activeProgrammes.forEach((prog) => {
          pictureIdsInUseToFileType[prog.pictureId] = 1;
          exerciseIdsInUse = [...exerciseIdsInUse, ...prog.exercises];
        });
        fetch("http://localhost:3004/exercises")
          .then((response2) => response2.json())
          .then((allExercises) => {
            let exerciseDict = {};
            const activeExercises = allExercises.filter(
              (ex) => exerciseIdsInUse.indexOf(ex.id) > -1
            );
            activeExercises.forEach((ex) => {
              exerciseDict[ex.id.toString()] = ex;
              if (ex.videoId) mp4sInUse[ex.videoId] = 1;
              if (ex.pictureId) pictureIdsInUseToFileType[ex.pictureId] = 1;
              if (ex.audioFilename) mp3sInUse[ex.audioFilename] = 1;
            });
            let activeProgrammesForTeacher = {};
            //activeProgrammes.slice();
            activeProgrammes.forEach((prog) => {
              activeProgrammesForTeacher[prog.id] = prog;
              let progExerciseDict = {};
              prog.exercises.forEach(
                (id) => (progExerciseDict[id] = exerciseDict[id])
              );
              activeProgrammesForTeacher[prog.id].exerciseDict =
                progExerciseDict;
            });
            Object.keys(mp4sInUse).forEach((mp4Id) => {
              fs.copyFile(
                "../adminfront/public/mp4/" + mp4Id + ".mp4",

                pupilMp4Directory + mp4Id + ".mp4",
                (err) => {
                  if (err) throw err;
                }
              );
            });
            const json = JSON.stringify(activeProgrammesForTeacher);
            var programmeHash = stringHash(json);
            // var appFile = fs.readFileSync("../nt/src/App.js", "utf-8");
            // const fileNameIndex = appFile.indexOf("progFileName");
            // const colonIndex = appFile.indexOf(";", fileNameIndex);
            // const stringToReplace = appFile.substring(
            //   fileNameIndex,
            //   colonIndex
            // );
            // const newAppFile = appFile.replace(
            //   stringToReplace,
            //   "progFileName='programmelist" + programmeHash + ".json'"
            // );

            // fs.writeFileSync("../nt/src/App.js", newAppFile, "utf-8");
            fs.writeFile(
              programmeDictFileNameTeacher,
              '{ "programmeDict" :' + json + "}",
              function (err) {
                if (err) return console.log(err);
              }
            );
            activeProgrammes.forEach((prog) => {
              const programmeExercisesDetails = prog.exercises.map(
                (id) => exerciseDict[id.toString()]
              );
              prog.exercises = programmeExercisesDetails;
            });
            let programmesForPupil = JSON.parse(
              JSON.stringify(activeProgrammes)
            );
            console.log(programmesForPupil);
            programmesForPupil.forEach((prog) => {
              const programmeExercisesDetails = prog.exercises.map((ex) => {
                const {
                  title,
                  text,
                  answer,
                  id,
                  pictureId,
                  audioFilename,
                  videoId,
                  wrongAnswers,
                } = ex;
                let returnObj = { title, text, answer, id, pictureId };
                if (audioFilename) returnObj.audioFilename = audioFilename;
                if (videoId) returnObj.videoId = videoId;
                if (wrongAnswers) returnObj.wrongAnswers = wrongAnswers;
                return returnObj;
              });
              prog.exercises = programmeExercisesDetails;
              prog.exerciseDict = {};
            });
            fs.writeFile(
              pupilplFileName,
              "export var pl =" + JSON.stringify(programmesForPupil),
              function (err) {
                if (err) return console.log(err);
              }
            );
            // fs.writeFile(
            //   emneropgaveplFileName,
            //   "export var pl =" +
            //     JSON.stringify(programmesForPupil.sort((a, b) => b.id - a.id)),
            //   function (err) {
            //     if (err) return console.log(err);
            //   }
            // );

            const programmesWithoutExercises = programmesForPupil.map(
              (prog) => {
                const {
                  id,
                  pictureId,
                  title,
                  usePictureAsAnswer,
                  audioQuestion,
                  url,
                } = prog;
                return {
                  id,
                  pictureId,
                  title,
                  usePictureAsAnswer,
                  audioQuestion,
                  url,
                };
              }
            );
            fs.writeFile(
              pupilProgrammeListFileName,
              "export const dataProgrammes: Array<any> =" +
                JSON.stringify(programmesWithoutExercises),
              function (err) {
                if (err) return console.log(err);
              }
            );
            // fs.writeFile(
            //   "../Pensum/src\\programmeList.js",
            //   "export const programmeList =" + JSON.stringify(activeProgrammes),
            //   function (err) {
            //     if (err) return console.log(err);
            //   }
            // );
            fs.writeFile(
              "../Teacher/src\\programmeList.js",
              "export const programmeList =" + JSON.stringify(activeProgrammes),
              function (err) {
                if (err) return console.log(err);
              }
            );

            fetch("http://localhost:3004/pictures")
              .then((response2) => response2.json())
              .then((allPictures) => {
                allPictures.forEach((picture) => {
                  if (pictureIdsInUseToFileType[picture.id])
                    pictureIdsInUseToFileType[picture.id] = picture.fileType;
                });
                // convertFiles(
                //   Object.keys(pictureIdsInUseToFileType),
                //   pictureIdsInUseToFileType
                // );
                let ms = 50;
                Object.keys(pictureIdsInUseToFileType).forEach((pictureId) => {
                  if (!pictureId) {
                    return;
                    console.log("FFFFFFFFFFFFFFFFFFFFFFFSSSSSSSSSSSSSSSSS");
                  }
                  const fileName =
                    "../adminfront/public/allpictures/" +
                    pictureId +
                    "." +
                    pictureIdsInUseToFileType[pictureId];

                  // fs.copyFile(
                  //   fileName,
                  //   pupilImageDirectory + pictureId + ".jpeg",
                  //   (err) => {
                  //     if (err) throw err;
                  //   }
                  // );
                  fs.copyFile(
                    "../adminfront/public/allpictures/" + pictureId + ".webp",
                    pupilImageDirectory + pictureId + ".webp",
                    (err) => {
                      if (err) throw err;
                    }
                  );
                  fs.copyFile(
                    fileName,
                    teacherImageDirectory + pictureId + ".jpeg",
                    (err) => {
                      if (err) throw err;
                    }
                  );
                  // fs.copyFile(
                  //   fileName,
                  //   "../Pensum/assets/assets/pictures/" + pictureId + ".jpeg",
                  //   (err) => {
                  //     if (err) throw err;
                  //   }
                  // );
                  // setTimeout(() => {
                  //   const result = webp.cwebp(
                  //     fileName,
                  //     "../Pupil/assets/assets/pictures/" + pictureId + ".webp",
                  //     "-q 80"
                  //   );
                  //   result.then((response) => {
                  //     console.log({ response, ms });
                  //   });
                  // }, ms);
                  ms += 50;
                });
                copydir.sync("../adminfront/public/mp3", pupilMp3Directory, {
                  utimes: true, // keep add time and modify time
                  mode: true, // keep file mode
                  cover: true, // cover file when exists, default is true
                });
                // copydir.sync(
                //   "../adminfront/public/mp3",
                //   "../Pensum/assets/assets/mp3",
                //   {
                //     utimes: true, // keep add time and modify time
                //     mode: true, // keep file mode
                //     cover: true, // cover file when exists, default is true
                //   }
                // );
              });
          });

        // console.log("le " + exerciseIdsInUse.length);
      }
    });
});
const convertFiles = (pictureIds, pictureIdsInUseToFileType) => {
  const pictureId = pictureIds[0];
  const fileName =
    "../adminfront/public/allpictures/" +
    pictureId +
    "." +
    pictureIdsInUseToFileType[pictureId];
  const result = webp.cwebp(
    fileName,
    "../Pupil/assets/assets/pictures/" + pictureId + ".webp",
    "-q 80"
  );
  result.then((response) => {
    if (pictureIds.length > 1)
      convertFiles(pictureIds.splice(1), pictureIdsInUseToFileType);
  });
};
app.get("/copy", function (req, res) {
  const programmeId = req.query.id;
  const directoriesToEmpty = ["../stud/src/pictures/", "../stud/settings/"];
  directoriesToEmpty.forEach((directoryToEmpty) =>
    fs.readdir(directoryToEmpty, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(directoryToEmpty, file), (err) => {
          if (err) throw err;
        });
      }
    })
  );
  fetch("http://localhost:3004/pictures")
    .then((response) => response.json())
    .then((pictJson) => {
      let pictDic = {};
      pictJson.forEach((pic) => {
        pictDic[pic.id] = pic;
      });
      fetch("http://localhost:3004/exercises")
        .then((response) => response.json())
        .then((js) => {
          let exDict = {};
          js.forEach((ex) => {
            exDict[ex.id] = ex;
          });
          fetch("http://localhost:3004/programmes/" + programmeId)
            .then((response2) => response2.json())
            .then((programme) => {
              let pictureIds = [];
              let pictureFileNames = [];
              exercises = programme.exercises.map((peid) => {
                const ex = exDict[peid];
                const pid = ex.pictureId;
                if (pid && pictureIds.indexOf(pid) === -1) {
                  pictureIds.push(pid);
                  var fileName = pid + "." + pictDic[pid].fileType;
                  pictureFileNames.push(fileName);
                }
                return {
                  title: ex.title,
                  answer: ex.answer,
                  answerTag: ex.answerTag,
                  exerciseTag: ex.exerciseTag,
                  fileName: fileName,
                  id: ex.id,
                };
              });
              const firstPictures = pictureFileNames.slice(0, 2) || [];
              copydir.sync(
                "../stud/build/" +
                  programme.folder +
                  "/pwafiles/copyfolder/icons",
                "../stud/staticdistfiles/images/icons",
                {
                  utimes: true, // keep add time and modify time
                  mode: true, // keep file mode
                  cover: true, // cover file when exists, default is true
                }
              );
              fs.copyFile(
                "../stud/build/" +
                  programme.folder +
                  "/pwafiles/copyfolder/manifest.json",
                "../stud/staticdistfiles/manifest.json",
                (err) => {
                  if (err) throw err;
                }
              );
              copydir.sync(
                "../adminfront/public/sharedpictures",
                "../stud/src/pictures/",
                {
                  utimes: true, // keep add time and modify time
                  mode: true, // keep file mode
                  cover: true, // cover file when exists, default is true
                }
              );

              if (pictureFileNames.length) copyPictures(pictureFileNames);
              const programmeData = (({
                title,
                audioQuestion,
                exerciseTitleInHeader,
                description,
                url,
              }) => ({
                title,
                audioQuestion,
                exerciseTitleInHeader,
                description,
                url,
              }))(programme);
              let json =
                "export const exercises = " + JSON.stringify(exercises);
              json +=
                ";export const programmeData = " +
                JSON.stringify(programmeData);
              json +=
                ";export const firstPictures = " +
                JSON.stringify(firstPictures);
              fs.writeFile("../stud/src/data.js", json, "utf8", (e) =>
                console.log("wrote data")
              );
              fs.writeFile(
                "../stud/settings/" + programme.folder + ".folder",
                "no importante",
                "utf8",
                (e) => console.log(e)
              );
              // json = JSON.stringify({ version: 2, name: programmeData.url });

              // fs.writeFile(
              //   "../stud/staticdistfiles/now.json",
              //   json,
              //   "utf8",
              //   e => console.log(e)
              // );
            });
        });
    });
});

copyPictures = (fileNamesArray) => {
  const fileName = fileNamesArray.pop();
  fs.copyFile(
    "../adminfront/public/allpictures/" + fileName,
    "../stud/src/pictures/" + fileName,
    (err) => {
      if (err) throw err;
      if (fileNamesArray.length) copyPictures(fileNamesArray);
    }
  );
};
app.route("/upload").post(function (req, res) {
  console.log("upload");
  const body = req.body;
  const { dataURL, name } = body;
  try {
    ba64.writeImageSync("../adminfront/public/allpictures/" + name, dataURL);
  } catch (error) {
    console.log(error);
  }
});
// app.route("/uploadFile").post(function(req, res) {
//   var form = new formidable.IncomingForm();
//   form.parse(req, function(err, fields, files) {
//     console.log(fields);
//     console.log(files);
//   });
// });
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
