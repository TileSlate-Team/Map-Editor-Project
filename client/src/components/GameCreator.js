import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../auth';

function GameCreator() {
    const { store } = useContext(GlobalStoreContext)
    const { auth } = useContext(AuthContext)

    const [game, setGame] = useState(store.getGameByKey(store.currentGame));
    const [questions, setQuestions] = useState(store.currentGame == null ? [] : game['questions']);
    const [categories, setCategories] = useState(6); //TODO: add more than 6 categories
    const [defaultPointVal, setDefaultPointVal] = useState(200);
    const [editorDisabled, setEditorDisabled] = useState(true);
    const [text, setText] = useState("");
    const [listItem, setListItem] = useState([[], [], [], [], [], [], []]);
    const [currentItem, setCurrentItem] = useState([0,0]);
    const [categoryNames, setCategoryNames] = useState(["", "cat1", "cat2", "cat3", "cat4", "cat5", "cat6"]);

    const [answerText, setAnswerText] = useState("");

    const [catEditorDisabled, setCatEditorDisabled] = useState(true);
    const [category, setCategory] = useState(0);
    const [catText, setCatText] = useState("");

    const [imageLink, setImageLink] = useState("");

    const [gameName, setGameName] = useState(store.getCurrentGame() == null ? "default" : game['title']);

    const navigate = useNavigate()

    function handleClick(list, item) {
        if(editorDisabled && catEditorDisabled) {
            setCurrentItem([list, item]);
            setText(listItem[list][item]['question']);
            setAnswerText(listItem[list][item]['answer']);
            setImageLink(listItem[list][item]['imgsrc'])
        }
        else {
            alert("please save before doing something else");
            return;
        }
        setEditorDisabled(!editorDisabled);
    }

    function handleChange(event) {
        setText(event.target.value);
    }

    function handleAnswerChange(event) {
        setAnswerText(event.target.value);
    }

    function handleImageChange(event) {
        setImageLink(event.target.value);
    }
    
    function handleSaveQuestion() {
        let newListItem = JSON.parse(JSON.stringify(listItem));
        newListItem[currentItem[0]][currentItem[1]] = {score:currentItem[0]*200, question:text, 
            answer:answerText, imgsrc:imageLink};
        setListItem(newListItem);
        setEditorDisabled(!editorDisabled);
    }

    function handleCatClick(cat) {
        if(catEditorDisabled && editorDisabled) {
            setCategory(cat);
            setText(categoryNames[cat])
        }
        else {
            alert("please save before doing something else");
            return;
        }

        setCatEditorDisabled(!catEditorDisabled);
    }

    function handleSaveCat() {
        let newCatNames = categoryNames;
        newCatNames[category] = text;
        setCategoryNames(newCatNames);
        setCatEditorDisabled(!catEditorDisabled);
    }

    //saves game to local storage
    function handleSaveGame() {
        let newListItem = listItem;
        newListItem[0] = categoryNames;
        //category names are save in newlistitem[0]
        let savedGame = {title: gameName, user:auth.user.username, questions:newListItem}
        store.saveGame(savedGame);
        navigate('/',{})
    }

    function handleChangeName(event) {
        setGameName(event.target.value);
    }

    useEffect(() => {

        if(store.currentGame != null) {
            for(let i=1; i<categories+1; i++){  
                for(let j=1; j<6; j++) {
                    listItem[i][j] = {score:defaultPointVal*j, question:questions[i][j]['question'], answer:questions[i][j]['answer'], imgsrc:questions[i][j]['imgsrc']};
                }
            }
            setCategoryNames(["",questions[0][1],questions[0][2],questions[0][3],questions[0][4],questions[0][5],questions[0][6]])
        }

        else {
        for(let i=1; i<categories+1; i++){  
            for(let j=1; j<6; j++) {
                listItem[i][j] = {score:defaultPointVal*j, question:"test question", answer:"test answer",
            imgsrc:""};
            }
        }
    }
    }, []);


    let catItems = [];
    
    for(let i=1; i<categories+1; i++){
        let innerArr = [];
        for(let j=1; j<6; j++) {

            //Individual list items
            innerArr[j] = 
            <Box key={"list-" + i + "-item-" + j}
            className = "question-boxes"
            border="3px solid gray"
            text-textAlign="center"
            onClick = {() => handleClick(i,j)}>
                {defaultPointVal*j + ""}
            </Box>;
        }

        catItems[i] = innerArr;
    }

    
    let catLists = [];

    for(let i=1; i<categories+1; i++) {
        //Lists
        catLists[i] = 
        <Box key = {"list-" + i} className="categories">

            <Box className="category-box" onClick={(() => handleCatClick(i))}>{categoryNames[i]}</Box>

            <Box className='question-box'>
                {catItems[i]}
            </Box>
        </Box>
    }

    let questionEditor = editorDisabled ? "" : 
    <Box paddingTop="2%">
        <TextField id="outlined-basic" label="Question" variant="outlined" value={text} onChange={handleChange}></TextField>
    </Box>

    let answerEditor = editorDisabled ? "" : 
    <Box paddingTop="2%">
        <TextField id="outlined-basic" label="Answer" variant="outlined" value={answerText} onChange={handleAnswerChange}></TextField>
    </Box>

    let imageEditor = editorDisabled ? "" : 
    <Box  className="horizontal-list-creator" paddingTop="2%">
        <TextField id="outlined-basic" label="Image" variant="outlined" value={imageLink} onChange={handleImageChange}></TextField>
        <Button variant="contained" color="primary" onClick={handleSaveQuestion}>Save Question</Button>
    </Box>

    let catEditor = catEditorDisabled ? "" : 
    <Box>
        <TextField id="outlined-basic" label="Category" variant="outlined" value={text} onChange={handleChange}></TextField>
        <Button variant="contained" color="primary" onClick={handleSaveCat}>Save Question</Button>
    </Box>

    const [games, setGames] = useState(store.getGames());
    

    return (
      <Box className="play">
        <Box paddingBottom="1%">if you leave this page before you click save, everything will reset</Box>
        <TextField id="outlined-basic" label="Gameshow Title" variant="outlined" value={gameName} onChange={handleChangeName}></TextField>
        <Box paddingBottom="1%">click on number/catergory to edit question/category, save to edit another question</Box>

        <Box className="horizontal-list">
            {catLists}
        </Box>

        <Box className="horizontal-list-creator">
            {questionEditor}
            {answerEditor}
            {imageEditor}
        </Box>

        <Box>
            {catEditor}
        </Box>

        <Box paddingTop="1%">
            <Button variant="contained" color="primary" onClick={handleSaveGame}>Save Game</Button>
        </Box>
      </Box>
    );
  }
  
  export default GameCreator;