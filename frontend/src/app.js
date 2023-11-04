import './app.css';
import FileUpload from './components/fileupload';
import Footer from "./components/Footer"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <FileUpload />
        </header>
      <Footer/>
     
    </div>
  );
}

export default App;
