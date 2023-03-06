/**
 * Library for simulating an error in a node.js application
 */


//container
const exampleDebugginProblem = {}

//init script
exampleDebugginProblem.init = () => {
    //this is an error created intentionally (bar is not defined)
    const foo = bar
}


//Export the module
module.exports = exampleDebugginProblem