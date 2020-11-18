import logo from './logo.svg';
import React from 'react';
import ReactLoading from 'react-loading';
import * as canvas from 'canvas';
import * as faceapi from 'face-api.js';
import './App.css';

const App = (props) => {

  const [Canvas, setCanvas] = React.useState();
  const [Image, setImage] = React.useState();
  const [ImageData, setImageData] = React.useState();
  const [LabeledFaceDescriptors, setLabeledFaceDescriptors] = React.useState();
  const [ready, setReady] = React.useState(false);
  const [Done, setDone] = React.useState(true);
  const [DrawBox, setDrawBox] = React.useState();
  const [Width, setWidth] = React.useState(500);
  const [Height, setHeight] = React.useState(500);
  React.useEffect(async () => {
    setCanvas(canvas.Canvas);
    setImage(canvas.Image);
    setImageData(canvas.ImageData);

    //faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
    faceapi.env.monkeyPatch({
      Canvas: HTMLCanvasElement,
      Image: HTMLImageElement,
      ImageData: ImageData,
      Video: HTMLVideoElement,
      createCanvasElement: () => document.createElement('canvas'),
      createImageElement: () => document.createElement('img')
    });

    await faceapi.loadFaceRecognitionModel('/Models');
    await faceapi.loadSsdMobilenetv1Model('/Models');
    await faceapi.loadFaceLandmarkModel('/Models');
    await faceapi.loadFaceExpressionModel('/Models');

    //let faceData = await fetch(`/facedata/salope.json`).then(r => r.json());

    var descriptor;
    var labeledFaceDescriptors;
    let descuri = 'desc.json';
    fetch("desc.json")
      .then(response => response.json())
      .then(json => {
        descriptor = new Float32Array(Object.values(json))
        labeledFaceDescriptors = new faceapi.LabeledFaceDescriptors('Une Salope', [descriptor]);
        console.log(labeledFaceDescriptors);
        setLabeledFaceDescriptors([labeledFaceDescriptors]);
        setReady(true);
      });
  }, [])

  React.useEffect(() => {
    DrawBox && DrawBox.draw(canvas);
    setDone(true);
    console.log("test");
  }, [DrawBox])

  const loadImage = (event) => {
    if (!ready) {
      alert("Models and configuration not loaded yet, please wait a minute");
      return;
    }
    let canvas = document.querySelector("canvas");
    let ctx = canvas.getContext("2d");
    let file = event.target;
    // if (!props.file) {
    //   ctx.clearRect(0, 0, canvas.width, canvas.height);
    //   return;
    // }
    console.log(`file : ${file}`)
    let reader = new FileReader();
    reader.onload = function (event) {
      let img = document.createElement('img');
      img.onload = async function () {
        let imageRatio = img.width / img.height;
        canvas.height = 500;
        canvas.width = 500 * imageRatio;
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
        let input = img;
        let fullFaceDescriptions = await faceapi
          .detectAllFaces(input)
          .withFaceLandmarks()
          .withFaceDescriptors()
          .withFaceExpressions();
        let dim = new faceapi.Dimensions(canvas.width, canvas.height);
        fullFaceDescriptions = faceapi.resizeResults(fullFaceDescriptions, dim);
        console.log(`fullFaceDescriptions : ${fullFaceDescriptions}`);
        if (!props.recognition) faceapi.draw.drawDetections(canvas, fullFaceDescriptions);
        if (!props.recognition && props.showLandmarks) faceapi.draw.drawFaceLandmarks(canvas, fullFaceDescriptions);
        if(!props.recognition && props.showExpressions) faceapi.draw.drawFaceExpressions(canvas, fullFaceDescriptions);
        if (props.recognition) {
          const maxDescriptorDistance = 0.8;
          const faceMatcher = new faceapi.FaceMatcher(LabeledFaceDescriptors, maxDescriptorDistance);

          const results = fullFaceDescriptions.map(fd => faceMatcher.findBestMatch(fd.descriptor));
          results.forEach((bestMatch, i) => {
            const box = fullFaceDescriptions[i].detection.box;
            const text = bestMatch.toString();
            const drawBox = new faceapi.draw.DrawBox(box, { label: "pute" });
            setDrawBox(drawBox);
          });
        }
      }
      img.src = event.target.result;
    }
    if (file) {
      console.log(file)
      reader.readAsDataURL(file.files[0]);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Ajouter une photo pour tester votre pourcentage de salope :
        </p>
        {ready && 
          <input type="file" id="analyze" onChange={loadImage} />
        }
        {
          !ready && 
          <ReactLoading type={'bars'} height={'10%'} width={'20%'} />
        }
        <br/>
        <canvas width={Width} height={Height} id="canvas" />
      </header>
    </div>
  );
}

export default App;
