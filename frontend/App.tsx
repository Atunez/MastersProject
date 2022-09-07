import { Box, TextField, Button, Grid } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import axios from "axios";


const MathJaxConfig = {
    loader: { load: ["[tex]/html"] },
    tex: {
        inlineMath: [ ["$$$", "$$$"] ],
        displayMath: [ ["$$$$$$", "$$$$$$"]]
    }
}

function getProblemStatement(page: string){
    var realPage = new DOMParser().parseFromString(page, 'text/html');
    var bits = realPage.getElementsByClassName("problem-statement")[0];
    console.log(bits)
    return bits.textContent;
}

function getCodeForcesPage(problemID: string){
    const letter = problemID[problemID.length-1];
    const number = Number(problemID.substring(0, problemID.length-1));
    if(isNaN(number) || letter.toLowerCase() === letter.toUpperCase()){
        alert("Error");
        return;
    }
    let base = "http://localhost:8080/https://codeforces.com/problemset/problem/" + number + "/" + letter;

    return window.fetch(base, {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9",
          "sec-ch-ua": "\".Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"103\", \"Chromium\";v=\"103\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site"
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "omit"
      }).then(data => {return data.text()}).then(data => {return getProblemStatement(data)}).catch(err => {return err})
}

function playGround(inputPrograms: String){
    axios.post("http://localhost:9000/submissions/submitSolution", {
        pid: "1",
        inputProgram: inputPrograms
    }).then((res) => {console.log(res)});
}

function addTestCases(){
    axios.post("http://localhost:9000/testcases/addTestCase", {
        input: "Hello",
        output: "Hello",
        pid: "1",
        score: 1
    }).then((res) => {console.log(res)});
    axios.post("http://localhost:9000/testcases/addTestCase", {
        input: "World",
        output: "World",
        pid: "1",
        score: 2
    }).then((res) => {console.log(res)});

}

function App() {
    const [problemID, setProblemID] = useState("");
    const [displayData, setDisplayData] = useState();

    const handleButtonClick = () => {
        getCodeForcesPage(problemID)?.then(page => {setDisplayData(page)}).catch(err => {alert(err)});
    }

    const handleButtonClickFile = (e: ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files){
            return;
        }
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            const tosend = reader.result as String;
            const stuff = tosend.replace(/(\r\n|\n|\r|\t)/gm, '');
            console.log(stuff)
            playGround(stuff);
        }
        reader.onerror = () => {
            console.log("Couldn't read file...", reader.error);
        }
        alert("Handle file");
    }

    addTestCases();

    return (
    <div className="app">
        <Box>
            <MathJaxContext version={3} config={MathJaxConfig}>
                <MathJax>
                    {displayData}
                </MathJax>
            </MathJaxContext>
        </Box>
        <Box>
            <Grid container direction="row" justifyContent="center" alignItems="center" spacing={3}>
                <Grid item>            
                    <TextField id="outlined-basic" label="Problem ID" variant="outlined" value={problemID} onChange={e => {setProblemID(e.target.value)}}/>
                </Grid>
                <Grid item> 
                    <Button variant="contained" onClick={handleButtonClick} >Get Problem</Button> 
                </Grid>
                <Grid item> 
                    <Button variant="contained" onClick={handleButtonClick} >Clean Problem</Button>
                </Grid>
                <Grid item> 
                    <Button variant="contained" onClick={handleButtonClick} >Show Student's Perspective</Button>
                </Grid>
                <Grid item> 
                    <Button variant="contained" component="label"> Put in File... <input type="file" accept=".java" hidden multiple onChange={handleButtonClickFile} /> </Button>
                </Grid>
            </Grid>
        </Box>
    </div>
    );
}

export default App;