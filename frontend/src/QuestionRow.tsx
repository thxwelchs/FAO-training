import React from "react"
import styled from 'styled-components'

interface QuestionRow {}

const rand: (start: number, end: number) => number = (start, end) => Math.floor((Math.random() * (end-start+1)) + start)
const randFO: (id: number) => string = (id) => {
    return ['+', '-', '*', '/'][--id]
}

const QuestionRow: React.FC<QuestionRow> = () => {
    return (<div>
        <div>{rand(1,99)}</div>
        <div>{randFO(rand(1,4))}</div>
        <div>{rand(1,99)}</div>
        <input type={'number'}></input>
    </div>)
}

export default QuestionRow
