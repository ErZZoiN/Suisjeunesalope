// import logo from './logo.svg';
// import 'react';
// import * as canvas from 'canvas';
// import * as faceapi from 'face-api.js';
// import './App.css';

// const App = (props) => {

//   const [Canvas, setCanvas] = React.useState();
//   const [Image, setImage] = React.useState();
//   const [ImageData, setImageData] = React.useState();


//   React.useEffect(() => {
//     setCanvas(canvas.Canvas);
//     setImage(canvas.Image);
//     setImageData(canvas.ImageData);

//     faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

//     let faceData = await fetch(`/facedata/salope.json`).then(r => r.json());
//     await faceapi.loadFaceRecognitionModel('');

//     labeledFaceDescriptors = faceData.map(desc => {
//       let arr = desc.faceDescriptors.map(fd => {
//         return new Float32Array([...Object.values(fd)]); 
//       });
//       return new faceapi.LabeledFaceDescriptors(desc.label, arr);
//     });

//     console.log(labeledFaceDescriptors[0]);

//     ready = true;

//   }, [])

//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Testez une image :
//         </p>
//       </header>
//     </div>
//   );
// }

// export default App;
