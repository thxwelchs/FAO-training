import React from 'react'
import './App.css'
import QuestionRow from "./QuestionRow";

interface AppProps {}

const App: React.FC<AppProps> = () => {
    return (<div>
        <QuestionRow/>
        <QuestionRow/>
        <QuestionRow/>
        <QuestionRow/>
        <QuestionRow/>
    </div>)
}

export default App
