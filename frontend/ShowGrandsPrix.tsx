import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from "@mui/material";
import axios from "axios";

function ShowGrandsPrix(){
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
      if(location.state === null || location.state.key === null){
        navigate(-1)
      }
    }, [])

    console.log(location.state.key)
    const [prixToRender, setPrixToRender] = useState(0)
    // Figure out which phase we are in...
    // 
    const numOfRows = location.state.key.members.length
    const numOfPrix = location.state.key.prix.length
    const problemSet = location.state.key.prix[prixToRender].problemList
    const numOfCols = problemSet.length

    const ProblemColumnSet = problemSet.map((e, i) => {return {field: `problem${i+1}`, headerName: "Problem " + (i+1), flex: 1}}).concat([{field: "total", headerName: "Final Score", flex: 1}]) 
    const dataTableCols = [{field: "name", headerName: "Name", flex: 2}].concat(ProblemColumnSet)
      
    const dataTableRows = location.state.key.members.map((person, idx) => {return {id: idx, name: person}})
    for(var j = 0; j < dataTableRows.length; j++){
      for(var i = 0; i < ProblemColumnSet.length; i++){
        dataTableRows[j][ProblemColumnSet[i].field] = 0
      }
    }
    // [{id: 1, name: "Test Case", problem1: 1, problem2: 2},
    //{id: 2, name: "Test Case", problem1: 2, problem2: 1, total: 3},
    //{id: 3, name: "Test Case", problem1: 2, problem2: 4, total: 6}]

    const [tableRows, setTableRows] = useState(dataTableRows)

    const findPeopleBefore = (problemData, sname) => {
      for(var i = 0; i < problemData.length; i++){
        if(problemData[i].name == sname){
          return i;
        }
      }
      return 0
    }

    const updateRowOfTable = (problemData, problemIndex) => {
      console.log(problemData)
      const newEntry = [...dataTableRows]
      for(var i = 0; i < newEntry.length; i++){
        var score = 0
        if(newEntry[i].name == "TestUser"){
          var user = problemData.grades.find(e => {return e.name == "nt1010"})
          if(user != null){
            score = user.grade
          }
          newEntry[i][`problem${problemIndex+1}`] = score - findPeopleBefore(problemData.grades, "nt1010")
        }else{
          var user = problemData.grades.find(e => {return e.name == "nt102"})
          if(user != null){
            score = user.grade
          }
          newEntry[i][`problem${problemIndex+1}`] = score - findPeopleBefore(problemData.grades, "nt102")
        }
        if(newEntry[i][`problem${problemIndex+1}`] < 0){
          newEntry[i][`problem${problemIndex+1}`] = 0
        }
        var total = 0
        for(var j = 0; j < Object.keys(newEntry[i]).length - 3; j++){
          total += newEntry[i][`problem${j+1}`]
        }
        newEntry[i]['total'] = total
      } 
      setTableRows(newEntry)
    }

    useEffect(() => {
    problemSet.map((id, i) => {
      axios.post('http://localhost:9000/classes/getAssignmentById', {
      classKey: location.state.key.classKey,
      pid: id
    }).then(e => updateRowOfTable(e.data.assignment[0], i)).catch(e => console.log(e))})
    }, [prixToRender])

    return (
        <div>
            {location.state.key.prix.map((e, i) => {
              return (
                <Button variant="contained" onClick={e => {setPrixToRender(i)}}>
                              Show Round {i+1}
                          </Button>)
          
            })}
            <br />
            Start...
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                columns={dataTableCols}
                rows={tableRows}
                initialState={{
                  sorting: { sortModel: [{field: "total", sort: "desc"}]}
                }}
                disableSelectionOnClick
              />
            </Box>
        </div>
    )
}

export default ShowGrandsPrix;