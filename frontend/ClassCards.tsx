// Given if the current person is a student or teacher
// Generate the correct list of class cards for the main screen
import { useCookies } from "react-cookie";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Box, Card, CardActionArea, CardContent, Grid, Typography } from "@mui/material";

function GetClassCards(classObj, redirectMethod){
    console.log(classObj)

    classObj = classObj.filter(e => e != null);

    const cardClicked = (classObj) => {
        console.log("Card Clicked")
        console.log(classObj)
        redirectMethod(classObj)
    }

    return (
        <div className="ClassCards">
            <Box>
                <Grid container spacing={3}>
                    {classObj.map(cls => {return (<Grid item xs={12} display="flex" justifyContent="center"> 
                        <Card sx={{ maxWidth: 600 }}> 
                            <CardActionArea onClick={e => cardClicked(cls)}>
                                <CardContent>
                                    <Typography>
                                        {cls.className}
                                        <br />
                                        {cls.classKey} 
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>

                    </Grid>)})}
                </Grid>
            </Box>
        </div>
    )
}

export default GetClassCards;