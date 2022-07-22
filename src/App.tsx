import { Box, TextField, Button, Grid } from "@mui/material";
import { useState } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";

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


function App() {
    const [problemID, setProblemID] = useState("");
    const [displayData, setDisplayData] = useState();

    const handleButtonClick = () => {
        getCodeForcesPage(problemID)?.then(page => {setDisplayData(page)}).catch(err => {alert(err)});
    }

    return (
    <div className="App">
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
            </Grid>
        </Box>
    </div>
    );
}

export default App;
